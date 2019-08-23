---
title: (DEPRECATED) Quickstart - Azure Docker CE cluster for Linux
description: Quickly learn to create a Docker CE cluster for Linux containers in Azure Container Service with the Azure CLI.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 07/16/2018
ms.author: iainfou
ms.custom:
---

# (DEPRECATED) Deploy Docker CE cluster

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

In this quick start, a Docker CE cluster is deployed using the Azure CLI. A multi-container application consisting of web front-end and a Redis instance is then deployed and run on the cluster. Once completed, the application is accessible over the internet.

Docker CE on Azure Container Service is in preview and **should not be used for production workloads**.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *westus2* location.

```azurecli-interactive
az group create --name myResourceGroup --location westus2
```

Output:

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup",
  "location": "westus2",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create Docker Swarm cluster

Create a Docker CE cluster in Azure Container Service with the [az acs create](/cli/azure/acs#az-acs-create) command. For information on region availaiblity of Docker CE, see [ACS regions for Docker CE](https://github.com/Azure/ACS/blob/master/announcements/2017-08-04_additional_regions.md)

The following example creates a cluster named *mySwarmCluster* with one Linux master node and three Linux agent nodes.

```azurecli-interactive
az acs create --name mySwarmCluster --orchestrator-type dockerce --resource-group myResourceGroup --generate-ssh-keys
```

In some cases, such as with a limited trial, an Azure subscription has limited access to Azure resources. If the deployment fails due to limited available cores, reduce the default agent count by adding `--agent-count 1` to the [az acs create](/cli/azure/acs#az-acs-create) command. 

After several minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

Throughout this quick start, you need the FQDN of both the Docker Swarm master and the Docker agent pool. Run the following command to return both the master and agent FQDNs.


```bash
az acs list --resource-group myResourceGroup --query '[*].{Master:masterProfile.fqdn,Agent:agentPoolProfiles[0].fqdn}' -o table
```

Output:

```bash
Master                                                               Agent
-------------------------------------------------------------------  --------------------------------------------------------------------
myswarmcluster-myresourcegroup-d5b9d4mgmt.ukwest.cloudapp.azure.com  myswarmcluster-myresourcegroup-d5b9d4agent.ukwest.cloudapp.azure.com
```

Create an SSH tunnel to the Swarm master. Replace `MasterFQDN` with the FQDN address of the Swarm master.

```bash
ssh -p 2200 -fNL localhost:2374:/var/run/docker.sock azureuser@MasterFQDN
```

Set the `DOCKER_HOST` environment variable. This allows you to run docker commands against the Docker Swarm without having to specify the name of the host.

```bash
export DOCKER_HOST=localhost:2374
```

You are now ready to run Docker services on the Docker Swarm.


## Run the application

Create a file named `azure-vote.yaml` and copy the following content into it.


```yaml
version: '3'
services:
  azure-vote-back:
    image: redis
    ports:
        - "6379:6379"

  azure-vote-front:
    image: microsoft/azure-vote-front:v1
    environment:
      REDIS: azure-vote-back
    ports:
        - "80:80"
```

Run the [docker stack deploy](https://docs.docker.com/engine/reference/commandline/stack_deploy/) command to create the Azure Vote service.

```bash
docker stack deploy azure-vote --compose-file azure-vote.yaml
```

Output:

```bash
Creating network azure-vote_default
Creating service azure-vote_azure-vote-back
Creating service azure-vote_azure-vote-front
```

Use the [docker stack ps](https://docs.docker.com/engine/reference/commandline/stack_ps/) command to return the deployment status of the application.

```bash
docker stack ps azure-vote
```

Once the `CURRENT STATE` of each service is `Running`, the application is ready.

```bash
ID                  NAME                            IMAGE                                 NODE                               DESIRED STATE       CURRENT STATE                ERROR               PORTS
tnklkv3ogu3i        azure-vote_azure-vote-front.1   microsoft/azure-vote-front:v1   swarmm-agentpool0-66066781000004   Running             Running 5 seconds ago                            
lg99i4hy68r9        azure-vote_azure-vote-back.1    redis:latest                          swarmm-agentpool0-66066781000002   Running             Running about a minute ago
```

## Test the application

Browse to the FQDN of the Swarm agent pool to test out the Azure Vote application.

![Image of browsing to Azure Vote](media/container-service-docker-swarm-mode-walkthrough/azure-vote.png)

## Delete cluster
When the cluster is no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Get the code

In this quick start, pre-created container images have been used to create a Docker service. The related application code, Dockerfile, and Compose file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis](https://github.com/Azure-Samples/azure-voting-app-redis.git)

## Next steps

In this quick start, you deployed a Docker Swarm cluster and deployed a multi-container application to it.

To learn about integrating Docker swarm with Azure DevOps, continue to the CI/CD with Docker Swarm and Azure DevOps.

> [!div class="nextstepaction"]
> [CI/CD with Docker Swarm and Azure DevOps](./container-service-docker-swarm-setup-ci-cd.md)
