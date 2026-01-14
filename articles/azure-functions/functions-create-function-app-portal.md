---
title: Create a function app in the Azure portal
description: Learn how to create a function app for serverless execution in Azure Functions using the Azure portal.
ms.topic: how-to
ms.date: 09/22/2025
zone_pivot_groups: functions-hosting-plan-dynamic
---

# Create a function app in the Azure portal

This article shows you how to use the Azure portal to create a function app that's hosted in Azure Functions. These hosting plan options, which support dynamic, event-driven scaling, are featured:

| Hosting option | Description |
| ----- | ----- |
| [Flex Consumption plan](./flex-consumption-plan.md) | Linux-only plan that provides rapid horizontal scaling with support for managed identities, virtual networking, and pay-as-you-go billing. |
| [Premium plan](./functions-premium-plan.md) | Provides longer execution times, more control over CPU/memory, and support for containers and virtual networks. |
| [Consumption plan](./consumption-plan.md) | Original dynamic hosting plan, which supports portal development for some languages. |

The Flex Consumption plan is the recommended plan for hosting serverless compute resources in Azure.

Choose your preferred hosting plan at the [top](#top) of the article. For more information about all supported hosting options, see [Azure Functions hosting options](functions-scale.md).  

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources. 

Use these steps to create your function app and related Azure resources in the Azure portal. 

::: zone pivot="flex-consumption-plan"
[!INCLUDE [functions-create-flex-consumption-app-portal-full](../../includes/functions-create-flex-consumption-app-portal-full.md)] 
::: zone-end
::: zone pivot="consumption-plan"
[!INCLUDE [Create Consumption plan app Azure portal](../../includes/functions-create-function-app-portal.md)]
::: zone-end
::: zone pivot="premium-plan"
[!INCLUDE [Create Premium plan app Azure portal](../../includes/functions-premium-create.md)]
::: zone-end

## Next steps

[!INCLUDE [functions-quickstarts-infra-next-steps](../../includes/functions-quickstarts-infra-next-steps.md)]
