---
title: Troubleshoot Azure Operator Nexus Cluster Heartbeat Connection Status shows Disconnected
description: Provide steps to investigate and possibly resolve circumstances that are preventing the Cluster from sending heartbeats to the Cluster Manager.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 10/09/2024
ms.author: omarrivera
author: omarrivera
---
# Troubleshoot Azure Operator Nexus Cluster Heartbeat Connection Status shows Disconnected

This guide attempts to provide steps to troubleshoot a Cluster is shown to have `clusterConnectionStatus` with a value of `Disconnected`.

> [!CAUTION]
> The `ClusterConnectionStatus` is likely a symptom or signal and not the root cause and this guide will not be able to provide answers for all scenarios.
> The focus and purpose of this guide is to provide common issues and signals that can be inspected to determine where the issue might be.
## Understanding the Issue

Cluster Managers ensure continuous Cluster network connectivity through a heartbeat agent running within the target Cluster.
The cluster-heartbeat agent sends periodic HTTP messages to the Cluster Manager and expects an acknowledgment response as well.
A Cluster has the property `ClusterConnectionStatus` which is set to the value `Connected` as the heartbeats are continuously received and acknowledged.

The `ClusterConnectionStatus` becomes `Connected` once the cluster is in a healthy state and network connectivity issues are resolved.
If the Cluster is expected to be healthy but the `ClusterConnectionStatus` remains in `Disconnected` state [contact support] after following the steps in this guide.

> [!IMPORTANT]
> `ClusterConnectionStatus` is **not** the same as Arc Connected Kubernetes Clusters.
The command can be used to see the value of `ClsuterConnectionStatus` and it is visible in Azure Portal in the Cluster resource's JSON view.

```azurecli
az networkcloud cluster show --subscription "$SUBSCRIPTION_ID" -g "$CLUSTER_RG" -n "$CLUSTER_NAME" --output table --query "{ClusterConnectionStatus:clusterConnectionStatus}"
ClusterConnectionStatus
-------------------------
Connected
```

The following table shows which status is displayed depending on the state of the undercloud cluster:

| Status         | Definition                                                                                                            |
|----------------|-----------------------------------------------------------------------------------------------------------------------|
| `Connected`    | Heartbeats received, indicates healthy cluster and cluster manager connectivity                                       |
| `Disconnected` | Heartbeats missed for __over 5 minutes__, indicates likely connectivity issue between Cluster Manager and Cluster     |
| `Timeout`      | Heartbeats missed for __over 2 minutes but less than 5 minutes__, cluster connectivity is uncertain possibly degraded |
| `Undefined`    | Cluster not yet deployed or running a version without the heartbeats feature                                                      |

## Basic Investigation Steps

### 1. Ensure Network Connectivity for the Cluster

TODO - what steps could be done here?

### Other possible causes to evaluate

- Are there recent changes to the Managed Identity permissions for the Cluster Manager or Cluster?
  - The Managed Identities (MI) and their permissions are used for service-to-service authentication. A change in the permissions results in authentication failures for the heartbeat messages. Cluster Managers must both receive and acknowledge heartbeats failure to do so will also result in a `ClusterConnectionStatus` of `Disconnected`.

[!include[stillHavingIssues](./includes/contact-support.md)]

[contact support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade