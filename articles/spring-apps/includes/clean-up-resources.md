---
author: karlerickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-web-app/clean-up-resources.md)]

-->

## 6 Clean up resources

::: zone pivot="sc-consumption-plan,sc-enterprise"

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternatively, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

::: zone-end

::: zone pivot="sc-standard"

#### [Azure portal](#tab/Azure-portal)

You can delete the Azure resource group, which includes all the resources in the resource group. To delete the entire resource group, including the newly created service:

1. Locate your resource group in the portal. On the menu on the left, select **Resource groups**. Then select the name of your resource group, such as the example, **myresourcegroup**.

1. On your resource group page, select **Delete**. Enter the name of your resource group, such as the example, **myresourcegroup**, in the text box to confirm deletion. Select Delete.

#### [Azure Developer CLI](#tab/Azure-Developer-CLI)

1. Run the following command to delete all the Azure resources used in this sample application.

   ```bash
   azd down
   ```

   Command interaction description:

    - **Total resources to delete: <resources-total>, are you sure you want to continue?**: Enter *y*.
    - **Would you like to permanently delete these resources instead, allowing their names to be reused?**: Enter *y*. Enter *n* if you want to reuse the Key Vault.

   The console outputs messages similar to the following:

   ```text
   SUCCESS: Your Azure resources have been deleted.
   ```
   
---

::: zone-end
