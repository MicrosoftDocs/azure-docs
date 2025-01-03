---
title: Configure a host pool as a validation environment - Azure
description: How to configure a host pool as a validation environment to test service updates before they roll out to production.
author: dknappettmsft
ms.topic: how-to
ms.date: 12/03/2024
ms.author: daknappe
ms.custom: devx-track-azurecli, docs_inherited
---

# Configure a host pool as a validation environment

Validation host pools let you monitor service updates before the service applies them to your standard or non-validation environment. Without a validation host pool, you may not discover changes that introduce errors, which could result in downtime for users in your standard environment. We highly recommend you create a validation host pool where service updates are applied first.

To ensure your apps work with the latest updates, the validation host pool should be as similar to host pools in your non-validation environment as possible. Users should connect as frequently to the validation host pool as they do to the standard host pool. If you have automated testing on your host pool, you should include automated testing on the validation host pool.

This article shows you how to configure a host pool as a validation environment using the Azure portal, Azure PowerShell, or Azure CLI.

> [!NOTE]
> - We recommend that you leave the validation host pool in place to test all future updates. Validation host pools should only be used for testing, and not in production environments.
>
> - To keep up to date with the latest updates, see [What's new in the Azure Virtual Desktop Agent](whats-new-agent.md).

## Prerequisites

Before you begin, make sure you have the following:

- An Azure Virtual Desktop host pool that you want to configure as a validation environment.

- As a minimum, the Azure account you use must have the [Desktop Virtualization Host Pool Contributor role](rbac.md#desktop-virtualization-host-pool-contributor) built-in role-based access control (RBAC) role assigned on the host pool.

## Define your host pool as a validation environment

Select the relevant tab.

#### [Azure portal](#tab/azure-portal)

To use the Azure portal to configure your validation host pool:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Virtual Desktop**.

1. In the Azure Virtual Desktop page, select **Host pools**.

1. Select the name of the host pool you want to edit.

1. Select **Properties**.

1. In the validation environment field, select **Yes** to enable the validation environment.

1. Select **Save** to apply the new settings.

#### [Azure PowerShell](#tab/azure-powershell)

If you haven't already done so, follow the instructions in [Set up the Azure Virtual Desktop PowerShell module](powershell-module.md) and sign in to Azure.

Run the following PowerShell cmdlets to define the new host pool as a validation host pool. Replace the values in brackets with the values relevant to your session:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -ValidationEnvironment:$true
```

Run the following PowerShell cmdlet to confirm that the validation property has been set. Replace the values in brackets with the values relevant to your session.

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | Format-List
```

The results from the cmdlet should look similar to this output:

```powershell
    HostPoolName        : hostpoolname
    FriendlyName        :
    Description         :
    Persistent          : False
    CustomRdpProperty   : use multimon:i:0;
    MaxSessionLimit     : 10
    LoadBalancerType    : BreadthFirst
    ValidationEnvironment : True
```

#### [Azure CLI](#tab/azure-cli)

If you haven't already done so, prepare your environment for the Azure CLI and sign in.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To define the new host pool as a validation host pool, use the [az desktopvirtualization hostpool update](/cli/azure/desktopvirtualization#az-desktopvirtualization-hostpool-update) command:

```azurecli
az desktopvirtualization hostpool update --name "MyHostPool" \
    --resource-group "MyResourceGroup" \
    --validation-environment true
```

Use the following command to confirm that the validation property has been set.

```azurecli
az desktopvirtualization hostpool show --name "MyHostPool" \
    --resource-group "MyResourceGroup" 
```
---
