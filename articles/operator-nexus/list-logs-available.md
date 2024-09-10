---
title: List of logs available in Azure Operator Nexus
description: List of logs available in Azure Operator Nexus for streaming to customer's subscription by creating diagnostic settings.
author: neilverse
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 06/13/2024
ms.custom: template-reference
---

# List of logs available for streaming in Azure Operator Nexus

Logs emitted by Nexus Resources provide insight in the detailed operations of Nexus Resources and are useful for monitoring their health and availability. The logs are categorized into different categories based on the type of resource emitting the logs. These logs can be streamed to specific targets by creating [Diagnostic Settings](../azure-monitor/essentials/diagnostic-settings.md) in Azure Monitor.

## Nexus Cluster

| Log categories              | Description                              |
|-----------------------|:-----------------------------------------|
| Kubernetes Logs       | Logs emitted by the Kubernetes containers|
| VM Orchestration Logs | Logs emitted by the hypervisor service   |

## Bare metal servers

| Log categories      | Categories | Description |
|-------------|:--------------|:--------------|
| System | Debug, Info, Notice, Warning, Error, Critical | System logs from the Bare metal server |
| Security | Debug, Info, Notice, Warning, Error, Critical, Defender, BreakGlass Audit | Security logs from the Bare metal server |

## Storage appliance

| Log categories      | Description |
|-------------|:--------------|
| Storage Appliance logs | System Logs from Storage Appliance |
| Storage Appliance audits | Audit Logs from Storage Appliance |
| Storage Appliance alerts | Alert logs from Storage Appliance |

## Cluster Manager

| Log categories      | Description |
|-------------|:--------------|
| Cluster Manager Deploy or Upgrade Logs | Logs emitted during the deployment or upgrade of the Cluster from Cluster Manager |

## Target for streaming the logs

The logs available for collection from Azure Operator Nexus can be streamed to the following targets:
- Log Analytics Workspace
- Storage Account
- Event Hubs