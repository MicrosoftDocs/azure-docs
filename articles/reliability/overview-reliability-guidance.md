---
title: Reliability Guides for Azure Services
description: See a list of reliability guides for Azure products and services. Learn about transient fault handling, availability zones, and multi-region support.
author: anaharris-ms
ms.service: azure
ms.topic: reliability-article
ms.date: 08/08/2025
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# Reliability guides for Azure services

This article provides links to reliability guidance for many Azure services. Most reliability guides contain the following information:

- The *reliability architecture overview* provides a synopsis about how a service supports reliability. It includes information about which components Microsoft manages and which components you manage, built-in redundancy features, and how to provision and manage multiple resources, if applicable.

- *Transient fault handling* describes how a service handles day-to-day transient faults that can occur in the cloud. It also describes how to handle these faults in an application, including information about retry policies, timeouts, and other best practices.

- *Availability zones* describe zonal and zone-redundant deployment options, traffic routing and data replication between zones, zone-outage scenarios, failback processes, and how to configure resources for availability zone support.

- *Multi-region support* describes how to configure multi-region or geo-disaster support, traffic routing and data replication between regions, region-down scenarios, failover and failback support, and alternative multi-region support.

Some guides also contain information about the following capabilities:

- *Backup support* explains who controls backups, where they're stored and replicated, how to recover them, and whether they can be accessed only within a region or across regions.

- *Service-level agreements (SLAs)*, which define and describe the expected uptime, and how the expected uptime changes based on the configuration that you use.

## Reliability guides by service

The following table provides links to reliability guidance for Azure services. Each guide contains information about how the service supports reliability features. 

> [!NOTE]
> Some documents don't follow a single reliability guide format. These services might list more than one article that references reliability guidance.

| Service | Reliability guide | Other reliability documentation |
|----------|---------|---------|
|Azure AI Health Insights| [Reliability in AI Health Insights](reliability-health-insights.md)||
|Azure AI Search| [Reliability in AI Search](reliability-ai-search.md) ||
|Azure API Center| [Reliability in Azure API Center](reliability-api-center.md) ||
|Azure API Management | [Reliability in API Management](reliability-api-management.md) ||
|Azure App Configuration||[App Configuration and high data availability](../azure-app-configuration/faq.yml#how-does-app-configuration-ensure-high-data-availability) </p> [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md)|
|Azure App Service| [Reliability in App Service](reliability-app-service.md)||
|App Service Environment| [Reliability in App Service Environment](reliability-app-service-environment.md)||
|Azure Application Gateway for Containers| [Reliability in Application Gateway for Containers](reliability-app-gateway-containers.md )    ||
|Azure Application Gateway v2||[Autoscaling and high availability](../application-gateway/application-gateway-autoscaling-zone-redundant.md)|
|Azure Backup| [Reliability in Backup](reliability-backup.md)||
|Azure Bastion| [Reliability in Azure Bastion](reliability-bastion.md)||
|Azure Batch| [Reliability in Batch](reliability-batch.md)||
|Azure Blob Storage| [Reliability in Blob Storage](reliability-storage-blob.md) ||
|Azure Bot Service | [Reliability in Bot Service](reliability-bot.md)||
|Azure Cache for Redis||[Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md) </p> [Configure passive geo-replication for Premium Azure Cache for Redis instances](../azure-cache-for-redis/cache-how-to-geo-replication.md) |
|Azure Chaos Studio| [Reliability in Chaos Studio](reliability-chaos-studio.md)||
|Azure Communications Gateway | | [Reliability in Azure Communications Gateway](../communications-gateway/reliability-communications-gateway.md)|
|Azure Container Apps| [Reliability in Container Apps](reliability-azure-container-apps.md)||
|Azure Container Instances| [Reliability in Container Instances](reliability-container-instances.md)||
|Azure Container Registry|[Reliability in Container Registry](reliability-container-registry.md) ||
|Azure Cosmos DB for MongoDB vCore| [Reliability in Azure Cosmos DB for MongoDB vCore](reliability-cosmos-mongodb.md)||
|Azure Cosmos DB for NoSQL| [Reliability in Azure Cosmos DB for NoSQL](reliability-cosmos-db-nosql.md) ||
|Azure Cosmos DB for PostgreSQL| | [Availability zone outage resiliency in Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/concepts-availability-zones) </p> [High availability in Azure Cosmos DB for PostgreSQL](/azure/cosmos-db/postgresql/concepts-high-availability)|
|Azure Data Box|| [Recover data if an entire region fails](../databox/data-box-disk-faq.yml#how-can-i-recover-my-data-if-an-entire-region-fails-)|
|Azure Data Explorer|| [Business continuity and disaster recovery overview](/azure/data-explorer/business-continuity-overview)|
|Azure Data Factory| [Reliability in Data Factory](reliability-data-factory.md)||
|Azure Data Manager for Energy| [Reliability in Azure Data Manager for Energy](reliability-energy-data-services.md)||
|Azure Data Share|| [Disaster recovery for Data Share](../data-share/disaster-recovery.md)|
|Azure Database for MySQL|| [High availability concepts in Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/concepts-high-availability) |
|Azure Database for MySQL Flexible Server||[High availability concepts in Azure Database for MySQL Flexible Server](/azure/mysql/flexible-server/concepts-high-availability) </p>[Point-in-time restore in Azure Database for MySQL](/azure/mysql/flexible-server/how-to-restore-server-portal#geo-restores-to-latest-restore-point) |
|Azure Database for PostgreSQL| [Reliability in Azure Database for PostgreSQL](reliability-azure-database-postgresql.md)||
|Azure Databricks | [Reliability in Azure Databricks](reliability-databricks.md)||
|Azure DDoS Protection| [Reliability in DDoS Protection](reliability-ddos.md)||
|Azure Deployment Environments| [Reliability in Deployment Environments](reliability-deployment-environments.md)||
|Azure Device Registry |[Reliability in Device Registry](reliability-device-registry.md)||
|Azure DevOps|| [Data protection overview](/azure/devops/organizations/security/data-protection#data-availability)|
|Azure Disk Encryption|| [Redundancy options for managed disks](/azure/virtual-machines/disks-redundancy) |
|Azure DNS| [Reliability in Azure DNS ](reliability-dns.md)||
|Azure Elastic SAN| [Reliability in Elastic SAN](reliability-elastic-san.md)||
|Azure Event Grid| [Reliability in Event Grid](./reliability-event-grid.md)||
|Azure Event Hubs| [Reliability in Azure Event Hubs](./reliability-event-hubs.md) ||
|Azure ExpressRoute| [Reliability in Azure ExpressRoute](reliability-virtual-network-gateway.md?pivot=expressroute) ||
|Azure Files| [Reliability in Azure Files](reliability-storage-files.md)||
|Azure Firewall| [Reliability in Azure Firewall](./reliability-firewall.md) ||
|Azure Functions|  [Reliability in Azure Functions ](reliability-functions.md)||
|Azure guest configuration||[Azure guest configuration availability](../governance/machine-configuration/overview.md#availability) |
|Azure Health Data Services||[Disaster recovery for Health Data Services](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md) |
|Azure Health Data Services: De-identification service|[Reliability in the Health Data Services de-identification service](reliability-health-data-services-deidentification.md)||
|Azure Health Data Services: Workspace services (FHIR®, DICOM®, medtech) | | [Business continuity and disaster recovery considerations](/azure/healthcare-apis/business-continuity-disaster-recovery) |
|Azure HDInsight| [Reliability in HDInsight](reliability-hdinsight.md)||
|Azure IoT Hub| [Reliability in IoT Hub](reliability-iot-hub.md) ||
|Azure Key Vault| [Reliability in Key Vault](./reliability-key-vault.md) ||
|Azure Kubernetes Service (AKS)| [Reliability in AKS](reliability-aks.md)||
|Azure Load Balancer| [Reliability in Load Balancer](reliability-load-balancer.md )||
|Azure Logic Apps|[Reliability in Logic Apps](reliability-logic-apps.md) ||
|Azure Machine Learning|| [Failover for business continuity and disaster recovery](/azure/machine-learning/how-to-high-availability-machine-learning)|
|Azure managed disks|| [Best practices for achieving high availability by using Azure virtual machines and managed disks](/azure/virtual-machines/disks-high-availability)|
|Azure Media Services|| [High availability by using Media Services and video on demand (VOD)](/azure/media-services/latest/architecture-high-availability-encoding-concept)|
|Azure Migrate | | [Azure Migrate and backup and disaster recovery](../migrate/resources-faq.md#does-azure-migrate-offer-backup-and-disaster-recovery)|
|Azure Monitor Logs | | [Enhance data and service resilience in Azure Monitor Logs by using availability zones](/azure/azure-monitor/logs/availability-zones) </p> [Azure Monitor Logs workspace replication](/azure/azure-monitor/logs/workspace-replication) | 
|Azure NetApp Files|| [Reliability in Azure NetApp Files](reliability-netapp-files.md)|
|Azure Network Watcher|| [Network Watcher service availability and redundancy](../network-watcher/frequently-asked-questions.yml#service-availability-and-redundancy)|
|Azure Notification Hubs| [Reliability in Notification Hubs](reliability-notification-hubs.md)||
|Azure Private Link|| [Private Link availability](../private-link/availability.md)   |
|Azure public IP addresses|| [Azure public IP addresses availability zone](../virtual-network/ip-services/public-ip-addresses.md#availability-zone) |
|Azure Queue Storage|[Reliability in Queue Storage](reliability-storage-queue.md)||
|Azure Route Server|| [Route Server frequently asked questions (FAQs)](../route-server/route-server-faq.md)|
|Azure Service Bus|| [Best practices for insulating applications against Service Bus outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md)|
|Azure Service Fabric|| [Deploy a Service Fabric cluster across availability zones](/azure/service-fabric/service-fabric-cross-availability-zones) </p> [Disaster recovery in Service Fabric](/azure/service-fabric/service-fabric-disaster-recovery) |
|Azure SignalR Service|| [Resiliency and disaster recovery in Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md)|
|Azure Site Recovery|| [Set up disaster recovery for Azure virtual machines](../site-recovery/azure-to-azure-tutorial-enable-replication.md)|
|Azure SQL Database|[Reliability in Azure SQL Database](reliability-sql-database.md) |
|Azure SQL Managed Instance| [Reliability in Azure SQL Managed Instance](./reliability-sql-managed-instance.md) ||
|Azure Storage Actions| [Reliability in Storage Actions](reliability-storage-actions.md)||
|Azure Storage Mover| [Reliability in Storage Mover](reliability-azure-storage-mover.md)||
|Azure Stream Analytics|| [Achieve geo-redundancy for Stream Analytics jobs](../stream-analytics/geo-redundancy.md) |
|Azure Table Storage| [Reliability in Table Storage](reliability-storage-table.md)||
|Azure Traffic Manager| [Reliability in Traffic Manager](reliability-traffic-manager.md)||
|Azure Virtual Machines| [Reliability in Virtual Machines](reliability-virtual-machines.md)||
|Azure VM Image Builder| [Reliability in VM Image Builder](reliability-image-builder.md)||
|Azure Virtual Machine Scale Sets| [Reliability in Virtual Machine Scale Sets](reliability-virtual-machine-scale-sets.md)||
|Azure Virtual Network| [Reliability in Virtual Network](reliability-virtual-network.md) ||
|Azure Virtual WAN||[Availability zones and resiliency in Virtual WAN](../virtual-wan/virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan)</p> [Disaster recovery design](/azure/virtual-wan/disaster-recovery-design) |
|Azure VMware Solution|| [Deploy disaster recovery by using VMware HCX](../azure-vmware/deploy-disaster-recovery-using-vmware-hcx.md)|
|Azure VPN Gateway| [Reliability in VPN Gateway](reliability-virtual-network-gateway.md?pivot=vpn) ||
|Azure Web Application Firewall| | [Deploy Azure Firewall with availability zones by using Azure PowerShell](../firewall/deploy-availability-zone-powershell.md) </p> [Achieve a disaster recovery scenario across datacenters by using Application Gateway](../application-gateway/application-gateway-faq.yml#how-do-i-achieve-a-disaster-recovery-scenario-across-datacenters-by-using-application-gateway)|
|Community Training| [Reliability in Community Training](reliability-community-training.md) ||
|Microsoft Fabric| [Reliability in Fabric](reliability-fabric.md)||
|Microsoft Purview| [Reliability in Microsoft Purview](reliability-microsoft-purview.md)||

## Related content

- [Azure services that support availability zones](availability-zones-service-support.md)
- [List of Azure regions](regions-list.md)
- [Build solutions for high availability by using availability zones](/azure/well-architected/reliability/regions-availability-zones)
