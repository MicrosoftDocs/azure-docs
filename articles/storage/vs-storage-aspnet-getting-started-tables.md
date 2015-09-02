<properties
	pageTitle="Get started with Azure Table storage and Visual Studio connected services | Microsoft Azure"
	description="How to get started using Azure Table storage in an ASP.NET project in Visual Studio"
	services="storage"
	documentationCenter=""
	authors="patshea123"
	manager="douge"
	editor="tglee"/>

<tags
	ms.service="storage"
	ms.workload="web"
	ms.tgt_pltfrm="vs-getting-started"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/04/2015"
	ms.author="patshea123"/>

# Get started with Azure Table storage and Visual Studio connected services

> [AZURE.SELECTOR]
> - [Getting Started](vs-storage-aspnet-getting-started-tables.md)
> - [What Happened](vs-storage-aspnet-what-happened.md)

> [AZURE.SELECTOR]
> - [Blobs](vs-storage-aspnet-getting-started-blobs.md)
> - [Queues](vs-storage-aspnet-getting-started-queues.md)
> - [Tables](vs-storage-aspnet-getting-started-tables.md)

## Overview
This article describes how get started using Azure Table storage in Visual Studio after you have created or referenced an Azure storage account in an ASP.NET project by using the  Visual Studio **Add Connected Services** dialog. This article shows you how to perform common tasks in Azure tables, including creating and
deleting a table, as well as working with table entities. The samples are written in C\# code and use the [Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/dn261237.aspx). For more general information about using Azure table storage, see [How to use Table storage from .NET](storage-dotnet-how-to-use-tables.md).

Azure Table storage enables you to store large amounts of structured data. The service is a NoSQL datastore that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data.


## Access tables in code

1. Make sure the namespace declarations at the top of the C# file include these `using` statements.

		 using Microsoft.Azure;
		 using Microsoft.WindowsAzure.Storage;
		 using Microsoft.WindowsAzure.Storage.Auth;
		 using Microsoft.WindowsAzure.Storage.Table;

2. Get a `CloudStorageAccount` object that represents your storage account information. Use the following code to get the your storage connection string and storage account information from the Azure service configuration.

		 CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

    **NOTE** - Use all of the above code in front of the code in the following samples.

3. Get a `CloudTableClient` object to reference the table objects in your storage account.  

	    // Create the table client.
    	CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

4. Get a `CloudTable` reference object to reference a specific table and entities.

    	// Get a reference to a table named "peopleTable"
	    CloudTable table = tableClient.GetTableReference("peopleTable");

## Create a table in code

To create the Azure table, just add a call to `CreateIfNotExistsAsync()` to the previous code.

	// Create the CloudTable if it does not exist
	await table.CreateIfNotExistsAsync();


## Insert a batch of entities

You can insert multiple entities into a table in a single write operation. The following code example creates two entity objects ("Jeff Smith" and "Ben Smith"), adds them to a `TableBatchOperation` object using the Insert method, and then starts the operation by calling `CloudTable.ExecuteBatchAsync`.

	// Get a reference to a CloudTable object named 'peopleTable' as described in "Access a table in code"

	// Create the batch operation.
	TableBatchOperation batchOperation = new TableBatchOperation();

	// Create a customer entity and add it to the table.
	CustomerEntity customer1 = new CustomerEntity("Smith", "Jeff");
	customer1.Email = "Jeff@contoso.com";
	customer1.PhoneNumber = "425-555-0104";

	// Create another customer entity and add it to the table.
	CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
	customer2.Email = "Ben@contoso.com";
	customer2.PhoneNumber = "425-555-0102";

	// Add both customer entities to the batch insert operation.
	batchOperation.Insert(customer1);
	batchOperation.Insert(customer2);

	// Execute the batch operation.
	await peopleTable.ExecuteBatchAsync(batchOperation);

## Get all of the entities in a partition
To query a table for all of the entities in a partition, use a `TableQuery` object. The following code example specifies a filter for entities where 'Smith' is the partition key. This example prints the fields of each entity in the query results to the console.

	// Get a reference to a CloudTable object named 'peopleTable' as described in "Access a table in code"

	// Construct the query operation for all customer entities where PartitionKey="Smith".
    TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"));

    // Print the fields for each customer.
    TableContinuationToken token = null;
    do
    {
    	TableQuerySegment<CustomerEntity>
        resultSegment = await peopleTable.ExecuteQuerySegmentedAsync(query, token);
        token = resultSegment.ContinuationToken;

        foreach (CustomerEntity entity in resultSegment.Results)
        {
        Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
        }
        } while (token != null);

        return View();


## Get a single entity
You can write a query to get a single, specific entity. The following code uses a `TableOperation` object to specify a customer named 'Ben Smith'. This method returns just one entity, rather than a collection, and the returned value in `TableResult.Result` is a `CustomerEntity` object. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the table service.

        // Get a reference to a CloudTable object named 'peopleTable' as described in "Access a table in code"

        // Create a retrieve operation that takes a customer entity.
        TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

	// Execute the retrieve operation.
	TableResult retrievedResult = await peopleTable.ExecuteAsync(retrieveOperation);

	// Print the phone number of the result.
	if (retrievedResult.Result != null)
	   Console.WriteLine(((CustomerEntity)retrievedResult.Result).PhoneNumber);
	else
	   Console.WriteLine("The phone number could not be retrieved.");

## Delete an entity
You can delete an entity after you find it. The following code looks for a customer entity named "Ben Smith" and if it finds it, it deletes it.

	// Get a reference to a CloudTable object named 'peopleTable' as described in "Access a table in code"

	// Create a retrieve operation that expects a customer entity.
	TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

	// Execute the operation.
	TableResult retrievedResult = peopleTable.Execute(retrieveOperation);

	// Assign the result to a CustomerEntity object.
	CustomerEntity deleteEntity = (CustomerEntity)retrievedResult.Result;

	// Create the Delete TableOperation and then execute it.
	if (deleteEntity != null)
	{
	   TableOperation deleteOperation = TableOperation.Delete(deleteEntity);

	   // Execute the operation.
	   await peopleTable.ExecuteAsync(deleteOperation);

	   Console.WriteLine("Entity deleted.");
	}

	else
	   Console.WriteLine("Couldn't delete the entity.");

## Next steps

[AZURE.INCLUDE [vs-storage-dotnet-tables-next-steps](../../includes/vs-storage-dotnet-tables-next-steps.md)]
