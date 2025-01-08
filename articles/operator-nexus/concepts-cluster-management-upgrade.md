---
title: Azure Operator Nexus cluster management upgrade overview
description: Get an overview of cluster management upgrade for Azure Operator Nexus.
author: matternst7258
ms.author: matthewernst
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 11/19/2024
ms.custom: template-concept
---

# Operator Nexus management upgrades

Operator Nexus releases various functionality and bug fixes throughout the month to update the Azure resources and on-premises extensions, critical in communications back to Azure. 

## Scope

The releases update components on the Cluster Manager and Network Fabric Controller to enable new functionality, while maintaining backwards compatibility for the customer. Additionally, new runtime releases make available and accessed via [Cluster Runtime Upgrades](./howto-cluster-runtime-upgrade.md) and [Network Fabric Upgrades](./howto-upgrade-nexus-fabric.md).

For Compute management, Microsoft delivers new software to the extensions and agents that exist on the platform to provide new functionality and maintain security and communication back to Azure.

## Impact to customer workloads

The intent of these releases is no disruption to running workloads, instantiating new workloads, and on-premises resources retain availability throughout the upgrade. Therefore, the customer should see no impact. 

## Duration of on-premises updates

These updates take up to one hour to complete per cluster. 