---
title: Azure Operator Nexus Cluster management upgrade overview
description: Get an overview of Cluster management upgrade for Azure Operator Nexus.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 07/16/2025
ms.custom: template-concept
---

# Operator Nexus Cluster management upgrades
Operator Nexus releases various functionality and bug fixes throughout the product lifecycle to update the Azure resources and on-premises extensions, critical in communications back to Azure. 

## Scope
The releases update components on the Cluster Manager to enable new functionality, while maintaining backwards compatibility for the customer. Additionally, new runtime releases are made available and accessed via [Cluster Runtime Upgrades](./howto-cluster-runtime-upgrade.md).

For Compute management, Microsoft delivers new software to the extensions and agents that exist on the platform to provide new functionality and maintain security and communication back to Azure.

## Delivery
Cluster Manager update is triggered independently when the release is available in the region.

## Impact to customer workloads
There's no disruption to running workloads or instantiating new workloads, and on-premises resources retain availability throughout the upgrade. Therefore, the customer sees no impact. 

## Duration of on-premises updates
Updates take up to one hour to complete per cluster.

## Related Information
For concepts on Network Fabric management upgrades, see [Azure Operator Nexus Network Fabric management upgrade overview](./concepts-fabric-management-upgrade.md).
