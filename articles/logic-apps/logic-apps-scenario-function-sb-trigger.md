---
title: Set up long-running tasks by calling workflows with Azure Functions
description: Set up long-running tasks by creating an Azure Logic Apps workflow that monitors and responds to messages or events and uses Azure Functions to trigger the workflow.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/7/2022
ms.custom: devx-track-csharp
#Customer intent: As a logic apps developer, I want to set up a long-running task by creating a logic app workflow that monitors and responds to messages or events and uses Azure Functions to call the workflow.
---

# Set up long running tasks by calling logic app workflows with Azure Functions

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

When you need to deploy a long-running listener or task, you can create a logic app workflow that uses the Request trigger and Azure Functions to call that trigger and run the workflow.

For example, you can create a function that listens for messages that arrive in an Azure Service Bus queue. When this event happens, the function calls the Request trigger, which works as a push trigger to automatically run your workflow.

This how-to guide shows how to create a logic app workflow that starts with the Request trigger. You then create a function that listens to a Service Bus queue. When a message arrives in the queue, the function calls the endpoint created by the Request trigger to run your workflow.

> [!NOTE]
>
> Although you can implement this behavior using either a Consumption or Standard logic app workflow, 
> this example continues with a Consumption workflow.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Service Bus namespace. If you don't have a namespace, [create your namespace first](../service-bus-messaging/service-bus-create-namespace-portal.md). For more information, see [What is Azure Service Bus?](../service-bus-messaging/service-bus-messaging-overview.md)

* A function app, which is a container for your functions. If you don't have a function app, [create your function app first](../azure-functions/functions-get-started.md), and make sure that you select .NET for the **Runtime stack** property.

* Basic knowledge about how to create logic app workflows. For more information, see [Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps](quickstart-create-example-consumption-workflow.md).

## Create a logic app workflow

1. In the [Azure portal](https://portal.azure.com), create a Consumption blank logic app by selecting the **Blank Logic App** template.

1. After the designer opens, under the designer search box, select **Built-in**. In the search box, enter **request**.

1. From the triggers list, select the trigger named **When a HTTP request is received**.

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

1. Under the trigger, add any other actions that you want to use to process the received message.

   For example, you can add an action that sends email with the Office 365 Outlook connector.

1. Save your logic app workflow.

   This step generates the callback URL for the Request trigger in your workflow. Later, you use this callback URL in the code for the Azure Service Bus Queue trigger. The callback URL appears in the **HTTP POST URL** property.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/callback-URL-for-trigger.png" alt-text="Screenshot of the details of an HTTP request trigger. Next to 'HTTP POST URL,' a URL is visible.":::

## Create a function

Next, create the function that listens to the queue and calls the endpoint on the Request trigger when a message arrives.

1. In the [Azure portal](https://portal.azure.com), open your function app.

1. On the function app navigation menu, select **Functions**. On the **Functions** pane, select **Create**.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/add-new-function-to-function-app.png" alt-text="Screenshot of a function app with 'Functions' highlighted on the function app menu. The 'Functions' page is opened, and 'Create' is highlighted.":::

1. Under **Select a template**, select the template named **Azure Service Bus Queue trigger**. After the **Template details** section appears, which shows different options based on your template selection, provide the following information:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **New Function** | <*function-name*> | Enter a name for your function. |
   | **Service Bus connection** | <*Service-Bus-connection*> | Select **New** to set up the connection for your Service Bus queue, which uses the Service Bus SDK `OnMessageReceive()` listener. |
   | **Queue name** |  <*queue-name*> | Enter the name for your queue. |

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/current-add-queue-trigger-template.png" alt-text="Screenshot of the 'Create function' pane with 'Azure Service Bus Queue trigger' highlighted, and template example details entered.":::

1. When you're done, select **Create**.

   The Azure portal now shows the **Overview** page for your new Azure Service Bus Queue trigger function.

1. Now, write a basic function to call the endpoint for the logic app workflow that you created earlier. Before you write your function, review the following considerations:

   * Trigger the function by using the message from the queue message.

   * Due to possible concurrently running functions, high volumes, or heavy loads, avoid instantiating the [HTTPClient class](/dotnet/api/system.net.http.httpclient) with the `using` statement and directly creating HTTPClient instances per request. For more information, see [Use HttpClientFactory to implement resilient HTTP requests](/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests#issues-with-the-original-httpclient-class-available-in-net-core).
   
   * If possible, reuse the instance of HTTP clients. For more information, see [Manage connections in Azure Functions](../azure-functions/manage-connections.md).

   The following example uses the [`Task.Run` method](/dotnet/api/system.threading.tasks.task.run) in [asynchronous](/dotnet/csharp/language-reference/keywords/async) mode. For more information, see [Asynchronous programming with async and await](/dotnet/csharp/programming-guide/concepts/async/). The example also uses the `application/json` message content type, but you can change this type as necessary.

   ```csharp
   using System;
   using System.Threading.Tasks;
   using System.Net.Http;
   using System.Text;

   // Set up the URI for the logic app workflow. You can also get this value on the logic app's 'Overview' pane, under the trigger history, or from an environment variable.
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

For testing, add a message to your Service Bus queue by using the following steps or other tool:

1. In the [Azure portal](https://portal.azure.com), open your Service Bus namespace.

1. On the Service Bus namespace navigation menu, select **Queues**.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/service-bus-namespace-queues.png" alt-text="Screenshot of a Service Bus namespace. On the navigation menu, 'Queues' is highlighted.":::

1. Select the Service Bus queue that you linked to your function earlier using a Service Bus connection.

1. On the queue navigation menu, select **Service Bus Explorer**, and then on the toolbar, select **Send messages**.

   :::image type="content" source="./media/logic-apps-scenario-function-sb-trigger/select-service-bus-explorer.png" alt-text="Screenshot of a Service Bus queue page in the portal, with 'Send messages' highlighted. On the navigation menu, 'Service Bus Explorer' is highlighted.":::

1. On the **Send messages** pane, specify the message to send to your Service Bus queue.

   This message triggers your logic app workflow.

## Next steps

* [Call, trigger, or nest workflows by using HTTP endpoints](logic-apps-http-endpoint.md)
