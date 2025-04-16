---
title: Azure services with availability zone support
description: Learn which Azure services offer availability zone support.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 03/26/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Azure services with availability zone support

Azure is continually expanding the number of services that support [availability zones](./availability-zones-overview.md), including both zonal and zone-redundant offerings. This article shows you which services support availability zones, as well as the type of offering they support. 


## Azure services with availability zone support

The following table provides a list of zonal and zone-redundant Azure services. Some services support both types of deployments. To learn more about zonal and zone-redundant services and how they work, see [Types of availability zone support](./availability-zones-overview.md#types-of-availability-zone-support).

Some Azure services are *nonregional*, which means that you don't deploy the service into a specific Azure region or configure availability zone support. To learn more, see [Nonregional Azure services](./regions-nonregional-services.md).


> [!IMPORTANT]
> Even though some services might support availability zones, they might have specific requirements to use them on your resources. For example, some may only support availability zones for certain tiers or regions. To get more information on a service's requirements for availability zone support, select that service in the following table.


| **Product**   | **Zone-redundant**  | **Zonal** | 
| --- | --- |---|
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure API Center](../api-center/overview.md)|:::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::  | |
| [Azure API Management](migrate-api-mgt.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure App Service: App Service Environment](./reliability-app-service.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Automation](../automation/automation-availability-zones.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Backup](reliability-backup.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Bastion](../bastion/bastion-overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Batch](./reliability-batch.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Cache for Redis](./migrate-cache-redis.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Compute Gallery](/azure/virtual-machines/azure-compute-gallery#high-availability)| :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Container Instances](migrate-container-instances.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Container Registry](/azure/container-registry/zone-redundancy) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Cosmos DB for PosgtreSQL](/azure/cosmos-db/postgresql/concepts-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Data Explorer](/azure/data-explorer/create-cluster-database-portal) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Data Factory](./reliability-data-factory.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Database for MySQL – Flexible Server](/azure/mysql/flexible-server/concepts-high-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Database for PostgreSQL – Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Dedicated Host](/azure/virtual-machines/dedicated-hosts#high-availability-considerations) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure DNS: Azure DNS Private Zones](../dns/private-dns-getstarted-portal.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure DNS: Azure DNS Private Resolver](../dns/dns-private-resolver-get-started-portal.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::  ||
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
| [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Key Vault](/azure/key-vault/general/disaster-recovery-guidance) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Kubernetes Service (AKS)](reliability-aks.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Load Balancer](reliability-load-balancer.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Logic Apps](./reliability-logic-apps.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/create-cluster-portal) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Monitor: Application Insights](/azure/azure-monitor/logs/availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Monitor Logs](/azure/azure-monitor/logs/availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure NAT Gateway](../nat-gateway/nat-availability-zones.md) |  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure NetApp Files](../azure-netapp-files/use-availability-zones.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Network Watcher](../network-watcher/frequently-asked-questions.yml) |:::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::||
| [Azure Network Watcher: Traffic Analytics](../network-watcher/frequently-asked-questions.yml) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Notification Hubs](reliability-notification-hubs.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Private Link](../private-link/private-link-overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::||
| [Azure Public IP](../virtual-network/ip-services/public-ip-addresses.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: 
| [Azure Red Hat OpenShift](/azure/openshift/openshift-faq#can-a-cluster-be-deployed-across-multiple-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Route Server](../route-server/route-server-faq.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Service Bus](../service-bus-messaging/service-bus-outages-disasters.md#availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Service Fabric](/azure/service-fabric/service-fabric-cross-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure SignalR Service](../azure-signalr/availability-zones.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Site Recovery](migrate-recovery-services-vault.md) |  | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::|
| [Azure SQL Database](migrate-sql-database.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure SQL Managed Instance](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql&preserve-view=true) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Spring Apps](reliability-spring-apps.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage account](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage: Azure Data Lake Storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage: Disk Storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage: Blob Storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage: Files Storage](migrate-storage.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Storage: Managed Disks](/azure/virtual-machines/disks-redundancy) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Storage: Ultra Disk](/azure/virtual-machines/disks-enable-ultra-ssd)| | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Virtual Machine Scale Sets](./reliability-virtual-machine-scale-sets.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Virtual Machines](./reliability-virtual-machines.md#availability-zone-support) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure Virtual Network](../virtual-network/virtual-networks-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#virtual-networks-and-availability-zones) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Azure Virtual WAN: Azure ExpressRoute](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::| |
| [Azure Virtual WAN: Point-to-site VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Virtual WAN: Site-to-site VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure VMware Solution](../azure-vmware/architecture-private-clouds.md) | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: |
| [Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Azure Web PubSub](../azure-web-pubsub/concept-availability-zones.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [SQL Server on Azure Virtual Machines](/azure/azure-sql/database/high-availability-sla) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||
| [Microsoft Fabric](reliability-fabric.md#availability-zone-support) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false":::   ||
| [Power BI Embedded](/power-bi/admin/service-admin-failover#what-does-high-availability) | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: ||


## Next steps

- [Nonregional Azure services](./regions-nonregional-services.md)

- [List of Azure regions](regions-list.md)

- [Availability zone migration guidance overview](availability-zones-migration-overview.md)

- [Availability of service by category](availability-service-by-category.md)

- [Well-architected Framework: Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview)
