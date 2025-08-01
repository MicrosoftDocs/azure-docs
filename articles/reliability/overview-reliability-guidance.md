---
title: Azure service reliability guides
description: Reliability guides for Microsoft Azure products and services. View Azure service specific reliability guides.
author: anaharris-ms
ms.service: azure
ms.topic: reliability-article
ms.date: 03/31/2025
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# Reliability guides by service


This article provides links to reliability guidance for many Azure services.  Most reliability guides contain the following information:

- *Reliability architecture overview* is a synopsis of how the service supports reliability, including information about which components are managed by Microsoft and which are managed by you, any built-in redundancy features, and how to provision and manage multiple resources, if applicable.
- *Transient fault handling* details how the service handles normal day-to-day transient faults that can occur in the cloud and include information on how to handle these faults in your application. This includes information on retry policies, timeouts, and other best practices for handling transient faults.
- *Availability zones* such as zonal and zone-redundant deployment options, traffic routing and data replication between zones, what happens if a zone experiences an outage, failback, and how to configure your resources for availability zone support.
- *Multi-region support* such as how to configure multi-region or geo-disaster support, traffic routing and data replication between regions, region-down experience, failover and failback support, alternative multi-region support.

Some guides also contain information on:

- *Backup support* such as who controls backups, where they are stored and replicated to, how they can be recovered, and whether they are accessible only within a region or across regions.
- *Service level agreements* for availability, including how the expected uptime changes based on the configuration you use.

## Reliability guides by service

This section provides links to reliability guidance for many Azure services. Each service guide contains information on how the service supports reliability features. 

>[!NOTE]
>Some service documents are in the process of, or are not yet updated into a single reliability guide format. These may contain more than one document that references reliability guidance.

| Product| Reliability Guide | Other Reliability Documentation |
|----------|---------|---------|
|Azure AI Health Insights| [Reliability in Azure AI Health Insights](reliability-health-insights.md)||
|Azure AI Search| | [Reliability in Azure AI Search](/azure/search/search-reliability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure API Center| [Reliability in Azure API Center](reliability-api-center.md) ||
|Azure API Management | [Reliability in Azure API Management](reliability-api-management.md) ||
|Azure App Configuration||[How does App Configuration ensure high data availability?](../azure-app-configuration/faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-does-app-configuration-ensure-high-data-availability) </p> [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=core2x)|
|Azure Application Gateway (V2)||[Autoscaling and High Availability](../application-gateway/application-gateway-autoscaling-zone-redundant.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Application Gateway for Containers| [Reliability in Azure Application Gateway for Containers](reliability-app-gateway-containers.md )    ||
|Azure API for FHIR®||[Disaster recovery for Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure App Service| [Reliability in Azure App Service](reliability-app-service.md)||
|Azure App Service Environment| [Reliability in Azure App Service Environment](reliability-app-service-environment.md)||
|Azure Backup| [Reliability in Azure Backup](reliability-backup.md)||
|Azure Batch| [Reliability in Azure Batch](reliability-batch.md)||
|Azure Bastion| [Reliability in Azure Bastion](reliability-bastion.md)||
|Azure Bot Service | [Reliability in Azure Bot Service ](reliability-bot.md)||
|Azure Cache for Redis||[Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Configure passive geo-replication for Premium Azure Cache for Redis instances](../azure-cache-for-redis/cache-how-to-geo-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Chaos Studio| [Reliability in Azure Chaos Studio](reliability-chaos-studio.md)||
|Azure Communications Gateway | | [Reliability in Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Container Apps| [Reliability in Azure Container Apps](reliability-azure-container-apps.md)||
|Azure Container Instances| [Reliability in Azure Container Instances](reliability-containers.md)||
|Azure Container Registry|[Reliability in Azure Container Registry](reliability-container-registry.md) ||
|Azure Cosmos DB for NoSQL| [Reliability in Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md) ||
|Azure Cosmos DB for MongoDB vCore| [Reliability in Azure Cosmos DB for MongoDB vCore](reliability-cosmos-mongodb.md)||
|Azure Cosmos DB for PostgreSQL| | [Availability zone outage resiliency in Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/concepts-availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [High availability in Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/concepts-high-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Databox|| [How can I recover my data if an entire region fails?](../databox/data-box-disk-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-can-i-recover-my-data-if-an-entire-region-fails-)|
|Azure Data Explorer|| [Business continuity and disaster recovery overview](/azure/data-explorer/business-continuity-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Data Factory| [Reliability in Azure Data Factory](reliability-data-factory.md)||
|Azure Data Manager for Energy| [Reliability in Azure Data Manager for Energy](reliability-energy-data-services.md)||
|Azure Data Share|| [Disaster recovery for Azure Data Share](../data-share/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Database for MySQL|| [Overview of business continuity with Azure Database for MySQL - Single Server](/azure/mysql/single-server/concepts-business-continuity?#recover-from-an-azure-regional-data-center-outage) |
|Azure Database for MySQL - Flexible Server||[Azure Database for MySQL Flexible Server High availability](/azure/mysql/flexible-server/concepts-high-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p>[Azure Database for MySQL Flexible Server - Restore to latest restore point](/azure/mysql/flexible-server/how-to-restore-server-portal?#geo-restore-to-latest-restore-point) |
|Azure Database for PostgreSQL - Flexible Server| [Reliability in Azure Database for PostgreSQL - Flexible Server](reliability-postgresql-flexible-server.md)||
|Azure Deployment Environments| [Reliability in Azure Deployment Environments](reliability-deployment-environments.md)||
|Azure Device Registry |[Reliability in Azure Device Registry](reliability-device-registry.md)||
|Azure DevOps|| [Data availability](/azure/devops/organizations/security/data-protection?view=azure-devops&branch=main&preserve-view=true#data-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Disk Encryption|| [Redundancy options for managed disks](/azure/virtual-machines/disks-redundancy?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Disks|| [Best practices for achieving high availability with Azure virtual machines and managed disks](/azure/virtual-machines/disks-high-availability?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure DNS| [Reliability in Azure DNS ](reliability-dns.md)||
|Azure DDoS Protection| [Reliability in Azure DDoS Protection](reliability-ddos.md)||
|Azure Elastic SAN| [Reliability in Azure Elastic SAN](reliability-elastic-san.md)||
|Azure Event Grid| [Reliability in Azure Event Grid](./reliability-event-grid.md)||
|Azure Event Hubs| [Reliability in Azure Event Hubs](reliability-event-hubs.md)||
|Azure ExpressRoute|| [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p>[Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Firewall|| [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Files||[Choose the right redundancy option](/azure/storage/files/files-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#choose-the-right-redundancy-option)</p>[Disaster recovery and failover for Azure Files](/azure/storage/files/files-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Functions|  [Reliability in Azure Functions ](reliability-functions.md)||
|Azure Guest Configuration||[Azure Guest Configuration Availability](../governance/machine-configuration/overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability) |
|Azure Health Data Services: De-identification service (preview)|[Reliability in Azure Health Data Services: De-identification service](reliability-health-data-services-deidentification.md)||
|Azure Health Data Services: Workspace services (FHIR®, DICOM®, MedTech) | | [Business continuity and disaster recovery considerations](/azure/healthcare-apis/business-continuity-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure HDInsight| [Reliability in Azure HDInsight](reliability-hdinsight.md)||
|Azure IoT Hub| [Reliability in Azure IoT Hub](reliability-iot-hub.md) ||
|Azure Key Vault| [Reliability in Azure Key Vault](./reliability-key-vault.md) ||
|Azure Kubernetes Service (AKS)| [Reliability in Azure Kubernetes Service (AKS)](reliability-aks.md)||
|Azure Load Balancer| [Reliability in Azure Load Balancer](reliability-load-balancer.md )||
|Azure Logic Apps|[Reliability in Azure Logic Apps](reliability-logic-apps.md) ||
|Azure Machine Learning Service|| [Failover for business continuity and disaster recovery](/azure/machine-learning/how-to-high-availability-machine-learning?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Media Services|| [High Availability with Media Services and Video on Demand (VOD)](/azure/media-services/latest/architecture-high-availability-encoding-concept?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Migrate | | [Does Azure Migrate offer Backup and Disaster Recovery?](../migrate/resources-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#does-azure-migrate-offer-backup-and-disaster-recovery)|
|Azure Monitor Logs | | [Enhance data and service resilience in Azure Monitor Logs with availability zones](/azure/azure-monitor/logs/availability-zones) </p> [Azure Monitor Logs workspace replication](/azure/azure-monitor/logs/workspace-replication) | 
|Azure Notification Hubs| [Reliability in Azure Notification Hubs](reliability-notification-hubs.md)||
|Azure NetApp Files|| [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md?toc=/azure.reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Network Watcher|| [Azure Network Watcher service availability and redundancy](../network-watcher/frequently-asked-questions.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#service-availability-and-redundancy)|
|Azure Operator Nexus| [Reliability in Azure Operator Nexus](reliability-operator-nexus.md)||
|Azure Private 5G Core | |[Reliability in Azure Private 5G Core](../private-5g-core/reliability-private-5g-core.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Private Link|| [Azure Private Link availability](../private-link/availability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)   |
|Azure Public IP|| [Azure Public IP Availability Zone](../virtual-network/ip-services/public-ip-addresses.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zone) |
|Azure Queue Storage|[Reliability in Azure Queue Storage](reliability-storage-queue.md)||
|Azure Route Server|| [Azure Route Server frequently asked questions (FAQ)](../route-server/route-server-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Service Bus|| [Best practices for insulating applications against Service Bus outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Service Fabric|| [Deploy an Azure Service Fabric cluster across Availability Zones](/azure/service-fabric/service-fabric-cross-availability-zones?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery in Azure Service Fabric](/azure/service-fabric/service-fabric-disaster-recovery?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure SignalR Service|| [Resiliency and disaster recovery in Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Site Recovery|| [Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Spring Apps| [Reliability in Azure Spring Apps](reliability-spring-apps.md)||
|Azure SQL Database||[Azure SQL Database - High availability](/azure/azure-sql/database/high-availability-sla?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [Disaster recovery guidance - Azure SQL Database](/azure/azure-sql/database/disaster-recovery-guidance) |
|Azure SQL Managed Instance|| [Failover groups overview & best practices - Azure SQL Managed Instance](/azure/azure-sql/managed-instance/failover-group-sql-mi?view=azuresql&preserve-view=true) |
|Azure Storage Actions| [Reliability in Azure Storage Actions](reliability-storage-actions.md)||
|Azure Storage - Blob Storage||[Choose the right redundancy option](/azure/storage/common/storage-disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#choose-the-right-redundancy-option)</p>[Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure Storage Mover| [Reliability in Azure Storage Mover](reliability-azure-storage-mover.md)||
|Azure Stream Analytics|| [Achieve geo-redundancy for Azure Stream Analytics jobs](../stream-analytics/geo-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Traffic Manager| [Reliability in Azure Traffic Manager](reliability-traffic-manager.md)||
|Azure Virtual Machines| [Reliability in Azure Virtual Machines](reliability-virtual-machines.md)||
|Azure Virtual Machine Image Builder| [Reliability in Azure Virtual Machine Image Builder](reliability-image-builder.md)||
|Azure Virtual Machine Scale Sets| [Reliability in Azure Virtual Machine Scale Sets](reliability-virtual-machine-scale-sets.md)||
|Azure Virtual Network| [Reliability in Azure Virtual Network](reliability-virtual-network.md) ||
|Azure Virtual WAN||[How are Availability Zones and resiliency handled in Virtual WAN?](../virtual-wan/virtual-wan-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)</p> [Disaster recovery design](/azure/virtual-wan/disaster-recovery-design) |
|Azure VMware Solution|| [Deploy disaster recovery using VMware HCX](../azure-vmware/deploy-disaster-recovery-using-vmware-hcx.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
|Azure VPN Gateway|| [About zone-redundant virtual network gateway in Azure availability zones](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)</p>[Highly Available cross-premises and VNet-to-VNet connectivity](../vpn-gateway/vpn-gateway-highlyavailable.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
|Azure Web Application Firewall| | [Deploy an Azure Firewall with Availability Zones using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) </p> [How do I achieve a disaster recovery scenario across datacenters by using Application Gateway?](../application-gateway/application-gateway-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway)|
|Microsoft Community Training| [Reliability in Microsoft Community Training](reliability-community-training.md) ||
|Microsoft Fabric| [Reliability in Microsoft Fabric](reliability-fabric.md)||
|Microsoft Purview| [Reliability in Microsoft Purview](reliability-microsoft-purview.md)||
|Sustainability Data Solutions in Fabric | [Reliability in Sustainability Data Solutions in Fabric](reliability-sustainability-data-solutions-fabric.md) ||




## Related content

- [Azure services with availability zones](availability-zones-service-support.md)
- [List of Azure regions](regions-list.md)
- [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
