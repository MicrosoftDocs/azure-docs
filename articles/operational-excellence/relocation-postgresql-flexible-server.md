---
title: Relocation guidance for Azure Database for PostgreSQL
description: Learn how to relocate an Azure Database for PostgreSQL to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/10/2024
ms.service: postgresql
ms.topic: how-to
---



# Relocation guidance for Azure Database for PostgreSQL

This article covers relocation guidance for Azure Database for PostgreSQL, Single Server, and Flexible Servers across geographies, where region pairs aren't available for replication and geo-restore.  

To learn how to relocate Azure Cosmos DB for PostgreSQL (formerly called Azure Database for PostgreSQL - Hyperscale (Citus)), see [Read replicas in Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/concepts-read-replicas).

For an overview of the region pairs supported by native replication, see [cross-region replication](../postgresql/concepts-read-replicas.md#cross-region-replication).


## Relocation strategies

To relocate Azure PostgreSQL database to a new region, you can choose to [redeploy without data migration](#redeploy-without-data-migration) or [redeploy with data migration](#redeploy-with-data-migration) strategies. 

**Azure Resource Mover** doesn't support moving services used by the Azure Database for PostgreSQL. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

## Redeploy without data migration

A simple redeployment without data or configuration for Azure Database for PostgreSQL has minimal downtime due to its low complexity.

**To redeploy your PostgreSQL server without configuration or data:**

1. Export your PostgreSQL Server's existing configuration into an [ARM template](/azure/templates/microsoft.dbforpostgresql/flexibleservers?pivots=deployment-language-arm-template). 

1. Adjust template parameters to match the destination region.
  >[!IMPORTANT]
  >The target server must be different from source server name. You must reconfigure clients to point to the new server.

1. Redeploy the template to the new region. For an example of how to use an ARM template to create an Azure Database for PostgreSQL, see [Quickstart: Use an ARM template to create an Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/quickstart-create-server-arm-template?tabs=portal%2Cazure-portal).
  

## Redeploy with data migration

In this section you learn how to redeploy your data and source server to the target server, using the same configuration of the source server. 

Configuration includes, but is not limited to:

- Network
- Administrator name
- SKU
- Server settings
- Extensions
- Backup
- Maintenance
- High availability 


>[!TIP]
>you can use Azure portal to move an Azure Database for PostgreSQL - Single Server. To learn how to perform replication for Single Server, see [Move an Azure Database for Azure Database for PostgreSQL - Single Server to another region by using the Azure portal](/azure/postgresql/single-server/how-to-move-regions-portal).

### Prerequisites

- To relocate PostgreSQL from one region to another, you must have an additional compute resource to run the backup and restore tools. The examples in this guide use an Azure VM running Ubuntu 20.04 LTS. The compute resources must:
  - Have network access to both the source and the target server, either on a private network or by inclusion in the firewall rules.
  - Be located in either the source or target region.
  - Use [Accelerated Networking](/azure/virtual-network/accelerated-networking-overview) (if available).
  - The database content is not saved to any intermediate storage; the output of the logical backup tool is sent directly to the target server.
- Depending on your Azure Database for PostgreSQL instance design, the following dependent resources may need to be deployed and configured in the target region prior to relocation:
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link](./relocation-private-link.md)
    - [Virtual Network](./relocation-virtual-network.md)
    - [Network Peering](/azure/virtual-network/scripts/virtual-network-powershell-sample-peer-two-virtual-networks)


### Redeploy your PostgreSQL server with data migration

Redeployment with data migration for Azure Database for PostgreSQL is based on logical backup and restore and requires the use of native tools. As a result, you can expect noticeable downtime during restoration.

**To redeploy your PostgreSQL server with configuration or data:**

1. Export your PostgreSQL Server's existing configuration into an [ARM template](/azure/templates/microsoft.dbforpostgresql/flexibleservers?pivots=deployment-language-arm-template). 
1. Adjust template parameters to match the destination region.
  >[!IMPORTANT]
  >The target server name must be different from source server name. You must reconfigure clients to point to the new server.
1. Redeploy the template to the new region. For an example of how to use an ARM template to create an Azure Database for PostgreSQL, see [Quickstart: Use an ARM template to create an Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/quickstart-create-server-arm-template?tabs=portal%2Cazure-portal).
  


1. On the compute resource provisioned for the migration, install the PostgreSQL client tools for the PostgreSQL version to be migrated. The following example uses PostgreSQL version 13 on an Azure VM that runs Ubuntu 20.04 LTS:

    ```
      sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
      wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
      sudo apt-get update
      sudo apt-get install -y postgresql-client-13
    ```

    For more information for the installation of PostgreSQL components in Ubuntu, please refer to [Linux downloads (Ubuntu)](https://www.postgresql.org/download/linux/ubuntu/).

    For other platforms, go to [PostgreSQL Downloads](https://www.postgresql.org/download/).

1. (Optional) If you created additional roles in the source server, create them in the target server. To get a list of existing roles,  use the following query:

    ```sql
    select *
    from pg_catalog.pg_roles
    where rolname not like 'pg_%' and rolname not in ('azuresu', 'azure_pg_admin', 'replication')
    order by rolname;
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
    1. Run the script to migrate the database.
    1. Configure the clients to point to the target server.
    1. Perform functional tests on the applications.
        1. Ensure that the `ignoreMissingVnetServiceEndpoint` flag is set to `False`, so that the IaC fails to deploy the database when the service endpoint isn’t configured in the target region. 
        
        
