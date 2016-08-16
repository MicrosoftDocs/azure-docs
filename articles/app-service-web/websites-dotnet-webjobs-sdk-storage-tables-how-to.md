<properties 
	pageTitle="How to use Azure table storage with the WebJobs SDK" 
	description="Learn how to use Azure table storage with the WebJobs SDK. Create tables, add entities to tables, and read existing tables." 
	services="app-service\web, storage" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/01/2016" 
	ms.author="tdykstra"/>

# How to use Azure table storage with the WebJobs SDK

## Overview

This guide provides C# code samples that show how to read and write Azure storage tables by using [WebJobs SDK](websites-dotnet-webjobs-sdk.md) version 1.x.

The guide assumes you know [how to create a WebJob project in Visual Studio with connection strings that point to your storage account](websites-dotnet-webjobs-sdk-get-started.md) or to [multiple storage accounts](https://github.com/Azure/azure-webjobs-sdk/blob/master/test/Microsoft.Azure.WebJobs.Host.EndToEndTests/MultipleStorageAccountsEndToEndTests.cs).
		
Some of the code snippets show the `Table` attribute used in functions that are [called manually](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#manual), that is, not by using one of the trigger attributes. 

## <a id="ingress"></a> How to add entities to a table

To add entities to a table, use the `Table` attribute with an `ICollector<T>` or `IAsyncCollector<T>` parameter where `T` specifies the schema of the entities you want to add. The attribute constructor takes a string parameter that specifies the name of the table. 

The following code sample adds `Person` entities to a table named *Ingress*.

		[NoAutomaticTrigger]
		public static void IngressDemo(
		    [Table("Ingress")] ICollector<Person> tableBinding)
		{
		    for (int i = 0; i < 100000; i++)
		    {
		        tableBinding.Add(
		            new Person() { 
		                PartitionKey = "Test", 
		                RowKey = i.ToString(), 
		                Name = "Name" }
		            );
		    }
		}

Typically the type you use with `ICollector` derives from `TableEntity` or implements `ITableEntity`, but it doesn't have to. Either of the following `Person` classes work with the code shown in the preceding `Ingress` method.

		public class Person : TableEntity
		{
		    public string Name { get; set; }
		}

		public class Person
		{
		    public string PartitionKey { get; set; }
		    public string RowKey { get; set; }
		    public string Name { get; set; }
		}

If you want to work directly with the Azure storage API, you can add a `CloudStorageAccount` parameter to the method signature.

## <a id="monitor"></a> Real-time monitoring

Because data ingress functions often process large volumes of data, the WebJobs SDK dashboard provides real-time monitoring data. The **Invocation Log** section tells you if the function is still running.

![Ingress function running](./media/websites-dotnet-webjobs-sdk-storage-tables-how-to/ingressrunning.png)

The **Invocation Details** page reports the function's progress (number of entities written) while it's running and gives you an opportunity to abort it. 

![Ingress function running](./media/websites-dotnet-webjobs-sdk-storage-tables-how-to/ingressprogress.png)

When the function finishes, the **Invocation Details** page reports the number of rows written.

![Ingress function finished](./media/websites-dotnet-webjobs-sdk-storage-tables-how-to/ingresssuccess.png)

## <a id="multiple"></a> How to read multiple entities from a table

To read a table, use the `Table` attribute with an `IQueryable<T>` parameter where type `T` derives from `TableEntity` or implements `ITableEntity`.

The following code sample reads and logs all rows from the `Ingress` table:
 
		public static void ReadTable(
		    [Table("Ingress")] IQueryable<Person> tableBinding,
		    TextWriter logger)
		{
		    var query = from p in tableBinding select p;
		    foreach (Person person in query)
		    {
		        logger.WriteLine("PK:{0}, RK:{1}, Name:{2}", 
		            person.PartitionKey, person.RowKey, person.Name);
		    }
		}

### <a id="readone"></a> How to read a single entity from a table

There is a `Table` attribute constructor with two additional parameters that let you specify the partition key and row key when you want to bind to a single table entity.

The following code sample reads a table row for a `Person` entity based on partition key and row key values received in a queue message:  

		public static void ReadTableEntity(
		    [QueueTrigger("inputqueue")] Person personInQueue,
		    [Table("persontable","{PartitionKey}", "{RowKey}")] Person personInTable,
		    TextWriter logger)
		{
		    if (personInTable == null)
		    {
		        logger.WriteLine("Person not found: PK:{0}, RK:{1}",
		                personInQueue.PartitionKey, personInQueue.RowKey);
		    }
		    else
		    {
		        logger.WriteLine("Person found: PK:{0}, RK:{1}, Name:{2}",
		                personInTable.PartitionKey, personInTable.RowKey, personInTable.Name);
		    }
		}


The `Person` class in this example does not have to implement `ITableEntity`.

## <a id="storageapi"></a> How to use the .NET Storage API directly to work with a table

You can also use the `Table` attribute with a `CloudTable` object for more flexibility in working with a table.

The following code sample uses a `CloudTable` object to add a single entity to the *Ingress* table. 
 
		public static void UseStorageAPI(
		    [Table("Ingress")] CloudTable tableBinding,
		    TextWriter logger)
		{
		    var person = new Person()
		        {
		            PartitionKey = "Test",
		            RowKey = "100",
		            Name = "Name"
		        };
		    TableOperation insertOperation = TableOperation.Insert(person);
		    tableBinding.Execute(insertOperation);
		}

For more information about how to use the `CloudTable` object, see [How to use Table Storage from .NET](../storage/storage-dotnet-how-to-use-tables.md). 

## <a id="queues"></a>Related topics covered by the queues how-to article

For information about how to handle table processing triggered by a queue message, or for WebJobs SDK scenarios not specific to table processing, see [How to use Azure queue storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-queues-how-to.md). 

Topics covered in that article include the following:

* Async functions
* Multiple instances
* Graceful shutdown
* Use WebJobs SDK attributes in the body of a function
* Set the SDK connection strings in code
* Set values for WebJobs SDK constructor parameters in code
* Trigger a function manually
* Write logs

## <a id="nextsteps"></a> Next steps

This guide has provided code samples that show how to handle common scenarios for working with Azure tables. For more information about how to use Azure WebJobs and the WebJobs SDK, see [Azure WebJobs Recommended Resources](http://go.microsoft.com/fwlink/?linkid=390226).
 
