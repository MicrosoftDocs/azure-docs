---
title: Azure Monitor Insights Overview
description: Lists available Azure Monitor "Insights" and other Azure product integrations 
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 10/15/2022
ms.reviewer: robb
---
# Azure Monitor Insights overview

Some services have a curated monitoring experience. That is, Microsoft provides customized functionality meant to act as a starting point for monitoring those services. These experiences are collectively known as *curated visualizations* with the larger more complex of them being called *Insights*.

The experiences collect and analyze a subset of available telemetry for a given service(s). Depending on the service, the experiences might also provide out-of-the-box alerting. They present the telemetry in a visual layout. The visualizations vary in size and scale.

Some visualizations are considered part of Azure Monitor and follow the support and service level agreements for Azure. They're supported in all Azure regions where Azure Monitor is available. Other curated visualizations provide less functionality, might not scale, and might have different agreements. Some might be based solely on Azure Monitor Workbooks, while others might have an extensive custom experience.

## Insights and curated visualizations

The following table lists the available curated visualizations and information about them. **Most** of the list below can be found in the [Insights hub in the Azure portal](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/more). The table uses the same grouping as portal.

>[!NOTE]
> Another type of older visualization called *monitoring solutions* is no longer in active development. The replacement technology is the Azure Monitor Insights, as mentioned here. We suggest you use the Insights and not deploy new instances of solutions. For more information on the solutions, see [Monitoring solutions in Azure Monitor](solutions.md).

|Name with docs link| State | [Azure portal link](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/more)| Description |
|:--|:--|:--|:--|
|**Compute**||||
 | [Azure VM Insights](/azure/azure-monitor/insights/vminsights-overview) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/virtualMachines) | Monitors your Azure VMs and Virtual Machine Scale Sets at scale. It analyzes the performance and health of your Windows and Linux VMs and monitors their processes and dependencies on other resources and external processes.  |
| [Azure Container Insights](/azure/azure-monitor/insights/container-insights-overview) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/containerInsights) | Monitors the performance of container workloads that are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service. It gives you performance visibility by collecting metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. Container logs are also collected.  After you enable monitoring from Kubernetes clusters, these metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux. |
|**Networking**||||
 | [Azure Network Insights](../../network-watcher/network-insights-overview.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/networkInsights) | Provides a comprehensive view of health and metrics for all your network resources. The advanced search capability helps you identify resource dependencies, enabling scenarios like identifying resources that are hosting your website, by searching for your website name. |
|**Storage**||||
 | [Azure Storage Insights](/azure/azure-monitor/insights/storage-insights-overview) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/storageInsights) | Provides comprehensive monitoring of your Azure Storage accounts by delivering a unified view of your Azure Storage services performance, capacity, and availability. |
| [Azure Backup](../../backup/backup-azure-monitoring-use-azuremonitor.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_DataProtection/BackupCenterMenuBlade/backupReportsConfigure/menuId/backupReportsConfigure) | Provides built-in monitoring and alerting capabilities in a Recovery Services vault. |
|**Databases**||||
| [Azure Cosmos DB Insights](../../cosmos-db/cosmosdb-insights-overview.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/cosmosDBInsights) | Provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience. |
| [Azure Monitor for Azure Cache for Redis (preview)](../../azure-cache-for-redis/redis-cache-insights-overview.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/redisCacheInsights) | Provides a unified, interactive view of overall performance, failures, capacity, and operational health. |
|**Analytics**||||
| [Azure Data Explorer Insights](/azure/data-explorer/data-explorer-insights) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/adxClusterInsights) | Azure Data Explorer Insights provides comprehensive monitoring of your clusters by delivering a unified view of your cluster performance, operations, usage, and failures. |
 | [Azure Monitor Log Analytics Workspace](../logs/log-analytics-workspace-insights-overview.md) | Preview | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/lawsInsights) | Log Analytics Workspace Insights (preview) provides comprehensive monitoring of your workspaces through a unified view of your workspace usage, performance, health, agent, queries, and change log. This article will help you understand how to onboard and use Log Analytics Workspace Insights (preview). |
|**Security**||||
  | [Azure Key Vault Insights (preview)](../../key-vault/key-vault-insights-overview.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/keyvaultsInsights) | Provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency. |
|**Monitor**||||
 | [Azure Monitor Application Insights](../app/app-insights-overview.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/applicationsInsights) | Extensible application performance management service that monitors the availability, performance, and usage of your web applications whether they're hosted in the cloud or on-premises. It uses the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. It enables you to diagnose errors without waiting for a user to report them. Application Insights includes connection points to various development tools and integrates with Visual Studio to support your DevOps processes. |
| [Azure activity Log Insights](../essentials/activity-log-insights.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_DataProtection/BackupCenterMenuBlade/backupReportsConfigure/menuId/backupReportsConfigure) | Provides built-in monitoring and alerting capabilities in a Recovery Services vault. |
| [Azure Monitor for Resource Groups](resource-group-insights.md) | GA | No | Triage and diagnose any problems your individual resources encounter, while offering context for the health and performance of the resource group as a whole. |
|**Integration**||||
| [Azure Service Bus Insights](../../service-bus-messaging/service-bus-insights.md) | Preview | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/serviceBusInsights) | Azure Service Bus Insights provide a view of the overall performance, failures, capacity, and operational health of all your Service Bus resources in a unified interactive experience. |
 [Azure IoT Edge](../../iot-edge/how-to-explore-curated-visualizations.md) | GA | No | Visualize and explore metrics collected from the IoT Edge device right in the Azure portal by using Azure Monitor Workbooks-based public templates. The curated workbooks use built-in metrics from the IoT Edge runtime. These views don't need any metrics instrumentation from the workload modules. |
|**Workloads**||||
| [Azure SQL Insights (preview)](/azure/azure-sql/database/sql-insights-overview) | Preview | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/sqlWorkloadInsights) | A comprehensive interface for monitoring any product in the Azure SQL family. SQL Insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. Note: If you're just setting up SQL monitoring, use SQL Insights instead of the SQL Analytics solution. |
| [Azure Monitor for SAP solutions](../../virtual-machines/workloads/sap/monitor-sap-on-azure.md) | Preview | No | An Azure-native monitoring product for anyone running their SAP landscapes on Azure. It works with both SAP on Azure Virtual Machines and SAP on Azure Large Instances. Collects telemetry data from Azure infrastructure and databases in one central location and visually correlates the data for faster troubleshooting. You can monitor different components of an SAP landscape, such as Azure virtual machines (VMs), high-availability clusters, SAP HANA database, and SAP NetWeaver, by adding the corresponding provider for that component. |
|**Other**||||
| [Azure Virtual Desktop Insights](../../virtual-desktop/azure-monitor.md) | GA | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/insights/menuId/insights) | Azure Virtual Desktop Insights is a dashboard built on Azure Monitor Workbooks that helps IT professionals understand their Azure Virtual Desktop environments. |
| [Azure Stack HCI Insights](/azure-stack/hci/manage/azure-stack-hci-insights) | Preview | [Yes](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/azureStackHCIInsights) | Based on Azure Monitor Workbooks. Provides health, performance, and usage insights about registered Azure Stack HCI version 21H2 clusters that are connected to Azure and enrolled in monitoring. It stores its data in a Log Analytics workspace, which allows it to deliver powerful aggregation and filtering and analyze data trends over time.  |
| [Windows Update for Business](/windows/deployment/update/wufb-reports-overview) | GA | [Yes](https://ms.portal.azure.com/#view/AppInsightsExtension/WorkbookViewerBlade/Type/updatecompliance-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FUpdateCompliance%2FUpdateComplianceHub) | Detailed deployment monitoring, compliance assessment and failure troubleshooting for all Windows 10/11 devices.|
|**Not in Azure portal Insight hub**||||
| [Azure Monitor Workbooks for Azure Active Directory](../../active-directory/reports-monitoring/howto-use-azure-monitor-workbooks.md) |  General availability (GA) | [Yes](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Workbooks) | Azure Active Directory provides workbooks to understand the effect of your Conditional Access policies, troubleshoot sign-in failures, and identify legacy authentications. |
| [Azure HDInsight](../../hdinsight/log-analytics-migration.md#insights) | Preview | No | An Azure Monitor workbook that collects important performance metrics from your HDInsight cluster and provides the visualizations and dashboards for most common scenarios. Gives a complete view of a single HDInsight cluster including resource utilization and application status.|




## Next steps

- Reference some of the insights listed above to review their functionality
- Understand [what Azure Monitor can monitor](../monitor-reference.md)
