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

1. Install [Git](https://git-scm.com/downloads) for your operating system so you can clone the sample used in this procedure. 
1. Install [Azure cli](../../../azure/install-azure-cli?view=azure-cli-latest.md). 
1. Install [Docker engine](https://www.docker.com/products/docker-engine) and validate that the docker cli works in a terminal.
1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/). 
1. Have a valid Azure subscription. The trial and pay-as-you-go subscriptions will both work. 

## Running the sample 

This procedure loads and runs the Cognitive Services Container sample for language detection. 

* The sample has two images, one for the website with its own API. This website is equivalent to your own client-side application that makes requests of the language detection endpoint. The second image is the language detection image returning the detected language of text. 
* Both these images need to be pushed to your own Azure Container Registry.
* Once they are on your own Azure Container Registry, you create an Azure Kubernetes service to access these images and run the containers.
* Once the containers are running, use the kubectl cli to watch the containers performance.
* Access the website (client-application) with an HTTP request and see the results. 


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

## Get website docker image 

1. The sample code for the language detection container is in the Cognitive Services container repository. Clone the repository to have a local copy of the sample.

    ```console
    git clone https://github.com/Azure-Samples/cognitive-services-containers-samples
    ```

    Once the repository is on your local computer, find the website in the [\dotnet\Language\FrontendService](https://github.com/Azure-Samples/cognitive-services-containers-samples/tree/master/dotnet/Language/FrontendService) directory. There is also a python version if you are comfortable with that language instead. This website acts as the client application.  

1. Build the docker image for this website. Make sure the console is in the FrontendService directory when you run the following command:

    ```console
    docker build -t ta-lang-frontend  .
    ```

1. Verify the image is in the images list:

    ```console
    docker images
    ```

    The response includes the new image:

    ```console
    PS C:\Users\diberry\repos\cognitive-services-containers-samples\dotnet\Language\FrontendService> docker images
    REPOSITORY                      TAG                      IMAGE ID            CREATED             SIZE
    ta-lang-frontend                latest                   0faab2f01682        1 minute ago        1.85GB
    ```

1. Tag image with your Azure Container registry. The format of the command is:

    `docker tag <local-repository-value>:<local-repository-tag> <your-container-registry>/<repository>:<tag>`

    Locally your image probably has the tag of latest. In order to track the version on the Container Registry, change the tag to a version format. For this simple example, use `v1`. 

    ```console
    docker tag ta-lang-frontend:latest pattiowenscogservcontainerregistry.azurecr.io/ta-lang-frontend:v1
    ```

1. Push the image to the Azure Container registry. 

    ```console
    docker push pattiowenscogservcontainerregistry.azurecr.io/ta-lang-frontend:v1
    ```

1. Verify the image is in your Container registry. On the Azure portal, on your Container registry, verify the repositories list has this new repository named **ta-lang-frontend**. 

1. Select the **ta-lang-frontend** repository, verify that the only tag in the list is **v1**.


## Get language detection image 

From the local terminal or console, pull the docker image to the local machine. This command pulls down the latest version. 

```console
docker pull mcr.microsoft.com/azure-cognitive-services/language:latest
```

## Tag and movimages for Azure Container Registry

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
