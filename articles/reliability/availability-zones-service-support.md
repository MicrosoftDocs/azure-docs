---
title: Azure Services That Support Availability Zones
description: Learn about which Azure services provide availability zone support, including zonal and zone-redundant options, and the requirements that some services have.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 03/26/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Azure services that support availability zones

Azure continually increases the number of services that support [availability zones](./availability-zones-overview.md), including both zonal and zone-redundant offerings. This article lists which services support availability zones and the type of offering that they support.

## Azure services that provide availability zone support

The following table lists zonal and zone-redundant Azure services. Some services support both types of deployments. To learn more about zonal and zone-redundant services and how they work, see [Types of availability zone support](./availability-zones-overview.md#types-of-availability-zone-support).

Some Azure services are *nonregional*, which means that you don't deploy the service into a specific Azure region or configure availability zone support. To learn more, see [Nonregional Azure services](./regions-nonregional-services.md).

> [!IMPORTANT]
> Even though some services might support availability zones, they might have specific requirements to use them on your resources. For example, some might only support availability zones for specific tiers or regions. For more information about a service's requirements for availability zone support, select that service in the following table.


| **Product**   | **Zone-redundant**  | **Zonal** | 
| --- | --- |---|
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure API Center](../api-center/overview.md)|:::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::  | |
| [Azure API Management](./reliability-api-management.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [App Service Environment](./reliability-app-service.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Application Gateway v2](./reliability-application-gateway-v2.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Automation](../automation/automation-availability-zones.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Backup](reliability-backup.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Bastion](../bastion/bastion-overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Batch](./reliability-batch.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Cache for Redis](./migrate-cache-redis.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Compute Gallery](/azure/virtual-machines/azure-compute-gallery#high-availability)| :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Container Instances](migrate-container-instances.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Container Registry](./reliability-container-registry.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Cosmos DB for PosgtreSQL](/azure/cosmos-db/postgresql/concepts-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Data Explorer](/azure/data-explorer/create-cluster-and-database) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Data Factory](./reliability-data-factory.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Database for MySQL – Flexible Server](/azure/mysql/flexible-server/concepts-high-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Database for PostgreSQL – Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Dedicated Host](/azure/virtual-machines/dedicated-hosts#high-availability-considerations) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure DNS private zones](../dns/private-dns-getstarted-portal.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure DNS Private Resolver](../dns/dns-private-resolver-get-started-portal.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::  ||
| [Azure DDoS Protection](./reliability-ddos.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Disk Encryption](/azure/virtual-machines/disks-redundancy) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Event Grid](../event-grid/overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Event Hubs](./reliability-event-hubs.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Firewall](../firewall/deploy-availability-zone-powershell.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure HDInsight](./reliability-hdinsight.md#availability-zone-support) |  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure HPC Cache](../hpc-cache/hpc-cache-overview.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure IoT Hub](reliability-iot-hub.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [IoT Hub device provisioning service](../iot-dps/about-iot-dps.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Key Vault](./reliability-key-vault.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Kubernetes Service (AKS)](reliability-aks.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Load Balancer](reliability-load-balancer.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Logic Apps](./reliability-logic-apps.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/create-cluster-portal) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Application Insights](/azure/azure-monitor/logs/availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Monitor Logs](/azure/azure-monitor/logs/availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure NAT Gateway](../nat-gateway/nat-availability-zones.md) |  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure NetApp Files](../azure-netapp-files/use-availability-zones.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Network Watcher](../network-watcher/frequently-asked-questions.yml) |:::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::||
| [Traffic analytics in Network Watcher](../network-watcher/frequently-asked-questions.yml) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Notification Hubs](reliability-notification-hubs.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Private Link](../private-link/private-link-overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::||
| [Azure public IP addresses](../virtual-network/ip-services/public-ip-addresses.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: 
| [Azure Queue Storage](./reliability-storage-queue.md)| :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Red Hat OpenShift](/azure/openshift/openshift-faq#can-a-cluster-be-deployed-across-multiple-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Route Server](../route-server/route-server-faq.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Service Bus](../service-bus-messaging/service-bus-outages-disasters.md#availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Service Fabric](/azure/service-fabric/service-fabric-cross-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure SignalR Service](../azure-signalr/availability-zones.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Site Recovery](migrate-recovery-services-vault.md) |  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure SQL Database](/azure/azure-sql/database/enable-zone-redundancy?view=azuresql-db&preserve-view=true&toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure SQL Managed Instance](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Spring Apps](reliability-spring-apps.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage account](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Data Lake Storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure disk storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Blob Storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Files](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure managed disk storage](/azure/virtual-machines/disks-redundancy) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Ultra Disk Storage](/azure/virtual-machines/disks-enable-ultra-ssd)| | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Virtual Machine Scale Sets](./reliability-virtual-machine-scale-sets.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Virtual Machines](./reliability-virtual-machines.md#availability-zone-support) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Virtual Network](./reliability-virtual-network.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Virtual WAN with ExpressRoute](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::| |
| [Point-to-site VPN gateways with Virtual WAN: ](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Site-to-site VPN gateways with Virtual WAN](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure VMware Solution](../azure-vmware/architecture-private-clouds.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Web PubSub](../azure-web-pubsub/concept-availability-zones.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [SQL Server on Virtual Machines](/azure/azure-sql/database/high-availability-sla-local-zone-redundancy) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Microsoft Fabric](reliability-fabric.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::   ||
| [Power BI Embedded](/power-bi/admin/service-admin-failover#what-does-high-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||

## Next steps

- [Nonregional Azure services](./regions-nonregional-services.md)

- [List of Azure regions](regions-list.md)

- [Availability zone migration guidance overview](availability-zones-migration-overview.md)

- [Availability of service by category](availability-service-by-category.md)

- [Azure Well-Architected Framework: Overview of the Reliability pillar](/azure/well-architected/reliability)
