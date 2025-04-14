---
title: "Azure Operator Nexus: Runtime upgrade with PauseAfterRack strategy"
description: Learn to execute a Cluster runtime upgrade for Operator Nexus with a PauseAfterRack strategy
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/25/2025
# ms.custom: template-include
---

# Upgrading Cluster runtime with `PauseAfterRack` strategy

Executing Cluster runtime upgrade with `PauseAfterRack` strategy will pause to wait for user confirmation before upgrading the next rack of worker nodes. The complete list of Cluster upgrade settings are discussed in  [Upgrading Cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md).

## Prerequisites

> [!NOTE]
> Upgrade with the PauseAfterRack strategy is available starting API version 2024-07-01.

1. Install the latest version of the [appropriate CLI extensions](howto-install-cli-extensions.md).
1. The latest `networkcloud` CLI extension is required. It can be installed following the steps listed [here](./howto-install-cli-extensions.md).
1. Subscription access to run the Azure Operator Nexus network fabric (NF) and network cloud (NC) CLI extension commands.
1. Collect the following information:
   - Subscription ID (`SUBSCRIPTION`)
   - Cluster name (`CLUSTER`)
   - Resource group (`CLUSTER_RG`)
1. Target Cluster must be healthy in a running state, with all control plane nodes healthy.

## Procedure

1. Enable `PauseAfterRack` upgrade strategy on a Nexus Cluster

   ```azurecli
   az networkcloud cluster update --name "<CLUSTER>" \
   --resource-group "<CLUSTER_RG>" \
   --update-strategy strategy-type="PauseAfterRack" wait-time-minutes=0 \
   --subscription "<SUBSCRIPTION>"
   ```

2. Confirm that the Cluster resource JSON in the JSON View reflects the `PauseAfterRack` upgrade strategy.

   ```azurecli
   az networkcloud cluster show --cluster-name "<CLUSTER>" \
   --resource-group "<CLUSTER_RG>" \
   --subscription "<SUBSCRIPTION>" | grep -A5 updateStrategy

    "updateStrategy": {
      "maxUnavailable": 32767,
      "strategyType": "PauseAfterRack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 70,
      "waitTimeMinutes": 15,
   ```

3. Trigger runtime bundle upgrade as usual from Azure portal or CLI. See [Upgrading Cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md).

4. Once the control plane and management plane upgrades complete, the runtime upgrade is paused, awaiting user action to start the upgrade for Rack 1.

:::image type="content" source="media/runtime-upgrade-cluster-paused.png" alt-text="Screenshot showing Paused Runtime Upgrade.":::

> [!NOTE]
> This message is available in logs for programmatic access. For more details, follow [List of logs available for streaming in Azure Operator Nexus](list-logs-available.md)

5. To resume the runtime upgrade, execute the following `az networkcloud` cli command.

   ```azurecli
   az networkcloud cluster continue-update-version --cluster-name "<CLUSTER>" \
   --resource-group="<CLUSTER_RG>" \
   --subscription="<SUBSCRIPTION>"
   ```

6. Repeat step 5 for each rack until all racks are upgraded to the latest runtime bundle.

## Related content

- [Upgrading Cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md)
