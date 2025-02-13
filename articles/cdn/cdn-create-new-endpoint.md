---
title: Quickstart - Create an Azure Content Delivery Network profile and endpoint
titleSuffix: Azure Content Delivery Network
description: This quickstart shows how to enable Azure Content Delivery Network by creating a new content delivery network profile and content delivery network endpoint.
author: duongau
ms.assetid: 4ca51224-5423-419b-98cf-89860ef516d2
ms.service: azure-cdn
ms.topic: quickstart
ms.date: 03/20/2024
ms.author: duau
---

# Quickstart: Create an Azure Content Delivery Network profile and endpoint

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

In this quickstart, you enable Azure Content Delivery Network by creating a new content delivery network profile, which is a collection of one or more content delivery network endpoints. After you've created a profile and an endpoint, you can start delivering content to your customers.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Storage account named *cdnstorageacct123*, which you use for the origin hostname. To complete this requirement, see [Integrate an Azure Storage account with Azure Content Delivery Network](cdn-create-a-storage-account-with-cdn.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [cdn-create-profile](../../includes/cdn-create-profile.md)]

<a name='create-a-new-cdn-endpoint'></a>

## Create a new content delivery network endpoint

After you've created a content delivery network profile, you use it to create an endpoint.

1. In the Azure portal, select in your dashboard the content delivery network profile that you created. If you can't find it, you can either open the resource group in which you created it, or use the search bar at the top of the portal, enter the profile name, and select the profile from the results.

1. On the content delivery network profile page, select **+ Endpoint**.

    :::image type="content" source="./media/cdn-create-new-endpoint/cdn-select-endpoint.png" alt-text="Screenshot of create Content Delivery Network endpoint.":::

    The **Add an endpoint** pane appears.

3. Enter the following setting values:

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter *cdn-endpoint-123* for your endpoint hostname. This name must be globally unique across Azure; if it's already in use, enter a different name. This name is used to access your cached resources at the domain *&lt;endpoint-name&gt;*.azureedge.net.|
    | **Origin type** | Select **Storage**. |
    | **Origin hostname** | Select the host name of the Azure Storage account you're using from the dropdown list, such as *cdnstorageacct123.blob.core.windows.net*. |
    | **Origin path** | Leave blank. |
    | **Origin host header** | Leave the default value (which is the Origin hostname). |
    | **Protocol** | Leave the default **HTTP** and **HTTPS** options selected. |
    | **Origin port** | Leave the default port values. |
    | **Optimized for** | Leave the default selection, **General web delivery**. |

    :::image type="content" source="./media/cdn-create-new-endpoint/cdn-add-endpoint.png" alt-text="Add endpoint pane.":::

3. Select **Add** to create the new endpoint. After the endpoint is created, it appears in the list of endpoints for the profile.

    :::image type="content" source="./media/cdn-create-new-endpoint/cdn-endpoint-success.png" alt-text="View added endpoint.":::

    It can take up to ten minutes for the endpoint to propagate and be ready to serve content.

## Clean up resources

In the preceding steps, you created a content delivery network profile and an endpoint in a resource group. Save these resources if you want to go to [Next steps](#next-steps) and learn how to add a custom domain to your endpoint. However, if you don't expect to use these resources in the future, you can delete them by deleting the resource group, thus avoiding additional charges:

1. From the left-hand menu in the Azure portal, select **Resource groups** and then select **CDNQuickstart-rg**.

2. On the **Resource group** page, select **Delete resource group**, enter *CDNQuickstart-rg* in the text box, then select **Delete**. This action deletes the resource group, profile, and endpoint that you created in this quickstart.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Use content delivery network to serve static content from a web app](cdn-add-to-web-app.md)
