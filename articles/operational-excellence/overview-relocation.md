---
title: Relocation guidance overview for Microsoft Azure products and services (Preview)
description: Relocation guidance overview for Microsoft Azure products and services. View Azure service specific relocation guides.
author: anaharris-ms
ms.service: azure
ms.topic: concept-article
ms.date: 01/16/2024
ms.author: anaharris
ms.custom:
  - subject-relocation
ms.subservice: azure-reliability
---

# Azure services relocation guidance overview (Preview)

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, there's an increasing number of options available for you to relocate your workloads into new regions.  Region relocation options vary by service and by workload architecture.  To successfully relocate a workload to another region, you need to plan your relocation strategy with an understanding of what each service in your workload requires and supports. 

Azure region relocation documentation (Preview) contains service-specific relocation guidance for Azure products and services. The relocation documentation set is founded on both [Azure Cloud Adoption Framework - Relocate cloud workloads](/azure/cloud-adoption-framework/relocate/) as well as the following Well-architected Framework (WAF) Operational Excellence principles:

- [Deploy with confidence](/azure/well-architected/operational-excellence/principles#deploy-with-confidence) 
- [Adopt safe deployment practices](/azure/well-architected/operational-excellence/principles#adopt-safe-deployment-practices)  


Each service specific guide can contain service-specific information on topics such as:

- [Service-relocation automation tools](/azure/cloud-adoption-framework/relocate/select#select-service-relocation-automation).
- [Data relocation automation](/azure/cloud-adoption-framework/relocate/select#select-data-relocation-automation).
- [Cutover approaches](/azure/cloud-adoption-framework/relocate/select#select-cutover-approach).
- Possible and actual service dependencies that also require relocation planning.
- Lists of considerations, features, and limitations in relation to relocation planning for that service.
- Links to how-tos and relevant product-specific relocation information.


## Azure services relocation guides

The following tables provide links to each Azure service relocation document. The tables also provide information on which kind of relocation method is supported.


### Analytics

| Product  | Relocation | Relocation with data migration | Resource Mover | 
| --- | --- | --- | ---|
[Azure Event Hubs](relocation-event-hub.md)| ✅   | ❌| ❌ |
[Azure Event Hubs Cluster](relocation-event-hub-cluster.md)| ✅ | ❌  | ❌ |
[Azure Stream Analytics -  Stream Analytics jobs](../stream-analytics/copy-job.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Stream Analytics -  Stream Analytics cluster](../stream-analytics/move-cluster.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Power BI](/power-bi/admin/service-admin-region-move?toc=/azure/operational-excellence/toc.json)| ✅ |❌ | ❌ |

### Compute 

| Product  | Relocation | Relocation with data migration | Resource Mover | 
| --- | --- | --- | ---|
[Azure App Service](../app-service/manage-move-across-regions.md?toc=/azure/operational-excellence/toc.json)|✅  |  ❌| ❌ |
[Azure Batch](../batch/account-move.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Azure Functions](relocation-functions.md)|✅  |❌  | ❌ |
[Azure Static Web Apps](./relocation-static-web-apps.md) |  ✅ |❌ | ❌ |
[Azure Virtual Machines]( ../resource-mover/tutorial-move-region-virtual-machines.md?toc=/azure/operational-excellence/toc.json)| ❌ | ❌|  ✅  |
[Azure Virtual Machine Scale Sets](./relocation-virtual-machine-scale-sets.md)|❌  |✅   | ❌ |


### Containers

| Product  | Relocation | Relocation with data migration | Resource Mover | 
| --- | --- | --- | ---|
[Azure Container Registry](relocation-container-registry.md)|✅ | ✅| ❌ |
[Azure Functions](relocation-functions.md)|✅  |❌  | ❌ |
[Azure Kubernetes Service](relocation-kubernetes-service.md)|✅  |✅  | ❌ |


### Databases 

| Product  | Relocation | Relocation with data migration | Resource Mover | 
| --- | --- | --- | ---|
[Azure Cache for Redis](../azure-cache-for-redis/cache-moving-resources.md?toc=/azure/operational-excellence/toc.json)| ✅ |  ❌| ❌ |
[Azure Cosmos DB](relocation-cosmos-db.md)|✅ | ✅|  ❌  |
[Azure Database for MariaDB Server](/azure/mariadb/howto-move-regions-portal?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Azure Database for MySQL Server](/azure/mysql/howto-move-regions-portal?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Azure Database for PostgreSQL](./relocation-postgresql-flexible-server.md)| ✅ | ✅| ❌ |


### Integration

| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure API Management](../api-management/api-management-howto-migrate.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Logic apps](../logic-apps/move-logic-app-resources.md?toc=/azure/operational-excellence/toc.json)|  ✅| ❌ | ❌ |


### Internet of Things

| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure API Management](../api-management/api-management-howto-migrate.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Cosmos DB](relocation-cosmos-db.md)|✅ | ✅|  ❌  |
[Azure Event Grid domains](relocation-event-grid-domains.md)| ✅ | ❌| ❌ |
[Azure Event Grid custom topics](relocation-event-grid-custom-topics.md)| ✅ | ❌| ❌ |
[Azure Event Grid system topics](relocation-event-grid-system-topics.md)| ✅ | ❌| ❌ |
[Azure Functions](relocation-functions.md)|✅  |❌  | ❌ |
[Azure IoT Hub](/azure/iot-hub/iot-hub-how-to-clone?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Stream Analytics -  Stream Analytics jobs](../stream-analytics/copy-job.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Stream Analytics -  Stream Analytics cluster](../stream-analytics/move-cluster.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |


### Management and governance
| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure Automation](./relocation-automation.md)| ✅ | ✅| ❌ |
[Azure Backup](relocation-backup.md)| ✅ | ❌| ❌ |
[Azure Monitor - Log Analytics](./relocation-log-analytics.md)| ✅| ❌ | ❌ |
[Azure Site Recovery (Recovery Services vaults)](relocation-site-recovery.md)| ✅ | ✅|  ❌  |


### Networking

| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure Application Gateway and Web Application Firewall](relocation-app-gateway.md)| ✅ | ❌| ❌ |
[Azure Load Balancer](../load-balancer/move-across-regions-external-load-balancer-portal.md)| ✅ | ✅| ❌ |
[Azure Private Link Service](./relocation-private-link.md) | ✅| ❌ | ❌ |
[Azure Virtual Network](./relocation-virtual-network.md)|  ✅| ❌  | ✅ |
[Azure Virtual Network - Network Security Groups](./relocation-virtual-network-nsg.md)|✅  |❌   | ✅ |

### Security

| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure Firewall](./relocation-firewall.md)|❌ | ✅| ❌ |
[Azure Application Gateway and Web Application Firewall](relocation-app-gateway.md)| ✅ | ❌| ❌ |
[Azure Key Vault](./relocation-key-vault.md)| ✅ | ✅| ❌ |
[Managed identities for Azure resources](relocation-storage-account.md)| ✅| ❌ | ❌ |

### Storage

| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure Backup](relocation-backup.md)| ✅ | ❌| ❌ |
[Azure NetApp Files](./relocation-netapp.md)| ✅ | ✅|  ❌  |
[Azure Storage Account](relocation-storage-account.md)| ✅ | ✅| ❌ |




## Additional information

- [Azure Resources Mover documentation](/azure/resource-mover/)
- [Azure Resource Manager (ARM) documentation](/azure/azure-resource-manager/templates/)


