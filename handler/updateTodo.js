const AWS = require('aws-sdk');

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.updateTodo = async (event, context) => {
    const datetime = new Date().getTime();
    const data = JSON.parse(event.body);
    
    if(typeof data.todo !== "string"
        || typeof data.checked !== "boolean") {
        throw new Error("Value of todo or checked is invalid");
    }
    
    const params = {
        TableName: TODO_TABLE,
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeNames: {
            '#todo_text': 'todo'
        },
        ExpressionAttributeValues: {
            ":todo": data.todo,
            ":checked": data.checked,
            ":updatedAt": datetime
        },
        UpdateExpression:
            "SET #todo_text = :todo, checked = :checked, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
    }

    try {
        const data = await dynamoDbClient.update(params).promise();
        
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Attributes)
        };

        return response;
        
    } catch (error) {
        throw new Error(error);
    }
}