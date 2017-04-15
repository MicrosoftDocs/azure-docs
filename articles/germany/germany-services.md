---
title: Azure Germany available services | Microsoft Docs
description: Provides an overview of the available services in Azure Germany
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: ralfwi
---

# Available services on Azure Germany
Azure Germany is continually expanding the services that are available.  These services are deployed using the same code that is used in global Azure.  This section documents the services that are currently available on Azure Germany, including two key types of information:

* **Variations:** Variations due to features that have not been deployed yet or properties (for example, URLs) that are unique to the German environment.  
* **Considerations:** Germany-specific implementation detail to ensure data stays within your compliance boundary.

Everything else you need to know about these services can be found in their general documentation.

>[!NOTE]
> For the most current list of services, see the [Products by Region](https://azure.microsoft.com/regions/services/). 
>
>

In the following tables, services specified as Resource Manager enabled have resource providers and can be managed using PowerShell. For detailed information on Resource Manager providers, API versions, and schemas, refer to [Resource Manager supported services](../azure-resource-manager/resource-manager-supported-services.md). Services specified as available in the portal can be managed in the [Azure Germany Portal](http://portal.microsoftazure.de/). 


## [Compute](./germany-services-compute.md)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| [Virtual Machines](./germany-services-compute.md#virtual-machines) | yes | yes |
| Batch | N.N. | N.N. |
| Cloud Services | N.N. | N.N. |
| Service Fabric | N.N. | N.N. |
| VM Scale Sets | N.N. | N.N. |


## [Networking](./germany-services-networking.md)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| [ExpressRoute](./germany-services-networking.md#expressroute-private-connectivity) | yes | yes |
| Virtual Network | yes | yes |
| [Load Balancer](./germany-services-networking.md#support-for-load-balancer) | yes | yes |
| [Traffic Manager](./germany-services-networking.md#support-for-traffic-manger) | yes | yes |
| [VPN Gateway](./germany-services-networking.md#support-for-vpn-gateway) | yes | yes |
| Application Gateway | yes | yes |



## [Storage](./germany-services-storage.md)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| [Storage - Blobs](./germany-services-storage.md#azure-storage) | yes | yes |
| [Storage - Tables](./germany-services-storage.md#azure-storage) | yes | yes |
| [Storage - Queues](./germany-services-storage.md#azure-storage) | yes | yes |
| [Storage - Files](./germany-services-storage.md#azure-storage) | yes | yes |
| [Storage - Disk](./germany-services-storage.md#azure-storage) | yes | yes |
| StorSimple | no | no |
| Backup | no | no |
| Site Recovery | no | no |
| Import/Export | no | no |



## [Web and Mobile](./germany-services-webandmobile.md)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| [App Service - Web Apps](./germany-services-webandmobile.md#app-services) | yes | yes |
| [App Service - API Apps](./germany-services-webandmobile.md#app-services) | yes | yes |
| [App Service - Mobile Apps](./germany-services-webandmobile.md#app-services) | yes | yes |
| Media Services | no | no |


## [Databases](./germany-services-database.md)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| [SQL Database](./germany-services-database.md#sql-database) | yes | yes |
| SQL Data Warehouse | no | no |
| SQL Server Stretch Database | no | no |
| [Redis Cache](./germany-services-database.md#azure-redis-cache) | yes | yes |


## Intelligence and Analytics

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| HDInsights | yes | yes |
| Power BI Pro | yes | yes |


## Internet of Things (IoT)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| Event Hubs | yes | yes |
| Notification Hubs | No | No |


## Enterprise integration

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| Service Bus | N.N. | N.N. |
| StorSimple | no | no |
| SQL Server Stretch Database | N.N. | N.N. |



## [Security and identity](./germany-services-securityandidentity.md)

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| [Azure Active Directory]((./germany-services-securityandidentity.md#azure-active-directory) | yes | yes |
| [Key Vault](./germany-services-securityandidentity.md#key-vault) | yes | yes |
| Multi-Factory Authentication | yes | N.N. |



## Monitoring and management

| Service | Resource Manager Enabled | Portal |
| --- | --- | --- |
| Automation | no | no |
| Backup | no | no |
| Log Analytics | no | no |
| Site Recovery | no | no |
| Scheduler | no | no |
| Monitoring and Diagnostics | no | no |




## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/).




