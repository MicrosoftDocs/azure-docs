---
title: "Orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager"
description: Learn how to orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager.
ms.topic: how-to
ms.date: 11/06/2023
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom:
  - devx-track-azurecli
  - ignite-2023
  - build-2024
---

# Orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager

Platform admins managing Kubernetes fleets with large number of clusters often have problems with staging their updates in a safe and predictable way across multiple clusters. To address this pain point, Kubernetes Fleet Manager (Fleet) allows you to orchestrate updates across multiple clusters using update runs, stages, groups, and strategies.

:::image type="content" source="./media/update-orchestration/fleet-overview-inline.png" alt-text="Screenshot of the Azure portal pane for a fleet resource, showing member cluster Kubernetes versions and node images in use across all node pools of member clusters." lightbox="./media/update-orchestration/fleet-overview-lightbox.png":::

## Prerequisites

* Read the [conceptual overview of this feature](./concepts-update-orchestration.md), which provides an explanation of update strategies, runs, stages, and groups references in this document.

* You must have a fleet resource with one or more member clusters. If not, follow the [quickstart][fleet-quickstart] to create a Fleet resource and join Azure Kubernetes Service (AKS) clusters as members. This walkthrough demonstrates a fleet resource with five AKS member clusters as an example.

* Set the following environment variables:

    ```bash
    export GROUP=<resource-group>
    export FLEET=<fleet-name>
    ```

* If you're following the Azure CLI instructions in this article, you need Azure CLI version 2.53.1 or later installed. To install or upgrade, see [Install the Azure CLI][azure-cli-install].

* You also need the `fleet` Azure CLI extension, which you can install by running the following command:

  ```azurecli-interactive
  az extension add --name fleet
  ```

  Run the following command to update to the latest version of the extension released:

  ```azurecli-interactive
  az extension update --name fleet
  ```

> [!NOTE]
> Update runs honor [planned maintenance windows](/azure/aks/planned-maintenance) that you set at the AKS cluster level. For more information, see [planned maintenance across multiple member clusters](./concepts-update-orchestration.md#planned-maintenance) which explains how update runs handle member clusters that have been configured with planned maintenance windows.


Update run supports two options for the sequence in which the clusters are upgraded:

- **One-by-one**: If you don't care about controlling the sequence in which the clusters are upgraded, `one-by-one` provides a simple approach to upgrade all member clusters of the fleet in sequence one-by-one
- **Control sequence of clusters using update groups and stages** - If you want to control the sequence in which the clusters are upgraded, you can structure member clusters in update groups and update stages. Further, this sequence can be stored as a template in the form of update strategy. Update runs can later be created from update strategies instead of defining the sequence every time one needs to create an update run based on stages.

## Update all clusters one by one

### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, go to the **Multi-cluster update** menu and select **Create**.

1. Choosing **One by one** upgrades all member clusters of the fleet in sequence one-by-one.

    :::image type="content" source="./media/update-orchestration/update-run-one-by-one.png" alt-text="Screenshot of the Azure portal pane for creating update runs that update clusters one by one in Azure Kubernetes Fleet Manager." lightbox="./media/update-orchestration/update-run-one-by-one.png":::

1. For **upgrade scope**, you can choose one of these three options: 

    - Kubernetes version for both control plane and node pools
    - Kubernetes version for only control plane of the cluster
    - Node image version only

    :::image type="content" source="./media/update-orchestration/upgrade-scope.png" alt-text="Screenshot of the Azure portal pane for creating update runs. The upgrade scope section is shown." lightbox="./media/update-orchestration/upgrade-scope.png":::

    For the node image, the following options are available:
    - **Latest**: Updates every AKS cluster in the update run to the latest image available for that cluster in its region.
    - **Consistent**: As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](/azure/aks/release-tracker) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.

### [Azure CLI](#tab/cli)

**Creating an update run**:

- Run the following command to update the Kubernetes version and the node image version for all clusters of the fleet one by one:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-1 --upgrade-type Full --kubernetes-version 1.26.0
    ```

- Run the following command to update the Kubernetes version for only the control plane of all member clusters of the fleet one by one:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-2 --upgrade-type ControlPlaneOnly --kubernetes-version 1.26.0
    ```

- Run the following command to update only the node image versions for all clusters of the fleet one by one:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-3 --upgrade-type NodeImageOnly
    ```

When creating an update run, you have the ability to control the scope of the update run. The `--upgrade-type` flag supports the following values: 
- `ControlPlaneOnly` only upgrades the Kubernetes version for the control plane of the cluster. 
- `Full` upgrades Kubernetes version for control plane and node pools along with the node images.
- `NodeImageOnly` only upgrades the node images.

Also, `--node-image-selection` flag supports the following values:
- **Latest**: Updates every AKS cluster in the update run to the latest image available for that cluster in its region.
- **Consistent**: As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](/azure/aks/release-tracker) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.


**Starting an update run**:

To start update runs, run the following command:

```azurecli-interactive
az fleet updaterun start --resource-group $GROUP --fleet-name $FLEET --name <run-name>
```

---

## Update clusters in a specific order

Update groups and stages provide more control over the sequence that update runs follow when you're updating the clusters. Within an update stage, updates are applied to all the different update groups in parallel; within an update group, member clusters update sequentially.

### Assign a cluster to an update group

You can assign a member cluster to a specific update group in one of two ways.

* Assign to group when adding member cluster to the fleet. For example:

#### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, go to **Member clusters**.

    :::image type="content" source="./media/update-orchestration/add-members-inline.png" alt-text="Screenshot of the Azure portal page for Azure Kubernetes Fleet Manager member clusters." lightbox="./media/update-orchestration/add-members.png":::

1. Specify the update group that the member cluster should belong to.

    :::image type="content" source="./media/update-orchestration/add-members-assign-group-inline.png" alt-text="Screenshot of the Azure portal page for adding member clusters to Azure Kubernetes Fleet Manager and assigning them to groups." lightbox="./media/update-orchestration/add-members-assign-group.png":::

#### [Azure CLI](#tab/cli)

```azurecli-interactive
az fleet member create --resource-group $GROUP --fleet-name $FLEET --name member1 --member-cluster-id $AKS_CLUSTER_ID --update-group group-1a
```

---

* The second method is to assign an existing fleet member to an update group. For example:

#### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, navigate to **Member clusters**. Choose the member clusters that you want, and then select **Assign update group**.

    :::image type="content" source="./media/update-orchestration/existing-members-assign-group-inline.png" alt-text="Screenshot of the Azure portal page for assigning existing member clusters to a group." lightbox="./media/update-orchestration/existing-members-assign-group.png":::

1. Specify the group name, and then select **Assign**.

    :::image type="content" source="./media/update-orchestration/group-name-inline.png" alt-text="Screenshot of the Azure portal page for member clusters that shows the form for updating a member cluster's group." lightbox="./media/update-orchestration/group-name.png":::

#### [Azure CLI](#tab/cli)

```azurecli-interactive
az fleet member update --resource-group $GROUP --fleet-name $FLEET --name member1 --update-group group-1a
```

---

> [!NOTE]
> Any fleet member can only be a part of one update group, but an update group can have multiple fleet members inside it.
> An update group itself is not a separate resource type. Update groups are only strings representing references from the fleet members. So, if all fleet members with references to a common update group are deleted, that specific update group will cease to exist as well.

### Define an update run and stages

You can define an update run using update stages in order to sequentially order the application of updates to different update groups. For example, a first update stage might update test environment member clusters, and a second update stage would then update production environment member clusters. You can also specify a wait time between the update stages.

#### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, navigate to **Multi-cluster update**. Under the **Runs** tab, select **Create**.

1. Provide a name for your update run and then select 'Stages' for update sequence type.

    :::image type="content" source="./media/update-orchestration/update-run-stages-inline.png" alt-text="Screenshot of the Azure portal page for choosing stages mode within update run." lightbox="./media/update-orchestration/update-run-stages-lightbox.png":::

1. Choose **Create Stage**. You can now specify the stage name and the duration to wait after each stage.

    :::image type="content" source="./media/update-orchestration/create-stage-basics-inline.png" alt-text="Screenshot of the Azure portal page for creating a stage and defining wait time." lightbox="./media/update-orchestration/create-stage-basics.png":::

1. Choose the update groups that you want to include in this stage.

    :::image type="content" source="./media/update-orchestration/create-stage-choose-groups-inline.png" alt-text="Screenshot of the Azure portal page for stage creation that shows the selection of upgrade groups." lightbox="./media/update-orchestration/create-stage-choose-groups.png":::

1. After you define all your stages, you can order them by using the **Move up** and **Move down** controls.

1. For **upgrade scope**, you can choose one of these three options: 

    - Kubernetes version for both control plane and node pools
    - Kubernetes version for only control plane of the cluster
    - Node image version only

    :::image type="content" source="./media/update-orchestration/upgrade-scope.png" alt-text="Screenshot of the Azure portal pane for creating update runs. The upgrade scope section is shown." lightbox="./media/update-orchestration/upgrade-scope.png":::

    For the node image, the following options are available:
    - **Latest**: Updates every AKS cluster in the update run to the latest image available for that cluster in its region.
    - **Consistent**: As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](/azure/aks/release-tracker) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.


1. Click on **Create** at the bottom of the page to create the update run. Specifying stages and their order every time when creating an update run can get repetitive and cumbersome. Update strategies simplify this process by allowing you to store templates for update runs. For more information, see [update strategy creation and usage](#create-an-update-run-using-update-strategies).

1. In the **Multi-cluster update** menu, choose the update run and select **Start**.

#### [Azure CLI](#tab/cli)

1. Run the following command to create the update run:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-4 --upgrade-type Full --kubernetes-version 1.26.0 --stages example-stages.json
    ```

    Here's an example of input from the stages file (*example-stages.json*):

    ```json
    {
        "stages": [
            {
                "name": "stage1",
                "groups": [
                    {
                        "name": "group-1a"
                    },
                    {
                        "name": "group-1b"
                    },
                    {
                        "name": "group-1c"
                    }
                ],
                "afterStageWaitInSeconds": 3600
            },
            {
                "name": "stage2",
                "groups": [
                    {
                        "name": "group-2a"
                    },
                    {
                        "name": "group-2b"
                    },
                    {
                        "name": "group-2c"
                    }
                ]
            }
        ]
    }
    ```

    When creating an update run, you have the ability to control the scope of the update run. The `--upgrade-type` flag supports the following values: 
    - `ControlPlaneOnly` only upgrades the Kubernetes version for the control plane of the cluster. 
    - `Full` upgrades Kubernetes version for control plane and node pools along with the node images.
    - `NodeImageOnly` only upgrades the node images.

    Also, `--node-image-selection` flag supports the following values:
    - **Latest**: Updates every AKS cluster in the update run to the latest image available for that cluster in its region.
    - **Consistent**: As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](/azure/aks/release-tracker) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.

1. Run the following command to start this update run:

    ```azurecli-interactive
    az fleet updaterun start --resource-group $GROUP --fleet-name $FLEET --name run-4
    ```

---

### Create an update run using update strategies

Creating an update run required the stages, groups, and their order to be specified each time. Update strategies simplify this process by allowing you to store templates for update runs.

> [!NOTE]
> It is possible to create multiple update runs with unique names from the same update strategy.

#### [Azure portal](#tab/azure-portal)

**Create an update strategy**: There are two ways to create an update strategy:

- **Approach 1**: You can save an update strategy while creating an update run.

    :::image type="content" source="./media/update-orchestration/update-strategy-creation-from-run-inline.png" alt-text="A screenshot of the Azure portal showing update run stages being saved as an update strategy." lightbox="./media/update-orchestration/update-strategy-creation-from-run-lightbox.png":::

- **Approach 2**: You can navigate to **Multi-cluster update** and choose **Create** under the **Strategy** tab.

    :::image type="content" source="./media/update-orchestration/create-strategy-inline.png" alt-text="A screenshot of the Azure portal showing creation of update strategy." lightbox="./media/update-orchestration/create-strategy-lightbox.png":::

**Use an update strategy to create update run**: The update strategy you created can later be referenced when creating new subsequent update runs:

:::image type="content" source="./media/update-orchestration/update-run-creation-from-strategy-inline.png" alt-text="A screenshot of the Azure portal showing the creation of a new update run. The 'Copy from existing strategy' button is highlighted." lightbox="./media/update-orchestration/update-run-creation-from-strategy-lightbox.png":::

#### [Azure CLI](#tab/cli)

1. Run the following command to create a new update strategy:

    ```azurecli-interactive
    az fleet updatestrategy create --resource-group $GROUP --fleet-name $FLEET --name strategy-1 --stages example-stages.json
    ```

1. Run the following command to create an update run referencing this strategy:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-5 --update-strategy-name strategy-1 --upgrade-type NodeImageOnly --node-image-selection Consistent
    ```
---

### Manage an Update run 

There are a few options to manage update runs:

#### [Azure portal](#tab/azure-portal)

- Under **Multi-cluster update** tab of the fleet resource, you can **Start** an update run that is either in **Not started** or **Failed** state.

     :::image type="content" source="./media/update-orchestration/run-start.png" alt-text="A screenshot of the Azure portal showing how to start an update run in the 'Not started' state." lightbox="./media/update-orchestration/run-start.png":::

- Under **Multi-cluster update** tab of the fleet resource, you can **Stop** a currently **Running** update run.

    :::image type="content" source="./media/update-orchestration/run-stop.png" alt-text="A screenshot of the Azure portal showing how to stop an update run in the 'Running' state." lightbox="./media/update-orchestration/run-stop.png":::

- Within any update run in **Not Started**, **Failed**, or **Running** state, you can select any **Stage** and **Skip** the upgrade.

    :::image type="content" source="./media/update-orchestration/skip-stage.png" alt-text="A screenshot of the Azure portal showing how to skip upgrade for a specific stage in an update run." lightbox="./media/update-orchestration/skip-stage.png":::

    You can similarly skip the upgrade at the update group or member cluster level too.

    For more information, see [conceptual overview on the update run states and skip behavior](concepts-update-orchestration.md#update-run-states) on runs/stages/groups.

#### [Azure CLI](#tab/cli)

- You can **Start** an update run that is either in **Not started** or **Failed** state:

    ```azurecli-interactive
    az fleet updaterun start --resource-group $GROUP --fleet-name $FLEET --name <run-name>
    ```

- You can **Stop** a currently **Running** update run:

    ```azurecli-interactive
    az fleet updaterun stop --resource-group $GROUP --fleet-name $FLEET --name <run-name>
    ```

- You can skip update stages or groups by specifying them under targets of the skip command:

    ```azurecli-interactive
    az fleet updaterun skip --resource-group $GROUP --fleet-name $FLEET --name <run-name> --targets Group:my-group-name Stage:my-stage-name
    ```

    For more information, see [conceptual overview on the update run states and skip behavior](concepts-update-orchestration.md#update-run-states) on runs/stages/groups.

---

[fleet-quickstart]: quickstart-create-fleet-and-members.md
[azure-cli-install]: /cli/azure/install-azure-cli
