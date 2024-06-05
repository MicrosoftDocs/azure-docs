---
title: Relocation guidance overview for Microsoft Azure products and services (Preview)
description: Relocation guidance overview for Microsoft Azure products and services. View Azure service specific relocation guides.
author: anaharris-ms
ms.service: reliability
ms.topic: concept-article
ms.date: 01/16/2024
ms.author: anaharris
ms.custom:
  - subject-relocation
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


## Service categories across region types

[!INCLUDE [Service categories across region types](../../includes/service-categories/service-category-definitions.md)]

## Azure services relocation guides

The following tables provide links to each Azure service relocation document. The tables also provide information on which kind of relocation method is supported.

### ![An icon that signifies this service is foundational.](./media/relocation/icon-foundational.svg) Foundational services 

| Product  | Relocation | Relocation with data migration | Resource Mover | 
| --- | --- | --- | ---|
[Azure Event Hubs](relocation-event-hub.md)| ✅   | ❌| ❌ |
[Azure Event Hubs Cluster](relocation-event-hub-cluster.md)| ✅ | ❌  | ❌ |
[Azure Key Vault](./relocation-key-vault.md)| ✅ | ✅| ❌ |
[Azure Site Recovery (Recovery Services vaults)](../site-recovery/move-vaults-across-regions.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Virtual Network](./relocation-virtual-network.md)|  ✅| ❌  | ✅ |
[Azure Virtual Network - Network Security Groups](./relocation-virtual-network-nsg.md)|✅  |❌   | ✅ |


### ![An icon that signifies this service is mainstream.](./media/relocation/icon-mainstream.svg) Mainstream services

| Product  | Relocation |Relocation with data migration |  Resource Mover | 
| --- | --- | --- | ---|
[Azure API Management](../api-management/api-management-howto-migrate.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Application Gateway and Web Application Firewall](relocation-app-gateway.md)| ✅ | ❌| ❌ |
[Azure App Service](../app-service/manage-move-across-regions.md?toc=/azure/operational-excellence/toc.json)|✅  |  ❌| ❌ |
[Azure Backup (Recovery Services vault)](../backup/azure-backup-move-vaults-across-regions.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅| ❌ |
[Azure Batch](../batch/account-move.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Azure Cache for Redis](../azure-cache-for-redis/cache-moving-resources.md?toc=/azure/operational-excellence/toc.json)| ✅ |  ❌| ❌ |
[Azure Container Registry](../container-registry/manual-regional-move.md)|✅ | ✅|  ❌  |
[Azure Cosmos DB](../cosmos-db/how-to-move-regions.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Azure Database for MariaDB Server](../mariadb/howto-move-regions-portal.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |
[Azure Database for MySQL Server](../mysql/howto-move-regions-portal.md?toc=/azure/operational-excellence/toc.json)✅ | ✅|  ❌  |
[Azure Database for PostgreSQL](./relocation-postgresql-flexible-server.md)| ✅ | ✅| ❌ |
[Azure Functions](../azure-functions/functions-move-across-regions.md?toc=/azure/operational-excellence/toc.json)|✅  |❌  | ❌ |
[Azure Logic apps](../logic-apps/move-logic-app-resources.md?toc=/azure/operational-excellence/toc.json)|  ✅| ❌ | ❌ |
[Azure Monitor - Log Analytics](./relocation-log-analytics.md)| ✅| ❌ | ❌ |
[Azure Private Link Service](./relocation-private-link.md) | ✅| ❌ | ❌ |
[Azure Storage Account](relocation-storage-account.md)| ✅ | ✅| ❌ |
[Managed identities for Azure resources](relocation-storage-account.md)| ✅| ❌ | ❌ |
[Azure Stream Analytics -  Stream Analytics jobs](../stream-analytics/copy-job.md?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Azure Stream Analytics -  Stream Analytics cluster](../stream-analytics/move-cluster.md?toc=/azure/operational-excellence/toc.json)|✅ | ✅|  ❌  |


### ![An icon that signifies this service is strategic.](./media/relocation/icon-strategic.svg) Strategic services

| Product  | Relocation | Relocation with data migration | Resource Mover | 
| --- | --- | --- | ---|
[Azure Automation](./relocation-automation.md)| ✅ | ✅| ❌ |
[Azure IoT Hub](/azure/iot-hub/iot-hub-how-to-clone?toc=/azure/operational-excellence/toc.json)| ✅ | ✅|  ❌  |
[Power BI](/power-bi/admin/service-admin-region-move?toc=/azure/operational-excellence/toc.json)| ✅ |❌ | ❌ |


## Additional information

- [Azure Resources Mover documentation](/azure/resource-mover/)
- [Azure Resource Manager (ARM) documentation](/azure/azure-resource-manager/templates/)


