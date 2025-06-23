---
title: Upgrade a VPN Gateway SKU
titleSuffix: Azure VPN Gateway
description: Learn how to upgrade a VPN Gateway SKU in Azure.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/23/2025
ms.author: cherylmc

#customer intent: As an Azure network engineer, I want to understand the workflow for upgrading a VPN Gateway SKU so that I can plan properly and minimize downtime.

---
# Upgrade a VPN Gateway SKU

[!INCLUDE [azure-vpn-gateway](../includes/azure-vpn-gateway.md)]

This article helps you upgrade a VPN Gateway virtual network gateway SKU. Upgrading a gateway SKU is a relatively fast process. When you upgrade a SKU, you incur very little downtime (approximately 45 minutes). You can upgrade a SKU quickly and easily in the Azure portal, PowerShell or Azure CLI. When you upgrade a SKU, the public IP address assigned to your gateway SKU doesn't change and you don't need to reconfigure your VPN device or your P2S clients. However, there are certain limitations and restrictions for upgrading and not all SKUs are available to upgrade, for example, Basic and legacy SKUs.

## Considerations

There are many things to consider when upgrading to a new gateway SKU. The following table helps you understand the required method to move from one SKU to another.

| Starting SKU | Target SKU | Eligible for SKU upgrade| Delete/Recreate only |
| --- | --- |--- | --- |
| Basic SKU | Any other SKU | No | Yes  |
| Generation 1 SKU | Generation 1 SKU | Yes| No |
| Generation 1 SKU | Generation 1 AZ SKU | No |Yes |
| Generation 1 AZ SKU | Generation 1 AZ SKU |Yes | No |
| Generation 1 AZ SKU | Generation 2 AZ SKU | No | Yes |
| Generation 2 SKU | Generation 2 SKU | Yes | No |
| Generation 2 SKU | Generation 2 AZ SKU | No |Yes |
| Generation 2 AZ SKU | Generation 2 AZ SKU | Yes | No |

For gateway SKU throughput and connection limits, see [About gateway SKUs](about-gateway-skus.md#benchmark).

## Limitations and restrictions

* You can't upgrade a Basic SKU to a new SKU. You must delete the gateway, and then create a new one.
* You can't downgrade a SKU without deleting the gateway and creating a new one.
* Legacy gateway SKUs (Standard and High Performance) can't be upgraded to the new SKU families. You must delete the gateway and create a new one. For more information about working with legacy gateway SKUS, see [VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md)

## Upgrade a gateway SKU using the Azure portal

Upgrading a gateway SKU takes about 45 minutes to complete.

1. Go to the **Configuration** page for your virtual network gateway.
1. On the right side of the page, click the dropdown arrow to show a list of available SKUs. The options listed are based on the starting SKU and SKU Generation. Select the SKU from the dropdown.
1. **Save** your changes to begin the SKU upgrade. It takes about 45 minutes for the gateway SKU upgrade to complete.

## Workflow for SKUs that can't be upgraded

For SKUs that can't be directly upgraded (Basic and legacy gateway SKUs), you must delete the existing gateway and create a new one. This process incurs downtime. The public IP address assigned to your gateway SKU changes. You must also reconfigure your VPN device and P2S clients.

The high level workflow is:

1. Remove any connections to the virtual network gateway.
1. Delete the old VPN gateway.
1. Create the new VPN gateway.
1. Update your on-premises VPN devices with the new VPN gateway IP address (for site-to-site connections).
1. Update the gateway IP address value for any VNet-to-VNet local network gateways that connect to this gateway.
1. Download new client VPN configuration packages for point-to-site clients connecting to the virtual network through this VPN gateway.
1. Recreate the connections to the virtual network gateway.

## Next steps

For more information about SKUs, see [About gateway SKUs](about-gateway-skus.md).