---
title: Migrate Azure Cosmos DB for NoSQL to availability zone support 
description: Learn how to migrate your Azure Cosmos DB for NoSQL to availability zone support.
author: anaharris-ms
ms.service: sql
ms.topic: conceptual
ms.date: 04/15/2024
ms.author: anaharris 
ms.custom: references_regions, subject-reliability
---

# Migrate Azure Cosmos DB for NoSQL to availability zone support
 
This guide describes how to migrate Azure Cosmos DB for NoSQL from non-availability zone support to availability support.

Using availability zones in Azure Cosmos DB has no discernible impact on performance or latency. It doesn't require any adjustments to the selected consistency mode, and also doesn't require any modification to application code.

When availability zones are enabled, Azure Cosmos DB intelligently distributes the four replicas of your data across all available zones. This ensures that, in the event of an outage in one availability zone, the account remains fully operational. In contrast, without availability zones, all replicas would be located in a single availability zone (we do not expose which), leading to potential downtime if that specific zone experiences an issue.

Enabling availability zones is a great way to increase resilience of your Cosmos DB database without introducing additional application complexities, affecting performance, or even incurring additional costs, if autoscale is also used.


## Prerequisites

- Serverless accounts can use availability zones, but this choice is only available during account creation. Existing accounts without availability zones cannot be converted to an availability zone configuration. For mission critical workloads, provisioned throughput is the recommended choice.
 
- Understand that enabling availability zones is not an account-wide choice. A single Cosmos DB account can span an arbitrary number of Azure regions, each of which can independently be configured to leverage availability zones and some regional pairs may not have availability zone support. This is important, as some regions do not yet support availability zones, but adding them to a Cosmos DB account will not prevent enabling availability zones in other regions configured for that account.  The billing model also reflects this possibility. For more information on SLA for Cosmos DB, see [Reliability in Cosmos DB for NoSQL](./reliability-cosmos-db-nosql.md#sla-improvements). To see which regions support availability zones, see [Azure regions with availability zone support](./availability-zones-service-support.md#azure-regions-with-availability-zone-support)

## Downtime requirements

When you migrate to availability zone support, a small amount of write unavailability (a few seconds) occurs when adding and removing the secondary region, as the system deliberately stops writes in order to check consistency between regions.

## Migration

Because you can't enable availability zones in a region that has already been added to your account, you'll need to remove that region and add it again with availability zones enabled. To avoid any service disruption, you'll add and failover to a temporary region until the availability zone configuration is complete.

Follow the steps below to enable availability zones for your account in select regions.


# [Azure portal](#tab/portal)

1. Add a temporary region to your database account by following steps in [Add region to your database account](/azure/cosmos-db/how-to-manage-database-account#addremove-regions-from-your-database-account).

1. If your Azure Cosmos DB account is configured with multi-region writes, skip to the next step. Otherwise, perform manual failover to the temporary region by following the steps in [Perform manual failover on an Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account?source=recommendations#manual-failover).

1. Remove the region for which you would like to enable availability zones by following steps in [Remove region to your database account](/azure/cosmos-db/how-to-manage-database-account#addremove-regions-from-your-database-account).

1. Add back the region to be enabled with availability zones:
    1. [Add region to your database account](/azure/cosmos-db/how-to-manage-database-account#addremove-regions-from-your-database-account).
    1. Find the newly added region in the **Write region** column, and enable **Availability Zone** for that region. 
    1. Select **Save**.

1. Perform failback to the availability zone-enabled region by following the steps in [Perform manual failover on an Azure Cosmos DB account](/azure/cosmos-db/how-to-manage-database-account?source=recommendations#manual-failover).

1. Remove the temporary region by following steps in [Remove region to your database account](/azure/cosmos-db/how-to-manage-database-account#addremove-regions-from-your-database-account).

# [Azure CLI](#tab/cli)

1. Add a temporary region to your database account. The following example shows how to add West US as a secondary region to an account configured with East US region only. You must include all existing regions and any new ones in the command.

    ```azurecli
    
    az cosmosdb update --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup --locations regionName=eastus failoverPriority=0 isZoneRedundant=False --locations regionName=westus failoverPriority=1 isZoneRedundant=False
    
    ```

1. If your Azure Cosmos DB account is configured with multi-region writes, skip to the next step. Otherwise, perform manual failover to the newly added temporary region. The following example shows how to perform a failover from East US region (current write region) to West US region (current read-only region). You must include both regions in the command. 

    ```azurecli
    
    az cosmosdb failover-priority-change --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup --failover-policies westus=0 eastus=1
    
    ```

1. Remove the region for which you would like to enable availability zones. The following example shows how to remove East US region from an account configured with West US (write region) and East US (read-only) regions. You must include all regions that shouldn't be removed in the command. 

    ```azurecli
    
    az cosmosdb update --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup --locations regionName=westus failoverPriority=0 isZoneRedundant=False
    
    ```
 
1. Add back the region to be enabled with availability zones. The following example shows how to add East US as an AZ-enabled secondary region to an account configured with West US region only. You must include any existing regions and all new ones in the command. 

    
    ```azurecli
    az cosmosdb update --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup --locations regionName=westus failoverPriority=0 isZoneRedundant=False --locations regionName=eastus failoverPriority=1 isZoneRedundant=True
    ```

1. Perform failback to the availability zone-enabled region. The following example shows how to perform a failover from West US region (current write region) to East US region (current read-only region). You must include both regions in the command. 
 
    ```azurecli
    
        az cosmosdb failover-priority-change --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup --failover-policies eastus=0 westus=1
    ```

1. Remove temporary region. The following example shows how to remove West US region from an account configured with East US (write region) and West US (read-only) regions. You must include all accounts that should not be removed in the command. 

 
    ```azurecli
    
    az cosmosdb update --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup --locations regionName=eastus failoverPriority=0 isZoneRedundant=True
    
    ```


## Related content

- [Move an Azure Cosmos DB account to another region](/azure/cosmos-db/how-to-move-regions)
- [Azure services and regions that support availability zones](availability-zones-service-support.md)
