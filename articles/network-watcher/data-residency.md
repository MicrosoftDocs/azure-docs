---
title: Data residency for Network Watcher | Microsoft Docs
description: Understand data residency for the Network Watcher service
services: network-watcher
documentationcenter: na
author: damendo
manager:
editor:
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 20/07/2020
ms.author: damendo


---

# Data residency for the Network Watcher service
The Network Watcher service does not store customer data except for the Connection Monitor (Preview) service.


## Connection Monitor (preview) data residency
The *Connection Monitor (preview)* service stores customer data. This data is automatically stored by Network Watcher in a single region, so this service automatically satisfies in region data residency requirements including those specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net/)

##Singapore data residency

In Azure, the feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo. For all other regions, customer data is stored in Geo. For more information, see [Trust Center](https://azuredatacentermap.azurewebsites.net/).

**Note on prior replication**

Customers have the option of storing end-user IP addresses with their Network Watcher (NW) instance so that NW can monitor reachability, latency, and network topology changes related to the end-user IP addresses. These end-user IP addresses may be classified as Customer Data. As of July 15, 2020, NW stored this data in a single region (Customer Data is no longer being replicated to HK). This data is no longer being replicated to HK. This Customer Data is and was encrypted at rest.

If this Customer Data were to be accessible by a third party, that would allow the third party to know the IP address but would not grant the third party access to the machine/device associated with the IP address. NW believes that no third parties accessed this Customer Data in HK.
