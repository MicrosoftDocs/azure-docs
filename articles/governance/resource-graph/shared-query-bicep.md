---
title: "Quickstart: Create Resource Graph shared query using Bicep"
description: In this quickstart, you use Bicep to create an Azure Resource Graph shared query that counts virtual machines by OS.
ms.date: 06/26/2024
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create Resource Graph shared query using Bicep

In this quickstart, you use Bicep to create an Azure Resource Graph shared query. Resource Graph queries can be saved as a _private query_ or a _shared query_. A private query is saved to the individual's Azure portal profile and isn't visible to others. A shared query is a Resource Manager object that can be shared with others through permissions and role-based access. A shared query provides common and consistent execution of resource discovery. 

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) or [PowerShell](/powershell/scripting/install/installing-powershell) and [Azure PowerShell](/powershell/azure/install-azure-powershell).
- [Visual Studio Code](https://code.visualstudio.com/).

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

# [Azure CLI](#tab/azure-cli)

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription <subscriptionID>
```

# [Azure PowerShell](#tab/azure-powershell)

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurepowershell
Connect-AzAccount

# Run these commands if you have multiple subscriptions
Get-AzSubScription
Set-AzContext -Subscription <subscriptionID>
```

---

## Review the Bicep file

In this quickstart, you create a shared query called _Count VMs by OS_. To try this query in SDK or in portal with Resource Graph Explorer, see [Samples - Count virtual machines by OS type](../resource-graph/samples/starter.md#count-virtual-machines-by-os-type).

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/resourcegraph-sharedquery-countos/).

1. Open Visual Studio Code and create a new file.
1. Copy and paste the Bicep file into your new file.
1. Save the file as _main.bicep_ on your local computer. 

:::code language="bicep" source="~/quickstart-templates/demos/resourcegraph-sharedquery-countos/main.bicep":::

The resource defined in the Bicep file is: [Microsoft.ResourceGraph/queries](/azure/templates/microsoft.resourcegraph/queries). To learn how to create Bicep files, go to [Quickstart: Create Bicep files with Visual Studio Code](../../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md).

## Deploy the Bicep file

Create a resource group and deploy the Bicep file with Azure CLI or Azure PowerShell. Make sure you're in the directory where you saved the Bicep file. Otherwise, you need to specify the path to the file.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name demoSharedQuery --location eastus
az deployment group create --resource-group demoSharedQuery --template-file main.bicep
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name demoSharedQuery -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName demoSharedQuery -TemplateFile main.bicep
```

---

The deployment outputs messages to your shell. When the deployment is finished, your shell returns to a command prompt.

## Review deployed resources

Use Azure CLI or Azure PowerShell to list the deployed resources in the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group demoSharedQuery
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResource -ResourceGroupName demoSharedQuery 
```

---

The output shows the shared query's name, resource group name, and resource ID.

## Run the shared query

You can verify the shared query works using Azure Resource Graph Explorer. To change the scope, use the **Scope** menu on the left side of the page. 

1. Sign in to [Azure portal](https://portal.azure.com).
1. Enter _resource graph_ into the search field at the top of the page.
1. Select **Resource Graph Explorer**.
1. Select **Open query**.
1. Change **Type** to _Shared queries_.
1. Select the query _Count VMs by OS_.
1. Select **Run query** and the view output in the **Results** tab.

You can also run the query from your resource group. 

1. In Azure, go to the resource group, _demoSharedQuery_.
1. From the **Overview** tab, select the query _Count VMs by OS_.
1. Select the **Results** tab.

## Clean up resources

When you no longer need the resource that you created, delete the resource group using Azure CLI or Azure PowerShell. When a resource group is deleted, the resource group and all its resources are deleted. And if you signed into Azure portal to run the query, be sure to sign out.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name demoSharedQuery
```

To sign out of your Azure CLI session:

```azurecli
az logout
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name demoSharedQuery
```

To sign out of your Azure PowerShell session:

```azurepowershell
Disconnect-AzAccount
```

---

## Next steps

In this quickstart, you created a Resource Graph shared query using Bicep. To learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)