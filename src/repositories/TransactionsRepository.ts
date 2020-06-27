import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
	income: number;
	outcome: number;
	total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

	public sumType(list: Transaction[], type: string) {
		return list
			.filter(entry => entry.type == type)
			.map(entry => entry.value)
			.reduce((total, value) => total + Number(value),0);
	}

	public async getBalance(): Promise<Balance> {
		const list = await this.find();
		const balance = {} as Balance;
		balance.income = this.sumType(list, 'income');
		balance.outcome = this.sumType(list, 'outcome');
		balance.total = balance.income - balance.outcome;
		return balance;
	}
}

export default TransactionsRepository;
