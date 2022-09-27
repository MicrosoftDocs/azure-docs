---
title: "Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters (preview)"
description: In this quickstart, you learn how to create an Azure Kubernetes Fleet Manager resource and join member clusters.
ms.date: 09/06/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: template-quickstart, mode-other, devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Create an Azure Kubernetes Fleet Manager resource and join member clusters (preview)

Get started with Azure Kubernetes Fleet Manager (Fleet) by using the Azure CLI to create a Fleet resource and later connect Azure Kubernetes Service (AKS) clusters as member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

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

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version is at least `2.37.0`

* Install the **fleet** Azure CLI extension. Make sure your version is at least `0.1.0`:

    ```azurecli
    az extension add --name fleet
    ```


* Set the following environment variables:

    ```azure-cli
    export SUBSCRIPTION_ID=<subscription_id>
    export LOCATION=<your_location>
    export GROUP=<your_resource_group_name>
    export FLEET=<your_fleet_name>
    export IDENTITY=<your_login_id_or_object_id_of_service_principal>
    ```

## Create a resource group

An [Azure resource group](../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you are prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the [az group create](/cli/azure/group#az-group-create) command.

```azurecli-interactive
az group create --name ${GROUP} --location ${LOCATION}
```

The following output example resembles successful creation of the resource group:

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/fleet-demo",
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

A Fleet resource can be created to subsequently group your AKS clusters as member clusters. This resource enables multi-cluster scenarios, such as Kubernetes object propagation to member clusters and north-south load balancing across endpoints deployed on these multiple member clusters.

Create a Fleet resource using the [az fleet create](/cli/azure/fleet#az-fleet-create) command:

```azurecli-interactive
az fleet create -n ${FLEET} -g ${GROUP}
```

Output:

```json
{
  "etag": "\"<guid>\"",
  "hubProfile": {
    "dnsPrefix": "fleet-demo-fleet-demo-3959ec",
    "fqdn": "<unique>.hcp.eastus.azmk8s.io",
    "kubernetesVersion": "1.23.8"
  },
  "id": "/subscriptions/<guid>/resourceGroups/fleet-demo/providers/Microsoft.ContainerService/fleets/fleet-demo",
  "location": "eastus",
  "name": "fleet-demo",
  "provisioningState": "Succeeded",
  "resourceGroup": "fleet-demo",
  "systemData": {
    "createdAt": "2022-09-24T02:23:31.924353+00:00",
    "createdBy": "<user>",
    "createdByType": "User",
    "lastModifiedAt": "2022-09-24T02:23:31.924353+00:00",
    "lastModifiedBy": "<user>",
    "lastModifiedByType": "User"
  },
  "tags": {
    "resourceTag": "addedByPolicy"
  },
  "type": "Microsoft.ContainerService/fleets"
}
```


## Join member clusters

Fleet currently supports joining existing AKS clusters as member clusters.

1. If you already have existing AKS clusters that you want to join to the fleet resource, you can skip to Step 2. If not, you can create two AKS clusters using the following commands:

    **Create virtual network and subnets**

    ```azurecli-interactive
    export VNET=fleet
    export MEMBER_1_SUBNET=member-1
    export MEMBER_2_SUBNET=member-2
    
    az network vnet create \
        --name $VNET \
        -g $RESOURCE_GROUP \
        --address-prefixes 10.0.0.0/8
    
    az network vnet subnet create \
        --vnet-name $VNET \
        --name $MEMBER_1_SUBNET \
        -g $RESOURCE_GROUP \
        --address-prefixes 10.1.0.0/16
    
    az network vnet subnet create \
        --vnet-name $VNET \
        --name $MEMBER_2_SUBNET \
        -g $RESOURCE_GROUP \
        --address-prefixes 10.2.0.0/16

    ```

    **Create AKS clusters**

    ```azurecli-interactive
    export MEMBER_CLUSTER_1=member-1

    az aks create \
        -g $GROUP \
        -n $MEMBER_CLUSTER_1 \
        --enable-managed-identity \
        --node-count 2 \
        --enable-addons monitoring \
        --enable-msi-auth-for-monitoring  \
        --generate-ssh-keys \
        --network-plugin azure \
        --vnet-subnet-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.Network/virtualNetworks/$VNET/subnets/$MEMBER_1_SUBNET" \
        --yes
    ```

    ```azurecli-interactive
    export MEMBER_CLUSTER_2=member-2

    az aks create \
        -g $GROUP \
        -n $MEMBER_CLUSTER_2 \
        --enable-managed-identity \
        --node-count 2 \
        --enable-addons monitoring \
        --enable-msi-auth-for-monitoring  \
        --generate-ssh-keys \
        --network-plugin azure \
        --vnet-subnet-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$GROUP/providers/Microsoft.Network/virtualNetworks/$VNET/subnets/$MEMBER_2_SUBNET" \
        --yes
    ```

1. Obtain the `id` for a cluster you want to join as a member cluster to the Fleet resource:

    ```azurecli-interactive
    export MEMBER_RESOURCE_ID=$(az aks show -g ${GROUP} -n ${MEMBER} --query id --output tsv)
    ```

1. Choose a unique name for this member cluster within the fleet:

    ```azurecli-interactive
    export MEMBER_NAME=<member_name>
    ```

1. Join the above target cluster to the Fleet resource using the following command:

    ```azurecli-interactive
    az fleet member create -g ${GROUP} --fleet-name ${FLEET} -n ${MEMBER_NAME} --member-cluster-id ${MEMBER_RESOURCE_ID}
    ```

    Output:

    ```json
    {
      "clusterResourceId": "/subscriptions/<guid>/resourcegroups/fleet-demo/providers/Microsoft.ContainerService/managedClusters/member-aks-1",
      "etag": "\"<guid>\"",
      "id": "/subscriptions/<guid>/resourceGroups/fleet-demo/providers/Microsoft.ContainerService/fleets/fleet-demo/members/member-aks-1",
      "name": "member-aks-1",
      "provisioningState": "Succeeded",
      "resourceGroup": "fleet-demo",
      "systemData": {
        "createdAt": "2022-09-24T03:23:51.688418+00:00",
        "createdBy": "<user>",
        "createdByType": "User",
        "lastModifiedAt": "2022-09-24T03:23:51.688418+00:00",
        "lastModifiedBy": "<user>",
        "lastModifiedByType": "User"
      },
      "type": "Microsoft.ContainerService/fleets/members"
    }
    ```

1. Verify that the member cluster has successfully joined by running the following command:

    ```azurecli-interactive
    az fleet member list -g ${GROUP} --fleet-name ${FLEET} -o table
    ```

    Output:
    
    ```json
    ClusterResourceId                                                                                                                                Name          ClusterResourceId                                                                                                                                Name          ProvisioningState    ResourceGroup
    -----------------------------------------------------------------------------------------------------------------------------------------------  ------------  -------------------  ---------------
    /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/fleet-demo/providers/Microsoft.ContainerService/managedClusters/member-aks-1  member-aks-1  Succeeded            fleet-demo
    /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/fleet-demo/providers/Microsoft.ContainerService/managedClusters/member-aks-2  member-aks-2  Succeeded            fleet-demo
    ```

## (Optional) Access the Kubernetes API of the Fleet resource cluster

An Azure Kubernetes Fleet Manager resource is itself a Kubernetes cluster that you use to centrally orchestrate scenarios, like Kubernetes object propagation, from. To access the Fleet resource's Kubernetes API, run the following commands:

1. Get the kubeconfig file of the Fleet resource:

    ```azurecli-interactive
    az fleet get-credentials -n ${FLEET} -g ${GROUP}
    ```

    Output:

    ```bash
    Merged "hub" as current context in /home/shasb/.kube/config
    ```

1. Get the `id` of the Fleet resource:

    ```azurecli-interactive
    export FLEET_ID=$(az fleet show -g ${GROUP} -n ${FLEET} --query id --output tsv)
    ```

1. Authorize your identity to the Fleet resource's Kubernetes API:

    ```azurecli-interactive
    az role assignment create --role "${ROLE}" --assignee ${IDENTITY} --scope ${FLEET_ID}
    ```

    For the above command, for the `ROLE` environment variable, you can use one of the following four built in role-definitions as value:

    * Azure Kubernetes Fleet Manager RBAC Reader
    * Azure Kubernetes Fleet Manager RBAC Writer
    * Azure Kubernetes Fleet Manager RBAC Admin
    * Azure Kubernetes Fleet Manager RBAC Cluster Admin


    Output:

    ```bash
    {
      "canDelegate": null,
      "condition": null,
      "conditionVersion": null,
      "description": null,
      "id": "/subscriptions/<guid>/resourceGroups/fleet-demo/providers/Microsoft.ContainerService/fleets/fleet-demo/providers/Microsoft.Authorization/roleAssignments/<guid>",
      "name": "<guid>",
      "principalId": "<guid>",
      "principalType": "User",
      "resourceGroup": "fleet-demo",
      "roleDefinitionId": "/subscriptions/<guid>/providers/Microsoft.Authorization/roleDefinitions/<guid>",
      "scope": "/subscriptions/<guid>/resourceGroups/fleet-demo/providers/Microsoft.ContainerService/fleets/fleet-demo",
      "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

1. Verify the status of the member clusters:

    ```bash
    kubectl get memberclusters
    ```

    Output:

    ```bash
    NAME            JOINED   AGE
    member-aks-1    True     15m
    member-aks-2    True     10m
    ```

## Next steps

* [Kubernetes configuration propagation](./configuration-propagation.md)