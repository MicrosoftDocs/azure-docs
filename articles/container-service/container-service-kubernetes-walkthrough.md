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
ms.date: 11/15/2016
ms.author: anhowe

---

# Microsoft Azure Container Service Engine - Kubernetes Walkthrough

## Prerequisites
This walkthrough assumes that you have the ['azure-cli' command line tool](https://github.com/azure/azure-cli#installation) installed and have created [SSH public key](../virtual-machines/virtual-machines-linux-mac-create-ssh-keys.md) at `~/.ssh/id_rsa.pub`.

## Overview

The instructions below will create a Kubernetes cluster with one master and two worker nodes.
The master serves the Kubernetes REST API.  The worker nodes are grouped in an Azure availability set
and run your containers. All VMs are in the same private VNET and are fully accessible to each other.

> [!NOTE]
> Kubernetes support in Azure Container Service is currently in preview.
>

The following image shows the architecture of a container service cluster with one master, and two agents:

![Image of Kubernetes cluster on azure](media/container-service-kubernetes-walkthrough/kubernetes.png)

## Creating your Kubernetes cluster

### Create a resource group
To create your cluster, you first need to create a resource group in a specific location, you can do this with:
```console
RESOURCE_GROUP=my-resource-group
LOCATION=westus
az group create --name=$RESOURCE_GROUP --location=$LOCATION
```

### Create a cluster
Once you have a resource group, you can create a cluster in that group with:
```console
DNS_PREFIX=some-unique-value
SERVICE_NAME=any-acs-service-name
az acs create --orchestrator-type=kubernetes --resource-group $RESOURCE_GROUP --name=$SERVICE_NAME --dns-prefix=$DNS_PREFIX
```

> [!NOTE]
> azure-cli will upload `~/.ssh/id_rsa.pub` to the Linux VMs.
>

Once that command is complete, you should have a working Kubernetes cluster.

### Configure kubectl
`kubectl` is the Kubernetes command line client.  If you don't already have it installed, you can install it with:

```console
az acs kubernetes install-cli
```

Once `kubectl` is installed, running the below command will download the master kubernetes cluster configuration to the ~/.kube/config file
```console
az acs kubernetes get-credentials --resource-group=$RESOURCE_GROUP --name=$SERVICE_NAME
```

At this point you should be ready to access your cluster from your machine, try running:
```console
kubectl get nodes
```

And validate that you can see the machines in your cluster.

## Create your First Kubernetes Service

After completing this walkthrough, you will know how to:
 * deploy a Docker application and expose to the world,
 * use `kubectl exec` to run commands in a container, 
 * and access the Kubernetes dashboard.

### Start a simple container
You can run a simple container (in this case the `nginx` web server) by running:

```console
kubectl run nginx --image nginx
```

This command starts the nginx Docker container in a pod on one of the nodes.

You can run
```console
kubectl get pods
```

to see the running container.

### Expose the service to the world
To expose the service to the world.  You create a Kubernetes `Service` of type `LoadBalancer`:

```console
kubectl expose deployments nginx --port=80 --type=LoadBalancer
```

This will now cause Kubernetes to create an Azure Load Balancer with a public IP. The change
takes about 2-3 minutes to propagate to the load balancer.

To watch the service change from "pending" to an external ip type:
```console
watch 'kubectl get svc'
```

  ![Image of watching the transition from pending to external ip](media/container-service-kubernetes-walkthrough/kubernetes-nginx3.png)

Once you see the external IP, you can browse to it in your browser:

  ![Image of browsing to nginx](media/container-service-kubernetes-walkthrough/kubernetes-nginx4.png)  


### Browse the Kubernetes UI
To see the Kubernetes web interface, you can use:

```console
kubectl proxy
```
This runs a simple authenticated proxy on localhost, which you can use to view the [kubernetes ui](http://localhost:8001/ui)

![Image of Kubernetes dashboard](media/container-service-kubernetes-walkthrough/kubernetes-dashboard.png)

### Remote sessions inside your containers
Kubernetes allows you to run commands in a remote Docker container running in your cluster.

```console
# Get the name of your nginx pod
kubectl get pods
```

Using your pod name, you can run a remote command on your pod.  For example:
```console
kubectl exec nginx-701339712-retbj date
```

You can also get a fully interactive session using the `-it` flags:

```console
kubectl exec nginx-701339712-retbj -it bash
```

![Image of curl to podIP](media/container-service-kubernetes-walkthrough/kubernetes-remote.png)


## Details
### Installing the kubectl configuration file
When you ran `az acs kubernetes get-credentials`, the kube config file for remote access was stored under the home directory ~/.kube/config.

If you ever need to download it directly, you can use `ssh` on Linux or OS X, or `Putty` on windows:

#### Windows
To use pscp from [putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).  Ensure you have your certificate exposed through [pageant](https://github.com/Azure/acs-engine/blob/master/docs/ssh.md#key-management-and-agent-forwarding-with-windows-pageant):
  ```
  # MASTERFQDN is obtained in step1
  pscp azureuser@MASTERFQDN:.kube/config .
  SET KUBECONFIG=%CD%\config
  kubectl get nodes
  ```

#### OS X or Linux:
  ```
  # MASTERFQDN is obtained in step1
  scp azureuser@MASTERFQDN:.kube/config .
  export KUBECONFIG=`pwd`/config
  kubectl get nodes
  ```
## Learning More

### Azure Container Service

1. [Azure Container Service documentation](https://azure.microsoft.com/en-us/documentation/services/container-service/)
2. [Azure Container Service Open Source Engine](https://github.com/azure/acs-engine)

### Kubernetes Community Documentation

1. [Kubernetes Bootcamp](https://katacoda.com/embed/kubernetes-bootcamp/1/) - shows you how to deploy, scale, update, and debug containerized applications.
2. [Kubernetes User Guide](http://kubernetes.io/docs/user-guide/) - provides information on running programs in an existing Kubernetes cluster.
3. [Kubernetes Examples](https://github.com/kubernetes/kubernetes/tree/master/examples) - provides a number of examples on how to run real applications with Kubernetes.
