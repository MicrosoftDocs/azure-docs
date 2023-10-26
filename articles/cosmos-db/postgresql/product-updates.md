---
title: Product updates for Azure Cosmos DB for PostgreSQL
description: Release notes, new features and features in preview
ms.author: nlarin
author: niklarin
ms.custom: mvc, references_regions
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 10/01/2023
---

# Product updates for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

## Release notes

Azure Cosmos DB for PostgreSQL gets updated regularly.

Updates that don’t directly affect the internals of a cluster are rolled out gradually to [all supported regions](resources-regions.md). Once such an update is rolled out to a region, it's available immediately on all new and existing Azure Cosmos DB for PostgreSQL clusters in that region.

Updates that change cluster internals, such as installing a [new minor PostgreSQL version](https://www.postgresql.org/developer/roadmap/), are delivered to existing clusters as part of the next [scheduled maintenance](concepts-maintenance.md) event. Such updates are available immediately to newly created clusters.

### October 2023
* General availability: Azure SDKs are now generally available for all Azure Cosmos DB for PostgreSQL management operations supported in REST APIs.
    * [.NET SDK](https://www.nuget.org/packages/Azure.ResourceManager.CosmosDBForPostgreSql/)
    * [Go SDK](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/cosmosforpostgresql/armcosmosforpostgresql)
    * [Java SDK](https://central.sonatype.com/artifact/com.azure.resourcemanager/azure-resourcemanager-cosmosdbforpostgresql/)
    * [JavaScript SDK](https://www.npmjs.com/package/@azure/arm-cosmosdbforpostgresql/)
    * [Python SDK](https://pypi.org/project/azure-mgmt-cosmosdbforpostgresql/)
* General availability: Azure CLI is now available for all Azure Cosmos DB for PostgreSQL management operations supported in REST APIs.
    * See [details](/cli/azure/cosmosdb/postgres).
* General availability: Audit logging of database activities in Azure Cosmos DB for PostgreSQL is available through the PostgreSQL pgAudit extension.
    * See [details](./how-to-enable-audit.md).

### September 2023
* General availability: [PostgreSQL 16](https://www.postgresql.org/docs/release/16.0/) support.
	* See all supported PostgreSQL versions [here](./reference-versions.md#postgresql-versions).
	* [Upgrade to PostgreSQL 16](./howto-upgrade.md)
* General availability: [Citus 12.1 with new features and PostgreSQL 16 support](https://www.citusdata.com/updates/v12-1).
* General availability: Data encryption at rest using [Customer Managed Keys](./concepts-customer-managed-keys.md) (CMK) is now supported for all available regions.
   * See [this guide](./how-to-customer-managed-keys.md) for the steps to enable data encryption using customer managed keys. 
* Preview: Geo-redundant backup and restore
    * Learn more about [backup and restore Azure Cosmos DB for PostgreSQL](./concepts-backup.md)
* Preview: [32 TiB storage per node for multi-node configurations](./resources-compute.md#multi-node-cluster) is now available in all supported regions.
    * See [how to maximize IOPS on your cluster](./resources-compute.md#maximum-iops-for-your-compute--storage-configuration).
* General availability: Azure Cosmos DB for PostgreSQL is now available in Australia Central, Canada East, and Qatar Central.
    * See [all supported regions](./resources-regions.md).


### August 2023
* General availability: [The latest minor PostgreSQL version updates](reference-versions.md#postgresql-versions) (11.21, 12.16, 13.12, 14.9, and 15.4) are now available in all supported regions.
* General availability: [PgBouncer](http://www.pgbouncer.org/) version 1.20 is now supported for all [PostgreSQL versions](reference-versions.md#postgresql-versions) in all [supported regions](./resources-regions.md) 	
    * See [Connection pooling and managed PgBouncer in Azure Cosmos DB for PostgreSQL](./concepts-connection-pool.md).
* General availability: Citus 12 is now available in [all supported regions](./resources-regions.md) with PostgreSQL 14 and PostgreSQL 15.
    * Check [what's new in Citus 12](https://www.citusdata.com/updates/v12-0/).
    * See [Postgres and Citus version in-place upgrade](./concepts-upgrade.md).
* Preview: [Microsoft Entra authentication](./concepts-authentication.md#azure-active-directory-authentication-preview) is now supported in addition to Postgres roles.
* Preview: Azure CLI is now supported for all Azure Cosmos DB for PostgreSQL management operations.
    * See [details](/cli/azure/cosmosdb/postgres).

### July 2023
* Preview: Azure SDKs are now available for all Azure Cosmos DB for PostgreSQL management operations.
    * [.NET (preview)](https://www.nuget.org/packages/Azure.ResourceManager.CosmosDBForPostgreSql/1.0.0-beta.1)
    * [Go (preview)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/cosmosforpostgresql/armcosmosforpostgresql@v0.1.0)
    * [Java (preview)](https://central.sonatype.com/artifact/com.azure.resourcemanager/azure-resourcemanager-cosmosdbforpostgresql/1.0.0-beta.1/overview)
    * [JavaScript (preview)](https://www.npmjs.com/package/@azure/arm-cosmosdbforpostgresql/v/1.0.0-beta.1)
    * [Python (preview)](https://pypi.org/project/azure-mgmt-cosmosdbforpostgresql/1.0.0b1/)
* General availability: Terraform support is now available for all cluster management operations. See the following pages for details:
    * [Cluster management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_cluster)
    * [Worker node configuration](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_node_configuration)
    * [Coordinator / single node configuration](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_coordinator_configuration)
    * [Postgres role management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_role)
    * [Public access: Firewall rule management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_firewall_rule)
    * [Private access: Private endpoint management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint)
    * [Private access: Private Link service management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_link_service)
* General availability: 99.99% monthly availability [Service Level Agreement (SLA)](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

### June 2023
* General availability: Customer-defined database name is now available in [all regions](./resources-regions.md) at [cluster provisioning](./quickstart-create-portal.md) time.
    * If the database name isn't specified, the default `citus` name is used.
* General availability: [Managed PgBouncer settings](./reference-parameters.md#managed-pgbouncer-parameters) are now configurable on all clusters.
    * Learn more about [connection pooling](./concepts-connection-pool.md).
* General availability: Preferred availability zone (AZ) selection is now enabled in [all Azure Cosmos DB for PostgreSQL regions](./resources-regions.md) that support AZs.
    * Learn about [cluster node availability zones](./concepts-cluster.md#node-availability-zone) and [how to set preferred availability zone](./howto-scale-grow.md#choose-preferred-availability-zone).
* General availability: The new domain name and FQDN format for cluster nodes. The change applies to newly provisioned clusters only.
    * See [details](./concepts-node-domain-name.md).
* Preview: Audit logging of database activities in Azure Cosmos DB for PostgreSQL is available through the PostgreSQL pgAudit extension.
    * See [details](./how-to-enable-audit.md).

### May 2023

* General availability: [Pgvector extension](howto-use-pgvector.md) enabling vector storage is now fully supported on Azure Cosmos DB for Postgres.
* General availability: [The latest minor PostgreSQL version updates](reference-versions.md#postgresql-versions) (11.20, 12.15, 13.11, 14.8, and 15.3) are now available in all supported regions.
* General availability: [Citus 11.3](https://www.citusdata.com/updates/v11-3/) is now supported on PostgreSQL 13, 14, and 15.
	* See [this page](./concepts-upgrade.md) for information on PostgreSQL and Citus version in-place upgrade.
* General availability: PgBouncer version 1.19.0 is now supported for all [PostgreSQL versions](reference-versions.md#postgresql-versions) in all [supported regions](./resources-regions.md) 	
* General availability: Clusters are now always provisioned with the latest Citus version supported for selected PostgreSQL version.
	* See [this page](./reference-extensions.md#citus-extension) for the latest supported Citus versions.
	* See [this page](./concepts-upgrade.md) for information on PostgreSQL and Citus version in-place upgrade.

### April 2023

* General availability: [Representational State Transfer (REST) APIs](/rest/api/postgresqlhsc/) are now fully supported for all cluster management operations.
* General availability: [Bicep](/azure/templates/microsoft.dbforpostgresql/servergroupsv2?pivots=deployment-language-bicep) and [ARM templates](/azure/templates/microsoft.dbforpostgresql/servergroupsv2?pivots=deployment-language-arm-template) for Azure Cosmos DB for PostgreSQL's serverGroupsv2 resource type.
* Public preview: Data Encryption at rest using [Customer Managed Keys](./concepts-customer-managed-keys.md) is now supported for all available regions.
   * See [this guide](./how-to-customer-managed-keys.md) for the steps to enable data encryption using customer managed keys. 

### March 2023

* General availability: Cluster compute [start / stop functionality](./concepts-compute-start-stop.md) is now supported across all configurations.
	
### February 2023

* General availability: 4 TiB, 8 TiB, and 16 TiB storage per node is now supported for [multi-node configurations](resources-compute.md#multi-node-cluster) in addition to previously supported 0.5 TiB, 1 TiB, and 2 TiB storage sizes.
	* See cost details for your region in 'Multi-node' section of [the Azure Cosmos DB for PostgreSQL pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/postgresql/).
* General availability: [The latest minor PostgreSQL version updates](reference-versions.md#postgresql-versions) (11.19, 12.14, 13.10, 14.7, and 15.2) are now available in all supported regions.

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

* [Geo-redundant backup and restore](./concepts-backup.md#backup-redundancy)
* [32 TiB storage per node in multi-node clusters](./resources-compute.md#multi-node-cluster)
* [Microsoft Entra authentication](./concepts-authentication.md#azure-active-directory-authentication-preview)

## Contact us

Let us know about your experience using preview features or if you have other product feedback, by emailing [Ask
Azure Cosmos DB for PostgreSQL](mailto:AskCosmosDB4Postgres@microsoft.com).
(This email address isn't a technical support channel. For technical problems,
open a [support
request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).)
