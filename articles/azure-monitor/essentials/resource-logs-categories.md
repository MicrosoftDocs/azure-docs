---
title: Supported categories for Azure Monitor resource logs
description: Understand the supported services and event schemas for Azure Monitor resource logs.
ms.topic: reference
ms.date: 09/07/2022
ms.reviewer: lualderm

---

# Supported categories for Azure Monitor resource logs

> [!NOTE]
> This list is largely auto-generated. Any modification made to this list via GitHub might be written over without warning. Contact the author of this article for details on how to make permanent updates.

[Azure Monitor resource logs](../essentials/platform-logs-overview.md) are logs emitted by Azure services that describe the operation of those services or resources. All resource logs available through Azure Monitor share a common top-level schema. Each service has the flexibility to emit unique properties for its own events.

Resource logs were previously known as diagnostic logs. The name was changed in October 2019 as the types of logs gathered by Azure Monitor shifted to include more than just the Azure resource.

A combination of the resource type (available in the `resourceId` property) and the category uniquely identifies a schema. There's a common schema for all resource logs with service-specific fields then added for different log categories. For more information, see [Common and service-specific schema for Azure resource logs](./resource-logs-schema.md).

## Costs

[Azure Monitor Log Analytics](https://azure.microsoft.com/pricing/details/monitor/), [Azure Storage](https://azure.microsoft.com/product-categories/storage/), [Azure Event Hubs](https://azure.microsoft.com/pricing/details/event-hubs/), and partners who integrate directly with Azure Monitor (for example, [Datadog](../../partner-solutions/datadog/overview.md)) have costs associated with ingesting data and storing data. Check the pricing pages linked in the previous sentence to understand the costs for those services. Resource logs are just one type of data that you can send to those locations. 

In addition, there might be costs to export some categories of resource logs to those locations. Logs with possible export costs are listed in the table in the next section. For more information on export pricing, see the **Platform Logs** section on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/).

## Supported log categories per resource type

Following is a list of the types of logs available for each resource type. 

Some categories might be supported only for specific types of resources. See the resource-specific documentation if you feel you're missing a resource. For example, Microsoft.Sql/servers/databases categories aren't available for all types of databases. For more information, see [information on SQL Database diagnostic logging](/azure/azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure). 

If you think something is missing, you can open a GitHub comment at the bottom of this article.


## Microsoft.AAD/domainServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AccountLogon|AccountLogon|No|
|AccountManagement|AccountManagement|No|
|DetailTracking|DetailTracking|No|
|DirectoryServiceAccess|DirectoryServiceAccess|No|
|LogonLogoff|LogonLogoff|No|
|ObjectAccess|ObjectAccess|No|
|PolicyChange|PolicyChange|No|
|PrivilegeUse|PrivilegeUse|No|
|SystemSecurity|SystemSecurity|No|


## microsoft.aadiam/tenants

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Signin|Signin|Yes|


## Microsoft.AgFoodPlatform/farmBeats

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationAuditLogs|Application Audit Logs|Yes|
|FarmManagementLogs|Farm Management Logs|Yes|
|FarmOperationLogs|Farm Operation Logs|Yes|
|InsightLogs|Insight Logs|Yes|
|JobProcessedLogs|Job Processed Logs|Yes|
|ModelInferenceLogs|Model Inference Logs|Yes|
|ProviderAuthLogs|Provider Auth Logs|Yes|
|SatelliteLogs|Satellite Logs|Yes|
|SensorManagementLogs|Sensor Management Logs|Yes|
|WeatherLogs|Weather Logs|Yes|


## Microsoft.AnalysisServices/servers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine|Engine|No|
|Service|Service|No|


## Microsoft.ApiManagement/service

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayLogs|Logs related to ApiManagement Gateway|No|


## Microsoft.AppConfiguration/configurationStores

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit|Yes|
|HttpRequest|HTTP Requests|Yes|


## Microsoft.AppPlatform/Spring

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationConsole|Application Console|No|
|BuildLogs|Build Logs|Yes|
|ContainerEventLogs|Container Event Logs|Yes|
|IngressLogs|Ingress Logs|Yes|
|SystemLogs|System Logs|No|


## Microsoft.Attestation/attestationProviders

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent|AuditEvent message log category.|No|
|ERR|Error message log category.|No|
|INF|Informational message log category.|No|
|WRN|Warning message log category.|No|


## Microsoft.Automation/automationAccounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DscNodeStatus|Dsc Node Status|No|
|JobLogs|Job Logs|No|
|JobStreams|Job Streams|No|


## Microsoft.AutonomousDevelopmentPlatform/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit|Yes|
|Operational|Operational|Yes|
|Request|Request|Yes|


## Microsoft.AutonomousDevelopmentPlatform/datapools

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit|Yes|
|Operational|Operational|Yes|
|Request|Request|Yes|


## Microsoft.AutonomousDevelopmentPlatform/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit|Yes|
|Operational|Operational|Yes|
|Request|Request|Yes|


## microsoft.avs/privateClouds

|Category|Category Display Name|Costs To Export|
|---|---|---|
|vmwaresyslog|VMware VCenter Syslog|Yes|


## Microsoft.Batch/batchAccounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ServiceLog|Service Logs|No|


## Microsoft.BatchAI/workspaces
|Category|Category Display Name|Costs To Export|
|---|---|---|
|BaiClusterEvent|BaiClusterEvent|No|
|BaiClusterNodeEvent|BaiClusterNodeEvent|No|
|BaiJobEvent|BaiJobEvent|No|


## Microsoft.Blockchain/blockchainMembers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BlockchainApplication|Blockchain Application|No|
|FabricOrderer|Fabric Orderer|No|
|FabricPeer|Fabric Peer|No|
|Proxy|Proxy|No|


## Microsoft.Blockchain/cordaMembers
|Category|Category Display Name|Costs To Export|
|---|---|---|
|BlockchainApplication|Blockchain Application|No|


## microsoft.botservice/botservices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BotRequest|Requests from the channels to the bot|No|


## Microsoft.Cache/redis

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ConnectedClientList|Connected client list|Yes|


## Microsoft.Cdn/cdnwebapplicationfirewallpolicies

|Category|Category Display Name|Costs To Export|
|---|---|---|
|WebApplicationFirewallLogs|Web Appliation Firewall Logs|No|


## Microsoft.Cdn/profiles

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AzureCdnAccessLog|Azure Cdn Access Log|No|
|FrontDoorAccessLog|FrontDoor Access Log|Yes|
|FrontDoorHealthProbeLog|FrontDoor Health Probe Log|Yes|
|FrontDoorWebApplicationFirewallLog|FrontDoor WebApplicationFirewall Log|Yes|


## Microsoft.Cdn/profiles/endpoints

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CoreAnalytics|Gets the metrics of the endpoint, e.g., bandwidth, egress, etc.|No|


## Microsoft.ClassicNetwork/networksecuritygroups

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Network Security Group Rule Flow Event|Network Security Group Rule Flow Event|No|


## Microsoft.CognitiveServices/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit Logs|No|
|RequestResponse|Request and Response Logs|No|
|Trace|Trace Logs|No|


## Microsoft.Communication/CommunicationServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuthOperational|Operational Authentication Logs|Yes|
|CallDiagnostics|Call Diagnostics Logs|Yes|
|CallSummary|Call Summary Logs|Yes|
|ChatOperational|Operational Chat Logs|No|
|EmailSendMailOperational|Email Service Send Mail Logs|Yes|
|EmailStatusUpdateOperational|Email Service Delivery Status Update Logs|Yes|
|EmailUserEngagementOperational|Email Service User Engagement Logs|Yes|
|NetworkTraversalDiagnostics|Network Traversal Relay Diagnostic Logs|Yes|
|NetworkTraversalOperational|Operational Network Traversal Logs|Yes|
|SMSOperational|Operational SMS Logs|No|
|Usage|Usage Records|No|


## Microsoft.ConnectedCache/CacheNodes

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Events|Events|Yes|


## Microsoft.ConnectedVehicle/platformAccounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|MCVP Audit Logs|Yes|
|Logs|MCVP Logs|Yes|


## Microsoft.ContainerRegistry/registries

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ContainerRegistryLoginEvents|Login Events|No|
|ContainerRegistryRepositoryEvents|RepositoryEvent logs|No|


## Microsoft.ContainerService/managedClusters

|Category|Category Display Name|Costs To Export|
|---|---|---|
|cloud-controller-manager|Kubernetes Cloud Controller Manager|Yes|
|cluster-autoscaler|Kubernetes Cluster Autoscaler|No|
|guard|Kubernetes Guard|No|
|kube-apiserver|Kubernetes API Server|No|
|kube-audit|Kubernetes Audit|No|
|kube-audit-admin|Kubernetes Audit Admin Logs|No|
|kube-controller-manager|Kubernetes Controller Manager|No|
|kube-scheduler|Kubernetes Scheduler|No|


## Microsoft.CustomProviders/resourceproviders

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs|Audit logs for MiniRP calls|No|


## Microsoft.D365CustomerInsights/instances

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit events|No|
|Operational|Operational events|No|


## Microsoft.Dashboard/grafana

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GrafanaLoginEvents|Grafana Login Events|Yes|


## Microsoft.Databricks/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|accounts|Databricks Accounts|No|
|clusters|Databricks Clusters|No|
|databrickssql|Databricks DatabricksSQL|Yes|
|dbfs|Databricks File System|No|
|deltaPipelines|Databricks Delta Pipelines|Yes|
|featureStore|Databricks Feature Store|Yes|
|genie|Databricks Genie|Yes|
|globalInitScripts|Databricks Global Init Scripts|Yes|
|iamRole|Databricks IAM Role|Yes|
|instancePools|Instance Pools|No|
|jobs|Databricks Jobs|No|
|mlflowAcledArtifact|Databricks MLFlow Acled Artifact|Yes|
|mlflowExperiment|Databricks MLFlow Experiment|Yes|
|modelRegistry|Databricks Model Registry|Yes|
|notebook|Databricks Notebook|No|
|RemoteHistoryService|Databricks Remote History Service|Yes|
|repos|Databricks Repos|Yes|
|secrets|Databricks Secrets|No|
|sqlanalytics|Databricks SQL Analytics|Yes|
|sqlPermissions|Databricks SQLPermissions|No|
|ssh|Databricks SSH|No|
|unityCatalog|Databricks Unity Catalog|Yes|
|workspace|Databricks Workspace|No|


## Microsoft.DataCollaboration/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CollaborationAudit|Collaboration Audit|Yes|
|Computations|Computations|Yes|
|DataAssets|Data Assets|No|
|Pipelines|Pipelines|No|
|Proposals|Proposals|No|
|Scripts|Scripts|No|


## Microsoft.DataFactory/factories

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ActivityRuns|Pipeline activity runs log|No|
|PipelineRuns|Pipeline runs log|No|
|SandboxActivityRuns|Sandbox Activity runs log|Yes|
|SandboxPipelineRuns|Sandbox Pipeline runs log|Yes|
|SSISIntegrationRuntimeLogs|SSIS integration runtime logs|No|
|SSISPackageEventMessageContext|SSIS package event message context|No|
|SSISPackageEventMessages|SSIS package event messages|No|
|SSISPackageExecutableStatistics|SSIS package executable statistics|No|
|SSISPackageExecutionComponentPhases|SSIS package execution component phases|No|
|SSISPackageExecutionDataStatistics|SSIS package exeution data statistics|No|
|TriggerRuns|Trigger runs log|No|


## Microsoft.DataLakeAnalytics/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit Logs|No|
|Requests|Request Logs|No|


## Microsoft.DataLakeStore/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit Logs|No|
|Requests|Request Logs|No|


## Microsoft.DataShare/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ReceivedShareSnapshots|Received Share Snapshots|No|
|SentShareSnapshots|Sent Share Snapshots|No|
|Shares|Shares|No|
|ShareSubscriptions|Share Subscriptions|No|


## Microsoft.DBforMariaDB/servers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|MySqlAuditLogs|MariaDB Audit Logs|No|
|MySqlSlowLogs|MariaDB Server Logs|No|


## Microsoft.DBforMySQL/flexibleServers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|MySqlAuditLogs|MySQL Audit Logs|No|
|MySqlSlowLogs|MySQL Slow Logs|No|


## Microsoft.DBforMySQL/servers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|MySqlAuditLogs|MySQL Audit Logs|No|
|MySqlSlowLogs|MySQL Server Logs|No|


## Microsoft.DBforPostgreSQL/flexibleServers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|No|


## Microsoft.DBForPostgreSQL/serverGroupsv2

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|Yes|


## Microsoft.DBforPostgreSQL/servers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|No|
|QueryStoreRuntimeStatistics|PostgreSQL Query Store Runtime Statistics|No|
|QueryStoreWaitStatistics|PostgreSQL Query Store Wait Statistics|No|


## Microsoft.DBforPostgreSQL/serversv2

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs|PostgreSQL Server Logs|No|


## Microsoft.DesktopVirtualization/applicationgroups

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Checkpoint|Checkpoint|No|
|Error|Error|No|
|Management|Management|No|


## Microsoft.DesktopVirtualization/hostpools

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AgentHealthStatus|AgentHealthStatus|No|
|Checkpoint|Checkpoint|No|
|Connection|Connection|No|
|Error|Error|No|
|HostRegistration|HostRegistration|No|
|Management|Management|No|


## Microsoft.DesktopVirtualization/scalingplans

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Autoscale|Autoscale logs|Yes|


## Microsoft.DesktopVirtualization/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Checkpoint|Checkpoint|No|
|Error|Error|No|
|Feed|Feed|No|
|Management|Management|No|


## Microsoft.Devices/ElasticPools/IotHubTenants

|Category|Category Display Name|Costs To Export|
|---|---|---|
|C2DCommands|C2D Commands|No|
|C2DTwinOperations|C2D Twin Operations|No|
|Configurations|Configurations|No|
|Connections|Connections|No|
|D2CTwinOperations|D2CTwinOperations|No|
|DeviceIdentityOperations|Device Identity Operations|No|
|DeviceStreams|Device Streams (Preview)|No|
|DeviceTelemetry|Device Telemetry|No|
|DirectMethods|Direct Methods|No|
|DistributedTracing|Distributed Tracing (Preview)|No|
|FileUploadOperations|File Upload Operations|No|
|JobsOperations|Jobs Operations|No|
|Routes|Routes|No|
|TwinQueries|Twin Queries|No|


## Microsoft.Devices/IotHubs

|Category|Category Display Name|Costs To Export|
|---|---|---|
|C2DCommands|C2D Commands|No|
|C2DTwinOperations|C2D Twin Operations|No|
|Configurations|Configurations|No|
|Connections|Connections|No|
|D2CTwinOperations|D2CTwinOperations|No|
|DeviceIdentityOperations|Device Identity Operations|No|
|DeviceStreams|Device Streams (Preview)|No|
|DeviceTelemetry|Device Telemetry|No|
|DirectMethods|Direct Methods|No|
|DistributedTracing|Distributed Tracing (Preview)|No|
|FileUploadOperations|File Upload Operations|No|
|JobsOperations|Jobs Operations|No|
|Routes|Routes|No|
|TwinQueries|Twin Queries|No|


## Microsoft.Devices/provisioningServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeviceOperations|Device Operations|No|
|ServiceOperations|Service Operations|No|


## Microsoft.DigitalTwins/digitalTwinsInstances

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataHistoryOperation|DataHistoryOperation|Yes|
|DigitalTwinsOperation|DigitalTwinsOperation|No|
|EventRoutesOperation|EventRoutesOperation|No|
|ModelsOperation|ModelsOperation|No|
|QueryOperation|QueryOperation|No|
|ResourceProviderOperation|ResourceProviderOperation|Yes|


## Microsoft.DocumentDB/cassandraClusters

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CassandraAudit|CassandraAudit|Yes|
|CassandraLogs|CassandraLogs|Yes|


## Microsoft.DocumentDB/databaseAccounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CassandraRequests|CassandraRequests|No|
|ControlPlaneRequests|ControlPlaneRequests|No|
|DataPlaneRequests|DataPlaneRequests|No|
|GremlinRequests|GremlinRequests|No|
|MongoRequests|MongoRequests|No|
|PartitionKeyRUConsumption|PartitionKeyRUConsumption|No|
|PartitionKeyStatistics|PartitionKeyStatistics|No|
|QueryRuntimeStatistics|QueryRuntimeStatistics|No|
|TableApiRequests|TableApiRequests|Yes|


## Microsoft.EventGrid/domains

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures|Delivery Failure Logs|No|
|PublishFailures|Publish Failure Logs|No|


## Microsoft.EventGrid/partnerNamespaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures|Delivery Failure Logs|No|
|PublishFailures|Publish Failure Logs|No|


## Microsoft.EventGrid/partnerTopics

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures|Delivery Failure Logs|No|


## Microsoft.EventGrid/systemTopics

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures|Delivery Failure Logs|No|


## Microsoft.EventGrid/topics

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures|Delivery Failure Logs|No|
|PublishFailures|Publish Failure Logs|No|


## Microsoft.EventHub/namespaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationMetricsLogs|Application Metrics Logs|Yes|
|ArchiveLogs|Archive Logs|No|
|AutoScaleLogs|Auto Scale Logs|No|
|CustomerManagedKeyUserLogs|Customer Managed Key Logs|No|
|EventHubVNetConnectionEvent|VNet/IP Filtering Connection Logs|No|
|KafkaCoordinatorLogs|Kafka Coordinator Logs|No|
|KafkaUserErrorLogs|Kafka User Error Logs|No|
|OperationalLogs|Operational Logs|No|
|RuntimeAuditLogs|Runtime Audit Logs|Yes|


## microsoft.experimentation/experimentWorkspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ExPCompute|ExPCompute|Yes|
|Request|Request|No|


## Microsoft.HealthcareApis/services

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs|Audit logs|No|
|DiagnosticLogs|Diagnostic logs|Yes|


## Microsoft.HealthcareApis/workspaces/dicomservices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs|Audit logs|Yes|


## Microsoft.HealthcareApis/workspaces/fhirservices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs|FHIR Audit logs|Yes|


## Microsoft.HealthcareApis/workspaces/iotconnectors

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DiagnosticLogs|Diagnostic logs|Yes|


## Microsoft.Insights/AutoscaleSettings

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AutoscaleEvaluations|Autoscale Evaluations|No|
|AutoscaleScaleActions|Autoscale Scale Actions|No|


## Microsoft.Insights/Components

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppAvailabilityResults|Availability results|No|
|AppBrowserTimings|Browser timings|No|
|AppDependencies|Dependencies|No|
|AppEvents|Events|No|
|AppExceptions|Exceptions|No|
|AppMetrics|Metrics|No|
|AppPageViews|Page views|No|
|AppPerformanceCounters|Performance counters|No|
|AppRequests|Requests|No|
|AppSystemEvents|System events|No|
|AppTraces|Traces|No|


## Microsoft.KeyVault/managedHSMs

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent|Audit Logs|No|


## Microsoft.KeyVault/vaults

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent|Audit Logs|No|


## Microsoft.Kusto/Clusters

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Command|Command|No|
|FailedIngestion|Failed ingest operations|No|
|IngestionBatching|Ingestion batching|No|
|Journal|Journal|Yes|
|Query|Query|No|
|SucceededIngestion|Successful ingest operations|No|
|TableDetails|Table details|No|
|TableUsageStatistics|Table usage statistics|No|


## microsoft.loadtestservice/loadtests

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationLogs|Azure Load Testing Operations|Yes|


## Microsoft.Logic/integrationAccounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|IntegrationAccountTrackingEvents|Integration Account track events|No|


## Microsoft.Logic/workflows

|Category|Category Display Name|Costs To Export|
|---|---|---|
|WorkflowRuntime|Workflow runtime diagnostic events|No|


## Microsoft.MachineLearningServices/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AmlComputeClusterEvent|AmlComputeClusterEvent|No|
|AmlComputeCpuGpuUtilization|AmlComputeCpuGpuUtilization|No|
|AmlComputeJobEvent|AmlComputeJobEvent|No|
|AmlRunStatusChangedEvent|AmlRunStatusChangedEvent|No|


## Microsoft.Media/mediaservices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|KeyDeliveryRequests|Key Delivery Requests|No|


## Microsoft.Media/videoanalyzers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit Logs|Yes|
|Diagnostics|Diagnostics Logs|Yes|
|Operational|Operational Logs|Yes|


## Microsoft.Network/applicationGateways

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationGatewayAccessLog|Application Gateway Access Log|No|
|ApplicationGatewayFirewallLog|Application Gateway Firewall Log|No|
|ApplicationGatewayPerformanceLog|Application Gateway Performance Log|No|


## Microsoft.Network/azurefirewalls

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AzureFirewallApplicationRule|Azure Firewall Application Rule|No|
|AzureFirewallDnsProxy|Azure Firewall DNS Proxy|No|
|AzureFirewallNetworkRule|Azure Firewall Network Rule|No|


## Microsoft.Network/bastionHosts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BastionAuditLogs|Bastion Audit Logs|No|


## Microsoft.Network/expressRouteCircuits

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PeeringRouteLog|Peering Route Table Logs|No|


## Microsoft.Network/frontdoors

|Category|Category Display Name|Costs To Export|
|---|---|---|
|FrontdoorAccessLog|Frontdoor Access Log|No|
|FrontdoorWebApplicationFirewallLog|Frontdoor Web Application Firewall Log|No|


## Microsoft.Network/loadBalancers

|Category|Category Display Name|Costs To Export|
|---|---|---|
|LoadBalancerAlertEvent|Load Balancer Alert Events|No|
|LoadBalancerProbeHealthStatus|Load Balancer Probe Health Status|No|


## Microsoft.Network/networksecuritygroups

|Category|Category Display Name|Costs To Export|
|---|---|---|
|NetworkSecurityGroupEvent|Network Security Group Event|No|
|NetworkSecurityGroupFlowEvent|Network Security Group Rule Flow Event|No|
|NetworkSecurityGroupRuleCounter|Network Security Group Rule Counter|No|


## Microsoft.Network/networkSecurityPerimeters

|Category|Category Display Name|Costs To Export|
|---|---|---|
|NspIntraPerimeterInboundAllowed|Inbound access allowed within same perimeter.|Yes|
|NspIntraPerimeterOutboundAllowed|Outbound attempted to same perimeter.|Yes|
|NspPrivateInboundAllowed|Private endpoint traffic allowed.|Yes|
|NspPublicInboundPerimeterRulesAllowed|Public inbound access allowed by NSP access rules.|Yes|
|NspPublicInboundPerimeterRulesDenied|Public inbound access denied by NSP access rules.|Yes|
|NspPublicInboundResourceRulesAllowed|Public inbound access allowed by PaaS resource rules.|Yes|
|NspPublicInboundResourceRulesDenied|Public inbound access denied by PaaS resource rules.|Yes|
|NspPublicOutboundPerimeterRulesAllowed|Public outbound access allowed by NSP access rules.|Yes|
|NspPublicOutboundPerimeterRulesDenied|Public outbound access denied by NSP access rules.|Yes|
|NspPublicOutboundResourceRulesAllowed|Public outbound access allowed by PaaS resource rules.|Yes|
|NspPublicOutboundResourceRulesDenied|Public outbound access denied by PaaS resource rules|Yes|


## Microsoft.Network/p2sVpnGateways

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayDiagnosticLog|Gateway Diagnostic Logs|No|
|IKEDiagnosticLog|IKE Diagnostic Logs|No|
|P2SDiagnosticLog|P2S Diagnostic Logs|No|


## Microsoft.Network/publicIPAddresses

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DDoSMitigationFlowLogs|Flow logs of DDoS mitigation decisions|No|
|DDoSMitigationReports|Reports of DDoS mitigations|No|
|DDoSProtectionNotifications|DDoS protection notifications|No|


## Microsoft.Network/trafficManagerProfiles

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ProbeHealthStatusEvents|Traffic Manager Probe Health Results Event|No|


## Microsoft.Network/virtualNetworkGateways

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayDiagnosticLog|Gateway Diagnostic Logs|No|
|IKEDiagnosticLog|IKE Diagnostic Logs|No|
|P2SDiagnosticLog|P2S Diagnostic Logs|No|
|RouteDiagnosticLog|Route Diagnostic Logs|No|
|TunnelDiagnosticLog|Tunnel Diagnostic Logs|No|


## Microsoft.Network/virtualNetworks

|Category|Category Display Name|Costs To Export|
|---|---|---|
|VMProtectionAlerts|VM protection alerts|No|


## Microsoft.Network/vpnGateways

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayDiagnosticLog|Gateway Diagnostic Logs|No|
|IKEDiagnosticLog|IKE Diagnostic Logs|No|
|RouteDiagnosticLog|Route Diagnostic Logs|No|
|TunnelDiagnosticLog|Tunnel Diagnostic Logs|No|


## Microsoft.NetworkFunction/azureTrafficCollectors

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ExpressRouteCircuitIpfix|Express Route Circuit IPFIX Flow Records|Yes|


## Microsoft.NotificationHubs/namespaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationalLogs|Operational Logs|No|


## MICROSOFT.OPENENERGYPLATFORM/ENERGYSERVICES

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AirFlowTaskLogs|Air Flow Task Logs|Yes|
|ElasticOperatorLogs|Elastic Operator Logs|Yes|
|ElasticsearchLogs|Elasticsearch Logs|Yes|


## Microsoft.OpenLogisticsPlatform/Workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|SupplyChainEntityOperations|Supply Chain Entity Operations|Yes|
|SupplyChainEventLogs|Supply Chain Event logs|Yes|


## Microsoft.OperationalInsights/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit Logs|No|


## Microsoft.PowerBI/tenants

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine|Engine|No|


## Microsoft.PowerBI/tenants/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine|Engine|No|


## Microsoft.PowerBIDedicated/capacities

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine|Engine|No|


## Microsoft.Purview/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ScanStatusLogEvent|ScanStatus|No|


## Microsoft.RecoveryServices/Vaults

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AddonAzureBackupAlerts|Addon Azure Backup Alert Data|No|
|AddonAzureBackupJobs|Addon Azure Backup Job Data|No|
|AddonAzureBackupPolicy|Addon Azure Backup Policy Data|No|
|AddonAzureBackupProtectedInstance|Addon Azure Backup Protected Instance Data|No|
|AddonAzureBackupStorage|Addon Azure Backup Storage Data|No|
|AzureBackupReport|Azure Backup Reporting Data|No|
|AzureSiteRecoveryEvents|Azure Site Recovery Events|No|
|AzureSiteRecoveryJobs|Azure Site Recovery Jobs|No|
|AzureSiteRecoveryProtectedDiskDataChurn|Azure Site Recovery Protected Disk Data Churn|No|
|AzureSiteRecoveryRecoveryPoints|Azure Site Recovery Recovery Points|No|
|AzureSiteRecoveryReplicatedItems|Azure Site Recovery Replicated Items|No|
|AzureSiteRecoveryReplicationDataUploadRate|Azure Site Recovery Replication Data Upload Rate|No|
|AzureSiteRecoveryReplicationStats|Azure Site Recovery Replication Stats|No|
|CoreAzureBackup|Core Azure Backup Data|No|


## Microsoft.Relay/namespaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|HybridConnectionsEvent|HybridConnections Events|No|


## Microsoft.Search/searchServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationLogs|Operation Logs|No|


## Microsoft.Security/antiMalwareSettings

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ScanResults|AntimalwareScanResults|Yes|


## microsoft.securityinsights/settings

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataConnectors|Data Collection - Connectors|Yes|


## Microsoft.ServiceBus/namespaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationalLogs|Operational Logs|No|
|VNetAndIPFilteringLogs|VNet/IP Filtering Connection Logs|No|


## Microsoft.SignalRService/SignalR

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AllLogs|Azure SignalR Service Logs.|No|


## Microsoft.SignalRService/WebPubSub

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AllLogs|Azure Web PubSub Service Logs.|Yes|


## microsoft.singularity/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Execution|Execution Logs|Yes|


## Microsoft.Sql/managedInstances

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DevOpsOperationsAudit|Devops operations Audit Logs|No|
|ResourceUsageStats|Resource Usage Statistics|No|
|SQLSecurityAuditEvents|SQL Security Audit Event|No|


## Microsoft.Sql/managedInstances/databases

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Errors|Errors|No|
|QueryStoreRuntimeStatistics|Query Store Runtime Statistics|No|
|QueryStoreWaitStatistics|Query Store Wait Statistics|No|
|SQLInsights|SQL Insights|No|


## Microsoft.Sql/servers/databases

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AutomaticTuning|Automatic tuning|No|
|Blocks|Blocks|No|
|DatabaseWaitStatistics|Database Wait Statistics|No|
|Deadlocks|Deadlocks|No|
|DevOpsOperationsAudit|Devops operations Audit Logs|No|
|DmsWorkers|Dms Workers|No|
|Errors|Errors|No|
|ExecRequests|Exec Requests|No|
|QueryStoreRuntimeStatistics|Query Store Runtime Statistics|No|
|QueryStoreWaitStatistics|Query Store Wait Statistics|No|
|RequestSteps|Request Steps|No|
|SQLInsights|SQL Insights|No|
|SqlRequests|Sql Requests|No|
|SQLSecurityAuditEvents|SQL Security Audit Event|No|
|Timeouts|Timeouts|No|
|Waits|Waits|No|


## Microsoft.Storage/storageAccounts/blobServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete|StorageDelete|Yes|
|StorageRead|StorageRead|Yes|
|StorageWrite|StorageWrite|Yes|


## Microsoft.Storage/storageAccounts/fileServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete|StorageDelete|Yes|
|StorageRead|StorageRead|Yes|
|StorageWrite|StorageWrite|Yes|


## Microsoft.Storage/storageAccounts/queueServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete|StorageDelete|Yes|
|StorageRead|StorageRead|Yes|
|StorageWrite|StorageWrite|Yes|


## Microsoft.Storage/storageAccounts/tableServices

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete|StorageDelete|Yes|
|StorageRead|StorageRead|Yes|
|StorageWrite|StorageWrite|Yes|


## Microsoft.StorageCache/caches

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AscCacheOperationEvent|HPC Cache operation event|Yes|
|AscUpgradeEvent|HPC Cache upgrade event|Yes|
|AscWarningEvent|HPC Cache warning|Yes|


## Microsoft.StreamAnalytics/streamingjobs

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Authoring|Authoring|No|
|Execution|Execution|No|


## Microsoft.Synapse/workspaces

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BuiltinSqlReqsEnded|Built-in Sql Pool Requests Ended|No|
|GatewayApiRequests|Synapse Gateway Api Requests|No|
|IntegrationActivityRuns|Integration Activity Runs|Yes|
|IntegrationPipelineRuns|Integration Pipeline Runs|Yes|
|IntegrationTriggerRuns|Integration Trigger Runs|Yes|
|SQLSecurityAuditEvents|SQL Security Audit Event|No|
|SynapseRbacOperations|Synapse RBAC Operations|No|


## Microsoft.Synapse/workspaces/bigDataPools

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BigDataPoolAppsEnded|Big Data Pool Applications Ended|No|


## Microsoft.Synapse/workspaces/kustoPools

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Command|Command|Yes|
|FailedIngestion|Failed ingest operations|Yes|
|IngestionBatching|Ingestion batching|Yes|
|Query|Query|Yes|
|SucceededIngestion|Successful ingest operations|Yes|
|TableDetails|Table details|Yes|
|TableUsageStatistics|Table usage statistics|Yes|


## Microsoft.Synapse/workspaces/sqlPools

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DmsWorkers|Dms Workers|No|
|ExecRequests|Exec Requests|No|
|RequestSteps|Request Steps|No|
|SqlRequests|Sql Requests|No|
|SQLSecurityAuditEvents|Sql Security Audit Event|No|
|Waits|Waits|No|


## Microsoft.TimeSeriesInsights/environments

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Ingress|Ingress|No|
|Management|Management|No|


## Microsoft.TimeSeriesInsights/environments/eventsources

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Ingress|Ingress|No|
|Management|Management|No|


## microsoft.videoindexer/accounts

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit|Audit|Yes|


## microsoft.web/hostingenvironments

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppServiceEnvironmentPlatformLogs|App Service Environment Platform Logs|No|


## microsoft.web/sites

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppServiceAntivirusScanAuditLogs|Report Antivirus Audit Logs|No|
|AppServiceAppLogs|App Service Application Logs|No|
|AppServiceAuditLogs|Access Audit Logs|No|
|AppServiceConsoleLogs|App Service Console Logs|No|
|AppServiceFileAuditLogs|Site Content Change Audit Logs|No|
|AppServiceHTTPLogs|HTTP logs|No|
|AppServiceIPSecAuditLogs|IPSecurity Audit logs|No|
|AppServicePlatformLogs|App Service Platform logs|No|
|FunctionAppLogs|Function Application Logs|No|


## microsoft.web/sites/slots

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppServiceAntivirusScanAuditLogs|Report Antivirus Audit Logs|No|
|AppServiceAppLogs|App Service Application Logs|No|
|AppServiceAuditLogs|Access Audit Logs|No|
|AppServiceConsoleLogs|App Service Console Logs|No|
|AppServiceFileAuditLogs|Site Content Change Audit Logs|No|
|AppServiceHTTPLogs|HTTP logs|No|
|AppServiceIPSecAuditLogs|IPSecurity Audit Logs|No|
|AppServicePlatformLogs|App Service Platform logs|No|
|FunctionAppLogs|Function Application Logs|No|


## Next Steps

* [Learn more about resource logs](../essentials/platform-logs-overview.md)
* [Stream resource resource logs to **Event Hubs**](./resource-logs.md#send-to-azure-event-hubs)
* [Change resource log diagnostic settings using the Azure Monitor REST API](/rest/api/monitor/diagnosticsettings)
* [Analyze logs from Azure storage with Log Analytics](./resource-logs.md#send-to-log-analytics-workspace)
