---
title: Tutorial - Publish versions of an API using Azure API Management 
description: Learn how to publish multiple API versions in API Management.
author: dlepow

ms.service: azure-api-management
ms.custom: mvc, devx-track-azurecli
ms.topic: tutorial
ms.date: 03/26/2025
ms.author: danlep

#customer intent: As a developer, I want to publish mutliple versions of an API so that all callers to the API don't need to use the same version.
---

# Tutorial: Publish multiple versions of your API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

There are times when it's impractical to have all callers to your API use the same version. When callers want to upgrade to a later version, they want an approach that's easy to understand. As shown in this tutorial, it's possible to provide multiple *versions* in Azure API Management. 

For background, see [Versions](api-management-versions.md) and [Revisions](api-management-revisions.md).

[!INCLUDE [api-management-workspace-try-it](../../includes/api-management-workspace-try-it.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a new version to an existing API
> * Choose a version scheme
> * Add the version to a product
> * View the version in the developer portal

:::image type="content" source="media/api-management-get-started-publish-versions/azure-portal.png" alt-text="Screenshot showing API versions in the Azure portal." lightbox="media/api-management-get-started-publish-versions/azure-portal.png":::

## Prerequisites

+ Learn  [Azure API Management terminology](api-management-terminology.md).
+ Complete the quickstart [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Complete the tutorial [Import and publish your first API](import-and-publish.md).

## Add a new version

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, in the **APIs** section, select **APIs**.
1. Locate **Swagger Petstore - OpenAPI 3.0** in the API list. Select the ellipsis (**...**) next to **Swagger Petstore - OpenAPI 3.0** and then select **Add version**. You'll add values to the resulting window in the next section.

:::image type="content" source="media/api-management-get-started-publish-versions/add-version-menu.png" alt-text="Screenshot showing the steps for adding a version." lightbox="media/api-management-get-started-publish-versions/add-version-menu.png":::

> [!TIP]
> You can also enable versions when you create a new API. On the **Add API** screen, select **Version this API?**.

## Choose a versioning scheme

In API Management, you choose how callers specify the API version by selecting a *versioning scheme*: **Path**, **Header**, or **Query string**. In the following example, *Path* is used as the versioning scheme.

In the **Create a new API as a version** window, enter the values from the following table. Then select **Create** to create your version.

|Setting   |Value  |Description  |
|---------|---------|---------|
|**Version identifier**     |  *v1*       |  Scheme-specific indicator of the version. For **Path**, the suffix for the API URL path.  |
|**Versioning scheme**     |  **Path**       |  The way callers specify the API version.<br/><br/> If you select **Header** or **Query string**, enter another value: the name of the header or query string parameter.<br/><br/> A usage example is displayed.            |
|**Full API version name**     |  *swagger-petstore-openapi-3-0-v1*       |  Unique name in your API Management instance.<br/><br/>Because a version is actually a new API that's based on an API's [revision](api-management-get-started-revise-api.md), this value is the new API's name.   |
|**Products**     |  **Unlimited** (provided in some service tiers)     |  Optionally, one or more products that the API version is associated with. To publish the API, you must associate it with a product. You can also [add the version to a product](#add-the-version-to-a-product) later.      |

:::image type="content" source="media/api-management-get-started-publish-versions/add-version.png" alt-text="Screenshot showing window to create a new version in the portal." lightbox="media/api-management-get-started-publish-versions/add-version.png":::

After you create the version, it appears under **Swagger Petstore - OpenAPI 3.0** in the API list. You now see two APIs: **Original** and **v1**:

:::image type="content" source="media/api-management-get-started-publish-versions/version-list.png" alt-text="Screenshot that shows the list of versions." lightbox="media/api-management-get-started-publish-versions/version-list.png":::

> [!Note]
> If you add a version to a non-versioned API, an original version is also automatically created. This version responds on the default URL. The original version ensures that calls from existing callers still work after the version is added. If you create a new API with versions enabled at the start, an original isn't created.

## Edit a version

After you add the version, you can edit and configure it as an API that's separate from the original. Changes to one version don't affect another (for example, if you add or remove API operations, or edit the OpenAPI specification). For more information, see [Edit an API](edit-api.md).

## Add the version to a product

For callers to see the new version, it must be added to a *product*. If you didn't already add the version to a product, you can do so at any time.

To add the version to a product:

1. In the Azure portal, navigate to your API Management instance.
1. Under **APIs** in the left pane, select **Products**. 
1. Select the product, and then select **APIs** in the left pane. 
1. Select **+ Add**. 
1. Select the API.
1. Click **Select**. 

:::image type="content" source="media/api-management-get-started-publish-versions/08-add-multiple-versions-03-add-version-product.png" alt-text="Screenshot that shows the APIs - Product window." lightbox="media/api-management-get-started-publish-versions/08-add-multiple-versions-03-add-version-product.png":::

## Use version sets

When you create multiple versions, the Azure portal creates a *version set*, which represents a set of versions for a single logical API. If you select the name of an API that has multiple versions, the portal displays its version set. You can customize the name and description of a version set.

You can interact directly with version sets by using the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To see all your version sets, run the [az apim api versionset list](/cli/azure/apim/api/versionset#az-apim-api-versionset-list) command:

```azurecli
az apim api versionset list --resource-group <resource-group-name> \
    --service-name <API-Management-service-name> --output table
```

When the Azure portal creates a version set for you, it assigns an alphanumeric name, which appears in the **Name** column of the list. Use this name in other Azure CLI commands.

To see details about a version set, run the [az apim api versionset show](/cli/azure/apim/api/versionset#az-apim-api-versionset-show) command:

```azurecli
az apim api versionset show --resource-group <resource-group-name> \
    --service-name <API-Management-service-name> --version-set-id <ID from the Name column>
```

For more information about version sets, see [Versions in Azure API Management](api-management-versions.md#how-versions-are-represented).

## View the version in the developer portal

If you use the [developer portal](api-management-howto-developer-portal-customize.md), you can see API versions there.

1. Select **Developer portal** at the top of the window.
1. Select **APIs**, and then select **Swagger Petstore**.
1. You should see a dropdown that lists multiple versions next to the API name.
1. Select **v1**.
1. Notice the **Request URL** of the first operation in the list. It shows that the API URL path includes **v1**.

## Next step

Go to the next tutorial:

> [!div class="nextstepaction"]
> [Customize the style of the Developer portal pages](api-management-howto-developer-portal-customize.md)
