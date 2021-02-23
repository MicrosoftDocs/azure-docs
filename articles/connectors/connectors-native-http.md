---
title: Call service endpoints by using HTTP or HTTPS
description: Send outbound HTTP or HTTPS requests to service endpoints from Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, azla
ms.topic: conceptual
ms.date: 02/18/2021
tags: connectors
---

# Call service endpoints over HTTP or HTTPS from Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the built-in HTTP trigger or action, you can create automated tasks and workflows that can send outbound requests to endpoints on other services and systems over HTTP or HTTPS. To receive and respond to inbound HTTPS calls instead, use the built-in [Request trigger and Response action](../connectors/connectors-native-reqres.md).

For example, you can monitor a service endpoint for your website by checking that endpoint on a specific schedule. When the specified event happens at that endpoint, such as your website going down, the event triggers your logic app's workflow and runs the actions in that workflow.

* To check or *poll* an endpoint on a recurring schedule, [add the HTTP trigger](#http-trigger) as the first step in your workflow. Each time that the trigger checks the endpoint, the trigger calls or sends a *request* to the endpoint. The endpoint's response determines whether your logic app's workflow runs. The trigger passes any content from the endpoint's response to the actions in your logic app.

* To call an endpoint from anywhere else in your workflow, [add the HTTP action](#http-action). The endpoint's response determines how your workflow's remaining actions run.

This article shows how to use the HTTP trigger and HTTP action so that your logic app can send outbound calls to other services and systems.

For information about encryption, security, and authorization for outbound calls from your logic app, such as [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), previously known as Secure Sockets Layer (SSL), self-signed certificates, or [Azure Active Directory Open Authentication (Azure AD OAuth)](../active-directory/develop/index.yml), see [Secure access and data - Access for outbound calls to other services and systems](../logic-apps/logic-apps-securing-a-logic-app.md#secure-outbound-requests).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The URL for the target endpoint that you want to call

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md). If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md)?

* The logic app from where you want to call the target endpoint. To start with the HTTP trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). To use the HTTP action, start your logic app with any trigger that you want. This example uses the HTTP trigger as the first step.

<a name="http-trigger"></a>

## Add an HTTP trigger

This built-in trigger makes an HTTP call to the specified URL for an endpoint and returns a response.

1. Sign in to the [Azure portal](https://portal.azure.com). Open your blank logic app in Logic App Designer.

1. Under the designer's search box, select **Built-in**. In the search box, enter `http` as your filter. From the **Triggers** list, select the **HTTP** trigger.

   ![Select HTTP trigger](./media/connectors-native-http/select-http-trigger.png)

   This example renames the trigger to "HTTP trigger" so that the step has a more descriptive name. Also, the example later adds an HTTP action, and both names must be unique.

1. Provide the values for the [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-trigger) that you want to include in the call to the target endpoint. Set up the recurrence for how often you want the trigger to check the target endpoint.

   ![Enter HTTP trigger parameters](./media/connectors-native-http/http-trigger-parameters.png)

   If you select an authentication type other than **None**, the authentication settings differ based on your selection. For more information about authentication types available for HTTP, see these topics:

   * [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound)
   * [Authenticate access to resources with managed identities](../logic-apps/create-managed-service-identity.md)

1. To add other available parameters, open the **Add new parameter** list, and select the parameters that you want.

1. Continue building your logic app's workflow with actions that run when the trigger fires.

1. When you're done, remember to save your logic app. On the designer toolbar, select **Save**.

<a name="http-action"></a>

## Add an HTTP action

This built-in action makes an HTTP call to the specified URL for an endpoint and returns a response.

1. Sign in to the [Azure portal](https://portal.azure.com). Open your logic app in Logic App Designer.

   This example uses the HTTP trigger as the first step.

1. Under the step where you want to add the HTTP action, select **New step**.

   To add an action between steps, move your pointer over the arrow between steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Under **Choose an action**, select **Built-in**. In the search box, enter `http` as your filter. From the **Actions** list, select the **HTTP** action.

   ![Select HTTP action](./media/connectors-native-http/select-http-action.png)

   This example renames the action to "HTTP action" so that the step has a more descriptive name.

1. Provide the values for the [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action) that you want to include in the call to the target endpoint.

   ![Enter HTTP action parameters](./media/connectors-native-http/http-action-parameters.png)

   If you select an authentication type other than **None**, the authentication settings differ based on your selection. For more information about authentication types available for HTTP, see these topics:

   * [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound)
   * [Authenticate access to resources with managed identities](../logic-apps/create-managed-service-identity.md)

1. To add other available parameters, open the **Add new parameter** list, and select the parameters that you want.

1. When you're done, remember to save your logic app. On the designer toolbar, select **Save**.

## Trigger and action outputs

Here is more information about the outputs from an HTTP trigger or action, which returns this information:

| Property | Type | Description |
|----------|------|-------------|
| `headers` | JSON object | The headers from the request |
| `body` | JSON object | The object with the body content from the request |
| `status code` | Integer | The status code from the request |
|||

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 202 | Accepted |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal server error. Unknown error occurred. |
|||

## Content with multipart/form-data type

To handle content that has `multipart/form-data` type in HTTP requests, you can add a JSON object that includes the `$content-type` and `$multipart` attributes to the HTTP request's body by using this format.

```json
"body": {
   "$content-type": "multipart/form-data",
   "$multipart": [
      {
         "body": "<output-from-trigger-or-previous-action>",
         "headers": {
            "Content-Disposition": "form-data; name=file; filename=<file-name>"
         }
      }
   ]
}
```

For example, suppose you have a logic app that sends an HTTP POST request for an Excel file to a website by using that site's API, which supports the `multipart/form-data` type. Here's how this action might look:

![Multipart form data](./media/connectors-native-http/http-action-multipart.png)

Here is the same example that shows the HTTP action's JSON definition in the underlying workflow definition:

```json
"HTTP_action": {
   "inputs": {
      "body": {
         "$content-type": "multipart/form-data",
         "$multipart": [
            {
               "body": "@trigger()",
               "headers": {
                  "Content-Disposition": "form-data; name=file; filename=myExcelFile.xlsx"
               }
            }
         ]
      },
      "method": "POST",
      "uri": "https://finance.contoso.com"
   },
   "runAfter": {},
   "type": "Http"
}
```

## Content with application/x-www-form-urlencoded type

To provide form-urlencoded data in the body for an HTTP request, you have to specify that the data has the `application/x-www-form-urlencoded` content type. In the HTTP trigger or action, add the `content-type` header. Set the header value to `application/x-www-form-urlencoded`.

For example, suppose you have a logic app that sends an HTTP POST request to a website, which supports the `application/x-www-form-urlencoded` type. Here's how this action might look:

![Screenshot that shows an HTTP request with the 'content-type' header set to 'application/x-www-form-urlencoded'](./media/connectors-native-http/http-action-urlencoded.png)

<a name="asynchronous-pattern"></a>

## Asynchronous request-response behavior

By default, all HTTP-based actions in Azure Logic Apps follow the standard [asynchronous operation pattern](/azure/architecture/patterns/async-request-reply). This pattern specifies that after an HTTP action calls or sends a request to an endpoint, service, system, or API, the receiver immediately returns a ["202 ACCEPTED"](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.3) response. This code confirms that the receiver accepted the request but hasn't finished processing. The response can include a `location` header that specifies the URL and a refresh ID that the caller can use to poll or check the status for the asynchronous request until the receiver stops processing and returns a ["200 OK"](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.1) success response or other non-202 response. However, the caller doesn't have to wait for the request to finish processing and can continue to run the next action. For more information, see [Asynchronous microservice integration enforces microservice autonomy](/azure/architecture/microservices/design/interservice-communication#synchronous-versus-asynchronous-messaging).

* In the Logic App Designer, the HTTP action, but not trigger, has an **Asynchronous Pattern** setting, which is enabled by default. This setting specifies that the caller doesn't wait for processing to finish and can move on to the next action but continues checking the status until processing stops. If disabled, this setting specifies that the caller waits for processing to finish before moving on to the next action.

  To find this setting, follow these steps:

  1. On the HTTP action's title bar, select the ellipses (**...**) button, which opens the action's settings.

  1. Find the **Asynchronous Pattern** setting.

     !["Asynchronous Pattern" setting](./media/connectors-native-http/asynchronous-pattern-setting.png)

* The HTTP action's underlying JavaScript Object Notation (JSON) definition implicitly follows the asynchronous operation pattern.

<a name="disable-asynchronous-operations"></a>

## Disable asynchronous operations

Sometimes, you might want to the HTTP action's asynchronous behavior in specific scenarios, for example, when you want to:

* [Avoid HTTP timeouts for long-running tasks](#avoid-http-timeouts)
* [Disable checking location headers](#disable-location-header-check)

<a name="turn-off-asynchronous-pattern-setting"></a>

### Turn off **Asynchronous Pattern** setting

1. In the Logic App Designer, on the HTTP action's title bar, select the ellipses (**...**) button, which opens the action's settings.

1. Find the **Asynchronous Pattern** setting, turn the setting to **Off** if enabled, and select **Done**.

   ![Disable the "Asynchronous Pattern" setting](./media/connectors-native-http/disable-asynchronous-pattern-setting.png)

<a name="add-disable-async-pattern-option"></a>

### Disable asynchronous pattern in action's JSON definition

In the HTTP action's underlying JSON definition, [add the `"DisableAsyncPattern"` operation option](../logic-apps/logic-apps-workflow-actions-triggers.md#operation-options) to the action's definition so that the action follows the synchronous operation pattern instead. For more information, see also [Run actions in a synchronous operation pattern](../logic-apps/logic-apps-workflow-actions-triggers.md#disable-asynchronous-pattern).

<a name="avoid-http-timeouts"></a>

## Avoid HTTP timeouts for long-running tasks

HTTP requests have a [timeout limit](../logic-apps/logic-apps-limits-and-config.md#http-limits). If you have a long-running HTTP action that times out due to this limit, you have these options:

* [Disable the HTTP action's asynchronous operation pattern](#disable-asynchronous-operations) so that the action doesn't continually poll or check the request's status. Instead, the action waits for the receiver to respond with the status and results after the request finishes processing.

* Replace the HTTP action with the [HTTP Webhook action](../connectors/connectors-native-webhook.md), which waits for the receiver to respond with the status and results after the request finishes processing.

<a name="disable-location-header-check"></a>

## Disable checking location headers

Some endpoints, services, systems, or APIs return a "202 ACCEPTED" response that don't have a `location` header. To avoid having an HTTP action continually check the request status when the `location` header doesn't exist, you can have these options:

* [Disable the HTTP action's asynchronous operation pattern](#disable-asynchronous-operations) so that the action doesn't continually poll or check the request's status. Instead, the action waits for the receiver to respond with the status and results after the request finishes processing.

* Replace the HTTP action with the [HTTP Webhook action](../connectors/connectors-native-webhook.md), which waits for the receiver to respond with the status and results after the request finishes processing.

## Known issues

<a name="omitted-headers"></a>

### Omitted HTTP headers

If an HTTP trigger or action includes these headers, Logic Apps removes these headers from the generated request message without showing any warning or error:

* `Accept-*` headers except for `Accept-version`
* `Allow`
* `Content-*` headers except for `Content-Disposition`, `Content-Encoding`, and `Content-Type`, which are honored when you use the POST and PUT operations. However, Logic Apps drops these headers when you use the GET operation.
* `Cookie` header, but Logic Apps honors any value that you specify using the **Cookie** property.
* `Expires`
* `Host`
* `Last-Modified`
* `Origin`
* `Set-Cookie`
* `Transfer-Encoding`

Although Logic Apps won't stop you from saving logic apps that use an HTTP trigger or action with these headers, Logic Apps ignores these headers.

## Connector reference

For more information about trigger and action parameters, see these sections:

* [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-trigger)
* [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action)

## Next steps

* [Secure access and data - Access for outbound calls to other services and systems](../logic-apps/logic-apps-securing-a-logic-app.md#secure-outbound-requests)
* [Connectors for Logic Apps](../connectors/apis-list.md)
