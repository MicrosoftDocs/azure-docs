---
title: Materialized Views for Azure Cosmos DB API for Apache Cassandra (preview)
description: This documentation is provided as a resource for participants in the preview of Azure Cosmos DB Cassandra API Materialized View.
author: dileepraotv-github
ms.author: turao
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 11/17/2022
ms.custom: ignite-2022
---

# Materialized Views for Azure Cosmos DB API for Apache Cassandra (preview)

[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

> [!IMPORTANT]
> Materialized Views for API for Cassandra is currently in preview. You can enable this feature from the portal.
>
> Materialized View preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Feature overview

Materialized Views when defined will help provide a means to efficiently query a base table (container on Cosmos DB) with non-primary key filters. When users write to the base table, the Materialized view is built automatically in the background. This view can have a different primary key for lookups. The view will also contain only the projected columns from the base table. It will be a read-only table.

You can query a column store without specifying a partition key by using Secondary Indexes. However, the query won't be effective for columns with high cardinality (scanning through all data for a small result set) or columns with low cardinality. Such queries end up being expensive as they end up being a cross partition query.

With Materialized view, you can:

- Use as Lookup table or Mapping table and save cross partition scans that reduce expensive queries.
- Provide SQL based conditional predicate to populate only certain columns and certain data that meet the pre-condition.
- Real time MVs that simplify real time event based scenarios where customers today use Change feed trigger for precondition checks to populate new collections".

## Main benefits

- With Materialized View (Server side denormalization), you can avoid multiple independent tables and client side denormalization.
- Materialized view feature takes on the responsibility of updating views in order to keep them consistent with the base table. With this feature, you can avoid dual writes to the base table and the view.
- Materialized Views helps optimize read performance
- Ability to specify throughput for the materialized view independently
- Based on the requirements to hydrate the view, you can configure the MV builder layer appropriately.
- Speeding up write operations as it only needs to be written to the base table.
- Additionally, This implementation on Cosmos DB is based on a pull model, which doesn't affect the writer performance.

## How to get started?

New Cassandra API accounts with Materialized Views enabled can be provisioned on your subscription by using REST API calls from Azure CLI.

### Log in to the Azure command line interface

Install Azure CLI as mentioned at [How to install the Azure CLI | Microsoft Docs](/cli/azure/install-azure-cli) and log in:

```azurecli
az login
```

### Enable Materialized view feature on DB account

#### Using Portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to your Azure Cosmos DB API for Cassandra account.

3. Go to the **Features** pane underneath the **Settings** section.

4. Select **Materialized View for Cassandra API (Preview)**.

5. Click **Enable** to enable this feature for this account.

:::image type="content" source="./media/materialized-view/Enable_mv_on_portal.png" alt-text="Screenshot to enable Materialized view feature on portal Azure Cosmos DB API for Cassandra":::

#### Using Azure CLI

Please use this link to install Microsoft Azure CLI 'cosmosdb-preview' Extension: [Azure CLI extension overview](https://learn.microsoft.com/cli/azure/azure-cli-extensions-overview)

Refer to this link on documentation for  Azure CLI command for enabling Materialized View on account: [Azure CLI documentation](https://github.com/Azure/azure-cli-extensions/tree/main/src/cosmosdb-preview#enable-materialized-views-on-a-existing-cosmosdb-account)

Enable Materialized View for account using `az cosmosdb update`.

```azurecli
az cosmosdb update --resource-group "TestRG" --name "testaccount" --enable-materialized-views true --capabilities "CassandraEnableMaterializedViews"
```

#### Using AZ REST

```azurecli
az rest --method PATCH --uri https://management.azure.com/subscriptions/074d02eb-4d74-486a-b299-b262264d1536/resourcegroups/TestRG/providers/Microsoft.DocumentDb/databaseAccounts/testaccount?api-version=2021-11-15-preview --body @body.txt 
```

```json
{
  "properties": {
    "capabilities": [
      {
        "name": "CassandraEnableMaterializedViews"
      }
    ],
    "enableMaterializedViews": true
  }
}
```

### Under the hood

Azure Cosmos DB Cassandra API uses a MV builder compute layer to maintain Materialized views.

Customer gets flexibility to configure the MV builder compute instances depending on the latency and lag requirements to hydrate the views. From a technical stand point, this compute layer helps manage connections between partitions in a more efficient manner even when the data size is huge and the number of partitions is high.

The compute containers are shared among all MVs within the database account. Each provisioned compute container spawns off multiple tasks that read change feed from base table partitions and write data to MV (which is also another table) after transforming them as per MV definition for every MV in the database account.

### Create a materialized view builder

#### Using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB API for Cassandra account.

1. Go to the **Materialized View Builder** pane underneath the **Settings** section.

    > [!NOTE]
    > This pane will show up only when Materialized View feature is enabled as mentioned previously in the documentation.

1. Select **Materialized View Builder**.

1. Configure the builder.

:::image type="content" source="./media/materialized-view/provision_mv_builder.png" alt-text="Provision Materialized view builder on portal for Azure Cosmos DB API for Cassandra":::

#### Using Azure CLI

Please use this link to install Microsoft Azure CLI 'cosmosdb-preview' Extension: [Azure CLI extension overview](https://learn.microsoft.com/cli/azure/azure-cli-extensions-overview)

Refer to this link on documentation for  Azure CLI command to create Materialized View builder: [Azure CLI documentation](https://github.com/Azure/azure-cli-extensions/tree/main/src/cosmosdb-preview#create-a-cosmosdb-materialized-views-builder-service-resource)

Enable Materialized View for account using command as in below example

   ```azurecli
az cosmosdb service create --resource-group "TestRG" --account-name "testaccount" --name "MaterializedViewsBuilder" --kind "MaterializedViewsBuilder" --count 1 --size "Cosmos.D4s"
   ```

#### Using the REST API and Azure CLI

Following this step, you'll also need to provision a Materialized View Builder:

```azurecli
az rest --method PUT --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}/services/materializedViewsBuilder?api-version=2021-07-01-preview --body @body.txt
```

```json
{
  "properties": {
    "serviceType": "materializedViewsBuilder",
    "instanceCount": 1,
    "instanceSize": "Cosmos.D4s"
  }
}
```

Wait for a couple of minutes and check the status using `az rest` again, the status in the output should now be `Running`:

```azurecli
az rest --method GET --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}/services/materializedViewsBuilder?api-version=2021-07-01-preview
```

### Create materialized View

#### Using CQL commands

Once your account and Materialized View Builder is set up, you should be able to create Materialized views using CQLSH. Example provided below.

Install standalone CQLSH tool using the link [CQLSH Tool](https://learn.microsoft.com/azure/cosmos-db/cassandra/support#cql-shell)

Update Connection String

Quickstart: [API for Cassandra with CQLSH - Azure Cosmos DB | Microsoft Learn](https://learn.microsoft.com/azure/cosmos-db/cassandra/manage-data-cqlsh#update-your-connection-string)

CQL commands to create MV

```
test@cqlsh> CREATE KEYSPACE IF NOT EXISTS uprofile 

   ... WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 }; 

test@cqlsh> CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text); 

test@cqlsh> CREATE MATERIALIZED VIEW uprofile.user_by_bcity AS  SELECT user_id, user_name, user_bcity FROM uprofile.user WHERE user_id IS NOT NULL AND user_bcity IS NOT NULL PRIMARY KEY (user_bcity, user_id); 

test@cqlsh> INSERT INTO  uprofile.user (user_id, user_name, user_bcity) VALUES (101,'johnjoe','New York'); 

test@cqlsh> INSERT INTO  uprofile.user (user_id, user_name, user_bcity) VALUES (102,'james','New York') 

            ... ; 

test@cqlsh> SELECT * FROM user_by_bcity; 
```

```output
 user_bcity | user_id | user_name 
------------+---------+----------- 
   New York |     101 |   johnjoe 
   New York |     102 |     james 

(2 rows) 
```

#### Using Resource Provider (RP)

You can use RP to Create/Update Cassandra View as given below.

Cassandra Resources - Create Update Cassandra View - REST API (Azure Cosmos DB Resource Provider) | Microsoft Learn [Link](https://learn.microsoft.com/rest/api/cosmos-db-resource-provider/2021-11-15-preview/cassandra-resources/create-update-cassandra-view?tabs=HTTP)

Similarly you can navigate on the above link and perform the following as well.

Cassandra Resources - Delete Cassandra View - REST API (Azure Cosmos DB Resource Provider) | Microsoft Learn
Cassandra Resources - Get Cassandra View - REST API (Azure Cosmos DB Resource Provider) | Microsoft Learn
Cassandra Resources - List Cassandra Views - REST API (Azure Cosmos DB Resource Provider) | Microsoft Learn
Cassandra Resources - Update Cassandra View Throughput - REST API (Azure Cosmos DB Resource Provider) | Microsoft Learn

## Caveats and current limitations

However, there are a few caveats with Cosmos DB Cassandra API’s preview implementation of Materialized Views:

- Materialized Views can't be created on a table that existed before the account was onboarded to support materialized views. Create new table after account is onboarded on which materialized views can be defined.
- For the MV definition’s WHERE clause, only “IS NOT NULL” filters are currently allowed.
- After a Materialized View is created against a base table, ALTER TABLE ADD operations aren't allowed on the base table’s schema - they're allowed only if none of the MVs have select * in their definition.
- We have limits on partition key size (2Kb) and total length of clustering key size (1Kb). If this is violated, the message will end up in poison message queue.
- If source table has UDT and MV definition has either "select * from" or has the UDT in one of projected columns, UDT update is not permitted on the account.
- Materialized View may become inconsistent with the source table for a small number of rows after automatic regional failover. Our suggestion is to rebuild the MV in this case.
- At the moment, creating MV builder instances with 32 cores is not supported. If needed, you can provision multiple instances with smaller number of cores.

In addition to the above, note the following limitations

### Availability zones limitations

- Materialized views can't be enabled on an account that has Availability zone enabled regions.
- Adding a new region with Availability zone is not supported once “enableMaterializedViews” is set to true on the account.

### Periodic backup and restore limitations

Materialized views aren't automatically restored with the restore process. Customer needs to re-create the materialized views after the restore process is complete. Customer needs to enableMaterializedViews on their restored account before creating the materialized views and provision the builders for the materialized views to be built.

### Other limitations similar to **Open Source Apache Cassandra** behavior

- Defining Conflict resolution policy on Materialized Views is not allowed.
- Write operations from customer aren't allowed on Materialized views.
- Cross document queries and use of aggregate functions aren't supported on Materialized views.
- Materialized View schema cannot be modifed after creation.
- Deleting base table is not allowed if at least one MV is defined on it. All the MVs must first be deleted and then the base table can be deleted.
- Defining materialized views on containers with Static columns is not allowed

## Frequently asked questions (FAQs) …

### What transformations/actions are supported?

- Specifying a partition key that is different from base table partition key.
- Support for projecting selected subset of columns from base table.
- Determine if row from base table can be part of materialized view based on conditions evaluated on primary key columns of base table row. Filters supported - equalities, inequalities, contains. (Planned for GA)

### What consistency levels will be supported?

Data in materialized view is eventually consistent. User might read stale rows when compared to data on base table due to redo of some operations on MVs. This behavior is acceptable since we guarantee only eventual consistency on the MV. Customers can configure (scale up and scale down) the MV builder layer depending on the latency requirement for the view to be consistent with base table.

### Will there be an autoscale layer for the MV builder instances?

Autoscaling for MV builder is not available right now. The MV builder instances can be manually scaled by modifying the instance count(scale out) or instance size(scale up).

### Details on the billing model

The proposed billing model will be to charge the customers for:

**MV Builder compute nodes** MV Builder Compute – Single tenant layer

**Storage** The OLTP storage of the base table and MV based on existing storage meter for Containers. LogStore won't be charged.

**Request Units** The provisioned RUs for base container and Materialized View.

### What are the different SKUs that will be available?

Refer to Pricing - [Azure Cosmos DB | Microsoft Azure](https://azure.microsoft.com/pricing/details/cosmos-db/) and check instances under Dedicated Gateway

### What type of TTL support do we have?

TTL from base table rows will be applied on MV as well. Setting table level TTL on MV is not allowed.

### Initial troubleshooting if MVs aren't up to date:

- Check if MV builder instances are provisioned
- Check if enough RUs are provisioned on the base table
- Check for unavailability on Base table or MV

### What type of monitoring is available in addition to the existing monitoring for Cassandra API?

- Max Materialized View Catchup Gap in Minutes – Value(t) indicates rows written to base table in last ‘t’ minutes is yet to be propagated to MV.
- Metrics related to RUs consumed on base table for MV build (read change feed cost)
- Metrics related to RUs consumed on MV for MV build (write cost)
- Metrics related to resource consumption on MV builders (CPU, memory usage metrics)

:::image type="content" source="./media/materialized-view/monitoring1.png" alt-text=" Catchup Metrics Screenshot for Materialized view feature on portal Azure Cosmos DB API for Cassandra":::

:::image type="content" source="./media/materialized-view/monitoring2.png" alt-text="CPU Usage Metrics Screenshot for Materialized view feature on portal Azure Cosmos DB API for Cassandra":::

:::image type="content" source="./media/materialized-view/monitoring3.png" alt-text="Memory Metrics Screenshot for Materialized view feature on portal Azure Cosmos DB API for Cassandra":::

:::image type="content" source="./media/materialized-view/monitoring4.png" alt-text="Max CPU Metrics Screenshot for Materialized view feature on portal Azure Cosmos DB API for Cassandra":::

### What are the restore options available for MVs?

MVs can't be restored. Hence, MVs will need to be recreated once the base table is restored.

### Can you create more than one view on a base table?

Multiple views can be created on the same base table. Limit of five views is enforced.

### How is uniqueness enforced on the materialized view? How will the mapping between the records in base table to the records in materialized view look like?

The partition and clustering key of the base table are always part of primary key of any materialized view defined on it and enforce uniqueness of primary key after data repartitioning.

### Can we add or remove columns on the base table once materialized view is defined?

You'll be able to add a column to the base table, but you won't be able to remove a column. After a MV is created against a base table, ALTER TABLE ADD operations aren't allowed on the base table - they're allowed only if none of the MVs have select * in their definition. Cassandra doesn't support dropping columns on the base table if it has a materialized view defined on it.

### Can we create MV on existing base table?

No. Materialized Views can't be created on a table that existed before the account was onboarded to support materialized views. Create new table after account is onboarded on which materialized views can be defined. MV on existing table is planned for the future.

### What are the conditions on which records won't make it to MV and how to identify such records?

Below are some of the identified cases where data from base table can't be written to MV as they violate some constraints on MV table:

- Rows that don’t satisfy partition key size limit in the materialized views (2kb limit)
- Rows that don't satisfy clustering key size limit in materialized views (1kb limit)

Currently we drop these rows but plan to expose details related to dropped rows in future so that the user can reconcile the missing data.

### Materialized View with Customer Managed Keys

To create an account with support for customer managed keys and materialized views please reach out to Cosmos DB support team.
