---
title: Paginate Resource Graph query results using Azure PowerShell
description: In this quickstart, you run an Azure Resource Graph query and paginate output using Azure PowerShell.
ms.date: 04/24/2024
ms.topic: quickstart
ms.custom: dev-track-azurepowershell, devx-track-azurepowershell
---

# Quickstart: Paginate Resource Graph query results using Azure PowerShell

This quickstart describes how to run an Azure Resource Graph query and paginate the output using Azure PowerShell. By default, Azure Resource Graph returns a maximum of 1,000 records for each query. You can use the `Search-AzGraph` cmdlet's `skipToken` parameter to adjust how many records are returned per request.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [PowerShell](/powershell/scripting/install/installing-powershell).
- [Azure PowerShell](/powershell/azure/install-azure-powershell).
- [Visual Studio Code](https://code.visualstudio.com/).

## Install the module

Install the `Az.ResourceGraph` module so that you can use Azure PowerShell to run Azure Resource Graph queries. The Azure Resource Graph module requires PowerShellGet version 2.0.1 or higher. If you installed the latest versions of PowerShell and Azure PowerShell, you already have the required version.

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

## Paginate Azure Resource Graph query results

The examples run a tenant-based Resource Graph query to list of virtual machines and then updates the command to return results that batch five records for each request.

The same query is used in each example:

```kusto
Resources |
join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' |
  project subscriptionName = name, subscriptionId)
  on subscriptionId |
where type =~ 'Microsoft.Compute/virtualMachines' |
project VMResourceId = id, subscriptionName, resourceGroup, name
```

The `Search-AzGraph` command runs a query that returns a list of all virtual machines across all subscriptions associated with a given Azure tenant:

```azurepowershell
Search-AzGraph -Query "Resources | join kind=leftouter (ResourceContainers | where
type=='microsoft.resources/subscriptions' | project subscriptionName = name, subscriptionId) on
subscriptionId | where type =~ 'Microsoft.Compute/virtualMachines' | project VMResourceId = id,
subscriptionName, resourceGroup, name"
```

The next step updates the `Search-AzGraph` command to return five records for each batch request. The command uses a `while` loop, variables, and the `skipToken` parameter.

```azurepowershell
$kqlQuery = "Resources | join kind=leftouter (ResourceContainers | where
type=='microsoft.resources/subscriptions' | project subscriptionName = name, subscriptionId) on
subscriptionId | where type =~ 'Microsoft.Compute/virtualMachines' | project VMResourceId = id,
subscriptionName, resourceGroup, name"

$batchSize = 5
$skipResult = 0

[System.Collections.Generic.List[string]]$kqlResult

while ($true) {

  if ($skipResult -gt 0) {
    $graphResult = Search-AzGraph -Query $kqlQuery -First $batchSize -SkipToken $graphResult.SkipToken
  }
  else {
    $graphResult = Search-AzGraph -Query $kqlQuery -First $batchSize
  }

  $kqlResult += $graphResult.data

  if ($graphResult.data.Count -lt $batchSize) {
    break;
  }
  $skipResult += $skipResult + $batchSize
}
```

## Clean up resources

To remove the `Az.ResourceGraph` module from your PowerShell session, run the following command:

```azurepowershell
Remove-Module -Name Az.ResourceGraph
```

To uninstall the `Az.ResourceGraph` module from your computer, run the following command:

```azurepowershell
Uninstall-Module -Name Az.ResourceGraph
```

A message might be displayed that _module Az.ResourceGraph is currently in use_. If so, you need to shut down your PowerShell session and start a new session. Then run the command to uninstall the module from your computer.

To sign out of your Azure PowerShell session:

```azurepowershell
Disconnect-AzAccount
```

## Next steps

In this quickstart, you learned how to paginate Azure Resource Graph query results by using Azure PowerShell. To learn more, go to the following articles:

- [Working with large Azure resource data sets](concepts/work-with-data.md)
- [Az.ResourceGraph PowerShell module reference](/powershell/module/az.resourcegraph)
