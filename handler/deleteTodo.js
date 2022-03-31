const AWS = require('aws-sdk');

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.deleteTodo = async (event, context) => {
    const params = {
        TableName: TODO_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    };

    try {
        const data = await dynamoDbClient.delete(params).promise();
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Deleteion successful!",
                data
            })
        };

        return response;

    } catch (error) {
        throw new Error(error);
    }
}