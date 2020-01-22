---
title: Azure Resource Logs supported services and schemas
description: Understand the supported services and event schema for Azure resource logs.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: reference
ms.date: 10/22/2019
author: rboucher
ms.author: robb


---
# Supported services, schemas, and categories for Azure Resource Logs

> [!NOTE]
> Resource logs were previously known as diagnostic logs.

[Azure Monitor resource logs](../../azure-monitor/platform/platform-logs-overview.md) are logs emitted by Azure services that describe the operation of those services or resources. All resource logs available through Azure Monitor share a common top-level schema, with flexibility for each service to emit unique properties for their own events.

A combination of the resource type (available in the `resourceId` property) and the `category` uniquely identify a schema. This article describes the top-level schema for resource logs and links to the schemata for each service.

## Top-level resource logs schema

| Name | Required/Optional | Description |
|---|---|---|
| time | Required | The timestamp (UTC) of the event. |
| resourceId | Required | The resource ID of the resource that emitted the event. For tenant services, this is of the form /tenants/tenant-id/providers/provider-name. |
| tenantId | Required for tenant logs | The tenant ID of the Active Directory tenant that this event is tied to. This property is only used for tenant-level logs, it does not appear in resource-level logs. |
| operationName | Required | The name of the operation represented by this event. If the event represents an RBAC operation, this is the RBAC operation name (eg. Microsoft.Storage/storageAccounts/blobServices/blobs/Read). Typically modeled in the form of a Resource Manager operation, even if they are not actual documented Resource Manager operations (`Microsoft.<providerName>/<resourceType>/<subtype>/<Write/Read/Delete/Action>`) |
| operationVersion | Optional | The api-version associated with the operation, if the operationName was performed using an API (eg. `http://myservice.windowsazure.net/object?api-version=2016-06-01`). If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| category | Required | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. Typical log categories are “Audit” “Operational” “Execution” and “Request.” |
| resultType | Optional | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| resultSignature | Optional | The sub status of the event. If this operation corresponds to a REST API call, this is the HTTP status code of the corresponding REST call. |
| resultDescription | Optional | The static text description of this operation, eg. “Get storage file.” |
| durationMs | Optional | The duration of the operation in milliseconds. |
| callerIpAddress | Optional | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly-available IP address. |
| correlationId | Optional | A GUID used to group together a set of related events. Typically, if two events have the same operationName but two different statuses (eg. “Started” and “Succeeded”), they share the same correlation ID. This may also represent other relationships between events. |
| identity | Optional | A JSON blob that describes the identity of the user or application that performed the operation. Typically this will include the authorization and claims / JWT token from active directory. |
| Level | Optional | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| location | Optional | The region of the resource emitting the event, eg. “East US” or “France South” |
| properties | Optional | Any extended properties related to this particular category of events. All custom/unique properties must be put inside this “Part B” of the schema. |

## Service-specific schemas for resource logs
The schema for resource diagnostic logs varies depending on the resource and log category. This list shows all services that make available resource logs and links to the service and category-specific schema where available.

| Service | Schema & Docs |
| --- | --- |
| Azure Active Directory | [Overview](../../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md), [Audit log schema](../../active-directory/reports-monitoring/reference-azure-monitor-audit-log-schema.md) and [Sign-ins schema](../../active-directory/reports-monitoring/reference-azure-monitor-sign-ins-log-schema.md) |
| Analysis Services | https://azure.microsoft.com/blog/azure-analysis-services-integration-with-azure-diagnostic-logs/ |
| API Management | [API Management Resource Logs](../../api-management/api-management-howto-use-azure-monitor.md#diagnostic-logs) |
| Application Gateways |[Logging for Application Gateway](../../application-gateway/application-gateway-diagnostics.md) |
| Azure Automation |[Log analytics for Azure Automation](../../automation/automation-manage-send-joblogs-log-analytics.md) |
| Azure Batch |[Azure Batch logging](../../batch/batch-diagnostics.md) |
| Azure Database for MySQL | [Azure Database for MySQL diagnostic logs](../../mysql/concepts-server-logs.md#diagnostic-logs) |
| Azure Database for PostgreSQL | [Azure Database for PostgreSQL logs](../../postgresql/concepts-server-logs.md#diagnostic-logs) |
| Azure Data Explorer | [Azure Data Explorer logs](../../data-explorer/using-diagnostic-logs.md) |
| Cognitive Services | [Logging for Azure Cognitive Services](../../cognitive-services/diagnostic-logging.md) |
| Container Registry | [Logging for Azure Container Registry](../../container-registry/container-registry-diagnostics-audit-logs.md) |
| Content Delivery Network | [Azure Logs for CDN](../../cdn/cdn-azure-diagnostic-logs.md) |
| CosmosDB | [Azure Cosmos DB Logging](../../cosmos-db/logging.md) |
| Data Factory | [Monitor Data Factories using Azure Monitor](../../data-factory/monitor-using-azure-monitor.md) |
| Data Lake Analytics |[Accessing logs for Azure Data Lake Analytics](../../data-lake-analytics/data-lake-analytics-diagnostic-logs.md) |
| Data Lake Store |[Accessing logs for Azure Data Lake Store](../../data-lake-store/data-lake-store-diagnostic-logs.md) |
| Event Hubs |[Azure Event Hubs logs](../../event-hubs/event-hubs-diagnostic-logs.md) |
| Express Route | Schema not available. |
| Azure Firewall | Schema not available. |
| IoT Hub | [IoT Hub Operations](../../iot-hub/iot-hub-monitor-resource-health.md#use-azure-monitor) |
| Key Vault |[Azure Key Vault Logging](../../key-vault/key-vault-logging.md) |
| Kubernetes Service |[Azure Kubernetes Logging](../../aks/view-master-logs.md#log-event-schema) |
| Load Balancer |[Log analytics for Azure Load Balancer](../../load-balancer/load-balancer-monitor-log.md) |
| Logic Apps |[Logic Apps B2B custom tracking schema](../../logic-apps/logic-apps-track-integration-account-custom-tracking-schema.md) |
| Network Security Groups |[Log analytics for network security groups (NSGs)](../../virtual-network/virtual-network-nsg-manage-log.md) |
| DDOS Protection | [Manage Azure DDoS Protection Standard](../../virtual-network/manage-ddos-protection.md) |
| Power BI Dedicated | [Logging for Power BI Embedded in Azure](https://docs.microsoft.com/power-bi/developer/azure-pbie-diag-logs) |
| Recovery Services | [Data Model for Azure Backup](../../backup/backup-azure-reports-data-model.md)|
| Search |[Enabling and using Search Traffic Analytics](../../search/search-traffic-analytics.md) |
| Service Bus |[Azure Service Bus logs](../../service-bus-messaging/service-bus-diagnostic-logs.md) |
| SQL Database | [Azure SQL Database logging](../../sql-database/sql-database-metrics-diag-logging.md) |
| Stream Analytics |[Job logs](../../stream-analytics/stream-analytics-job-diagnostic-logs.md) |
| Traffic Manager | [Traffic Manager Log schema](../../traffic-manager/traffic-manager-diagnostic-logs.md) |
| Virtual Networks | Schema not available. |
| Virtual Network Gateways | Schema not available. |

## Supported log categories per resource type

Some categories may only be supported for specific types of resources. This is list of all that are available in some form.  For example, Microsoft.Sql/servers/databases categories aren't available for all types of databases. For more information, see [information on SQL Database diagnostic logging](../../sql-database/sql-database-metrics-diag-logging.md). 

|Resource Type|Category|Category Display Name|
|---|---|---|
|Microsoft.AAD/domainServices|SystemSecurity|SystemSecurity|
|Microsoft.AAD/domainServices|AccountManagement|AccountManagement|
|Microsoft.AAD/domainServices|LogonLogoff|LogonLogoff|
|Microsoft.AAD/domainServices|ObjectAccess|ObjectAccess|
|Microsoft.AAD/domainServices|PolicyChange|PolicyChange|
|Microsoft.AAD/domainServices|PrivilegeUse|PrivilegeUse|
|Microsoft.AAD/domainServices|DetailTracking|DetailTracking|
|Microsoft.AAD/domainServices|DirectoryServiceAccess|DirectoryServiceAccess|
|Microsoft.AAD/domainServices|AccountLogon|AccountLogon|
|microsoft.aadiam/tenants|Signin|Signin|
|Microsoft.AnalysisServices/servers|Engine|Engine|
|Microsoft.AnalysisServices/servers|Service|Service|
|Microsoft.ApiManagement/service|GatewayLogs|Logs related to ApiManagement Gateway|
|Microsoft.AppPlatform/Spring|ApplicationConsole|Application Console|
|Microsoft.Automation/automationAccounts|JobLogs|Job Logs|
|Microsoft.Automation/automationAccounts|JobStreams|Job Streams|
|Microsoft.Automation/automationAccounts|DscNodeStatus|Dsc Node Status|
|Microsoft.Batch/batchAccounts|ServiceLog|Service Logs|
|Microsoft.BatchAI/workspaces|BaiClusterEvent|BaiClusterEvent|
|Microsoft.BatchAI/workspaces|BaiClusterNodeEvent|BaiClusterNodeEvent|
|Microsoft.BatchAI/workspaces|BaiJobEvent|BaiJobEvent|
|Microsoft.Blockchain/blockchainMembers|BlockchainApplication|Blockchain Application|
|Microsoft.Blockchain/blockchainMembers|Proxy|Proxy|
|Microsoft.Cdn/profiles/endpoints|CoreAnalytics|Gets the metrics of the endpoint, e.g., bandwidth, egress, etc.|
|Microsoft.ClassicNetwork/networksecuritygroups|Network Security Group Rule Flow Event|Network Security Group Rule Flow Event|
|Microsoft.CognitiveServices/accounts|Audit|Audit Logs|
|Microsoft.CognitiveServices/accounts|RequestResponse|Request and Response Logs|
|Microsoft.ContainerRegistry/registries|ContainerRegistryRepositoryEvents|RepositoryEvent logs (Preview)|
|Microsoft.ContainerRegistry/registries|ContainerRegistryLoginEvents|Login Events (Preview)|
|Microsoft.ContainerService/managedClusters|kube-apiserver|Kubernetes API Server|
|Microsoft.ContainerService/managedClusters|kube-controller-manager|Kubernetes Controller Manager|
|Microsoft.ContainerService/managedClusters|kube-scheduler|Kubernetes Scheduler|
|Microsoft.ContainerService/managedClusters|kube-audit|Kubernetes Audit|
|Microsoft.ContainerService/managedClusters|cluster-autoscaler|Kubernetes Cluster Autoscaler|
|Microsoft.Databricks/workspaces|dbfs|Databricks File System|
|Microsoft.Databricks/workspaces|clusters|Databricks Clusters|
|Microsoft.Databricks/workspaces|accounts|Databricks Accounts|
|Microsoft.Databricks/workspaces|jobs|Databricks Jobs|
|Microsoft.Databricks/workspaces|notebook|Databricks Notebook|
|Microsoft.Databricks/workspaces|ssh|Databricks SSH|
|Microsoft.Databricks/workspaces|workspace|Databricks Workspace|
|Microsoft.Databricks/workspaces|secrets|Databricks Secrets|
|Microsoft.Databricks/workspaces|sqlPermissions|Databricks SQLPermissions|
|Microsoft.Databricks/workspaces|instancePools|Instance Pools|
|Microsoft.DataCatalog/datacatalogs|ScanStatusLogEvent|ScanStatus|
|Microsoft.DataFactory/factories|ActivityRuns|Pipeline activity runs log|
|Microsoft.DataFactory/factories|PipelineRuns|Pipeline runs log|
|Microsoft.DataFactory/factories|TriggerRuns|Trigger runs log|
|Microsoft.DataLakeAnalytics/accounts|Audit|Audit Logs|
|Microsoft.DataLakeAnalytics/accounts|Requests|Request Logs|
|Microsoft.DataLakeStore/accounts|Audit|Audit Logs|
|Microsoft.DataLakeStore/accounts|Requests|Request Logs|
|Microsoft.DataShare/accounts|Shares|Shares|
|Microsoft.DataShare/accounts|ShareSubscriptions|Share Subscriptions|
|Microsoft.DataShare/accounts|SentShareSnapshots|Sent Share Snapshots|
|Microsoft.DataShare/accounts|ReceivedShareSnapshots|Received Share Snapshots|
|Microsoft.DBforMySQL/servers|MySqlSlowLogs|MySQL Server Logs|
|Microsoft.DBforMySQL/servers|MySqlAuditLogs|MySQL Audit Logs|
|Microsoft.DBforPostgreSQL/servers|PostgreSQLLogs|PostgreSQL Server Logs|
|Microsoft.DBforPostgreSQL/servers|QueryStoreRuntimeStatistics|PostgreSQL Query Store Runtime Statistics|
|Microsoft.DBforPostgreSQL/servers|QueryStoreWaitStatistics|PostgreSQL Query Store Wait Statistics|
|Microsoft.DBforPostgreSQL/serversv2|PostgreSQLLogs|PostgreSQL Server Logs|
|Microsoft.DBforPostgreSQL/serversv2|QueryStoreRuntimeStatistics|PostgreSQL Query Store Runtime Statistics|
|Microsoft.DBforPostgreSQL/serversv2|QueryStoreWaitStatistics|PostgreSQL Query Store Wait Statistics|
|Microsoft.DesktopVirtualization/workspaces|Checkpoint|Checkpoint|
|Microsoft.DesktopVirtualization/workspaces|Error|Error|
|Microsoft.DesktopVirtualization/workspaces|Management|Management|
|Microsoft.DesktopVirtualization/workspaces|Feed|Feed|
|Microsoft.DesktopVirtualization/applicationGroups|Checkpoint|Checkpoint|
|Microsoft.DesktopVirtualization/applicationGroups|Error|Error|
|Microsoft.DesktopVirtualization/applicationGroups|Management|Management|
|Microsoft.DesktopVirtualization/hostPools|Checkpoint|Checkpoint|
|Microsoft.DesktopVirtualization/hostPools|Error|Error|
|Microsoft.DesktopVirtualization/hostPools|Management|Management|
|Microsoft.DesktopVirtualization/hostPools|Connection|Connection|
|Microsoft.DesktopVirtualization/hostPools|HostRegistration|HostRegistration|
|Microsoft.Devices/IotHubs|Connections|Connections|
|Microsoft.Devices/IotHubs|DeviceTelemetry|Device Telemetry|
|Microsoft.Devices/IotHubs|C2DCommands|C2D Commands|
|Microsoft.Devices/IotHubs|DeviceIdentityOperations|Device Identity Operations|
|Microsoft.Devices/IotHubs|FileUploadOperations|File Upload Operations|
|Microsoft.Devices/IotHubs|Routes|Routes|
|Microsoft.Devices/IotHubs|D2CTwinOperations|D2CTwinOperations|
|Microsoft.Devices/IotHubs|C2DTwinOperations|C2D Twin Operations|
|Microsoft.Devices/IotHubs|TwinQueries|Twin Queries|
|Microsoft.Devices/IotHubs|JobsOperations|Jobs Operations|
|Microsoft.Devices/IotHubs|DirectMethods|Direct Methods|
|Microsoft.Devices/IotHubs|DistributedTracing|Distributed Tracing (Preview)|
|Microsoft.Devices/IotHubs|Configurations|Configurations|
|Microsoft.Devices/IotHubs|DeviceStreams|Device Streams (Preview)|
|Microsoft.Devices/provisioningServices|DeviceOperations|Device Operations|
|Microsoft.Devices/provisioningServices|ServiceOperations|Service Operations|
|Microsoft.DocumentDB/databaseAccounts|DataPlaneRequests|DataPlaneRequests|
|Microsoft.DocumentDB/databaseAccounts|MongoRequests|MongoRequests|
|Microsoft.DocumentDB/databaseAccounts|QueryRuntimeStatistics|QueryRuntimeStatistics|
|Microsoft.DocumentDB/databaseAccounts|PartitionKeyStatistics|PartitionKeyStatistics|
|Microsoft.DocumentDB/databaseAccounts|ControlPlaneRequests|ControlPlaneRequests|
|Microsoft.EnterpriseKnowledgeGraph/services|AuditEvent|AuditEvent log|
|Microsoft.EnterpriseKnowledgeGraph/services|DataIssue|DataIssue log|
|Microsoft.EnterpriseKnowledgeGraph/services|Requests|Configuration log|
|Microsoft.EventHub/namespaces|ArchiveLogs|Archive Logs|
|Microsoft.EventHub/namespaces|OperationalLogs|Operational Logs|
|Microsoft.EventHub/namespaces|AutoScaleLogs|Auto Scale Logs|
|Microsoft.EventHub/namespaces|KafkaCoordinatorLogs|Kafka Coordinator Logs|
|Microsoft.EventHub/namespaces|KafkaUserErrorLogs|Kafka User Error Logs|
|Microsoft.EventHub/namespaces|EventHubVNetConnectionEvent|VNet/IP Filtering Connection Logs|
|Microsoft.EventHub/namespaces|CustomerManagedKeyUserLogs|Customer Managed Key Logs|
|Microsoft.HealthcareApis/services|AuditLogs|Audit logs|
|Microsoft.Insights/AutoscaleSettings|AutoscaleEvaluations|Autoscale Evaluations|
|Microsoft.Insights/AutoscaleSettings|AutoscaleScaleActions|Autoscale Scale Actions|
|Microsoft.IoTSpaces/Graph|Trace|Trace|
|Microsoft.IoTSpaces/Graph|Operational|Operational|
|Microsoft.IoTSpaces/Graph|Audit|Audit|
|Microsoft.IoTSpaces/Graph|UserDefinedFunction|UserDefinedFunction|
|Microsoft.IoTSpaces/Graph|Ingress|Ingress|
|Microsoft.IoTSpaces/Graph|Egress|Egress|
|Microsoft.KeyVault/vaults|AuditEvent|Audit Logs|
|Microsoft.Kusto/Clusters|SucceededIngestion|Successful ingest operations|
|Microsoft.Kusto/Clusters|FailedIngestion|Failed ingest operations|
|Microsoft.Logic/workflows|WorkflowRuntime|Workflow runtime diagnostic events|
|Microsoft.Logic/integrationAccounts|IntegrationAccountTrackingEvents|Integration Account track events|
|Microsoft.MachineLearningServices/workspaces|AmlComputeClusterEvent|AmlComputeClusterEvent|
|Microsoft.MachineLearningServices/workspaces|AmlComputeClusterNodeEvent|AmlComputeClusterNodeEvent|
|Microsoft.MachineLearningServices/workspaces|AmlComputeJobEvent|AmlComputeJobEvent|
|Microsoft.Media/mediaservices|KeyDeliveryRequests|Key Delivery Requests|
|Microsoft.Network/networksecuritygroups|NetworkSecurityGroupEvent|Network Security Group Event|
|Microsoft.Network/networksecuritygroups|NetworkSecurityGroupRuleCounter|Network Security Group Rule Counter|
|Microsoft.Network/networksecuritygroups|NetworkSecurityGroupFlowEvent|Network Security Group Rule Flow Event|
|Microsoft.Network/publicIPAddresses|DDoSProtectionNotifications|DDoS protection notifications|
|Microsoft.Network/publicIPAddresses|DDoSMitigationFlowLogs|Flow logs of DDoS mitigation decisions|
|Microsoft.Network/publicIPAddresses|DDoSMitigationReports|Reports of DDoS mitigations|
|Microsoft.Network/virtualNetworks|VMProtectionAlerts|VM protection alerts|
|Microsoft.Network/applicationGateways|ApplicationGatewayAccessLog|Application Gateway Access Log|
|Microsoft.Network/applicationGateways|ApplicationGatewayPerformanceLog|Application Gateway Performance Log|
|Microsoft.Network/applicationGateways|ApplicationGatewayFirewallLog|Application Gateway Firewall Log|
|Microsoft.Network/azurefirewalls|AzureFirewallApplicationRule|Azure Firewall Application Rule|
|Microsoft.Network/azurefirewalls|AzureFirewallNetworkRule|Azure Firewall Network Rule|
|Microsoft.Network/virtualNetworkGateways|GatewayDiagnosticLog|Gateway Diagnostic Logs|
|Microsoft.Network/virtualNetworkGateways|TunnelDiagnosticLog|Tunnel Diagnostic Logs|
|Microsoft.Network/virtualNetworkGateways|RouteDiagnosticLog|Route Diagnostic Logs|
|Microsoft.Network/virtualNetworkGateways|IKEDiagnosticLog|IKE Diagnostic Logs|
|Microsoft.Network/virtualNetworkGateways|P2SDiagnosticLog|P2S Diagnostic Logs|
|Microsoft.Network/trafficManagerProfiles|ProbeHealthStatusEvents|Traffic Manager Probe Health Results Event|
|Microsoft.Network/expressRouteCircuits|PeeringRouteLog|Peering Route Table Logs|
|Microsoft.Network/vpnGateways|GatewayDiagnosticLog|Gateway Diagnostic Logs|
|Microsoft.Network/vpnGateways|TunnelDiagnosticLog|Tunnel Diagnostic Logs|
|Microsoft.Network/vpnGateways|RouteDiagnosticLog|Route Diagnostic Logs|
|Microsoft.Network/vpnGateways|IKEDiagnosticLog|IKE Diagnostic Logs|
|Microsoft.Network/frontdoors|FrontdoorAccessLog|Frontdoor Access Log|
|Microsoft.Network/frontdoors|FrontdoorWebApplicationFirewallLog|Frontdoor Web Application Firewall Log|
|Microsoft.Network/p2sVpnGateways|GatewayDiagnosticLog|Gateway Diagnostic Logs|
|Microsoft.Network/p2sVpnGateways|IKEDiagnosticLog|IKE Diagnostic Logs|
|Microsoft.Network/p2sVpnGateways|P2SDiagnosticLog|P2S Diagnostic Logs|
|Microsoft.Network/bastionHosts|BastionAuditLogs|Bastion Audit Logs|
|Microsoft.Network/loadBalancers|LoadBalancerAlertEvent|Load Balancer Alert Events|
|Microsoft.Network/loadBalancers|LoadBalancerProbeHealthStatus|Load Balancer Probe Health Status|
|Microsoft.PowerBIDedicated/capacities|Engine|Engine|
|Microsoft.RecoveryServices/Vaults|AzureBackupReport|Azure Backup Reporting Data|
|Microsoft.RecoveryServices/Vaults|CoreAzureBackup|Core Azure Backup Data|
|Microsoft.RecoveryServices/Vaults|AddonAzureBackupJobs|Addon Azure Backup Job Data|
|Microsoft.RecoveryServices/Vaults|AddonAzureBackupAlerts|Addon Azure Backup Alert Data|
|Microsoft.RecoveryServices/Vaults|AddonAzureBackupPolicy|Addon Azure Backup Policy Data|
|Microsoft.RecoveryServices/Vaults|AddonAzureBackupStorage|Addon Azure Backup Storage Data|
|Microsoft.RecoveryServices/Vaults|AddonAzureBackupProtectedInstance|Addon Azure Backup Protected Instance Data|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryJobs|Azure Site Recovery Jobs|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryEvents|Azure Site Recovery Events|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryReplicatedItems|Azure Site Recovery Replicated Items|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryReplicationStats|Azure Site Recovery Replication Stats|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryRecoveryPoints|Azure Site Recovery Recovery Points|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryReplicationDataUploadRate|Azure Site Recovery Replication Data Upload Rate|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryProtectedDiskDataChurn|Azure Site Recovery Protected Disk Data Churn|
|Microsoft.Search/searchServices|OperationLogs|Operation Logs|
|Microsoft.ServiceBus/namespaces|OperationalLogs|Operational Logs|
|Microsoft.Sql/servers/databases|SQLInsights|SQL Insights|
|Microsoft.Sql/servers/databases|AutomaticTuning|Automatic tuning|
|Microsoft.Sql/servers/databases|QueryStoreRuntimeStatistics|Query Store Runtime Statistics|
|Microsoft.Sql/servers/databases|QueryStoreWaitStatistics|Query Store Wait Statistics|
|Microsoft.Sql/servers/databases|Errors|Errors|
|Microsoft.Sql/servers/databases|DatabaseWaitStatistics|Database Wait Statistics|
|Microsoft.Sql/servers/databases|Timeouts|Timeouts|
|Microsoft.Sql/servers/databases|Blocks|Blocks|
|Microsoft.Sql/servers/databases|Deadlocks|Deadlocks|
|Microsoft.Sql/servers/databases|Audit|Audit Logs|
|Microsoft.Sql/servers/databases|SQLSecurityAuditEvents|SQL Security Audit Event|
|Microsoft.Sql/servers/databases|DmsWorkers|Dms Workers|
|Microsoft.Sql/servers/databases|ExecRequests|Exec Requests|
|Microsoft.Sql/servers/databases|RequestSteps|Request Steps|
|Microsoft.Sql/servers/databases|SqlRequests|Sql Requests|
|Microsoft.Sql/servers/databases|Waits|Waits|
|Microsoft.Sql/managedInstances|ResourceUsageStats|Resource Usage Statistics|
|Microsoft.Sql/managedInstances|SQLSecurityAuditEvents|SQL Security Audit Event|
|Microsoft.Sql/managedInstances/databases|SQLInsights|SQL Insights|
|Microsoft.Sql/managedInstances/databases|QueryStoreRuntimeStatistics|Query Store Runtime Statistics|
|Microsoft.Sql/managedInstances/databases|QueryStoreWaitStatistics|Query Store Wait Statistics|
|Microsoft.Sql/managedInstances/databases|Errors|Errors|
|Microsoft.Storage/storageAccounts/tableServices|StorageRead|StorageRead|
|Microsoft.Storage/storageAccounts/tableServices|StorageWrite|StorageWrite|
|Microsoft.Storage/storageAccounts/tableServices|StorageDelete|StorageDelete|
|Microsoft.Storage/storageAccounts/blobServices|StorageRead|StorageRead|
|Microsoft.Storage/storageAccounts/blobServices|StorageWrite|StorageWrite|
|Microsoft.Storage/storageAccounts/blobServices|StorageDelete|StorageDelete|
|Microsoft.Storage/storageAccounts/fileServices|StorageRead|StorageRead|
|Microsoft.Storage/storageAccounts/fileServices|StorageWrite|StorageWrite|
|Microsoft.Storage/storageAccounts/fileServices|StorageDelete|StorageDelete|
|Microsoft.Storage/storageAccounts/queueServices|StorageRead|StorageRead|
|Microsoft.Storage/storageAccounts/queueServices|StorageWrite|StorageWrite|
|Microsoft.Storage/storageAccounts/queueServices|StorageDelete|StorageDelete|
|Microsoft.StreamAnalytics/streamingjobs|Execution|Execution|
|Microsoft.StreamAnalytics/streamingjobs|Authoring|Authoring|
|microsoft.web/hostingenvironments|AppServiceEnvironmentPlatformLogs|App Service Environment Platform Logs|
|microsoft.web/sites|FunctionAppLogs|Function Application Logs|
|microsoft.web/sites|AppServiceHTTPLogs|HTTP logs|
|microsoft.web/sites|AppServiceConsoleLogs|App Service Console Logs|
|microsoft.web/sites|AppServiceAppLogs|App Service Application Logs|
|microsoft.web/sites|AppServiceFileAuditLogs|Site Content Change Audit Logs|
|microsoft.web/sites|AppServiceAuditLogs|Access Audit Logs|
|microsoft.web/sites/slots|FunctionAppLogs|Function Application Logs|
|microsoft.web/sites/slots|AppServiceHTTPLogs|HTTP logs|
|microsoft.web/sites/slots|AppServiceConsoleLogs|Console Logs|
|microsoft.web/sites/slots|AppServiceAppLogs|Application Logs|
|microsoft.web/sites/slots|AppServiceFileAuditLogs|Site Content Change Audit Logs|
|microsoft.web/sites/slots|AppServiceAuditLogs|Access Audit Logs|

## Next Steps

* [Learn more about resource logs](../../azure-monitor/platform/platform-logs-overview.md)
* [Stream resource resource logs to **Event Hubs**](../../azure-monitor/platform/resource-logs-stream-event-hubs.md)
* [Change resource log diagnostic settings using the Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings)
* [Analyze logs from Azure storage with Log Analytics](../../azure-monitor/platform/collect-azure-metrics-logs.md)
