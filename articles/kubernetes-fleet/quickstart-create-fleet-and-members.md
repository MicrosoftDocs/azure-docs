---
title: "Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI"
description: In this quickstart, you learn how to create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI.
ms.date: 03/18/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: template-quickstart, mode-other, devx-track-azurecli, ignite-2023
ms.devlang: azurecli
ms.topic: quickstart
---

# Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI

Get started with Azure Kubernetes Fleet Manager (Fleet) by using the Azure CLI to create a Fleet resource and later connect Azure Kubernetes Service (AKS) clusters as member clusters.

## Prerequisites

* Read the [conceptual overview of this feature](./concepts-fleet.md), which provides an explanation of fleets and member clusters referenced in this document.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An identity (user or service principal) which can be used to [log in to Azure CLI](/cli/azure/authenticate-azure-cli). This identity needs to have the following permissions on the Fleet and AKS resource types for completing the steps listed in this quickstart:

  * Microsoft.ContainerService/fleets/read
  * Microsoft.ContainerService/fleets/write
  * Microsoft.ContainerService/fleets/members/read
  * Microsoft.ContainerService/fleets/members/write
  * Microsoft.ContainerService/fleetMemberships/read
  * Microsoft.ContainerService/fleetMemberships/write
  * Microsoft.ContainerService/managedClusters/read
  * Microsoft.ContainerService/managedClusters/write

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version `2.53.1` or later.

* Install the **fleet** Azure CLI extension using the [`az extension add`][az-extension-add] command and Make sure your version is at least `1.0.0`.

    ```azurecli-interactive
    az extension add --name fleet
    ```

* Set the following environment variables:

    ```azurecli
    export SUBSCRIPTION_ID=<subscription_id>
    export GROUP=<your_resource_group_name>
    export FLEET=<your_fleet_name>
    ```

* Install `kubectl` and `kubelogin` using the [`az aks install-cli`][az-aks-install-cli] command.

  ```azurecli-interactive
  az aks install-cli
  ```

* The AKS clusters that you want to join as member clusters to the Fleet resource need to be within the supported versions of AKS. Learn more about AKS version support policy [here](../aks/supported-kubernetes-versions.md#kubernetes-version-support-policy).

## Create a resource group

An [Azure resource group](../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another location during resource creation.

Set the Azure subscription and create a resource group using the [`az group create`][az-group-create] command.

```azurecli-interactive
az account set -s ${SUBSCRIPTION_ID}
az group create --name ${GROUP} --location eastus
```

The following output example resembles successful creation of the resource group:

```output
{
  "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/fleet-demo",
  "location": "eastus",
  "managedBy": null,
  "name": "fleet-demo",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create a Fleet resource

You can create a Fleet resource to later group your AKS clusters as member clusters. By default, this resource enables member cluster grouping and update orchestration. If the Fleet hub is enabled, other preview features are enabled, such as Kubernetes object propagation to member clusters and L4 service load balancing across multiple member clusters.

> [!IMPORTANT]
> As of now, once a Fleet resource has been created, it's not possible to change the hub mode for the fleet resource.

### Option 1 - Create a Fleet without a hub cluster

If you want to use Fleet only for update orchestration, which is the default experience when creating a new Fleet resource, you can create a Fleet resource without the hub cluster using the [`az fleet create`][az-fleet-create] command. For more information, see [What is a hub cluster (preview)?](./concepts-fleet.md#what-is-a-hub-cluster-preview).

```azurecli-interactive
az fleet create --resource-group ${GROUP} --name ${FLEET} --location eastus
```

Your output should look similar to the following example output:

```output
{
  "etag": "...",
  "hubProfile": null,
  "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/fleet-demo/providers/Microsoft.ContainerService/fleets/fleet-demo",
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "None",
    "userAssignedIdentities": null
  },
  "location": "eastus",
  "name": "fleet-demo",
  "provisioningState": "Succeeded",
  "resourceGroup": "fleet-demo",
  "systemData": {
    "createdAt": "2023-11-03T17:15:19.610149+00:00",
    "createdBy": "<user>",
    "createdByType": "User",
    "lastModifiedAt": "2023-11-03T17:15:19.610149+00:00",
    "lastModifiedBy": "<user>",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.ContainerService/fleets"
}
```

### Option 2 - Create a Fleet with a hub cluster

If you want to use Fleet for Kubernetes object propagation and multi-cluster load balancing in addition to update orchestration, then you need to create the Fleet resource with the hub cluster enabled by specifying the `--enable-hub` parameter with the [`az fleet create`][az-fleet-create] command.

```azurecli-interactive
az fleet create --resource-group ${GROUP} --name ${FLEET} --location eastus --enable-hub
```

Your output should look similar to the example output in the previous section.

## Join member clusters

Fleet currently supports joining existing AKS clusters as member clusters.

1. Set the following environment variables for member clusters:

    ```azurecli-interactive
    export MEMBER_NAME_1=aks-member-1
    export MEMBER_CLUSTER_ID_1=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/managedClusters/${MEMBER_NAME_1}
    ```

2. Join your existing AKS clusters to the Fleet resource using the [`az fleet member create`][az-fleet-member-create] command.

    ```azurecli-interactive
    # Join the first member cluster
    az fleet member create \
        --resource-group ${GROUP} \
        --fleet-name ${FLEET} \
        --name ${MEMBER_NAME_1} \
        --member-cluster-id ${MEMBER_CLUSTER_ID_1}
    ```

    Your output should look similar to the following example output:

    ```output
    {
      "clusterResourceId": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-x",
      "etag": "...",
      "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>/members/aks-member-x",
      "name": "aks-member-1",
      "provisioningState": "Succeeded",
      "resourceGroup": "<GROUP>",
      "systemData": {
        "createdAt": "2022-10-04T19:04:56.455813+00:00",
        "createdBy": "<user>",
        "createdByType": "User",
        "lastModifiedAt": "2022-10-04T19:04:56.455813+00:00",
        "lastModifiedBy": "<user>",
        "lastModifiedByType": "User"
      },
      "type": "Microsoft.ContainerService/fleets/members"
    }
    ```

3. Verify that the member clusters have successfully joined the Fleet resource using the [`az fleet member list`][az-fleet-member-list] command.

    ```azurecli-interactive
    az fleet member list --resource-group ${GROUP} --fleet-name ${FLEET} -o table
    ```

    If successful, your output should look similar to the following example output:

    ```output
    ClusterResourceId                                                                                                                                Name          ProvisioningState    ResourceGroup
    -----------------------------------------------------------------------------------------------------------------------------------------------  ------------  -------------------  ---------------
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-1  aks-member-1  Succeeded            <GROUP>
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-2  aks-member-2  Succeeded            <GROUP>
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-3  aks-member-3  Succeeded            <GROUP>
    ```

## Next steps

* [Orchestrate updates across multiple member clusters](./update-orchestration.md).
* [Set up Kubernetes resource propagation from hub cluster to member clusters](./resource-propagation.md).
* [Set up multi-cluster layer-4 load balancing](./l4-load-balancing.md).

<!-- INTERNAL LINKS -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-fleet-create]: /cli/azure/fleet#az-fleet-create
[az-fleet-member-create]: /cli/azure/fleet/member#az-fleet-member-create
[az-fleet-member-list]: /cli/azure/fleet/member#az-fleet-member-list
