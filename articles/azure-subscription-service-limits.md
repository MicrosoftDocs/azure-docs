---
title: Azure subscription limits and quotas
description: Provides a list of common Azure subscription and service limits, quotas, and constraints. This includes information on how to increase limits along with maximum values.
services: multiple
author: rothja
manager: jeffreyg
tags: billing
ms.assetid: 60d848f9-ff26-496e-a5ec-ccf92ad7d125
ms.service: billing
ms.topic: article
ms.date: 09/11/2018
ms.author: byvinyal

---
# Azure subscription and service limits, quotas, and constraints
This document lists some of the most common Microsoft Azure limits, which are also sometimes called quotas. This document doesn't currently cover all Azure services. Over time, the list will be expanded and updated to cover more of the platform.

Please visit [Azure Pricing Overview](https://azure.microsoft.com/pricing/) to learn more about Azure pricing. There, you can estimate your costs using the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) or by visiting the pricing details page for a service (for example, [Windows VMs](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows)). For tips to help manage your costs, see [Prevent unexpected costs with Azure billing and cost management](billing/billing-getting-started.md).

> [!NOTE]
> If you want to raise the limit or quota above the **Default Limit**, [open an online customer support request at no charge](azure-resource-manager/resource-manager-quota-errors.md). The limits can't be raised above the **Maximum Limit** value shown in the following tables. If there is no **Maximum Limit** column, then the resource doesn't have adjustable limits.
>
> [Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) are not eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade Azure Free Trial to Pay-As-You-Go](billing/billing-upgrade-azure-subscription.md) and  [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).
>

## Limits and the Azure Resource Manager
It is now possible to combine multiple Azure resources in to a single Azure Resource Group. When using Resource Groups, limits that once were global become managed at a regional level with the Azure Resource Manager. For more information about Azure Resource Groups, see [Azure Resource Manager overview](azure-resource-manager/resource-group-overview.md).

In the limits below, a new table has been added to reflect any differences in limits when using the Azure Resource Manager. For example, there is a **Subscription Limits** table and a **Subscription Limits - Azure Resource Manager** table. When a limit applies to both scenarios, it is only shown in the first table. Unless otherwise indicated, limits are global across all regions.

> [!NOTE]
> It is important to emphasize that quotas for resources in Azure Resource Groups are per-region accessible by your subscription, and are not per-subscription, as the service management quotas are. Let's use vCPU quotas as an example. If you need to request a quota increase with support for vCPUs, you need to decide how many vCPUs you want to use in which regions, and then make a specific request for Azure Resource Group vCPU quotas for the amounts and regions that you want. Therefore, if you need to use 30 vCPUs in West Europe to run your application there, you should specifically request 30 vCPUs in West Europe. But you will not have a vCPU quota increase in any other region -- only West Europe will have the 30-vCPU quota.
> <!-- -->
> As a result, you may find it useful to consider deciding what your Azure Resource Group quotas need to be for your workload in any one region, and request that amount in each region into which you are considering deployment. See [troubleshooting deployment issues](resource-manager-common-deployment-errors.md) for more help discovering your current quotas for specific regions.
>
>

## Service-specific limits
* [Active Directory](#active-directory-limits)
* [API Management](#api-management-limits)
* [App Service](#app-service-limits)
* [Application Gateway](#application-gateway-limits)
* [Application Insights](#application-insights-limits)
* [Automation](#automation-limits)
* [Azure Cosmos DB](#azure-cosmos-db-limits)
* [Azure Database for MySQL](#azure-database-for-mysql)
* [Azure Database for PostgreSQL](#azure-database-for-postgresql)
* [Azure Event Grid](#azure-event-grid-limits)
* [Azure Maps](#azure-maps-limits)
* [Azure Monitor](#monitor-limits)
* [Azure Policy](#azure-policy-limits)
* [Azure Redis Cache](#azure-redis-cache-limits)
* [Backup](#backup-limits)
* [Batch](#batch-limits)
* [Batch AI](#batch-ai-limits)
* [BizTalk Services](#biztalk-services-limits)
* [CDN](#cdn-limits)
* [Cloud Services](#cloud-services-limits)
* [Container Instances](#container-instances-limits)
* [Container Registry](#container-registry-limits)
* [Kubernetes Service](#kubernetes-service-limits)
* [Data Factory](#data-factory-limits)
* [Data Lake Analytics](#data-lake-analytics-limits)
* [Data Lake Store](#data-lake-store-limits)
* [Database Migration Service](#database-migration-service-limits)
* [DNS](#dns-limits)
* [Event Hubs](#event-hubs-limits)
* [Azure Firewall](#azure-firewall-limits)
* [Front Door](#azure-front-door-service-limits)
* [IoT Hub](#iot-hub-limits)
* [IoT Hub Device Provisioning Service](#iot-hub-device-provisioning-service-limits)
* [Key Vault](#key-vault-limits)
* [Log Analytics](#log-analytics-limits)
* [Managed Identity](#managed-identity-limits)
* [Media Services](#media-services-limits)
* [Mobile Engagement](#mobile-engagement-limits)
* [Mobile Services](#mobile-services-limits)
* [Multi-Factor Authentication](#multi-factor-authentication)
* [Networking](#networking-limits)
* [Network Watcher](#network-watcher-limits)
* [Notification Hub Service](#notification-hub-service-limits)
* [Resource Group](#resource-group-limits)
* [Role-based access control](#role-based-access-control-limits)
* [Scheduler](#scheduler-limits)
* [Search](#search-limits)
* [Service Bus](#service-bus-limits)
* [SignalR Service](#signalr-service-limits)
* [Site Recovery](#site-recovery-limits)
* [SQL Database](#sql-database-limits)
* [SQL Data Warehouse](#sql-data-warehouse-limits)
* [Storage](#storage-limits)
* [StorSimple System](#storsimple-system-limits)
* [Stream Analytics](#stream-analytics-limits)
* [Subscription](#subscription-limits)
* [Traffic Manager](#traffic-manager-limits)
* [Virtual Machines](#virtual-machines-limits)
* [Virtual Machine Scale Sets](#virtual-machine-scale-sets-limits)

### Subscription limits
#### Subscription limits - Azure Service Management (Classic Resources)
[!INCLUDE [azure-subscription-limits](../includes/azure-subscription-limits.md)]

#### Subscription limits - Azure Resource Manager
The following limits apply when using the Azure Resource Manager and Azure Resource Groups. Limits that have not changed with the Azure Resource Manager are not listed below. Please refer to the previous table for those limits.

For information about handling limits on Resource Manager requests, see [Throttling Resource Manager requests](resource-manager-request-limits.md).

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../includes/azure-subscription-limits-azure-resource-manager.md)]

### Resource Group limits
[!INCLUDE [azure-resource-groups-limits](../includes/azure-resource-groups-limits.md)]

### Virtual Machines limits
#### Virtual Machine limits
[!INCLUDE [azure-virtual-machines-limits](../includes/azure-virtual-machines-limits.md)]

#### Virtual Machines limits - Azure Resource Manager
The following limits apply when using the Azure Resource Manager and Azure Resource Groups. Limits that have not changed with the Azure Resource Manager are not listed below. Please refer to the previous table for those limits.

[!INCLUDE [azure-virtual-machines-limits-azure-resource-manager](../includes/azure-virtual-machines-limits-azure-resource-manager.md)]

### Virtual Machine Scale Sets limits
[!INCLUDE [virtual-machine-scale-sets-limits](../includes/azure-virtual-machine-scale-sets-limits.md)]

### Container Instances limits
[!INCLUDE [container-instances-limits](../includes/container-instances-limits.md)]

### Container Registry limits
The following table details the features and limits of the Basic, Standard, and Premium [service tiers](./container-registry/container-registry-skus.md).

[!INCLUDE [container-registry-limits](../includes/container-registry-limits.md)]

### Kubernetes Service limits
[!INCLUDE [container-service-limits](../includes/container-service-limits.md)]

### Networking limits
[!INCLUDE [expressroute-limits](../includes/expressroute-limits.md)]

#### Networking limits
[!INCLUDE [azure-virtual-network-limits](../includes/azure-virtual-network-limits.md)]

#### Application Gateway limits
[!INCLUDE [application-gateway-limits](../includes/application-gateway-limits.md)]

#### Network Watcher limits
[!INCLUDE [network-watcher-limits](../includes/network-watcher-limits.md)]

#### Traffic Manager limits
[!INCLUDE [traffic-manager-limits](../includes/traffic-manager-limits.md)]

#### DNS limits
[!INCLUDE [dns-limits](../includes/dns-limits.md)]

#### Azure Firewall limits
[!INCLUDE [azure-firewall-limits](../includes/firewall-limits.md)]

#### Azure Front Door Service limits
[!INCLUDE [azure-front-door-service-limits](../includes/front-door-limits.md)]

### Storage limits
<!--like # storage accts -->
[!INCLUDE [azure-storage-limits](../includes/azure-storage-limits.md)]

For additional details on storage account limits, see [Azure Storage Scalability and Performance Targets](storage/common/storage-scalability-targets.md).

#### Storage resource provider limits 

[!INCLUDE [azure-storage-limits-azure-resource-manager](../includes/azure-storage-limits-azure-resource-manager.md)]

#### Azure Blob storage limits
[!INCLUDE [storage-blob-scale-targets](../includes/storage-blob-scale-targets.md)]

#### Azure Files limits
For additional details on Azure Files limits, see [Azure Files scalability and performance targets](storage/files/storage-files-scale-targets.md).

[!INCLUDE [storage-files-scale-targets](../includes/storage-files-scale-targets.md)]

#### Azure File Sync limits
[!INCLUDE [storage-sync-files-scale-targets](../includes/storage-sync-files-scale-targets.md)]

#### Azure Queue storage limits
[!INCLUDE [storage-queues-scale-targets](../includes/storage-queues-scale-targets.md)]

#### Azure Table storage limits
[!INCLUDE [storage-tables-scale-targets](../includes/storage-tables-scale-targets.md)]

<!-- conceptual info about disk limits -- applies to unmanaged and managed -->
#### Virtual machine disk limits
[!INCLUDE [azure-storage-limits-vm-disks](../includes/azure-storage-limits-vm-disks.md)]

See [Virtual machine sizes](virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for additional details.

#### Managed virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-managed](../includes/azure-storage-limits-vm-disks-managed.md)]

#### Unmanaged virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-standard](../includes/azure-storage-limits-vm-disks-standard.md)]

[!INCLUDE [azure-storage-limits-vm-disks-premium](../includes/azure-storage-limits-vm-disks-premium.md)]

### Cloud Services limits
[!INCLUDE [azure-cloud-services-limits](../includes/azure-cloud-services-limits.md)]

### App Service limits
The following App Service limits include limits for Web Apps, Mobile Apps, and API Apps.

[!INCLUDE [azure-websites-limits](../includes/azure-websites-limits.md)]

### Scheduler limits
[!INCLUDE [scheduler-limits-table](../includes/scheduler-limits-table.md)]

### Batch limits
[!INCLUDE [azure-batch-limits](../includes/azure-batch-limits.md)]

### Batch AI limits
[!INCLUDE [azure-batch-ai-limits](../includes/azure-batch-ai-limits.md)]

### BizTalk Services limits
The following table shows the limits for Azure Biztalk Services.

[!INCLUDE [biztalk-services-service-limits](../includes/biztalk-services-service-limits.md)]

### Azure Cosmos DB limits
Azure Cosmos DB is a global scale database in which throughput and storage can be scaled to handle whatever your application requires. If you have any questions about the scale Azure Cosmos DB provides, please send email to askcosmosdb@microsoft.com.

### Azure Database for MySQL
For Azure Database for MySQL limits, see [Limitations in Azure Database for MySQL](mysql/concepts-limits.md).

### Azure Database for PostgreSQL
For Azure Database for PostgreSQL limits, see [Limitations in Azure Database for PostgreSQL](postgresql/concepts-limits.md).

### Search limits
Pricing tiers determine the capacity and limits of your search service. Tiers include:

* *Free* multi-tenant service, shared with other Azure subscribers, intended for evaluation and small development projects.
* *Basic* provides dedicated computing resources for production workloads at a smaller scale, with up to three replicas for highly available query workloads.
* *Standard (S1, S2, S3, S3 High Density)* is for larger production workloads. Multiple levels exist within the standard tier so that you can choose a resource configuration that best matches your workload profile.

**Limits per subscription**

[!INCLUDE [azure-search-limits-per-subscription](../includes/azure-search-limits-per-subscription.md)]

**Limits per search service**

[!INCLUDE [azure-search-limits-per-service](../includes/azure-search-limits-per-service.md)]

To learn more about limits on a more granular level, such as document size, queries per second, keys, requests, and responses, see [Service limits in Azure Search](search/search-limits-quotas-capacity.md).

### Media Services limits
[!INCLUDE [azure-mediaservices-limits](../includes/azure-mediaservices-limits.md)]

### CDN limits
[!INCLUDE [cdn-limits](../includes/cdn-limits.md)]

### Mobile Services limits
[!INCLUDE [mobile-services-limits](../includes/mobile-services-limits.md)]

### Monitor limits
[!INCLUDE [monitoring-limits](../includes/monitoring-limits.md)]

### Notification Hub Service limits
[!INCLUDE [notification-hub-limits](../includes/notification-hub-limits.md)]

### Event Hubs limits
[!INCLUDE [azure-servicebus-limits](../includes/event-hubs-limits.md)]

### Service Bus limits
[!INCLUDE [azure-servicebus-limits](../includes/service-bus-quotas-table.md)]

### IoT Hub limits
[!INCLUDE [azure-iothub-limits](../includes/iot-hub-limits.md)]

### IoT Hub Device Provisioning Service limits
[!INCLUDE [azure-iotdps-limits](../includes/iot-dps-limits.md)]

### Data Factory limits
[!INCLUDE [azure-data-factory-limits](../includes/azure-data-factory-limits.md)]

### Data Lake Analytics limits
[!INCLUDE [azure-data-lake-analytics-limits](../includes/azure-data-lake-analytics-limits.md)]

### Data Lake Store limits
[!INCLUDE [azure-data-lake-store-limits](../includes/azure-data-lake-store-limits.md)]

### Database Migration Service Limits
[!INCLUDE [database-migration-service-limits](../includes/database-migration-service-limits.md)]

### Stream Analytics limits
[!INCLUDE [stream-analytics-limits-table](../includes/stream-analytics-limits-table.md)]

### Active Directory limits
[!INCLUDE [AAD-service-limits](../includes/active-directory-service-limits-include.md)]

### Azure Event Grid limits
[!INCLUDE [event-grid-limits](../includes/event-grid-limits.md)]

### Azure Maps limits
[!INCLUDE [maps-limits](../includes/maps-limits.md)]

### Azure Policy limits
[!INCLUDE [policy-limits](../includes/azure-policy-limits.md)]

### StorSimple System limits
[!INCLUDE [storsimple-limits-table](../includes/storsimple-limits-table.md)]

### Log Analytics limits
[!INCLUDE [operational-insights-limits](../includes/operational-insights-limits.md)]

### Backup limits
[!INCLUDE [azure-backup-limits](../includes/azure-backup-limits.md)]

### SignalR Service limits
[!INCLUDE [signalr-service-limits](../includes/signalr-service-limits.md)]

### Site Recovery limits
[!INCLUDE [site-recovery-limits](../includes/site-recovery-limits.md)]

### Application Insights limits
[!INCLUDE [application-insights-limits](../includes/application-insights-limits.md)]

### API Management limits
[!INCLUDE [api-management-service-limits](../includes/api-management-service-limits.md)]

### Azure Redis Cache limits
[!INCLUDE [redis-cache-service-limits](../includes/redis-cache-service-limits.md)]

### Key Vault limits
[!INCLUDE [key-vault-limits](../includes/key-vault-limits.md)]

### Multi-Factor Authentication
[!INCLUDE [azure-mfa-service-limits](../includes/azure-mfa-service-limits.md)]

### Automation limits
[!INCLUDE [automation-limits](../includes/azure-automation-service-limits.md)]

### Managed Identity limits
[!INCLUDE [automation-limits](~/includes/managed-identity-limits.md)]

### Role-based access control limits
[!INCLUDE [role-based-access-control-limits](../includes/role-based-access-control-limits.md)]

### SQL Database limits
For SQL Database limits, see [SQL Database Resource Limits for single databases](sql-database/sql-database-vcore-resource-limits-single-databases.md) and [SQL Database Resource Limits for elastic pools and pooled databases](sql-database/sql-database-vcore-resource-limits-elastic-pools.md).

### SQL Data Warehouse limits
For SQL Data Warehouse limits, see [SQL Data Warehouse Resource Limits](sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md).

## See also
[Understanding Azure Limits and Increases](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)

[Virtual Machine and Cloud Service Sizes for Azure](virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Sizes for Cloud Services](cloud-services/cloud-services-sizes-specs.md)
