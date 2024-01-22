---
title: Use Azure Table storage or Azure Cosmos DB for Table from Node.js
description: Store structured data in the cloud using Azure Tables client library for Node.js.
ms.service: cosmos-db
ms.subservice: table
ms.devlang: javascript
ms.topic: sample
ms.date: 07/23/2020
author: seesharprun
ms.author: sidandrews
ms.custom: devx-track-js, ignite-2022
---
# How to use Azure Table storage or the Azure Cosmos DB for Table from Node.js
[!INCLUDE[Table](../includes/appliesto-table.md)]

[!INCLUDE [storage-selector-table-include](../../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

This article shows you how to create tables, store your data, and perform CRUD operations on said data. The samples are written in Node.js.

## Create an Azure service account

[!INCLUDE [cosmos-db-create-azure-service-account](../includes/cosmos-db-create-azure-service-account.md)]

**Create an Azure storage account**

[!INCLUDE [cosmos-db-create-storage-account](../includes/cosmos-db-create-storage-account.md)]

**Create an Azure Cosmos DB for Table account**

[!INCLUDE [cosmos-db-create-tableapi-account](../includes/cosmos-db-create-tableapi-account.md)]

## Configure your application to access Table Storage

To use Azure Storage or Azure Cosmos DB, you need the Azure Tables SDK for Node.js, which includes a set of convenience libraries that
communicate with the Storage REST services.

### Use Node Package Manager (NPM) to install the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix), and navigate to the folder where you created your application.
2. Type the following in the command window:

```javascript
   npm install @azure/data-tables
```  

3. You can manually run the **ls** command to verify that a **node_modules** folder was created. Inside that folder you will find the **@azure/data-tables** package, which contains the libraries you need to access tables.

### Import the package

Add the following code to the top of the **server.js** file in your application:

```javascript
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables");
```

## Connect to Azure Table service

You can either connect to the Azure storage account or the Azure Cosmos DB for Table account. Get the shared key or connection string based on the type of account you are using.

### Creating the Table service client from a shared key

The Azure module reads the environment variables AZURE_ACCOUNT and AZURE_ACCESS_KEY and AZURE_TABLES_ENDPOINT for information required to connect to your Azure Storage account or Azure Cosmos DB. If these environment variables are not set, you must specify the account information when calling `TableServiceClient`. For example, the following code creates a `TableServiceClient` object:

```javascript
const endpoint = "<table-endpoint-uri>";
const credential = new AzureNamedKeyCredential(
  "<account-name>",
  "<account-key>"
);

const tableService = new TableServiceClient(
  endpoint,
  credential
);
```

### Creating the Table service client from a connection string

To add an Azure Cosmos DB or Storage account connection, create a `TableServiceClient` object and specify your account name, primary key, and endpoint. You can copy these values from **Settings** > **Connection String** in the Azure portal for your Azure Cosmos DB account or Storage account. For example:

```javascript
const tableService = TableServiceClient.fromConnectionString("<connection-string>");
```

## Create a table

The call to `createTable` creates a new table with the specified name if it does not already exist. The following example creates a new table named 'mytable' if it does not already exist:

```javascript
await tableService.createTable('<table-name>');
```

### Creating the Table client

To interact with a table, you should create a `TableClient` object using the same credentials you used to create the `TableServiceClient`. The `TableClient` also requires the name of the target table.

```javascript
const tableClient = new TableClient(
  endpoint,
  '<table-name>',
  credential
);
```

## Add an entity to a table

To add an entity, first create an object that defines your entity properties. All entities must contain a **partitionKey** and **rowKey**, which are unique identifiers for the entity.

* **partitionKey** - Determines the partition in which the entity is stored.
* **rowKey** - Uniquely identifies the entity within the partition.

Both **partitionKey** and **rowKey** must be string values.

The following is an example of defining an entity. The **dueDate** is defined as a type of `Date`. Specifying the type is optional, and types are inferred if not specified.

```javascript
const task = {
  partitionKey: "hometasks",
  rowKey: "1",
  description: "take out the trash",
  dueDate: new Date(2015, 6, 20)
};
```

> [!NOTE]
> There is also a `Timestamp` field for each record, which is set by Azure when an entity is inserted or updated.

To add an entity to your table, pass the entity object to the `createEntity` method.

```javascript
let result = await tableClient.createEntity(task);
    // Entity create
```    

If the operation is successful, `result` contains the [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) and information about the operation.

Example response:

```javascript
{ 
  clientRequestId: '94d8e2aa-5e02-47e7-830c-258e050c4c63',
  requestId: '08963b85-1002-001b-6d8c-12ae5d000000',
  version: '2019-02-02',
  date: 2022-01-26T08:12:32.000Z,
  etag: `W/"datetime'2022-01-26T08%3A12%3A33.0180348Z'"`,
  preferenceApplied: 'return-no-content',
  'cache-control': 'no-cache',
  'content-length': '0'
}
```

## Update an entity

The different modes for `updateEntity` and `upsertEntity` methods
  - Merge: Updates an entity by updating the entity's properties without replacing the existing entity.
  - Replace: Updates an existing entity by replacing the entire entity.



The following example demonstrates updating an entity using `upsertEntity`:

```javascript
// Entity doesn't exist in table, so calling upsertEntity will simply insert the entity.
let result = await tableClient.upsertEntity(task, "Replace");
```

If the entity that is being updated doesn't exist, then the update operation fails; therefore, if you want to store an entity regardless of whether it already exists, use `upsertEntity`.

The `result` for successful update operations contains the **Etag** of the updated entity.

## Work with groups of entities

Sometimes it makes sense to submit multiple operations together in a batch to ensure atomic processing by the server. To accomplish that, create an array of operations and pass it to the `submitTransaction` method on `TableClient`.

 The following example demonstrates submitting two entities in a batch:

```javascript
const task1 = {
  partitionKey: "hometasks",
  rowKey: "1",
  description: "Take out the trash",
  dueDate: new Date(2015, 6, 20)
};
const task2 = {
  partitionKey: "hometasks",
  rowKey: "2",
  description: "Wash the dishes",
  dueDate: new Date(2015, 6, 20)
};

const tableActions = [
  ["create", task1],
  ["create", task2]
];

let result = await tableClient.submitTransaction(tableActions);
    // Batch completed
```
For successful batch operations, `result` contains information for each operation in the batch.

## Retrieve an entity by key

To return a specific entity based on the **PartitionKey** and **RowKey**, use the **getEntity** method.

```javascript
let result = await tableClient.getEntity("hometasks", "1")
  .catch((error) => {
    // handle any errors
  });
  // result contains the entity
```

After this operation is complete, `result` contains the entity.

## Query a set of entities

The following example builds a query that returns the top five items with a PartitionKey of 'hometasks' and  list all the entities in the table.

```javascript
const topN = 5;
const partitionKey = "hometasks";

const entities = tableClient.listEntities({
  queryOptions: { filter: odata`PartitionKey eq ${partitionKey}` }
});

let topEntities = [];
const iterator = entities.byPage({ maxPageSize: topN });

for await (const page of iterator) {
  topEntities = page;
  break;
}

// Top entities: 5
console.log(`Top entities: ${topEntities.length}`);

// List all the entities in the table
for await (const entity of entities) {
console.log(entity);
}
```

### Query a subset of entity properties

A query to a table can retrieve just a few fields from an entity.
This reduces bandwidth and can improve query performance, especially for large entities. Use the **select** clause and pass the names of the fields to return. For example, the following query returns only the **description** and **dueDate** fields.

```javascript
const topN = 5;
const partitionKey = "hometasks";

const entities = tableClient.listEntities({
  queryOptions: { filter: odata`PartitionKey eq ${partitionKey}`,
                  select: ["description", "dueDate"]  }
});

let topEntities = [];
const iterator = entities.byPage({ maxPageSize: topN });

for await (const page of iterator) {
  topEntities = page;
  break;
}
```

## Delete an entity

You can delete an entity using its partition and row keys. In this example, the **task1** object contains the **rowKey** and **partitionKey** values of the entity to delete. Then the object is passed to the **deleteEntity** method.

```javascript
const tableClient = new TableClient(
  tablesEndpoint,
  tableName,
  new AzureNamedKeyCredential("<accountName>", "<accountKey>")
);

await tableClient.deleteEntity("hometasks", "1");
    // Entity deleted
```

> [!NOTE]
> Consider using ETags when deleting items, to ensure that the item hasn't been modified by another process. See [Update an entity](#update-an-entity) for information on using ETags.
>
>

## Delete a table

The following code deletes a table from a storage account.

```javascript
await tableClient.deleteTable(mytable);
        // Table deleted
```

## Use continuation tokens

When you are querying tables for large amounts of results, look for continuation tokens. There may be large amounts of data available for your query that you might not realize if you do not build to recognize when a continuation token is present.

The **results** object returned during querying entities sets a `continuationToken` property when such a token is present. You can then use this when performing a query to continue to move across the partition and table entities.

When querying, you can provide a `continuationToken` parameter between the query object instance and the callback function:

```javascript
let iterator = tableClient.listEntities().byPage({ maxPageSize: 2 });
let interestingPage;

const page = await tableClient
   .listEntities()
   .byPage({ maxPageSize: 2, continuationToken: interestingPage })
   .next();

 if (!page.done) {
   for (const entity of page.value) {
     console.log(entity.rowKey);
   }
 }
```

## Work with shared access signatures

Shared access signatures (SAS) are a secure way to provide granular access to tables without providing your Storage account name or keys. SAS are often used to provide limited access to your data, such as allowing a mobile app to query records.

A trusted application such as a cloud-based service generates a SAS using the **generateTableSas** of the **TableClient**, and provides it to an untrusted or semi-trusted application such as a mobile app. The SAS is generated using a policy, which describes the start and end dates during which the SAS is valid, as well as the access level granted to the SAS holder.

The following example generates a new shared access policy that will allow the SAS holder to query ('r') the table.

```javascript
const tablePermissions = {
    query: true
// Allows querying entities
};

// Create the table SAS token
const tableSAS = generateTableSas('mytable', cred, {
  expiresOn: new Date("2022-12-12"),
  permissions: tablePermissions
});
```

The client application then uses the SAS with **AzureSASCredential** to perform operations against the table. The following example connects to the table and performs a query. See [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../../storage/common/storage-sas-overview.md) article for the format of tableSAS.

```javascript
// Note in the following command, tablesUrl is in the format: `https://<your_storage_account_name>.table.core.windows.net` and the tableSAS is in the format: `sv=2018-03-28&si=saspolicy&tn=mytable&sig=9aCzs76n0E7y5BpEi2GvsSv433BZa22leDOZXX%2BXXIU%3D`;

const tableService = new TableServiceClient(tablesUrl, new AzureSASCredential(tableSAS));
const partitionKey = "hometasks";

const entities = tableService.listTables({
  queryOptions: { filter: odata`PartitionKey eq ${partitionKey}` }
});
```

Because the SAS was generated with only query access, an error is returned if you attempt to insert, update, or delete entities.

### Access Control Lists

You can also use an Access Control List (ACL) to set the access policy for a SAS. This is useful if you want to allow multiple clients to access the table, but provide different access policies for each client.

An ACL is implemented using an array of access policies, with an ID associated with each policy. The following example defines two policies, one for 'user1' and one for 'user2':

```javascript
var sharedAccessPolicy = [{
  id:"user1",
  accessPolicy:{
    permission: "r" ,
    Start: startsOn,
    Expiry: expiresOn,
  }},
  {
  id:"user2",
  accessPolicy:{
    permissions: "a",
    Start: startsOn,
    Expiry: expiresOn,
  }},
]
```

The following example gets the current ACL for the **hometasks** table, and then adds the new policies using **setAccessPolicy**. This approach allows:

```javascript
tableClient.getAccessPolicy();
tableClient.setAccessPolicy(sharedAccessPolicy);
```

After the ACL has been set, you can then create a SAS based on the ID for a policy. The following example creates a new SAS for 'user2':

```javascript
tableSAS = generateTableSas("hometasks",cred,{identifier:'user2'});
```

## Next steps

For more information, see the following resources.

* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
* [Azure Data Tables SDK for Node.js](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/tables/data-tables) repository on GitHub.
* [Create a Node.js web app in Azure](../../app-service/quickstart-nodejs.md)
* [Build and deploy a Node.js application to an Azure Cloud Service](../../cloud-services/cloud-services-nodejs-develop-deploy-app.md) (using Windows PowerShell)
