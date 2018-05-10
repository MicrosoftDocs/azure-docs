---
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---
## Create a Kubernetes development environment in Azure
With Azure Dev Spaces, you can create Kubernetes-based environments that are fully managed by Azure and optimized for development. The command creates an environment named `mydevenvironment` in `eastus`.
```cmd
az aks create --name mydevenvironment --location eastus
```

Supported locations: `eastus`, `westeurope`

> [!Note]
> This command takes about 6 minutes. You can continue this guide without waiting.
