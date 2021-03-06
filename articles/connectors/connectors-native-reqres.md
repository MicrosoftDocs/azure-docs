---
title: Receive and respond to calls by using HTTPS
description: Handle inbound HTTPS requests from external services by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewers: jonfan, logicappspm
ms.topic: conceptual
ms.date: 11/19/2020
tags: connectors
---

# Receive and respond to inbound HTTPS requests in Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the built-in Request trigger and Response action, you can create automated tasks and workflows that can receive inbound requests over HTTPS. To send outbound requests instead, use the built-in [HTTP trigger or HTTP action](../connectors/connectors-native-http.md).

For example, you can have your logic app:

* Receive and respond to an HTTPS request for data in an on-premises database.

* Trigger a workflow when an external webhook event happens.

* Receive and respond to an HTTPS call from another logic app.

This article shows how to use the Request trigger and Response action so that your logic app can receive and respond to inbound calls.

For more information about security, authorization, and encryption for inbound calls to your logic app, such as [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), previously known as Secure Sockets Layer (SSL), [Azure Active Directory Open Authentication (Azure AD OAuth)](../active-directory/develop/index.yml), exposing your logic app with Azure API Management, or restricting the IP addresses that originate inbound calls, see [Secure access and data - Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, you can [sign up for a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md). If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md)?

<a name="add-request"></a>

## Add Request trigger

This built-in trigger creates a manually callable endpoint that can handle *only* inbound requests over HTTPS. When a caller sends a request to this endpoint, the [Request trigger](../logic-apps/logic-apps-workflow-actions-triggers.md#request-trigger) fires and runs the logic app. For more information about how to call this trigger, see [Call, trigger, or nest workflows with HTTPS endpoints in Azure Logic Apps](../logic-apps/logic-apps-http-endpoint.md).

Your logic app keeps an inbound request open only for a [limited time](../logic-apps/logic-apps-limits-and-config.md#http-limits). Assuming that your logic app includes a [Response action](#add-response), if your logic app doesn't send a response back to the caller after this time passes, your logic app returns a `504 GATEWAY TIMEOUT` status to the caller. If your logic app doesn't include a Response action, your logic app immediately returns a `202 ACCEPTED` status to the caller.

1. Sign in to the [Azure portal](https://portal.azure.com). Create a blank logic app.

1. After Logic App Designer opens, in the search box, enter `http request` as your filter. From the triggers list, select the **When an HTTP request is received** trigger.

   ![Select Request trigger](./media/connectors-native-reqres/select-request-trigger.png)

   The Request trigger shows these properties:

   ![Request trigger](./media/connectors-native-reqres/request-trigger.png)

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **HTTP POST URL** | {none} | Yes | The endpoint URL that's generated after you save the logic app and is used for calling your logic app |
   | **Request Body JSON Schema** | `schema` | No | The JSON schema that describes the properties and values in the incoming request body |
   |||||

1. In the **Request Body JSON Schema** box, optionally enter a JSON schema that describes the body in the incoming request, for example:

   ![Example JSON schema](./media/connectors-native-reqres/provide-json-schema.png)

   The designer uses this schema to generate tokens for the properties in the request. That way, your logic app can parse, consume, and pass along data from the request through the trigger into your workflow.

   Here is the sample schema:

   ```json
   {
      "type": "object",
      "properties": {
         "account": {
            "type": "object",
            "properties": {
               "name": {
                  "type": "string"
               },
               "ID": {
                  "type": "string"
               },
               "address": {
                  "type": "object",
                  "properties": {
                     "number": {
                        "type": "string"
                     },
                     "street": {
                        "type": "string"
                     },
                     "city": {
                        "type": "string"
                     },
                     "state": {
                        "type": "string"
                     },
                     "country": {
                        "type": "string"
                     },
                     "postalCode": {
                        "type": "string"
                     }
                  }
               }
            }
         }
      }
   }
   ```

   When you enter a JSON schema, the designer shows a reminder to include the `Content-Type` header in your request and set that header value to `application/json`. For more information, see [Handle content types](../logic-apps/logic-apps-content-type.md).

   ![Reminder to include "Content-Type" header](./media/connectors-native-reqres/include-content-type.png)

   Here's what this header looks like in JSON format:

   ```json
   {
      "Content-Type": "application/json"
   }
   ```

   To generate a JSON schema that's based on the expected payload (data), you can use a tool such as [JSONSchema.net](https://jsonschema.net), or you can follow these steps:

   1. In the Request trigger, select **Use sample payload to generate schema**.

      ![Screenshot with "Use sample payload to generate schema" selected](./media/connectors-native-reqres/generate-from-sample-payload.png)

   1. Enter the sample payload, and select **Done**.

      ![Enter sample payload to generate schema](./media/connectors-native-reqres/enter-payload.png)

      Here is the sample payload:

      ```json
      {
         "account": {
            "name": "Contoso",
            "ID": "12345",
            "address": {
               "number": "1234",
               "street": "Anywhere Street",
               "city": "AnyTown",
               "state": "AnyState",
               "country": "USA",
               "postalCode": "11111"
            }
         }
      }
      ```

1. To check that the inbound call has a request body that matches your specified schema, follow these steps:

   1. In the Request trigger's title bar, select the ellipses button (**...**).

   1. In the trigger's settings, turn on **Schema Validation**, and select **Done**.

      If the inbound call's request body doesn't match your schema, the trigger returns an `HTTP 400 Bad Request` error.

1. To specify additional properties, open the **Add new parameter** list, and select the parameters that you want to add.

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **Method** | `method` | No | The method that the incoming request must use to call the logic app |
   | **Relative path** | `relativePath` | No | The relative path for the parameter that the logic app's endpoint URL can accept |
   |||||

   This example adds the **Method** property:

   ![Add Method parameter](./media/connectors-native-reqres/add-parameters.png)

   The **Method** property appears in the trigger so that you can select a method from the list.

   ![Select method](./media/connectors-native-reqres/select-method.png)

1. Now, add another action as the next step in your workflow. Under the trigger, select **Next step** so that you can find the action that you want to add.

   For example, you can respond to the request by [adding a Response action](#add-response), which you can use to return a customized response and is described later in this topic.

   Your logic app keeps the incoming request open only for a [limited time](../logic-apps/logic-apps-limits-and-config.md#http-limits). Assuming that your logic app workflow includes a Response action, if the logic app doesn't return a response after this time passes, your logic app returns a `504 GATEWAY TIMEOUT` to the caller. Otherwise, if your logic app doesn't include a Response action, your logic app immediately returns a `202 ACCEPTED` response to the caller.

1. When you're done, save your logic app. On the designer toolbar, select **Save**.

   This step generates the URL to use for sending the request that triggers the logic app. To copy this URL, select the copy icon next to the URL.

   ![URL to use triggering your logic app](./media/connectors-native-reqres/generated-url.png)

   > [!NOTE]
   > If you want to include the hash or pound symbol (**#**) in the URI
   > when making a call to the Request trigger, use this encoded version instead: `%25%23`

1. To test your logic app, send an HTTP request to the generated URL.

   For example, you can use a tool such as [Postman](https://www.getpostman.com/) to send the HTTP request. For more information about the trigger's underlying JSON definition and how to call this trigger, see these topics, [Request trigger type](../logic-apps/logic-apps-workflow-actions-triggers.md#request-trigger) and [Call, trigger, or nest workflows with HTTP endpoints in Azure Logic Apps](../logic-apps/logic-apps-http-endpoint.md).

For more information about security, authorization, and encryption for inbound calls to your logic app, such as [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), previously known as Secure Sockets Layer (SSL), [Azure Active Directory Open Authentication (Azure AD OAuth)](../active-directory/develop/index.yml), exposing your logic app with Azure API Management, or restricting the IP addresses that originate inbound calls, see [Secure access and data - Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests).

## Trigger outputs

Here's more information about the outputs from the Request trigger:

| JSON property name | Data type | Description |
|--------------------|-----------|-------------|
| `headers` | Object | A JSON object that describes the headers from the request |
| `body` | Object | A JSON object that describes the body content from the request |
||||

<a name="add-response"></a>

## Add a Response action

When you use the Request trigger to handle inbound requests, you can model the response and send the payload results back to the caller by using the built-in [Response action](../logic-apps/logic-apps-workflow-actions-triggers.md#response-action). You can use the Response action *only* with the Request trigger. This combination with the Request trigger and Response action creates the [request-response pattern](https://en.wikipedia.org/wiki/Request%E2%80%93response). Except for inside Foreach loops and Until loops, and parallel branches, you can add the Response action anywhere in your workflow.

> [!IMPORTANT]
> If a Response action includes these headers, Logic Apps removes these headers from the generated response message without showing any warning or error:
>
> * `Allow`
> * `Content-*` headers except for `Content-Disposition`, `Content-Encoding`, and `Content-Type` when you use POST and PUT operations, but are not included for GET operations
> * `Cookie`
> * `Expires`
> * `Last-Modified`
> * `Set-Cookie`
> * `Transfer-Encoding`
>
> Although Logic Apps won't stop you from saving logic apps that have a Response action with these headers, Logic Apps ignores these headers.

1. In the Logic App Designer, under the step where you want to add a Response action, select **New step**.

   For example, using the Request trigger from earlier:

   ![Add new step](./media/connectors-native-reqres/add-response.png)

   To add an action between steps, move your pointer over the arrow between those steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Under **Choose an action**, in the search box, enter `response` as your filter, and select the **Response** action.

   ![Select the Response action](./media/connectors-native-reqres/select-response-action.png)

   The Request trigger is collapsed in this example for simplicity.

1. Add any values that are required for the response message.

   In some fields, clicking inside their boxes opens the dynamic content list. You can then select tokens that represent available outputs from previous steps in the workflow. Properties from the schema specified in the earlier example now appear in the dynamic content list.

   For example, for the **Headers** box, include `Content-Type` as the key name, and set the key value to `application/json` as mentioned earlier in this topic. For the **Body** box, you can select the trigger body output from the dynamic content list.

   ![Response action details](./media/connectors-native-reqres/response-details.png)

   To view the headers in JSON format, select **Switch to text view**.

   ![Headers - Switch to text view](./media/connectors-native-reqres/switch-to-text-view.png)

   Here is more information about the properties that you can set in the Response action.

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **Status Code** | `statusCode` | Yes | The status code to return in the response |
   | **Headers** | `headers` | No | A JSON object that describes one or more headers to include in the response |
   | **Body** | `body` | No | The response body |
   |||||

1. To specify additional properties, such as a JSON schema for the response body, open the **Add new parameter** list, and select the parameters that you want to add.

1. When you're done, save your logic app. On the designer toolbar, select **Save**.

## Next steps

* [Secure access and data - Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests)
* [Connectors for Logic Apps](../connectors/apis-list.md)
