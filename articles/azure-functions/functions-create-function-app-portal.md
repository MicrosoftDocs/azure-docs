---
title: Create a function app in the Azure portal
description: Learn how to create a function app for serverless execution in Azure Functions using the Azure portal.
ms.topic: how-to
ms.date: 05/08/2025
zone_pivot_groups: functions-hosting-plan-dynamic
---

# Create a function app in the Azure portal

This article shows you how to use the Azure portal to create a function app that's hosted in Azure Functions. These hosting plan options, which support dynamic, event-driven scaling, are featured:

| Hosting option | Description |
| ----- | ----- |
| [Flex Consumption plan](./flex-consumption-plan.md) | Linux-only plan that provides rapid horizontal scaling with support for managed identities, virtual networking, and pay-as-you-go billing. |
| [Premium plan](./functions-premium-plan.md) | Provides longer execution times, more control over CPU/memory, and support for containers and virtual networks. |
| [Consumption plan](./consumption-plan.md) | Original dynamic hosting plan, which supports portal development for some languages. |

Choose your preferred hosting plan at the [top](#top) of the article. For more information about all supported hosting options, see [Azure Functions hosting options](functions-scale.md).  

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources. 

Use these steps to create your function app and related Azure resources in the Azure portal. 

::: zone pivot="flex-consumption-plan"
1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Function App**.

1. Under **Select a hosting option**, select **Flex Consumption** > **Select** to create your app in a [Flex Consumption plan](flex-consumption-plan.md). In this [serverless](https://azure.microsoft.com/overview/serverless-computing/) hosting option, you pay only for the time your functions run. To learn more about different hosting plans, see [Overview of plans](functions-scale.md#overview-of-plans). 

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which you create your new function app. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which you create your function app. You should create a new resource group because there are [known limitations when creating new function apps in an existing resource group](functions-scale.md#limitations-for-creating-new-function-apps-in-an-existing-resource-group).|
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. |
    | **Runtime stack** | Preferred language | Choose a runtime that supports your favorite function programming language.  |
    |**Version**| Version number | Choose the version of your installed runtime. |
    |**Instance Size**| 2048 MB | The instance memory size used for each instance of the app as it scales. |

1. Accept the default options in the remaining tabs, including the default behavior of creating a new storage account on the **Storage** tab and a new Application Insights instance on the **Monitoring** tab. You can also choose to use an existing storage account or Application Insights instance, and change Azure OpenAI, Networking, Deployment, and Authentication settings.

1. Select **Review + create** to review the app configuration you chose, and then select **Create** to provision and deploy the function app.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

    :::image type="content" source="../../includes/media/functions-create-function-app-portal/function-app-create-notification-new.png" alt-text="Screenshot of deployment notification.":::
::: zone-end
::: zone pivot="consumption-plan"
[!INCLUDE [Create Consumption plan app Azure portal](../../includes/functions-create-function-app-portal.md)]
::: zone-end
::: zone pivot="premium-plan"
[!INCLUDE [Create Premium plan app Azure portal](../../includes/functions-premium-create.md)]
::: zone-end

## Next steps

[!INCLUDE [functions-quickstarts-infra-next-steps](../../includes/functions-quickstarts-infra-next-steps.md)]
