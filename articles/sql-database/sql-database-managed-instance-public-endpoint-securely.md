---
title: Secure managed instance public endpoints - Azure SQL Database managed instance | Microsoft Docs
description: "Securely use public endpoints in Azure with a managed instance"
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: vanto, carlrab
manager: craigg
ms.date: 05/08/2019
---
# Use an Azure SQL Database managed instance securely with public endpoints

Azure SQL Database managed instances can provide user connectivity over [public endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). This article explains how to make this configuration more secure.

## Scenarios

A SQL Database managed instance provides a private endpoint to allow connectivity from inside its virtual network. The default option is to provide maximum isolation. However, there are scenarios where you need to provide a public endpoint connection:

- The managed instance must integrate with multi-tenant-only platform-as-a-service (PaaS) offerings.
- You need higher throughput of data exchange than is possible when you're using a VPN.
- Company policies prohibit PaaS inside corporate networks.

## Deploy a managed instance for public endpoint access

Although not mandatory, the common deployment model for a managed instance with public endpoint access is to create the instance in a dedicated isolated virtual network. In this configuration, the virtual network is used only for virtual cluster isolation. It doesn't matter if the managed instance's IP address space overlaps with a corporate network's IP address space.

## Secure data in motion

Managed instance data traffic is always encrypted if the client driver supports encryption. Data sent between the managed instance and other Azure virtual machines or Azure services never leaves Azure's backbone. If there's a connection between the managed instance and an on-premises network, we recommend you use Azure ExpressRoute with Microsoft peering. ExpressRoute helps you avoid moving data over the public internet. For managed instance private connectivity, only private peering can be used.

## Lock down inbound and outbound connectivity

The following diagram shows the recommended security configurations:

![Security configurations for locking down inbound and outbound connectivity](media/sql-database-managed-instance-public-endpoint-securely/managed-instance-vnet.png)

A managed instance has a [dedicated public endpoint address](sql-database-managed-instance-find-management-endpoint-ip-address.md). In the client-side outbound firewall and in the network security group rules,  set this public endpoint IP address to limit outbound connectivity.

To ensure traffic to the managed instance is coming from trusted sources, we recommend connecting from sources with well-known IP addresses. Use a network security group to limit access to the managed instance public endpoint on port 3342.

When clients need to initiate a connection from an on-premises network, make sure the originating address is translated to a well-known set of IP addresses. If you can't do so (for example, a mobile workforce being a typical scenario), we recommend you use [point-to-site VPN connections and a private endpoint](sql-database-managed-instance-configure-p2s.md).

If connections are started from Azure, we recommend that traffic come from a well-known assigned [virtual IP address](../virtual-network/virtual-networks-reserved-public-ip.md) (for example, a virtual machine). To make managing virtual IP (VIP) addresses easier, you might want to use [public IP address prefixes](../virtual-network/public-ip-address-prefix.md).

## Next steps

- Learn how to configure public endpoint for manage instances: [Configure public endpoint](sql-database-managed-instance-public-endpoint-configure.md)
