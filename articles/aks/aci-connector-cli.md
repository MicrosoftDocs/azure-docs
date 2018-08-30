---
title: Connect an AKS cluster to Azure Container Instances (ACI)
description: Learn how to use the Azure Container Instances (ACI) connector to run pods from an Azure Kubernetes Service (AKS) cluster
services: container-service
author: iainfoulds

ms.service: container-service
ms.date: 09/24/2018
ms.author: iainfou
---

# Connect an Azure Kubernetes Services (AKS) cluster to Azure Container Instances (ACI)

To rapidly scale application workloads in an Azure Kubernetes Service (AKS) cluster, you can connect to Azure Container Instances (ACI). With ACI, you have quick provisioning of container instances, and only pay per second for their execution time. You don't need to wait for Kubernetes cluster autoscaler to deploy underlying compute nodes to run the additional pods. This article shows you how to create and configure the virtual network resources and AKS cluster, then enable the ACI connector.

> [!IMPORTANT]
> The ACI connector for AKS is currently in **preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

## Before you begin

The ACI connector enables network communication between pods that run in ACI and the AKS cluster. To provide this communication, a virtual network subnet is created for use with ACI. The ACI connector only works with AKS clusters created using *advanced* networking. By default, AKS clusters are created with *basic* networking. This article details all the steps to create a virtual network and subnets, delegate access for AKS to use and manage those network resources, then deploy an AKS cluster that uses advanced networking.

For more information, see [AKS advanced networking][].

The AKS cluster created in this article is also configured with Kubernetes role-based access controls. The ACI connector only works with RBAC-enabled clusters.

For more information, see [AKS security with RBAC][].

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.46 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. Create a resource group with the [az group create][az-group-create] command. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a virtual network

Create a virtual network using the [az network vnet create][az-network-vnet-create] command. The following example creates a virtual network name *myVnet* with an address prefix of *10.0.0.0/16*, and a subnet named *myAKSSubnet*. The address prefix of this subnet defaults to *10.0.0.0/24*:

```azurecli-interactive
az network vnet create \
    --resource-group myResourceGroup \
    --name myVnet \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name myAKSSubnet
```

Now create an additional subnet for ACI using the [az network vnet subnet create][az-network-vnet-subnet-create] command. The following example creates a subnet named *myACISubnet* with the address prefix of *10.0.1.0/24*.

```azurecli-interactive
az network vnet subnet create \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name myACISubnet \
    --address-prefix 10.0.1.0/24
```

## Create a service principal

To allow an AKS cluster to interact with other Azure resources, an Azure Active Directory service principal is used. This service principal can be automatically created by the Azure CLI or portal, or you can pre-create one and assign additional permissions. In this article, you create a service principal, grant access to the Azure Container Registry (ACR) instance created in the previous tutorial, then create an AKS cluster.

Create a service principal using the [az ad sp create-for-rbac][az-ad-sp-create-for-rbac] command. The `--skip-assignment` parameter limits any additional permissions from being assigned.

```azurecli-interactive
az ad sp create-for-rbac --skip-assignment
```

The output is similar to the following example:

```
{
  "appId": "bef76eb3-d743-4a97-9534-03e9388811fc",
  "displayName": "azure-cli-2018-08-29-22-29-29",
  "name": "http://azure-cli-2018-08-29-22-29-29",
  "password": "1d257915-8714-4ce7-a7fb-0e5a5411df7f",
  "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db48"
}
```

Make a note of the *appId* and *password*. These values are used in the following steps.

## Assign permissions to the virtual network

To allow your cluster to use and manage the virtual network, you must grant the AKS service principal the correct rights to use the network resources.

First, get the virtual network resource ID using [az network vnet show][az-network-vnet-show]:

```azurecli-interactive
az network vnet show --resource-group myResourceGroup --name myVnet --query id -o tsv
```

To grant the correct access for the AKS cluster to use the virtual network, create a role assignment using the [az role assignment create][az-role-assignment-create] command. Replace `<appId`> and `<vnetId>` with the values gathered in the previous two steps.

```azurecli-interactive
az role assignment create --assignee <appId> --scope <vnetId> --role Contributor
```

## Create an AKS cluster

You deploy an AKS cluster into the AKS subnet created in a previous step. Get the ID of this subnet using [az network vnet subnet show][az-network-vnet-subnet-show]:

```azurecli-interactive
az network vnet subnet show --resource-group myResourceGroup --vnet-name myVnet --name myAKSSubnet --query id -o tsv
```

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Replace `<subnetId>` with the ID obtained in the previous step, and then `<appId>` and `<password>` with the 

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --network-plugin azure \
    --service-cidr 10.0.2.0/24 \
    --dns-service-ip 10.0.2.10 \
    --docker-bridge-address 172.17.0.1/16 \
    --vnet-subnet-id <subnetId> \
    --service-principal <appId> \
    --client-secret <password>
```

After several minutes, the command completes and returns JSON-formatted information about the cluster.

## Enable the ACI connector

To enable the ACI connector, use the [az aks enable-addons][az-aks-enable-addons] command. The following example uses the subnet named *myACISubnet* created in a previous step. *Both* the Linux and Windows OS connectors are enabled.

```azurecli-interactive
az aks enable-addons \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --addons aci-connector \
    --os-type both \
    --subnet-name myACISubnet
```

## Connect to the cluster

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command. This step downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes. It can take a few minutes for the nodes to appear.

```console
kubectl get nodes
```

Output:

```
# Add output showing the VK node(s), I guess?
```

## Deploy a sample app

-- NEED SAMPLE APP TO DEPLOY THAT GENERATES STRESS TO BURST TO ACI --

## Remove ACI connector

If you no longer wish to use the ACI connector, you can disable the connector using the [az aks disable-addons][az aks disable-addons] command. The following example disables *both* the Linux and Windows OS connectors. To only disable one OS connector, instead specify the OS name:

```azurecli-interactive
az aks disable-addons -resource-group myResourceGroup --name myAKSCluster –-add-ons aci-connector --os-type both
```

## Next steps

The ACI connector is often one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

- [Use the Kubernetes horizontal pod autoscaler][aks-hpa]
- [Use the Kubernetes cluster autoscaler][aks-cluster-autoscaler]

<!-- LINKS - external -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-create
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-network-vnet-show]: /cli/azure/network/vnet#az-network-vnet-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-show
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks disable-addons]: cli/azure/aks#az-aks-disable-addons
[aks-hpa]: tutorial-kubernetes-scale.md
[aks-cluster-autoscaler]: autoscaler.md
