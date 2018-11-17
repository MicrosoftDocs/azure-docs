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
ms.topic: get-started-article
ms.date: 09/15/2018
ms.author: spelluru

---
# Azure Service Bus to Azure Event Grid integration examples

In this article, you learn how to set up an Azure function and a logic app, which both receive messages based on receiving an event from Azure Event Grid. You'll do the following:
 
* Create a simple [test Azure function](#test-function-setup) for debugging and viewing the initial flow of events from the Event Grid. Perform this step regardless of whether you perform the others.
* Create an [Azure function to receive and process Azure Service Bus messages](#receive-messages-using-azure-function) based on Event Grid events.
* Utilize the [The Logic Apps feature of Azure App Service](#receive-messages-using-azure-logic-app).

The example that you create assumes that the Service Bus topic has two subscriptions. The example also assumes that the Event Grid subscription was created to send events for only one Service Bus subscription. 

In the example, you send messages to the Service Bus topic and then verify that the event has been generated for this Service Bus subscription. The function or logic app receives the messages from the Service Bus subscription and then completes it.

## Prerequisites
Before you begin, make sure that you have completed the steps in the next two sections.

### Create a Service Bus namespace

Create a Service Bus Premium namespace, and create a Service Bus topic that has two subscriptions.

### Send a message to the Service Bus topic

You can use any method to send a message to your Service Bus topic. The sample code at the end of this procedure assumes that you are using Visual Studio 2017.

1. Clone [the GitHub azure-service-bus repository](https://github.com/Azure/azure-service-bus/).

1. In Visual Studio, go to the *\samples\DotNet\Microsoft.ServiceBus.Messaging\ServiceBusEventGridIntegration* folder, and then open the *SBEventGridIntegration.sln* file.

1. Go to the **MessageSender** project, and then select **Program.cs**.

   ![8][]

1. Fill in your topic name and connection string, and then execute the following console application code:

    ```CSharp
    const string ServiceBusConnectionString = "YOUR CONNECTION STRING";
    const string TopicName = "YOUR TOPIC NAME";
    ```

## Set up a test function

Before you work through the entire scenario, set up at least a small test function, which you can use to debug and observe what events are flowing.

1. In the Azure portal, create a new Azure Functions application. To learn the basics of Azure Functions, see [Azure Functions documentation](https://docs.microsoft.com/azure/azure-functions/).

1. In your newly created function, select the plus sign (+) to add an HTTP trigger function:

    ![2][]
    
    The **Get started quickly with a premade function** window opens.

    ![3][]

1. Select the **Webhook + API** button, select **CSharp**, and then select **Create this function**.
 
1. Into the function, paste the following code:

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

1. Select **Save and run**.

## Connect the function and namespace via Event Grid

In this section, you tie together the function and the Service Bus namespace. For this example, use the Azure portal. To understand how to use PowerShell or Azure CLI to do this procedure, see [Azure Service Bus to Azure Event Grid integration overview](service-bus-to-event-grid-integration-concept.md).

To create an Azure Event Grid subscription, do the following:
1. In the Azure portal, go to your namespace and then, in the left pane, select **Event Grid**.  
    Your namespace window opens, with two Event Grid subscriptions displayed in the right pane.

    ![20][]

1. Select **Event Subscription**.  
    The **Event Subscription** window opens. The following image displays a form for subscribing to an Azure function or a webhook without applying filters.

    ![21][]

1. Complete the form as shown and, in the **Suffix Filter** box, remember to enter the relevant filter.

1. Select **Create**.

1. Send a message to your Service Bus topic, as mentioned in the "Prerequisites" section, and then verify that events are flowing via the Azure Functions Monitoring feature.

The next step is to tie together the function and the Service Bus namespace. For this example, use the Azure portal. To understand how to use PowerShell or Azure CLI to perform this step, see [Azure Service Bus to Azure Event Grid integration overview](service-bus-to-event-grid-integration-concept.md).

![9][]

### Receive messages by using Azure Functions

In the preceding section, you observed a simple test and debugging scenario and ensured that events are flowing. 

In this section, you'll learn how to receive and process messages after you receive an event.

You'll add an Azure function, as shown in the following example, because the Service Bus functions within Azure Functions do not yet natively support the new Event Grid integration.

1. In the same Visual Studio Solution that you opened in the prerequisites, select **ReceiveMessagesOnEvent.cs**. 

    ![10][]

1. Enter your connection string in the following code:

    ```Csharp
    const string ServiceBusConnectionString = "YOUR CONNECTION STRING";
    ```

1. In the Azure portal, download the publishing profile for the Azure function that you created in the "Set up a test function" section.

    ![11][]

1. In Visual Studio, right-click **SBEventGridIntegration**, and then select **Publish**. 

1. In the **Publish** pane for the publishing profile that you downloaded previously, select **Import profile**, and then select **Publish**.

    ![12][]

1. After you've published the new Azure function, create a new Azure Event Grid subscription that points to the new Azure function.  
    In the **Ends with** box, be sure to apply the correct filter, which should be your Service Bus subscription name.

1. Send a message to the Azure Service Bus topic that you created previously, and then monitor the Azure Functions log in the Azure portal to ensure that events are flowing and that messages are being received.

    ![12-1][]

### Receive messages by using Logic Apps

Connect a logic app with Azure Service Bus and Azure Event Grid by doing the following:

1. Create a new logic app in the Azure portal, and select **Event Grid** as the start action.

    ![13][]

    The Logic Apps designer window opens.

    ![14][]

1. Add your information by doing the following:

    a. In the **Resource Name** box, enter your own namespace name. 

    b. Under **Advanced options**, in the **Suffix Filter** box, enter filter for your subscription.

1. Add a Service Bus receive action to receive messages from a topic subscription.  
    The final action is shown in the following image:

    ![15][]

1. Add a complete event, as shown in the following image:

    ![16][]

1. Save the logic app, and send a message to your Service Bus topic, as mentioned in the "Prerequisites" section.  
    Observe the logic app execution. To view more data for the execution, select **Overview**, and then view the data under **Runs history**.

    ![17][]

    ![18][]

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
