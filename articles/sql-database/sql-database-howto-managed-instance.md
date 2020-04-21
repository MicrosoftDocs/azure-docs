---
title: Azure SQL Managed Instance content reference
titleSuffix: Azure SQL  Managed Instance
description: A reference guide of content that teaches you how to configure and manage your Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlr
ms.date: 04/16/2019
---
# Azure SQL Managed Instance content reference

In this article you can find various guides, scripts, and explanation that can help you to manage and configure your Azure SQL Managed Instance.

## Migration

- [Migrate to an Azure SQL Managed Instance](sql-database-managed-instance-migrate.md) – Learn about the recommended migration process and tools for migration to an Azure SQL Managed Instance.

- [Migrate TDE cert to an Azure SQL Managed Instance](sql-database-managed-instance-migrate-tde-certificate.md) – If your SQL Server database is protected with transparent data encryption (TDE), you would need to migrate certificate that an Azure SQL Managed Instance can use to decrypt the backup that you want to restore in Azure.

## Network configuration

- [Determine subnet size ](sql-database-managed-instance-determine-size-vnet-subnet.md)
  Azure SQL Managed Instance is placed in dedicated subnet that cannot be resized once you add the resources inside. Therefore, you need to calculate what IP range of addresses is required for the subnet depending on the number and types of instances that you want to deploy to the subnet.
- [Create new VNet and subnet](sql-database-managed-instance-create-vnet-subnet.md)
  Azure VNet and subnet where you want to deploy your Azure SQL Managed Instances must be configured according to the [network requirements described here](sql-database-managed-instance-connectivity-architecture.md#network-requirements). In this guide you can find the easiest way to create your new VNet and subnet properly configured for Azure SQL Managed Instances.
- [Configure existing VNet and subnet ](sql-database-managed-instance-configure-vnet-subnet.md) – 
  if you want to configure your existing VNet and subnet to deploy Azure SQL  Managed Instances inside, here you can find the script that checks the [network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements) and make configures your subnet according to the requirements.
- [Configure custom DNS](sql-database-managed-instance-custom-dns.md) – you need to configure custom DNS if you want to access external resources on the custom domains from your Azure SQL Managed Instance via linked server of db mail profiles.
- [Sync network configuration](sql-database-managed-instance-sync-network-configuration.md) - It might happen that although you [integrated your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md), you can&#39;t establish connection to an Azure SQL Managed Instance. One thing you can try is to refresh networking configuration for your service plan.
- [Find management endpoint IP address](sql-database-managed-instance-find-management-endpoint-ip-address.md) – Azure SQL Managed Instance uses public endpoint for management-purposes. You can determine IP address of the management endpoint using the script described here.
- [Verify built-in firewall protection](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md) – Azure SQL Managed Instance is protected with built-in firewall that allows the traffic only on necessary ports. You can check and verify the built-in firewall rules using the script described in this guide.
- [Connect applications](sql-database-managed-instance-connect-app.md) – Azure SQL Managed Instance is placed in your own private Azure VNet with private IP address. Learn about different patterns for connecting the applications to your Azure SQL Managed Instance.

## Feature configuration

- [Transactional replication](replication-with-sql-database-managed-instance.md) enables you to replicate your data between Azure SQL Managed Instances, or from on-premises SQL Server to an Azure SQL Managed Instance, and vice versa. Find more information how to use and configure transaction replication in this guide.
- [Configure threat detection](sql-database-managed-instance-threat-detection.md) – [threat detection](sql-database-threat-detection-overview.md) is a built-in Azure SQL Database feature that detects various potential attacks such as SQL Injection or access from suspicious locations. In this guide you can learn how to enable and configure [threat detection](sql-database-threat-detection-overview.md) for an Azure SQL Managed Instance.
- [Creating alerts](sql-database-managed-instance-alerts.md) enables you to setup alerts on monitored metrics such are CPU utilization, storage space consumption, IOPS and others for Azure SQL Managed Instance. In this guide you will learn how to enable and configure alerts for Azure SQL Managed Instance.

## Next steps

- Learn more about [How-to guides for single databases](sql-database-howto-single-database.md)
