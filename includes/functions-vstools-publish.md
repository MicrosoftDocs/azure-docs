---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/10/2025
ms.author: glenga
ms.custom:
  - devdivchpfy22
  - sfi-image-nochange
---

1. In **Solution Explorer**, right-click the project and then select **Publish**.

1. On the **Publish** page, make the following selections:
   - On **Target**, select **Azure**, and then select **Next**.
   - On **Specific target**, select **Azure Function App**, and then select **Next**.  
   - On **Functions instance**, select **Create new**.

   :::image type="content" source="media/functions-vstools-publish/visual-studio-tools-functions-instance.png" alt-text="Screenshot of the Publish page. In the Functions instance section, a resource group is visible, and Create new is highlighted.":::

1. Create a new instance by using the values specified in the following table:

   | Setting      | Value  | Description                                |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Name** | A globally unique name | The name must uniquely identify your new function app. Accept the suggested name or enter a new name. The following characters are valid: `a-z`, `0-9`, and `-`. |
   | **Subscription name** | The name of your subscription | The function app is created in an Azure subscription. Accept the default subscription or select a different one from the list. |
   | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | The name of your resource group |  The function app is created in a resource group. Select **New** to create a new resource group. You can also select an existing resource group from the list. |
   | **[Plan Type](../articles/azure-functions/functions-scale.md)** | **Flex Consumption** | When you publish your project to a function app that runs in a [Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md), you might pay only for executions of your functions app. Other hosting plans can incur higher costs.<blockquote>**IMPORTANT:**<br/>When creating a Flex Consumption plan, you must first select **App service plan** and then reselect **Flex Consumption** to clear an issue with the dialog.</blockquote> |
   | **Operating system** | **Linux** | The Flex Consumption plan currently requires Linux. |
   | **Location** | The location of the app service | Select a location in an [Azure region supported by the Flex Consumption plan](../articles/azure-functions/flex-consumption-how-to.md#view-currently-supported-regions). When an unsupported region is selected, the **Create** button is grayed-out. |
   | **Instance memory size** | **2048** | The [memory size of the virtual machine instances](../articles/azure-functions/flex-consumption-plan.md#instance-sizes) in which the app runs is unique to the Flex Consumption plan. |  
   | **[Azure Storage](../articles/azure-functions/storage-considerations.md)** | A general-purpose storage account | The Functions runtime requires a Storage account. Select **New** to configure a general-purpose storage account. You can also use an existing account that meets the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements).  |
   | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | An Application Insights instance | You should turn on Application Insights integration for your function app. Select **New** to create a new instance, either in a new or in an existing Log Analytics workspace. You can also use an existing instance.  |

   :::image type="content" source="./media/functions-vstools-publish/functions-vs-function-app.png" alt-text="Screenshot of the Function App Create new dialog. Fields for the name, subscription, resource group, plan, and other settings are filled in.":::

1. Select **Create** to create a function app and its related resources in Azure. The status of resource creation is shown in the lower-left corner of the window.

1. Select **Finish**. The **Publish profile creation progress** window appears. When the profile is created, select **Close**.

1. On the publish profile page, select **Publish** to deploy the package that contains your project files to your new function app in Azure.

   When deployment is complete, the root URL of the function app in Azure is shown on the publish profile page.

1. On the publish profile page, go to the **Hosting** section. Select the ellipsis (**...**), and then select **Open in Azure portal**. The new function app Azure resource opens in the Azure portal.

    :::image type="content" source="media/functions-vstools-publish/visual-studio-tools-functions-publish-complete.png" alt-text="Screenshot of the publish profile page. In the Hosting section, the ellipsis shortcut menu is open, and Open in Azure portal is highlighted." lightbox="media/functions-vstools-publish/visual-studio-tools-functions-publish-complete.png":::
