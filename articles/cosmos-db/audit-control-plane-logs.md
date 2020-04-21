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

Control plane operations include changes to the Azure Cosmos account or container. For example, create an Azure Cosmos account, add a region, update throughput, region failover, add a VNet etc. are some of the control plane operations. This article explains how to audit the control plane operations in Azure Cosmos DB.

## Disable key based metadata write access
 
Before you audit the control plane operations in Azure Cosmos DB, disable the key-based metadata write access on your account. When key based metadata write access is disabled, clients connecting to the Azure Cosmos account through account keys are prevented from accessing the account. You can disable write access by setting the `disableKeyBasedMetadataWriteAccess` property to true. After you set this property, changes to any resource can happen from a user with the proper Role-based access control(RBAC) role and credentials only. To learn more on how to set this property, see the [Preventing changes from SDKs](role-based-access-control.md#preventing-changes-from-cosmos-sdk) article.

 Consider the following points when turning off the metadata write access:

* Evaluate and ensure that your applications do not make metadata calls that change the above resources (For example, create collection, update throughput, …) by using the SDK or account keys.

* Currently, the Azure portal uses account keys for metadata operations and hence these operations will be blocked. Alternatively, use the Azure CLI, SDKs, or Resource Manager template deployments to perform such operations.

## Enable diagnostic logs for control plane operations

You can enable diagnostic logs for control plane operations by using the Azure portal. Use the following steps to enable logging on control plane operations:

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

## Next steps

* [Explore Azure Monitor for Azure Cosmos DB](../azure-monitor/insights/cosmosdb-insights-overview.md?toc=/azure/cosmos-db/toc.json&bc=/azure/cosmos-db/breadcrumb/toc.json)
* [Monitor and debug with metrics in Azure Cosmos DB](use-metrics.md)