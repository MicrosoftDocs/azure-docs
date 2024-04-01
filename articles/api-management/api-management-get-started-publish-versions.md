---
title: Tutorial - Publish versions of your API using Azure API Management 
description: Follow the steps of this tutorial to learn how to publish multiple API versions in API Management.
author: dlepow

ms.service: api-management
ms.custom: mvc, devx-track-azurecli
ms.topic: tutorial
ms.date: 02/10/2021
ms.author: danlep
---
# Tutorial: Publish multiple versions of your API 

There are times when it's impractical to have all callers to your API use exactly the same version. When callers want to upgrade to a later version, they want an approach that's easy to understand. As shown in this tutorial, it is possible to provide multiple *versions* in Azure API Management. 

For background, see [Versions](api-management-versions.md) & [Revisions](api-management-revisions.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a new version to an existing API
> * Choose a version scheme
> * Add the version to a product
> * Browse the developer portal to see the version

:::image type="content" source="media/api-management-getstarted-publish-versions/azure-portal.png" alt-text="Version shown in Azure portal":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Add a new version

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **APIs**.
1. Select **Demo Conference API** from the API list. 
1. Select the context menu (**...**) next to **Demo Conference API**.
1. Select **Add version**.

:::image type="content" source="media/api-management-getstarted-publish-versions/add-version-menu.png" alt-text="API context menu - add version":::


> [!TIP]
> Versions can also be enabled when you create a new API. On the **Add API** screen, select **Version this API?**.

## Choose a versioning scheme

In Azure API Management, you choose how callers specify the API version by selecting a *versioning scheme*: **path, header**, or **query string**. In the following example, *path* is used as the versioning scheme.

Enter the values from the following table. Then select **Create** to create your version.

:::image type="content" source="media/api-management-getstarted-publish-versions/add-version.png" alt-text="Add version window":::



|Setting   |Value  |Description  |
|---------|---------|---------|
|**Name**     |  *demo-conference-api-v1*       |  Unique name in your API Management instance.<br/><br/>Because a version is in fact a new API based off an API's [revision](api-management-get-started-revise-api.md), this setting is the new API's name.   |
|**Versioning scheme**     |  **Path**       |  The way callers specify the API version.     |
|**Version identifier**     |  *v1*       |  Scheme-specific indicator of the version. For **Path**, the suffix for the API URL path. <br/><br/> If **Header** or **Query string** is selected, enter an additional value: the name of the header or query string parameter.<br/><br/> A usage example is displayed.        |
|**Products**     |  **Unlimited**       |  Optionally, one or more products that the API version is associated with. To publish the API, you must associate it with a product. You can also [add the version to a product](#add-the-version-to-a-product) later.      |

After creating the version, it now appears underneath **Demo Conference API** in the API List. You now see two APIs: **Original**, and **v1**.

![Versions listed under an API in the Azure portal](media/api-management-getstarted-publish-versions/version-list.png)

> [!Note]
> If you add a version to a non-versioned API, an **Original** is also automatically created. This version responds on the default URL. Creating an Original version ensures that any existing callers are not broken by the process of adding a version. If you create a new API with versions enabled at the start, an Original isn't created.

## Edit a version

After adding the version, you can now edit and configure it as an API that is separate from an Original. Changes to one version do not affect another. For example, add or remove API operations, or edit the OpenAPI specification. For more information, see [Edit an API](edit-api.md).

## Add the version to a product

In order for callers to see the new version, it must be added to a *product*. If you didn't already add the version to a product, you can add it to a product at any time.

For example, to add the version to the **Unlimited** product:
1. In the Azure portal, navigate to your API Management instance.
1. Select **Products** > **Unlimited** > **APIs** > **+ Add**.
1. Select **Demo Conference API**, version **v1**.
1. Click **Select**.

:::image type="content" source="media/api-management-getstarted-publish-versions/08-add-multiple-versions-03-add-version-product.png" alt-text="Add version to product":::

## Use version sets

When you create multiple versions, the Azure portal creates a *version set*, which represents a set of versions for a single logical API. Select the name of an API that has multiple versions. The Azure portal displays its **Version set**. You can customize the **Name** and **Description** of a virtual set.

You can interact directly with version sets by using the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To see all your version sets, run the [az apim api versionset list](/cli/azure/apim/api/versionset#az-apim-api-versionset-list) command:

```azurecli
az apim api versionset list --resource-group apim-hello-world-resource-group \
    --service-name apim-hello-world --output table
```

When the Azure portal creates a version set for you, it assigns an alphanumeric name, which appears in the **Name** column of the list. Use this name in other Azure CLI commands.

To see details about a version set, run the [az apim api versionset show](/cli/azure/apim/api/versionset#az-apim-api-versionset-show) command:

```azurecli
az apim api versionset show --resource-group apim-hello-world-resource-group \
    --service-name apim-hello-world --version-set-id 00000000000000000000000
```

For more information about version sets, see [Versions in Azure API Management](api-management-versions.md#how-versions-are-represented).

## Browse the developer portal to see the version

If you've tried the [developer portal](api-management-howto-developer-portal-customize.md), you can see API versions there.

1. Select **Developer Portal** from the top menu.
2. Select **APIs**, and then select **Demo Conference API**.
3. You should see a dropdown with multiple versions next to the API name.
4. Select **v1**.
5. Notice the **Request URL** of the first operation in the list. It shows that the API URL path includes **v1**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a new version to an existing API
> * Choose a version scheme 
> * Add the version to a product
> * Browse the developer portal to see the version

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Customize the style of the Developer portal pages](api-management-howto-developer-portal-customize.md)
