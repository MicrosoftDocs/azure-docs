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
* You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create AKS and ACR integration with CLI during new cluster creation

You can set up AKS and ACR integration during the initial creation of your AKS cluster.  The following CLI command creates an ACR in the resource group you specify with acrpull permissions. If the *acr-name* does not exist, a default ACR name of `aks-<cluster-name>-acr` is automatically created.  Supply valid values for your parameters below.
```azurecli-interactive
az aks create -n <your-kubernetes-cluster-name> -g <your-resource-group> -enable-acr [--acr-name <your-acr-name>]
```

Optionally, you can also specify **acr-resource-id** instead of **acr-name** with the following command.  Supply your valid values for the parameters below.
```azurecli-interactive
az aks create -n <your-Kubernetes-cluster-name>  -g <your-resource-group> --enable-acr [--acr-resource-id <your-acr-resource-id>]
```

## Create ACR integration for existing AKS clusters

For exisitng AKS clusters you can add integration with an existing ACR. The following commans do <TODO>  You must supply valid values for **acr-name** and **acr-resource-id** or the commands will fail.
```azurecli-interactive
az aks update -n <your-kubernetes-cluster-name> -g <your-resource-group> --enable-acr --acr-name <your-acr-name>
az aks create -n <your-kubernetes-cluster-name> -g <your-resource-group> --enable-acr --acr-resource-id <your-acr-resource-id>
```

<!-- LINKS - external -->
[AKS AKS CLI]:  https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-create