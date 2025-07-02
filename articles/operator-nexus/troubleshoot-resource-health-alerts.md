---
title: Troubleshoot resource health alerts
description: Find troubleshooting guides for platform-emitted resource health alerts.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 07/02/2025
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

[Troubleshoot Cluster heartbeat connection status shows disconnected]: ./troubleshoot-cluster-heartbeat-connection-status-disconnected.md

## Please Contact Support

For some resource health alerts, troubleshooting guides are not available.
If you encounter these alerts, it is recommended to [contact Azure support] for further assistance.

[contact Azure support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade

[!include[stillHavingIssues](./includes/contact-support.md)]
