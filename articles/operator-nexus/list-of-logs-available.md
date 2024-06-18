---
title: List of Logs Available in Azure Operator Nexus.
description: List of logs available in Azure Operator Nexus.
author: neilverse
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 06/13/2024
ms.custom: template-reference
---

# List of logs available for streaming in Azure Operator Nexus

Logs emitted by Nexus Resources provide insight in the detailed operations of Nexus Resources and are useful for monitoring their health and availability. The logs are categorized into different categories based on the type of resource emitting the logs. These logs can be streamed to specific targets by creating [Diagnostic Settings](../azure-monitor/essentials/diagnostic-settings.md) in Azure Monitor.

- [List of logs available for streaming in Azure Operator Nexus](#list-of-logs-available-for-streaming-in-azure-operator-nexus)
  - [Nexus Cluster](#nexus-cluster)
  - [Baremetal servers](#baremetal-servers)
  - [Storage Appliances](#storage-appliances)
  - [Cluster Manager](#cluster-manager)
  - [Target for Streaming the logs](#target-for-streaming-the-logs)

## Nexus Cluster

| Log Categories              | Description                              |
|-----------------------|:----------------------------------------:|
| Kubernetes Logs       | Logs emitted by the Kubernetes containers|
| VM Orchestration Logs | Logs emitted by the hypervisor service   |

## Baremetal servers

| Log Categories      | Categories | Description |
|-------------|:-------------:|:-------------:|
| System | Debug, Info, Notice, Warning, Error, Critical | System logs from the Baremetal server |
| Security | Debug, Info, Notice, Warning, Error, Critical, Defender, BreakGlass Audit | Security logs from the Baremetal server |

## Storage Appliances

| Log Categories      | Description |
|-------------|:-------------:|
| Storage Appliance logs | System Logs from Storage Appliance |
| Storage Appliance audits | Audit Logs from Storage Appliance |
| Storage Appliance alerts | Alert logs from Storage Appliance |

## Cluster Manager

| Log Categories      | Description |
|-------------|:-------------:|
| Cluster Manager Deploy or Upgrade Logs | Logs emitted during the deployment or upgrade of the Cluster from Cluster Manager |

## Target for Streaming the logs

The logs available for collection from Azure Operator Nexus can be streamed to the following targets:

- Log Analytics Workspace
- Storage Account
- Event Hub

