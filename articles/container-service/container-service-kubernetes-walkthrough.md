---
title: Kubernetes cluster quickstart in Azure | Microsoft Docs
description: Deploy and get started with a Kubernetes cluster in Azure Container Service
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
ms.date: 04/05/2017
ms.author: anhowe
ms.custom: H1Hack27Feb2017
---

# Get started with a Kubernetes cluster in Container Service


This walkthrough shows you how to use the Azure CLI 2.0 commands to create a Kubernetes cluster in Azure Container Service. Then, you can use the `kubectl` command-line tool to start working with containers in the cluster.

The following image shows the architecture of a Container Service cluster with one master and two agents. The master serves the Kubernetes REST API. The agent nodes are grouped in an Azure availability set
and run your containers. All VMs are in the same private virtual network and are fully accessible to each other.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-walkthrough/kubernetes.png)

## Prerequisites
This walkthrough assumes that you have installed and set up the [Azure CLI 2.0](/cli/azure/install-az-cli2). 

The command examples assume that you run the Azure CLI in a bash shell, common on Linux and macOS. If you run the Azure CLI on a Windows client, some scripting and file syntax may differ, depending on your command shell. 

## Create your Kubernetes cluster

Here are brief shell commands that use the Azure CLI 2.0 to create your cluster. 

### Create a resource group
To create your cluster, you first need to create a resource group in a specific location. Run commands similar to the following:

```azurecli
RESOURCE_GROUP=my-resource-group
LOCATION=westus
az group create --name=$RESOURCE_GROUP --location=$LOCATION
```

### Create a cluster
Once you have a resource group, you can create a cluster in that group. The following example uses the `--generate-ssh-keys` option, which generates the necessary SSH public and private key files for the deployment if they don't exist already in the default `~/.ssh/` directory. 

This command also automatically generates the [Azure Active Directory service principal](container-service-kubernetes-service-principal.md) that a Kubernetes cluster in Azure uses.

```azurecli
DNS_PREFIX=some-unique-value
CLUSTER_NAME=any-acs-cluster-name
az acs create --orchestrator-type=kubernetes --resource-group $RESOURCE_GROUP --name=$CLUSTER_NAME --dns-prefix=$DNS_PREFIX --generate-ssh-keys
```


After several minutes, the command completes, and you should have a working Kubernetes cluster.

### Connect to the cluster

To connect to the Kubernetes cluster from your client computer, you use [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. 

If you don't already have `kubectl` installed, you can install it with:

```azurecli
sudo az acs kubernetes install-cli
```
> [!TIP]
> By default, this command installs the `kubectl` binary to `/usr/local/bin/kubectl` on a Linux or macOS system, or to `C:\Program Files (x86)\kubectl.exe` on Windows. To specify a different installation path, use the `--install-location` parameter.
>

After `kubectl` is installed, ensure that its directory in your system path, or add it to the path. 


Then, run the following command to download the master Kubernetes cluster configuration to the `~/.kube/config` file:

```azurecli
az acs kubernetes get-credentials --resource-group=$RESOURCE_GROUP --name=$CLUSTER_NAME
```

For more options to install and configure `kubectl`, see [Connect to an Azure Container Service cluster](container-service-connect.md).

At this point you should be ready to access your cluster from your machine. Try running:

```bash
kubectl get nodes
```

Verify that you can see a list of the machines in your cluster.

## Create your first Kubernetes service

After completing this walkthrough, you will know how to:
* deploy a Docker application and expose it to the world
* use `kubectl exec` to run commands in a container 
* access the Kubernetes dashboard

### Start a simple container
You can run a simple container (in this case the Nginx web server) by running:

```bash
kubectl run nginx --image nginx
```

This command starts the Nginx Docker container in a pod on one of the nodes.

To see the running container, run:

```bash
kubectl get pods
```

### Expose the service to the world
To expose the service to the world, create a Kubernetes `Service` of type `LoadBalancer`:

```bash
kubectl expose deployments nginx --port=80 --type=LoadBalancer
```

This command causes Kubernetes to create an Azure load balancer rule with a public IP address. The change
takes a few minutes to propagate to the load balancer. For more information, see [Load balance containers in a Kubernetes cluster in Azure Container Service](container-service-kubernetes-load-balancing.md).

Run the following command to watch the service change from `pending` to display an external IP address:

```bash
watch 'kubectl get svc'
```

  ![Image of watching the transition from pending to external IP address](media/container-service-kubernetes-walkthrough/kubernetes-nginx3.png)

Once you see the external IP address, you can browse to it in your browser:

  ![Image of browsing to Nginx](media/container-service-kubernetes-walkthrough/kubernetes-nginx4.png)  


### Browse the Kubernetes UI
To see the Kubernetes web interface, you can use:

```bash
kubectl proxy
```
This command runs a simple authenticated proxy on localhost, which you can use to view the Kubernetes web UI running on [http://localhost:8001/ui](http://localhost:8001/ui). For more information, see [Using the Kubernetes web UI with Azure Container Service](container-service-kubernetes-ui.md).

![Image of Kubernetes dashboard](media/container-service-kubernetes-walkthrough/kubernetes-dashboard.png)

### Remote sessions inside your containers
Kubernetes allows you to run commands in a remote Docker container running in your cluster.

```bash
# Get the name of your nginx pods
kubectl get pods
```

Using your pod name, you can run a remote command on your pod.  For example:

```bash
kubectl exec <pod name> date
```

You can also get a fully interactive session using the `-it` flags:

```bash
kubectl exec <pod name> -it bash
```

![Remote session inside a container](media/container-service-kubernetes-walkthrough/kubernetes-remote.png)



## Next steps

To do more with your Kubernetes cluster, see the following resources:

* [Kubernetes Bootcamp](https://katacoda.com/embed/kubernetes-bootcamp/1/) - shows you how to deploy, scale, update, and debug containerized applications.
* [Kubernetes User Guide](http://kubernetes.io/docs/user-guide/) - provides information on running programs in an existing Kubernetes cluster.
* [Kubernetes Examples](https://github.com/kubernetes/kubernetes/tree/master/examples) - provides examples on how to run real applications with Kubernetes.
