---
title: Relocation guidance overview for Microsoft Azure products and services
description: Relocation guidance overview for Microsoft Azure products and services. View Azure service specific relocation guides.
author: anaharris-ms
ms.service: reliability
ms.topic: conceptual
ms.date: 12/01/2023
ms.author: anaharris
ms.custom: subject-reliability
---

# Relocation guidance overview 

The Azure relocation guidance contains Azure service-specific relocation guides. Each guide contains information for moving service resources to another region, including step-by-step guidance for the tools and frameworks that are used to automate the workload relocation process.


## Azure services relocation guides

The following tables provide links to each Azure service relocation document, as well as their [supported relocation strategies](relocation-overview.md#relocation-strategies).

### ![An icon that signifies this service is foundational.](./media/relocation/icon-foundational.svg) Foundational services 

| **Product**  | **ARM Mover** | **Redeployment**| **Redeployment with Data Migration**|
| --- | --- | --- | --- | 
[Azure Database for PostgreSQL](reliability-postgresql-flexible-server.md)|	Not Supported | Supported | Supported |
[Azure Key Vault]()|	Not Supported | Supported | Supported |

### ![An icon that signifies this service is mainstream.](./media/relocation/icon-mainstream.svg) Mainstream services

| **Product**  | **ARM Mover** | **Redeployment**| **Redeployment with Data Migration**|
| --- | --- | --- | --- | 
[Azure Monitor - Log Analytics]()|Not Supported | Supported | Not Applicable |


## Next steps


