---
title: Upgrade a public IP address - Azure CLI
description: In this article, learn how to upgrade a basic SKU public IP address using the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 05/20/2021
ms.custom: template-how-to , devx-track-azurecli 
ms.devlang: azurecli
---

# Upgrade a public IP address using the Azure CLI

Azure public IP addresses are created with a SKU, either Basic or Standard. The SKU determines their functionality including allocation method, feature support, and resources they can be associated with. 

In this article, you'll learn how to upgrade a static Basic SKU public IP address to Standard SKU using the Azure CLI.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A **static** basic SKU public IP address in your subscription. For more information, see [Create public IP address - Azure portal](./create-public-ip-portal.md#create-a-basic-sku-public-ip-address).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Upgrade public IP address

In this section, you'll use the Azure CLI and upgrade your static Basic SKU public IP to the Standard SKU.

In order to upgrade a public IP, it must not be associated with any resource (see [this page](/azure/virtual-network/virtual-network-public-ip-address#view-modify-settings-for-or-delete-a-public-ip-address) for more information about how to disassociate public IPs).

>[!IMPORTANT]
>Public IPs upgraded from Basic to Standard SKU continue to have no [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).  This means they cannot be associated with an Azure resource that is either zone-redundant or tied to a pre-specified zone in regions where this is offered.

```azurecli-interactive
az network public-ip update \
    --resource-group myResourceGroup \
    --name myBasicPublicIP \
    --sku Standard

```
> [!NOTE]
> The basic public IP you are upgrading must have the static allocation type. You'll receive a warning that the IP can't be upgraded if you try to upgrade a dynamically allocated IP address.

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
- [Create a public IP - Azure portal](./create-public-ip-portal.md)