---
title: Scenario - Trigger logic apps with Azure Functions and Azure Service Bus | Microsoft Docs
description: Create a function to trigger a logic app by using Azure Functions and Azure Service Bus
services: logic-apps,functions
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 19cbd921-7071-4221-ab86-b44d0fc0ecef
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 05/23/2016
ms.author: LADocs; jehollan

---
# Scenario: Trigger a logic app with Azure Functions and Azure Service Bus

You can use Azure Functions to create a trigger for a logic app when you need to deploy a long-running listener or task. For example, you can create a function that listens in on a queue and then immediately fire a logic app as a push trigger.

## Build the logic app
In this example, you have a function running for each logic app that needs to be triggered. First, create a logic app that has an HTTP request trigger. The function calls that endpoint whenever a queue message is received.  

1. Create a logic app.
2. Select the **Manual - When an HTTP Request is Received** trigger.
   Optionally, you can specify a JSON schema to use with the queue message by using a tool like [jsonschema.net](http://jsonschema.net). Paste the schema in the trigger. Schemas help the designer understand the shape of the data and flow properties more easily through the workflow.
2. Add any additional steps that you want to occur after a queue message is received. For example, send an email via Office 365.  
3. Save the logic app to generate the callback URL for the trigger to this logic app. The URL appears on the trigger card.

![The callback URL appears on the trigger card][1]

## Build the function
Next, you must create a function that acts as the trigger and listens to the queue.

1. In the [Azure Functions portal](https://functions.azure.com/signin), select **New Function**, and then select the **ServiceBusQueueTrigger - C#** template.
   
    ![Azure Functions portal][2]
2. Configure the connection to the Service Bus queue, which uses the Azure Service Bus SDK `OnMessageReceive()` listener.
3. Write a basic function to call the logic app endpoint (created earlier) by using the queue message as a trigger. Here's a full example of a function. The example uses an `application/json` message content type, but you can change this type as necessary.
   
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
[1]: ./media/logic-apps-scenario-function-sb-trigger/manualtrigger.png
[2]: ./media/logic-apps-scenario-function-sb-trigger/newqueuetriggerfunction.png
