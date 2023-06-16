---
title: 'Verify a gateway connection'
titleSuffix: Azure VPN Gateway
description: Learn how to verify a virtual network VPN Gateway connection.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 06/13/2022
ms.author: cherylmc
---
# Verify a connection for VPN Gateway

This article shows you how to verify a VPN gateway connection for both the classic and the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md).

## Azure portal

[!INCLUDE [Azure portal](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

## Azure CLI

[!INCLUDE [CLI](../../includes/vpn-gateway-verify-connection-cli-rm-include.md)]

## Azure portal (classic)

[!INCLUDE [Azure portal](../../includes/vpn-gateway-verify-connection-azureportal-classic-include.md)]

## PowerShell (classic)

To verify your VPN gateway connection for the classic deployment model using PowerShell, install the latest versions of the Azure PowerShell cmdlets. Be sure to download and install the [Service Management](/powershell/azure/servicemanagement/install-azure-ps?#azure-service-management-cmdlets) module. Use 'Add-AzureAccount' to log in to the classic deployment model.

[!INCLUDE [Classic PowerShell](../../includes/vpn-gateway-verify-connection-ps-classic-include.md)]

## Next steps

* You can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/windows/quick-create-portal.md) for steps.
