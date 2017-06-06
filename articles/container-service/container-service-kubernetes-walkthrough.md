---
title: Quickstart - Azure Kubernetes cluster for Linux | Microsoft Docs
description: Quickly learn to create a Kubernetes cluster for Linux containers in Azure Container Service with the Azure CLI.
services: container-service
documentationcenter: ''
author: anhowe
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: 8da267e8-2aeb-4c24-9a7a-65bdca3a82d6
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/31/2017
ms.author: anhowe
ms.custom: H1Hack27Feb2017
---

# Deploy Kubernetes cluster for Linux containers

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a [Kubernetes](https://kubernetes.io/docs/home/) cluster in [Azure Container Service](container-service-intro.md). Once the cluster is deployed, you connect to it with the Kubernetes `kubectl` command-line tool, and you deploy your first Linux container.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to Azure 

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli-interactive
az login
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create Kubernetes cluster
Create a Kubernetes cluster in Azure Container Service with the [az acs create](/cli/azure/acs#create) command. 

The following example creates a cluster named *myK8sCluster* with one Linux master node and two Linux agent nodes. This example creates SSH keys if they don't already exist in the default locations. To use a specific set of keys, use the `--ssh-key-value` option. Update the cluster name to something appropriate to your environment. 



```azurecli-interactive 
az acs create --orchestrator-type=kubernetes \
    --resource-group myResourceGroup \
    --name=myK8sCluster \
    --agent-count=2 \
    --generate-ssh-keys 
```

After several minutes, the command completes, and shows you information about your deployment.

## Install kubectl

To connect to the Kubernetes cluster from your client computer, use [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. 

If you're using Azure CloudShell, `kubectl` is already installed. If you want to install it locally, you can use the [az acs kubernetes install-cli](/cli/azure/acs/kubernetes#install-cli) command.

The following Azure CLI example installs `kubectl` to your system. If you are running the Azure CLI on macOS or Linux, you might need to run the command with `sudo`.

```azurecli-interactive 
az acs kubernetes install-cli 
```

## Connect with kubectl

To configure `kubectl` to connect to your Kubernetes cluster, run the [az acs kubernetes get-credentials](/cli/azure/acs/kubernetes#get-credentials) command. The following example
downloads the cluster configuration for your Kubernetes cluster.

```azurecli-interactive 
az acs kubernetes get-credentials --resource-group=myResourceGroup --name=myK8sCluster
```

To verify the connection to your cluster from your machine, try running:

```azurecli-interactive
kubectl get nodes
```

`kubectl` lists the master and agent nodes.

```azurecli-interactive
NAME                    STATUS                     AGE       VERSION
k8s-agent-98dc3136-0    Ready                      5m        v1.5.3
k8s-agent-98dc3136-1    Ready                      5m        v1.5.3
k8s-master-98dc3136-0   Ready,SchedulingDisabled   5m        v1.5.3

```


## Deploy an NGINX container

You can run a Docker container inside a Kubernetes *pod*, which contains one or more containers. 

The following command starts the NGINX Docker container in a Kubernetes pod on one of the nodes. In this case, the container runs the NGINX web server pulled from an image in [Docker Hub](https://hub.docker.com/_/nginx/).

```azurecli-interactive
kubectl run nginx --image nginx
```
To see that the container is running, run:

```azurecli-interactive
kubectl get pods
```

## View the NGINX welcome page
To expose the NGINX server to the world with a public IP address, type the following command:

```azurecli-interactive
kubectl expose deployments nginx --port=80 --type=LoadBalancer
```

With this command, Kubernetes creates a service and an [Azure load balancer rule](container-service-kubernetes-load-balancing.md) with a public IP address for the service. 

Run the following command to see the status of the service.

```azurecli-interactive
kubectl get svc
```

Initially the IP address appears as `pending`. After a few minutes, the external IP address of the service is set:
  
```azurecli-interactive
NAME         CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE       
kubernetes   10.0.0.1       <none>          443/TCP        21h       
nginx        10.0.111.25    52.179.3.96     80/TCP         22m
```

You can use a web browser of your choice to see the default NGINX welcome page at the external IP address:

![Image of browsing to Nginx](media/container-service-kubernetes-walkthrough/kubernetes-nginx4.png)  


## Delete cluster
When the cluster is no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup
```


## Next steps

In this quick start, you deployed a Kubernetes cluster, connected with `kubectl`, and deployed a pod with an NGINX container. To learn more about Azure Container Service, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [Manage an ACS Kubernetes cluster](./container-service-dcos-manage-tutorial.md)
