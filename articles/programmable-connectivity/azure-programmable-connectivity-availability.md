---
title: Availability and redundancy
titleSuffix: Azure Programmable Connectivity
description: Azure Programmable Connectivity availability and redundancy.
author: leanid-sazankou
ms.author: lsazankou
ms.service: azure-programmable-connectivity
ms.topic: overview
ms.date: 08/21/2024
ms.custom: template-overview
---

# Availability and redundancy

Azure Programmable Connectivity (APC) is a regional service that can withstand and automatically handle loss of one of the datacenters within a region. However it doesn't automatically
fail over or replicate data if there's a full regional outage. Customers must take extra actions to implement regional redundancy.

## Enabling regional redundancy

To enable regional redundancy, customers must manually create multiple APC gateways in the regions of their choice. Each gateway must be provisioned with the set of Network APIs for which regional redundancy is desired. Lastly, the calling code should be configured with the URLs of all provisioned gateways and invoke appropriate resiliency strategies.

> [!IMPORTANT]
> APC does not guarantee presence of all possible combinations of Network APIs and Operators in all regions.
