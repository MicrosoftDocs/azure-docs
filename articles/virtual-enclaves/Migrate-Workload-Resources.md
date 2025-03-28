---
title: Migrate Resources into or within AVE
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Migrate Resources into or within AVE

This article covers how to [move resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription) when those resources are linked to AVE resources (e.g. Enclaves or Workloads).

## Supported Resources
Ensure your resources are included in this [moveable resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-support-resources) list.

## Example move
Resources for an enclave are split between the enclave managed resource group (MRG) and the workload resource group. Following [this example scenario](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription#scenario-for-move-across-subscriptions) the resources to be moved should be put in one resource group. Connections outside of the enclave should also be removed.

## More information
Please read [this article](/docs/How%20To%20Guides/Migrate%20Azure%20Resources%20into%20Azure%20Virtual%20Enclaves) for more information on moving Azure resources into AVE.
