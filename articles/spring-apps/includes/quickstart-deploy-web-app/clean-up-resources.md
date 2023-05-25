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

#### [Azure portal](#tab/Azure-portal)

1. Go to the [Azure portal](https://portal.azure.com/).

2. In the search box, search for *Resource groups*, and then select **Resource groups** in the results.

   :::image type="content" source="../../media/quickstart-deploy-web-app/search-resource-groups.png" alt-text="Screenshot of Azure portal showing Resource groups in search results, with Resource groups highlighted in the search bar and in the results." lightbox="../../media/quickstart-deploy-web-app/search-resource-groups.png":::

3. In the filter box, filter for your resource group name, and then select the resource group name.

4. On the **Resource group Overview** page, select **Delete resource group**.

5. On the **Delete a resource group** page, enter the resource group name for **Enter resource group name to confirm deletion**, select **Delete**, and continue to select **Delete** when prompt `Delete confirmation`.

   :::image type="content" source="../../media/quickstart-deploy-web-app/delete-resource-group.png" alt-text="Screenshot of Azure portal showing resource group deletion highlighted." lightbox="../../media/quickstart-deploy-web-app/delete-resource-group.png":::

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
