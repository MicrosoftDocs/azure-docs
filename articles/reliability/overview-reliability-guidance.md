---
title: Azure service reliability guides
description: Reliability guides for Microsoft Azure products and services. View Azure service specific reliability guides.
author: anaharris-ms
ms.service: azure
ms.topic: reliability-article
ms.date: 01/28/2025
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# Reliability guides by service

While Azure provides a set of reliability features, the resiliency of your workload is a [shared responsibility between you and Microsoft](./concept-shared-responsibility.md) and depends on how you have designed your business continuity plan to define your expectations for reliability. For this reason, it's important that you understand the reliability features of each service you use, and how to best implement them in your workload. This document provides links to the reliability guidance for each Azure service, detailing how each service supports your reliability requirements through its features and design.

Each service guide generally contains information on how the service supports:

- *Availability zones* such as zonal and zone-redundant deployment options, traffic routing and data replication between zones, what happens if a zone experiences an outage, failback, and how to configure your resources for availability zone support.
- *Multi-region support* such as how to configure multi-region or geo-disaster support, traffic routing and data replication between regions, region-down experience, failover and failback support, alternative multi-region support.
- *Backup support* such as who controls backups, where they are stored, how they can be recovered, and whether they are accessible only within a region or across regions.


>[!NOTE]
>Some service documents are in the process of, or are not yet updated into a single reliability guide format. These may contain more than one document that references reliability guidance.

## AI and machine learning

| Product| Guidance |
|----------|---------|
|Azure AI Health Insights| [Reliability in Azure AI Health Insights](reliability-health-insights.md)|
|Azure AI Search| [Reliability in Azure AI Search](/azure/search/search-reliability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Bot Service | [Reliability in Azure Bot Service ](reliability-bot.md)|
|Azure Machine Learning Service| [Failover for business continuity and disaster recovery](/azure/machine-learning/how-to-high-availability-machine-learning?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
 
## Analytics

| Product| Guidance |
|----------|---------|
|Azure HDInsight| [Reliability in Azure HDInsight](reliability-hdinsight.md)|
|Azure Machine Learning Service| [Failover for business continuity and disaster recovery](/azure/machine-learning/how-to-high-availability-machine-learning?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Stream Analytics| [Achieve geo-redundancy for Azure Stream Analytics jobs](../stream-analytics/geo-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Event Hubs| [Reliability in Azure Event Hubs](reliability-event-hubs.md)|
|Azure Data Explorer| [Business continuity and disaster recovery overview](/azure/data-explorer/business-continuity-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Data Share| [Disaster recovery for Azure Data Share](../data-share/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Chaos Studio| [Reliability in Azure Chaos Studio](reliability-chaos-studio.md)|
|Microsoft Fabric| [Reliability in Microsoft Fabric](reliability-fabric.md)|
|Microsoft Purview| [Reliability in Microsoft Purview](reliability-microsoft-purview.md)|

## Compute

| Product| Guidance |
|----------|---------|
|Azure App Service| [Reliability in Azure App Service](reliability-app-service.md)|
|Azure Batch| [Reliability in Azure Batch](reliability-batch.md)|
|Azure Container Apps| [Reliability in Azure Container Apps](reliability-azure-container-apps.md)|
|Azure Container Instances| [Reliability in Azure Container Instances](reliability-containers.md)|
|Azure Functions|  [Reliability in Azure Functions ](reliability-functions.md)|
|Azure Kubernetes Service (AKS)| [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [High availability and disaster recovery overview for Azure Kubernetes Service (AKS)](/azure/aks/ha-dr-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Service Fabric| [Deploy an Azure Service Fabric cluster across Availability Zones](/azure/service-fabric/service-fabric-cross-availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery in Azure Service Fabric](/azure/service-fabric/service-fabric-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Spring Apps| [Reliability in Azure Spring Apps](reliability-spring-apps.md)|
|Azure Virtual Machines| [Reliability in Azure Virtual Machines](reliability-virtual-machines.md)|
|Azure Virtual Machine Image Builder| [Reliability in Azure Virtual Machine Image Builder](reliability-image-builder.md)|
|Azure Virtual Machine Scale Sets| [Reliability in Azure Virtual Machine Scale Sets](reliability-virtual-machine-scale-sets.md)|
|Azure VMware Solution| [Deploy disaster recovery using VMware HCX](../azure-vmware/deploy-disaster-recovery-using-vmware-hcx.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
 

## Containers

| Product| Guidance |
|----------|---------|
|Azure App Configuration|[How does App Configuration ensure high data availability?](../azure-app-configuration/faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-does-app-configuration-ensure-high-data-availability) </p> [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=core2x)|
|Azure Container Apps| [Reliability in Azure Container Apps](reliability-azure-container-apps.md)|
|Azure Container Instances| [Reliability in Azure Container Instances](reliability-containers.md)|
|Azure Container Registry|[Enable zone redundancy in Azure Container Registry for resiliency and high availability](/azure/container-registry/zone-redundancy?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication) |
|Azure Kubernetes Service (AKS)| [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [High availability and disaster recovery overview for Azure Kubernetes Service (AKS)](/azure/aks/ha-dr-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Service Fabric| [Deploy an Azure Service Fabric cluster across Availability Zones](/azure/service-fabric/service-fabric-cross-availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery in Azure Service Fabric](/azure/service-fabric/service-fabric-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |

## Databases

 
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

## Developer tools

| Product| Guidance |
|----------|---------|
|Azure API Center| [Reliability in Azure API Center](reliability-api-center.md) |


## DevOps

| Product| Guidance |
|----------|---------|
|Azure Deployment Environments| [Reliability in Azure Deployment Environments](reliability-deployment-environments.md)|
|Azure DevOps| [Data availability](/azure/devops/organizations/security/data-protection?view=azure-devops&branch=main&preserve-view=true#data-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Monitor-Log Analytics |[Enhance data and service resilience in Azure Monitor Logs with availability zones](/azure/azure-monitor/logs/availability-zones) </p> [Log Analytics workspace replication](/azure/azure-monitor/logs/workspace-replication) | 

## Hybrid + multicloud

| Product| Guidance |
|----------|---------|
|Azure Operator Nexus| [Reliability in Azure Operator Nexus](reliability-operator-nexus.md)|

## Industry solutions

| Product| Guidance |
|----------|---------|
|Microsoft Community Training| [Reliability in Microsoft Community Training](reliability-community-training.md) |
|Sustainability Data Solutions in Fabric | [Reliability in Sustainability Data Solutions in Fabric](reliability-sustainability-data-solutions-fabric.md) |

## Integration

| Product| Guidance |
|----------|---------|
|Azure API for FHIR®|[Disaster recovery for Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure API Management|[Ensure API Management availability and reliability](../api-management/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p>[How to implement disaster recovery using service backup and restore](../api-management/api-management-howto-disaster-recovery-backup-restore.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Data Manager for Energy| [Reliability in Azure Data Manager for Energy](reliability-energy-data-services.md)|
| Azure Data Factory| [Azure Data Factory data redundancy](../data-factory/concepts-data-redundancy.md?bc=%2fazure%2freliability%2fbreadcrumb%2ftoc.json&toc=%2fazure%2freliability%2ftoc.json) |
|Azure Event Grid| [Reliability in Azure Event Grid](./reliability-event-grid.md)|
|Azure Functions|  [Reliability in Azure Functions ](reliability-functions.md)|
|Azure Health Data Services: De-identification service (preview)|[Reliability in Azure Health Data Services: De-Identification service](reliability-health-data-services-deidentification.md)|
| Azure Health Data Services: Workspace services (FHIR®, DICOM®, MedTech) | [Business continuity and disaster recovery considerations](/azure/healthcare-apis/business-continuity-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Logic Apps|[Reliability in Azure Logic Apps](reliability-logic-apps.md) |
|Azure Service Bus| [Best practices for insulating applications against Service Bus outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|


## Internet of Things

| Product| Guidance |
|----------|---------|
|Azure Device Registry |[Reliability in Azure Device Registry](reliability-device-registry.md)|
|Azure IoT Hub| [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#disable-disaster-recovery) |
|Azure Notification Hubs| [Reliability in Azure Notification Hubs](reliability-notification-hubs.md)|


## Media


| Product| Guidance |
|----------|---------|
Azure Media Services| [High Availability with Media Services and Video on Demand (VOD)](/azure/media-services/latest/architecture-high-availability-encoding-concept?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|


## Management and governance

| Product| Guidance |
|----------|---------|
|Azure Backup| [Reliability in Azure Backup](reliability-backup.md)|
|Azure Guest Configuration|[Azure Guest Configuration Availability](../governance/machine-configuration/overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability) |
|Azure Monitor-Log Analytics |[Enhance data and service resilience in Azure Monitor Logs with availability zones](/azure/azure-monitor/logs/availability-zones) </p> [Log Analytics workspace replication](/azure/azure-monitor/logs/workspace-replication) | 
|Azure Site Recovery| [Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|


## Migration

| Product| Guidance |
|----------|---------|
|Azure Migrate | [Does Azure Migrate offer Backup and Disaster Recovery?](../migrate/resources-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#does-azure-migrate-offer-backup-and-disaster-recovery)|
|Azure Site Recovery|[Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |

## Networking

| Product| Guidance |
|----------|---------|
|Azure Application Gateway (V2)|[Autoscaling and High Availability](../application-gateway/application-gateway-autoscaling-zone-redundant.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Application Gateway for Containers| [Reliability in Azure Application Gateway for Containers](reliability-app-gateway-containers.md )    |
|Azure Bastion| [Reliability in Azure Bastion](reliability-bastion.md)|
|Azure Communications Gateway| [Reliability in Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure DNS| [Reliability in Azure DNS ](reliability-dns.md)|
|Azure DDoS Protection| [Reliability in Azure DDoS Protection](reliability-ddos.md)|
|Azure ExpressRoute| [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p>[Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Firewall| [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Load Balancer| [Reliability in Azure Load Balancer](reliability-load-balancer.md )|
|Azure Network Watcher| [Azure Network Watcher service availability and redundancy](../network-watcher/frequently-asked-questions.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#service-availability-and-redundancy)|
|Azure Private Link| [Azure Private Link availability](../private-link/availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)   |
|Azure Public IP| [Azure Public IP Availability Zone](../virtual-network/ip-services/public-ip-addresses.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zone) |
|Azure Route Server| [Azure Route Server frequently asked questions (FAQ)](../route-server/route-server-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Traffic Manager| [Reliability in Azure Traffic Manager](reliability-traffic-manager.md)|
|Azure Virtual Network| [Virtual networks and availability zones](../virtual-network/virtual-networks-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#virtual-networks-and-availability-zones)</p> [Virtual Network – Business Continuity](../virtual-network/virtual-network-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#business-continuity) |
|Azure Virtual WAN|[How are Availability Zones and resiliency handled in Virtual WAN?](../virtual-wan/virtual-wan-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)</p> [Disaster recovery design](/azure/virtual-wan/disaster-recovery-design) |
|Azure VPN Gateway| [About zone-redundant virtual network gateway in Azure availability zones](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)</p>[Highly Available cross-premises and VNet-to-VNet connectivity](../vpn-gateway/vpn-gateway-highlyavailable.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Private 5G Core|[Reliability in Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Web Application Firewall | [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [How do I achieve a disaster recovery scenario across datacenters by using Application Gateway?](../application-gateway/application-gateway-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway)|


## Security

| Product| Guidance |
|----------|---------|
|Azure Disk Encryption| [Redundancy options for managed disks](/azure/virtual-machines/disks-redundancy?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Firewall| [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Key Vault| [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Web Application Firewall | [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [How do I achieve a disaster recovery scenario across datacenters by using Application Gateway?](../application-gateway/application-gateway-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway)|


## Storage

| Product| Guidance |
|----------|---------|
|Azure Backup| [Reliability in Azure Backup](reliability-backup.md)|
|Azure Blob Storage|[Choose the right redundancy option](/azure/storage/common/storage-disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#choose-the-right-redundancy-option)</p>[Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Databox| [How can I recover my data if an entire region fails?](../databox/data-box-disk-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-can-i-recover-my-data-if-an-entire-region-fails-)|
|Azure Elastic SAN| [Reliability in Azure Elastic SAN](reliability-elastic-san.md)|
|Azure NetApp Files| [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md?toc=/azure.reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Storage Actions|[Reliability in Azure Storage Actions](reliability-storage-actions.md)|
|Azure Storage-Disk Storage| [Best practices for achieving high availability with Azure virtual machines and managed disks](/azure/virtual-machines/disks-high-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Storage Mover| [Reliability in Azure Storage Mover](reliability-azure-storage-mover.md)|


## Web

| Product| Guidance |
|----------|---------|
|Azure AI Search| [Reliability in Azure AI Search](/azure/search/search-reliability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure API Management|[Ensure API Management availability and reliability](../api-management/high-availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [How to implement disaster recovery using service backup and restore](../api-management/api-management-howto-disaster-recovery-backup-restore.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure App Service| [Reliability in Azure App Service](reliability-app-service.md)|
|Azure Container Apps| [Reliability in Azure Container Apps](reliability-azure-container-apps.md)|
|Azure Notification Hubs| [Reliability in Azure Notification Hubs](reliability-notification-hubs.md)|
|Azure SignalR Service| [Resiliency and disaster recovery in Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|


## Related content


- [Azure services with availability zones](availability-zones-service-support.md)
- [Azure regions with availability zones](availability-zones-region-support.md)
- [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
