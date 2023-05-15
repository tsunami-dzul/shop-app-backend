'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const listProductsScan = async () => {
	const products = await dynamo
		.scan({
			TableName: process.env.PRODUCTS_TABLE_NAME,
		})
		.promise();

	return products;
};

const listStocksScan = async () => {
	const stocks = await dynamo
		.scan({
			TableName: process.env.STOCKS_TABLE_NAME,
		})
		.promise();

	return stocks;
};

const productQuery = async (id) => {
	const queryProductsResults = await dynamo
		.query({
			TableName: process.env.PRODUCTS_TABLE_NAME,
			KeyConditionExpression: 'id = :id',
			ExpressionAttributeValues: { ':id': id },
		})
		.promise();

	return queryProductsResults;
};

module.exports.getProductsList = async (event) => {
	const productsScan = await listProductsScan();
	const stocksScan = await listStocksScan();

	const products = productsScan.Items.map((product) => {
		const stock = stocksScan.Items.find(
			(stock) => product.id === stock.product_id
		);

		return {
			id: product.id,
			title: product.title,
			description: product.description,
			price: product.price,
			count: stock.count,
		};
	});

	return {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		body: JSON.stringify(products),
	};
};

module.exports.getProductsById = async (event) => {
	const { productId } = event.pathParameters;
	const productsScan = await productQuery(productId);
	const stocksScan = await listStocksScan();

	const products = productsScan.Items.map((product) => {
		const stock = stocksScan.Items.find(
			(stock) => product.id === stock.product_id
		);

		return {
			id: product.id,
			title: product.title,
			description: product.description,
			price: product.price,
			count: stock.count,
		};
	});

	return {
		statusCode: 200,
		body: JSON.stringify(products),
	};
};
