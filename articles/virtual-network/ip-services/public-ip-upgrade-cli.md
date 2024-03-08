---
title: 'Upgrade a public IP address - Azure CLI'
description: In this article, learn how to upgrade a basic SKU public IP address using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
---

# Upgrade a public IP address using the Azure CLI

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date.

Azure public IP addresses are created with a SKU, either Basic or Standard. The SKU determines their functionality including allocation method, feature support, and resources they can be associated with. 

In this article, you'll learn how to upgrade a static Basic SKU public IP address to Standard SKU using the Azure CLI.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A **static** basic SKU public IP address in your subscription. For more information, see [Create a basic public IP address using the Azure CLI](./create-public-ip-cli.md?tabs=create-public-ip-basic%2Ccreate-public-ip-zonal%2Crouting-preference#create-public-ip).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Upgrade public IP address

In this section, you'll use the Azure CLI and upgrade your static Basic SKU public IP to the Standard SKU.

In order to upgrade a public IP, it must not be associated with any resource. For more information, see [View, modify settings for, or delete a public IP address](./virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address) to learn how to disassociate a public IP.

>[!IMPORTANT]
>In the majority of cases, Public IPs upgraded from Basic to Standard SKU continue to have no [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).  This means they cannot be associated with an Azure resource that is either zone-redundant or tied to a pre-specified zone in regions where this is offered.  (In rare cases where the Basic Public IP has a specific zone assigned, it will retain this zone when upgraded to Standard.)

> [!NOTE]
> If you have multiple basic SKU public IP addresses attached to a virtual machine, it may be easier to use our [upgrade script](public-ip-upgrade-vm.md).

```azurecli-interactive
az network public-ip update \
    --resource-group myResourceGroup \
    --name myBasicPublicIP \
    --sku Standard

```
> [!NOTE]
> The basic public IP you are upgrading must have static assignment. You'll receive a warning that the IP can't be upgraded if you try to upgrade a dynamically allocated IP address. Change the IP address assignment to static before upgrading.

> [!WARNING]
> Upgrading a basic public IP to standard SKU can't be reversed. Public IPs upgraded from basic to standard SKU continue to have no guaranteed [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Verify upgrade

In this section, you'll verify the public IP address is now the standard SKU.

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroup \
  --name myBasicPublicIP \
  --query sku \
  --output tsv

```
The command should display **Standard**.

## Next steps

In this article, you upgraded a basic SKU public IP address to standard SKU.

For more information on public IP addresses in Azure, see:

- [Public IP addresses in Azure](public-ip-addresses.md)
- [Create a public IP address using the Azure CLI](./create-public-ip-cli.md)
