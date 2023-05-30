---
title: Migrate a classic reserved IP address to a public IP address
titleSuffix: Azure Virtual Network
description: In this article, learn how to upgrade a classic deployment model reserved IP to an Azure Resource Manager public IP address.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 05/20/2021
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-arm-template
---

# Migrate a classic reserved IP address to a public IP address

To benefit from the new capabilities in Azure Resource Manager, you can migrate existing public static IP address, reserved IPs, from the classic deployment model to Azure Resource Manager.  The migrated public IP will be a basic SKU type. 

In this article, you'll learn how to upgrade a classic reserved IP to a basic public IP address.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* Your Azure subscription registered for migration. For more information, see [Migrate to Resource Manager with PowerShell](../../virtual-machines/migration-classic-resource-manager-ps.md).
* A classic deployment model reserved IP address.
* Azure PowerShell Service Management module installed for PowerShell. For more information, see [Installing the Azure PowerShell Service Management module](/powershell/azure/servicemanagement/install-azure-ps).
* Azure classic CLI installed for Azure CLI instructions. For more information, see [Install the Azure classic CLI](/cli/azure/install-classic-cli).

## Azure PowerShell Service Management module

In this section, you'll use the Azure PowerShell Service Management module to migrate a classic reserved IP to an Azure Resource Manager static public IP.

> [!NOTE]
> The reserved IP must be removed from any cloud service that the IP address is associated to.

```azurepowershell-interactive
$validate = Move-AzureReservedIP -ReservedIPName 'myReservedIP' -Validate
$validate

```

The previous command displays the result of the operation or any warnings and errors that block migration. If validation is successful, you can continue with the following steps to **Prepare** and **Commit** the migration:

```azurepowershell-interactive
Move-AzureReservedIP -ReservedIPName 'myReservedIP' -Prepare
Move-AzureReservedIP -ReservedIPName 'myReservedIP' -Commit
```
A new resource group in Azure Resource Manager is created using the name of the migrated reserved IP. In the preceding example, the resource group is **myReservedIP-Migrated**.

## Azure classic CLI

In this section, you'll use the Azure classic CLI to migrate a classic reserved IP to an Azure Resource Manager static public IP.

> [!NOTE]
> The reserved IP must be removed from any cloud service that the IP address is associated to.

```azurecli-interactive
azure network reserved-ip validate migration myReservedIP

```
The previous command displays any warnings and errors that block migration. If validation is successful, you can continue with the following steps to **Prepare** and **Commit** the migration:

```azurecli-interactive
azure network reserved-ip prepare-migration myReservedIP
azure network reserved-ip commit-migration myReservedIP
```
A new resource group in Azure Resource Manager is created using the name of the migrated reserved IP. In the preceding example, the resource group is **myReservedIP-Migrated**.

## Next steps


For more information on public IP addresses in Azure, see:

- [Public IP addresses in Azure](public-ip-addresses.md)
- [Create a public IP - Azure portal](./create-public-ip-portal.md)
