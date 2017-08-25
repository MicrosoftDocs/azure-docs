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

In the following tables, services that are specified as Azure Resource Manager enabled have resource providers and can be managed through PowerShell. For detailed information on Resource Manager providers, API versions, and schemas, see [Resource providers and types](../azure-resource-manager/resource-manager-supported-services.md). Services that are specified as available in the portal can be managed in the [Azure Government portal](https://portal.azure.us/). 


## [Compute](documentation-government-compute.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [Virtual Machines](documentation-government-compute.md#virtual-machines) | Yes | Yes |
| Batch | Yes | Yes |
| Cloud Services | Yes | Yes |
| Service Fabric | Yes | Yes |


## [Networking](documentation-government-networking.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [ExpressRoute](documentation-government-networking.md#expressroute-private-connectivity) | Yes | Yes |
| Virtual Network | Yes | Yes |
| [Load Balancer](documentation-government-networking.md#support-for-load-balancer) | Yes | Yes |
| [Traffic Manager](documentation-government-networking.md#support-for-traffic-manger) | Yes | Yes |
| [VPN Gateway](documentation-government-networking.md#support-for-vpn-gateway) | Yes | Yes |
| Application Gateway | Yes | Yes |
| ExpressRoute | Yes | Yes |



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



## [Web and mobile](documentation-government-services-webandmobile.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [App Service: Web Apps](documentation-government-services-webandmobile.md#app-services) | Yes | Yes |
| [App Service: API Apps](documentation-government-services-webandmobile.md#app-services) | Yes | Yes |
| [App Service: Mobile Apps](documentation-government-services-webandmobile.md#app-services) | Yes | Yes |
| Media Services | Yes | Yes |


## [Databases](documentation-government-services-database.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [SQL Database](documentation-government-services-database.md#sql-database) | Yes | Yes |
| SQL Data Warehouse | Yes | Yes |
| SQL Server Stretch Database | Yes | Yes |
| [Azure Cosmos DB](documentation-government-services-database.md#azure-cosmos-db) | Yes | Yes |
| [Azure Redis Cache](documentation-government-services-database.md#azure-redis-cache) | Yes | Yes |


## [Intelligence and analytics](documentation-government-services-intelligenceandanalytics.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [HDInsight](documentation-government-services-intelligenceandanalytics.md) | Yes | Yes |
| [Power BI Pro](documentation-government-services-intelligenceandanalytics.md) | No | No (Office 365 admin portal) |


## [Internet of Things](documentation-government-services-iot-hub.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [IoT Hub](documentation-government-services-iot-hub.md#azure-iot-hub) | Yes | Yes |
| Event Hubs | Yes | Yes |
| Notification Hubs | No | No (go to the [Azure classic portal](https://manage.windowsazure.us/)) |


## Enterprise integration

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| Service Bus | Yes | Yes |
| [StorSimple](documentation-government-services-storage.md) | Yes | Yes |
| SQL Server Stretch Database | Yes | Yes |



## [Security and identity](documentation-government-services-securityandidentity.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| Azure Active Directory | Yes | Yes |
| [Key Vault](documentation-government-services-securityandidentity.md#key-vault) | Yes | No |
| Multi-Factor Authentication | Yes | Yes |


## Intelligence and analytics

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| Power BI | Yes | No |
| HDInsight | Yes | Yes |



## [Monitoring and management](documentation-government-services-monitoringandmanagement.md)

| Service | Resource Manager enabled | Portal |
| --- | --- | --- |
| [Automation](documentation-government-services-monitoringandmanagement.md#automation) | Yes | Yes |
| [Backup](documentation-government-services-backup.md) | Yes | Yes |
| [Log Analytics](documentation-government-services-monitoringandmanagement.md#log-analytics) | Yes | Yes |
| [Site Recovery](documentation-government-services-monitoringandmanagement.md#site-recovery) | Yes | Yes |
| Scheduler | Yes | No |
| Monitor and Diagnostics | Yes | Yes |




## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/).

