---
title: 'Quickstart: Create a shared query with Bicep'
description: In this quickstart, you use Bicep to create a Resource Graph shared query that counts virtual machines by OS.
author: schaffererin
ms.author: v-eschaffer
ms.date: 05/17/2022
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm
---
# Quickstart: Create a shared query using Bicep

Resource Graph queries can be saved as a _private query_ or a _shared query_. A private query is saved to the individuals portal profile and isn't visible to others. A shared query is a Resource Manager object that can be shared with others through permissions and role-based access. A shared query provides common and consistent execution of resource discovery. This quickstart uses Bicep to create a shared query.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the Bicep file

In this quickstart, you create a shared query called _Count VMs by OS_. To try this query in SDK or in portal with Resource Graph Explorer, see [Samples - Count virtual machines by OS type](./samples/starter.md#count-os).

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/resourcegraph-sharedquery-countos/).

:::code language="bicep" source="~/quickstart-templates/demos/resourcegraph-sharedquery-countos/main.bicep":::

The resource defined in the Bicep file is:

- [Microsoft.ResourceGraph/queries](/azure/templates/microsoft.resourcegraph/queries)

## Deploy the Bicep file

> [!NOTE]
> Azure Resource Graph service is free. For more information, see
> [Overview of Azure Resource Graph](./overview.md).

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    When the deployment finishes, you should see a message indicating the deployment succeeded.

Some other resources:

- To see the template reference, go to [Azure template reference](/azure/templates/microsoft.resourcegraph/allversions).
- To learn how to create Bicep files, see [Quickstart: Create Bicep files with Visual Studio Code](../../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md).

## Validate the deployment

To run the new shared query, follow these steps:

1. From the portal search bar, search for **Resource Graph queries** and select it.

1. Select the shared query named **Count VMs by OS**, then select the **Results** tab on the
   **Overview** page.

The shared query can also be opened from Resource Graph Explorer:

1. From the portal search bar, search for **Resource Graph Explorer** and select it.

1. Select the **Open a query** button.

1. Change **Type** to _Shared queries_. If you don't see the **Count VMs by OS** in the list, use
   the filter box to limit the results. Once the **Count VMs by OS** shared query is visible, select
   its name.

1. Once the query is loaded, select the **Run query** button. Results are displayed in the
   **Results** tab.

## Clean up resources

When you no longer need the resource that you created, delete the resource group using Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a Resource Graph shared query.

To learn more about shared queries, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Manage queries in Azure portal](./tutorials/create-share-query.md)
