---
title: Create an AKS cluster configured with virtual nodes using the Azure CLI
description: Learn how to use the Azure CLI to create an Azure Kubernetes Services (AKS) cluster that uses virtual nodes to run pods.
services: container-service
author: iainfoulds

ms.service: container-service
ms.date: 09/24/2018
ms.author: iainfou
---

# Create and configure an Azure Kubernetes Services (AKS) cluster to use virtual nodes using the Azure CLI

To rapidly scale application workloads in an Azure Kubernetes Service (AKS) cluster, you can use virtual nodes. With virtual nodes, you have quick provisioning of pods, and only pay per second for their execution time. You don't need to wait for Kubernetes cluster autoscaler to deploy VM compute nodes to run the additional pods. This article shows you how to create and configure the virtual network resources and AKS cluster, then enable virtual nodes.

> [!IMPORTANT]
> Virtual nodes for AKS are currently in **private preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

## Before you begin

Virtual nodes enable network communication between pods that run in ACI and the AKS cluster. To provide this communication, a virtual network subnet is created and delegated permissions are assigned. Virtual nodes only work with AKS clusters created using *advanced* networking. By default, AKS clusters are created with *basic* networking. This article shows you how to create a virtual network and subnets, then deploy an AKS cluster that uses advanced networking.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.46 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. Create a resource group with the [az group create][az-group-create] command. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a virtual network

Create a virtual network using the [az network vnet create][az-network-vnet-create] command. The following example creates a virtual network name *myVnet* with an address prefix of *10.0.0.0/8*, and a subnet named *myAKSSubnet*. The address prefix of this subnet defaults to *10.240.0.0/16*:

```azurecli-interactive
az network vnet create \
    --resource-group myResourceGroup \
    --name myVnet \
    --address-prefixes 10.8.0.0/8 \
    --subnet-name myAKSSubnet \
    --subnet-prefix 10.240.0.0/16
```

Now create an additional subnet for virtual nodes using the [az network vnet subnet create][az-network-vnet-subnet-create] command. The following example creates a subnet named *myVirtualNodeSubnet* with the address prefix of *10.241.0.0/16*.

```azurecli-interactive
az network vnet subnet create \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name myVirtualNodeSubnet \
    --address-prefix 10.241.0.0/16
```

## Create a service principal

To allow an AKS cluster to interact with other Azure resources, an Azure Active Directory service principal is used. This service principal can be automatically created by the Azure CLI or portal, or you can pre-create one and assign additional permissions.

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
    --service-cidr 10.0.0.0/16 \
    --dns-service-ip 10.0.0.10 \
    --docker-bridge-address 172.17.0.1/16 \
    --vnet-subnet-id <subnetId> \
    --service-principal <appId> \
    --client-secret <password>
```

After several minutes, the command completes and returns JSON-formatted information about the cluster.

## Enable virtual nodes

To provide additional functionality, the virtual nodes connector uses an Azure CLI extension. Before you can enable the virtual nodes connector, first install the extension using the [az extension add][az-extension-add] command:

```azurecli-interactive
az extension add --name aks-virtual-nodes
```

To enable virtual nodes, now use the [az aks enable-addons][az-aks-enable-addons] command. The following example uses the subnet named *myVirtualNodeSubnet* created in a previous step:

```azurecli-interactive
az aks enable-addons \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --addons virtual-node \
    --subnet-name myVirtualNodeSubnet
```

## Connect to the cluster

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command. This step downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes.

```console
kubectl get nodes
```

The following example output shows the single VM node created and then the virtual node for Linux, *virtual-node-aci-linux*:

```
$ kubectl get nodes

NAME                          STATUS    ROLES     AGE       VERSION
virtual-node-aci-linux        Ready     agent     28m       v1.11.2
aks-agentpool-14693408-0      Ready     agent     32m       v1.11.2
```

## Deploy a sample app

Create a file named `virtual-node.yaml` and copy in the following YAML. To schedule the container on the node, a [nodeSelector][node-selector] and [toleration][toleration] are defined.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: aci-helloworld
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: aci-helloworld
    spec:
      containers:
      - name: aci-helloworld
        image: microsoft/aci-helloworld
        ports:
        - containerPort: 80
      nodeSelector:
        kubernetes.io/hostname: virtual-node-aci-linux
      tolerations:
      - key: virtual-kubelet.io/provider
        operator: Equal
        value: azure
        effect: NoSchedule
```

Run the application with the [kubectl create][kubectl-create] command.

```console
kubectl apply -f virtual-node.yaml
```

Use the [kubectl get pods][kubectl-get] command with the `-o wide` argument to output a list of pods and the scheduled node. Notice that the `aci-helloworld` pod has been scheduled on the `virtual-node-aci-linux` node.

```
$ kubectl get pods -o wide

NAME                            READY     STATUS    RESTARTS   AGE       IP           NODE
aci-helloworld-9b55975f-bnmfl   1/1       Running   0          4m        10.241.0.4   virtual-node-aci-linux
```

The pod is assigned an internal IP address from the Azure virtual network subnet delegated for use with virtual nodes.

## Test the virtual node pod

To test the pod running on the virtual node, browse to the demo application with a web client. As the pod is assigned an internal IP address, you can quickly test this connectivity from another pod on the AKS cluster. Create a test pod and attach a terminal session to it:

```console
kubectl run -it --rm virtual-node-test --image=debian
```

Install `curl` in the pod using `apt-get`:

```console
apt-get update && apt-get install -y curl
```

Now access the address of your pod using `curl`, such as *http://10.241.0.4*. Provide your own internal IP address shown in the previous `kubectl get pods` command:

```console
curl -L http://10.241.0.4
```

The demo application is displayed, as shown in the following condensed example output:

```
$ curl -L 10.240.0.42

<html>
<head>
  <title>Welcome to Azure Container Instances!</title>
</head>
[...]
```

Close the terminal session to your test pod with `exit`. When your session is ended, the pod is the deleted.

## Remove virtual nodes

If you no longer wish to use virtual nodes, you can disable them using the [az aks disable-addons][az aks disable-addons] command. The following example disables *both* the Linux and Windows virtual nodes. To only disable one OS virtual node, instead specify the OS name:

```azurecli-interactive
az aks disable-addons -resource-group myResourceGroup --name myAKSCluster –-add-ons virtual-nodes --os-type both
```

## Next steps

In this article, a pod was scheduled on the virtual node and assigned a private, internal IP address. You could instead create a service deployment and route traffic to your pod through a load balancer or ingress controller. For more information, see [Create a basic ingress controller in AKS][aks-basic-ingress].

Virtual nodes are often one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

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
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks disable-addons]: /cli/azure/aks#az-aks-disable-addons
[aks-hpa]: tutorial-kubernetes-scale.md
[aks-cluster-autoscaler]: autoscaler.md
[aks-basic-ingress]: ingress-basic.md
