---
title: Create virtual nodes in Azure Kubernetes Service (AKS) using Azure CLI
titleSuffix: Azure Kubernetes Service
description: Learn how to use Azure CLI to create an Azure Kubernetes Services (AKS) cluster that uses virtual nodes to run pods.
ms.topic: conceptual
ms.service: azure-kubernetes-service
ms.date: 08/28/2023
ms.custom: references_regions, devx-track-azurecli
---

# Create and configure an Azure Kubernetes Services (AKS) cluster to use virtual nodes using Azure CLI

Virtual nodes enable network communication between pods that run in Azure Container Instances (ACI) and AKS clusters. To provide this communication, you create a virtual network subnet and assign delegated permissions. Virtual nodes only work with AKS clusters created using *advanced* networking (Azure CNI). By default, AKS clusters are created with *basic* networking (kubenet). This article shows you how to create a virtual network and subnets, then deploy an AKS cluster that uses advanced networking.

This article shows you how to use the Azure CLI to create and configure virtual network resources and an AKS cluster enabled with virtual nodes.

## Before you begin

> [!IMPORTANT]
> Before using virtual nodes with AKS, review both the [limitations of AKS virtual nodes][virtual-nodes-aks] and the [virtual networking limitations of ACI][virtual-nodes-networking-aci]. These limitations affect the location, networking configuration, and other configuration details of both your AKS cluster and the virtual nodes.

* You need the ACI service provider registered with your subscription. You can check the status of the ACI provider registration using the [`az provider list`][az-provider-list] command.

    ```azurecli-interactive
    az provider list --query "[?contains(namespace,'Microsoft.ContainerInstance')]" -o table
    ```

    The *Microsoft.ContainerInstance* provider should report as *Registered*, as shown in the following example output:

    ```output
    Namespace                    RegistrationState    RegistrationPolicy
    ---------------------------  -------------------  --------------------
    Microsoft.ContainerInstance  Registered           RegistrationRequired
    ```

    If the provider shows as *NotRegistered*, register the provider using the [`az provider register`][az-provider-register].

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerInstance
    ```

* If using Azure CLI, this article requires Azure CLI version 2.0.49 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). You can also use [Azure Cloud Shell](#launch-azure-cloud-shell).

### Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell you can use to run the steps in this article. It has common Azure tools preinstalled and configured.

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.

* Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

## Create a virtual network

> [!IMPORTANT]
> Virtual node requires a custom virtual network and associated subnet. It can't be associated with the same virtual network as the AKS cluster.

1. Create a virtual network using the [`az network vnet create`][az-network-vnet-create] command. The following example creates a virtual network named *myVnet* with an address prefix of *10.0.0.0/8* and a subnet named *myAKSSubnet*. The address prefix of this subnet defaults to *10.240.0.0/16*.

    ```azurecli-interactive
    az network vnet create \
        --resource-group myResourceGroup \
        --name myVnet \
        --address-prefixes 10.0.0.0/8 \
        --subnet-name myAKSSubnet \
        --subnet-prefix 10.240.0.0/16
    ```

2. Create an extra subnet for the virtual nodes using the [`az network vnet subnet create`][az-network-vnet-subnet-create] command. The following example creates a subnet named *myVirtualNodeSubnet* with an address prefix of *10.241.0.0/16*.

    ```azurecli-interactive
    az network vnet subnet create \
        --resource-group myResourceGroup \
        --vnet-name myVnet \
        --name myVirtualNodeSubnet \
        --address-prefixes 10.241.0.0/16
    ```

## Create an AKS cluster with managed identity

1. Get the subnet ID using the [`az network vnet subnet show`][az-network-vnet-subnet-show] command.

    ```azurecli-interactive
    az network vnet subnet show --resource-group myResourceGroup --vnet-name myVnet --name myAKSSubnet --query id -o tsv
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command and replace `<subnetId>` with the ID obtained in the previous step. The following example creates a cluster named *myAKSCluster* with five nodes.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --node-count 5 \
        --network-plugin azure \
        --vnet-subnet-id <subnetId>
    ```

    After several minutes, the command completes and returns JSON-formatted information about the cluster.

For more information on managed identities, see [Use managed identities](use-managed-identity.md).

## Enable the virtual nodes addon

* Enable virtual nodes using the [`az aks enable-addons`][az-aks-enable-addons] command. The following example uses the subnet named *myVirtualNodeSubnet* created in a previous step.

    ```azurecli-interactive
    az aks enable-addons \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --addons virtual-node \
        --subnet-name myVirtualNodeSubnet
    ```

## Connect to the cluster

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. This step downloads credentials and configures the Kubernetes CLI to use them.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

2. Verify the connection to your cluster using the [`kubectl get`][kubectl-get] command, which returns a list of the cluster nodes.

    ```console
    kubectl get nodes
    ```

    The following example output shows the single VM node created and the virtual node for Linux, *virtual-node-aci-linux*:

    ```output
    NAME                          STATUS    ROLES     AGE       VERSION
    virtual-node-aci-linux        Ready     agent     28m       v1.11.2
    aks-agentpool-14693408-0      Ready     agent     32m       v1.11.2
    ```

## Deploy a sample app

1. Create a file named `virtual-node.yaml` and copy in the following YAML. The YAML schedules the container on the node by defining a [nodeSelector][node-selector] and [toleration][toleration].

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
            image: mcr.microsoft.com/azuredocs/aci-helloworld
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

2. Run the application using the [`kubectl apply`][kubectl-apply] command.

    ```console
    kubectl apply -f virtual-node.yaml
    ```

3. Get a list of pods and the scheduled node using the [`kubectl get pods`][kubectl-get] command with the `-o wide` argument.

    ```console
    kubectl get pods -o wide
    ```

    The pod is scheduled on the virtual node *virtual-node-aci-linux*, as shown in the following example output:

    ```output
    NAME                            READY     STATUS    RESTARTS   AGE       IP           NODE
    aci-helloworld-9b55975f-bnmfl   1/1       Running   0          4m        10.241.0.4   virtual-node-aci-linux
    ```

    The pod is assigned an internal IP address from the Azure virtual network subnet delegated for use with virtual nodes.

> [!NOTE]
> If you use images stored in Azure Container Registry, [configure and use a Kubernetes secret][acr-aks-secrets]. A current limitation of virtual nodes is you can't use integrated Microsoft Entra service principal authentication. If you don't use a secret, pods scheduled on virtual nodes fail to start and report the error `HTTP response status code 400 error code "InaccessibleImage"`.

## Test the virtual node pod

1. Test the pod running on the virtual node by browsing to the demo application with a web client. As the pod is assigned an internal IP address, you can quickly test this connectivity from another pod on the AKS cluster.
2. Create a test pod and attach a terminal session to it using the following `kubectl run -it` command.

    ```console
    kubectl run -it --rm testvk --image=mcr.microsoft.com/dotnet/runtime-deps:6.0
    ```

3. Install `curl` in the pod using `apt-get`.

    ```console
    apt-get update && apt-get install -y curl
    ```

4. Access the address of your pod using `curl`, such as *http://10.241.0.4*. Provide your own internal IP address shown in the previous `kubectl get pods` command.

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

5. Close the terminal session to your test pod with `exit`. When your session is ends, the pod is deleted.

## Remove virtual nodes

1. Delete the `aci-helloworld` pod running on the virtual node using the `kubectl delete` command.

    ```console
    kubectl delete -f virtual-node.yaml
    ```

2. Disable the virtual nodes using the [`az aks disable-addons`][az aks disable-addons] command.

    ```azurecli-interactive
    az aks disable-addons --resource-group myResourceGroup --name myAKSCluster --addons virtual-node
    ```

3. Remove the virtual network resources and resource group using the following commands.

    ```azurecli-interactive
    # Change the name of your resource group, cluster and network resources as needed
    RES_GROUP=myResourceGroup
    AKS_CLUSTER=myAKScluster
    AKS_VNET=myVnet
    AKS_SUBNET=myVirtualNodeSubnet

    # Get AKS node resource group
    NODE_RES_GROUP=$(az aks show --resource-group $RES_GROUP --name $AKS_CLUSTER --query nodeResourceGroup --output tsv)

    # Get network profile ID
    NETWORK_PROFILE_ID=$(az network profile list --resource-group $NODE_RES_GROUP --query "[0].id" --output tsv)

    # Delete the network profile
    az network profile delete --id $NETWORK_PROFILE_ID -y

    # Grab the service association link ID
    SAL_ID=$(az network vnet subnet show --resource-group $RES_GROUP --vnet-name $AKS_VNET --name $AKS_SUBNET --query id --output tsv)/providers/Microsoft.ContainerInstance/serviceAssociationLinks/default

    # Delete the service association link for the subnet
    az resource delete --ids $SAL_ID --api-version 2021-10-01

    # Delete the subnet delegation to Azure Container Instances
    az network vnet subnet update --resource-group $RES_GROUP --vnet-name $AKS_VNET --name $AKS_SUBNET --remove delegations
    ```

## Next steps

In this article, you scheduled a pod on the virtual node and assigned a private internal IP address. You could instead create a service deployment and route traffic to your pod through a load balancer or ingress controller. For more information, see [Create a basic ingress controller in AKS][aks-basic-ingress].

Virtual nodes are often one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

* [Use the Kubernetes horizontal pod autoscaler][aks-hpa]
* [Use the Kubernetes cluster autoscaler][aks-cluster-autoscaler]
* [Check out the Autoscale sample for Virtual Nodes][virtual-node-autoscale]
* [Read more about the Virtual Kubelet open source library][virtual-kubelet-repo]

<!-- LINKS - external -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[node-selector]:https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[toleration]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[virtual-node-autoscale]: https://github.com/Azure-Samples/virtual-node-autoscale
[virtual-kubelet-repo]: https://github.com/virtual-kubelet/virtual-kubelet
[acr-aks-secrets]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az_group_create
[az-network-vnet-create]: /cli/azure/network/vnet#az_network_vnet_create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_show
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az aks disable-addons]: /cli/azure/aks#az_aks_disable_addons
[aks-hpa]: tutorial-kubernetes-scale.md
[aks-cluster-autoscaler]: ./cluster-autoscaler.md
[aks-basic-ingress]: ingress-basic.md
[az-provider-list]: /cli/azure/provider#az_provider_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[virtual-nodes-aks]: virtual-nodes.md
[virtual-nodes-networking-aci]: ../container-instances/container-instances-virtual-network-concepts.md
