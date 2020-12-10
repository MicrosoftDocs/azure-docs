---
title: Tutorial - Import and manage APIs in API Management using Visual Studio Code | Microsoft Docs
description: In this tutorial, learn how to use the Azure API Management Extension for Visual Studio Code to import, test, and manage APIs.
ms.service: api-management
author: dlepow
ms.author: apimpm
ms.topic: tutorial
ms.date: 12/10/2020
---

# Tutorial: Use the API Management Extension for Visual Studio Code to import and manage APIs

In this tutorial, you learn how to use the API Management Extension Preview for Visual Studio Code to perform common operations with API Management. Use the familiar Visual Studio Code environment to o import, update, test, and manage APIs.

You learn how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Edit the API
> * Test the API
> * Apply API Management policies

:::image type="content" source="media/vscode-tutorial-service-instance/tutorial-api-result.png" alt-text="API in API Management Extension":::

For an introduction to additional API Management features, see the API Management tutorials using the [Azure portal](import-and-publish.md).

## Prerequisites
- Understand [Azure API Management terminology](api-management-terminology.md).
- Ensure you have installed [Visual Studio Code](https://code.visualstudio.com/) and the latest [Azure API Management Extension for Visual Studio Code (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement&ssr=false#overview)

## Create an API Management service

If you previously used the Azure portal or API Management extension to [create an Azure API Management instance](vscode-create-service-instance.md), you can skip this step. The default settings for the API Management extension create the instance in the Consumption SKU (service tier) in the West US region.

This section shows you how to create an API Management service instance using the API Management extension with customized settings. For example, choose a different service tier or region.

To enable customized settings:

1. Launch Visual Studio Code, select Extensions from the Activity Bar, and search for *API Management*.
1. Select the **Manage** icon (a gear), and then select **Extension Settings**.
1. Enable the **Azure API Management: Advanced Creation** setting. You can enable extension settings at the [user or workspace scope](https://code.visualstudio.com/docs/getstarted/settings).
    :::image type="content" source="media/vscode-tutorial-service-instance/enable-advanced-creation-setting.png" alt-text="Enable advance creation of API Management instance":::
1. Select the **Manage** icon, and ensure that the extension is enabled.

To create an API Management instance:

1. Select the Azure icon on the Activity Bar to open the Azure extension.
1. If you're not already signed into Azure, select **Sign in to Azure...** to launch a browser window and sign in to your Microsoft account.
1. Once you're signed in to your Microsoft account, the *Azure: API Management* explorer pane lists your Azure subscription(s).
1. Right-click the subscription you'd like to use, and select **Create API Management in Azure**.
1. When prompted, select or enter the following values:
    1. A **name** for the new API Management instance. It must be globally unique within Azure and consist of 1-50 alphanumeric characters and/or hyphens, and start with a letter and end with an alphanumeric.
    1. The **service tier** for the instance. For example, select the Developer tier, an economical option to evaluate Azure API Management. This tier isn't for production use. For more information about scaling the API Management tiers, see [upgrade and scale](upgrade-and-scale.md).
    1. A **location** for the API Management instance.
    1. A name of a new or existing **resource group**.

> [!TIP]
> While the *Consumption* SKU takes less than a minute to provision, other SKUs typically take 30-40 minutes to create.

After the instance is created, you're ready to import your first API. 

## Import an API

The following example imports an OpenAPI Specification in JSON format into API Management. Microsoft provides the backend API used in this example, and hosts it on Azure at https://conferenceapi.azurewebsites.net?format=json.

1. In the Explorer pane, expand the API Management instance you created.
1. Right-click **APIs**, and select **Import from OpenAPI Link**. 
1. When prompted, enter the following values:
    1. An **OpenAPI link** for content in JSON format. For this example: *https://conferenceapi.azurewebsites.net?format=json*.
    This URL is the service that implements the example API. API Management forwards requests to this address.
    1. An **API name**, such as *demo-conference-api*, that is unique in the API Management instance. This name can contain only letters, number, and hyphens. The first and last characters must be alphanumeric. This name is used in the path to call the API.

After the API is imported successfully, it appears in the Explorer pane, and available API operations appear under the **Operations** node.

:::image type="content" source="media/vscode-tutorial-service-instance/tutorial-api-operations.png" alt-text="Imported API in Explorer pane":::

## Edit the API

You can edit the API in Visual Studio Code. For example, edit the Resource Manager JSON description of the API in the editor window to remove the **http** protocol used to access the API. Then select **File** > **Save**.

:::image type="content" source="media/vscode-tutorial-service-instance/import-demo-api.png" alt-text="Edit JSON description":::


To edit the OpenAPI format, right-click the API name in the Explorer pane and select **Edit OpenAPI**. Make your changes, and then select **File** > **Save**.

## Test the API

### Get the subscription key

To test the API you imported, you need a subscription key for your API Management instance.

1. In the Explorer pane, right-click the name of your API Management instance.
1. Select **Copy Subscription Key**.

:::image type="content" source="media/vscode-tutorial-service-instance/copy-subscription-key.png" alt-text="Copy subscription key":::

### Test an API operation

1. In the Explorer pane, expand the **Operations** node under the *demo-conference-api* that you imported.
1. Select an operation such as *GetSpeakers*.
1. In the editor windows, here indicated next to **Ocp-Apim-Subscription-Key**, paste the subscription key.
1. Select **Send request**. 

:::image type="content" source="media/vscode-tutorial-service-instance/test-api.png" alt-text="Send API request from Visual Studio Code":::

When the request succeeds, the backend responds with **200 OK** and some data.

:::image type="content" source="media/vscode-tutorial-service-instance/test-api-response.png" alt-text="Response to API test operation":::

Notice that the response data includes the following information about the backend:

*  **X-AspNet-Version** and **X-Powered-By** headers
* URLs to the API backend, in this case https://conferenceapi.azurewebsites.net.

In the next section, you transform the API so it doesn't reveal this information about the backend.

### Trace the API operation

For detailed tracing information to help you debug the API operation, select the link that appears next to **Ocp-APIM-Trace-Location**. 

The JSON file at that location contains Inbound, Backend, and Outbound trace information so you can determine where any problems occur after the request is made.

## Apply policies to the API 

API Management provides [policies](api-management-policies.md) you can configure for your APIs. Policies are a collection of statements that are executed sequentially on the request or response of an API. Policies can be global, which apply to all APIs in your API Management instance, or they can be scoped to a specific API or API operation.

This section shows how to apply outbound policies to your API that transform the API response. The policies in this example strip response headers and hide original backend URLs that appear in the response body.

1. In the Explorer pane, select **Policy** under the *demo-conference-api* that you imported. The policy file opens in the editor windows. This file configures policies for all operations in the API. 

1. Update the file with the following content in the `<outbound>` element:
    ```html
    [...]
    <outbound>
        <set-header name="X-AspNet-Version" exists-action="delete" />
        <set-header name="X-Powered-By" exists-action="delete" />
        <redirect-content-urls />
        <base />
    </outbound>
    [...]
    ```

    * The first two policies delete **X-AspNet-Version** and **X-Powered-By** headers, if they exist
    * The `redirect-content-urls` policy rewrites (masks) links in the response body so that they point to the equivalent links via the API Management gateway
    
1. Save the file. If you are prompted, select **Upload** to upload the file to the cloud.

1. Follow the steps in the previous section to test the *GetSpeakers* operation in the API.

When the request succeeds, the backend responds with **200 OK** and some data. 

:::image type="content" source="media/vscode-tutorial-service-instance/test-api-policies.png" alt-text="Transformed response to API test operation":::

Notice the following differences in the response:
* The **X-AspNet-Version** and **X-Powered-By** headers don't appear in the response.
* URLs to the API backend are replaced and redirected to the API Management gateway, in this case https://apim-hello-world.azure-api.net/demo-conference-api.

## Clean up resources

When no longer needed, remove the API Management instance by right-clicking and selecting **Open in Portal** to [delete the API Management service](get-started-create-service-instance.md#clean-up-resources) and its resource group.

Alternately, you can select **Delete API Management** to only delete the API Management instance (this operation doesn't delete its resource group).

:::image type="content" source="media/vscode-tutorial-service-instance/vscode-apim-delete.png" alt-text="Delete API Management instance from VS Code":::

## Next steps

This tutorial introduced several features of the API Management Extension for Visual Studio Code that you can use to import and manage APIs. You learned how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Edit the API
> * Test the API
> * Apply API Management policies

The API Management Extension provides additional features to work with your APIs. For example, learn how to [debug polices](api-management-debug-policies) (available in the Developer service tier only).