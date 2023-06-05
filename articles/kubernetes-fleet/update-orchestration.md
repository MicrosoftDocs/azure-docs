---
title: "Orchestrate updates across multiple clusters using Azure Kubernetes Fleet Manager (Preview)"
description: Learn how to orchestrate updates across multiple clusters using Azure Kubernetes Fleet Manager (Preview).
ms.topic: how-to
ms.date: 05/10/2023
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: build-2023
---

# Orchestrate updates across multiple clusters using Azure Kubernetes Fleet Manager (Preview)

Platform admins managing Kubernetes fleets with large number of clusters often have problems with staging their updates across multiple clusters in a safe and predictable way. To address this pain point, Kubernetes Fleet Manager (Fleet) allows you to orchestrate updates across multiple clusters using update runs, stages, and groups.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* You have a Fleet resource with one or more member clusters. If not, follow the [quickstart][fleet-quickstart] to create a Fleet resource and join Azure Kubernetes Service (AKS) clusters as members. This walkthrough demonstrates a Fleet resource with five AKS member clusters as an example.

* Set the following environment variables:

    ```bash
    export GROUP=<resource-group>
    export FLEET=<fleet-name>
    ```

* If you're following the Azure CLI instructions on this page, you need * Azure CLI version 2.48.0 or later installed. To install or upgrade, see [Install Azure CLI][install-azure-cli]. You'll also need the `fleet` Azure CLI extension, which can be installed by running the following command:

    ```azurecli-interactive
    az extension add --name fleet
    ```

    Run the following command to update to the latest version of the extension released:

    ```azurecli-interactive
    az extension update --name fleet
    ```

* Follow the [conceptual overview of this feature](./architectural-overview.md#update-orchestration-across-multiple-clusters), which provides an explanation of update runs, stages, groups and their characteristics.

## Update all clusters one-by-one

### [Azure portal](#tab/azure-portal)

1. Navigate to [Azure portal with the fleet update orchestration feature flag turned on](https://aka.ms/preview/fleetupdaterun).

1. On the page for your Fleet resource, navigate to the **Multi-cluster update** menu and select **Create**.

1. Select **One by one**, and choose either **Node image (latest) + Kubernetes version** or **Node image (latest)**, depending on your desired upgrade scope.

    :::image type="content" source="./media/update-orchestration/one-by-one-inline.png" alt-text="A screenshot of the Azure portal Fleet screen for one by one updates." lightbox="./media/update-orchestration/one-by-one.png":::

### [Azure CLI](#tab/cli)

Run the following command to update the Kubernetes version and the node image version for all clusters of the fleet one-by-one:

```azurecli-interactive
az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-1 --upgrade-type Full --kubernetes-version 1.26.0
```

> [!NOTE]
> `--upgrade-type` supports the values `Full` or `NodeImageOnly`. `Full` updates both the node images and the Kubernetes version.

Run the following command to update only the node image versions for all clusters of the fleet one-by-one:

```azurecli-interactive
az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-2 --upgrade-type NodeImageOnly
```

---

## Update clusters in a specific order

Update groups and stages provide more control on the sequence followed by update runs when updating the clusters.

### Update group assignment

You can assign a member cluster to a specific update group in one of two ways:

* Assign to group when adding member cluster to the fleet. For example:

#### [Azure portal](#tab/azure-portal)

1. On the page for your Fleet resource, navigate to **Member clusters**.

    :::image type="content" source="./media/update-orchestration/add-members-inline.png" alt-text="Screenshot of the Azure portal page for Fleet member clusters." lightbox="./media/update-orchestration/add-members.png":::

1. Specify the update group the member cluster should belong to.

    :::image type="content" source="./media/update-orchestration/add-members-assign-group-inline.png" alt-text="A screenshot of the Azure portal page for adding member clusters to Fleet and assigning them to groups." lightbox="./media/update-orchestration/add-members-assign-group.png":::

#### [Azure CLI](#tab/cli)

```azurecli-interactive
az fleet member create --resource-group $GROUP --fleet-name $FLEET --name member1 --member-cluster-id $AKS_CLUSTER_ID --update-group group-1a
```

---

* Assign an already existing fleet member to an update group. For example:

#### [Azure portal](#tab/azure-portal)

1. On the page for your Fleet resource, navigate to **Member clusters** menu. Choose the member clusters you want and select **Assign update group**.

    :::image type="content" source="./media/update-orchestration/existing-members-assign-group-inline.png" alt-text="A screenshot of the Azure portal page for assigning existing member clusters to a group." lightbox="./media/update-orchestration/existing-members-assign-group.png":::

1. Specify the group name and select **Assign**.

    :::image type="content" source="./media/update-orchestration/group-name-inline.png" alt-text="A screenshot of the Azure portal page for member clusters, showing the form for updating a member cluster's group." lightbox="./media/update-orchestration/group-name.png":::

#### [Azure CLI](#tab/cli)

```azurecli-interactive
az fleet member update --resource-group $GROUP --fleet-name $FLEET --name member1 --update-group group-1a
```

---

> [!NOTE]
> Any fleet member can only be a part of one update group. But an update group can have multiple fleet members inside it.
> Update group itself is not a separate resource type. Update groups are only strings representing references from the fleet members. So if all fleet members having references to a common update group are deleted, that specific update group will cease to exist as well.

### Update run and stages

You can define an update run by using update stages to pool together update groups for whom the updates need to be run in parallel. You can also specify a wait time between the update stages.

### [Azure portal](#tab/azure-portal)

1. On the page for your Fleet resource, navigate to **Multi-cluster update** and select **Create**.

1. Select **Stages**, and choose either **Node image (latest) + Kubernetes version** or **Node image (latest)**, depending on your desired upgrade scope. 

1. Under **Stages**, select **Create**. You can now specify the stage name and duration to wait after each stage.

    :::image type="content" source="./media/update-orchestration/create-stage-basics.png" alt-text="A screenshot of the Azure portal page for creating a stage and defining wait time." lightbox="./media/update-orchestration/create-stage-basics.png":::

1. Choose the update groups you want to include in this stage.

    :::image type="content" source="./media/update-orchestration/create-stage-choose-groups.png" alt-text="A screenshot of the Azure portal page for stage creation, showing the selection upgrade groups.":::

1. Once you have defined all your stages and ordered them using the **Move up** and **Move down** controls, proceed with creating the update run.

1. In the **Multi-cluster update** menu, choose the update run and select **Start**.

### [Azure CLI](#tab/cli)

1. Run the following command to create the update run:

    ```azurecli-interactive
    az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-3 --upgrade-type Full --kubernetes-version 1.26.0 --stages example-stages.json
    ```

    Example for stages file input (example-stages.json):

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

[fleet-quickstart]: quickstart-create-fleet-and-members.md
[azure-cli-install]: /cli/azure/install-azure-cli
