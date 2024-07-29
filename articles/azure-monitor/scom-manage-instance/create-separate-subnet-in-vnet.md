---
ms.assetid: 
title: Create a separate subnet in a VNet for SCOM Managed Instance
description: This article describes how to create a separate subnet in a virtual network for Azure Monitor SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Create a separate subnet in a virtual network for Azure Monitor SCOM Managed Instance

This article describes how to create a separate subnet in a virtual network for a managed instance of Azure Monitor SCOM Managed Instance and enable Azure NAT Gateway on a SCOM Managed Instance subnet.

>[!NOTE]
> To learn about the SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md#architecture).

## Create a separate subnet in a virtual network

For more information on how to create a virtual network, see [Quickstart: Use the Azure portal to create a virtual network](/azure/virtual-network/quick-create-portal).

After a SCOM Managed Instance subnet is created, we need a NAT gateway for outbound internet access from the SCOM Managed Instance subnet. Edit the subnet to add a NAT gateway. In Azure, add a NAT gateway to the subnet where the SCOM managed instance is created. A NAT gateway is needed for outbound internet access from the SCOM Managed Instance subnet. For more information, see [What is Virtual Network NAT?](/azure/virtual-network/nat-gateway/nat-overview).

>[!NOTE]
>The SCOM Managed Instance requires outbound Internet access for communication with dependent endpoints. We recommend to use a NAT Gateway for this purpose. However, if there is an already established outbound internet access through a firewall, you can skip the creation of a NAT Gateway.

To create a NAT gateway for a SCOM Managed Instance subnet, follow these steps:

1. Create a NAT gateway in the same region where the virtual network is present.
1. Create a NAT gateway in the same subscription that you use for SCOM Managed Instance.
1. Create a public IP.

   :::image type="NAT gateway" source="media/create-separate-subnet-in-vnet/nat-gateway-inline.png" alt-text="Screenshot that shows public IP information for a NAT gateway." lightbox="media/create-separate-subnet-in-vnet/nat-gateway-expanded.png":::

1. In the subnet section, select a virtual network and subnet for SCOM Managed Instance.

## Next steps

- [Create SQL Managed Instance](create-sql-managed-instance.md)