---
title: Quickstart - Azure Docker Swarm cluster for Linux | Microsoft Docs
description: Quickly learn to create a Docker Swarm cluster for Linux containers in Azure Container Service with the Azure CLI.
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
ms.date: 08/14/2017
ms.author: nepeters
ms.custom:
---

# Deploy Docker Swarm cluster

In this quick start, a Docker Swarm cluster is deployed using the Azure CLI. A multi-container application consisting of web front end and a Redis instance is then deployed and run on the cluster. Once completed, the application is accessible over the internet.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *westus* location.

```azurecli-interactive
az group create --name myResourceGroup --location westus
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

Create a Docker Swarm cluster in Azure Container Service with the [az acs create](/cli/azure/acs#create) command. 

The following example creates a cluster named *mySwarmCluster* with one Linux master node and three Linux agent nodes.

```azurecli-interactive
az acs create --name mySwarmCluster --orchestrator-type Swarm --resource-group myResourceGroup --generate-ssh-keys
```

In some cases, such as with a limited trial, an Azure subscription has limited access to Azure resources. If the deployment fails due to limited available cores, reduce the default agent count by adding `--agent-count 1` to the [az acs create](/cli/azure/acs#create) command. 

After several minutes, the command completes and returns json formatted information about the cluster.

## Connect to the cluster

Throughout this quick start, you need the IP address of both the Docker Swarm master and the Docker agent pool. Run the following command to return both IP addresses.


```bash
az network public-ip list --resource-group myResourceGroup --query "[*].{Name:name,IPAddress:ipAddress}" -o table
```

Output:

```bash
Name                                                                 IPAddress
-------------------------------------------------------------------  -------------
swarmm-agent-ip-myswarmcluster-myresourcegroup-d5b9d4agent-66066781  52.179.23.131
swarmm-master-ip-myswarmcluster-myresourcegroup-d5b9d4mgmt-66066781  52.141.37.199
```

Create an SSH tunnel to the Swarm master. Replace `IPAddress` with the IP address of the Swarm master.

```bash
ssh -p 2200 -fNL 2375:localhost:2375 azureuser@IPAddress
```

Set the `DOCKER_HOST` environment variable. This allows you to run docker commands against the Docker Swarm without having to specify the name of the host.

```bash
export DOCKER_HOST=:2375
```

You are now ready to run Docker services on the Docker Swarm.


## Run the application

Create a file named `docker-compose.yaml` and copy the following content into it.

```yaml
version: '3'
services:
  azure-vote-back:
    image: redis
    container_name: azure-vote-back
    ports:
        - "6379:6379"

  azure-vote-front:
    image: microsoft/azure-vote-front:redis-v1
    container_name: azure-vote-front
    environment:
      REDIS: azure-vote-back
    ports:
        - "80:80"
```

Run the following command to create the Azure Vote service.

```bash
docker-compose up -d
```

Output:

```bash
Creating network "user_default" with the default driver
Pulling azure-vote-front (microsoft/azure-vote-front:redis-v1)...
swarm-agent-EE873B23000005: Pulling microsoft/azure-vote-front:redis-v1...
swarm-agent-EE873B23000004: Pulling microsoft/azure-vote-front:redis-v1... : downloaded
Pulling azure-vote-back (redis:latest)...
swarm-agent-EE873B23000004: Pulling redis:latest... : downloaded
Creating azure-vote-front ... 
Creating azure-vote-back ... 
Creating azure-vote-front
Creating azure-vote-back ...
```

## Test the application

Browse to the IP address of the Swarm agent pool to test out the Azure Vote application.

![Image of browsing to Azure Vote](media/container-service-docker-swarm-mode-walkthrough/azure-vote.png)

## Delete cluster
When the cluster is no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Get the code

In this quick start, pre-created container images have been used to create a Docker service. The related application code, Dockerfile, and Compose file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis](https://github.com/Azure-Samples/azure-voting-app-redis.git)

## Next steps

In this quick start, you deployed a Docker Swarm cluster and deployed a multi-container application to it.

To learn about integrating Docker warm with Visual Studio Team Services, continue to the CI/CD with Docker Swarm and VSTS.

> [!div class="nextstepaction"]
> [CI/CD with Docker Swarm and VSTS](./container-service-docker-swarm-setup-ci-cd.md)