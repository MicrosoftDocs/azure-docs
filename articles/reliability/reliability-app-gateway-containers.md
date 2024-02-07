---
title: Reliability in Azure Application Gateway for Containers
description: Find out about reliability in Azure Application Gateway for Containers.
services: application-gateway
author: anaharris-ms
ms.author: anaharris
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.custom: subject-reliability, references_regions
ms.date: 02/07/2024 
---


# Reliability in Azure Application Gateway for Containers


This article describes reliability and availability zones support in [Azure Application Gateway for Containers](/azure/application-gateway/for-containers/overview). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


Application Gateway for Containers supports zone-redundancy by default.  You don't need to set it up or reconfigure for availability zone support. 


### Prerequisites

To deploy with availability zone support, you must choose a region that supports availability zones. To see which regions supports availability zones, see the [list of supported regions](availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

>[!TIP]
>If your region doesn't support availability zones, you can use [fault domains and update domains]() to mitigate impact during planned maintenance and unexpected failures.


## Next steps


- [Reliability in Azure](/azure/availability-zones/overview)
