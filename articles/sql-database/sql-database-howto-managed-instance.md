---
title: Azure SQL Managed Instance content reference
titleSuffix: Azure SQL Managed Instance
description: A reference guide of content that teaches you how to configure and manage your Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlr
ms.date: 04/16/2019
---
# Azure SQL Managed Instance content reference

In this article you can find a reference to various guides, scripts, and explanations that help you manage and configure your Azure SQL Managed Instance.

## Migration

- [Migrate to an Azure SQL Managed Instance](sql-database-managed-instance-migrate.md) – Learn about the recommended migration process and tools for migration to an Azure SQL Managed Instance.

- [Migrate TDE cert to an Azure SQL Managed Instance](sql-database-managed-instance-migrate-tde-certificate.md) – If your SQL Server database is protected with transparent data encryption (TDE), you would need to migrate the certificate that a SQL Managed Instance can use to decrypt the backup that you want to restore in Azure.

## Network configuration

- [Determine subnet size ](sql-database-managed-instance-determine-size-vnet-subnet.md)
  Since the subnet cannot be resized after the SQL Managed Instance is deployed, you need to calculate what IP range of addresses is required for number and types of SQL Managed Instances you plan to deploy to the subnet. 
- [Create new VNet and subnet](sql-database-managed-instance-create-vnet-subnet.md)
  Configure the virtual network and subnet according to the [network requirements described here](sql-database-managed-instance-connectivity-architecture.md#network-requirements) 
- [Configure existing VNet and subnet ](sql-database-managed-instance-configure-vnet-subnet.md)
  Verify network requirements and configure your existing virtual network and subnet to deploy the SQL Managed Instance. 
- [Configure custom DNS](sql-database-managed-instance-custom-dns.md)
  Configure custom DNS to grant external resource access to  custom domains from your SQL Managed Instance via a linked server of db mail profiles. 
- [Sync network configuration](sql-database-managed-instance-sync-network-configuration.md)
  Refresh the networking configuration plan if you can't establish a connection after [integrating your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md)
- [Find management endpoint IP address](sql-database-managed-instance-find-management-endpoint-ip-address.md) 
  Determine the public endpoint the SQL Managed Instance is using for management purposes. 
- [Verify built-in firewall protection](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md)
  Verify the SQL Managed Instance allows traffic only on necessary ports, and other built-in firewall rules. 
- [Connect applications](sql-database-managed-instance-connect-app.md) 
  Learn about different patterns for connecting the applications to your SQL Managed Instance.

## Feature configuration

- [Transactional replication](replication-with-sql-database-managed-instance.md) enables you to replicate your data between Azure SQL Managed Instances, or from on-premises SQL Server to a SQL Managed Instance, and vice versa.
- [Configure threat detection](sql-database-managed-instance-threat-detection.md) – [threat detection](sql-database-threat-detection-overview.md) is a built-in Azure SQL Managed Instance feature that detects various potential attacks such as SQL Injection or access from suspicious locations. 
- [Creating alerts](sql-database-managed-instance-alerts.md) enables you to setup alerts on monitored metrics such are CPU utilization, storage space consumption, IOPS and others for SQL Managed Instance. 

## Next steps

Get started by [deploying your SQL Managed Instance](sql-database-managed-instance-get-started.md)
