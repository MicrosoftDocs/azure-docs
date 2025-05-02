---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/04/2024
ms.author: glenga
ms.custom: include file, devdivchpfy22
---

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Function App**.

1. Under **Select a hosting option**, select **Flex Consumption** > **Select** to create your app in the default **Flex Consumption** plan. In this [serverless](https://azure.microsoft.com/overview/serverless-computing/) hosting option, you pay only for the time your functions run. To learn more about different hosting plans, see [Overview of plans](../articles/azure-functions/functions-scale.md#overview-of-plans). 

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which you create your new function app. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which you create your function app. You should create a new resource group because there are [known limitations when creating new function apps in an existing resource group](../articles/azure-functions/functions-scale.md#limitations-for-creating-new-function-apps-in-an-existing-resource-group).|
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. |
    | **Runtime stack** | Preferred language | Choose a runtime that supports your favorite function programming language. In-portal editing is only available for JavaScript, PowerShell, Python, TypeScript, and C# script.<br/>To create a C# Script app that supports in-portal editing, you must choose a runtime **Version** that supports the **in-process model**.<br/>C# class library and Java functions must be [developed locally](../articles/azure-functions/functions-develop-local.md#local-development-environments).  |
    |**Version**| Version number | Choose the version of your installed runtime. |
    |**Instance Size**| 2048 MB | The instance memory size used for each instance of the app as it scales. |

1. Accept the default options in the remaining tabs, including the default behavior of creating a new storage account on the **Storage** tab and a new Application Insights instance on the **Monitoring** tab. You can also choose to use an existing storage account or Application Insights instance, and change Azure OpenAI, Networking, Deployment, and Authentication settings.

1. Select **Review + create** to review the app configuration you chose, and then select **Create** to provision and deploy the function app.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

    :::image type="content" source="./media/functions-create-function-app-portal/function-app-create-notification-new.png" alt-text="Screenshot of deployment notification.":::
