---
title: Azure subscription and service limits, quotas, and constraints
description: Understand common Azure subscription and service limits, quotas, and constraints. This article includes information about how to increase limits along with maximum values.
ms.topic: conceptual
ms.date: 01/23/2025
ms.custom: ignite-2024
#customer intent: As a subscription owner or cloud operator, I want an authoritative list of subscription and service limits and guidance for requesting increases so that I can plan capacity and avoid service interruptions.
---

# Azure subscription and service limits, quotas, and constraints

This document lists some of the most common Microsoft Azure limits, which are also sometimes called quotas.

- To learn more about Azure pricing, see the [Azure pricing](https://azure.microsoft.com/pricing/) overview and details page.
- The Azure pricing page provides details for specific services; for example, [Windows Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/Windows/).
- You can also use the Azure [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate your costs.
- See [What is Microsoft Billing?](../../cost-management-billing/cost-management-billing-overview.md) for tips to help manage your costs.

## How to manage limits

> [!NOTE]
> Some services have adjustable limits.
>
> When the limit can be adjusted, the tables include **Default limit** and **Maximum limit** headers. The limit can be raised above the default limit but not above the maximum limit. Some services with adjustable limits use different headers with information about adjusting the limit.
>
> When a service doesn't have adjustable limits, the following tables use the header **Limit** without any additional information about adjusting the limit. In those cases, the default and the maximum limits are the same.
>
> If you want to raise the limit or quota above the default limit, [open an online customer support request at no charge](../templates/error-resource-quota.md#solution).
>
> The terms *soft limit* and *hard limit* are often used informally to describe the current, adjustable limit (soft limit) and the maximum limit (hard limit). If a limit isn't adjustable, there won't be a soft limit but only a hard limit.
>

[Free Azure trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) aren't eligible for limit or quota increases. If you have this type of subscription, you can upgrade to a [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) one. For more information, see [Upgrade your Azure account](../../cost-management-billing/manage/upgrade-azure-subscription.md) and the overviews for [Try Azure for free or pay as you go](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

Some limits are managed at a regional level. You decide what your quotas must be for your workload in any one region, and then request that amount for each region into which you want to deploy.

For example, with virtual central processing unit (vCPU) quotas:

- To request a quota increase with support for vCPUs, you decide how many vCPUs to use in which regions.
- You then request an increase in vCPU quotas for the amounts and regions that you want.
- If you need to use 30 vCPUs in West Europe to run your application there, you specifically request 30 vCPUs in West Europe.
- Your vCPU quota doesn't increase in any other region; only West Europe has the 30-vCPU quota.

See [Resolve errors for resource quotas](../templates/error-resource-quota.md) for more information about how to determine quotas for specific regions.

## General limits

- See [Naming rules and restrictions for Azure resources](resource-name-rules.md) for limits on resource names.
- See [Understand how Azure Resource Manager throttles requests](request-limits-and-throttling.md) to learn about Resource Manager API read and write limits.

### Azure management group limits

The following limits apply to [Azure management groups](../../governance/management-groups/overview.md).

[!INCLUDE [management-group-limits](../../../includes/management-group-limits.md)]

### Azure subscription limits

The following limits apply when you use Azure Resource Manager and Azure resource groups.

[!INCLUDE [azure-subscription-limits-azure-resource-manager](~/reusable-content/ce-skilling/azure/includes/azure-subscription-limits-azure-resource-manager.md)]

Note that subscription IDs must be non-empty GUIDs.

### Azure resource group limits

[!INCLUDE [azure-resource-groups-limits](../../../includes/azure-resource-groups-limits.md)]

## Azure API Center limits

[!INCLUDE [api-center-service-limits](../../api-center/includes/api-center-service-limits.md)]

## Azure API Management limits

This section provides information about limits that apply to Azure API Management instances in different [service tiers](../../api-management/api-management-features.md), including the following:

- [API Management classic tiers](#limits---api-management-classic-tiers)
- [API Management v2 tiers](#limits---api-management-v2-tiers)
- [API Management workspaces](#limits---api-management-workspaces)
- [Developer portal in API Management v2 tiers](#limits---developer-portal-in-api-management-v2-tiers)

### Limits - API Management classic tiers

[!INCLUDE [api-management-service-limits](../../../includes/api-management-service-limits.md)]

### Limits - API Management v2 tiers

[!INCLUDE [api-management-service-limits-v2](../../../includes/api-management-service-limits-v2.md)]

### Limits - API Management workspaces

[!INCLUDE [api-management-workspace-limits](../../../includes/api-management-workspace-limits.md)]

### Limits - Developer portal in API Management v2 tiers

[!INCLUDE [api-management-developer-portal-limits-v2](../../../includes/api-management-developer-portal-limits-v2.md)]

## Azure App Service limits

[!INCLUDE [azure-websites-limits](../../../includes/azure-websites-limits.md)]

## Azure Automation limits

[!INCLUDE [automation-limits](../../../includes/azure-automation-service-limits.md)]

## Azure App Configuration

[!INCLUDE [app-configuration-limits](../../../includes/app-configuration-limits.md)]

## Azure Cache for Redis limits

[!INCLUDE [redis-cache-service-limits](../../azure-cache-for-redis/includes/redis-cache-service-limits.md)]

## Azure Cloud Services limits

[!INCLUDE [azure-cloud-services-limits](../../../includes/azure-cloud-services-limits.md)]

## Azure AI Search limits

Pricing tiers determine the capacity and limits of your search service. These tiers include:

- **Free**: Multitenant service that's shared with other Azure subscribers and helps with evaluations and small development projects
- **Basic**: Provides dedicated computing resources for production workloads at a smaller scale and with up to three replicas for highly available query workloads
- **Standard**: Includes S1, S2, S3, and S3 High Density; is for larger production workloads; multiple levels exist within the Standard tier for you to choose a resource configuration that best matches your workload profile

**Limits per subscription**

[!INCLUDE [azure-search-limits-per-subscription](~/reusable-content/ce-skilling/azure/includes/azure-search-limits-per-subscription.md)]

**Limits per search service**

[!INCLUDE [azure-search-limits-per-service](~/reusable-content/ce-skilling/azure/includes/azure-search-limits-per-service.md)]

See [Service limits in Azure AI Search](/azure/search/search-limits-quotas-capacity) for more details about limits, including document size, queries per second, keys, requests, and responses.

<a name='azure-cognitive-services-limits'></a>

## Azure AI Services limits

[!INCLUDE [azure-cognitive-services-limits](../../../includes/azure-cognitive-services-limits.md)]

## Azure Chaos Studio limits

See [Azure Chaos Studio service limits](/azure/chaos-studio/chaos-studio-service-limits) for Azure Chaos Studio limits.

## Azure Communications Gateway limits

Some of the following default limits and quotas can be increased. To request a change, create an [Azure portal support request](../../communications-gateway/request-changes.md), and describe the limit that you need to change.

[!INCLUDE [communications-gateway-general-restrictions](../../communications-gateway/includes/communications-gateway-general-restrictions.md)]

Azure Communications Gateway also has limits on SIP signaling.

[!INCLUDE [communications-gateway-sip-size-restrictions](../../communications-gateway/includes/communications-gateway-sip-size-restrictions.md)]

[!INCLUDE [communications-gateway-sip-behavior-restrictions](../../communications-gateway/includes/communications-gateway-sip-behavior-restrictions.md)]

[!INCLUDE [limits on the Provisioning API](../../communications-gateway/includes/communications-gateway-provisioning-api-restrictions.md)]

## Azure Container Apps limits

See [Quotas in Azure Container Apps](../../container-apps/quotas.md) for Azure Container Apps limits.

[!INCLUDE [container-apps-limits](../../../includes/container-apps/container-apps-limits.md)]

## Azure Cosmos DB limits

See [Limits in Azure Cosmos DB](/azure/cosmos-db/concepts-limits) for Azure Cosmos DB limits.

## Azure Data Explorer limits

[!INCLUDE [azure-data-explorer-limits](../../../includes/data-explorer-limits.md)]

## Azure Database for MySQL flexible server

See [Limitations in Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/concepts-limitations) for Azure Database for MySQL - Flexible Server limits.

## Azure Database for PostgreSQL flexible server

See [Limits in Azure Database for PostgreSQL flexible server](/azure/postgresql/flexible-server/concepts-limits) for Azure Database for PostgreSQL flexible server limits.

## Azure Deployment Environments limits

[!INCLUDE [Deployment Environments limits](../../../includes/deployment-environments-limits.md)]

## Azure Files and Azure File Sync

See [Scalability and performance targets for Azure Files and Azure File Sync](../../storage/files/storage-files-scale-targets.md) to learn more about the limits for Azure Files and Azure File Sync.

## Azure Functions limits

[!INCLUDE [functions-limits](../../../includes/functions-limits.md)]

See [Azure Functions hosting options](../../azure-functions/functions-scale.md) for more information.

## Azure Health Data Services

### Azure Health Data Services limits

[!INCLUDE [functions-limits](../../../includes/azure-healthcare-api-limits.md)]

### Azure API for FHIR service limits

[!INCLUDE [functions-limits](../../../includes/azure-api-for-fhir-limits.md)]

## Azure Kubernetes Service limits

[!INCLUDE [container-service-limits](~/reusable-content/ce-skilling/azure/includes/container-service-limits.md)]

[!INCLUDE [container-quota-limits](~/reusable-content/ce-skilling/azure/includes/container-quota-limits.md)]

## Azure Lab Services

[!INCLUDE [azure-lab-services-limits](../../../includes/azure-lab-services-limits.md)]

## Azure Load Testing limits

See [Service limits in Azure Load Testing](../../app-testing/load-testing/resource-limits-quotas-capacity.md) for Azure Load Testing limits. 

## Azure Machine Learning limits

See [Manage and increase quotas and limits for resources with Azure Machine Learning](/azure/machine-learning/how-to-manage-quotas) for the latest values for Azure Machine Learning Compute quotas.

## Azure Maps limits

[!INCLUDE [maps-limits](../../../includes/maps-limits.md)]

## Azure Managed Grafana limits

[!INCLUDE [Azure Managed Grafana limits](../../../includes/azure-managed-grafana-limits.md)]

## Azure Monitor limits

For Azure Monitor limits, see [Azure Monitor service limits](/azure/azure-monitor/service-limits).

## Azure Data Factory limits

[!INCLUDE [azure-data-factory-limits](../../../includes/azure-data-factory-limits.md)]

## Azure NetApp Files

[!INCLUDE [netapp-limits](../../../includes/netapp-service-limits.md)]

## Azure Policy limits

[!INCLUDE [azure-policy-limits](../../governance/includes/policy/azure-policy-limits.md)]

## Azure Quantum limits

[!INCLUDE [quantum-limits](../../../includes/azure-quantum-limits.md)]

## Azure RBAC limits

The following limits apply to [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

[!INCLUDE [role-based-access-control-limits](../../../includes/role-based-access-control/limits.md)]

## Azure SignalR Service limits

[!INCLUDE [signalr-service-limits](../../../includes/signalr-service-limits.md)]

## Azure Spring Apps limits

See [Quotas and service plans for Azure Spring Apps](../../spring-apps/basic-standard/quotas.md) to learn more about the limits for Azure Spring Apps.

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

See [Billing accounts and scopes in the Azure portal](../../cost-management-billing/manage/view-all-accounts.md) to learn more about creating limits for Azure subscriptions.

## Azure Virtual Desktop Service limits

[!INCLUDE [azure-virtual-desktop-service-limits](../../../includes/azure-virtual-desktop-limits.md)]

## Azure VMware Solution limits

[!INCLUDE [azure-vmware-solutions-limits](../../azure-vmware/includes/azure-vmware-solutions-limits.md)]

## Azure Web PubSub limits

[!INCLUDE [azure-web-pubsub-limits](../../../includes/azure-web-pubsub-limits.md)]

## Backup limits

[!INCLUDE [azure-backup-limits](../../../includes/azure-backup-limits.md)]

## Batch limits

[!INCLUDE [azure-batch-limits](../../../includes/azure-batch-limits.md)]

## Classic deployment model limits

The following limits apply if you use a classic deployment model instead of the Azure Resource Manager deployment model.

[!INCLUDE [azure-subscription-limits](../../../includes/azure-subscription-limits.md)]

## Container Instances limits

[!INCLUDE [container-instances-limits](../../../includes/container-instances-limits.md)]

## Azure Container Registry limits

The following table details the features and limits of the Basic, Standard, and Premium [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus).

[!INCLUDE [container-registry-limits](~/reusable-content/ce-skilling/azure/includes/container-registry/container-registry-limits.md)]

## Azure Content Delivery Network limits

[!INCLUDE [cdn-limits](../../../includes/cdn-limits.md)]

## Azure Data Lake Analytics limits

[!INCLUDE [azure-data-lake-analytics-limits](../../../includes/azure-data-lake-analytics-limits.md)]

## Azure Data Lake Storage limits

[!INCLUDE [azure-data-lake-store-limits](../../../includes/azure-data-lake-store-limits.md)]

## Azure Data Share limits

[!INCLUDE [azure-data-share-limits](../../../includes/azure-data-share-limits.md)]

## Azure Database Migration Service Limits

[!INCLUDE [database-migration-service-limits](../../../includes/database-migration-service-limits.md)]

## Azure Device Update for IoT Hub limits

[!INCLUDE [device-update-for-iot-hub-limits](../../../includes/device-update-for-iot-hub-limits.md)]

## Azure Digital Twins limits

> [!NOTE]
> Some areas of this service have adjustable limits, and others do not. The following tables use the *Adjustable?* column to represent this condition. When the limit can be adjusted, the *Adjustable?* value is *Yes*.

[!INCLUDE [digital-twins-limits](../../digital-twins/includes/digital-twins-limits.md)]

## Azure Event Grid limits

[!INCLUDE [event-grid-limits](../../../articles/event-grid/includes/limits.md)]

## Azure Event Hubs limits
[!INCLUDE [event-hubs-limits](../../../includes/event-hubs-limits.md)]

## Azure IoT Central limits
[!INCLUDE [iot-central-limits](../../../includes/iot-central-limits.md)]

## Azure IoT Hub limits

[!INCLUDE [azure-iothub-limits](../../../includes/iot-hub-limits.md)]

## Azure IoT Hub Device Provisioning Service limits

[!INCLUDE [azure-iotdps-limits](../../../includes/iot-dps-limits.md)]

## Azure Key Vault limits

[!INCLUDE [key-vault-limits](~/reusable-content/ce-skilling/azure/includes/key-vault/key-vault-service-limits.md)]

## Azure Key Vault: Managed HSM limits

[!INCLUDE [key-vault-limits](~/reusable-content/ce-skilling/azure/includes/key-vault/managed-hsm-service-limits.md)]

## Azure Managed Identity limits

[!INCLUDE [Managed-Identity-Limits](../../../includes/managed-identity-limits.md)]

## Azure Media Services limits

[!INCLUDE [azure-mediaservices-limits](../../../includes/media-servieces-limits-quotas-constraints.md)]

### Azure Media Services v2 (legacy)

For limits specific to Media Services v2 (legacy), see [Media Services v2 (legacy)]

## Azure Mobile Services limits

[!INCLUDE [mobile-services-limits](../../../includes/mobile-services-limits.md)]

## Azure networking limits

[!INCLUDE [azure-virtual-network-limits](../../../includes/azure-virtual-network-limits.md)]

### <a name="load-balancer"></a>Azure Load Balancer limits
[!INCLUDE [azure-load-balancer-limits](../../../includes/load-balancer-limits.md)]

### Azure Application Gateway limits

The following table applies to v1, v2, Standard, and WAF SKUs unless otherwise stated.
[!INCLUDE [application-gateway-limits](../../../includes/application-gateway-limits.md)]

### Azure Application Gateway for Containers limits

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

### Azure ExpressRoute limits

[!INCLUDE [expressroute-limits](../../../includes/expressroute-limits.md)]

### Azure NAT Gateway limits

[!INCLUDE [nat-gateway-limits](../../../includes/azure-nat-gateway-limits.md)]

### Azure Private Link limits

[!INCLUDE [private-link-limits](../../../includes/private-link-limits.md)]

### Azure Traffic Manager limits

[!INCLUDE [traffic-manager-limits](../../../includes/traffic-manager-limits.md)]

### Azure VPN Gateway limits

Unless stated otherwise, the following limits apply to Azure VPN Gateway resources and virtual network gateways.

[!INCLUDE [virtual-network-gateway-limits](../../../includes/azure-virtual-network-gateway-limits.md)]

### Azure Virtual WAN limits

[!INCLUDE [virtual-wan-limits](../../../includes/virtual-wan-limits.md)]

## Azure Notification Hubs limits

[!INCLUDE [notification-hub-limits](../../../includes/notification-hub-limits.md)]

## Microsoft Dev Box limits

[!INCLUDE [dev-box-limits](../../../includes/dev-box-limits.md)]

<a name='azure-active-directory-limits'></a>

## Microsoft Entra service limits

See [Microsoft Entra service limits](/entra/identity/users/directory-service-limits-restrictions) for Microsoft Entra service limits.

## Microsoft Purview limits

See [Classic Microsoft Purview data governance limits](../../purview/how-to-manage-quotas.md#classic-microsoft-purview-data-governance-limits) for the most current Microsoft Purview quotas.

## Microsoft Sentinel limits

See [Service limits for Microsoft Sentinel](../../sentinel/sentinel-service-limits.md) for Microsoft Sentinel limits.

## Azure Service Bus limits

[!INCLUDE [azure-servicebus-limits](../../../includes/service-bus-quotas-table.md)]

## Azure Site Recovery limits

[!INCLUDE [site-recovery-limits](../../../includes/site-recovery-limits.md)]

## Azure SQL Database limits

For Azure SQL Database limits see:

- [Overview of Azure SQL Managed Instance resource limits](/azure/azure-sql/managed-instance/resource-limits)
- [Resource limits for single databases using the vCore purchasing model](/azure/azure-sql/database/resource-limits-vcore-single-databases)
- [Resource limits for elastic pools using the vCore purchasing model](/azure/azure-sql/database/resource-limits-vcore-elastic-pools)

The maximum number of private endpoints per Azure SQL Database logical server is 250.

## Azure Synapse Analytics limits

[!INCLUDE [synapse-analytics-limits](../../../includes/synapse-analytics-limits.md)]

<!-- conceptual info about disk limits -- applies to unmanaged and managed -->
### Azure virtual machine disk limits

[!INCLUDE [azure-storage-limits-vm-disks](~/reusable-content/ce-skilling/azure/includes/azure-storage-limits-vm-disks.md)]

See [sizes for virtual machines in Azure](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information.

[!INCLUDE [azure-storage-limits-vm-apps](../../../includes/azure-storage-limits-vm-apps.md)]

See [VM Applications overview](/azure/virtual-machines/vm-applications) for more information.

#### Azure disk encryption sets

A limit of 5,000 disk encryption sets are allowed per region and per subscription. [Contact Azure support](../../communications-gateway/request-changes.md) to increase the quota. 

See the following documentation to learn more about about encryption restrictions:

- [Linux](/azure/virtual-machines/disk-encryption#restrictions)
- [Windows](/azure/virtual-machines/disk-encryption#restrictions) virtual machines

### Azure-managed virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-managed](~/reusable-content/ce-skilling/azure/includes/azure-storage-limits-vm-disks-managed.md)]

### Unmanaged virtual machine disks

[!INCLUDE [azure-storage-limits-vm-disks-standard](~/reusable-content/ce-skilling/azure/includes/azure-storage-limits-vm-disks-standard.md)]

[!INCLUDE [azure-storage-limits-vm-disks-premium](~/reusable-content/ce-skilling/azure/includes/azure-storage-limits-vm-disks-premium.md)]

## Azure StorSimple System limits

[!INCLUDE [storsimple-limits-table](../../../includes/storsimple-limits-table.md)]

## Azure Stream Analytics limits

[!INCLUDE [stream-analytics-limits-table](../../../includes/stream-analytics-limits-table.md)]

## Azure Virtual Machines limits

### Azure Virtual Machines limits

[!INCLUDE [azure-virtual-machines-limits](../../../includes/azure-virtual-machines-limits.md)]

### Azure Virtual Machines limits - Azure Resource Manager

The following limits apply when you use Azure Resource Manager and Azure resource groups.

[!INCLUDE [azure-virtual-machines-limits-azure-resource-manager](../../../includes/azure-virtual-machines-limits-azure-resource-manager.md)]

### Azure Compute Gallery limits

There are limits per subscription for deploying resources when you use Compute Galleries:

- 100 compute galleries per subscription and per region
- 1,000 image definitions per subscription and per region
- 10,000 image versions per subscription and per region

### Managed Run Command limit

The maximum allowed Managed Run Commands is currently limited to 25.

## Azure Virtual Machine Scale Sets limits

[!INCLUDE [virtual-machine-scale-sets-limits](../../../includes/azure-virtual-machine-scale-sets-limits.md)]

## Azure Virtual Network Manager limits

[!INCLUDE [virtual-network-manager-limits](../../../includes/azure-virtual-network-manager-limits.md)]

## Dev tunnels limits

[!INCLUDE [dev-tunnels-service-limits](../../../includes/dev-tunnels/dev-tunnels-service-limits.md)]

## Network security perimeter limits

[!INCLUDE [network-security-perimeter-limits](../../../includes/network-security-perimeter-limits.md)]

## Next steps

Continue to the following resources to learn more:

- [Understand Azure Limits and Increases](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/)
- [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Sizes for Cloud Services (classic)](../../cloud-services/cloud-services-sizes-specs.md)
- [Naming rules and restrictions for Azure resources](resource-name-rules.md)
