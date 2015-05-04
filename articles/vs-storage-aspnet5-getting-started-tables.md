<properties 
	pageTitle="Getting Started with Azure Storage" 
	description="How to get started using Azure table storage in an ASP.NET 5 project in Visual Studio" 
	services="storage" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="storage" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="kempb"/>

# Getting Started with Azure Storage (ASP.NET vNext Projects)

> [AZURE.SELECTOR]
> - [Getting Started](vs-storage-aspnet5-getting-started-tables.md)
> - [What Happened](vs-storage-aspnet5-what-happened.md)

> [AZURE.SELECTOR]
> - [Blobs](vs-storage-aspnet5-getting-started-blobs.md)
> - [Queues](vs-storage-aspnet5-getting-started-queues.md)
> - [Tables](vs-storage-aspnet5-getting-started-tables.md)

The Azure Table storage service enables you to store large amounts of structured data. The service is a NoSQL datastore that accepts authenticated calls from inside and outside the Azure cloud. Azure tables are ideal for storing structured, non-relational data.  See [How to use Table Storage from .NET](storage-dotnet-how-to-use-tables.md/#create-table "How to use Table Storage from .NET") for more information.

To programmatically access tables in ASP.NET 5 projects, you need to add the following items, if they're not already present.

1. Add the following code namespace declaration to the top of any C# file in which you wish to programmatically access Azure Storage.

		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Table;
		using Microsoft.Framework.ConfigurationModel;
		using System.Threading.Tasks;

2. Use the following code to get the configuration setting.

		IConfigurationSourceRoot config = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();

#####Get the storage connection string
Before you can do anything with a table, you need to get the connection string for the storage account the tables will live in. You can use the **CloudStorageAccount** type to represent your storage account information. If you’re using an ASP.NET vNext project, you can you call the get method of the Configuration object to get your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

**NOTE:** The APIs that perform calls out to Azure storage in ASP.NET 5 are asynchronous. See [Asynchronous Programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code below assumes async programming methods are being used.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      config.Get("MicrosoftAzureStorage:<storageAccountName>_AzureStorageConnectionString"));

#####Create a table
A **CloudTableClient** object lets you get reference objects for tables and entities. The following code creates a **CloudTableClient** object and uses it to create a new table. The code tries to reference a table named “people.” If it can’t find a table with that name, it creates one.

**NOTE:** All code in this guide assumes that the application being built is an Azure Cloud Service project and uses a storage connection string stored in the Azure application's service configuration. Also, use all of this code in front of the code in the following sections.

	// Create the table client.
	CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
	
	// Create the table if it doesn't exist.
	CloudTable table = tableClient.GetTableReference("people");
	await table.CreateIfNotExistsAsync();

#####Add an entity to a table
To add an entity to a table you create a class that defines the properties of your entity. The following code defines an entity class called **CustomerEntity** that uses the customer's first name as the row key and last name as the partition key.

	public class CustomerEntity : TableEntity
	{
	    public CustomerEntity(string lastName, string firstName)
	    {
	        this.PartitionKey = lastName;
	        this.RowKey = firstName;
	    }
	
	    public CustomerEntity() { }
	
	    public string Email { get; set; }
	
	    public string PhoneNumber { get; set; }
	}

Table operations involving entities are done using the **CloudTable** object you created earlier in "Create a Table." The **TableOperation** object represents the operation to be done. The following code example shows how to create a **CloudTable** object and a **CustomerEntity** object. To prepare the operation, a **TableOperation** is created to insert the customer entity into the table. Finally, the operation is executed by calling CloudTable.ExecuteAsync.

	// Create a new customer entity.
	CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
	customer1.Email = "Walter@contoso.com";
	customer1.PhoneNumber = "425-555-0101";
	
	// Create the TableOperation that inserts the customer entity.
	TableOperation insertOperation = TableOperation.Insert(customer1);
	
	// Execute the insert operation.
	await table.ExecuteAsync(insertOperation);

#####Insert a batch of entities
You can insert multiple entities into a table in a single write operation. The following code example creates two entity objects ("Jeff Smith" and "Ben Smith"), adds them to a **TableBatchOperation** object using the Insert method, and then starts the operation by calling CloudTable.ExecuteBatchAsync.

	// Create the CloudTable object that represents the "people" table.
	CloudTable table = tableClient.GetTableReference("people");
	
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
	await table.ExecuteBatchAsync(batchOperation);

#####Get all of the entities in a partition
To query a table for all of the entities in a partition, use a **TableQuery** object. The following code example specifies a filter for entities where 'Smith' is the partition key. This example prints the fields of each entity in the query results to the console.

	// Construct the query operation for all customer entities where PartitionKey="Smith".
    TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"));

    // Print the fields for each customer.
    TableContinuationToken token = null;
    do
    {
    	TableQuerySegment<CustomerEntity> resultSegment = await table.ExecuteQuerySegmentedAsync(query, token);
		token = resultSegment.ContinuationToken;

		foreach (CustomerEntity entity in resultSegment.Results)
    	{
    		Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
    		entity.Email, entity.PhoneNumber);
        }
    } while (token != null);

    return View();


#####Get a single entity
You can write a query to get a single, specific entity. The following code uses a **TableOperation** object to specify a customer named 'Ben Smith'. This method returns just one entity, rather than a collection, and the returned value in TableResult.Result is a **CustomerEntity** object. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the **Table** service.

	// Create the CloudTable object that represents the "people" table.
	CloudTable table = tableClient.GetTableReference("people");
	
	// Create a retrieve operation that takes a customer entity.
	TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");
	
	// Execute the retrieve operation.
	TableResult retrievedResult = await table.ExecuteAsync(retrieveOperation);
	
	// Print the phone number of the result.
	if (retrievedResult.Result != null)
	   Console.WriteLine(((CustomerEntity)retrievedResult.Result).PhoneNumber);
	else
	   Console.WriteLine("The phone number could not be retrieved.");

#####Delete an entity
You can delete an entity after you find it. The following code looks for a customer entity named "Ben Smith" and if it finds it, it deletes it.

	// Create the CloudTable that represents the "people" table.
	CloudTable table = tableClient.GetTableReference("people");
	
	// Create a retrieve operation that expects a customer entity.
	TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");
	
	// Execute the operation.
	TableResult retrievedResult = table.Execute(retrieveOperation);
	
	// Assign the result to a CustomerEntity object.
	CustomerEntity deleteEntity = (CustomerEntity)retrievedResult.Result;
	
	// Create the Delete TableOperation and then execute it.
	if (deleteEntity != null)
	{
	   TableOperation deleteOperation = TableOperation.Delete(deleteEntity);
	
	   // Execute the operation.
	   await table.ExecuteAsync(deleteOperation);
	
	   Console.WriteLine("Entity deleted.");
	}
	
	else
	   Console.WriteLine("Couldn't delete the entity.");

[Learn more about Azure Storage](http://azure.microsoft.com/documentation/services/storage/)
See also [Browsing Storage Resources in Server Explorer](http://msdn.microsoft.com/library/azure/ff683677.aspx) and [ASP.NET 5](http://www.asp.net/vnext).
