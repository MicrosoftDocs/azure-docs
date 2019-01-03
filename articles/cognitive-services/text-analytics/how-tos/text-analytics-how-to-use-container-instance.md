---
title: Run Container Instances
titleSuffix: Text Analytics -  Azure Cognitive Services
description: The following procedure demonstrates how to deploy the language detection container, with a running sample, to the Azure Kubernetes service, and test it in a web browser. 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 01/03/2019
ms.author: diberry
---

# Deploy the Language detection container to Azure Kubernetes service

The following procedure demonstrates how to deploy the language detection container, with a running sample, to the Azure Kubernetes service, and test it in a web browser. 

## Prerequisites
This procedure requires several tools that must be installed locally. 

1. Install [Azure cli](../../azure/install-azure-cli?view=azure-cli-latest.md). 
1. Install [Docker engine](https://www.docker.com/products/docker-engine) and validate that the docker cli works in a terminal.
1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/). 
1. Have a valid Azure subscription. The trial and pay-as-you-go subscriptions will both work. 

## Create Azure Container Registry service

In order to deploy the container to the Azure Kubernetes service, the container images need to be accessible. Create your own Azure Container Registry service to host the images. 

1. Login to Azure.

    ```azurecli-interactive
    az login
    ```

2. Create a resource group named `cogserv-container-rg` to hold every created in this procedure.

    ```azurecli-interactive
    az group create --name cogserv-container-rg --location westus
    ```

3. Create your own Azure Container Registry named `cogservcontainerregistry`. Prepend your login so the name is unique such as `pattiowenscogservcontainerregistry`

    ```azurecli-interactive
    az acr create --resource-group cogserv-container-rg --name pattiowenscogservcontainerregistry --sku Basic
    ```

    Save the results to get the **loginServer** property:

    ```json
    {
        "adminUserEnabled": false,
        "creationDate": "2019-01-02T23:49:53.783549+00:00",
        "id": "/subscriptions/666a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/cogserv-container-rg/providers/Microsoft.ContainerRegistry/registries/pattiowenscogservcontainerregistry",
        "location": "westus",
        "loginServer": "pattiowenscogservcontainerregistry.azurecr.io",
        "name": "pattiowenscogservcontainerregistry",
        "provisioningState": "Succeeded",
        "resourceGroup": "cogserv-container-rg",
        "sku": {
            "name": "Basic",
            "tier": "Basic"
        },
        "status": null,
        "storageAccount": null,
        "tags": {},
        "type": "Microsoft.ContainerRegistry/registries"
    }
    ```

## Pull down image from docker hub

From the terminal, pull the docker image to the local machine:

`docker pull mcr.microsoft.com/azure-cognitive-services/language:latest`

## Move local Image to Azure Container Registry

1. Create images on local machine. For

    docker build

2. Tag local image with registry 

    docker tag

3. Push local image to registry

    docker push

    registry: diberrycontainerregistry001
    registry resourcegroup:diberry-rg-container
    registry loginserver = diberrycontainerregistry001.azurecr.io
    registry username = diberrycontainerregistry001
    registry password = ntRFwOFd9AOmcEUvpOdTEMPwN6D/hTAS

## Create Azure Kubernetes service

1. Get credentials

    az aks get-credentials

1. Create service

    az aks create

1. List service

    az aks list

1. Verify creation

    kubectl get nodes

1. Create nodes in service

    kubectl apply -f dina-ta-language-aks.yml

1. Delete service

    az aks delete



<!--
### Configure basic settings

container name: sentiment-{username}
container image type: public
container image: mcr.microsoft.com/azure-cognitive-services/sentiment
Subscription: {your subscription}
Resource group: {your resource group}
Location: West US

### Specify container requirements

OS type: Linux
Number of cores: 1
Memory (GB): 2
Networking, Public IP address: yes
DNS name label: sentiment-{username}
Port: 5000
Open additional ports: No
Port protocol: TCP
Advanced, restart policy: Always
Environment variable: "Eula":"accept"
Add Additional environment variables: Yes
Environment variable: "Billing"="{Billing Endpoint URI}"
Environment variable: "ApiKey"="{Billing Key}"

![](../media/how-tos/container-instance/setting-container-environment-variables.png)
![](../media/how-tos/container-instance/container-instance-overview.png)
![](../media/how-tos/container-instance/running-instance-container-log.png)
![](../media/how-tos/container-instance/swagger-docs-on-container.png)

-->
