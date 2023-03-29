---
title: 'Quickstart: Send or receive events using .NET'
description: A quickstart to create a .NET Core application that sends events to Azure Event Hubs and then receive those events by using the Azure.Messaging.EventHubs package.
ms.topic: quickstart
ms.service: event-hubs
ms.date: 03/09/2023
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api, contperf-fy22q3, passwordless-dotnet
---

# Quickstart: Send events to and receive events from Azure Event Hubs using .NET
In this quickstart, you learn how to send events to an event hub and then receive those events from the event hub using the **Azure.Messaging.EventHubs** .NET library. 

> [!NOTE]
> Quickstarts are for you to quickly ramp up on the service. If you are already familiar with the service, you may want to see .NET samples for Event Hubs in our .NET SDK repository on GitHub: [Event Hubs samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples), [Event processor samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples).

## Prerequisites
If you're new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you go through this quickstart. 

To complete this quickstart, you need the following prerequisites:

- **Microsoft Azure subscription**. To use Azure services, including Azure Event Hubs, you need a subscription.  If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- **Microsoft Visual Studio 2022**. The Azure Event Hubs client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# language versions, but the new syntax isn't available. To make use of the full syntax, we recommend that you compile with the [.NET Core SDK](https://dotnet.microsoft.com/download) 3.0 or higher and [language version](/dotnet/csharp/language-reference/configure-language-version#override-a-default) set to `latest`. If you're using Visual Studio, versions before Visual Studio 2022 aren't compatible with the tools needed to build C# 8.0 projects. Visual Studio 2022, including the free Community edition, can be downloaded [here](https://visualstudio.microsoft.com/vs/).
- **Create an Event Hubs namespace and an event hub**. The first step is to use the Azure portal to create an Event Hubs namespace and an event hub in the namespace. Then, obtain the management credentials that your application needs to communicate with the event hub. To create a namespace and an event hub, see [Quickstart: Create an event hub using Azure portal](event-hubs-create.md).

### Authenticate the app to Azure

[!INCLUDE [event-hub-passwordless-template-tabbed](../../includes/passwordless/event-hub/event-hub-passwordless-template-tabbed.md)]

## Send events to the event hub
This section shows you how to create a .NET Core console application to send events to the event hub you created. 

### Create a console application

1. If you have Visual Studio 2022 open already, select **File** on the menu, select **New**, and then select **Project**. Otherwise, launch Visual Studio 2022 and select **Create a new project** if you see a popup window. 
1.  On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**. 
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application. 
    1. Select **Console Application** from the results list. 
    1. Then, select **Next**. 

        :::image type="content" source="./media/getstarted-dotnet-standard-send-v2/new-send-project.png" alt-text="Image showing the New Project dialog box":::
1. Enter **EventHubsSender** for the project name, **EventHubsQuickStart** for the solution name, and then select **Next**. 

    :::image type="content" source="./media/getstarted-dotnet-standard-send-v2/project-solution-names.png" alt-text="Image showing the page where you enter solution and project names":::
1. On the **Additional information** page, select **Create**.

### Add the NuGet packages to the project

### [Passwordless (Recommended)](#tab/passwordless)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Run the following commands to install **Azure.Messaging.EventHubs** and **Azure.Identity** NuGet packages. Press **ENTER** to run the second command. 

    ```powershell
    Install-Package Azure.Messaging.EventHubs
    Install-Package Azure.Identity
    ```

### [Connection String](#tab/connection-string)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Run the following command to install the **Azure.Messaging.EventHubs** NuGet package:

    ```powershell
    Install-Package Azure.Messaging.EventHubs
    ```

---


### Write code to send events to the event hub

## [Passwordless (Recommended)](#tab/passwordless)

1. Replace the existing code in the `Program.cs` file with the following sample code. Then, replace `<EVENT_HUB_NAMESPACE>` and `<HUB_NAME>` placeholder values for the `EventHubProducerClient` parameters with the names of your Event Hubs namespace and the event hub. For example: `"spehubns0309.servicebus.windows.net"` and `"spehub"`.

    Here are the important steps from the code:

    1. Creates an [EventHubProducerClient](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient) object using the namespace and the event hub name. 
    1. Invokes the [CreateBatchAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.createbatchasync) method on the [EventHubProducerClient](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient) object to create an [EventDataBatch](/dotnet/api/azure.messaging.eventhubs.producer.eventdatabatch) object.     
    1. Add events to the batch using the [EventDataBatch.TryAdd](/dotnet/api/azure.messaging.eventhubs.producer.eventdatabatch.tryadd) method. 
    1. Sends the batch of messages to the event hub using the [EventHubProducerClient.SendAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.sendasync) method.



    ```csharp
    using Azure.Identity;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Producer;
    using System.Text;
    
    // number of events to be sent to the event hub
    int numOfEvents = 3;
    
    // The Event Hubs client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when events are being published or read regularly.
    // TODO: Replace the <EVENT_HUB_NAMESPACE> and <HUB_NAME> placeholder values
    EventHubProducerClient producerClient = new EventHubProducerClient(
        "<EVENT_HUB_NAMESPACE>.servicebus.windows.net",
        "<HUB_NAME>",
        new DefaultAzureCredential());
    
    // Create a batch of events 
    using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
    
    for (int i = 1; i <= numOfEvents; i++)
    {
        if (!eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes($"Event {i}"))))
        {
            // if it is too large for the batch
            throw new Exception($"Event {i} is too large for the batch and cannot be sent.");
        }
    }
    
    try
    {
        // Use the producer client to send the batch of events to the event hub
        await producerClient.SendAsync(eventBatch);
        Console.WriteLine($"A batch of {numOfEvents} events has been published.");
    }
    finally
    {
        await producerClient.DisposeAsync();
    }
    ```

## [Connection String](#tab/connection-string)

1. Replace the existing code in the `Program.cs` file with the following sample code. Then, replace the `<CONNECTION_STRING>` and `<HUB_NAME>` placeholder values for the `EventHubProducerClient` parameters.

    Here are the important steps from the code:

    1. Creates a [EventHubProducerClient](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient) object using the primary connection string to the namespace and the event hub name. 
    1. Invokes the [CreateBatchAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.createbatchasync) method on the [EventHubProducerClient](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient) object to create a [EventDataBatch](/dotnet/api/azure.messaging.eventhubs.producer.eventdatabatch) object.     
    1. Add events to the batch using the [EventDataBatch.TryAdd](/dotnet/api/azure.messaging.eventhubs.producer.eventdatabatch.tryadd) method. 
    1. Sends the batch of messages to the event hub using the [EventHubProducerClient.SendAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.sendasync) method.
  

    ```csharp
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Producer;
    using System.Text;
    
    // number of events to be sent to the event hub
    int numOfEvents = 3;
    
    // The Event Hubs client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when events are being published or read regularly.
    // TODO: Replace the <CONNECTION_STRING> and <HUB_NAME> placeholder values
    EventHubProducerClient producerClient = new EventHubProducerClient(
        "<CONNECTION_STRING>",
        "<HUB_NAME>");
    
    // Create a batch of events 
    using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
    
    for (int i = 1; i <= numOfEvents; i++)
    {
        if (!eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes($"Event {i}"))))
        {
            // if it is too large for the batch
            throw new Exception($"Event {i} is too large for the batch and cannot be sent.");
        }
    }
    
    try
    {
        // Use the producer client to send the batch of events to the event hub
        await producerClient.SendAsync(eventBatch);
        Console.WriteLine($"A batch of {numOfEvents} events has been published.");
    }
    finally
    {
        await producerClient.DisposeAsync();
    }
    ```
---

2. Build the project, and ensure that there are no errors.
3. Run the program and wait for the confirmation message. 

    ```csharp
    A batch of 3 events has been published.
    ```
4. On the **Event Hubs Namespace** page in the Azure portal, you see three incoming messages in the **Messages** chart. Refresh the page to update the chart if needed. It may take a few seconds for it to show that the messages have been received. 

    :::image type="content" source="./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png" alt-text="Image of the Azure portal page to verify that the event hub received the events" lightbox="./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png":::

    > [!NOTE]
    > For the complete source code with more informational comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample04_PublishingEvents.md)

## Receive events from the event hub
This section shows how to write a .NET Core console application that receives events from an event hub using an event processor. The event processor simplifies receiving events from event hubs. 

> [!WARNING]
> If you run this code on **Azure Stack Hub**, you will experience runtime errors unless you target a specific Storage API version. That's because the Event Hubs SDK uses the latest available Azure Storage API available in  Azure that may not be available on your Azure Stack Hub platform. Azure Stack Hub may support a different version of Storage Blob SDK than those typically available on Azure. If you are using Azure Blob Storage as a checkpoint store, check the [supported Azure Storage API version for your Azure Stack Hub build](/azure-stack/user/azure-stack-acs-differences?#api-version) and target that version in your code. 
>
> For example, If you are running on Azure Stack Hub version 2005, the highest available version for the Storage service is version 2019-02-02. By default, the Event Hubs SDK client library uses the highest available version on Azure (2019-07-07 at the time of the release of the SDK). In this case, besides following steps in this section, you will also need to add code to target the Storage service API version 2019-02-02. For an example on how to target a specific Storage API version, see [this sample on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/). 



### Create an Azure Storage Account and a blob container
In this quickstart, you use Azure Storage as the checkpoint store. Follow these steps to create an Azure Storage account. 

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
3. Authenticate to the blob container using either Azure AD (passwordless) authentication or a connection string to the namespace.
    
## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [event-hub-storage-assign-roles](../../includes/passwordless/event-hub/event-hub-storage-assign-roles.md)]
## [Connection String](#tab/connection-string)

[Get the connection string to the storage account](../storage/common/storage-account-get-info.md#get-a-connection-string-for-the-storage-account)

Note down the connection string and the container name. You use them in the receive code. 

---
### Create a project for the receiver

1. In the Solution Explorer window, right-click the **EventHubQuickStart** solution, point to **Add**, and select **New Project**. 
1. Select **Console application**, and select **Next**. 
1. Enter **EventHubsReceiver** for the **Project name**, and select **Create**. 
1. In the **Solution Explorer** window, right-click **EventHubsReceiver**, and select **Set as a Startup Project**. 

### Add the NuGet packages to the project

### [Passwordless (Recommended)](#tab/passwordless)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. In the **Package Manager Console** window, confirm that **EventHubsReceiver** is selected for the **Default project**. If not, use the drop-down list to select **EventHubsReceiver**.
1. Run the following command to install the **Azure.Messaging.EventHubs** and the **Azure.Identity** NuGet packages. Press **ENTER** to run the last command.

    ```powershell
    Install-Package Azure.Messaging.EventHubs
    Install-Package Azure.Messaging.EventHubs.Processor
    Install-Package Azure.Identity
    ```

### [Connection String](#tab/connection-string)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. In the **Package Manager Console** window, confirm that **EventHubsReceiver** is selected for the **Default project**. If not, use the drop-down list to select **EventHubsReceiver**.
1. Run the following command to install the **Azure.Messaging.EventHubs** NuGet package:

    ```powershell
    Install-Package Azure.Messaging.EventHubs
    Install-Package Azure.Messaging.EventHubs.Processor
    ```

---
### Update the code

Replace the contents of **Program.cs** with the following code:

## [Passwordless (Recommended)](#tab/passwordless)

1. Replace the existing code in the `Program.cs` file with the following sample code. Then, replace the `<STORAGE_ACCOUNT_NAME>` and `<BLOB_CONTAINER_NAME>` placeholder values for the `BlobContainerClient` URI. Replace the `<EVENT_HUB_NAMESPACE>` and `<HUB_NAME>` placeholder values for the `EventProcessorClient` as well.

    Here are the important steps from the code:
    
    1. Creates an [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object using the Event Hubs namespace and the event hub name. You need to build [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) object for the container in the Azure storage you created earlier.
    1. Specifies handlers for the [ProcessEventAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.processeventasync) and [ProcessErrorAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.processerrorasync) events of the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object. 
    1. Starts processing events by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.startprocessingasync) on the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object. 
    1. Stops processing events after 30 seconds by invoking [StopProcessingAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.stopprocessingasync) on the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object.
       

    ```csharp
    using Azure.Identity;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Consumer;
    using Azure.Messaging.EventHubs.Processor;
    using Azure.Storage.Blobs;
    using System.Text;
    
    // Create a blob container client that the event processor will use
    // TODO: Replace <STORAGE_ACCOUNT_NAME> and <BLOB_CONTATINAER_NAME> with actual names
    BlobContainerClient storageClient = new BlobContainerClient(
        new Uri("https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/<BLOB_CONTAINER_NAME>"),
        new DefaultAzureCredential());
    
    // Create an event processor client to process events in the event hub
    // TODO: Replace the <EVENT_HUBS_NAMESPACE> and <HUB_NAME> placeholder values
    var processor = new EventProcessorClient(
        storageClient,
        EventHubConsumerClient.DefaultConsumerGroupName,
        "<EVENT_HUB_NAMESPACE>.servicebus.windows.net",
        "<HUB_NAME>",
        new DefaultAzureCredential());
    
    // Register handlers for processing events and handling errors
    processor.ProcessEventAsync += ProcessEventHandler;
    processor.ProcessErrorAsync += ProcessErrorHandler;
    
    // Start the processing
    await processor.StartProcessingAsync();
    
    // Wait for 30 seconds for the events to be processed
    await Task.Delay(TimeSpan.FromSeconds(30));
    
    // Stop the processing
    await processor.StopProcessingAsync();
    
    Task ProcessEventHandler(ProcessEventArgs eventArgs)
    {
        // Write the body of the event to the console window
        Console.WriteLine("\tReceived event: {0}", Encoding.UTF8.GetString(eventArgs.Data.Body.ToArray()));
        return Task.CompletedTask;
    }
    
    Task ProcessErrorHandler(ProcessErrorEventArgs eventArgs)
    {
        // Write details about the error to the console window
        Console.WriteLine($"\tPartition '{eventArgs.PartitionId}': an unhandled exception was encountered. This was not expected to happen.");
        Console.WriteLine(eventArgs.Exception.Message);
        return Task.CompletedTask;
    }
    ```

## [Connection String](#tab/connection-string)

1. Replace the existing code in the `Program.cs` file with the following sample code. Then, replace the `<AZURE_STORAGE_CONNECTION_STRING>` and `<BLOB_CONTAINER_NAME>` placeholder values for the `BlobContainerClient` URI. Replace the `<EVENT_HUB_NAMESPACE_CONNECTION_STRING>` and `<HUB_NAME>` placeholder values for the `EventProcessorClient` as well.

    Here are the important steps from the code:
    
    1. Creates an [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object using the primary connection string to the namespace and the event hub. You need to build [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) object for the container in the Azure storage you created earlier.
    1. Specifies handlers for the [ProcessEventAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.processeventasync) and [ProcessErrorAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.processerrorasync) events of the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object. 
    1. Starts processing events by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.startprocessingasync) on the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object. 
    1. Stops processing events after 30 seconds by invoking [StopProcessingAsync](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient.stopprocessingasync) on the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) object.
       
    
    ```csharp
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Consumer;
    using Azure.Messaging.EventHubs.Processor;
    using Azure.Storage.Blobs;
    using System.Text;
    
    // Create a blob container client that the event processor will use 
    BlobContainerClient storageClient = new BlobContainerClient(
        "<AZURE_STORAGE_CONNECTION_STRING>", "<BLOB_CONTAINER_NAME>");
    
    // Create an event processor client to process events in the event hub
    var processor = new EventProcessorClient(
        storageClient,
        EventHubConsumerClient.DefaultConsumerGroupName,
        "<EVENT_HUBS_NAMESPACE_CONNECTION_STRING>",
        "<HUB_NAME>");
    
    // Register handlers for processing events and handling errors
    processor.ProcessEventAsync += ProcessEventHandler;
    processor.ProcessErrorAsync += ProcessErrorHandler;
    
    // Start the processing
    await processor.StartProcessingAsync();
    
    // Wait for 30 seconds for the events to be processed
    await Task.Delay(TimeSpan.FromSeconds(30));
    
    // Stop the processing
    await processor.StopProcessingAsync();
    
    Task ProcessEventHandler(ProcessEventArgs eventArgs)
    {
        // Write the body of the event to the console window
        Console.WriteLine("\tReceived event: {0}", Encoding.UTF8.GetString(eventArgs.Data.Body.ToArray()));
        return Task.CompletedTask;
    }
    
    Task ProcessErrorHandler(ProcessErrorEventArgs eventArgs)
    {
        // Write details about the error to the console window
        Console.WriteLine($"\tPartition '{eventArgs.PartitionId}': an unhandled exception was encountered. This was not expected to happen.");
        Console.WriteLine(eventArgs.Exception.Message);
        return Task.CompletedTask;
    }
    ```
   
---

2. Build the project, and ensure that there are no errors.

    > [!NOTE]
    > For the complete source code with more informational comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/Sample01_HelloWorld.md).
3. Run the receiver application. 
4. You should see a message that the events have been received. 

    ```bash
    Received event: Event 1
    Received event: Event 2
    Received event: Event 3    
    ```
    These events are the three events you sent to the event hub earlier by running the sender program. 
5. In the Azure portal, you can verify that there are three outgoing messages, which Event Hubs sent to the receiving application. Refresh the page to update the chart. It may take a few seconds for it to show that the messages have been received. 

    :::image type="content" source="./media/getstarted-dotnet-standard-send-v2/verify-messages-portal-2.png" alt-text="Image of the Azure portal page to verify that the event hub sent events to the receiving app" lightbox="./media/getstarted-dotnet-standard-send-v2/verify-messages-portal-2.png":::

## Clean up resources
Delete the resource group that has the Event Hubs namespace or delete only the namespace if you want to keep the resource group. 

## Samples and reference
This quick start provides step-by-step instructions to implement a scenario of sending a batch of events to an event hub and then receiving them. For more samples, select the following links. 

- [Event Hubs samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples)
- [Event processor samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples)
- [Azure role-based access control (Azure RBAC) sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Azure.Messaging.EventHubs/ManagedIdentityWebApp)

For complete .NET library reference, see our [SDK documentation](/dotnet/api/overview/azure/event-hubs). 

## Next steps
See the following tutorial: 

> [!div class="nextstepaction"]
> [Tutorial: Visualize data anomalies in real-time events sent to Azure Event Hubs](../stream-analytics/stream-analytics-real-time-fraud-detection.md?toc=%2Fazure%2Fevent-hubs%2FTOC.json)

