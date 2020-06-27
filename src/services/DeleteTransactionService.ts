import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface TDO {
	id: string
}

class DeleteTransactionService {
	public async execute({ id } : TDO): Promise<void> {
		const repo = getRepository(Transaction);
		const entry = await repo.findOne(id);
		if (!entry) throw new AppError("Transaction not found.", 401);
		await repo.remove(entry);
	}
}

export default DeleteTransactionService;
