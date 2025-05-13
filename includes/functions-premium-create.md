---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/24/2020
ms.author: glenga
---

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Compute** > **Function App**.

1. Under **Select a hosting option**, select **Functions Premium** > **Select** to create your app in a [Premium plan](../articles/azure-functions/functions-premium-plan.md). In this [serverless](https://azure.microsoft.com/overview/serverless-computing/) hosting option, you pay only for the time your functions run. To learn more about different hosting plans, see [Overview of plans](../articles/azure-functions/functions-scale.md#overview-of-plans). 

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which this new function app is created. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which to create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Do you want to deploy code or container image?**| Code | Option to publish code files or a Docker container. |
    | **Operating system** | Preferred OS | Choose either Linux or Windows. |
    | **Runtime stack** | Preferred language | Choose a runtime that supports your favorite function programming language. |
    | **Version** | Supported language version | Choose a supported version of your function programming language. |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. |

1. Under **Environment details** for either **Windows Plan** or **Linux Plan**, select **Create new**, **Name** your App Service plan, and select a **Pricing plan**. The default pricing plan is **EP1**, where EP stands for _elastic premium_. To learn more, see the [list of Premium SKUs](../articles/azure-functions/functions-premium-plan.md#available-instance-skus). When running JavaScript functions on a Premium plan, you should choose an instance that has fewer vCPUs. For more information, see [Choose single-core Premium plans](../articles/azure-functions/functions-reference-node.md#considerations-for-javascript-functions). 

1. Unless you want to enable [**Zone Redundancy**](/azure/reliability/reliability-functions), keep the default value of **Disabled**.    

1. Select **Next: Storage**. On the **Storage** page, create the default host [storage account](../articles/storage/common/storage-account-create.md) required by your function app. Storage account names must be between 3 and 24 characters in length and only can contain numbers and lowercase letters. You can also use an existing account, which must meet the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements).

1. Unless you're enabling virtual network integration, select **Next: Monitoring** to skip the **Networking** tab. On the **Monitoring** page, enter the following settings:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | Enable Application Insights | Yes | Enables built-in Application Insight integration for monitoring your functions code. | 
    | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | Default | Creates an Application Insights resource of the same *App name* in the nearest supported region. By expanding this setting, you can change the **New resource name** or choose a different **Location** in an [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) to store your data.|

1. Select **Review + create** to accept the defaults for the remaining pages and review the app configuration selections.

1. On the **Review + create** page, review your settings, and then select **Create** to provision and deploy the function app.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

    ![Deployment notification](./media/functions-premium-create/function-app-create-notification2.png)
