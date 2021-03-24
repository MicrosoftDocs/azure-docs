---
title: Move Azure Network Watcher resources | Microsoft Docs
description: Move Azure Network Watcher resources across regions
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
ms.date: 01/07/2021
ms.author: damendo


---

# Moving Azure Network Watcher resources across regions

## Moving the Network Watcher resource
The Network Watcher resource represents the backend service for Network Watcher and is fully managed by Azure. Customers do not need to manage it. The move operation is not supported on this resource.

## Moving child resources of Network Watcher
Moving resources across regions is currently not supported for any child resource of the `*networkWatcher*` resource type.

## Next Steps
* Read the [Network Watcher overview](./network-watcher-monitoring-overview.md)
* See the [Network Watcher FAQ](./frequently-asked-questions.md)