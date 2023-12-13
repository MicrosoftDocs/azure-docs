---
title: Data residency for Azure Network Watcher
description: Learn about data residency for the Azure Network Watcher.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.date: 05/25/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23, references_regions

---

# Data residency for Azure Network Watcher

Azure Network Watcher doesn't store customer data, except for the Connection monitor.

## Connection monitor data residency

Connection monitor stores customer data. This data is automatically stored by Network Watcher in a single region. So Connection Monitor automatically satisfies in-region data residency requirements, including requirements specified on the [Microsoft Trust Center](https://www.microsoft.com/trust-center).

## Data residency in Azure

In Azure, single region data residency is currently provided by default only in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. For all other regions, customer data is stored in Geo. For more information, see the [Data residency in Azure](https://azure.microsoft.com/explore/global-infrastructure/data-residency).

## Next steps

To learn more about Network Watcher features and capabilities, see [What is Azure Network Watcher?](network-watcher-overview.md)
