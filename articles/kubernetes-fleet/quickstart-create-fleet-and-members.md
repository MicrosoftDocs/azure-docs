---
title: "Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters"
description: In this quickstart, you learn how to create an Azure Kubernetes Fleet Manager resource and join member clusters.
ms.date: 11/06/2023
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: template-quickstart, mode-other, devx-track-azurecli, ignite-2023
ms.devlang: azurecli
ms.topic: quickstart
---

# Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters

Get started with Azure Kubernetes Fleet Manager (Fleet) by using the Azure CLI to create a Fleet resource and later connect Azure Kubernetes Service (AKS) clusters as member clusters.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A basic understanding of [Kubernetes core concepts](../aks/concepts-clusters-workloads.md).

* An identity (user or service principal) which can be used to [log in to Azure CLI](/cli/azure/authenticate-azure-cli). This identity needs to have the following permissions on the Fleet and AKS resource types for completing the steps listed in this quickstart:

    * Microsoft.ContainerService/fleets/read
    * Microsoft.ContainerService/fleets/write
    * Microsoft.ContainerService/fleets/listCredentials/action
    * Microsoft.ContainerService/fleets/members/read
    * Microsoft.ContainerService/fleets/members/write
    * Microsoft.ContainerService/fleetMemberships/read
    * Microsoft.ContainerService/fleetMemberships/write
    * Microsoft.ContainerService/managedClusters/read
    * Microsoft.ContainerService/managedClusters/write
    * Microsoft.ContainerService/managedClusters/listClusterUserCredential/action

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version `2.53.1` or later


* Install the **fleet** Azure CLI extension. Make sure your version is at least `1.0.0`:

    ```azurecli
    az extension add --name fleet
    ```

* Set the following environment variables:

    ```azurecli
    export SUBSCRIPTION_ID=<subscription_id>
    export GROUP=<your_resource_group_name>
    export FLEET=<your_fleet_name>
    ```

* Install `kubectl` and `kubelogin` using the `az aks install-cli` command:

  ```azurecli
  az aks install-cli
  ```

* The AKS clusters that you want to join as member clusters to the fleet resource need to be within the supported versions of AKS. Learn more about AKS version support policy [here](../aks/supported-kubernetes-versions.md#kubernetes-version-support-policy).

## Create a resource group

An [Azure resource group](../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another location during resource creation.

Set the Azure subscription and create a resource group using the [az group create](/cli/azure/group#az-group-create) command.

```azurecli-interactive
az account set -s ${SUBSCRIPTION_ID}
az group create --name ${GROUP} --location eastus
```

The following output example resembles successful creation of the resource group:

```json
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

## Create a fleet resource

You can create a fleet resource to later group your AKS clusters as member clusters. By default this resource enables member cluster grouping and update orchestration. If the fleet hub is enabled, additional preview features are enabled such as Kubernetes object propagation to member clusters, and L4 service load balancing across multiple member clusters.

> [!IMPORTANT]
> As of now, once a fleet resource has been created, it is not possible to change the hub mode for the fleet resource.

### Update orchestration only (default)

If you want to use Fleet only for update orchestration, you can create a fleet resource without the hub cluster using the [az fleet create](/cli/azure/fleet#az-fleet-create) command. This is the default experience when creating a new fleet resource.

```azurecli-interactive
az fleet create --resource-group ${GROUP} --name ${FLEET} --location eastus
```

The output will look similar to the following example:

```json
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

### All scenarios enabled

If you want to use fleet for Kubernetes object propagation and multi-cluster load balancing in addition to update orchestration, then you need to create the fleet resource with the hub cluster enabled by specifying the `--enable-hub` parameter while using the [az fleet create](/cli/azure/fleet#az-fleet-create) command:

```azurecli-interactive
az fleet create --resource-group ${GROUP} --name ${FLEET} --location eastus --enable-hub
```

Output will look similar to the example above.

## Join member clusters

Fleet currently supports joining existing AKS clusters as member clusters.

1. If you already have existing AKS clusters that you want to join to the fleet resource, you can skip to Step 2. If not, you can create three AKS clusters using the following commands:

    **Create virtual network and subnets**

    ```azurecli-interactive
    export FIRST_VNET=first-vnet
    export SECOND_VNET=second-vnet
    export MEMBER_1_SUBNET=member-1
    export MEMBER_2_SUBNET=member-2
    export MEMBER_3_SUBNET=member-3
    
    az network vnet create \
        --name ${FIRST_VNET} \
        --resource-group ${GROUP} \
        --location eastus \
        --address-prefixes 10.0.0.0/8

    az network vnet create \
        --name ${SECOND_VNET} \
        --resource-group ${GROUP} \
        --location westcentralus \
        --address-prefixes 10.0.0.0/8
    
    az network vnet subnet create \
        --vnet-name ${FIRST_VNET} \
        --name ${MEMBER_1_SUBNET} \
        --resource-group ${GROUP} \
        --address-prefixes 10.1.0.0/16
    
    az network vnet subnet create \
        --vnet-name ${FIRST_VNET} \
        --name ${MEMBER_2_SUBNET} \
        --resource-group ${GROUP} \
        --address-prefixes 10.2.0.0/16

    az network vnet subnet create \
        --vnet-name ${SECOND_VNET} \
        --name ${MEMBER_3_SUBNET} \
        --resource-group ${GROUP} \
        --address-prefixes 10.1.0.0/16
    ```

    **Create AKS clusters**

    ```azurecli-interactive
    export MEMBER_NAME_1=aks-member-1

    az aks create \
        --resource-group ${GROUP} \
        --location eastus \
        --name ${MEMBER_NAME_1} \
        --node-count 1 \
        --network-plugin azure \
        --vnet-subnet-id "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.Network/virtualNetworks/${FIRST_VNET}/subnets/${MEMBER_1_SUBNET}"
    ```

    ```azurecli-interactive
    export MEMBER_NAME_2=aks-member-2

    az aks create \
        --resource-group ${GROUP} \
        --location eastus \
        --name ${MEMBER_NAME_2} \
        --node-count 1 \
        --network-plugin azure \
        --vnet-subnet-id "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.Network/virtualNetworks/${FIRST_VNET}/subnets/${MEMBER_2_SUBNET}"
    ```

    ```azurecli-interactive
    export MEMBER_NAME_3=aks-member-3

    az aks create \
        --resource-group ${GROUP} \
        --location westcentralus \
        --name ${MEMBER_NAME_3} \
        --node-count 1 \
        --network-plugin azure \
        --vnet-subnet-id "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.Network/virtualNetworks/${SECOND_VNET}/subnets/${MEMBER_3_SUBNET}"
    ```

    We created the third cluster in a different region above to demonstrate that fleet can support joining clusters from different regions. Fleet also supports joining clusters from different subscriptions. The only requirement for AKS clusters being joined to fleet as members is that they all need to be a part of the same Microsoft Entra tenant.

1. Set the following environment variables for members:

    ```azurecli-interactive
    export MEMBER_NAME_1=aks-member-1
    export MEMBER_CLUSTER_ID_1=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/managedClusters/${MEMBER_NAME_1}

    export MEMBER_NAME_2=aks-member-2
    export MEMBER_CLUSTER_ID_2=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/managedClusters/${MEMBER_NAME_2}

    export MEMBER_NAME_3=aks-member-3
    export MEMBER_CLUSTER_ID_3=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/managedClusters/${MEMBER_NAME_3}
    ```

1. Join these clusters to the Fleet resource using the following commands:

    ```azurecli-interactive
    az fleet member create \
        --resource-group ${GROUP} \
        --fleet-name ${FLEET} \
        --name ${MEMBER_NAME_1} \
        --member-cluster-id ${MEMBER_CLUSTER_ID_1}
    ```

    The output will look similar to the following example:

    ```json
    {
      "clusterResourceId": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-1",
      "etag": "...",
      "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>/members/aks-member-1",
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

    ```azurecli-interactive
    az fleet member create \
        --resource-group ${GROUP} \
        --fleet-name ${FLEET} \
        --name ${MEMBER_NAME_2} \
        --member-cluster-id ${MEMBER_CLUSTER_ID_2}
    ```

    The output will look similar to the following example:

    ```json
    {
      "clusterResourceId": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-2",
      "etag": "...",
      "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>/members/aks-member-2",
      "name": "aks-member-2",
      "provisioningState": "Succeeded",
      "resourceGroup": "<GROUP>",
      "systemData": {
        "createdAt": "2022-10-04T19:05:06.483268+00:00",
        "createdBy": "<user>",
        "createdByType": "User",
        "lastModifiedAt": "2022-10-04T19:05:06.483268+00:00",
        "lastModifiedBy": "<user>",
        "lastModifiedByType": "User"
      },
      "type": "Microsoft.ContainerService/fleets/members"
    }
    ```

    ```azurecli-interactive
    az fleet member create \
        --resource-group ${GROUP} \
        --fleet-name ${FLEET} \
        --name ${MEMBER_NAME_3} \
        --member-cluster-id ${MEMBER_CLUSTER_ID_3}
    ```

    The output will look similar to the following example:

    ```json
    {
      "clusterResourceId": "/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-3",
      "etag": "...",
      "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>/members/aks-member-3",
      "name": "aks-member-3",
      "provisioningState": "Succeeded",
      "resourceGroup": "fleet-demo",
      "systemData": {
        "createdAt": "2022-10-04T19:05:19.497275+00:00",
        "createdBy": "<user>",
        "createdByType": "User",
        "lastModifiedAt": "2022-10-04T19:05:19.497275+00:00",
        "lastModifiedBy": "<user>",
        "lastModifiedByType": "User"
      },
      "type": "Microsoft.ContainerService/fleets/members"
    }
    ```

1. Verify that the member cluster has successfully joined by running the following command:

    ```azurecli-interactive
    az fleet member list --resource-group ${GROUP} --fleet-name ${FLEET} -o table
    ```

    If successful, the output will look similar to the following example:
    
    ```console
    ClusterResourceId                                                                                                                                Name          ProvisioningState    ResourceGroup
    -----------------------------------------------------------------------------------------------------------------------------------------------  ------------  -------------------  ---------------
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-1  aks-member-1  Succeeded            <GROUP>
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-2  aks-member-2  Succeeded            <GROUP>
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/managedClusters/aks-member-3  aks-member-3  Succeeded            <GROUP>
    ```

## (Optional) Access the Kubernetes API of the Fleet resource cluster

If the Azure Kubernetes Fleet Manager resource was created with the hub cluster enabled, then it can be used to centrally control scenarios like Kubernetes object propagation.

If the Azure Kubernetes Fleet Manager resource was created without the hub cluster enabled, then you can skip this section.

To access the Fleet cluster's Kubernetes API, run the following commands:

1. Get the kubeconfig file of the Fleet resource:

    ```azurecli-interactive
    az fleet get-credentials --resource-group ${GROUP} --name ${FLEET}
    ```

    The output will look similar to the following example:

    ```console
    Merged "hub" as current context in /home/fleet/.kube/config
    ```

1. Set the following environment variable for the `id` of the Fleet resource:

    ```azurecli-interactive
    export FLEET_ID=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/fleets/${FLEET}
    ```

1. Authorize your identity to the Fleet resource's Kubernetes API:

    ```azurecli-interactive
    export IDENTITY=$(az ad signed-in-user show --query "id" --output tsv)
    export ROLE="Azure Kubernetes Fleet Manager RBAC Cluster Admin"
    az role assignment create --role "${ROLE}" --assignee ${IDENTITY} --scope ${FLEET_ID}
    ```

    For the above command, for the `ROLE` environment variable, you can use one of the following four built-in role definitions as value:

    * Azure Kubernetes Fleet Manager RBAC Reader
    * Azure Kubernetes Fleet Manager RBAC Writer
    * Azure Kubernetes Fleet Manager RBAC Admin
    * Azure Kubernetes Fleet Manager RBAC Cluster Admin


    You should see output similar to the following example:

    ```json
    {
      "canDelegate": null,
      "condition": null,
      "conditionVersion": null,
      "description": null,
      "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>/providers/Microsoft.Authorization/roleAssignments/<assignment>",
      "name": "<name>",
      "principalId": "<id>",
      "principalType": "User",
      "resourceGroup": "<GROUP>",
      "roleDefinitionId": "/subscriptions/<SUBSCRIPTION_ID>/providers/Microsoft.Authorization/roleDefinitions/18ab4d3d-a1bf-4477-8ad9-8359bc988f69",
      "scope": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>",
      "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

1. Verify the status of the member clusters:

    ```bash
    kubectl get memberclusters
    ```

    If successful, the output will look similar to the following example:

    ```console
    NAME           JOINED   AGE
    aks-member-1   True     2m
    aks-member-2   True     2m
    aks-member-3   True     2m
    ```

## Next steps

* Learn how to use [Update orchestration](./update-orchestration.md)
* Learn how to use [Kubernetes resource object propagation](./resource-propagation.md)
