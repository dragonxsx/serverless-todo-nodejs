const AWS = require("aws-sdk");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.getTodo = async (event, context) => {
    const params = {
        TableName: TODO_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    };

    try {
        const data = await dynamoDbClient.get(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        return response;
    } catch (error) {
        throw new Error(error);
    }
}