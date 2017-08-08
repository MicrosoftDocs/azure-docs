---
title: Quickstart - Azure Docker Swarm Mode cluster for Linux | Microsoft Docs
description: Quickly learn to create a Docker Swarm Mode cluster for Linux containers in Azure Container Service with the Azure CLI.
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service, Docker, Swarm
keywords: ''

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/08/2017
ms.author: nepeters
ms.custom:
---

# Deploy Docker Swarm Mode cluster for Linux containers

# Deploy Kubernetes cluster for Linux containers

In this quick start, a Docker Swarm Mode cluster is deployed using the Azure CLI. A multi-container application consisting of web front end and a Redis instance is then deployed and run on the cluster. Once completed, the application is accessible over the internet.

![Image of browsing to Azure Vote](media/container-service-docker-swarm-mode-walkthrough/azure-vote.png)

This quick start assumes a basic understanding of Docker concepts, for detailed information on Kubernetes see the [Docker documentation](https://docs.docker.com/).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location westcentralus
```

Output:

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup",
  "location": "westcentralus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create Docker Swarm cluster

Create a Docker Swarm Mode cluster in Azure Container Service with the [az acs create](/cli/azure/acs#create) command. The following example creates a cluster named *myK8sCluster* with one Linux master node and three Linux agent nodes.

```azurecli-interactive 
az acs create --orchestrator-type dockerce --resource-group myResourceGroup --name myK8sCluster --generate-ssh-keys 
```

After several minutes, the command completes and returns json formatted information about the cluster. 

## Connect to the cluster

## Run the application

```yaml
version: '3'
services:
  azure-vote-back:
    image: redis
    container_name: azure-vote-back
    ports:
        - "6379:6379"

  azure-vote-front:
    build: ./azure-vote
    image: azure-vote-front
    container_name: azure-vote-front
    environment:
      REDIS: azure-vote-back
    ports:
        - "8080:80"
```