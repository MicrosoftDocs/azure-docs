---
title: "Quickstart: Create a Resource Graph shared query using Azure PowerShell"
description: In this quickstart, you create a Resource Graph shared query using Azure PowerShell.
ms.date: 06/27/2024
ms.topic: quickstart
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create a Resource Graph shared query using Azure PowerShell

In this quickstart, you create an Azure Resource Graph shared query using the `Az.ResourceGraph` Azure PowerShell module. The module is included with the latest version of Azure PowerShell and adds [cmdlets](/powershell/module/az.resourcegraph) for Resource Graph.

A shared query can be run from Azure CLI with the _experimental_ feature's commands, or you can run the shared query from the Azure portal. A shared query is an Azure Resource Manager object that you can grant permission to or run in Azure Resource Graph Explorer. When you finish, you can remove the Resource Graph extension.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Latest versions of [PowerShell](/powershell/scripting/install/installing-powershell) and [Azure PowerShell](/powershell/azure/install-azure-powershell).
- [Visual Studio Code](https://code.visualstudio.com/).

## Install the module

If you installed the latest versions of PowerShell and Azure PowerShell, you already have the `Az.ResourceGraph` module and required version of PowerShellGet. 

### Optional module installation

Use the following steps to install the `Az.ResourceGraph` module so that you can use Azure PowerShell to run Azure Resource Graph queries. The Azure Resource Graph module requires PowerShellGet version 2.0.1 or higher. 

1. Verify your PowerShellGet version:

    ```azurepowershell
    Get-Module -Name PowerShellGet
    ```

   If you need to update, go to [PowerShellGet](/powershell/gallery/powershellget/install-powershellget).

1. Install the module:

   ```azurepowershell
   Install-Module -Name Az.ResourceGraph -Repository PSGallery -Scope CurrentUser
   ```

    The command installs the module in the `CurrentUser` scope. If you need to install in the `AllUsers` scope, run the installation from an administrative PowerShell session.

1. Verify the module was installed:

   ```azurepowershell
   Get-Command -Module Az.ResourceGraph -CommandType Cmdlet
   ```

   The command displays the `Search-AzGraph` cmdlet version and loads the module into your PowerShell session.

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurepowershell
Connect-AzAccount

# Run these commands if you have multiple subscriptions
Get-AzSubScription
Set-AzContext -Subscription <subscriptionID>
```

## Create a shared query

The shared query is an Azure Resource Manager object that you can grant permission to or run in Azure Resource Graph Explorer. The query summarizes the count of all resources grouped by location.

1. Create a resource group to store the Azure Resource Graph shared query.

   ```azurepowershell
   New-AzResourceGroup -Name demoSharedQuery -Location westus2
   ```

1. Create the Azure Resource Graph shared query.

   ```azurepowershell
   $params = @{
     Name = 'Summarize resources by location'
     ResourceGroupName = 'demoSharedQuery'
     Location = 'westus2'
     Description = 'This shared query summarizes resources by location for a pinnable map graphic.'
     Query = 'Resources | summarize count() by location'
   }

   New-AzResourceGraphQuery @params
   ```

   The `$params` variable uses PowerShell [splatting](/powershell/module/microsoft.powershell.core/about/about_splatting) to improve readability for the parameter values used in the command to create the shared query. 

1. List all shared queries in the resource group. 

   ```azurepowershell
   Get-AzResourceGraphQuery -ResourceGroupName demoSharedQuery
   ```

1. Limit the results to a specific shared query.

   ```azurepowershell
   Get-AzResourceGraphQuery -ResourceGroupName demoSharedQuery -Name 'Summarize resources by location'
   ```

## Run the shared query

You can verify the shared query works using Azure Resource Graph Explorer. To change the scope, use the **Scope** menu on the left side of the page. 

1. Sign in to [Azure portal](https://portal.azure.com).
1. Enter _resource graph_ into the search field at the top of the page.
1. Select **Resource Graph Explorer**.
1. Select **Open query**.
1. Change **Type** to _Shared queries_.
1. Select the query _Count VMs by OS_.
1. Select **Run query** and the view output in the **Results** tab.
1. Select **Charts** and then select **Map** to view the location map.

You can also run the query from your resource group. 

1. In Azure, go to the resource group, _demoSharedQuery_.
1. From the **Overview** tab, select the query _Count VMs by OS_.
1. Select the **Results** tab to view a list.
1. Select **Charts** and then select **Map** to view the location map.

## Clean up resources

When you finish, you can remove the Resource Graph shared query and resource group from your Azure environment. When a resource group is deleted, the resource group and all its resources are deleted.

Remove the shared query:

```azurepowershell
Remove-AzResourceGraphQuery -ResourceGroupName demoSharedQuery -Name 'Summarize resources by location'
```

Delete the resource group:

```azurepowershell
Remove-AzResourceGroup -Name demoSharedQuery
```

To sign out of your Azure PowerShell session:

```azurepowershell
Disconnect-AzAccount
```

### Optional clean up steps

If you installed the latest version of Azure PowerShell, the `Az.ResourceGraph` module is included and shouldn't be removed. The following steps are optional if you did a manual install of the `Az.ResourceGraph` module and want to remove the module. 

To remove the `Az.ResourceGraph` module from your PowerShell session, run the following command:

```azurepowershell
Remove-Module -Name Az.ResourceGraph
```

To uninstall the `Az.ResourceGraph` module from your computer, run the following command:

```azurepowershell
Uninstall-Module -Name Az.ResourceGraph
```

A message might be displayed that _module Az.ResourceGraph is currently in use_. If so, you need to shut down your PowerShell session and start a new session. Then run the command to uninstall the module from your computer.

## Next steps

In this quickstart, you created a Resource Graph shared query using Azure PowerShell. To learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
