---
title: Find resource providers by Azure services
description: Lists all resource provider namespaces for Azure Resource Manager and shows the Azure service for that namespace.
ms.topic: conceptual
ms.date: 11/07/2023
ms.custom: ignite-2022, devx-track-arm-template
content_well_notification: 
  - AI-contribution
---

# What are the resource providers for Azure services

A resource provider is a collection of REST operations that enables functionality for an Azure service. Each resource provider has a namespace in the format of `company-name.service-label`. This article shows the resource providers for Azure services. If you don't know the resource provider, see [Find resource provider](#find-resource-provider).

## AI and machine learning resource providers

The resource providers for AI and machine learning services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AutonomousSystems | [Autonomous Systems](https://www.microsoft.com/ai/autonomous-systems) |
| Microsoft.BotService | [Azure Bot Service](/azure/bot-service/) |
| Microsoft.CognitiveServices | [Cognitive Services](../../ai-services/index.yml) |
| Microsoft.EnterpriseKnowledgeGraph | Enterprise Knowledge Graph |
| Microsoft.MachineLearning | [Machine Learning Studio](../../machine-learning/classic/index.yml) |
| Microsoft.MachineLearningServices | [Azure Machine Learning](../../machine-learning/index.yml) |
| Microsoft.Search | [Azure Cognitive Search](../../search/index.yml) |

## Analytics resource providers

The resource providers for analytics services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AnalysisServices | [Azure Analysis Services](../../analysis-services/index.yml) |
| Microsoft.Databricks | [Azure Databricks](/azure/azure-databricks/) |
| Microsoft.DataCatalog | [Data Catalog](../../data-catalog/index.yml) |
| Microsoft.DataFactory | [Data Factory](../../data-factory/index.yml) |
| Microsoft.DataLakeAnalytics | [Data Lake Analytics](../../data-lake-analytics/index.yml) |
| Microsoft.DataLakeStore | [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md) |
| Microsoft.DataShare | [Azure Data Share](../../data-share/index.yml) |
| Microsoft.HDInsight | [HDInsight](../../hdinsight/index.yml) |
| Microsoft.Kusto | [Azure Data Explorer](/azure/data-explorer/) |
| Microsoft.PowerBI | [Power BI](/power-bi/power-bi-overview) |
| Microsoft.PowerBIDedicated | [Power BI Embedded](/azure/power-bi-embedded/) |
| Microsoft.ProjectBabylon | [Azure Data Catalog](../../data-catalog/overview.md) |
| Microsoft.Purview | [Microsoft Purview](/purview/purview) |
| Microsoft.StreamAnalytics | [Azure Stream Analytics](../../stream-analytics/index.yml) |
| Microsoft.Synapse | [Azure Synapse Analytics](/azure/sql-data-warehouse/) |

## Blockchain resource providers

The resource providers for Blockchain services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Blockchain | [Azure Blockchain Service](../../blockchain/workbench/index.yml) |
| Microsoft.BlockchainTokens | [Azure Blockchain Tokens](https://azure.microsoft.com/services/blockchain-tokens/) |

## Compute resource providers

The resource providers for compute services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AppPlatform | [Azure Spring Apps](../../spring-apps/overview.md) |
| Microsoft.AVS | [Azure VMware Solution](../../azure-vmware/index.yml) |
| Microsoft.Batch | [Batch](../../batch/index.yml) |
| Microsoft.ClassicCompute | Classic deployment model virtual machine |
| Microsoft.Compute | [Virtual Machines](../../virtual-machines/index.yml)<br />[Virtual Machine Scale Sets](../../virtual-machine-scale-sets/index.yml) |
| Microsoft.DesktopVirtualization | [Azure Virtual Desktop](../../virtual-desktop/index.yml) |
| Microsoft.DevTestLab | [Azure Lab Services](../../lab-services/index.yml) |
| Microsoft.HanaOnAzure | [SAP HANA on Azure Large Instances](../../virtual-machines/workloads/sap/hana-overview-architecture.md) |
| Microsoft.LabServices | [Azure Lab Services](../../lab-services/index.yml) |
| Microsoft.Maintenance | [Azure Maintenance](../../virtual-machines/maintenance-configurations.md) |
| Microsoft.Microservices4Spring | [Azure Spring Apps](../../spring-apps/overview.md) |
| Microsoft.Quantum | [Azure Quantum](https://azure.microsoft.com/services/quantum/) |
| Microsoft.SerialConsole - [registered by default](#registration) | [Azure Serial Console for Windows](/troubleshoot/azure/virtual-machines/serial-console-windows) |
| Microsoft.ServiceFabric | [Service Fabric](../../service-fabric/index.yml) |
| Microsoft.VirtualMachineImages | [Azure Image Builder](../../virtual-machines/image-builder-overview.md) |
| Microsoft.VMware | [Azure VMware Solution](../../azure-vmware/index.yml) |
| Microsoft.VMwareCloudSimple | [Azure VMware Solution by CloudSimple](../../vmware-cloudsimple/index.md) |

## Container resource providers

The resource providers for container services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.App | [Azure Container Apps](../../container-apps/index.yml) |
| Microsoft.ContainerInstance | [Container Instances](../../container-instances/index.yml) |
| Microsoft.ContainerRegistry | [Container Registry](../../container-registry/index.yml) |
| Microsoft.ContainerService | [Azure Kubernetes Service (AKS)](../../aks/index.yml) |
| Microsoft.RedHatOpenShift | [Azure Red Hat OpenShift](../../virtual-machines/linux/openshift-get-started.md) |

## Core resource providers

The resource providers for core services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Addons | core |
| Microsoft.AzureStack | core |
| Microsoft.Capacity | core |
| Microsoft.Commerce - [registered by default](#registration) | core |
| Microsoft.Marketplace | core |
| Microsoft.MarketplaceApps | core |
| Microsoft.MarketplaceOrdering - [registered by default](#registration) | core |
| Microsoft.SaaS | core |
| Microsoft.Services | core |
| Microsoft.Subscription | core |
| microsoft.support - [registered by default](#registration) | core |

## Database resource providers

The resource providers for database services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AzureData | SQL Server registry |
| Microsoft.Cache | [Azure Cache for Redis](../../azure-cache-for-redis/index.yml) |
| Microsoft.DBforMariaDB | [Azure Database for MariaDB](../../mariadb/index.yml) |
| Microsoft.DBforMySQL | [Azure Database for MySQL](../../mysql/index.yml) |
| Microsoft.DBforPostgreSQL | [Azure Database for PostgreSQL](../../postgresql/index.yml) |
| Microsoft.DocumentDB | [Azure Cosmos DB](../../cosmos-db/index.yml) |
| Microsoft.Sql | [Azure SQL Database](/azure/azure-sql/database/index)<br /> [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/index) <br />[Azure Synapse Analytics](/azure/sql-data-warehouse/) |
| Microsoft.SqlVirtualMachine | [SQL Server on Azure Virtual Machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview) |

## Developer tools resource providers

The resource providers for developer tools services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AppConfiguration | [Azure App Configuration](../../azure-app-configuration/index.yml) |
| Microsoft.DevSpaces | [Azure Dev Spaces](/previous-versions/azure/dev-spaces/) |
| Microsoft.MixedReality | [Azure Spatial Anchors](../../spatial-anchors/index.yml) |
| Microsoft.Notebooks | [Azure Notebooks](https://notebooks.azure.com/help/introduction) |

## DevOps resource providers

The resource providers for DevOps services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| microsoft.visualstudio | [Azure DevOps](/azure/devops/) |
| Microsoft.VSOnline | [Azure DevOps](/azure/devops/) |

## Hybrid resource providers

The resource providers for hybrid services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AzureArcData | Azure Arc-enabled data services |
| Microsoft.AzureStackHCI | [Azure Stack HCI](/azure-stack/hci/overview) |
| Microsoft.HybridCompute | [Azure Arc-enabled servers](../../azure-arc/servers/index.yml) |
| Microsoft.Kubernetes | [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/index.yml) |
| Microsoft.KubernetesConfiguration | [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/index.yml) |

## Identity resource providers

The resource providers for identity services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AAD | [Microsoft Entra Domain Services](../../active-directory-domain-services/index.yml) |
| Microsoft.ADHybridHealthService - [registered by default](#registration) | [Microsoft Entra ID](../../active-directory/index.yml) |
| Microsoft.AzureActiveDirectory | [Microsoft Entra ID B2C](../../active-directory-b2c/index.yml) |
| Microsoft.ManagedIdentity | [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/index.yml) |
| Microsoft.Token | Token |

## Integration resource providers

The resource providers for integration services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.ApiManagement | [API Management](../../api-management/index.yml) |
| Microsoft.Communication | [Azure Communication Services](../../communication-services/overview.md) |
| Microsoft.EventGrid | [Event Grid](../../event-grid/index.yml) |
| Microsoft.EventHub | [Event Hubs](../../event-hubs/index.yml) |
| Microsoft.HealthcareApis (Azure API for FHIR) | [Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/index.yml) |
| Microsoft.HealthcareApis (Healthcare APIs) | [Healthcare APIs](../../healthcare-apis/index.yml) |
| Microsoft.Logic | [Logic Apps](../../logic-apps/index.yml) |
| Microsoft.NotificationHubs | [Notification Hubs](../../notification-hubs/index.yml) |
| Microsoft.PowerPlatform | [Power Platform](/power-platform/) |
| Microsoft.Relay | [Azure Relay](../../azure-relay/relay-what-is-it.md) |
| Microsoft.ServiceBus | [Service Bus](/azure/service-bus/) |

## IoT resource providers

The resource providers for IoT services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Devices | [Azure IoT Hub](../../iot-hub/index.yml)<br />[Azure IoT Hub Device Provisioning Service](../../iot-dps/index.yml) |
| Microsoft.DeviceUpdate | [Device Update for IoT Hub](../../iot-hub-device-update/index.yml) |
| Microsoft.DigitalTwins | [Azure Digital Twins](../../digital-twins/overview.md) |
| Microsoft.IoTCentral | [Azure IoT Central](../../iot-central/index.yml) |
| Microsoft.IoTSpaces | [Azure Digital Twins](../../digital-twins/index.yml) |
| Microsoft.TimeSeriesInsights | [Azure Time Series Insights](../../time-series-insights/index.yml) |
| Microsoft.WindowsIoT | [Windows 10 IoT Core Services](/windows-hardware/manufacture/iot/iotcoreservicesoverview) |

## Management resource providers

The resource providers for management services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Advisor | [Azure Advisor](../../advisor/index.yml) |
| Microsoft.Authorization - [registered by default](#registration) | [Azure Resource Manager](../index.yml) |
| Microsoft.Automation | [Automation](../../automation/index.yml) |
| Microsoft.Billing - [registered by default](#registration) | [Cost Management and Billing](/azure/billing/) |
| Microsoft.Blueprint | [Azure Blueprints](../../governance/blueprints/index.yml) |
| Microsoft.ClassicSubscription - [registered by default](#registration) | Classic deployment model |
| Microsoft.Consumption - [registered by default](#registration) | [Cost Management](/azure/cost-management/) |
| Microsoft.CostManagement - [registered by default](#registration) | [Cost Management](/azure/cost-management/) |
| Microsoft.CostManagementExports | [Cost Management](/azure/cost-management/) |
| Microsoft.CustomProviders | [Azure Custom Providers](../custom-providers/overview.md) |
| Microsoft.DynamicsLcs | [Lifecycle Services](https://lcs.dynamics.com/Logon/Index) |
| Microsoft.Features - [registered by default](#registration) | [Azure Resource Manager](../index.yml) |
| Microsoft.GuestConfiguration | [Azure Policy](../../governance/policy/index.yml) |
| Microsoft.ManagedServices | [Azure Lighthouse](../../lighthouse/index.yml) |
| Microsoft.Management | [Management Groups](../../governance/management-groups/index.yml) |
| Microsoft.PolicyInsights | [Azure Policy](../../governance/policy/index.yml) |
| Microsoft.Portal - [registered by default](#registration) | [Azure portal](../../azure-portal/index.yml) |
| Microsoft.RecoveryServices | [Azure Site Recovery](../../site-recovery/index.yml) |
| Microsoft.ResourceGraph - [registered by default](#registration) | [Azure Resource Graph](../../governance/resource-graph/index.yml) |
| Microsoft.ResourceHealth | [Azure Service Health](../../service-health/index.yml) |
| Microsoft.Resources - [registered by default](#registration) | [Azure Resource Manager](../index.yml) |
| Microsoft.Scheduler | [Scheduler](../../scheduler/index.yml) |
| Microsoft.SoftwarePlan | License |
| Microsoft.Solutions | [Azure Managed Applications](../managed-applications/index.yml) |

## Media resource providers

The resource providers for media services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Media | [Media Services](/azure/media-services/) |

## Migration resource providers

The resource providers for migration services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.ClassicInfrastructureMigrate | Classic deployment model migration |
| Microsoft.DataBox | [Azure Data Box](../../databox/index.yml) |
| Microsoft.DataBoxEdge | [Azure Stack Edge](../../databox-online/azure-stack-edge-overview.md) |
| Microsoft.DataMigration | [Azure Database Migration Service](../../dms/index.yml) |
| Microsoft.OffAzure | [Azure Migrate](../../migrate/migrate-services-overview.md) |
| Microsoft.Migrate | [Azure Migrate](../../migrate/migrate-services-overview.md) |

## Monitoring resource providers

The resource providers for monitoring services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.AlertsManagement | [Azure Monitor](../../azure-monitor/index.yml) |
| Microsoft.ChangeAnalysis | [Azure Monitor](../../azure-monitor/index.yml) |
| Microsoft.Insights | [Azure Monitor](../../azure-monitor/index.yml) |
| Microsoft.Intune | [Azure Monitor](../../azure-monitor/index.yml) |
| Microsoft.OperationalInsights | [Azure Monitor](../../azure-monitor/index.yml) |
| Microsoft.OperationsManagement | [Azure Monitor](../../azure-monitor/index.yml) |
| Microsoft.WorkloadMonitor | [Azure Monitor](../../azure-monitor/index.yml) |

## Network resource providers

The resource providers for network services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Cdn | [Content Delivery Network](../../cdn/index.yml) |
| Microsoft.ClassicNetwork | Classic deployment model virtual network |
| Microsoft.ManagedNetwork | Virtual networks managed by PaaS services |
| Microsoft.Network | [Application Gateway](../../application-gateway/index.yml)<br />[Azure Bastion](../../bastion/index.yml)<br />[Azure DDoS Protection](../../ddos-protection/ddos-protection-overview.md)<br />[Azure DNS](../../dns/index.yml)<br />[Azure ExpressRoute](../../expressroute/index.yml)<br />[Azure Firewall](../../firewall/index.yml)<br />[Azure Front Door Service](../../frontdoor/index.yml)<br />[Azure Private Link](../../private-link/index.yml)<br />[Azure Route Server](../../route-server/index.yml)<br />[Load Balancer](../../load-balancer/index.yml)<br />[Network Watcher](../../network-watcher/index.yml)<br />[Traffic Manager](../../traffic-manager/index.yml)<br />[Virtual Network](../../virtual-network/index.yml)<br />[Virtual Network NAT](../../virtual-network/nat-gateway/nat-overview.md)<br />[Virtual WAN](../../virtual-wan/index.yml)<br />[VPN Gateway](../../vpn-gateway/index.yml)<br /> |
| Microsoft.Peering | [Azure Peering Service](../../peering-service/index.yml) |

## Security resource providers

The resource providers for security services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.Attestation | [Azure Attestation Service](../../attestation/overview.md) |
| Microsoft.CustomerLockbox | [Customer Lockbox for Microsoft Azure](../../security/fundamentals/customer-lockbox-overview.md) |
| Microsoft.DataProtection | Data Protection |
| Microsoft.HardwareSecurityModules | [Azure Dedicated HSM](../../dedicated-hsm/index.yml) |
| Microsoft.KeyVault | [Key Vault](../../key-vault/index.yml) |
| Microsoft.Security | [Security Center](../../security-center/index.yml) |
| Microsoft.SecurityInsights | [Microsoft Sentinel](../../sentinel/index.yml) |
| Microsoft.WindowsDefenderATP | [Microsoft Defender Advanced Threat Protection](../../security-center/security-center-wdatp.md) |
| Microsoft.WindowsESU | Extended Security Updates |

## Storage resource providers

The resource providers for storage services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.ClassicStorage | Classic deployment model storage |
| Microsoft.ElasticSan | [Elastic SAN Preview](../../storage/elastic-san/index.yml) |
| Microsoft.HybridData | [StorSimple](../../storsimple/index.yml) |
| Microsoft.ImportExport | [Azure Import/Export](../../import-export/storage-import-export-service.md) |
| Microsoft.NetApp | [Azure NetApp Files](../../azure-netapp-files/index.yml) |
| Microsoft.ObjectStore | Object Store |
| Microsoft.Storage | [Storage](../../storage/index.yml) |
| Microsoft.StorageCache | [Azure HPC Cache](../../hpc-cache/index.yml) |
| Microsoft.StorageSync | [Storage](../../storage/index.yml) |
| Microsoft.StorSimple | [StorSimple](../../storsimple/index.yml) |

## Web resource providers

The resource providers for web services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.BingMaps | [Bing Maps](/BingMaps/#pivot=main&panel=BingMapsAPI) |
| Microsoft.CertificateRegistration | [App Service Certificates](../../app-service/configure-ssl-app-service-certificate.md) |
| Microsoft.DomainRegistration | [App Service](../../app-service/index.yml) |
| Microsoft.Maps | [Azure Maps](../../azure-maps/index.yml) |
| Microsoft.SignalRService | [Azure SignalR Service](../../azure-signalr/index.yml) |
| Microsoft.Web | [App Service](../../app-service/index.yml)<br />[Azure Functions](../../azure-functions/index.yml) |

## 5G & Space resource providers

The resource providers for 5G & space services are:

| Resource provider namespace | Azure service |
| --------------------------- | ------------- |
| Microsoft.HybridNetwork  | [Network Function Manager](../../network-function-manager/index.yml) |
| Microsoft.MobileNetwork | [Azure Private 5G Core](../../private-5g-core/index.yml) |
| Microsoft.Orbital | [Azure Orbital Ground Station](../../orbital/overview.md) |

## Registration

Resource providers marked with **- registered by default** in the previous section are automatically registered for your subscription. For other resource providers, you need to [register them](resource-providers-and-types.md). However, many resource providers are registered automatically when you perform specific actions. For example, when you create resources through the portal or by deploying an [Azure Resource Manager template](../templates/overview.md), Azure Resource Manager automatically registers any required unregistered resource providers.

> [!IMPORTANT]
> Register a resource provider only when you're ready to use it. This registration step helps maintain least privileges within your subscription. A malicious user can't use unregistered resource providers.
>
> Registering unnecessary resource providers may result in unrecognized apps appearing in your Microsoft Entra tenant. Microsoft adds the app for a resource provider when you register it. These apps are typically added by the Windows Azure Service Management API. To prevent unnecessary apps in your tenant, only register needed resource providers.

## Find resource provider

To identify resource providers used for your existing Azure infrastructure, list the deployed resources. Specify the resource group containing the resources.

The following example uses Azure CLI:

```azurecli-interactive
az resource list --resource-group examplegroup
```

The results include the resource type. The resource provider namespace is the first part of the resource type. The following example shows the **Microsoft.KeyVault** resource provider.

```output
[
  {
    ...
    "type": "Microsoft.KeyVault/vaults"
  }
]
```

The following example uses PowerShell:

```azurepowershell-interactive
Get-AzResource -ResourceGroupName examplegroup
```

The results include the resource type. The resource provider namespace is the first part of the resource type. The following example shows the **Microsoft.KeyVault** resource provider.

```output
Name              : examplekey
ResourceGroupName : examplegroup
ResourceType      : Microsoft.KeyVault/vaults
...
```

The following example uses Python:

```python
import os
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]
credential = DefaultAzureCredential()
resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "examplegroup"
resources = resource_client.resources.list_by_resource_group(resource_group_name)

for resource in resources:
    print(resource.type)
```

The results list the resource type. The resource provider namespace is the first part of the resource type. The following example shows the **Microsoft.KeyVault** resource provider.

```output
Microsoft.KeyVault/vaults
```

## Next steps

For more information about resource providers, including how to register a resource provider, see [Azure resource providers and types](resource-providers-and-types.md).
