---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/03/2022	
ms.author: glenga
---
> [!IMPORTANT]
> When using custom containers, you are required to keep the base image of your container updated to the latest supported base image. Supported base images for Azure Functions are language-specific and are found in Azure Functions base image repos, by language: 
>
> + [C# in-process](https://hub.docker.com/_/microsoft-azure-functions-base).
> + [C# isolated process](https://hub.docker.com/_/microsoft-azure-functions-dotnet-isolated)
> + [Java](https://hub.docker.com/_/microsoft-azure-functions-java)
> + [JavaScript/TypeScript](https://hub.docker.com/_/microsoft-azure-functions-node) 
> + [PowerShell](https://hub.docker.com/_/microsoft-azure-functions-powershell)
> + [Python](https://hub.docker.com/_/microsoft-azure-functions-python)
>
> The Functions team is committed to publishing monthly updates for these base images. Regular updates include the latest minor version updates and security fixes for both the Functions runtime and languages. For custom containers, you should regularly update the base image in the Dockerfile, rebuild, and redeploy updated versions of your custom containers. 
