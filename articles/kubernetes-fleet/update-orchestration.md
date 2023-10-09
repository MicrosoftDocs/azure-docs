---
title: "Orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager (Preview)"
description: Learn how to orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager (Preview).
ms.topic: how-to
ms.date: 05/10/2023
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: build-2023, devx-track-azurecli
---

# Orchestrate updates across multiple clusters by using Azure Kubernetes Fleet Manager (Preview)

Platform admins who are managing Kubernetes fleets with a large number of clusters often have problems with staging their updates across clusters in a safe and predictable way. To address this pain point, Azure Kubernetes Fleet Manager allows you to orchestrate updates across multiple clusters by using update runs, stages, and groups.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* You must have an Azure Kubernetes Fleet Manager resource with one or more member clusters. If not, follow the [quickstart][fleet-quickstart] to create an Azure Kubernetes Fleet Manager resource and join Azure Kubernetes Service (AKS) clusters as members. This walkthrough demonstrates an Azure Kubernetes Fleet Manager resource with five AKS member clusters as an example.

* Set the following environment variables:

  ```azurecli-interactive
  export GROUP=<resource-group>
  export FLEET=<fleet-name>
  ```

* If you're following the Azure CLI instructions in this article, you need Azure CLI version 2.48.0 or later installed. To install or upgrade, see [Install the Azure CLI][azure-cli-install].

  You also need the `fleet` Azure CLI extension, which you can install by running the following command:

  ```azurecli-interactive
  az extension add --name fleet
  ```

  Run the following command to update to the latest version of the extension:

  ```azurecli-interactive
  az extension update --name fleet
  ```

* Follow the [conceptual overview of this service](./architectural-overview.md#update-orchestration-across-multiple-clusters), which provides an explanation of update runs, stages, groups, and their characteristics.

## Update all clusters one by one

### [Azure portal](#tab/azure-portal)

1. Go to the [Azure portal with the feature flag for fleet update orchestration turned on](https://aka.ms/preview/fleetupdaterun).

1. On the page for your Azure Kubernetes Fleet Manager resource, go to the **Multi-cluster update** menu and select **Create**.

1. Select **One by one**, and then choose either **Node image (latest) + Kubernetes version** or **Node image (latest)**, depending on your desired upgrade scope.

    :::image type="content" source="./media/update-orchestration/one-by-one-inline.png" alt-text="Screenshot of the Azure portal pane for creating update runs that update clusters one by one in Azure Kubernetes Fleet Manager." lightbox="./media/update-orchestration/one-by-one.png":::

### [Azure CLI](#tab/cli)

Run the following command to update the Kubernetes version and the node image version for all clusters of the fleet one by one:

```azurecli-interactive
az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-1 --upgrade-type Full --kubernetes-version 1.26.0
```

> [!NOTE]
> The `--upgrade-type` flag supports the values `Full` or `NodeImageOnly`. `Full` updates both the node images and the Kubernetes version.

Run the following command to update only the node image versions for all clusters of the fleet one by one:

```azurecli-interactive
az fleet updaterun create --resource-group $GROUP --fleet-name $FLEET --name run-2 --upgrade-type NodeImageOnly
```

---

## Update clusters in a specific order

Update groups and stages provide more control over the sequence that update runs follow when you're updating the clusters.

Any fleet member can be a part of only one update group. But an update group can have multiple fleet members inside it.

An update group itself is not a separate resource type. Update groups are only strings that represent references from the fleet members. If you delete all fleet members that have references to a common update group, that specific update group will also cease to exist.

### Assign a cluster to an update group

You can assign a member cluster to a specific update group in one of two ways.

The first method is to assign a cluster to a group when you're adding a member cluster to the fleet. For example:

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

The second method is to assign an existing fleet member to an update group. For example:

#### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, go to **Member clusters**. Choose the member clusters that you want, and then select **Assign update group**.

    :::image type="content" source="./media/update-orchestration/existing-members-assign-group-inline.png" alt-text="Screenshot of the Azure portal page for assigning existing member clusters to a group." lightbox="./media/update-orchestration/existing-members-assign-group.png":::

1. Specify the group name, and then select **Assign**.

    :::image type="content" source="./media/update-orchestration/group-name-inline.png" alt-text="Screenshot of the Azure portal page for member clusters that shows the form for updating a member cluster's group." lightbox="./media/update-orchestration/group-name.png":::

#### [Azure CLI](#tab/cli)

```azurecli-interactive
az fleet member update --resource-group $GROUP --fleet-name $FLEET --name member1 --update-group group-1a
```

---

### Define an update run and stages

You can define an update run by using update stages to pool together update groups for which the updates need to be run in parallel. You can also specify a wait time between the update stages.

#### [Azure portal](#tab/azure-portal)

1. On the page for your Azure Kubernetes Fleet Manager resource, go to **Multi-cluster update** and select **Create**.

1. Select **Stages**, and then choose either **Node image (latest) + Kubernetes version** or **Node image (latest)**, depending on your desired upgrade scope.

1. Under **Stages**, select **Create**. You can now specify the stage name and the duration to wait after each stage.

    :::image type="content" source="./media/update-orchestration/create-stage-basics.png" alt-text="Screenshot of the Azure portal page for creating a stage and defining wait time." lightbox="./media/update-orchestration/create-stage-basics.png":::

1. Choose the update groups that you want to include in this stage.

    :::image type="content" source="./media/update-orchestration/create-stage-choose-groups.png" alt-text="Screenshot of the Azure portal page for stage creation that shows the selection of upgrade groups.":::

1. After you define all your stages and order them by using the **Move up** and **Move down** controls, proceed with creating the update run.

1. On the **Multi-cluster update** menu, choose the update run and select **Start**.

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

[fleet-quickstart]: quickstart-create-fleet-and-members.md
[azure-cli-install]: /cli/azure/install-azure-cli
