---
title: Compare Azure Government and global Azure | Microsoft Docs
description: This article compares Azure Government and global Azure.
services: azure-government
cloud: gov
documentationcenter: ''
author: dumartinmsft
manager: femila

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 5/19/2019
ms.author: dumartin

#Customer intent: As the chairman of the municipal council, I want to find out if Azure Government will meet our security and compliance requirements.
---

# Compare Azure Government and global Azure

Microsoft Azure Government uses same underlying technologies as global Azure, which includes the core components of [Infrastructure-as-a-Service (IaaS)](https://azure.microsoft.com/overview/what-is-iaas/), [Platform-as-a-Service (PaaS)](https://azure.microsoft.com/overview/what-is-paas/), and [Software-as-a-Service (SaaS)](https://azure.microsoft.com/overview/what-is-saas/). Azure Government includes Geo-Synchronous data replication, auto scaling, network, storage, data management, identity management, among other services. However, there are some key differences that developers working on applications hosted in Azure Government must be aware of. For detailed information, see [Guidance for developers](documentation-government-developer-guide.md).

As a developer, you must know how to connect to Azure Government and once you connect you will mostly have the same experience as global Azure. This document provides links to variations in each service. Service specific articles include two key types of information:

* **Variations**: Variations due to features that are not deployed yet or properties (for example, URLs) that are unique to the government environment.  
* **Considerations**: Government-specific implementation detail to ensure that data stays within your compliance boundary.

For the most current list of services, see the [Products available by region](https://azure.microsoft.com/regions/services/) page (select Azure Government region). The **services available in Azure Government** are listed by category, as well as whether they are Generally Available or available through preview.

> [!NOTE]
> The services listed below are Generally Available unless they have (Preview) next to them.

## Compute

* [Virtual Machines](documentation-government-compute.md#virtual-machines)
* [Batch](documentation-government-compute.md#batch)
* [Cloud Services](documentation-government-compute.md#cloud-services)
* [Virtual Machine Scale Sets](documentation-government-compute.md#virtual-machine-scale-sets)
* [Functions](documentation-government-compute.md#azure-functions)
* [Service Fabric](documentation-government-compute.md#service-fabric)

## Networking

* [ExpressRoute](documentation-government-networking.md#expressroute-private-connectivity)
* [Virtual Network](documentation-government-networking.md#support-for-virtual-network)
* [Load Balancer](documentation-government-networking.md#support-for-load-balancer)
* [DNS](documentation-government-networking.md#support-for-dns)
* [Traffic Manager](documentation-government-networking.md#support-for-traffic-manager)
* [VPN Gateway](documentation-government-networking.md#support-for-vpn-gateway)
* [Application Gateway](documentation-government-networking.md#support-for-application-gateway)
* [Network Watcher](documentation-government-networking.md#support-for-network-watcher)
* [Azure Firewall](documentation-government-networking.md#support-for-azure-firewall)

## Storage

* [Blob storage](documentation-government-services-storage.md#azure-storage)
* [Table storage](documentation-government-services-storage.md#azure-storage)
* [Queue storage](documentation-government-services-storage.md#azure-storage)
* [File storage](documentation-government-services-storage.md#azure-storage)
* [Disk storage](documentation-government-services-storage.md#azure-storage)
* [StorSimple](documentation-government-services-storage.md)
* [Import/Export](documentation-government-services-storage.md#azure-importexport)

## Web + Mobile

* [App Service: Web Apps](documentation-government-services-webandmobile.md#app-services)
* [App Service: Mobile Apps](documentation-government-services-webandmobile.md#app-services)
* [API Management](documentation-government-services-webandmobile.md#api-management)
* [Media Services](documentation-government-services-media.md)

## Databases

* [SQL Database](documentation-government-services-database.md#sql-database)
* [SQL Data Warehouse](documentation-government-services-database.md#sql-data-warehouse)
* [SQL Server Stretch Database](documentation-government-services-database.md#sql-server-stretch-database)
* [Azure Cosmos DB](documentation-government-services-database.md#azure-cosmos-db)
* [Azure Cache for Redis](documentation-government-services-database.md#azure-cache-for-redis)

## Data + Analytics

* [HDInsight](documentation-government-services-dataandanalytics.md#hdinsight)
* [Azure Analysis Services](documentation-government-services-dataandanalytics.md#azure-analysis-services)
* [Power BI Pro](documentation-government-services-dataandanalytics.md#power-bi) (This service can be accessed through PowerShell and CLI, but not yet available through the [Azure Government portal](https://portal.azure.us).)

## AI + Cognitive Services

* [Cognitive Services](documentation-government-services-aiandcognitiveservices.md)

## Internet of Things

* [IoT Hub](documentation-government-services-iot-hub.md#azure-iot-hub)
* [Azure Event Hubs](documentation-government-services-iot-hub.md#azure-event-hubs)
* [Azure Notification Hubs](documentation-government-services-iot-hub.md#azure-notification-hubs) (This service can be accessed through PowerShell and CLI, but not yet available through the [Azure Government portal](https://portal.azure.us)).

## Enterprise Integration

* [Logic Apps](documentation-government-services-integration.md#logic-apps)
* [Service Bus](documentation-government-networking.md#support-for-service-bus)
* [StorSimple](documentation-government-services-storage.md)
* [SQL Server Stretch Database](documentation-government-services-database.md#sql-server-stretch-database)

## Security + Identity

* [Azure Security Center](documentation-government-services-securityandidentity.md#azure-security-center)
* [Azure Active Directory](documentation-government-services-securityandidentity.md#azure-active-directory)
* [Azure Active Directory Premium](documentation-government-services-securityandidentity.md#azure-active-directory-premium-p1-and-p2)
* [Key Vault](documentation-government-services-securityandidentity.md#key-vault)
* [Azure Multi-Factor Authentication](documentation-government-services-securityandidentity.md#azure-multi-factor-authentication)

## Monitoring + Management

* [Advisor](documentation-government-services-monitoringandmanagement.md#advisor)
* [Automation](documentation-government-services-monitoringandmanagement.md#automation)
* [Backup](documentation-government-services-backup.md)
* [Policy](documentation-government-services-monitoringandmanagement.md#policy)
* [Azure Monitor logs](documentation-government-services-monitoringandmanagement.md#azure-monitor-logs)
* [Site Recovery](documentation-government-services-monitoringandmanagement.md#site-recovery)
* [Scheduler](documentation-government-services-monitoringandmanagement.md#scheduler)
* [Monitoring and Diagnostics](documentation-government-services-monitoringandmanagement.md#monitor)
* [Azure Portal](documentation-government-services-monitoringandmanagement.md#azure-portal)
* [Azure Resource Manager](documentation-government-services-monitoringandmanagement.md#azure-resource-manager)
* [Azure Migrate](documentation-government-services-monitoringandmanagement.md#azure-migrate)

## Developer tools

* [DevTest Labs](documentation-government-services-devtools.md#devtest-labs)

## Next steps

Learn more about Azure Government:

* [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)

Start using Azure Government:

* [Guidance for developers](documentation-government-developer-guide.md)
* [Connect with the Azure Government portal](documentation-government-get-started-connect-with-portal.md)
