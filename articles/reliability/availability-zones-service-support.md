---
title: Azure services with availability zone support
description: Learn which Azure services offer availability zone support.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 03/25/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Azure services with availability zone support

Azure is continually expanding the number of services that support [availability zones](./availability-zones-overview.md), including both zonal and zone-redundant offerings. This article shows you which services support availability zones, as well as the type of offering they support. 


## Nonregional services     

Some Azure services don't support availability zones because they are:

- Available across multiple Azure regions within a geographic area, or even across all Azure regions globally.
- Resilient to zone-wide outages.
- Resilient to region-wide outages.

For a list of nonregional services, see [Nonregional Azure services](./regions-nonregional-services.md).

## Azure services with availability zone support

The following table provides a list of zonal and zone-redundant Azure services. 

>[!IMPORTANT]
>To learn more about availability zones support and available services in your region, contact your Microsoft sales or customer representative.

### Legend


| Symbol | Description |
|---|---|
|:::image type="content" source="media/icon-zonal.svg"  alt-text="An icon that signifies this service is zonal."  border="false"::: | This service is zonal. |
| :::image type="content"  source="media/icon-zone-redundant.svg"  alt-text="An icon that signifies this service is zone-redundant." border="false"::: | This service is zone-redundant.|


>[!IMPORTANT]
>Some services, although they are zone-redundant, may have limited support for availability zones. For example, some may only support availability zones for certain tiers, regions, or SKUs. To get more information on service limitations for availability zone support, select that service in the following table.


| **Product**   | **Availability zone support**  | 
| --- | --- |
| [Azure AI Search](/azure/search/search-reliability#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Configuration](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure App Service: App Service Environment](./reliability-app-service.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Automation](../automation/automation-availability-zones.md)| ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Backup](reliability-backup.md#availability-zone-support)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Bastion](../bastion/bastion-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Bot Services](../azure-bot-services/overview.md) | ![An icon that signifies this service is always available.](media/icon-non-regional.svg) |
| [Azure Cache for Redis](./migrate-cache-redis.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Container Apps](reliability-azure-container-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Container Instances](migrate-container-instances.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Container Registry](/azure/container-registry/zone-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Data Explorer](/azure/data-explorer/create-cluster-database-portal) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Data Factory](../data-factory/concepts-data-redundancy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Database for MySQL – Flexible Server](/azure/mysql/flexible-server/concepts-high-availability) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Database for PostgreSQL – Flexible Server](./reliability-postgresql-flexible-server.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure DDoS Protection](./reliability-ddos.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Disk Encryption](/azure/virtual-machines/disks-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Event Grid](../event-grid/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Event Hubs](./reliability-event-hubs.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Firewall](../firewall/deploy-availability-zone-powershell.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Firewall Manager](../firewall-manager/quick-firewall-policy.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Functions](./reliability-functions.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure HDInsight](./reliability-hdinsight.md#availability-zone-support) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure HPC Cache](../hpc-cache/hpc-cache-overview.md) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Key Vault](/azure/key-vault/general/disaster-recovery-guidance) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Kubernetes Service (AKS)](reliability-aks.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Load Balancer](reliability-load-balancer.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure Logic Apps](../logic-apps/logic-apps-overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/create-cluster-portal) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor: Application Insights](/azure/azure-monitor/logs/availability-zones)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Monitor Logs](/azure/azure-monitor/logs/availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure NAT Gateway](../nat-gateway/nat-availability-zones.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure NetApp Files](../azure-netapp-files/use-availability-zones.md) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Notification Hubs](reliability-notification-hubs.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Public IP](../virtual-network/ip-services/public-ip-addresses.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Route Server](../route-server/route-server-faq.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Service Bus](../service-bus-messaging/service-bus-outages-disasters.md#availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Service Fabric](/azure/service-fabric/service-fabric-cross-availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure SignalR Service](../azure-signalr/availability-zones.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Site Recovery](migrate-recovery-services-vault.md) | ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| [Azure SQL Database](migrate-sql-database.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure SQL Managed Instance](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql&preserve-view=true) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Spring Apps](reliability-spring-apps.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage account](migrate-storage.md)  | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage: Azure Data Lake Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure Storage: Disk Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage: Blob Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg)  |
| [Azure Storage: Files Storage](migrate-storage.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Storage: Managed Disks](/azure/virtual-machines/disks-redundancy) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal](media/icon-zonal.svg) |
| Azure Storage: Ultra Disk | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Stream Analytics](../stream-analytics/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Virtual Machine Scale Sets](./reliability-virtual-machine-scale-sets.md#availability-zone-support) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Azure Virtual Machines*](./reliability-virtual-machines.md#availability-zone-support) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
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
| [Azure Virtual Network](../virtual-network/virtual-networks-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#virtual-networks-and-availability-zones) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure Virtual WAN](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Azure VMware Solution](../azure-vmware/architecture-private-clouds.md) | ![An icon that signifies this service is zonal.](media/icon-zonal.svg) |
| [Microsoft Defender for Cloud](../defender-for-cloud/overview.md) | ![An icon that signifies this service is always available.](media/icon-non-regional.svg) |
| [Microsoft Defender for Identity](../defender-for-identity/overview.md) | ![An icon that signifies this service is always available.](media/icon-non-regional.svg) |
| [Microsoft Defender for IoT](../defender-for-iot/overview.md) | ![An icon that signifies this service is always available.](media/icon-non-regional.svg) |
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |
| [Microsoft Sentinel](../sentinel/overview.md) | ![An icon that signifies this service is always available.](media/icon-non-regional.svg) |
| [SQL Server on Azure Virtual Machines](/azure/azure-sql/database/high-availability-sla) | ![An icon that signifies this service is zone redundant.](media/icon-zone-redundant.svg) |

\* For more information on older-generation virtual machines, see [Previous generations of virtual machine sizes](/azure/virtual-machines/sizes-previous-gen).


## Next steps

- [List of Azure regions](regions-list.md)

- [Availability zone migration guidance overview](availability-zones-migration-overview.md)

- [Availability of service by category](availability-service-by-category.md)

- [Well-architected Framework: Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview)
