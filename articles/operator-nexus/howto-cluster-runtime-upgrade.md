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
2. The `networkcloud` cli extension is required.  If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/operator-nexus/howto-install-cli-extensions.md).
3. Access to the Azure portal for the target cluster to be upgraded.
4. You must be logged in to the same subscription as your target cluster via `az login`
5. Target cluster must be in a running state, with all control plane nodes healthy and 80+% of compute nodes in a running and healthy state.

## Finding available runtime versions

### Via Portal

To find available upgradeable runtime versions, navigate to the target cluster in the Azure portal. In the cluster's overview pane, navigate to the ***Available upgrade versions*** tab.

:::image type="content" source="./media/runtime-upgrade-upgradeable-runtime-versions.png" alt-text="Screenshot of Azure Portal showing correct tab to identify available cluster upgrades." lightbox="./media/runtime-upgrade-upgradeable-runtime-versions.png":::

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
Workloads may be impacted while the worker nodes in a rack is in the process of being upgraded, however workloads in all other racks will not be impacted. Consideration of workload placement in light of this implementation design is encouraged.

Upgrading all the nodes takes multiple hours but can take more if other processes, like firmware updates, are also part of the upgrade.
Due to the length of the upgrade process, it's advised to check the Cluster's detail status periodically for the current state of the upgrade.
To check on the status of the upgrade observe the detailed status of the cluster. This check can be done via the portal or az CLI.

To view the upgrade status through the Azure portal, navigate to the targeted cluster resource. In the cluster's *Overview* screen, the detailed status is provided along with a detailed status message.

:::image type="content" source="./media/runtime-upgrade-cluster-detail-status.png" lightbox="./media/runtime-upgrade-cluster-detail-status.png" alt-text="Screenshot of Azure portal showing in progress cluster upgrade.":::

To view the upgrade status through the Azure CLI, use `az networkcloud cluster show`.

```azurecli
az networkcloud cluster show --cluster-name "clusterName" --resource-group "resourceGroupName"
```

The output should be the target cluster's information and the cluster's detailed status and detail status message should be present.

## Frequently Asked Questions

### Identifying Cluster Upgrade Stalled/Stuck

During a runtime upgrade it's possible that the upgrade fails to move forward but the detail status reflects that the upgrade is still ongoing. **Because the runtime upgrade may take a very long time to successfully finish, there is no set timeout length currently specified**.
Hence, it's advisable to also check periodically on your cluster's detail status and logs to determine if your upgrade is indefinitely attempting to upgrade.

We can identify when this is the case by looking at the Cluster's logs, detailed message, and detailed status message. If a timeout has occurred, we would observe that the Cluster is continuously reconciling over the same indefinitely and not moving forward. The Cluster's detailed status message would reflect, `"Cluster is in the process of being updated."`.
From here, we recommend checking Cluster logs or configured LAW, to see if there is a failure, or a specific upgrade that is causing the lack of progress.

### Hardware Failure doesn't require Upgrade re-execution

If a hardware failure during an upgrade has occurred, the runtime upgrade continues as long as the set thresholds are met for the compute and management/control nodes. Once the machine is fixed or replaced, it gets provisioned with the current platform runtime's OS, which contains the targeted version of the runtime.

If a hardware failure occurs, and the runtime upgrade has failed because thresholds weren't met for compute and control nodes, re-execution of the runtime upgrade may be needed depending on when the failure occurred and the state of the individual servers in a rack. If a rack was updated before a failure, then the upgraded runtime version would be used when the nodes are reprovisioned.
If the rack's spec wasn't updated to the upgraded runtime version before the hardware failure, the machine would be provisioned with the previous runtime version. To upgrade to the new runtime version, submit a new cluster upgrade request and only the nodes with the previous runtime version will upgrade. Hosts that were successful in the previous upgrade action won't.

### After a runtime upgrade the cluster shows "Failed" Provisioning State

During a runtime upgrade the cluster will enter a state of `Upgrading`  In the event of a failure of the runtime upgrade, for reasons related to the resources, the cluster will go into a `Failed` provisioning state.  This state could be linked to the lifecycle of the components related to the cluster (e.g StorageAppliance) and may be necessary to diagnose the failure with Microsoft support.

<!-- LINKS - External -->
[installation-instruction]: https://aka.ms/azcli
