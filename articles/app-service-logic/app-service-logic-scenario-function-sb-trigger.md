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

Azure Functions can be utilized as a trigger for Logic Apps whenever long-running listeners or tasks need to be deployed.  For example, you can create an Azure Function that would listen on a queue, and immediately fire a Logic App as a push trigger.

## Building the Logic App

In this example you will have a function running for each Logic App needing to be triggered.  So first you need to create a Logic App with an HTTP Request trigger - the Azure Function will call that endpoint whenever a queue message is received.  

1. Open a new Logic App and select the **Manual - When an HTTP Request is Received** trigger.  
    * You can optionally specify a JSON Schema that queue message will have via a tool like [jsonschema.net](http://jsonschema.net) and paste it in the trigger.  This will allow the designer to understand the shape of the data and easily flow properties through the workflow.
1. Add any steps you want to happen after a queue message is received.  For example, you could send an email message via Office 365.  
1. Save the Logic App to generate the callback URL for the trigger to this Logic App.  The URL will appear on the trigger card.

![][1]

## Building the Azure Function

Next, you need to create an Azure Function that will act as the trigger and listen to the queue.

1. Open the [Azure Functions Portal](https://functions.azure.com/signin) and select **New Function** with a **ServiceBusQueueTrigger - C#** template.

    ![][2]

2. Configure the connection to the Service Bus Queue (which will use the Service Bus SDK `OnMessageReceive()` listener)
3. Write a simple function to call the Logic App endpoint (from above) with the queue message.  Here's a full example of a function below with a message content-type of `application/json`, but this could be changed as needed.

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

4. Save the function

You can test by adding a queue message via a tool like [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) and see the Logic App fire immediately after the Function receives the message.

<!-- Image References -->
[1]: ./media/app-service-logic-scenario-function-sb-trigger/manualTrigger.PNG
[2]: ./media/app-service-logic-scenario-function-sb-trigger/newQueueTriggerFunction.PNG
