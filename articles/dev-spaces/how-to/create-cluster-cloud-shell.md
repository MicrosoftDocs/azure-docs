---
title: "How to create a Kubernetes cluster enabled for Azure Dev Spaces using Azure Cloud Shell | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: ghogen
ms.author: ghogen
ms.date: "10/04/2018"
ms.topic: "article"
description: "Learn how to quickly create a Kubernetes cluster enabled for Azure Dev Spaces directly from your browser without installing anything."
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: douge
---
# Create a Kubernetes cluster using Azure Cloud Shell

You can use [Azure Cloud Shell](/azure/cloud-shell) to create a cluster for Azure Dev Spaces by using the **Try It** button from this page. If you aren't signed in, follow the prompts to sign in with an Azure account, then type the commands at the Azure Cloud Shell prompt when it appears.

## Create the cluster

First, create the resource group. Use one of the currently supported regions (EastUS, CentralUS, WestUS2, WestEurope, CanadaCentral, or CanadaEast).

```azurecli-interactive
az group create --name MyResourceGroup --location <region>
```

Create a Kubernetes cluster with the following command:

```azurecli-interactive
az aks create -g MyResourceGroup -n MyAKS --location <region> --kubernetes-version 1.11.2 --enable-addons http_application_routing
```

It takes a few minutes to create the cluster.  When complete, the output is shown in the JSON format. Look for `provisioningState` and verify it's `Succeeded`.

## Next steps

See [Azure Dev Spaces](/azure/dev-spaces/) for links to full tutorials.