<properties
   pageTitle="Logic App Scenario: Azure Function Service Bus Trigger | Microsoft Azure"
   description="See how to use Azure Functions as a service bus trigger for Logic Apps"
   services="app-service\logic,functions"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/23/2016"
   ms.author="jehollan"/>
   
# Logic App Scenario: Azure Function Service Bus Trigger

Azure Functions can be utilized as a trigger for Logic Apps whenever long-running listeners or tasks need to be deployed.  In this case, I wanted to create a listener that would trigger the instant something was added to a Service Bus Queue, and immediately fire a Logic App as a push trigger.

## Building the Logic App

For this scenario I want to have 1:1 mapping between queue receiver and Logic App.  I will create a Logic App with an HTTP Request trigger, so I can program my Azure Function to call that endpoint whenever a queue message is received.  I open a new Logic App and select the **Manual - When an HTTP Request is Received** trigger.  I can then add any steps I want to happen after a queue message is received.  In this case I'm going to add a step to send me an email message via Office 365.  After I save the Logic App, I can see the callback URL I need to make an HTTP POST to trigger this Logic App.  In addition, if I wanted to specify a JSON Schema the queue message will have, I could generate one via a tool like [jsonschema.net](http://jsonschema.net) and paste it in the trigger so that I could easily flow the trigger body properties through the Logic App.

![][1]

## Building the Azure Function

First I opened the [Azure Functions Portal](https://functions.azure.com/signin) and selected to create a **New Function** with the **ServiceBusQueueTrigger - C#** template.

![][2]

After I configure the Azure Function to trigger with an input from a Service Bus Queue (which will use the Service Bus SDK `OnMessageReceive()` listener), I can write a simple function to call the Logic App endpoint from above with the queue message.  In this case I'm assuming I will be getting and sending content-type of `application/json`, but this could be changed as needed.


```
using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;

private static string logicAppUri = @"https://prod-05.westus.logic.azure.com:443/.........";

public static void Run(string myQueueItem, TraceWriter log)
{
    
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
    using (var client = new HttpClient())
    {
        var response = client.PostAsync(logicAppUri, new StringContent(myQueueItem, Encoding.UTF8, "application/json")).Result;
    }
}
```

After I save, I can then test by adding a queue message via a tool like [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) to add a JSON message to a queue and see the Logic App fire within a second.

<!-- Image References -->
[1]: ./media/app-service-logic-scenario-function-sb-trigger/manualTrigger.PNG
[2]: ./media/app-service-logic-scenario-function-sb-trigger/newQueueTriggerFunction.PNG