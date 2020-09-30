---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/30/2020
ms.author: glenga
ms.custom: include file
---

1. In **Solution Explorer**, right-click the project and select **Publish**.

1. In **Target**, select **Azure**
::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-profile-step-1.png" alt-text="Select Azure target":::

1. In **Specific target**, select **Azure Function App (Windows)**

::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-profile-step-2.png" alt-text="Select Azure Function App":::

1. In **Function Instance**, click on **Create a new Azure Function...** link, and then use the values specified in the following table:


    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription to use. Accept this subscription or select a new one from the drop-down list. |
    | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which to create your function app. Select an existing resource group from the drop-down list or choose **New** to create a new resource group.|
    | **[Plan Type](../articles/azure-functions/functions-scale.md)** | Name of your hosting plan | Select **New** to configure a serverless plan. Make sure to choose the **Consumption** under **Size**. When you publish your project to a function app that runs in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan), you pay only for executions of your functions app. Other hosting plans incur higher costs. If you run in a plan other than **Consumption**, you must manage the [scaling of your function app](../articles/azure-functions/functions-scale.md).  |
    | **Location** | Location of the app service | Choose a **Location** in a [region](https://azure.microsoft.com/regions/) near you or other services your functions access. |
    | **[Azure Storage](../articles/storage/common/storage-account-create.md)** | General-purpose storage account | An Azure Storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose an existing account that meets the [storage account requirements](../articles/azure-functions/functions-scale.md#storage-account-requirements).  |

    ![Create App Service dialog](./media/functions-vstools-publish/functions-visual-studio-publish.png)


1. Click on **Create** to create a function app and its related resources in Azure with these settings and deploy your function project code. 
1. In the **Functions instance**, ensure **Run from package file** is checked. Your function app is deployed using [Zip Deploy](../articles/azure-functions/functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](../articles/azure-functions/run-functions-from-deployment-package.md) mode enabled. This deployment, which results in better performance, is the recommended way of running your functions. <br/>If you don't use this option, make sure to stop your function app project from running locally before you publish to Azure. 

    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-profile-step-4.png" alt-text="Finish profile creation":::

1. Click on **Finish**, and on the Publish page, select **Publish** and wait for the deployment to complete. 

    After the deployment completes the root URL of the function app in Azure is shown in the **Publish** tab. 
    
1.  In the Publish tab, choose **Manage in Cloud Explorer**. This opens the new function app Azure resource in Cloud Explorer. 
    
    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Publish success message":::
    
    Cloud Explorer lets you use Visual Studio to view the contents of the site, start and stop the function app, and browse directly to function app resources on Azure and in the Azure portal. 