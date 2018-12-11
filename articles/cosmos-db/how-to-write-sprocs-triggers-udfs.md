---
title: How to write stored procedures, triggers and user-defined functions in Azure Cosmos DB
description: Learn how to write stored procedures, triggers and user-defined functions in Azure Cosmos DB
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 12/08/2018
ms.author: mjbrown
---

# How to write stored procedures, triggers and user-defined functions in Azure Cosmos DB

Azure Cosmos DB provides language-integrated, transactional execution of JavaScript that lets you write **stored procedures**, **triggers**, and **user-defined functions (UDFs)** natively in JavaScript when using the Cosmos DB SQL API. This enables you to write your logic in JavaScript that can be executed inside the database engine. You can create and execute triggers, stored procedures and UDFs using [Azure portal](https://portal.azure.com/), the [JavaScript language integrated query API in Azure Cosmos DB](js-query-api.md) and the [Cosmos DB SQL API client SDKs](sql-api-dotnet-samples). 

To call a stored procedure, trigger and user-defined function, you need to register it. For more information, see [How to work with stored procedures, triggers, user-defined functions in Azure Cosmos DB](how-to-sprocs-triggers-udfs.md).

## <a id="stored-procedures">How to write stored procedures</a>

Stored procedures are written using JavaScript and can create, update, read, query and delete items inside a Cosmos container. Stored procedures are registered per collection, and can operate on any document and attachment present in that collection.

### Hello world

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

The context object provides access to all operations that can be performed on Cosmos DB, as well as access to the request and response objects. In this case, you use the response object to set the body of the response to be sent back to the client.

Once written, the stored procedure must be registered with a collection. To learn more, see [How to use stored procedures in Azure Cosmos DB](how-to-use-sprocs-triggers-udfs.md#stored-procedures).

### <a id="create-an-item">Create an item</a>

Below is a stored procedure that takes a new Cosmos DB item as input, inserts it as a new item into the current Cosmos DB container and returns the id for the newly created item. All such operations are asynchronous and depend on JavaScript function callbacks. The callback function has two parameters - one for the error object in case the operation fails and another for a return value; in this case, the created object. Inside the callback, you can either handle the exception or throw an error. In case a callback is not provided and there is an error, Cosmos DB runtime will throw an error. The stored procedure also includes a parameter to set whether the description is required. If set to true and description is missing, the stored procedure will throw an exception. Otherwise it will execute the rest of the stored procedure.

In this example we are leveraging the ToDoList sample from the [Quickstart .NET SQL API](create-sql-api-dotnet.md)

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

### Handling arrays as input parameters for stored procedures executed in Azure portal

When defining a stored procedure in Azure portal, input parameters are always sent as a string to the stored procedure. Even if you pass an array of strings as an input, the array is converted to string and sent to the stored procedure. To work around this, you can define a function within your stored procedure to parse the string as an array. The following code is an example of how to parse the string as an array.

```javascript
function sample(arr) {
    if (typeof arr === "string") arr = JSON.parse(arr);

    arr.forEach(function(a) {
        // do something here
        console.log(a);
    });
}
```

### <a id="transactions">Implementing Transactions</a>

Stored procedures can implement transactions on items within a container. Below is an example of a stored procedure that uses transactions within a fantasy football gaming app to trade players between two teams in a single operation. The stored procedure attempts to read two Cosmos DB items each corresponding to the player IDs passed in as an argument. If both player are found, then the stored procedure updates the Cosmos DB items by swapping their teams. If any errors are encountered along the way, the stored procedure throws a JavaScript exception that implicitly aborts the transaction.

```javascript
// JavaScript source code
function tradePlayers(playerId1, playerId2) {
    var context = getContext();
    var container = context.getCollection();
    var response = context.getResponse();

    var player1Document, player2Document;

    // query for players
    var filterQuery = 'SELECT * FROM Players p where p.id  = "' + playerId1 + '"';
    var accept = container.queryDocuments(container.getSelfLink(), filterQuery, {},
        function (err, items, responseOptions) {
            if (err) throw new Error("Error" + err.message);

            if (items.length != 1) throw "Unable to find both names";
            player1Item = items[0];

            var filterQuery2 = 'SELECT * FROM Players p where p.id = "' + playerId2 + '"';
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

### <a id="bounded-execution">Implementing bounded execution</a>

Below is an example of a stored procedure that is written to bulk-import items into a Cosmos container. The stored procedure handles bounded execution by checking the Boolean return value from createDocument, and then uses the count of items inserted in each invocation of the stored procedure to track and resume progress across batches.

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

## <a id="triggers">How to write triggers</a>

Azure Cosmos DB supports pre-triggers and post-triggers. Below are examples of each.

### <a id="pre-triggers">Pre-triggers</a>

The following example shows how a pre-trigger can be used to validate the properties of a Cosmos DB item that is being created. In this example we are leveraging the ToDoList sample from the [Quickstart .NET SQL API](create-sql-api-dotnet.md), to add a timestamp property to a newly added item if it doesn't contain one.

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

Pre-triggers cannot have any input parameters. The request object can be used to manipulate the request message associated with the operation. Here, the pre-trigger is being run with the creation of a Cosmos DB item, and the request message body contains the item to be created in JSON format.

When triggers are registered, you can specify the operations that it can run with. This trigger should be created with a `TriggerOperation` value of `TriggerOperation.Create`, which means using the trigger in a replace operation as shown in the following code is not permitted.

For examples of how to register and call a pre-trigger, see [How to use triggers in Azure Cosmos DB](how-to-use-sprocs-triggers-udfs.md#triggers).

### <a id="post-triggers">Post-triggers</a>

The following example shows a post-trigger.

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

This trigger queries for the metadata item and updates it with details about the newly created Cosmos DB item.

One thing that is important to note is the transactional execution of triggers in Cosmos DB. This post-trigger runs as part of the same transaction as the creation of the original Cosmos DB item. Therefore, if you get an exception during the post-trigger execution (say, if you are unable to update the metadata item), the whole transaction will fail and be rolled back - no Cosmos DB item will be created and an exception will be returned.

For examples of how to register and call a post-trigger, see [How to use triggers in Azure Cosmos DB](how-to-use-sprocs-triggers-udfs.md#triggers).

## <a id="udfs">How to write user-defined functions</a>

The following sample creates a UDF to calculate income tax for various income brackets. This user-defined function would then be used inside a query. For the purposes of this example assume a container called "Incomes" with properties as shown below.

```json
{
   name = "Satya Nadella",
   country = "USA",
   income = 70000
}
```

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

For examples of how to register and use a user-defined function, see [How to use user-defined functions in Azure Cosmos DB](how-to-use-sprocs-triggers-udfs.md#udfs).

## Next steps

Learn more concepts and how-to write and use stored procedures, triggers and user-defined functions in Azure Cosmos DB:

- [How to register and use stored procedures, triggers, user-defined functions in Azure Cosmos DB](how-to-use-sprocs-triggers-udfs.md)
- [How to write stored procedures and triggers using Javascript Query API in Azure Cosmos DB](how-to-write-js-query-api.md)
- [Working with Azure Cosmos DB stored procedures, triggers and user-defined functions in Azure Cosmos DB](sprocs-triggers-udfs.md)
- [Working with JavaScript language integrated query API in Azure Cosmos DB](js-query-api.md)
