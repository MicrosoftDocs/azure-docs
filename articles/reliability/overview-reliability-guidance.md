---
title: Reliability guidance overview for Microsoft Azure products and services
description: Reliability guidance overview for Microsoft Azure products and services. View Azure service specific reliability guides and Azure Service Manager Retirement guides.
author: anaharris-ms
ms.service: reliability
ms.topic: reliability-article
ms.date: 03/31/2023
ms.author: anaharris
ms.custom: subject-reliability
---

# Reliability guidance overview 

Azure reliability guidance contains the following:

- **Service-specific reliability guides**. Each guide can cover both intra-regional resiliency with [availability zones](availability-zones-overview.md) and information on [cross-region resiliency with disaster recovery](cross-region-replication-azure.md). 
For a more detailed overview of reliability principles in Azure, see [Reliability in Microsoft Azure Well-Architected Framework](/azure/architecture/framework/resiliency/).

- **Azure Service Manager (ASM) Retirement guides**. ASM is the old control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations, and has been in use since 2011. ASM is retiring in August 2024, and customers can now migrate to [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview). ARM provides a management layer that enables you to create, update, and delete resources in your Azure account. You can use management features like access control, locks, and tags to secure and organize your resources after deployment.

## Azure services reliability guides

### ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services 

| Product| Availability zone guide | Disaster recovery guide |
|----------|----------|----------|
|Azure Cosmos DB|[Achieve high availability](../cosmos-db/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Configure multi-region writes](../cosmos-db/nosql/how-to-multi-master.md?tabs=api-async&?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Event Hubs| [Availability Zones](../event-hubs/event-hubs-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zones)| [Geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure ExpressRoute| [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Key Vault|[Azure Key Vault failover within a region](../key-vault/general/disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#failover-within-a-region)| [Azure Key Vault](../key-vault/general/disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#failover-across-regions) |
|Azure Load Balancer|[Reliability in Load Balancer](./reliability-load-balancer.md)| [Reliability in Load Balancer](./reliability-load-balancer.md)|
|Azure Public IP|[Azure Public IP - Availability zones](../virtual-network/ip-services/public-ip-addresses.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zone)| [Azure Public IP: Cross-region overview](../load-balancer/cross-region-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Service Bus|[Azure Service Bus - Availability zones](../service-bus-messaging/service-bus-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zones)| [Azure Service Bus Geo-disaster recovery](../service-bus-messaging/service-bus-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Service Fabric| [Deploy an Azure Service Fabric cluster across Availability Zones](../service-fabric/service-fabric-cross-availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Disaster recovery in Azure Service Fabric](../service-fabric/service-fabric-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Site Recovery|| [Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure SQL|[Azure SQL - High availability](/azure/azure-sql/database/high-availability-sla?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Azure SQL - Recovery using backup and restore](/azure/azure-sql/database/recovery-using-backups#geo-restore) |
|Azure SQL-Managed Instance|| [Azure SQL-Managed Instance](/azure/azure-sql/database/auto-failover-group-sql-db?tabs=azure-powershell) |
|Azure Storage-Disk Storage||[Create an incremental snapshot for managed disks](../virtual-machines/disks-incremental-snapshots.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Storage Mover| [Reliability in Azure Storage Mover](reliability-azure-storage-mover.md)|[Reliability in Azure Storage Mover](reliability-azure-storage-mover.md)|
|Azure Virtual Machine Scale Sets|[Azure Virtual Machine Scale Sets](reliability-virtual-machine-scale-sets.md)||
|Azure Virtual Machines|[Reliability in Virtual Machines](reliability-virtual-machines.md)|[Reliability in Virtual Machines](reliability-virtual-machines.md)|
|Azure Virtual Machines Image Builder| [Reliability in Azure Image Builder (AIB)](reliability-image-builder.md)|  [Reliability in Azure Image Builder (AIB)](reliability-image-builder.md)|
|Azure Virtual Network| [Create a zone-redundant virtual network gateway in Azure Availability Zones](../vpn-gateway/create-zone-redundant-vnet-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Virtual Network – Business Continuity](../virtual-network/virtual-network-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#business-continuity) |
|Azure VPN Gateway| [About zone-redundant virtual network gateway in Azure availability zones](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Highly Available cross-premises and VNet-to-VNet connectivity](../vpn-gateway/vpn-gateway-highlyavailable.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |



### ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services

| Product| Availability zone guide | Disaster recovery guide |
|----------|----------|----------|
|Azure AI Search|[Azure AI Search](../search/search-reliability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Azure AI Search](../search/search-reliability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure API Management|[Ensure API Management availability and reliability](../api-management/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [How to implement disaster recovery using service backup and restore](../api-management/api-management-howto-disaster-recovery-backup-restore.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure App Configuration|[How does App Configuration ensure high data availability?](../azure-app-configuration/faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-does-app-configuration-ensure-high-data-availability)| [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=core2x)|
|Azure App Service|[Azure App Service](./reliability-app-service.md)| [Azure App Service](reliability-app-service.md#cross-region-disaster-recovery-and-business-continuity)|
|Azure Application Gateway (V2)|[Autoscaling and High Availability)](../application-gateway/application-gateway-autoscaling-zone-redundant.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)||         
|Azure Backup|[Reliability in Azure Backup](reliability-backup.md)| [Reliability in Azure Backup](reliability-backup.md) |
|Azure Bastion||[How do I incorporate Azure Bastion in my Disaster Recovery plan?](../bastion/bastion-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#dr) |
|Azure Batch|[Reliability in Azure Batch](reliability-batch.md)| [Reliability in Azure Batch](reliability-batch.md#cross-region-disaster-recovery-and-business-continuity) |
|Azure Cache for Redis|[Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Configure passive geo-replication for Premium Azure Cache for Redis instances](../azure-cache-for-redis/cache-how-to-geo-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Communications Gateway|[Reliability in Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Reliability in Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Container Apps|[Reliability in Azure Container Apps](reliability-azure-container-apps.md)|[Reliability in Azure Container Apps](reliability-azure-container-apps.md)|
|Azure Container Instances|[Reliability in Azure Container Instances](reliability-containers.md)| [Reliability in Azure Container Instances](reliability-containers.md#disaster-recovery) |
|Azure Container Registry|[Enable zone redundancy in Azure Container Registry for resiliency and high availability](../container-registry/zone-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Data Explorer|[Azure Data Explorer - Create cluster database](/azure/data-explorer/create-cluster-database-portal?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Azure Data Explorer - Business continuity](/azure/data-explorer/business-continuity-overview) |
|Azure Data Factory|[Azure Data Factory data redundancy](../data-factory/concepts-data-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)||
|Azure Database for MySQL|| [Azure Database for MySQL- Business continuity](/azure/mysql/single-server/concepts-business-continuity?#recover-from-an-azure-regional-data-center-outage) |
|Azure Database for MySQL - Flexible Server|[Azure Database for MySQL Flexible Server High availability](../mysql/flexible-server/concepts-high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Azure Database for MySQL Flexible Server - Restore to latest restore point](/azure/mysql/flexible-server/how-to-restore-server-portal?#geo-restore-to-latest-restore-point) |
|Azure Database for PostgreSQL - Flexible Server|[Azure Database for PostgreSQL - Flexible Server](./reliability-postgresql-flexible-server.md)|[Azure Database for PostgreSQL - Flexible Server](reliability-postgre-flexible.md#cross-region-disaster-recovery-and-business-continuity) |
|Azure DDoS Protection|[Reliability in DDoS Protection](reliability-ddos.md)|[Reliability in DDoS Protection](reliability-ddos.md) |
|Azure Disk Encryption|[Redundancy options for managed disks](../virtual-machines/disks-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)||
|Azure DNS|[Reliability in Azure DNS](reliability-dns.md)|[Reliability in Azure DNS](reliability-dns.md)|
|Microsoft Entra Domain Services|| [Create replica set](../active-directory-domain-services/tutorial-create-replica-set.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Event Grid|[In-region recovery using availability zones and geo-disaster recovery across regions](../event-grid/availability-zones-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [In-region recovery using availability zones and geo-disaster recovery across regions](../event-grid/availability-zones-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Firewall|[Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)||
|Azure Firewall Manager|[Create an Azure Firewall and a firewall policy - ARM template](../firewall-manager/quick-firewall-policy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Functions|[Azure Functions](reliability-functions.md)| [Azure Functions](reliability-functions.md#cross-region-disaster-recovery-and-business-continuity) |
|Azure Guest Configuration| |[Azure Guest Configuration Availability](../governance/machine-configuration/overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json?#availability) |
|Azure HDInsight|[Reliability in Azure HDInsight](reliability-hdinsight.md)| [Reliability in Azure HDInsight](reliability-hdinsight.md#cross-region-disaster-recovery-and-business-continuity) |
|Azure Image Builder|[Reliability in Azure Image Builder](reliability-image-builder.md)|[Reliability inAzure Image Builder](reliability-image-builder.md)|
|Azure Kubernetes Service (AKS)|[Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](../aks/availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](../aks/operator-best-practices-multi-region.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Logic Apps|[Protect logic apps from region failures with zone redundancy and availability zones](../logic-apps/set-up-zone-redundancy-availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Business continuity and disaster recovery for Azure Logic Apps](../logic-apps/business-continuity-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Media Services||[High Availability with Media Services and Video on Demand (VOD)](/azure/media-services/latest/architecture-high-availability-encoding-concept) |
|Azure Migrate|| [Does Azure Migrate offer Backup and Disaster Recovery?](../migrate/resources-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#does-azure-migrate-offer-backup-and-disaster-recovery) |
|Azure Monitor - Application Insights|[Continuous export advanced storage configuration](../azure-monitor/app/export-telemetry.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#continuous-export-advanced-storage-configuration) |
|Azure Monitor-Log Analytics |[Enhance data and service resilience in Azure Monitor Logs with availability zones](../azure-monitor/logs/availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [Enable data export](../azure-monitor/logs/logs-data-export.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#enable-data-export) | 
|Azure Network Watcher|[Service availability and redundancy](../network-watcher/frequently-asked-questions.yml?bc=%2fazure%2freliability%2fbreadcrumb%2ftoc.json&toc=%2fazure%2freliability%2ftoc.json#service-availability-and-redundancy)||
|Azure Notification Hubs|[Reliability Azure Notification Hubs](reliability-notification-hubs.md)|[Reliability Azure Notification Hubs](reliability-notification-hubs.md)|
|Azure Operator Nexus|[Reliability in Azure Operator Nexus](reliability-operator-nexus.md)|[Reliability in Azure Operator Nexus](reliability-operator-nexus.md)|
|Azure Private Link|[Azure Private Link availability](../private-link/availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)||
|Azure Route Server|[Azure Route Server FAQ](../route-server/route-server-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure SQL Server Registry|| [What are Extended Security Updates for SQL Server?](/sql/sql-server/end-of-support/sql-server-extended-security-updates?preserve-view=true&view=sql-server-ver15#configure-regional-redundancy) |
|Azure Storage - Blob Storage|[Choose the right redundancy option](../storage/common/storage-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#choose-the-right-redundancy-option)|[Azure storage disaster recovery planning and failover](../storage/common/storage-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Stream Analytics|| [Achieve geo-redundancy for Azure Stream Analytics jobs](../stream-analytics/geo-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Virtual WAN|[How are Availability Zones and resiliency handled in Virtual WAN?](../virtual-wan/virtual-wan-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)| [Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Web Application Firewall|[Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[How do I achieve a disaster recovery scenario across datacenters by using Application Gateway?](../application-gateway/application-gateway-faq.yml?#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway) |
  
### ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic services

| Product| Availability zone guide | Disaster recovery guide |
|-------|-------|-------|
|Azure Application Gateway for Containers | [Reliability in Azure Application Gateway for Containers](reliability-app-gateway-containers.md) | [Reliability in Azure Application Gateway for Containers](reliability-app-gateway-containers.md)|
|Azure Chaos Studio | [Reliability in Azure Chaos Studio](reliability-chaos-studio.md)| [Reliability in Azure Chaos Studio](reliability-chaos-studio.md)|
|Azure Community Training|[Reliability in Community Training](reliability-community-training.md) |[Reliability in Community Training](reliability-community-training.md) |
|Azure Cosmos DB for MongoDB vCore|[Reliability in Azure Cosmos DB for MongoDB vCore](./reliability-cosmos-mongodb.md)|[Reliability in Azure Cosmos DB for MongoDB vCore](./reliability-cosmos-mongodb.md) |
|Azure Databox| |[Microsoft Azure Data Box Disk FAQ](../databox/data-box-disk-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-can-i-recover-my-data-if-an-entire-region-fails-) |
|Azure Data Manager for Energy| [Reliability in Azure Data Manager for Energy](./reliability-energy-data-services.md) |[Reliability in Azure Data Manager for Energy](./reliability-energy-data-services.md) |
|Azure Data Share| |[Disaster recovery for Azure Data Share](../data-share/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Deployment Environments| [Reliability in Azure Deployment Environments](reliability-deployment-environments.md)|[Reliability in Azure Deployment Environments](reliability-deployment-environments.md)|
|Azure DevOps|| [Azure DevOps Data protection - data availability](/azure/devops/organizations/security/data-protection?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&preserve-view=true&#data-availability)|
|Azure Elastic SAN|[Availability zone support](reliability-elastic-san.md#availability-zone-support)|[Disaster recovery and business continuity](reliability-elastic-san.md#disaster-recovery-and-business-continuity)|
|Azure Health Data Services - Azure API for FHIR|| [Disaster recovery for Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Health Insights|[Reliability in Azure Health Insights](reliability-health-insights.md)|[Reliability in Azure Health Insights](reliability-health-insights.md)|
|Azure IoT Hub| [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Machine Learning Service|| [Failover for business continuity and disaster recovery](../machine-learning/v1/how-to-high-availability-machine-learning.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure NetApp Files|| [Manage disaster recovery using cross-region replication](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Private 5G Core|[Reliability for Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Reliability for Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure SignalR Service|| [Resiliency and disaster recovery in Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Spring Apps|[Reliability in Azure Spring Apps](reliability-spring-apps.md) |[Reliability in Azure Spring Apps](reliability-spring-apps.md)|
|Azure Storage Mover|[Reliability in Azure Storage Mover](./reliability-azure-storage-mover.md)|[Reliability in Azure Storage Mover](./reliability-azure-storage-mover.md)|
|Azure VMware Solution|| [Azure VMware disaster recovery for virtual machines](../azure-vmware/disaster-recovery-for-virtual-machines.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Microsoft Defender for Cloud DevOps security|[Reliability in Microsoft Defender for Cloud DevOps security](./reliability-defender-devops.md)|[Reliability in Microsoft Defender for Cloud DevOps security](./reliability-defender-devops.md)|
|Microsoft Fabric|[Microsoft Fabric](reliability-fabric.md) |[Microsoft Fabric](reliability-fabric.md)|
|Microsoft Purview|[Reliability for Microsoft Purview](reliability-fabric.md) |[Disaster recovery for Microsoft Purview](/purview/concept-best-practices-migration#implementation-steps)|


### ![An icon that signifies this service is non-regional.](media/icon-always-available.svg) Non-regional services (always-available services)

| Product| Availability zone guide | Disaster recovery guide |
|-------|-------|-------|
|Azure Bot Service|[Reliability in Azure Bot Service](reliability-bot.md)|[Reliability in Azure Bot Service](reliability-bot.md)|
|Azure Traffic Manager|[Reliability in Azure Traffic Manager](reliability-traffic-manager.md)|[Reliability in Azure Traffic Manager](reliability-traffic-manager.md)|


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
