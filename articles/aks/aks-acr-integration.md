---
title: Integrate Azure Container Registry with Azure Kubernetes Service
description: Learn how to provide access to images in your private container registry from Azure Kubernetes Service by using an Azure Active Directory service principal.
services: container-service
author: mlearned
manager: gwallace

ms.service: container-service
ms.topic: article
ms.date: 08/08/2018
ms.author: mlearned
---

# Authenticate with Azure Container Registry from Azure Kubernetes Service

When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), an authentication mechanism needs to be established. This article details the recommended configurations for authentication between these two Azure services.

You can set up the AKS to ACR authentication with the Azure CLI.  See [AKS with Azure CLI](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create) for information on using the Azure CLI with AKS.

## Before you begin

* You must currently be an **owner** of the **Azure subscription** to assign the appropriate roles required for the service principal
* You also need the Azure CLI version 2.0.70 or later
* You need [Docker installed](https://docs.docker.com/install/) on your client, and you need access to [dockerhub](https://hub.docker.com/)

## Create a new AKS cluster with ACR integration

You can set up AKS and ACR integration during the initial creation of your AKS cluster.  To allow an AKS cluster to interact with other Azure resources, an Azure Active Directory service principal is used. This service principal can be automatically created by the Azure CLI with the appropriate ACRPull role to allow the AKS cluster to pull images stored in ACR.  The following CLI command creates an ACR in the resource group you specify and configures the appropriate **ACrPull** role for the service principal. If the *acr-name* does not exist, a default ACR name of `aks-<cluster-name>-acr` is automatically created.  Supply valid values for your parameters below.
```
az aks create -n <your-kubernetes-cluster-name> -g <your-resource-group> -enable-acr [--acr <your-acr-name>]
```

Optionally, you can also specify **acr-resource-id** instead of **acr-name** with the following command.  Supply your valid values for the parameters below.
```
az aks create -n <your-Kubernetes-cluster-name>  -g <your-resource-group> --enable-acr [--acr-resource-id <your-acr-resource-id>]
```

## Create ACR integration for existing AKS clusters

For exisitng AKS clusters you can add integration with an existing ACR. The following commans do <TODO>  You must supply valid values for **acr-name** and **acr-resource-id** or the commands will fail.
```
az aks update -n <your-kubernetes-cluster-name> -g <your-resource-group> --enable-acr --acr <your-acr-name>
az aks create -n <your-kubernetes-cluster-name> -g <your-resource-group> --enable-acr --acr-resource-id <your-acr-resource-id>
```

## Verify the AKS and ACR integration
Ensure you have created and AKS cluster and added the ACR integration with the steps above.

Remove and update the AKS CLI preview extenstion
```
az extension remove --name aks-preview 
az extension add -y --name aks-preview
```

## Set variable and login to your ACR
```
acrloginservername=$(az acr show -n <your-kubernetes-cluster-name> -g <your-resource-group> --query loginServer -o tsv)
```

```
az acr login -n <your-acr-name>
```

## Pull an image from docker hub and push to your ACR

```
docker pull nginx
docker tag nginx $acrloginservername/nginx:v1
docker push someacr1.azurecr.io/nginx:v1
```

# Update the image property for teh nginx container
```
az aks get-credentials -g <your-resource-group> -n <your-kubernetes-cluster-name>
```

Update the image property with your ACR login server, image, and tag.

```
cat acr-nginx.yaml
```

## Update the state and verify pods
```
kubectl apply -f acr-nginx.yaml
kubectl get pods
```

<!-- LINKS - external -->
[AKS AKS CLI]:  https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create