---
title: "Azure Operator Nexus: Runtime upgrade"
description: Learn to execute a cluster runtime upgrade for Operator Nexus
author: gedrivera
ms.author: eduardori
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 06/06/2023
# ms.custom: template-include
---

# Upgrading cluster runtime from Azure CLI

This how-to guide explains the steps for installing the required Azure CLI and extensions required to interact with Operator Nexus.

## Prerequisites

1. The [Install Azure CLI][installation-instruction] must be installed.
2. The `networkcloud` CLI extension is required. If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/operator-nexus/howto-install-cli-extensions.md).
3. Access to the Azure portal for the target cluster to be upgraded.
4. You must be logged in to the same subscription as your target cluster via `az login`
5. Target cluster must be in a running state, with all control plane nodes healthy and 80+% of compute nodes in a running and healthy state.

## Finding available runtime versions

### Via Portal

To find available upgradeable runtime versions, navigate to the target cluster in the Azure portal. In the cluster's overview pane, navigate to the ***Available upgrade versions*** tab.

:::image type="content" source="./media/runtime-upgrade-upgradeable-runtime-versions.png" alt-text="Screenshot of Azure portal showing correct tab to identify available cluster upgrades." lightbox="./media/runtime-upgrade-upgradeable-runtime-versions.png":::

From the **available upgrade versions** tab, we're able to see the different cluster versions that are currently available to upgrade. The operator can select from the listed the target runtime versions. Once selected, proceed to upgrade the cluster.

:::image type="content" source="./media/runtime-upgrade-runtime-version.png" lightbox="./media/runtime-upgrade-runtime-version.png" alt-text="Screenshot of Azure portal showing available cluster upgrades.":::

### Via Azure CLI

Available upgrades are retrievable via the Azure CLI:

```azurecli
az networkcloud cluster show --name "clusterName" --resource-group "resourceGroup"
```

In the output, you can find the `availableUpgradeVersions` property and look at the `targetClusterVersion` field:

```
  "availableUpgradeVersions": [
    {
      "controlImpact": "True",
      "expectedDuration": "Upgrades may take up to 4 hours + 2 hours per rack",
      "impactDescription": "Workloads will be disrupted during rack-by-rack upgrade",
      "supportExpiryDate": "2023-07-31",
      "targetClusterVersion": "3.3.0",
      "workloadImpact": "True"
    }
  ],
```

If there are no available cluster upgrades, the list will be empty.

## Upgrading cluster runtime using CLI

To perform an upgrade of the runtime, use the following Azure CLI command:

```azurecli
az networkcloud cluster update-version --cluster-name "clusterName" --target-cluster-version
  "versionNumber" --resource-group "resourceGroupName"
```

The runtime upgrade is a long process. The upgrade first upgrades the management nodes and then sequentially rack by rack for the worker nodes.
The upgrade is considered to be finished when 80% of worker nodes per rack and 100% of management nodes have been successfully upgraded.
Workloads might be impacted while the worker nodes in a rack are in the process of being upgraded, however workloads in all other racks won't be impacted. Consideration of workload placement in light of this implementation design is encouraged.

Upgrading all the nodes takes multiple hours but can take more if other processes, like firmware updates, are also part of the upgrade.
Due to the length of the upgrade process, it's advised to check the Cluster's detail status periodically for the current state of the upgrade.
To check on the status of the upgrade observe the detailed status of the cluster. This check can be done via the portal or az CLI.

To view the upgrade status through the Azure portal, navigate to the targeted cluster resource. In the cluster's *Overview* screen, the detailed status is provided along with a detailed status message.

The Cluster upgrade is in-progress when detailedStatus is set to `Updating` and detailedStatusMessage shows the progress of upgrade. Some examples of upgrade progress shown in detailedStatusMessage are `Waiting for control plane upgrade to complete...`, `Waiting for nodepool "<rack-id>" to finish upgrading...`, etc.

The Cluster upgrade is complete when detailedStatus is set to `Running` and detailedStatusMessage shows message `Cluster is up and running`

:::image type="content" source="./media/runtime-upgrade-cluster-detail-status.png" lightbox="./media/runtime-upgrade-cluster-detail-status.png" alt-text="Screenshot of Azure portal showing in progress cluster upgrade.":::

To view the upgrade status through the Azure CLI, use `az networkcloud cluster show`.

```azurecli
az networkcloud cluster show --cluster-name "clusterName" --resource-group "resourceGroupName"
```

The output should be the target cluster's information and the cluster's detailed status and detail status message should be present.
For more detailed insights on the upgrade progress, the individual BMM in each Rack can be checked for status. Example of this is provided in the reference section under [BareMetal Machine roles](./reference-near-edge-baremetal-machine-roles.md).

## Configure compute threshold parameters for runtime upgrade using cluster updateStrategy
The following Azure CLI command is used to configure the compute threshold parameters for a runtime upgrade:

```azurecli
az networkcloud cluster update --name "<clusterName>" --resource-group "<resourceGroup>" --update-strategy strategy-type="Rack" threshold-type="PercentSuccess" threshold-value="<thresholdValue>" max-unavailable=<maxNodesOffline> wait-time-minutes=<waitTimeBetweenRacks>
```

Required arguments:
- strategy-type: Defines the update strategy. In this case, "Rack" means updates occur rack-by-rack. The default value is "Rack"
- threshold-type: Determines how the threshold should be evaluated, applied in the units defined by the strategy. The default value is "PercentSuccess".
- threshold-value: The numeric threshold value used to evaluate an update. The default value is 80.

Optional arguments:
- max-unavailable: The maximum number of worker nodes that can be offline, that is, upgraded rack at a time. The default value is 32767.
- wait-time-minutes: The delay or waiting period before updating a rack. The default value is 15.

An example usage of the command is as below:
```azurecli
az networkcloud cluster update --name "cluster01" --resource-group "cluster01-rg" --update-strategy strategy-type="Rack" threshold-type="PercentSuccess" threshold-value=70 max-unavailable=16 wait-time-minutes=15
```
Upon successful execution of the command, the updateStrategy values specified will be applied to the cluster:
```
  "updateStrategy": {
      "maxUnavailable": 16,
      "strategyType": "Rack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 70,
      "waitTimeMinutes": 15,
    },
```

## Frequently Asked Questions

### Identifying Cluster Upgrade Stalled/Stuck

During a runtime upgrade, it's possible that the upgrade fails to move forward but the detail status reflects that the upgrade is still ongoing. **Because the runtime upgrade can take a very long time to successfully finish, there's no set timeout length currently specified**.
Hence, it's advisable to also check periodically on your cluster's detail status and logs to determine if your upgrade is indefinitely attempting to upgrade.

We can identify when this is the case by looking at the Cluster's logs, detailed message, and detailed status message. If a timeout has occurred, we would observe that the Cluster is continuously reconciling over the same indefinitely and not moving forward. From here, we recommend checking Cluster logs or configured LAW, to see if there's a failure, or a specific upgrade that is causing the lack of progress.

### Hardware Failure doesn't require Upgrade re-execution

If a hardware failure during an upgrade has occurred, the runtime upgrade continues as long as the set thresholds are met for the compute and management/control nodes. Once the machine is fixed or replaced, it gets provisioned with the current platform runtime's OS, which contains the targeted version of the runtime.

If a hardware failure occurs, and the runtime upgrade has failed because thresholds weren't met for compute and control nodes, re-execution of the runtime upgrade might be needed depending on when the failure occurred and the state of the individual servers in a rack. If a rack was updated before a failure, then the upgraded runtime version would be used when the nodes are reprovisioned.
If the rack's spec wasn't updated to the upgraded runtime version before the hardware failure, the machine would be provisioned with the previous runtime version. To upgrade to the new runtime version, submit a new cluster upgrade request and only the nodes with the previous runtime version will upgrade. Hosts that were successful in the previous upgrade action won't.

### After a runtime upgrade, the cluster shows "Failed" Provisioning State

During a runtime upgrade, the cluster enters a state of `Upgrading`. In the event of a failure of the runtime upgrade, the cluster will go into a `Failed` provisioning state. Failures during upgrade may be caused by infrastructure components (e.g the Storage Appliance). In some scenarios, it may be necessary to diagnose the failure with Microsoft support.

### Impact on Nexus Kubernetes tenant workloads during cluster runtime upgrade

During a runtime upgrade, impacted Nexus Kubernetes cluster nodes are cordoned and drained before the Bare Metal Hosts (BMH) are upgraded. Cordoning the cluster node prevents new pods from being scheduled on it and draining the cluster node allows pods that are running tenant workloads a chance to shift to another available cluster node, which helps to reduce the impact on services. The draining mechanism's effectiveness is contingent on the available capacity within the Nexus Kubernetes cluster. If the cluster is nearing full capacity and lacks space for the pods to relocate, they transition into a Pending state following the draining process. 

Once the cordon and drain process of the tenant cluster node is completed, the upgrade of the BMH proceeds. Each tenant cluster node is allowed up to 10 minutes for the draining process to complete, after which the BMH upgrade will begin. This guarantees the BMH upgrade will make progress. BMHs are upgraded one rack at a time, and upgrades are performed in parallel within the same rack. The BMH upgrade does not wait for tenant resources to come online before continuing with the runtime upgrade of BMHs in the rack being upgraded. The benefit of this is that the maximum overall wait time for a rack upgrade is kept at 10 minutes regardless of how many nodes are available. This maximum wait time is specific to the cordon and drain procedure and is not applied to the overall upgrade procedure. Upon completion of each BMH upgrade, the Nexus Kubernetes cluster node starts, rejoins the cluster, and is uncordoned, allowing pods to be scheduled on the node once again.

It's important to note that the Nexus Kubernetes cluster node won't be shut down after the cordon and drain process. The BMH is rebooted with the new image as soon as all the Nexus Kubernetes cluster nodes are cordoned and drained, after 10 minutes if the drain process isn't completed. Additionally, the cordon and drain is not initiated for power-off or restart actions of the BMH; it's exclusively activated only during a runtime upgrade.

It is important to note that following the runtime upgrade, there could be instance where the Nexus Kubernetes Cluster node is unschedulable. For such scenarios, you can manually uncordon the node by running the following commands using [connectedk8s proxy.](./includes/kubernetes-cluster/cluster-connect.md)

```
kubectl get nodes  | grep SchedulingDisabled > /dev/null
if [ $? -eq 0 ]; then
for node in $(kubectl get nodes | grep SchedulingDisabled | awk '{print $1}'); do
    kubectl uncordon $node
done
fi
```

<!-- LINKS - External -->
[installation-instruction]: https://aka.ms/azcli
