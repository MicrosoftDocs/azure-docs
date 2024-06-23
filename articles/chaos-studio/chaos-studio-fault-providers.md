---
title: Supported resource types and role assignments for Chaos Studio
description: Understand the list of supported resource types and which role assignment is needed to enable an experiment to run a fault against that resource type.
services: chaos-studio
author: prasha-microsoft
ms.topic: article
ms.date: 11/01/2021
ms.author: abbyweisberg
ms.reviewer: prashabora
ms.service: chaos-studio
---

# Supported resource types and role assignments for Chaos Studio

The following table lists the supported resource types for faults, the target types, and suggested roles to use when you give an experiment permission to a resource of that type.

More information about role assignments can be found on the [Azure built-in roles page](../role-based-access-control/built-in-roles.md).

| Resource type                                                    | Target name/type                          | Suggested role assignment                   |
|-------------------------------------------------------------------|--------------------------------------------|----------------------------------------------|
| Microsoft.Cache/Redis (service-direct)                           | Microsoft-AzureCacheForRedis              | [Redis Cache Contributor](../role-based-access-control/built-in-roles.md#redis-cache-contributor)                     |
| Microsoft.ClassicCompute/domainNames (service-direct)            | Microsoft-DomainNames                     | [Classic Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#classic-virtual-machine-contributor)       |
| Microsoft.Compute/virtualMachines (agent-based)                  | Microsoft-Agent                           | [Reader](../role-based-access-control/built-in-roles.md#reader)                                      |
| Microsoft.Compute/virtualMachineScaleSets (agent-based)          | Microsoft-Agent                           | [Reader](../role-based-access-control/built-in-roles.md#reader)                                      |
| Microsoft.Compute/virtualMachines (service-direct)               | Microsoft-VirtualMachine                  | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor)                 |
| Microsoft.Compute/virtualMachineScaleSets (service-direct)       | Microsoft-VirtualMachineScaleSet          | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor)                 |
| Microsoft.ContainerService/managedClusters (service-direct)      | Microsoft-AzureKubernetesServiceChaosMesh | [Azure Kubernetes Service Cluster Admin Role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) |
| Microsoft.DocumentDb/databaseAccounts (Cosmos DB, service-direct) | Microsoft-Cosmos DB                        | [Azure Cosmos DB Operator](../role-based-access-control/built-in-roles.md#cosmos-db-operator)                          |
| Microsoft.Insights/autoscalesettings (service-direct)            | Microsoft-AutoScaleSettings               | [Web Plan Contributor](../role-based-access-control/built-in-roles.md#web-plan-contributor)                        |
| Microsoft.KeyVault/vaults (service-direct)                       | Microsoft-KeyVault                        | [Azure Key Vault Contributor](../role-based-access-control/built-in-roles.md#key-vault-contributor)                       |
| Microsoft.Network/networkSecurityGroups (service-direct)         | Microsoft-NetworkSecurityGroup            | [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor)                         |
| Microsoft.Web/sites (service-direct)                             | Microsoft-AppService                      | [Website Contributor](../role-based-access-control/built-in-roles.md#website-contributor)                         |
| Microsoft.ServiceBus/namespaces (service-direct)                 | Microsoft-ServiceBus                      | [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner)                         |
| Microsoft.EventHub/namespaces (service-direct)                   | Microsoft-EventHub                        | [Azure Event Hubs Data Owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner)                         |
| Microsoft.LoadTestService/loadtests (service-direct)             | Microsoft-AzureLoadTest                   | [Load Test Contributor](../role-based-access-control/built-in-roles.md#load-test-contributor)                         |
