---
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---

## Create a Kubernetes cluster enabled for Azure Dev Spaces

You must use Kubernetes 1.96.

1. In the [Azure portal](https://portal.azure.com), ...

   ![](media/common/aks-create-cluster.png)

1. Make sure that Http Application Routing is enabled.

> [!IMPORTANT]
> You must be sure to enable Http Application Routing when you create your AKS cluster. It is not possible to change this setting later.
