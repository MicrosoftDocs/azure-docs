---
title: Azure Service Bus to Event Grid integration examples | Microsoft Docs
description: Examples of Service Bus messaging and Event Grid integration
services: service-bus-messaging
documentationcenter: .net
author: ChristianWolf42
manager: timlt
editor: ''

ms.assetid: f99766cb-8f4b-4baf-b061-4b1e2ae570e4
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: get-started-article
ms.date: 02/15/2018
ms.author: chwolf

---
# Azure Service Bus to Azure Event Grid examples

In this document, you learn how to set up azure functions and a logic app that receive messages based on receiving an event from Event Grid. The example assumes a Service Bus topic with two subscriptions and that the event grid subscription is created in a way to send events only for one Service Bus subscription. Then you send messages to the Service Bus topic and verify that the event is generated for this Service Bus subscription and then the function or logic app receives the messages from that Service Bus subscription and complete it.

* Please ensure you have all [Prerequisites](#prerequisites) in place first.
* Create a [simple test Azure Function](#test-function-setup) for debugging and seeing initial flow of events from Event Grid.  **This step should be done regardless of executing 3. or 4.**
* Create a [Azure Function to receive and process service bus messages](#receive-messages-using-azure-function) based on event grid events.
* Utilize [Logic Apps](#receive-messages-using-azure-logic-app).

## Prerequisites

### Service Bus Namespace

Create a Service Bus Premium Namespace. Create a Service Bus Topic with two subscriptions.

### Code to Send Message to the Service Bus topic

You can use any means to send a message to your Service Bus topic. Alternatively you can use the sample from below. The sample code assumes that you are using Visual Studio 2017.

Clone [this GitHub repository](https://github.com/Azure/azure-service-bus/).

Navigate to the following folder:

\samples\DotNet\Microsoft.ServiceBus.Messaging\ServiceBusEventGridIntegration and open  the file: SBEventGridIntegration.sln.

Then navigate to the project MessageSender and open Program.cs.

![8][]

Fill in your topic name and also your connection string and execute the console application:

```CSharp
const string ServiceBusConnectionString = "YOUR CONNECTION STRING";
const string TopicName = "YOUR TOPIC NAME";
```

## Test function setup

Before working through the entire end to end scenario you want to have at least a small test function, which you can use to debug and see what events are flowing.

In the portal, create a new Azure Function Application. Follow this [link](https://docs.microsoft.com/en-us/azure/azure-functions/) to learn the basics of Azure Functions.

In your newly created function click the little plus to add an http trigger function:

![2][]

![3][]

Then copy the following code into the function:

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

Click save and run.

## Connect Function and Namespace via Event Grid

The next step is to tie the function and the service bus namespace together. For this example, use the Azure portal. See the [concepts](service-bus-to-event-grid-integration-concept.md page to understand how to use PowerShell or Azure CLI to achieve the same.

To create a new Azure Event Grid subscription, navigate to your namespace in the Azure portal and select the Event Grid blade. Click on “+ Event Subscription.”

Following screenshot, shows a namespace, which already has a few Event Grid subscriptions.

![20][]

Following screenshot, shows how to subscribe to an Azure Function or a Web Hook without any specific filtering. Remember to add the regarding filter for your Service Bus subscription as "Suffix Filter":

![21][]

Send a message to your Service Bus topic as mentioned in the pre-requisites and verify that events are flowing via the Monitoring feature of the Azure Function.

![9][]

### Receive messages using Azure Function

In the previous section, you looked at a simple test and debugging scenario and ensured that events are flowing. In this part of the documentation you will look at how to receive and process messages upon receiving an event.

The reason for adding an Azure Function in the following way, is because the Service Bus Functions within Azure Functions itself are not natively supporting the new Event Grid integration yet.

In the same Visual Studio Solution you opened in the prerequisites, select ReceiveMessagesOnEvent.cs. Enter your connection string in the code:

![10][]

```Csharp
const string ServiceBusConnectionString = "YOUR CONNECTION STRING";
```

Then go to the Azure portal and download the publishing profile for the Azure Function you created before in [2. Test function setup](#2-test-function-setup).

![11][]

Then in Visual Studio right click on SBEventGridIntegration and select Publish. Use the publishing profile you downloaded before, select import profile and click Publish.

![12][]

After you published the new Azure function, create a new Azure Event Grid Subscription pointing to the new Azure Function. Make sure that you apply the correct “Ends with” filter, which should be your Service Bus Subscription Name.

Then send a message to the Azure Service Bus topic you created before and examine in the Azure Function log in the portal that events are flowing and that messages are received.

![12-1][]

### Receive messages using Azure Logic App

The following instructions show how to connect an Azure Logic App together with Azure Service Bus and Azure Event Grid:

First, create a new Logic App in the Azure portal and select Event Grid as start action.

![13][]

The initial view in the Logic Apps designer should look like the following Screenshot, whereas you need to replace “Resource Name” with your own namespace name. Also make sure to expand the advanced options and add the suffix filter for your subscription:

![14][]

Then add a service bus Receive action to receive from a topic subscription. The final action should look like the following Screenshot.

![15][]

Then add a complete event, which should look like this.

![16][]

Save the logic app and send a message to your Service Bus topic as mentioned in the prerequisites. Then observe the Logic apps execution. If you click on "Overview" and then there on the "Runs history", you can also get more data about the execution.

![17][]

![18][]

## Next steps

* Learn more about [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/).
* Learn more about [Azure Functions](https://docs.microsoft.com/azure/azure-functions/).
* Learn more about [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/).
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
