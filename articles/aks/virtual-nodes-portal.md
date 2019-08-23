---
title: Create virtual nodes using the portal in Azure Kubernetes Services (AKS)
description: Learn how to use the Azure portal to create an Azure Kubernetes Services (AKS) cluster that uses virtual nodes to run pods.
services: container-service
author: mlearned
ms.topic: conceptual
ms.service: container-service
ms.date: 05/06/2019
ms.author: mlearned
---

# Create and configure an Azure Kubernetes Services (AKS) cluster to use virtual nodes in the Azure portal

To quickly deploy workloads in an Azure Kubernetes Service (AKS) cluster, you can use virtual nodes. With virtual nodes, you have fast provisioning of pods, and only pay per second for their execution time. In a scaling scenario, you don't need to wait for the Kubernetes cluster autoscaler to deploy VM compute nodes to run the additional pods. Virtual nodes are only supported with Linux pods and nodes.

This article shows you how to create and configure the virtual network resources and an AKS cluster with virtual nodes enabled.

## Before you begin

Virtual nodes enable network communication between pods that run in ACI and the AKS cluster. To provide this communication, a virtual network subnet is created and delegated permissions are assigned. Virtual nodes only work with AKS clusters created using *advanced* networking. By default, AKS clusters are created with *basic* networking. This article shows you how to create a virtual network and subnets, then deploy an AKS cluster that uses advanced networking.

If you have not previously used ACI, register the service provider with your subscription. You can check the status of the ACI provider registration using the [az provider list][az-provider-list] command, as shown in the following example:

```azurecli-interactive
az provider list --query "[?contains(namespace,'Microsoft.ContainerInstance')]" -o table
```

The *Microsoft.ContainerInstance* provider should report as *Registered*, as shown in the following example output:

```
Namespace                    RegistrationState
---------------------------  -------------------
Microsoft.ContainerInstance  Registered
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
Virtual Nodes functionality is heavily dependent on ACI's feature set. The following scenarios are not yet supported with Virtual Nodes

* Using service principal to pull ACR images. [Workaround](https://github.com/virtual-kubelet/virtual-kubelet/blob/master/providers/azure/README.md#Private-registry) is to use [Kubernetes secrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line)
* [Virtual Network Limitations](../container-instances/container-instances-vnet.md) including VNet peering, Kubernetes network policies, and outbound traffic to the internet with network security groups.
* Init containers
* [Host aliases](https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/)
* [Arguments](../container-instances/container-instances-exec.md#restrictions) for exec in ACI
* [Daemonsets](concepts-clusters-workloads.md#statefulsets-and-daemonsets) will not deploy pods to the virtual node
* [Windows Server nodes (currently in preview in AKS)](windows-container-cli.md) are not supported alongside virtual nodes. You can use virtual nodes to schedule Windows Server containers without the need for Windows Server nodes in an AKS cluster.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create an AKS cluster

In the top left-hand corner of the Azure portal, select **Create a resource** > **Kubernetes Service**.

On the **Basics** page, configure the following options:

- *PROJECT DETAILS*: Select an Azure subscription, then select or create an Azure resource group, such as *myResourceGroup*. Enter a **Kubernetes cluster name**, such as *myAKSCluster*.
- *CLUSTER DETAILS*: Select a region, Kubernetes version, and DNS name prefix for the AKS cluster.
- *PRIMARY NODE POOL*: Select a VM size for the AKS nodes. The VM size **cannot** be changed once an AKS cluster has been deployed.
     - Select the number of nodes to deploy into the cluster. For this article, set **Node count** to *1*. Node count **can** be adjusted after the cluster has been deployed.

Click **Next: Scale**.

On the **Scale** page, select *Enabled* under **Virtual nodes**.

![Create AKS cluster and enable the virtual nodes](media/virtual-nodes-portal/enable-virtual-nodes.png)

By default, an Azure Active Directory service principal is created. This service principal is used for cluster communication and integration with other Azure services.

The cluster is also configured for advanced networking. The virtual nodes are configured to use their own Azure virtual network subnet. This subnet has delegated permissions to connect Azure resources between the AKS cluster. If you don't already have delegated subnet, the Azure portal creates and configures the Azure virtual network and subnet for use with the virtual nodes.

Select **Review + create**. After the validation is complete, select **Create**.

It takes a few minutes to create the AKS cluster and to be ready for use.

## Connect to the cluster

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. To manage a Kubernetes cluster, use [kubectl][kubectl], the Kubernetes command-line client. The `kubectl` client is pre-installed in the Azure Cloud Shell.

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

Use the [az aks get-credentials][az-aks-get-credentials] command to configure `kubectl` to connect to your Kubernetes cluster. The following example gets credentials for the cluster name *myAKSCluster* in the resource group named *myResourceGroup*:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single VM node created and then the virtual node for Linux, *virtual-node-aci-linux*:

```
$ kubectl get nodes

NAME                           STATUS    ROLES     AGE       VERSION
virtual-node-aci-linux         Ready     agent     28m       v1.11.2
aks-agentpool-14693408-0       Ready     agent     32m       v1.11.2
```

## Deploy a sample app

In the Azure Cloud Shell, create a file named `virtual-node.yaml` and copy in the following YAML. To schedule the container on the node, a [nodeSelector][node-selector] and [toleration][toleration] are defined. These settings allow the pod to be scheduled on the virtual node and confirm that the feature is successfully enabled.

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

```azurecli-interactive
kubectl apply -f virtual-node.yaml
```

Use the [kubectl get pods][kubectl-get] command with the `-o wide` argument to output a list of pods and the scheduled node. Notice that the `virtual-node-helloworld` pod has been scheduled on the `virtual-node-linux` node.

```
$ kubectl get pods -o wide

NAME                                     READY     STATUS    RESTARTS   AGE       IP           NODE
virtual-node-helloworld-9b55975f-bnmfl   1/1       Running   0          4m        10.241.0.4   virtual-node-aci-linux
```

The pod is assigned an internal IP address from the Azure virtual network subnet delegated for use with virtual nodes.

> [!NOTE]
> If you use images stored in Azure Container Registry, [configure and use a Kubernetes secret][acr-aks-secrets]. A current limitation of virtual nodes is that you can't use integrated Azure AD service principal authentication. If you don't use a secret, pods scheduled on virtual nodes fail to start and report the error `HTTP response status code 400 error code "InaccessibleImage"`.

## Test the virtual node pod

To test the pod running on the virtual node, browse to the demo application with a web client. As the pod is assigned an internal IP address, you can quickly test this connectivity from another pod on the AKS cluster. Create a test pod and attach a terminal session to it:

```azurecli-interactive
kubectl run -it --rm virtual-node-test --image=debian
```

Install `curl` in the pod using `apt-get`:

```azurecli-interactive
apt-get update && apt-get install -y curl
```

Now access the address of your pod using `curl`, such as *http://10.241.0.4*. Provide your own internal IP address shown in the previous `kubectl get pods` command:

```azurecli-interactive
curl -L http://10.241.0.4
```

The demo application is displayed, as shown in the following condensed example output:

```
$ curl -L 10.241.0.4

<html>
<head>
  <title>Welcome to Azure Container Instances!</title>
</head>
[...]
```

Close the terminal session to your test pod with `exit`. When your session is ended, the pod is the deleted.

## Next steps

In this article, a pod was scheduled on the virtual node and assigned a private, internal IP address. You could instead create a service deployment and route traffic to your pod through a load balancer or ingress controller. For more information, see [Create a basic ingress controller in AKS][aks-basic-ingress].

Virtual nodes are one component of a scaling solution in AKS. For more information on scaling solutions, see the following articles:

- [Use the Kubernetes horizontal pod autoscaler][aks-hpa]
- [Use the Kubernetes cluster autoscaler][aks-cluster-autoscaler]
- [Check out the Autoscale sample for Virtual Nodes][virtual-node-autoscale]
- [Read more about the Virtual Kubelet open source library][virtual-kubelet-repo]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[node-selector]:https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[toleration]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[azure-cni]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[aks-github]: https://github.com/azure/aks/issues]
[virtual-node-autoscale]: https://github.com/Azure-Samples/virtual-node-autoscale
[virtual-kubelet-repo]: https://github.com/virtual-kubelet/virtual-kubelet

<!-- LINKS - internal -->
[aks-network]: ./networking-overview.md
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[aks-hpa]: tutorial-kubernetes-scale.md
[aks-cluster-autoscaler]: cluster-autoscaler.md
[aks-basic-ingress]: ingress-basic.md
[acr-aks-secrets]: ../container-registry/container-registry-auth-aks.md#access-with-kubernetes-secret
[az-provider-list]: /cli/azure/provider#az-provider-list