---
title: Publish and process Atlas Kafka topics messages via Event Hubs
description: Get a walkthrough on how to use Event Hubs and a .NET Core application to send/receive events to/from Microsoft Purview's Apache Atlas Kafka topics. Try the Azure.Messaging.EventHubs package.
ms.topic: quickstart
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.devlang: csharp
ms.date: 09/29/2022
ms.custom: mode-other
---

# Use Event Hubs and .NET to send and receive Atlas Kafka topics messages
This quickstart teaches you how to send and receive *Atlas Kafka* topics events.  We'll make use of *Azure Event Hubs* and the **Azure.Messaging.EventHubs** .NET library.

> [!IMPORTANT]
> A managed event hub is created automatically when your *Microsoft Purview* account is created. See, [Microsoft Purview account creation](create-catalog-portal.md). You can publish messages to Event Hubs Kafka topic, ATLAS_HOOK. Microsoft Purview will receive it, process it and notify Kafka topic ATLAS_ENTITIES of entity changes. This quickstart uses the new **Azure.Messaging.EventHubs** library.


## Prerequisites
If you're new to Event Hubs, see [Event Hubs overview](../event-hubs/event-hubs-about.md) before you complete this quickstart.

To follow this quickstart, you need certain prerequisites in place:

- **A Microsoft Azure subscription**. To use Azure services, including Event Hubs, you need an Azure subscription.  If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- **Microsoft Visual Studio 2022**. The Event Hubs client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# versions, but the new syntax won't be available. To make use of the full syntax, it's recommended that you compile with the [.NET Core SDK](https://dotnet.microsoft.com/download) 3.0 or higher and [language version](/dotnet/csharp/language-reference/configure-language-version#override-a-default) set to `latest`. If you're using a Visual Studio version prior to Visual Studio 2019, it doesn't have the tools needed to build C# 8.0 projects. Visual Studio 2022, including the free Community edition, can be downloaded [here](https://visualstudio.microsoft.com/vs/).
- An active [Microsoft Purview account](create-catalog-portal.md) with an Event Hubs namespace enabled. This option can be enabled during account creation or in **Managed Resources** under settings on your Microsoft Purview account page in the [Azure portal](https://portal.azure.com). Select the toggle to enable, then save. It can take a few minutes for the namespace to be available after it's enabled.
    :::image type="content" source="media/manage-eventhub-kafka-dotnet/enable-disable-event-hubs.png" alt-text="Screenshot showing the Event Hubs namespace toggle highlighted on the Managed resources page of the Microsoft Purview account page in the Azure portal.":::

    >[!NOTE]
    >Enabling this Event Hubs namespace does incur a cost for the namespace. For specific details, see [the pricing page](https://azure.microsoft.com/pricing/details/purview/).

## Publish messages to Microsoft Purview 
Let's create a .NET Core console application that sends events to Microsoft Purview via Event Hubs Kafka topic, **ATLAS_HOOK**.

## Create a Visual Studio project

Next create a C# .NET console application in Visual Studio:

1. Launch **Visual Studio**.
2. In the Start window, select **Create a new project** > **Console App (.NET Framework)**. .NET version 4.5.2 or above is required.
3. In **Project name**, enter **PurviewKafkaProducer**.
4. Select **Create** to create the project.

### Create a console application

1. Start Visual Studio 2022.
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

### Write code that sends messages to the event hub

1. Add the following `using` statements to the top of the **Program.cs** file:

    ```csharp
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Producer;
    ```

2. Add constants to the `Program` class for the Event Hubs connection string and Event Hubs name.

    ```csharp
    private const string connectionString = "<EVENT HUBS NAMESPACE - CONNECTION STRING>";
    private const string eventHubName = "<EVENT HUB NAME>";
    ```

    You can get the Event Hubs namespace associated with the Microsoft Purview account by looking at the Atlas kafka endpoint primary/secondary connection strings. These can be found in **Properties** tab of your account.

    :::image type="content" source="media/manage-eventhub-kafka-dotnet/properties.png" alt-text="A screenshot that shows an Event Hubs Namespace.":::

    The event hub name for sending messages to Microsoft Purview is **ATLAS_HOOK**.

3. Replace the `Main` method with the following `async Main` method and add an `async ProduceMessage` to push messages into Microsoft Purview. See the comments in the code for details.

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
5. Build the project. Ensure that there are no errors.
6. Run the program and wait for the confirmation message.

    > [!NOTE]
    > For the complete source code with more informational comments, see [this file in GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample04_PublishingEvents.md)

### Sample code that creates an sql table with two columns using a Create Entity JSON message

```json
	
	{
    "msgCreatedBy":"nayenama",
    "message":{
        "type":"ENTITY_CREATE_V2",
        "user":"admin",
        "entities":{
            "entities":[
                {
                    "typeName":"azure_sql_table",
                    "attributes":{
                        "owner":"admin",
                        "temporary":false,
                        "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable",
                        "name":"SalesOrderTable",
                        "description":"Sales Order Table added via Kafka"
                    },
                    "relationshipAttributes":{
                        "columns":[
                            {
                                "guid":"-1102395743156037",
                                "typeName":"azure_sql_column",
                                "uniqueAttributes":{
                                    "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderID"
                                }
                            },
                            {
                                "guid":"-1102395743156038",
                                "typeName":"azure_sql_column",
                                "uniqueAttributes":{
                                    "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderDate"
                                }
                            }
                        ]
                    },
                    "guid":"-1102395743156036",
                    "version":0
                }
            ],
            "referredEntities":{
                "-1102395743156037":{
                    "typeName":"azure_sql_column",
                    "attributes":{
                        "owner":null,
                        "userTypeId":61,
                        "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderID",
                        "precision":23,
                        "length":8,
                        "description":"Sales Order ID",
                        "scale":3,
                        "name":"OrderID",
                        "data_type":"int"
                    },
                    "relationshipAttributes":{
                        "table":{
                            "guid":"-1102395743156036",
                            "typeName":"azure_sql_table",
                            "entityStatus":"ACTIVE",
                            "displayText":"SalesOrderTable",
                            "uniqueAttributes":{
                                "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable"
                            }
                        }
                    },
                    "guid":"-1102395743156037",
                    "version":2
                },
                "-1102395743156038":{
                    "typeName":"azure_sql_column",
                    "attributes":{
                        "owner":null,
                        "userTypeId":61,
                        "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable#OrderDate",
                        "description":"Sales Order Date",
                        "scale":3,
                        "name":"OrderDate",
                        "data_type":"datetime"
                    },
                    "relationshipAttributes":{
                        "table":{
                            "guid":"-1102395743156036",
                            "typeName":"azure_sql_table",
                            "entityStatus":"ACTIVE",
                            "displayText":"SalesOrderTable",
                            "uniqueAttributes":{
                                "qualifiedName":"mssql://nayenamakafka.eventhub.sql.net/salespool/dbo/SalesOrderTable"
                            }
                        }
                    },
                    "guid":"-1102395743156038",
                    "status":"ACTIVE",
                    "createdBy":"ServiceAdmin",
                    "version":0
                }
            }
        }
    },
    "version":{
        "version":"1.0.0"
    },
    "msgCompressionKind":"NONE",
    "msgSplitIdx":1,
    "msgSplitCount":1
}


```

## Receive Microsoft Purview messages
Next learn how to write a .NET Core console application that receives messages from event hubs using an event processor. The event processor manages persistent checkpoints and parallel receptions from event hubs. This simplifies the process of receiving events. You need to use the ATLAS_ENTITIES event hub to receive messages from Microsoft Purview.

> [!WARNING]
> Event Hubs SDK uses the most recent version of Storage API available. That version may not necessarily be available on your Stack Hub platform. If you run this code on Azure Stack Hub, you will experience runtime errors unless you target the specific version you are using. If you're using Azure Blob Storage as a checkpoint store, review the [supported Azure Storage API version for your Azure Stack Hub build](/azure-stack/user/azure-stack-acs-differences?#api-version) and in your code, target that version.
>
> The highest available version of the Storage service is version 2019-02-02. By default, the Event Hubs SDK client library uses the highest available version on Azure (2019-07-07 at the time of the release of the SDK). If you are using Azure Stack Hub version 2005, in addition to following the steps in this section, you will also need to add code that targets the Storage service API version 2019-02-02. To learn how to target a specific Storage API version, see [this sample in GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/).
 

### Create an Azure Storage and a blob container
We'll use Azure Storage as the checkpoint store. Use the following steps to create an Azure Storage account.

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
3. [Get the connection string for the storage account](../storage/common/storage-configure-connection-string.md)

    Make note of the connection string and the container name. You'll use them in the receive code.


### Create a Visual Studio project for the receiver

1. In the Solution Explorer window, select and hold (or right-click) the **EventHubQuickStart** solution, point to **Add**, and select **New Project**. 
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
1. Add constants to the `Program` class for the Event Hubs connection string and the event hub name. Replace placeholders in brackets with the real values that you got when you created the event hub and the storage account (access keys - primary connection string). Make sure that the `{Event Hubs namespace connection string}` is the namespace-level connection string, and not the event hub string.

    ```csharp
        private const string ehubNamespaceConnectionString = "<EVENT HUBS NAMESPACE - CONNECTION STRING>";
        private const string eventHubName = "<EVENT HUB NAME>";
        private const string blobStorageConnectionString = "<AZURE STORAGE CONNECTION STRING>";
        private const string blobContainerName = "<BLOB CONTAINER NAME>";
    ```

    You can get event hub namespace associated with your Microsoft Purview account by looking at your Atlas kafka endpoint primary/secondary connection strings. This can be found in the **Properties** tab of your Microsoft Purview account.

    :::image type="content" source="media/manage-eventhub-kafka-dotnet/properties.png" alt-text="A screenshot that shows an Event Hubs Namespace.":::

    Use **ATLAS_ENTITIES** as the event hub name when sending messages to Microsoft Purview.

3. Replace the `Main` method with the following `async Main` method. See the comments in the code for details.

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
1. Now add the following event and error handler methods to the class.

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
1. Build the project. Ensure that there are no errors.

    > [!NOTE]
    > For the complete source code with more informational comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/Sample01_HelloWorld.md).
6. Run the receiver application.

### An example of a Message received from Microsoft Purview

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


## Next steps
Check out more examples in GitHub.

- [Event Hubs samples in GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples)
- [Event processor samples in GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples)
- [An introduction to Atlas notifications](https://atlas.apache.org/2.0.0/Notifications.html)
