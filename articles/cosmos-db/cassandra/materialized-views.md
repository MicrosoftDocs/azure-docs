---
title: Materialized Views for Azure Cosmos DB for Apache Cassandra. (Preview)
description: This documentation is provided as a resource for participants in the preview of Azure Cosmos DB for Apache Cassandra Materialized View.
author: dileepraotv-github
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/06/2022
ms.author: turao
---

# Enable materialized views for Azure Cosmos DB for Apache Cassandra operations (Preview)
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

> [!IMPORTANT]
> Materialized Views for Azure Cosmos DB for Apache Cassandra is currently in gated preview. Please send an email to mv-preview@microsoft.com to try this feature.
> Materialized View preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Feature overview

Materialized Views when defined will help provide a means to efficiently query a base table (container on Azure Cosmos DB) with non-primary key filters. When users write to the base table, the Materialized view is built automatically in the background. This view can have a different primary key for lookups. The view will also contain only the projected columns from the base table. It will be a read-only table.

You can query a column store without specifying a partition key by using Secondary Indexes. However, the query won't be effective for columns with high cardinality (scanning through all data for a small result set) or columns with low cardinality. Such queries end up being expensive as they end up being a cross partition query.

With Materialized view, you can
- Use as Global Secondary Indexes and save cross partition scans that reduce expensive queries 
- Provide SQL based conditional predicate to populate only certain columns and certain data that meet the pre-condition 
- Real time MVs that simplify real time event based scenarios where customers today use Change feed trigger for precondition checks to populate new collections"

## Main benefits

- With Materialized View (Server side denormalization), you can avoid multiple independent tables and client side denormalization. 
- Materialized view feature takes on the responsibility of updating views in order to keep them consistent with the base table. With this feature, you can avoid dual writes to the base table and the view.
- Materialized Views helps optimize read performance
- Ability to specify throughput for the materialized view independently
- Based on the requirements to hydrate the view, you can configure the MV builder layer appropriately.
- Speeding up write operations as it only needs to be written to the base table.
- Additionally, This implementation on Azure Cosmos DB is based on a pull model, which doesn't affect the writer performance.



## How to get started?

New API for Cassandra accounts with Materialized Views enabled can be provisioned on your subscription by using REST API calls from az CLI. 

### Log in to the Azure command line interface

Install Azure CLI as mentioned at [How to install the Azure CLI | Microsoft Docs](/cli/azure/install-azure-cli) and log on using the below:
   ```azurecli-interactive
   az login
   ```

### Create an account

To create account with support for customer managed keys and materialized views skip to **this** section

To create an account, use the following command after creating body.txt with the below content, replacing {{subscriptionId}} with your subscription ID, {{resourceGroup}} with a resource group name that you should have created in advance, and {{accountName}} with a name for your API for Cassandra account. 

   ```azurecli-interactive
   az rest --method PUT --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}?api-version=2021-11-15-preview --body @body.txt
    body.txt content:
    {
    "location": "East US",
    "properties":
    {
        "databaseAccountOfferType": "Standard",
        "locations": [ { "locationName": "East US" } ],
        "capabilities": [ { "name": "EnableCassandra" }, { "name": "CassandraEnableMaterializedViews" }],
        "enableMaterializedViews": true
    }
    }
   ```

   Wait for a few minutes and check the completion using the below, the provisioningState in the output should have become Succeeded:
   ```
    az rest --method GET --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}?api-version=2021-11-15-preview
   ```
### Create an account with support for customer managed keys and materialized views

This step is optional – you can skip this step if you don't want to use Customer Managed Keys for your Azure Cosmos DB account.

To use Customer Managed Keys feature and Materialized views together on Azure Cosmos DB account, you must first configure managed identities with Azure Active Directory for your account and then enable support for materialized views.

You can use the documentation [here](../how-to-setup-cmk.md) to configure your Azure Cosmos DB Cassandra account with customer managed keys and setup managed identity access to the key Vault. Make sure you follow all the steps in [Using a managed identity in Azure key vault access policy](../how-to-setup-managed-identity.md). The next step to enable materializedViews on the account.

Once your account is set up with CMK and managed identity, you can enable materialized views on the account by enabling “enableMaterializedViews” property in the request body.

   ```azurecli-interactive
  az rest --method PATCH --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}?api-version=2021-07-01-preview --body @body.txt


body.txt content:
{
  "properties":
  {
    "enableMaterializedViews": true
  }
}
   ```


 Wait for a few minutes and check the completion using the below, the provisioningState in the output should have become Succeeded:
 ```
az rest --method GET --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}?api-version=2021-07-01-preview
```

Perform another patch to set “CassandraEnableMaterializedViews” capability and wait for it to succeed

```
az rest --method PATCH --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}?api-version=2021-07-01-preview --body @body.txt

body.txt content:
{
  "properties":
  {
    	"capabilities":
[{"name":"EnableCassandra"},
 {"name":"CassandraEnableMaterializedViews"}]
  }
}
```

### Create materialized view builder

Following this step, you'll also need to provision a Materialized View Builder:

```
az rest --method PUT --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}/services/materializedViewsBuilder?api-version=2021-07-01-preview --body @body.txt

body.txt content:
{
  "properties":
  {
    "serviceType": "materializedViewsBuilder",
    "instanceCount": 1,
    "instanceSize": "Cosmos.D4s"
  }
}
```

Wait for a couple of minutes and check the status using the below, the status in the output should have become Running:

```
az rest --method GET --uri https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroup}}/providers/Microsoft.DocumentDb/databaseAccounts/{{accountName}}/services/materializedViewsBuilder?api-version=2021-07-01-preview
```

## Caveats and current limitations

Once your account and Materialized View Builder is set up, you should be able to create Materialized views per the documentation [here](https://cassandra.apache.org/doc/latest/cql/mvs.html) : 

However, there are a few caveats with Azure Cosmos DB for Apache Cassandra’s preview implementation of Materialized Views:
- Materialized Views can't be created on a table that existed before the account was onboarded to support materialized views. Create new table after account is onboarded on which materialized views can be defined.
- For the MV definition’s WHERE clause, only “IS NOT NULL” filters are currently allowed.
- After a Materialized View is created against a base table, ALTER TABLE ADD operations aren't allowed on the base table’s schema - they're allowed only if none of the MVs have select * in their definition.

In addition to the above, note the following limitations 

### Availability zones limitations

- Materialized views can't be enabled on an account that has Availability zone enabled regions. 
- Adding a new region with Availability zone is not supported once “enableMaterializedViews” is set to true on the account.

### Periodic backup and restore limitations

Materialized views aren't automatically restored with the restore process. Customer needs to re-create the materialized views after the restore process is complete. Customer needs to enableMaterializedViews on their restored account before creating the materialized views and provision the builders for the materialized views to be built.

Other limitations similar to **Open Source Apache Cassandra** behavior

- Defining Conflict resolution policy on Materialized Views is not allowed.
- Write operations from customer aren't allowed on Materialized views.
- Cross document queries and use of aggregate functions aren't supported on Materialized views.
- Modifying MaterializedViewDefinitionString after MV creation is not supported.
- Deleting base table is not allowed if at least one MV is defined on it. All the MVs must first be deleted and then the base table can be deleted.
- Defining materialized views on containers with Static columns is not allowed

## Under the hood

Azure Cosmos DB for Apache Cassandra uses a MV builder compute layer to maintain Materialized views. Customer gets flexibility to configure the MV builder compute instances depending on the latency and lag requirements to hydrate the views. The compute containers are shared among all MVs within the database account. Each provisioned compute container spawns off multiple tasks that read change feed from base table partitions and write data to MV (which is also another table) after transforming them as per MV definition for every MV in the database account.

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

**MV Builder compute nodes**	MV Builder Compute – Single tenant layer

**Storage**	The OLTP storage of the base table and MV based on existing storage meter for Containers. LogStore won't be charged.

**Request Units**	The provisioned RUs for base container and Materialized View.

### What are the different SKUs that will be available?
Refer to Pricing - [Azure Cosmos DB | Microsoft Azure](https://azure.microsoft.com/pricing/details/cosmos-db/) and check instances under Dedicated Gateway

### What type of TTL support do we have?

Setting table level TTL on MV is not allowed. TTL from base table rows will be applied on MV as well.


### Initial troubleshooting if MVs aren't up to date: 
- Check if MV builder instances are provisioned
- Check if enough RUs are provisioned on the base table
- Check for unavailability on Base table or MV

### What type of monitoring is available in addition to the existing monitoring for API for Cassandra?

- Max Materialized View Catchup Gap in Minutes – Value(t) indicates rows written to base table in last ‘t’ minutes is yet to be propagated to MV. 
- Metrics related to RUs consumed on base table for MV build (read change feed cost)
- Metrics related to RUs consumed on MV for MV build (write cost)
- Metrics related to resource consumption on MV builders (CPU, memory usage metrics)


### What are the restore options available for MVs?
MVs can't be restored. Hence, MVs will need to be recreated once the base table is restored.

### Can you create more than one view on a base table?

Multiple views can be created on the same base table. Limit of five views is enforced. 

### How is uniqueness enforced on the materialized view? How will the mapping between the records in base table to the records in materialized view look like?

The partition and clustering key of the base table are always part of primary key of any materialized view defined on it and enforce uniqueness of primary key after data repartitioning.

### Can we add or remove columns on the base table once materialized view is defined?

You'll be able to add a column to the base table, but you won't be able to remove a column. After a MV is created against a base table, ALTER TABLE ADD operations aren't allowed on the base table - they're allowed only if none of the MVs have select * in their definition. Cassandra doesn't support dropping columns on the base table if it has a materialized view defined on it.

### Can we create MV on existing base table?

No. Materialized Views can't be created on a table that existed before the account was onboarded to support materialized views. You would need to create a new table with materialized views defined and move the existing data using [container copy jobs](../intra-account-container-copy.md). MV on existing table is planned for the future.

### What are the conditions on which records won't make it to MV and how to identify such records?

Below are some of the identified cases where data from base table can't be written to MV as they violate some constraints on MV table-
- Rows that don’t satisfy partition key size limit in the materialized views
- Rows that don't satisfy clustering key size limit in materialized views
       
Currently we drop these rows but plan to expose details related to dropped rows in future so that the user can reconcile the missing data.
