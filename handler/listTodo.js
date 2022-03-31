const AWS = require("aws-sdk");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.listTodo = async (event, context) => {
    const params = {
        TableName: TODO_TABLE
    };

    try {
        const data = await dynamoDbClient.scan(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };

        return response;
    } catch (error) {
        throw new Error(error);
    }
}