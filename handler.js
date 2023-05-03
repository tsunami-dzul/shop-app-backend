'use strict';

export const getProductsList = async (event) => {
	return {
		statusCode: 200,
		body: [
			{
				productName: 'Book',
				price: 1,
			},
			{
				productName: 'Magazine',
				price: 2,
			},
		],
	};
};

export const getProductsById = async (event) => {
	return {
		statusCode: 200,
		body: {
			productName: 'Book',
			price: 0,
		},
	};
};
