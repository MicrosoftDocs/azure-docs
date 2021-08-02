---
title: Tutorial - Create and publish a product in Azure API Management
description: In this tutorial, you create and publish a product in Azure API Management. Once it's published, developers can begin to use the product's APIs.

author: mikebudzynski
ms.service: api-management
ms.topic: tutorial
ms.date: 02/09/2021
ms.author: apimpm

---
# Tutorial: Create and publish a product  

In Azure API Management, a [*product*](api-management-terminology.md#term-definitions) contains one or more APIs as well as a usage quota and the terms of use. Once a product is published, developers can subscribe to the product and begin to use the product's APIs.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and publish a product
> * Add an API to the product

:::image type="content" source="media/api-management-howto-add-products/added-product.png" alt-text="API Management products in portal":::


## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Create and publish a product

### [Portal](#tab/azure-portal)

1. Sign in to the Azure portal, and navigate to your API Management instance.
1. In the left navigation, select **Products** > **+ Add**.
1.  In the **Add product** window, enter values described in the following table to create your product.

    :::image type="content" source="media/api-management-howto-add-products/02-create-publish-product-01.png" alt-text="Add product in portal":::

    | Name                     | Description                                                                                                                                                                                                                                                                                                             |
    |--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Display name             | The name as you want it to be shown in the [developer portal](api-management-howto-developer-portal.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | Description              | Provide information about the product such as its purpose, the APIs it provides access to, and other details.                                                                                                                                               |
    | State                    | Select **Published** if you want to publish the product. Before the APIs in a product can be called, the product must be published. By default, new products are unpublished, and are visible only to the  **Administrators** group.                                                                                      |
    | Requires subscription    | Select if a user is required to subscribe to use the product.                                                                                                                                                                                                                                   |
    | Requires approval        | Select if you want an administrator to review and accept or reject subscription attempts to this product. If not selected, subscription attempts are auto-approved.                                                                                                                         |
    | Subscription count limit | Optionally limit the count of multiple simultaneous subscriptions.                                                                                                                                                                                                                                |
    | Legal terms              | You can include the terms of use for the product which subscribers must accept in order to use the product.                                                                                                                                                                                                             |
    | APIs                     | Select one or more APIs. You can also add APIs after creating the product. For more information, see [Add APIs to a product](#add-apis-to-a-product) later in this article. |

3. Select **Create** to create the new product.

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

To create a product, run the [az apim product create](/cli/azure/apim/product#az_apim_product_create) command:

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
   | `--subscription-required` | Select if a user is required to subscribe to use the product. |
   | `--approval-required` | Select if you want an administrator to review and accept or reject subscription attempts to this product. If not selected, subscription attempts are auto-approved. |
   | `--subscriptions-limit` | Optionally limit the count of multiple simultaneous subscriptions.|
   | `--legal-terms`         | You can include the terms of use for the product which subscribers must accept in order to use the product. |

To see your current products, use the [az apim product list](/cli/azure/apim/product#az_apim_product_list) command:

```azurecli
az apim product list --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --output table
```

You can delete a product by using the [az apim product delete](/cli/azure/apim/product#az_apim_product_delete) command:

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

Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. During the product creation, you can add one or more existing APIs. You can also add APIs to the product later, either from the Products **Settings** page or while creating an API.

Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.

### Add an API to an existing product

### [Portal](#tab/azure-portal)

1. In the left navigation of your API Management instance, select **Products**.
1. Select a product, then select **APIs**.
1. Select **+ Add**.
1. Select one or more APIs and then **Select**.

:::image type="content" source="media/api-management-howto-add-products/02-create-publish-product-02.png" alt-text="Add API to existing product":::

### [Azure CLI](#tab/azure-cli)

1. To see your managed APIs, use the [az apim api list](/cli/azure/apim/api#az_apim_api_list) command:

   ```azurecli
   az apim api list --resource-group apim-hello-word-resource-group \
       --service-name apim-hello-world --output table
   ```

1. To add an API to your product, run the [az apim product api add](/cli/azure/apim/product/api#az_apim_product_api_add) command:

   ```azurecli
   az apim product api add --resource-group apim-hello-word-resource-group \
       --api-id demo-conference-api --product-id contoso-product \
       --service-name apim-hello-world
   ```

1. Verify the addition by using the [az apim product api list](/cli/azure/apim/product/api#az_apim_product_api_list) command:

   ```azurecli
   az apim product api list --resource-group apim-hello-word-resource-group \
       --product-id contoso-product --service-name apim-hello-world --output table
   ```

You can remove an API from a product by using the [az apim product api delete](/cli/azure/apim/product/api#az_apim_product_api_delete) command:

```azurecli
az apim product api delete --resource-group apim-hello-word-resource-group \
    --api-id demo-conference-api --product-id contoso-product \
    --service-name apim-hello-world
```

---

> [!TIP]
> You can create or update a user's subscription to a product with custom subscription keys through a [REST API](/rest/api/apimanagement/2020-12-01/subscription/create-or-update) or PowerShell command.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create and publish a product
> * Add an API to the product

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Create blank API and mock API responses](mock-api-responses.md)
