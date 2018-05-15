---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---

## Configure your AKS cluster to use Azure Dev Spaces

Open a command window and enter the following Azure CLI commands, using the resource group that contains your AKS cluster, and your AKS cluster name:

   ```cmd
   az extension add --name dev-spaces-preview 
   az aks use-dev-spaces -g MyResourceGroup -n MyAKS
   ```
The first command installs an extension to the Azure CLI to add support for Azure Dev Spaces, and the second configures your cluster with support for Azure Dev Spaces.
