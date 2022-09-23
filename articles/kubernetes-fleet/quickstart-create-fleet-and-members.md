---
title: "Quickstart: Create Azure Kubernetes Fleet Manager fleet and join member clusters (preview)"
description: In this quickstart, you learn how to create an Azure Kubernetes Fleet Manager fleet resource and join member clusters.
ms.date: 09/06/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: template-quickstart, mode-other, devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Create an Azure Kubernetes Fleet Manager fleet and join member clusters (preview)

Get started with Azure Kubernetes Fleet Manager by using Azure CLI to create a fleet resource and later connect Azure Kubernetes Service (AKS) clusters as member clusters to the fleet resource.

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

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.37.0

* Install the **fleet** Azure CLI extension of version >= 0.1.0:

  ```azurecli
  az extension add --name fleet
  ```


* Set the following environment variables:

```azure-cli
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
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create fleet resource

Azure Kubernetes Fleet Manager resource can be created to subsequently group your AKS clusters as member clusters to the fleet so that you can perform multi-cluster scenarios like Kubernetes object propagation to member clusters and north-south load balancing across endpoints deployed on these multiple member clusters.

Create an Azure Kubernetes Fleet Manager resource using the [az fleet create](/cli/azure/fleet#az-fleet-create) command.

```azurecli-interactive
az fleet create -n ${FLEET} -g ${GROUP}
```

## Join member clusters

Azure Kubernetes Fleet Manager currently supports joining existing AKS clusters as member clusters 

1. If you already have existing AKS clusters that you want to join to the fleet resource, you can skip to Step 2. If not, you can create 2 AKS clusters using the following commands:

    ```azurecli-interactive
    az aks create -g ${GROUP} -n memberaks1 --enable-managed-identity --node-count 1 --enable-addons monitoring --enable-msi-auth-for-monitoring  --generate-ssh-keys
    ```

    ```azurecli-interactive
    az aks create -g ${GROUP} -n memberaks2 --enable-managed-identity --node-count 1 --enable-addons monitoring --enable-msi-auth-for-monitoring  --generate-ssh-keys
    ```

1. For each of the clusters you want to join as member clusters to the fleet, get the id of that cluster:

    ```azurecli-interactive
    export MEMBER_RESOURCE_ID=$(az aks show -g ${GROUP} -n ${MEMBER} --query id --output tsv)
    ```

1. Join the above AKS cluster to the fleet using the following command:

    ```azurecli-interactive
    az fleet member join -g ${GROUP} -n ${FLEET} --member-cluster-id=${MEMBER_RESOURCE_ID}
    ```

1. Verify that the member cluster has successfully joined by running the following command:

    ```azurecli-interactive
    az fleet member list -g ${GROUP} -n ${FLEET} -o table
    ```

## (Optional) Access Kubernetes API of the fleet cluster

The Azure Kubernetes Fleet Manager resource itself is a Kubernetes cluster that you use to centrally orchestrate scenarios like Kubernetes object propagation from. To access the fleet resource's Kubernetes API, run the following commands:

1. Get the kubeconfig file of the fleet resource:

    ```azurecli-interactive
    az fleet get-credentials -n ${FLEET} -g ${GROUP}
    ```

1. Get the id of the fleet resource:

    ```azurecli-interactive
    export FLEET_ID=$(az fleet show -g ${GROUP} -n ${FLEET} --query id --output tsv)
    ```

1. Authorize your identity to this Kubernetes API:

    ```azurecli-interactive
    az role assignment create --role "${ROLE}" --assignee ${IDENTITY} --scope ${FLEET_ID}
    ```

    For the above command, for the `ROLE` environment variable, you can use one of the following four built in role-definitions as value:

    * Azure  Kubernetes Fleet Manager RBAC Reader
    * Azure  Kubernetes Fleet Manager RBAC Writer
    * Azure  Kubernetes Fleet Manager RBAC Admin
    * Azure  Kubernetes Fleet Manager RBAC Cluster Admin

1. Verify the status of the member clusters:

    ```bash
    kubectl get memberclusters
    ```

## Next steps

* [Kubernetes configuration propagation](./configuration-propagation.md)
* 
