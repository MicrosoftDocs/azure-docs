---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/01/2023
ms.author: glenga
---

These settings are only required when deploying from a private container registry:

+ [`DOCKER_REGISTRY_SERVER_URL`](../articles/app-service/reference-app-settings.md#custom-containers) 
+ [`DOCKER_REGISTRY_SERVER_USERNAME`](../articles/app-service/reference-app-settings.md#custom-containers) 
+ [`DOCKER_REGISTRY_SERVER_PASSWORD`](../articles/app-service/reference-app-settings.md#custom-containers) 
+ [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../articles/app-service/reference-app-settings.md#custom-containers)<sup>*</sup>  

<sup>*</sup>For container deployments, also set `WEBSITES_ENABLE_APP_SERVICE_STORAGE` to `false`, since your app content is provided in the container itself. 