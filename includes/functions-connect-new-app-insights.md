---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/09/2020
ms.author: glenga
ms.custom: include file
---

Functions makes it easy to add Application Insights integration to a function app from the [Azure portal].

1. In the [Azure portal][Azure Portal], search for and select **function app**, and then choose your function app. 

1. Select the **Application Insights is not configured** banner at the top of the window. If you don't see this banner, then your app already has Application Insights enabled.

    :::image type="content" source="media/functions-connect-new-app-insights/enable-application-insights.png" alt-text="Enable Application Insights from the portal":::

1. Create an Application Insights resource by using the settings specified in the table below the image.

   :::image type="content" source="media/functions-connect-new-app-insights/ai-general.png" alt-text="Create an Application Insights resource":::

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Unique app name | It's easiest to use the same name as your function app, which must be unique in your subscription. | 
    | **Location** | West Europe | If possible, use the same [region](https://azure.microsoft.com/regions/) as your function app, or one that's close to that region. |

1. Select **Apply**. The Application Insights resource is created in the same resource group and subscription as your function app. After the resource is created, close the Application Insights window.

1. Back in your function app, select **Settings** > **Configuration**, and then select **Application settings**. If you see a setting named `APPINSIGHTS_INSTRUMENTATIONKEY`, Application Insights integration is enabled for your function app running in Azure.

[Azure Portal]: https://portal.azure.com
