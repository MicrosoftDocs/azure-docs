---
author: ggailey777
ms.service: azure-functions
ms.custom: linux-related-content
ms.topic: include
ms.date: 03/24/2025	
ms.author: glenga
---
> [!IMPORTANT]
> When creating your own containers, you're required to keep the base image of your container updated to the latest supported base image. Supported base images for Azure Functions are language-specific and are found in the [Azure Functions base image repos](https://mcr.microsoft.com/catalog?search=functions). 
>
> The Functions team is committed to publishing monthly updates for these base images. Regular updates include the latest minor version updates and security fixes for both the Functions runtime and languages. You should regularly update your container from the latest base image and redeploy the updated version of your container. For more information, see [Maintaining custom containers](../articles/azure-functions/container-concepts.md#maintaining-custom-containers).