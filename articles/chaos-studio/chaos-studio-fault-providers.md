---
title: Supported resource types and role assignments for Chaos Studio
description: Understand the list of supported resource types and which role assignment is needed to enable an experiment to run a fault against that resource type.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 11/01/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021
---

# Supported resource types and role assignments for Chaos Studio

The following table lists the supported resource types for faults, the target types, and suggested roles to use when you give an experiment permission to a resource of that type.

| Resource type                                                    | Target name/type                          | Suggested role assignment                   |
|-------------------------------------------------------------------|--------------------------------------------|----------------------------------------------|
| Microsoft.Cache/Redis (service-direct)                           | Microsoft-AzureCacheForRedis              | Redis Cache Contributor                     |
| Microsoft.ClassicCompute/domainNames (service-direct)            | Microsoft-DomainNames                     | Classic Virtual Machine Contributor         |
| Microsoft.Compute/virtualMachines (agent-based)                  | Microsoft-Agent                           | Reader                                      |
| Microsoft.Compute/virtualMachineScaleSets (agent-based)          | Microsoft-Agent                           | Reader                                      |
| Microsoft.Compute/virtualMachines (service-direct)               | Microsoft-VirtualMachine                  | Virtual Machine Contributor                 |
| Microsoft.Compute/virtualMachineScaleSets (service-direct)       | Microsoft-VirtualMachineScaleSet          | Virtual Machine Contributor                 |
| Microsoft.ContainerService/managedClusters (service-direct)      | Microsoft-AzureKubernetesServiceChaosMesh | Azure Kubernetes Service Cluster Admin Role |
| Microsoft.DocumentDb/databaseAccounts (CosmosDB, service-direct) | Microsoft-CosmosDB                        | Azure Cosmos DB Operator                          |
| Microsoft.Insights/autoscalesettings (service-direct)            | Microsoft-AutoScaleSettings               | Web Plan Contributor                        |
| Microsoft.KeyVault/vaults (service-direct)                       | Microsoft-KeyVault                        | Azure Key Vault Contributor                       |
| Microsoft.Network/networkSecurityGroups (service-direct)         | Microsoft-NetworkSecurityGroup            | Network Contributor                         |
| Microsoft.Web/sites (service-direct)                             | Microsoft-AppService                      | Website Contributor                         |