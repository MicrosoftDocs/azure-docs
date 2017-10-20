---
title: Kubernertes on Azure tutorial  - Deploy Cluster | Microsoft Docs
description: AKS tutorial - Deploy Cluster
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/14/2017
ms.author: nepeters
ms.custom: mvc
---

# Deploy an Azure Container Service (AKS) cluster

Kubernetes provides a distributed platform for containerized applications. With AKS, provisioning of a production ready Kubernetes cluster is simple and quick. In this tutorial, part three of seven, a Kubernetes cluster is deployed in AKS. Steps completed include:

> [!div class="checklist"]
> * Deploying a Kubernetes AKS cluster
> * Installation of the Kubernetes CLI (kubectl)
> * Configuration of kubectl

In subsequent tutorials, the Azure Vote application is deployed to the cluster, scaled, updated, and Operations Management Suite is configured to monitor the Kubernetes cluster.

## Before you begin

In previous tutorials, a container image was created and uploaded to an Azure Container Registry instance. If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images](./tutorial-kubernetes-prepare-app.md).

## Create Kubernetes cluster

The following example creates a cluster named `myK8sCluster` in a Resource Group named `myResourceGroup`. This Resource Group was created in the [previous tutorial](./tutorial-kubernetes-prepare-acr.md).

```azurecli
az aks create --resource-group myResourceGroup --name myK8sCluster --agent-count 1 --generate-ssh-keys
```

After several minutes, the deployment completes, and returns json formatted information about the AKS deployment.

## Install the kubectl CLI

To connect to the Kubernetes cluster from your client computer, use [kubectl](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. 

If you're using Azure CloudShell, kubectl is already installed. If you want to install it locally, run the following command:

```azurecli
az aks install-cli 
```

## Connect with kubectl

To configure kubectl to connect to your Kubernetes cluster, run the following command:

```azurecli
az aks get-credentials --resource-group=myResourceGroup --name=myK8sCluster
```

To verify the connection to your cluster, run the [kubectl get nodes](https://kubernetes.io/docs/user-guide/kubectl/v1.6/#get) command.

```azurecli
kubectl get nodes
```

Output:

```
NAME                          STATUS    AGE       VERSION
k8s-myk8scluster-36346190-0   Ready     49m       v1.7.7
```

At tutorial completion, you have an AKS Kubernetes cluster ready for workloads. In subsequent tutorials, a multi-container application is deployed to this cluster, scaled out, updated, and monitored.

## Next steps

In this tutorial, a Kubernetes cluster was deployed in AKS. The following steps were completed:

> [!div class="checklist"]
> * Deployed a Kubernetes AKS cluster
> * Installed the Kubernetes CLI (kubectl)
> * Configured kubectl

Advance to the next tutorial to learn about running application on the cluster.

> [!div class="nextstepaction"]
> [Deploy application in Kubernetes](./tutorial-kubernetes-deploy-application.md)
