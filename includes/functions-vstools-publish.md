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

1. In **Solution Explorer**, right-click the project and select **Publish** and in **Target**, select **Azure** then **Next**.

1. For the **Specific target**, choose **Azure Function App (Windows)**, which creates a function app that runs on Windows.

1. In **Function Instance**, choose **Create a new Azure Function...** 

    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-new-resource.png" alt-text="Create a new function app instance":::

1. Create a new instance using the values specified in the following table:

    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription to use. Accept this subscription or select a new one from the drop-down list. |
    | **[Resource group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which to create your function app. Select an existing resource group from the drop-down list or choose **New** to create a new resource group.|
    | **[Plan Type](../articles/azure-functions/functions-scale.md)** | Consumption | When you publish your project to a function app that runs in a [Consumption plan](../articles/azure-functions/consumption-plan.md), you pay only for executions of your functions app. Other hosting plans incur higher costs. |
    | **Location** | Location of the app service | Choose a **Location** in a [region](https://azure.microsoft.com/regions/) near you or other services your functions access. |
    | **[Azure Storage](../articles/azure-functions/storage-considerations.md)** | General-purpose storage account | An Azure Storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose an existing account that meets the [storage account requirements](../articles/azure-functions/storage-considerations.md#storage-account-requirements).  |

    ![Create App Service dialog](./media/functions-vstools-publish/functions-visual-studio-publish.png)

1. Select **Create** to create a function app and its related resources in Azure. Status of resource creation is shown in the lower left of the window. 

1. Back in **Functions instance**, make sure that **Run from package file** is checked. Your function app is deployed using [Zip Deploy](../articles/azure-functions/functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](../articles/azure-functions/run-functions-from-deployment-package.md) mode enabled. This is the recommended deployment method for your functions project, since it results in better performance. 

    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-profile-step-4.png" alt-text="Finish profile creation":::

1. Select **Finish**, and on the Publish page, select **Publish** to deploy the package containing your project files to your new function app in Azure. 

    After the deployment completes the root URL of the function app in Azure is shown in the **Publish** tab. 
    
1.  In the Publish tab, choose **Manage in Cloud Explorer**. This opens the new function app Azure resource in Cloud Explorer. 
    
    :::image type="content" source="media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Publish success message":::
    
    Cloud Explorer lets you use Visual Studio to view the contents of the site, start and stop the function app, and browse directly to function app resources on Azure and in the Azure portal. 
