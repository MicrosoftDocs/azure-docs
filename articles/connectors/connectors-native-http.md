---
title: Call HTTP and HTTPS endpoints - Azure Logic Apps
description: Send outgoing requests to HTTP and HTTPS endpoints by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 07/05/2019
tags: connectors
---

# Send outgoing calls to HTTP or HTTPS endpoints by using Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the built-in HTTP trigger or action, you can create automated tasks and workflows that regularly send requests to any HTTP or HTTPS endpoint. To receive and respond to incoming HTTP or HTTPS calls instead, use the built-in [Request trigger or Response action](../connectors/connectors-native-reqres.md).

For example, you can monitor the service endpoint for your website by checking that endpoint on a specified schedule. When a specific event happens at that endpoint, such as your website going down, the event triggers your logic app's workflow and runs the specified actions.

To check or *poll* an endpoint on a regular schedule, you can use the HTTP trigger as the first step in your workflow. On each check, the trigger sends a call or *request* to the endpoint. The endpoint's response determines whether your logic app's workflow runs. The trigger passes along any content from the response to the actions in your logic app.

You can use the HTTP action as any other step in your workflow for calling the endpoint when you want. The endpoint's response determines how your workflow's remaining actions run.

Based the target endpoint's capability, the HTTP connector supports Transport Layer Security (TLS) versions 1.0, 1.1, and 1.2. Logic Apps negotiates with the endpoint over using the highest supported version possible. So, for example, if the endpoint supports 1.2, the connector uses 1.2 first. Otherwise, the connector uses the next highest supported version.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The URL for the target endpoint that you want to call

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md). If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

* The logic app from where you want to call the target endpoint. To start with the HTTP trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). To use the HTTP action, start your logic app with any trigger that you want. This example uses the HTTP trigger as the first step.

## Add an HTTP trigger

This built-in trigger makes an HTTP call to the specified URL for an endpoint and returns a response.

1. Sign in to the [Azure portal](https://portal.azure.com). Open your blank logic app in Logic App Designer.

1. On the designer, in the search box, enter "http" as your filter. From the **Triggers** list, select the **HTTP** trigger.

   ![Select HTTP trigger](./media/connectors-native-http/select-http-trigger.png)

   This example renames the trigger to "HTTP trigger" so that the step has a more descriptive name. Also, the example later adds an HTTP action, and both names must be unique.

1. Provide the values for the [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md##http-trigger) that you want to include in the call to the target endpoint. Set up the recurrence for how often you want the trigger to check the target endpoint.

   ![Enter HTTP trigger parameters](./media/connectors-native-http/http-trigger-parameters.png)

   For more information about authentication types available for HTTP, see [Authenticate HTTP triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md#connector-authentication).

1. To add other available parameters, open the **Add new parameter** list, and select the parameters that you want.

1. Continue building your logic app's workflow with actions that run when the trigger fires.

1. When you're finished, done, remember to save your logic app. On the designer toolbar, select **Save**.

## Add an HTTP action

This built-in action makes an HTTP call to the specified URL for an endpoint and returns a response.

1. Sign in to the [Azure portal](https://portal.azure.com). Open your logic app in Logic App Designer.

   This example uses the HTTP trigger as the first step.

1. Under the step where you want to add the HTTP action, select **New step**.

   To add an action between steps, move your pointer over the arrow between steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. On the designer, in the search box, enter "http" as your filter. From the **Actions** list, select the **HTTP** action.

   ![Select HTTP action](./media/connectors-native-http/select-http-action.png)

   This example renames the action to "HTTP action" so that the step has a more descriptive name.

1. Provide the values for the [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md##http-action) that you want to include in the call to the target endpoint.

   ![Enter HTTP action parameters](./media/connectors-native-http/http-action-parameters.png)

   For more information about authentication types available for HTTP, see [Authenticate HTTP triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md#connector-authentication).

1. To add other available parameters, open the **Add new parameter** list, and select the parameters that you want.

1. When you're finished, remember to save your logic app. On the designer toolbar, select **Save**.

<a name="authenticate-access"></a>

## Authenticate access to other resources

HTTP and HTTPS endpoints support different kinds of authentication. Here are the kinds of authentication that you can set up for your HTTP trigger or action:

* Basic
* Client certificate
* Azure Active Directory (Azure AD) OAuth
* Raw
* Managed identity

> [!IMPORTANT]
> Make sure that you protect any sensitive information that your logic app workflow definition handles. 
> Use secured parameters and encode data as necessary. For more information about using and securing parameters, see [Secure your logic app](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters).

### Basic authentication

For [basic authentication with Azure Active Directory](../active-directory-b2c/active-directory-b2c-custom-rest-api-netfw-secure-basic.md), your trigger or action can include an authentication object, which has the properties specified by the following table.

To access parameter values at runtime, you can use the @parameters('parameterName') expression, which is provided by the Workflow Definition Language. If you want to use an Azure Resource Manager template that uses secured parameters for your logic app and a parameter file , "@parameters('userNameParam')" 

"@parameters('passwordParam')"

logic-apps/logic-apps-azure-resource-manager-templates-overview


| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Authentication** | Yes | **Basic** | The authentication type to use, which is "Basic" here |
| **Username** | Yes | <*user-name*>| The user name for authenticating access to the target service endpoint |
| **Password** | Yes | <*password*> | The password for authenticating access to the target service endpoint |
|||||

### Managed identity

### Managed identity

For example, suppose you want to use Azure Active Directory (Azure AD) authentication with an [Azure service that supports Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). This example shows how you use the managed identity to authenticate access in an HTTP action that sends an HTTP call to the target service.

1. In your logic app, add the **HTTP** action.

1. Provide the necessary details for that action, such as the request **Method** and **URI** location for the resource that you want to call. In the **URI** box, enter the endpoint URL for that Azure service. So, if you're using Azure Resource Manager, enter this value in the **URI** property:

   `https://management.azure.com/subscriptions/<Azure-subscription-ID>?api-version=2016-06-01`

1. From the **Authentication** list, select **Managed Identity**. After you make your selection, the **Audience** property appears. By default, the property is set to the target resource ID.

   ![Select "Managed Identity"](./media/create-managed-service-identity/select-managed-identity.png)

   > [!IMPORTANT]
   >
   > In the **Audience** property, the resource ID value must exactly match the value that Azure AD expects, 
   > including any required trailing slashes. You can find these resource ID values in this 
   > [table that describes the Azure services that support Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). 
   > For example, if you're using the Azure Resource Manager resource ID, make sure that the URI has a trailing slash.

1. Continue building the logic app the way you want.

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
{
   "HTTP_action": {
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

## Connector reference

For more information about trigger and action parameters, see these sections:

* [HTTP trigger parameters](../logic-apps/logic-apps-workflow-actions-triggers.md##http-trigger)
* [HTTP action parameters](../logic-apps/logic-apps-workflow-actions-triggers.md##http-action)

### Output details

Here is more information about the outputs from an HTTP trigger or action, which returns this information:

| Property name | Type | Description |
|---------------|------|-------------|
| headers | object | The headers from the request |
| body | object | JSON object | The object with the body content from the request |
| status code | int | The status code from the request |
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

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
