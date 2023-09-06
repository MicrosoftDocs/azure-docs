---
title: Cluster upgrades - Azure Cosmos DB for PostgreSQL
description: Types of upgrades, and their precautions
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 05/16/2023
---

# Cluster upgrades in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The Azure Cosmos DB for PostgreSQL managed service can handle upgrades of both the
PostgreSQL server, and the Citus extension. All clusters are created with [the latest Citus version](./reference-extensions.md#citus-extension) available for the major PostgreSQL version you select during cluster provisioning. When you select a PostgreSQL version such as PostgreSQL 15 for in-place cluster upgrade, the latest Citus version supported for selected PostgreSQL version is going to be installed. 

If you need to upgrade the Citus version only, you can do so by using an in-place upgrade. For instance, you may want to upgrade Citus 11.0 to Citus 11.3 on your PostgreSQL 14 cluster without upgrading Postgres version. 

## Upgrade precautions

Upgrades require some downtime in the database cluster. The exact time depends
on the source and destination versions of the upgrade. To prepare for the
production cluster upgrade, we recommend [testing the
upgrade](howto-upgrade.md#test-the-upgrade-first), and measure downtime during
the test.

Also, upgrading a major version of Citus can introduce changes in behavior.
It's best to familiarize yourself with new product features and changes to
avoid surprises.

Noteworthy Citus 11 changes:

* Table shards may disappear in your SQL client. Their visibility
  is now controlled by
  [citus.show_shards_for_app_name_prefixes](reference-parameters.md#citusshow_shards_for_app_name_prefixes-text).
* There are several [deprecated
  features](https://www.citusdata.com/updates/v11-0/#deprecated-features).

## Next steps

> [!div class="nextstepaction"]
> [How to perform upgrades](howto-upgrade.md)
