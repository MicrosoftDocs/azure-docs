---
title: Notification Hubs - Enterprise Push Architecture
description: Guidance on using Azure Notification Hubs in an enterprise environment
services: notification-hubs
documentationcenter: ''
author: jwargo
manager: patniko
editor: spelluru

ms.assetid: 903023e9-9347-442a-924b-663af85e05c6
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows
ms.devlang: dotnet
ms.topic: article
ms.date: 01/04/2019
ms.author: jowargo
---

# Enterprise push architectural guidance

Enterprises today are gradually moving towards creating mobile applications for either their end users (external) or for the employees (internal). They have existing backend systems in place be it mainframes or some LoB applications, which must be integrated into the mobile application architecture. This guide talks about how best to do this integration recommending possible solution to common scenarios.

A frequent requirement is for sending push notification to the users through their mobile application when an event of interest occurs in the backend systems. For example, a bank customer who has the bank's banking app on an iPhone wants to be notified when a debit is made above a certain amount from the account or an intranet scenario where an employee from finance department who has a budget approval app on a Windows Phone wants to be notified when the approval request is received.

The bank account or approval processing is likely to be done in some backend system, which must initiate a push to the user. There may be multiple such backend systems, which must all build the same kind of logic to push when an event triggers a notification. The complexity here lies in integrating several backend systems together with a single push system where the end users may have subscribed to different notifications and there may even be multiple mobile applications. For example,  intranet mobile apps where one mobile application may want to receive notifications from multiple such backend systems. The backend systems do not know or need to know of push semantics/technology so a common solution here traditionally has been to introduce a component, which polls the backend systems for any events of interest and is responsible for sending the push messages to the client.

A better solution is to use Azure Service Bus - Topic/Subscription model, which reduces the complexity while making the solution scalable.

Here is the general architecture of the solution (generalized with multiple mobile apps but equally applicable when there is only one mobile app)

## Architecture

![][1]

The key piece in this architectural diagram is Azure Service Bus, which provides a topics/subscriptions programming model (more on it at [Service Bus Pub/Sub programming]). The receiver, which in this case, is the Mobile backend (typically [Azure Mobile Service], which initiates a push to the mobile apps) does not receive messages directly from the backend systems but instead, an intermediate abstraction layer provided by [Azure Service Bus], which enables mobile backend to receive messages from one or more backend systems. A Service Bus Topic needs to be created for each of the backend systems, for example,  Account, HR, Finance, which is basically "topics" of interest, which initiates messages to be sent as push notification. The backend systems send messages to these topics. A Mobile Backend can subscribe to one or more such topics by creating a Service Bus subscription. It entitles the mobile backend to receive a notification from the corresponding backend system. Mobile backend continues to listen for messages on their subscriptions and as soon as a message arrives, it turns back and sends it as notification to its notification hub. Notification hubs then eventually deliver the message to the mobile app. Here is the list of key components:

1. Backend systems (LoB/Legacy systems)
   * Creates Service Bus Topic
   * Sends Message
1. Mobile backend
   * Creates Service Subscription
   * Receives Message (from Backend system)
   * Sends notification to clients (via Azure Notification Hub)
1. Mobile Application
   * Receives and display notification

### Benefits

1. The decoupling between the receiver (mobile app/service via Notification Hub) and sender (backend systems) enables additional backend systems being integrated with minimal change.
1. It also makes the scenario of multiple mobile apps being able to receive events from one or more backend systems.  

## Sample

### Prerequisites

Complete the following tutorials to familiarize with the concepts as well as common creation & configuration steps:

1. [Service Bus Pub/Sub programming] - This tutorial explains the details of working with Service Bus Topics/Subscriptions, how to create a namespace to contain topics/subscriptions, how to send & receive messages from them.
2. [Notification Hubs - Windows Universal tutorial] - This tutorial explains how to set up a Windows Store app and use Notification Hubs to register and then receive notifications.

### Sample code

The full sample code is available at [Notification Hub Samples]. It is split into three components:

1. **EnterprisePushBackendSystem**

    a. This project uses the **WindowsAzure.ServiceBus** NuGet package and is  based on [Service Bus Pub/Sub programming].

    b. This application is a simple C# console app to simulate an LoB system, which initiates the message to be delivered to the mobile app.

    ```csharp
    static void Main(string[] args)
    {
        string connectionString =
            CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

        // Create the topic
        CreateTopic(connectionString);

        // Send message
        SendMessage(connectionString);
    }
    ```

    c. `CreateTopic` is used to create the Service Bus topic.

    ```csharp
    public static void CreateTopic(string connectionString)
    {
        // Create the topic if it does not exist already

        var namespaceManager =
            NamespaceManager.CreateFromConnectionString(connectionString);

        if (!namespaceManager.TopicExists(sampleTopic))
        {
            namespaceManager.CreateTopic(sampleTopic);
        }
    }
    ```

    d. `SendMessage` is used to send the messages to this Service Bus Topic. This code simply sends a set of random messages to the topic periodically for the purpose of the sample. Normally there is a backend system, which sends messages when an event occurs.

    ```csharp
    public static void SendMessage(string connectionString)
    {
        TopicClient client =
            TopicClient.CreateFromConnectionString(connectionString, sampleTopic);

        // Sends random messages every 10 seconds to the topic
        string[] messages =
        {
            "Employee Id '{0}' has joined.",
            "Employee Id '{0}' has left.",
            "Employee Id '{0}' has switched to a different team."
        };

        while (true)
        {
            Random rnd = new Random();
            string employeeId = rnd.Next(10000, 99999).ToString();
            string notification = String.Format(messages[rnd.Next(0,messages.Length)], employeeId);

            // Send Notification
            BrokeredMessage message = new BrokeredMessage(notification);
            client.Send(message);

            Console.WriteLine("{0} Message sent - '{1}'", DateTime.Now, notification);

            System.Threading.Thread.Sleep(new TimeSpan(0, 0, 10));
        }
    }
    ```
2. **ReceiveAndSendNotification**

    a. This project uses the *WindowsAzure.ServiceBus* and **Microsoft.Web.WebJobs.Publish** NuGet packages and is based on [Service Bus Pub/Sub programming].

    b. The following console app runs as an [Azure WebJob] since it has to run continuously to listen for messages from the LoB/backend systems. This application is part of your Mobile backend.

    ```csharp
    static void Main(string[] args)
    {
        string connectionString =
                 CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

        // Create the subscription that receives messages
        CreateSubscription(connectionString);

        // Receive message
        ReceiveMessageAndSendNotification(connectionString);
    }
    ```

    c. `CreateSubscription` is used to create a Service Bus subscription for the topic where the backend system sends messages. Depending on the business scenario, this component creates one or more subscriptions to corresponding topics (for example, some may be receiving messages from HR system, some from Finance system, and so on)

    ```csharp
    static void CreateSubscription(string connectionString)
    {
        // Create the subscription if it does not exist already
        var namespaceManager =
            NamespaceManager.CreateFromConnectionString(connectionString);

        if (!namespaceManager.SubscriptionExists(sampleTopic, sampleSubscription))
        {
            namespaceManager.CreateSubscription(sampleTopic, sampleSubscription);
        }
    }
    ```

    d. `ReceiveMessageAndSendNotification` is used to read the message from the topic using its subscription and if the read is successful then craft a notification (in the sample scenario a Windows native toast notification) to be sent to the mobile application using Azure Notification Hubs.

    ```csharp
    static void ReceiveMessageAndSendNotification(string connectionString)
    {
        // Initialize the Notification Hub
        string hubConnectionString = CloudConfigurationManager.GetSetting
                ("Microsoft.NotificationHub.ConnectionString");
        hub = NotificationHubClient.CreateClientFromConnectionString
                (hubConnectionString, "enterprisepushservicehub");

        SubscriptionClient Client =
            SubscriptionClient.CreateFromConnectionString
                    (connectionString, sampleTopic, sampleSubscription);

        Client.Receive();

        // Continuously process messages received from the subscription
        while (true)
        {
            BrokeredMessage message = Client.Receive();
            var toastMessage = @"<toast><visual><binding template=""ToastText01""><text id=""1"">{messagepayload}</text></binding></visual></toast>";

            if (message != null)
            {
                try
                {
                    Console.WriteLine(message.MessageId);
                    Console.WriteLine(message.SequenceNumber);
                    string messageBody = message.GetBody<string>();
                    Console.WriteLine("Body: " + messageBody + "\n");

                    toastMessage = toastMessage.Replace("{messagepayload}", messageBody);
                    SendNotificationAsync(toastMessage);

                    // Remove message from subscription
                    message.Complete();
                }
                catch (Exception)
                {
                    // Indicate a problem, unlock message in subscription
                    message.Abandon();
                }
            }
        }
    }
    static async void SendNotificationAsync(string message)
    {
        await hub.SendWindowsNativeNotificationAsync(message);
    }
    ```

    e. For publishing this app as a **WebJob**, right click on the solution in Visual Studio and select **Publish as WebJob**

    ![][2]

    f. Select your publishing profile and create a new Azure WebSite if it does not exist already, which hosts this WebJob and once you have the WebSite then **Publish**.

    ![][3]

    g. Configure the job to be "Run Continuously" so that when you log in to the [Azure portal] you should see something like the following:

    ![][4]

3. **EnterprisePushMobileApp**

    a. This application is a Windows Store application, which receives toast notifications from the WebJob running as part of your Mobile backend and display it. This code is based on [Notification Hubs - Windows Universal tutorial].  

    b. Ensure that your application is enabled to receive toast notifications.

    c. Ensure that the following Notification Hubs registration code is being called at the App start up (after replacing the `HubName` and `DefaultListenSharedAccessSignature` values:

    ```csharp
    private async void InitNotificationsAsync()
    {
        var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();

        var hub = new NotificationHub("[HubName]", "[DefaultListenSharedAccessSignature]");
        var result = await hub.RegisterNativeAsync(channel.Uri);

        // Displays the registration ID so you know it was successful
        if (result.RegistrationId != null)
        {
            var dialog = new MessageDialog("Registration successful: " + result.RegistrationId);
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }
    }
    ```

### Running the sample

1. Ensure that your WebJob is running successfully and scheduled to run continuously.
2. Run the **EnterprisePushMobileApp**, which starts the Windows Store app.
3. Run the **EnterprisePushBackendSystem** console application, which simulates the LoB backend and starts sending messages and you should see toast notifications appearing like the following image:

    ![][5]

4. The messages were originally sent to Service Bus topics, which was being monitored by Service Bus subscriptions in your Web Job. Once a message was received, a notification was created and sent to the mobile app. You can look through the WebJob logs to confirm the processing when you go to the Logs link in [Azure portal] for your Web Job:

    ![][6]

<!-- Images -->
[1]: ./media/notification-hubs-enterprise-push-architecture/architecture.png
[2]: ./media/notification-hubs-enterprise-push-architecture/WebJobsContextMenu.png
[3]: ./media/notification-hubs-enterprise-push-architecture/PublishAsWebJob.png
[4]: ./media/notification-hubs-enterprise-push-architecture/WebJob.png
[5]: ./media/notification-hubs-enterprise-push-architecture/Notifications.png
[6]: ./media/notification-hubs-enterprise-push-architecture/WebJobsLog.png

<!-- Links -->
[Notification Hub Samples]: https://github.com/Azure/azure-notificationhubs-samples
[Azure Mobile Service]: https://azure.microsoft.com/documentation/services/mobile-services/
[Azure Service Bus]: https://azure.microsoft.com/documentation/articles/fundamentals-service-bus-hybrid-solutions/
[Service Bus Pub/Sub programming]: https://azure.microsoft.com/documentation/articles/service-bus-dotnet-how-to-use-topics-subscriptions/
[Azure WebJob]: ../app-service/webjobs-create.md
[Notification Hubs - Windows Universal tutorial]: https://azure.microsoft.com/documentation/articles/notification-hubs-windows-store-dotnet-get-started/
[Azure portal]: https://portal.azure.com/
