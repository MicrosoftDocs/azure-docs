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

The following are the supported resource types for faults, the target types, and suggested roles to use when giving an experiment permission to a resource of that type.

| Resource Type | Target name | Suggested role assignment |
| - | - | - |
| Microsoft.Compute/virtualMachines (agent-based) | Microsoft-Agent | *None currently required* |
| Microsoft.Compute/virtualMachineScaleSets (agent-based) | Microsoft-Agent | *None currently required* |
| Microsoft.Compute/virtualMachines (service-direct) | Microsoft-VirtualMachine | Virtual Machine Contributor |
| Microsoft.Compute/virtualMachineScaleSets (service-direct) | Microsoft-VirtualMachineScaleSet | Virtual Machine Contributor |
| Microsoft.DocumentDb/databaseAccounts (CosmosDB, service-direct) | Microsoft-CosmosDB | Cosmos DB Operator |
| Microsoft.ContainerService/managedClusters (service-direct) | Microsoft-AzureKubernetesServiceChaosMesh | Azure Kubernetes Service Cluster User Role |
| Microsoft.Network/networkSecurityGroups (service-direct) | Microsoft-NetworkSecurityGroup | Network Contributor |
| Microsoft.Cache/Redis (service-direct) | Microsoft-AzureCacheForRedis | Redis Cache Contributor |