---

title: Reliability in Azure Data Manager for Energy
description: Find out about reliability in Azure Data Manager for Energy
author: bharathim 
ms.author: anaharris
ms.topic: conceptual
ms.service: energy-data-services
ms.custom: subject-reliability, references_regions
ms.date: 01/13/2023
---


# Reliability in Azure Data Manager for Energy (Preview)

This article describes reliability support in Azure Data Manager for Energy, and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](../reliability/overview.md).

[!INCLUDE [preview features callout](../energy-data-services/includes/preview/preview-callout.md)]



## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability in the case of a local zone failure.  When one zone experiences a failure, the remaining two zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](availability-zones-overview.md).

Azure Data Manager for Energy Preview supports zone-redundant instance by default and there's no setup required.

### Prerequisites

The Azure Data Manager for Energy Preview supports availability zones in the following regions:


| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| South Central US | North Europe         |               |                    |                |
| East US          | West Europe          |               |                    |                |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. There may be a brief degradation of performance until the service self-heals and re-balances underlying capacity to adjust to healthy zones. 

If you're experiencing failures with Azure Data Manager for Energy PreviewAPIs, you may need to implement a retry mechanism for 5XX errors.

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)