---
title: Kubernetes on Azure tutorial  - Deploy Cluster
description: AKS tutorial - Deploy Cluster
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: tutorial
ms.date: 02/24/2018
ms.author: nepeters
ms.custom: mvc
---

# Tutorial: Deploy an Azure Container Service (AKS) cluster

Kubernetes provides a distributed platform for containerized applications. With AKS, provisioning of a production ready Kubernetes cluster is simple and quick. In this tutorial, part three of eight, a Kubernetes cluster is deployed in AKS. Steps completed include:

> [!div class="checklist"]
> * Deploying a Kubernetes AKS cluster
> * Installation of the Kubernetes CLI (kubectl)
> * Configuration of kubectl

In subsequent tutorials, the Azure Vote application is deployed to the cluster, scaled, updated, and Log Analytics is configured to monitor the Kubernetes cluster.

## Before you begin

In previous tutorials, a container image was created and uploaded to an Azure Container Registry instance. If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

## Enable AKS preview

While AKS is in preview, creating new clusters requires a feature flag on your subscription. You may request this feature for any number of subscriptions that you would like to use. Use the `az provider register` command to register the AKS provider:

```azurecli
az provider register -n Microsoft.ContainerService
```

After registering, you are now ready to create a Kubernetes cluster with AKS.

## Create Kubernetes cluster

The following example creates a cluster named `myAKSCluster` in a Resource Group named `myResourceGroup`. This Resource Group was created in the [previous tutorial][aks-tutorial-prepare-acr].

```azurecli
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 1 --generate-ssh-keys
```

After several minutes, the deployment completes, and returns json formatted information about the AKS deployment.

## Install the kubectl CLI

To connect to the Kubernetes cluster from your client computer, use [kubectl][kubectl], the Kubernetes command-line client.

If you're using Azure CloudShell, kubectl is already installed. If you want to install it locally, run the following command:

```azurecli
az aks install-cli
```

## Connect with kubectl

To configure kubectl to connect to your Kubernetes cluster, run the following command:

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, run the [kubectl get nodes][kubectl-get] command.

```azurecli
kubectl get nodes
```

Output:

```
NAME                          STATUS    AGE       VERSION
k8s-myAKSCluster-36346190-0   Ready     49m       v1.7.9
```

At tutorial completion, you have an AKS cluster ready for workloads. In subsequent tutorials, a multi-container application is deployed to this cluster, scaled out, updated, and monitored.

## Configure ACR authentication

Authentication needs to be configured between the AKS cluster and the ACR registry. This involves granting the AKS identity the proper rights to pull images from the ACR registry.

First, get the ID of the service principal configured for AKS. Update the resource group name and AKS cluster name to match your environment.

```azurecli
CLIENT_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query "servicePrincipalProfile.clientId" --output tsv)
```

Get the ACR registry resource id. Update the regsitry name to that of your ACR registry and the resource group to the resource group where the ACR registry is located.

```azurecli
ACR_ID=$(az acr show --name <acrName> --resource-group myResourceGroup --query "id" --output tsv)
```

Create the role assignment, which grants the proper access.

```azurecli
az role assignment create --assignee $CLIENT_ID --role Reader --scope $ACR_ID
```

## Next steps

In this tutorial, a Kubernetes cluster was deployed in AKS. The following steps were completed:

> [!div class="checklist"]
> * Deployed a Kubernetes AKS cluster
> * Installed the Kubernetes CLI (kubectl)
> * Configured kubectl

Advance to the next tutorial to learn about running application on the cluster.

> [!div class="nextstepaction"]
> [Deploy application in Kubernetes][aks-tutorial-deploy-app]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-tutorial-deploy-app]: ./tutorial-kubernetes-deploy-application.md
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
