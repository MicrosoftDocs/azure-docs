---
title: Call Azure Functions from workflows
description: Call and run an Azure function from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 05/07/2024
---

# Call Azure Functions from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To run code that performs a specific job in your logic app workflow, you don't have to build a complete app or infrastructure. Instead, you can create and call an Azure function. [Azure Functions](../azure-functions/functions-overview.md) provides serverless computing in the cloud and the capability to perform the following tasks:

- Extend your workflow's behavior by running functions created using Node.js or C#.
- Perform calculations in your workflow.
- Apply advanced formatting or compute fields in your workflow.

This how-to guide shows how to call an existing Azure function from your Consumption or Standard workflow. To run code without using Azure Functions, see the following documentation:

- [Run code snippets in workflows](logic-apps-add-run-inline-code.md)
- [Create and run .NET Framework code from Standard workflows](create-run-custom-code-functions.md)

## Limitations

- Only Consumption workflows support authenticating Azure function calls using a managed identity with Microsoft Entra authentication. Standard workflows aren't currently supported in the section about [how to enable authentication for function calls](#enable-authentication-functions).

- Azure Logic Apps doesn't support using Azure Functions with deployment slots enabled. Although this scenario might sometimes work, this behavior is unpredictable and might result in authorization problems when your workflow tries call the Azure function.

## Prerequisites

- Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure function app resource](../azure-functions/functions-get-started.md), which contains one or more Azure functions.

  - Your function app resource and logic app resource must use the same Azure subscription.

  - Your function app resource must use either **.NET** or **Node.js** as the runtime stack.

  - When you add a new function to your function app, you can select either **C#** or **JavaScript**.

- The Azure function that you want to call. You can create this function using the following tools:

  - [Azure portal](../azure-functions/functions-create-function-app-portal.md)
  - [Visual Studio](../azure-functions/functions-create-your-first-function-visual-studio.md)
  - [Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md)
  - [Azure CLI](/cli/azure/functionapp/app)
  - [Azure PowerShell](/powershell/module/az.functions)
  - [ARM template](/azure/templates/microsoft.web/sites/functions)

  - Your function must use the **HTTP trigger** template.

    The **HTTP trigger** template can accept content that has **`application/json`** type from your logic app workflow. When you add a function to your workflow, the designer shows custom functions that are created from this template within your Azure subscription.

  - Your function code must include the response and payload that you want returned to your workflow after your function completes. The **`context`** object refers to the message that your workflow sends through the Azure Functions action parameter named **Request Body** later in this guide.

    This guide uses the following sample function, which is named **FabrikamAzureFunction**:

    ```javascript
    module.exports = function (context, data) {

       var input = data;

       // Function processing logic
       // Function response for later use
       context.res = {
          body: {
            content:"Thank you for your feedback: " + input
          }
       };
       context.done();
    }
    ```

    To access the **`context`** object's properties from inside your function, use the following syntax:

    `context.body.<property-name>`

    For example, to reference the **`content`** property in the **`context`** object, use the following syntax:

    `context.body.content`

    This code also includes an **`input`** variable, which stores the value from the **`data`** parameter so that your function can perform operations on that value. Within JavaScript functions, the **`data`** variable is also a shortcut for **`context.body`**.

    > [!NOTE]
    >
    > The **`body`** property here applies to the **`context`** object and isn't the same as 
    > the **Body** token in an action's output, which you might also pass to your function.

  - Your function can't use custom routes unless you defined an [OpenAPI definition](../azure-functions/functions-openapi-definition.md) ([Swagger file](https://swagger.io/)).

    When you have an OpenAPI definition for your function, the workflow designer gives you a richer experience when you work with function parameters. Before your workflow can find and access functions that have OpenAPI definitions, [set up your function app by following these steps](#function-swagger).

- A Consumption or Standard logic app workflow that starts with any trigger.

  The examples in this guide use the Office 365 Outlook trigger named **When a new email arrives**.

- To create and call an Azure function that calls another workflow, make sure that secondary workflow starts with a trigger that provides a callable endpoint.

  For example, you can start the workflow with the general **HTTP** or **Request** trigger, or you can use a service-based trigger, such as **Azure Queues** or **Event Grid**. Inside your function, send an HTTP POST request to the trigger's URL and include the payload that you want your secondary workflow to process. For more information, see [Call, trigger, or nest logic app workflows](logic-apps-http-endpoint.md).

## Tips for working with Azure functions

<a name="function-swagger"></a>

### Generate an OpenAPI definition or Swagger file for your function

For a richer experience when you work with function parameters in the workflow designer, [generate an OpenAPI definition](../azure-functions/functions-openapi-definition.md) or [Swagger file](https://swagger.io/) for your function. To set up your function app so that your workflow can find and use functions that have Swagger descriptions, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your function app. Make sure that the function app is actively running.

1. On your function app, set up [Cross-Origin Resource Sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) so that all origins are permitted by following these steps:

   1. On the function app menu, under **API**, select **CORS**.

   1. Under **Allowed Origins**, add the asterisk (**`*`**) wildcard character, but remove all the other origins in the list, and select **Save**.

      :::image type="content" source="media/logic-apps-azure-functions/function-cors-origins.png" alt-text="Screenshot shows Azure portal, CORS pane, and wildcard character * entered under Allowed Origins." lightbox="media/logic-apps-azure-functions/function-cors-origins.png":::

### Access property values inside HTTP requests

Webhook-based functions can accept HTTP requests as inputs and pass those requests to other functions. For example, although Azure Logic Apps has [functions that convert DateTime values](workflow-definition-language-functions-reference.md), this basic sample JavaScript function shows how you can access a property inside an HTTP request object that's passed to the function and perform operations on that property value. To access properties inside objects, this example uses the [dot (.) operator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Property_accessors):

```javascript
function convertToDateString(request, response){
   var data = request.body;
   response = {
      body: data.date.ToDateString();
   }
}
```

Here's what happens inside this function:

1. The function creates a **`data`** variable, and then assigns the **`body`** object, which is inside the **`request`** object, to the variable. The function uses the dot (**.**) operator to reference the **`body`** object inside the **`request`** object:

   ```javascript
   var data = request.body;
   ```

1. The function can now access the **`date`** property through the **`data`** variable, and convert the property value from **DateTime** type to **DateString** type by calling the **`ToDateString()`** function. The function also returns the result through the **`body`** property in the function's response:

   ```javascript
   body: data.date.ToDateString();
   ```

After you create your function in Azure, follow the steps to [add an Azure function to your workflow](#add-function-logic-app).

<a name="add-function-logic-app"></a>

## Add a function to your workflow (Consumption + Standard workflows)

To call an Azure function from your workflow, you can add that functions like any other action in the designer.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **Azure Functions** action named **Choose an Azure function**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. In the **Create Connection** pane, follow these steps:

   1. Provide a **Connection Name** for the connection to your function app.

   1. From the function apps list, select your function app.

   1. From the functions list, select the function, and then select **Add Action**, for example:

      :::image type="content" source="media/logic-apps-azure-functions/select-function-app-function-consumption.png" alt-text="Screenshot shows Consumption workflow with a selected function app and function." lightbox="media/logic-apps-azure-functions/select-function-app-function-consumption.png":::

1. In the selected function's action box, follow these steps:

   1. For **Request Body**, provide your function's input, which must be formatted as a JavaScript Object Notation (JSON) object. This input is the *context object* payload or message that your workflow sends to your function.

      - To select tokens that represent outputs from previous steps, select inside the **Request Body** box, and then select the option to open the dynamic content list (lightning icon).

      - To create an expression, select inside the **Request Body** box, and then select option to open the expression editor (formula icon).

      The following example specifies a JSON object with the **`content`** attribute and a token representing the **From** output from the email trigger as the **Request Body** value:

      :::image type="content" source="media/logic-apps-azure-functions/function-request-body-example-consumption.png" alt-text="Screenshot shows Consumption workflow and a function with a Request Body example for the context object payload." lightbox="media/logic-apps-azure-functions/function-request-body-example-consumption.png":::

      Here, the context object isn't cast as a string, so the object's content gets added directly to the JSON payload. Here's the complete example:

      :::image type="content" source="media/logic-apps-azure-functions/request-body-example-complete.png" alt-text="Screenshot shows Consumption workflow and a function with a complete Request Body example for the context object payload." lightbox="media/logic-apps-azure-functions/request-body-example-complete.png":::

      If you provide a context object other than a JSON token that passes a string, a JSON object, or a JSON array, you get an error. However, you can cast the context object as a string by enclosing the token in quotation marks (**""**), for example, if you wanted to use the **Received Time** token:

      :::image type="content" source="media/logic-apps-azure-functions/function-request-body-string-cast-example.png" alt-text="Screenshot shows Consumption workflow and a Request Body example that casts context object as a string." lightbox="media/logic-apps-azure-functions/function-request-body-string-cast-example.png":::

   1. To specify other details such as the method to use, request headers, query parameters, or authentication, open the **Advanced parameters** list, and select the parameters that you want. For authentication, your options differ based on your selected function. For more information, review [Enable authentication for functions](#enable-authentication-functions).

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app workflow in the designer.

1. In the designer, [follow these general steps to add the **Azure Functions** action named **Call an Azure function**](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. In the **Create Connection** pane, follow these steps:

   1. Provide a **Connection Name** for the connection to your function app.

   1. From the function apps list, select your function app.

   1. From the functions list, select the function, and then select **Create New**, for example:

   :::image type="content" source="media/logic-apps-azure-functions/select-function-app-function-standard.png" alt-text="Screenshot shows Standard workflow designer with selected function app and function." lightbox="media/logic-apps-azure-functions/select-function-app-function-standard.png":::

1. In the **Call an Azure function** action box, follow these steps:

   1. For **Method**, select the HTTP method required to call the selected function.

   1. For **Request Body**, provide your function's input, which must be formatted as a JavaScript Object Notation (JSON) object. This input is the *context object* payload or message that your workflow sends to your function.

      - To select tokens that represent outputs from previous steps, select inside the **Request Body** box, and then select the option to open the dynamic content list (lightning icon).

      - To create an expression, select inside the **Request Body** box, and then select option to open the expression editor (formula icon).

      The following example specifies the following values:

      - **Method**: **GET**
      - **Request Body**: A JSON object with the **`content`** attribute and a token representing the **From** output from the email trigger.

      :::image type="content" source="media/logic-apps-azure-functions/function-request-body-example-standard.png" alt-text="Screenshot shows Standard workflow and a function with a Request Body example for the context object payload." lightbox="media/logic-apps-azure-functions/function-request-body-example-standard.png":::

      Here, the context object isn't cast as a string, so the object's content gets added directly to the JSON payload. Here's the complete example:

      :::image type="content" source="media/logic-apps-azure-functions/request-body-example-complete.png" alt-text="Screenshot shows Standard workflow and a function with a complete Request Body example for the context object payload." lightbox="media/logic-apps-azure-functions/request-body-example-complete.png":::

      If you provide a context object other than a JSON token that passes a string, a JSON object, or a JSON array, you get an error. However, you can cast the context object as a string by enclosing the token in quotation marks (**""**), for example, if you wanted to use the **Received Time** token:

      :::image type="content" source="media/logic-apps-azure-functions/function-request-body-string-cast-example.png" alt-text="Screenshot shows Standard workflow and a Request Body example that casts context object as a string." lightbox="media/logic-apps-azure-functions/function-request-body-string-cast-example.png":::

   1. To specify other details such as the method to use, request headers, query parameters, or authentication, open the **Advanced parameters** list, and select the parameters that you want. For authentication, your options differ based on your selected function. For more information, review [Enable authentication for functions](#enable-authentication-functions).

---

<a name="enable-authentication-functions"></a>

## Enable authentication for Azure function calls (Consumption workflows only)

Your Consumption workflow can use a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate an Azure function call and access resources protected by Microsoft Entra ID. The managed identity can authenticate access without you having to sign in and provide credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets. You can set up the system-assigned identity or a manually created, user-assigned identity at the logic app resource level. The Azure function that's called from your workflow can use the same managed identity for authentication.

> [!NOTE]
> 
> Only Consumption workflows support authentication for an Azure function call using 
> a managed identity and Microsoft Entra authentication. Standard workflows currently 
> don't include this support when you use the action to call an Azure function.

For more information, see the following documentation:

* [Authenticate access with managed identities](create-managed-service-identity.md)
* [Add authentication to outbound calls](logic-apps-securing-a-logic-app.md#add-authentication-outbound)

To set up your function app and function so they can use your Consumption logic app's managed identity, follow these high-level steps:

1. [Enable and set up your logic app's managed identity](create-managed-service-identity.md).

1. [Set up your function for anonymous authentication](#set-authentication-function-app).

1. [Find the required values to set up Microsoft Entra authentication](#find-required-values).

1. [Create an app registration for your function app](#create-app-registration).

<a name="set-authentication-function-app"></a>

### Set up your function for anonymous authentication (Consumption workflows only)

For your function to use your Consumption logic app's managed identity, you must set your function's authentication level to **`anonymous`**. Otherwise, your workflow throws a **BadRequest** error.

1. In the [Azure portal](https://portal.azure.com), find and select your function app.

   The following steps use an example function app named **FabrikamFunctionApp**.

1. On the function app resource menu, under **Development tools**, select **Advanced Tools** > **Go**.

   :::image type="content" source="media/logic-apps-azure-functions/open-advanced-tools-kudu.png" alt-text="Screenshot shows function app menu with selected options for Advanced Tools and Go." lightbox="media/logic-apps-azure-functions/open-advanced-tools-kudu.png":::

1. After the **Kudu Plus** page opens, on the Kudu website's title bar, from the **Debug Console** menu, select **CMD**.

   :::image type="content" source="media/logic-apps-azure-functions/open-debug-console-kudu.png" alt-text="Screenshot shows Kudu Services page with opened Debug Console menu and selected option named CMD." lightbox="media/logic-apps-azure-functions/open-debug-console-kudu.png":::

1. After the next page appears, from the folder list, select **site** > **wwwroot** > *your-function*.

   The following steps use an example function named **FabrikamAzureFunction**.

   :::image type="content" source="media/logic-apps-azure-functions/select-site-wwwroot-function-folder.png" alt-text="Screenshot shows folder list with the opened folders for the site, wwwroot, and your function." lightbox="media/logic-apps-azure-functions/select-site-wwwroot-function-folder.png":::

1. Open the **function.json** file for editing.

   :::image type="content" source="media/logic-apps-azure-functions/edit-function-json-file.png" alt-text="Screenshot shows the function.json file with selected edit command." lightbox="media/logic-apps-azure-functions/edit-function-json-file.png":::

1. In the **bindings** object, check whether the **authLevel** property exists. If the property exists, set the property value to **`anonymous`**. Otherwise, add that property, and set the value.

   :::image type="content" source="media/logic-apps-azure-functions/set-authentication-level-function-app.png" alt-text="Screenshot shows bindings object with authLevel property set to anonymous." lightbox="media/logic-apps-azure-functions/set-authentication-level-function-app.png":::

1. When you're done, save your settings. Continue to the next section.

<a name="find-required-values"></a>

### Find the required values to set up Microsoft Entra authentication (Consumption workflows only)

Before you can set up your function app to use the managed identity and Microsoft Entra authentication, you need to find and save the following values by following the steps in this section.

1. [Find the tenant ID for your Microsoft Entra tenant](#find-tenant-id).

1. [Find the object ID for your managed identity](#find-object-id).

1. [Find the application ID for the Enterprise application associated with your managed identity](#find-enterprise-application-id).

<a name="find-tenant-id"></a>

#### Find the tenant ID for your Microsoft Entra tenant

Either run the PowerShell command named [**Get-AzureAccount**](/powershell/module/servicemanagement/azure/get-azureaccount), or in the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Microsoft Entra tenant.

   This guide uses **Fabrikam** as the example tenant.

1. On the tenant menu, select **Overview**.

1. Copy and save your tenant ID for later use, for example:

   :::image type="content" source="media/logic-apps-azure-functions/tenant-id.png" alt-text="Screenshot shows Microsoft Entra ID Properties page with tenant ID's copy button selected." lightbox="media/logic-apps-azure-functions/tenant-id.png":::

<a name="find-object-id"></a>

#### Find the object ID for your managed identity

After you enable the managed identity for your Consumption logic app resource, find the object for your managed identity. You'll use this ID to find the associated Enterprise application in your Entra tenant.

1. On the logic app menu, under **Settings**, select **Identity**, and then select either **System assigned** or **User assigned**.

   - **System assigned**

     Copy the identity's **Object (principal) ID**:

     :::image type="content" source="media/logic-apps-azure-functions/system-identity-consumption.png" alt-text="Screenshot shows Consumption logic app's Identity page with selected tab named System assigned." lightbox="media/logic-apps-azure-functions/system-identity-consumption.png":::

   - **User assigned**

     1. Select the identity:

        :::image type="content" source="media/logic-apps-azure-functions/user-identity-consumption.png" alt-text="Screenshot shows Consumption logic app's Identity page with selected tab named User assigned." lightbox="media/logic-apps-azure-functions/user-identity-consumption.png":::

     1. Copy the identity's **Object (principal) ID**:

        :::image type="content" source="media/logic-apps-azure-functions/user-identity-object-id.png" alt-text="Screenshot shows Consumption logic app's user-assigned identity Overview page with the object (principal) ID selected." lightbox="media/logic-apps-azure-functions/user-identity-object-id.png":::

<a name="find-enterprise-application-id"></a>

### Find the application ID for the Azure Enterprise application associated with your managed identity

When you enable a managed identity on your logic app resource, Azure automatically creates an associated [Azure Enterprise application](/entra/identity/enterprise-apps/add-application-portal) that has the same name. You now need to find the associated Enterprise application and copy its **Application ID**. Later, you use this application ID to add an identity provider for your function app by creating an app registration.

1. In the [Azure portal](https://portal.azure.com), find and open your Entra tenant.

1. On the tenant menu, under **Manage**, select **Enterprise applications**.

1. On the **All applications** page, in the search box, enter the object ID for your managed identity. From the results, find the matching enterprise application, and copy the **Application ID**:

   :::image type="content" source="media/logic-apps-azure-functions/find-enterprise-application-id.png" alt-text="Screenshot shows Entra tenant page named All applications, with enterprise application object ID in search box, and selected matching application ID." lightbox="media/logic-apps-azure-functions/find-enterprise-application-id.png":::

1. Now, use the copied application ID to [add an identity provider to your function app](#create-app-registration).

<a name="create-app-registration"></a>

### Add identity provider for your function app (Consumption workflows only)

Now that you have the tenant ID and the application ID, you can set up your function app to use Microsoft Entra authentication by adding an identity provider and creating an app registration.

1. In the [Azure portal](https://portal.azure.com), open your function app.

1. On the function app menu, under **Settings**, select **Authentication**, and then select **Add identity provider**.

   :::image type="content" source="media/logic-apps-azure-functions/add-identity-provider.png" alt-text="Screenshot shows function app menu with Authentication page and selected option named Add identity provider." lightbox="media/logic-apps-azure-functions/add-identity-provider.png":::

1. On the **Add an identity provider** pane, under **Basics**, from the **Identity provider** list, select **Microsoft**.

1. Under **App registration**, for **App registration type**, select **Provide the details of an existing app registration**, and enter the values that you previously saved.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Application (client) ID** | Yes | <*application-ID*> | The unique identifier to use for this app registration. For this example, use the application ID that you copied for the Enterprise application associated with your managed identity. |
   | **Client secret** | Optional, but recommended | <*client-secret*> | The secret value that the app uses to prove its identity when requesting a token. The client secret is created and stored in your app's configuration as a slot-sticky [application setting](../app-service/configure-common.md#configure-app-settings) named **MICROSOFT_PROVIDER_AUTHENTICATION_SECRET**. To manage the secret in Azure Key Vault instead, you can update this setting later to use [Key Vault references](../app-service/app-service-key-vault-references.md). <br><br>- If you provide a client secret value, sign-in operations use the hybrid flow, returning both access and refresh tokens. <br><br>- If you don't provide a client secret, sign-in operations use the OAuth 2.0 implicit grant flow, returning only an ID token. <br><br>These tokens are sent by the provider and stored in the EasyAuth token store. |
   | **Issuer URL** | No | **<*authentication-endpoint-URL*>/<*Entra-tenant-ID*>/v2.0** | This URL redirects users to the correct Microsoft Entra tenant and downloads the appropriate metadata to determine the appropriate token signing keys and token issuer claim value. For apps that use Azure AD v1, omit **/v2.0** from the URL. <br><br>For this scenario, use the following URL: **`https://sts.windows.net/`<*Entra-tenant-ID*>** |
   | **Allowed token audiences** | No | <*application-ID-URI*> | The application ID URI (resource ID) for the function app. For a cloud or server app where you want to allow authentication tokens from a web app, add the application ID URI for the web app. The configured client ID is always implicitly considered as an allowed audience. <br><br>For this scenario, the value is **`https://management.azure.com`**. Later, you can use the same URI in the **Audience** property when you [set up your function action in your workflow to use the managed identity](create-managed-service-identity.md#authenticate-access-with-identity). <br><br>**Important**: The application ID URI (resource ID) must exactly match the value that Microsoft Entra ID expects, including any required trailing slashes. |

   At this point, your version looks similar to this example:

   :::image type="content" source="media/logic-apps-azure-functions/identity-provider-authentication-settings.png" alt-text="Screenshot shows app registration for your logic app and identity provider for your function app." lightbox="media/logic-apps-azure-functions/identity-provider-authentication-settings.png":::

   If you're setting up your function app with an identity provider for the first time, the **App Service authentication settings** section also appears. These options determine how your function app responds to unauthenticated requests. The default selection redirects all requests to log in with the new identity provider. You can customize this behavior now or adjust these settings later from the main **Authentication** page by selecting **Edit** next to **Authentication settings**. To learn more about these options, review [Authentication flow - Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md#authentication-flow).

   Otherwise, you can continue with the next step.

1. To finish creating the app registration, select **Add**.

   When you're done, the **Authentication** page now lists the identity provider and the app registration's application (client) ID. Your function app can now use this app registration for authentication.

1. Copy the app registration's **App (client) ID** to use later in the Azure Functions action's **Audience** property for your workflow.

   :::image type="content" source="media/logic-apps-azure-functions/identity-provider-application-id.png" alt-text="Screenshot shows new identity provider for function app." lightbox="media/logic-apps-azure-functions/identity-provider-application-id.png":::

1. Return to the designer and follow the [steps to authenticate access with the managed identity](create-managed-service-identity.md#authenticate-access-with-identity) by using the built-in Azure Functions action.

## Next steps

* [Authentication access to Azure resources with managed identities in Azure Logic Apps](create-managed-service-identity.md#authenticate-access-with-identity)
