---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/06/2019
ms.author: glenga
ms.custom: include file
---

Functions makes it simple to add Application Insights integration to a function app from the [Azure portal].

1. In the [portal][Azure Portal], select **All services > Function Apps**, select your function app, and then choose the **Application Insights** banner at the top of the window

    ![Enable Application Insights from the portal](media/functions-connect-new-app-insights/enable-application-insights.png)

1. Create an Application Insights resource by using the settings specified in the table below the image:

   ![Create an Application Insights resource](media/functions-connect-new-app-insights/ai-general.png)

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Unique app name | It's easiest to use the same name as your function app, which must be unique in your subscription. | 
    | **Location** | West Europe | If possible, use the same [region](https://azure.microsoft.com/regions/) as your function app, or near to it. |

1. Choose **OK**. The Application Insights resource is created in the same resource group and subscription as your function app. After creation completes, close the Application Insights window.

1. Back in your function app, select **Application settings**, and scroll down to **Application settings**. When you see a setting named `APPINSIGHTS_INSTRUMENTATIONKEY`, it means that Application Insights integration is enabled for your function app running in Azure.

[Azure Portal]: https://portal.azure.com
