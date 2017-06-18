---
title: Azure Container Service tutorial - Deploy Cluster | Microsoft Docs
description: Azure Container Service tutorial - Deploy Cluster
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/21/2017
ms.author: nepeters
---

# Deploy a Kubernetes cluster in Azure Container Service

Kubernetes provides a distributed platform for running modern and containerized applications. With Azure Container Service, provisioning of a production ready Kubernetes cluster is simple and quick. This quick start details basic steps needed to deploy a Kubernetes cluster. This tutorial covers the following tasks:

> [!div class="checklist"]
> * Deploy a Kubernetes ACS cluster
> * Installation of the Kubernetes CLI (kubectl)
> * Configuration of kubectl

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Prerequisites

This is one tutorial of a multi-part series. You do not need to complete the full series to work through this tutorial, however the following items are required.

**Resource group** - in the previous tutorial, a resource group named *myResourceGroup* was created. This tutorial assumes that the resource group exists. If needed, create a resource group named *myResourceGroup*.

## Create Kubernetes cluster

Create a Kubernetes cluster in Azure Container Service with the [az acs create](/cli/azure/acs#create) command. 

The following example creates a cluster named *myK8sCluster* with one Linux master node and three Linux agent nodes. If they do not already exist, SSH keys are created. To use a specific set of keys in a non-default location, use the `--ssh-key-value` option.

```azurecli-interactive 
az acs create --orchestrator-type=kubernetes --resource-group myResourceGroup --name=myK8SCluster --generate-ssh-keys 
```

After several minutes, the command completes, and returns information about the ACS deployment.

## Install kubectl

To connect to the Kubernetes cluster from your client computer, use [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. 

If you're using Azure CloudShell, `kubectl` is already installed. If you want to install it locally, you can use the [az acs kubernetes install-cli](/cli/azure/acs/kubernetes#install-cli) command.

If running in Linux or macOS, you may need to run with sudo. On Windows, ensure your shell has been run as administrator.

```azurecli-interactive 
az acs kubernetes install-cli 
```

On Windows, the default installation is *c:\program files (x86)\kubectl.exe*. You may need to add this file to the Windows path. 

## Connect with kubectl

To configure `kubectl` to connect to your Kubernetes cluster, run the [az acs kubernetes get-credentials](/cli/azure/acs/kubernetes#get-credentials) command.

```azurecli-interactive 
az acs kubernetes get-credentials --resource-group=myResourceGroup --name=myK8SCluster
```

To verify the connection to your cluster from your machine, try running:

```bash
kubectl get nodes
```

Output:

```bash
NAME                    STATUS                     AGE       VERSION
k8s-agent-98dc3136-0    Ready                      5m        v1.6.2
k8s-agent-98dc3136-1    Ready                      5m        v1.6.2
k8s-agent-98dc3136-2    Ready                      5m        v1.6.2
k8s-master-98dc3136-0   Ready,SchedulingDisabled   5m        v1.6.2
```

At tutorial competition, you have an ACS Kubernetes cluster ready for workload. In subsequent tutorials a multi-container application will be deployed to this cluster, scaled out, updated, and monitored.

## Next steps

In this tutorial, an Azure Container Service Kubernetes cluster was deployed. Tasks covered included:

> [!div class="checklist"]
> * Deploy a Kubernetes ACS cluster
> * Installation of the Kubernees CLI (kubectl)
> * Configuration of kubectl

Advance to the next tutorial to learn about running application on the cluster.

> [!div class="nextstepaction"]
> [Deploy application in Kubrnetes](./container-service-tutorial-kubernetes-deploy-application.md)