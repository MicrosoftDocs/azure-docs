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
ms.date: 07/27/2020
ms.author: damendo


---

# Data residency for the Network Watcher service
The Network Watcher service does not store customer data except for the Connection Monitor (Preview) service.

## Connection Monitor (preview) data residency
The Connection Monitor (preview) service stores customer data. This data is automatically stored by Connection Monitor (preview) in a single region. So Connection Monitor (preview) automatically satisfies in region data residency requirements including those specified in the [Trust Center](https://azuredatacentermap.azurewebsites.net/)
