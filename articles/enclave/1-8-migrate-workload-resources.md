---
title: Migrate Resources into or within Azure Enclave
description: Migrate Resources into or within Azure Enclave.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 9/30/2025
---

# Tutorial 1-8: Migrate Resources into or within Azure Enclave

This article covers how to [move resources](/azure/azure-resource-manager/management/move-resource-group-and-subscription) when those resources are linked to Azure Enclave resources (for example enclaves or workloads).

## Supported Resources
Ensure your resources are included in this [moveable resources](/azure/azure-resource-manager/management/move-support-resources) list.

## Example move
Resources for an enclave are split between the enclave managed resource group (MRG) and the workload resource group. Following [this example scenario](/azure/azure-resource-manager/management/move-resource-group-and-subscription#scenario-for-moving-across-subscriptions) the resources to be moved should be put in one resource group. Connections outside of the enclave should also be removed.

## More information
Read [this article](./migrate-azure-resources-azure-enclave.md) for more information on moving Azure resources into Azure Enclave.
