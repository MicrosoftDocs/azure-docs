---
title: Troubleshoot Azure Operator Nexus Cluster Heartbeat Connection Status shows Disconnected
description: Provide steps to investigate and possibly resolve circumstances that are preventing the Cluster from sending heartbeats to the Cluster Manager.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 04/28/2025
ms.author: omarrivera
author: omarrivera
---
# Troubleshoot Azure Operator Nexus Cluster Heartbeat Connection Status shows Disconnected

This guide attempts to provide steps to troubleshoot a Cluster with a `clusterConnectionStatus` in `Disconnected` state.
For a Cluster, the `ClusterConnectionStatus` represents the stability in the connection between the on-premises Cluster and its ability to reach the Cluster Manager.

> [!IMPORTANT]
> The `ClusterConnectionStatus` **doesn't** represent or is related to the health or connectivity of the Arc Connected Kubernetes Cluster.
> The `ClusterConnectionStatus` indicates that the Cluster is successful in sending heartbeats and receiving acknowledgment from the Cluster Manager.

> [!CAUTION]
> The information the `ClusterConnectionStatus` provides is an indication of a symptom of instability, not the root cause.
> This guide focuses on identifying basic signals and components that might help locate the problem but might not cover all scenarios.

[!include[prereq-az-cli](./includes/baremetal-machines/prerequisites-azure-cli-bare-metal-machine-actions.md)]

## Understanding the ClusterConnectionStatus signal

The `ClusterConnectionStatus` represents the ability for the on-premises Cluster to successfully send heartbeats and receive acknowledgments from the Cluster Manager.
The continuous heartbeat messages are meant to detect the network connection health between the on-premises Cluster and the corresponding Cluster Manager.
The `ClusterConnectionStatus` **isn't** the same as the connectivity of the Arc Connected Kubernetes Cluster.
If there's network related issues, it's possible that the Arc Connected Kubernetes Cluster might also be affected.

A Cluster resource has the property `ClusterConnectionStatus` which is set to the value `Connected` as the heartbeats are continuously received and acknowledged.
The `ClusterConnectionStatus` becomes `Connected` once the Cluster is in a healthy state and network connectivity issues are resolved.
The Cluster shows `Timeout` only as a transitional state between `Connected` and `Disconnected`.
The Cluster `ClusterConnectionStatus` value becomes `Disconnected` as Cluster Manager detects continuously missed heartbeats.

During the Cluster deployment process, the Cluster is in `Undefined` state until the Cluster is fully deployed and operational.

The following table shows which status is displayed depending on the state of the undercloud cluster:

| Status         | Definition                                                                                                            |
|----------------|-----------------------------------------------------------------------------------------------------------------------|
| `Connected`    | Heartbeats received, indicates healthy cluster and cluster manager connectivity                                       |
| `Disconnected` | Heartbeats missed for __over 5 minutes__, indicates likely connectivity issue between Cluster Manager and Cluster     |
| `Timeout`      | Heartbeats missed for __over 2 minutes but less than 5 minutes__, cluster connectivity is uncertain possibly degraded |
| `Undefined`    | Cluster not yet deployed or running a version without the heartbeats feature                                          |

## Check the ClusterConnectionStatus

The value of `ClusterConnectionStatus` is visible in the Azure portal in the Cluster resource view.

![!include[clusterConnectionStatus](./includes/cluster-connection-status.md)]

Or, you can use the Azure CLI to see the value of `ClusterConnectionStatus`:

```azurecli
az networkcloud cluster show \
  -g "$CLUSTER_RG" \
  -n "$CLUSTER_NAME" \
  --subscription "$SUBSCRIPTION_ID" \
  --query "{ClusterConnectionStatus:clusterConnectionStatus}" \
  --output table

ClusterConnectionStatus
-------------------------
Connected
```

## Basic Investigation Steps

### 1. Ensure Network Connectivity for the Cluster

TODO - what steps could be done here?

### Other possible causes to evaluate

- Are there recent changes to the Managed Identity permissions for the Cluster Manager or Cluster?
  - The Managed Identities (MI) and their permissions are used for service-to-service authentication. A change in the permissions results in authentication failures for the heartbeat messages. Cluster Managers must both receive and acknowledge heartbeats failure to do so will also result in a `ClusterConnectionStatus` of `Disconnected`.

If the Cluster is expected to be healthy but the `ClusterConnectionStatus` remains in `Disconnected` state [contact support] after following the steps in this guide.

[!include[stillHavingIssues](./includes/contact-support.md)]

[contact support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade