---
author: greg-lindsay
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: include
ms.date: 08/14/2023
ms.author: greglin
---
> [!Note]
> When the ALB Controller creates the Application Gateway for Containers resources in ARM, it'll use the following naming convention for a frontend resource: fe-\<8 randomly generated characters\>
>
> If you would like to change the name of the frontend created in Azure, consider following the [bring your own deployment strategy](../articles/application-gateway/for-containers/overview.md#deployment-strategies).
