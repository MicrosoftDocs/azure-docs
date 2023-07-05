---
title: Moving Azure Network Watcher resources
description: Learn about moving Azure Network Watcher resources across regions.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.date: 05/19/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Moving Azure Network Watcher resources across regions

The Network Watcher resource represents the backend service for Network Watcher and is fully managed by Azure. Customers don't need to manage it. The move operation isn't supported on this resource.

## Moving child resources of Network Watcher
Moving resources across regions is currently not supported for any child resource of the `networkWatcher` resource type.

## Next Steps
* For more information about Network Watcher, see the [Network Watcher overview](./network-watcher-monitoring-overview.md).
* For answers to the frequently asked questions, see the [Network Watcher FAQ](./frequently-asked-questions.yml).