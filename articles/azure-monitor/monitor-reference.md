---
title: What is monitored by Azure Monitor
description: Reference of all services and other resources monitored by Azure Monitor.
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 10/15/2021

---

# What is monitored by Azure Monitor?

This article is a reference of the different applications and services that are monitored by Azure Monitor.

## Insights and curated visualizations

Some services have a curated monitoring experience. That is, Microsoft provides customized functionality meant to act as a starting point for monitoring those services. Those experiences collect and analyze a subset of logs and metrics and depending on the service, may also provide out-of-the-box alerting. They present this telemetry in a visual layout.

The visualizations vary in size and scale. Some are are considered part of Azure Monitor and follow the support and service level agreements for Azure.  They are supported in all Azure regions where Azure Monitor is available. Other curated visualizations provide less functionality and may have different agreements.  Some may be based solely on Azure Monitor Workbooks while others may have an extensive custom experience.

The table below lists the available curated visualizations and more detailed information about them.  

|Name with docs link| State | [Azure Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/more)| Description |
|:--|:--|:--|:--|
 | [Azure Monitor Workbooks for Azure Active Directory](/azure/active-directory/reports-monitoring/howto-use-azure-monitor-workbooks) | GA (General availability) | [Yes](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Workbooks) | Azure Active Directory provides workbooks to understand the effect of your Conditional Access policies, to troubleshoot sign-in failures, and to identify legacy authentications. | 
 | [Azure Backup Insights](/azure/backup/backup-azure-monitoring-use-azuremonitor) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_DataProtection/BackupCenterMenuBlade/backupReportsConfigure/menuId/backupReportsConfigure) | Provides built-in monitoring and alerting capabilities in a Recovery Services vault. | 
 | [Azure Monitor for Azure Cache for Redis (preview)](/azure/azure-monitor/insights/redis-cache-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/redisCacheInsights) | Provides a unified, interactive view of overall performance, failures, capacity, and operational health | 
 | [Azure Cosmos DB Insights](/azure/azure-monitor/insights/cosmosdb-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/cosmosDBInsights) | Provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience. | 
 | [Azure Data Explorer Cluster ](/azure/azure-monitor/insights/data-explorer) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/adxClusterInsights) | Azure Data Explorer Insights provides comprehensive monitoring of your clusters by delivering a unified view of your cluster performance, operations, usage, and failures. | 
 | [Azure HD Insight (preview)](/azure/hdinsight/log-analytics-migration#insights) | Preview | No | A Azure Monitor workbook that collects important performance metrics from your HDInsight cluster and provides the visualizations and dashboards for most common scenarios. Gives a complete view of a single HDInsight cluster including resource utilization and application status. | 
 | [Azure IoT Edge Insights](/azure/iot-edge/how-to-explore-curated-visualizations/) | GA | No | Visualize and explore metrics collected from the IoT Edge device right in the Azure portal using Azure Monitor Workbooks based public templates. The curated workbooks use built-in metrics from the IoT Edge runtime. These views don't need any metrics instrumentation from the workload modules. | 
 | [Azure Key Vault Insights (preview)](/azure/azure-monitor/insights/key-vault-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/keyvaultsInsights) | Provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency. | 
 | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/applicationsInsights) | Extensible Application Performance Management (APM) service which monitors the availability, performance, and usage of your web applications whether they're hosted in the cloud or on-premises. It leverages the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. It enables you to diagnose errors without waiting for a user to report them. Application Insights includes connection points to a variety of development tools and integrates with Visual Studio to support your DevOps processes. | 
 | [Azure Monitor Log Analytics Workspace](/azure/azure-monitor/logs/log-analytics-workspace-insights-overview) | Preview | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/lawsInsights) | Log Analytics Workspace Insights (preview) provides comprehensive monitoring of your workspaces through a unified view of your workspace usage, performance, health, agent, queries, and change log. This article will help you understand how to onboard and use Log Analytics Workspace Insights (preview). | 
 | [Azure Service Bus](/azure/service-bus/) | Preview | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/serviceBusInsights) |  | 
 | [Azure SQL insights](/azure/azure-monitor/insights/sql-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/sqlWorkloadInsights) | A comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. Note: If you are just setting up SQL monitoring, use this instead of the SQL Analytics solution. | 
 | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/storageInsights) | Provides comprehensive monitoring of your Azure Storage accounts by delivering a unified view of your Azure Storage services performance, capacity, and availability. | 
 | [Azure VM Insights](/azure/azure-monitor/insights/vminsights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/virtualMachines) | Monitors your Azure virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes.  | 
 | [Azure Network Insights](/azure/azure-monitor/insights/network-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/networkInsights) | Provides a comprehensive view of health and metrics for all your network resource. The advanced search capability helps you identify resource dependencies, enabling scenarios like identifying resource that are hosting your website, by simply searching for your website name. | 
 | [Azure Container Insights](/azure/azure-monitor/insights/container-insights-overview) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/containerInsights) | Monitors the performance of container workloads that are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). It gives you performance visibility by collecting metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. Container logs are also collected.  After you enable monitoring from Kubernetes clusters, these metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux. | 
 | [Azure Monitor for Resource Groups](/azure/azure-monitor/insights/resource-group-insights) | GA | No | Triage and diagnose any problems your individual resources encounter, while offering context as to the health and performance of the resource group as a whole. | 
 | [Azure Monitor SAP Solutions](/azure/virtual-machines/workloads/sap/monitor-sap-on-azure) | GA | No | An Azure-native monitoring product for anyone running their SAP landscapes on Azure. It works with both SAP on Azure Virtual Machines and SAP on Azure Large Instances. Collects telemetry data from Azure infrastructure and databases in one central location and visually correlate the data for faster troubleshooting. You can monitor different components of an SAP landscape, such as Azure virtual machines (VMs), high-availability cluster, SAP HANA database, SAP NetWeaver, and so on, by adding the corresponding provider for that component. | 
 | [Azure Stack HCI insights ](/azure-stack/hci/manage/azure-stack-hci-insights) | Preview | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/azureStackHCIInsights) | Azure Monitor Workbook based. Provides health, performance, and usage insights about registered Azure Stack HCI, version 21H2 clusters that are connected to Azure and are enrolled in monitoring. It stores its data in a Log Analytics workspace, which allows it to deliver powerful aggregation and filtering and analyze data trends over time.  | 
 | [Windows Virtual Desktop Insights](/azure/virtual-desktop/azure-monitor) | GA | [Yes](https://ms.portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/insights/menuId/insights) | Azure Monitor for Windows Virtual Desktop (preview) is a dashboard built on Azure Monitor Workbooks that helps IT professionals understand their Windows Virtual Desktop environments. This topic will walk you through how to set up Azure Monitor for Windows Virtual Desktop to monitor your Windows Virtual Desktop environments. | 


## Product integrations

The services and solutions in the following table store their data in a Log Analytics workspace so that it can be analyzed with other log data collected by Azure Monitor.

| Product/Service | Description |
|:---|:---|
| [Azure Automation](../automation/index.yml) | Manage operating system updates and track changes on Windows and Linux computers. See [Change Tracking](../automation/change-tracking/overview.md) and [Update Management](../automation/update-management/overview.md). |
| [Azure Information Protection ](/azure/information-protection/) | Classify and optionally protect documents and emails. See [Central reporting for Azure Information Protection](/azure/information-protection/reports-aip#configure-a-log-analytics-workspace-for-the-reports). |
| [Azure Security Center](../security-center/index.yml) | Collect and analyze security events and perform threat analysis. See [Data collection in Azure Security Center](../security-center/security-center-enable-data-collection.md) |
| [Azure Sentinel](../sentinel/index.yml) | Connects to different sources including Office 365 and Amazon Web Services Cloud Trail. See [Connect data sources](../sentinel/connect-data-sources.md). |
| [Microsoft Intune](/intune/) | Create a diagnostic setting to send logs to Azure Monitor. See [Send log data to storage, event hubs, or log analytics in Intune (preview)](/intune/fundamentals/review-logs-using-azure-monitor).  |
| Network  | [Network Performance Monitor](insights/network-performance-monitor.md) - Monitor network connectivity and performance to service and application endpoints.<br>[Azure Application Gateway](insights/azure-networking-analytics.md#azure-application-gateway-analytics) - Analyze logs and metrics from Azure Application Gateway.<br>[Traffic Analytics](../network-watcher/traffic-analytics.md) - Analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow in your Azure cloud. |
| [Office 365](insights/solution-office-365.md) | Monitor your Office 365 environment. Updated version with improved onboarding available through Azure Sentinel. |
| [SQL Analytics](insights/azure-sql.md) | Monitor performance of Azure SQL Databases and SQL Managed Instances at scale and across multiple subscriptions. |
| [Surface Hub](insights/surface-hubs.md) | Track the health and usage of Surface Hub devices. |
| [System Center Operations Manager](/system-center/scom) | Collect data from Operations Manager agents by connecting their management group to Azure Monitor. See [Connect Operations Manager to Azure Monitor](agents/om-agents.md)<br> Assess the risk and health of your System Center Operations Manager management group with [Operations Manager Assessment](insights/scom-assessment.md) solution. |
| [Microsoft Teams Rooms](/microsoftteams/room-systems/azure-monitor-deploy) | Integrated, end-to-end management of Microsoft Teams Rooms devices. |
| [Visual Studio App Center](/appcenter/) | Build, test, and distribute applications and then monitor their status and usage. See [Start analyzing your mobile app with App Center and Application Insights](app/mobile-center-quickstart.md). |
| Windows | [Windows Update Compliance](/windows/deployment/update/update-compliance-get-started) - Assess your Windows desktop upgrades.<br>[Desktop Analytics](/configmgr/desktop-analytics/overview) - Integrates with Configuration Manager to provide insight and intelligence to make more informed decisions about the update readiness of your Windows clients. |

## List of Azure Monitor supported services

The following table lists Azure services and the data they collect into Azure Monitor. 

- Metrics - The service automatically collects metrics into Azure Monitor Metrics. 
- Logs - The service supports diagnostic settings which can collect platform logs and metrics to Azure Monitor Logs.
- Insight - There is an insight available for the service which provides a customized monitoring experience for the service.

| Service Name and Docs Link | Resource Provider Namespace | Has Metrics | Has Logs | Insight
|---------|-----------------------------|-------------|----------|-----------|
 | [Azure Active Directory Domain Services](/azure/active-directory-domain-services/) | Microsoft.AAD/DomainServices | No | **Yes** |   | 
 | [Azure Active Directory](/azure/active-directory/) | Microsoft.Aadiam/azureADMetrics | **Yes** | No | [Azure Monitor Workbooks for Azure Active Directory](/azure/active-directory/reports-monitoring/howto-use-azure-monitor-workbooks) | 
 | [Azure Analysis Services](/azure/analysis-services/)   | Microsoft.AnalysisServices/servers | **Yes** | **Yes** |   | 
 | [API Management](/azure/api-management/)   | Microsoft.ApiManagement/service | **Yes** | **Yes** |   | 
 | [Azure App Configuration](/azure/azure-app-configuration/)   | Microsoft.AppConfiguration/configurationStores | **Yes** | **Yes** |   | 
 | [Azure Spring Cloud](/azure/spring-cloud/spring-cloud-overview.md)   | Microsoft.AppPlatform/Spring | **Yes** | **Yes** |   | 
 | [Azure Attestation Service](/azure/attestation/overview) | Microsoft.Attestation/attestationProviders | No | **Yes** |   | 
 | [Azure Automation](/azure/automation/)   | Microsoft.Automation/automationAccounts | **Yes** | **Yes** |   | 
 | [Azure VMware Solution](/azure/azure-vmware/)   | Microsoft.AVS/privateClouds | **Yes** | **Yes** |   | 
 | [Azure Batch](/azure/batch/)   | Microsoft.Batch/batchAccounts | **Yes** | **Yes** |   | 
 | [Azure Batch](/azure/batch/)   | Microsoft.BatchAI/workspaces | No | No |   | 
 | [Azure Cognitive Services- Bing Search API](/azure/cognitive-services/bing-web-search/) | Microsoft.Bing/accounts | **Yes** | No |   | 
 | [Azure Blockchain Service](/azure/blockchain/workbench/)   | Microsoft.Blockchain/blockchainMembers | **Yes** | **Yes** |   | 
 | [Azure Blockchain Service](/azure/blockchain/workbench/)   | Microsoft.Blockchain/cordaMembers | No | **Yes** |   | 
 | [Azure Bot Service](/azure/bot-service/)   | Microsoft.BotService/botServices | **Yes** | **Yes** |   | 
 | [Azure Cache for Redis](/azure/azure-cache-for-redis/)   | Microsoft.Cache/Redis | **Yes** | **Yes** | [Azure Monitor for Azure Cache for Redis (preview)](/azure/azure-monitor/insights/redis-cache-insights-overview) | 
 | [Azure Cache for Redis](/azure/azure-cache-for-redis/)   | Microsoft.Cache/redisEnterprise | **Yes** | No | [Azure Monitor for Azure Cache for Redis (preview)](/azure/azure-monitor/insights/redis-cache-insights-overview) | 
 | [Content Delivery Network](/azure/cdn/)   | Microsoft.Cdn/CdnWebApplicationFirewallPolicies | **Yes** | **Yes** |   | 
 | [Content Delivery Network](/azure/cdn/)   | Microsoft.Cdn/profiles | **Yes** | **Yes** |   | 
 | [Content Delivery Network](/azure/cdn/)   | Microsoft.Cdn/profiles/endpoints | No | **Yes** |   | 
 | [Azure Virtual Machines - Classic](/azure/virtual-machines/) | Microsoft.ClassicCompute/domainNames/slots/roles | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | [Azure Virtual Machines - Classic](/azure/virtual-machines/) | Microsoft.ClassicCompute/virtualMachines | **Yes** | No |   | 
 | [Virtual Network (Classic)](/azure/virtual-network/network-security-groups-overview) | Microsoft.ClassicNetwork/networkSecurityGroups | No | **Yes** |   | 
 | [Azure Storage (Classic)](/azure/storage/) | Microsoft.ClassicStorage/storageAccounts | **Yes** | No | [Storage Insights](/azure/azure-monitor/insights/storage-insights-overview)  | 
 | [Azure Storage Blobs (Classic)](/azure/storage/blobs/) | Microsoft.ClassicStorage/storageAccounts/blobServices | **Yes** | No | [Storage Insights](/azure/azure-monitor/insights/storage-insights-overview)  | 
 | Azure Storage Files (Classic)(/azure/storage/files/) | Microsoft.ClassicStorage/storageAccounts/fileServices | **Yes** | No | [Storage Insights](/azure/azure-monitor/insights/storage-insights-overview)  | 
 | Azure Storage Queues (Classic)(/azure/storage/queue/) | Microsoft.ClassicStorage/storageAccounts/queueServices | **Yes** | No | [Storage Insights](/azure/azure-monitor/insights/storage-insights-overview)  | 
 | Azure Storage Tables (Classic)(/azure/storage/tables/) | Microsoft.ClassicStorage/storageAccounts/tableServices | **Yes** | No | [Storage Insights](/azure/azure-monitor/insights/storage-insights-overview)  | 
 | Microsoft Cloud Test Platform | Microsoft.Cloudtest/hostedpools | **Yes** | No |   | 
 | Microsoft Cloud Test Platform | Microsoft.Cloudtest/pools | **Yes** | No |   | 
 | Cray ClusterStor in Azure | Microsoft.ClusterStor/nodes | **Yes** | No |   | 
 | [Azure Cognitive Services](/azure/cognitive-services/)   | Microsoft.CognitiveServices/accounts | **Yes** | **Yes** |   | 
 | [Azure Communication Services](/azure/communication-services/) | Microsoft.Communication/CommunicationServices | **Yes** | **Yes** |   | 
 | [Azure Virtual Machines](/azure/virtual-machines/)<br />[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)   | Microsoft.Compute/cloudServices | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | [Azure Virtual Machines](/azure/virtual-machines/)<br />[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)   | Microsoft.Compute/cloudServices/roles | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | [Azure Virtual Machines](/azure/virtual-machines/)<br />[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)   | Microsoft.Compute/disks | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | [Azure Virtual Machines](/azure/virtual-machines/)<br />[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)   | Microsoft.Compute/virtualMachines | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | [Azure Virtual Machines](/azure/virtual-machines/)<br />[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)   | Microsoft.Compute/virtualMachineScaleSets | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | [Azure Virtual Machines](/azure/virtual-machines/)<br />[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)   | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | **Yes** | No | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | 
 | Microsoft Connected Vehicle Platform | Microsoft.ConnectedVehicle/platformAccounts | **Yes** | **Yes** |   | 
 | [Azure Container Instances](/azure/container-instances/)   | Microsoft.ContainerInstance/containerGroups | **Yes** | No | [Container Insights](/azure/azure-monitor/insights/container-insights-overview) | 
 | [Azure Container Registry](/azure/container-registry/)   | Microsoft.ContainerRegistry/registries | **Yes** | **Yes** |   | 
 | [Azure Kubernetes Service (AKS)](/azure/aks/)   | Microsoft.ContainerService/managedClusters | **Yes** | **Yes** | [Container Insights](/azure/azure-monitor/insights/container-insights-overview) | 
 | [Azure Custom Providers](azure/custom-providers/overview.md)   | Microsoft.CustomProviders/resourceProviders | **Yes** | **Yes** |   | 
 | Microsoft Dynamics 365 Customer Insights | Microsoft.D365CustomerInsights/instances | No | **Yes** |   | 
 | [Azure Stack Edge](/azure/databox-online/azure-stack-edge-overview.md)   | Microsoft.DataBoxEdge/DataBoxEdgeDevices | **Yes** | No |   | 
 | [Azure Databricks](/azure/azure-databricks/)   | Microsoft.Databricks/workspaces | No | **Yes** |   | 
 | Project CI | Microsoft.DataCollaboration/workspaces | **Yes** | **Yes** |   | 
 | [Azure Data Factory](/azure/data-factory/)   | Microsoft.DataFactory/dataFactories | **Yes** | No |   | 
 | [Azure Data Factory](/azure/data-factory/)   | Microsoft.DataFactory/factories | **Yes** | **Yes** |   | 
 | [Azure Data Lake Analytics](/azure/data-lake-analytics/)   | Microsoft.DataLakeAnalytics/accounts | **Yes** | **Yes** |   | 
 | [Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction.md)   | Microsoft.DataLakeStore/accounts | **Yes** | **Yes** |   | 
 | [Azure Data Share](/azure/data-share/)   | Microsoft.DataShare/accounts | **Yes** | **Yes** |   | 
 | [Azure Database for MariaDB](/azure/mariadb/)   | Microsoft.DBforMariaDB/servers | **Yes** | **Yes** |   | 
 | [Azure Database for MySQL](/azure/mysql/)   | Microsoft.DBforMySQL/flexibleServers | **Yes** | **Yes** |   | 
 | [Azure Database for MySQL](/azure/mysql/)   | Microsoft.DBforMySQL/servers | **Yes** | **Yes** |   | 
 | [Azure Database for PostgreSQL](/azure/postgresql/)   | Microsoft.DBforPostgreSQL/flexibleServers | **Yes** | **Yes** |   | 
 | [Azure Database for PostgreSQL](/azure/postgresql/)   | Microsoft.DBforPostgreSQL/serverGroupsv2 | **Yes** | **Yes** |   | 
 | [Azure Database for PostgreSQL](/azure/postgresql/)   | Microsoft.DBforPostgreSQL/servers | **Yes** | **Yes** |   | 
 | [Azure Database for PostgreSQL](/azure/postgresql/)   | Microsoft.DBforPostgreSQL/serversv2 | **Yes** | **Yes** |   | 
 | [Microsoft Windows Virtual Desktop](/azure/virtual-desktop/)   | Microsoft.DesktopVirtualization/applicationgroups | No | **Yes** | [Windows Virtual Desktop Insights](/azure/virtual-desktop/azure-monitor) | 
 | [Microsoft Windows Virtual Desktop](/azure/virtual-desktop/)   | Microsoft.DesktopVirtualization/hostpools | No | **Yes** | [Windows Virtual Desktop Insights](/azure/virtual-desktop/azure-monitor) | 
 | [Microsoft Windows Virtual Desktop](/azure/virtual-desktop/)   | Microsoft.DesktopVirtualization/workspaces | No | **Yes** |   | 
 | [Azure IoT Hub](/azure/iot-hub/) | Microsoft.Devices/ElasticPools | **Yes** | No |   | 
 | [Azure IoT Hub](/azure/iot-hub/) | Microsoft.Devices/ElasticPools/IotHubTenants | **Yes** | **Yes** |   | 
 | [Azure IoT Hub](/azure/iot-hub/) | Microsoft.Devices/IotHubs | **Yes** | **Yes** |   | 
 | [Azure IoT Hub Device Provisioning Service](/azure/iot-dps/)   | Microsoft.Devices/ProvisioningServices | **Yes** | **Yes** |   | 
 | [Azure Digital Twins](/azure/digital-twins/about-digital-twins.md)   | Microsoft.DigitalTwins/digitalTwinsInstances | **Yes** | **Yes** |   | 
 | [Azure Cosmos DB](/azure/cosmos-db/)   | Microsoft.DocumentDB/databaseAccounts | **Yes** | **Yes** | [Azure Cosmos DB Insights](/azure/azure-monitor/insights/cosmosdb-insights-overview) | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/domains | **Yes** | **Yes** |   | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/eventSubscriptions | **Yes** | No |   | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/extensionTopics | **Yes** | No |   | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/partnerNamespaces | **Yes** | **Yes** |   | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/partnerTopics | **Yes** | **Yes** |   | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/systemTopics | **Yes** | **Yes** |   | 
 | [Azure  Grid](/azure/event-grid/)   | Microsoft.EventGrid/topics | **Yes** | **Yes** |   | 
 | [Azure Event Hubs](/azure/event-hubs/)   | Microsoft.EventHub/clusters | **Yes** | No |  | 
 | [Azure Event Hubs](/azure/event-hubs/)   | Microsoft.EventHub/namespaces | **Yes** | **Yes** | | 
 | [Microsoft Experimentation Platform](https://www.microsoft.com/research/group/experimentation-platform-exp/) | microsoft.experimentation/experimentWorkspaces | **Yes** | **Yes** |   | 
 | [Azure HDInsight](/azure/hdinsight/)   | Microsoft.HDInsight/clusters | **Yes** | No | [Azure HD Insight (preview)](/azure/hdinsight/log-analytics-migration#insights) | 
 | [Azure API for FHIR](/azure/healthcare-apis/) | Microsoft.HealthcareApis/services | **Yes** | **Yes** |   | 
 | [Azure API for FHIR](/azure/healthcare-apis/) | Microsoft.HealthcareApis/workspaces/iotconnectors | **Yes** | No |   | 
 | [StorSimple](/azure/storsimple/)   | microsoft.hybridnetwork/networkfunctions | **Yes** | No |   | 
 | [StorSimple](/azure/storsimple/)   | microsoft.hybridnetwork/virtualnetworkfunctions | **Yes** | No |   | 
 | [Azure Monitor](/azure/azure-monitor/)   | microsoft.insights/autoscalesettings | **Yes** | **Yes** |   | 
 | [Azure Monitor](/azure/azure-monitor/)   | microsoft.insights/components | **Yes** | **Yes** | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure IoT Central](/azure/iot-central/)   | Microsoft.IoTCentral/IoTApps | **Yes** | No |   | 
 | [Azure Key Vault](/azure/key-vault/)   | Microsoft.KeyVault/managedHSMs | **Yes** | **Yes** | [Azure Key Vault Insights (preview)](/azure/azure-monitor/insights/key-vault-insights-overview) | 
 | [Azure Key Vault](/azure/key-vault/)   | Microsoft.KeyVault/vaults | **Yes** | **Yes** | [Azure Key Vault Insights (preview)](/azure/azure-monitor/insights/key-vault-insights-overview) | 
 | [Azure Kubernetes Service (AKS)](/azure/aks/)   | Microsoft.Kubernetes/connectedClusters | **Yes** | No |   | 
 | [Azure Data Explorer](/azure/data-explorer/)   | Microsoft.Kusto/clusters | **Yes** | **Yes** |   | 
 | [Azure Logic Apps](/azure/logic-apps/)   | Microsoft.Logic/integrationAccounts | No | **Yes** |   | 
 | [Azure Logic Apps](/azure/logic-apps/)   | Microsoft.Logic/integrationServiceEnvironments | **Yes** | No |   | 
 | [Azure Logic Apps](/azure/logic-apps/)   | Microsoft.Logic/workflows | **Yes** | **Yes** |   | 
 | [Azure Machine Learning](/azure/machine-learning/)   | Microsoft.MachineLearningServices/workspaces | **Yes** | **Yes** |   | 
 | [Azure Maps](/azure/azure-maps/)   | Microsoft.Maps/accounts | **Yes** | No |   | 
 | [Azure Media Services](/azure/media-services/)   | Microsoft.Media/mediaservices | **Yes** | **Yes** |   | 
 | [Azure Media Services](/azure/media-services/)   | Microsoft.Media/mediaservices/liveEvents | **Yes** | No |   | 
 | [Azure Media Services](/azure/media-services/)   | Microsoft.Media/mediaservices/streamingEndpoints | **Yes** | No |   | 
 | [Azure Media Services](/azure/media-services/)   | Microsoft.Media/videoAnalyzers | **Yes** | **Yes** |   | 
 | [Azure Spatial Anchors](/azure/spatial-anchors/)   | Microsoft.MixedReality/remoteRenderingAccounts | **Yes** | No |   | 
 | [Azure Spatial Anchors](/azure/spatial-anchors/)   | Microsoft.MixedReality/spatialAnchorsAccounts | **Yes** | No |   | 
 | [Azure NetApp Files](/azure/azure-netapp-files/)   | Microsoft.NetApp/netAppAccounts/capacityPools | **Yes** | No |   | 
 | [Azure NetApp Files](/azure/azure-netapp-files/)   | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | **Yes** | No |   | 
 | [Application Gateway](/azure/application-gateway/) | Microsoft.Network/applicationGateways | **Yes** | **Yes** |   | 
 | [Azure Firewall](/azure/firewall/) | Microsoft.Network/azureFirewalls | **Yes** | **Yes** |   | 
 | [Azure Bastion](/azure/bastion/) | Microsoft.Network/bastionHosts | **Yes** | **Yes** |   | 
 | [VPN Gateway](/azure/vpn-gateway/) | Microsoft.Network/connections | **Yes** | No |   | 
 | [Azure DNS](/azure/dns/) | Microsoft.Network/dnszones | **Yes** | No |   | 
 | [Azure ExpressRoute](/azure/expressroute/) | Microsoft.Network/expressRouteCircuits | **Yes** | **Yes** |   | 
 | [Azure ExpressRoute](/azure/expressroute/) | Microsoft.Network/expressRouteGateways | **Yes** | No |   | 
 | [Azure ExpressRoute](/azure/expressroute/) | Microsoft.Network/expressRoutePorts | **Yes** | No |   | 
 | [Azure Frontdoor](/azure/frontdoor/) | Microsoft.Network/frontdoors | **Yes** | **Yes** |   | 
 | Azure Load Balancer | Microsoft.Network/loadBalancers | **Yes** | **Yes** |   | 
 | Azure Software Load Balancer | Microsoft.Network/natGateways | **Yes** | No |   | 
 | Azure Virtual Network | Microsoft.Network/networkInterfaces | **Yes** | No | [Azure Network Insights](/azure/azure-monitor/insights/network-insights-overview) | 
 | Azure Virtual Network | Microsoft.Network/networkSecurityGroups | No | **Yes** | [Azure Network Insights](/azure/azure-monitor/insights/network-insights-overview) | 
 | Azure Network Watcher | Microsoft.Network/networkWatchers/connectionMonitors | **Yes** | No |   | 
 | Azure Virtual WAN | Microsoft.Network/p2sVpnGateways | **Yes** | **Yes** |   | 
 | Azure DNS Private Zones | Microsoft.Network/privateDnsZones | **Yes** | No |   | 
 | Azure Private Link | Microsoft.Network/privateEndpoints | **Yes** | No |   | 
 | Azure Private Link | Microsoft.Network/privateLinkServices | **Yes** | No |   | 
 | Azure Virtual Network | Microsoft.Network/publicIPAddresses | **Yes** | **Yes** | [Azure Network Insights](/azure/azure-monitor/insights/network-insights-overview) | 
 | Azure Traffic Manager | Microsoft.Network/trafficmanagerprofiles | **Yes** | **Yes** |   | 
 | Azure Virtual WAN | Microsoft.Network/virtualHubs | **Yes** | No |   | 
 | Azure Virtual Network Gateway | Microsoft.Network/virtualNetworkGateways | **Yes** | **Yes** |   | 
 | Azure Virtual Network | Microsoft.Network/virtualNetworks | **Yes** | **Yes** | [Azure Network Insights](/azure/azure-monitor/insights/network-insights-overview) | 
 | Azure Virtual Routers | Microsoft.Network/virtualRouters | **Yes** | No |   | 
 | Azure VPN Gateway - Virtual WAN | Microsoft.Network/vpnGateways | **Yes** | **Yes** |   | 
 | [Azure Notification Hubs](/azure/notification-hubs/)   | Microsoft.NotificationHubs/namespaces/notificationHubs | **Yes** | No |   | 
 | [Azure Monitor](/azure/azure-monitor/)   | Microsoft.OperationalInsights/workspaces | **Yes** | **Yes** |   | 
 | Azure Peering Service | Microsoft.Peering/peerings | **Yes** | No |   | 
 | Azure Peering Service | Microsoft.Peering/peeringServices | **Yes** | No |   | 
 | [Microsoft Power BI](/power-bi/power-bi-overview)   | Microsoft.PowerBI/tenants | No | **Yes** |   | 
 | [Microsoft Power BI](/power-bi/power-bi-overview)   | Microsoft.PowerBI/tenants/workspaces | No | **Yes** |   | 
 | [Power BI Embedded](/azure/power-bi-embedded/)   | Microsoft.PowerBIDedicated/capacities | **Yes** | **Yes** |   | 
 | [Azure Purview](/azure/purview/) | Microsoft.Purview/accounts | **Yes** | **Yes** |   | 
 | [Azure Site Recovery](/azure/site-recovery/)   | Microsoft.RecoveryServices/vaults | **Yes** | **Yes** |   | 
 | [Azure Relay](/azure/service-bus-relay/relay-what-is-it.md)   | Microsoft.Relay/namespaces | **Yes** | **Yes** |   | 
 | [Azure Resource Manager](/azure/azure-resource-manager/)   | Microsoft.Resources/subscriptions | **Yes** | No |   | 
 | [Azure Cognitive Search](/azure/search/)   | Microsoft.Search/searchServices | **Yes** | **Yes** |   | 
 | [Azure Service Bus](/azure/service-bus/)   | Microsoft.ServiceBus/namespaces | **Yes** | **Yes** | [Azure Service Bus](/azure/service-bus/) | 
 | [Azure SignalR Service](/azure/azure-signalr/)   | Microsoft.SignalRService/SignalR | **Yes** | **Yes** |   | 
 | [Azure SignalR Service](/azure/azure-signalr/)   | Microsoft.SignalRService/WebPubSub | **Yes** | **Yes** |   | 
 | [Azure SQL Managed Instance](/azure/azure-sql/database/monitoring-tuning-index) | Microsoft.Sql/managedInstances | **Yes** | **Yes** | [Azure SQL insights](/azure/azure-monitor/insights/sql-insights-overview) | 
 | [Azure SQL Database](/azure/azure-sql/database/) | Microsoft.Sql/servers/databases | **Yes** | No | [Azure SQL insights](/azure/azure-monitor/insights/sql-insights-overview) | 
 | [Azure SQL Database](/azure/azure-sql/database/) | Microsoft.Sql/servers/elasticpools | **Yes** | No | [Azure SQL insights](/azure/azure-monitor/insights/sql-insights-overview) | 
 | [Azure Storage](/azure/storage/)   | Microsoft.Storage/storageAccounts | **Yes** | No | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | 
 | [Azure Storage Blobs](/azure/storage/blobs/) | Microsoft.Storage/storageAccounts/blobServices | **Yes** | **Yes** | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | 
 | [Azure Storage Files](/azure/storage/files/) | Microsoft.Storage/storageAccounts/fileServices | **Yes** | **Yes** | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | 
 | [Azure Storage Queue Services](/azure/storage/queues/)   | Microsoft.Storage/storageAccounts/queueServices | **Yes** | **Yes** | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | 
 | [Azure Table Services](/azure/storage/tables/)   | Microsoft.Storage/storageAccounts/tableServices | **Yes** | **Yes** | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | 
 | [Azure HPC Cache](/azure/hpc-cache/) | Microsoft.StorageCache/caches | **Yes** | No |   | 
 | [Azure Storage](/azure/storage/)   | Microsoft.StorageSync/storageSyncServices | **Yes** | No | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | 
 | [Azure Stream Analytics](/azure/stream-analytics/)   | Microsoft.StreamAnalytics/streamingjobs | **Yes** | **Yes** |   | 
 | [Azure Synapse Analytics](/azure/sql-data-warehouse/)   | Microsoft.Synapse/workspaces | **Yes** | **Yes** |   | 
 | [Azure Synapse Analytics](/azure/sql-data-warehouse/)   | Microsoft.Synapse/workspaces/bigDataPools | **Yes** | **Yes** |   | 
 | [Azure Synapse Analytics](/azure/sql-data-warehouse/)   | Microsoft.Synapse/workspaces/sqlPools | **Yes** | **Yes** |   | 
 | [Azure Time Series Insights](/azure/time-series-insights/)   | Microsoft.TimeSeriesInsights/environments | **Yes** | **Yes** |   | 
 | [Azure Time Series Insights](/azure/time-series-insights/)   | Microsoft.TimeSeriesInsights/environments/eventsources | **Yes** | **Yes** |   | 
 | [Azure VMware Solution](/azure/azure-vmware/)   | Microsoft.VMwareCloudSimple/virtualMachines | **Yes** | No |   | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/connections | **Yes** | No |   | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/hostingEnvironments | **Yes** | **Yes** | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/hostingEnvironments/multiRolePools | **Yes** | No | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/hostingEnvironments/workerPools | **Yes** | No | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/serverFarms | **Yes** | No | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/sites | **Yes** | **Yes** | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/sites/slots | **Yes** | **Yes** | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 
 | [Azure App Service](/azure/app-service/)<br />[Azure Functions](/azure/azure-functions/)   | Microsoft.Web/staticSites | **Yes** | No | [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | 


## Virtual machine agents

The following table lists the agents that can collect data from the guest operating system of virtual machines and send data to Monitor. Each agent can collect different data and send it to either Metrics or Logs in Azure Monitor. The Azure Monitor agent is meant to be a replacement for the other agents.  

See [Overview of Azure Monitor agents](agents/agents-overview.md) for details on the data that each agent can collect and advice on their usage. 

| Agent |  Metrics | Logs |
|:---|:---|:---|
| [Azure Monitor agent](agents/azure-monitor-agent-overview.md) | Yes | Yes |
| [Log Analytics agent](agents/log-analytics-agent.md) | No | Yes|
| [Diagnostic extension](agents/diagnostics-extension-overview.md) | Yes | No |
| [Telegraf agent](essentials/collect-custom-metrics-linux-telegraf.md) | Yes | No |
| [Dependency agent](vm/vminsights-enable-overview.md) | No | Yes |

## Other solutions

Other solutions are available for monitoring different applications and services, but they are no longer in active development. They may not be available in all regions. They are covered by the Azure Log Analytics data ingestion service level agreement.

| Solution | Description |
|:---|:---|
| [Active Directory health check](insights/ad-assessment.md) | Assess the risk and health of your Active Directory environments. |
| [Active Directory replication status](insights/ad-replication-status.md) | Regularly monitors your Active Directory environment for any replication failures. |
| [Activity log analytics](essentials/activity-log.md#activity-log-analytics-monitoring-solution) | View Activity Log entries. |
| [DNS Analytics (preview)](insights/dns-analytics.md) | Collects, analyzes, and correlates Windows DNS analytic and audit logs and other related data from your DNS servers. |
| [Cloud Foundry](../cloudfoundry/cloudfoundry-oms-nozzle.md) | Collect, view, and analyze your Cloud Foundry system health and performance metrics, across multiple deployments. |
| [Containers](containers/containers.md) | View and manage Docker and Windows container hosts. |
| [On-Demand Assessments](/services-hub/health/getting_started_with_on_demand_assessments) | Assess and optimize the availability, security, and performance of your on-premises, hybrid, and cloud Microsoft technology environments. |
| [SQL health check](insights/sql-assessment.md) | Assess the risk and health of your SQL Server environments.  |
| [Wire Data](insights/wire-data.md) | Consolidated network and performance data collected from Windows-connected and Linux-connected computers with the Log Analytics agent. |

## Third party integration

| Solution | Description |
|:---|:---|
| [ITSM](alerts/itsmc-overview.md) | The IT Service Management Connector (ITSMC) allows you to connect Azure and a supported IT Service Management (ITSM) product/service.  |


## Resources outside of Azure

Azure Monitor can collect data from resources outside of Azure using the methods listed in the following table.

| Resource | Method |
|:---|:---|
| Applications | Monitor web applications outside of Azure using Application Insights. See [What is Application Insights?](./app/app-insights-overview.md). |
| Virtual machines | Use agents to collect data from the guest operating system of virtual machines in other cloud environments or on-premises. See [Overview of Azure Monitor agents](agents/agents-overview.md). |
| REST API Client | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. See [Send log data to Azure Monitor with the HTTP Data Collector API](logs/data-collector-api.md) for Logs and [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md) for Metrics. |

## Next steps

- Read more about the [Azure Monitor data platform which stores the logs and metrics collected by insights and solutions](data-platform.md).
- Complete a [tutorial on monitoring an Azure resource](essentials/tutorial-resource-logs.md).
- Complete a [tutorial on writing a log query to analyze data in Azure Monitor Logs](essentials/tutorial-resource-logs.md).
- Complete a [tutorial on creating a metrics chart to analyze data in Azure Monitor Metrics](essentials/tutorial-metrics-explorer.md).
 

