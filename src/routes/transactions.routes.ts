import { getRepository, getCustomRepository } from 'typeorm';
import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import multer from 'multer'
import configUpload from '../configs/upload';

const transactionsRouter = Router();
const upload = multer(configUpload);

transactionsRouter.get('/', async (request, response) => {
  	const repo = getCustomRepository(TransactionsRepository);
	const transactions = await repo.find({relations:['category']});
	transactions.forEach(t => delete t.category_id);
	const balance = await repo.getBalance();
	return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
	const { title, value, type, category } = request.body;
	const service = new CreateTransactionService();
	const entry = await service.execute({title, value, type, category});
	return response.json(entry);
});

transactionsRouter.delete('/:id', async (request, response) => {
	const { id } = request.params;
	const service = new DeleteTransactionService();
	await service.execute({id});
	return response.send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
	const service = new ImportTransactionsService();
	const transactions = await service.execute({filename: request.file.filename});
	response.json({ transactions });
});

export default transactionsRouter;
