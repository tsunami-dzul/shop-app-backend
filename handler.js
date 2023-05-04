'use strict';

module.exports.getProductsList = async (event) => {
	return {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		body: JSON.stringify([
			{
				id: 1,
				product: 'Book',
			},
			{
				id: 2,
				product: 'Magazine',
			},
		]),
	};
};

module.exports.getProductsById = async (event) => {
	const { productId } = event.pathParameters;

	return {
		statusCode: 200,
		body: JSON.stringify({
			id: productId,
			productName: 'Book',
			price: 0,
		}),
	};
};
