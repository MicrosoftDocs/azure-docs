---
title: Relocation guidance in PostgreSQL
titleSufffix: Azure Database for PostgreSQL
description: Find out about relocation guidance for Azure Database for PostgreSQL 
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 12/01/2023
ms.service: postgresql
ms.topic: conceptual
ms.custom:
  - references_regions
  - subject-reliability
---



# Relocation guidance for Azure Database for PostgreSQL

This article covers the scenario of relocation for PostgreSQL across geographies, where read replicas and geo-restore aren't available. For an overview of the region pairs supported by native replication,  see
[cross-region replication](../postgresql/concepts-read-replicas#cross-region-replication).

The relocation [architectural pattern](relocation-overview.md#relocation-architectural-patterns) covered in this document is based on logical backup and restore, performed using native tools. Backup and restore times may introduce noticeable downtime.

## Prerequisites

- The relocation pattern requires an existing compute resource to execute backup and
  restore tools. The examples in this document are based on an Azure VM running
  Ubuntu 20.04 LTS.

- The compute resource must have network access to both the source and the
  target server, either on a private network or by inclusion in the firewall
  rules. Make sure the compute resource is located in either the source or the
  target region, and uses Accelerated Networking (if available).

## Downtime

This relocation pattern is based on logical backup and restore, performed using native
tools. Backup and restore times may introduce noticeable downtime.

## Dependencies

Depending on your Azure Database for PostgreSQL instance design, the following
dependent resources may need to be created in the target region prior to
re-location:

- [Public IP address]()
- [Azure Private Endpoint]()
- [Azure Service Endpoint]()
- [Virtual Network]()
- Network Peering
- Azure Private DNS

## Architectural patterns

Workload architectures can be classified broadly into three types: Cold Standby,
Warm Standby, and Multi-Site Active/Active. Ref -
[Workload Architectures](/relocation-playbook/workload-architectures/)

- Multi-Site Active/Active: Both regions are active at the same time, with one
  region ready to begin use immediately. This architecture is designed for
  workload that needs near to zero downtime for the end-user perspective, this
  includes also near to zero data loss. This is a more suitable architecture
  when the relocation decision is associated with a change in region alone vs a
  change in region & subscription together.
- Warm Standby: Primary region active, secondary region has critical resources
  (for example, deployed models) ready to start. Non-critical resources would
  need to be manually deployed in the secondary region.
- Cold Standby: Primary region active, secondary region has required Azure
  resources deployed, along with needed data. Resources such as models, model
  deployments, or pipelines would need to be manually deployed.

The implemented architecture helps you to understand the downtime introduced by
the relocation. For example CosmosDB has a replication capability to enable Warm
Standby or Multi-Site Active Active architectures. These capabilities might also
be used for the relocation of Azure Database for PostgreSQL.

To successfully relocate, the following options might be adapted.

### Migration over public endpoint

![Migration over Public Endpoint](/relocation/patterns/az-services/postgresql/migration-over-public-endpoint.png)

### Migration over private endpoint

![Migration over Private Endpoint](/relocation/patterns/az-services/postgresql/migration-over-private-endpoint.png)

| Strategy                     | Advantages            | Disadvantages                                                  |
| ---------------------------- | --------------------- | -------------------------------------------------------------- |
| Redeploy                     | Low complexity        | Does not cover data migration.                                 |
| Redeploy with Data Migration | Covers data migration | High complexity, requires additional resources, long downtime. |

Considering the redeploy with data migration strategy,the workload consisting of
this service will have an implication of cold standby.

## Relocation

To successfully relocate, you have to create a dependency map with all the Azure
services used by the Azure Database for PostgreSQL. For the services that are in
scope of a relocation, you have to select the appropriate relocation strategy.
The
[automation guideline](/technical-delivery-playbook/automation/automation-foundation-framework/)
in this technical playbook helps you orchestrate and sequence the multiple
relocation procedures.

### [Azure Resource Mover](/relocation-playbook/relocation-strategies/resource-movement/)

[Azure Resource Mover](https://docs.microsoft.com/en-us/azure/resource-mover/overview)
does not support moving services used by the Azure Database for PostgreSQL. For
the services that are in scope of a across regions. For resources supported by
Azure Resource Mover, see the article
[here](https://docs.microsoft.com/en-us/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

### [Redeploy](/relocation-playbook/relocation-strategies/redeployment/)

Azure Database for PostgreSQL instance can be redeployed using an ARM template,
if needed without any configurations and data.

### [Redeploy with Data Migration](/relocation-strategies/redeployment-data-migration/)

- This scenario is based on a compute services (e.g. Azure VM) running native
  logical backup and restore tools to migrate individual databases.
- The compute resource should be deployed to either the source or the target
  region, and use Accelerated Networking (if available).
- The database content is not saved to any intermediate storage; the output of
  the logical backup tool is sent directly to the target server.
- Two alternative approaches are based on exporting the database to file first.
  They are documented in:
  - [Migrate your PostgreSQL database by using dump and restore](https://docs.microsoft.com/en-us/azure/postgresql/howto-migrate-using-dump-and-restore)
  - [Migrate your PostgreSQL database using export and import](https://docs.microsoft.com/en-us/azure/postgresql/howto-migrate-using-export-and-import)

#### Deploy the target server

Deploy the target server, using the same configuration of the source server.
This includes, but is not limited to:

- Network
- Administrator name
- SKU
- Server settings
- Extensions
- Backup
- Maintenance
- High availability

Follow the
[Automation Foundation](/technical-delivery-playbook/automation/automation-foundation-framework/)
approach.

- **Step 1:** You export your PostgreSQL Servers existing configuration into an
  ARM template, adjust its parameters to match the destination region and
  redeploy the template to the new region.
- **Step 2:** Once your new PostgreSQL Servers and all the necessary features
  are in place and the instance is successfully tested.

Note: the target server name cannot be the same. Clients must be reconfigured to
point to the new server.

#### Create custom roles into the target server

If you created additional roles in the source server, create them in the target
server.

- **Step 3:** To get a list of existing roles, you can use this query.

  ```sql
  select *
  from pg_catalog.pg_roles
  where rolname not like 'pg_%' and rolname not in ('azuresu', 'azure_pg_admin', 'replication')
  order by rolname;
  ```

The following steps must be executed on the compute resource provisioned for the
migration. This example is based on an Azure VM running Ubuntu 20.04 LTS.

#### Install the PostgreSQL client tools for the PostgreSQL version to be migrated

- **Step 4:**The example uses PostgreSQL version 13.

  ```bash
  sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
  sudo apt-get update
  sudo apt-get install -y postgresql-client-13
  ```

For more information for the installation of PostgreSQL components in Ubuntu,
please refer to
[Linux downloads (Ubuntu)](https://www.postgresql.org/download/linux/ubuntu/).

For other platforms, please refer to
[PostgreSQL Downloads](https://www.postgresql.org/download/).

#### Transfer the databases

Execute the following steps for each database to be migrated.

- **Step 5:** Stop any database activity on the source server.
- **Step 6:** Replace credentials information , source server, target server and
  database name in the following script.

  ```bash
  export USER=admin_username
  export PGPASSWORD=admin_password
  export SOURCE=pgsql-arpp-source.postgres.database.azure.com
  export TARGET=pgsql-arpp-target.postgres.database.azure.com
  export DATABASE=database_name
  pg_dump -h $SOURCE -U $USER --create --exclude-schema=pg_catalog $DATABASE | psql -h $TARGET -U $USER postgres
  ```

- **Step 7:** Run the script to migrate the database.
- **Step 8:** Configure the clients to point to the target server.
- **Step 9:** Perform functional tests on the applications.

### Service Endpoints

The virtual network service endpoints for Azure Database for PostgreSQL restrict
access to a specified virtual network. The endpoints can also restrict access to
a list of IPv4 (internet protocol version 4) address ranges. Any user connecting
to the Azure Database for PostgreSQL from outside those sources is denied
access. If Service endpoints were configured in the source region for the Azure
Database for PostgreSQL resource, the same would need to be done in the target
one. The steps for this scenario are mentioned below:

- For a successful move of the Azure Database for PostgreSQL to the target
  region, the VNet and Subnet must be created beforehand. In case the move of
  these two resources is being carried out with the Azure Resource Mover tool,
  the service endpoints won't be configured automatically. Hence, they need to
  be configured manually, which can be done through the Azure portal, Azure CLI
  or Azure PowerShell.
  [Ref Link](https://docs.microsoft.com/en-us/azure/postgresql/howto-manage-vnet-using-portal?toc=/azure/virtual-network/toc.json)
- Secondly, changes need to be made in the IaC of the Azure Database for
  PostgreSQL. In `networkAcl` section, under `virtualNetworkRules`, add the rule
  for the target subnet. Ensure that the `ignoreMissingVnetServiceEndpoint` flag
  is set to False, so that the IaC fails to deploy the Azure Database for
  PostgreSQL in case the service endpoint isn't configured in the target region.
  This will ensure that the prerequisites in the target region are met.

### Relocation for Azure Database for PostgreSQL - Hyperscale(Citus)

Using cross-region replica, User/Customer would be able to create a read replica
of their RW Hyperscale (Citus) server group in any of the supported regions.
Once created, we can monitor replication – the feature uses asynchronous
replication – and decide on the time for cut off (stop writes on the primary and
wait for them to replicate to the replica or promote with data loss). Promotion
is a simple operations in Azure portal.

1. Create read Replicas in targeted region.
2. Initiate the replication for data sync.
3. Cutoff stop the writes on the primary and wait for sync to complete.
4. Switch over workload to targeted region instance .
5. Resource Cleanup.

{{% alert title="Warning" color="warning" %}} Note:Cross-region read replicas -
PostgreSQL - Hyperscale (Citus) server will support this feature later this
calendar year 2022. {{% /alert %}}
