---
author: karlerickson
ms.author: caiqing
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 02/09/2022
---

<!-- 
Use the following line at the beginning of the Next steps with blank lines before and after. Each quickstart should provide clean-up resources step for developers.

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

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

### [Azure portal](#tab/Azure-portal)

1. Go to the [Azure portal](https://portal.azure.com/).

1. In the search box, search for *Resource groups*, and then select **Resource groups** in the results.

   :::image type="content" source="media/clean-up-resources/search-resource-groups.png" alt-text="Screenshot of Azure portal showing Resource groups in search results, with Resource groups highlighted in the search bar and in the results." lightbox="media/clean-up-resources/search-resource-groups.png":::

1. In the filter box, filter for your resource group name, and then select the resource group name.

1. On the **Resource group Overview** page, select **Delete resource group**.

1. On the **Delete a resource group** page, enter the resource group name for **Enter resource group name to confirm deletion**, select **Delete**, and continue to select **Delete** when prompt `Delete confirmation`.

   :::image type="content" source="media/clean-up-resources/delete-resource-group.png" alt-text="Screenshot of Azure portal showing resource group deletion highlighted." lightbox="media/clean-up-resources/delete-resource-group.png":::

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

1. Run the following command to delete all the Azure resources used in this sample application.

   ```bash
   azd down
   ```

   Command interaction description:

    - **Total resources to delete: [your-resources-total], are you sure you want to continue?**: Enter `y`.
    - **Would you like to permanently delete these resources instead, allowing their names to be reused?**: Enter `y`. Enter `n` if you want to reuse the Key Vault.

   The console outputs messages similar to the following:

   ```text
   SUCCESS: Your Azure resources have been deleted.
   ```

---

::: zone-end
