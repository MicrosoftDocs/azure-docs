---
title: "Azure Operator Nexus: Runtime upgrade"
description: Learn to execute a Cluster runtime upgrade for Operator Nexus
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 08/13/2025
# ms.custom: template-include
---

# Upgrade Cluster runtime from Azure CLI

This how-to guide explains the steps for installing the required Azure CLI and extensions required to interact with Operator Nexus.

## Prerequisites

1. Install the latest version of the [appropriate CLI extensions](howto-install-cli-extensions.md).
1. The latest `networkcloud` CLI extension is required. It can be installed following the steps listed [here](./howto-install-cli-extensions.md).
1. Subscription access to run the Azure Operator Nexus network fabric (NF) and network cloud (NC) CLI extension commands.
1. Collect the following information:
   - Subscription ID (`SUBSCRIPTION`)
   - Cluster name (`CLUSTER`)
   - Resource group (`CLUSTER_RG`)
1. Target Cluster must be healthy in a running state, with all control plane nodes healthy.

## Checking current runtime version

Verify current Cluster runtime version before upgrade:
[How to check current Cluster runtime version.](./howto-check-runtime-version.md#check-current-cluster-runtime-version)

## Finding available runtime versions

### Via Azure portal

To find available upgradeable runtime versions, navigate to the target Cluster in the Azure portal. In the Cluster's overview pane, navigate to the **_Available upgrade versions_** tab.

:::image type="content" source="./media/runtime-upgrade-upgradeable-runtime-versions.png" alt-text="Screenshot of Azure portal showing correct tab to identify available Cluster upgrades." lightbox="./media/runtime-upgrade-upgradeable-runtime-versions.png":::

From the **available upgrade versions** tab, we're able to see the different Cluster versions that are currently available to upgrade. The operator can select from the listed the target runtime versions. Once selected, proceed to upgrade the Cluster.

:::image type="content" source="./media/runtime-upgrade-runtime-version.png" lightbox="./media/runtime-upgrade-runtime-version.png" alt-text="Screenshot of Azure portal showing available Cluster upgrades.":::

### Via Azure CLI

Available upgrades are retrievable via the Azure CLI:

```azurecli
az networkcloud cluster show --name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--subscription "<SUBSCRIPTION>" | grep -A8 availableUpgradeVersions
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

If there are no available Cluster upgrades, the list is empty.

## Configure compute threshold parameters for runtime upgrade using Cluster `updateStrategy`

The following Azure CLI command is used to configure the compute threshold parameters for a runtime upgrade:

```azurecli
az networkcloud cluster update --name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--update-strategy strategy-type="<strategyType>" threshold-type="<thresholdType>" \
threshold-value="<thresholdValue>" max-unavailable="<maxNodesOffline>" \
wait-time-minutes="<waitTimeBetweenRacks>" \
--subscription "<SUBSCRIPTION>"
```

Required parameters:

- strategy-type: Defines the update strategy. Setting used are `Rack` (Rack-by-Rack) OR `PauseAfterRack` (Pause for user before each Rack starts). The default value is `Rack`. To perform a Cluster runtime upgrade using the `PauseAfterRack` strategy, follow the steps outlined in [Upgrade Cluster Runtime with PauseAfterRack Strategy](howto-cluster-runtime-upgrade-with-pauseafterrack-strategy.md).
- threshold-type: Determines how the threshold should be evaluated, applied in the units defined by the strategy. Settings used are `PercentSuccess` OR `CountSuccess`. The default value is `PercentSuccess`.
- threshold-value: The numeric threshold value used to evaluate an update. The default value is `80`.

Optional parameters:

- max-unavailable: The maximum number of worker nodes that can be offline, that is, upgraded rack at a time. The default value is `32767`.
- wait-time-minutes: The delay or waiting period before updating a rack. The default value is `15`.

The following example is for a customer using Rack-by-Rack strategy with a Percent Success of 60% and a 1-minute pause.

```azurecli
az networkcloud cluster update --name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--update-strategy strategy-type="Rack" threshold-type="PercentSuccess" \
threshold-value=60 wait-time-minutes=1 \
--subscription "<SUBSCRIPTION>"
```

Verify update:

```
az networkcloud cluster show --name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--subscription "<SUBSCRIPTION>" | grep -A5 updateStrategy

  "updateStrategy": {
    "maxUnavailable": 32767,
      "strategyType": "Rack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 60,
      "waitTimeMinutes": 1
```

In this example, if less than 60% of the compute nodes being provisioned in a rack fail to provision (on a Rack-by-Rack basis), the Cluster upgrade waits indefinitely until the condition is met. If 60% or more of the compute nodes are successfully provisioned, Cluster deployment moves on to the next rack of compute nodes. If there are too many failures in the rack, the hardware must be repaired before the upgrade can continue.

The following example is for a customer using Rack-by-Rack strategy with a threshold type `CountSuccess` of 10 nodes per rack and a 1-minute pause.

```azurecli
az networkcloud cluster update --name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--update-strategy strategy-type="Rack" threshold-type="CountSuccess" \
threshold-value=10 wait-time-minutes=1 \
--subscription "<SUBSCRIPTION>"
```

Verify update:

```
az networkcloud cluster show --name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--subscription "<SUBSCRIPTION>" | grep -A5 updateStrategy

  "updateStrategy": {
    "maxUnavailable": 32767,
      "strategyType": "Rack",
      "thresholdType": "CountSuccess",
      "thresholdValue": 10,
      "waitTimeMinutes": 1
```

In this example, if less than 10 compute nodes being provisioned in a rack fail to provision (on a Rack-by-Rack basis), the Cluster upgrade waits indefinitely until the condition is met. If 10 or more of the compute nodes are successfully provisioned, Cluster deployment moves on to the next rack of compute nodes. If there are too many failures in the rack, the hardware must be repaired before the upgrade can continue.

> [!NOTE]
> **_`update-strategy` cannot be changed after the Cluster runtime upgrade has started._**
> When a threshold value below 100% is set, it’s possible that any unhealthy nodes might not be upgraded, yet the "Cluster" status could still indicate that upgrade was successful. For troubleshooting issues with bare metal machines, refer to [Troubleshoot Azure Operator Nexus server problems](troubleshoot-reboot-reimage-replace.md)

## Upgrade Cluster runtime using CLI

To perform an upgrade of the runtime, use the following Azure CLI command:

```azurecli
az networkcloud cluster update-version --cluster-name "<CLUSTER>" \
--target-cluster-version "<versionNumber>" \
--resource-group "<CLUSTER_RG>" \
--subscription "<SUBSCRIPTION>"
```

This command initiates the runtime upgrade process for the specified Cluster. The command itself typically completes within about 5 minutes, but this command only starts the upgrade process. The actual runtime upgrade continues to execute in the background and can take several hours to complete, as it upgrades nodes rack by rack and installs the new OS version.

Detailed status and diagnostic information for the initiation step is available in Azure portal in the `JSON View` of the Cluster (Operator Nexus) resource. The following information is included in the `updateVersion` entry of the `properties.actionStates` field, when using API Version `2025-07-01-preview` or higher.

- Start and end time of the action.
- Current status (`Succeeded`, `Failed`, or `InProgress`).
- Any extra context or error message associated with the current status.
- The Correlation ID for the original `cluster update-version` operation, as also shown in the Azure Activity log.
- An ordered list of individual steps and their status - for example `Validate Cluster conditions and upgrade versions`, and `Initiate Platform Runtime Extension update`.

> [!IMPORTANT]
> The `properties.actionStates` entry for `updateVersion` reflects only the short initiation phase (validation and request initiation that typically completes in ~5 minutes).
> It doesn't track the rack-by-rack progress of the main upgrade.
> To monitor the full upgrade, use the Cluster’s detailed status and detailed status message in the resource Overview, or query via `az networkcloud cluster show`.

Example `JSON View` output for the Cluster (Operator Nexus) resource:

```json
{
  "properties": {
    "actionStates": [
      {
        "correlationId": "b66643b7-2e1d-4a5c-a954-ca0e38368984",
        "status": "Completed",
        "actionType": "Microsoft.NetworkCloud/clusters/updateVersion",
        "endTime": "2025-08-01T03:46:13Z",
        "message": "Cluster upgrade to 4.6.0 successfully initiated - monitor progress via cluster detailed status",
        "startTime": "2025-08-01T03:42:08Z",
        "stepStates": [
          {
            "status": "Completed",
            "endTime": "2025-08-01T03:42:08Z",
            "message": "Cluster validation and version checks passed",
            "startTime": "2025-08-01T03:42:08Z",
            "stepName": "Validate Cluster conditions and upgrade versions"
          },
          {
            "status": "Completed",
            "endTime": "2025-08-01T03:46:11Z",
            "message": "Platform Runtime Extension deployment initiated",
            "startTime": "2025-08-01T03:42:39Z",
            "stepName": "Initiate Platform Runtime Extension update"
          },
          {
            "status": "Completed",
            "endTime": "2025-08-01T03:46:11Z",
            "message": "Platform Runtime Extension installation completed",
            "startTime": "2025-08-01T03:46:11Z",
            "stepName": "Monitor Platform Runtime Extension readiness"
          },
          {
            "status": "Completed",
            "endTime": "2025-08-01T03:46:13Z",
            "message": "Platform Cluster version updated successfully",
            "startTime": "2025-08-01T03:46:13Z",
            "stepName": "Update Platform Cluster version specification"
          }
        ]
      }
    ]
  }
}
```

Once this command is complete, the full runtime upgrade process begins. This process can take several hours to complete, depending on the number of racks in the Cluster and the number of worker nodes in each rack.

- The upgrade first upgrades the management nodes and then sequentially Rack-by-Rack for the worker nodes.
- The management servers are segregated into two groups, which are upgraded separately. This approach allows for components running on the management servers to ensure resiliency during the runtime upgrade by applying affinity rules.
- The CSNs also leverage this functionality by placing one instance in each management group.
- There's no customer interaction with this functionality. However, there might be additional labels seen on management nodes to identify the groups.

The upgrade is considered to be finished when 80% of worker nodes per rack and 50% of management nodes in each group are successfully upgraded.
Workloads might be impacted while the worker nodes in a rack are in the process of being upgraded, however workloads in all other racks aren't impacted. Consideration of workload placement in light of this implementation design is encouraged.

Upgrading all the nodes takes multiple hours, depending upon how many racks exist for the Cluster.
Due to the length of the upgrade process, the Cluster's detail status should be checked periodically for the current state of the upgrade.
To check on the status of the upgrade observe the detailed status of the Cluster. This check can be done via the portal or az CLI.

To view the upgrade status through the Azure portal, navigate to the targeted Cluster resource. In the Cluster's _Overview_ screen, the detailed status is provided along with a detailed status message.

The Cluster upgrade is in-progress when detailedStatus is set to `Updating` and detailedStatusMessage shows the progress of upgrade. Some examples of upgrade progress shown in detailedStatusMessage are `Waiting for control plane upgrade to complete...`, `Waiting for nodepool "<rack-id>" to finish upgrading...`, etc.

The Cluster upgrade is complete when detailedStatus is set to `Running` and detailedStatusMessage shows message `Cluster is up and running`

:::image type="content" source="./media/runtime-upgrade-cluster-detail-status.png" lightbox="./media/runtime-upgrade-cluster-detail-status.png" alt-text="Screenshot of Azure portal showing in progress Cluster upgrade.":::

To view the upgrade status through the Azure CLI, use `az networkcloud cluster show`.

```azurecli
az networkcloud cluster show --cluster-name "<CLUSTER>" \
--resource-group "<CLUSTER_RG>" \
--subscription "<SUBSCRIPTION>"
```

The output should be the target Cluster's information and the Cluster's detailed status and detail status message should be present.
For more detailed insights on the upgrade progress, the individual node in each Rack can be checked for status. An example of checking the status is provided in the reference section under [BareMetal Machine roles](./reference-near-edge-baremetal-machine-roles.md).

## Frequently Asked Questions

### Identifying Cluster Upgrade Stalled/Stuck

During a runtime upgrade, it's possible that the upgrade fails to move forward but the detail status reflects that the upgrade is still ongoing. **Because the runtime upgrade can take a very long time to successfully finish, there's no set time-out length currently specified**.
Hence, it's advisable to also check periodically on your Cluster's detail status and logs to determine if your upgrade is indefinitely attempting to upgrade.

We can identify an `indefinitely attempting to upgrade` situation by looking at the Cluster's logs, detailed message, and detailed status message. If a time-out occurs, we would observe that the Cluster is continuously reconciling over the same indefinitely and not moving forward. From here, we recommend checking Cluster logs or configured LAW, to see if there's a failure, or a specific upgrade that is causing the lack of progress.

### Identifying Bare Metal Machine Upgrade Stalled/Stuck

A guide for identifying issues with provisioning worker nodes is provided at [Troubleshooting Bare Metal Machine Provisioning](./troubleshoot-bare-metal-machine-provisioning.md).

### Hardware Failure doesn't require Upgrade re-execution

If a hardware failure during an upgrade occurs, the runtime upgrade continues as long as the set thresholds are met for the compute and management/control nodes. Once the machine is fixed or replaced, it gets provisioned with the current platform runtime's OS, which contains the targeted version of the runtime. If a rack was updated before a failure, then the upgraded runtime version would be used when the nodes are reprovisioned. If the rack's spec wasn't updated to the upgraded runtime version before the hardware failure, the machine provisions with the previous runtime version when the hardware is repaired. The machine is upgraded along with the rack when the rack starts its upgrade.

### After a runtime upgrade, the Cluster shows "Failed" Provisioning State

During a runtime upgrade, the Cluster enters a state of `Upgrading`. If the runtime upgrade fails, the Cluster goes into a `Failed` provisioning state. Infrastructure components (e.g the Storage Appliance) may cause failures during the upgrade. In some scenarios, it may be necessary to diagnose the failure with Microsoft support.
