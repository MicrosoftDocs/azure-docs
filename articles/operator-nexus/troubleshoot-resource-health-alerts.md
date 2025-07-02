---
title: Troubleshoot resource health alerts
description: Find troubleshooting guides for platform-emitted resource health alerts.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 04/29/2025
ms.author: omarrivera
author: omarrivera
---

# Troubleshoot resource health alerts

This guide provides a breakdown of the resource health alerts emitted by the Azure Operator Nexus platform.
It includes a description of each alert and links to troubleshooting guides for each alert.

Resource health alerts emitted by the platform to indicate the health of a particular resource.
These alerts are generated based on the status of the resource and its dependencies.

## Cluster

| Resource Health Event Name                                                                             | Troubleshooting Guide                                                 |
|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| `1PExtensionsFailedInstall`                                                                            | [Requires to contact support](#please-contact-support) |
| `ClusterHeartbeatConnectionStatusDisconnectedClusterManagerOperationsAreAffectedPossibleNetworkIssues` | [Troubleshoot Cluster heartbeat connection status shows disconnected] |
| `ClusterHeartbeatConnectionStatusTimedoutPossiblePerformanceIssues`                                    | [Troubleshoot Cluster heartbeat connection status shows disconnected] |
| `ETCDPossibleQuorumLossClusterOperationsAreAffected`                                                   | [Troubleshoot Cluster Manager Not Reachable]                          |
| `ETCDPossibleQuorumLossDegradedProposalsProcessing`                                                    | [Troubleshoot Cluster Manager Not Reachable]                          |
| `ETCDPossibleQuorumLossIncreasedProposalsProcessingFailures`                                           | [Troubleshoot Cluster Manager Not Reachable]                          |
| `ETCDPossibleQuorumLossNoClusterLeader`                                                                | [Troubleshoot Cluster Manager Not Reachable]                          |

[Troubleshoot Cluster heartbeat connection status shows disconnected]: ./troubleshoot-cluster-heartbeat-connection-status-disconnected.md
[Troubleshoot Cluster Manager Not Reachable]: ./troubleshoot-etcd-cluster-possible-quorum-lost.md

## Bare Metal Machine

| Resource Health Event Name         | Troubleshooting Guide                                                                                                                                                                                   |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BMMHasNodeReadinessProblem`       | [Troubleshoot Bare Metal Machine in not ready state](troubleshoot-bare-metal-machine-not-ready-state.md)                                                                                                |
| `BMMHasNodeReadinessProblem`       | [Troubleshoot Bare Metal Machine in not ready state](troubleshoot-bare-metal-machine-not-ready-state.md)                                                                                                |
| `BMMHasLACPDownStatusCondition`    | [Troubleshoot Degraded status errors on an Azure Operator Nexus Cluster Bare Metal Machine](troubleshoot-bare-metal-machine-degraded.md#degraded-lacp-status-is-down)                                   |
| `BMMHasPortDownStatusCondition`    | [Troubleshoot Degraded status errors on an Azure Operator Nexus Cluster Bare Metal Machine](troubleshoot-bare-metal-machine-degraded.md#degraded-port-down)                                             |
| `BMMHasPortFlappingStatusCondition`| [Troubleshoot Degraded status errors on an Azure Operator Nexus Cluster Bare Metal Machine](troubleshoot-bare-metal-machine-degraded.md#degraded-port-flapping)                                         |
| `BMMHasHardwareValidationFailures` | [Troubleshoot 'Warning' detailed status messages on an Azure Operator Nexus Cluster Bare Metal Machine](troubleshoot-bare-metal-machine-warning.md#warning-this-machine-has-failed-hardware-validation) |
| `BMMPowerStateDoesNotMatchExpected`| [Troubleshoot 'Warning' detailed status messages on an Azure Operator Nexus Cluster Bare Metal Machine](troubleshoot-bare-metal-machine-warning.md#warning-bmm-power-state-doesnt-match-expected-state) |
| `BMMPxePortIsUnhealthy`            | [Troubleshoot 'Warning' detailed status messages on an Azure Operator Nexus Cluster Bare Metal Machine](troubleshoot-bare-metal-machine-warning.md#warning-pxe-port-is-unhealthy)                       |

## Please Contact Support

There are no troubleshooting guides available for the following resource health alerts.
It is recommended to contact Azure support for assistance with these issues.
If you encounter these alerts, please [contact support] for assistance.

[contact support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade

[!include[stillHavingIssues](./includes/contact-support.md)]
