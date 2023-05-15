import { products } from '../data/products';

const { exec } = require('child_process');
const listProducts = 'aws dynamodb scan --table-name products';
const createProducts = `aws dynamodb put-item --table-name products --item ${JSON.stringify(
	products
)}`;

exec(createProducts, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}

	console.log(`stdout: ${stdout}`);
});

exec(listProducts, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}

	console.log(`stdout: ${stdout}`);
});
