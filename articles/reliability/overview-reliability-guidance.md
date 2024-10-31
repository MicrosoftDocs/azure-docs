---
title: Reliability guidance overview for Microsoft Azure products and services
description: Reliability guidance overview for Microsoft Azure products and services. View Azure service specific reliability guides and Azure Service Manager Retirement guides.
author: anaharris-ms
ms.service: azure
ms.topic: reliability-article
ms.date: 10/31/2024
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# Reliability guides overview

This article provides an overview of reliability guidance for Microsoft Azure products and services. The reliability guidance includes service specific information about availability zones, disaster recovery, and high availability. The guidance is organized by service category and includes links to service-specific reliability documents.

Below is a list of Azure services with links to their respective reliability documents. The documents are organized by service category.

>[!NOTE]
>Some service documents are in the process of, or are not yet updated into a single reliability document format. These may contain more than one document that references reliability guidance.

### AI and machine learning

| Product| Guidance |
|----------|---------|
|Azure Bot Service | [Reliability in Azure Bot Service ](reliability-bot.md)|
|Azure AI Search| [Reliability in Azure AI Search](/azure/search/search-reliability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Machine Learning Service| [Failover for business continuity and disaster recovery](/azure/machine-learning/how-to-high-availability-machine-learning?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
 
### Analytics

| Product| Guidance |
|----------|---------|
|Azure HDInsight| [Reliability in Azure HDInsight](reliability-hdinsight.md)|
|Azure HDInsight on AKS| [Reliability in Azure HDInsight on AKS](reliability-hdinsight-on-aks.md)|
|Azure Machine Learning Service| [Failover for business continuity and disaster recovery](/azure/machine-learning/how-to-high-availability-machine-learning?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Stream Analytics| [Achieve geo-redundancy for Azure Stream Analytics jobs](../stream-analytics/geo-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Event Hubs| [Reliability in Azure Event Hubs](reliability-event-hubs.md)|
|Azure Data Explorer| [Business continuity and disaster recovery overview](/azure/data-explorer/business-continuity-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Data Share| [Disaster recovery for Azure Data Share](../data-share/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Chaos Studio| [Reliability in Azure Chaos Studio](reliability-chaos-studio.md)|
|Microsoft Fabric| [Reliability in Microsoft Fabric](reliability-fabric.md)|
|Microsoft Purview| [Reliability in Microsoft Purview](reliability-microsoft-purview.md)|

### Compute

| Product| Guidance |
|----------|---------|
|Azure App Service| [Reliability in Azure App Service](reliability-app-service.md)|
|Azure Batch| [Reliability in Azure Batch](reliability-batch.md)|
|Azure Container Apps| [Reliability in Azure Container Apps](reliability-azure-container-apps.md)|
|Azure Container Instances| [Reliability in Azure Container Instances](reliability-containers.md)|
|Azure Functions|  [Reliability in Azure Functions ](reliability-functions.md)|
|Azure Kubernetes Service (AKS)| [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [High availability and disaster recovery overview for Azure Kubernetes Service (AKS)](azure/aks/ha-dr-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Service Fabric| [Deploy an Azure Service Fabric cluster across Availability Zones](/azure/service-fabric/service-fabric-cross-availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery in Azure Service Fabric](/azure/service-fabric/service-fabric-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Spring Apps| [Reliability in Azure Spring Apps](reliability-spring-apps.md)|
|Azure Virtual Machines| [Reliability in Azure Virtual Machines](reliability-virtual-machines.md)|
|Azure Virtual Machine Image Builder| [Reliability in Azure Virtual Machine Image Builder](reliability-image-builder.md)|
|Azure Virtual Machine Scale Sets| [Reliability in Azure Virtual Machine Scale Sets](reliability-virtual-machine-scale-sets.md)|
  

### Containers

| Product| Guidance |
|----------|---------|
|Azure App Configuration|[How does App Configuration ensure high data availability?](../azure-app-configuration/faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-does-app-configuration-ensure-high-data-availability) </p> [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=core2x)|
|Azure Container Apps| [Reliability in Azure Container Apps](reliability-azure-container-apps.md)|
|Azure Container Instances| [Reliability in Azure Container Instances](reliability-containers.md)|
|Azure Container Registry|[Enable zone redundancy in Azure Container Registry for resiliency and high availability](/azure/container-registry/zone-redundancy?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication) |
|Azure Kubernetes Service (AKS)| [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [High availability and disaster recovery overview for Azure Kubernetes Service (AKS)](azure/aks/ha-dr-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Service Fabric| [Deploy an Azure Service Fabric cluster across Availability Zones](/azure/service-fabric/service-fabric-cross-availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery in Azure Service Fabric](/azure/service-fabric/service-fabric-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |

 ### Databases

 
| Product| Guidance |
|----------|---------|
|Azure SQL|[Azure SQL - High availability](/azure/azure-sql/database/high-availability-sla?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery guidance - Azure SQL Database](/azure/azure-sql/database/disaster-recovery-guidance) |
|Azure SQL-Managed Instance| [Failover groups overview & best practices - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-sql-mi?view=azuresql&preserve-view=true) |
|Azure Database for MySQL| [Overview of business continuity with Azure Database for MySQL - Single Server](/azure/mysql/single-server/concepts-business-continuity?#recover-from-an-azure-regional-data-center-outage) |
|Azure Database for MySQL - Flexible Server|[Azure Database for MySQL Flexible Server High availability](/azure/mysql/flexible-server/concepts-high-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p>[Azure Database for MySQL Flexible Server - Restore to latest restore point](/azure/mysql/flexible-server/how-to-restore-server-portal?#geo-restore-to-latest-restore-point) |
|Azure Database for PostgreSQL - Flexible Server| [Reliability in Azure Database for PostgreSQL - Flexible Server](reliability-postgresql-flexible-server.md)|
|Azure Cosmos DB for NoSQL| [Reliability in Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md) |
|Azure Cosmos DB for MongoDB vCore| [Reliability in Azure Cosmos DB for MongoDB vCore](reliability-cosmos-mongodb.md)|
|Azure Cache for Redis|[Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Configure passive geo-replication for Premium Azure Cache for Redis instances](../azure-cache-for-redis/cache-how-to-geo-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |

### Developer tools

| Product| Guidance |
|----------|---------|
|Azure API Center| [Reliability in Azure API Center](reliability-api-center.md) |


### DevOps


| Product| Guidance |
|----------|---------|
|Azure Deployment Environments| [Reliability in Azure Deployment Environments](reliability-deployment-environments.md)|
|Azure DevOps| [Data availability](/azure/devops/organizations/security/data-protection?view=azure-devops&branch=main&preserve-view=true#data-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Monitor-Log Analytics |[Enhance data and service resilience in Azure Monitor Logs with availability zones](/azure/azure-monitor/logs/availability-zones) </p> [Log Analytics workspace replication](/azure/azure-monitor/logs/workspace-replication) | 

### Hybrid + multicloud

| Product| Guidance |
|----------|---------|
|Azure Operator Nexus| [Reliability in Azure Operator Nexus](reliability-operator-nexus.md)|


### Integration

| Product| Guidance |
|----------|---------|
 |Azure Event Grid| [Reliability in Azure Event Grid](./reliability-event-grid.md)|
 |Azure Service Bus| [Best practices for insulating applications against Service Bus outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure API Management|[Ensure API Management availability and reliability](../api-management/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [How to implement disaster recovery using service backup and restore](../api-management/api-management-howto-disaster-recovery-backup-restore.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
 | Azure Data Factory| [Azure Data Factory data redundancy](../data-factory/concepts-data-redundancy.md?bc=%2fazure%2freliability%2fbreadcrumb%2ftoc.json&toc=%2fazure%2freliability%2ftoc.json) |
|Azure Functions|  [Reliability in Azure Functions ](reliability-functions.md)|
 |Azure Health Data Services - Azure API for FHIR| [Disaster recovery for Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Reliability in Azure Health Data Services de-identification service||[Reliability in Azure Health Data Services de-identification service](./reliability-health-data-services-deidentification.md)|
|Azure Logic Apps|[Protect logic apps from region failures with zone redundancy and availability zones](../logic-apps/set-up-zone-redundancy-availability-zones.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)</p> [Business continuity and disaster recovery for Azure Logic Apps](../logic-apps/business-continuity-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |

### Internet of Things

| Product| Guidance |
|----------|---------|
|Azure IoT Hub| [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#disable-disaster-recovery) |
|Azure Notification Hubs| [Reliability in Azure Notification Hubs](reliability-notification-hubs.md)|


### Media


| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------| 
|[Azure Media Services](/azure/media-services/latest/architecture-high-availability-encoding-concept?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||


### Management and governance

| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------| 
|[Azure Backup](reliability-backup.md)|||
|Azure Guest Configuration| |[Azure Guest Configuration](../governance/machine-configuration/overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability) |
|Azure Monitor-Log Analytics |[Enhance data and service resilience in Azure Monitor Logs with availability zones](/azure/azure-monitor/logs/availability-zones)| [Log Analytics workspace replication](/azure/azure-monitor/logs/workspace-replication) | 
|Azure Site Recovery|| [Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|


### Migration

| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------|
|Azure Migrate | |[Azure Migrate](../migrate/resources-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#does-azure-migrate-offer-backup-and-disaster-recovery)|
|Azure Site Recovery|| [Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |

### Networking

| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------|
|Azure Application Gateway (V2)|[Autoscaling and High Availability](../application-gateway/application-gateway-autoscaling-zone-redundant.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|[Azure Application Gateway for Containers](reliability-app-gateway-containers.md )    |||
|[Azure Bastion](reliability-bastion.md)|||
|[Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|[Azure DNS ](reliability-dns.md)|
|[Azure DDoS Protection](reliability-ddos.md)|||
|Azure ExpressRoute| [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Azure Firewall](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|[Azure Load Balancer](reliability-load-balancer.md )|||
|[Azure Network Watcher](../network-watcher/frequently-asked-questions.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#service-availability-and-redundancy)|||
|[Azure Private Link](../private-link/availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)   ||| 
|[Azure Public IP](../virtual-network/ip-services/public-ip-addresses.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zone) |||
|[Azure Route Server](../route-server/route-server-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|[Azure Traffic Manager](reliability-traffic-manager.md)|||
|Azure Virtual Network| [Virtual networks and availability zones](../virtual-network/virtual-networks-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#virtual-networks-and-availability-zones)| [Virtual Network – Business Continuity](../virtual-network/virtual-network-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#business-continuity) |
|Azure Virtual WAN|[How are Availability Zones and resiliency handled in Virtual WAN?](../virtual-wan/virtual-wan-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)| [Disaster recovery design](/azure/virtual-wan/disaster-recovery-design) |
|Azure VPN Gateway| [About zone-redundant virtual network gateway in Azure availability zones](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Highly Available cross-premises and VNet-to-VNet connectivity](../vpn-gateway/vpn-gateway-highlyavailable.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Private 5G Core|[Reliability for Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|[Reliability for Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Web Application Firewall | [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | [How do I achieve a disaster recovery scenario across datacenters by using Application Gateway?](../application-gateway/application-gateway-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway)|


### Security

| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------|
|[Azure Disk Encryption ](/azure/virtual-machines/disks-redundancy?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |||
|[Azure Firewall](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |||
|[Azure Key Vault](/azure/key-vault/general/disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |||
|Azure Web Application Firewall | [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) | [How do I achieve a disaster recovery scenario across datacenters by using Application Gateway?](../application-gateway/application-gateway-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway)|


### Storage

| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------|
|[Azure Backup](reliability-backup.md)|||
|[Azure Blob Storage](reliability-blob-storage.md) |[Choose the right redundancy option](azure/storage/common/storage-disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#choose-the-right-redundancy-option)|[Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|[Azure Elastic SAN](reliability-elastic-san.md)|||
|[Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md?toc=/azure.reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|[Azure Storage Actions](reliability-storage-actions.md)|||
|[Azure Storage-Disk Storage](/azure/virtual-machines/disks-high-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|[Azure Storage Mover](reliability-azure-storage-mover.md)|||


### Web


| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------|
|[Azure AI Search](/azure/search/search-reliability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|Azure API Management|[Ensure API Management availability and reliability](../api-management/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)| [How to implement disaster recovery using service backup and restore](../api-management/api-management-howto-disaster-recovery-backup-restore.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|[Azure App Service](reliability-app-service.md)|||
|[Azure Container Apps](reliability-azure-container-apps.md)|||
|[Azure Notification Hubs](reliability-notification-hubs.md)|||
|[Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||


### Other


| Product| Availability zone  | Disaster recovery  |
|----------|----------|----------|
|[Azure Community Training](reliability-community-training.md) |||
|[Azure Databox](../databox/data-box-disk-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-can-i-recover-my-data-if-an-entire-region-fails-)|||
|[Azure Data Manager for Energy](reliability-energy-data-services.md)|||
|[Azure Health Insights ](../reliability/reliability-health-insights.md?toc=/azure/health-insights/toc.json)|||
|[Azure VMware Solution](../azure-vmware/deploy-disaster-recovery-using-vmware-hcx.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|||
|Azure API for FHIR|||[Disaster recovery for Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
 

## Next steps


> [!div class="nextstepaction"]
> [Azure services and regions with availability zones](availability-zones-service-support.md)

> [!div class="nextstepaction"]
> [Availability of service by category](availability-service-by-category.md)

> [!div class="nextstepaction"]
> [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

> [!div class="nextstepaction"]
> [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
