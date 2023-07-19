---
title: Set a table's log data plan to Basic Logs or Analytics Logs
description: Learn how to use Basic Logs and Analytics Logs to reduce costs and take advantage of advanced features and analytics capabilities in Azure Monitor Logs.
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: how-to
ms.date: 04/17/2023
---

# Set a table's log data plan to Basic or Analytics

Azure Monitor Logs offers two log data plans that let you reduce log ingestion and retention costs and take advantage of Azure Monitor's advanced features and analytics capabilities based on your needs: 

- The default **Analytics** log data plan provides full analysis capabilities and makes log data available for queries, Azure Monitor features, such as alerts, and use by other services. 
- The **Basic** log data plan lets you save on the cost of ingesting and storing high-volume verbose logs in your Log Analytics workspace for debugging, troubleshooting, and auditing, but not for analytics and alerts. 

This article describes Azure Monitor's log data plans and explains how to configure the log data plan of the tables in your Log Analytics workspace.


## Permissions

To set a table's log data plan, you must have at least [contributor rights](../logs/manage-access.md#azure-rbac).

## Compare the Basic and Analytics log data plans 

The following table summarizes the Basic and Analytics log data plans. 

| Category | Analytics | Basic |
|:---|:---|:---|
| Ingestion | Regular ingestion cost. | Reduced ingestion cost. |
| Log queries | Full query capabilities<br/>No extra cost. | [Basic query capabilities](basic-logs-query.md#limitations).<br/>Pay-per-use.|
| Retention |  [Configure retention from 30 days to two years](data-retention-archive.md). | Retention fixed at eight days.<br/>When you change an existing table's plan to Basic logs, [Azure archives data](data-retention-archive.md) that's more than eight days old but still within the table's original retention period. |
| Alerts | Supported. | Not supported. |

> [!NOTE]
> The Basic log data plan isn't available for workspaces in [legacy pricing tiers](cost-logs.md#legacy-pricing-tiers).

## When should I use Basic logs?

By default, all tables in your Log Analytics workspace are Analytics tables, and they're available for query and alerts. 

Configure a table for Basic logs if:

- You don't require more than eight days of data retention for the table.
- You only require basic queries of the data using a [limited version of the query language](basic-logs-query.md#limitations).
- The cost savings for data ingestion exceed the expected cost for any expected queries.
- The table [supports Basic logs](#supported-tables). 
    
## Set a table's log data plan

When you change a table's plan from Analytics to Basic, Log Analytics immediately archives any data that's older than eight days and up to original data retention of the table. In other words, the total retention period of the table remains unchanged, unless you explicitly [modify the archive period](../logs/data-retention-archive.md). 

When you change a table's plan from Basic to Analytics, the changes take affect on existing data in the table immediately.

> [!NOTE]
> You can switch a table's plan once a week. 
# [Portal](#tab/portal-1)

To configure a table for Basic logs or Analytics logs in the Azure portal:

1. From the **Log Analytics workspaces** menu, select **Tables**.

    The **Tables** screen lists all the tables in the workspace.

1. Select the context menu for the table you want to configure and select **Manage table**.

    :::image type="content" source="media/basic-logs-configure/log-analytics-table-configuration.png" lightbox="media/basic-logs-configure/log-analytics-table-configuration.png" alt-text="Screenshot that shows the Manage table button for one of the tables in a workspace.":::

1. From the **Table plan** dropdown on the table configuration screen, select **Basic** or **Analytics**.

    The **Table plan** dropdown is enabled only for [tables that support Basic logs](#when-should-i-use-basic-logs).

    :::image type="content" source="media/basic-logs-configure/log-analytics-configure-table-plan.png" lightbox="media/basic-logs-configure/log-analytics-configure-table-plan.png" alt-text="Screenshot that shows the Table plan dropdown on the table configuration screen.":::

1. Select **Save**.

# [API](#tab/api-1)

To configure a table for Basic logs or Analytics logs, call the [Tables - Update API](/rest/api/loganalytics/tables/create-or-update):

```http
PATCH https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/tables/<tableName>?api-version=2021-12-01-preview
```

> [!IMPORTANT]
> Use the bearer token for authentication. Learn more about [using bearer tokens](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx).

**Request body**

|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Possible values are `Analytics` and `Basic`.|

**Example**

This example configures the `ContainerLogV2` table for Basic logs.

Container insights uses `ContainerLog` by default. To switch to using `ContainerLogV2` for Container insights, [enable the ContainerLogV2 schema](../containers/container-insights-logging-v2.md) before you convert the table to Basic logs.

**Sample request**

```http
PATCH https://management.azure.com/subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace/tables/ContainerLogV2?api-version=2021-12-01-preview
```

Use this request body to change to Basic logs:

```http
{
    "properties": {
        "plan": "Basic"
    }
}
```

Use this request body to change to Analytics Logs:

```http
{
    "properties": {
        "plan": "Analytics"
    }
}
```

**Sample response**

This sample is the response for a table changed to Basic logs:

Status code: 200

```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 22,
        "plan": "Basic",
        "lastPlanModifiedDate": "2022-01-01T14:34:04.37",
        "schema": {...}        
    },
    "id": "subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace",
    "name": "ContainerLogV2"
}
```

# [CLI](#tab/cli-1)

To configure a table for Basic logs or Analytics logs, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command and set the `--plan` parameter to `Basic` or `Analytics`.

For example:

- To set Basic logs:

    ```azurecli
    az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name ContainerLogV2  --plan Basic
    ```

- To set Analytics Logs:

    ```azurecli
    az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name ContainerLogV2  --plan Analytics
    ```

# [PowerShell](#tab/azure-powershell)

To configure a table's log data plan, use the [Update-AzOperationalInsightsTable](/powershell/module/az.operationalinsights/Update-AzOperationalInsightsTable) cmdlet:

```powershell
Update-AzOperationalInsightsTable  -ResourceGroupName RG-NAME -WorkspaceName WORKSPACE-NAME -Plan Basic|Analytics
```

---

## Supported tables

These tables currently support Basic logs:

All custom tables created with or migrated to the [data collection rule (DCR)-based logs ingestion API.](logs-ingestion-api-overview.md).

| Service | Table |
|:---|:---|
| Active Directory | [AADDomainServicesDNSAuditsGeneral](/azure/azure-monitor/reference/tables/AADDomainServicesDNSAuditsGeneral)<br> [AADDomainServicesDNSAuditsDynamicUpdates](/azure/azure-monitor/reference/tables/AADDomainServicesDNSAuditsDynamicUpdates) |
| API Management | [ApiManagementGatewayLogs](/azure/azure-monitor/reference/tables/ApiManagementGatewayLogs)<br>[ApiManagementWebSocketConnectionLogs](/azure/azure-monitor/reference/tables/ApiManagementWebSocketConnectionLogs) |
| Application Insights | [AppTraces](/azure/azure-monitor/reference/tables/apptraces) |
| Bare Metal Machines | [NCBMSystemLogs](/azure/azure-monitor/reference/tables/NCBMSystemLogs)<br>[NCBMSecurityLogs](/azure/azure-monitor/reference/tables/NCBMSecurityLogs) |
| Chaos Experiments | [ChaosStudioExperimentEventLogs](/azure/azure-monitor/reference/tables/ChaosStudioExperimentEventLogs) |
| Cloud HSM | [CHSMManagementAuditLogs](/azure/azure-monitor/reference/tables/CHSMManagementAuditLogs) |
| Container Apps | [ContainerAppConsoleLogs](/azure/azure-monitor/reference/tables/containerappconsoleLogs) |
| Container Insights | [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2) |
| Container Apps Environments | [AppEnvSpringAppConsoleLogs](/azure/azure-monitor/reference/tables/AppEnvSpringAppConsoleLogs) |
| Communication Services | [ACSCallAutomationIncomingOperations](/azure/azure-monitor/reference/tables/ACSCallAutomationIncomingOperations)<br>[ACSCallAutomationMediaSummary](/azure/azure-monitor/reference/tables/ACSCallAutomationMediaSummary)<br>[ACSCallRecordingIncomingOperations](/azure/azure-monitor/reference/tables/ACSCallRecordingIncomingOperations)<br>[ACSCallRecordingSummary](/azure/azure-monitor/reference/tables/ACSCallRecordingSummary)<br>[ACSCallSummary](/azure/azure-monitor/reference/tables/ACSCallSummary)<br>[ACSRoomsIncomingOperations](/azure/azure-monitor/reference/tables/acsroomsincomingoperations) |
| Confidential Ledgers | [CCFApplicationLogs](/azure/azure-monitor/reference/tables/CCFApplicationLogs) |
| Data Manager for Energy | [OEPDataplaneLogs](/azure/azure-monitor/reference/tables/OEPDataplaneLogs) |
| Dedicated SQL Pool | [SynapseSqlPoolSqlRequests](/azure/azure-monitor/reference/tables/synapsesqlpoolsqlrequests)<br>[SynapseSqlPoolRequestSteps](/azure/azure-monitor/reference/tables/synapsesqlpoolrequeststeps)<br>[SynapseSqlPoolExecRequests](/azure/azure-monitor/reference/tables/synapsesqlpoolexecrequests)<br>[SynapseSqlPoolDmsWorkers](/azure/azure-monitor/reference/tables/synapsesqlpooldmsworkers)<br>[SynapseSqlPoolWaits](/azure/azure-monitor/reference/tables/synapsesqlpoolwaits) |
| Dev Center | [DevCenterDiagnosticLogs](/azure/azure-monitor/reference/tables/DevCenterDiagnosticLogs) |
| Data Transfer | [DataTransferOperations](/azure/azure-monitor/reference/tables/DataTransferOperations) |
| Event Hubs | [AZMSArchiveLogs](/azure/azure-monitor/reference/tables/AZMSArchiveLogs)<br>[AZMSAutoscaleLogs](/azure/azure-monitor/reference/tables/AZMSAutoscaleLogs)<br>[AZMSCustomerManagedKeyUserLogs](/azure/azure-monitor/reference/tables/AZMSCustomerManagedKeyUserLogs)<br>[AZMSKafkaCoordinatorLogs](/azure/azure-monitor/reference/tables/AZMSKafkaCoordinatorLogs)<br>[AZMSKafkaUserErrorLogs](/azure/azure-monitor/reference/tables/AZMSKafkaUserErrorLogs) |
| Firewalls | [AZFWFlowTrace](/azure/azure-monitor/reference/tables/AZFWFlowTrace) |
| Health Care APIs | [AHDSMedTechDiagnosticLogs](/azure/azure-monitor/reference/tables/AHDSMedTechDiagnosticLogs)<br>[AHDSDicomDiagnosticLogs](/azure/azure-monitor/reference/tables/AHDSDicomDiagnosticLogs)<br>[AHDSDicomAuditLogs](/azure/azure-monitor/reference/tables/AHDSDicomAuditLogs) |
| Key Vault | [AZKVAuditLogs](/azure/azure-monitor/reference/tables/AZKVAuditLogs)<br>[AZKVPolicyEvaluationDetailsLogs](/azure/azure-monitor/reference/tables/AZKVPolicyEvaluationDetailsLogs) |
| Kubernetes services | [AKSAudit](/azure/azure-monitor/reference/tables/AKSAudit)<br>[AKSAuditAdmin](/azure/azure-monitor/reference/tables/AKSAuditAdmin)<br>[AKSControlPlane](/azure/azure-monitor/reference/tables/AKSControlPlane) | 
| Managed Lustre | [AFSAuditLogs](/azure/azure-monitor/reference/tables/AFSAuditLogs) |
| Media Services | [AMSLiveEventOperations](/azure/azure-monitor/reference/tables/AMSLiveEventOperations)<br>[AMSKeyDeliveryRequests](/azure/azure-monitor/reference/tables/AMSKeyDeliveryRequests)<br>[AMSMediaAccountHealth](/azure/azure-monitor/reference/tables/AMSMediaAccountHealth)<br>[AMSStreamingEndpointRequests](/azure/azure-monitor/reference/tables/AMSStreamingEndpointRequests) |
| Nexus Clusters | [NCCKubernetesLogs](/azure/azure-monitor/reference/tables/NCCKubernetesLogs)<br>[NCCVMOrchestrationLogs](/azure/azure-monitor/reference/tables/NCCVMOrchestrationLogs) |
| Nexus Storage Appliances | [NCSStorageLogs](/azure/azure-monitor/reference/tables/NCSStorageLogs)<br>[NCSStorageAlerts](/azure/azure-monitor/reference/tables/NCSStorageAlerts) |
| Redis Cache Enterprise | [REDConnectionEvents](/azure/azure-monitor/reference/tables/REDConnectionEvents) |
| Relays | [AZMSHybridConnectionsEvents](/azure/azure-monitor/reference/tables/AZMSHybridConnectionsEvents) |
| Service Bus | [AZMSApplicationMetricLogs](/azure/azure-monitor/reference/tables/AZMSApplicationMetricLogs)<br>[AZMSOperationalLogs](/azure/azure-monitor/reference/tables/AZMSOperationalLogs)<br>[AZMSRunTimeAuditLogs](/azure/azure-monitor/reference/tables/AZMSRunTimeAuditLogs)<br>[AZMSVNetConnectionEvents](/azure/azure-monitor/reference/tables/AZMSVNetConnectionEvents) |
| Sphere | [ASCAuditLogs](/azure/azure-monitor/reference/tables/ASCAuditLogs)<br>[ASCDeviceEvents](/azure/azure-monitor/reference/tables/ASCDeviceEvents) |
| Storage | [StorageBlobLogs](/azure/azure-monitor/reference/tables/StorageBlobLogs)<br>[StorageFileLogs](/azure/azure-monitor/reference/tables/StorageFileLogs)<br>[StorageQueueLogs](/azure/azure-monitor/reference/tables/StorageQueueLogs)<br>[StorageTableLogs](/azure/azure-monitor/reference/tables/StorageTableLogs) |
| Synapse | [SynapseSqlPoolExecRequests](/azure/azure-monitor/reference/tables/SynapseSqlPoolExecRequests)<br>[SynapseSqlPoolRequestSteps](/azure/azure-monitor/reference/tables/SynapseSqlPoolRequestSteps)<br>[SynapseSqlPoolDmsWorkers](/azure/azure-monitor/reference/tables/SynapseSqlPoolDmsWorkers)<br>[SynapseSqlPoolWaits](/azure/azure-monitor/reference/tables/SynapseSqlPoolWaits) |
| Storage Mover | [StorageMoverJobRunLogs](/azure/azure-monitor/reference/tables/StorageMoverJobRunLogs)<br>[StorageMoverCopyLogsFailed](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsFailed)<br>[StorageMoverCopyLogsTransferred](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsTransferred)<br> |
| Virtual Network Manager  | [AVNMNetworkGroupMembershipChange](/azure/azure-monitor/reference/tables/AVNMNetworkGroupMembershipChange) |
    
> [!NOTE]
> Tables created with the [Data Collector API](data-collector-api.md) don't support Basic logs.

## Next steps

- [View table properties](../logs/manage-logs-tables.md#view-table-properties)
- [Set retention and archive policies](../logs/data-retention-archive.md)
- [Query data in Basic logs](basic-logs-query.md)
