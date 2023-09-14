---
title: Disaster recovery guidance overview for Microsoft Azure products and services
description: Disaster recovery guidance overview for Microsoft Azure products and services
author: anaharris-ms
ms.service: reliability
ms.subservice: disaster-recovery
ms.topic: conceptual
ms.date: 09/14/2023
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
| [Azure Application Gateway (V2)](../networking/disaster-recovery-dns-traffic-manager.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/.breadcrumb/toc.json) |
| [Azure Cosmos DB](../cosmos-db/how-to-multi-master.md?tabs=api-async?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure DNS - Azure DNS Private Resolver](../dns/dns-faq-private.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#will-azure-private-dns-zones-work-across-azure-regions-) |
| [Azure Event Hubs](../event-hubs/event-hubs-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zones) |
| [Azure ExpressRoute](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Key Vault](../key-vault/general/disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Kubernetes Service (AKS)](../aks/operator-best-practices-multi-region.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Load Balancer](../load-balancer/tutorial-cross-region-portal.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Public IP](../load-balancer/cross-region-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Service Bus](../service-bus-messaging/service-bus-geo-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-zones) |
| [Azure Service Fabric](../service-fabric/service-fabric-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability-of-the-service-fabric-cluster) |
| [Azure Site Recovery](../site-recovery/azure-to-azure-tutorial-enable-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure SQL](/azure-sql/database/recovery-using-backups?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#geo-restore) |
| [Azure SQL-Managed Instance](/azure-sql/database/auto-failover-group-sql-db?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=azure-powershell) |
| [Azure Storage-Disk Storage](../virtual-machines/disks-incremental-snapshots?tabs=azure-resource-manage.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.jsonr#cross-region-snapshot-copy-preview) |
| [Azure Virtual Machines](reliability-virtual-machines.md#disaster-recovery-and-business-continuity) |
| [Azure Virtual Network](../virtual-network/virtual-network-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#business-continuity) |
| [Azure VPN and ExpressRoute Gateway](../vpn-gateway/vpn-gateway-highlyavailable.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |


### ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services 

| **Products**  | 
| --- | 
| [Azure API Management](../api-management/api-management-howto-disaster-recovery-backup-restore.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/.breadcrumb/toc.json) |
| [Azure Active Directory Domain Services](../active-directory-domain-services/tutorial-create-replica-set.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/.breadcrumb/toc.json) |
| [Azure App Configuration](../azure-app-configuration/concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=core2x)|
| [Azure App Service](reliability-app-service.md#disaster-recovery-and-business-continuity)|
| [Azure Backup](../backup/backup-overview.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Batch](reliability-batch.md#disaster-recovery-and-business-continuity) |
| [Azure Bastion](../bastion/bastion-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#dr) |
| [Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-geo-replication.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Cognitive Search](../search/search-reliability.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Data Explorer](/azure/data-explorer/business-continuity-overview?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Database for MySQL](/azure/mysql/single-server/concepts-business-continuity?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#recover-from-an-azure-regional-data-center-outage) |
| [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-restore-server-portal?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#geo-restore-to-latest-restore-point) |
| [Azure Database for PostgreSQL - Flexible Server](reliability-postgre-flexible.md#disaster-recovery-and-business-continuity) |
| [Azure DDoS Protection](../ddos-protection/ddos-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#business-continuity) |
| [Azure Event Grid](../event-grid/custom-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Functions](reliability-functions.md#disaster-recovery-and-business-continuity) |
| [Azure Guest Configuration](../governance/policy/concepts/guest-configuration.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#availability) |
| [Azure HDInsight](reliability-hdinsight.md#disaster-recovery-and-business-continuity) |
| [Azure Logic Apps](../logic-apps/business-continuity-disaster-recovery-guidance.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Media Services](/azure/media-services/latest/architecture-high-availability-encoding-concept?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Migrate](../migrate/resources-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#does-azure-migrate-offer-backup-and-disaster-recovery) |
| [Azure Monitor - Log Analytics](../azure-monitor/logs/logs-data-export.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&tabs=portal#enable-data-export) | 
| [Azure Monitor - Application Insights - Continuous export advanced storage configuration](../azure-monitor/app/export-telemetry.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#continuous-export-advanced-storage-configuration) and [Move Application Insights resource to a new region](../azure-monitor/faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-move-an-application-insights-resource-to-a-new-region-) |
| [Azure SQL Server Registry](/sql/sql-server/end-of-support/sql-server-extended-security-updates?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json&preserve-view=true&view=sql-server-ver15#configure-regional-redundancy) |
| [Azure Stream Analytics](../stream-analytics/geo-redundancy.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Virtual WAN](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure Web Application Firewall](../application-gateway/application-gateway-faq.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-do-i-achieve-a-dr-scenario-across-datacenters-by-using-application-gateway) |
  

### ![An icon that signifies this service is strategic.](media/icon-strategic.svg) Strategic services 

| **Products**  | 
| --- | 
| [Azure Databox](../databox/data-box-disk-faq.yml?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#how-can-i-recover-my-data-if-an-entire-region-fails-) |
| [Azure Data Share](../data-share/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json)|
| [Azure DevOps](../devops/organizations/security/data-protection.md?view=azure-devops.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#data-availability)|
| [Azure Health Data Services - Azure API for FHIR](../healthcare-apis/azure-api-for-fhir/disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json#disable-disaster-recovery) |
| [Azure Machine Learning Service](../machine-learning/v1/how-to-high-availability-machine-learning.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure SignalR Service](../azure-signalr/signalr-concept-disaster-recovery.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
| [Azure VMware Solution](../azure-vmware/disaster-recovery-for-virtual-machines.md?toc=/azure/reliability/toc.json&bc=/azure/reliability/breadcrumb/toc.json) |
