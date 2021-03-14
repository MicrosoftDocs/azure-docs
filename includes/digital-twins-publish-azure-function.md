---
author: baanders
description: include file for the process of publishing an Azure function from Visual Studio
ms.service: digital-twins
ms.topic: include
ms.date: 1/21/2021
ms.author: baanders
---

To publish the project to a function app in Azure, right-select the project in *Solution Explorer* and choose **Publish**.

> [!IMPORTANT] 
> Publishing to a function app in Azure incurs additional charges on your subscription, independent of Azure Digital Twins.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-1.png" alt-text="Screenshot of Visual Studio showing the right-select solution menu. Publish is highlighted in the menu.":::

In the *Publish* page that follows, leave the default target selection of **Azure** and select *Next*. 

For a specific target, choose **Azure Function App (Windows)** and select *Next*.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-2.png" alt-text="Screenshot of Visual Studio in the Publish Azure function dialog. Azure Function App (Windows) is selected on the Specific target page.":::

On the *Functions instance* page, choose your subscription. Then select the *+* icon to create a new Azure Function.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-3.png" alt-text="Screenshot of Visual Studio in the Publish Azure function dialog. The + button to create a new function is highlighted on the Functions instance page.":::

In the *Function App (Windows) - Create new* window, fill in the fields as follows:
* **Name** is the name of the consumption plan that Azure will use to host your Azure Functions app. This will also become the name of the function app that holds your actual function. You can choose your own unique value or leave the default suggestion.
* Make sure the **Subscription** matches the subscription you want to use 
* Make sure the **Resource group** to the resource group you want to use
* Leave the **Plan type** as *Consumption*
* Select the **Location** that matches the location of your resource group
* Create a new **Azure Storage** resource using the *New...* link. Set the location to match your resource group, use the other default values, and select "Ok".

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-4.png" alt-text="Screenshot of Visual Studio in the Publish Azure function dialog. The details of a new function app are being filled in, including Name, Subscription, Resource group, Plan Type, Location, and Azure Storage.":::

Then, select **Create**.

After a short wait while the app service is created, the dialog should return to the *Functions instance* page, with your new function app appearing in the **Function Apps** area nested underneath your resource group. Select *Finish*.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-5.png" alt-text="Publish Azure function in Visual Studio: Functions instance (after function app)":::

On the *Publish* pane that opens back in the main Visual Studio window, check that all the information looks correct and select **Publish**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-6.png" alt-text="Screenshot of Visual Studio in the Publish Azure function dialog. The new function app shows up in the list of function apps and there is a Finish button.":::

> [!NOTE]
> If you see a popup like this: 
> :::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-7.png" alt-text="Screenshot of Visual Studio pop-up window called Publish credentials. It contains fields for a Username and Password, and a button to Attempt to retrieve credentials from Azure." border="false":::
> Select **Attempt to retrieve credentials from Azure** and **Save**.
>
> If you see a warning to *Upgrade Functions version on Azure* or that *Your version of the functions runtime does not match the version running in Azure*:
>
> Follow the prompts to upgrade to the latest Azure Functions runtime version. This issue might occur if you're using an older version of Visual Studio.

Your function app is now published to Azure.