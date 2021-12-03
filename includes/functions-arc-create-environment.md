---
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 05/12/2021
ms.author: cephalin
---
## Create an App Service Kubernetes environment

Before you begin, you must [create an App Service Kubernetes environment](../articles/app-service/manage-create-arc-environment.md) for an Azure Arc-enabled Kubernetes cluster. 

> [!NOTE] 
> When you create the environment, make sure to make note of both the custom location name and the name of the resource group that contains the custom location. You can use these to find the custom location ID, which you'll need when creating your function app in the environment. 
>
> If you didn't create the environment, check with your cluster administrator.