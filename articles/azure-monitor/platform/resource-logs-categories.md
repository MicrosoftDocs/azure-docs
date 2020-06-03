---
title: Azure Monitor Resource Logs supported services and categories
description: Reference of Azure Monitor Understand the supported services and event schema for Azure resource logs.
ms.subservice: logs
ms.topic: reference
ms.date: 10/22/2019
---

# Supported services, schemas, and categories for Azure Resource Logs

> [!NOTE]
> Resource logs were previously known as diagnostic logs.

[Azure Monitor resource logs](../../azure-monitor/platform/platform-logs-overview.md) are logs emitted by Azure services that describe the operation of those services or resources. All resource logs available through Azure Monitor share a common top-level schema, with flexibility for each service to emit unique properties for their own events.

A combination of the resource type (available in the `resourceId` property) and the `category` uniquely identify a schema. This article describes the top-level schema for resource logs and links to the schemata for each service.

## Supported log categories per resource type

Some categories may only be supported for specific types of resources. This is list of all that are available in some form.  For example, Microsoft.Sql/servers/databases categories aren't available for all types of databases. For more information, see [information on SQL Database diagnostic logging](../../azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure.md). 
# Supported Diagnostic Log categories
|Resource Type|Category|Category Display Name|
|---|---|---|
|microsoft.aadiam/tenants|Signin|Signin|
|Microsoft.AnalysisServices/servers|Engine|Engine|
|Microsoft.AnalysisServices/servers|Service|Service|
|Microsoft.ApiManagement/service|GatewayLogs|Logs related to ApiManagement Gateway|
|Microsoft.AppPlatform/Spring|ApplicationConsole|Application Console|
|Microsoft.AppPlatform/Spring|SystemLogs|System Logs|
|Microsoft.Automation/automationAccounts|JobLogs|Job Logs|
|Microsoft.Automation/automationAccounts|JobStreams|Job Streams|
|Microsoft.Automation/automationAccounts|DscNodeStatus|Dsc Node Status|
|Microsoft.Batch/batchAccounts|ServiceLog|Service Logs|
|Microsoft.BatchAI/workspaces|BaiClusterEvent|BaiClusterEvent|
|Microsoft.BatchAI/workspaces|BaiClusterNodeEvent|BaiClusterNodeEvent|
|Microsoft.BatchAI/workspaces|BaiJobEvent|BaiJobEvent|
|Microsoft.Blockchain/blockchainMembers|BlockchainApplication|Blockchain Application|
|Microsoft.Blockchain/blockchainMembers|Proxy|Proxy|
|Microsoft.Blockchain/cordaMembers|BlockchainApplication|Blockchain Application|
|Microsoft.Cdn/profiles/endpoints|CoreAnalytics|Gets the metrics of the endpoint, e.g., bandwidth, egress, etc.|
|Microsoft.Cdn/cdnwebapplicationfirewallpolicies|WebApplicationFirewallLogs|Web Appliation Firewall Logs|
|Microsoft.Cdn/profiles|AzureCdnAccessLog|Azure Cdn Access Log|
|Microsoft.ClassicNetwork/networksecuritygroups|Network Security Group Rule Flow Event|Network Security Group Rule Flow Event|
|Microsoft.CognitiveServices/accounts|Audit|Audit Logs|
|Microsoft.CognitiveServices/accounts|RequestResponse|Request and Response Logs|
|Microsoft.ContainerRegistry/registries|ContainerRegistryRepositoryEvents|RepositoryEvent logs|
|Microsoft.ContainerRegistry/registries|ContainerRegistryLoginEvents|Login Events|
|Microsoft.ContainerService/managedClusters|kube-apiserver|Kubernetes API Server|
|Microsoft.ContainerService/managedClusters|kube-audit|Kubernetes Audit|
|Microsoft.ContainerService/managedClusters|kube-controller-manager|Kubernetes Controller Manager|
|Microsoft.ContainerService/managedClusters|kube-scheduler|Kubernetes Scheduler|
|Microsoft.ContainerService/managedClusters|cluster-autoscaler|Kubernetes Cluster Autoscaler|
|Microsoft.CustomProviders/resourceproviders|AuditLogs|Audit logs for MiniRP calls|
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
|Microsoft.DataLakeStore/accounts|Audit|Audit Logs|
|Microsoft.DataLakeStore/accounts|Requests|Request Logs|
|Microsoft.DataShare/accounts|Shares|Shares|
|Microsoft.DataShare/accounts|ShareSubscriptions|Share Subscriptions|
|Microsoft.DataShare/accounts|SentShareSnapshots|Sent Share Snapshots|
|Microsoft.DataShare/accounts|ReceivedShareSnapshots|Received Share Snapshots|
|Microsoft.DBforMariaDB/servers|MySqlSlowLogs|MariaDB Server Logs|
|Microsoft.DBforMariaDB/servers|MySqlAuditLogs|MariaDB Audit Logs|
|Microsoft.DBforMySQL/servers|MySqlSlowLogs|MySQL Server Logs|
|Microsoft.DBforMySQL/servers|MySqlAuditLogs|MySQL Audit Logs|
|Microsoft.DBforPostgreSQL/servers|PostgreSQLLogs|PostgreSQL Server Logs|
|Microsoft.DBforPostgreSQL/servers|QueryStoreRuntimeStatistics|PostgreSQL Query Store Runtime Statistics|
|Microsoft.DBforPostgreSQL/servers|QueryStoreWaitStatistics|PostgreSQL Query Store Wait Statistics|
|Microsoft.DBforPostgreSQL/serversv2|PostgreSQLLogs|PostgreSQL Server Logs|
|Microsoft.DBforPostgreSQL/singleservers|PostgreSQLLogs|PostgreSQL Server Logs|
|Microsoft.DesktopVirtualization/workspaces|Checkpoint|Checkpoint|
|Microsoft.DesktopVirtualization/workspaces|Error|Error|
|Microsoft.DesktopVirtualization/workspaces|Management|Management|
|Microsoft.DesktopVirtualization/workspaces|Feed|Feed|
|Microsoft.DesktopVirtualization/applicationgroups|Checkpoint|Checkpoint|
|Microsoft.DesktopVirtualization/applicationgroups|Error|Error|
|Microsoft.DesktopVirtualization/applicationgroups|Management|Management|
|Microsoft.DesktopVirtualization/hostpools|Checkpoint|Checkpoint|
|Microsoft.DesktopVirtualization/hostpools|Error|Error|
|Microsoft.DesktopVirtualization/hostpools|Management|Management|
|Microsoft.DesktopVirtualization/hostpools|Connection|Connection|
|Microsoft.DesktopVirtualization/hostpools|HostRegistration|HostRegistration|
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
|Microsoft.DocumentDB/databaseAccounts|PartitionKeyRUConsumption|PartitionKeyRUConsumption|
|Microsoft.DocumentDB/databaseAccounts|ControlPlaneRequests|ControlPlaneRequests|
|Microsoft.DocumentDB/databaseAccounts|CassandraRequests|CassandraRequests|
|Microsoft.EnterpriseKnowledgeGraph/services|AuditEvent|AuditEvent log|
|Microsoft.EnterpriseKnowledgeGraph/services|DataIssue|DataIssue log|
|Microsoft.EnterpriseKnowledgeGraph/services|Requests|Configuration log|
|Microsoft.EventGrid/topics|DeliveryFailures|Delivery Failure Logs|
|Microsoft.EventGrid/topics|PublishFailures|Publish Failure Logs|
|Microsoft.EventGrid/domains|DeliveryFailures|Delivery Failure Logs|
|Microsoft.EventGrid/domains|PublishFailures|Publish Failure Logs|
|Microsoft.EventGrid/systemTopics|DeliveryFailures|Delivery Failure Logs|
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
|Microsoft.Insights/Components|AppAvailabilityResults|Availability results|
|Microsoft.Insights/Components|AppBrowserTimings|Browser timings|
|Microsoft.Insights/Components|AppEvents|Events|
|Microsoft.Insights/Components|AppMetrics|Metrics|
|Microsoft.Insights/Components|AppDependencies|Dependencies|
|Microsoft.Insights/Components|AppExceptions|Exceptions|
|Microsoft.Insights/Components|AppPageViews|Page views|
|Microsoft.Insights/Components|AppPerformanceCounters|Performance counters|
|Microsoft.Insights/Components|AppRequests|Requests|
|Microsoft.Insights/Components|AppSystemEvents|System events|
|Microsoft.Insights/Components|AppTraces|Traces|
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
|Microsoft.Relay/namespaces|HybridConnectionsEvent|HybridConnections Events|
|Microsoft.Search/searchServices|OperationLogs|Operation Logs|
|Microsoft.ServiceBus/namespaces|OperationalLogs|Operational Logs|
|Microsoft.SignalRService/SignalR|AllLogs|Azure SignalR Service Logs.|
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
|microsoft.web/sites|ScanLogs|Antivirus scan logs|
|microsoft.web/sites/slots|FunctionAppLogs|Function Application Logs|
|microsoft.web/sites/slots|AppServiceHTTPLogs|HTTP logs|
|microsoft.web/sites/slots|AppServiceConsoleLogs|App Service Console Logs|
|microsoft.web/sites/slots|AppServiceAppLogs|App Service Application Logs|
|microsoft.web/sites/slots|AppServiceFileAuditLogs|Site Content Change Audit Logs|
|microsoft.web/sites/slots|AppServiceAuditLogs|Access Audit Logs|
|microsoft.web/sites/slots|ScanLogs|Antivirus scan logs|

## Next Steps

* [Learn more about resource logs](../../azure-monitor/platform/platform-logs-overview.md)
* [Stream resource resource logs to **Event Hubs**](../../azure-monitor/platform/resource-logs-stream-event-hubs.md)
* [Change resource log diagnostic settings using the Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings)
* [Analyze logs from Azure storage with Log Analytics](../../azure-monitor/platform/collect-azure-metrics-logs.md)
