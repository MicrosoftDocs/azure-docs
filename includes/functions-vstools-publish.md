---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/30/2024
ms.author: glenga
ms.custom: devdivchpfy22
---

1. In **Solution Explorer**, right-click the project and select **Publish**. In **Target**, select **Azure**, and then select **Next**.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-publish.png" alt-text="Screenshot of the publish pane.":::

1. On **Specific target**, select **Azure Function App (Windows)**. A function app that runs on Windows is created. Select **Next**.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-specific-target.png" alt-text="Screenshot of publish pane that has a specific target.":::

1. On **Functions instance**, select **Create a new Azure Function**.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-functions-instance.png" alt-text="Screenshot that shows Create a new function app instance.":::

1. Create a new instance by using the values specified in the following table:

    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription to use. Accept this subscription or select a new one from the dropdown list. |
    | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which you want to create your function app. Select **New** to create a new resource group. You can also choose to use an existing resource group from the dropdown list. |
    | **[Plan Type](../articles/azure-functions/functions-scale.md)** | Consumption | When you publish your project to a function app that runs in a [Consumption plan](../articles/azure-functions/consumption-plan.md), you pay only for executions of your functions app. Other hosting plans incur higher costs. |
    | **Location** | Location of the app service | Select a **Location** in an [Azure region](https://azure.microsoft.com/regions/) near you or other services your functions access. |
    | **[Azure Storage](../articles/azure-functions/storage-considerations.md)** | General-purpose storage account | An Azure storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose to use an existing account that meets the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements).  |
    | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | Application Insights instance | You should enable Azure Application Insights integration for your function app. Select **New** to create a new instance, either in a new or in an existing Log Analytics workspace. You can also choose to use an existing instance.  |

    :::image type="content" source="./media/functions-vstools-publish/functions-vs-function-app.png" alt-text="Screenshot of the Create App Service dialog.":::

1. Select **Create** to create a function app and its related resources in Azure. The status of resource creation is shown in the lower-left corner of the window.

1. On **Functions instance**, make sure that the **Run from package file** checkbox is selected. Your function app is deployed by using [Zip Deploy](../articles/azure-functions/functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](../articles/azure-functions/run-functions-from-deployment-package.md) mode enabled. Zip Deploy is the recommended deployment method for your functions project for better performance.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-publish-profile-step-4.png" alt-text="Screenshot of the Finish profile creation pane.":::

1. Select **Finish**, and on the **Publish** pane, select **Publish** to deploy the package that contains your project files to your new function app in Azure.

    When deployment is completed, the root URL of the function app in Azure is shown on the **Publish** tab.

1. On the **Publish** tab, in the **Hosting** section, select **Open in Azure portal**. The new function app Azure resource opens in the Azure portal.

    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Screenshot of the Publish success message.":::
