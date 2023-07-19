---
title: Create virtual nodes in Azure Kubernetes Service (AKS) using the Azure portal
description: Learn how to use the Azure portal to create an Azure Kubernetes Services (AKS) cluster that uses virtual nodes to run pods.
ms.topic: conceptual
ms.date: 05/09/2023
ms.custom: references_regions
---

# Create and configure an Azure Kubernetes Services (AKS) cluster to use virtual nodes in the Azure portal

Virtual nodes enable network communication between pods that run in Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) clusters. To provide this communication, a virtual network subnet is created and delegated permissions are assigned. Virtual nodes only work with AKS clusters created using *advanced* networking (Azure CNI). AKS clusters are created with *basic* networking (kubenet) by default.

This article shows you how to create a virtual network and subnets, and then deploy an AKS cluster that uses advanced networking using the Azure portal.

> [!NOTE]
> For an overview of virtual node region availability and limitations, see [Use virtual nodes in AKS](virtual-nodes.md).

## Before you begin

You need the ACI service provider registered on your subscription.

* Check the status of the ACI provider registration using the [`az provider list`][az-provider-list] command.

    ```azurecli-interactive
    az provider list --query "[?contains(namespace,'Microsoft.ContainerInstance')]" -o table
    ```

    The following example output shows the *Microsoft.ContainerInstance* provider is *Registered*:

    ```output
    Namespace                    RegistrationState    RegistrationPolicy
    ---------------------------  -------------------  --------------------
    Microsoft.ContainerInstance  Registered           RegistrationRequired
    ```

* If the provider is *NotRegistered*, register it using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerInstance
    ```

## Create an AKS cluster

1. Navigate to the Azure portal home page.
2. Select **Create a resource** > **Containers**.
3. On the **Azure Kubernetes Service (AKS)** resource, select **Create**.
4. On the **Basics** page, configure the following options:
   * *Project details*: Select an Azure subscription, then select or create an Azure resource group, such as *myResourceGroup*.
   * *Cluster details*: Enter a **Kubernetes cluster name**, such as *myAKSCluster*. Select a region and Kubernetes version for the AKS cluster.
5. Select **Next: Node pools** and check **Enable virtual nodes*.
    :::image type="content" source="media/virtual-nodes-portal/enable-virtual-nodes.png" alt-text="Screenshot that shows creating a cluster with virtual nodes enabled on the Azure portal. The option 'Enable virtual nodes' is highlighted.":::
6. Select **Review + create**.
7. After the validation completes, select **Create**.

By default, this process creates a managed cluster identity, which is used for cluster communication and integration with other Azure services. For more information, see [Use managed identities](use-managed-identity.md). You can also use a service principal as your cluster identity.

This process configures the cluster for advanced networking and the virtual nodes to use their own Azure virtual network subnet. The subnet has delegated permissions to connect Azure resources between the AKS cluster. If you don't already have a delegated subnet, the Azure portal creates and configures an Azure virtual network and subnet with the virtual nodes.

## Connect to the cluster

The Azure Cloud Shell is a free interactive shell you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. To manage a Kubernetes cluster, use [kubectl][kubectl], the Kubernetes command-line client. The `kubectl` client is pre-installed in the Azure Cloud Shell.

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. The following example gets credentials for the cluster name *myAKSCluster* in the resource group named *myResourceGroup*:

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

2. Verify the connection to your cluster using the [`kubectl get nodes`][kubectl-get].

    ```azurecli-interactive
    kubectl get nodes
    ```

    The following example output shows the single VM node created and the virtual Linux node named *virtual-node-aci-linux*:

    ```output
    NAME                           STATUS    ROLES     AGE       VERSION
    virtual-node-aci-linux         Ready     agent     28m       v1.11.2
    aks-agentpool-14693408-0       Ready     agent     32m       v1.11.2
    ```

## Deploy a sample app

1. In the Azure Cloud Shell, create a file named `virtual-node.yaml` and copy in the following YAML:

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
    ```

    The YAML defines a [nodeSelector][node-selector] and [toleration][toleration], which allows the pod to be scheduled on the virtual node. The pod is assigned an internal IP address from the Azure virtual network subnet delegated for use with virtual nodes.

2. Run the application using the [`kubectl apply`][kubectl-apply] command.

    ```azurecli-interactive
    kubectl apply -f virtual-node.yaml
    ```

3. View the pods scheduled on the node using the [`kubectl get pods`][kubectl-get] command with the `-o wide` argument.

    ```azurecli-interactive
    kubectl get pods -o wide
    ```

    The following example output shows the `virtual-node-helloworld` pod scheduled on the `virtual-node-linux` node.

    ```output
    NAME                                     READY     STATUS    RESTARTS   AGE       IP           NODE
    virtual-node-helloworld-9b55975f-bnmfl   1/1       Running   0          4m        10.241.0.4   virtual-node-aci-linux
    ```

> [!NOTE]
> If you use images stored in Azure Container Registry, [configure and use a Kubernetes secret][acr-aks-secrets]. A limitation of virtual nodes is you can't use integrated Azure AD service principal authentication. If you don't use a secret, pods scheduled on virtual nodes fail to start and report the error `HTTP response status code 400 error code "InaccessibleImage"`.

## Test the virtual node pod

To test the pod running on the virtual node, browse to the demo application with a web client. The pod is assigned an internal IP address, so you can easily test the connectivity from another pod on the AKS cluster.

1. Create a test pod and attach a terminal session to it using the following `kubectl run` command.

    ```console
    kubectl run -it --rm virtual-node-test --image=mcr.microsoft.com/dotnet/runtime-deps:6.0
    ```

2. Install `curl` in the pod using the following `apt-get` command.

    ```console
    apt-get update && apt-get install -y curl
    ```

3. Access the address of your pod using the following `curl` command and provide your internal IP address.

    ```console
    curl -L http://10.241.0.4
    ```

    The following condensed example output shows the demo application.

    ```output
    <html>
    <head>
      <title>Welcome to Azure Container Instances!</title>
    </head>
    [...]
    ```

4. Close the terminal session to your test pod with `exit`, which also deletes the pod.

    ```console
    exit
    ```

## Next steps

In this article, you scheduled a pod on the virtual node and assigned a private, internal IP address. If you want, you can instead create a service deployment and route traffic to your pod through a load balancer or ingress controller. For more information, see [Create a basic ingress controller in AKS][aks-basic-ingress].

Virtual nodes are one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

* [Use the Kubernetes horizontal pod autoscaler][aks-hpa]
* [Use the Kubernetes cluster autoscaler][aks-cluster-autoscaler]
* [Autoscale for virtual nodes][virtual-node-autoscale]
* [Virtual Kubelet open source library][virtual-kubelet-repo]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[node-selector]:https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[toleration]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[virtual-node-autoscale]: https://github.com/Azure-Samples/virtual-node-autoscale
[virtual-kubelet-repo]: https://github.com/virtual-kubelet/virtual-kubelet
[acr-aks-secrets]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/

<!-- LINKS - internal -->
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[aks-hpa]: tutorial-kubernetes-scale.md
[aks-cluster-autoscaler]: cluster-autoscaler.md
[aks-basic-ingress]: ingress-basic.md
[az-provider-list]: /cli/azure/provider#az_provider_list
[az-provider-register]: /cli/azure/provider#az_provider_register
