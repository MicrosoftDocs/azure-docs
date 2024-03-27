---
title: Tutorial - Create and publish a product in Azure API Management
description: In this tutorial, you create and publish a product in Azure API Management. Once it's published, developers can begin to use the product's APIs.

author: dlepow
ms.service: api-management
ms.topic: tutorial
ms.date: 01/18/2022
ms.author: danlep
ms.custom: devdivchpfy22, devx-track-azurecli 
ms.devlang: azurecli

---
# Tutorial: Create and publish a product

In Azure API Management, a [*product*](api-management-terminology.md#term-definitions) contains one or more APIs, a usage quota, and the terms of use. After a product is published, developers can [subscribe](api-management-subscriptions.md) to the product and begin to use the product's APIs.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and publish a product
> * Add an API to the product
> * Access product APIs

:::image type="content" source="media/api-management-howto-add-products/added-product-1.png" alt-text="API Management products in portal":::


## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Create and publish a product

### [Portal](#tab/azure-portal)

1. Sign in to the Azure portal, and navigate to your API Management instance.
1. In the left navigation pane, select **Products** > **+ Add**.

   :::image type="content" source="media/api-management-howto-add-products/add-product-portal.png" alt-text="Add product in Azure portal":::

1. In the **Add product** window, enter values described in the following table to create your product.

    :::image type="content" source="media/api-management-howto-add-products/add-product.png" alt-text="Add product window":::

    | Name                     | Description                                                                                                                                                                                                                                                                                                             |
    |--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Display name             | The name as you want it to be shown in the [developer portal](api-management-howto-developer-portal.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | Description              | Provide information about the product such as its purpose, the APIs it provides access to, and other details.                                                                                                                                               |
    | State                    | Select **Published** if you want to publish the product. Before the APIs in a product can be called, the product must be published. By default, new products are unpublished, and are visible only to the  **Administrators** group.                                                                                      |
    | Requires subscription    | Select if a user is required to subscribe to use the product (the product is *protected*) and a subscription key must be used to access the product's APIs. If a subscription isn't required (the product is *open*), a subscription key isn't required to access the product's APIs. See [Access to product APIs](#access-to-product-apis) later in this article.                                                                                                                                                                                                   |
    | Requires approval        | Select if you want an administrator to review and accept or reject subscription attempts to this product. If not selected, subscription attempts are auto-approved.                                                                                                                         |
    | Subscription count limit | Optionally limit the count of multiple simultaneous subscriptions.                                                                                                                                                                                                                                |
    | Legal terms              | You can include the terms of use for the product which subscribers must accept in order to use the product.                                                                                                                                                                                                             |
    | APIs                     | Select one or more APIs. You can also add APIs after creating the product. For more information, see [Add APIs to a product](#add-apis-to-a-product) later in this article. <br/><br/>If the product is open (doesn't require a subscription), you can only add an API that isn't associated with another open product.                |

1. Select **Create** to create your new product.

> [!CAUTION]
> Use care when configuring a product that doesn't require a subscription. This configuration may be overly permissive and may make the product's APIs more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To create a product, run the [az apim product create](/cli/azure/apim/product#az-apim-product-create) command:

```azurecli
az apim product create --resource-group apim-hello-word-resource-group \
    --product-name "Contoso product" --product-id contoso-product \
    --service-name apim-hello-world --subscription-required true \
    --state published --description "This is a test."
```

You can specify various values for your product:

   | Parameter | Description |
   |-----------|-------------|
   | `--product-name` | The name as you want it to be shown in the [developer portal](api-management-howto-developer-portal.md). |
   | `--description`  | Provide information about the product such as its purpose, the APIs it provides access to, and other details. |
   | `--state`        | Select **published** if you want to publish the product. Before the APIs in a product can be called, the product must be published. By default, new products are unpublished, and are visible only to the  **Administrators** group. |
   | `--subscription-required` | Select if a user is required to subscribe to use the product (the product is *protected*) or a subscription isn't required (the product is *open*). See [Access to product APIs](#access-to-product-apis) later in this article. |
   | `--approval-required` | Select if you want an administrator to review and accept or reject subscription attempts to this product. If not selected, subscription attempts are auto-approved. |
   | `--subscriptions-limit` | Optionally, limit the count of multiple simultaneous subscriptions.|
   | `--legal-terms`         | You can include the terms of use for the product, which subscribers must accept to use the product. |

> [!CAUTION]
> Use care when configuring a product that doesn't require a subscription. This configuration may be overly permissive and may make the product's APIs more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).

To see your current products, use the [az apim product list](/cli/azure/apim/product#az-apim-product-list) command:

```azurecli
az apim product list --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --output table
```

You can delete a product by using the [az apim product delete](/cli/azure/apim/product#az-apim-product-delete) command:

```azurecli
az apim product delete --product-id contoso-product \
    --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --delete-subscriptions true
```

---

### Add more configurations

Continue configuring the product after saving it. In your API Management instance, select the product from the **Products** window. Add or update:

|Item   |Description  |
|---------|---------|
|Settings     |    Product metadata and state     |
|APIs     |  APIs associated with the product       |
|[Policies](api-management-howto-policies.md)     |  Policies applied to product APIs      |
|Access control     |  Product visibility for developers or guests       |
|[Subscriptions](api-management-subscriptions.md)    |    Product subscribers     |

## Add APIs to a product

Products are associations of one or more APIs. You can include many APIs and offer them to developers through the developer portal. During the product creation, you can add one or more existing APIs. You can also add APIs to the product later, either from the Products **Settings** page or while creating an API.

### Add an API to an existing product

### [Portal](#tab/azure-portal)

1. In the left navigation of your API Management instance, select **Products**.
1. Select a product, and then select **APIs**.
1. Select **+ Add API**.
1. Select one or more APIs, and then **Select**.

:::image type="content" source="media/api-management-howto-add-products/add-api.png" alt-text="Add an API to an existing product":::

### [Azure CLI](#tab/azure-cli)

1. To see your managed APIs, use the [az apim api list](/cli/azure/apim/api#az-apim-api-list) command:

   ```azurecli
   az apim api list --resource-group apim-hello-word-resource-group \
       --service-name apim-hello-world --output table
   ```

1. To add an API to your product, run the [az apim product api add](/cli/azure/apim/product/api#az-apim-product-api-add) command:

   ```azurecli
   az apim product api add --resource-group apim-hello-word-resource-group \
       --api-id demo-conference-api --product-id contoso-product \
       --service-name apim-hello-world
   ```

1. Verify the addition by using the [az apim product api list](/cli/azure/apim/product/api#az-apim-product-api-list) command:

   ```azurecli
   az apim product api list --resource-group apim-hello-word-resource-group \
       --product-id contoso-product --service-name apim-hello-world --output table
   ```

You can remove an API from a product by using the [az apim product api delete](/cli/azure/apim/product/api#az-apim-product-api-delete) command:

```azurecli
az apim product api delete --resource-group apim-hello-word-resource-group \
    --api-id demo-conference-api --product-id contoso-product \
    --service-name apim-hello-world
```

---

## Access to product APIs

After you publish a product, developers can access the APIs. Depending on how the product is configured, they may need to subscribe to the product for access.

* **Protected product** - Developers must first subscribe to a protected product to get access to the product's APIs. When they subscribe, they get a subscription key that can access any API in that product. If you created the API Management instance, you are an administrator already, so you are subscribed to every product by default. For more information, see [Subscriptions in Azure API Management](api-management-subscriptions.md).

    When a client makes an API request with a valid product subscription key, API Management processes the request and permits access in the context of the product. Policies and access control rules configured for the product can be applied.

    > [!TIP]
    > You can create or update a user's subscription to a product with custom subscription keys through a [REST API](/rest/api/apimanagement/current-ga/subscription/create-or-update) or PowerShell command.

* **Open product** - Developers can access an open product's APIs without a subscription key. However, you can configure other mechanisms to secure client access to the APIs, including [OAuth 2.0](api-management-howto-protect-backend-with-aad.md), [client certificates](api-management-howto-mutual-certificates-for-clients.md), and [restricting caller IP addresses](ip-filter-policy.md).

    > [!NOTE]
    > Open products aren't listed in the developer portal for developers to learn about or subscribe to. They're visible only to the **Administrators** group. You'll need to use another mechanism to inform developers about APIs that can be accessed without a subscription key.

    When a client makes an API request without a subscription key:
    
    * API Management checks whether the API is associated with an open product. An API can be associated with at most one open product.

    * If the open product exists, it then processes the request in the context of that open product. Policies and access control rules configured for the open product can be applied. 

For more information, see [How API Management handles requests with or without subscription keys](api-management-subscriptions.md#how-api-management-handles-requests-with-or-without-subscription-keys).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create and publish a product
> * Add an API to the product
> * Access product APIs

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Create blank API and mock API responses](mock-api-responses.md)
