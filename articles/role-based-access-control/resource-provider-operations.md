---
title: Azure permissions - Azure RBAC
description: Lists the permissions for Azure resource providers.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions

This article lists the permissions for Azure resource providers, which are used in built-in roles. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. The permissions are always evolving. To get the latest permissions, use [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list).

Click the resource provider name in the following list to see the list of permissions.

<a name='microsoftsupport'></a>

## General

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.Addons](./permissions/general.md#microsoftaddons) |  | core |
> | [Microsoft.Capacity](./permissions/general.md#microsoftcapacity) |  | core |
> | [Microsoft.Commerce](./permissions/general.md#microsoftcommerce) |  | core |
> | [Microsoft.Marketplace](./permissions/general.md#microsoftmarketplace) |  | core |
> | [Microsoft.MarketplaceOrdering](./permissions/general.md#microsoftmarketplaceordering) |  | core |
> | [Microsoft.Quota](./permissions/general.md#microsoftquota) |  | [Azure Quotas](/azure/quotas/quotas-overview) |
> | [Microsoft.Subscription](./permissions/general.md#microsoftsubscription) |  | core |
> | [Microsoft.Support](./permissions/general.md#microsoftsupport) |  | core |

## Compute

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [microsoft.app](./permissions/compute.md#microsoftapp) |  | [Azure Container Apps](/azure/container-apps/) |
> | [Microsoft.AppPlatform](./permissions/compute.md#microsoftappplatform) | A fully managed Spring Cloud service, built and operated with Pivotal. | [Azure Spring Apps](/azure/spring-apps/) |
> | [Microsoft.AVS](./permissions/compute.md#microsoftavs) |  | [Azure VMware Solution](/azure/azure-vmware/introduction) |
> | [Microsoft.Batch](./permissions/compute.md#microsoftbatch) | Cloud-scale job scheduling and compute management. | [Batch](/azure/batch/) |
> | [Microsoft.ClassicCompute](./permissions/compute.md#microsoftclassiccompute) |  | Classic deployment model virtual machine |
> | [Microsoft.Compute](./permissions/compute.md#microsoftcompute) | Access cloud compute capacity and scale on demand (such as virtual machines) and only pay for the resources you use. | [Virtual Machines](/azure/virtual-machines/)<br/>[Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/) |
> | [Microsoft.DesktopVirtualization](./permissions/compute.md#microsoftdesktopvirtualization) | The best virtual desktop experience, delivered on Azure. | [Azure Virtual Desktop](/azure/virtual-desktop/) |
> | [Microsoft.ServiceFabric](./permissions/compute.md#microsoftservicefabric) | Develop microservices and orchestrate containers on Windows or Linux. | [Service Fabric](/azure/service-fabric/) |

<a name='microsoftnetwork'></a>

## Networking

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.Cdn](./permissions/networking.md#microsoftcdn) | Ensure secure, reliable content delivery with broad global reach. | [Content Delivery Network](/azure/cdn/) |
> | [Microsoft.ClassicNetwork](./permissions/networking.md#microsoftclassicnetwork) |  | Classic deployment model virtual network |
> | [Microsoft.MobileNetwork](./permissions/networking.md#microsoftmobilenetwork) |  | [Azure Private 5G Core](/azure/private-5g-core/) |
> | [Microsoft.Network](./permissions/networking.md#microsoftnetwork) | Connect cloud and on-premises infrastructure and services to provide your customers and users the best possible experience. | [Application Gateway](/azure/application-gateway/)<br />[Azure Bastion](/azure/bastion/)<br />[Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview)<br />[Azure DNS](/azure/dns/)<br />[Azure ExpressRoute](/azure/expressroute/)<br />[Azure Firewall](/azure/firewall/)<br />[Azure Front Door Service](/azure/frontdoor/)<br />[Azure Private Link](/azure/private-link/)<br />[Azure Route Server](/azure/route-server/)<br />[Load Balancer](/azure/load-balancer/)<br />[Network Watcher](/azure/network-watcher/)<br />[Traffic Manager](/azure/traffic-manager/)<br />[Virtual Network](/azure/virtual-network/)<br />[Virtual Network NAT](/azure/nat-gateway/nat-overview)<br />[Virtual Network Manager](/azure/virtual-network-manager/overview)<br />[Virtual WAN](/azure/virtual-wan/)<br />[VPN Gateway](/azure/vpn-gateway/) |

<a name='microsoftdatashare'></a>
<a name='microsoftelasticsan'></a>
<a name='microsoftnetapp'></a>
<a name='microsoftstorage'></a>

## Storage

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.ClassicStorage](./permissions/storage.md#microsoftclassicstorage) |  | Classic deployment model storage |
> | [Microsoft.DataShare](./permissions/storage.md#microsoftdatashare) | A simple and safe service for sharing big data with external organizations. | [Azure Data Share](/azure/data-share/) |
> | [Microsoft.ElasticSan](./permissions/storage.md#microsoftelasticsan) |  | [Azure Elastic SAN](/azure/storage/elastic-san/) |
> | [Microsoft.NetApp](./permissions/storage.md#microsoftnetapp) | Enterprise-grade Azure file shares, powered by NetApp. | [Azure NetApp Files](/azure/azure-netapp-files/) |
> | [Microsoft.Storage](./permissions/storage.md#microsoftstorage) | Get secure, massively scalable cloud storage for your data, apps, and workloads. | [Storage](/azure/storage/) |
> | [Microsoft.StorageCache](./permissions/storage.md#microsoftstoragecache) | File caching for high-performance computing (HPC). | [Azure HPC Cache](/azure/hpc-cache/) |
> | [Microsoft.StorageSync](./permissions/storage.md#microsoftstoragesync) |  | [Storage](/azure/storage/) |

<a name='microsoftweb'></a>

## Web and Mobile

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.CertificateRegistration](./permissions/web-and-mobile.md#microsoftcertificateregistration) | Allow an application to use its own credentials for authentication. | [App Service Certificates](/azure/app-service/configure-ssl-certificate#buy-and-import-app-service-certificate) |
> | [Microsoft.DomainRegistration](./permissions/web-and-mobile.md#microsoftdomainregistration) |  | [App Service](/azure/app-service/) |
> | [Microsoft.Maps](./permissions/web-and-mobile.md#microsoftmaps) | Simple and secure location APIs provide geospatial context to data. | [Azure Maps](/azure/azure-maps/) |
> | [Microsoft.Media](./permissions/web-and-mobile.md#microsoftmedia) | Encode, store, and stream video and audio at scale. | [Media Services](/azure/media-services/) |
> | [Microsoft.SignalRService](./permissions/web-and-mobile.md#microsoftsignalrservice) | Add real-time web functionalities easily. | [Azure SignalR Service](/azure/azure-signalr/) |
> | [microsoft.web](./permissions/web-and-mobile.md#microsoftweb) | Quickly create and deploy mission critical web apps at scale. | [App Service](/azure/app-service/)<br/>[Azure Functions](/azure/azure-functions/) |

<a name='microsoftcontainerinstance'></a>
<a name='microsoftcontainerregistry'></a>
<a name='microsoftcontainerservice'></a>

## Containers

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.ContainerInstance](./permissions/containers.md#microsoftcontainerinstance) | Easily run containers on Azure without managing servers. | [Container Instances](/azure/container-instances/) |
> | [Microsoft.ContainerRegistry](./permissions/containers.md#microsoftcontainerregistry) | Store and manage container images across all types of Azure deployments. | [Container Registry](/azure/container-registry/) |
> | [Microsoft.ContainerService](./permissions/containers.md#microsoftcontainerservice) | Accelerate your containerized application development without compromising security. | [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) |
> | [Microsoft.RedHatOpenShift](./permissions/containers.md#microsoftredhatopenshift) |  | [Azure Red Hat OpenShift](/azure/openshift/) |

<a name='microsoftdocumentdb'></a>

## Databases

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.Cache](./permissions/databases.md#microsoftcache) | Power applications with high-throughput, low-latency data access. | [Azure Cache for Redis](/azure/azure-cache-for-redis/) |
> | [Microsoft.DBforMariaDB](./permissions/databases.md#microsoftdbformariadb) | Managed MariaDB database service for app developers. | [Azure Database for MariaDB](/azure/mariadb/) |
> | [Microsoft.DBforMySQL](./permissions/databases.md#microsoftdbformysql) | Managed MySQL database service for app developers. | [Azure Database for MySQL](/azure/mysql/) |
> | [Microsoft.DBforPostgreSQL](./permissions/databases.md#microsoftdbforpostgresql) | Managed PostgreSQL database service for app developers. | [Azure Database for PostgreSQL](/azure/postgresql/) |
> | [Microsoft.DocumentDB](./permissions/databases.md#microsoftdocumentdb) | A NoSQL document database-as-a-service. | [Azure Cosmos DB](/azure/cosmos-db/) |
> | [Microsoft.Sql](./permissions/databases.md#microsoftsql) | Managed, intelligent SQL in the cloud. | [Azure SQL Database](/azure/azure-sql/database/index)<br/>[Azure SQL Managed Instance](/azure/azure-sql/managed-instance/index)<br/>[Azure Synapse Analytics](/azure/synapse-analytics/) |
> | [Microsoft.SqlVirtualMachine](./permissions/databases.md#microsoftsqlvirtualmachine) | Host enterprise SQL Server apps in the cloud. | [SQL Server on Azure Virtual Machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview) |

<a name='microsoftdatafactory'></a>

## Analytics

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.AnalysisServices](./permissions/analytics.md#microsoftanalysisservices) | Enterprise-grade analytics engine as a service. | [Azure Analysis Services](/azure/analysis-services/index) |
> | [Microsoft.Databricks](./permissions/analytics.md#microsoftdatabricks) | Fast, easy, and collaborative Apache Spark-based analytics platform. | [Azure Databricks](/azure/databricks/) |
> | [Microsoft.DataCatalog](./permissions/analytics.md#microsoftdatacatalog) | Get more value from your enterprise data assets. | [Data Catalog](/azure/data-catalog/) |
> | [Microsoft.DataFactory](./permissions/analytics.md#microsoftdatafactory) | Hybrid data integration at enterprise scale, made easy. | [Data Factory](/azure/data-factory/) |
> | [Microsoft.DataLakeAnalytics](./permissions/analytics.md#microsoftdatalakeanalytics) | Distributed analytics service that makes big data easy. | [Data Lake Analytics](/azure/data-lake-analytics/) |
> | [Microsoft.DataLakeStore](./permissions/analytics.md#microsoftdatalakestore) | Highly scalable and cost-effective data lake solution for big data analytics. | [Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction) |
> | [Microsoft.HDInsight](./permissions/analytics.md#microsofthdinsight) | Provision cloud Hadoop, Spark, R Server, HBase, and Storm clusters. | [HDInsight](/azure/hdinsight/) |
> | [Microsoft.Kusto](./permissions/analytics.md#microsoftkusto) | Service for storing and running interactive analytics over Big Data. | [Azure Data Explorer](/azure/data-explorer/) |
> | [Microsoft.PowerBIDedicated](./permissions/analytics.md#microsoftpowerbidedicated) | Manage Power BI Premium dedicated capacities for exclusive use by an organization. | [Power BI Embedded](/azure/power-bi-embedded/) |
> | [Microsoft.Purview](./permissions/analytics.md#microsoftpurview) |  | [Microsoft Purview](/purview/) |
> | [Microsoft.Synapse](./permissions/analytics.md#microsoftsynapse) |  | [Azure Synapse Analytics](/azure/synapse-analytics/) |

<a name='microsoftsearch'></a>

## AI + machine learning

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.BotService](./permissions/ai-machine-learning.md#microsoftbotservice) | Intelligent, serverless bot service that scales on demand. | [Azure Bot Service](/azure/bot-service/) |
> | [Microsoft.CognitiveServices](./permissions/ai-machine-learning.md#microsoftcognitiveservices) | Add smart API capabilities to enable contextual interactions. | [Cognitive Services](/azure/cognitive-services/) |
> | [Microsoft.MachineLearning](./permissions/ai-machine-learning.md#microsoftmachinelearning) | Access and manage the predictive models that you created and deployed as web services. | [Machine Learning Studio (classic)](/azure/machine-learning/classic/) |
> | [Microsoft.MachineLearningServices](./permissions/ai-machine-learning.md#microsoftmachinelearningservices) | Enterprise-grade machine learning service to build and deploy models faster. | [Machine Learning](/azure/machine-learning/) |
> | [Microsoft.Search](./permissions/ai-machine-learning.md#microsoftsearch) | Leverage search services and get comprehensive results. | [Azure AI Search](/azure/search/) |

## Internet of Things

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.Devices](./permissions/internet-of-things.md#microsoftdevices) | Ensure that your users are accessing your resources from devices that meet your standards for security and compliance. | [IoT Hub](/azure/iot-hub/)<br/>[IoT Hub Device Provisioning Service](/azure/iot-dps/) |
> | [Microsoft.DeviceUpdate](./permissions/internet-of-things.md#microsoftdeviceupdate) |  | [Device Update for IoT Hub](/azure/iot-hub-device-update/) |
> | [Microsoft.DigitalTwins](./permissions/internet-of-things.md#microsoftdigitaltwins) |  | [Azure Digital Twins](/azure/digital-twins/) |
> | [Microsoft.IoTCentral](./permissions/internet-of-things.md#microsoftiotcentral) | Experience the simplicity of SaaS for IoT, with no cloud expertise required. | [IoT Central](/azure/iot-central/) |
> | [Microsoft.IoTSecurity](./permissions/internet-of-things.md#microsoftiotsecurity) |  | [IoT security](/azure/iot/iot-security-architecture) |
> | [Microsoft.StreamAnalytics](./permissions/internet-of-things.md#microsoftstreamanalytics) | Real-time data stream processing from millions of IoT devices. | [Stream Analytics](/azure/stream-analytics/) |
> | [Microsoft.TimeSeriesInsights](./permissions/internet-of-things.md#microsofttimeseriesinsights) | Explore and analyze time-series data from IoT devices. | [Time Series Insights](/azure/time-series-insights/) |

## Mixed reality

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.MixedReality](./permissions/mixed-reality.md#microsoftmixedreality) | Blend your physical and digital worlds to create immersive, collaborative experiences. | [Azure Spatial Anchors](/azure/spatial-anchors/) |

<a name='microsoftapimanagement'></a>

## Integration

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.ApiCenter](./permissions/integration.md#microsoftapicenter) |  | [Azure API Center](/azure/api-center/overview) |
> | [Microsoft.ApiManagement](./permissions/integration.md#microsoftapimanagement) | Easily build and consume Cloud APIs. | [API Management](/azure/api-management/) |
> | [Microsoft.AppConfiguration](./permissions/integration.md#microsoftappconfiguration) | Fast, scalable parameter storage for app configuration. | [Azure App Configuration](/azure/azure-app-configuration/) |
> | [Microsoft.Communication](./permissions/integration.md#microsoftcommunication) |  | [Azure Communication Services](/azure/communication-services/overview) |
> | [Microsoft.EventGrid](./permissions/integration.md#microsofteventgrid) | Get reliable event delivery at massive scale. | [Event Grid](/azure/event-grid/) |
> | [Microsoft.EventHub](./permissions/integration.md#microsofteventhub) | Receive telemetry from millions of devices. | [Event Hubs](/azure/event-hubs/) |
> | [Microsoft.HealthcareApis](./permissions/integration.md#microsofthealthcareapis) |  | [Azure API for FHIR](/azure/healthcare-apis/azure-api-for-fhir/) |
> | [Microsoft.Logic](./permissions/integration.md#microsoftlogic) | Automate the access and use of data across clouds without writing code. | [Logic Apps](/azure/logic-apps/) |
> | [Microsoft.NotificationHubs](./permissions/integration.md#microsoftnotificationhubs) | Send push notifications to any platform from any back end. | [Notification Hubs](/azure/notification-hubs/) |
> | [Microsoft.Relay](./permissions/integration.md#microsoftrelay) | Expose services that run in your corporate network to the public cloud. | [Azure Relay](/azure/azure-relay/relay-what-is-it) |
> | [Microsoft.ServiceBus](./permissions/integration.md#microsoftservicebus) | Connect across private and public cloud environments. | [Service Bus](/azure/service-bus-messaging/) |
> | [Microsoft.ServicesHub](./permissions/integration.md#microsoftserviceshub) |  | [Services Hub](/services-hub/) |

## Identity

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.AAD](./permissions/identity.md#microsoftaad) | Join Azure virtual machines to a domain without domain controllers. | [Microsoft Entra Domain Services](/entra/identity/domain-services/) |
> | [microsoft.aadiam](./permissions/identity.md#microsoftaadiam) |  |  |
> | [Microsoft.ADHybridHealthService](./permissions/identity.md#microsoftadhybridhealthservice) | Robust monitoring of your on-premises identity infrastructure. | [Microsoft Entra ID](/entra/identity/) |
> | [Microsoft.AzureActiveDirectory](./permissions/identity.md#microsoftazureactivedirectory) | Synchronize on-premises directories and enable single sign-on. | [Azure Active Directory B2C](/azure/active-directory-b2c/) |
> | [Microsoft.ManagedIdentity](./permissions/identity.md#microsoftmanagedidentity) | An automatically managed identity in Microsoft Entra ID that authenticates to any service that supports Microsoft Entra | [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/) |

<a name='microsoftsecurityinsights'></a>

## Security

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.AppComplianceAutomation](./permissions/security.md#microsoftappcomplianceautomation) |  | [App Compliance Automation Tool for Microsoft 365](/microsoft-365-app-certification/docs/acat-overview) |
> | [Microsoft.DataProtection](./permissions/security.md#microsoftdataprotection) |  | Data Protection |
> | [Microsoft.KeyVault](./permissions/security.md#microsoftkeyvault) | Safeguard and maintain control of keys and other secrets. | [Key Vault](/azure/key-vault/) |
> | [Microsoft.Security](./permissions/security.md#microsoftsecurity) | Protect your enterprise from advanced threats across hybrid cloud workloads. | [Security Center](/azure/security-center/) |
> | [Microsoft.SecurityGraph](./permissions/security.md#microsoftsecuritygraph) |  |  |
> | [Microsoft.SecurityInsights](./permissions/security.md#microsoftsecurityinsights) |  | [Microsoft Sentinel](/azure/sentinel/) |

## DevOps

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.Chaos](./permissions/devops.md#microsoftchaos) |  | [Azure Chaos Studio](/azure/chaos-studio/) |
> | [Microsoft.DevTestLab](./permissions/devops.md#microsoftdevtestlab) | Quickly create environments using reusable templates and artifacts. | [Azure Lab Services](/azure/lab-services/) |
> | [Microsoft.LabServices](./permissions/devops.md#microsoftlabservices) | Set up labs for classrooms, trials, development and testing, and other scenarios. | [Azure Lab Services](/azure/lab-services/) |
> | [Microsoft.LoadTestService](./permissions/devops.md#microsoftloadtestservice) |  | [Azure Load Testing](/azure/load-testing/) |
> | [Microsoft.SecurityDevOps](./permissions/devops.md#microsoftsecuritydevops) |  | [Microsoft Defender for Cloud](/azure/defender-for-cloud/) |
> | [Microsoft.VisualStudio](./permissions/devops.md#microsoftvisualstudio) | The powerful and flexible environment for developing applications in the cloud. | [Azure DevOps](/azure/devops/) |

## Migration

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.DataBox](./permissions/migration.md#microsoftdatabox) | Move stored or in-flight data to Azure quickly and cost-effectively. | [Azure Data Box](/azure/databox/) |
> | [Microsoft.DataBoxEdge](./permissions/migration.md#microsoftdataboxedge) | Appliances and solutions for data transfer to Azure and edge compute. | [Azure Stack Edge](/azure/databox-online/azure-stack-edge-overview) |
> | [Microsoft.DataMigration](./permissions/migration.md#microsoftdatamigration) | Simplify on-premises database migration to the cloud. | [Azure Database Migration Service](/azure/dms/) |
> | [Microsoft.Migrate](./permissions/migration.md#microsoftmigrate) | Easily discover, assess, right-size, and migrate your on-premises VMs to Azure. | [Azure Migrate](/azure/migrate/migrate-services-overview) |
> | [Microsoft.OffAzure](./permissions/migration.md#microsoftoffazure) |  | [Azure Migrate](/azure/migrate/migrate-services-overview) |

<a name='microsoftoperationalinsights'></a>

## Monitor

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.AlertsManagement](./permissions/monitor.md#microsoftalertsmanagement) | Analyze all of the alerts in your Log Analytics repository. | [Azure Monitor](/azure/azure-monitor/) |
> | [Microsoft.Dashboard](./permissions/monitor.md#microsoftdashboard) |  | [Azure Managed Grafana](/azure/managed-grafana/) |
> | [Microsoft.Insights](./permissions/monitor.md#microsoftinsights) | Full observability into your applications, infrastructure, and network. | [Azure Monitor](/azure/azure-monitor/) |
> | [microsoft.monitor](./permissions/monitor.md#microsoftmonitor) |  | [Azure Monitor](/azure/azure-monitor/) |
> | [Microsoft.OperationalInsights](./permissions/monitor.md#microsoftoperationalinsights) |  | [Azure Monitor](/azure/azure-monitor/) |
> | [Microsoft.OperationsManagement](./permissions/monitor.md#microsoftoperationsmanagement) | A simplified management solution for any enterprise. | [Azure Monitor](/azure/azure-monitor/) |

<a name='microsoftauthorization'></a>
<a name='microsoftautomation'></a>
<a name='microsoftcostmanagement'></a>
<a name='microsoftpolicyinsights'></a>
<a name='microsoftresourcehealth'></a>

## Management and governance

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.Advisor](./permissions/management-and-governance.md#microsoftadvisor) | Your personalized Azure best practices recommendation engine. | [Azure Advisor](/azure/advisor/) |
> | [Microsoft.Authorization](./permissions/management-and-governance.md#microsoftauthorization) |  | [Azure Policy](/azure/governance/policy/overview)<br/>[Azure RBAC](/azure/role-based-access-control/overview)<br/>[Azure Resource Manager](/azure/azure-resource-manager/) |
> | [Microsoft.Automation](./permissions/management-and-governance.md#microsoftautomation) | Simplify cloud management with process automation. | [Automation](/azure/automation/) |
> | [Microsoft.Billing](./permissions/management-and-governance.md#microsoftbilling) | Manage your subscriptions and see usage and billing. | [Cost Management + Billing](/azure/cost-management-billing/) |
> | [Microsoft.Blueprint](./permissions/management-and-governance.md#microsoftblueprint) | Enabling quick, repeatable creation of governed environments. | [Azure Blueprints](/azure/governance/blueprints/) |
> | [Microsoft.Carbon](./permissions/management-and-governance.md#microsoftcarbon) |  | [Azure carbon optimization](/azure/carbon-optimization/overview) |
> | [Microsoft.Consumption](./permissions/management-and-governance.md#microsoftconsumption) | Programmatic access to cost and usage data for your Azure resources. | [Cost Management](/azure/cost-management-billing/) |
> | [Microsoft.CostManagement](./permissions/management-and-governance.md#microsoftcostmanagement) | Optimize what you spend on the cloud, while maximizing cloud potential. | [Cost Management](/azure/cost-management-billing/) |
> | [Microsoft.Features](./permissions/management-and-governance.md#microsoftfeatures) |  | [Azure Resource Manager](/azure/azure-resource-manager/) |
> | [Microsoft.GuestConfiguration](./permissions/management-and-governance.md#microsoftguestconfiguration) | Audit settings inside a machine using Azure Policy. | [Azure Policy](/azure/governance/policy/) |
> | [Microsoft.Intune](./permissions/management-and-governance.md#microsoftintune) | Enable your workforce to be productive on all their devices, while keeping your organization's information protected. |  |
> | [Microsoft.Maintenance](./permissions/management-and-governance.md#microsoftmaintenance) |  | [Azure Maintenance](/azure/virtual-machines/maintenance-configurations)<br/>[Azure Update Manager](/azure/update-manager/overview) |
> | [Microsoft.ManagedServices](./permissions/management-and-governance.md#microsoftmanagedservices) |  | [Azure Lighthouse](/azure/lighthouse/) |
> | [Microsoft.Management](./permissions/management-and-governance.md#microsoftmanagement) | Use management groups to efficiently apply governance controls and manage groups of Azure subscriptions. | [Management Groups](/azure/governance/management-groups/) |
> | [Microsoft.PolicyInsights](./permissions/management-and-governance.md#microsoftpolicyinsights) | Summarize policy states for the subscription level policy definition. | [Azure Policy](/azure/governance/policy/) |
> | [Microsoft.Portal](./permissions/management-and-governance.md#microsoftportal) | Build, manage, and monitor all Azure products in a single, unified console. | [Azure portal](/azure/azure-portal/) |
> | [Microsoft.RecoveryServices](./permissions/management-and-governance.md#microsoftrecoveryservices) | Hold and organize backup data for various Azure services such as IaaS VMs (Linux or Windows) and Azure SQL databases. | [Site Recovery](/azure/site-recovery/) |
> | [Microsoft.ResourceGraph](./permissions/management-and-governance.md#microsoftresourcegraph) | Powerful tool to query, explore, and analyze your cloud resources at scale. | [Azure Resource Graph](/azure/governance/resource-graph/) |
> | [Microsoft.ResourceHealth](./permissions/management-and-governance.md#microsoftresourcehealth) | Diagnose and get support for service problems that affect your Azure resources. | [Azure Service Health](/azure/service-health/) |
> | [Microsoft.Resources](./permissions/management-and-governance.md#microsoftresources) | Deployment and management service for Azure that enables you to create, update, and delete resources in your Azure subscription. | [Azure Resource Manager](/azure/azure-resource-manager/) |
> | [Microsoft.Solutions](./permissions/management-and-governance.md#microsoftsolutions) | Find the solution to meet the needs of your application or business. | [Azure Managed Applications](/azure/azure-resource-manager/managed-applications/) |

<a name='microsoftkubernetes'></a>

## Hybrid + multicloud

> [!div class="mx-tableFixed"]
> | Resource provider | Description | Azure service |
> | --- | --- | --- |
> | [Microsoft.AzureStack](./permissions/hybrid-multicloud.md#microsoftazurestack) | Build and run innovative hybrid applications across cloud boundaries. | [Azure Stack](/azure-stack/) |
> | [Microsoft.AzureStackHCI](./permissions/hybrid-multicloud.md#microsoftazurestackhci) |  | [Azure Stack HCI](/azure-stack/hci/) |
> | [Microsoft.ExtendedLocation](./permissions/hybrid-multicloud.md#microsoftextendedlocation) |  | [Custom locations](/azure/azure-arc/platform/conceptual-custom-locations) |
> | [Microsoft.HybridCompute](./permissions/hybrid-multicloud.md#microsofthybridcompute) |  | [Azure Arc](/azure/azure-arc/) |
> | [Microsoft.HybridConnectivity](./permissions/hybrid-multicloud.md#microsofthybridconnectivity) |  |  |
> | [Microsoft.HybridContainerService](./permissions/hybrid-multicloud.md#microsofthybridcontainerservice) |  |  |
> | [Microsoft.Kubernetes](./permissions/hybrid-multicloud.md#microsoftkubernetes) |  | [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview) |
> | [Microsoft.KubernetesConfiguration](./permissions/hybrid-multicloud.md#microsoftkubernetesconfiguration) |  | [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview) |
> | [Microsoft.ResourceConnector](./permissions/hybrid-multicloud.md#microsoftresourceconnector) |  |  |

## Next steps

- [Match resource provider to service](/azure/azure-resource-manager/management/azure-services-resource-providers)
- [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
- [Cloud Adoption Framework: Resource access management in Azure](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management)
