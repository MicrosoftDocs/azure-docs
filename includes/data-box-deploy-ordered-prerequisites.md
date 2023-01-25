---
title: Prerequisites include file shared by two tabs in the same file  | Microsoft Docs
description: Prerequisites for Data Box service and device before deployment. 
services: databox
author: priestlg
ms.service: databox
ms.subservice: pod
ms.topic: include
ms.date: 07/08/2022
ms.author: v-grpr
---
### For service

[!INCLUDE [Data Box service prerequisites](data-box-supported-subscriptions.md)]

### For device

Before you begin, make sure that:

* You should have a host computer connected to the datacenter network. Data Box will copy the data from this computer. Your host computer must run a supported operating system as described in [Azure Data Box system requirements](../articles/databox/data-box-system-requirements.md).
* Your datacenter needs to have high-speed network. We strongly recommend that you have at least one 10-GbE connection. If a 10-GbE connection isn't available, a 1-GbE data link can be used, but the copy speeds are impacted.
