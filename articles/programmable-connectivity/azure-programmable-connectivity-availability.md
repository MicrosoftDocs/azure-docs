---
title: Availability and redundancy
titleSuffix: Azure Programmable Connectivity
description: Azure Programmable Connectivity availability and redudancy.
author: leanid-sazankou
ms.author: lsazankou
ms.service: azure-programmable-connectivity
ms.topic: overview
ms.date: 08/21/2024
ms.custom: template-overview
---

# Availability and redundancy

Azure Programmable Connectivity (APC) is a regional service that can withstand and automatically handle loss of one of the datacenters within a region but doesn't automatically
failover or replicate data in case of a full regional outage. Customers must take additional actions to implement regional redudancy.

## Enabling regional redudancy

To enable regional redudancy customers must manually create multiple APC gateways in the regions of their choice. The gateways must have similar sets of Network APIs enabled. Lastly, the calling code should be configured with the URLs of all provisioned gateways and invoke appropriate resiliency strategies.

> [!IMPORTANT]
> Curretnly, APC does not guarantee presence of all possible combinations of Network APIs and Operators in all regions.
