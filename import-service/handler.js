'use strict';

const AWS = require('aws-sdk');
const { SQSClient, SendMessageCommand } = require('aws-sdk/client-sqs');
const BUCKET = 'products-catalog-csv-file';

module.exports.importProductsFile = async (event) => {
	const { name } = event.queryParameters;
	const s3 = new AWS.S3({ region: 'us-west-1' });
	const catalogPath = `uploaded/${name}.csv`;
	const params = {
		Bucket: BUCKET,
		Key: catalogPath,
		Expires: 60,
		ContentType: 'text/csv',
	};

	const signedUrl = await s3.getSignedUrl('putObject', params);

	return signedUrl;
};

module.exports.importFileParser = async (event) => {
	const sqsClient = new SQSClient();
	const s3 = new AWS.S3({ region: 'us-west-1' });
	const params = {};
	const body = [];

	for (const record of event.Records) {
		params = {
			Bucket: 'products-catalog-csv-file',
			Key: record.s3.object.key,
		};
	}

	const s3Stream = s3.getObject(params).createReadStream();

	s3Stream
		.on('data', (chunk) => {
			body.push(chunk);
		})
		.on('error', (error) => {
			console.log(error);
		})
		.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const records = parsedBody.split('\n');

			for (let record of records) {
				const product = record.split(',');
				const p = {
					id: product[0].id,
					title: product[1].title,
					description: product[2].description,
					price: product[3].price,
				};

				sqsClient.send(
					new SendMessageCommand({
						QueueUrl:
							'https://sqs.us-west-1.amazonaws.com/334657772509/product-service-dev-catalogItemsQueue',
						MessageBody: p,
					})
				);
			}
		});
};
