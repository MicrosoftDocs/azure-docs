---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 10/16/2020
ms.author: larryfr
---

Azure allows you to place _locks_ on resources, so that they cannot be deleted or are read only. __Locking a resource can lead to unexpected results__ because some operations that don't seem to modify the resource actually require actions that are blocked by the lock. For example, applying a delete lock (to prevent deletions) to the resource group that contains your workspace will prevent scaling operations for Azure ML compute clusters.

For more information on locking resources, see [Lock resources to prevent unexpected changes](../articles/azure-resource-manager/management/lock-resources.md).