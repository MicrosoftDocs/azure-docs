---
title: Disaster recovery guidance overview for Microsoft Azure products and services
description: Disaster recovery guidance overview for Microsoft Azure products and services
author: anaharris-ms
ms.service: reliability
ms.topic: conceptual
ms.date: 09/13/2023
ms.author: anaharris
ms.custom: subject-reliability
---

# Disaster recovery guidance by service

A disaster is a single, major event with a larger and longer-lasting impact than an application can mitigate through the high availability part of its design. Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments, that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR.  For more information, see [What is disaster recovery?](./disaster-recovery-overview.md).

The tables below lists each product that offers disaster recovery guidance and/or information. 

## Azure services disaster recovery  guides

### ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services 

| **Products**  | 
| --- | 
| [Azure Application Gateway (V2)](../networking/disaster-recovery-dns-traffic-manager.md) |
| [Azure Cosmos DB](../cosmos-db/how-to-multi-master.md?tabs=api-async) |
| [Azure DNS - Azure DNS Private Resolver](../dns/dns-faq-private.yml#will-azure-private-dns-zones-work-across-azure-regions-) |
| [Azure Event Hubs](../event-hubs/event-hubs-geo-dr.md?s) |
| [Azure ExpressRoute](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md) |
| [Azure Key Vault](../key-vault/general/disaster-recovery-guidance.md) |
| [Azure Kubernetes Service (AKS)](../aks/operator-best-practices-multi-region.md) |
| [Azure Load Balancer](../load-balancer/tutorial-cross-region-portal.md) |
| [Azure Public IP](../load-balancer/cross-region-overview.md) |
| [Azure Service Bus](../service-bus-messaging/service-bus-geo-dr.md) |
| [Azure Service Fabric](../service-fabric/service-fabric-disaster-recovery.md#availability-of-the-service-fabric-cluster) |
| [Azure Site Recovery](../site-recovery/azure-to-azure-tutorial-enable-replication.md?) |
| [Azure SQL](/azure/azure-sql/database/recovery-using-backups#geo-restore) |
| [Azure SQL-Managed Instance](/azure/azure-sql/database/auto-failover-group-sql-db?tabs=azure-powershell) |
| [Azure Storage-Disk Storage](../virtual-machines/disks-incremental-snapshots.md?tabs=azure-resource-manage.md) |
| [Azure Virtual Machines](reliability-virtual-machines.md#cross-region-disaster-recovery-and-business-continuity) |
| [Azure Virtual Network](../virtual-network/virtual-network-disaster-recovery-guidance.md#business-continuity) |
| [Azure VPN and ExpressRoute Gateway](../vpn-gateway/vpn-gateway-highlyavailable.md?) |


### ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services 

| **Products**  | 
| --- | 
| [Azure API Management](../api-management/api-management-howto-disaster-recovery-backup-restore.md) |
| [Microsoft Entra Domain Services](../active-directory-domain-services/tutorial-create-replica-set.md) |
| [Azure App Configuration](../azure-app-configuration/concept-disaster-recovery.md?&tabs=core2x)|
| [Azure App Service](reliability-app-service.md#cross-region-disaster-recovery-and-business-continuity)|
| [Azure Backup](../backup/backup-overview.md) |
| [Azure Batch](reliability-batch.md#cross-region-disaster-recovery-and-business-continuity) |
| [Azure Bastion](../bastion/bastion-faq.md?#dr) |
| [Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-geo-replication.md) |
| [Azure Cognitive Search](../search/search-reliability.md) |
| [Azure Container Instances](reliability-containers.md#disaster-recovery) |
| [Azure Database for MySQL](/azure/mysql/single-server/concepts-business-continuity?#recover-from-an-azure-regional-data-center-outage) |
| [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-restore-server-portal?#geo-restore-to-latest-restore-point) |
| [Azure Database for PostgreSQL - Flexible Server](reliability-postgre-flexible.md#cross-region-disaster-recovery-and-business-continuity) |
| [Azure Data Explorer](/azure/data-explorer/business-continuity-overview) |
| [Azure DDoS Protection](../ddos-protection/ddos-disaster-recovery-guidance.md?#business-continuity) |
| [Azure Event Grid](../event-grid/custom-disaster-recovery.md) |
| [Azure Functions](reliability-functions.md#cross-region-disaster-recovery-and-business-continuity) |
| [Azure Guest Configuration](../governance/policy/concepts/guest-configuration.md?#availability) |
| [Azure HDInsight](reliability-hdinsight.md#cross-region-disaster-recovery-and-business-continuity) |
| [Azure Logic Apps](../logic-apps/business-continuity-disaster-recovery-guidance.md) |
| [Azure Media Services](/azure/media-services/latest/architecture-high-availability-encoding-concept) |
| [Azure Migrate](../migrate/resources-faq.md?#does-azure-migrate-offer-backup-and-disaster-recovery) |
| [Azure Monitor - Log Analytics](../azure-monitor/logs/logs-data-export.md?&tabs=portal#enable-data-export) | 
| [Azure Monitor - Application Insights](../azure-monitor/app/export-telemetry.md#continuous-export-advanced-storage-configuration) |
| [Azure SQL Server Registry](/sql/sql-server/end-of-support/sql-server-extended-security-updates?preserve-view=true&view=sql-server-ver15#configure-regional-redundancy) |
| [Azure Stream Analytics](../stream-analytics/geo-redundancy.md) |
| [Azure Virtual WAN](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md) |
| [Azure Web Application Firewall](../application-gateway/application-gateway-faq.yml?#how-do-i-achieve-a-dr-scenario-across-datacenters-by-using-application-gateway) |
  

### ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic services 

| **Products**  | 
| --- | 
| [Azure Databox](../databox/data-box-disk-faq.yml?#how-can-i-recover-my-data-if-an-entire-region-fails-) |
| [Azure Data Share](../data-share/disaster-recovery.md)|
| [Azure DevOps](/azure/devops/organizations/security/data-protection?view=azure-devops.md&preserve-view=true&#data-availability)|
| [Azure Health Data Services - Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md) |
| [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md?#disable-disaster-recovery) |
| [Azure Machine Learning Service](../machine-learning/v1/how-to-high-availability-machine-learning.md) |
| [Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md) |
| [Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md) |
| [Azure VMware Solution](../azure-vmware/disaster-recovery-for-virtual-machines.md) |
