'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const addProduct = async (item) => {
	const addProductResult = await dynamo
		.put({
			TableName: process.env.PRODUCTS_TABLE_NAME,
			Item: item,
		})
		.promise();

	return addProductResult;
};

module.exports.catalogBatchProcess = async (event) => {
	for (const message of event.Records) {
		const product = JSON.parse(message.body);

		const addProductResult = await addProduct(product);

		console.log(addProductResult);
	}
};
