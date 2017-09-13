---
title: Azure Government available services | Microsoft Docs
description: Provides an overview of the available services in Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: smichelotti
manager: zakramer

ms.assetid: a453a23c-bc0f-4203-9075-0f579dea7e23
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 08/15/2017
ms.author: stemi

---
# Available services in Azure Government
Azure Government is continually expanding its services. These services are deployed through the same code that is used in Azure public. This section documents the services that are currently available in Azure Government, including two key types of information:

* **Variations**: Variations due to features that are not deployed yet or properties (for example, URLs) that are unique to the government environment.  
* **Considerations**: Government-specific implementation detail to ensure that data stays within your compliance boundary.

For the most current list of services, see the [Products available by region](https://azure.microsoft.com/regions/services/) page. 

In the following tables, services that are specified as Azure Resource Manager enabled have resource providers and can be managed through PowerShell. For detailed information on Resource Manager providers, API versions, and schemas, see [Resource providers and types](../azure-resource-manager/resource-manager-supported-services.md). 

> [!NOTE]
> Services that are specified as available in the "Portal" column can be managed in the [Azure Government portal](https://portal.azure.us/). 
>
>

## [Compute](documentation-government-compute.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [Virtual Machines](documentation-government-compute.md#virtual-machines) | Yes | Yes |
| Batch | Yes | Yes |
| Cloud Services | Yes | Yes |
| Service Fabric | Yes | Yes |
| Virtual Machine Scale Sets | Yes | Yes |
| [Functions](documentation-government-compute.md#azure-functions) | Yes | No |

## [Networking](documentation-government-networking.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [ExpressRoute](documentation-government-networking.md#expressroute-private-connectivity) | Yes | Yes |
| Virtual Network | Yes | Yes |
| [Load Balancer](documentation-government-networking.md#support-for-load-balancer) | Yes | Yes |
| [Traffic Manager](documentation-government-networking.md#support-for-traffic-manger) | Yes | Yes |
| [VPN Gateway](documentation-government-networking.md#support-for-vpn-gateway) | Yes | Yes |
| Application Gateway | Yes | Yes |
| Network Watcher | Yes | Yes |

## [Storage](documentation-government-services-storage.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [Blob storage](documentation-government-services-storage.md#azure-storage) | Yes | Yes |
| [Table storage](documentation-government-services-storage.md#azure-storage) | Yes | Yes |
| [Queue storage](documentation-government-services-storage.md#azure-storage) | Yes | Yes |
| [File storage](documentation-government-services-storage.md#azure-storage) | Yes | Yes |
| [Disk storage](documentation-government-services-storage.md#azure-storage) | Yes | Yes |
| [StorSimple](documentation-government-services-storage.md) | Yes | Yes |
| [Import/Export](documentation-government-services-storage.md#azure-importexport) | Yes | Yes |

## [Web + Mobile](documentation-government-services-webandmobile.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [App Service: Web Apps](documentation-government-services-webandmobile.md#app-services) | Yes | Yes |
| [App Service: API Apps](documentation-government-services-webandmobile.md#app-services) | Yes | Yes |
| [App Service: Mobile Apps](documentation-government-services-webandmobile.md#app-services) | Yes | Yes |
| [Media Services](documentation-government-services-media.md) | Yes | Yes |
| API Management | Yes | Yes |

## [Databases](documentation-government-services-database.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [SQL Database](documentation-government-services-database.md#sql-database) | Yes | Yes |
| SQL Data Warehouse | Yes | Yes |
| SQL Server Stretch Database | Yes | Yes |
| [Azure Cosmos DB](documentation-government-services-database.md#azure-cosmos-db) | Yes | Yes |
| [Azure Redis Cache](documentation-government-services-database.md#azure-redis-cache) | Yes | Yes |
## [Data + Analytics](documentation-government-services-dataandanalytics.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [HDInsight](documentation-government-services-intelligenceandanalytics.md) | Yes | Yes |
| [Power BI Pro](documentation-government-services-intelligenceandanalytics.md) | No | No (Office 365 admin portal) |

## [AI + Cognitive Services](documentation-government-services-aiandcognitiveservices.md)  

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [Cognitive Services](documentation-government-services-aiandcognitiveservices.md) | Yes | No |

## [Internet of Things](documentation-government-services-iot-hub.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [IoT Hub](documentation-government-services-iot-hub.md#azure-iot-hub) | Yes | Yes |
| Event Hubs | Yes | Yes |
| Notification Hubs | No | No (go to the [Azure classic portal](https://manage.windowsazure.us/)) |

## Enterprise Integration

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| Service Bus | Yes | Yes |
| [StorSimple](documentation-government-services-storage.md) | Yes | Yes |
| SQL Server Stretch Database | Yes | Yes |

## [Security + Identity](documentation-government-services-securityandidentity.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| Azure Active Directory | Yes | Yes |
| [Key Vault](documentation-government-services-securityandidentity.md#key-vault) | Yes | Yes |
| Multi-Factory Authentication | Yes | Yes |

## [Monitoring + Management](documentation-government-services-monitoringandmanagement.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [Automation](documentation-government-services-monitoringandmanagement.md#automation) | Yes | Yes |
| [Backup](documentation-government-services-backup.md) | Yes | Yes |
| [Log Analytics](documentation-government-services-monitoringandmanagement.md#log-analytics) | Yes | Yes |
| [Site Recovery](documentation-government-services-monitoringandmanagement.md#site-recovery) | Yes | Yes |
| Scheduler | Yes | Yes |
| [Monitoring and Diagnostics](documentation-government-services-monitoringandmanagement.md#monitor) | Yes | Yes |
| Azure Portal - Classic | Yes | Yes |
| Azure Portal - Ibiza| Yes | Yes |
| Azure Resource Manager | Yes | Yes |

## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/).

