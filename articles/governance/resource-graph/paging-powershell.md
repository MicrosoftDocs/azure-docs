---
title: 'Paginate Azure Resource Graph query results using Azure PowerShell'
description: In this quickstart, you control the volume Azure Resource Graph query output by using pagination in Azure PowerShell.
ms.date: 11/07/2022
ms.topic: quickstart
ms.custom: mode-api
ms.author: timwarner
author: timwarner-msft
---
# Quickstart: Paginate Azure Resource Graph query results using Azure PowerShell

By default, Azure Resource Graph returns a maximum of 1000 records for each query. However, you can
use the `skipToken` property to adjust how many records you return per request.

At the end of this quickstart, you'll be able to customize the output volume returned by your Azure Resource
Graph queries by using Azure PowerShell.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Add the Resource Graph module

To enable Azure PowerShell to query Azure Resource Graph, the **Az.ResourceGraph** module must be added. This module can
be used with locally installed PowerShell, with [Azure Cloud Shell](https://shell.azure.com), or
with the [PowerShell Docker image](https://hub.docker.com/_/microsoft-powershell).

### Base requirements

The Azure Resource Graph module requires the following software:

- Azure PowerShell 1.0.0 or higher. If it isn't yet installed, follow
  [these instructions](/powershell/azure/install-az-ps).

- PowerShellGet 2.0.1 or higher. If it isn't installed or updated, follow
  [these instructions](/powershell/scripting/gallery/installing-psget).

### Install the module

The Resource Graph module for PowerShell is **Az.ResourceGraph**.

1. From an **administrative** PowerShell prompt, run the following command:

   ```azurepowershell-interactive
   # Install the Resource Graph module from PowerShell Gallery
   Install-Module -Name Az.ResourceGraph
   ```

1. Validate that the module has been imported and is at least version `0.11.0`:

   ```azurepowershell-interactive
   # Get a list of commands for the imported Az.ResourceGraph module
   Get-Command -Module 'Az.ResourceGraph' -CommandType 'Cmdlet'
   ```

## Paginate Azure Resource Graph query results

With the Azure PowerShell module added to your environment of choice, it's time to try out a simple
tenant-based Resource Graph query and work with paginating the results. We'll start with an ARG query
that returns a list of all virtual machines (VMS) across all subscriptions associated with a given Azure Active Directory (Azure AD) tenant.

We'll then configure the query to return five records (VMs) at a time.

> [!NOTE]
> This example query is adapted from the work of Microsoft Most Valuable Professional (MVP)
> [Oliver Mossec](https://github.com/omiossec).

1. Run the initial Azure Resource Graph query using the `Search-AzGraph` cmdlet:

   ```azurepowershell-interactive
   # Login first with Connect-AzAccount if not using Cloud Shell

   # Run Azure Resource Graph query
   Search-AzGraph -Query "Resources | join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' | project subscriptionName = name, subscriptionId) on subscriptionId | where type =~ 'Microsoft.Compute/virtualMachines' | project VMResourceId = id, subscriptionName, resourceGroup, name"
   ```

1. Update the query to implement the `skipToken` property and return 5 VMs in each batch:

   ```azurepowershell-interactive
$kqlQuery = "Resources | join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' | project subscriptionName = name,subscriptionId) on subscriptionId | where type =~ 'Microsoft.Compute/virtualMachines' | project VMResourceId = id, subscriptionName, resourceGroup,name"

$batchSize = 2
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

If you wish to remove the Resource Graph module from your Azure PowerShell environment, you can do
so by using the following command:

```azurepowershell-interactive
# Remove the Resource Graph module from the current session
Remove-Module -Name 'Az.ResourceGraph'

# Uninstall the Resource Graph module from the environment
Uninstall-Module -Name 'Az.ResourceGraph'
```

> [!NOTE]
> This doesn't delete the module file downloaded earlier. It only removes it from the running
> PowerShell session.

## Next steps

In this quickstart, you learned how to paginate Azure Resource Graph query results by using
Azure PowerShell. To learn more about the Resource Graph language, review any of the following
Microsoft Learn resources.

- [Work with large data sets - Azure Resource Graph](concepts/work-with-data.md)
- [Az.ResourceGraph PowerShell module reference](/powershell/module/az.resourcegraph)
- [What is Azure Resource Graph?](overview.md)
