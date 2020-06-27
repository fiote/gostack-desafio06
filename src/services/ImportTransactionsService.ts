import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import configUpload from '../configs/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TDO {
	filename: string
}

class ImportTransactionsService {
	async execute({ filename }: TDO) {
		const csvPath = path.join(configUpload.directory,filename);
		const content = await fs.promises.readFile(csvPath,'utf8');
		const lines = content.split("\n").filter(line => line);

		lines.shift();

		const transactions = [];
		const service = new CreateTransactionService();

		for (const line of lines) {
			const [title, type, value, category] = line.split(',').map(part => part.trim());
			const transaction = await service.execute({title, value:Number(value), type, category});
			transactions.push(transaction);
		}

		return transactions;
	}
}

export default ImportTransactionsService;
