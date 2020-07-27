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
Connection Monitor service stores customer data. This data is automatically stored by Network Watcher in a single region, so this service automatically satisfies in region data residency requirements including those specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net/)
