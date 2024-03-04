---
title: Quickstart - Use Event Grid pull delivery from .NET app
description: This quickstart shows you how to send messages to and receive messages from Azure Event Grid namespace topics using the .NET programming language.
ms.topic: quickstart
ms.author: sonalikaroy
author: sonalika-roy
ms.custom: references_regions, devx-track-dotnet
ms.date: 07/26/2023
---


# Quickstart: Send and receive messages from an Azure Event Grid namespace topic (.NET) - (Preview)

In this quickstart, you'll do the following steps:

1. Create an Event Grid namespace, using the Azure portal.
2. Create an Event Grid namespace topic, using the Azure portal.
3. Create an event subscription, using the Azure portal.
4. Write a .NET console application to send a set of messages to the topic
5. Write a .NET console application to receive those messages from the topic.


>[!Important]
> Namespaces, namespace topics, and event subscriptions associated to namespace topics are initially available in the following regions:
>
>- East US
>- Central US
>- South Central US
>- West US 2
>- East Asia
>- Southeast Asia
>- North Europe
>- West Europe
>- UAE North

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to an Event Grid Namespace Topic and then receiving them. For an overview of the .NET client library, see [Azure Event Grid client library for .NET](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Messaging.EventGrid_4.17.0-beta.1/sdk/eventgrid/Azure.Messaging.EventGridV2/src/Generated/EventGridClient.cs). For more samples, see [Event Grid .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/feature/eventgrid/namespaces/sdk/eventgrid/Azure.Messaging.EventGrid/samples).

## Prerequisites

If you're new to the service, see [Event Grid overview](overview.md) before you do this quickstart.

- **Azure subscription**. To use Azure services, including Azure Event Grid, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/dotnet).
- **Visual Studio 2022**. The sample application makes use of new features that were introduced in C# 10.  To use the latest syntax, we recommend that you install .NET 6.0, or higher and set the language version to `latest`. If you're using Visual Studio, versions before Visual Studio 2022 aren't compatible with the tools needed to build C# 10 projects.

[!INCLUDE [event-grid-create-namespace-portal](./includes/event-grid-create-namespace-portal.md)]

[!INCLUDE [event-grid-create-namespace-topic-portal](./includes/event-grid-create-namespace-topic-portal.md)]

[!INCLUDE [event-grid-create-event-subscriptions-portal](./includes/event-grid-create-event-subscriptions-portal.md)]

[!INCLUDE [event-grid-passwordless-template-tabbed](../../includes/passwordless/event-grid/event-grid-passwordless-template-tabbed.md)]

## Launch Visual Studio

You can authorize access to the Event Grid namespace using the following steps:

Launch Visual Studio. If you see the **Get started** window, select the **Continue without code** link in the right pane.


## Send messages to the topic

This section shows you how to create a .NET console application to send messages to an Event Grid topic.

### Create a console application

1. In Visual Studio, select **File** -> **New** -> **Project** menu. 
2. On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**.
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application.
    1. Select **Console App** from the results list.
    1. Then, select **Next**.

        :::image type="content" source="./media/event-grid-dotnet-get-started-events/new-send-project.png" alt-text="Screenshot showing the Create a new project dialog box with C# and Console selected.":::
3. Enter **EventSender** for the project name, **EventGridQuickStart** for the solution name, and then select **Next**.

    :::image type="content" source="./media/event-grid-dotnet-get-started-events/event-sender.png" alt-text="Screenshot showing the solution and project names in the Configure your new project dialog box.":::
4. On the **Additional information** page, select **Create** to create the solution and the project.

### Add the NuGet packages to the project

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
2. Run the following command to install the **Azure.Messaging.EventGrid** NuGet package:

    ```powershell
    Install-Package Azure.Messaging.EventGrid -Version 4.17.0-beta.1
    ```


## Add code to send event to the namespace topic

1. Replace the contents of `Program.cs` with the following code. The important steps are outlined below, with additional information in the code comments.

    > [!IMPORTANT]
    > Update placeholder values (`<ENDPOINT>` , `<TOPIC-NAME>` and `<TOPIC-KEY>`) in the code snippet with names of your topic endpoint , topic name and topic key.


    ```csharp
    using Azure.Messaging.EventGrid.Namespaces;

    // TODO: Replace the <ENDPOINT> , <TOPIC-KEY> and <TOPIC-NAME> placeholder
    
    var topicEndpoint = "https://namespace01.eastus-1.eventgrid.azure.net"; // Replace with the url of your event grid namespace.
    var topicKey = "Enter the Topic Access Key";
    var topicName = "Enter the Topic Name";
    var subscription = "Enter the event grid subscription name";

    // Construct the client using an Endpoint for a namespace as well as the access key
    var client = new EventGridClient(new Uri(topicEndpoint), new AzureKeyCredential(topicKey));
    
    // Publish a single CloudEvent using a custom TestModel for the event data.
    var @ev = new CloudEvent("employee_source", "type", new TestModel { Name = "Bob", Age = 18 });
    await client.PublishCloudEventAsync(topicName, ev);
    
    // Publish a batch of CloudEvents.
    
    public class TestModel
   {
      public string Name { get; set; }
      public int Age { get; set; }
   }
    
    await client.PublishCloudEventsAsync(
    topicName,
    new[] {
        new CloudEvent("employee_source", "type", new TestModel { Name = "Tom", Age = 55 }),
        new CloudEvent("employee_source", "type", new TestModel { Name = "Alice", Age = 25 })});
        
    Console.WriteLine("An event has been published to the topic. Press any key to end the application.");
    Console.ReadKey();
    ```

    ---

2. Build the project, and ensure that there are no errors.
3. Run the program and wait for the confirmation message.

    ```bash
    An event has been published to the topic. Press any key to end the application.
    ```

    > [!IMPORTANT]
    > In most cases, it will take a minute or two for the role assignment to propagate in Azure. In rare cases, it may take up to **eight minutes**. If you receive authentication errors when you first run your code, wait a few moments and try again.

4. In the Azure portal, follow these steps:
    1. Navigate to your Event Grid namespace.
    1. On the **Overview** page, select the queue in the middle pane.

        :::image type="content" source="./media/event-grid-dotnet-get-started-events/event-grid-namespace-metrics.png" alt-text="Screenshot showing the Event Grid Namespace page in the Azure portal." lightbox="./media/event-grid-dotnet-get-started-events/event-grid-namespace-metrics.png":::

   

## Pull messages from the topic

In this section, you create a .NET console application that receives messages from the topic.

### Create a project to receive the published CloudEvents

1. In the Solution Explorer window, right-click the **EventGridQuickStart** solution, point to **Add**, and select **New Project**.
1. Select **Console application**, and select **Next**.
1. Enter **EventReceiver** for the **Project name**, and select **Create**.
1. In the **Solution Explorer** window, right-click **EventReceiver**, and select **Set as a Startup Project**.

### Add the NuGet packages to the project

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Run the following command to install the **Azure.Messaging.EventGrid** NuGet package:

    ```powershell
    Install-Package Azure.Messaging.EventGrid -Version 4.17.0-beta.1
    ```

    :::image type="content" source="./media/event-grid-dotnet-get-started-events/install-event-grid-package.png" alt-text="Screenshot showing EventReceiver project selected in the Package Manager Console.":::


---


### Add the code to receive events from the topic

In this section, you add code to retrieve messages from the queue.

1. Within the `Program` class, add the following code:
    
    ```csharp
    using System.Threading.Tasks;
    using Azure;
    using Azure.Messaging;
    using Azure.Messaging.EventGrid.Namespaces;
    
    
    var topicEndpoint = "https://namespace01.eastus-1.eventgrid.azure.net"; // Replace with the url of your event grid namespace.
    var topicKey = "Enter the Topic Access Key";
    var topicName = "Enter the Topic Name";
    var subscription = "Enter the event grid subscription name";

    // Construct the client using an Endpoint for a namespace as well as the access key
    var client = new EventGridClient(new Uri(topicEndpoint), new AzureKeyCredential(topicKey));
    
    // Receive the published CloudEvents
    ReceiveResult result = await client.ReceiveCloudEventsAsync(topicName, subscription);
    
    Console.WriteLine("Received Response");
    ```

1. Append the following methods to the end of the `Program` class.

    ```csharp
    // handle received messages. Define these variables on the top.

    var toRelease = new List<string>();
    var toAcknowledge = new List<string>();
    var toReject = new List<string>();

    // Iterate through the results and collect the lock tokens for events we want to release/acknowledge/result

    foreach (ReceiveDetails detail in result.Value)
    {
    CloudEvent @event = detail.Event;
    BrokerProperties brokerProperties = detail.BrokerProperties;
    Console.WriteLine(@event.Data.ToString());

    // The lock token is used to acknowledge, reject or release the event
    Console.WriteLine(brokerProperties.LockToken);
    
    // If the event is from the "employee_source" and the name is "Bob", we are not able to acknowledge it yet, so we release it
    if (@event.Source == "employee_source" && @event.Data.ToObjectFromJson<TestModel>().Name == "Bob")
    {
        toRelease.Add(brokerProperties.LockToken);
    }
    // acknowledge other employee_source events
    else if (@event.Source == "employee_source")
    {
        toAcknowledge.Add(brokerProperties.LockToken);
    }
    // reject all other events
    else
    {
        toReject.Add(brokerProperties.LockToken);
    }
    }

    // Release/acknowledge/reject the events

    if (toRelease.Count > 0)
    {
    ReleaseResult releaseResult = await client.ReleaseCloudEventsAsync(<TOPIC-NAME>, <EVENT-SUBSCRIPTION>, toRelease);

    // Inspect the Release result
    Console.WriteLine($"Failed count for Release: {releaseResult.FailedLockTokens.Count}");
    foreach (FailedLockToken failedLockToken in releaseResult.FailedLockTokens)
    {
        Console.WriteLine($"Lock Token: {failedLockToken.LockToken}");
        Console.WriteLine($"Error Code: {failedLockToken.ErrorCode}");
        Console.WriteLine($"Error Description: {failedLockToken.ErrorDescription}");
    }

    Console.WriteLine($"Success count for Release: {releaseResult.SucceededLockTokens.Count}");
    foreach (string lockToken in releaseResult.SucceededLockTokens)
    {
        Console.WriteLine($"Lock Token: {lockToken}");
    }
    }

    if (toAcknowledge.Count > 0)
    {
    AcknowledgeResult acknowledgeResult = await client.AcknowledgeCloudEventsAsync(<TOPIC-NAME>, <EVENT-SUBSCRIPTION>, toAcknowledge);

    // Inspect the Acknowledge result
    Console.WriteLine($"Failed count for Acknowledge: {acknowledgeResult.FailedLockTokens.Count}");
    foreach (FailedLockToken failedLockToken in acknowledgeResult.FailedLockTokens)
    {
        Console.WriteLine($"Lock Token: {failedLockToken.LockToken}");
        Console.WriteLine($"Error Code: {failedLockToken.ErrorCode}");
        Console.WriteLine($"Error Description: {failedLockToken.ErrorDescription}");
    }

    Console.WriteLine($"Success count for Acknowledge: {acknowledgeResult.SucceededLockTokens.Count}");
    foreach (string lockToken in acknowledgeResult.SucceededLockTokens)
    {
        Console.WriteLine($"Lock Token: {lockToken}");
    }
    }

    if (toReject.Count > 0)
    {
    RejectResult rejectResult = await client.RejectCloudEventsAsync(<TOPIC-NAME>, <EVENT-SUBSCRIPTION>, toReject);

    // Inspect the Reject result
    Console.WriteLine($"Failed count for Reject: {rejectResult.FailedLockTokens.Count}");
    foreach (FailedLockToken failedLockToken in rejectResult.FailedLockTokens)
    {
        Console.WriteLine($"Lock Token: {failedLockToken.LockToken}");
        Console.WriteLine($"Error Code: {failedLockToken.ErrorCode}");
        Console.WriteLine($"Error Description: {failedLockToken.ErrorDescription}");
    }

    Console.WriteLine($"Success count for Reject: {rejectResult.SucceededLockTokens.Count}");
    foreach (string lockToken in rejectResult.SucceededLockTokens)
    {
        Console.WriteLine($"Lock Token: {lockToken}");
    }
    }

    ```

## Clean up resources

Navigate to your Event Grid namespace in the Azure portal, and select **Delete** on the Azure portal to delete the Event Grid namespace and the topic in it.
