import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TDO {
	title: string,
	value: number,
	type: string,
	category: string
}

class CreateTransactionService {
	public async execute({ title, value, type, category }: TDO): Promise<Transaction> {
  		const repoTransaction = getCustomRepository(TransactionsRepository);
		const balance = await repoTransaction.getBalance();
		value = Number(value);

		if (type == 'outcome' && value > balance.total) throw new AppError('You dont have that much money.',400);

		const repoCategory = getRepository(Category);
		let entryCategory = await repoCategory.findOne({title: category});

		if (!entryCategory) {
			entryCategory = repoCategory.create({title: category});
			await repoCategory.save(entryCategory);
		}

		const entryTransaction = repoTransaction.create({title, value, type, category_id: entryCategory.id});
		await repoTransaction.save(entryTransaction);

		return entryTransaction;
	}
}

export default CreateTransactionService;

