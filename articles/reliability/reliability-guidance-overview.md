---
title: Reliability guidance overview for Microsoft Azure products and services
description: Reliability guidance overview for Microsoft Azure products and services. View Azure service specific reliability guides and Azure Service Manager Retirement guides.
author: anaharris-ms
ms.service: reliability
ms.topic: conceptual
ms.date: 03/31/2023
ms.author: anaharris
ms.custom: subject-reliability
---

# Reliability guidance overview 

Azure reliability guidance contains the following:

- **Service-specific reliability guides**. Each guide can cover both intra-regional resiliency with [availability zones](availability-zones-overview.md) and information on [cross-region resiliency with disaster recovery](cross-region-replication-azure.md). For a more detailed overview of reliability principles in Azure, see [Reliability in Microsoft Azure Well-Architected Framework](/azure/architecture/framework/resiliency/).

- **Azure Service Manager (ASM) Retirement guides**. ASM is the old control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations, and has been in use since 2011. ASM is retiring in August 2024, and customers can now migrate to [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview). ARM provides a management layer that enables you to create, update, and delete resources in your Azure account. You can use management features like access control, locks, and tags to secure and organize your resources after deployment.

## Azure services reliability guides

### ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services 

| **Products**  | 
| --- | 
|[Azure Cosmos DB](../cosmos-db/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Database for PostgreSQL - Flexible Server](reliability-postgresql-flexible-server.md)|
[Azure Event Hubs](../event-hubs/event-hubs-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zones)|
[Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Key Vault](../key-vault/general/disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Load Balancer](../load-balancer/load-balancer-standard-availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Public IP](../virtual-network/ip-services/public-ip-addresses.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zone)|
[Azure Service Bus](../service-bus-messaging/service-bus-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zones)|
[Azure Service Fabric](../service-fabric/service-fabric-cross-availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Site Recovery](../site-recovery/site-recovery-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure SQL](/azure/azure-sql/database/high-availability-sla?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Storage: Blob Storage](../storage/common/storage-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Storage Mover](reliability-azure-storage-mover.md)|
[Azure Virtual Machine Scale Sets](reliability-virtual-machine-scale-sets.md)|
[Azure Virtual Machines](reliability-virtual-machines.md)|
[Azure Virtual Machines Image Builder](reliability-image-builder.md)|
[Azure Virtual Network](../vpn-gateway/create-zone-redundant-vnet-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|

### ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services

| **Products**  | 
| --- | 
|[Azure API Management](../api-management/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure App Configuration](../azure-app-configuration/faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-does-app-configuration-ensure-high-data-availability)|
[Azure App Service](./reliability-app-service.md)|
[Azure Application Gateway (V2)](../application-gateway/application-gateway-autoscaling-zone-redundant.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Batch](reliability-batch.md)|
[Azure Bot Service](reliability-bot.md)|
[Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Cognitive Search](../search/search-reliability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Container Instances](reliability-containers.md)|
[Azure Container Registry](../container-registry/zone-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Data Explorer](/azure/data-explorer/create-cluster-database-portal?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Data Factory](../data-factory/concepts-data-redundancy.md?bc=%2fazure%2freliability%2fbreadcrumb%2ftoc.json&toc=%2fazure%2freliability%2ftoc.json)|
[Azure Database for MySQL - Flexible Server](../mysql/flexible-server/concepts-high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Database for PostgreSQL - Flexible Server](../postgresql/single-server/concepts-high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Data Manager for Energy](../energy-data-services/reliability-energy-data-services.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
[Azure DDoS Protection](../ddos-protection/ddos-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Disk Encryption](../virtual-machines/disks-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure DNS - Azure DNS Private Zones](../dns/private-dns-getstarted-portal.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure DNS - Azure DNS Private Resolver](../dns/dns-private-resolver-get-started-portal.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Event Grid](../event-grid/availability-zones-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Firewall](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Functions](reliability-functions.md)|
[Azure HDInsight](reliability-hdinsight.md)|
[Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Kubernetes Service (AKS)](../aks/availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Logic Apps](../logic-apps/set-up-zone-redundancy-availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Monitor](../azure-monitor/logs/availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Network Watcher](../network-watcher/frequently-asked-questions.yml?bc=%2fazure%2freliability%2fbreadcrumb%2ftoc.json&toc=%2fazure%2freliability%2ftoc.json#service-availability-and-redundancy)|
[Azure Notification Hubs](../notification-hubs/availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Operator Nexus Network Cloud](reliability-operator-nexus.md)|
[Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Private Link](../private-link/availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Route Server](../route-server/route-server-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
[Azure Virtual WAN](../virtual-wan/virtual-wan-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)|
[Azure Web Application Firewall](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|

## Azure Service Manager Retirement

Azure Service Manager (ASM) is the old control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations, and has been in use since 2011. ASM is retiring in August 2024, and customers can now migrate to [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview). 

For more information on specific retirement dates and migration documentation, see [Azure Service Manager Retirement](./asm-retirement.md).
## Next steps


> [!div class="nextstepaction"]
> [Azure services and regions with availability zones](availability-zones-service-support.md)

> [!div class="nextstepaction"]
> [Availability of service by category](availability-service-by-category.md)

> [!div class="nextstepaction"]
> [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

> [!div class="nextstepaction"]
> [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
