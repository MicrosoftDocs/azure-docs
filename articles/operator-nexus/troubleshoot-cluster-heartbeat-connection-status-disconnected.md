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

# Troubleshoot Cluster heartbeat connection status shows disconnected

This guide attempts to provide steps to troubleshoot a Cluster with a `clusterConnectionStatus` in `Disconnected` state.
For a Cluster, the `ClusterConnectionStatus` represents the stability in the connection between the on-premises Cluster and its ability to reach the Cluster Manager.

> [!IMPORTANT]
> The `ClusterConnectionStatus` **doesn't** represent or is related to the health or connectivity of the Arc Connected Kubernetes Cluster.
> The `ClusterConnectionStatus` indicates that the Cluster is successful in sending heartbeats and receiving acknowledgment from the Cluster Manager.

[!include[prereq-az-cli](./includes/baremetal-machines/prerequisites-azure-cli-bare-metal-machine-actions.md)]

## Understanding the Cluster connection status signal

The `ClusterConnectionStatus` represents the ability of the on-premises Cluster to send heartbeats and receive acknowledgments from the Cluster Manager, indicating the health of the network connection between them.
`ClusterConnectionStatus` distinct from the connectivity of the Arc Connected Kubernetes Cluster, though network issues affect both.

A Cluster resource has the property `ClusterConnectionStatus` which is set to the value `Connected` as the heartbeats are continuously received and acknowledged.
The `ClusterConnectionStatus` becomes `Connected` once the Cluster is in a healthy state and network connectivity issues are resolved.
The Cluster shows `Timeout` only as a transitional state between `Connected` and `Disconnected`.
The Cluster `ClusterConnectionStatus` value becomes `Disconnected` as Cluster Manager detects continuously missed heartbeats.
Once the cluster is a healthy state and there no network connectivity issues, the `ClusterConnectionStatus` automatically moves to `Connected`

During the Cluster deployment process, the Cluster is in `Undefined` state until the Cluster is fully deployed and operational.

The following table shows the possible values of `ClusterConnectionStatus` and their definitions:

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

## Common investigation steps

Infrastructure networking issues, permission changes in the Managed Identity, or other issues that might not be obvious at first, affect the Cluster resource connection status.
The following sections provide some common investigation steps and references to help troubleshoot.

> [!IMPORTANT]
> The `ClusterConnectionStatus` indicates general instability, not the root cause.
> This guide provides general resource health checks that might help locate the problem or at least help collect information useful for customer support.

### Cluster Network Fabric health and connectivity

It's useful to start with the Network Fabric [controller][Network Fabric Controller] and [services][Network Fabric Services] resources.
Verify the [network configuration][How to Configure Network Fabric], including rack cabling, IP addresses, DNS settings, routing rules, firewall rules, and any other network-related settings that might be affecting the connectivity.

[How to Configure Network Fabric]: https://learn.microsoft.com/en-us/azure/operator-nexus/howto-configure-network-fabric
[Network Fabric Controller]: https://learn.microsoft.com/en-us/azure/operator-nexus/concepts-network-fabric-controller
[Network Fabric Services]: https://learn.microsoft.com/en-us/azure/operator-nexus/concepts-network-fabric-services

Evaluate any configured monitoring or metrics for the Network Fabric resources.
For more information, see the following links:

- [Nexus Network Fabric configuration monitoring overview](https://learn.microsoft.com/en-us/azure/operator-nexus/concepts-network-fabric-configuration-monitoring)
- [How to configure diagnostic settings and monitor configuration differences in Nexus Network Fabric](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-configure-diagnostic-settings-monitor-configuration-differences)
- [Azure Operator Nexus Network Fabric internal network BGP metrics](https://learn.microsoft.com/en-us/azure/operator-nexus/concepts-internal-network-bgp-metrics)
- [How to monitor interface In and Out packet rate for network fabric devices](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-monitor-interface-packet-rate)

### Recent changes to the Managed Identity permissions

Changes to the Managed Identity permissions for the Cluster Manager or Cluster can affect the Cluster's ability to authenticate against the Cluster Manager.
The Managed Identities (MI) and their permissions are used for service-to-service authentication.
A change in the permissions results in authentication failures for the heartbeat messages.
Even when network connectivity is healthy the Cluster's `ClusterConnectionStatus` shows `Disconnected` when heartbeats aren't successfully received and acknowledged.

### Check control-plane BareMetal Machines health

The control-plane BareMetal Machines host the component that emits the heartbeats to the Cluster Manager.
In most cases, the pods running on the control-plane reschedule automatically to a different BareMetal Machine within the control-plane node pool.
However, if the BareMetal Machines aren't healthy, the pods can't reschedule and the Cluster is unable to send heartbeats.

To check the BareMetal Machines, use the following command:

**TBD**: Need to add the command to check BareMetal Machines

[!include[stillHavingIssues](./includes/contact-support.md)]
