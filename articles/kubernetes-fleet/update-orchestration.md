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
---

# Orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager

Platform admins managing Kubernetes fleets with large number of clusters often have problems with staging their updates in a safe and predictable way across multiple clusters. To address this pain point, Kubernetes Fleet Manager (Fleet) allows you to orchestrate updates across multiple clusters using update runs, stages, groups, and strategies.

:::image type="content" source="./media/update-orchestration/fleet-overview-inline.png" alt-text="Screenshot of the Azure portal pane for a fleet resource, showing member cluster Kubernetes versions and node images in use across all node pools of member clusters." lightbox="./media/update-orchestration/fleet-overview-lightbox.png":::

## Prerequisites

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

* Follow the [conceptual overview of this feature](./architectural-overview.md#update-orchestration-across-multiple-clusters), which provides an explanation of update runs, stages, groups, and their characteristics.

## Update all clusters one by one

### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, go to the **Multi-cluster update** menu and select **Create**.

1. You can choose either **One by one** or **Stages**.

    :::image type="content" source="./media/update-orchestration/one-by-one-inline.png" alt-text="Screenshot of the Azure portal pane for creating update runs that update clusters one by one in Azure Kubernetes Fleet Manager." lightbox="./media/update-orchestration/one-by-one-lightbox.png":::

1. For **upgrade scope**, you can choose to either update both the **Kubernetes version and the node image version** or you can update only your **Node image version only**.

    :::image type="content" source="./media/update-orchestration/update-scope-inline.png" alt-text="Screenshot of the Azure portal pane for creating update runs. The upgrade scope section is shown." lightbox="./media/update-orchestration/update-scope-lightbox.png":::

    For the node image, the following options are available:
    - **Latest**: Updates every AKS cluster in the update run to the latest image available for that cluster in its region.
    - **Consistent**: As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](../aks/release-tracker.md) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.

### [Azure CLI](#tab/cli)

Run the following command to update the Kubernetes version and the node image version for all clusters of the fleet one by one:

```azurecli-interactive
az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-1 --upgrade-type Full --kubernetes-version 1.26.0
```

> [!NOTE]
> The `--upgrade-type` flag supports the values `Full` or `NodeImageOnly`. `Full` updates both the node images and the Kubernetes version.
> `--node-image-selection` supports the values `Latest` and `Consistent`. 
> - **Latest**: Updates every AKS cluster in the update run to the latest image available for that cluster in its region.
> - **Consistent**: As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](../aks/release-tracker.md) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.

Run the following command to update only the node image versions for all clusters of the fleet one by one:

```azurecli-interactive
az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-2 --upgrade-type NodeImageOnly
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

You can define an update run using update stages in order to sequentially order the application of updates to different update groups. For example, a first update stage might update test environment member clusters, and a second update stage would then subsequently update production environment member clusters. You can also specify a wait time between the update stages.

#### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, navigate to **Multi-cluster update** and select **Create**.

1. Select **Stages**, and then choose either **Node image (latest) + Kubernetes version** or **Node image (latest)**, depending on your desired upgrade scope.

1. Under **Stages**, select **Create Stage**. You can now specify the stage name and the duration to wait after each stage.

    :::image type="content" source="./media/update-orchestration/create-stage-basics-inline.png" alt-text="Screenshot of the Azure portal page for creating a stage and defining wait time." lightbox="./media/update-orchestration/create-stage-basics.png":::

1. Choose the update groups that you want to include in this stage.

    :::image type="content" source="./media/update-orchestration/create-stage-choose-groups-inline.png" alt-text="Screenshot of the Azure portal page for stage creation that shows the selection of upgrade groups." lightbox="./media/update-orchestration/create-stage-choose-groups.png":::

1. After you define all your stages and order them by using the **Move up** and **Move down** controls, proceed with creating the update run.

1. In the **Multi-cluster update** menu, choose the update run and select **Start**.

#### [Azure CLI](#tab/cli)

1. Run the following command to create the update run:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-3 --upgrade-type Full --kubernetes-version 1.26.0 --stages example-stages.json
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

1. Run the following command to start this update run:

    ```azurecli-interactive
    az fleet updaterun start --resource-group $GROUP --fleet-name $FLEET --name run-3
    ```

---

### Create an update run using update strategies

In the previous section, creating an update run required the stages, groups, and their order to be specified each time. Update strategies simplify this by allowing you to store templates for update runs.

> [!NOTE]
> It is possible to create multiple update runs with unique names from the same update strategy.

#### [Azure portal](#tab/azure-portal)

When creating your update runs, you are given an option to create an update strategy at the same time, effectively saving the run as a template for subsequent update runs.

1. Save an update strategy while creating an update run:

    :::image type="content" source="./media/update-orchestration/update-strategy-creation-from-run-inline.png" alt-text="A screenshot of the Azure portal showing update run stages being saved as an update strategy." lightbox="./media/update-orchestration/update-strategy-creation-from-run-lightbox.png":::

1. The update strategy you created can later be referenced when creating new subsequent update runs:

    :::image type="content" source="./media/update-orchestration/update-run-creation-from-strategy-inline.png" alt-text="A screenshot of the Azure portal showing the creation of a new update run. The 'Copy from existing strategy' button is highlighted." lightbox="./media/update-orchestration/update-run-creation-from-strategy-lightbox.png":::

#### [Azure CLI](#tab/cli)

1. Run the following command to create a new update strategy:

    ```azurecli-interactive
    az fleet updatestrategy create --resource-group $GROUP --fleet-name $FLEET --name strategy-1 --stages example-stages.json
    ```

1. Run the following command to create an update run referencing this strategy:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-4 --update-strategy-name strategy-1 --upgrade-type NodeImageOnly --node-image-selection Consistent
    ```

---

[fleet-quickstart]: quickstart-create-fleet-and-members.md
[azure-cli-install]: /cli/azure/install-azure-cli
