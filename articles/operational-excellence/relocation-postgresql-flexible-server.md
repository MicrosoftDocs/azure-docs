---
title: Relocate Azure Database for PostgreSQL to another region
description: Learn how to relocate an Azure Database for PostgreSQL to another region using Azure services and tools.
author: anaharris-ms
ms.author: anaharris
ms.reviewer: maghan
ms.date: 02/14/2024
ms.service: postgresql
ms.topic: concept-article
ms.custom:
  - subject-relocation
---

# Relocate Azure Database for PostgreSQL to another region

This article covers relocation guidance for Azure Database for PostgreSQL, Single Server, and Flexible Servers across geographies where region pairs aren't available for replication and geo-restore.

To learn how to relocate Azure Cosmos DB for PostgreSQL (formerly called Azure Database for PostgreSQL - Hyperscale (Citus)), see [Read replicas in Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/concepts-read-replicas).

For an overview of the region pairs supported by native replication, see [cross-region replication](../postgresql/concepts-read-replicas.md#cross-region-replication).

## Prerequisites

Prerequisites only apply to [redeployment with data](#redeploy-with-data). To move your database without data, you can skip to [Prepare](#prepare).

- To relocate PostgreSQL with data from one region to another, you must have an additional compute resource to run the backup and restore tools. The examples in this guide use an Azure VM running Ubuntu 20.04 LTS. The compute resources must:
  - Have network access to both the source and the target server, either on a private network or by inclusion in the firewall rules.
  - Be located in either the source or target region.
  - Use [Accelerated Networking](/azure/virtual-network/accelerated-networking-overview) (if available).
  - The database content isn't saved to any intermediate storage; the output of the logical backup tool is sent directly to the target server.
- Depending on your Azure Database for PostgreSQL instance design, the following dependent resources might need to be deployed and configured in the target region prior to relocation:
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link](./relocation-private-link.md)
    - [Virtual Network](./relocation-virtual-network.md)
    - [Network Peering](/azure/virtual-network/scripts/virtual-network-powershell-sample-peer-two-virtual-networks)


## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).


## Prepare

To get started, export a Resource Manager template. This template contains settings that describe your Automation namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All resources** and then select your Automation resource.
1. Select **Export template**.
1. Choose **Download** in the **Export template** page.
1. Locate the .zip file you downloaded from the portal and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.

## Redeploy without data

1. Adjust the exported template parameters to match the destination region.

  > [!IMPORTANT]  
  > The target server must be different from the name of the source server. You must reconfigure clients to point to the new server.

1. Redeploy the template to the new region. For an example of how to use an ARM template to create an Azure Database for PostgreSQL, see [Quickstart: Use an ARM template to create an Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/quickstart-create-server-arm-template?tabs=portal%2Cazure-portal).

## Redeploy with data

Redeployment with data migration for Azure Database for PostgreSQL is based on logical backup and restore and requires native tools. As a result, you can expect noticeable downtime during restoration.

> [!TIP]  
> You can use the Azure portal to relocate an Azure Database for PostgreSQL - Flexible Server. To learn how to perform replication for Single Server, see [Move an Azure Database for PostgreSQL - Flexible Server to another region by using the Azure portal](/azure/postgreSQL/single-server/how-to-move-regions-portal).

1. Adjust the exported template parameters to match the destination region.
  > [!IMPORTANT]  
  > The target server name must be different from the source server name. You must reconfigure clients to point to the new server.
1. Redeploy the template to the new region. For an example of how to use an ARM template to create an Azure Database for PostgreSQL, see [Quickstart: Use an ARM template to create an Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/quickstart-create-server-arm-template?tabs=portal%2Cazure-portal).

1. On the compute resource provisioned for the migration, install the PostgreSQL client tools for the PostgreSQL version to be migrated. The following example uses PostgreSQL version 13 on an Azure VM that runs Ubuntu 20.04 LTS:

    ```bash
      sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
      wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
      sudo apt-get update
      sudo apt-get install -y postgresql-client-13
    ```

    For more information on the installation of PostgreSQL components in Ubuntu, refer to [Linux downloads (Ubuntu)](https://www.postgresql.org/download/linux/ubuntu/).

    For other platforms, go to [PostgreSQL Downloads](https://www.postgresql.org/download/).

1. (Optional) If you created additional roles in the source server, create them in the target server. To get a list of existing roles,  use the following query:

    ```sql
    select *
    from pg_catalog.pg_roles
    where rolename not like 'pg_%' and rolename not in ('azuresu', 'azure_pg_admin', 'replication')
    order by rolename;
    ```

1. To migrate each database, do the following steps:
    1. Stop all database activity on the source server.
    1. Replace credentials information, source server, target server, and database name in the following script:

      ```sql
          export USER=admin_username
          export PGPASSWORD=admin_password
          export SOURCE=pgsql-arpp-source.postgres.database.azure.com
          export TARGET=pgsql-arpp-target.postgres.database.azure.com
          export DATABASE=database_name
          pg_dump -h $SOURCE -U $USER --create --exclude-schema=pg_catalog $DATABASE | psql -h $TARGET -U $USER postgres
      ```
    1. To migrate the database, run the script.

    1. Configure the clients to point to the target server.
    1. Perform functional tests on the applications.
        1. Ensure that the `ignoreMissingVnetServiceEndpoint` flag is set to `False`, so the IaC fails to deploy the database when the service endpoint isn't configured in the target region.

## Related content

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
