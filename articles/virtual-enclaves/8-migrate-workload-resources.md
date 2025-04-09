---
title: Migrate Resources into or within AVE
description: Migrate Resources into or within AVE.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: tutorial
ms.date: 04/08/2025
---

# Tutorial 8: Migrate Resources into or within AVE

This article covers how to [move resources](../azure-resource-manager/management/move-resource-group-and-subscription.md) when those resources are linked to AVE resources (for example Enclaves or Workloads).

## Supported Resources
Ensure your resources are included in this [moveable resources](../azure-resource-manager/management/move-support-resources.md) list.

## Example move
Resources for an enclave are split between the enclave managed resource group (MRG) and the workload resource group. Following [this example scenario](../azure-resource-manager/management/move-resource-group-and-subscription.md#scenario-for-moving-across-subscriptions) the resources to be moved should be put in one resource group. Connections outside of the enclave should also be removed.

## More information
Read [this article](./migrate-azure-resources-into-azure-virtual-enclaves.md) for more information on moving Azure resources into AVE.
