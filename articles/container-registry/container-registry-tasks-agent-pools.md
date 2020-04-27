---
title: Agent pool - Tasks
description: Learn about ... in an Azure Container Registry task.
ms.topic: article
ms.date: 04/27/2020
---

# Use a dedicated agent pool in an ACR Task

This article provides background information and examples to specify an agent pool in an [Azure Container Registry task](container-registry-tasks-overview.md). When you specify an agent pool, the ACR task runs on a dedicated virtual machine pool instead of the default execution environment for an ACR Task. [which is??]

An agent pool provides:

* **Virtual network support** -  An agent pool may be assigned to an Azure VNet, providing access to network resources such as a container registry, key vault, or storage
* **Scale as needed** - Scale up an agent pool as needed, or scale to zero, with billing based on allocation
* **Memory and CPU options** - Choose an agent pool configuration that meets your scale and workload requirements 
* **Azure management** - Pools are patched and maintained by Azure. They provide a balance between reserved allocation without the need to maintain individual virtual machines.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations](#limitations) apply. Previews are made available to you on the condition that you agree to the supplemental [terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Limitations

* Agent pools currently support Linux nodes. Windows nodes aren't currently supported.
* For each registry, the default total CPU quota of all agent pools is 16. Please open a [support request](https://aka.ms/acr/support/create-ticket) for additional allocation.

## Agent pool tiers

|Tier  |CPU  |Memory (GB)  |
|---------|---------|---------|
|S1     |    2     |      3   |
|S2     |    4     |     8    |
|S3     |    8     |     16    |


## 
## Next steps

<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
