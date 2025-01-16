---
title: "Azure Operator Nexus: Runtime upgrade with PauseRack strategy"
description: Learn to execute a cluster runtime upgrade for Operator Nexus with a PauseRack strategy
author: vivekjMSFT
ms.author: vija
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/16/2024
# ms.custom: template-include
---
# Upgrading cluster runtime with a PauseRack strategy

This how-to guide explains the steps to execute a cluster runtime upgrade with PauseRack strategy. Executing cluster runtime upgrade with PauseRack strategy will update a single rack in a cluster and then pause to wait for confirmation before moving to the next rack. All existing thresholds will still be honored.

## Prerequisites

> [!NOTE]
> Upgrades with the PauseRack strategy is available starting  API version 2024-06-01-preview.

1. The [Install Azure CLI][installation-instruction] must be installed.
2. The `networkcloud` CLI extension is required. If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/operator-nexus/howto-install-cli-extensions.md).
3. Access to the Azure portal for the target cluster to be upgraded.
4. You must be logged in to the same subscription as your target cluster via `az login`
5. Target cluster must be in a running state, with all control plane nodes healthy and 80+% of compute nodes in a running and healthy state.

## Procedure

1. Enable PauseRack upgrade strategy on a Nexus cluster

    ```azurecli
    az networkcloud cluster update 
    --name $CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --update-strategy strategy-type="PauseRack" wait-time-minutes=0
    ```

2. Confirm that the cluster resource JSON in the JSON View reflects the PauseRack upgrade strategy.

    ```azurecli
    az networkcloud cluster show --cluster-name "clusterName" --resource-group "resourceGroupName"
    ```

    ```  
    "updateStrategy": {
      "maxUnavailable": 2,
      "strategyType": "PauseAfterRack",
      "thresholdType": "PercentSuccess",
      "thresholdValue": 70,
      "waitTimeMinutes": 15,
    }
    ```

3. Trigger runtime bundle upgrade as usual from Azure portal / CLI. For reference [Upgrading cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md)

4. Once Rack 1 completes, the runtime upgrade will be paused, awaiting user action to resume the upgrade for Rack 2.

:::image type="content" source="media/runtime-upgrade-cluster-paused.png" alt-text="Screenshot showing Paused Runtime Upgrade.":::

> [!NOTE]
> This message will be available in logs for programmatic access, for more details follow [List of logs available for streaming in Azure Operator Nexus](list-logs-available.md)

5. To resume the runtime upgrade, execute the following `az networkcloud` cli command.

```shell
az networkcloud cluster continue-update-version \
    --subscription=$SUBSCRIPTION \
    --resource-group=$RESOURCE_GROUP \
    --cluster-name=$CLUSTER_NAME
```

6. Repeat step 5 for each rack until all racks have been upgraded to the latest runtime bundle.

## Related content

- [Upgrading cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md)
