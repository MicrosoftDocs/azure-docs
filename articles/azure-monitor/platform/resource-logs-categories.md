---
title: Azure Monitor Resource Logs supported services and categories
description: Reference of Azure Monitor Understand the supported services and event schema for Azure resource logs.
ms.subservice: logs
ms.topic: reference
ms.date: 12/09/2020
---

# Supported categories for Azure Resource Logs

> [!NOTE]
> Resource logs were previously known as diagnostic logs. The name was changed in October 2019 as the types of logs gathered by Azure Monitor shifted to include more than just the Azure resource.

[Azure Monitor resource logs](./platform-logs-overview.md) are logs emitted by Azure services that describe the operation of those services or resources. All resource logs available through Azure Monitor share a common top-level schema, with flexibility for each service to emit unique properties for their own events.

A combination of the resource type (available in the `resourceId` property) and the `category` uniquely identify a schema. There is a common schema for all resource logs with service specific fields then added for different log categories. For more information,  see [Common and service specific schema for Azure Resource Logs]()


## Costs

There are costs associated with sending and storing any data into into Log Analytics, Azure Storage and/or Event hub. You may pay for the cost to get the data into these locations and for keeping it there.  Resource logs are one type of data you can send to these locations. There is an additional [cost to export some categories of resource logs](https://azure.microsoft.com/pricing/details/monitor/) into these locations, while others are free of export costs. Export cost specifics are listed in the table below.

## Supported log categories per resource type

Following is a list of the types of logs available for each resource type. 

Some categories may only be supported for specific types of resources. See the resource-specific documentation if you feel you are missing a resource. For example, Microsoft.Sql/servers/databases categories aren't available for all types of databases. For more information, see [information on SQL Database diagnostic logging](../../azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure.md). 

If you still something is missing, you can open a GitHub comment at the bottom of this article.
## Microsoft.AnalysisServices/servers

Cost: Free 

|Category |Category Display Name|
|---|---|
|Engine|Engine|
|Service|Service|


## Microsoft.ApiManagement/service

Cost: Free 

|Category |Category Display Name|
|---|---|
|GatewayLogs|Logs related to ApiManagement Gateway|


## Microsoft.AppPlatform/Spring

Cost: Free 

|Category |Category Display Name|
|---|---|
|ApplicationConsole|Application Console|
|SystemLogs|System Logs|


## Microsoft.Automation/automationAccounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|DscNodeStatus|Dsc Node Status|
|JobLogs|Job Logs|
|JobStreams|Job Streams|


## Microsoft.Batch/batchAccounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|ServiceLog|Service Logs|


## Microsoft.BatchAI/workspaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|BaiClusterEvent|BaiClusterEvent|
|BaiClusterNodeEvent|BaiClusterNodeEvent|
|BaiJobEvent|BaiJobEvent|


## Microsoft.Blockchain/blockchainMembers

Cost: Free 

|Category |Category Display Name|
|---|---|
|BlockchainApplication|Blockchain Application|
|FabricOrderer|Fabric Orderer|
|FabricPeer|Fabric Peer|
|Proxy|Proxy|


## Microsoft.Blockchain/cordaMembers

Cost: Free 

|Category |Category Display Name|
|---|---|
|BlockchainApplication|Blockchain Application|


## Microsoft.Cdn/cdnwebapplicationfirewallpolicies

Cost: Free 

|Category |Category Display Name|
|---|---|
|WebApplicationFirewallLogs|Web Appliation Firewall Logs|


## Microsoft.Cdn/profiles

Cost: Free 

|Category |Category Display Name|
|---|---|
|AzureCdnAccessLog|Azure Cdn Access Log|


## Microsoft.Cdn/profiles/endpoints

Cost: Free 

|Category |Category Display Name|
|---|---|
|CoreAnalytics|Gets the metrics of the endpoint, e.g., bandwidth, egress, etc.|


## Microsoft.ClassicNetwork/networksecuritygroups

Cost: Free 

|Category |Category Display Name|
|---|---|
|Network Security Group Rule Flow Event|Network Security Group Rule Flow Event|


## Microsoft.CognitiveServices/accounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|Audit|Audit Logs|
|RequestResponse|Request and Response Logs|
|Trace|Trace Logs|


## Microsoft.ContainerRegistry/registries

Cost: Free 

|Category |Category Display Name|
|---|---|
|ContainerRegistryLoginEvents|Login Events|
|ContainerRegistryRepositoryEvents|RepositoryEvent logs|


## Microsoft.ContainerService/managedClusters

Cost: Free 

|Category |Category Display Name|
|---|---|
|cluster-autoscaler|Kubernetes Cluster Autoscaler|
|kube-apiserver|Kubernetes API Server|
|kube-audit|Kubernetes Audit|
|kube-controller-manager|Kubernetes Controller Manager|
|kube-scheduler|Kubernetes Scheduler|


## Microsoft.CustomProviders/resourceproviders

Cost: Free 

|Category |Category Display Name|
|---|---|
|AuditLogs|Audit logs for MiniRP calls|


## Microsoft.Databricks/workspaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|accounts|Databricks Accounts|
|clusters|Databricks Clusters|
|dbfs|Databricks File System|
|instancePools|Instance Pools|
|jobs|Databricks Jobs|
|notebook|Databricks Notebook|
|secrets|Databricks Secrets|
|sqlPermissions|Databricks SQLPermissions|
|ssh|Databricks SSH|
|workspace|Databricks Workspace|


## Microsoft.DataFactory/factories

Cost: Free 

|Category |Category Display Name|
|---|---|
|ActivityRuns|Pipeline activity runs log|
|PipelineRuns|Pipeline runs log|
|TriggerRuns|Trigger runs log|


## Microsoft.DataLakeStore/accounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|Audit|Audit Logs|
|Requests|Request Logs|


## Microsoft.DataShare/accounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|ReceivedShareSnapshots|Received Share Snapshots|
|SentShareSnapshots|Sent Share Snapshots|
|Shares|Shares|
|ShareSubscriptions|Share Subscriptions|


## Microsoft.DBforMariaDB/servers

Cost: Free 

|Category |Category Display Name|
|---|---|
|MySqlAuditLogs|MariaDB Audit Logs|
|MySqlSlowLogs|MariaDB Server Logs|


## Microsoft.DBforMySQL/flexibleServers

Cost: Free 

|Category |Category Display Name|
|---|---|
|MySqlAuditLogs|MySQL Audit Logs|
|MySqlSlowLogs|MySQL Slow Logs|


## Microsoft.DBforMySQL/servers

Cost: Free 

|Category |Category Display Name|
|---|---|
|MySqlAuditLogs|MySQL Audit Logs|
|MySqlSlowLogs|MySQL Server Logs|


## Microsoft.DBforPostgreSQL/flexibleServers

Cost: Free 

|Category |Category Display Name|
|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|


## Microsoft.DBforPostgreSQL/servers

Cost: Free 

|Category |Category Display Name|
|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|
|QueryStoreRuntimeStatistics|PostgreSQL Query Store Runtime Statistics|
|QueryStoreWaitStatistics|PostgreSQL Query Store Wait Statistics|


## Microsoft.DBforPostgreSQL/serversv2

Cost: Free 

|Category |Category Display Name|
|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|


## Microsoft.DesktopVirtualization/applicationgroups

Cost: Free 

|Category |Category Display Name|
|---|---|
|Checkpoint|Checkpoint|
|Error|Error|
|Management|Management|


## Microsoft.DesktopVirtualization/hostpools

Cost: Free 

|Category |Category Display Name|
|---|---|
|Checkpoint|Checkpoint|
|Connection|Connection|
|Error|Error|
|HostRegistration|HostRegistration|
|Management|Management|


## Microsoft.DesktopVirtualization/workspaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|Checkpoint|Checkpoint|
|Error|Error|
|Feed|Feed|
|Management|Management|


## Microsoft.Devices/IotHubs

Cost: Free 

|Category |Category Display Name|
|---|---|
|C2DCommands|C2D Commands|
|C2DTwinOperations|C2D Twin Operations|
|Configurations|Configurations|
|Connections|Connections|
|D2CTwinOperations|D2CTwinOperations|
|DeviceIdentityOperations|Device Identity Operations|
|DeviceStreams|Device Streams (Preview)|
|DeviceTelemetry|Device Telemetry|
|DirectMethods|Direct Methods|
|DistributedTracing|Distributed Tracing (Preview)|
|FileUploadOperations|File Upload Operations|
|JobsOperations|Jobs Operations|
|Routes|Routes|
|TwinQueries|Twin Queries|


## Microsoft.Devices/provisioningServices

Cost: Free 

|Category |Category Display Name|
|---|---|
|DeviceOperations|Device Operations|
|ServiceOperations|Service Operations|


## Microsoft.DocumentDB/databaseAccounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|CassandraRequests|CassandraRequests|
|ControlPlaneRequests|ControlPlaneRequests|
|DataPlaneRequests|DataPlaneRequests|
|GremlinRequests|GremlinRequests|
|MongoRequests|MongoRequests|
|PartitionKeyRUConsumption|PartitionKeyRUConsumption|
|PartitionKeyStatistics|PartitionKeyStatistics|
|QueryRuntimeStatistics|QueryRuntimeStatistics|


## Microsoft.EventGrid/domains

Cost: Free 

|Category |Category Display Name|
|---|---|
|DeliveryFailures|Delivery Failure Logs|
|PublishFailures|Publish Failure Logs|


## Microsoft.EventGrid/systemTopics

Cost: Free 

|Category |Category Display Name|
|---|---|
|DeliveryFailures|Delivery Failure Logs|


## Microsoft.EventGrid/topics

Cost: Free 

|Category |Category Display Name|
|---|---|
|DeliveryFailures|Delivery Failure Logs|
|PublishFailures|Publish Failure Logs|


## Microsoft.EventHub/namespaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|ArchiveLogs|Archive Logs|
|AutoScaleLogs|Auto Scale Logs|
|CustomerManagedKeyUserLogs|Customer Managed Key Logs|
|EventHubVNetConnectionEvent|VNet/IP Filtering Connection Logs|
|KafkaCoordinatorLogs|Kafka Coordinator Logs|
|KafkaUserErrorLogs|Kafka User Error Logs|
|OperationalLogs|Operational Logs|


## Microsoft.HealthcareApis/services

Cost: Free 

|Category |Category Display Name|
|---|---|
|AuditLogs|Audit logs|


## Microsoft.Insights/AutoscaleSettings

Cost: Free 

|Category |Category Display Name|
|---|---|
|AutoscaleEvaluations|Autoscale Evaluations|
|AutoscaleScaleActions|Autoscale Scale Actions|


## Microsoft.Insights/Components

Cost: Free 

|Category |Category Display Name|
|---|---|
|AppAvailabilityResults|Availability results|
|AppBrowserTimings|Browser timings|
|AppDependencies|Dependencies|
|AppEvents|Events|
|AppExceptions|Exceptions|
|AppMetrics|Metrics|
|AppPageViews|Page views|
|AppPerformanceCounters|Performance counters|
|AppRequests|Requests|
|AppSystemEvents|System events|
|AppTraces|Traces|


## Microsoft.KeyVault/vaults

Cost: Free 

|Category |Category Display Name|
|---|---|
|AuditEvent|Audit Logs|


## Microsoft.Kusto/Clusters

Cost: Free 

|Category |Category Display Name|
|---|---|
|Command|Command|
|FailedIngestion|Failed ingest operations|
|IngestionBatching|Ingestion batching|
|Query|Query|
|SucceededIngestion|Successful ingest operations|
|TableDetails|Table details|
|TableUsageStatistics|Table usage statistics|


## Microsoft.Logic/integrationAccounts

Cost: Free 

|Category |Category Display Name|
|---|---|
|IntegrationAccountTrackingEvents|Integration Account track events|


## Microsoft.Logic/workflows

Cost: Free 

|Category |Category Display Name|
|---|---|
|WorkflowRuntime|Workflow runtime diagnostic events|


## Microsoft.MachineLearningServices/workspaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|AmlComputeClusterEvent|AmlComputeClusterEvent|
|AmlComputeClusterNodeEvent|AmlComputeClusterNodeEvent|
|AmlComputeCpuGpuUtilization|AmlComputeCpuGpuUtilization|
|AmlComputeJobEvent|AmlComputeJobEvent|
|AmlRunStatusChangedEvent|AmlRunStatusChangedEvent|


## Microsoft.Media/mediaservices

Cost: Free 

|Category |Category Display Name|
|---|---|
|KeyDeliveryRequests|Key Delivery Requests|


## Microsoft.Network/applicationGateways

Cost: Free 

|Category |Category Display Name|
|---|---|
|ApplicationGatewayAccessLog|Application Gateway Access Log|
|ApplicationGatewayFirewallLog|Application Gateway Firewall Log|
|ApplicationGatewayPerformanceLog|Application Gateway Performance Log|


## Microsoft.Network/azurefirewalls

Cost: Free 

|Category |Category Display Name|
|---|---|
|AzureFirewallApplicationRule|Azure Firewall Application Rule|
|AzureFirewallNetworkRule|Azure Firewall Network Rule|


## Microsoft.Network/bastionHosts

Cost: Free 

|Category |Category Display Name|
|---|---|
|BastionAuditLogs|Bastion Audit Logs|


## Microsoft.Network/expressRouteCircuits

Cost: Free 

|Category |Category Display Name|
|---|---|
|PeeringRouteLog|Peering Route Table Logs|


## Microsoft.Network/frontdoors

Cost: Free 

|Category |Category Display Name|
|---|---|
|FrontdoorAccessLog|Frontdoor Access Log|
|FrontdoorWebApplicationFirewallLog|Frontdoor Web Application Firewall Log|


## Microsoft.Network/loadBalancers

Cost: Free 

|Category |Category Display Name|
|---|---|
|LoadBalancerAlertEvent|Load Balancer Alert Events|
|LoadBalancerProbeHealthStatus|Load Balancer Probe Health Status|


## Microsoft.Network/networksecuritygroups

Cost: Free 

|Category |Category Display Name|
|---|---|
|NetworkSecurityGroupEvent|Network Security Group Event|
|NetworkSecurityGroupFlowEvent|Network Security Group Rule Flow Event|
|NetworkSecurityGroupRuleCounter|Network Security Group Rule Counter|


## Microsoft.Network/publicIPAddresses

Cost: Free 

|Category |Category Display Name|
|---|---|
|DDoSMitigationFlowLogs|Flow logs of DDoS mitigation decisions|
|DDoSMitigationReports|Reports of DDoS mitigations|
|DDoSProtectionNotifications|DDoS protection notifications|


## Microsoft.Network/trafficManagerProfiles

Cost: Free 

|Category |Category Display Name|
|---|---|
|ProbeHealthStatusEvents|Traffic Manager Probe Health Results Event|


## Microsoft.Network/virtualNetworkGateways

Cost: Free 

|Category |Category Display Name|
|---|---|
|GatewayDiagnosticLog|Gateway Diagnostic Logs|
|IKEDiagnosticLog|IKE Diagnostic Logs|
|P2SDiagnosticLog|P2S Diagnostic Logs|
|RouteDiagnosticLog|Route Diagnostic Logs|
|TunnelDiagnosticLog|Tunnel Diagnostic Logs|


## Microsoft.Network/virtualNetworks

Cost: Free 

|Category |Category Display Name|
|---|---|
|VMProtectionAlerts|VM protection alerts|


## Microsoft.PowerBIDedicated/capacities

Cost: Free 

|Category |Category Display Name|
|---|---|
|Engine|Engine|


## Microsoft.RecoveryServices/Vaults

Cost: Free 

|Category |Category Display Name|
|---|---|
|AddonAzureBackupAlerts|Addon Azure Backup Alert Data|
|AddonAzureBackupJobs|Addon Azure Backup Job Data|
|AddonAzureBackupPolicy|Addon Azure Backup Policy Data|
|AddonAzureBackupProtectedInstance|Addon Azure Backup Protected Instance Data|
|AddonAzureBackupStorage|Addon Azure Backup Storage Data|
|AzureBackupReport|Azure Backup Reporting Data|
|AzureSiteRecoveryEvents|Azure Site Recovery Events|
|AzureSiteRecoveryJobs|Azure Site Recovery Jobs|
|AzureSiteRecoveryProtectedDiskDataChurn|Azure Site Recovery Protected Disk Data Churn|
|AzureSiteRecoveryRecoveryPoints|Azure Site Recovery Recovery Points|
|AzureSiteRecoveryReplicatedItems|Azure Site Recovery Replicated Items|
|AzureSiteRecoveryReplicationDataUploadRate|Azure Site Recovery Replication Data Upload Rate|
|AzureSiteRecoveryReplicationStats|Azure Site Recovery Replication Stats|
|CoreAzureBackup|Core Azure Backup Data|


## Microsoft.Relay/namespaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|HybridConnectionsEvent|HybridConnections Events|


## Microsoft.Search/searchServices

Cost: Free 

|Category |Category Display Name|
|---|---|
|OperationLogs|Operation Logs|


## Microsoft.ServiceBus/namespaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|OperationalLogs|Operational Logs|


## Microsoft.SignalRService/SignalR

Cost: Free 

|Category |Category Display Name|
|---|---|
|AllLogs|Azure SignalR Service Logs.|


## Microsoft.Sql/managedInstances

Cost: Free 

|Category |Category Display Name|
|---|---|
|DevOpsOperationsAudit|Devops operations Audit Logs|
|ResourceUsageStats|Resource Usage Statistics|
|SQLSecurityAuditEvents|SQL Security Audit Event|


## Microsoft.Sql/managedInstances/databases

Cost: Free 

|Category |Category Display Name|
|---|---|
|Errors|Errors|
|QueryStoreRuntimeStatistics|Query Store Runtime Statistics|
|QueryStoreWaitStatistics|Query Store Wait Statistics|
|SQLInsights|SQL Insights|


## Microsoft.Sql/servers/databases

Cost: Free 

|Category |Category Display Name|
|---|---|
|AutomaticTuning|Automatic tuning|
|Blocks|Blocks|
|DatabaseWaitStatistics|Database Wait Statistics|
|Deadlocks|Deadlocks|
|DevOpsOperationsAudit|Devops operations Audit Logs|
|DmsWorkers|Dms Workers|
|Errors|Errors|
|ExecRequests|Exec Requests|
|QueryStoreRuntimeStatistics|Query Store Runtime Statistics|
|QueryStoreWaitStatistics|Query Store Wait Statistics|
|RequestSteps|Request Steps|
|SQLInsights|SQL Insights|
|SqlRequests|Sql Requests|
|SQLSecurityAuditEvents|SQL Security Audit Event|
|Timeouts|Timeouts|
|Waits|Waits|


## Microsoft.Storage/storageAccounts/blobServices

Cost: Paid as outlined in Platform Logs section of [Azure Monitor Pricing page.](https://azure.microsoft.com/pricing/details/monitor/) 

|Category |Category Display Name|
|---|---|
|StorageDelete|StorageDelete|
|StorageRead|StorageRead|
|StorageWrite|StorageWrite|


## Microsoft.Storage/storageAccounts/fileServices

Cost: Paid as outlined in Platform Logs section of [Azure Monitor Pricing page.](https://azure.microsoft.com/pricing/details/monitor/) 

|Category |Category Display Name|
|---|---|
|StorageDelete|StorageDelete|
|StorageRead|StorageRead|
|StorageWrite|StorageWrite|


## Microsoft.Storage/storageAccounts/queueServices

Cost: Paid as outlined in Platform Logs section of [Azure Monitor Pricing page.](https://azure.microsoft.com/pricing/details/monitor/) 
 
|Category |Category Display Name|
|---|---|
|StorageDelete|StorageDelete|
|StorageRead|StorageRead|
|StorageWrite|StorageWrite|


## Microsoft.Storage/storageAccounts/tableServices

Cost: Paid as outlined in Platform Logs section of [Azure Monitor Pricing page.](https://azure.microsoft.com/pricing/details/monitor/) 
 
|Category |Category Display Name|
|---|---|
|StorageDelete|StorageDelete|
|StorageRead|StorageRead|
|StorageWrite|StorageWrite|


## Microsoft.StreamAnalytics/streamingjobs

Cost: Free 

|Category |Category Display Name|
|---|---|
|Authoring|Authoring|
|Execution|Execution|


## Microsoft.Synapse/workspaces

Cost: Free 

|Category |Category Display Name|
|---|---|
|BuiltinSqlReqsEnded|Built-in Sql Pool Requests Ended|
|GatewayApiRequests|Synapse Gateway Api Requests|
|SQLSecurityAuditEvents|SQL Security Audit Event|
|SynapseRbacOperations|Synapse RBAC Operations|


## Microsoft.Synapse/workspaces/bigDataPools

Cost: Free 

|Category |Category Display Name|
|---|---|
|BigDataPoolAppsEnded|Big Data Pool Applications Ended|


## Microsoft.Synapse/workspaces/sqlPools

Cost: Free 

|Category |Category Display Name|
|---|---|
|DmsWorkers|Dms Workers|
|ExecRequests|Exec Requests|
|RequestSteps|Request Steps|
|SqlRequests|Sql Requests|
|SQLSecurityAuditEvents|Sql Security Audit Event|
|Waits|Waits|


## microsoft.web/hostingenvironments

Cost: Free 

|Category |Category Display Name|
|---|---|
|AppServiceEnvironmentPlatformLogs|App Service Environment Platform Logs|


## microsoft.web/sites

Cost: Free 


|Category |Category Display Name|
|---|---|
|AppServiceAppLogs|App Service Application Logs|
|AppServiceAuditLogs|Access Audit Logs|
|AppServiceConsoleLogs|App Service Console Logs|
|AppServiceFileAuditLogs|Site Content Change Audit Logs|
|AppServiceHTTPLogs|HTTP logs|
|FunctionAppLogs|Function Application Logs|


## microsoft.web/sites/slots

Cost: Free 


|Category |Category Display Name|
|---|---|
|AppServiceAppLogs|App Service Application Logs|
|AppServiceAuditLogs|Access Audit Logs|
|AppServiceConsoleLogs|App Service Console Logs|
|AppServiceFileAuditLogs|Site Content Change Audit Logs|
|AppServiceHTTPLogs|HTTP logs|
|FunctionAppLogs|Function Application Logs|


## Next Steps

* [Learn more about resource logs](./platform-logs-overview.md)
* [Stream resource resource logs to **Event Hubs**](./resource-logs.md#send-to-azure-event-hubs)
* [Change resource log diagnostic settings using the Azure Monitor REST API](/rest/api/monitor/diagnosticsettings)
* [Analyze logs from Azure storage with Log Analytics](./resource-logs.md#send-to-log-analytics-workspace)

