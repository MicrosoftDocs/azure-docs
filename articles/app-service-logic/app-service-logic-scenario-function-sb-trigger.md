<properties
   pageTitle="Logic app scenario: Create an Azure Functions Service Bus trigger | Microsoft Azure"
   description="Use Azure Functions to create a Service Bus trigger for a logic app"
   services="app-service\logic,functions"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/23/2016"
   ms.author="jehollan"/>

# Logic app scenario: Create an Azure Service Bus trigger by using Azure Functions

You can use Azure Functions to create a trigger for a logic app when you need to deploy a long-running listener or task. For example, you can create a function that will listen in on a queue and then immediately fire a logic app as a push trigger.

## Build the logic app

In this example, you have a function running for each logic app that needs to be triggered. First, create a logic app that has an HTTP request trigger. The function calls that endpoint whenever a queue message is received.  

1. Create a new logic app; select the **Manual - When an HTTP Request is Received** trigger.  
   Optionally, you can specify a JSON schema to use with the queue message by using a tool like [jsonschema.net](http://jsonschema.net). Paste the schema in the trigger. This helps the designer understand the shape of the data and more easily flow properties through the workflow.
1. Add any additional steps that you want to occur after a queue message is received. For example, send an email via Office 365.  
1. Save the logic app to generate the callback URL for the trigger to this logic app. The URL appears on the trigger card.

![The callback URL appears on the trigger card][1]

## Build the function

Next, you need to create a function that will act as the trigger and listen to the queue.

1. In the [Azure Functions portal](https://functions.azure.com/signin), select **New Function**, and then select the **ServiceBusQueueTrigger - C#** template.

    ![Azure Functions portal][2]

2. Configure the connection to the Service Bus queue (which will use the Azure Service Bus SDK `OnMessageReceive()` listener).
3. Write a simple function to call the logic app endpoint (created earlier) by using the queue message as a trigger. Here's a full example of a function. The example uses an `application/json` message content type, but you can change this if needed.

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

To test, add a queue message via a tool like [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer). See the logic app fire immediately after the function receives the message.

<!-- Image References -->
[1]: ./media/app-service-logic-scenario-function-sb-trigger/manualTrigger.PNG
[2]: ./media/app-service-logic-scenario-function-sb-trigger/newQueueTriggerFunction.PNG
