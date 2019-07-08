---
title: Azure subscription limits and quotas
description: Provides a list of common Azure subscription and service limits, quotas, and constraints. This article includes information on how to increase limits along with maximum values.
services: multiple
author: rothja
manager: jeffreyg
tags: billing
ms.assetid: 60d848f9-ff26-496e-a5ec-ccf92ad7d125
ms.service: billing
ms.topic: article
ms.date: 05/30/2019
ms.author: byvinyal

---
# Azure subscription and service limits, quotas, and constraints
This document lists some of the most common Microsoft Azure limits, which are also sometimes called quotas. This document doesn't currently cover all Azure services. Over time, the list will be expanded and updated to cover more services.

To learn more about Azure pricing, see [Azure pricing overview](https://azure.microsoft.com/pricing/). There, you can estimate your costs by using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/). You also can go to the pricing details page for a particular service, for example, [Windows VMs](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows). For tips to help manage your costs, see [Prevent unexpected costs with Azure billing and cost management](billing/billing-getting-started.md).

> [!NOTE]
> If you want to raise the limit or quota above the default limit, [open an online customer support request at no charge](azure-resource-manager/resource-manager-quota-errors.md). The limits can't be raised above the maximum limit value shown in the following tables. If there's no maximum limit column, the resource doesn't have adjustable limits.
>
> [Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) aren't eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade your Azure Free Trial subscription to a Pay-As-You-Go subscription](billing/billing-upgrade-azure-subscription.md) and the [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).
>

## Limits and Azure Resource Manager
It's now possible to combine multiple Azure resources into a single Azure resource group. When you use resource groups, limits that once were global become managed at a regional level with Azure Resource Manager. For more information about Azure resource groups, see [Azure Resource Manager overview](azure-resource-manager/resource-group-overview.md).

In the following list of limits, a new table reflects any differences in limits when you use Azure Resource Manager. For example, there's a **Subscription limits** table and a **Subscription limits - Azure Resource Manager** table. When a limit applies to both scenarios, it's only shown in the first table. Unless otherwise indicated, limits are global across all regions.

> [!NOTE]
> Quotas for resources in Azure resource groups are per-region accessible by your subscription, not per-subscription as the service management quotas are. Let's use vCPU quotas as an example. To request a quota increase with support for vCPUs, you must decide how many vCPUs you want to use in which regions. You then make a specific request for Azure resource group vCPU quotas for the amounts and regions that you want. If you need to use 30 vCPUs in West Europe to run your application there, you specifically request 30 vCPUs in West Europe. Your vCPU quota isn't increased in any other region--only West Europe has the 30-vCPU quota.
> <!-- -->
> As a result, decide what your Azure resource group quotas must be for your workload in any one region. Then request that amount in each region into which you want to deploy. For help in how to determine your current quotas for specific regions, see [Troubleshoot deployment issues](resource-manager-common-deployment-errors.md).
>
>

## Service-specific limits
* [Active Directory](#active-directory-limits)
* [API Management](#api-management-limits)
* [App Service](#app-service-limits)
* [Application Gateway](#application-gateway-limits)
* [Automation](#automation-limits)
* [Azure Cache for Redis](#azure-cache-for-redis-limits)
* [Azure Cloud Services](#azure-cloud-services-limits)
* [Azure Cosmos DB](#azure-cosmos-db-limits)
* [Azure Database for MySQL](#azure-database-for-mysql)
* [Azure Database for PostgreSQL](#azure-database-for-postgresql)
* [Azure DNS](#azure-dns-limits)
* [Azure Firewall](#azure-firewall-limits)
* [Azure Functions](#functions-limits)
* [Azure Kubernetes Service](#azure-kubernetes-service-limits)
* [Azure Machine Learning Service](#azure-machine-learning-service-limits)
* [Azure Maps](#azure-maps-limits)
* [Azure Monitor](#azure-monitor-limits)
* [Azure Policy](#azure-policy-limits)
* [Azure Search](#azure-search-limits)
* [Azure SignalR Service](#azure-signalr-service-limits)
* [Backup](#backup-limits)
* [Batch](#batch-limits)
* [BizTalk Services](#biztalk-services-limits)
* [Container Instances](#container-instances-limits)
* [Container Registry](#container-registry-limits)
* [Content Delivery Network](#content-delivery-network-limits)
* [Data Factory](#data-factory-limits)
* [Data Lake Analytics](#data-lake-analytics-limits)
* [Data Lake Store](#data-lake-store-limits)
* [Database Migration Service](#database-migration-service-limits)
* [Event Grid](#event-grid-limits)
* [Event Hubs](#event-hubs-limits)
* [Front Door Service](#azure-front-door-service-limits)
* [Identity Manager](#identity-manager-limits)
* [IoT Hub](#iot-hub-limits)
* [IoT Hub Device Provisioning Service](#iot-hub-device-provisioning-service-limits)
* [Key Vault](#key-vault-limits)
* [Media Services](#media-services-limits)
* [Mobile Services](#mobile-services-limits)
* [Multi-Factor Authentication](#multi-factor-authentication-limits)
* [Networking](#networking-limits)
  * [Application Gateway](#application-gateway-limits)
  * [Azure DNS](#azure-dns-limits)
  * [Azure Front Door Service](#azure-front-door-service-limits)
  * [Azure Firewall](#azure-firewall-limits)
  * [ExpressRoute](#expressroute-limits)
  * [Load Balancer](#load-balancer)
  * [Public IP address](#publicip-address)
  * [Network Watcher](#network-watcher-limits)
  * [Traffic Manager](#traffic-manager-limits)
  * [Virtual Network](#networking-limits)
* [Notification Hubs](#notification-hubs-limits)
* [Resource group](#resource-group-limits)
* [Role-based access control](#role-based-access-control-limits)
* [Scheduler](#scheduler-limits)
* [Service Bus](#service-bus-limits)
* [Site Recovery](#site-recovery-limits)
* [SQL Database](#sql-database-limits)
* [SQL Data Warehouse](#sql-data-warehouse-limits)
* [Storage](#storage-limits)
* [StorSimple System](#storsimple-system-limits)
* [Stream Analytics](#stream-analytics-limits)
* [Subscription](#subscription-limits)
* [Virtual Machines](#virtual-machines-limits)
* [Virtual machine scale sets](#virtual-machine-scale-sets-limits)

### Subscription limits
#### Subscription limits - Azure Service Management (classic deployment model)
[!INCLUDE [azure-subscription-limits](../includes/azure-subscription-limits.md)]

#### Subscription limits - Azure Resource Manager
The following limits apply when you use Azure Resource Manager and Azure resource groups. Limits that haven't changed with Azure Resource Manager aren't listed. See the previous table for those limits.

For information about Resource Manager API read and write limits, see [Throttling Resource Manager requests](resource-manager-request-limits.md).

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../includes/azure-subscription-limits-azure-resource-manager.md)]

### Resource group limits
[!INCLUDE [azure-resource-groups-limits](../includes/azure-resource-groups-limits.md)]

### Virtual Machines limits
#### Virtual Machines limits
[!INCLUDE [azure-virtual-machines-limits](../includes/azure-virtual-machines-limits.md)]

#### Virtual Machines limits - Azure Resource Manager
The following limits apply when you use Azure Resource Manager and Azure resource groups. Limits that haven't changed with Azure Resource Manager aren't listed. See the previous table for those limits.

[!INCLUDE [azure-virtual-machines-limits-azure-resource-manager](../includes/azure-virtual-machines-limits-azure-resource-manager.md)]

#### Shared Image Gallery limits

There are limits, per subscription, for deploying resources using Shared Image Galleries:
- 100 shared image galleries, per subscription, per region
- 1,000 image definitions, per subscription, per region
- 10,000 image versions, per subscription, per region

### Virtual machine scale sets limits
[!INCLUDE [virtual-machine-scale-sets-limits](../includes/azure-virtual-machine-scale-sets-limits.md)]

### Container Instances limits
[!INCLUDE [container-instances-limits](../includes/container-instances-limits.md)]

### Container Registry limits
The following table details the features and limits of the Basic, Standard, and Premium [service tiers](./container-registry/container-registry-skus.md).

[!INCLUDE [container-registry-limits](../includes/container-registry-limits.md)]

### Azure Kubernetes Service limits
[!INCLUDE [container-service-limits](../includes/container-service-limits.md)]

### Azure Machine Learning Service limits
The latest values for Azure Machine Learning Compute quotas can be found in the [Azure Machine Learning quota page](../articles/machine-learning/service/how-to-manage-quotas.md)

### Networking limits
[!INCLUDE [azure-virtual-network-limits](../includes/azure-virtual-network-limits.md)]

#### ExpressRoute limits
[!INCLUDE [expressroute-limits](../includes/expressroute-limits.md)]

#### Application Gateway limits

The following table applies to v1, v2, Standard, and WAF SKUs unless otherwise stated.
[!INCLUDE [application-gateway-limits](../includes/application-gateway-limits.md)]

#### Network Watcher limits
[!INCLUDE [network-watcher-limits](../includes/network-watcher-limits.md)]

#### Traffic Manager limits
[!INCLUDE [traffic-manager-limits](../includes/traffic-manager-limits.md)]

#### Azure DNS limits
[!INCLUDE [dns-limits](../includes/dns-limits.md)]

#### Azure Firewall limits
[!INCLUDE [azure-firewall-limits](../includes/firewall-limits.md)]

#### Azure Front Door Service limits
[!INCLUDE [azure-front-door-service-limits](../includes/front-door-limits.md)]

### Storage limits
<!--like # storage accts -->
[!INCLUDE [azure-storage-limits](../includes/azure-storage-limits.md)]

For more information on storage account limits, see [Azure Storage scalability and performance targets](storage/common/storage-scalability-targets.md).

#### Storage resource provider limits 

[!INCLUDE [azure-storage-limits-azure-resource-manager](../includes/azure-storage-limits-azure-resource-manager.md)]

#### Azure Blob storage limits
[!INCLUDE [storage-blob-scale-targets](../includes/storage-blob-scale-targets.md)]

#### Azure Files limits
For more information on Azure Files limits, see [Azure Files scalability and performance targets](storage/files/storage-files-scale-targets.md).

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

For more information, see [Virtual machine sizes](virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

#### Managed virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-managed](../includes/azure-storage-limits-vm-disks-managed.md)]

#### Unmanaged virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-standard](../includes/azure-storage-limits-vm-disks-standard.md)]

[!INCLUDE [azure-storage-limits-vm-disks-premium](../includes/azure-storage-limits-vm-disks-premium.md)]

### Azure Cloud Services limits
[!INCLUDE [azure-cloud-services-limits](../includes/azure-cloud-services-limits.md)]

### App Service limits
The following App Service limits include limits for Web Apps, Mobile Apps, and API Apps.

[!INCLUDE [azure-websites-limits](../includes/azure-websites-limits.md)]

### Functions limits
[!INCLUDE [functions-limits](../includes/functions-limits.md)]

### Scheduler limits
[!INCLUDE [scheduler-limits-table](../includes/scheduler-limits-table.md)]

### Batch limits
[!INCLUDE [azure-batch-limits](../includes/azure-batch-limits.md)]

### BizTalk Services limits
The following table shows the limits for Azure BizTalk Services.

[!INCLUDE [biztalk-services-service-limits](../includes/biztalk-services-service-limits.md)]

### Azure Cosmos DB limits
For Azure Cosmos DB limits, see [Limits in Azure Cosmos DB](cosmos-db/concepts-limits.md).

### Azure Database for MySQL
For Azure Database for MySQL limits, see [Limitations in Azure Database for MySQL](mysql/concepts-limits.md).

### Azure Database for PostgreSQL
For Azure Database for PostgreSQL limits, see [Limitations in Azure Database for PostgreSQL](postgresql/concepts-limits.md).

### Azure Search limits
Pricing tiers determine the capacity and limits of your search service. Tiers include:

* **Free** multitenant service, shared with other Azure subscribers, is intended for evaluation and small development projects.
* **Basic** provides dedicated computing resources for production workloads at a smaller scale, with up to three replicas for highly available query workloads.
* **Standard**, which includes S1, S2, S3, and S3 High Density, is for larger production workloads. Multiple levels exist within the Standard tier so that you can choose a resource configuration that best matches your workload profile.

**Limits per subscription**

[!INCLUDE [azure-search-limits-per-subscription](../includes/azure-search-limits-per-subscription.md)]

**Limits per search service**

[!INCLUDE [azure-search-limits-per-service](../includes/azure-search-limits-per-service.md)]

To learn more about limits on a more granular level, such as document size, queries per second, keys, requests, and responses, see [Service limits in Azure Search](search/search-limits-quotas-capacity.md).

### Media Services limits
[!INCLUDE [azure-mediaservices-limits](../includes/azure-mediaservices-limits.md)]

### Content Delivery Network limits
[!INCLUDE [cdn-limits](../includes/cdn-limits.md)]

### Mobile Services limits
[!INCLUDE [mobile-services-limits](../includes/mobile-services-limits.md)]

### Azure Monitor limits

#### Alerts

[!INCLUDE [monitoring-limits](../includes/azure-monitor-limits-alerts.md)]

#### Action groups

[!INCLUDE [monitoring-limits](../includes/azure-monitor-limits-action-groups.md)]

#### Log Analytics workspaces

[!INCLUDE [monitoring-limits](../includes/azure-monitor-limits-workspaces.md)]

#### Application Insights

[!INCLUDE [monitoring-limits](../includes/azure-monitor-limits-app-insights.md)]




### Notification Hubs limits
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

### Event Grid limits
[!INCLUDE [event-grid-limits](../includes/event-grid-limits.md)]

### Azure Maps limits
[!INCLUDE [maps-limits](../includes/maps-limits.md)]

### Azure Policy limits
[!INCLUDE [policy-limits](../includes/azure-policy-limits.md)]

### StorSimple System limits
[!INCLUDE [storsimple-limits-table](../includes/storsimple-limits-table.md)]

### Backup limits
[!INCLUDE [azure-backup-limits](../includes/azure-backup-limits.md)]

### Azure SignalR Service limits
[!INCLUDE [signalr-service-limits](../includes/signalr-service-limits.md)]

### Site Recovery limits
[!INCLUDE [site-recovery-limits](../includes/site-recovery-limits.md)]

### API Management limits
[!INCLUDE [api-management-service-limits](../includes/api-management-service-limits.md)]

### Azure Cache for Redis limits
[!INCLUDE [redis-cache-service-limits](../includes/redis-cache-service-limits.md)]

### Key Vault limits
[!INCLUDE [key-vault-limits](../includes/key-vault-limits.md)]

### Multi-Factor Authentication limits
[!INCLUDE [azure-mfa-service-limits](../includes/azure-mfa-service-limits.md)]

### Automation limits
[!INCLUDE [automation-limits](../includes/azure-automation-service-limits.md)]

### Identity Manager limits
[!INCLUDE [automation-limits](~/includes/managed-identity-limits.md)]

### Role-based access control limits
[!INCLUDE [role-based-access-control-limits](../includes/role-based-access-control-limits.md)]

### SQL Database limits
For SQL Database limits, see [SQL Database resource limits for single databases](sql-database/sql-database-vcore-resource-limits-single-databases.md), [SQL Database resource limits for elastic pools and pooled databases](sql-database/sql-database-vcore-resource-limits-elastic-pools.md), and [SQL Database resource limits for managed instances](sql-database/sql-database-managed-instance-resource-limits.md).

### SQL Data Warehouse limits
For SQL Data Warehouse limits, see [SQL Data Warehouse resource limits](sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md).

## See also
- [Understand Azure limits and increases](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/)
- [Virtual machine and cloud service sizes for Azure](virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Sizes for Azure Cloud Services](cloud-services/cloud-services-sizes-specs.md)
