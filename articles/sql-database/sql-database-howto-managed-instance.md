---
title: How to configure an Azure SQL Database managed instance | Microsoft Docs
description: Learn how to configure and manage Azure SQL Database managed instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlr
manager: craigg
ms.date: 04/16/2019
---
# How to use a managed instance in Azure SQL Database

In this article you can find various guides, scripts, and explanation that can help you to manage and configure your managed instance.

## Migration

- [Migrate to a managed instance](sql-database-managed-instance-migrate.md) – Learn about the recommended migration process and tools for migration to a managed instance.

- [Migrate TDE cert to a managed instance](sql-database-managed-instance-migrate-tde-certificate.md) – If your SQL Server database is protected with transparent data encryption (TDE), you would need to migrate certificate that a managed instance can use to decrypt the backup that you want to restore in Azure.

## Network configuration

- [Determine size of a managed instance subnet](sql-database-managed-instance-determine-size-vnet-subnet.md) – Managed instance is placed in dedicates subnet that cannot be resized once you add the resources inside. Therefore, you would need to calculate what IP range of addresses would be required for the subnet depending on the number and types of instances that you want to deploy in the subnet.
- [Create new VNet and subnet for a managed instance](sql-database-managed-instance-create-vnet-subnet.md) – Azure VNet and subnet where you want to deploy your managed instances must be configured according to the [network requirements described here](sql-database-managed-instance-connectivity-architecture.md#network-requirements). In this guide you can find the easiest way to create your new VNet and subnet properly configured for managed instances.
- [Configure existing VNet and subnet for a managed instance](sql-database-managed-instance-configure-vnet-subnet.md) – if you want to configure your existing VNet and subnet to deploy managed instances inside, here you can find the script that checks the [network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements) and make configures your subnet according to the requirements.
- [Configure custom DNS](sql-database-managed-instance-custom-dns.md) – you need to configure custom DNS if you want to access external resources on the custom domains from your managed instance via linked server of db mail profiles.
- [Sync network configuration](sql-database-managed-instance-sync-network-configuration.md) - It might happen that although you [integrated your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md), you can&#39;t establish connection to a managed instance. One thing you can try is to refresh networking configuration for your service plan.
- [Find management endpoint IP address](sql-database-managed-instance-find-management-endpoint-ip-address.md) – Managed instance uses public endpoint for management-purposes. You can determine IP address of the management endpoint using the script described here.
- [Verify built-in firewall protection](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md) – Managed instance is protected with built-in firewall that allows the traffic only on necessary ports. You can check and verify the built-in firewall rules using the script described in this guide.
- [Connect applications](sql-database-managed-instance-connect-app.md) – Managed instance is placed in your own private Azure VNet with private IP address. Learn about different patterns for connecting the applications to your managed instance.

## Feature configuration

- [Transactional replication](replication-with-sql-database-managed-instance.md) enables you to replicate your data between managed instances, or from on-premises SQL Server to a managed instance, and vice versa. Find more information how to use and configure transaction replication in this guide.
- [Configure threat detection](sql-database-managed-instance-threat-detection.md) – [threat detection](sql-database-threat-detection-overview.md) is a built-in Azure SQL Database feature that detects various potential attacks such as SQL Injection or access from suspicious locations. In this guide you can learn how to enable and configure [threat detection](sql-database-threat-detection-overview.md) for a managed instance.

## Next steps

- Learn more about [How-to guides for single databases](sql-database-howto-single-database.md)