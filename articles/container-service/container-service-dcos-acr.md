---
title: Using ACR with an Azure DC/OS cluster | Microsoft Docs
description: Use an Azure Container Registry with a DC/OS cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: julienstroheker
manager: dcaro
editor: ''
tags: acs, azure-container-service, acr, azure-container-registry
keywords: Docker, Containers, Micro-services, Mesos, Azure, FileShare, cifs

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/23/2017
ms.author: juliens

---
# Use ACR with a DC/OS cluster to deploy your application

In this article, we'll explore how to use a private container register such as ACR (Azure Container Registry) with a DC/OS cluster. Using ACR allows you to privatley store and manage container images. This tutorial will cover the following:

> [!div class="checklist"]
> * Deploy Azure Container Registry
> * Configure ACR authentication on a DC/OS cluster
> * Run a container image from ACR

You will need an ACS DC/OS cluster to complete the steps in this tutorial. If needed, [this script sample](./scripts/container-service-cli-deploy-dcos.md) can create one for you.

This quick start requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). You can also use [Cloud Shell](/azure/cloud-shell/quickstart) from your browser.

## Deploy Azure Container Registry

An Azure Container registry is created with the [az acr create](/cli/azure/acr#create) command. The following example creates a registry named *myContainerRegistry* with the *Basic* sku.

```azurecli-interactive
az acr create --resource-group myResourceGroup --name myContainerRegistry$RANDOM --sku Basic
```

Get ACR credentials using the [az acr credential show](/cli/azure/acr/credential) command. Note these down, they are needed in a later step.

```azurecli-interactive
az acr credential show --name myContainerRegistry2675
```

For more information on Azure Container Registry, see [Introduction to private Docker container registries](../container-registry/container-registry-intro.md). 

## Manage ACR authentication

The conventional way to push and pull image from a private registry is to first authenticate with the registry. To do so, you use the `docker login` command any docker client that will access the private registry. Because a DC/OS cluster can be comprised of multiple nodes, it is helpful to automate this process across all of them. 

### Create shared storage

This process will use an Azure file share that has been mounted on each node in the cluster. If you have not already set up shared storage, see the [Setup a file share inside a DC/OS cluster](container-service-dcos-fileshare.md) 

### Configure ACR authentication

First, get the FQDN of the DC/OS master and store it in a variable.

```azurecli-interactive
FQDN=$(az acs list --resource-group myResourceGroup --query "[0].masterProfile.fqdn" --output tsv)
```

Create an SSH connection with the master (or the first master) of your DC/OS-based cluster. Note, update the user name if a non-default value was used when creating the cluster.

```bash
ssh azureuser@$FQDN
```

Run the following command to log into the Azure Container Registry. This command will store the the authentication values locally under the `~/.docker` path.

```bash
docker login --username=password --password=Pk===2Wwy=R++/7i+zSnf=KA6J=/NJpW mycontainerregistry2675.azurecr.io
```

Create a compressed file that containers the container registry authentication values.

```bash
tar czf docker.tar.gz .docker
```

Copy this file to the cluster shred storge. This will make the fiel avaliable on all nodes of the DC/OS cluster.

```bash
cp docker.tar.gz /mtn/share/dcos
```

## Run an image from ACR

Let's say we want to deploy the **simple-web** image, with the **2.1** tag, from our private registry hosted on Azure (ACR), we will use the following configuration:

```json
{
  "id": "myapp",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "demodcos.azurecr.io/simple-web:2.1",
      "network": "BRIDGE",
      "portMappings": [
        { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
      ],
      "forcePullImage":true
    }
  },
  "instances": 3,
  "cpus": 0.1,
  "mem": 65,
  "healthChecks": [{
      "protocol": "HTTP",
      "path": "/",
      "portIndex": 0,
      "timeoutSeconds": 10,
      "gracePeriodSeconds": 10,
      "intervalSeconds": 2,
      "maxConsecutiveFailures": 10
  }],
  "labels":{
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_VHOST":"YOUR FQDN",
    "HAPROXY_0_MODE":"http"
  },
  "uris":  [
       "file:///mnt/share/docker.tar.gz"
   ]
}
```

## Next steps

In this tutorial you have configure DC/OS to use Azure Container Registry including the following tasks:

> [!div class="checklist"]
> * Deploy ACS cluster (if needed)
> * Deploy Azure Container Registry (if needed)
> * Configure ACR authentication on a DC/OS cluster
> * Run a container image from ACR

Advance to the next tutorial to learn how to monitor a DC/OS cluster with OMS.

> [!div class="nextstepaction"]
> [Create custom VM images](./container-service-monitoring-oms.md)
