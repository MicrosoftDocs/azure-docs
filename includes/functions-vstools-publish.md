---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/06/2020
ms.author: glenga
ms.custom: include file
---

1. In **Solution Explorer**, right-click the project and select **Publish**.

1. In **Pick a publish target**, use the publish options specified in the following table: 

    | Option      | Description                                |
    | ------------ |  -------------------------------------------------- |
    | **Azure Functions Consumption Plan** | Create a function app in an Azure cloud environment that runs in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan). When you use a Consumption plan, you pay only for executions of your functions app. Other hosting plans incur higher costs. If you run in a plan other than a Consumption plan, you must manage the [scaling of your function app](../articles/azure-functions/functions-scale.md).| 
    | **Create New** | A new function app, with related resources, is created in Azure. <br/>If you choose **Select Existing**, all files in the existing function app in Azure are overwritten by files from the local project. Use this option only when you republish updates to an existing function app. |
    | **Run from package file** | Your function app is deployed using [Zip Deploy](../articles/azure-functions/functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](../articles/azure-functions/run-functions-from-deployment-package.md) mode enabled. This deployment, which results in better performance, is the recommended way of running your functions. <br/>If you don't use this option, make sure to stop your function app project from running locally before you publish to Azure. |

    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-profile.png" alt-text="Create a publish profile":::


1. Select **Create Profile**. If you haven't already signed-in to your Azure account from Visual Studio, select **Sign-in**. You can also create a free Azure account.

1. In **App Service: Create new**, use the values specified in the following table:

    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription to use. Accept this subscription or select a new one from the drop-down list. |
    | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which to create your function app. Select an existing resource group from the drop-down list or choose **New** to create a new resource group.|
    | **[Hosting Plan](../articles/azure-functions/functions-scale.md)** | Name of your hosting plan | Select **New** to configure a serverless plan. Make sure to choose the **Consumption** under **Size**. When you publish your project to a function app that runs in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan), you pay only for executions of your functions app. Other hosting plans incur higher costs. If you run in a plan other than **Consumption**, you must manage the [scaling of your function app](../articles/azure-functions/functions-scale.md).  |
    | **Location** | Location of the app service | Choose a **Location** in a [region](https://azure.microsoft.com/regions/) near you or other services your functions access. |
    | **[Azure Storage](../articles/storage/common/storage-account-create.md)** | General-purpose storage account | An Azure Storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose an existing account that meets the [storage account requirements](../articles/azure-functions/functions-scale.md#storage-account-requirements).  |

    ![Create App Service dialog](./media/functions-vstools-publish/functions-visual-studio-publish.png)

1. Select **Create** to create a function app and its related resources in Azure with these settings and deploy your function project code. 

1. Select **Publish** and wait for the deployment to complete. 

    After the deployment completes the root URL of the function app in Azure is shown in the **Publish** tab. 
    
1.  In the Publish tab, choose **Manage in Cloud Explorer**. This opens the new function app Azure resource in Cloud Explorer. 
    
    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Publish success message":::
    
    Cloud Explorer lets you use Visual Studio to view the contents of the site, start and stop the function app, and browse directly to function app resources on Azure and in the Azure portal. 