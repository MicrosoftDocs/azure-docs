---
title: Create a function app in the Azure portal
description: Learn how to create a function app for serverless execution in Azure Functions using the Azure portal.
ms.topic: how-to
ms.date: 08/03/2026
zone_pivot_groups: functions-hosting-plan
---

# Create a function app in the Azure portal

This article shows you how to use the Azure portal to create a function app that's hosted in Azure Functions. These hosting plan options, which support dynamic, event-driven scaling, are featured:

| Hosting option | Description |
| ----- | ----- |
| [Flex Consumption plan](./flex-consumption-plan.md) | Linux-only plan that provides rapid horizontal scaling with support for managed identities, virtual networking, and pay-as-you-go billing. |
| [Premium plan](./functions-premium-plan.md) | Provides longer execution times, more control over CPU and memory, and support for containers and virtual networks. |
| [Consumption plan](./consumption-plan.md) | Legacy dynamic hosting plan that supports Windows apps. |
| [Dedicated (App Service) plan](./dedicated-plan.md) | Not covered in this article. See [Create an App Service app in the Azure portal](../app-service/quickstart-custom-container.md). |
| [Container Apps](../container-apps/functions-container-apps.md) | Not covered in this article. See [Create a function app on Azure Container Apps](../container-apps/functions-container-apps.md). |

The Flex Consumption plan is the recommended plan for hosting serverless compute resources in Azure.

Choose your preferred hosting plan at the [top](#top) of the article. For more information about all supported hosting options, see [Azure Functions hosting options](functions-scale.md).  

::: zone-end

::: zone pivot="flex-consumption-plan,consumption-plan,premium-plan"

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) by using your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources. 

Use these steps to create your function app and related Azure resources in the Azure portal. 

::: zone-end

::: zone pivot="flex-consumption-plan"
[!INCLUDE [functions-create-flex-consumption-app-portal-full](../../includes/functions-create-flex-consumption-app-portal-full.md)] 
::: zone-end
::: zone pivot="consumption-plan"
[!INCLUDE [Create Consumption plan app Azure portal](../../includes/functions-create-function-app-portal.md)]
::: zone-end
::: zone pivot="premium-plan"
[!INCLUDE [Create Premium plan app Azure portal](../../includes/functions-premium-create.md)]
::: zone-end

::: zone pivot="dedicated-plan"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

Create function apps in the Dedicated (App Service) plan by using the standard App Service creation flow. For guidance, see [Create an App Service app in the Azure portal](../app-service/quickstart-custom-container.md).

::: zone-end

::: zone pivot="container-apps"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

Function apps hosted on Azure Container Apps use a different creation flow. For guidance, see [Create a function app on Azure Container Apps](../container-apps/functions-container-apps.md).

::: zone-end

## Next steps

[!INCLUDE [functions-quickstarts-infra-next-steps](../../includes/functions-quickstarts-infra-next-steps.md)]
