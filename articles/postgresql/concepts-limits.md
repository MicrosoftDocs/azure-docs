---
title: Limitations in Azure Database for PostgreSQL  | Microsoft Docs
description: Describes limitations in Azure Database for PostgreSQL.
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.topic: article
ms.date: 06/01/2017
---
# Limitations in Azure Database for PostgreSQL
The Azure Database for PostgreSQL service is in public preview. The following sections describe capacity and functional limits in the database service.

## Service Tier Maximums
Azure Database for PostgreSQL has multiple service tiers you can choose from when creating a server. For more information, see [Understand what’s available in each service tier](concepts-service-tiers.md).  

There is a maximum number of connections, compute units, and storage in each service tier during the service preview, as follows: 

|                            |                   |
| :------------------------- | :---------------- |
| **Max connections**        |                   |
| Basic 50 Compute Units     | 50 connections    |
| Basic 100 Compute Units    | 100 connections   |
| Standard 100 Compute Units | 200 connections   |
| Standard 200 Compute Units | 300 connections   |
| Standard 400 Compute Units | 400 connections   |
| Standard 800 Compute Units | 500 connections   |
| **Max Compute Units**      |                   |
| Basic service tier         | 100 Compute Units |
| Standard service tier      | 800 Compute Units |
| **Max storage**            |                   |
| Basic service tier         | 1 TB              |
| Standard service tier      | 1 TB              |

When too many connections are reached, you may receive the following error:
> FATAL:  sorry, too many clients already

## Preview functional limitations
### Scale operations
1.	Dynamic scaling of servers across service tiers is currently not supported. That is, switching between Basic and Standard service tiers.
2.	Dynamic on-demand increase of storage on pre-created server is currently not supported.
3.	Decreasing server storage size is not supported.

### Server version upgrades
- Automated migration between major database engine versions is currently not supported.

### Subscription management
- Dynamically moving pre-created servers across subscription and resource group is currently not supported.

### Point-in-time-restore
1.	Restoring to different service tier and/or Compute Units and Storage size is not allowed.
2.	Restoring a dropped server is not supported.

## Next steps
- Understand [What’s available in each pricing tier](concepts-service-tiers.md)
- Understand [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [How To Back up and Restore a server in Azure Database for PostgreSQL using the Azure portal](howto-restore-server-portal.md)
