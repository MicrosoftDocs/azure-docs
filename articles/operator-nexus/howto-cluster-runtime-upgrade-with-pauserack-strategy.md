---
title: "Azure Operator Nexus: Runtime upgrade with rack pause strategy"
description: Learn to execute a cluster runtime upgrade for Operator Nexus with a pause rack strategy
author: vivekjMSFT
ms.author: vija
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/16/2024
# ms.custom: template-include
---
## Upgrading Cluster runtime with a pause rack strategy

This how-to guide explains the steps to execute a cluster runtime upgrade with pasue rack strategy. Executing cluster runtime upgrade with "PauseRack" strategy will update a single rack in a cluster and then pause to wait for confirmation before moving to the next rack. All existing thresholds will still be honoried with pause rack strategy.

## Prerequisites

> [!NOTE]
> Upgrades with the PauseRack strategy is available starting  API version 2024-06-01-preview.

Please follow the steps mentioned in prerequistie section of [Upgrading cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md)

## Procedure

1. Enable Rack Pause upgrade strategy on a Nexus cluster

    Example:

    ```azurecli
    az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" --update-strategy \
        strategy-type="PauseRack" \
        wait-time-minutes=0
    ```

2. Confirm that the cluster resource JSON in the JSON View reflects the rack pause upgrade strategy.

    ```azurecli
    az networkcloud cluster show --cluster-name "clusterName" --resource-group "resourceGroupName"
    ```

:::image type="content" source="media/runtime-upgrade-cluster-pause-rack-strategy.png" alt-text="Runtime upgrade strategy property details":::

3.Trigger runtime bundle upgrade as usual from Azure portal / CLI. for reference [Upgrading cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md)

4.Once Rack 1 has completed, the runtime upgrade will pause, awaiting user action to resume the runtime upgrade for Rack 2.

:::image type="content" source="media/runtime-upgrade-cluster-paused.png" alt-text="Paused Runtime Upgrade":::

> [!NOTE]
> This message will be available in logs for programtic access, for more details follow [List of logs available for streaming in Azure Operator Nexus](list-logs-available.md)

5.To resume the runtime upgrade, execute the following `az networkcloud` cli command to trigger the continue upgrade version action.

```shell
az networkcloud cluster continue-update-version \
    --subscription=$SUBSCRIPTION \
    --resource-group=$RESOURCE_GROUP \
    --cluster-name=$CLUSTER_NAME
```

6.Continue repeating step 5 for each rack until all racks have been upgraded to the latest runtime bundle.

## Related content

- [Upgrading cluster runtime from Azure CLI](./howto-cluster-runtime-upgrade.md)
