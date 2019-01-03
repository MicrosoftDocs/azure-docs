---
title: Run Container Instances
titleSuffix: Text Analytics -  Azure Cognitive Services
description: 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 01/03/2019
ms.author: diberry
---

## Prerequisites

1. Install azure command line and validate that the cli works in a terminal. 
1. Install docker engine and validate that the docker cli works in a terminal.
1. Install kubectl and validate that the kubectl cli works in a terminal. 
1. Have valid Azure subscription. The trial subscription will work. 

## Create Azure Container Registry service

The steps in this section are performed from a terminal or command line. If you are using an enhanced terminal, validate that the azure command line is available. 

1. Login to Azure

    ```cli
    az login
    ```

2. Create resource group to hold every created in tutorial

    ```cli
    az group create --name cogserv-container-rg --location westus
    ```

3. Create Azure Container Registry

    `az acr create --resource-group cogserv-container-rg --name cogservcontainerregistry --sku Basic`

    save results to get:
        loginServer property:
        name property:

    ```{
    "adminUserEnabled": false,
    "creationDate": "2019-01-02T23:49:53.783549+00:00",
    "id": "/subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/cogserv-container-rg/providers/Microsoft.ContainerRegistry/registries/cogservcontainerregistry",
    "location": "westus",
    "loginServer": "cogservcontainerregistry.azurecr.io",
    "name": "cogservcontainerregistry",
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
    }```

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
