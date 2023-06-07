---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/21/2023
ms.author: glenga
ms.custom: include file, devdivchpfy22
---

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Compute** > **Function App**.

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which you'll create your new function app. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which you'll create your function app. You should create a new resource group because there are [known limitations when creating new function apps in an existing resource group](../articles/azure-functions/functions-scale.md#limitations-for-creating-new-function-apps-in-an-existing-resource-group).|
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    | **Do you want to deploy code or container image?**| Code | Option to publish code files or a Docker container. |
    | **Runtime stack** | Preferred language | Choose a runtime that supports your favorite function programming language. In-portal editing is only available for JavaScript, PowerShell, TypeScript, and C# script. C# class library, Java, and Python functions must be [developed locally](../articles/azure-functions/functions-develop-local.md#local-development-environments).  |
    |**Version**| Version number | Choose the version of your installed runtime. |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. |
    |**Operating system**| Windows | An operating system is pre-selected for you based on your runtime stack selection, but you can change the setting if necessary. In-portal editing is only supported on Windows. |
    | **[Hosting options and plans](../articles/azure-functions/functions-scale.md)** | **Consumption (Serverless)** | Hosting plan that defines how resources are allocated to your function app. In the default **Consumption** plan, resources are added dynamically as required by your functions. In this [serverless](https://azure.microsoft.com/overview/serverless-computing/) hosting, you pay only for the time your functions run. When you run in an App Service plan, you must manage the [scaling of your function app](../articles/azure-functions/functions-scale.md).  |

1. Select **Next : Storage**. On the **Storage** page, enter the following settings:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Storage account](../articles/storage/common/storage-account-create.md)** |  Globally unique name | Creates a storage account used by your function app. The portal should suggest a storage account name between 3 and 24 characters in length with only numbers and lowercase letters. You can also use an existing account, which must meet the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements). |
    
1. Select **Next : Monitoring**. On the **Monitoring** page, enter the following settings:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Enable Application Insights** | Yes | Create an Application Insights resource connected to your function app.|
    | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | Instance name | Creates a named Application Insights resource. You can also choose an existing instance. |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's the same as or near to your function app. |

1. Select **Review + create** to review the app configuration selections.

1. On the **Review + create** page, review your settings, and then select **Create** to provision and deploy the function app.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

    :::image type="content" source="./media/functions-create-function-app-portal/function-app-create-notification-new.png" alt-text="Screenshot of deployment notification.":::
