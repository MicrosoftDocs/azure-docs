---
title: Publish messages to and process messages from Azure Purview's Atlas Kafka topics via Event Hubs using .NET
description: This article provides a walkthrough to create a .NET Core application that sends/receives events to/from Purview's Apache Atlas Kafka topics by using the latest Azure.Messaging.EventHubs package. 
ms.topic: quickstart
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.devlang: dotnet
ms.date: 04/15/2021
---

# Publish messages to and process messages from Azure Purview's Atlas Kafka topics via Event Hubs using .NET 
This quickstart shows how to send events to and receive events from Azure Purview's Atlas Kafka topics via event hub using the **Azure.Messaging.EventHubs** .NET library. 

> [!IMPORTANT]
> A managed event hub is created as part of Purview account creation, see [Purview account creation](create-catalog-portal.md). You can publish messages to the event hub kafka topic ATLAS_HOOK and Purview will consume and process it. Purview will notify entity changes to event hub kafka topic ATLAS_ENTITIES and user can consume and process it.This quickstart uses the new **Azure.Messaging.EventHubs** library. 


## Prerequisites
If you're new to Azure Event Hubs, see [Event Hubs overview](../event-hubs/event-hubs-about.md) before you do this quickstart. 

To complete this quickstart, you need the following prerequisites:

- **Microsoft Azure subscription**. To use Azure services, including Azure Event Hubs, you need a subscription.  If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- **Microsoft Visual Studio 2019**. The Azure Event Hubs client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# language versions, but the new syntax won't be available. To make use of the full syntax, it is recommended that you compile with the [.NET Core SDK](https://dotnet.microsoft.com/download) 3.0 or higher and [language version](/dotnet/csharp/language-reference/configure-language-version#override-a-default) set to `latest`. If you're using Visual Studio, versions before Visual Studio 2019 aren't compatible with the tools needed to build C# 8.0 projects. Visual Studio 2019, including the free Community edition, can be downloaded [here](https://visualstudio.microsoft.com/vs/).

## Publish messages to Purview 
This section shows you how to create a .NET Core console application to send events to an Purview via event hub kafka topic **ATLAS_HOOK**. 

## Create a Visual Studio project

Next, create a C# .NET console application in Visual Studio:

1. Launch **Visual Studio**.
2. In the Start window, select **Create a new project** > **Console App (.NET Framework)**. .NET version 4.5.2 or above is required.
3. In **Project name**, enter **PurviewKafkaProducer**.
4. Select **Create** to create the project.

### Create a console application

1. Start Visual Studio 2019. 
1. Select **Create a new project**. 
1. On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**. 
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application. 
    1. Select **Console App (.NET Core)** from the results list. 
    1. Then, select **Next**. 


### Add the Event Hubs NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. Run the following command to install the **Azure.Messaging.EventHubs** NuGet package and **Azure.Messaging.EventHubs.Producer** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.EventHubs
    ```
	
	```cmd
    Install-Package Azure.Messaging.EventHubs.Producer
    ```    


### Write code to send messages to the event hub

1. Add the following `using` statements to the top of the **Program.cs** file:

    ```csharp
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Producer;
    ```

2. Add constants to the `Program` class for the Event Hubs connection string and Event Hub name. 

    ```csharp
    private const string connectionString = "<EVENT HUBS NAMESPACE - CONNECTION STRING>";
    private const string eventHubName = "<EVENT HUB NAME>";
    ```

    You can get event hub namespace associated with purview account by looking at Atlas kafka endpoint primary/secondary connection strings in properties tab of Purview account.

    :::image type="content" source="media/manage-eventhub-kafka-dotnet/properties.png" alt-text="Event Hub Namespace":::

    The event hub name should be **ATLAS_HOOK** for sending messages to Purview.

3. Replace the `Main` method with the following `async Main` method and add an `async ProduceMessage` to push messages into Purview. See the code comments for details. 

    ```csharp
        static async Task Main()
        {
            // Read from the default consumer group: $Default
            string consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;
			
			/ Create an event producer client to add events in the event hub
            EventHubProducerClient producer = new EventHubProducerClient(ehubNamespaceConnectionString, eventHubName);
			
			await ProduceMessage(producer);
        }
		
		static async Task ProduceMessage(EventHubProducerClient producer)
     
        {
			// Create a batch of events 
			using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();

			// Add events to the batch. An event is a represented by a collection of bytes and metadata. 
			eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes("<First event>")));
			eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes("<Second event>")));
			eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes("<Third event>")));

			// Use the producer client to send the batch of events to the event hub
			await producerClient.SendAsync(eventBatch);
			Console.WriteLine("A batch of 3 events has been published.");
			 
		}
    ```
5. Build the project, and ensure that there are no errors.
6. Run the program and wait for the confirmation message. 

    > [!NOTE]
    > For the complete source code with more informational comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample04_PublishingEvents.md)

### Sample Create Entity JSON message to create a sql table with two columns.

```json
	
	{
	"msgCreatedBy": "nayenama",
	"message": {
	"entities": {
    "referredEntities": {
        "-1102395743156037": {
            "typeName": "azure_sql_column",
            "attributes": {
                "owner": null,
                "userTypeId": 61,
                "qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderID",
                "precision": 23,
                "length": 8,
                "description": "Sales Order ID",
                "scale": 3,
                "name": "OrderID",
                "data_type": "int",
				"table": {
                    "guid": "-1102395743156036",
                    "typeName": "azure_sql_table",
                    "entityStatus": "ACTIVE",
                    "displayText": "SalesOrderTable",
                    "uniqueAttributes": {
								"qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable"
					}
            }
			},
            "guid": "-1102395743156037",
            "version": 2
        },
        "-1102395743156038": {
		 "typeName": "azure_sql_column",
            "attributes": {
                "owner": null,
                "userTypeId": 61,
                "qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderDate",
                "description": "Sales Order Date",
                "scale": 3,
                "name": "OrderDate",
                "data_type": "datetime",
				"table": {
                    "guid": "-1102395743156036",
                    "typeName": "azure_sql_table",
                    "entityStatus": "ACTIVE",
                    "displayText": "SalesOrderTable",
                    "uniqueAttributes": {
								"qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable"
					}
            }
			},
            "guid": "-1102395743156038",
            "status": "ACTIVE",
            "createdBy": "ServiceAdmin",
            "version": 0
        }
		},
		"entity": 
				{
					"typeName": "azure_sql_table",
					"attributes": {
						"owner": "admin",
						"temporary": false,
						"qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable",
						"name" : "SalesOrderTable",
						"description": "Sales Order Table added via Kafka",
						"columns": [
							{
								"guid": "-1102395743156037",
								"typeName": "azure_sql_column",
								"uniqueAttributes": {
									"qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderID"
								}
							},
							{
								"guid": "-1102395743156038",
								"typeName": "azure_sql_column",
								"uniqueAttributes": {
									"qualifiedName": "mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderDate"
								}
							}
						]
						},
						"guid": "-1102395743156036",
					"version": 0				
					}
				},
		"type": "ENTITY_CREATE_V2",
		"user": "admin"
	},
	"version": {
		"version": "1.0.0"
	},
	"msgCompressionKind": "NONE",
	"msgSplitIdx": 1,
	"msgSplitCount": 1
}

``` 

## Consume messages from Purview
This section shows how to write a .NET Core console application that receives messages from an event hub using an event processor. You need to use ATLAS_ENTITIES event hub to receive messages from Purview.The event processor simplifies receiving events from event hubs by managing persistent checkpoints and parallel receptions from those event hubs. 

> [!WARNING]
> If you run this code on Azure Stack Hub, you will experience runtime errors unless you target a specific Storage API version. That's because the Event Hubs SDK uses the latest available Azure Storage API available in  Azure that may not be available on your Azure Stack Hub platform. Azure Stack Hub may support a different version of Storage Blob SDK than those typically available on Azure. If you are using Azure Blob Storage as a checkpoint store, check the [supported Azure Storage API version for your Azure Stack Hub build](/azure-stack/user/azure-stack-acs-differences?#api-version) and target that version in your code. 
>
> For example, If you are running on Azure Stack Hub version 2005, the highest available version for the Storage service is version 2019-02-02. By default, the Event Hubs SDK client library uses the highest available version on Azure (2019-07-07 at the time of the release of the SDK). In this case, besides following steps in this section, you will also need to add code to target the Storage service API version 2019-02-02. For an example on how to target a specific Storage API version, see [this sample on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/). 
 

### Create an Azure Storage and a blob container
In this quickstart, you use Azure Storage as the checkpoint store. Follow these steps to create an Azure Storage account. 

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
3. [Get the connection string to the storage account](../storage/common/storage-configure-connection-string.md)

    Note down the connection string and the container name. You'll use them in the receive code. 


### Create a project for the receiver

1. In the Solution Explorer window, right-click the **EventHubQuickStart** solution, point to **Add**, and select **New Project**. 
1. Select **Console App (.NET Core)**, and select **Next**. 
1. Enter **PurviewKafkaConsumer** for the **Project name**, and select **Create**. 

### Add the Event Hubs NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. Run the following command to install the **Azure.Messaging.EventHubs** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.EventHubs
    ```
1. Run the following command to install the **Azure.Messaging.EventHubs.Processor** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.EventHubs.Processor
    ```    

### Update the Main method 

1. Add the following `using` statements at the top of the **Program.cs** file.

    ```csharp
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using Azure.Storage.Blobs;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Consumer;
    using Azure.Messaging.EventHubs.Processor;
    ```
1. Add constants to the `Program` class for the Event Hubs connection string and the event hub name. Replace placeholders in brackets with the proper values that you got when creating the event hub. Replace placeholders in brackets with the proper values that you got when creating the event hub and the storage account (access keys - primary connection string). Make sure that the `{Event Hubs namespace connection string}` is the namespace-level connection string, and not the event hub string.

    ```csharp
        private const string ehubNamespaceConnectionString = "<EVENT HUBS NAMESPACE - CONNECTION STRING>";
        private const string eventHubName = "<EVENT HUB NAME>";
        private const string blobStorageConnectionString = "<AZURE STORAGE CONNECTION STRING>";
        private const string blobContainerName = "<BLOB CONTAINER NAME>";
    ```
	
    You can get event hub namespace associated with purview account by looking at Atlas kafka endpoint primary/secondary connection strings in properties tab of Purview account.

    :::image type="content" source="media/manage-eventhub-kafka-dotnet/properties.png" alt-text="Event Hub Namespace":::

    The event hub name should be **ATLAS_ENTITIES** for sending messages to Purview.

3. Replace the `Main` method with the following `async Main` method. See the code comments for details. 

    ```csharp
        static async Task Main()
        {
            // Read from the default consumer group: $Default
            string consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

            // Create a blob container client that the event processor will use 
            BlobContainerClient storageClient = new BlobContainerClient(blobStorageConnectionString, blobContainerName);

            // Create an event processor client to process events in the event hub
            EventProcessorClient processor = new EventProcessorClient(storageClient, consumerGroup, ehubNamespaceConnectionString, eventHubName);

            // Register handlers for processing events and handling errors
            processor.ProcessEventAsync += ProcessEventHandler;
            processor.ProcessErrorAsync += ProcessErrorHandler;

            // Start the processing
            await processor.StartProcessingAsync();

            // Wait for 10 seconds for the events to be processed
            await Task.Delay(TimeSpan.FromSeconds(10));

            // Stop the processing
            await processor.StopProcessingAsync();
        }    
    ```
1. Now, add the following event and error handler methods to the class. 

    ```csharp
        static async Task ProcessEventHandler(ProcessEventArgs eventArgs)
        {
            // Write the body of the event to the console window
            Console.WriteLine("\tReceived event: {0}", Encoding.UTF8.GetString(eventArgs.Data.Body.ToArray()));

            // Update checkpoint in the blob storage so that the app receives only new events the next time it's run
            await eventArgs.UpdateCheckpointAsync(eventArgs.CancellationToken);
        }

        static Task ProcessErrorHandler(ProcessErrorEventArgs eventArgs)
        {
            // Write details about the error to the console window
            Console.WriteLine($"\tPartition '{ eventArgs.PartitionId}': an unhandled exception was encountered. This was not expected to happen.");
            Console.WriteLine(eventArgs.Exception.Message);
            return Task.CompletedTask;
        }    
    ```
1. Build the project, and ensure that there are no errors.

    > [!NOTE]
    > For the complete source code with more informational comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/Sample01_HelloWorld.md).
6. Run the receiver application. 

### Sample Message received from Purview

```json
{
	"version":
		{"version":"1.0.0",
		 "versionParts":[1]
		},
		 "msgCompressionKind":"NONE",
		 "msgSplitIdx":1,
		 "msgSplitCount":1,
		 "msgSourceIP":"10.244.155.5",
		 "msgCreatedBy":
		 "",
		 "msgCreationTime":1618588940869,
		 "message":{
			"type":"ENTITY_NOTIFICATION_V2",
			"entity":{
				"typeName":"azure_sql_table",
					"attributes":{
						"owner":"admin",
						"createTime":0,
						"qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable",
						"name":"SalesOrderTable",
						"description":"Sales Order Table"
						},
						"guid":"ead5abc7-00a4-4d81-8432-d5f6f6f60000",
						"status":"ACTIVE",
						"displayText":"SalesOrderTable"
					},
					"operationType":"ENTITY_UPDATE",
					"eventTime":1618588940567
				}
}
```

> [!IMPORTANT]
> Atlas currently supports the following operation types: **ENTITY_CREATE_V2**, **ENTITY_PARTIAL_UPDATE_V2**, **ENTITY_FULL_UPDATE_V2**, **ENTITY_DELETE_V2**. Pushing messages to Purview is currently enabled by default. If the scenario involves reading from Purview  contact us as it needs to be allow-listed. (provide subscription id and name of Purview account).


## Next steps
Check out the samples on GitHub. 

- [Event Hubs samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples)
- [Event processor samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples)
- [Atlas introduction to notifications](https://atlas.apache.org/2.0.0/Notifications.html)