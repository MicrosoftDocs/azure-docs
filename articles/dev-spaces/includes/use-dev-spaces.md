---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: ghogen
ms.author: ghogen
ms.date: "05/11/2018"
ms.topic: "include"
manager: douge
---

### Configure your AKS cluster to use Azure Dev Spaces

Open a command window and enter the following Azure CLI command, using the resource group that contains your AKS cluster, and your AKS cluster name. The command configures your cluster with support for Azure Dev Spaces.

   ```cmd
   az aks use-dev-spaces -g MyResourceGroup -n MyAKS
   ```

