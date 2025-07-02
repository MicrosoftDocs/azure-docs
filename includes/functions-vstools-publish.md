---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/29/2025
ms.author: glenga
ms.custom: devdivchpfy22
---

1. In **Solution Explorer**, right-click the project and select **Publish**. In **Target**, select **Azure**, and then select **Next**.

1. On **Specific target**, select **Azure Function App** and then select **Next**.  

1. On **Functions instance**, select **Create new**.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-functions-instance.png" alt-text="Screenshot that shows Create a new function app instance.":::

1. Create a new instance by using the values specified in the following table:

    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription name** | Name of your subscription | The Azure subscription to use. Accept this subscription or select a new one from the dropdown list. |
    | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which you want to create your function app. Select **New** to create a new resource group. You can also choose to use an existing resource group from the dropdown list. |
    | **[Plan Type](../articles/azure-functions/functions-scale.md)** | Flex Consumption | When you publish your project to a function app that runs in a [Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md), you might pay only for executions of your functions app. Other hosting plans can incur higher costs. |
    | **Operating system** | Linux | The Flex Consumption plan currently requires Linux. |
    | **Location** | Location of the app service | Select a **Location** in a [Azure region supported by the Flex Consumption plan](../articles/azure-functions/flex-consumption-how-to.md#view-currently-supported-regions). |
    | **Instance memory size** | 2048 | The [memory size of the virtual machine instances](../articles/azure-functions/flex-consumption-plan.md#instance-memory) in which the app runs, which is unique to the Flex Consumption plan. |  
    | **[Azure Storage](../articles/azure-functions/storage-considerations.md)** | General-purpose storage account | An Azure storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose to use an existing account that meets the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements).  |
    | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | Application Insights instance | You should enable Azure Application Insights integration for your function app. Select **New** to create a new instance, either in a new or in an existing Log Analytics workspace. You can also choose to use an existing instance.  |

    :::image type="content" source="./media/functions-vstools-publish/functions-vs-function-app.png" alt-text="Screenshot of the Create App Service dialog.":::

1. Select **Create** to create a function app and its related resources in Azure. The status of resource creation is shown in the lower-left corner of the window.

1. Select **Finish**, and then on the **Publish** tab select **Publish** to deploy the package that contains your project files to your new function app in Azure.

    When deployment is completed, the root URL of the function app in Azure is shown on the **Publish** tab.

1. On the **Publish** tab, in the **Hosting** section, select **Open in Azure portal**. The new function app Azure resource opens in the Azure portal.

    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Screenshot of the Publish success message.":::
