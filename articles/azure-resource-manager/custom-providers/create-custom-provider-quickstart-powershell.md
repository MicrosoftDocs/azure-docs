---
title: Create an Azure custom resource provider with Azure PowerShell
description: Describes how to create an Azure custom resource provider with Azure PowerShell
author: MSEvanhi
ms.author: evanhi
ms.date: 09/22/2020
ms.topic: quickstart
ms.devlang: azurepowershell
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure custom resource provider with Azure PowerShell

In this quickstart, you learn how to create your own Azure custom resource provider using the
[Az.CustomProviders](/powershell/module/az.customproviders) PowerShell module.

> [!CAUTION]
> Azure Custom Resource Providers is currently in public preview. This preview version is provided without a
> service level agreement. It's not recommended for production workloads. Certain features might not
> be supported or might have constrained capabilities. For more information, see
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Requirements

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. For more information
about installing the Az PowerShell module, see
[Install Azure PowerShell](/powershell/azure/install-azure-powershell). If you choose to use Cloud Shell, see
[Overview of Azure Cloud Shell](../../cloud-shell/overview.md) for
more information.

> [!IMPORTANT]
> While the **Az.CustomProviders** PowerShell module is in preview, you must install it separately using
> the `Install-Module` cmdlet. Once this PowerShell module becomes generally available, it becomes
> part of future Az PowerShell module releases and available natively from within Azure Cloud Shell.

```azurepowershell-interactive
Install-Module -Name Az.CustomProviders
```

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as
a group.

The following example creates a resource group with the specified name and in the specified location.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location westus2
```

## Create a custom resource provider

To create or update a custom resource provider, you use the
[New-AzCustomProvider](/powershell/module/az.customproviders/new-azcustomprovider) cmdlet as shown
in the following example.

```azurepowershell-interactive
New-AzCustomProvider -ResourceGroupName myResourceGroup -Name Namespace.Type -Location westus2 -ResourceType @{Name='CustomRoute1'; Endpoint='https://www.contoso.com/'}
```

## Get the custom resource provider manifest

To retrieve information about the custom resource provider manifest, you use the
[Get-AzCustomProvider](/powershell/module/az.customproviders/get-azcustomprovider) cmdlet as shown
in the following example.

```azurepowershell-interactive
Get-AzCustomProvider -ResourceGroupName myResourceGroup -Name Namespace.Type | Format-List
```

## Create an association

To create or update an association, you use the
[New-AzCustomProviderAssociation](/powershell/module/az.customproviders/new-azcustomproviderassociation)
cmdlet as shown in the following example.

```azurepowershell-interactive
$provider = Get-AzCustomProvider -ResourceGroupName myResourceGroup -Name Namespace.Type
New-AzCustomProviderAssociation -Scope $resourceId -Name MyAssoc -TargetResourceId $provider.Id
```

## Get an association

To retrieve information about an association, you use the
[Get-AzCustomProviderAssociation](/powershell/module/az.customproviders/get-azcustomproviderassociation)
cmdlet as shown in the following example.

```azurepowershell-interactive
Get-AzCustomProviderAssociation -Scope $resourceId -Name MyAssoc
```

## Clean up resources

If the resources created in this article aren't needed, you can delete them by running the following
examples.

### Delete an association

To remove an association, you use the
[Remove-AzCustomProviderAssociation](/powershell/module/az.customproviders/remove-azcustomproviderassociation)
cmdlet. The following example deletes an association.

```azurepowershell
Remove-AzCustomProviderAssociation -Scope $id -Name Namespace.Type
```

### Delete a custom resource provider

To remove a custom resource provider, you use the
[Remove-AzCustomProvider](/powershell/module/az.customproviders/remove-azcustomprovider)
cmdlet. The following example deletes a custom resource provider.

```azurepowershell-interactive
Remove-AzCustomProvider -ResourceGroupName myResourceGroup -Name Namespace.Type
```

### Delete the resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

## Next steps

Learn more about [Azure Custom Resource Providers](overview.md).
