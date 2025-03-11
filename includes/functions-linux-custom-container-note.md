---
author: ggailey777
ms.service: azure-functions
ms.custom: linux-related-content
ms.topic: include
ms.date: 10/03/2022	
ms.author: glenga
---
> [!IMPORTANT]
> When creating your own containers, you are required to keep the base image of your container updated to the latest supported base image. Supported base images for Azure Functions are language-specific and are found in the [Azure Functions base image repos](https://mcr.microsoft.com/catalog?search=functions). 
>
> The Functions team is committed to publishing monthly updates for these base images. Regular updates include the latest minor version updates and security fixes for both the Functions runtime and languages. You should regularly update your container from the latest base image and redeploy the updated version of your container.
>
> For non-containerized deployments, your app is kept up to date automatically by the regular updates the Functions team releases. For such apps, when we release a new minor or patch version of the Functions Host, your app will organically pick that version up. When creating your own containerized deployment, the responsibility is yours to ensure that you're staying up to date with our released images. In addition to new features and improvements, these regular updates can also include critical security updates. To ensure your app is protected, you should make sure you're staying up to date.
>
> In some cases, we're required to make platform level changes that may mean that **very old image versions may stop working properly**. For such changes, we ensure that we roll out updated images well in advance ensuring that apps that take regular updates won't be affected. Our guidance is that you should ensure that you're not falling more than a few minor version releases behind. If during a support case it's determined that your app is experiencing problems because it's on an old unsupported version, support will ask you to move forward to the latest minor version.