import 'dotenv/config';
import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { connect, connection, Schema, model, models } from 'mongoose';

type Stage = 'agreement' | 'earnest_money' | 'title_deed' | 'completed';

type Transaction = {
  id: string;
  property: string;
  stage: Stage;
  totalFee: number;
  listingAgent: string;
  sellingAgent: string;
  financialBreakdown?: {
    agencyAmount: number;
    listingAgentAmount: number;
    sellingAgentAmount: number;
    reason: string;
  } | null;
};

const mongoUri = process.env.MONGO_URI as string;

export const calculateBreakdown = (transaction: Transaction) => {
  const agencyAmount = transaction.totalFee * 0.5;
  const agentPool = transaction.totalFee * 0.5;

  if (transaction.listingAgent === transaction.sellingAgent) {
    return {
      agencyAmount,
      listingAgentAmount: agentPool,
      sellingAgentAmount: 0,
      reason:
        'The listing and selling agent are the same person, so the same agent receives the full agent portion.',
    };
  }

  return {
    agencyAmount,
    listingAgentAmount: agentPool / 2,
    sellingAgentAmount: agentPool / 2,
    reason:
      'Listing and selling agents are different, so the agent portion is split equally.',
  };
};

export const getNextStage = (currentStage: Stage): Stage => {
  const stages: Stage[] = [
    'agreement',
    'earnest_money',
    'title_deed',
    'completed',
  ];

  const currentIndex = stages.indexOf(currentStage);

  if (currentIndex === -1) {
    throw new Error('Invalid stage');
  }

  if (currentIndex === stages.length - 1) {
    return currentStage;
  }

  return stages[currentIndex + 1];
};


const initialTransactions: Transaction[] = [
  {
    id: 'trx-001',
    property: 'Sunset Villa',
    stage: 'title_deed',
    totalFee: 12000,
    listingAgent: 'Emma Carter',
    sellingAgent: 'Daniel Brooks',
    financialBreakdown: null,
  },
  {
    id: 'trx-002',
    property: 'Downtown Loft',
    stage: 'earnest_money',
    totalFee: 8000,
    listingAgent: 'Sophia Reed',
    sellingAgent: 'Sophia Reed',
    financialBreakdown: null,
  },
  {
    id: 'trx-003',
    property: 'Green Residence 14B',
    stage: 'completed',
    totalFee: 15000,
    listingAgent: 'Maya Collins',
    sellingAgent: 'Noah Bennett',
    financialBreakdown: {
      agencyAmount: 7500,
      listingAgentAmount: 3750,
      sellingAgentAmount: 3750,
      reason:
        'Listing and selling agents are different, so the agent portion is split equally.',
    },
  },
];

const transactionSchema = new Schema(
  {
    id: String,
    property: String,
    stage: String,
    totalFee: Number,
    listingAgent: String,
    sellingAgent: String,
    financialBreakdown: Object,
  },
  { timestamps: true },
);

const TransactionModel =
  models.Transaction || model('Transaction', transactionSchema);




@Controller('api')
export class AppController {
  private readonly stages: Stage[] = [
    'agreement',
    'earnest_money',
    'title_deed',
    'completed',
  ];

  private dbReady = this.connectDatabase();

  private async connectDatabase() {
    if (connection.readyState === 0) {
      await connect(mongoUri);
    }

    const count = await TransactionModel.countDocuments();

    if (count === 0) {
      await TransactionModel.insertMany(initialTransactions);
    }
  }

  private async getTransactions(): Promise<Transaction[]> {
    await this.dbReady;
    return TransactionModel.find().lean() as Promise<Transaction[]>;
  }

  @Get('summary')
  async getDashboard() {
    const transactions = await this.getTransactions();

    const completedTransactions = transactions.filter(
      (item) => item.stage === 'completed',
    );

    const agencyRevenue = completedTransactions.reduce((sum, item) => {
      return sum + (item.financialBreakdown?.agencyAmount || 0);
    }, 0);

    const agentPayouts = completedTransactions.reduce((sum, item) => {
      return (
        sum +
        (item.financialBreakdown?.listingAgentAmount || 0) +
        (item.financialBreakdown?.sellingAgentAmount || 0)
      );
    }, 0);

    return {
      summary: {
        activeTransactions: transactions.filter(
          (item) => item.stage !== 'completed',
        ).length,
        completedThisMonth: completedTransactions.length,
        agencyRevenue,
        agentPayouts,
      },
      recentTransactions: transactions,
      commissionBreakdown: {
        completedTransaction: {
          agencyShare: 50,
          listingAgentShare: 25,
          sellingAgentShare: 25,
        },
        singleAgentScenario: {
          agencyShare: 50,
          sameAgentShare: 50,
        },
      },
    };
  }

  @Patch('transactions/:id/next-stage')
  async goToNextStage(@Param('id') id: string) {
    await this.dbReady;

    const transaction = await TransactionModel.findOne({ id });

    if (!transaction) {
      return { message: 'Transaction not found' };
    }

    const currentIndex = this.stages.indexOf(transaction.stage as Stage);

    if (currentIndex === -1) {
      return { message: 'Invalid stage' };
    }

    if (currentIndex < this.stages.length - 1) {
      transaction.stage = this.stages[currentIndex + 1];
    }

    if (transaction.stage === 'completed') {
      transaction.financialBreakdown = calculateBreakdown(
        transaction.toObject(),
      );
    }

    await transaction.save();

    return transaction;
  }

  @Post('reset')
  async resetData() {
    await this.dbReady;

    await TransactionModel.deleteMany({});
    await TransactionModel.insertMany(initialTransactions);

    return this.getDashboard();
  }
}