---
title: Select a table plan based on data usage in a Log Analytics workspace
description: Use the Auxiliary, Basic, and Analytics Logs plans to reduce costs and take advantage of advanced analytics capabilities in Azure Monitor Logs.
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: how-to
ms.date: 05/01/2024
---

# Select a table plan based on data usage in a Log Analytics workspace

You can use one Log Analytics workspace to store any type of log required for any purpose. For example:

- High-volume, verbose data that requires **cheap long-term storage for audit and compliance**
- App and resource data for **troubleshooting** by developers
- Key event and performance data for scaling and alerting to ensure ongoing **operational excellence and security**
- Aggregated data trends for **advanced analytics and machine learning** 

Data plans let you manage data ingestion and retention costs based on how often you use the data in a table and the type of analysis you need the data for. This article explains what each data plan offers, which use cases it's optimal for, and how to configure the log plan of a table in your Log Analytics workspace.

## Select a table plan based on usage needs

The diagram and table below compare the Analytics, Basic, and Auxiliary log data plans.

:::image type="content" source="media/basic-logs-configure/azure-monitor-logs-data-plans.png" lightbox="media/basic-logs-configure/azure-monitor-logs-data-plans.png" alt-text="Diagram that presents an overview of the capabilities provided by the Analytics, Basic, and Auxiliary log data plans.":::

|                                                        | Analytics                                                    | Basic                                                        | Auxiliary (Preview)                                          |
| ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Best for                                               | High-value data used for continuous monitoring, real-time detection, and performance analytics. | Medium-touch data needed for troubleshooting and incident response. | Low-touch data, such as verbose logs, and data required for auditing and compliance. |
| Supported [table types](../logs/manage-logs-tables.md) | All table types                                              | [Azure tables that support Basic logs](#azure-tables-that-support-the-basic-data-plan) and DCR-based custom tables | DCR-based custom tables                                      |
| Log queries                                            | Full query capabilities.                                     | Full Kusto Query Language (KQL) on a single table, which you can extend with data from an Analytics table using [lookup](/azure/data-explorer/kusto/query/lookup-operator). | Full KQL on a single table, which you can extend with data from an Analytics table using [lookup](/azure/data-explorer/kusto/query/lookup-operator). |
| Query performance                                      | Fast                                                         | Fast                                                         | Slower                                                       |
| Alerts                                                 | ✅                                                            | ❌                                                            | ❌                                                            |
| Dashboards                                             | ✅                                                            | ❌                                                            | ✅                                                            |
| [Search jobs](../logs/search-jobs.md)                  | ✅                                                            | ✅                                                            | ✅                                                            |
| [Summary rules](../logs/summary-rules.md)              | ✅                                                            | ✅ KQL limited to a single table                              | ✅ KQL limited to a single table                              |
| [Restore](../logs/restore.md)                          | ✅                                                            | ✅                                                            | ❌                                                            |
| Pricing model                                          | **Ingestion** - Standard cost.<br>**Interactive retention** - Unlimited queries. Prorated monthly retention charge for extended interactive retention.<br>**Auxiliary retention** - Prorated monthly auxiliary retention charge. | **Ingestion** - Reduced cost.<br>**Interactive retention** - Pay-per-query.<br>**Auxiliary retention** - Prorated monthly auxiliary retention charge. | **Ingestion** - Minimal cost.<br>**Interactive retention** - Pay-per-query.<br>**Auxiliary retention** - Prorated monthly auxiliary retention charge. |
| Interactive retention                                  | 30 days (90 days for Microsoft Sentinel and Application Insights).<br> Can be extended to up to two years. | 30 days                                                      | 30 days                                                      |
| Total retention                                        | Up to 12 years                                               | Up to 12 years                                               | Up to 12 years                                               |

> [!NOTE]
> The Basic and Auxiliary log data plans aren't available for workspaces in [legacy pricing tiers](cost-logs.md#legacy-pricing-tiers).

## Permissions required

| Action | Permissions required |
|:-------|:---------------------|
| View log plan | `Microsoft.OperationalInsights/workspaces/tables/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example |
| Set log plan | `Microsoft.OperationalInsights/workspaces/write` and `microsoft.operationalinsights/workspaces/tables/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example |
  
## Configure the table plan

When you switch between the Analytics and Basic plans, the change takes effect on existing data in the table immediately. You can't transition between the Auxiliary plan the Analytics and Basic plans.

When you change a table's plan from Analytics to Basic, Azure monitor automatically converts any data that's older than 30 days to auxiliary retention based on the total retention period set for the table. In other words, the total retention period of the table remains unchanged, unless you explicitly [modify the auxiliary retention period](../logs/data-retention-archive.md). 

The portal sets the data plan of all new tables to Analytics by default, but you can switch between the Analytics and Basic plans, as described in this section. To create a new custom table with an Auxiliary plan, see [Create a custom table](create-custom-table.md#create-a-custom-table).


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

Container Insights uses `ContainerLog` by default. To switch to using `ContainerLogV2` for Container insights, [enable the ContainerLogV2 schema](../containers/container-insights-logging-v2.md) before you convert the table to Basic logs.

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
        "retentionInDays": 30,
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

## Azure tables that support the Basic data plan

All custom tables created with or migrated to the [data collection rule (DCR)-based logs ingestion API](logs-ingestion-api-overview.md) support Basic logs. 

These Azure tables currently support Basic logs:


| Service | Table |
|:---|:---|
| Microsoft Entra ID | [AADDomainServicesDNSAuditsGeneral](/azure/azure-monitor/reference/tables/AADDomainServicesDNSAuditsGeneral)<br> [AADDomainServicesDNSAuditsDynamicUpdates](/azure/azure-monitor/reference/tables/AADDomainServicesDNSAuditsDynamicUpdates)<br>[AADServicePrincipalSignInLogs](/azure/azure-monitor/reference/tables/AADServicePrincipalSignInLogs) |
| Azure Databricks | [DatabricksBrickStoreHttpGateway](/azure/azure-monitor/reference/tables/databricksbrickstorehttpgateway)<br>[DatabricksDataMonitoring](/azure/azure-monitor/reference/tables/databricksdatamonitoring)<br>[DatabricksFilesystem](/azure/azure-monitor/reference/tables/databricksfilesystem)<br>[DatabricksDashboards](/azure/azure-monitor/reference/tables/databricksdashboards)<br>[DatabricksCloudStorageMetadata](/azure/azure-monitor/reference/tables/databrickscloudstoragemetadata)<br>[DatabricksPredictiveOptimization](/azure/azure-monitor/reference/tables/databrickspredictiveoptimization)<br>[DatabricksIngestion](/azure/azure-monitor/reference/tables/databricksingestion)<br>[DatabricksMarketplaceConsumer](/azure/azure-monitor/reference/tables/databricksmarketplaceconsumer)<br>[DatabricksLineageTracking](/azure/azure-monitor/reference/tables/databrickslineagetracking)
| API Management | [ApiManagementGatewayLogs](/azure/azure-monitor/reference/tables/ApiManagementGatewayLogs)<br>[ApiManagementWebSocketConnectionLogs](/azure/azure-monitor/reference/tables/ApiManagementWebSocketConnectionLogs) |
| Application Gateways | [AGWAccessLogs](/azure/azure-monitor/reference/tables/AGWAccessLogs)<br>[AGWPerformanceLogs](/azure/azure-monitor/reference/tables/AGWPerformanceLogs)<br>[AGWFirewallLogs](/azure/azure-monitor/reference/tables/AGWFirewallLogs) |
| Application Gateway for Containers | [AGCAccessLogs](/azure/azure-monitor/reference/tables/AGCAccessLogs) |
| Application Insights | [AppTraces](/azure/azure-monitor/reference/tables/apptraces) |
| Bare Metal Machines | [NCBMSecurityDefenderLogs](/azure/azure-monitor/reference/tables/ncbmsecuritydefenderlogs)<br>[NCBMSystemLogs](/azure/azure-monitor/reference/tables/NCBMSystemLogs)<br>[NCBMSecurityLogs](/azure/azure-monitor/reference/tables/NCBMSecurityLogs) <br>[NCBMBreakGlassAuditLogs](/azure/azure-monitor/reference/tables/ncbmbreakglassauditlogs)|
| Chaos Experiments | [ChaosStudioExperimentEventLogs](/azure/azure-monitor/reference/tables/ChaosStudioExperimentEventLogs) |
| Cloud HSM | [CHSMManagementAuditLogs](/azure/azure-monitor/reference/tables/CHSMManagementAuditLogs) |
| Container Apps | [ContainerAppConsoleLogs](/azure/azure-monitor/reference/tables/containerappconsoleLogs) |
| Container Insights | [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2) |
| Container Apps Environments | [AppEnvSpringAppConsoleLogs](/azure/azure-monitor/reference/tables/AppEnvSpringAppConsoleLogs) |
| Communication Services | [ACSCallAutomationIncomingOperations](/azure/azure-monitor/reference/tables/ACSCallAutomationIncomingOperations)<br>[ACSCallAutomationMediaSummary](/azure/azure-monitor/reference/tables/ACSCallAutomationMediaSummary)<br>[ACSCallClientMediaStatsTimeSeries](/azure/azure-monitor/reference/tables/ACSCallClientMediaStatsTimeSeries)<br>[ACSCallClientOperations](/azure/azure-monitor/reference/tables/ACSCallClientOperations)<br>[ACSCallRecordingIncomingOperations](/azure/azure-monitor/reference/tables/ACSCallRecordingIncomingOperations)<br>[ACSCallRecordingSummary](/azure/azure-monitor/reference/tables/ACSCallRecordingSummary)<br>[ACSCallSummary](/azure/azure-monitor/reference/tables/ACSCallSummary)<br>[ACSJobRouterIncomingOperations](/azure/azure-monitor/reference/tables/ACSJobRouterIncomingOperations)<br>[ACSRoomsIncomingOperations](/azure/azure-monitor/reference/tables/acsroomsincomingoperations)<br>[ACSCallClosedCaptionsSummary](/azure/azure-monitor/reference/tables/acscallclosedcaptionssummary) |
| Confidential Ledgers | [CCFApplicationLogs](/azure/azure-monitor/reference/tables/CCFApplicationLogs) |
 Cosmos DB | [CDBDataPlaneRequests](/azure/azure-monitor/reference/tables/cdbdataplanerequests)<br>[CDBPartitionKeyStatistics](/azure/azure-monitor/reference/tables/cdbpartitionkeystatistics)<br>[CDBPartitionKeyRUConsumption](/azure/azure-monitor/reference/tables/cdbpartitionkeyruconsumption)<br>[CDBQueryRuntimeStatistics](/azure/azure-monitor/reference/tables/cdbqueryruntimestatistics)<br>[CDBMongoRequests](/azure/azure-monitor/reference/tables/cdbmongorequests)<br>[CDBCassandraRequests](/azure/azure-monitor/reference/tables/cdbcassandrarequests)<br>[CDBGremlinRequests](/azure/azure-monitor/reference/tables/cdbgremlinrequests)<br>[CDBControlPlaneRequests](/azure/azure-monitor/reference/tables/cdbcontrolplanerequests) |
| Cosmos DB for MongoDB (vCore) | [VCoreMongoRequests](/azure/azure-monitor/reference/tables/VCoreMongoRequests) |
|  Kubernetes clusters - Azure Arc | [ArcK8sAudit](/azure/azure-monitor/reference/tables/ArcK8sAudit)<br>[ArcK8sAuditAdmin](/azure/azure-monitor/reference/tables/ArcK8sAuditAdmin)<br>[ArcK8sControlPlane](/azure/azure-monitor/reference/tables/ArcK8sControlPlane) |
| Data Manager for Energy | [OEPDataplaneLogs](/azure/azure-monitor/reference/tables/OEPDataplaneLogs) |
| Dedicated SQL Pool | [SynapseSqlPoolSqlRequests](/azure/azure-monitor/reference/tables/synapsesqlpoolsqlrequests)<br>[SynapseSqlPoolRequestSteps](/azure/azure-monitor/reference/tables/synapsesqlpoolrequeststeps)<br>[SynapseSqlPoolExecRequests](/azure/azure-monitor/reference/tables/synapsesqlpoolexecrequests)<br>[SynapseSqlPoolDmsWorkers](/azure/azure-monitor/reference/tables/synapsesqlpooldmsworkers)<br>[SynapseSqlPoolWaits](/azure/azure-monitor/reference/tables/synapsesqlpoolwaits) |
| DNS Security Policies | [DNSQueryLogs](/azure/azure-monitor/reference/tables/DNSQueryLogs) |
| Dev Centers | [DevCenterDiagnosticLogs](/azure/azure-monitor/reference/tables/DevCenterDiagnosticLogs)<br>[DevCenterResourceOperationLogs](/azure/azure-monitor/reference/tables/DevCenterResourceOperationLogs)<br>[DevCenterBillingEventLogs](/azure/azure-monitor/reference/tables/DevCenterBillingEventLogs) |
| Data Transfer | [DataTransferOperations](/azure/azure-monitor/reference/tables/DataTransferOperations) |
| Event Hubs | [AZMSArchiveLogs](/azure/azure-monitor/reference/tables/AZMSArchiveLogs)<br>[AZMSAutoscaleLogs](/azure/azure-monitor/reference/tables/AZMSAutoscaleLogs)<br>[AZMSCustomerManagedKeyUserLogs](/azure/azure-monitor/reference/tables/AZMSCustomerManagedKeyUserLogs)<br>[AZMSKafkaCoordinatorLogs](/azure/azure-monitor/reference/tables/AZMSKafkaCoordinatorLogs)<br>[AZMSKafkaUserErrorLogs](/azure/azure-monitor/reference/tables/AZMSKafkaUserErrorLogs) |
| Firewalls | [AZFWFlowTrace](/azure/azure-monitor/reference/tables/AZFWFlowTrace) |
| Health Care APIs | [AHDSMedTechDiagnosticLogs](/azure/azure-monitor/reference/tables/AHDSMedTechDiagnosticLogs)<br>[AHDSDicomDiagnosticLogs](/azure/azure-monitor/reference/tables/AHDSDicomDiagnosticLogs)<br>[AHDSDicomAuditLogs](/azure/azure-monitor/reference/tables/AHDSDicomAuditLogs) |
| Key Vault | [AZKVAuditLogs](/azure/azure-monitor/reference/tables/AZKVAuditLogs)<br>[AZKVPolicyEvaluationDetailsLogs](/azure/azure-monitor/reference/tables/AZKVPolicyEvaluationDetailsLogs) |
| Kubernetes services | [AKSAudit](/azure/azure-monitor/reference/tables/AKSAudit)<br>[AKSAuditAdmin](/azure/azure-monitor/reference/tables/AKSAuditAdmin)<br>[AKSControlPlane](/azure/azure-monitor/reference/tables/AKSControlPlane) | 
| Log Analytics | [LASummaryLogs](/azure/azure-monitor/reference/tables/LASummaryLogs) |
| Managed Lustre | [AFSAuditLogs](/azure/azure-monitor/reference/tables/AFSAuditLogs) |
| Managed NGINX | [NGXOperationLogs](/azure/azure-monitor/reference/tables/ngxoperationlogs) |
| Media Services | [AMSLiveEventOperations](/azure/azure-monitor/reference/tables/AMSLiveEventOperations)<br>[AMSKeyDeliveryRequests](/azure/azure-monitor/reference/tables/AMSKeyDeliveryRequests)<br>[AMSMediaAccountHealth](/azure/azure-monitor/reference/tables/AMSMediaAccountHealth)<br>[AMSStreamingEndpointRequests](/azure/azure-monitor/reference/tables/AMSStreamingEndpointRequests) |
| Microsoft Graph | [MicrosoftGraphActivityLogs](/azure/azure-monitor/reference/tables/microsoftgraphactivitylogs) |
| Monitor | [AzureMetricsV2](/azure/azure-monitor/reference/tables/AzureMetricsV2) |
| Network Devices (Operator Nexus) | [MNFDeviceUpdates](/azure/azure-monitor/reference/tables/MNFDeviceUpdates)<br>[MNFSystemStateMessageUpdates](/azure/azure-monitor/reference/tables/MNFSystemStateMessageUpdates) <br>[MNFSystemSessionHistoryUpdates](/azure/azure-monitor/reference/tables/mnfsystemsessionhistoryupdates) |
| Network Managers | [AVNMConnectivityConfigurationChange](/azure/azure-monitor/reference/tables/AVNMConnectivityConfigurationChange)<br>[AVNMIPAMPoolAllocationChange](/azure/azure-monitor/reference/tables/AVNMIPAMPoolAllocationChange) |
| Nexus Clusters | [NCCKubernetesLogs](/azure/azure-monitor/reference/tables/NCCKubernetesLogs)<br>[NCCVMOrchestrationLogs](/azure/azure-monitor/reference/tables/NCCVMOrchestrationLogs) |
| Nexus Storage Appliances | [NCSStorageLogs](/azure/azure-monitor/reference/tables/NCSStorageLogs)<br>[NCSStorageAlerts](/azure/azure-monitor/reference/tables/NCSStorageAlerts) |
| Operator Insights – Data Products | [AOIDatabaseQuery](/azure/azure-monitor/reference/tables/AOIDatabaseQuery)<br>[AOIDigestion](/azure/azure-monitor/reference/tables/AOIDigestion)<br>[AOIStorage](/azure/azure-monitor/reference/tables/AOIStorage) |
| Redis cache | [ACRConnectedClientList](/azure/azure-monitor/reference/tables/ACRConnectedClientList) |
| Redis Cache Enterprise | [REDConnectionEvents](/azure/azure-monitor/reference/tables/REDConnectionEvents) |
| Relays | [AZMSHybridConnectionsEvents](/azure/azure-monitor/reference/tables/AZMSHybridConnectionsEvents) |
| Security | [SecurityAttackPathData](/azure/azure-monitor/reference/tables/SecurityAttackPathData)<br> [MDCFileIntegrityMonitoringEvents](/azure/azure-monitor/reference/tables/mdcfileintegritymonitoringevents) |
| Service Bus | [AZMSApplicationMetricLogs](/azure/azure-monitor/reference/tables/AZMSApplicationMetricLogs)<br>[AZMSOperationalLogs](/azure/azure-monitor/reference/tables/AZMSOperationalLogs)<br>[AZMSRunTimeAuditLogs](/azure/azure-monitor/reference/tables/AZMSRunTimeAuditLogs)<br>[AZMSVNetConnectionEvents](/azure/azure-monitor/reference/tables/AZMSVNetConnectionEvents) |
| Sphere | [ASCAuditLogs](/azure/azure-monitor/reference/tables/ASCAuditLogs)<br>[ASCDeviceEvents](/azure/azure-monitor/reference/tables/ASCDeviceEvents) |
| Storage | [StorageBlobLogs](/azure/azure-monitor/reference/tables/StorageBlobLogs)<br>[StorageFileLogs](/azure/azure-monitor/reference/tables/StorageFileLogs)<br>[StorageQueueLogs](/azure/azure-monitor/reference/tables/StorageQueueLogs)<br>[StorageTableLogs](/azure/azure-monitor/reference/tables/StorageTableLogs) |
| Synapse Analytics | [SynapseSqlPoolExecRequests](/azure/azure-monitor/reference/tables/SynapseSqlPoolExecRequests)<br>[SynapseSqlPoolRequestSteps](/azure/azure-monitor/reference/tables/SynapseSqlPoolRequestSteps)<br>[SynapseSqlPoolDmsWorkers](/azure/azure-monitor/reference/tables/SynapseSqlPoolDmsWorkers)<br>[SynapseSqlPoolWaits](/azure/azure-monitor/reference/tables/SynapseSqlPoolWaits) |
| Storage Mover | [StorageMoverJobRunLogs](/azure/azure-monitor/reference/tables/StorageMoverJobRunLogs)<br>[StorageMoverCopyLogsFailed](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsFailed)<br>[StorageMoverCopyLogsTransferred](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsTransferred)<br> |
| Virtual Network Manager  | [AVNMNetworkGroupMembershipChange](/azure/azure-monitor/reference/tables/AVNMNetworkGroupMembershipChange)<br>[AVNMRuleCollectionChange](/azure/azure-monitor/reference/tables/AVNMRuleCollectionChange) |
    
> [!NOTE]
> Tables created with the [Data Collector API](data-collector-api.md) don't support Basic logs.

## Next steps

- [Manage data retention](../logs/data-retention-archive.md)

