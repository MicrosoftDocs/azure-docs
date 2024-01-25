---
title: Relocation guidance overview for Microsoft Azure products and services (Preview)
description: Relocation guidance overview for Microsoft Azure products and services. View Azure service specific relocation guides.
author: anaharris-ms
ms.service: reliability
ms.topic: conceptual
ms.date: 01/16/2024
ms.author: anaharris
ms.custom:
  - subject-relocation
---

# Azure services relocation guidance overview (Preview)

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, there's an increasing number options available for you to relocate your workloads into new regions.  Region relocation options vary by service and by workload architecture.  To successfully relocate a workload to another region, you need to plan your relocation strategy with an understanding of what each service in your workload requires and supports. 

Azure region relocation documentation (Preview) contains service-specific relocation guidance for Azure products and services. The relocation documentation set is founded on both [Azure Cloud Adoption Framework - Relocate cloud workloads](/azure/cloud-adoption-framework/relocate/) as well as the following Well-architected Framework (WAF) Operational Excellence principles:

- [Deploy with confidence](/azure/well-architected/operational-excellence/principles#deploy-with-confidence) 
- [Adopt safe deployment practices](/azure/well-architected/operational-excellence/principles#adopt-safe-deployment-practices)  


Each service specific guide can contain service-specific information such as:

- [Relocation methods, such as Cold, Hot or Warm relocation](/azure/cloud-adoption-framework/relocate/select)
- [Service-relocation automation tools](/azure/cloud-adoption-framework/relocate/select#select-service-relocation-automation).
- [Data relocation automation](/azure/cloud-adoption-framework/relocate/select#select-data-relocation-automation).
- [Cutover approaches](/azure/cloud-adoption-framework/relocate/select#select-cutover-approach).
- Possible and actual service dependencies that also require relocation planning.
- Lists of considerations, features, and limitations in relation to relocation planning for that service.
- Links to how-tos and relevant product-specific relocation information.


## Service categories across region types

[!INCLUDE [Service categories across region types](../../includes/service-categories/service-category-definitions.md)]

## Azure services relocation guides

The following tables provide links to each Azure service relocation document.

### ![An icon that signifies this service is foundational.](./media/relocation/icon-foundational.svg) Foundational services 

| **Product**  |
| --- | 
[Azure Event Hubs](relocation-event-hub.md)|
[Azure Key Vault](./relocation-key-vault.md)|
[Azure Virtual Network](./relocation-virtual-network.md)|

### ![An icon that signifies this service is mainstream.](./media/relocation/icon-mainstream.svg) Mainstream services

| **Product**  |
| --- | 
[Azure Monitor - Log Analytics](./relocation-log-analytics.md)|
[Azure Database for PostgreSQL](./relocation-postgresql-flexible-server.md)|
[Azure Private Link](./relocation-private-link.md) |
[Storage Account](relocation-storage-account.md)|



### ![An icon that signifies this service is strategic.](./media/relocation/icon-strategic.svg) Strategic services

| **Product**  |
| --- | 
[Azure Automation](./relocation-automation.md)|
[Microsoft Defender for Cloud](relocation-defender.md)
[Microsoft Sentinel](relocation-sentinel.md)|

## Additional information

- [Azure Resources Mover documentation](/azure/resource-mover/)
- [Azure Resource Manager (ARM) documentation](/azure/azure-resource-manager/templates/)


