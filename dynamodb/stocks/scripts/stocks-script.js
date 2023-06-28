import { stocks } from '../data/stocks';

const { exec } = require('child_process');
const listProducts = 'aws dynamodb scan --table-name products';
const createStocks = `aws dynamodb put-item --table-name stocks --item ${JSON.stringify(
	stocks
)}`;

exec(createStocks, (error, stdout, stderr) => {
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
