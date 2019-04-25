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
ms.date: 04/16/2019
---
# Use an Azure SQL Database managed instance securely with public endpoints

An Azure SQL Database managed instance can be enabled to provide user connectivity over [public endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). This article provides guidance how to make this configuration more secure.

## Scenarios

A managed instance provides a private endpoint to enable connectivity from inside its virtual network. The default option is to provide maximum isolation. However, there are scenarios where a public endpoint connection is needed:

- Integration with multi-tenant-only PaaS offerings.
- Higher throughput of data exchange than using VPN.
- Company policies prohibit PaaS inside corporate networks.

## Deploy a managed instance for public endpoint access

Although not mandatory, the common deployment model for a managed instance with public endpoint access is to create the instance in a dedicated isolated virtual network. In this configuration, the virtual network is used just for virtual cluster isolation. It's not relevant if the managed instance IP address space overlaps with a corporate network IP address space.

## Secure data in motion

Managed instance data traffic is always encrypted if the client driver supports encryption. Data between the managed instance and other Azure virtual machines or Azure services never leaves Azure's backbone. If there's a managed instance to an on-premises network connection, it's recommended to use Express Route with Microsoft peering. Express Route will help avoid moving data over the public internet. For managed instance private connectivity, only private peering can be used.

## Lock down inbound and outbound connectivity

The following diagram shows the recommended security configurations:

![Security configurations for locking down inbound and outbound connectivity](media/sql-database-managed-instance-public-endpoint-securely/managed-instance-vnet.png)

A managed instance has a [dedicated public endpoint address](sql-database-managed-instance-find-management-endpoint-ip-address.md). This IP address should be set in the client-side outbound firewall and Network Security Group rules to limit outbound connectivity.

To ensure traffic to the managed instance is coming from trusted sources, we recommend connecting from sources with well-known IP addresses. Limit the access to the managed instance public endpoint on port 3342 by using a Network Security Group.

When clients need to initiate a connection from an on-premises network, make sure the originating address is translated to a well-known set of IP addresses. If you can't do so (for example, a mobile workforce being a typical scenario), we recommend you use [point-to-site VPN connections and a private endpoint](sql-database-managed-instance-configure-p2s.md).

If connections are started from Azure, we recommend that traffic come from well-known assigned [virtual IP address](../virtual-network/virtual-networks-reserved-public-ip.md) (for example, a virtual machine). To make managing virtual IP (VIP) addresses easier, you might want to use [public IP address prefixes](../virtual-network/public-ip-address-prefix.md).