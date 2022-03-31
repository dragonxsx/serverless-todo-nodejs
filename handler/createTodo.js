const AWS = require("aws-sdk");
const uuid = require("uuid");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

exports.createTodo = async (event, context) => {
    const timestamp = new Date().getTime();
    const reqBody = JSON.parse(event.body);
    if (typeof reqBody.todo !== "string") {
        throw new Error("Validation failed");
    }

    const itemId = uuid.v1()
    const params = {
        TableName: TODO_TABLE,
        Item: {
            id: itemId,
            todo: reqBody.todo,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    try {
        await dynamoDbClient.put(params).promise();
        
        const data = await dynamoDbClient.get({
            TableName: TODO_TABLE,
            Key: { id: itemId },
            ConsistentRead: true
        }).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        return response;
    } catch (error) {
        throw new Error(error);
    }
}