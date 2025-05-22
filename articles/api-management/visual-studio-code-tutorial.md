---
title: Tutorial - Import and manage APIs - Azure API Management and VS Code
description: Learn how to use the Azure API Management extension for Visual Studio Code to import, test, and manage APIs.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: tutorial
ms.date: 02/20/2025
ms.custom: devdivchpfy22
---

# Tutorial: Use the Azure API Management extension for Visual Studio Code to import and manage APIs

[!INCLUDE [api-management-availability-premium-dev-standard-basic-consumption](../../includes/api-management-availability-premium-dev-standard-basic-consumption.md)]

In this tutorial, you learn how to use the API Management extension for Visual Studio Code for common operations in API Management. Use the familiar Visual Studio Code environment to import, update, test, and manage APIs.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

You learn how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Edit the API
> * Apply API Management policies
> * Test the API

:::image type="content" source="media/visual-studio-code-tutorial/tutorial-api-result.png" alt-text="Screenshot of API in API Management extension.":::

For an introduction to more API Management features, see the API Management tutorials using the [Azure portal](import-and-publish.md).

## Prerequisites

* Understand [Azure API Management terminology](api-management-terminology.md).
* Ensure you've installed [Visual Studio Code](https://code.visualstudio.com/) and the latest [Azure API Management extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview).
* [Create an API Management instance](vscode-create-service-instance.md).

## Import an API

The following example imports an OpenAPI Specification in JSON format into API Management. For this example, you import the open source [Petstore API](https://petstore.swagger.io/).

1. In Visual Studio Code, select the Azure icon from the Activity Bar.
1. In the Explorer pane, expand the API Management instance you created.
1. Right-click **APIs**, and select **Import from OpenAPI Link**.
1. When prompted, enter the following values:
    1. An **OpenAPI link** for content in JSON format. For this example: `https://petstore.swagger.io/v2/swagger.json`.
    
        This file specifies the backend service that implements the example API and the operations it supports.
    1. An **API name**, such as *petstore*, that is unique in the API Management instance. This name can contain only letters, number, and hyphens. The first and last characters must be alphanumeric. This name is used in the path to call the API.

After the API is imported successfully, it appears in the Explorer pane, and available API operations appear under the **Operations** node.

:::image type="content" source="media/visual-studio-code-tutorial/tutorial-api-operations.png" alt-text="Screenshot of imported API in Explorer pane.":::

## Edit the API

You can edit the API in Visual Studio Code. For example, edit the Resource Manager JSON description of the API in the editor window to remove the **http** protocol used to access the API, which is highlighted in the following snip:

:::image type="content" source="media/visual-studio-code-tutorial/import-demo-api.png" alt-text="Screenshot of editing JSON description in Visual Studio Code.":::

To edit the OpenAPI format, right-click the API name in the Explorer pane and select **Edit OpenAPI**. Make your changes, and then select **File** > **Save**.

## Apply policies to the API

API Management provides [policies](api-management-policies.md) that you can configure for your APIs. Policies are a collection of statements. These statements are run sequentially on the request or response of an API. Policies can be global, which apply to all APIs in your API Management instance, or specific to a product, an API, or an API operation.

This section shows how to apply common inbound and outbound policies to your API.

1. In the Explorer pane, select **Policy** under the *petstore* API that you imported. The policy file opens in the editor window. This file configures policies for all operations in the API.

1. Update the file with the following content:
    ```xml
    <policies>
        <inbound>
            <rate-limit calls="3" renewal-period="15" />
            <base />
        </inbound>
        <outbound>
            <set-header name="Custom" exists-action="override">
                <value>"My custom value"</value>
              </set-header>
            <base />
        </outbound>
        <on-error>
            <base />
        </on-error>
    </policies>
    ```

    * The `rate-limit` policy in the `inbound` section limits the number of calls to the API to 3 every 15 seconds.
    * The `set-header` policy in the `outbound` section adds a custom response header for demonstration purposes.
    
1. Save the file. If you're prompted, select **Upload** to upload the file to the cloud.

## Test the API

To test the API, get a subscription key and then make a request to the API Management gateway.

### Get the subscription key

You need a subscription key for your API Management instance to test the imported API and the policies that are applied.

1. In the Explorer pane, right-click the name of your API Management instance.
1. Select **Copy Subscription Key**. This key is for the built-in all access subscription that is created when you create an API Management instance.

    :::image type="content" source="media/visual-studio-code-tutorial/copy-subscription-key-1.png" alt-text="Screenshot of Copy subscription Key command in Visual Studio Code.":::

    > [!CAUTION]
    > The all-access subscription enables access to every API in this API Management instance and should only be used by authorized users. Never use it for routine API access or embed the all-access key in client apps.

### Test an API operation

1. In the Explorer pane, expand the **Operations** node under the *petstore* API that you imported.
1. Select an operation such as *[GET] Find pet by ID*, and then right-click the operation and select **Test Operation**.
1. In the editor window, substitute `5` for the `petId` parameter in the request URL.
1. In the editor window, next to **Ocp-Apim-Subscription-Key**, paste the subscription key that you copied.
1. Select **Send request**.

:::image type="content" source="media/visual-studio-code-tutorial/test-api.png" alt-text="Screenshot of sending API request from Visual Studio Code.":::

When the request succeeds, the backend responds with **200 OK** and some data.

:::image type="content" source="media/visual-studio-code-tutorial/test-api-policies.png" alt-text="Screenshot of the API test response in Visual Studio Code.":::

Notice the following detail in the response:

* The `Custom` header is added to the response.

Now test the rate limiting policy. Select **Send request** several times in a row. After sending too many requests in the configured period, you get the `429 Too Many Requests` response.     

### Trace request processing

Optionally, you can get detailed request tracing information to help you debug and troubleshoot the API.

For steps to enable tracing for an API, see [Enable tracing for an API](api-management-howto-api-inspector.md#enable-tracing-for-an-api). To limit unintended disclosure of sensitive information, tracing by default is allowed for only 1 hour.

## Clean up resources

When no longer needed, remove the API Management instance by right-clicking and selecting **Open in Portal** to [delete the API Management service](get-started-create-service-instance.md#clean-up-resources) and its resource group.

Alternately, you can select **Delete API Management** to only delete the API Management instance (this operation doesn't delete its resource group).

:::image type="content" source="media/visual-studio-code-tutorial/vscode-apim-delete-1.png" alt-text="Screenshot of deleting API Management instance from Visual Studio Code.":::

## Related content

This tutorial introduced several features of the API Management extension for Visual Studio Code. You can use these features to import and manage APIs. You learned how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Edit the API
> * Apply API Management policies
> * Test the API

The API Management extension provides more features to work with your APIs. For example, [debug polices](api-management-debug-policies.md) (available in the Developer service tier), or create and manage [named values](api-management-howto-properties.md).
