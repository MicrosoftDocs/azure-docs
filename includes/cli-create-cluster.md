---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: ghogen
ms.author: ghogen
ms.date: "09/26/2018"
ms.topic: "include"
manager: douge
---

## Create a Kubernetes cluster enabled for Azure Dev Spaces

At the command prompt, create the resource group. Use one of the currently supported regions (EastUS, CentralUS, WestUS2, WestEurope, CanadaCentral, or CanadaEast).

```cmd
az group create --name MyResourceGroup --location <region>
```

Create a Kubernetes cluster with the following command:

```cmd
az aks create -g MyResourceGroup -n MyAKS --location <region> --kubernetes-version 1.11.2
```

It takes a few minutes to create the cluster.