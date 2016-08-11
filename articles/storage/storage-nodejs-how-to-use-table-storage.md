<properties
	pageTitle="How to use Azure Table storage from Node.js | Microsoft Azure"
	description="Store structured data in the cloud using Azure Table storage, a NoSQL data store."
	services="storage"
	documentationCenter="nodejs"
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="nodejs"
	ms.topic="article"
	ms.date="06/24/2016"
	ms.author="micurd"/>


# How to use Azure Table storage from Node.js

[AZURE.INCLUDE [storage-selector-table-include](../../includes/storage-selector-table-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-queues](../../includes/storage-try-azure-tools-tables.md)]

## Overview

This topic shows how to perform common scenarios using the Azure Table service in a Node.js application.

The code examples in this topic assume you already have a Node.js application. For information about how to create a Node.js application in Azure, see any of these topics:

- [Create a Node.js web app in Azure App Service](../app-service-web/web-sites-nodejs-develop-deploy-mac.md)
- [Build and deploy a Node.js web app to Azure using WebMatrix](../app-service-web/web-sites-nodejs-use-webmatrix.md)
- [Build and deploy a Node.js application to an Azure Cloud Service](../cloud-services/cloud-services-nodejs-develop-deploy-app.md) (using Windows PowerShell)


[AZURE.INCLUDE [storage-table-concepts-include](../../includes/storage-table-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]


## Configure your application to access Azure Storage

To use Azure Storage, you need the Azure Storage SDK for Node.js, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to install the package

1.  Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix), and navigate to the folder where you created your application.

2.  Type **npm install azure-storage** in the command window. Output from the command is similar to the following example.

		azure-storage@0.5.0 node_modules\azure-storage
		+-- extend@1.2.1
		+-- xmlbuilder@0.4.3
		+-- mime@1.2.11
		+-- node-uuid@1.4.3
		+-- validator@3.22.2
		+-- underscore@1.4.4
		+-- readable-stream@1.0.33 (string_decoder@0.10.31, isarray@0.0.1, inherits@2.0.1, core-util-is@1.0.1)
		+-- xml2js@0.2.7 (sax@0.5.2)
		+-- request@2.57.0 (caseless@0.10.0, aws-sign2@0.5.0, forever-agent@0.6.1, stringstream@0.0.4, oauth-sign@0.8.0, tunnel-agent@0.4.1, isstream@0.1.2, json-stringify-safe@5.0.1, bl@0.9.4, combined-stream@1.0.5, qs@3.1.0, mime-types@2.0.14, form-data@0.2.0, http-signature@0.11.0, tough-cookie@2.0.0, hawk@2.3.1, har-validator@1.8.0)

3.  You can manually run the **ls** command to verify that a **node\_modules** folder was created. Inside that folder you will find the **azure-storage** package, which contains the libraries you need to access storage.

### Import the package

Add the following code to the top of the **server.js** file in your application:

	var azure = require('azure-storage');

## Set up an Azure Storage connection

The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY, or AZURE\_STORAGE\_CONNECTION\_STRING for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **TableService**.

For an example of setting the environment variables in the [Azure Portal](https://portal.azure.com) for an Azure Website, see [Node.js web app using the Azure Table Service].

## Create a table

The following code creates a **TableService** object and uses it to create a new table. Add the following near the top of **server.js**.

	var tableSvc = azure.createTableService();

The call to **createTableIfNotExists** will create a new table with the specified name if it does not already exist. The following example creates a new table named 'mytable' if it does not already exist:

	tableSvc.createTableIfNotExists('mytable', function(error, result, response){
	  if(!error){
	    // Table exists or created
	  }
	});

The `result.created` will be `true` if a new table is created, and `false` if the table already exists. The `response` will contain information about the request.

### Filters

Optional filtering operations can be applied to operations performed using **TableService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

	function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next", passing a callback with the following signature:

	function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback otherwise to end the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **TableService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var tableSvc = azure.createTableService().withFilter(retryOperations);

## Add an entity to a table

To add an entity, first create an object that defines your entity properties. All entities must contain a **PartitionKey** and **RowKey**, which are unique identifiers for the entity.

* **PartitionKey** - determines the partition that the entity is stored in

* **RowKey** - uniquely identifies the entity within the partition

Both **PartitionKey** and **RowKey** must be string values. For more information, see [Understanding the Table Service Data Model](http://msdn.microsoft.com/library/azure/dd179338.aspx).

The following is an example of defining an entity. Note that **dueDate** is defined as a type of **Edm.DateTime**. Specifying the type is optional, and types will be inferred if not specified.

	var task = {
	  PartitionKey: {'_':'hometasks'},
	  RowKey: {'_': '1'},
	  description: {'_':'take out the trash'},
	  dueDate: {'_':new Date(2015, 6, 20), '$':'Edm.DateTime'}
	};

> [AZURE.NOTE] There is also a **Timestamp** field for each record, which is set by Azure when an entity is inserted or updated.

You can also use the **entityGenerator** to create entities. The following example creates the same task entity using the **entityGenerator**.

	var entGen = azure.TableUtilities.entityGenerator;
	var task = {
	  PartitionKey: entGen.String('hometasks'),
	  RowKey: entGen.String('1'),
	  description: entGen.String('take out the trash'),
	  dueDate: entGen.DateTime(new Date(Date.UTC(2015, 6, 20))),
	};

To add an entity to your table, pass the entity object to the **insertEntity** method.

	tableSvc.insertEntity('mytable',task, function (error, result, response) {
	  if(!error){
	    // Entity inserted
	  }
	});

If the operation is successful, `result` will contain the [ETag](http://en.wikipedia.org/wiki/HTTP_ETag) of the inserted record and `response` will contain information about the operation.

Example response:

	{ '.metadata': { etag: 'W/"datetime\'2015-02-25T01%3A22%3A22.5Z\'"' } }

> [AZURE.NOTE] By default, **insertEntity** does not return the inserted entity as part of the `response` information. If you plan on performing other operations on this entity, or wish to cache the information, it can be useful to have it returned as part of the `result`. You can do this by enabling **echoContent** as follows:
>
> `tableSvc.insertEntity('mytable', task, {echoContent: true}, function (error, result, response) {...}`

## Update an entity

There are multiple methods available to update an existing entity:

* **replaceEntity** - updates an existing entity by replacing it

* **mergeEntity** - updates an existing entity by merging new property values into the existing entity

* **insertOrReplaceEntity** - updates an existing entity by replacing it. If no entity exists, a new one will be inserted

* **insertOrMergeEntity** - updates an existing entity by merging new property values into the existing. If no entity exists, a new one will be inserted

The following example demonstrates updating an entity using **replaceEntity**:

	tableSvc.replaceEntity('mytable', updatedTask, function(error, result, response){
	  if(!error) {
	    // Entity updated
	  }
	});

> [AZURE.NOTE] By default, updating an entity does not check to see if the data being updated has previously been modified by another process. To support concurrent updates:
>
> 1. Get the ETag of the object being updated. This is returned as part of the `response` for any entity related operation and can be retrieved through `response['.metadata'].etag`.
>
> 2. When performing an update operation on an entity, add the ETag information previously retrieved to the new entity. For example:
>
>     `entity2['.metadata'].etag = currentEtag;`
>
> 3. Perform the update operation. If the entity has been modified since you retrieved the ETag value, such as another instance of your application, an `error` will be returned stating that the update condition specified in the request was not satisfied.

With **replaceEntity** and **mergeEntity**, if the entity that is being updated doesn't exist, then the update operation will fail. Therefore if you wish to store an entity regardless of whether it already exists, use **insertOrReplaceEntity** or **insertOrMergeEntity**.

The `result` for successful update operations will contain the **Etag** of the updated entity.

## Work with groups of entities

Sometimes it makes sense to submit multiple operations together in a batch to ensure atomic processing by the server. To accomplish that, use the **TableBatch** class to create a batch, and then use the **executeBatch** method of **TableService** to perform the batched operations.

 The following example demonstrates submitting two entities in a batch:

	var task1 = {
	  PartitionKey: {'_':'hometasks'},
	  RowKey: {'_': '1'},
	  description: {'_':'Take out the trash'},
	  dueDate: {'_':new Date(2015, 6, 20)}
	};
	var task2 = {
	  PartitionKey: {'_':'hometasks'},
	  RowKey: {'_': '2'},
	  description: {'_':'Wash the dishes'},
	  dueDate: {'_':new Date(2015, 6, 20)}
	};

	var batch = new azure.TableBatch();

	batch.insertEntity(task1, {echoContent: true});
	batch.insertEntity(task2, {echoContent: true});

	tableSvc.executeBatch('mytable', batch, function (error, result, response) {
	  if(!error) {
	    // Batch completed
	  }
	});

For successful batch operations, `result` will contain information for each operation in the batch.

### Work with batched operations

Operations added to a batch can be inspected by viewing the `operations` property. You can also use the following methods to work with operations:

* **clear** - clears all operations from a batch

* **getOperations** - gets an operation from the batch

* **hasOperations** - returns true if the batch contains operations

* **removeOperations** - removes an operation

* **size** - returns the number of operations in the batch

## Retrieve an entity by key

To return a specific entity based on the **PartitionKey** and **RowKey**, use the **retrieveEntity** method.

	tableSvc.retrieveEntity('mytable', 'hometasks', '1', function(error, result, response){
	  if(!error){
	    // result contains the entity
	  }
	});

Once this operation is complete, `result` will contain the entity.

## Query a set of entities

To query a table, use the **TableQuery** object to build up a query expression using the following clauses:

* **select** - the fields to be returned from the query

* **where** - the where clause

	* **and** - an `and` where condition

	* **or** - an `or` where condition

* **top** - the number of items to fetch


The following example builds a query that will return the top five items with a PartitionKey of 'hometasks'.

	var query = new azure.TableQuery()
	  .top(5)
	  .where('PartitionKey eq ?', 'hometasks');

Since **select** is not used, all fields will be returned. To perform the query against a table, use **queryEntities**. The following example uses this query to return entities from 'mytable'.

	tableSvc.queryEntities('mytable',query, null, function(error, result, response) {
	  if(!error) {
	    // query was successful
	  }
	});

If successful, `result.entries` will contain an array of entities that match the query. If the query was unable to return all entities, `result.continuationToken` will be non-*null* and can be used as the third parameter of **queryEntities** to retrieve more results. For the initial query, use *null* for the third parameter.

### Query a subset of entity properties

A query to a table can retrieve just a few fields from an entity.
This reduces bandwidth and can improve query performance, especially for large entities. Use the **select** clause and pass the names of the fields to be returned. For example, the following query will return only the **description** and **dueDate** fields.

	var query = new azure.TableQuery()
	  .select(['description', 'dueDate'])
	  .top(5)
	  .where('PartitionKey eq ?', 'hometasks');

## Delete an entity

You can delete an entity using its partition and row keys. In this example, the **task1** object contains the **RowKey** and **PartitionKey** values of the entity to be deleted. Then the object is passed to the **deleteEntity** method.

	var task = {
	  PartitionKey: {'_':'hometasks'},
	  RowKey: {'_': '1'}
	};

	tableSvc.deleteEntity('mytable', task, function(error, response){
	  if(!error) {
	    // Entity deleted
	  }
	});

> [AZURE.NOTE] Consider using ETags when deleting items, to ensure that the item hasn't been modified by another process. See [Update an entity](#update-an-entity) for information on using ETags.

## Delete a table

The following code deletes a table from a storage account.

	tableSvc.deleteTable('mytable', function(error, response){
		if(!error){
			// Table deleted
		}
	});

If you are uncertain whether the table exists, use **deleteTableIfExists**.

## Use continuation tokens

When you are querying tables for large amounts of results, look for continuation tokens. There may be large amounts of data available for your query that you might not realize if you do not build to recognize when a
continuation token is present.

The results object returned during querying entities sets a `continuationToken` property when such a token is present. You can then use this when performing a query to continue to move across the partition and table entities.

When querying, a continuationToken parameter may be provided between the query object instance and the callback function:

```
var nextContinuationToken = null;
dc.table.queryEntities(tableName,
    query,
    nextContinuationToken,
    function (error, results) {
        if (error) throw error;

        // iterate through results.entries with results

        if (results.continuationToken) {
            nextContinuationToken = results.continuationToken;
        }

    });
```

If you inspect the `continuationToken` object, you will find properties such as `nextPartitionKey`, `nextRowKey` and `targetLocation`, which can be used to iterate through all the results.

There is also a continuation sample within the Azure Storage Node.js repo on GitHub. Look for `examples/samples/continuationsample.js`.

## Work with shared access signatures

Shared access signatures (SAS) are a secure way to provide granular access to tables without providing your storage account name or keys. SAS are often used to provide limited access to your data, such as allowing a mobile app to query records.

A trusted application such as a cloud-based service generates a SAS using the **generateSharedAccessSignature** of the **TableService**, and provides it to an untrusted or semi-trusted application such as a mobile app. The SAS is generated using a policy, which describes the start and end dates during which the SAS is valid, as well as the access level granted to the SAS holder.

The following example generates a new shared access policy that will allow the SAS holder to query ('r') the table, and expires 100 minutes after the time it is created.

	var startDate = new Date();
	var expiryDate = new Date(startDate);
	expiryDate.setMinutes(startDate.getMinutes() + 100);
	startDate.setMinutes(startDate.getMinutes() - 100);

	var sharedAccessPolicy = {
	  AccessPolicy: {
	    Permissions: azure.TableUtilities.SharedAccessPermissions.QUERY,
	    Start: startDate,
	    Expiry: expiryDate
	  },
	};

	var tableSAS = tableSvc.generateSharedAccessSignature('mytable', sharedAccessPolicy);
	var host = tableSvc.host;

Note that the host information must be provided also, as it is required when the SAS holder attempts to access the table.

The client application then uses the SAS with **TableServiceWithSAS** to perform operations against the table. The following example connects to the table and performs a query.

	var sharedTableService = azure.createTableServiceWithSas(host, tableSAS);
	var query = azure.TableQuery()
	  .where('PartitionKey eq ?', 'hometasks');

	sharedTableService.queryEntities(query, null, function(error, result, response) {
	  if(!error) {
	    // result contains the entities
	  }
	});

Since the SAS was generated with only query access, if an attempt were made to insert, update, or delete entities, an error would be returned.

### Access Control Lists

You can also use an Access Control List (ACL) to set the access policy for a SAS. This is useful if you wish to allow multiple clients to access the table, but provide different access policies for each client.

An ACL is implemented using an array of access policies, with an ID associated with each policy. The following example defines two policies, one for 'user1' and one for 'user2':

	var sharedAccessPolicy = {
	  user1: {
	    Permissions: azure.TableUtilities.SharedAccessPermissions.QUERY,
	    Start: startDate,
	    Expiry: expiryDate
	  },
	  user2: {
	    Permissions: azure.TableUtilities.SharedAccessPermissions.ADD,
	    Start: startDate,
	    Expiry: expiryDate
	  }
	};

The following example gets the current ACL for the **hometasks** table, and then adds the new policies using **setTableAcl**. This approach allows:

	var extend = require('extend');
	tableSvc.getTableAcl('hometasks', function(error, result, response) {
    if(!error){
	    var newSignedIdentifiers = extend(true, result.signedIdentifiers, sharedAccessPolicy);
	    tableSvc.setTableAcl('hometasks', newSignedIdentifiers, function(error, result, response){
	      if(!error){
	        // ACL set
	      }
	    });
	  }
	});

Once the ACL has been set, you can then create a SAS based on the ID for a policy. The following example creates a new SAS for 'user2':

	tableSAS = tableSvc.generateSharedAccessSignature('hometasks', { Id: 'user2' });

## Next steps

For more information, see the following resources.

-   [Azure Storage Team Blog][].
-   [Azure Storage SDK for Node][] repository on GitHub.
-   [Node.js Developer Center](/develop/nodejs/)

  [Azure Storage SDK for Node]: https://github.com/Azure/azure-storage-node
  [OData.org]: http://www.odata.org/
  [Using the REST API]: http://msdn.microsoft.com/library/azure/hh264518.aspx
  [Azure Portal]: portal.azure.com

  [Node.js Cloud Service]: ../cloud-services-nodejs-develop-deploy-app.md
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Website with WebMatrix]: ../web-sites-nodejs-use-webmatrix.md
  [Node.js Cloud Service with Storage]: ../storage-nodejs-use-table-storage-cloud-service-app.md
  [Node.js web app using the Azure Table Service]: ../storage-nodejs-use-table-storage-web-site.md
  [Create and deploy a Node.js application to an Azure website]: ../web-sites-nodejs-develop-deploy-mac.md
