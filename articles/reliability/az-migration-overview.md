---
title: Availability zone migration guidance overview
description: Availability zone migration guidance overview
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 08/19/2022
ms.author: anaharris
ms.custom: references_regions
---

# Availability zone migration guidance overview

Azure services that support availability zones, including zonal and zone-redundant offerings, are continually expanding.  For that reason, resources that don't currently have availability zone support, may have an opportunity to gain that support. The Migration Guides section offers a collection of guides for each service that requires certain procedures in order to move a resource from non-availability zone support to availability support. You'll find information on prerequisites for migration, download requirements, important migration considerations and recommendations.

The table below lists each product that offers migration guidance and/or information. 

## Azure services migration guides

### ![An icon that signifies this service is foundational.](media/icon-foundational.svg) Foundational services 

| **Products**  | 
| --- | 
| [Azure Application Gateway (V2)](migrate-app-gateway-v2.md) |
| [Azure Backup](migrate-recovery-services-vault.md)  | 
| [Azure Site Recovery](migrate-recovery-services-vault.md) |
| [Azure Storage account](migrate-storage.md) |
| [Azure Storage: Azure Data Lake Storage](migrate-storage.md) |
| [Azure Storage: Disk Storage](migrate-storage.md)|
| [Azure Storage: Blob Storage](migrate-storage.md) |
| [Azure Storage: Managed Disks](migrate-storage.md)|
| [Azure Virtual Machine Scale Sets](migrate-vm.md)|
| [Azure Virtual Machines](migrate-vm.md) |  
| Virtual Machines: [Av2-Series](migrate-vm.md) |
| Virtual Machines: [Bs-Series](migrate-vm.md) |
| Virtual Machines: [DSv2-Series](migrate-vm.md) |
| Virtual Machines: [DSv3-Series](migrate-vm.md) |
| Virtual Machines: [Dv2-Series](migrate-vm.md) |
| Virtual Machines: [Dv3-Series](migrate-vm.md) |
| Virtual Machines: [ESv3-Series](migrate-vm.md) |
| Virtual Machines: [Ev3-Series](migrate-vm.md) |
| Virtual Machines: [F-Series](migrate-vm.md) | 
| Virtual Machines: [FS-Series](migrate-vm.md) |
| Virtual Machines: [Azure Compute Gallery](migrate-vm.md)|  

\*VMs that support availability zones: AV2-series, B-series, DSv2-series, DSv3-series, Dv2-series, Dv3-series, ESv3-series, Ev3-series, F-series, FS-series, FSv2-series, and M-series.

### ![An icon that signifies this service is mainstream.](media/icon-mainstream.svg) Mainstream services

| **Products**   | 
| --- | 
| [Azure API Management](migrate-api-mgt.md)|
| [Azure App Service: App Service Environment](migrate-app-service-environment.md)|
| [Azure Cache for Redis](migrate-cache-redis.md)|
| [Azure Container Instances](migrate-container-instances.md) |
| [Azure Monitor: Log Analytics](migrate-monitor-log-analytics.md)|
| Azure Storage: [Files Storage](migrate-storage.md)|
| Virtual Machines: [Azure Dedicated Host](migrate-vm.md) |
| Virtual Machines: [Ddsv4-Series](migrate-vm.md) |
| Virtual Machines: [Ddv4-Series](migrate-vm.md) |
| Virtual Machines: [Dsv4-Series](migrate-vm.md) |
| Virtual Machines: [Dv4-Series](migrate-vm.md) |
| Virtual Machines: [Edsv4-Series](migrate-vm.md) |
| Virtual Machines: [Edv4-Series](migrate-vm.md) |
| Virtual Machines: [Esv4-Series](migrate-vm.md) |
| Virtual Machines: [Ev4-Series](migrate-vm.md) |
| Virtual Machines: [Fsv2-Series](migrate-vm.md) |
| Virtual Machines: [M-Series](migrate-vm.md) |


## Next steps


> [!div class="nextstepaction"]
> [Azure services and regions with availability zones](az-service-support.md)

> [!div class="nextstepaction"]
> [Availability of service by category](availability-service-by-category.md)

> [!div class="nextstepaction"]
> [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

> [!div class="nextstepaction"]
> [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
