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

The most common approach is to [grant access using the AKS service principal](#grant-aks-access-to-acr).

You can set up the AKS to ACR authentication with either the CLI or the Azure portal.

## Prerequisites

* You must currently be an owner of the subscription to assign the appropriate roles to the service principal

## Create AKS and ACR integration with CLI during new cluster creation

You can set up AKS and ACR integration during initial creation with the CLI.  The following command creates an ACR in the resource group created by the user with acrpull permissions. If acr-name does not exits, a default ACR name of `aks-<cluster-name>-acr` is automatically created.  
```azurecli-interactive
az aks create -n <kubernetes-cluster-name> -g <resource-group> -enable-acr [--acr-name <acr-name>] 
```

Optionally, You can also specify **acr-resource-id** instead of **acr-name** with the following command:
```azurecli-interactive
az aks create -n <cluster-name>  -g <resource-group> --enable-acr [--acr-resource-id <acr-resource-id>]
```

## Create ACR integration for existing AKS clusters
For exisitng AKS clusters you can add integration with an existing ACR. The following commans do <TODO>  You must supply valid values for acr-name and acr-resource-id or the commands will fail.
```azurecli-interactive
az aks update –n <kubernetes-cluster-name> -g <resource-group> --enable-acr --acr-name <acr-name>
az aks create –n <kubernetes-cluster-name> -g <resource-group> --enable-acr --acr-resource-id <acr-resource-id> 
```

<!-- LINKS - external -->
[AKS AKS CLI]:  https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-create
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[image-pull-secret]: https://kubernetes.io/docs/concepts/configuration/secret/#using-imagepullsecrets
