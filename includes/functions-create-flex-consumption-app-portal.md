---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.date: 05/03/2024
ms.author: glenga
ms.topic: include
---
1. In the [Azure portal](https://portal.azure.com), from the menu or the **Home** page, select **Create a resource**.

1. Select **Get started** and then **Create** under **Function App**.

1. Under **Select a hosting option**, choose **Flex Consumption** > **Select**.   

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription in which you create your new function app. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which you create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. Unsupported regions aren't displayed. For more information, see [View currently supported regions](../articles/azure-functions/flex-consumption-how-to.md#view-currently-supported-regions).|
    | **Runtime stack** | Preferred language | Choose one of the supported language runtime stacks. In-portal editing using Visual Studio Code for the Web is currently only available for Node.js, PowerShell, and Python apps. C# class library and Java functions must be [developed locally](../articles/azure-functions/functions-develop-local.md#local-development-environments).  |
    |**Version**| Language version | Choose a supported version of your language runtime stack. |
    |**Instance size** | Default | Determines the amount of instance memory allocated for each instance of your app. For more information, see [Instance memory](../articles/azure-functions/flex-consumption-plan.md#instance-memory).|

1. Accept the default options in the remaining tabs, including the default behavior of creating a new storage account on the **Storage** tab and a new Application Insight instance on the **Monitoring** tab. You can also choose to use an existing storage account or Application Insights instance. 
