---
title: Call External HTTPS Endpoints from Workflows
description: Learn how to send calls to external HTTP or HTTPS endpoints from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/17/2025
---

# Call external HTTP or HTTPS endpoints from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Some scenarios might require that you create a logic app workflow that sends outbound requests to endpoints on other services or systems over HTTP or HTTPS. For example, suppose that you want to monitor a service endpoint for your website by checking that endpoint on a specific schedule. When a specific event happens at that endpoint, such as your website going down, that event triggers your workflow and runs the actions in that workflow.

> [!NOTE]
>
> To create a workflow that receives and responds to inbound HTTPS calls instead, see 
> [Create workflows that you can call, trigger, or nest using HTTPS endpoints in Azure Logic Apps](../logic-apps/logic-apps-http-endpoint.md). To use the Request built-in trigger, see [Receive and respond to inbound HTTPS calls to workflows in Azure Logic Apps](../connectors/connectors-native-reqres.md).

This guide shows how to use the HTTP trigger and HTTP action so that your workflow can send outbound calls to other services and systems, for example:

* To check or *poll* an endpoint on a recurring schedule, [add the built-in trigger named **HTTP**](#http-trigger) as the first step in your workflow. Each time that the trigger checks the endpoint, the trigger calls or sends a *request* to the endpoint. The endpoint's response determines whether your workflow runs. The trigger passes any content from the endpoint's response to the actions in your workflow.

* To call an endpoint from anywhere else in your workflow, [add the built-in action named **HTTP**](#http-action). The endpoint's response determines how your workflow's remaining actions run.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The URL for the destination endpoint that you want to call.

* The logic app resource with the workflow from where you want to call the external endpoint.

  To start your workflow with the **HTTP** trigger, you need to have a blank workflow. To use the **HTTP** action, your workflow can start with a trigger that best fits your scenario. The example workflows in this article use the **HTTP** trigger.

  If you don't have a logic app resource and workflow, create them now by following the steps for the logic app that you want:
  
  * [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
  * [Create an example Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

## Connector technical reference

For technical information about trigger and action parameters, see the following sections in the schema reference guide:

* [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-trigger)
* [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action)

<a id="http-trigger"></a>

## Add an HTTP trigger

This built-in trigger makes an HTTP call to the specified URL for an endpoint and returns a response.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar menu, under **Workflows**, select **Workflows**, and then select your blank workflow.

1. On the workflow sidebar menu, under **Tools**, select the designer to open the workflow.

1. Add the **HTTP** built-in trigger to your workflow by following the [general steps to add a trigger](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-trigger).

   This example renames the trigger to **HTTP trigger - Call endpoint URL** so that the trigger has a more descriptive name. Also, the example later adds an **HTTP** action, and operation names in your workflow must be unique.

1. Provide the values for the [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-trigger) that you want to include in the call to the destination endpoint. Set up the recurrence for how often you want the trigger to check the destination endpoint.

1. From the **Advanced parameters** list, select **Authentication**.

   If you select an authentication type other than **None**, the authentication settings differ based on your selection. For more information about authentication types available for HTTP, see the following articles:

   * [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound)
   * [Authenticate access to resources with managed identities](../logic-apps/create-managed-service-identity.md)

1. Add any other actions that you want to run when the trigger fires.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the sidebar menu, under **Development Tools**, select the designer to open the blank workflow.

1. Add the **HTTP** built-in trigger to your workflow by following the [general steps to add a trigger](../logic-apps/add-trigger-action-workflow.md?tabs=consumption#add-trigger).

   This example renames the trigger to **HTTP trigger - Call endpoint URL** so that the trigger has a more descriptive name. Also, the example later adds an **HTTP** action, and operation names in your workflow must be unique.

1. Provide the values for the [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-trigger) that you want to include in the call to the destination endpoint. Set up the recurrence for how often you want the trigger to check the destination endpoint.

1. From the **Advanced parameters** list, select **Authentication**.

   If you select an authentication type other than **None**, the authentication settings differ based on your selection. For more information about authentication types available for HTTP, see the following articles:

   * [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound)
   * [Authenticate access to resources with managed identities](../logic-apps/create-managed-service-identity.md)

1. Add any other actions that you want to run when the trigger fires.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a id="http-action"></a>

## Add an HTTP action

This built-in action sends an HTTPS or HTTP call to the specified URL for an endpoint and returns with a response.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar menu, under **Workflows**, select **Workflows**, and then select your workflow.

1. On the workflow sidebar menu, under **Tools**, select the designer to open the workflow.

   This example uses the **HTTP** trigger added in the previous section.

1. Add the **HTTP** built-in action to your workflow by following the [general steps to add a action](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-action).

   This example renames the action to **HTTP action - Call endpoint URL** so that the action has a more descriptive name. Also, operation names in your workflow must be unique.

1. Provide the values for the [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action) that you want to include in the call to the destination endpoint.

1. From the **Advanced parameters** list, select **Authentication**.

   If you select an authentication type other than **None**, the authentication settings differ based on your selection. For more information about authentication types available for HTTP, see the following articles:

   * [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound)
   * [Authenticate access to resources with managed identities](../logic-apps/create-managed-service-identity.md)

1. Add any other actions that you want to run when the trigger fires.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

   This example uses the HTTP trigger added in the previous section as the first step.

1. Add the **HTTP** built-in action to your workflow by following the [general steps to add an action](../logic-apps/add-trigger-action-workflow.md?tabs=consumption#add-action).

   This example renames the action to **HTTP action - Call endpoint URL** so that the action has a more descriptive name. Also, operation names in your workflow must be unique.

1. Provide the values for the [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action) that you want to include in the call to the destination endpoint.

1. From the **Advanced parameters** list, select **Authentication**.

   If you select an authentication type other than **None**, the authentication settings differ based on your selection. For more information about authentication types available for HTTP, see the following articles:

   * [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound)
   * [Authenticate access to resources with managed identities](../logic-apps/create-managed-service-identity.md)

1. Add any other actions that you want to run when the trigger fires.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

## Trigger and action outputs

An HTTP trigger or action outputs the following information:

| Property | Type | Description |
|----------|------|-------------|
| `headers` | JSON object | The headers from the request |
| `body` | JSON object | The object with the body content from the request |
| `status code` | Integer | The status code from the request |

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 202 | Accepted |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal server error. Unknown error occurred. |

## URL security for outbound calls

For information about encryption, security, and authorization for outbound calls from your workflow, such as [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), self-signed certificates, or [Microsoft Entra ID Open Authentication](../active-directory/develop/index.yml), see [Access for outbound calls to other services and systems](../logic-apps/logic-apps-securing-a-logic-app.md#secure-outbound-requests).

<a id="single-tenant-authentication"></a>

## Authentication for single-tenant environment

If you have a Standard logic app resource in single-tenant Azure Logic Apps, and you want to use an HTTP operation with any of the following authentication types, make sure to complete the extra setup steps for the corresponding authentication type. Otherwise, the call fails.

* [TLS certificate](#tls-certificate-authentication): Add the app setting `WEBSITE_LOAD_ROOT_CERTIFICATES`, and set the value to the thumbprint for your TLS certificate.

* [Client certificate or Microsoft Entra ID Open Authentication (Microsoft Entra ID OAuth) with the *Certificate* credential type](#client-certificate-authentication): Add the app setting `WEBSITE_LOAD_USER_PROFILE`, and set the value to *1*.

<a id="tlsssl-certificate-authentication"></a>

### TLS certificate authentication

1. In your logic app resource's app settings, add or update the app setting called `WEBSITE_LOAD_ROOT_CERTIFICATES`. For specific steps, see [Manage app settings - local.settings.json](../logic-apps/edit-app-settings-host-settings.md#manage-app-settings).

1. For the setting value, provide the thumbprint for your TLS certificate as the root certificate to be trusted.

   `"WEBSITE_LOAD_ROOT_CERTIFICATES": "<thumbprint-for-TLS-certificate>"`

For example, if you're working in Visual Studio Code, follow these steps:

1. Open your logic app project's *local.settings.json* file.

1. In the `Values` JSON object, add or update the `WEBSITE_LOAD_ROOT_CERTIFICATES` setting:

   ```json
   {
      "IsEncrypted": false,
      "Values": {
         <...>
         "AzureWebJobsStorage": "UseDevelopmentStorage=true",
         "WEBSITE_LOAD_ROOT_CERTIFICATES": "<thumbprint-for-TLS-certificate>",
         <...>
      }
   }
   ```

> [!NOTE]
>
> To find the thumbprint, follow these steps:
> - On your logic app resource menu, under **Settings**, select **Certificates**.
> - Select **Bring your own certificates (.pfx)** or **Public key certificates (.cer)**.
> - Find the certificate that you want to use, and copy the thumbprint.
> 
> For more information, see [Find the thumbprint - Azure App Service](../app-service/configure-ssl-certificate-in-code.md#find-the-thumbprint).

For more information, see [Manage app settings - local.settings.json](../logic-apps/edit-app-settings-host-settings.md#manage-app-settings).

<a id="client-certificate-authentication"></a>

<a id='client-certificate-or-azure-ad-oauth-with-certificate-credential-type-authentication'></a>

### Client certificate or Microsoft Entra ID OAuth with *Certificate* credential type authentication

1. In your logic app resource's app settings, add or update the app setting called `WEBSITE_LOAD_USER_PROFILE`. For specific steps, see [Manage app settings - local.settings.json](../logic-apps/edit-app-settings-host-settings.md#manage-app-settings)

1. For the setting value, specify `1`.

   `"WEBSITE_LOAD_USER_PROFILE": "1"`

For example, if you're working in Visual Studio Code, follow these steps:

1. Open your logic app project's *local.settings.json* file.

1. In the `Values` JSON object, add or update the `WEBSITE_LOAD_USER_PROFILE` setting:

   ```json
   {
      "IsEncrypted": false,
      "Values": {
         <...>
         "AzureWebJobsStorage": "UseDevelopmentStorage=true",
         "WEBSITE_LOAD_USER_PROFILE": "1",
         <...>
      }
   }
   ```

If you're working in the Azure portal, open your logic app. Under **Settings** in the sidebar menu, select **Environment variables**. Under **App settings**, add or edit the setting.

## Content with multipart/form-data type

To handle content that has `multipart/form-data` type in HTTP requests, you can add a JSON object that includes the `$content-type` and `$multipart` attributes in the HTTP request's body by using this format.

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

For example, suppose you have a workflow that sends an HTTP POST request for an Excel file to a website by using that site's API, which supports the `multipart/form-data` type. The following sample shows how this action might appear:

:::image type="content" source="./media/connectors-native-http/http-action-multipart.png" alt-text="Screenshot that shows the workflow with HTTP action and multipart form data." lightbox="./media/connectors-native-http/http-action-multipart.png":::

Here's the same example that shows the HTTP action's JSON definition in the underlying workflow definition:

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

:::image type="content" source="./media/connectors-native-http/http-action-urlencoded.png" alt-text="Screenshot that shows the workflow with HTTP request and content-type header set to application slash x-www-form-urlencoded." lightbox="./media/connectors-native-http/http-action-urlencoded.png":::

<a id="asynchronous-pattern"></a>

## Asynchronous request-response behavior

For *stateful* workflows in both multitenant and single-tenant Azure Logic Apps, all HTTP-based actions follow the standard [asynchronous operation pattern](/azure/architecture/patterns/async-request-reply) as the default behavior. This pattern specifies that after an HTTP action calls or sends a request to an endpoint, service, system, or API, the receiver immediately returns a [202 ACCEPTED](https://www.rfc-editor.org/rfc/rfc9110.html#status.202) response. This code confirms that the receiver accepted the request but isn't finished processing. The response can include a `location` header that specifies the URI and a refresh ID that the caller can use to poll or check the status for the asynchronous request until the receiver stops processing and returns a [200 OK](https://www.rfc-editor.org/rfc/rfc9110.html#name-200-ok) success response or other non-202 response. However, the caller doesn't have to wait for the request to finish processing and can continue to run the next action. For more information, see [Synchronous versus asynchronous messaging](/azure/architecture/microservices/design/interservice-communication#synchronous-versus-asynchronous-messaging).

For *stateless* workflows in single-tenant Azure Logic Apps, HTTP-based actions don't use the asynchronous operation pattern. Instead, they only run synchronously, return the [202 ACCEPTED](https://www.rfc-editor.org/rfc/rfc9110.html#status.202) response as-is, and proceed to the next step in the workflow execution. If the response includes a `location` header, a stateless workflow doesn't poll the specified URI to check the status. To follow the standard [asynchronous operation pattern](/azure/architecture/patterns/async-request-reply), use a stateful workflow instead.

* The HTTP action's underlying JSON definition implicitly follows the asynchronous operation pattern.

* The HTTP action, but not trigger, has an **Asynchronous pattern** setting, which is enabled by default. This setting specifies that the caller doesn't wait for processing to finish and can move on to the next action but continues checking the status until processing stops. If disabled, this setting specifies that the caller waits for processing to finish before moving on to the next action.

  To find the **Asynchronous pattern** setting:

  1. In the workflow designer, select the **HTTP** action.
  1. On the information pane that opens, select **Settings**.
  1. Under **Networking**, find the **Asynchronous pattern** setting.

<a id="disable-asynchronous-operations"></a>

## Disable asynchronous operations

Sometimes, you might want to disable the HTTP action's asynchronous behavior in specific scenarios, for example, when you want to:

* [Avoid HTTP timeouts for long-running tasks](#avoid-http-timeouts)
* [Disable checking location headers](#disable-location-header-check)

<a id="turn-off-asynchronous-pattern-setting"></a>

### Turn off asynchronous pattern setting

1. In the workflow designer, select the HTTP action, and on the information pane that opens, select **Settings**.

1. Under **Networking**, find the **Asynchronous pattern** setting. Turn the setting to **Off** if enabled.

<a id="add-disable-async-pattern-option"></a>

### Disable asynchronous pattern in action's JSON definition

In the HTTP action's underlying JSON definition, [add the `DisableAsyncPattern` operation option](../logic-apps/logic-apps-workflow-actions-triggers.md#operation-options) to the action's definition so that the action follows the synchronous operation pattern instead. For more information, see also [Run actions in a synchronous operation pattern](../logic-apps/logic-apps-workflow-actions-triggers.md#disable-asynchronous-pattern).

<a id="avoid-http-timeouts"></a>

## Avoid HTTP timeouts for long-running tasks

HTTP requests have a [timeout limit](../logic-apps/logic-apps-limits-and-config.md#http-limits). If you have a long-running HTTP action that times out due to this limit, you have these options:

* [Disable the HTTP action's asynchronous operation pattern](#disable-asynchronous-operations) so that the action doesn't continually poll or check the request's status. Instead, the action waits for the receiver to respond with the status and results after the request finishes processing.

* Replace the HTTP action with the [HTTP Webhook action](../connectors/connectors-native-webhook.md), which waits for the receiver to respond with the status and results after the request finishes processing.

### Set up interval between retry attempts with the Retry-After header

To specify the number of seconds between retry attempts, you can add the `Retry-After` header to the HTTP action response. For example, if the destination endpoint returns the `429 - Too many requests` status code, you can specify a longer interval between retries. The `Retry-After` header also works with the `202 - Accepted` status code.

Here's the same example that shows the HTTP action response that contains `Retry-After`:

```json
{
    "statusCode": 429,
    "headers": {
        "Retry-After": "300"
    }
}
```

## Pagination support

Sometimes, the destination service responds by returning the results one page at a time. If the response specifies the next page with the `nextLink` or `@odata.nextLink` property, you can turn on the **Pagination** setting in the **HTTP** action. This setting causes the **HTTP** action to automatically follow these links and get the next page. However, if the response specifies the next page with any other tag, you might have to add a loop to your workflow. Make this loop follow that tag and manually get each page until the tag is null.

<a id="disable-location-header-check"></a>

## Disable checking location headers

Some endpoints, services, systems, or APIs return a `202 ACCEPTED` response that doesn't have a `location` header. To avoid having an HTTP action continually check the request status when the `location` header doesn't exist, you can have these options:

* [Disable the HTTP action's asynchronous operation pattern](#disable-asynchronous-operations) so that the action doesn't continually poll or check the request's status. Instead, the action waits for the receiver to respond with the status and results after the request finishes processing.

* Replace the HTTP action with the [HTTP Webhook action](../connectors/connectors-native-webhook.md), which waits for the receiver to respond with the status and results after the request finishes processing.

## Known issues

<a id="omitted-headers"></a>

### Omitted HTTP headers

If an HTTP trigger or action includes these headers, Azure Logic Apps removes these headers from the generated request message without showing any warning or error:

* `Accept-*` headers except for `Accept-version`
* `Allow`
* `Content-*` headers except for `Content-Disposition`, `Content-Encoding`, and `Content-Type`, which are honored when you use the POST and PUT operations. However, Azure Logic Apps drops these headers when you use the `GET` operation.
* `Cookie` header, but Azure Logic Apps honors any value that you specify using the `Cookie` property.
* `Expires`
* `Host`
* `Last-Modified`
* `Origin`
* `Set-Cookie`
* `Transfer-Encoding`

Although Azure Logic Apps doesn't stop you from saving logic apps that use an HTTP trigger or action with these headers, Azure Logic Apps ignores these headers.

<a id="mismatch-content-type"></a>

### Response content doesn't match the expected content type

The HTTP action throws a **BadRequest** error if the HTTP action calls the backend API with the `Content-Type` header set to *application/json*, but the response from the backend doesn't actually contain content in JSON format, which fails internal JSON format validation.

## Related content

* [Managed connectors for Azure Logic Apps connectors](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
