---
title: Azure services with availability zone support
description: Learn which Azure services offer availability zone support.
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 01/16/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: references_regions, subject-reliability
---

# Azure services with availability zone support

Azure [availability zones](./availability-zones-overview.md) are physically separate locations within each Azure region. This article shows you which services support availability zones. 

Azure is continually expanding the number of services that support availability zones, including zonal and zone-redundant offerings.

## Always-available services

Some Azure services don't support availability zones because they are:

- Available across multiple Azure regions within a geographic area, or even across all Azure regions globally.
- Resilient to zone-wide outages.
- Resilient to region-wide outages.
For more information on older-generation virtual machines, see [Previous generations of virtual machine sizes](/azure/virtual-machines/sizes-previous-gen).

## Azure services with availability zone support
The following tables provide a summary of the current offering of zonal, zone-redundant, and always-available Azure services. They list Azure offerings according to the regional availability of each.

>[!IMPORTANT]
>To learn more about availability zones support and available services in your region, contact your Microsoft sales or customer representative.

##### Legend

![Legend containing icons and meaning of each with respect to regional availability of each service in the table.](media/legend.png) 

In the Product Catalog, always-available services are listed as "non-regional" services.

>[!IMPORTANT]
>Some services, although they are zone-redundant, may have limited support for availability zones. For example, some may only support availability zones for certain tiers, regions, or SKUs. To get more information on service limitations for availability zone support, select that service in the following table.

### AI and machine learning

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Bot Services  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Analytics

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Data Explorer](/azure/data-explorer/create-cluster-database-portal) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Data Factory](../data-factory/concepts-data-redundancy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Event Hubs](./reliability-event-hubs.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure HDInsight](./reliability-hdinsight.md#availability-zone-support) | ![An icon that signifies this service is zonal](media/icon-zonal.svg)  |
| [Azure Storage: Azure Data Lake Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| Azure Stream Analytics | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Microsoft Fabric](reliability-fabric.md#availability-zone-support) |  ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Power BI Embedded](/power-bi/admin/service-admin-failover#what-does-high-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Compute

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service: App Service Environment](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Batch](./reliability-batch.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Container Instances](migrate-container-instances.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Kubernetes Service (AKS)](/azure/aks/availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Service Fabric](/azure/service-fabric/service-fabric-cross-availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Spring Apps](reliability-spring-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Virtual Machine Scale Sets](./reliability-virtual-machine-scale-sets.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Virtual Machines](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| Azure Virtual Machines: [Av2-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Bs-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Ddsv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Ddv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [DSv2-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [DSv3-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Dsv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Dv2-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Dv3-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Dv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Edsv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Edv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [ESv3-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Esv4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Ev3-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Ev4-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [F-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| Azure Virtual Machines: [Fsv2-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [FS-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [M-Series](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| Azure Virtual Machines: [Azure Compute Gallery](./reliability-virtual-machines.md#availability-zone-support)| ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| Azure Virtual Machines: [Azure Dedicated Host](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure VMware Solution](../azure-vmware/architecture-private-clouds.md) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [SQL Server on Azure Virtual Machines](/azure/azure-sql/database/high-availability-sla) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

\*VMs that support availability zones: AV2-series, B-series, DSv2-series, DSv3-series, Dv2-series, Dv3-series, ESv3-series, Ev3-series, F-series, FS-series, FSv2-series, and M-series.\*

### Containers

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Container Instances](migrate-container-instances.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Container Registry](/azure/container-registry/zone-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Kubernetes Service (AKS)](/azure/aks/availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| Azure Red Hat OpenShift | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Service Fabric](/azure/service-fabric/service-fabric-cross-availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |

### Databases

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Cache for Redis](./migrate-cache-redis.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)   |
| [Azure Data Factory](../data-factory/concepts-data-redundancy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Database for MySQL – Flexible Server](/azure/mysql/flexible-server/concepts-high-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Database for PostgreSQL – Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/create-cluster-portal) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure SQL Database](migrate-sql-database.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure SQL Managed Instance](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql&preserve-view=true) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [SQL Server on Azure Virtual Machines](/azure/azure-sql/database/high-availability-sla) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Developer tools

| **Product**   | **Reliability**   |
| --- | --- |
|[Azure API Center](../api-center/overview.md)| ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Application Insights](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### DevOps

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Monitor Logs]((/azure/azure-monitor/logs/availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Hybrid and multicloud

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Database for PostgreSQL – Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure SQL Database](migrate-sql-database.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Stack Edge  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Defender for Cloud  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Sentinel  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Identity

| **Product**   | **Reliability**   |
| --- | --- |
| Microsoft Defender for Identity  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Microsoft Entra ID  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Integration

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Data Factory](../data-factory/concepts-data-redundancy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Event Grid](../event-grid/overview.md) | ![An icon that signifies this service is zone-redundant](media/icon-zone-redundant.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Logic Apps](../logic-apps/logic-apps-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Service Bus](../service-bus-messaging/service-bus-outages-disasters.md#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Web PubSub](../azure-web-pubsub/concept-availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Internet of Things

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)   |
| [Azure Event Grid](../event-grid/overview.md) | ![An icon that signifies this service is zone-redundant](media/icon-zone-redundant.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Logic Apps](../logic-apps/logic-apps-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Maps  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Performance Diagnostics  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Stream Analytics | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| Microsoft Defender for IoT  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Intune  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Management and governance

| **Product**   | **Reliability**   |
| --- | --- |
| Azure Advisor  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Automation](../automation/automation-availability-zones.md)| ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Backup](reliability-backup.md#availability-zone-support)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Blueprints  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Cloud Shell  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Lighthouse  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Managed Applications  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Application Insights](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Log Analytics](./migrate-monitor-log-analytics.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Network Watcher](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Network Watcher: Traffic Analytics](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Policy  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure portal  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Resource Graph  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| Azure Traffic Manager  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Cost Management | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Graph  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Media

| **Product**   | **Reliability**   |
| --- | --- |
| Azure Content Delivery Network  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Migration

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| Microsoft Cost Management | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Mobile

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Maps  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Networking

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Bastion](../bastion/bastion-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| Azure Content Delivery Network  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure DDoS Protection](./reliability-ddos.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure DNS  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure DNS: Azure DNS Private Zones](../dns/private-dns-getstarted-portal.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure DNS: Azure DNS Private Resolver](../dns/dns-private-resolver-get-started-portal.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure Firewall](../firewall/deploy-availability-zone-powershell.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Front Door  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Load Balancer](reliability-load-balancer.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure NAT Gateway](../nat-gateway/nat-availability-zones.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Network Watcher](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Network Watcher: Traffic Analytics](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Peering Service  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Public IP](../virtual-network/ip-services/public-ip-addresses.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Private Link](../private-link/private-link-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Route Server](../route-server/route-server-faq.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Traffic Manager  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Virtual Network](../virtual-network/virtual-networks-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#virtual-networks-and-availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Virtual WAN](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Virtual WAN: [Azure ExpressRoute](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Virtual WAN: [Point-to-site VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Virtual WAN: [Site-to-site VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Security

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Bastion](../bastion/bastion-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure DDoS Protection](./reliability-ddos.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Disk Encryption](/azure/virtual-machines/disks-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Firewall](../firewall/deploy-availability-zone-powershell.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Front Door  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Information Protection  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Key Vault](/azure/key-vault/general/disaster-recovery-guidance) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Customer Lockbox for Microsoft Azure  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Defender for Cloud  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Defender for Identity  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Microsoft Defender for IoT  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Microsoft Sentinel  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |

### Storage

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure Backup](reliability-backup.md#availability-zone-support)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure HPC Cache](../hpc-cache/hpc-cache-overview.md) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure NetApp Files](../azure-netapp-files/use-availability-zones.md) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Storage account](migrate-storage.md)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage: Azure Data Lake Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure Storage: Disk Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage: Blob Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure Storage: Files Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage: Managed Disks](/azure/virtual-machines/disks-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| Azure Storage: Ultra Disk | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |

### Web

| **Product**   | **Reliability**   |
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service: App Service Environment](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Content Delivery Network  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| Azure Maps  | ![An icon that signifies this service is always available.](media/icon-always-available.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure SignalR Service](../azure-signalr/availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Web PubSub](../azure-web-pubsub/concept-availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

## Next steps

- [Azure regions with availability zones](availability-zones-region-support.md)

- [Availability zone migration guidance overview](availability-zones-migration-overview.md)

- [Availability of service by category](availability-service-by-category.md)

- [Well-architected Framework: Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview)
