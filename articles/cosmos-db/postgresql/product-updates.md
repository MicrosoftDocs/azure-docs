---
title: Product updates for Azure Cosmos DB for PostgreSQL
description: Release notes, new features and features in preview
ms.author: jonels
author: jonels-msft
ms.custom: mvc
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 03/23/2023
---

# Product updates for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

## Release notes

Azure Cosmos DB for PostgreSQL gets updated regularly.

Updates that don’t directly affect the internals of a cluster are rolled out gradually to [all supported regions](resources-regions.md). Once such an update is rolled out to a region, it's available immediately on all new and existing Azure Cosmos DB for PostgreSQL clusters in that region.

Updates that change cluster internals, such as installing a [new minor PostgreSQL version](https://www.postgresql.org/developer/roadmap/), are delivered to existing clusters as part of the next [scheduled maintenance](concepts-maintenance.md) event. Such updates are available immediately to newly created clusters.

### March 2023

* General availability: Cluster compute [start / stop functionality](./concepts-compute-start-stop.md) is now supported across all configurations.
	
### February 2023

* General availability: 4 TiB, 8 TiB, and 16 TiB storage per node is now supported for [multi-node configurations](resources-compute.md#multi-node-cluster) in addition to previously supported 0.5 TiB, 1 TiB, and 2 TiB storage sizes.
	* See cost details for your region in 'Multi-node' section of [the Azure Cosmos DB for PostgreSQL pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/postgresql/).

### January 2023

* General availability: 1- and 2-vCore [burstable compute](concepts-burstable-compute.md) options for single-node clusters (for dev/test and smaller workloads).
	* Available in all supported regions. See compute and storage details [here](resources-compute.md#single-node-cluster).

### December 2022

* General availability: Azure Cosmos DB for PostgreSQL is now available in the Sweden Central and Switzerland West regions.
	* See [full list of supported Azure regions](resources-regions.md).
* PostgreSQL 15 is now the default Postgres version for Azure Cosmos DB for PostgreSQL in Azure portal.
	* See [all supported PostgreSQL versions](reference-versions.md).
	* See [this guidance](howto-upgrade.md) for the steps to upgrade your Azure Cosmos DB for PostgreSQL cluster to PostgreSQL 15.



### November 2022

* General availability: [Cross-region cluster read replicas](concepts-read-replicas.md) for improved read scalability and cross-region disaster recovery (DR).
* General availability: [Latest minor PostgreSQL version updates](reference-versions.md#postgresql-versions) (11.18, 12.13, 13.9, 14.6, and 15.1) are now available in all supported regions.

### October 2022

* General availability: [Azure Cosmos DB for PostgreSQL, formerly known as Hyperscale (Citus), is now generally available](https://devblogs.microsoft.com/cosmosdb/distributed-postgresql-comes-to-azure-cosmos-db/).
	* See all previous product updates under the Hyperscale (Citus) name [here](https://azure.microsoft.com/updates/?query=Hyperscale%20%28Citus%29).
* General availability: [PostgreSQL 15](https://www.postgresql.org/docs/release/15.0/) support.
	* See all supported PostgreSQL versions [here](reference-versions.md#postgresql-versions).
	* [Upgrade to PostgreSQL 15](howto-upgrade.md)
* General availability: [Citus 11.1 with new features and PostgreSQL 15 in Citus](https://www.postgresql.org/about/news/announcing-citus-111-open-source-release-2511/).
* Free trial: Now Azure Cosmos DB for PostgreSQL is a part of the [Azure Cosmos DB 30-day free trial](https://cosmos.azure.com/try/).
* Preview: Product Quick start in Azure portal with hands-on tutorials and embedded psql shell.

## Features in preview

Azure Cosmos DB for PostgreSQL offers
previews for unreleased features. Preview versions are provided
without a service level agreement, and aren't recommended for
production workloads. Certain features might not be supported or
might have constrained capabilities.  For more information, see
[Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

There are no features currently available for preview.

## Contact us

Let us know about your experience using preview features, by emailing [Ask
Azure Cosmos DB for PostgreSQL](mailto:AskCosmosDB4Postgres@microsoft.com).
(This email address isn't a technical support channel. For technical problems,
open a [support
request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).)
