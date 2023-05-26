---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/03/2022	
ms.author: glenga
---
> [!IMPORTANT]
> When creating your own containers, you are required to keep the base image of your container updated to the latest supported base image. Supported base images for Azure Functions are language-specific and are found in the [Azure Functions base image repos](https://mcr.microsoft.com/catalog?search=functions). 
>
> The Functions team is committed to publishing monthly updates for these base images. Regular updates include the latest minor version updates and security fixes for both the Functions runtime and languages. For containers, you should regularly update the base image in the Dockerfile, rebuild, and redeploy updated versions of your containers. 
