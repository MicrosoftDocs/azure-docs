---
title: Limitations in Azure Database for PostgreSQL
description: This article describes limitations in Azure Database for PostgreSQL, such as number of connection and storage engine options.
services: postgresql
author: kamathsun
ms.author: sukamat
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 02/28/2018
---
# Limitations in Azure Database for PostgreSQL
The Azure Database for PostgreSQL service is in public preview. The following sections describe capacity and functional limits in the database service.

## Pricing Tier Maximums
Azure Database for PostgreSQL has multiple pricing tiers you can choose from when creating a server. For more information, see [Pricing tiers in Azure Database for PostgreSQL](concepts-pricing-tiers.md).  

There is a maximum number of connections, compute units, and storage in each pricing tier, as follows: 

|Pricing Tier| Compute Generation| vCore(s)| Max Connections |
|---|---|---|---|
|Basic| Gen 4| 1| 50 |
|Basic| Gen 4| 2| 100 |
|Basic| Gen 5| 1| 50 |
|Basic| Gen 5| 2| 100 |
|General Purpose| Gen 4| 2| 150|
|General Purpose| Gen 4| 4| 250|
|General Purpose| Gen 4| 8| 480|
|General Purpose| Gen 4| 16| 950|
|General Purpose| Gen 4| 32| 1500|
|General Purpose| Gen 5| 2| 150|
|General Purpose| Gen 5| 4| 250|
|General Purpose| Gen 5| 8| 480|
|General Purpose| Gen 5| 16| 950|
|General Purpose| Gen 5| 32| 1500|
|Memory Optimized| Gen 5| 2| 150|
|Memory Optimized| Gen 5| 4| 250|
|Memory Optimized| Gen 5| 8| 480|
|Memory Optimized| Gen 5| 16| 950|
|Memory Optimized| Gen 5| 32| 1900|

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already

The Azure system requires five connections to monitor the Azure Database for PostgreSQL server. 

## Functional limitations
### Scale operations
1.	Dynamic scaling of servers across pricing tiers is currently not supported. That is, switching between Basic, General Purpose, or Memory Optimized tiers.
2.	Decreasing server storage size is currently not supported.

### Server version upgrades
- Automated migration between major database engine versions is currently not supported.

### Subscription management
- Dynamically moving servers across subscriptions and resource groups is currently not supported.

### Point-in-time-restore (PITR)
1.	When using the PITR feature, the new server is created with the same configurations as the server it is based on.
2.	Restoring a deleted server is not supported.

## Next steps
- Understand [what’s available in each pricing tier](concepts-pricing-tiers.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](howto-restore-server-portal.md)
