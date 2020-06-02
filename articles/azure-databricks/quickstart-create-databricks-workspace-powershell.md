---
title: Quickstart - Create an Azure Databricks workspace using PowerShell
description: This quickstart shows how to use PowerShell to create an Azure Databricks workspace.
services: azure-databricks
ms.service: azure-databricks
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.workload: big-data
ms.topic: quickstart
ms.date: 06/02/2020
ms.custom: mvc
---

# Quickstart: Create an Azure Databricks workspace using PowerShell

This quickstart describes how to use PowerShell to create an Azure Databricks workspace. You can use
PowerShell to create and manage Azure resources interactively or in scripts.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information
about installing the Az PowerShell module, see
[Install Azure PowerShell](/powershell/azure/install-az-ps).

> [!IMPORTANT]
> While the Az.Databricks PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.Databricks -AllowPrerelease`.
> Once the Az.Databricks PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If this is your first time using Azure Databricks, you must register the
**Microsoft.Databricks** resource provider.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Databricks
```

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription ID using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## Create a resource group

Create an [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. A
resource group is a logical container in which Azure resources are deployed and managed as a group.

The following example creates a resource group named **myresourcegroup** in the **West US 2** region.

```azurepowershell-interactive
New-AzResourceGroup -Name myresourcegroup -Location westus2
```

## Create an Azure Databricks workspace

In this section, you create an Azure Databricks workspace using PowerShell.

```azurepowershell-interactive
New-AzDatabricksWorkspace -Name mydatabricksws -ResourceGroupName myresourcegroup -Location westus2 -ManagedResourceGroupName databricks-group -Sku standard
```

Provide the following values:

|       **Property**       |                                                                                **Description**                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name                     | Provide a name for your Databricks workspace                                                                                                                                   |
| ResourceGroupName        | Specify an existing resource group name                                                                                                                                        |
| Location                 | Select **West US 2**. For other available regions, see [Azure services available by region](https://azure.microsoft.com/regions/services/)                                     |
| ManagedResourceGroupName | Specify whether you want to create a new managed resource group or use an existing one.                                                                                        |
| Sku                      | Choose between **Standard**, **Premium**, or **Trial**. For more information on these tiers, see [Databricks pricing](https://azure.microsoft.com/pricing/details/databricks/) |

The workspace creation takes a few minutes. Once this process is finished, your user account is
automatically added as an admin user in the workspace.

When a workspace deployment fails, the workspace is still created in a failed state. Delete the
failed workspace and create a new workspace that resolves the deployment errors. When you delete the
failed workspace, the managed resource group and any successfully deployed resources are also
deleted.

## Determine the provisioning state of a Databricks workspace

To determine if a Databricks workspace was provisioned successfully, you can use the
`Get-AzDatabricksWorkspace` cmdlet.

```azurepowershell-interactive
Get-AzDatabricksWorkspace -Name mydatabricksws -ResourceGroupName myresourcegroup |
  Select-Object -Property Name, SkuName, Location, ProvisioningState
```

```Output
Name            SkuName   Location  ProvisioningState
----            -------   --------  -----------------
mydatabricksws  standard  westus2   Succeeded
```

## Clean up resources

If the resources created in this quickstart aren't needed for another quickstart or tutorial, you
can delete them by running the following example.

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this quickstart exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myresourcegroup
```

To delete only the server created in this quickstart without deleting the resource group, use the
`Remove-AzDatabricksWorkspace` cmdlet.

```azurepowershell-interactive
Remove-AzDatabricksWorkspace -Name mydatabricksws -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Create a Spark cluster in Databricks](quickstart-create-databricks-workspace-portal.md#create-a-spark-cluster-in-databricks)
