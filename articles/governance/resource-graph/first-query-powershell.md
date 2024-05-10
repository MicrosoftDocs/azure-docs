---
title: "Quickstart: Run Resource Graph query using Azure PowerShell"
description: In this quickstart, you run an Azure Resource Graph query using the module for Azure PowerShell.
ms.date: 04/24/2024
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurepowershell
---

# Quickstart: Run Resource Graph query using Azure PowerShell

This quickstart describes how to run an Azure Resource Graph query using the `Az.ResourceGraph` module for Azure PowerShell. The article also shows how to order (sort) and limit the query's results. You can run a query for resources in your tenant, management groups, or subscriptions. When you're finished, you can remove the module.

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

## Run a query

After the module is added to your environment, you can run a tenant-based query. The query in this example returns five Azure resources with the `name` and `type` of each resource. To query by [management group](../management-groups/overview.md) or subscription, use the `-ManagementGroup` or `-Subscription` parameters.

1. Run an Azure Resource Graph query using the `Search-AzGraph` cmdlet:

   ```azurepowershell
   Search-AzGraph -Query 'Resources | project name, type | limit 5'
   ```

   This query example doesn't use a sort modifier like `order by`. If you run the query multiple times, it might yield a different set of resources for each request.

1. Update the query to `order by` the `name` property:

   ```azurepowershell
   Search-AzGraph -Query 'Resources | project name, type | limit 5 | order by name asc'
   ```

   Like the previous query, if you run this query multiple times might yield a different set of resources for each request. The order of the query commands is important. In this example, the `order by` comes after the `limit`. The query limits the results to five resources and then orders those results by name.

1. Update the query to `order by` the `name` property and then `limit` the output to five results:

   ```azurepowershell
   Search-AzGraph -Query 'Resources | project name, type | order by name asc | limit 5'
   ```

   If this query is run several times with no changes to your environment, the results are consistent and ordered by the `name` property, but still limited to five results. The query orders the results by name and then limits the output to five resources.

If a query doesn't return results from a subscription you already have access to, then note that `Search-AzGraph` cmdlet defaults to subscriptions in the default context. To see the list of subscription IDs that are part of the default context, run this `(Get-AzContext).Account.ExtendedProperties.Subscriptions` If you wish to search across all the subscriptions you have access to, set the `PSDefaultParameterValues` for `Search-AzGraph` cmdlet by running `$PSDefaultParameterValues=@{"Search-AzGraph:Subscription"= $(Get-AzSubscription).ID}`

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

In this quickstart, you added the Resource Graph module to your Azure PowerShell environment and ran a query. To learn more, go to the query language details page.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
