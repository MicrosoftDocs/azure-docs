---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/15/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

1. In **Solution Explorer**, right-click the project and select **Publish**. In **Target**, select **Azure** then **Next**.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-publish.png" alt-text="Screenshot of publish window.":::

1. Select **Azure Function App (Windows)** for the **Specific target**, which creates a function app that runs on Windows, and then select **Next**.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-specific-target.png" alt-text="Screenshot of publish window with specific target.":::

1. In the **Function Instance**, choose **Create a new Azure Function...**

    :::image type="content" source="media/functions-vstools-publish/functions-vs-functions-instance.png" alt-text="Screenshot of create a new function app instance.":::

1. Create a new instance using the values specified in the following table:

    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription to use. Accept this subscription or select a new one from the drop-down list. |
    | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which you want to create your function app. Select an existing resource group from the drop-down list or select **New** to create a new resource group.|
    | **[Plan Type](../articles/azure-functions/functions-scale.md)** | Consumption | When you publish your project to a function app that runs in a [Consumption plan](../articles/azure-functions/consumption-plan.md), you pay only for executions of your functions app. Other hosting plans incur higher costs. |
    | **Location** | Location of the app service | Choose a **Location** in a [region](https://azure.microsoft.com/regions/) near you or other services your functions access. |
    | **[Azure Storage](../articles/azure-functions/storage-considerations.md)** | General-purpose storage account | An Azure storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose an existing account that meets the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements).  |

    :::image type="content" source="./media/functions-vstools-publish/functions-vs-function-app.png" alt-text="Screenshot of Create App Service dialog.":::

1. Select **Create** to create a function app and its related resources in Azure. The status of resource creation is shown in the lower-left of the window.

1. In the **Functions instance**, make sure that the **Run from package file** is checked. Your function app is deployed using [Zip Deploy](../articles/azure-functions/functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](../articles/azure-functions/run-functions-from-deployment-package.md) mode enabled. Zip Deploy is the recommended deployment method for your functions project resulting in better performance.

    :::image type="content" source="media/functions-vstools-publish/functions-vs-publish-profile-step-4.png" alt-text="Screenshot of Finish profile creation.":::

1. Select **Finish**, and on the Publish page, select **Publish** to deploy the package containing your project files to your new function app in Azure.

    After the deployment completes, the root URL of the function app in Azure is shown in the **Publish** tab.
    
1.  In the Publish tab, in the Hosting section, choose **Open in Azure portal**. This opens the new function app Azure resource in the Azure portal.
    
    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Screenshot of Publish success message.":::
