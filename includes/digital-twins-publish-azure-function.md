---
author: baanders
description: include file for the process of publishing an Azure function from Visual Studio
ms.service: digital-twins
ms.topic: include
ms.date: 1/21/2021
ms.author: baanders
---

To publish the project to a function app in Azure, right-select the project in *Solution Explorer* and choose **Publish**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-1.png" alt-text="Visual Studio: publish project":::

In the *Publish* page that follows, leave the default target selection of **Azure** and hit *Next*. 

For a specific target, choose **Azure Function App (Windows)** and hit *Next*.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-2.png" alt-text="Publish Azure function in Visual Studio: specific target":::

On the *Functions instance* page, choose your subscription. This should populate a box with the *resource groups* in your subscription.

Select your instance's resource group and hit *+* to create a new Azure Function.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-3.png" alt-text="Publish Azure function in Visual Studio: Functions instance (before function app)":::

In the *Function App (Windows) - Create new* window, fill in the fields as follows:
* **Name** is the name of the consumption plan that Azure will use to host your Azure Functions app. This will also become the name of the function app that holds your actual function. You can choose your own unique value or leave the default suggestion.
* Make sure the **Subscription** matches the subscription you want to use 
* Make sure the **Resource group** to the resource group you want to use
* Leave the **Plan type** as *Consumption*
* Select the **Location** that matches the location of your resource group
* Create a new **Azure Storage** resource using the *New...* link. Set the location to match your resource group, use the other default values, and hit "Ok".

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-4.png" alt-text="Publish Azure function in Visual Studio: Function App (Windows) - Create new":::

Then, select **Create**.

This should bring you back to the *Functions instance* page, where your new function app is now visible underneath your resource group. Hit *Finish*.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-5.png" alt-text="Publish Azure function in Visual Studio: Functions instance (after function app)":::

On the *Publish* pane that opens back in the main Visual Studio window, check that all the information looks correct and select **Publish**.

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-6.png" alt-text="Publish Azure function in Visual Studio: publish":::

> [!NOTE]
> If you see a popup like this: 
> :::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/publish-azure-function-7.png" alt-text="Publish Azure function in Visual Studio: publish credentials" border="false":::
> Select **Attempt to retrieve credentials from Azure** and **Save**.
>
> If you see a warning to *Upgrade Functions version on Azure* or that *Your version of the functions runtime does not match the version running in Azure*:
>
> Follow the prompts to upgrade to the latest Azure Functions runtime version. This issue might occur if you're using an older version of Visual Studio.