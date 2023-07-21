---
title: 'Quickstart: Create a shared query with Bicep'
description: In this quickstart, you use Bicep to create a Resource Graph shared query that counts virtual machines by OS.
author: rayoef
ms.author: rayoflores
ms.date: 05/17/2022
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---
# Quickstart: Create a shared query using Bicep

[Azure Resource Graph](../../governance/resource-graph/overview.md) is an Azure service designed to extend Azure Resource Management by providing efficient and performant resource exploration with the ability to query at scale across a given set of subscriptions so you can effectively govern your environment. With Resource Graph queries, you can:

- Query resources with complex filtering, grouping, and sorting by resource properties.
- Explore resources iteratively based on governance requirements.
- Assess the impact of applying policies in a vast cloud environment.
- [Query changes made to resource properties](./how-to/get-resource-changes.md) (preview).

Resource Graph queries can be saved as a _private query_ or a _shared query_. A private query is saved to the individual's Azure portal profile and isn't visible to others. A shared query is a Resource Manager object that can be shared with others through permissions and role-based access. A shared query provides common and consistent execution of resource discovery. This quickstart uses Bicep to create a shared query.

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

1. Save the Bicep file as **main.bicep** to your local computer.

    > [!NOTE]
    > The Bicep file isn't required to be named **main.bicep**. If you save the file with a different name, you must change the name of
    > the template file in the deployment step below.

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

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

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

In this quickstart, you created a Resource Graph shared query using Bicep.

To learn more about shared queries, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Manage queries in Azure portal](./tutorials/create-share-query.md)
