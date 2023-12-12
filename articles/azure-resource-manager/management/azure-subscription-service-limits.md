---
title: Azure subscription limits and quotas
description: Provides a list of common Azure subscription and service limits, quotas, and constraints. This article includes information on how to increase limits along with maximum values.
ms.topic: conceptual
ms.date: 09/26/2023
---

# Azure subscription and service limits, quotas, and constraints

This document lists some of the most common Microsoft Azure limits, which are also sometimes called quotas.

To learn more about Azure pricing, see [Azure pricing overview](https://azure.microsoft.com/pricing/). There, you can estimate your costs by using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/). You also can go to the pricing details page for a particular service, for example, [Windows VMs](https://azure.microsoft.com/pricing/details/virtual-machines/Windows/). For tips to help manage your costs, see [Prevent unexpected costs with Azure billing and cost management](../../cost-management-billing/cost-management-billing-overview.md).

## Managing limits

> [!NOTE]
> Some services have adjustable limits.
>
> When the limit can be adjusted, the tables include **Default limit** and **Maximum limit** headers. The limit can be raised above the default limit but not above the maximum limit. Some services with adjustable limits use different headers with information about adjusting the limit.
>
> When a service doesn't have adjustable limits, the following tables use the header **Limit** without any additional information about adjusting the limit. In those cases, the default and the maximum limits are the same.
>
> If you want to raise the limit or quota above the default limit, [open an online customer support request at no charge](../templates/error-resource-quota.md).
>
> The terms *soft limit* and *hard limit* often are used informally to describe the current, adjustable limit (soft limit) and the maximum limit (hard limit). If a limit isn't adjustable, there won't be a soft limit, only a hard limit.
>

[Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) aren't eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade your Azure Free Trial subscription to a Pay-As-You-Go subscription](../../cost-management-billing/manage/upgrade-azure-subscription.md) and the [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).

Some limits are managed at a regional level.

Let's use vCPU quotas as an example. To request a quota increase with support for vCPUs, you must decide how many vCPUs you want to use in which regions. You then request an increase in vCPU quotas for the amounts and regions that you want. If you need to use 30 vCPUs in West Europe to run your application there, you specifically request 30 vCPUs in West Europe. Your vCPU quota isn't increased in any other region--only West Europe has the 30-vCPU quota.

As a result, decide what your quotas must be for your workload in any one region. Then request that amount in each region into which you want to deploy. For help in how to determine your current quotas for specific regions, see [Resolve errors for resource quotas](../templates/error-resource-quota.md).

## General limits

For limits on resource names, see [Naming rules and restrictions for Azure resources](resource-name-rules.md).

For information about Resource Manager API read and write limits, see [Throttling Resource Manager requests](request-limits-and-throttling.md).

### Management group limits

The following limits apply to [management groups](../../governance/management-groups/overview.md).

[!INCLUDE [management-group-limits](../../../includes/management-group-limits.md)]

### Subscription limits

The following limits apply when you use Azure Resource Manager and Azure resource groups.

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../../../includes/azure-subscription-limits-azure-resource-manager.md)]

### Resource group limits

[!INCLUDE [azure-resource-groups-limits](../../../includes/azure-resource-groups-limits.md)]

<a name='azure-active-directory-limits'></a>

## Microsoft Entra ID limits

[!INCLUDE [AAD-service-limits](../../../includes/active-directory-service-limits-include.md)]

## API Center (preview) limits

[!INCLUDE [api-center-service-limits](../../api-center/includes/api-center-service-limits.md)]

## API Management limits

[!INCLUDE [api-management-service-limits](../../../includes/api-management-service-limits.md)]

## App Service limits

[!INCLUDE [azure-websites-limits](../../../includes/azure-websites-limits.md)]

## Automation limits

[!INCLUDE [automation-limits](../../../includes/azure-automation-service-limits.md)]

## Azure App Configuration

[!INCLUDE [app-configuration-limits](../../../includes/app-configuration-limits.md)]

## Azure Cache for Redis limits

[!INCLUDE [redis-cache-service-limits](../../azure-cache-for-redis/includes/redis-cache-service-limits.md)]

## Azure Cloud Services limits

[!INCLUDE [azure-cloud-services-limits](../../../includes/azure-cloud-services-limits.md)]

## Azure AI Search limits

Pricing tiers determine the capacity and limits of your search service. Tiers include:

* **Free** multi-tenant service, shared with other Azure subscribers, is intended for evaluation and small development projects.
* **Basic** provides dedicated computing resources for production workloads at a smaller scale, with up to three replicas for highly available query workloads.
* **Standard**, which includes S1, S2, S3, and S3 High Density, is for larger production workloads. Multiple levels exist within the Standard tier so that you can choose a resource configuration that best matches your workload profile.

**Limits per subscription**

[!INCLUDE [azure-search-limits-per-subscription](../../../includes/azure-search-limits-per-subscription.md)]

**Limits per search service**

[!INCLUDE [azure-search-limits-per-service](../../../includes/azure-search-limits-per-service.md)]

To learn more about limits on a more granular level, such as document size, queries per second, keys, requests, and responses, see [Service limits in Azure AI Search](../../search/search-limits-quotas-capacity.md).

<a name='azure-cognitive-services-limits'></a>

## Azure AI services limits

[!INCLUDE [azure-cognitive-services-limits](../../../includes/azure-cognitive-services-limits.md)]

## Azure Communications Gateway limits

Some of the following default limits and quotas can be increased. To request a change, create a [change request](../../communications-gateway/request-changes.md) stating the limit you want to change.

[!INCLUDE [communications-gateway-general-restrictions](../../communications-gateway/includes/communications-gateway-general-restrictions.md)]

Azure Communications Gateway also has limits on the SIP signaling.

[!INCLUDE [communications-gateway-sip-size-restrictions](../../communications-gateway/includes/communications-gateway-sip-size-restrictions.md)]

[!INCLUDE [communications-gateway-sip-behavior-restrictions](../../communications-gateway/includes/communications-gateway-sip-behavior-restrictions.md)]

## Azure Container Apps limits

For Azure Container Apps limits, see [Quotas in Azure Container Apps](../../container-apps/quotas.md).

[!INCLUDE [container-apps-limits](../../../includes/container-apps/container-apps-limits.md)]

## Azure Cosmos DB limits

For Azure Cosmos DB limits, see [Limits in Azure Cosmos DB](../../cosmos-db/concepts-limits.md).

## Azure Data Explorer limits

[!INCLUDE [azure-data-explorer-limits](../../../includes/data-explorer-limits.md)]

## Azure Database for MySQL

For Azure Database for MySQL limits, see [Limitations in Azure Database for MySQL](../../mysql/concepts-limits.md).

## Azure Database for PostgreSQL

For Azure Database for PostgreSQL limits, see [Limitations in Azure Database for PostgreSQL](../../postgresql/concepts-limits.md).

## Azure Deployment Environments limits

[!INCLUDE [Deployment Environments limits](../../../includes/deployment-environments-limits.md)]

## Azure Files and Azure File Sync

To learn more about the limits for Azure Files and File Sync, see [Azure Files scalability and performance targets](../../storage/files/storage-files-scale-targets.md).

## Azure Functions limits

[!INCLUDE [functions-limits](../../../includes/functions-limits.md)]

For more information, see [Functions Hosting plans comparison](../../azure-functions/functions-scale.md).

## Azure Health Data Services

### Azure Health Data Services limits

[!INCLUDE [functions-limits](../../../includes/azure-healthcare-api-limits.md)]

### Azure API for FHIR service limits

[!INCLUDE [functions-limits](../../../includes/azure-api-for-fhir-limits.md)]

## Azure Kubernetes Service limits

[!INCLUDE [container-service-limits](../../../includes/container-service-limits.md)]

## Azure Lab Services

[!INCLUDE [azure-lab-services-limits](../../../includes/azure-lab-services-limits.md)]

## Azure Load Testing limits

For Azure Load Testing limits, see [Service limits in Azure Load Testing](../../load-testing/resource-limits-quotas-capacity.md).

## Azure Machine Learning limits

The latest values for Azure Machine Learning Compute quotas can be found in the [Azure Machine Learning quota page](../../machine-learning/how-to-manage-quotas.md)

## Azure Maps limits

[!INCLUDE [maps-limits](../../../includes/maps-limits.md)]

## Azure Monitor limits

For Azure Monitor limits, see [Azure Monitor service limits](../../azure-monitor/service-limits.md).

## Azure Data Factory limits

[!INCLUDE [azure-data-factory-limits](../../../includes/azure-data-factory-limits.md)]

## Azure NetApp Files

[!INCLUDE [netapp-limits](../../../includes/netapp-service-limits.md)]

## Azure Policy limits

[!INCLUDE [policy-limits](../../../includes/azure-policy-limits.md)]

## Azure Quantum limits

[!INCLUDE [quantum-limits](../../../includes/azure-quantum-limits.md)]

## Azure RBAC limits

The following limits apply to [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

[!INCLUDE [role-based-access-control-limits](../../../includes/role-based-access-control/limits.md)]

## Azure SignalR Service limits

[!INCLUDE [signalr-service-limits](../../../includes/signalr-service-limits.md)]

## Azure Spring Apps limits

To learn more about the limits for Azure Spring Apps, see [Quotas and service plans for Azure Spring Apps](../../spring-apps/quotas.md).

## Azure Storage limits

This section lists the following limits for Azure Storage:

- [Standard storage account limits](#standard-storage-account-limits)
- [Azure Storage resource provider limits](#azure-storage-resource-provider-limits)
- [Azure Blob Storage limits](#azure-blob-storage-limits)
- [Azure Queue storage limits](#azure-queue-storage-limits)
- [Azure Table storage limits](#azure-table-storage-limits)

### Standard storage account limits

<!--like # storage accts -->
[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

### Azure Storage resource provider limits

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

### Azure Blob Storage limits

[!INCLUDE [storage-blob-scale-targets](../../../includes/storage-blob-scale-targets.md)]

### Azure Queue storage limits

[!INCLUDE [storage-queues-scale-targets](../../../includes/storage-queues-scale-targets.md)]

### Azure Table storage limits

[!INCLUDE [storage-tables-scale-targets](../../../includes/storage-tables-scale-targets.md)]

## Azure subscription creation limits

To learn more about the creation limits for Azure subscriptions, see [Billing accounts and scopes in the Azure portal](../../cost-management-billing/manage/view-all-accounts.md).

## Azure Virtual Desktop Service limits

[!INCLUDE [azure-virtual-desktop-service-limits](../../../includes/azure-virtual-desktop-limits.md)]

## Azure VMware Solution limits

[!INCLUDE [azure-vmware-solutions-limits](../../azure-vmware/includes/azure-vmware-solutions-limits.md)]

## Backup limits

[!INCLUDE [azure-backup-limits](../../../includes/azure-backup-limits.md)]

## Batch limits

[!INCLUDE [azure-batch-limits](../../../includes/azure-batch-limits.md)]

## Classic deployment model limits

If you use classic deployment model instead of the Azure Resource Manager deployment model, the following limits apply.

[!INCLUDE [azure-subscription-limits](../../../includes/azure-subscription-limits.md)]

## Container Instances limits

[!INCLUDE [container-instances-limits](../../../includes/container-instances-limits.md)]

## Container Registry limits

The following table details the features and limits of the Basic, Standard, and Premium [service tiers](../../container-registry/container-registry-skus.md).

[!INCLUDE [container-registry-limits](../../../includes/container-registry-limits.md)]

## Content Delivery Network limits

[!INCLUDE [cdn-limits](../../../includes/cdn-limits.md)]


## Data Lake Analytics limits

[!INCLUDE [azure-data-lake-analytics-limits](../../../includes/azure-data-lake-analytics-limits.md)]

## Data Factory limits

[!INCLUDE [azure-data-factory-limits](../../../includes/azure-data-factory-limits.md)]

## Data Lake Storage limits

[!INCLUDE [azure-data-lake-store-limits](../../../includes/azure-data-lake-store-limits.md)]

## Data Share limits

[!INCLUDE [azure-data-share-limits](../../../includes/azure-data-share-limits.md)]

## Database Migration Service Limits

[!INCLUDE [database-migration-service-limits](../../../includes/database-migration-service-limits.md)]

## Device Update for IoT Hub  limits

[!INCLUDE [device-update-for-iot-hub-limits](../../../includes/device-update-for-iot-hub-limits.md)]

## Digital Twins limits

> [!NOTE]
> Some areas of this service have adjustable limits, and others do not. This is represented in the following tables with the *Adjustable?* column. When the limit can be adjusted, the *Adjustable?* value is *Yes*.

[!INCLUDE [digital-twins-limits](../../../includes/digital-twins-limits.md)]

## Event Grid limits

[!INCLUDE [event-grid-limits](../../../articles/event-grid/includes/limits.md)]

## Event Hubs limits
[!INCLUDE [event-hubs-limits](../../../includes/event-hubs-limits.md)]

## IoT Central limits
[!INCLUDE [iot-central-limits](../../../includes/iot-central-limits.md)]

## IoT Hub limits

[!INCLUDE [azure-iothub-limits](../../../includes/iot-hub-limits.md)]

## IoT Hub Device Provisioning Service limits

[!INCLUDE [azure-iotdps-limits](../../../includes/iot-dps-limits.md)]

## Key Vault limits

[!INCLUDE [key-vault-limits](../../../includes/key-vault-limits.md)]

## Managed identity limits

[!INCLUDE [Managed-Identity-Limits](../../../includes/managed-identity-limits.md)]


## Media Services limits

[!INCLUDE [azure-mediaservices-limits](../../../includes/media-servieces-limits-quotas-constraints.md)]

### Media Services v2 (legacy)

For limits specific to Media Services v2 (legacy), see [Media Services v2 (legacy)](/azure/media-services/previous/media-services-quotas-and-limitations)

## Mobile Services limits

[!INCLUDE [mobile-services-limits](../../../includes/mobile-services-limits.md)]

## Multi-Factor Authentication limits

[!INCLUDE [azure-mfa-service-limits](../../../includes/azure-mfa-service-limits.md)]

## Networking limits

[!INCLUDE [azure-virtual-network-limits](../../../includes/azure-virtual-network-limits.md)]

### Application Gateway limits

The following table applies to v1, v2, Standard, and WAF SKUs unless otherwise stated.
[!INCLUDE [application-gateway-limits](../../../includes/application-gateway-limits.md)]

### Application Gateway for Containers limits

[!INCLUDE [application-gateway-for-containers-limits](../../../includes/application-gateway-for-containers-limits.md)]

### Azure Bastion limits

[!INCLUDE [Azure Bastion limits](../../../includes/bastion-limits.md)]

### Azure DNS limits

[!INCLUDE [dns-limits](../../../includes/dns-limits.md)]

### Azure Firewall limits

[!INCLUDE [azure-firewall-limits](../../../includes/firewall-limits.md)]

### Azure Front Door (classic) limits

[!INCLUDE [azure-front-door-service-limits](../../../includes/front-door-limits.md)]

### Azure Network Watcher limits

[!INCLUDE [network-watcher-limits](../../../includes/network-watcher-limits.md)]

### Azure Route Server limits

[!INCLUDE [Azure Route Server Limits](../../../includes/route-server-limits.md)]

### ExpressRoute limits

[!INCLUDE [expressroute-limits](../../../includes/expressroute-limits.md)]

### NAT Gateway limits

[!INCLUDE [nat-gateway-limits](../../../includes/azure-nat-gateway-limits.md)]

### Private Link limits

[!INCLUDE [private-link-limits](../../../includes/private-link-limits.md)]

### Traffic Manager limits

[!INCLUDE [traffic-manager-limits](../../../includes/traffic-manager-limits.md)]

### Virtual Network Gateway limits

[!INCLUDE [virtual-network-gateway-limits](../../../includes/azure-virtual-network-gateway-limits.md)]

### Virtual WAN limits

[!INCLUDE [virtual-wan-limits](../../../includes/virtual-wan-limits.md)]

## Notification Hubs limits

[!INCLUDE [notification-hub-limits](../../../includes/notification-hub-limits.md)]

## Microsoft Dev Box limits

[!INCLUDE [dev-box-limits](../../../includes/dev-box-limits.md)]

## Microsoft Purview limits

The latest values for Microsoft Purview quotas can be found in the [Microsoft Purview quota page](../../purview/how-to-manage-quotas.md).

## Microsoft Sentinel limits

For Microsoft Sentinel limits, see [Service limits for Microsoft Sentinel](../../sentinel/sentinel-service-limits.md)

## Service Bus limits

[!INCLUDE [azure-servicebus-limits](../../../includes/service-bus-quotas-table.md)]

## Site Recovery limits

[!INCLUDE [site-recovery-limits](../../../includes/site-recovery-limits.md)]

## SQL Database limits

For SQL Database limits, see [SQL Database resource limits for single databases](/azure/azure-sql/database/resource-limits-vcore-single-databases), [SQL Database resource limits for elastic pools and pooled databases](/azure/azure-sql/database/resource-limits-vcore-elastic-pools), and [SQL Database resource limits for SQL Managed Instance](/azure/azure-sql/managed-instance/resource-limits).

The maximum number of private endpoints per Azure SQL Database logical server is 250.

## Azure Synapse Analytics limits

[!INCLUDE [synapse-analytics-limits](../../../includes/synapse-analytics-limits.md)]

<!-- conceptual info about disk limits -- applies to unmanaged and managed -->
### Virtual machine disk limits

[!INCLUDE [azure-storage-limits-vm-disks](../../../includes/azure-storage-limits-vm-disks.md)]

For more information, see [Virtual machine sizes](../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

[!INCLUDE [azure-storage-limits-vm-apps](../../../includes/azure-storage-limits-vm-apps.md)]

For more information, see [VM Applications](../../virtual-machines/vm-applications.md).

#### Disk encryption sets

There's a limitation of 1000 disk encryption sets per region, per subscription. For more
information, see the encryption documentation for
[Linux](../../virtual-machines/disk-encryption.md#restrictions) or
[Windows](../../virtual-machines/disk-encryption.md#restrictions) virtual machines. If you
need to increase the quota, contact Azure support.

### Managed virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-managed](../../../includes/azure-storage-limits-vm-disks-managed.md)]

### Unmanaged virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-standard](../../../includes/azure-storage-limits-vm-disks-standard.md)]

[!INCLUDE [azure-storage-limits-vm-disks-premium](../../../includes/azure-storage-limits-vm-disks-premium.md)]

## StorSimple System limits

[!INCLUDE [storsimple-limits-table](../../../includes/storsimple-limits-table.md)]

## Stream Analytics limits

[!INCLUDE [stream-analytics-limits-table](../../../includes/stream-analytics-limits-table.md)]

## Virtual Machines limits

### Virtual Machines limits

[!INCLUDE [azure-virtual-machines-limits](../../../includes/azure-virtual-machines-limits.md)]

### Virtual Machines limits - Azure Resource Manager

The following limits apply when you use Azure Resource Manager and Azure resource groups.

[!INCLUDE [azure-virtual-machines-limits-azure-resource-manager](../../../includes/azure-virtual-machines-limits-azure-resource-manager.md)]

### Compute Gallery limits

There are limits, per subscription, for deploying resources using Compute Galleries:

- 100 compute galleries, per subscription, per region
- 1,000 image definitions, per subscription, per region
- 10,000 image versions, per subscription, per region

## Virtual Machine Scale Sets limits

[!INCLUDE [virtual-machine-scale-sets-limits](../../../includes/azure-virtual-machine-scale-sets-limits.md)]

## Dev tunnels limits

[!INCLUDE [dev-tunnels-service-limits](../../../includes/dev-tunnels/dev-tunnels-service-limits.md)]

## See also

* [Understand Azure limits and increases](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/)
* [Virtual machine and cloud service sizes for Azure](../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Sizes for Azure Cloud Services](../../cloud-services/cloud-services-sizes-specs.md)
* [Naming rules and restrictions for Azure resources](resource-name-rules.md)
