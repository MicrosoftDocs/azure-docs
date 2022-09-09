---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/24/2022
ms.author: glenga
---

>[!IMPORTANT]
>Azure Functions can run on the Azure App Service platform. In the App Service platform, plans that host Premium plan function apps are referred to as *Elastic* Premium plans, with SKU names like `EP1`. If you choose to run your function app on a Premium plan, make sure to create a plan with an SKU name that starts with "E", such as `EP1`. App Service plan SKU names that start with "P", such as `P1V2` (Premium V2 Small plan), are actually [Dedicated hosting plans](../articles/azure-functions/dedicated-plan.md). Because they are Dedicated and not Elastic Premium, plans with SKU names starting with "P" won't scale dynamically and may increase your costs.