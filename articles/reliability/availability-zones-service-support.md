---
title: Azure services with availability zone support
description: Learn which Azure services offer availability zone support.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 03/24/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Azure services with availability zone support

Azure [availability zones](./availability-zones-overview.md) are physically separate locations within each Azure region. This article shows you which services support availability zones. 

Azure is continually expanding the number of services that support availability zones, including zonal and zone-redundant offerings.

## Azure services with availability zone support

The following tables provide a summary of the current offering of zonal and zone-redundant Azure services. To learn more about zonal and zone-redudant services and how they work, see [Types of availability zone support](./availability-zones-overview.md#types-of-availability-zone-support).

Some Azure services are *nonregional*, which means that you don't deploy the service into a specific Azure region or configure availability zone support. To learn more, see [Nonregional Azure services](./regions-nonregional-services.md).

##### Legend

![Legend containing icons and meaning of each with respect to availability one support of each service in the table.](media/legend.png)

> [!IMPORTANT]
> Even though some services might support availability zones, they might have specific requirements to use them on your resources. For example, some may only support availability zones for certain tiers or regions. To get more information on a service's requirements for availability zone support, select that service in the following table.

### AI and machine learning

| **Product**   | **Availability zone support**  |
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Analytics

| **Product**   | **Availability zone support**    |
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

| **Product**   | **Availability zone support**    |
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

### Containers

| **Product**   | **Availability zone support**    |
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

| **Product**   | **Availability zone support**    |
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

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure API Center](../api-center/overview.md)| ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Application Insights](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### DevOps

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure Monitor Logs](/azure/azure-monitor/logs/availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Hybrid and multicloud

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure Database for PostgreSQL – Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure SQL Database](migrate-sql-database.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Identity

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Integration

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Data Factory](../data-factory/concepts-data-redundancy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Event Grid](../event-grid/overview.md) | ![An icon that signifies this service is zone-redundant](media/icon-zone-redundant.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Logic Apps](../logic-apps/logic-apps-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Service Bus](../service-bus-messaging/service-bus-outages-disasters.md#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Web PubSub](../azure-web-pubsub/concept-availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Internet of Things

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)   |
| [Azure Event Grid](../event-grid/overview.md) | ![An icon that signifies this service is zone-redundant](media/icon-zone-redundant.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Logic Apps](../logic-apps/logic-apps-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Stream Analytics | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |

### Management and governance

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure Automation](../automation/automation-availability-zones.md)| ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Backup](reliability-backup.md#availability-zone-support)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Application Insights](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Log Analytics](./migrate-monitor-log-analytics.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Network Watcher](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Network Watcher: Traffic Analytics](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |

### Migration

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |

### Mobile

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Networking

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Bastion](../bastion/bastion-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure DDoS Protection](./reliability-ddos.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure DNS: Azure DNS Private Zones](../dns/private-dns-getstarted-portal.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure DNS: Azure DNS Private Resolver](../dns/dns-private-resolver-get-started-portal.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure Firewall](../firewall/deploy-availability-zone-powershell.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Load Balancer](reliability-load-balancer.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure NAT Gateway](../nat-gateway/nat-availability-zones.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Network Watcher](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Network Watcher: Traffic Analytics](../network-watcher/frequently-asked-questions.yml) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Public IP](../virtual-network/ip-services/public-ip-addresses.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Private Link](../private-link/private-link-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Route Server](../route-server/route-server-faq.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Virtual Network](../virtual-network/virtual-networks-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#virtual-networks-and-availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Virtual WAN](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Virtual WAN: [Azure ExpressRoute](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Virtual WAN: [Point-to-site VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| Azure Virtual WAN: [Site-to-site VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Security

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Bastion](../bastion/bastion-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure DDoS Protection](./reliability-ddos.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Disk Encryption](/azure/virtual-machines/disks-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Firewall](../firewall/deploy-availability-zone-powershell.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg)  |
| [Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Key Vault](/azure/key-vault/general/disaster-recovery-guidance) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure VPN Gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

### Storage

| **Product**   | **Availability zone support**    |
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

| **Product**   | **Availability zone support**    |
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure API Management](migrate-api-mgt.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service: App Service Environment](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure SignalR Service](../azure-signalr/availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Web PubSub](../azure-web-pubsub/concept-availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

## Next steps

- [Nonregional Azure services](./regions-nonregional-services.md)

- [List of Azure regions](regions-list.md)

- [Availability zone migration guidance overview](availability-zones-migration-overview.md)

- [Availability of service by category](availability-service-by-category.md)

- [Well-architected Framework: Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview)
