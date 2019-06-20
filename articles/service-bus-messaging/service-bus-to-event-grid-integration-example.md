---
title: Azure Service Bus to Event Grid integration examples | Microsoft Docs
description: This article provides examples of Service Bus messaging and Event Grid integration.
services: service-bus-messaging
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: f99766cb-8f4b-4baf-b061-4b1e2ae570e4
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: tutorial
ms.date: 05/14/2019
ms.author: spelluru

---
# Respond to Azure Service Bus events received via Azure Event Grid by using Azure Functions and Azure Logic Apps
In this tutorial, you learn how to respond to Azure Service Bus events that are received via Azure Event Grid by using Azure Functions and Azure Logic Apps. You'll do the following steps:
 
- Create a test Azure function for debugging and viewing the initial flow of events from the Event Grid.
- Create an Azure function to receive and process Azure Service Bus messages based on Event Grid events.
- Create a logic app to respond to Event Grid events

After you create the Service Bus, Event Grid, Azure Functions, and Logic Apps artifacts, you do the following actions: 

1. Send messages to a Service Bus topic. 
2. Verify that the subscriptions to the topic received those messages
3. Verify that the function or logic app that subscribed for the event has received the event. 

## Create a Service Bus namespace
Follow instructions in this tutorial: [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md) to do the following tasks:

- Create a **premium** Service Bus namespace. 
- Get the connection string. 
- Create a Service Bus topic.
- Create two subscriptions to the topic. 

## Prepare a sample application to send messages
You can use any method to send a message to your Service Bus topic. The sample code at the end of this procedure assumes that you're using Visual Studio 2017.

1. Clone [the GitHub azure-service-bus repository](https://github.com/Azure/azure-service-bus/).
2. In Visual Studio, go to the *\samples\DotNet\Microsoft.ServiceBus.Messaging\ServiceBusEventGridIntegration* folder, and then open the *SBEventGridIntegration.sln* file.
3. Go to the **MessageSender** project, and then select **Program.cs**.
4. Fill in your Service Bus topic name and the connection string you got from the previous step:

    ```CSharp
    const string ServiceBusConnectionString = "YOUR CONNECTION STRING";
    const string TopicName = "YOUR TOPIC NAME";
    ```
5. Build and run the program to send test messages to the Service Bus topic. 

## Set up a test function on Azure 
Before you work through the entire scenario, set up at least a small test function, which you can use to debug and observe the events that are flowing. Follow instructions in the [Create your first function in the Azure portal](../azure-functions/functions-create-first-azure-function.md) article to do the following tasks: 

1. Create a function app.
2. Create an HTTP triggered function. 

Then, do the following steps: 


# [Azure Functions V2](#tab/v2)

1. Expand **Functions** in the tree view, and select your function. Replace the code for the function with the following code: 

    ```CSharp
    #r "Newtonsoft.Json"
    
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Primitives;
    using Newtonsoft.Json;
    
    public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");
        var content = req.Body;
        string jsonContent = await new StreamReader(content).ReadToEndAsync();
        log.LogInformation($"Received Event with payload: {jsonContent}");
    
        IEnumerable<string> headerValues;
        headerValues = req.Headers.GetCommaSeparatedValues("Aeg-Event-Type");
    
        if (headerValues.Count() != 0)
        {
            var validationHeaderValue = headerValues.FirstOrDefault();
            if(validationHeaderValue == "SubscriptionValidation")
            {
                var events = JsonConvert.DeserializeObject<GridEvent[]>(jsonContent);
                var code = events[0].Data["validationCode"];
                log.LogInformation("Validation code: {code}");
                return (ActionResult) new OkObjectResult(new { validationResponse = code });
            }
        }
    
        return jsonContent == null
            ? new BadRequestObjectResult("Please pass a name on the query string or in the request body")
            : (ActionResult)new OkObjectResult($"Hello, {jsonContent}");
    }
    
    public class GridEvent
    {
        public string Id { get; set; }
        public string EventType { get; set; }
        public string Subject { get; set; }
        public DateTime EventTime { get; set; }
        public Dictionary<string, string> Data { get; set; }
        public string Topic { get; set; }
    }
    
    ```
2. Select **Save and run**.

    ![Function app output](./media/service-bus-to-event-grid-integration-example/function-run-output.png)
3. Select **Get function URL** and note down the URL. 

    ![Get function URL](./media/service-bus-to-event-grid-integration-example/get-function-url.png)

# [Azure Functions V1](#tab/v1)

1. Configure the function to use **V1** version: 
    1. Select your function app in the tree view, and select **Function app settings**. 

        ![Function app settings]()./media/service-bus-to-event-grid-integration-example/function-app-settings.png)
    2. Select **~1** for **Runtime version**. 
2. Expand **Functions** in the tree view, and select your function. Replace the code for the function with the following code: 

    ```CSharp
    #r "Newtonsoft.Json"
    using System.Net;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    
    public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
    {
        log.Info("C# HTTP trigger function processed a request.");
        // parse query parameter
        var content = req.Content;
    
        string jsonContent = await content.ReadAsStringAsync(); 
        log.Info($"Received Event with payload: {jsonContent}");
    
        IEnumerable<string> headerValues;
        if (req.Headers.TryGetValues("Aeg-Event-Type", out headerValues))
        {
            var validationHeaderValue = headerValues.FirstOrDefault();
            if(validationHeaderValue == "SubscriptionValidation")
            {
            var events = JsonConvert.DeserializeObject<GridEvent[]>(jsonContent);
                 var code = events[0].Data["validationCode"];
                 return req.CreateResponse(HttpStatusCode.OK,
                 new { validationResponse = code });
            }
        }
    
        return jsonContent == null
        ? req.CreateResponse(HttpStatusCode.BadRequest, "Pass a name on the query string or in the request body")
        : req.CreateResponse(HttpStatusCode.OK, "Hello " + jsonContent);
    }
    
    public class GridEvent
    {
        public string Id { get; set; }
        public string EventType { get; set; }
        public string Subject { get; set; }
        public DateTime EventTime { get; set; }
        public Dictionary<string, string> Data { get; set; }
        public string Topic { get; set; }
    }
    ```
4. Select **Save and run**.

    ![Function app output](./media/service-bus-to-event-grid-integration-example/function-run-output.png)
4. Select **Get function URL** and note down the URL. 

    ![Get function URL](./media/service-bus-to-event-grid-integration-example/get-function-url.png)

---

## Connect the function and namespace via Event Grid
In this section, you tie together the function and the Service Bus namespace by using the Azure portal. 

To create an Azure Event Grid subscription, follow these steps:

1. In the Azure portal, go to your namespace and then, in the left pane, select **Events**. Your namespace window opens, with two Event Grid subscriptions displayed in the right pane. 
    
    ![Service Bus - events page](./media/service-bus-to-event-grid-integration-example/service-bus-events-page.png)
2. Select **+ Event Subscription** on the toolbar. 
3. On the **Create Event Subscription** page, do the following steps:
    1. Enter a **name** for the subscription. 
    2. Select **Web Hook** for **Endpoint Type**. 

        ![Service Bus - Event Grid subscription](./media/service-bus-to-event-grid-integration-example/event-grid-subscription-page.png)
    3. Chose **Select an endpoint**, paste the function URL, and then select **Confirm selection**. 

        ![Function - select the endpoint](./media/service-bus-to-event-grid-integration-example/function-select-endpoint.png)
    4. Switch to the **Filters** tab, enter the name of the **first subscription** to the Service Bus topic you created earlier, and then select the **Create** button. 

        ![Event subscription filter](./media/service-bus-to-event-grid-integration-example/event-subscription-filter.png)
4. Confirm that you see the event subscription in the list.

    ![Event subscription in the list](./media/service-bus-to-event-grid-integration-example/event-subscription-in-list.png)

## Send messages to the Service Bus topic
1. Run the .NET C# application, which sends messages to the Service Bus topic. 

    ![Console app output](./media/service-bus-to-event-grid-integration-example/console-app-output.png)
1. On the page for your Azure function app, expand **Functions**, expand your **function**, and select **Monitor**. 

    ![Monitor function](./media/service-bus-to-event-grid-integration-example/function-monitor.png)

## Receive messages by using Azure Functions
In the preceding section, you observed a simple test and debugging scenario and ensured that events are flowing. 

In this section, you'll learn how to receive and process messages after you receive an event.

### Publish a function from Visual Studio
1. In the same Visual Studio solution (**SBEventGridIntegration**) that you opened, select **ReceiveMessagesOnEvent.cs** in the **SBEventGridIntegration** project. 
2. Enter your Service Bus connection string in the following code:

    ```Csharp
    const string ServiceBusConnectionString = "YOUR CONNECTION STRING";
    ```
3. Download the **publish profile** for the function:
    1. Select your function app. 
    2. Select the **Overview** tab if it isn't already selected. 
    3. Select **Get publish profile** on the toolbar. 

        ![Get publish profile for the function](./media/service-bus-to-event-grid-integration-example/function-download-publish-profile.png)
    4. Save the file to your project's folder. 
4. In Visual Studio, right-click **SBEventGridIntegration**, and then select **Publish**. 
5. Select *Start** on the **Publish** page. 
6. On the **Pick a publish target** page, do the following steps, select **Import Profile**. 

    ![Visual Studio - Import Profile button](./media/service-bus-to-event-grid-integration-example/visual-studio-import-profile-button.png)
7. Select the **publish profile file** you downloaded earlier. 
8. Select **Publish** on the **Publish** page. 

    ![Visual Studio - Publish](./media/service-bus-to-event-grid-integration-example/select-publish.png)
9. Confirm that you see the new Azure function **ReceiveMessagesOnEvent**. Refresh the page if needed. 

    ![Confirm that the new function is created](./media/service-bus-to-event-grid-integration-example/function-receive-messages.png)
10. Get the URL to the new function and note it down. 

### Event Grid subscription

1. Delete the existing Event Grid subscription:
    1. On the **Service Bus Namespace** page, select **Events** on the left menu. 
    2. Select the existing event subscription. 
    3. On the **Event Subscription** page, select **Delete**.
2. Follow instructions in the [Connect the function and namespace via Event Grid](#connect-the-function-and-namespace-via-event-grid) section to create an Event Grid subscription using the new function URL.
3. Follow instruction in the [Send messages to the Service Bus topic](#send-messages-to-the-service-bus-topic) section to send messages to the topic and monitor the function. 

## Receive messages by using Logic Apps
Connect a logic app with Azure Service Bus and Azure Event Grid by following these steps:

1. Create a logic app in the Azure portal.
    1. Select **+ Create a resource**, select **Integration**, and then select **Logic App**. 
    2. On the **Logic App - Create** page, enter a **name** for the logic app.
    3. Select your Azure **subscription**. 
    4. Select **Use existing** for the **Resource group**, and select the resource group that you used for other resources (like Azure function, Service Bus namespace) that you created earlier. 
    5. Select the **Location** for the logic app. 
    6. Select **Create** to create the logic app. 
2. On the **Logic Apps Designer** page, select **Blank Logic App** under **Templates**. 
3. On the designer, do the following steps:
    1. Search for **Event Grid**. 
    2. Select **When a resource event occurs (preview) - Azure Event Grid**. 

        ![Logic Apps Designer - select Event Grid trigger](./media/service-bus-to-event-grid-integration-example/logic-apps-event-grid-trigger.png)
4. Select **Sign in**, enter your Azure credentials, and select **Allow Access**. 
5. On the **When a resource event occurs** page, do the following steps:
    1. Select your Azure subscription. 
    2. For **Resource Type**, select **Microsoft.ServiceBus.Namespaces**. 
    3. For **Resource Name**, select your Service Bus namespace. 
    4. Select **Add new parameter**, and select **Suffix Filter**. 
    5. For **Suffix Filter**, enter the name of your second Service Bus topic subscription. 
        ![Logic Apps Designer - configure event](./media/service-bus-to-event-grid-integration-example/logic-app-configure-event.png)
6. Select **+ New Step** in the designer, and do the following steps:
    1. Search for **Service Bus**.
    2. Select **Service Bus** in the list. 
    3. Select for **Get messages** in the **Actions** list. 
    4. Select **Get messages from a topic subscription (peek-lock)**. 

        ![Logic Apps Designer - get messages action](./media/service-bus-to-event-grid-integration-example/service-bus-get-messages-step.png)
    5. Enter a **name for the connection**. For example: **Get messages from the topic subscription**, and select the Service Bus namespace. 

        ![Logic Apps Designer - select the Service Bus namespace](./media/service-bus-to-event-grid-integration-example/logic-apps-select-namespace.png) 
    6. Select **RootManageSharedAccessKey**.

        ![Logic Apps Designer - select the shared access key](./media/service-bus-to-event-grid-integration-example/logic-app-shared-access-key.png) 
    7. Select **Create**. 
    8. Select your topic and subscription. 
    
        ![Logic Apps Designer - select your Service Bus topic and subscription](./media/service-bus-to-event-grid-integration-example/logic-app-select-topic-subscription.png)
7. Select **+ New step**, and do the following steps: 
    1. Select **Service Bus**.
    2. Select **Complete the message in a topic subscription** from the list of actions. 
    3. Select your Service Bus **topic**.
    4. Select the second **subscription** to the topic.
    5. For **Lock token of the message**, select **Lock Token** from the **Dynamic content**. 

        ![Logic Apps Designer - select your Service Bus topic and subscription](./media/service-bus-to-event-grid-integration-example/logic-app-complete-message.png)
8. Select **Save** on the toolbar on the Logic Apps Designer to save the logic app. 
9. Follow instruction in the [Send messages to the Service Bus topic](#send-messages-to-the-service-bus-topic) section to send messages to the topic. 
10. Switch to the **Overview** page of your logic app. You see the logic app runs in the **Runs history** for the messages sent.

    ![Logic Apps Designer - logic app runs](./media/service-bus-to-event-grid-integration-example/logic-app-runs.png)

## Next steps

* Learn more about [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/).
* Learn more about [Azure Functions](https://docs.microsoft.com/azure/azure-functions/).
* Learn more about the [Logic Apps feature of Azure App Service](https://docs.microsoft.com/azure/logic-apps/).
* Learn more about [Azure Service Bus](https://docs.microsoft.com/azure/service-bus/).


[2]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid2.png
[3]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid3.png
[7]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid7.png
[8]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid8.png
[9]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid9.png
[10]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid10.png
[11]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid11.png
[12]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid12.png
[12-1]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid12-1.png
[12-2]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid12-2.png
[13]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid13.png
[14]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid14.png
[15]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid15.png
[16]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid16.png
[17]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid17.png
[18]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid18.png
[20]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal.png
[21]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal2.png
