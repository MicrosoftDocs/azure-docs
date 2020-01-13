---
title: include file
description: include file
services: functions
author: jeffhollan
ms.service: azure-functions
ms.topic: include
ms.date: 10/25/2019
ms.author: jehollan, glenga
ms.custom: include file
---

1. Open the Azure portal from [https://portal.azure.com](https://portal.azure.com)

1. Select the **Create a resource** button

    ![Create resource](./media/functions-create-function-app-portal/function-app-create-resource.png)

1. Select **Compute** > **Function App**.

    ![Create a function app in the Azure portal](./media/functions-premium-create/function-app-create-start.png)

1. Use the function app settings as specified in the table below the image.

    ![Basics](./media/functions-premium-create/function-app-create-basics.png)

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which this new function app is created. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which to create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Option to publish code files or a Docker container. |
    | **Runtime stack** | Preferred language | Choose a runtime that supports your favorite function programming language. Choose **.NET** for C# and F# functions. |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. |

    Select the **Next : Hosting >** button.

1. Enter the following hosting settings.

    ![Hosting](./media/functions-premium-create/function-app-premium-create-hosting.png)

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Storage account](../articles/storage/common/storage-account-create.md)** |  Globally unique name |  Create a storage account used by your function app. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also use an existing account, which must meet the [storage account requirements](../articles/azure-functions/functions-scale.md#storage-account-requirements). |
    |**Operating system**| Preferred operating system | An operating system is pre-selected for you based on your runtime stack selection, but you can change the setting if necessary. |
    | **[Plan](../articles/azure-functions/functions-scale.md)** | Premium | For Plan Type, select **Premium (Preview)** and select defaults for the *Windows Plan* and *Sku and size* selections. |

    Select the **Next : Monitoring >** button.

1. Enter the following monitoring settings.

    ![Monitoring](./media/functions-create-function-app-portal/function-app-create-monitoring.png)

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | Default | Creates an Application Insights resource of the same *App name* in the nearest supported region. By expanding this setting, you can change the **New resource name** or choose a different **Location** in an [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) where you want to store your data. |

    Select **Review + Create** to review the app configuration selections.

1. Select **Create** to provision and deploy the function app.