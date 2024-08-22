---
title: Tables that support the Basic table plan in Azure Monitor Logs
description: This article lists all tables support the Basic table plan in Azure Monitor Logs.
author: guywi-ms
ms.author: guywild
ms.reviewer: osalzberg
ms.topic: how-to
ms.date: 07/22/2024
---

# Tables that support the Basic table plan in Azure Monitor Logs

All custom tables created with or migrated to the [Logs ingestion API](logs-ingestion-api-overview.md), and the Azure tables listed below support the [Basic table plan](../logs/logs-table-plans.md).

> [!NOTE]
> Tables created with the [Data Collector API](data-collector-api.md) don't support the Basic table plan.


| Service | Table |
|:---|:---|
| Azure Active Directory | [AADDomainServicesDNSAuditsGeneral](/azure/azure-monitor/reference/tables/AADDomainServicesDNSAuditsGeneral)<br> [AADDomainServicesDNSAuditsDynamicUpdates](/azure/azure-monitor/reference/tables/AADDomainServicesDNSAuditsDynamicUpdates)<br>[AADManagedIdentitySignInLogs](/azure/azure-monitor/reference/tables/AADManagedIdentitySignInLogs)<br>[AADNonInteractiveUserSignInLogs](/azure/azure-monitor/reference/tables/AADNonInteractiveUserSignInLogs)<br>[AADServicePrincipalSignInLogs](/azure/azure-monitor/reference/tables/AADServicePrincipalSignInLogs) <br>[ADFSSignInLogs](/azure/azure-monitor/reference/tables/ADFSSignInLogs) |
| Azure Load Balancing | [ALBHealthEvent](/azure/azure-monitor/reference/tables/ALBHealthEvent) |
| Azure Databricks | [DatabricksBrickStoreHttpGateway](/azure/azure-monitor/reference/tables/databricksbrickstorehttpgateway)<br>[DatabricksDataMonitoring](/azure/azure-monitor/reference/tables/databricksdatamonitoring)<br>[DatabricksFilesystem](/azure/azure-monitor/reference/tables/databricksfilesystem)<br>[DatabricksDashboards](/azure/azure-monitor/reference/tables/databricksdashboards)<br>[DatabricksCloudStorageMetadata](/azure/azure-monitor/reference/tables/databrickscloudstoragemetadata)<br>[DatabricksPredictiveOptimization](/azure/azure-monitor/reference/tables/databrickspredictiveoptimization)<br>[DatabricksIngestion](/azure/azure-monitor/reference/tables/databricksingestion)<br>[DatabricksMarketplaceConsumer](/azure/azure-monitor/reference/tables/databricksmarketplaceconsumer)<br>[DatabricksLineageTracking](/azure/azure-monitor/reference/tables/databrickslineagetracking)
| API Management | [ApiManagementGatewayLogs](/azure/azure-monitor/reference/tables/ApiManagementGatewayLogs)<br>[ApiManagementWebSocketConnectionLogs](/azure/azure-monitor/reference/tables/ApiManagementWebSocketConnectionLogs) |
| API Management Service| APIMDevPortalAuditDiagnosticLog |
| Application Gateways | [AGWAccessLogs](/azure/azure-monitor/reference/tables/AGWAccessLogs)<br>[AGWPerformanceLogs](/azure/azure-monitor/reference/tables/AGWPerformanceLogs)<br>[AGWFirewallLogs](/azure/azure-monitor/reference/tables/AGWFirewallLogs) |
| Application Gateway for Containers | [AGCAccessLogs](/azure/azure-monitor/reference/tables/AGCAccessLogs) |
| Application Insights | [AppTraces](/azure/azure-monitor/reference/tables/apptraces) |
| Bare Metal Machines | [NCBMSecurityDefenderLogs](/azure/azure-monitor/reference/tables/ncbmsecuritydefenderlogs)<br>[NCBMSystemLogs](/azure/azure-monitor/reference/tables/NCBMSystemLogs)<br>[NCBMSecurityLogs](/azure/azure-monitor/reference/tables/NCBMSecurityLogs) <br>[NCBMBreakGlassAuditLogs](/azure/azure-monitor/reference/tables/ncbmbreakglassauditlogs)|
| Chaos Experiments | [ChaosStudioExperimentEventLogs](/azure/azure-monitor/reference/tables/ChaosStudioExperimentEventLogs) |
| Cloud HSM | [CHSMManagementAuditLogs](/azure/azure-monitor/reference/tables/CHSMManagementAuditLogs) |
| Container Apps | [ContainerAppConsoleLogs](/azure/azure-monitor/reference/tables/containerappconsoleLogs) |
| Container Insights | [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2) |
| Container Apps Environments | [AppEnvSpringAppConsoleLogs](/azure/azure-monitor/reference/tables/AppEnvSpringAppConsoleLogs) |
| Communication Services | [ACSAdvancedMessagingOperations](/azure/azure-monitor/reference/tables/acsadvancedmessagingoperations)<br>[ACSCallAutomationIncomingOperations](/azure/azure-monitor/reference/tables/ACSCallAutomationIncomingOperations)<br>[ACSCallAutomationMediaSummary](/azure/azure-monitor/reference/tables/ACSCallAutomationMediaSummary)<br>[ACSCallClientMediaStatsTimeSeries](/azure/azure-monitor/reference/tables/ACSCallClientMediaStatsTimeSeries)<br>[ACSCallClientOperations](/azure/azure-monitor/reference/tables/ACSCallClientOperations)<br>[ACSCallRecordingIncomingOperations](/azure/azure-monitor/reference/tables/ACSCallRecordingIncomingOperations)<br>[ACSCallRecordingSummary](/azure/azure-monitor/reference/tables/ACSCallRecordingSummary)<br>[ACSCallSummary](/azure/azure-monitor/reference/tables/ACSCallSummary)<br>[ACSJobRouterIncomingOperations](/azure/azure-monitor/reference/tables/ACSJobRouterIncomingOperations)<br>[ACSRoomsIncomingOperations](/azure/azure-monitor/reference/tables/acsroomsincomingoperations)<br>[ACSCallClosedCaptionsSummary](/azure/azure-monitor/reference/tables/acscallclosedcaptionssummary) |
| Confidential Ledgers | [CCFApplicationLogs](/azure/azure-monitor/reference/tables/CCFApplicationLogs) |
 Cosmos DB | [CDBDataPlaneRequests](/azure/azure-monitor/reference/tables/cdbdataplanerequests)<br>[CDBPartitionKeyStatistics](/azure/azure-monitor/reference/tables/cdbpartitionkeystatistics)<br>[CDBPartitionKeyRUConsumption](/azure/azure-monitor/reference/tables/cdbpartitionkeyruconsumption)<br>[CDBQueryRuntimeStatistics](/azure/azure-monitor/reference/tables/cdbqueryruntimestatistics)<br>[CDBMongoRequests](/azure/azure-monitor/reference/tables/cdbmongorequests)<br>[CDBCassandraRequests](/azure/azure-monitor/reference/tables/cdbcassandrarequests)<br>[CDBGremlinRequests](/azure/azure-monitor/reference/tables/cdbgremlinrequests)<br>[CDBControlPlaneRequests](/azure/azure-monitor/reference/tables/cdbcontrolplanerequests)<br>CDBTableApiRequests |
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
| Managed NGINX | [NGXOperationLogs](/azure/azure-monitor/reference/tables/ngxoperationlogs) <br>[NGXSecurityLogs](/azure/azure-monitor/reference/tables/ngxsecuritylogs)|
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
    

## Next steps

- [Manage data retention](../logs/data-retention-configure.md)

