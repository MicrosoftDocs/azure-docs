---
title: Tutorial - Import and manage APIs - Azure API Management and Visual Studio Code | Microsoft Docs
description: Learn how to use the Azure API Management Extension for Visual Studio Code to import, test, and manage APIs.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: tutorial
ms.date: 12/27/2021
ms.custom: devdivchpfy22
---

# Tutorial: Use the API Management Extension for Visual Studio Code to import and manage APIs

In this tutorial, you learn how to use the API Management Extension for Visual Studio Code for common operations in API Management. Use the familiar Visual Studio Code environment to import, update, test, and manage APIs.

You learn how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Edit the API
> * Apply API Management policies
> * Test the API

:::image type="content" source="media/visual-studio-code-tutorial/tutorial-api-result.png" alt-text="API in API Management Extension":::

For an introduction to more API Management features, see the API Management tutorials using the [Azure portal](import-and-publish.md).

## Prerequisites

* Understand [Azure API Management terminology](api-management-terminology.md).
* Ensure you've installed [Visual Studio Code](https://code.visualstudio.com/) and the latest [Azure API Management Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview).
* [Create an API Management instance](vscode-create-service-instance.md).

## Import an API

The following example imports an OpenAPI Specification in JSON format into API Management. Microsoft provides the backend API used in this example, and hosts it on Azure at `https://conferenceapi.azurewebsites.net?format=json`.

1. In Visual Studio Code, select the Azure icon from the Activity Bar.
1. In the Explorer pane, expand the API Management instance you created.
1. Right-click **APIs**, and select **Import from OpenAPI Link**.
1. When prompted, enter the following values:
    1. An **OpenAPI link** for content in JSON format. For this example: `https://conferenceapi.azurewebsites.net?format=json`.
    This URL is the service that implements the example API. API Management forwards requests to this address.
    1. An **API name**, such as *demo-conference-api*, that is unique in the API Management instance. This name can contain only letters, number, and hyphens. The first and last characters must be alphanumeric. This name is used in the path to call the API.

After the API is imported successfully, it appears in the Explorer pane, and available API operations appear under the **Operations** node.

:::image type="content" source="media/visual-studio-code-tutorial/tutorial-api-operations.png" alt-text="Imported API in Explorer pane":::

## Edit the API

You can edit the API in Visual Studio Code. For example, edit the Resource Manager JSON description of the API in the editor window to remove the **http** protocol used to access the API.

:::image type="content" source="media/visual-studio-code-tutorial/import-demo-api.png" alt-text="Edit JSON description":::

To edit the OpenAPI format, right-click the API name in the Explorer pane and select **Edit OpenAPI**. Make your changes, and then select **File** > **Save**.

## Apply policies to the API

API Management provides [policies](api-management-policies.md) that you can configure for your APIs. Policies are a collection of statements. These statements are run sequentially on the request or response of an API. Policies can be global, which apply to all APIs in your API Management instance, or specific to a product, an API, or an API operation.

This section shows how to apply common outbound policies to your API that transform the API response. The policies in this example change response headers and hide original backend URLs that appear in the response body.

1. In the Explorer pane, select **Policy** under the *demo-conference-api* that you imported. The policy file opens in the editor window. This file configures policies for all operations in the API.

1. Update the file with the following content in the `<outbound>` element:
    ```html
    [...]
    <outbound>
        <set-header name="Custom" exists-action="override">
            <value>"My custom value"</value>
        </set-header>
        <set-header name="X-Powered-By" exists-action="delete" />
        <redirect-content-urls />
        <base />
    </outbound>
    [...]
    ```

    * The first `set-header` policy adds a custom response header for demonstration purposes.
    * The second `set-header` policy deletes the **X-Powered-By** header, if it exists. This header can reveal the application framework used in the API backend, and publishers often remove it.
    * The `redirect-content-urls` policy rewrites (masks) links in the response body so that they point to the equivalent links via the API Management gateway.

1. Save the file. If you're prompted, select **Upload** to upload the file to the cloud.

## Test the API

### Get the subscription key

You need a subscription key for your API Management instance to test the imported API and the policies that are applied.

1. In the Explorer pane, right-click the name of your API Management instance.
1. Select **Copy Subscription Key**.

    :::image type="content" source="media/visual-studio-code-tutorial/copy-subscription-key-1.png" alt-text="Copy subscription key":::

### Test an API operation

1. In the Explorer pane, expand the **Operations** node under the *demo-conference-api* that you imported.
1. Select an operation such as *GetSpeakers*, and then right-click the operation and select **Test Operation**.
1. In the editor window, next to **Ocp-Apim-Subscription-Key**, replace `{{SubscriptionKey}}` with the subscription key that you copied.
1. Select **Send request**.

:::image type="content" source="media/visual-studio-code-tutorial/test-api.png" alt-text="Send API request from Visual Studio Code":::

When the request succeeds, the backend responds with **200 OK** and some data.

:::image type="content" source="media/visual-studio-code-tutorial/test-api-policies.png" alt-text="API test operation":::

Notice the following details in the response:

* The **Custom** header is added to the response.
* The **X-Powered-By** header doesn't appear in the response.
* URLs to the API backend are redirected to the API Management gateway, in this case `https://apim-hello-world.azure-api.net/demo-conference-api`.

### Trace the API operation

For detailed tracing information to help you debug the API operation, select the link that appears next to **Ocp-APIM-Trace-Location**.

The JSON file at that location contains Inbound, Backend, and Outbound trace information. The trace information helps you determine where problems occur after the request is made.

> [!TIP]
> When you test API operations, the API Management Extension allows optional [policy debugging](api-management-debug-policies.md) (available in the Developer service tier).

## Clean up resources

When no longer needed, remove the API Management instance by right-clicking and selecting **Open in Portal** to [delete the API Management service](get-started-create-service-instance.md#clean-up-resources) and its resource group.

Alternately, you can select **Delete API Management** to only delete the API Management instance (this operation doesn't delete its resource group).

:::image type="content" source="media/visual-studio-code-tutorial/vscode-apim-delete-1.png" alt-text="Delete API Management instance from VS Code":::

## Next steps

This tutorial introduced several features of the API Management Extension for Visual Studio Code. You can use these features to import and manage APIs. You learned how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Edit the API
> * Apply API Management policies
> * Test the API

The API Management Extension provides more features to work with your APIs. For example, [debug polices](api-management-debug-policies.md) (available in the Developer service tier), or create and manage [named values](api-management-howto-properties.md).
