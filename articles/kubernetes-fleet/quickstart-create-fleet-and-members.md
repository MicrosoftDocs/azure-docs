---
title: "Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI"
description: In this quickstart, you learn how to create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI.
ms.date: 03/18/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: template-quickstart, mode-other, devx-track-azurecli, ignite-2023, build-2024
ms.devlang: azurecli
ms.topic: quickstart
---

# Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI

Get started with Azure Kubernetes Fleet Manager (Fleet) by using the Azure CLI to create a Fleet resource and later connect Azure Kubernetes Service (AKS) clusters as member clusters.

## Prerequisites

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]

* Read the [conceptual overview of this feature](./concepts-fleet.md), which provides an explanation of fleets and member clusters referenced in this document.
* Read the [conceptual overview of fleet types](./concepts-choosing-fleet.md), which provides a comparison of different fleet configuration options.
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

You can create a Fleet resource to later group your AKS clusters as member clusters. When created via Azure CLI, by default, this resource enables member cluster grouping and update orchestration. If the Fleet hub is enabled, other preview features are enabled, such as Kubernetes object propagation to member clusters and L4 service load balancing across multiple member clusters. For more information, see the [conceptual overview of fleet types](./concepts-choosing-fleet.md), which provides a comparison of different fleet configurations.

> [!IMPORTANT]
> Once a Kubernetes Fleet resource has been created, it's possible to upgrade a Kubernetes Fleet resource without a hub cluster to one with a hub cluster. For Kubernetes Fleet resources with a hub cluster, once private or public has been selected it cannot be changed.


### [Kubernetes Fleet resource without hub cluster](#tab/without-hub-cluster)

If you want to use Fleet only for update orchestration, which is the default experience when creating a new Fleet resource via Azure CLI, you can create a Fleet resource without the hub cluster using the [`az fleet create`][az-fleet-create] command.

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

### [Kubernetes Fleet resource with hub cluster](#tab/with-hub-cluster)

If you want to use Fleet for Kubernetes object propagation and multi-cluster load balancing in addition to update orchestration, then you need to create the Fleet resource with the hub cluster enabled by specifying the `--enable-hub` parameter with the [`az fleet create`][az-fleet-create] command.

Kubernetes Fleet clusters with a hub cluster support both public and private modes for network access. For more information, see [Choose an Azure Kubernetes Fleet Manager option](./concepts-choosing-fleet.md#network-access-modes-for-hub-cluster.

> [!NOTE]
> By default, Kubernetes Fleet resources with hub clusters are public, and Fleet will choose the VM SKU used for the hub node (at this time, it tries "Standard_D4s_v4", "Standard_D4s_v3", "Standard_D4s_v5", "Standard_Ds3_v2", "Standard_E4as_v4" in order). If none of these options are acceptable or available, you can select a VM SKU by setting `--vm-size <SKU>`.

#### Public hub cluster

To create a public Kubernetes Fleet resource with a hub cluster, use the `az fleet create` command with the `--enable-hub` flag set.

```azurecli-interactive
az fleet create --resource-group ${GROUP} --name ${FLEET} --location eastus --enable-hub
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

#### Private hub cluster

When creating a private access mode Kubernetes Fleet resource with a hub cluster, some extra considerations apply:
- Fleet requires you to provide the subnet on which the Fleet hub cluster's node VMs will be placed. You can specify this at creation time by setting `--agent-subnet-id <subnet>`. This command differs from the one you use to work directly with a private AKS cluster in that it's a required argument for Fleet but not for AKS.
-  The address prefix of the vnet whose subnet is passed via `--vnet-subnet-id` must not overlap with the AKS default service range of `10.0.0.0/16`.
- When using an AKS private cluster, you have the ability to configure fully qualified domain names (FQDNs) and FQDN subdomains. This functionality doesn't apply to the private access mode type hub cluster.

First, create a virtual network and subnet for your hub cluster's node VMs using the `az network vnet create` and `az network vnet subnet create` commands.

```azurecli-interactive
az network vnet create --resource-group ${GROUP} --name vnet --address-prefixes 192.168.0.0/16
az network vnet subnet create --resource-group ${GROUP} --vnet-name vnet --name subnet --address-prefixes 192.168.0.0/24

SUBNET_ID=$(az network vnet subnet show --resource-group ${GROUP} --vnet-name vnet -n subnet -o tsv --query id)
```

To create a private access mode Kubernetes Fleet resource, use `az fleet create` command with the `--enable-private-cluster` flag and provide the subnet ID obtained in the previous step to the  `--agent-subnet-id <subnet>` argument.

```azurecli-interactive
az fleet create --resource-group ${GROUP} --name ${FLEET} --enable-hub --enable-private-cluster --agent-subnet-id "${SUBNET_ID}"
```

---

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
    az fleet member create --resource-group ${GROUP} --fleet-name ${FLEET} --name ${MEMBER_NAME_1} --member-cluster-id ${MEMBER_CLUSTER_ID_1}
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

3. Verify that the member clusters successfully joined the Fleet resource using the [`az fleet member list`][az-fleet-member-list] command.

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

* [Access the Kubernetes API of the Fleet resource](./quickstart-access-fleet-kubernetes-api.md).

<!-- INTERNAL LINKS -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-fleet-create]: /cli/azure/fleet#az-fleet-create
[az-fleet-member-create]: /cli/azure/fleet/member#az-fleet-member-create
[az-fleet-member-list]: /cli/azure/fleet/member#az-fleet-member-list
