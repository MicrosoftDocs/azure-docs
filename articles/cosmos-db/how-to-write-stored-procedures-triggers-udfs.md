---
title: Write stored procedures, triggers, and UDFs in Azure Cosmos DB
description: Learn how to define stored procedures, triggers, and user-defined functions in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/07/2020
ms.author: tisande
---

# How to write stored procedures, triggers, and user-defined functions in Azure Cosmos DB

Azure Cosmos DB provides language-integrated, transactional execution of JavaScript that lets you write **stored procedures**, **triggers**, and **user-defined functions (UDFs)**. When using the SQL API in Azure Cosmos DB, you can define the stored procedures, triggers, and UDFs in JavaScript language. You can write your logic in JavaScript and execute it inside the database engine. You can create and execute triggers, stored procedures, and UDFs by using [Azure portal](https://portal.azure.com/), the [JavaScript language integrated query API in Azure Cosmos DB](javascript-query-api.md) and the [Cosmos DB SQL API client SDKs](sql-api-dotnet-samples.md). 

To call a stored procedure, trigger, and user-defined function, you need to register it. For more information, see [How to work with stored procedures, triggers, user-defined functions in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md).

> [!NOTE]
> For partitioned containers, when executing a stored procedure, a partition key value must be provided in the request options. Stored procedures are always scoped to a partition key. Items that have a different partition key value will not be visible to the stored procedure. This also applied to triggers as well.
> [!Tip]
> Cosmos supports deploying containers with stored procedures, triggers and user-defined functions. For more information see [Create an Azure Cosmos DB container with server-side functionality.](manage-sql-with-resource-manager.md#create-sproc)

## <a id="stored-procedures"></a>How to write stored procedures

Stored procedures are written using JavaScript, they can create, update, read, query, and delete items inside an Azure Cosmos container. Stored procedures are registered per collection, and can operate on any document or an attachment present in that collection.

Here is a simple stored procedure that returns a "Hello World" response.

```javascript
var helloWorldStoredProc = {
    id: "helloWorld",
    serverScript: function () {
        var context = getContext();
        var response = context.getResponse();

        response.setBody("Hello, World");
    }
}
```

The context object provides access to all operations that can be performed in Azure Cosmos DB, as well as access to the request and response objects. In this case, you use the response object to set the body of the response to be sent back to the client.

Once written, the stored procedure must be registered with a collection. To learn more, see [How to use stored procedures in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md#stored-procedures) article.

### <a id="create-an-item"></a>Create an item using stored procedure

When you create an item by using stored procedure, the item is inserted into the Azure Cosmos container and an ID for the newly created item is returned. Creating an item is an asynchronous operation and depends on the JavaScript callback functions. The callback function has two parameters - one for the error object in case the operation fails and another for a return value; in this case, the created object. Inside the callback, you can either handle the exception or throw an error. In case a callback is not provided and there is an error, the Azure Cosmos DB runtime will throw an error.

The stored procedure also includes a parameter to set the description, it's a boolean value. When the parameter is set to true and the description is missing, the stored procedure will throw an exception. Otherwise, the rest of the stored procedure continues to run.

The following example stored procedure takes a new Azure Cosmos item as input, inserts it into the Azure Cosmos container and returns the ID for the newly created item. In this example, we are leveraging the ToDoList sample from the [Quickstart .NET SQL API](create-sql-api-dotnet.md)

```javascript
function createToDoItem(itemToCreate) {

    var context = getContext();
    var container = context.getCollection();

    var accepted = container.createDocument(container.getSelfLink(),
        itemToCreate,
        function (err, itemCreated) {
            if (err) throw new Error('Error' + err.message);
            context.getResponse().setBody(itemCreated.id)
        });
    if (!accepted) return;
}
```

### Arrays as input parameters for stored procedures

When defining a stored procedure in Azure portal, input parameters are always sent as a string to the stored procedure. Even if you pass an array of strings as an input, the array is converted to string and sent to the stored procedure. To work around this, you can define a function within your stored procedure to parse the string as an array. The following code shows how to parse a string  input parameter as an array:

```javascript
function sample(arr) {
    if (typeof arr === "string") arr = JSON.parse(arr);

    arr.forEach(function(a) {
        // do something here
        console.log(a);
    });
}
```

### <a id="transactions"></a>Transactions within stored procedures

You can implement transactions on items within a container by using a stored procedure. The following example uses transactions within a fantasy football gaming app to trade players between two teams in a single operation. The stored procedure attempts to read the two Azure Cosmos items each corresponding to the player IDs passed in as an argument. If both players are found, then the stored procedure updates the items by swapping their teams. If any errors are encountered along the way, the stored procedure throws a JavaScript exception that implicitly aborts the transaction.

```javascript
// JavaScript source code
function tradePlayers(playerId1, playerId2) {
    var context = getContext();
    var container = context.getCollection();
    var response = context.getResponse();

    var player1Document, player2Document;

    // query for players
    var filterQuery =
    {
        'query' : 'SELECT * FROM Players p where p.id = @playerId1',
        'parameters' : [{'name':'@playerId1', 'value':playerId1}] 
    };

    var accept = container.queryDocuments(container.getSelfLink(), filterQuery, {},
        function (err, items, responseOptions) {
            if (err) throw new Error("Error" + err.message);

            if (items.length != 1) throw "Unable to find both names";
            player1Item = items[0];

            var filterQuery2 =
            {
                'query' : 'SELECT * FROM Players p where p.id = @playerId2',
                'parameters' : [{'name':'@playerId2', 'value':playerId2}]
            };
            var accept2 = container.queryDocuments(container.getSelfLink(), filterQuery2, {},
                function (err2, items2, responseOptions2) {
                    if (err2) throw new Error("Error" + err2.message);
                    if (items2.length != 1) throw "Unable to find both names";
                    player2Item = items2[0];
                    swapTeams(player1Item, player2Item);
                    return;
                });
            if (!accept2) throw "Unable to read player details, abort ";
        });

    if (!accept) throw "Unable to read player details, abort ";

    // swap the two players’ teams
    function swapTeams(player1, player2) {
        var player2NewTeam = player1.team;
        player1.team = player2.team;
        player2.team = player2NewTeam;

        var accept = container.replaceDocument(player1._self, player1,
            function (err, itemReplaced) {
                if (err) throw "Unable to update player 1, abort ";

                var accept2 = container.replaceDocument(player2._self, player2,
                    function (err2, itemReplaced2) {
                        if (err) throw "Unable to update player 2, abort"
                    });

                if (!accept2) throw "Unable to update player 2, abort";
            });

        if (!accept) throw "Unable to update player 1, abort";
    }
}
```

### <a id="bounded-execution"></a>Bounded execution within stored procedures

The following is an example of a stored procedure that bulk-imports items into an Azure Cosmos container. The stored procedure handles bounded execution by checking the boolean return value from `createDocument`, and then uses the count of items inserted in each invocation of the stored procedure to track and resume progress across batches.

```javascript
function bulkImport(items) {
    var container = getContext().getCollection();
    var containerLink = container.getSelfLink();

    // The count of imported items, also used as current item index.
    var count = 0;

    // Validate input.
    if (!items) throw new Error("The array is undefined or null.");

    var itemsLength = items.length;
    if (itemsLength == 0) {
        getContext().getResponse().setBody(0);
    }

    // Call the create API to create an item.
    tryCreate(items[count], callback);

    // Note that there are 2 exit conditions:
    // 1) The createDocument request was not accepted.
    //    In this case the callback will not be called, we just call setBody and we are done.
    // 2) The callback was called items.length times.
    //    In this case all items were created and we don’t need to call tryCreate anymore. Just call setBody and we are done.
    function tryCreate(item, callback) {
        var isAccepted = container.createDocument(containerLink, item, callback);

        // If the request was accepted, callback will be called.
        // Otherwise report current count back to the client,
        // which will call the script again with remaining set of items.
        if (!isAccepted) getContext().getResponse().setBody(count);
    }

    // This is called when container.createDocument is done in order to process the result.
    function callback(err, item, options) {
        if (err) throw err;

        // One more item has been inserted, increment the count.
        count++;

        if (count >= itemsLength) {
            // If we created all items, we are done. Just set the response.
            getContext().getResponse().setBody(count);
        } else {
            // Create next document.
            tryCreate(items[count], callback);
        }
    }
}
```

### <a id="async-promises"></a>Async await with stored procedures

The following is an example of a stored procedure that uses async-await with Promises using a helper function. The stored procedure queries for an item and replaces it.

```javascript
function async_sample() {
    const ERROR_CODE = {
        NotAccepted: 429
    };

    const asyncHelper = {
        queryDocuments(sqlQuery, options) {
            return new Promise((resolve, reject) => {
                const isAccepted = __.queryDocuments(__.getSelfLink(), sqlQuery, options, (err, feed, options) => {
                    if (err) reject(err);
                    resolve({ feed, options });
                });
                if (!isAccepted) reject(new Error(ERROR_CODE.NotAccepted, "replaceDocument was not accepted."));
            });
        },

        replaceDocument(doc) {
            return new Promise((resolve, reject) => {
                const isAccepted = __.replaceDocument(doc._self, doc, (err, result, options) => {
                    if (err) reject(err);
                    resolve({ result, options });
                });
                if (!isAccepted) reject(new Error(ERROR_CODE.NotAccepted, "replaceDocument was not accepted."));
            });
        }
    };

    async function main() {
        let continuation;
        do {
            let { feed, options } = await asyncHelper.queryDocuments("SELECT * from c", { continuation });

            for (let doc of feed) {
                doc.newProp = 1;
                await asyncHelper.replaceDocument(doc);
            }

            continuation = options.continuation;
        } while (continuation);
    }

    main().catch(err => getContext().abort(err));
}
```

## <a id="triggers"></a>How to write triggers

Azure Cosmos DB supports pre-triggers and post-triggers. Pre-triggers are executed before modifying a database item and post-triggers are executed after modifying a database item.

### <a id="pre-triggers"></a>Pre-triggers

The following example shows how a pre-trigger is used to validate the properties of an Azure Cosmos item that is being created. In this example, we are leveraging the ToDoList sample from the [Quickstart .NET SQL API](create-sql-api-dotnet.md), to add a timestamp property to a newly added item if it doesn't contain one.

```javascript
function validateToDoItemTimestamp() {
    var context = getContext();
    var request = context.getRequest();

    // item to be created in the current operation
    var itemToCreate = request.getBody();

    // validate properties
    if (!("timestamp" in itemToCreate)) {
        var ts = new Date();
        itemToCreate["timestamp"] = ts.getTime();
    }

    // update the item that will be created
    request.setBody(itemToCreate);
}
```

Pre-triggers cannot have any input parameters. The request object in the trigger is used to manipulate the request message associated with the operation. In the previous example, the pre-trigger is run when creating an Azure Cosmos item, and the request message body contains the item to be created in JSON format.

When triggers are registered, you can specify the operations that it can run with. This trigger should be created with a `TriggerOperation` value of `TriggerOperation.Create`, which means using the trigger in a replace operation as shown in the following code is not permitted.

For examples of how to register and call a pre-trigger, see [pre-triggers](how-to-use-stored-procedures-triggers-udfs.md#pre-triggers) and [post-triggers](how-to-use-stored-procedures-triggers-udfs.md#post-triggers) articles. 

### <a id="post-triggers"></a>Post-triggers

The following example shows a post-trigger. This trigger queries for the metadata item and updates it with details about the newly created item.


```javascript
function updateMetadata() {
var context = getContext();
var container = context.getCollection();
var response = context.getResponse();

// item that was created
var createdItem = response.getBody();

// query for metadata document
var filterQuery = 'SELECT * FROM root r WHERE r.id = "_metadata"';
var accept = container.queryDocuments(container.getSelfLink(), filterQuery,
    updateMetadataCallback);
if(!accept) throw "Unable to update metadata, abort";

function updateMetadataCallback(err, items, responseOptions) {
    if(err) throw new Error("Error" + err.message);
        if(items.length != 1) throw 'Unable to find metadata document';

        var metadataItem = items[0];

        // update metadata
        metadataItem.createdItems += 1;
        metadataItem.createdNames += " " + createdItem.id;
        var accept = container.replaceDocument(metadataItem._self,
            metadataItem, function(err, itemReplaced) {
                    if(err) throw "Unable to update metadata, abort";
            });
        if(!accept) throw "Unable to update metadata, abort";
        return;
}
```

One thing that is important to note is the transactional execution of triggers in Azure Cosmos DB. The post-trigger runs as part of the same transaction for the underlying item itself. An exception during the post-trigger execution will fail the whole transaction. Anything committed will be rolled back and an exception returned.

For examples of how to register and call a pre-trigger, see [pre-triggers](how-to-use-stored-procedures-triggers-udfs.md#pre-triggers) and [post-triggers](how-to-use-stored-procedures-triggers-udfs.md#post-triggers) articles. 

## <a id="udfs"></a>How to write user-defined functions

The following sample creates a UDF to calculate income tax for various income brackets. This user-defined function would then be used inside a query. For the purposes of this example assume there is a container called "Incomes" with properties as follows:

```json
{
   "name": "Satya Nadella",
   "country": "USA",
   "income": 70000
}
```

The following is a function definition to calculate income tax for various income brackets:

```javascript
function tax(income) {

        if(income == undefined)
            throw 'no input';

        if (income < 1000)
            return income * 0.1;
        else if (income < 10000)
            return income * 0.2;
        else
            return income * 0.4;
    }
```

For examples of how to register and use a user-defined function, see [How to use user-defined functions in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md#udfs) article.

## Logging 

When using stored procedure, triggers or user-defined functions, you can log the steps using the `console.log()` command. This command will concentrate a string for debugging when `EnableScriptLogging` is set to true as shown in the following example:

```javascript
var response = await client.ExecuteStoredProcedureAsync(
document.SelfLink,
new RequestOptions { EnableScriptLogging = true } );
Console.WriteLine(response.ScriptLog);
```

## Next steps

Learn more concepts and how-to write or use stored procedures, triggers, and user-defined functions in Azure Cosmos DB:

* [How to register and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md)

* [How to write stored procedures and triggers using Javascript Query API in Azure Cosmos DB](how-to-write-javascript-query-api.md)

* [Working with Azure Cosmos DB stored procedures, triggers, and user-defined functions in Azure Cosmos DB](stored-procedures-triggers-udfs.md)

* [Working with JavaScript language integrated query API in Azure Cosmos DB](javascript-query-api.md)
