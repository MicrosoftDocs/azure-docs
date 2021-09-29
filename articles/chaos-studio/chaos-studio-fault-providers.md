---
title: Supported resource types and role assignments for Chaos Studio
description: Understand the list of supported resource types and which role assignment is needed to enable an experiment to run a fault against that resource type.
services: chaos-studio
author: johnkemnetz
ms.topic: article
ms.date: 08/26/2021
ms.author: johnkem
ms.service: chaos-studio
---

# Supported resource types and role assignments for Chaos Studio

The following are the supported provider types for faults, the provider configurations, and a suggested role to use when giving an experiment permission to the resource.

| Resource Type | Provider Configuration | Suggested role assignment |
| - | - | - |
| Microsoft.Compute/virtualMachines (agent-based) | ChaosAgent | *None currently required* |
| Microsoft.Compute/virtualMachineScaleSets (agent-based) | ChaosAgent | *None currently required* |
| Microsoft.Compute/virtualMachines (service-direct) | AzureVmChaos | Virtual Machine Contributor |
| Microsoft.Compute/virtualMachineScaleSets (service-direct) | AzureVmssVmChaos | Virtual Machine Contributor |
| Microsoft.DocumentDb/databaseAccounts (CosmosDB, service-direct) | AzureCosmosDbChaos | Cosmos DB Operator |
| Microsoft.ContainerService/managedClusters (service-direct) | ChaosMeshAKSChaos | Azure Kubernetes Service Cluster User Role |
| Microsoft.Network/networkSecurityGroup (service-direct) | AzureNetworkSecurityGroupChaos | Network Contributor |
