---
title: Custom DNS
titleSuffix: Azure SQL Managed Instance 
description: This topic describes configuration options for a custom DNS with an Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 07/17/2019
---
# Configuring a Custom DNS for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

An Azure SQL Managed Instance must be deployed within an Azure [virtual network (VNet)](../../virtual-network/virtual-networks-overview.md). There are a few scenarios (for example, db mail, linked servers to other SQL instances in your cloud or hybrid environment) that require private host names to be resolved from the SQL Managed Instance. In this case, you need to configure a custom DNS inside Azure. 

Because SQL Managed Instance uses the same DNS for its inner workings, configure the custom DNS server so that it can resolve public domain names.

> [!IMPORTANT]
> Always use a fully qualified domain name (FQDN) for the mail server, the SQL Server instance, and for other services, even if they're within your private DNS zone. For example, use `smtp.contoso.com` for your mail server because `smtp` won't resolve correctly. Creating a linked server or replication that references SQL VMs inside the same virtual network also requires an FQDN and a default DNS suffix. For example, `SQLVM.internal.cloudapp.net`. For more information, see [Name resolution that uses your own DNS server](https://docs.microsoft.com/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances#name-resolution-that-uses-your-own-dns-server).

> [!IMPORTANT]
> Updating virtual network DNS servers won't affect SQL Managed Instance immediately. Managed Instance DNS configuration is updated after the DHCP lease expires or after the platform upgrade, whichever occurs first. **Users are advised to set their virtual network DNS configuration before creating their first Managed Instance.**

## Next steps

- For an overview, see [What is a Managed Instance](sql-managed-instance-paas-overview.md)
- For a tutorial showing you how to create a new Managed Instance, see [Creating a Managed Instance](instance-create-quickstart.md).
- For information about configuring a VNet for a Managed Instance, see [VNet configuration for Managed Instances](connectivity-architecture-overview.md)
