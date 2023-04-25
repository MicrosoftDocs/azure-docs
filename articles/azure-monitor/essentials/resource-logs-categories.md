---
title: Supported categories for Azure Monitor resource logs
description: Understand the supported services and event schemas for Azure Monitor resource logs.
author: EdB-MSFT
ms.topic: reference
ms.date: 04/13/2023
ms.author: edbaynash
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

## Microsoft.AAD/DomainServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AccountLogon |AccountLogon |No |
|AccountManagement |AccountManagement |No |
|DetailTracking |DetailTracking |No |
|DirectoryServiceAccess |DirectoryServiceAccess |No |
|LogonLogoff |LogonLogoff |No |
|ObjectAccess |ObjectAccess |No |
|PolicyChange |PolicyChange |No |
|PrivilegeUse |PrivilegeUse |No |
|SystemSecurity |SystemSecurity |No |

## microsoft.aadiam/tenants  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Signin |Signin |Yes |

## Microsoft.AgFoodPlatform/farmBeats  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationAuditLogs |Application Audit Logs |Yes |
|FarmManagementLogs |Farm Management Logs |Yes |
|FarmOperationLogs |Farm Operation Logs |Yes |
|InsightLogs |Insight Logs |Yes |
|JobProcessedLogs |Job Processed Logs |Yes |
|ModelInferenceLogs |Model Inference Logs |Yes |
|ProviderAuthLogs |Provider Auth Logs |Yes |
|SatelliteLogs |Satellite Logs |Yes |
|SensorManagementLogs |Sensor Management Logs |Yes |
|WeatherLogs |Weather Logs |Yes |

## Microsoft.AnalysisServices/servers  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine |Engine |No |
|Service |Service |No |

## Microsoft.ApiManagement/service  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayLogs |Logs related to ApiManagement Gateway |No |
|WebSocketConnectionLogs |Logs related to Websocket Connections |Yes |

## Microsoft.App/managedEnvironments  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppEnvSpringAppConsoleLogs |Spring App console logs |Yes |
|ContainerAppConsoleLogs |Container App console logs |Yes |
|ContainerAppSystemLogs |Container App system logs |Yes |

## Microsoft.AppConfiguration/configurationStores  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit |Yes |
|HttpRequest |HTTP Requests |Yes |

## Microsoft.AppPlatform/Spring  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationConsole |Application Console |No |
|BuildLogs |Build Logs |Yes |
|ContainerEventLogs |Container Event Logs |Yes |
|IngressLogs |Ingress Logs |Yes |
|SystemLogs |System Logs |No |

## Microsoft.Attestation/attestationProviders  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent |AuditEvent message log category. |No |
|NotProcessed |Requests which could not be processed. |Yes |
|Operational |Operational message log category. |Yes |

## Microsoft.Automation/automationAccounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent |AuditEvent |Yes |
|DscNodeStatus |DscNodeStatus |No |
|JobLogs |JobLogs |No |
|JobStreams |JobStreams |No |

## Microsoft.AutonomousDevelopmentPlatform/accounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit |Yes |
|Operational |Operational |Yes |
|Request |Request |Yes |

## Microsoft.AutonomousDevelopmentPlatform/workspaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit |Yes |
|Operational |Operational |Yes |
|Request |Request |Yes |

## microsoft.avs/privateClouds  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|vmwaresyslog |VMware Syslog |Yes |

## microsoft.azuresphere/catalogs  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs |Audit Logs |Yes |
|DeviceEvents |Device Events |Yes |

## Microsoft.Batch/batchaccounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLog |Audit Logs |Yes |
|ServiceLog |Service Logs |No |
|ServiceLogs |Service Logs |Yes |

## microsoft.botservice/botservices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BotRequest |Requests from the channels to the bot |Yes |

## Microsoft.Cache/redis  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ConnectedClientList |Connected client list |Yes |

## Microsoft.Cache/redisEnterprise/databases  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ConnectionEvents |Connection events (New Connection/Authentication/Disconnection) |Yes |

## Microsoft.Cdn/cdnwebapplicationfirewallpolicies  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|WebApplicationFirewallLogs |Web Appliation Firewall Logs |No |

## Microsoft.Cdn/profiles  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AzureCdnAccessLog |Azure Cdn Access Log |No |
|FrontDoorAccessLog |FrontDoor Access Log |Yes |
|FrontDoorHealthProbeLog |FrontDoor Health Probe Log |Yes |
|FrontDoorWebApplicationFirewallLog |FrontDoor WebApplicationFirewall Log |Yes |

## Microsoft.Cdn/profiles/endpoints  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CoreAnalytics |Gets the metrics of the endpoint, e.g., bandwidth, egress, etc. |No |

## Microsoft.Chaos/experiments  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ExperimentOrchestration |Experiment Orchestration Events |Yes |

## Microsoft.ClassicNetwork/networksecuritygroups  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Network Security Group Rule Flow Event |Network Security Group Rule Flow Event |No |

## Microsoft.CodeSigning/codesigningaccounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|SignTransactions |Sign Transactions |Yes |

## Microsoft.CognitiveServices/accounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit Logs |No |
|RequestResponse |Request and Response Logs |No |
|Trace |Trace Logs |No |

## Microsoft.Communication/CommunicationServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuthOperational |Operational Authentication Logs |Yes |
|CallAutomationOperational |Operational Call Automation Logs |Yes |
|CallDiagnostics |Call Diagnostics Logs |Yes |
|CallRecordingSummary |Call Recording Summary Logs |Yes |
|CallSummary |Call Summary Logs |Yes |
|ChatOperational |Operational Chat Logs |No |
|EmailSendMailOperational |Email Service Send Mail Logs |Yes |
|EmailStatusUpdateOperational |Email Service Delivery Status Update Logs |Yes |
|EmailUserEngagementOperational |Email Service User Engagement Logs |Yes |
|JobRouterOperational |Operational Job Router Logs |Yes |
|NetworkTraversalDiagnostics |Network Traversal Relay Diagnostic Logs |Yes |
|NetworkTraversalOperational |Operational Network Traversal Logs |Yes |
|RoomsOperational |Operational Rooms Logs |Yes |
|SMSOperational |Operational SMS Logs |No |
|Usage |Usage Records |No |

## Microsoft.Compute/virtualMachines  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|SoftwareUpdateProfile |SoftwareUpdateProfile |Yes |
|SoftwareUpdates |SoftwareUpdates |Yes |

## Microsoft.ConfidentialLedger/ManagedCCF  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|applicationlogs |CCF Application Logs |Yes |

## Microsoft.ConfidentialLedger/ManagedCCFs  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|applicationlogs |CCF Application Logs |Yes |

## Microsoft.ConnectedCache/CacheNodes  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Events |Events |Yes |

## Microsoft.ConnectedCache/ispCustomers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Events |Events |Yes |

## Microsoft.ConnectedVehicle/platformAccounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |MCVP Audit Logs |Yes |
|Logs |MCVP Logs |Yes |

## Microsoft.ContainerRegistry/registries  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ContainerRegistryLoginEvents |Login Events |No |
|ContainerRegistryRepositoryEvents |RepositoryEvent logs |No |

## Microsoft.ContainerService/fleets  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|cloud-controller-manager |Kubernetes Cloud Controller Manager |Yes |
|cluster-autoscaler |Kubernetes Cluster Autoscaler |Yes |
|csi-azuredisk-controller |csi-azuredisk-controller |Yes |
|csi-azurefile-controller |csi-azurefile-controller |Yes |
|csi-snapshot-controller |csi-snapshot-controller |Yes |
|guard |guard |Yes |
|kube-apiserver |Kubernetes API Server |Yes |
|kube-audit |Kubernetes Audit |Yes |
|kube-audit-admin |Kubernetes Audit Admin Logs |Yes |
|kube-controller-manager |Kubernetes Controller Manager |Yes |
|kube-scheduler |Kubernetes Scheduler |Yes |

## Microsoft.ContainerService/managedClusters  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|cloud-controller-manager |Kubernetes Cloud Controller Manager |Yes |
|cluster-autoscaler |Kubernetes Cluster Autoscaler |No |
|csi-azuredisk-controller |csi-azuredisk-controller |Yes |
|csi-azurefile-controller |csi-azurefile-controller |Yes |
|csi-snapshot-controller |csi-snapshot-controller |Yes |
|guard |guard |No |
|kube-apiserver |Kubernetes API Server |No |
|kube-audit |Kubernetes Audit |No |
|kube-audit-admin |Kubernetes Audit Admin Logs |No |
|kube-controller-manager |Kubernetes Controller Manager |No |
|kube-scheduler |Kubernetes Scheduler |No |

## Microsoft.CustomProviders/resourceproviders  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs |Audit logs for MiniRP calls |No |

## Microsoft.D365CustomerInsights/instances  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit events |No |
|Operational |Operational events |No |

## Microsoft.Dashboard/grafana  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GrafanaLoginEvents |Grafana Login Events |Yes |

## Microsoft.Databricks/workspaces  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|accounts |Databricks Accounts |No |
|capsule8Dataplane |Databricks Capsule8 Container Security Scanning Reports |Yes |
|clamAVScan |Databricks Clam AV Scan |Yes |
|clusterLibraries |Databricks Cluster Libraries |Yes |
|clusters |Databricks Clusters |No |
|databrickssql |Databricks DatabricksSQL |Yes |
|dbfs |Databricks File System |No |
|deltaPipelines |Databricks Delta Pipelines |Yes |
|featureStore |Databricks Feature Store |Yes |
|genie |Databricks Genie |Yes |
|gitCredentials |Databricks Git Credentials |Yes |
|globalInitScripts |Databricks Global Init Scripts |Yes |
|iamRole |Databricks IAM Role |Yes |
|instancePools |Instance Pools |No |
|jobs |Databricks Jobs |No |
|mlflowAcledArtifact |Databricks MLFlow Acled Artifact |Yes |
|mlflowExperiment |Databricks MLFlow Experiment |Yes |
|modelRegistry |Databricks Model Registry |Yes |
|notebook |Databricks Notebook |No |
|partnerHub |Databricks Partner Hub |Yes |
|RemoteHistoryService |Databricks Remote History Service |Yes |
|repos |Databricks Repos |Yes |
|secrets |Databricks Secrets |No |
|serverlessRealTimeInference |Databricks Serverless Real-Time Inference |Yes |
|sqlanalytics |Databricks SQL Analytics |Yes |
|sqlPermissions |Databricks SQLPermissions |No |
|ssh |Databricks SSH |No |
|unityCatalog |Databricks Unity Catalog |Yes |
|webTerminal |Databricks Web Terminal |Yes |
|workspace |Databricks Workspace |No |

## Microsoft.DataCollaboration/workspaces  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CollaborationAudit |Collaboration Audit |Yes |
|Computations |Computations |Yes |
|DataAssets |Data Assets |No |
|Pipelines |Pipelines |No |
|Pipelines |Pipelines |No |
|Proposals |Proposals |No |
|Scripts |Scripts |No |

## Microsoft.DataFactory/factories  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ActivityRuns |Pipeline activity runs log |No |
|AirflowDagProcessingLogs |Airflow dag processing logs |Yes |
|AirflowSchedulerLogs |Airflow scheduler logs |Yes |
|AirflowTaskLogs |Airflow task execution logs |Yes |
|AirflowWebLogs |Airflow web logs |Yes |
|AirflowWorkerLogs |Airflow worker logs |Yes |
|PipelineRuns |Pipeline runs log |No |
|SandboxActivityRuns |Sandbox Activity runs log |Yes |
|SandboxPipelineRuns |Sandbox Pipeline runs log |Yes |
|SSISIntegrationRuntimeLogs |SSIS integration runtime logs |No |
|SSISPackageEventMessageContext |SSIS package event message context |No |
|SSISPackageEventMessages |SSIS package event messages |No |
|SSISPackageExecutableStatistics |SSIS package executable statistics |No |
|SSISPackageExecutionComponentPhases |SSIS package execution component phases |No |
|SSISPackageExecutionDataStatistics |SSIS package exeution data statistics |No |
|TriggerRuns |Trigger runs log |No |

## Microsoft.DataLakeAnalytics/accounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit Logs |No |
|ConfigurationChange |Configuration Change Event Logs |Yes |
|JobEvent |Job Event Logs |Yes |
|JobInfo |Job Info Logs |Yes |
|Requests |Request Logs |No |

## Microsoft.DataLakeStore/accounts  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit Logs |No |
|Requests |Request Logs |No |

## Microsoft.DataProtection/BackupVaults  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AddonAzureBackupJobs |Addon Azure Backup Job Data |Yes |
|AddonAzureBackupPolicy |Addon Azure Backup Policy Data |Yes |
|AddonAzureBackupProtectedInstance |Addon Azure Backup Protected Instance Data |Yes |
|CoreAzureBackup |Core Azure Backup Data |Yes |

## Microsoft.DataShare/accounts  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ReceivedShareSnapshots |Received Share Snapshots |No |
|SentShareSnapshots |Sent Share Snapshots |No |
|Shares |Shares |No |
|ShareSubscriptions |Share Subscriptions |No |

## Microsoft.DBforMariaDB/servers  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|MySqlAuditLogs |MariaDB Audit Logs |No |
|MySqlSlowLogs |MariaDB Server Logs |No |

## Microsoft.DBforMySQL/flexibleServers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|MySqlAuditLogs |MySQL Audit Logs |No |
|MySqlSlowLogs |MySQL Slow Logs |No |

## Microsoft.DBforMySQL/servers  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|MySqlAuditLogs |MySQL Audit Logs |No |
|MySqlSlowLogs |MySQL Server Logs |No |

## Microsoft.DBforPostgreSQL/flexibleServers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLFlexDatabaseXacts |PostgreSQL remaining transactions |Yes |
|PostgreSQLFlexQueryStoreRuntime |PostgreSQL Query Store Runtime |Yes |
|PostgreSQLFlexQueryStoreWaitStats |PostgreSQL Query Store Wait Statistics |Yes |
|PostgreSQLFlexSessions |PostgreSQL Sessions data |Yes |
|PostgreSQLFlexTableStats |PostgreSQL Autovacuum and schema statistics |Yes |
|PostgreSQLLogs |PostgreSQL Server Logs |No |

## Microsoft.DBForPostgreSQL/serverGroupsv2  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs |PostgreSQL Server Logs |Yes |

## Microsoft.DBforPostgreSQL/servers  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs |PostgreSQL Server Logs |No |
|QueryStoreRuntimeStatistics |PostgreSQL Query Store Runtime Statistics |No |
|QueryStoreWaitStatistics |PostgreSQL Query Store Wait Statistics |No |

## Microsoft.DBforPostgreSQL/serversv2  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PostgreSQLLogs |PostgreSQL Server Logs |No |

## Microsoft.DesktopVirtualization/applicationgroups  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Checkpoint |Checkpoint |No |
|Error |Error |No |
|Management |Management |No |

## Microsoft.DesktopVirtualization/hostpools  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AgentHealthStatus |AgentHealthStatus |No |
|AutoscaleEvaluationPooled |Do not use - internal testing |Yes |
|Checkpoint |Checkpoint |No |
|Connection |Connection |No |
|ConnectionGraphicsData |Connection Graphics Data Logs Preview |Yes |
|Error |Error |No |
|HostRegistration |HostRegistration |No |
|Management |Management |No |
|NetworkData |Network Data Logs |Yes |
|SessionHostManagement |Session Host Management Activity Logs |Yes |

## Microsoft.DesktopVirtualization/scalingplans  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Autoscale |Autoscale logs |Yes |

## Microsoft.DesktopVirtualization/workspaces  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Checkpoint |Checkpoint |No |
|Error |Error |No |
|Feed |Feed |No |
|Management |Management |No |

## Microsoft.DevCenter/devcenters  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataplaneAuditEvent |Dataplane audit logs |Yes |

## Microsoft.Devices/IotHubs  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|C2DCommands |C2D Commands |No |
|C2DTwinOperations |C2D Twin Operations |No |
|Configurations |Configurations |No |
|Connections |Connections |No |
|D2CTwinOperations |D2CTwinOperations |No |
|DeviceIdentityOperations |Device Identity Operations |No |
|DeviceStreams |Device Streams (Preview) |No |
|DeviceTelemetry |Device Telemetry |No |
|DirectMethods |Direct Methods |No |
|DistributedTracing |Distributed Tracing (Preview) |No |
|FileUploadOperations |File Upload Operations |No |
|JobsOperations |Jobs Operations |No |
|Routes |Routes |No |
|TwinQueries |Twin Queries |No |

## Microsoft.Devices/provisioningServices  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeviceOperations |Device Operations |No |
|ServiceOperations |Service Operations |No |

## Microsoft.DigitalTwins/digitalTwinsInstances  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataHistoryOperation |DataHistoryOperation |Yes |
|DigitalTwinsOperation |DigitalTwinsOperation |No |
|EventRoutesOperation |EventRoutesOperation |No |
|ModelsOperation |ModelsOperation |No |
|QueryOperation |QueryOperation |No |
|ResourceProviderOperation |ResourceProviderOperation |Yes |

## Microsoft.DocumentDB/cassandraClusters  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CassandraAudit |CassandraAudit |Yes |
|CassandraLogs |CassandraLogs |Yes |

## Microsoft.DocumentDB/DatabaseAccounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CassandraRequests |CassandraRequests |No |
|ControlPlaneRequests |ControlPlaneRequests |No |
|DataPlaneRequests |DataPlaneRequests |No |
|GremlinRequests |GremlinRequests |No |
|MongoRequests |MongoRequests |No |
|PartitionKeyRUConsumption |PartitionKeyRUConsumption |No |
|PartitionKeyStatistics |PartitionKeyStatistics |No |
|QueryRuntimeStatistics |QueryRuntimeStatistics |No |
|TableApiRequests |TableApiRequests |Yes |

## Microsoft.EventGrid/domains  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataPlaneRequests |Data plane operations logs |Yes |
|DeliveryFailures |Delivery Failure Logs |No |
|PublishFailures |Publish Failure Logs |No |

## Microsoft.EventGrid/partnerNamespaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataPlaneRequests |Data plane operations logs |Yes |
|PublishFailures |Publish Failure Logs |No |

## Microsoft.EventGrid/partnerTopics  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures |Delivery Failure Logs |No |

## Microsoft.EventGrid/systemTopics  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DeliveryFailures |Delivery Failure Logs |No |

## Microsoft.EventGrid/topics  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataPlaneRequests |Data plane operations logs |Yes |
|DeliveryFailures |Delivery Failure Logs |No |
|PublishFailures |Publish Failure Logs |No |

## Microsoft.EventHub/Namespaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationMetricsLogs |Application Metrics Logs |Yes |
|ArchiveLogs |Archive Logs |No |
|AutoScaleLogs |Auto Scale Logs |No |
|CustomerManagedKeyUserLogs |Customer Managed Key Logs |No |
|EventHubVNetConnectionEvent |VNet/IP Filtering Connection Logs |No |
|KafkaCoordinatorLogs |Kafka Coordinator Logs |No |
|KafkaUserErrorLogs |Kafka User Error Logs |No |
|OperationalLogs |Operational Logs |No |
|RuntimeAuditLogs |Runtime Audit Logs |Yes |

## Microsoft.HealthcareApis/services  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs |Audit logs |No |
|DiagnosticLogs |Diagnostic logs |Yes |

## Microsoft.HealthcareApis/workspaces/analyticsconnectors  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DiagnosticLogs |Diagnostic logs for Analytics Connector |Yes |

## Microsoft.HealthcareApis/workspaces/dicomservices  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs |Audit logs |Yes |
|DiagnosticLogs |Diagnostic logs |Yes |

## Microsoft.HealthcareApis/workspaces/fhirservices  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs |FHIR Audit logs |Yes |

## Microsoft.HealthcareApis/workspaces/iotconnectors  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DiagnosticLogs |Diagnostic logs |Yes |

## microsoft.insights/autoscalesettings  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AutoscaleEvaluations |Autoscale Evaluations |No |
|AutoscaleScaleActions |Autoscale Scale Actions |No |

## microsoft.insights/components  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppAvailabilityResults |Availability results |No |
|AppBrowserTimings |Browser timings |No |
|AppDependencies |Dependencies |No |
|AppEvents |Events |No |
|AppExceptions |Exceptions |No |
|AppMetrics |Metrics |No |
|AppPageViews |Page views |No |
|AppPerformanceCounters |Performance counters |No |
|AppRequests |Requests |No |
|AppSystemEvents |System events |No |
|AppTraces |Traces |No |

## Microsoft.Insights/datacollectionrules  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|LogErrors |Log Errors |Yes |
|LogTroubleshooting |Log Troubleshooting |Yes |

## microsoft.keyvault/managedhsms  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent |Audit Event |No |

## Microsoft.KeyVault/vaults  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditEvent |Audit Logs |No |
|AzurePolicyEvaluationDetails |Azure Policy Evaluation Details |Yes |

## Microsoft.Kusto/clusters  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Command |Command |No |
|FailedIngestion |Failed ingestion |No |
|IngestionBatching |Ingestion batching |No |
|Journal |Journal |Yes |
|Query |Query |No |
|SucceededIngestion |Succeeded ingestion |No |
|TableDetails |Table details |No |
|TableUsageStatistics |Table usage statistics |No |

## microsoft.loadtestservice/loadtests  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationLogs |Azure Load Testing Operations |Yes |

## Microsoft.Logic/IntegrationAccounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|IntegrationAccountTrackingEvents |Integration Account track events |No |

## Microsoft.Logic/Workflows  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|WorkflowRuntime |Workflow runtime diagnostic events |No |

## Microsoft.MachineLearningServices/registries  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|RegistryAssetReadEvent |Registry Asset Read Event |Yes |
|RegistryAssetWriteEvent |Registry Asset Write Event |Yes |

## Microsoft.MachineLearningServices/workspaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AmlComputeClusterEvent |AmlComputeClusterEvent |No |
|AmlComputeClusterNodeEvent |AmlComputeClusterNodeEvent |Yes |
|AmlComputeCpuGpuUtilization |AmlComputeCpuGpuUtilization |No |
|AmlComputeJobEvent |AmlComputeJobEvent |No |
|AmlRunStatusChangedEvent |AmlRunStatusChangedEvent |No |
|ComputeInstanceEvent |ComputeInstanceEvent |Yes |
|DataLabelChangeEvent |DataLabelChangeEvent |Yes |
|DataLabelReadEvent |DataLabelReadEvent |Yes |
|DataSetChangeEvent |DataSetChangeEvent |Yes |
|DataSetReadEvent |DataSetReadEvent |Yes |
|DataStoreChangeEvent |DataStoreChangeEvent |Yes |
|DataStoreReadEvent |DataStoreReadEvent |Yes |
|DeploymentEventACI |DeploymentEventACI |Yes |
|DeploymentEventAKS |DeploymentEventAKS |Yes |
|DeploymentReadEvent |DeploymentReadEvent |Yes |
|EnvironmentChangeEvent |EnvironmentChangeEvent |Yes |
|EnvironmentReadEvent |EnvironmentReadEvent |Yes |
|InferencingOperationACI |InferencingOperationACI |Yes |
|InferencingOperationAKS |InferencingOperationAKS |Yes |
|ModelsActionEvent |ModelsActionEvent |Yes |
|ModelsChangeEvent |ModelsChangeEvent |Yes |
|ModelsReadEvent |ModelsReadEvent |Yes |
|PipelineChangeEvent |PipelineChangeEvent |Yes |
|PipelineReadEvent |PipelineReadEvent |Yes |
|RunEvent |RunEvent |Yes |
|RunReadEvent |RunReadEvent |Yes |

## Microsoft.MachineLearningServices/workspaces/onlineEndpoints  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AmlOnlineEndpointConsoleLog |AmlOnlineEndpointConsoleLog |Yes |
|AmlOnlineEndpointEventLog |AmlOnlineEndpointEventLog (preview) |Yes |
|AmlOnlineEndpointTrafficLog |AmlOnlineEndpointTrafficLog (preview) |Yes |

## Microsoft.ManagedNetworkFabric/networkDevices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppAvailabilityResults |Availability results |Yes |
|AppBrowserTimings |Browser timings |Yes |

## Microsoft.Media/mediaservices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|KeyDeliveryRequests |Key Delivery Requests |No |
|MediaAccount |Media Account Health Status |Yes |

## Microsoft.Media/mediaservices/liveEvents  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|LiveEventState |Live Event Operations |Yes |

## Microsoft.Media/mediaservices/streamingEndpoints  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StreamingEndpointRequests |Streaming Endpoint Requests |Yes |

## Microsoft.Media/videoanalyzers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit Logs |Yes |
|Diagnostics |Diagnostics Logs |Yes |
|Operational |Operational Logs |Yes |

## Microsoft.NetApp/netAppAccounts/capacityPools  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Autoscale |Capacity Pool Autoscaled |Yes |

## Microsoft.NetApp/netAppAccounts/capacityPools/volumes  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ANFFileAccess |ANF File Access |Yes |

## Microsoft.Network/applicationgateways  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationGatewayAccessLog |Application Gateway Access Log |No |
|ApplicationGatewayFirewallLog |Application Gateway Firewall Log |No |
|ApplicationGatewayPerformanceLog |Application Gateway Performance Log |No |

## Microsoft.Network/azureFirewalls  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AZFWApplicationRule |Azure Firewall Application Rule |Yes |
|AZFWApplicationRuleAggregation |Azure Firewall Network Rule Aggregation (Policy Analytics) |Yes |
|AZFWDnsQuery |Azure Firewall DNS query |Yes |
|AZFWFatFlow |Azure Firewall Fat Flow Log |Yes |
|AZFWFlowTrace |Azure Firewall Flow Trace Log |Yes |
|AZFWFqdnResolveFailure |Azure Firewall FQDN Resolution Failure |Yes |
|AZFWIdpsSignature |Azure Firewall IDPS Signature |Yes |
|AZFWNatRule |Azure Firewall Nat Rule |Yes |
|AZFWNatRuleAggregation |Azure Firewall Nat Rule Aggregation (Policy Analytics) |Yes |
|AZFWNetworkRule |Azure Firewall Network Rule |Yes |
|AZFWNetworkRuleAggregation |Azure Firewall Application Rule Aggregation (Policy Analytics) |Yes |
|AZFWThreatIntel |Azure Firewall Threat Intelligence |Yes |
|AzureFirewallApplicationRule |Azure Firewall Application Rule (Legacy Azure Diagnostics) |No |
|AzureFirewallDnsProxy |Azure Firewall DNS Proxy (Legacy Azure Diagnostics) |No |
|AzureFirewallNetworkRule |Azure Firewall Network Rule (Legacy Azure Diagnostics) |No |

## microsoft.network/bastionHosts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BastionAuditLogs |Bastion Audit Logs |No |

## Microsoft.Network/expressRouteCircuits  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|PeeringRouteLog |Peering Route Table Logs |No |

## Microsoft.Network/frontdoors  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|FrontdoorAccessLog |Frontdoor Access Log |No |
|FrontdoorWebApplicationFirewallLog |Frontdoor Web Application Firewall Log |No |

## Microsoft.Network/loadBalancers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|LoadBalancerAlertEvent |Load Balancer Alert Events |No |
|LoadBalancerProbeHealthStatus |Load Balancer Probe Health Status |No |

## Microsoft.Network/networkManagers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|NetworkGroupMembershipChange |Network Group Membership Change |Yes |

## Microsoft.Network/networksecuritygroups  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|NetworkSecurityGroupEvent |Network Security Group Event |No |
|NetworkSecurityGroupFlowEvent |Network Security Group Rule Flow Event |No |
|NetworkSecurityGroupRuleCounter |Network Security Group Rule Counter |No |

## Microsoft.Network/networkSecurityPerimeters  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|NspCrossPerimeterInboundAllowed |Cross perimeter inbound access allowed by perimeter link. |Yes |
|NspCrossPerimeterOutboundAllowed |Cross perimeter outbound access allowed by perimeter link. |Yes |
|NspIntraPerimeterInboundAllowed |Inbound access allowed within same perimeter. |Yes |
|NspIntraPerimeterOutboundAllowed |Outbound attempted to same perimeter. NOTE: To be deprecated in future. |Yes |
|NspOutboundAttempt |Outbound attempted to same or different perimeter. |Yes |
|NspPrivateInboundAllowed |Private endpoint traffic allowed. |Yes |
|NspPublicInboundPerimeterRulesAllowed |Public inbound access allowed by NSP access rules. |Yes |
|NspPublicInboundPerimeterRulesDenied |Public inbound access denied by NSP access rules. |Yes |
|NspPublicInboundResourceRulesAllowed |Public inbound access allowed by PaaS resource rules. |Yes |
|NspPublicInboundResourceRulesDenied |Public inbound access denied by PaaS resource rules. |Yes |
|NspPublicOutboundPerimeterRulesAllowed |Public outbound access allowed by NSP access rules. |Yes |
|NspPublicOutboundPerimeterRulesDenied |Public outbound access denied by NSP access rules. |Yes |
|NspPublicOutboundResourceRulesAllowed |Public outbound access allowed by PaaS resource rules. |Yes |
|NspPublicOutboundResourceRulesDenied |Public outbound access denied by PaaS resource rules |Yes |

## Microsoft.Network/networkSecurityPerimeters/profiles  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|NSPInboundAccessAllowed |NSP Inbound Access Allowed. |Yes |
|NSPInboundAccessDenied |NSP Inbound Access Denied. |Yes |
|NSPOutboundAccessAllowed |NSP Outbound Access Allowed. |Yes |
|NSPOutboundAccessDenied |NSP Outbound Access Denied. |Yes |

## microsoft.network/p2svpngateways  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayDiagnosticLog |Gateway Diagnostic Logs |No |
|IKEDiagnosticLog |IKE Diagnostic Logs |No |
|P2SDiagnosticLog |P2S Diagnostic Logs |No |

## Microsoft.Network/publicIPAddresses  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DDoSMitigationFlowLogs |Flow logs of DDoS mitigation decisions |No |
|DDoSMitigationReports |Reports of DDoS mitigations |No |
|DDoSProtectionNotifications |DDoS protection notifications |No |

## Microsoft.Network/trafficManagerProfiles  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ProbeHealthStatusEvents |Traffic Manager Probe Health Results Event |No |

## microsoft.network/virtualnetworkgateways  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayDiagnosticLog |Gateway Diagnostic Logs |No |
|IKEDiagnosticLog |IKE Diagnostic Logs |No |
|P2SDiagnosticLog |P2S Diagnostic Logs |No |
|RouteDiagnosticLog |Route Diagnostic Logs |No |
|TunnelDiagnosticLog |Tunnel Diagnostic Logs |No |

## Microsoft.Network/virtualNetworks  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|VMProtectionAlerts |VM protection alerts |No |

## microsoft.network/vpngateways  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|GatewayDiagnosticLog |Gateway Diagnostic Logs |No |
|IKEDiagnosticLog |IKE Diagnostic Logs |No |
|RouteDiagnosticLog |Route Diagnostic Logs |No |
|TunnelDiagnosticLog |Tunnel Diagnostic Logs |No |

## Microsoft.NetworkFunction/azureTrafficCollectors  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ExpressRouteCircuitIpfix |Express Route Circuit IPFIX Flow Records |Yes |

## Microsoft.NotificationHubs/namespaces  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationalLogs |Operational Logs |No |

## MICROSOFT.OPENENERGYPLATFORM/ENERGYSERVICES  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AirFlowTaskLogs |Air Flow Task Logs |Yes |
|ElasticOperatorLogs |Elastic Operator Logs |Yes |
|ElasticsearchLogs |Elasticsearch Logs |Yes |

## Microsoft.OpenLogisticsPlatform/Workspaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|SupplyChainEntityOperations |Supply Chain Entity Operations |Yes |
|SupplyChainEventLogs |Supply Chain Event logs |Yes |

## Microsoft.OperationalInsights/workspaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit |No |

## Microsoft.PlayFab/titles  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AuditLogs |AuditLogs |Yes |

## Microsoft.PowerBI/tenants  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine |Engine |No |

## Microsoft.PowerBI/tenants/workspaces  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine |Engine |No |

## Microsoft.PowerBIDedicated/capacities  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Engine |Engine |No |

## microsoft.purview/accounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DataSensitivityLogEvent |DataSensitivity |Yes |
|ScanStatusLogEvent |ScanStatus |No |
|Security |PurviewAccountAuditEvents |Yes |

## Microsoft.RecoveryServices/Vaults  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AddonAzureBackupAlerts |Addon Azure Backup Alert Data |No |
|AddonAzureBackupJobs |Addon Azure Backup Job Data |No |
|AddonAzureBackupPolicy |Addon Azure Backup Policy Data |No |
|AddonAzureBackupProtectedInstance |Addon Azure Backup Protected Instance Data |No |
|AddonAzureBackupStorage |Addon Azure Backup Storage Data |No |
|ASRReplicatedItems |Azure Site Recovery Replicated Items Details |Yes |
|AzureBackupReport |Azure Backup Reporting Data |No |
|AzureSiteRecoveryEvents |Azure Site Recovery Events |No |
|AzureSiteRecoveryJobs |Azure Site Recovery Jobs |No |
|AzureSiteRecoveryProtectedDiskDataChurn |Azure Site Recovery Protected Disk Data Churn |No |
|AzureSiteRecoveryRecoveryPoints |Azure Site Recovery Recovery Points |No |
|AzureSiteRecoveryReplicatedItems |Azure Site Recovery Replicated Items |No |
|AzureSiteRecoveryReplicationDataUploadRate |Azure Site Recovery Replication Data Upload Rate |No |
|AzureSiteRecoveryReplicationStats |Azure Site Recovery Replication Stats |No |
|CoreAzureBackup |Core Azure Backup Data |No |

## Microsoft.Relay/namespaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|HybridConnectionsEvent |HybridConnections Events |No |
|HybridConnectionsLogs |HybridConnectionsLogs |Yes |

## Microsoft.Search/searchServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|OperationLogs |Operation Logs |No |

## Microsoft.Security/antiMalwareSettings  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ScanResults |AntimalwareScanResults |Yes |

## Microsoft.Security/defenderForStorageSettings  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ScanResults |AntimalwareScanResults |Yes |

## microsoft.securityinsights/settings  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Analytics |Analytics |Yes |
|Automation |Automation |Yes |
|DataConnectors |Data Collection - Connectors |Yes |

## Microsoft.ServiceBus/Namespaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ApplicationMetricsLogs |Application Metrics Logs(Unused) |Yes |
|OperationalLogs |Operational Logs |No |
|RuntimeAuditLogs |Runtime Audit Logs |Yes |
|VNetAndIPFilteringLogs |VNet/IP Filtering Connection Logs |No |

## Microsoft.SignalRService/SignalR  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AllLogs |Azure SignalR Service Logs. |No |

## Microsoft.SignalRService/WebPubSub  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ConnectivityLogs |Connectivity logs for Azure Web PubSub Service. |Yes |
|HttpRequestLogs |Http Request logs for Azure Web PubSub Service. |Yes |
|MessagingLogs |Messaging logs for Azure Web PubSub Service. |Yes |

## microsoft.singularity/accounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Activity |Activity Logs |Yes |
|Execution |Execution Logs |Yes |

## Microsoft.Sql/managedInstances  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DevOpsOperationsAudit |Devops operations Audit Logs |No |
|ResourceUsageStats |Resource Usage Statistics |No |
|SQLSecurityAuditEvents |SQL Security Audit Event |No |

## Microsoft.Sql/managedInstances/databases  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Errors |Errors |No |
|QueryStoreRuntimeStatistics |Query Store Runtime Statistics |No |
|QueryStoreWaitStatistics |Query Store Wait Statistics |No |
|SQLInsights |SQL Insights |No |

## Microsoft.Sql/servers/databases  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AutomaticTuning |Automatic tuning |No |
|Blocks |Blocks |No |
|DatabaseWaitStatistics |Database Wait Statistics |No |
|Deadlocks |Deadlocks |No |
|DevOpsOperationsAudit |Devops operations Audit Logs |No |
|DmsWorkers |Dms Workers |No |
|Errors |Errors |No |
|ExecRequests |Exec Requests |No |
|QueryStoreRuntimeStatistics |Query Store Runtime Statistics |No |
|QueryStoreWaitStatistics |Query Store Wait Statistics |No |
|RequestSteps |Request Steps |No |
|SQLInsights |SQL Insights |No |
|SqlRequests |Sql Requests |No |
|SQLSecurityAuditEvents |SQL Security Audit Event |No |
|Timeouts |Timeouts |No |
|Waits |Waits |No |

## Microsoft.Storage/storageAccounts/blobServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete |StorageDelete |Yes |
|StorageRead |StorageRead |Yes |
|StorageWrite |StorageWrite |Yes |

## Microsoft.Storage/storageAccounts/fileServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete |StorageDelete |Yes |
|StorageRead |StorageRead |Yes |
|StorageWrite |StorageWrite |Yes |

## Microsoft.Storage/storageAccounts/queueServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete |StorageDelete |Yes |
|StorageRead |StorageRead |Yes |
|StorageWrite |StorageWrite |Yes |

## Microsoft.Storage/storageAccounts/tableServices  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|StorageDelete |StorageDelete |Yes |
|StorageRead |StorageRead |Yes |
|StorageWrite |StorageWrite |Yes |

## Microsoft.StorageCache/caches  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AscCacheOperationEvent |HPC Cache operation event |Yes |
|AscUpgradeEvent |HPC Cache upgrade event |Yes |
|AscWarningEvent |HPC Cache warning |Yes |

## Microsoft.StorageMover/storageMovers  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|CopyLogsFailed |Copy logs - Failed |Yes |
|JobRunLogs |Job run logs |Yes |

## Microsoft.StreamAnalytics/streamingjobs  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Authoring |Authoring |No |
|Execution |Execution |No |

## Microsoft.Synapse/workspaces  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BuiltinSqlReqsEnded |Built-in Sql Pool Requests Ended |No |
|GatewayApiRequests |Synapse Gateway Api Requests |No |
|IntegrationActivityRuns |Integration Activity Runs |Yes |
|IntegrationPipelineRuns |Integration Pipeline Runs |Yes |
|IntegrationTriggerRuns |Integration Trigger Runs |Yes |
|SQLSecurityAuditEvents |SQL Security Audit Event |No |
|SynapseLinkEvent |Synapse Link Event |Yes |
|SynapseRbacOperations |Synapse RBAC Operations |No |

## Microsoft.Synapse/workspaces/bigDataPools  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|BigDataPoolAppEvents |Big Data Pool Applications Execution Metrics |Yes |
|BigDataPoolAppsEnded |Big Data Pool Applications Ended |No |
|BigDataPoolBlockManagerEvents |Big Data Pool Block Manager Events |Yes |
|BigDataPoolDriverLogs |Big Data Pool Driver Logs |Yes |
|BigDataPoolEnvironmentEvents |Big Data Pool Environment Events |Yes |
|BigDataPoolExecutorEvents |Big Data Pool Executor Events |Yes |
|BigDataPoolExecutorLogs |Big Data Pool Executor Logs |Yes |
|BigDataPoolJobEvents |Big Data Pool Job Events |Yes |
|BigDataPoolSqlExecutionEvents |Big Data Pool Sql Execution Events |Yes |
|BigDataPoolStageEvents |Big Data Pool Stage Events |Yes |
|BigDataPoolTaskEvents |Big Data Pool Task Events |Yes |

## Microsoft.Synapse/workspaces/kustoPools  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Command |Synapse Data Explorer Command |Yes |
|FailedIngestion |Synapse Data Explorer Failed Ingestion |Yes |
|IngestionBatching |Synapse Data Explorer Ingestion Batching |Yes |
|Query |Synapse Data Explorer Query |Yes |
|SucceededIngestion |Synapse Data Explorer Succeeded Ingestion |Yes |
|TableDetails |Synapse Data Explorer Table Details |Yes |
|TableUsageStatistics |Synapse Data Explorer Table Usage Statistics |Yes |

## Microsoft.Synapse/workspaces/scopePools  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ScopePoolScopeJobsEnded |Scope Pool Scope Jobs Ended |Yes |
|ScopePoolScopeJobsStateChange |Scope Pool Scope Jobs State Change |Yes |

## Microsoft.Synapse/workspaces/sqlPools  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|DmsWorkers |Dms Workers |No |
|ExecRequests |Exec Requests |No |
|RequestSteps |Request Steps |No |
|SqlRequests |Sql Requests |No |
|SQLSecurityAuditEvents |Sql Security Audit Event |No |
|Waits |Waits |No |

## Microsoft.TimeSeriesInsights/environments  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Ingress |Ingress |No |
|Management |Management |No |

## Microsoft.TimeSeriesInsights/environments/eventsources  
<!-- Data source : arm-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Ingress |Ingress |No |
|Management |Management |No |

## microsoft.videoindexer/accounts  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|Audit |Audit |Yes |
|IndexingLogs |Indexing Logs |Yes |

## Microsoft.Web/hostingEnvironments  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppServiceEnvironmentPlatformLogs |App Service Environment Platform Logs |No |

## Microsoft.Web/sites  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppServiceAntivirusScanAuditLogs |Report Antivirus Audit Logs |No |
|AppServiceAppLogs |App Service Application Logs |No |
|AppServiceAuditLogs |Access Audit Logs |No |
|AppServiceConsoleLogs |App Service Console Logs |No |
|AppServiceFileAuditLogs |Site Content Change Audit Logs |No |
|AppServiceHTTPLogs |HTTP logs |No |
|AppServiceIPSecAuditLogs |IPSecurity Audit logs |No |
|AppServicePlatformLogs |App Service Platform logs |No |
|FunctionAppLogs |Function Application Logs |No |
|WorkflowRuntime |Workflow Runtime Logs |Yes |

## Microsoft.Web/sites/slots  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|AppServiceAntivirusScanAuditLogs |Report Antivirus Audit Logs |No |
|AppServiceAppLogs |App Service Application Logs |No |
|AppServiceAuditLogs |Access Audit Logs |No |
|AppServiceConsoleLogs |App Service Console Logs |No |
|AppServiceFileAuditLogs |Site Content Change Audit Logs |No |
|AppServiceHTTPLogs |HTTP logs |No |
|AppServiceIPSecAuditLogs |IPSecurity Audit logs |No |
|AppServicePlatformLogs |App Service Platform logs |No |
|FunctionAppLogs |Function Application Logs |No |

## microsoft.workloads/sapvirtualinstances  
<!-- Data source : naam-->

|Category|Category Display Name|Costs To Export|
|---|---|---|
|ChangeDetection |Change Detection |Yes |


## Next Steps

* [Learn more about resource logs](../essentials/platform-logs-overview.md)
* [Stream resource resource logs to **Event Hubs**](./resource-logs.md#send-to-azure-event-hubs)
* [Change resource log diagnostic settings using the Azure Monitor REST API](/rest/api/monitor/diagnosticsettings)
* [Analyze logs from Azure storage with Log Analytics](./resource-logs.md#send-to-log-analytics-workspace)


<!--Gen Date:  Thu Apr 13 2023 22:24:40 GMT+0300 (Israel Daylight Time)-->
