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
		const params = {
			Message: `A new product has been created. ${addProductResult}`,
			TopicArn: 'arn:aws:sns:us-west-1:334657772509:createProductTopic',
		};

		const publishText = new AWS.SNS({ apiVersion: '2010-03-31' })
			.publish(params)
			.promise();

		console.log(publishText);
	}
};
