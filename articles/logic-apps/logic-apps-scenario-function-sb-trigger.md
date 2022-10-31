---
title: Call logic app workflows with Azure Functions
description: Trigger a logic app workflow whenever an Azure Service Bus message arrives in a queue by using Azure Functions to call an endpoint on the logic app workflow.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/31/2022
ms.custom: devx-track-csharp
#Customer intent: As a logic apps developer, I want to use Azure Logic Apps to respond automatically and instantaneously to Azure Service Bus messages so that I don't have to monitor the messages manually.
---

# Call or trigger logic app workflows by using Azure Functions and Azure Service Bus

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

You can use [Azure Functions](../azure-functions/functions-overview.md) to trigger a logic app workflow when you need to deploy a long-running listener or task. For example, you can create a function that listens to an [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) queue and immediately fires a logic app workflow as a push trigger.

This how-to guide shows you how to create a logic app workflow that starts with an HTTP request trigger. You also see how to create a function that listens to a message queue and calls the logic app endpoint whenever a queue message arrives.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Service Bus namespace. If you don't have a namespace, [create your namespace first](../service-bus-messaging/service-bus-create-namespace-portal.md).

* A function app, which is a container for your functions. If you don't have a function app, [create your function app first](../azure-functions/functions-get-started.md), and make sure that you select .NET as the runtime stack.

* Basic knowledge about [how to create a Consumption logic app workflow](quickstart-create-first-logic-app-workflow.md).

## Create a logic app workflow

For this scenario, you have a function running for each logic app workflow that you want to trigger. First, you create a logic app workflow that starts with an HTTP request trigger. The function calls that endpoint whenever a queue message is received.

1. Sign in to the [Azure portal](https://portal.azure.com), and create a blank logic app workflow.

   If you're new to logic apps, review [Quickstart: Create your first logic app workflow](quickstart-create-first-logic-app-workflow.md).

1. In the search box, enter **http request**. From the triggers list, select the **When a HTTP request is received** trigger.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/when-http-request-received-trigger.png" alt-text="Screenshot of the designer in the portal. The search box contains 'http request.' Under 'Triggers,' 'When a HTTP request is received' is highlighted.":::

   With the Request trigger, you can optionally enter a JSON schema to use with the queue message. JSON schemas help the designer understand the structure for the input data, and make the outputs easier for you to use in your workflow.

1. To specify a schema, enter the schema in the **Request Body JSON Schema** box.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/when-http-request-received-trigger-schema.png" alt-text="Screenshot of the details of an HTTP request trigger. Some JSON code is visible in the 'Request Body JSON Schema' box.":::

   If you don't have a schema, but you have a sample payload in JSON format, you can generate a schema from that payload.

   1. In the Request trigger, select **Use sample payload to generate schema**.

   1. Under **Enter or paste a sample JSON payload**, enter your sample payload, and then select **Done**.

      :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/enter-sample-payload.png" alt-text="Screenshot of the details of an HTTP request trigger. Under 'Enter or paste a sample JSON payload,' some payload data is visible.":::

   The sample payload that's pictured earlier generates the following schema, which appears in the trigger:

   ```json
   {
      "type": "object",
      "properties": {
         "address": {
            "type": "object",
            "properties": {
               "number": {
                  "type": "integer"
               },
               "street": {
                  "type": "string"
               },
               "city": {
                  "type": "string"
               },
               "postalCode": {
                  "type": "integer"
               },
               "country": {
                  "type": "string"
               }
            }
         }
      }
   }
   ```

1. Add any other actions that you want to run after receiving the queue message.

   For example, you can send an email with the Office 365 Outlook connector.

1. Save your logic app workflow. This action generates the callback URL for the trigger in your logic app workflow. Later, you use this callback URL in the code for the Azure Service Bus Queue trigger.

   The callback URL appears in the **HTTP POST URL** property.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/callback-URL-for-trigger.png" alt-text="Screenshot of the details of an HTTP request trigger. Next to 'HTTP POST URL,' a URL is visible.":::

## Create a function

Next, create the function that acts as the trigger and listens to the queue.

1. In the Azure portal, go to your function app. 

1. On the function app navigation menu, select **Functions**. On the **Functions** pane, select **Create**.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/add-new-function-to-function-app.png" alt-text="Screenshot of the 'Functions' page of a function app in the portal, with 'Create' highlighted. On the navigation menu, 'Functions' is highlighted.":::

1. Select the **Azure Service Bus Queue trigger** template.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/current-add-queue-trigger-template.png" alt-text="Screenshot of the 'Create function' page of a function app in the portal. Under 'Template,' 'Azure Service Bus Queue trigger' is highlighted.":::

1. Under **Template details**, enter a name for your function, and set up the **Service Bus connection** for the queue, which uses the Service Bus SDK `OnMessageReceive()` listener. Next, enter the queue name, and then select **Create**.

1. Write a basic function to call the logic app endpoint that you created earlier. Use the queue message to trigger the function. Before you write your function, review the following considerations:

   * The following example uses the `application/json` message content type, but you can change this type as necessary.
   
   * Due to possible concurrently running functions, high volumes, or heavy loads, avoid instantiating the [HTTPClient class](/dotnet/api/system.net.http.httpclient) with the `using` statement and directly creating HTTPClient instances per request. For more information, see [Use HttpClientFactory to implement resilient HTTP requests](/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests#issues-with-the-original-httpclient-class-available-in-net-core).
   
   * If possible, reuse the instance of HTTP clients. For more information, see [Manage connections in Azure Functions](../azure-functions/manage-connections.md).

   The following example uses the [`Task.Run` method](/dotnet/api/system.threading.tasks.task.run) in [asynchronous](/dotnet/csharp/language-reference/keywords/async) mode. For more information, see [Asynchronous programming with async and await](/dotnet/csharp/programming-guide/concepts/async/).

   ```csharp
   using System;
   using System.Threading.Tasks;
   using System.Net.Http;
   using System.Text;

   // Set up the logic app workflow URI. You can also get it from App Settings or an environment variable.
   private static string logicAppUri = @"https://prod-05.westus.logic.azure.com:443/workflows/<remaining-callback-URL>";

   // Reuse the instance of HTTP clients if possible. For more information, see https://learn.microsoft.com/azure/azure-functions/manage-connections.
   private static HttpClient httpClient = new HttpClient();

   public static async Task Run(string myQueueItem, TraceWriter log) 
   {
      log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
      var response = await httpClient.PostAsync(logicAppUri, new StringContent(myQueueItem, Encoding.UTF8, "application/json")); 
   }
   ```

## Test your logic app workflow

To test your logic app workflow, use a tool to add a message to your Service Bus queue.

1. In the Azure portal, open your Service Bus namespace.

1. On the Service Bus namespace navigation menu, select **Queues**.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/service-bus-namespace-queues.png" alt-text="Screenshot of a Service Bus namespace in the Azure portal. On the navigation menu, 'Queues' is highlighted.":::

1. Select the queue that you linked to your function through its Service Bus connection.

1. On the queue navigation menu, select **Service Bus Explorer**, and then select **Send messages**.
   
   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/select-service-bus-explorer.png" alt-text="Screenshot of a Service Bus queue page in the portal, with 'Send messages' highlighted. On the navigation menu, 'Service Bus Explorer' is highlighted.":::

1. Use the tool to send a message to your Service Bus queue. The message triggers your logic app workflow.

## Next steps

* [Call, trigger, or nest workflows by using HTTP endpoints](logic-apps-http-endpoint.md)
