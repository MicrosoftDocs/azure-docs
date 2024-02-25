---
title: Azure permissions - Azure RBAC
description: Lists the permissions for Azure resource providers.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 02/07/2024
ms.custom: generated
---

# Azure permissions

This article lists the permissions for Azure resource providers, which are used in built-in roles. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. The permissions are always evolving. To get the latest permissions, use [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list).

Click the resource provider name in the following list to see the list of permissions.

<a name='microsoftresourcehealth'></a>
<a name='microsoftsupport'></a>

## General

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.Addons](./permissions/general.md#microsoftaddons) |  |
> | [Microsoft.Marketplace](./permissions/general.md#microsoftmarketplace) |  |
> | [Microsoft.MarketplaceOrdering](./permissions/general.md#microsoftmarketplaceordering) |  |
> | [Microsoft.Quota](./permissions/general.md#microsoftquota) |  |
> | [Microsoft.ResourceHealth](./permissions/general.md#microsoftresourcehealth) | Diagnose and get support for service problems that affect your Azure resources. |
> | [Microsoft.Support](./permissions/general.md#microsoftsupport) |  |

## Compute

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [microsoft.app](./permissions/compute.md#microsoftapp) |  |
> | [Microsoft.ClassicCompute](./permissions/compute.md#microsoftclassiccompute) |  |
> | [Microsoft.Compute](./permissions/compute.md#microsoftcompute) | Access cloud compute capacity and scale on demand (such as virtual machines) and only pay for the resources you use. |
> | [Microsoft.DesktopVirtualization](./permissions/compute.md#microsoftdesktopvirtualization) | The best virtual desktop experience, delivered on Azure. |
> | [Microsoft.ServiceFabric](./permissions/compute.md#microsoftservicefabric) | Develop microservices and orchestrate containers on Windows or Linux. |

<a name='microsoftnetwork'></a>

## Networking

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.Cdn](./permissions/networking.md#microsoftcdn) | Ensure secure, reliable content delivery with broad global reach. |
> | [Microsoft.ClassicNetwork](./permissions/networking.md#microsoftclassicnetwork) |  |
> | [Microsoft.MobileNetwork](./permissions/networking.md#microsoftmobilenetwork) |  |
> | [Microsoft.Network](./permissions/networking.md#microsoftnetwork) | Connect cloud and on-premises infrastructure and services to provide your customers and users the best possible experience. |

<a name='microsoftdatashare'></a>
<a name='microsoftelasticsan'></a>
<a name='microsoftnetapp'></a>
<a name='microsoftstorage'></a>

## Storage

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.ClassicStorage](./permissions/storage.md#microsoftclassicstorage) |  |
> | [Microsoft.DataBox](./permissions/storage.md#microsoftdatabox) | Move stored or in-flight data to Azure quickly and cost-effectively. |
> | [Microsoft.DataShare](./permissions/storage.md#microsoftdatashare) | A simple and safe service for sharing big data with external organizations. |
> | [Microsoft.ElasticSan](./permissions/storage.md#microsoftelasticsan) |  |
> | [Microsoft.NetApp](./permissions/storage.md#microsoftnetapp) | Enterprise-grade Azure file shares, powered by NetApp. |
> | [Microsoft.Storage](./permissions/storage.md#microsoftstorage) | Get secure, massively scalable cloud storage for your data, apps, and workloads. |
> | [Microsoft.StorageCache](./permissions/storage.md#microsoftstoragecache) | File caching for high-performance computing (HPC). |
> | [Microsoft.StorageSync](./permissions/storage.md#microsoftstoragesync) |  |

<a name='microsoftsearch'></a>
<a name='microsoftweb'></a>

## Web and Mobile

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.AppPlatform](./permissions/web-and-mobile.md#microsoftappplatform) | A fully managed Spring Cloud service, built and operated with Pivotal. |
> | [Microsoft.CertificateRegistration](./permissions/web-and-mobile.md#microsoftcertificateregistration) | Allow an application to use its own credentials for authentication. |
> | [Microsoft.Communication](./permissions/web-and-mobile.md#microsoftcommunication) |  |
> | [Microsoft.DomainRegistration](./permissions/web-and-mobile.md#microsoftdomainregistration) |  |
> | [Microsoft.Maps](./permissions/web-and-mobile.md#microsoftmaps) | Simple and secure location APIs provide geospatial context to data. |
> | [Microsoft.Media](./permissions/web-and-mobile.md#microsoftmedia) | Encode, store, and stream video and audio at scale. |
> | [Microsoft.Search](./permissions/web-and-mobile.md#microsoftsearch) | Leverage search services and get comprehensive results. |
> | [Microsoft.SignalRService](./permissions/web-and-mobile.md#microsoftsignalrservice) | Add real-time web functionalities easily. |
> | [microsoft.web](./permissions/web-and-mobile.md#microsoftweb) | Quickly create and deploy mission critical web apps at scale. |

<a name='microsoftcontainerinstance'></a>
<a name='microsoftcontainerregistry'></a>
<a name='microsoftcontainerservice'></a>
<a name='microsoftkubernetes'></a>

## Containers

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.ContainerInstance](./permissions/containers.md#microsoftcontainerinstance) | Easily run containers on Azure without managing servers. |
> | [Microsoft.ContainerRegistry](./permissions/containers.md#microsoftcontainerregistry) | Store and manage container images across all types of Azure deployments. |
> | [Microsoft.ContainerService](./permissions/containers.md#microsoftcontainerservice) | Accelerate your containerized application development without compromising security. |
> | [Microsoft.Kubernetes](./permissions/containers.md#microsoftkubernetes) |  |
> | [Microsoft.KubernetesConfiguration](./permissions/containers.md#microsoftkubernetesconfiguration) |  |
> | [Microsoft.RedHatOpenShift](./permissions/containers.md#microsoftredhatopenshift) |  |

<a name='microsoftdatafactory'></a>
<a name='microsoftdocumentdb'></a>

## Databases

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.Cache](./permissions/databases.md#microsoftcache) | Power applications with high-throughput, low-latency data access. |
> | [Microsoft.DataFactory](./permissions/databases.md#microsoftdatafactory) | Hybrid data integration at enterprise scale, made easy. |
> | [Microsoft.DataMigration](./permissions/databases.md#microsoftdatamigration) | Simplify on-premises database migration to the cloud. |
> | [Microsoft.DBforMariaDB](./permissions/databases.md#microsoftdbformariadb) | Managed MariaDB database service for app developers. |
> | [Microsoft.DBforMySQL](./permissions/databases.md#microsoftdbformysql) | Managed MySQL database service for app developers. |
> | [Microsoft.DBforPostgreSQL](./permissions/databases.md#microsoftdbforpostgresql) | Managed PostgreSQL database service for app developers. |
> | [Microsoft.DocumentDB](./permissions/databases.md#microsoftdocumentdb) | A NoSQL document database-as-a-service. |
> | [Microsoft.Sql](./permissions/databases.md#microsoftsql) | Managed, intelligent SQL in the cloud. |
> | [Microsoft.SqlVirtualMachine](./permissions/databases.md#microsoftsqlvirtualmachine) | Host enterprise SQL Server apps in the cloud. |

## Analytics

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.AnalysisServices](./permissions/analytics.md#microsoftanalysisservices) | Enterprise-grade analytics engine as a service. |
> | [Microsoft.Databricks](./permissions/analytics.md#microsoftdatabricks) | Fast, easy, and collaborative Apache Spark-based analytics platform. |
> | [Microsoft.DataLakeAnalytics](./permissions/analytics.md#microsoftdatalakeanalytics) | Distributed analytics service that makes big data easy. |
> | [Microsoft.DataLakeStore](./permissions/analytics.md#microsoftdatalakestore) | Highly scalable and cost-effective data lake solution for big data analytics. |
> | [Microsoft.EventHub](./permissions/analytics.md#microsofteventhub) | Receive telemetry from millions of devices. |
> | [Microsoft.HDInsight](./permissions/analytics.md#microsofthdinsight) | Provision cloud Hadoop, Spark, R Server, HBase, and Storm clusters. |
> | [Microsoft.Kusto](./permissions/analytics.md#microsoftkusto) | Service for storing and running interactive analytics over Big Data. |
> | [Microsoft.PowerBIDedicated](./permissions/analytics.md#microsoftpowerbidedicated) | Manage Power BI Premium dedicated capacities for exclusive use by an organization. |
> | [Microsoft.StreamAnalytics](./permissions/analytics.md#microsoftstreamanalytics) | Real-time data stream processing from millions of IoT devices. |
> | [Microsoft.Synapse](./permissions/analytics.md#microsoftsynapse) |  |

## AI + machine learning

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.BotService](./permissions/ai-machine-learning.md#microsoftbotservice) | Intelligent, serverless bot service that scales on demand. |
> | [Microsoft.CognitiveServices](./permissions/ai-machine-learning.md#microsoftcognitiveservices) | Add smart API capabilities to enable contextual interactions. |
> | [Microsoft.MachineLearning](./permissions/ai-machine-learning.md#microsoftmachinelearning) | Access and manage the predictive models that you created and deployed as web services. |
> | [Microsoft.MachineLearningServices](./permissions/ai-machine-learning.md#microsoftmachinelearningservices) | Enterprise-grade machine learning service to build and deploy models faster. |

## Internet of Things

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.DataBoxEdge](./permissions/internet-of-things.md#microsoftdataboxedge) | Appliances and solutions for data transfer to Azure and edge compute. |
> | [Microsoft.Devices](./permissions/internet-of-things.md#microsoftdevices) | Ensure that your users are accessing your resources from devices that meet your standards for security and compliance. |
> | [Microsoft.DeviceUpdate](./permissions/internet-of-things.md#microsoftdeviceupdate) |  |
> | [Microsoft.DigitalTwins](./permissions/internet-of-things.md#microsoftdigitaltwins) |  |
> | [Microsoft.IoTCentral](./permissions/internet-of-things.md#microsoftiotcentral) | Experience the simplicity of SaaS for IoT, with no cloud expertise required. |
> | [Microsoft.IoTSecurity](./permissions/internet-of-things.md#microsoftiotsecurity) |  |
> | [Microsoft.NotificationHubs](./permissions/internet-of-things.md#microsoftnotificationhubs) | Send push notifications to any platform from any back end. |
> | [Microsoft.TimeSeriesInsights](./permissions/internet-of-things.md#microsofttimeseriesinsights) | Explore and analyze time-series data from IoT devices. |

## Mixed reality

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.MixedReality](./permissions/mixed-reality.md#microsoftmixedreality) | Blend your physical and digital worlds to create immersive, collaborative experiences. |

<a name='microsoftapimanagement'></a>

## Integration

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](./permissions/integration.md#microsoftapimanagement) | Easily build and consume Cloud APIs. |
> | [Microsoft.AppConfiguration](./permissions/integration.md#microsoftappconfiguration) | Fast, scalable parameter storage for app configuration. |
> | [Microsoft.AVS](./permissions/integration.md#microsoftavs) |  |
> | [Microsoft.DataCatalog](./permissions/integration.md#microsoftdatacatalog) | Get more value from your enterprise data assets. |
> | [Microsoft.EventGrid](./permissions/integration.md#microsofteventgrid) | Get reliable event delivery at massive scale. |
> | [Microsoft.HealthcareApis](./permissions/integration.md#microsofthealthcareapis) |  |
> | [Microsoft.Logic](./permissions/integration.md#microsoftlogic) | Automate the access and use of data across clouds without writing code. |
> | [Microsoft.Relay](./permissions/integration.md#microsoftrelay) | Expose services that run in your corporate network to the public cloud. |
> | [Microsoft.ServiceBus](./permissions/integration.md#microsoftservicebus) | Connect across private and public cloud environments. |
> | [Microsoft.ServicesHub](./permissions/integration.md#microsoftserviceshub) |  |

## Identity

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.AAD](./permissions/identity.md#microsoftaad) | Join Azure virtual machines to a domain without domain controllers. |
> | [microsoft.aadiam](./permissions/identity.md#microsoftaadiam) |  |
> | [Microsoft.ADHybridHealthService](./permissions/identity.md#microsoftadhybridhealthservice) | Robust monitoring of your on-premises identity infrastructure. |
> | [Microsoft.AzureActiveDirectory](./permissions/identity.md#microsoftazureactivedirectory) | Synchronize on-premises directories and enable single sign-on. |
> | [Microsoft.ManagedIdentity](./permissions/identity.md#microsoftmanagedidentity) | An automatically managed identity in Microsoft Entra ID that authenticates to any service that supports Microsoft Entra |

<a name='microsoftsecurityinsights'></a>

## Security

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.AppComplianceAutomation](./permissions/security.md#microsoftappcomplianceautomation) |  |
> | [Microsoft.KeyVault](./permissions/security.md#microsoftkeyvault) | Safeguard and maintain control of keys and other secrets. |
> | [Microsoft.Security](./permissions/security.md#microsoftsecurity) | Protect your enterprise from advanced threats across hybrid cloud workloads. |
> | [Microsoft.SecurityGraph](./permissions/security.md#microsoftsecuritygraph) |  |
> | [Microsoft.SecurityInsights](./permissions/security.md#microsoftsecurityinsights) |  |

## DevOps

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.Chaos](./permissions/devops.md#microsoftchaos) |  |
> | [Microsoft.DevTestLab](./permissions/devops.md#microsoftdevtestlab) | Quickly create environments using reusable templates and artifacts. |
> | [Microsoft.LabServices](./permissions/devops.md#microsoftlabservices) | Set up labs for classrooms, trials, development and testing, and other scenarios. |
> | [Microsoft.LoadTestService](./permissions/devops.md#microsoftloadtestservice) |  |
> | [Microsoft.SecurityDevOps](./permissions/devops.md#microsoftsecuritydevops) |  |
> | [Microsoft.VisualStudio](./permissions/devops.md#microsoftvisualstudio) | The powerful and flexible environment for developing applications in the cloud. |

## Migration

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.Migrate](./permissions/migration.md#microsoftmigrate) | Easily discover, assess, right-size, and migrate your on-premises VMs to Azure. |
> | [Microsoft.OffAzure](./permissions/migration.md#microsoftoffazure) |  |

<a name='microsoftoperationalinsights'></a>

## Monitor

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.AlertsManagement](./permissions/monitor.md#microsoftalertsmanagement) | Analyze all of the alerts in your Log Analytics repository. |
> | [Microsoft.Dashboard](./permissions/monitor.md#microsoftdashboard) |  |
> | [Microsoft.Insights](./permissions/monitor.md#microsoftinsights) | Full observability into your applications, infrastructure, and network. |
> | [Microsoft.Monitor](./permissions/monitor.md#microsoftmonitor) |  |
> | [Microsoft.OperationalInsights](./permissions/monitor.md#microsoftoperationalinsights) |  |
> | [Microsoft.OperationsManagement](./permissions/monitor.md#microsoftoperationsmanagement) | A simplified management solution for any enterprise. |

<a name='microsoftauthorization'></a>
<a name='microsoftautomation'></a>
<a name='microsoftcostmanagement'></a>
<a name='microsoftpolicyinsights'></a>

## Management and governance

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.Advisor](./permissions/management-and-governance.md#microsoftadvisor) | Your personalized Azure best practices recommendation engine. |
> | [Microsoft.Authorization](./permissions/management-and-governance.md#microsoftauthorization) |  |
> | [Microsoft.Automation](./permissions/management-and-governance.md#microsoftautomation) | Simplify cloud management with process automation. |
> | [Microsoft.Batch](./permissions/management-and-governance.md#microsoftbatch) | Cloud-scale job scheduling and compute management. |
> | [Microsoft.Billing](./permissions/management-and-governance.md#microsoftbilling) | Manage your subscriptions and see usage and billing. |
> | [Microsoft.Blueprint](./permissions/management-and-governance.md#microsoftblueprint) | Enabling quick, repeatable creation of governed environments. |
> | [Microsoft.Capacity](./permissions/management-and-governance.md#microsoftcapacity) |  |
> | [Microsoft.Commerce](./permissions/management-and-governance.md#microsoftcommerce) |  |
> | [Microsoft.Consumption](./permissions/management-and-governance.md#microsoftconsumption) | Programmatic access to cost and usage data for your Azure resources. |
> | [Microsoft.CostManagement](./permissions/management-and-governance.md#microsoftcostmanagement) | Optimize what you spend on the cloud, while maximizing cloud potential. |
> | [Microsoft.DataProtection](./permissions/management-and-governance.md#microsoftdataprotection) |  |
> | [Microsoft.Features](./permissions/management-and-governance.md#microsoftfeatures) |  |
> | [Microsoft.GuestConfiguration](./permissions/management-and-governance.md#microsoftguestconfiguration) | Audit settings inside a machine using Azure Policy. |
> | [Microsoft.Intune](./permissions/management-and-governance.md#microsoftintune) | Enable your workforce to be productive on all their devices, while keeping your organization's information protected. |
> | [Microsoft.ManagedServices](./permissions/management-and-governance.md#microsoftmanagedservices) |  |
> | [Microsoft.Management](./permissions/management-and-governance.md#microsoftmanagement) | Use management groups to efficiently apply governance controls and manage groups of Azure subscriptions. |
> | [Microsoft.PolicyInsights](./permissions/management-and-governance.md#microsoftpolicyinsights) | Summarize policy states for the subscription level policy definition. |
> | [Microsoft.Portal](./permissions/management-and-governance.md#microsoftportal) | Build, manage, and monitor all Azure products in a single, unified console. |
> | [Microsoft.Purview](./permissions/management-and-governance.md#microsoftpurview) |  |
> | [Microsoft.RecoveryServices](./permissions/management-and-governance.md#microsoftrecoveryservices) | Hold and organize backup data for various Azure services such as IaaS VMs (Linux or Windows) and Azure SQL databases. |
> | [Microsoft.ResourceGraph](./permissions/management-and-governance.md#microsoftresourcegraph) | Powerful tool to query, explore, and analyze your cloud resources at scale. |
> | [Microsoft.Resources](./permissions/management-and-governance.md#microsoftresources) | Deployment and management service for Azure that enables you to create, update, and delete resources in your Azure subscription. |
> | [Microsoft.Solutions](./permissions/management-and-governance.md#microsoftsolutions) | Find the solution to meet the needs of your application or business. |
> | [Microsoft.Subscription](./permissions/management-and-governance.md#microsoftsubscription) |  |

## Hybrid + multicloud

> [!div class="mx-tableFixed"]
> | Resource provider | Description |
> | --- | --- |
> | [Microsoft.AzureStack](./permissions/hybrid-multicloud.md#microsoftazurestack) | Build and run innovative hybrid applications across cloud boundaries. |
> | [Microsoft.AzureStackHCI](./permissions/hybrid-multicloud.md#microsoftazurestackhci) |  |
> | [Microsoft.HybridCompute](./permissions/hybrid-multicloud.md#microsofthybridcompute) |  |
> | [Microsoft.HybridConnectivity](./permissions/hybrid-multicloud.md#microsofthybridconnectivity) |  |

## Next steps

- [Match resource provider to service](/azure/azure-resource-manager/management/azure-services-resource-providers)
- [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
- [Cloud Adoption Framework: Resource access management in Azure](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management)
