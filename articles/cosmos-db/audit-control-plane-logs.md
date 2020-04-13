---
title: How to audit Azure Cosmos DB control plane operations
description: Learn how to audit the control plane operations such as add a region, update throughput, region failover, add a VNet etc. in Azure Cosmos DB
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: sngun

---

# How to audit Azure Cosmos DB control plane operations

Control Plane for Cosmos DB is a RESTful service that enables customers to perform diverse set of operations on the Cosmos DB account. It exposes public resource model (e.g. database account) and exposes various operations to end-users to perform actions on resource model.Control plane operations include changes to the Azure Cosmos account or container. For example, create an Azure Cosmos account, add a region, update throughput, region failover, add a VNet etc. are some of the control plane operations. This article explains how to audit the control plane operations in Azure Cosmos DB.  These operations can be done through cli, powershell or portal for accounts and through cli and ps for containers. 

Couple examples of such scenarios
•	Customer wants to get an alert when firewall rules for Cosmos DB are modified. This is required to catch unauthorized modifications to rules that govern network security of the Cosmos DB account and take quick action. 
•	Customer wants to get an alert if a Cosmos DB region is added / removed. Add / remove region has implications on billing, data sovereignty requirements. The alert will help detect an accidental add / remove region on the Cosmos DB account. 
* Customer wants to get more detail from diagnostic log for what was changed for example in case a vnet was changed. 

## Disable key based metadata write access
 
Before you audit the control plane operations in Azure Cosmos DB, disable the key-based metadata write access on your account. When key based metadata write access is disabled, clients connecting to the Azure Cosmos account through account keys are prevented from accessing the account. You can disable write access by setting the `disableKeyBasedMetadataWriteAccess` property to true. After you set this property, changes to any resource can happen from a user with the proper Role-based access control(RBAC) role and credentials. To learn more on how to set this property, see the [Preventing changes from SDKs](role-based-access-control.md#preventing-changes-from-cosmos-sdk) article. 
This implies SDK based changes to throughput, index will not be rejected. 

 Consider the following points when turning off the metadata write access:

* Evaluate and ensure that your applications do not make metadata calls that change the above resources (For example, create collection, update throughput, …) by using the SDK or account keys.

* Currently, the Azure portal uses account keys for metadata operations and hence these operations will be blocked. Alternatively, use the Azure CLI, SDKs, or Resource Manager template deployments to perform such operations.

## Enable diagnostic logs for control plane operations

You can enable diagnostic logs for control plane operations by using the Azure portal.  Once enabled diagnostic log will record the operation as a pair of Start and Complete events with relevent details. For example RegionFailoverStart and RegionFailoverComplete will complete the RegionFailover event as start to end. 

Use the following steps to enable logging on control plane operations:

1. Sign into [Azure portal](https://portal.azure.com) and navigate to your Azure Cosmos account.

1. Open the **Diagnostic settings** pane, provide a **Name** for the logs to create.

1. Select **ControlPlaneRequests** for log type and select the **Send to Log Analytics** option.

You can also store the logs in a storage account or stream to an event hub. This article shows how to send logs to log analytics and then query them. After you enable, it takes a few minutes for the diagnostic logs to take effect. All the control plane operations performed after that point can be tracked. The following screenshot shows how to enable control plane logs:

![Enable control plane requests logging](./media/audit-control-plane-logs/enable-control-plane-requests-logs.png)

## View the control plane operations

After you turn on logging, use the following steps to track down operations for a specific account:

1. Sign into [Azure portal](https://portal.azure.com).
1. Open the **Monitor** tab from the left-hand navigation and then select the **Logs** pane. It opens a UI where you can easily run queries with that specific account in scope. Run the following query to view control plane logs:

   ```kusto
   AzureDiagnostics
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="ControlPlaneRequests"
   | where TimeGenerated >= ago(1h)
   ```

The following screenshots capture logs when a VNET is added to an Azure Cosmos account:

![Control plane logs when a VNet is added](./media/audit-control-plane-logs/add-ip-filter-logs.png)

The following screenshots capture logs when throughput of a Cassandra table is updated:

![Control plane logs when throughput is updated](./media/audit-control-plane-logs/throughput-update-logs.png)

## Identify the identity associated to a specific operation

If you want to debug further, you can identify a specific operation in the **Activity log** by using the Activity ID or by the timestamp of the operation. Timestamp is used for some Resource Manager clients where the activity ID is not explicitly passed. The Activity log gives details about the identity with which the operation was initiated. The following screenshot shows how to use the activity ID and find the operations associated with it in the Activity log:

![Use the activity ID and find the operations](./media/audit-control-plane-logs/find-operations-with-activity-id.png)

## Control plane operations for account which are emitted in metrics
Many operations are tracked at account level
* Region Added
* Region Removed
* Account Deleted
* Region Failed Over
* Account Created
* Virtual Network Deleted
* Account Network Settings Updated 
* Account Replication Settings  
* Updated Account Keys 
* Account Backup Settings Updated
* Account Diagnostic Settings Updated

## Control plane operations for database or containers emitted in metrics
* SQL Database Updated
* SQL Container Updated
* SQL Database Throughput Updated
* SQL Container Throughput Updated
* SQL Database Deleted
* SQL Container Deleted
* Cassandra Keyspace Updated
* Cassandra Table Updated
* Cassandra Keyspace Throughput Updated
* Cassandra Table Throughput Updated
* Cassandra Keyspace Deleted
* Cassandra Table Deleted
* Gremlin Database Updated
* Gremlin Graph Updated
* Gremlin Database Throughput Updated
* Gremlin Graph Throughput Updated
* Gremlin Database Deleted
* Gremlin Graph Deleted
* Mongo Database Updated
* Mongo Collection Updated
* Mongo Database Throughput Updated
* Mongo Collection Throughput Updated
* Mongo Database Deleted
* Mongo Collection Deleted
* AzureTable Table Updated
* AzureTable Table Throughput Updated
* AzureTable Table Deleted

## Diagnostic log operations
* RegionAddStart, RegionAddComplete
* RegionRemoveStart, RegionRemoveComplete
* AccountDeleteStart, AccountDeleteComplete
* RegionFailoverStart, RegionFailoverComplete
* AccountCreateStart, AccountCreateComplete
* AccountUpdateStart, AccountUpdateComplete
* VirtualNetworkDeleteStart, VirtualNetworkDeleteComplete
* DiagnosticLogUpdateStart, DiagnosticLogUpdateComplete
* ApiKind + ApiKindResourceType + OperationType + Start/Complete
* ApiKind + ApiKindResourceType + "Throughput" + operationType + Start/Complete

Ex: 
* CassandraKeyspacesUpdateStart, CassandraKeyspacesUpdateComplete
* CassandraKeyspacesThroughputUpdateStart, CassandraKeyspacesThroughputUpdateComplete

For the ApiKind operation ResourceDetails contains the  hole resource body coming as request payload  which will contain all the properties requested to update. 




## Next steps

* [Explore Azure Monitor for Azure Cosmos DB](../azure-monitor/insights/cosmosdb-insights-overview.md?toc=/azure/cosmos-db/toc.json&bc=/azure/cosmos-db/breadcrumb/toc.json)
* [Monitor and debug with metrics in Azure Cosmos DB](use-metrics.md)
