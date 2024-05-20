---
title: Regional availability – Azure Cosmos DB for PostgreSQL
description: Azure regions where you can run an Azure Cosmos DB for PostgreSQL cluster, configure geo-redundant backup, and can get AZ outage resiliency protection
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.custom: references_regions
ms.date: 04/02/2024
---

# Regional availability for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL is available in the following Azure regions:

| Region | HA | AZ outage resiliency |  Geo-redundant backup stored in |
| --- | --- | --- | --- |
| Australia Central | :heavy_check_mark: | N/A | :x: |
| Australia East | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Brazil South | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Canada Central | :heavy_check_mark: | :heavy_check_mark: | Canada East |
| Canada East | :heavy_check_mark: | N/A | Canada Central |
| Central India | :heavy_check_mark: | :heavy_check_mark: | South India |
| Central US | :heavy_check_mark: | :heavy_check_mark: | East US 2 |
| East Asia | :heavy_check_mark: | :heavy_check_mark: | Southeast Asia |
| East US | :heavy_check_mark: | :heavy_check_mark: | West US |
| East US 2 | :heavy_check_mark: | :heavy_check_mark: | Central US |
| France Central | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Germany West Central | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Japan East | :heavy_check_mark: | :heavy_check_mark: | Japan West |
| Japan West | :heavy_check_mark: | :x: | Japan East |
| Korea Central | :heavy_check_mark: | :heavy_check_mark: | :x: |
| North Central US | :heavy_check_mark: | N/A | South Central US |
| North Europe | :heavy_check_mark: | :heavy_check_mark: | West Europe |
| Poland Central | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Qatar Central | :heavy_check_mark: | :x: | :x: |
| South Central US | :heavy_check_mark: | :heavy_check_mark: | North Central US |
| South India | :heavy_check_mark: | N/A | Central India |
| Southeast Asia | :heavy_check_mark: | :x:| East Asia |
| Sweden Central | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Switzerland North | :heavy_check_mark: | :heavy_check_mark: | Switzerland West |
| Switzerland West † | :heavy_check_mark: | N/A | Switzerland North |
| UK South | :heavy_check_mark: | :heavy_check_mark: | :x: |
| West Central US | :heavy_check_mark: | N/A | West US 2 |
| West Europe | :heavy_check_mark: | :heavy_check_mark: | North Europe |
| West US | :heavy_check_mark: | :x: | East US |
| West US 2 | :heavy_check_mark: | :heavy_check_mark: | West Central US |
| West US 3 | :heavy_check_mark: | :heavy_check_mark: | :x: |

† This Azure region is a [restricted one](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions). To use it, you need to request access to it by opening a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

Some of these regions may not be activated on all Azure
subscriptions. If you want to use a region from the list and don't see it
in your subscription, or if you want to use a region not on this list, open a
[support
request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
 
**Next steps**

- Learn how to [create a cluster in the portal](./quickstart-create-portal.md).
- See details about [availability zone outage resiliency](./concepts-availability-zones.md) in Azure Cosmos DB for PostgreSQL.
- Check out [backup redundancy options](./concepts-backup.md#backup-redundancy).
