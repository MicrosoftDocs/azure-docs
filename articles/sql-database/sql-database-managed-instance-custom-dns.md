---
title: Azure SQL Database Managed Instance Custom DNS | Microsoft Docs
description: This topic describes configuration options for a custom DNS with an Azure SQL Database Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 07/17/2019
---
# Configuring a Custom DNS for Azure SQL Database Managed Instance

An Azure SQL Database Managed Instance must be deployed within an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). There are a few scenarios (for example, db mail, linked servers to other SQL instances in your cloud or hybrid environment) that require private host names to be resolved from the Managed Instance. In this case, you need to configure a custom DNS inside Azure. 

Since Managed Instance uses the same DNS for its inner workings, you need to configure the custom DNS server so that it can resolve public domain names.

   > [!IMPORTANT]
   > Always use fully-qualified domain names (FQDN) for the mail servers, SQL Servers, and other services even if they are within your private DNS zone. For example use `smtp.contoso.com` for mail server because simple `smtp` will not be properly resolved.

   > [!IMPORTANT]
   > Updating virtual network DNS servers would not affect Managed Instance immediately. Managed Instance DNS configuration will be updated after DHCP lease expires or after the platform upgarade, whatever comes first. **Users are advised to set their virtual network DNS configuration before creating their first Managed Instance.**

## Next steps

- For an overview, see [What is a Managed Instance](sql-database-managed-instance.md)
- For a tutorial showing you how to create a new Managed Instance, see [Creating a Managed Instance](sql-database-managed-instance-get-started.md).
- For information about configuring a VNet for a Managed Instance, see [VNet configuration for Managed Instances](sql-database-managed-instance-connectivity-architecture.md)
