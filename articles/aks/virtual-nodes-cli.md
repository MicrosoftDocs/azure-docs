---
title: Create virtual nodes using Azure CLI
titleSuffix: Azure Kubernetes Service
description: Learn how to use the Azure CLI to create an Azure Kubernetes Services (AKS) cluster that uses virtual nodes to run pods.
services: container-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.custom: references_regions
---

# Create and configure an Azure Kubernetes Services (AKS) cluster to use virtual nodes using the Azure CLI

To rapidly scale application workloads in an Azure Kubernetes Service (AKS) cluster, you can use virtual nodes. With virtual nodes, you have quick provisioning of pods, and only pay per second for their execution time. You don't need to wait for Kubernetes cluster autoscaler to deploy VM compute nodes to run the additional pods. Virtual nodes are only supported with Linux pods and nodes.

This article shows you how to create and configure the virtual network resources and AKS cluster, then enable virtual nodes.

## Before you begin

Virtual nodes enable network communication between pods that run in Azure Container Instances (ACI) and the AKS cluster. To provide this communication, a virtual network subnet is created and delegated permissions are assigned. Virtual nodes only work with AKS clusters created using *advanced* networking. By default, AKS clusters are created with *basic* networking. This article shows you how to create a virtual network and subnets, then deploy an AKS cluster that uses advanced networking.

If you have not previously used ACI, register the service provider with your subscription. You can check the status of the ACI provider registration using the [az provider list][az-provider-list] command, as shown in the following example:

```azurecli-interactive
az provider list --query "[?contains(namespace,'Microsoft.ContainerInstance')]" -o table
```

The *Microsoft.ContainerInstance* provider should report as *Registered*, as shown in the following example output:

```output
Namespace                    RegistrationState    RegistrationPolicy
---------------------------  -------------------  --------------------
Microsoft.ContainerInstance  Registered           RegistrationRequired
```

If the provider shows as *NotRegistered*, register the provider using the [az provider register][az-provider-register] as shown in the following example:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerInstance
```

## Regional availability

The following regions are supported for virtual node deployments:

* Australia East (australiaeast)
* Central US (centralus)
* East US (eastus)
* East US 2 (eastus2)
* Japan East (japaneast)
* North Europe (northeurope)
* Southeast Asia (southeastasia)
* West Central US (westcentralus)
* West Europe (westeurope)
* West US (westus)
* West US 2 (westus2)

## Known limitations
Virtual Nodes functionality is heavily dependent on ACI's feature set. In addition to the [quotas and limits for Azure Container Instances](../container-instances/container-instances-quotas.md), the following scenarios are not yet supported with Virtual Nodes:

* Using service principal to pull ACR images. [Workaround](https://github.com/virtual-kubelet/azure-aci/blob/master/README.md#private-registry) is to use [Kubernetes secrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line)
* [Virtual Network Limitations](../container-instances/container-instances-vnet.md) including VNet peering, Kubernetes network policies, and outbound traffic to the internet with network security groups.
* Init containers
* [Host aliases](https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/)
* [Arguments](../container-instances/container-instances-exec.md#restrictions) for exec in ACI
* [DaemonSets](concepts-clusters-workloads.md#statefulsets-and-daemonsets) will not deploy pods to the virtual node
* Virtual nodes support scheduling Linux pods. You can manually install the open source [Virtual Kubelet ACI](https://github.com/virtual-kubelet/azure-aci) provider to schedule Windows Server containers to ACI.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you prefer to install and use the CLI locally, this article requires Azure CLI version 2.0.49 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. Create a resource group with the [az group create][az-group-create] command. The following example creates a resource group named *myResourceGroup* in the *westus* location.

```azurecli-interactive
az group create --name myResourceGroup --location westus
```

## Create a virtual network

Create a virtual network using the [az network vnet create][az-network-vnet-create] command. The following example creates a virtual network name *myVnet* with an address prefix of *10.0.0.0/8*, and a subnet named *myAKSSubnet*. The address prefix of this subnet defaults to *10.240.0.0/16*:

```azurecli-interactive
az network vnet create \
    --resource-group myResourceGroup \
    --name myVnet \
    --address-prefixes 10.0.0.0/8 \
    --subnet-name myAKSSubnet \
    --subnet-prefix 10.240.0.0/16
```

Now create an additional subnet for virtual nodes using the [az network vnet subnet create][az-network-vnet-subnet-create] command. The following example creates a subnet named *myVirtualNodeSubnet* with the address prefix of *10.241.0.0/16*.

```azurecli-interactive
az network vnet subnet create \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name myVirtualNodeSubnet \
    --address-prefixes 10.241.0.0/16
```

## Create a service principal or use a managed identity

To allow an AKS cluster to interact with other Azure resources, an Azure Active Directory service principal is used. This service principal can be automatically created by the Azure CLI or portal, or you can pre-create one and assign additional permissions. Alternatively, you can use a managed identity for permissions instead of a service principal. For more information, see [Use managed identities](use-managed-identity.md).

Create a service principal using the [az ad sp create-for-rbac][az-ad-sp-create-for-rbac] command. The `--skip-assignment` parameter limits any additional permissions from being assigned.

```azurecli-interactive
az ad sp create-for-rbac --skip-assignment
```

The output is similar to the following example:

```output
{
  "appId": "bef76eb3-d743-4a97-9534-03e9388811fc",
  "displayName": "azure-cli-2018-11-21-18-42-00",
  "name": "http://azure-cli-2018-11-21-18-42-00",
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

Use the [az aks create][az-aks-create] command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. Replace `<subnetId>` with the ID obtained in the previous step, and then `<appId>` and `<password>` with the values gathered in the previous section.

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

## Enable virtual nodes addon

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

```output
NAME                          STATUS    ROLES     AGE       VERSION
virtual-node-aci-linux        Ready     agent     28m       v1.11.2
aks-agentpool-14693408-0      Ready     agent     32m       v1.11.2
```

## Deploy a sample app

Create a file named `virtual-node.yaml` and copy in the following YAML. To schedule the container on the node, a [nodeSelector][node-selector] and [toleration][toleration] are defined.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aci-helloworld
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aci-helloworld
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
        kubernetes.io/role: agent
        beta.kubernetes.io/os: linux
        type: virtual-kubelet
      tolerations:
      - key: virtual-kubelet.io/provider
        operator: Exists
      - key: azure.com/aci
        effect: NoSchedule
```

Run the application with the [kubectl apply][kubectl-apply] command.

```console
kubectl apply -f virtual-node.yaml
```

Use the [kubectl get pods][kubectl-get] command with the `-o wide` argument to output a list of pods and the scheduled node. Notice that the `aci-helloworld` pod has been scheduled on the `virtual-node-aci-linux` node.

```console
kubectl get pods -o wide
```

```output
NAME                            READY     STATUS    RESTARTS   AGE       IP           NODE
aci-helloworld-9b55975f-bnmfl   1/1       Running   0          4m        10.241.0.4   virtual-node-aci-linux
```

The pod is assigned an internal IP address from the Azure virtual network subnet delegated for use with virtual nodes.

> [!NOTE]
> If you use images stored in Azure Container Registry, [configure and use a Kubernetes secret][acr-aks-secrets]. A current limitation of virtual nodes is that you can't use integrated Azure AD service principal authentication. If you don't use a secret, pods scheduled on virtual nodes fail to start and report the error `HTTP response status code 400 error code "InaccessibleImage"`.

## Test the virtual node pod

To test the pod running on the virtual node, browse to the demo application with a web client. As the pod is assigned an internal IP address, you can quickly test this connectivity from another pod on the AKS cluster. Create a test pod and attach a terminal session to it:

```console
kubectl run --generator=run-pod/v1 -it --rm testvk --image=debian
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

```output
<html>
<head>
  <title>Welcome to Azure Container Instances!</title>
</head>
[...]
```

Close the terminal session to your test pod with `exit`. When your session is ended, the pod is the deleted.

## Remove virtual nodes

If you no longer wish to use virtual nodes, you can disable them using the [az aks disable-addons][az aks disable-addons] command. 

If necessary, go to [https://shell.azure.com](https://shell.azure.com) to open Azure Cloud Shell in your browser.

First, delete the `aci-helloworld` pod running on the virtual node:

```console
kubectl delete -f virtual-node.yaml
```

The following example command disables the Linux virtual nodes:

```azurecli-interactive
az aks disable-addons --resource-group myResourceGroup --name myAKSCluster --addons virtual-node
```

Now, remove the virtual network resources and resource group:

```azurecli-interactive
# Change the name of your resource group, cluster and network resources as needed
RES_GROUP=myResourceGroup
AKS_CLUSTER=myAKScluster
AKS_VNET=myVnet
AKS_SUBNET=myVirtualNodeSubnet

# Get AKS node resource group
NODE_RES_GROUP=$(az aks show --resource-group $RES_GROUP --name $AKS_CLUSTER --query nodeResourceGroup --output tsv)

# Get network profile ID
NETWORK_PROFILE_ID=$(az network profile list --resource-group $NODE_RES_GROUP --query [0].id --output tsv)

# Delete the network profile
az network profile delete --id $NETWORK_PROFILE_ID -y

# Delete the subnet delegation to Azure Container Instances
az network vnet subnet update --resource-group $RES_GROUP --vnet-name $AKS_VNET --name $AKS_SUBNET --remove delegations 0
```

## Next steps

In this article, a pod was scheduled on the virtual node and assigned a private, internal IP address. You could instead create a service deployment and route traffic to your pod through a load balancer or ingress controller. For more information, see [Create a basic ingress controller in AKS][aks-basic-ingress].

Virtual nodes are often one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

- [Use the Kubernetes horizontal pod autoscaler][aks-hpa]
- [Use the Kubernetes cluster autoscaler][aks-cluster-autoscaler]
- [Check out the Autoscale sample for Virtual Nodes][virtual-node-autoscale]
- [Read more about the Virtual Kubelet open source library][virtual-kubelet-repo]

<!-- LINKS - external -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[node-selector]:https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[toleration]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[aks-github]: https://github.com/azure/aks/issues
[virtual-node-autoscale]: https://github.com/Azure-Samples/virtual-node-autoscale
[virtual-kubelet-repo]: https://github.com/virtual-kubelet/virtual-kubelet
[acr-aks-secrets]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/

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
[az-provider-list]: /cli/azure/provider#az-provider-list
[az-provider-register]: /cli/azure/provider#az-provider-register
