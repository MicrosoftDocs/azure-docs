---
title: Validate schema when sending or receiving events
description: This article provides a walkthrough to create a .NET Core application that sends/receives events to/from Azure Event Hubs with schema validation using Schema Registry.
ms.topic: quickstart
ms.date: 01/12/2022
ms.devlang: csharp
ms.custom: devx-track-csharp, ignite-fall-2021, mode-other
---

# Quickstart: Validate schema when sending and receiving events - AMQP and .NET 

**Azure Schema Registry** is a feature of Event Hubs, which provides a central repository for schemas for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to **exchange data without having to manage and share the schema**. It also provides a simple governance framework for reusable schemas and defines relationship between schemas through a grouping construct (schema groups). For more information, see [Azure Schema Registry in Event Hubs](schema-registry-overview.md).

This quickstart shows how to send events to and receive events from an event hub with schema validation using the **Azure.Messaging.EventHubs** .NET library. 

## Prerequisites
If you're new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you do this quickstart. 

To complete this quickstart, you need the following prerequisites:
- Follow instructions from the quickstart: [Create an Event Hubs namespace and an event hub](event-hubs-create.md).
- Follow instructions from [Get the connection string](event-hubs-get-connection-string.md) to get a connection string to your Event Hubs namespace. Note down the following settings that you'll use in the current quickstart:
    - Connection string for the Event Hubs namespace
    - Name of the event hub
- **Complete the [.NET quickstart](event-hubs-dotnet-standard-getstarted-send.md)** to become familiar with sending events to and receiving events from event hubs using .NET. If you have already done the .NET quickstart before, you can skip this step. 
- **Follow instructions from [Create schemas using Schema Registry](create-schema-registry.md)** to create a schema group and a schema. When creating a schema, follow instructions from the [Create a schema](#create-a-schema) in the current quickstart article. 
- **Microsoft Visual Studio 2019**. The Azure Event Hubs client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# language versions, but the new syntax won't be available. To make use of the full syntax, we recommended that you compile with the [.NET Core SDK](https://dotnet.microsoft.com/download) 3.0 or higher and [language version](/dotnet/csharp/language-reference/configure-language-version#override-a-default) set to `latest`. If you're using Visual Studio, versions before Visual Studio 2019 aren't compatible with the tools needed to build C# 8.0 projects. Visual Studio 2019, including the free Community edition, can be downloaded [here](https://visualstudio.microsoft.com/vs/).


## Create a schema 
1. Create a schema group named **contoso-sg** using the Schema Registry portal. Use Avro as the serialization type and **None** for the compatibility mode. 
1. In that schema group, create a new Avro schema with schema name: ``Microsoft.Azure.Data.SchemaRegistry.example.Order`` using the following schema content. 

    ```json 
    {
      "namespace": "Microsoft.Azure.Data.SchemaRegistry.example",
      "type": "record",
      "name": "Order",
      "fields": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "double"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    } 
    ```

## Produce events to event hubs with schema validation


### Create console application for event producer 

1. Start Visual Studio 2019. 
1. Select **Create a new project**. 
1. On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**. 
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application. 
    1. Select **Console Application** from the results list. 
    1. Then, select **Next**. 

        :::image type="content" source="./media/getstarted-dotnet-standard-send-v2/new-send-project.png" alt-text="Image showing the New Project dialog box.":::
1. Enter **OrderProducer** for the project name, **SRQuickStart** for the solution name, and then select **OK** to create the project. 


### Add the Event Hubs NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. Run the following command to install the **Azure.Messaging.EventHubs** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.EventHubs
    Install-Package Azure.Identity
    Install-Package Microsoft.Azure.Data.SchemaRegistry.ApacheAvro -Version 1.0.0-beta.2
    Install-Package Azure.ResourceManager.Compute -Version 1.0.0-beta.1

    ```
1. Authenticate producer applications to connect to Azure via Visual Studio as shown [here](/dotnet/api/overview/azure/identity-readme#authenticating-via-visual-studio).  

### Code generation using the Avro schema  
1. You can use the same schema content and create the Avro schema file ``Order.avsc`` file inside the OrderProducer project. 
1. Then you can use this schema file to generate code for .NET. You can use any external code generation tool such as [avrogen](https://www.nuget.org/packages/Apache.Avro.Tools/) for code generation. (For example you can run `` avrogen -s .\Order.avsc `` to generate code). 
1. Once you generate code, you should have the corresponding C# types available inside your project. For the above Avro schema, it generates the C# types in ``Microsoft.Azure.Data.SchemaRegistry.example`` namespace. 


### Write code to serialize and send events to the event hub 

1. Add the following `using` statements to the top of the **Program.cs** file:

    ```csharp
    using System;
    using System.IO;
    using System.Threading;
    using Azure.Data.SchemaRegistry;
    using Azure.Identity;
    using Microsoft.Azure.Data.SchemaRegistry.ApacheAvro;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Producer;
    using System.Threading.Tasks;
    ```
1. Also you can import the generated types related to ``Order`` schema as shown below. 
    ```csharp
    using Microsoft.Azure.Data.SchemaRegistry.example;   
    ```

2. Add constants to the `Program` class for the Event Hubs connection string and the event hub name.  

    ```csharp
        // connection string to the Event Hubs namespace
        private const string connectionString = "<EVENT HUBS NAMESPACE - CONNECTION STRING>";

        // name of the event hub
        private const string eventHubName = "<EVENT HUB NAME>";
        
        // Schema Registry endpoint 
        private const string schemaRegistryEndpoint = "<EVENT HUBS NAMESPACE>.servicebus.windows.net>";
            
        // name of the consumer group   
        private const string schemaGroup = "<SCHEMA GROUP>";

    ```

    > [!NOTE]
    > Replace placeholder values with the connection string to your namespace, the name of the event hub, and schema group.
3. Add the following static property to the `Program` class. See the code comments. 

    ```csharp
        // The Event Hubs client types are safe to cache and use as a singleton for the lifetime
        // of the application, which is best practice when events are being published or read regularly.
        static EventHubProducerClient producerClient;    
    ```
1. Replace the `Main` method with the following `async Main` method. See the code comments for details. 

    ```csharp
        static async Task Main()
        {
            // Create a producer client that you can use to send events to an event hub
            producerClient = new EventHubProducerClient(connectionString, eventHubName); 
    
            // Create a schema registry client that you can use to serialize and validate data.  
            var schemaRegistryClient = new SchemaRegistryClient(endpoint: schemaRegistryEndpoint, credential: new DefaultAzureCredential());
    
            // Create a batch of events 
            using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
            
            // Create a new order object using the generated type/class 'Order'. 
            var sampleOrder = new Order { id = "12345", amount = 55.99, description = "This is a sample order." };
    
            using var memoryStream = new MemoryStream();
            // Create an Avro object serializer using the Schema Registry client object. 
            var producerSerializer = new SchemaRegistryAvroObjectSerializer(schemaRegistryClient, schemaGroup, new SchemaRegistryAvroObjectSerializerOptions { AutoRegisterSchemas = true });
    
            // Serialize events data to the memory stream object. 
            producerSerializer.Serialize(memoryStream, sampleOrder, typeof(Order), CancellationToken.None);
    
            byte[] _memoryStreamBytes;
            _memoryStreamBytes = memoryStream.ToArray();
    
            // Create event data with serialized data and add it to an event batch. 
            eventBatch.TryAdd(new EventData(_memoryStreamBytes));
    
            // Send serilized event data to event hub. 
            await producerClient.SendAsync(eventBatch);
            Console.WriteLine("A batch of 1 order has been published.");
        }
    ```
5. Build the project, and ensure that there are no errors.
6. Run the program and wait for the confirmation message. 

    ```csharp
    A batch of 1 order has been published.
    ```
1. In the Azure portal, you can verify that the event hub has received the events. Switch to **Messages** view in the **Metrics** section. Refresh the page to update the chart. It may take a few seconds for it to show that the messages have been received. 

    :::image type="content" source="./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png" alt-text="Image of the Azure portal page to verify that the event hub received the events." lightbox="./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png":::




## Consume events from event hubs with schema validation
This section shows how to write a .NET Core console application that receives events from an event hub and use schema registry to de-serialize event data. 


### Create consumer application

1. In the Solution Explorer window, right-click the **SRQuickStart** solution, point to **Add**, and select **New Project**. 
1. Select **Console application**, and select **Next**. 
1. Enter **OrderConsumer** for the **Project name**, and select **Create**. 
1. In the **Solution Explorer** window, right-click **OrderConsumer**, and select **Set as a Startup Project**. 

### Add the Event Hubs NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. In the **Package Manager Console** window, confirm that **OrderConsumer** is selected for the **Default project**. If not, use the drop-down list to select **OrderConsumer**.


1. Run the following command to install the required NuGet package:

    ```cmd
    Install-Package Azure.Messaging.EventHubs
    Install-Package Azure.Messaging.EventHubs.Processor
    Install-Package Azure.Identity
    Install-Package Microsoft.Azure.Data.SchemaRegistry.ApacheAvro -Version 1.0.0-beta.2
    Install-Package Azure.ResourceManager.Compute -Version 1.0.0-beta.1

    ```
1. Authenticate producer applications to connect to Azure via Visual Studio as shown [here](/dotnet/api/overview/azure/identity-readme#authenticating-via-visual-studio). 



### Code generation using the Avro schema  
1. You can use the same schema content and create the Avro schema file ``Order.avsc`` file inside the ``OrderProducer`` project. 
1. Then you can use this schema file to generate code for .NET. For this, you can use any external code generation tool such as [avrogen](https://www.nuget.org/packages/Apache.Avro.Tools/). (For example you can run `` avrogen -s .\Order.avsc `` to generate code). 
1. Once you generate code, you should have the corresponding C# types available inside your project. For the above Avro schema, it generates the C# types in ``Microsoft.Azure.Data.SchemaRegistry.example`` namespace. 


### Write code to receive events and deserialize them using Schema Registry


1. Add the following `using` statements to the top of the **Program.cs** file:

    ```csharp
    using System;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using System.Threading;
    using Azure.Data.SchemaRegistry;
    using Azure.Identity;
    using Microsoft.Azure.Data.SchemaRegistry.ApacheAvro;
    using Azure.Storage.Blobs;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Consumer;
    using Azure.Messaging.EventHubs.Processor;
    ```
1. Also you can import the generated types related to ``Order`` schema as shown below. 
    ```csharp
    using Microsoft.Azure.Data.SchemaRegistry.example;   
    ```

2. Add constants to the `Program` class for the Event Hubs connection string and the event hub name.  

    ```csharp
        // connection string to the Event Hubs namespace
        private const string connectionString = "<EVENT HUBS NAMESPACE - CONNECTION STRING>";

        // name of the event hub
        private const string eventHubName = "<EVENT HUB NAME>";

        private const string blobStorageConnectionString = "<AZURE STORAGE CONNECTION STRING>";
        
        private const string blobContainerName = "<BLOB CONTAINER NAME>";
        
        // Schema Registry endpoint 
        private const string schemaRegistryEndpoint = "<EVENT HUBS NAMESPACE>.servicebus.windows.net>";
            
        // name of the consumer group   
        private const string schemaGroup = "<SCHEMA GROUP>";

    ```

3. Add the following static properties to the `Program` class. 

    ```csharp
        static BlobContainerClient storageClient;

        // The Event Hubs client types are safe to cache and use as a singleton for the lifetime
        // of the application, which is best practice when events are being published or read regularly.        
        static EventProcessorClient processor;    
    ```
1. Replace the `Main` method with the following `async Main` method. See the code comments for details. 

    ```csharp
        static async Task Main()
        {
            // Read from the default consumer group: $Default
            string consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

            // Create a blob container client that the event processor will use 
            storageClient = new BlobContainerClient(blobStorageConnectionString, blobContainerName);

            // Create an event processor client to process events in the event hub
            processor = new EventProcessorClient(storageClient, consumerGroup, ehubNamespaceConnectionString, eventHubName);

            // Register handlers for processing events and handling errors
            processor.ProcessEventAsync += ProcessEventHandler;
            processor.ProcessErrorAsync += ProcessErrorHandler;

            // Start the processing
            await processor.StartProcessingAsync();

            // Wait for 30 seconds for the events to be processed
            await Task.Delay(TimeSpan.FromSeconds(30));

            // Stop the processing
            await processor.StopProcessingAsync();
        }
    ```
1. Now, add the following event handler method that includes event de-serialization logic with the schema registry 
    ```csharp
        static async Task ProcessEventHandler(ProcessEventArgs eventArgs)
        {
            // Create a schema registry client that you can use to deserialize and validate data.  
            var schemaRegistryClient = new SchemaRegistryClient(endpoint: schemaRegistryEndpoint, credential: new DefaultAzureCredential());
    
            // Retrieve event data and convert it to a byte array. 
            byte[] _memoryStreamBytes = eventArgs.Data.Body.ToArray();
            using var consumerMemoryStream = new MemoryStream(_memoryStreamBytes);
    
            var consumerSerializer = new SchemaRegistryAvroObjectSerializer(schemaRegistryClient, schemaGroup, new SchemaRegistryAvroObjectSerializerOptions { AutoRegisterSchemas = false });
            consumerMemoryStream.Position = 0;
    
            // Deserialize event data and create order object using schema registry. 
            Order sampleOrder = (Order)consumerSerializer.Deserialize(consumerMemoryStream, typeof(Order), CancellationToken.None);
            Console.WriteLine("Received - Order ID: " + sampleOrder.id);                 
    
            // Update checkpoint in the blob storage so that the app receives only new events the next time it's run
            await eventArgs.UpdateCheckpointAsync(eventArgs.CancellationToken);   
        }

    ```

 
1. Now, add the following error handler methods to the class. 

    ```csharp
        static Task ProcessErrorHandler(ProcessErrorEventArgs eventArgs)
        {
            // Write details about the error to the console window
            Console.WriteLine($"\tPartition '{ eventArgs.PartitionId}': an unhandled exception was encountered. This was not expected to happen.");
            Console.WriteLine(eventArgs.Exception.Message);
            return Task.CompletedTask;
        }
  
    ```
1. Build the project, and ensure that there are no errors.


6. Run the receiver application. 
1. You should see a message that the events have been received. 

    ```bash
    Received - Order ID: 12345
    ```
    These events are the three events you sent to the event hub earlier by running the sender program. 


## Next steps

> [!div class="nextstepaction"]
> Checkout [Azure Schema Registry client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/schemaregistry/Azure.Data.SchemaRegistry)
