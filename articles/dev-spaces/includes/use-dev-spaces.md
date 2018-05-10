---
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---

1. Configure your AKS cluster to use Azure Dev Spaces. Open a command window and enter the following Azure CLI command, using the resource group that contains your AKS cluster, and your AKS cluster name:

   ```cmd
   az aks use-dev-spaces -g MyResourceGroup -n MyAKS
   ```
