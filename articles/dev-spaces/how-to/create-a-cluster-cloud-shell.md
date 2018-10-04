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
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: douge
---
# Create a Kubernetes cluster enabled for Azure Dev Spaces using the Azure Cloud Shell

You can use the [Azure Cloud Shell](/azure/cloud-shell) by using the **Try It** button from this page.

Create the resource group. Use one of the currently supported regions (EastUS, CentralUS, WestUS2, WestEurope, CanadaCentral, or CanadaEast).

```azurecli-interactive
az group create --name MyResourceGroup --location <region>
```

Create a Kubernetes cluster with the following command:

```azurecli-interactive
az aks create -g MyResourceGroup -n MyAKS --location <region> --kubernetes-version 1.11.2 --enable-addons http_application_routing
```

It takes a few minutes to create the cluster.

## Next steps

See [Azure Dev Spaces](/azure/dev-spaces/) for links to full tutorials.