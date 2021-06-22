---
author: baanders
description: include file for the process of publishing an Azure function from Visual Studio
ms.service: digital-twins
ms.topic: include
ms.date: 1/21/2021
ms.author: baanders
---

To publish the project to a function app in Azure, start in Solution Explorer. Right-click the project, and then choose **Publish**.

> [!IMPORTANT] 
> Publishing to a function app in Azure incurs additional charges on your subscription, independent of Azure Digital Twins.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-1.png" alt-text="Screenshot of Visual Studio, showing the right-click solution menu. In the menu, Publish is highlighted.":::

On the **Publish** page that opens, leave the default target selection of **Azure**. Then select **Next**. 

For a specific target, choose **Azure Function App (Windows)** and then select **Next**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-2.png" alt-text="Screenshot of Visual Studio, showing the Publish Azure function dialog. On the Specific target page, the selection is Azure Function App (Windows).":::

On the **Functions instance** tab, choose your subscription. Then select the plus (+) icon to create a new function.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-3.png" alt-text="Screenshot of Visual Studio, showing the Publish Azure function dialog. The plus icon is highlighted.":::

In the **Function App (Windows) - Create new** window, fill in the following fields:
* **Name** is the name of the consumption plan that Azure will use to host your Azure Functions app. This name will also apply to the function app that holds your actual function. You can choose a unique value or leave the default suggestion.
* Make sure the **Subscription** matches the subscription you want to use. 
* Make sure the **Resource group** is the one you want to use.
* Leave the **Plan type** selection as **Consumption**.
* Select the **Location** of your resource group.
* Create a new **Azure Storage** resource by selecting the **New** link. Set the location to match your resource group, use the other default values, and then select **OK**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-4.png" alt-text="Screenshot of Visual Studio, showing the Publish Azure function dialog page where the details of a new function app are being filled in.":::

Then select **Create**.

After the app service is created, the **Functions instance** tab opens. Your new function app appears in the **Function Apps** area beneath your resource group. Select **Finish**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-5.png" alt-text="Screenshot of Visual Studio, showing the Publish Azure function dialog where the Functions instance tab is selected.":::

On the **Publish** pane that opens in the main Visual Studio window, check that all the information looks correct. Then select **Publish**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-6.png" alt-text="Screenshot of Visual Studio, showing the Publish pane. The Publish button is highlighted.":::

> [!NOTE]
> If you see a pop-up window like the following example, select **Attempt to retrieve credentials from Azure** and then select **Save**.
> :::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-7.png" alt-text="Screenshot of Visual Studio, showing a pop-up window called Publish credentials." border="false":::
>
> If you see one of the following warnings, follow the prompts to upgrade to the latest Azure Functions runtime version:
> * "Upgrade Functions version on Azure."
> * "Your version of the functions runtime does not match the version running in Azure."
>
> These warnings might appear if you're using an old version of Visual Studio.

Your function app is now published to Azure.
