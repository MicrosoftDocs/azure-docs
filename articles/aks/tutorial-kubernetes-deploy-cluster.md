---
title: Kubernetes on Azure tutorial - Deploy a cluster
description: In this Azure Kubernetes Service (AKS) tutorial, you create an AKS cluster and use kubectl to connect to the Kubernetes master node.
services: container-service
ms.topic: tutorial
ms.date: 02/25/2020

ms.custom: mvc

#Customer intent: As a developer or IT pro, I want to learn how to create an Azure Kubernetes Service (AKS) cluster so that I can deploy and run my own applications.
---

# Tutorial: Deploy an Azure Kubernetes Service (AKS) cluster

Kubernetes provides a distributed platform for containerized applications. With AKS, you can quickly create a production ready Kubernetes cluster. In this tutorial, part three of seven, a Kubernetes cluster is deployed in AKS. You learn how to:

> [!div class="checklist"]
> * Deploy a Kubernetes AKS cluster that can authenticate to an Azure container registry
> * Install the Kubernetes CLI (kubectl)
> * Configure kubectl to connect to your AKS cluster

In additional tutorials, the Azure Vote application is deployed to the cluster, scaled, and updated.

## Before you begin

In previous tutorials, a container image was created and uploaded to an Azure Container Registry instance. If you haven't done these steps, and would like to follow along, start at [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

This tutorial requires that you're running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a Kubernetes cluster

AKS clusters can use Kubernetes role-based access controls (RBAC). These controls let you define access to resources based on roles assigned to users. Permissions are combined if a user is assigned multiple roles, and permissions can be scoped to either a single namespace or across the whole cluster. By default, the Azure CLI automatically enables RBAC when you create an AKS cluster.

Create an AKS cluster using [az aks create][]. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup*. This resource group was created in the [previous tutorial][aks-tutorial-prepare-acr]. To allow an AKS cluster to interact with other Azure resources, an Azure Active Directory service principal is automatically created, since you did not specify one. Here, this service principal is [granted the right to pull images][container-registry-integration] from the Azure Container Registry (ACR) instance you created in the previous tutorial. Note that you can use a [managed identity](use-managed-identity.md) instead of a service principal for easier management.

```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --generate-ssh-keys \
    --attach-acr <acrName>
```

You can also manually configure a service principal to pull images from ACR. For more information, see [ACR authentication with service principals](../container-registry/container-registry-auth-service-principal.md) or [Authenticate from Kubernetes with a pull secret](../container-registry/container-registry-auth-kubernetes.md).

After a few minutes, the deployment completes, and returns JSON-formatted information about the AKS deployment.

> [!NOTE]
> To ensure your cluster to operate reliably, you should run at least 2 (two) nodes.

## Install the Kubernetes CLI

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [az aks install-cli][] command:

```azurecli
az aks install-cli
```

## Connect to cluster using kubectl

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][] command. The following example gets credentials for the AKS cluster named *myAKSCluster* in the *myResourceGroup*:

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, run the [kubectl get nodes][kubectl-get] command to return a list of the cluster nodes:

```
$ kubectl get nodes

NAME                       STATUS   ROLES   AGE   VERSION
aks-nodepool1-12345678-0   Ready    agent   32m   v1.14.8
```

## Next steps

In this tutorial, a Kubernetes cluster was deployed in AKS, and you configured `kubectl` to connect to it. You learned how to:

> [!div class="checklist"]
> * Deploy a Kubernetes AKS cluster that can authenticate to an Azure container registry
> * Install the Kubernetes CLI (kubectl)
> * Configure kubectl to connect to your AKS cluster

Advance to the next tutorial to learn how to deploy an application to the cluster.

> [!div class="nextstepaction"]
> [Deploy application in Kubernetes][aks-tutorial-deploy-app]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-tutorial-deploy-app]: ./tutorial-kubernetes-deploy-application.md
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az ad sp create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az acr show]: /cli/azure/acr#az-acr-show
[az role assignment create]: /cli/azure/role/assignment#az-role-assignment-create
[az aks create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[azure-cli-install]: /cli/azure/install-azure-cli
[container-registry-integration]: ./cluster-container-registry-integration.md
