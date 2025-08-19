---
title: Reliability in Azure Application Gateway for Containers
description: Learn how to improve reliability in Azure Application Gateway for Containers by using availability zones and zone redundancy for more resilient performance.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.service: azure-appgw-for-containers
ms.custom: subject-reliability
ms.date: 02/07/2024 
---


# Reliability in Azure Application Gateway for Containers


This article describes reliability and availability zone support in [Azure Application Gateway for Containers](/azure/application-gateway/for-containers/overview). Learn how to configure zone redundancy to increase resilience and availability for container workloads. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zones and zone redundancy support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


Application Gateway for Containers (AGC) is always deployed in a highly available configuration.  For Azure regions that support availability zones, AGC is automatically configured as zone redundant.  For regions that don't support availability zones, availability sets are used.

### Prerequisites for availability zone support

To deploy with availability zone support, you must choose a region that supports availability zones. To see which regions support availability zones, see the [list of supported regions](regions-list.md). 


## Next steps

- [Reliability in Azure](/azure/reliability/overview)
