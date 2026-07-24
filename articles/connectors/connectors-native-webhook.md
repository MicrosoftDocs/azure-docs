---
title: Run Workflows or Actions with HTTP Webhooks
description: Add HTTP webhook operations to run workflows or actions based on service endpoint events in Azure Logic Apps by subscribing and responding to events.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 365-days
ms.date: 04/09/2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to set up my workflow with a trigger or action that subscribes to a service endpoint, waits for specific service events, and then runs the workflow or action.
---

# Run workflows or actions based on service endpoint events by using HTTP webhooks in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

When you want a workflow trigger or action to wait for events or data to arrive at a target service endpoint before they run, use the **HTTP Webhook** trigger or action, rather than proactively check the endpoint on a schedule. The **HTTP Webhook** trigger or action subscribes to the service endpoint and waits for new events or data before running. You can use the webhook pattern for long-running tasks and asynchronous processing.

The following list describes example webhook-based workflows:

- An **HTTP Webhook** trigger waits for an event to arrive from Azure Event Hubs before running the workflow.
- An **HTTP Webhook** action waits for an approval in Office 365 Outlook before continuing the next action in the workflow.

This guide shows how to set up the **HTTP Webhook** trigger and **HTTP Webhook** action so your workflow can receive and respond to new events or data at a service endpoint.

## How do webhooks work?

A webhook trigger or action doesn't *poll* or proactively check for new events or data at the target service endpoint. Instead, the trigger or action waits until new events or data arrive at the service endpoint before they run. After you add a webhook trigger or action to your workflow and then save the workflow, or after you reenable a disabled logic app resource, the webhook trigger or action *subscribes* to the service endpoint by generating and registering a *callback URL* with the endpoint. The trigger or action then waits for the service endpoint to call the URL, which runs the trigger or action. Like the [**Request** trigger](connectors-native-reqres.md), an **HTTP Webhook** trigger fires immediately.

For example, the **Office 365 Outlook** connector action named [**Send approval email**](/connectors/office365/#send-approval-email) follows the webhook pattern but works only with Office 365 Outlook. You can extend the webhook pattern into any service by using the **HTTP Webhook** trigger or action with the service endpoint you want.

A webhook trigger stays subscribed to a service endpoint until you manually take one of the following actions:

- Change the trigger's parameter values.
- Delete the trigger and then save your workflow.
- Disable your logic app resource.

A webhook action stays subscribed to a service endpoint unless one of the following conditions occurs:

- The webhook action successfully finishes.
- You cancel the workflow run while waiting for a response.
- The workflow times out.
- You change any webhook action parameter values that a webhook trigger uses as inputs.

For more information, see:

- [Webhooks and subscriptions](../logic-apps/logic-apps-workflow-actions-triggers.md#webhooks-and-subscriptions)
- [Create custom APIs that support a webhook](../logic-apps/logic-apps-create-api-app.md)
- [Access for outbound calls to other services and systems](../logic-apps/logic-apps-securing-a-logic-app.md#secure-outbound-requests)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The URL for a deployed service endpoint or API.

  This item must support the "subscribe and unsubscribe" pattern for [webhook triggers in workflows](../logic-apps/logic-apps-create-api-app.md#webhook-triggers) or [webhook actions in workflows](../logic-apps/logic-apps-create-api-app.md#webhook-actions).

- The Standard or Consumption logic app workflow where you want to use the **HTTP Webhook** trigger or action.

  - To use the **HTTP Webhook** trigger, create a logic app resource with a blank workflow.
  - To use the **HTTP Webhook** action, start your workflow with any trigger that works best for your scenario. The examples use the **HTTP Webhook** trigger.

## Add an HTTP Webhook trigger

This built-in trigger calls the subscribe endpoint on the target service and registers a callback URL with the target service. Your workflow then waits for the target service to send an `HTTP POST` request to the callback URL. When this event happens, the trigger fires and passes any data in the request along to the workflow.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource. In the designer, open your blank workflow.

1. Follow the [general steps](../logic-apps/add-trigger-action-workflow.md#add-trigger) to add the trigger named **HTTP Webhook** to your workflow.

   This example renames the trigger to `Run HTTP Webhook trigger` as a more descriptive name. The example also later adds an **HTTP Webhook** action. Both names must be unique.

1. For the [HTTP Webhook trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-webhook-trigger), provide the values for the subscribe and unsubscribe calls:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Subscribe Method** | Yes | The method to use for subscribing to the target endpoint. |
   | **Subscribe URI** | Yes | The URL to use for subscribing to the target endpoint. |
   | **Subscribe Body** | No | Any message body to include in the subscribe request. This example includes the callback URL that uniquely identifies the subscriber, which is your workflow, by using the [`listCallbackUrl()` expression function](../logic-apps/expression-functions-reference.md#listcallbackurl) to retrieve your trigger's callback URL. |
   | **Unsubscribe Body** | No | Any message body to include in the unsubscribe request. You can use the [`listCallbackUrl()` expression function](../logic-apps/expression-functions-reference.md#listcallbackurl) to retrieve your action's callback URL. However, the trigger also automatically includes and sends the headers, `x-ms-client-tracking-id` and `x-ms-workflow-operation-name`, which the target service can use to uniquely identify the subscriber. |

1. To add other trigger parameters, open the **Advanced parameters** list.

   For example, to use the **Unsubscribe Method** and **Unsubscribe URI** parameters, add them from the **Advanced parameters** list.

   The following example shows a trigger that includes the methods, URIs, and message bodies to use for the subscribe and unsubscribe methods:

   :::image type="content" source="media/connectors-native-webhook/webhook-trigger-parameters.png" alt-text="Screenshot shows workflow with HTTP Webhook trigger parameters." lightbox="media/connectors-native-webhook/webhook-trigger-parameters.png":::

1. If you need to use authentication, add the **Subscribe Authentication** and **Unsubscribe Authentication** parameters from the **Advanced parameters** list.

   For more information about authentication types available for **HTTP Webhook**, see [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound).

1. Add any other actions that your scenario needs.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

Saving your workflow calls the subscribe endpoint on the target service and registers the callback URL. Your workflow waits for the target service to send an `HTTP POST` request to the callback URL. When this event happens, the trigger fires and passes any data in the request to the workflow. If this operation successfully completes, the trigger unsubscribes from the endpoint, and your workflow continues to the next action.

## Add an HTTP Webhook action

This built-in action calls the subscribe endpoint on the target service and registers a callback URL with the target service. Your workflow then pauses and waits for the target service to send an `HTTP POST` request to the callback URL. When this event happens, the action passes any data in the request to the workflow. If the operation successfully completes, the action unsubscribes from the endpoint, and your workflow continues to the next action.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource. In the designer, open your workflow.

1. Follow the [general steps](../logic-apps/add-trigger-action-workflow.md#add-action) to add the action named **HTTP Webhook** to your workflow.

   This example renames the action to `Run HTTP Webhook action` as a more descriptive name. If your workflow also uses the **HTTP Webhook** trigger, both names must be unique.

1. For the [HTTP Webhook action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-webhook-trigger), provide the values to use for the subscribe and unsubscribe calls:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Subscribe Method** | Yes | The method to use for subscribing to the target endpoint. |
   | **Subscribe URI** | Yes | The URL to use for subscribing to the target endpoint. |
   | **Subscribe Body** | No | Any message body to include in the subscribe request. This example includes the callback URL that uniquely identifies the subscriber, which is your workflow, by using the [`listCallbackUrl()` expression function](../logic-apps/expression-functions-reference.md#listcallbackurl) to retrieve your action's callback URL. |
   | **Unsubscribe Body** | No | Any message body to include in the unsubscribe request. You can use the [`listCallbackUrl()` expression function](../logic-apps/expression-functions-reference.md#listcallbackurl) to retrieve your action's callback URL. However, the action also automatically includes and sends the headers, `x-ms-client-tracking-id` and `x-ms-workflow-operation-name`, which the target service can use to uniquely identify the subscriber. |
   
1. To add other action parameters, open the **Advanced parameters** list.

   For example, to use the **Unsubscribe Method** and **Unsubscribe URI** parameters, add them from the **Advanced parameters** list.

   The following example shows an action that includes the methods, URIs, and message bodies to use for the subscribe and unsubscribe methods:

   :::image type="content" source="media/connectors-native-webhook/webhook-action-parameters.png" alt-text="Screenshot shows Standard workflow with HTTP Webhook action parameters." lightbox="media/connectors-native-webhook/webhook-action-parameters.png":::

1. If you need to use authentication, add the **Subscribe Authentication** and **Unsubscribe Authentication** parameters from the **Advanced parameters** list.

   For more information about authentication types available for **HTTP Webhook**, see [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound).

1. Add any other actions that your scenario needs.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

When this action runs, your workflow calls the subscribe endpoint on the target service and registers the callback URL. Your workflow pauses and waits for the target service to send an `HTTP POST` request to the callback URL. When this event happens, the action passes any data in the request to the workflow. If the operation successfully completes, the action unsubscribes from the endpoint, and your workflow continues to the next action.

## Connector technical reference

For more information about the **HTTP Webhook** trigger and action parameters, see [HTTP Webhook parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-webhook-trigger). The trigger and action have the same parameters.

### Shared Access Signature (SAS) token expiration

The callback URL for the **HTTP Webhook** trigger or action is automatically generated by the [List Callback Url - REST API method](/rest/api/logic/workflow-triggers/list-callback-url). By default, the SAS token in the callback URL doesn't have a time-based expiration. The callback URL stays valid for the workflow run duration.

### Timeout limits

The following table describes the timeout limits for the **HTTP Webhook** action, based on the logic app hosting option:

| Hosting option | Workflow type | Duration |
|----------------|---------------|----------|
| Consumption | Stateful | Up to 90 days. |
| Standard | Stateful | Up to 30 days. |
| Standard | Stateless | 5 minutes <br>(fixed limit) |

The **HTTP Webhook** action's callback URL becomes invalid when the following events happen:

- You cancel the workflow.
- You delete or disable the workflow or logic app resource.
- You rotate the workflow's access keys.
- The workflow times out.

For other HTTP limits, see [HTTP limits in Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#http-request-limits).

#### Change timeout limit

To change this limit for the **HTTP Webhook** action in stateful workflows by using the Azure portal, see the [Timeout duration table for outbound HTTP requests](../logic-apps/logic-apps-limits-and-config.md#http-request-limits). Or, in the action's JSON definition, add the `limit.timeout` object, and set the value to the duration you want, for example:

```json
{
   "actions": {
      "Run_HTTP_Webhook_action": {
         "type": "HttpWebhook",
         "inputs": {
            "subscribe": {
               "method": "POST",
               "uri": "https://<external-service>.com/subscribe",
               "body": {
                  "callbackUrl": "@{listCallBackUrl()}"
               }
            },
            "unsubscribe": {}
         },
         "limit": {
            "timeout": "PT1H"
         }
      }
   }
}
```

### Trigger and action outputs

The following tables provide more information about the outputs returned by an **HTTP Webhook** trigger or action:

| JSON name | Type | Description |
|-----------|------|-------------|
| `headers` | JSON object | The headers from the request. |
| `body` | JSON object | The object with the body content from the request. |
| `status code` | int | The status code from the request. |

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 202 | Accepted |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal server error. Unknown error occurred. |

## Generate callback URL with secondary access key

A logic app workflow has two access keys: primary and secondary. By default, Azure Logic Apps uses the primary key to generate the callback URL for the HTTP webhook trigger.

To use the secondary key instead for callback URL generation, follow these steps:

1. If you're in the workflow designer, switch to code view.

1. In the `HttpWebhook` trigger definition, find the `accessKeyType` parameter.

1. Enter the word `Secondary` as the parameter value.

1. Save your changes.

The following example shows the webhook trigger definition with the `accessKeyType` parameter set to `Secondary`:

```json
{
  "type": "HttpWebhook",
  "inputs": {
    "subscribe": {
      "method": "POST",
      "uri": "<subscription-URL>",
      "body": "@listCallbackUrl()"
    },
    "accessKeyType": "Secondary"
  },
  "runAfter": {}
}

```

## Related content

- [Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests)
- [List of all Logic Apps connectors](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors in Azure Logic Apps](built-in.md)
