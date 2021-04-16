---
title: 'Quickstart: Create an Azure Dedicated HSM with Azure PowerShell'
description: Create an Azure Dedicated HSM with Azure PowerShell
services: dedicated-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.date: 11/13/2020
ms.topic: quickstart
ms.service: key-vault
ms.devlang: azurepowershell
ms.custom:
  - devx-track-azurepowershell
  - mode-api
---

# Quickstart: Create an Azure Dedicated HSM with Azure PowerShell

This article describes how you can create an Azure Dedicated HSM using the
[Az.DedicatedHsm](/powershell/module/az.dedicatedhsm) PowerShell module.

## Requirements

* If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

  > [!IMPORTANT]
  > While the **Az.DedicatedHsm** PowerShell module is in preview, you must install it separately
  > using the `Install-Module` cmdlet. After this PowerShell module becomes generally available, it
  > will be part of future Az PowerShell module releases and available by default from within Azure
  > Cloud Shell.

  ```azurepowershell-interactive
  Install-Module -Name Az.DedicatedHsm
  ```

* If you have multiple Azure subscriptions, choose the appropriate subscription in which the
  resources should be billed. Select a specific subscription using the
  [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

  ```azurepowershell-interactive
  Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
  ```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/management/overview.md)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as
a group.

The following example creates a resource group with the specified name and in the specified location.

```azurepowershell-interactive
New-AzResourceGroup -Name myRG -Location westus
```

## Create a dedicated HSM

To create a dedicated HSM, you use the
[New-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/new-azdedicatedhsm) cmdlet. The following
example creates a dedicated HSM in the specified subscription.

```azurepowershell-interactive
$Params = @{
  Name  = 'MyHSM'
  ResourceGroupName = 'myRG'
  Location = 'westus'
  Sku = 'SafeNet Luna Network HSM A790'
  StampId = 'stamp1'
  SubnetId = '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myrg/providers/Microsoft.Network/virtualNetworks/myhsm-vnet/subnets/hsmsubnet'
  NetworkInterface = @{PrivateIPAddress = '10.2.1.120'}
}
New-AzDedicatedHsm @Params
```

```Output
Name       Provisioning State SKU                           Location
----       ------------------ ---                           --------
myhsm      Succeeded          SafeNet Luna Network HSM A790 westus
```

## Get a dedicated HSM

To retrieve information about an existing dedicated HSM, you use the
[Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet. The following
example gets the specified dedicated HSM.

```azurepowershell-interactive
Get-AzDedicatedHsm -Name MyHSM -ResourceGroupName myRG
```

```Output
Name       Provisioning State SKU                           Location
----       ------------------ ---                           --------
myhsm      Succeeded          SafeNet Luna Network HSM A790 westus
```

## Update a dedicated HSM

To update a dedicated HSM, you use the
[Update-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/update-azdedicatedhsm) cmdlet. The
following example updates a dedicated HSM in the specified subscription.

```azurepowershell-interactive
Update-AzDedicatedHsm -Name MyHSM -ResourceGroupName myRG -Tag @{'key1' = '1'; 'key2' = 2; 'key3' = 3}
```

```Output
PS C:\>Update-AzDedicatedHsm -Name  hsm-n7wfxi -ResourceGroupName dedicatedhsm-rg-n359cz -Tag @{'key1' = '1';
'key2' = 2; 'key3' = 3}

Name       Provisioning State SKU                           Location
----       ------------------ ---                           --------
myhsm      Succeeded          SafeNet Luna Network HSM A790 westus
```

## Clean up resources

If the resources created in this article aren't needed, you can delete them by running the following
examples.

### Remove a dedicated HSM

To remove a dedicated HSM, you use the
[Remove-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/remove-azdedicatedhsm) cmdlet. The
following example deletes the specified dedicated HSM.

```azurepowershell-interactive
Remove-AzDedicatedHsm -Name hsm-7t2xaf -ResourceGroupName lucas-manual-test
```

### Delete the resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myRG
```

## Next steps

Learn more about [Azure Dedicated HSM](overview.md).
