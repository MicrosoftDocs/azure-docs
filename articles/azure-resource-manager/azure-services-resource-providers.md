---
title: Azure Resource Manager resource providers by Azure services
description: Lists all resource provider namespaces for Azure Resource Manager and shows the Azure service for that namespace.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: reference
ms.date: 06/25/2019
ms.author: tomfitz
---

# Resource providers for Azure services

This article shows how resource provider namespaces map to Azure services.

## Match resource provider to service

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AAD | [Azure Active Directory Domain Services](../active-directory-domain-services/index.yml) |
| microsoft.aadiam | [Azure Active Directory](/azure/active-directory/) |
| Microsoft.Addons | core |
| Microsoft.ADHybridHealthService | [Azure Active Directory](/azure/active-directory/) |
| Microsoft.Advisor | [Azure Advisor](../advisor/index.yml) |
| Microsoft.AlertsManagement | [Azure Monitor](../azure-monitor/index.yml) |
| Microsoft.AnalysisServices | [Azure Analysis Services](/azure/analysis-services/) |
| Microsoft.ApiManagement | [API Management](../api-management/index.yml) |
| Microsoft.AppConfiguration | core |
| Microsoft.Authorization | [Azure Resource Manager](index.yml) |
| Microsoft.Automation | [Automation](../automation/index.yml) |
| Microsoft.AzureActiveDirectory | [Azure Active Directory B2C](../active-directory-b2c/index.yml) |
| Microsoft.AzureStack | core |
| Microsoft.Batch | [Batch](../batch/index.yml) |
| Microsoft.Billing | [Billing](/azure/billing/) |
| Microsoft.BingMaps | [Bing Maps](https://docs.microsoft.com/BingMaps/#pivot=main&panel=BingMapsAPI) |
| Microsoft.BizTalkServices | [BizTalk Services](../logic-apps/logic-apps-move-from-mabs.md) |
| Microsoft.Blockchain | [Azure Blockchain Service](/azure/blockchain/workbench/) |
| Microsoft.Blueprint | [Azure Blueprints](/azure/governance/blueprints/) |
| Microsoft.BotService | [Azure Bot Service](/azure/bot-service/) |
| Microsoft.Cache | [Azure Cache for Redis](/azure/azure-cache-for-redis/) |
| Microsoft.Capacity | core |
| Microsoft.Cdn | [Content Delivery Network](../cdn/index.yml) |
| Microsoft.CertificateRegistration | [App Service Certificates](../app-service/web-sites-purchase-ssl-web-site.md) |
| Microsoft.ClassicCompute | Classic deployment model virtual machine |
| Microsoft.ClassicInfrastructureMigrate | Classic deployment model migration |
| Microsoft.ClassicNetwork | Classic deployment model virtual network |
| Microsoft.ClassicStorage | Classic deployment model storage |
| Microsoft.ClassicSubscription | Classic deployment model |
| Microsoft.CognitiveServices | [Cognitive Services](/azure/cognitive-services/) |
| Microsoft.Commerce | core |
| Microsoft.Compute | [Virtual Machines](/azure/virtual-machines/) |
| Microsoft.Consumption | [Cost Management](/azure/cost-management/) |
| Microsoft.ContainerInstance | [Container Instances](/azure/container-instances/) |
| Microsoft.ContainerRegistry | [Container Registry](/azure/container-registry/) |
| Microsoft.ContainerService | [Azure Kubernetes Service (AKS)](/azure/aks/) |
| Microsoft.ContentModerator | [Azure Content Moderator](../cognitive-services/content-moderator/index.yml) |
| Microsoft.CostManagement | [Cost Management](/azure/cost-management/) |
| Microsoft.CustomerInsights | Customer Insights |
| Microsoft.CustomerLockbox | Customer Lockbox for Microsoft Azure |
| Microsoft.CustomProviders | [Azure Custom Providers](../managed-applications/custom-providers-overview.md) |
| Microsoft.DataBox | [Azure Data Box](/azure/databox-family/) |
| Microsoft.DataBoxEdge | [Azure Data Box Edge](../databox-online/data-box-edge-overview.md) |
| Microsoft.Databricks | [Azure Databricks](/azure/azure-databricks/) |
| Microsoft.DataCatalog | [Data Catalog](/azure/data-catalog/) |
| Microsoft.DataFactory | [Data Factory](/azure/data-factory/) |
| Microsoft.DataLakeAnalytics | [Data Lake Analytics](/azure/data-lake-analytics/) |
| Microsoft.DataLakeStore | [Azure Data Lake Store](../storage/blobs/data-lake-storage-introduction.md) |
| Microsoft.DataMigration | [Azure Database Migration Service](/azure/dms/) |
| Microsoft.DBforMariaDB | [Azure Database for MariaDB](/azure/mariadb/) |
| Microsoft.DBforMySQL | [Azure Database for MySQL](/azure/mysql/) |
| Microsoft.DBforPostgreSQL | [Azure Database for PostgreSQL](/azure/postgresql/) |
| Microsoft.DeploymentManager | [Azure Deployment Manager](deployment-manager-overview.md) |
| Microsoft.Devices | [IoT Hub](/azure/iot-hub/)<br />[IoT Hub Device Provisioning Service](/azure/iot-dps/) |
| Microsoft.DevSpaces | [Azure Dev Spaces](/azure/dev-spaces/) |
| Microsoft.DevTestLab | [Azure Lab Services](../lab-services/index.yml) |
| Microsoft.DocumentDB | [Azure Cosmos DB](../cosmos-db/index.yml) |
| Microsoft.DomainRegistration | [App Service](/azure/app-service/) |
| Microsoft.EnterpriseKnowledgeGraph | Enterprise Knowledge Graph |
| Microsoft.EventGrid | [Event Grid](/azure/event-grid/) |
| Microsoft.EventHub | [Event Hubs](../event-hubs/index.yml) |
| Microsoft.Features | [Azure Resource Manager](index.yml) |
| Microsoft.Genomics | [Microsoft Genomics](/azure/genomics/) |
| Microsoft.GuestConfiguration | [Azure Policy](../governance/policy/index.yml) |
| Microsoft.HanaOnAzure | [SAP HANA on Azure](../virtual-machines/workloads/sap/hana-overview-architecture.md) |
| Microsoft.HardwareSecurityModules | [Azure Dedicated HSM](../dedicated-hsm/index.yml) |
| Microsoft.HDInsight | [HDInsight](../hdinsight/index.yml) |
| Microsoft.HealthcareApis | [Azure API for FHIR](../healthcare-apis/index.yml) |
| Microsoft.ImportExport | [Azure Import/Export](../storage/common/storage-import-export-service.md) |
| microsoft.insights | [Azure Monitor](../azure-monitor/index.yml) |
| Microsoft.Intune | [Intune](/intune/) |
| Microsoft.IoTCentral | [IoT Central](/azure/iot-central/) |
| Microsoft.IoTSpaces | [Azure Digital Twins](../digital-twins/index.yml) |
| Microsoft.KeyVault | [Key Vault](../key-vault/index.yml) |
| Microsoft.Kusto | [Azure Data Explorer](../data-explorer/index.yml) |
| Microsoft.LabServices | [Azure Lab Services](../lab-services/index.yml) |
| Microsoft.LocationBasedServices | [Azure Maps](../azure-maps/index.yml) |
| Microsoft.LocationServices | core |
| Microsoft.LogAnalytics | [Azure Monitor](../azure-monitor/index.yml) |
| Microsoft.Logic | [Logic Apps](../logic-apps/index.yml) |
| Microsoft.MachineLearning | [Machine Learning Studio](../machine-learning/studio/index.yml) |
| Microsoft.MachineLearningCompute | [Machine Learning Service](../machine-learning/service/index.yml) |
| Microsoft.MachineLearningModelManagement | [Machine Learning Service](../machine-learning/service/index.yml) |
| Microsoft.MachineLearningServices | [Machine Learning Service](../machine-learning/service/index.yml) |
| Microsoft.ManagedIdentity | [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/index.yml) |
| Microsoft.ManagedLab | [Azure Lab Services](../lab-services/index.yml) |
| Microsoft.Management | [Management Groups](/azure/governance/management-groups/) |
| Microsoft.Maps | [Azure Maps](../azure-maps/index.yml) |
| Microsoft.Marketplace | core |
| Microsoft.MarketplaceApps | core |
| Microsoft.MarketplaceOrdering | core |
| Microsoft.Media | [Media Services](../media-services/index.yml) |
| Microsoft.Migrate | [Azure Migrate](../migrate/migrate-overview.md) |
| Microsoft.MixedReality | [Azure Spatial Anchors](/azure/spatial-anchors/) |
| Microsoft.NetApp | [Azure NetApp Files](../azure-netapp-files/index.yml) |
| Microsoft.Network | [Virtual Network](../virtual-network/index.yml)<br />[Load Balancer](../load-balancer/index.yml)<br />[Application Gateway](../application-gateway/index.yml)<br />[Azure DNS](../dns/index.yml)<br />[ExpressRoute](../expressroute/index.yml)<br />[VPN Gateway](../vpn-gateway/index.yml)<br />[Traffic Manager](../traffic-manager/index.yml)<br />[Network Watcher](../network-watcher/index.yml)<br />[Azure Firewall](../firewall/index.yml)<br />[Azure Front Door Service](../frontdoor/index.yml)<br />[Azure Bastion](/azure/bastion/) |
| Microsoft.NotificationHubs | [Notification Hubs](../notification-hubs/index.yml) |
| Microsoft.OffAzure | [Azure Migrate](../migrate/migrate-overview.md) |
| Microsoft.OperationalInsights | [Azure Monitor](../azure-monitor/index.yml) |
| Microsoft.OperationsManagement | [Azure Monitor](../azure-monitor/index.yml) |
| Microsoft.PolicyInsights | [Azure Policy](../governance/policy/index.yml) |
| Microsoft.Portal | [Azure portal](/azure/azure-portal/) |
| Microsoft.PowerBI | [Power BI](/power-bi/power-bi-overview) |
| Microsoft.PowerBIDedicated | [Power BI Embedded](/azure/power-bi-embedded/) |
| Microsoft.RecoveryServices | [Site Recovery](../site-recovery/index.yml) |
| Microsoft.Relay | [Azure Relay](../service-bus-relay/relay-what-is-it.md) |
| Microsoft.ResourceGraph | [Azure Resource Graph](/azure/governance/resource-graph/) |
| Microsoft.ResourceHealth | core |
| Microsoft.Resources | [Azure Resource Manager](index.yml) |
| Microsoft.SaaS | core |
| Microsoft.Scheduler | [Scheduler](/azure/scheduler/) |
| Microsoft.Search | [Azure Search](../search/index.yml) |
| Microsoft.Security | [Security Center](../security-center/index.yml) |
| Microsoft.ServiceBus | [Service Bus](/azure/service-bus/) |
| Microsoft.ServiceFabric | [Service Fabric](../service-fabric/index.yml) |
| Microsoft.ServiceFabricMesh | [Service Fabric Mesh](../service-fabric-mesh/index.yml) |
| Microsoft.SignalRService | [Azure SignalR Service](../azure-signalr/index.yml) |
| Microsoft.SiteRecovery | [Site Recovery](../site-recovery/index.yml) |
| Microsoft.Solutions | [Azure Managed Applications](../managed-applications/index.yml) |
| Microsoft.Sql | [Azure SQL Database](../sql-database/index.yml) |
| Microsoft.SqlVirtualMachine | [SQL Server on Azure Virtual Machines](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-iaas-overview.md) |
| Microsoft.Storage | [Storage](../storage/index.yml) |
| Microsoft.StorageSync | [Storage](../storage/index.yml) |
| Microsoft.StorSimple | [StorSimple](/azure/storsimple/) |
| Microsoft.StreamAnalytics | [Stream Analytics](../stream-analytics/index.yml) |
| Microsoft.Subscription | core |
| microsoft.support | core |
| Microsoft.TimeSeriesInsights | [Time Series Insights](../time-series-insights/index.yml) |
| microsoft.visualstudio | [Azure DevOps](/azure/devops/?view=azure-devops) |
| Microsoft.VMwareCloudSimple | [Azure VMware Solution by CloudSimple](/azure/vmware-cloudsimple/) |
| Microsoft.Web | [App Service](../app-service/index.yml)<br />[Functions](../azure-functions/index.yml) |
| Microsoft.WindowsDefenderATP | [Windows Defender Advanced Threat Protection](/windows/security/threat-protection/windows-defender-atp/windows-defender-advanced-threat-protection) |
| Microsoft.WindowsIoT | [Windows 10 IoT Core Services](https://docs.microsoft.com/windows-hardware/manufacture/iot/iotcoreservicesoverview) |
| Microsoft.WorkloadMonitor | [Azure Monitor](../azure-monitor/index.yml) |

## Next steps

For more information about resource providers, see [Azure resource providers and types](resource-manager-supported-services.md)
