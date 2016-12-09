---
title: Get started with Azure table storage and Visual Studio Connected Services (ASP.NET) | Microsoft Docs
description: How to get started using Azure table storage in an ASP.NET project in Visual Studio after connecting to a storage account using Visual Studio Connected Services
services: storage
documentationcenter: ''
author: TomArcher
manager: douge
editor: ''

ms.assetid: af81a326-18f4-4449-bc0d-e96fba27c1f8
ms.service: storage
ms.workload: web
ms.tgt_pltfrm: vs-getting-started
ms.devlang: na
ms.topic: article
ms.date: 12/02/2016
ms.author: tarcher

---
# Get started with Azure table storage and Visual Studio Connected Services (ASP.NET)
[!INCLUDE [storage-try-azure-tools-tables](../../includes/storage-try-azure-tools-tables.md)]

## Overview

Azure Table storage enables you to store large amounts of structured data. The service is a NoSQL datastore that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data.

This article describes how to programmatically manage Azure table storage entities, performing
common tasks such as creating and deleting a table, as well as working with table entities. 

> [!NOTE]
> 
> The code sections in this article assume that you have already connected to an Azure storage account using Connected Services. Connected Services is configured by opening the Visual Studio Solution Explorer, right-clicking the project, and from the context menu, selecting the **Add->Connected Service** option. From there, follow the dialog's instructions to connect to the desired Azure storage account.      

## Create a table in code

The following steps illustrate how to programmatically create a table. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives:

         using Microsoft.Azure;
         using Microsoft.WindowsAzure.Storage;
         using Microsoft.WindowsAzure.Storage.Auth;
         using Microsoft.WindowsAzure.Storage.Table;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudTableClient** object represents a table service client.

        CloudTableClient tableClient = storageAccount.CreateCloudTableClient();


4. Get a **CloudTable** object that represents a reference to the desired table name. (Change *<table-name>* to the name of the table you want to create.)

		CloudTable table = tableClient.GetTableReference(<table-name>);

5. Call the **CloudTable.CreateIfNotExists** method to create the table if it does not yet exist.   
   
    	table.CreateIfNotExists();

## Add an entity to a table

The following steps illustrate how to programmatically add an entity to a table. In an ASP.NET MVC app, the code would go in a controller. 

1. Add the following *using* directives:

         using Microsoft.Azure;
         using Microsoft.WindowsAzure.Storage;
         using Microsoft.WindowsAzure.Storage.Auth;
         using Microsoft.WindowsAzure.Storage.Table;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudTableClient** object represents a table service client.

        CloudTableClient tableClient = storageAccount.CreateCloudTableClient();


4. Get a **CloudTable** object that represents a reference to the desired table name. (Change *<table-name>* to the name of the table to which you want to add the entity.)

		CloudTable table = tableClient.GetTableReference(<table-name>);

5. To add an entity to a table you define a class derived from **TableEntity**. The following code defines an entity class called **CustomerEntity** that uses the customer's first name as the row key and last name as the partition key.

	    public class CustomerEntity : TableEntity
	    {
	        public CustomerEntity(string lastName, string firstName)
	        {
	            this.PartitionKey = lastName;
	            this.RowKey = firstName;
	        }
	
	        public CustomerEntity() { }
	
	        public string Email { get; set; }
	    }

6. Instantiate the entity.

	    CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
	    customer1.Email = "Walter@contoso.com";

7. Create the **TableOperation** object that inserts the customer entity.

	    TableOperation insertOperation = TableOperation.Insert(customer1);

8. Execute the insert operation by calling the **CloudTable.Execute** method. You can verify the result of the operation by inspecting the **TableResult.HttpStatusCode** property. A status code of 2xx indicates the action requested by the client was processed successfully. For example, successful insertions of new entities results in an HTTP status code of 204, meaning that the operation was successfully processed and the server did not return any content.

    	TableResult result = table.Execute(insertOperation);

		// Inspect result.HttpStatusCode for success/failure.

## Add a batch of entities to a table

In addition to being able to add an entity to a table one at a time, you can also add entities in batch. This reduces the number of round-trips between your code and the Azure table service. The following steps illustrate how to programmatically add multiple entities to a table using a single operation. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives:

         using Microsoft.Azure;
         using Microsoft.WindowsAzure.Storage;
         using Microsoft.WindowsAzure.Storage.Auth;
         using Microsoft.WindowsAzure.Storage.Table;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudTableClient** object represents a table service client.

        CloudTableClient tableClient = storageAccount.CreateCloudTableClient();


4. Get a **CloudTable** object that represents a reference to the desired table name. (Change *<table-name>* to the name of the table to which you want to add the entities.)

		CloudTable table = tableClient.GetTableReference(<table-name>);

5. To add an entity to a table you define a class derived from **TableEntity**. The following code defines an entity class called **CustomerEntity** that uses the customer's first name as the row key and last name as the partition key.

	    public class CustomerEntity : TableEntity
	    {
	        public CustomerEntity(string lastName, string firstName)
	        {
	            this.PartitionKey = lastName;
	            this.RowKey = firstName;
	        }
	
	        public CustomerEntity() { }
	
	        public string Email { get; set; }
	    }

6. Instantiate the entities.

	    CustomerEntity customer1 = new CustomerEntity("Smith", "Jeff");
	    customer1.Email = "Jeff@contoso.com";
	
	    CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
	    customer2.Email = "Ben@contoso.com";

7. Get a **TableBatchOperation** object.

	    TableBatchOperation batchOperation = new TableBatchOperation();

8. Add entities to the batch insert operation.

	    batchOperation.Insert(customer1);
	    batchOperation.Insert(customer2);

9. Execute the batch insert operation by calling the **CloudTable.ExecuteBatch** method. The **CloudTable.ExecuteBatch** method returns a list of **TableResult** objects. You can verify the result of the batch insert operation by inspecting the **TableResult.HttpStatusCode** property of each **TableResult** object in the list. A status code of 2xx indicates the action requested by the client was processed successfully. For example, successful insertions of new entities results in an HTTP status code of 204, meaning that the operation was successfully processed and the server did not return any content.
    
		IList<TableResult> results = table.ExecuteBatch(batchOperation);

		// Inspect the HttpStatusCode property of each TableResult object
		// in the results list for success/failure.

## Get a single entity

The following steps illustrate how to programmatically get an entity from a table. In an ASP.NET MVC app, the code would go in a controller. 

> [!NOTE]
> 
> The code in this section references the **CustomerEntity** class and data presented in the section, [Add a batch of entities to a table](#add-a-batch-of-entities-to-a-table). 

1. Add the following *using* directives:

         using Microsoft.Azure;
         using Microsoft.WindowsAzure.Storage;
         using Microsoft.WindowsAzure.Storage.Auth;
         using Microsoft.WindowsAzure.Storage.Table;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudTableClient** object represents a table service client.

        CloudTableClient tableClient = storageAccount.CreateCloudTableClient();


4. Get a **CloudTable** object that represents a reference to the desired table name. (Change *<table-name>* to the name of the table to which you want to add the entities.)

		CloudTable table = tableClient.GetTableReference(<table-name>);

5. Create a retrieve operation object that takes an entity object derived from **TableEntity**. The first parameter is the *partitionKey*, and the second parameter is the *rowKey*. Using the **CustomerEntity** class and data presented in the section [Add a batch of entities to a table](#add-a-batch-of-entities-to-a-table), the following code snippet queries the table for a **CustomerEntity** entity with a *partitionKey* value of "Smith" and a *rowKey* value of "Ben".  

        TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

6. Execute the retrieve operation.   

	    TableResult retrievedResult = table.Execute(retrieveOperation);

7. Verify the result of the operation by inspecting the **TableOperation.HttpStatusCode** property where a status code of 200 indicates the action requested by the client was processed successfully. You can also inspect the **TableResult.Result** property that (if the operation is successful) will contain the returned entity.

        CustomerEntity customer = null;

        if (retrievedResult.HttpStatusCode == 200 && retrievedResult.Result != null)
        {
            // Process the customer entity.
			customer = retrievedResult.Result as CustomerEntity;
        }

## Get all entities in a partition

The following steps illustrate how to programmatically get all the entities from a partition. In an ASP.NET MVC app, the code would go in a controller. 

> [!NOTE]
> 
> The code in this section references the **CustomerEntity** class and data presented in the section, [Add a batch of entities to a table](#add-a-batch-of-entities-to-a-table). 

1. Add the following *using* directives:

         using Microsoft.Azure;
         using Microsoft.WindowsAzure.Storage;
         using Microsoft.WindowsAzure.Storage.Auth;
         using Microsoft.WindowsAzure.Storage.Table;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudTableClient** object represents a table service client.

        CloudTableClient tableClient = storageAccount.CreateCloudTableClient();


4. Get a **CloudTable** object that represents a reference to the desired table name. (Change *<table-name>* to the name of the table to which you want to add the entities.)

		CloudTable table = tableClient.GetTableReference(<table-name>);

5. Instantiate a **TableQuery** object specifying the query in the **Where** clause. Using the **CustomerEntity** class and data presented in the section [Add a batch of entities to a table](#add-a-batch-of-entities-to-a-table), the following code snippet queries the table for a all entities where the **PartitionKey** has a value of "Smith".

	    TableQuery<CustomerEntity> query = 
			new TableQuery<CustomerEntity>()
			.Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"));

6. Within a loop, call the **CloudTable.ExecuteQuerySegmented** method passing the query object you instantiated in the previous step.  The **CloudTable.ExecuteQuerySegmented** method returns a **TableContinuationToken** object that - when **null** - indicates that there are no more entities to retrieve. Within the loop, use another loop to iterate over the returned entities.

        TableContinuationToken token = null;
        do
        {
            TableQuerySegment<CustomerEntity>resultSegment = table.ExecuteQuerySegmented(query, token);
            token = resultSegment.ContinuationToken;

            foreach (CustomerEntity customer in resultSegment.Results)
            {
                // Process customer entity.
            }
        } while (token != null);

## Delete an entity

The following steps illustrate how to search for, and then delete an entity.

1. Add the following *using* directives:

         using Microsoft.Azure;
         using Microsoft.WindowsAzure.Storage;
         using Microsoft.WindowsAzure.Storage.Auth;
         using Microsoft.WindowsAzure.Storage.Table;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudTableClient** object represents a table service client.

        CloudTableClient tableClient = storageAccount.CreateCloudTableClient();


4. Get a **CloudTable** object that represents a reference to the desired table name. (Change *<table-name>* to the name of the table to which you want to add the entities.)

		CloudTable table = tableClient.GetTableReference(<table-name>);

5. Create a retrieve operation object that takes an entity object derived from **TableEntity**. The first parameter is the *partitionKey*, and the second parameter is the *rowKey*. Using the **CustomerEntity** class and data presented in the section [Add a batch of entities to a table](#add-a-batch-of-entities-to-a-table), the following code snippet queries the table for a **CustomerEntity** entity with a *partitionKey* value of "Smith" and a *rowKey* value of "Ben".  

        TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

6. Execute the retrieve operation.   

	    TableResult retrievedResult = table.Execute(retrieveOperation);

7. Verify the result of the operation by inspecting the **TableOperation.HttpStatusCode** property where a status code of 200 indicates the action requested by the client was processed successfully. You can also inspect the **TableResult.Result** property that (if the operation is successful) will contain the returned entity. Within the conditional statement to verify that the operation succeeded, create a delete operation (passing the returned entity from the query), and execute the delete operation.

        if (retrievedResult.HttpStatusCode == 200 && retrievedResult.Result != null)
        {
            CustomerEntity customer = retrievedResult.Result as CustomerEntity;

            // Create the delete operation.
            TableOperation deleteOperation = TableOperation.Delete(customer);

            // Execute the delete operation.
            table.Execute(deleteOperation);
        }

## Next steps
[!INCLUDE [vs-storage-dotnet-tables-next-steps](../../includes/vs-storage-dotnet-tables-next-steps.md)]

