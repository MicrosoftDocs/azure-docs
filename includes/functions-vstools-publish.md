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

2. In **Pick a publish target**, use the publish options specified in the following table: 

    | Option      | Description                                |
    | ------------ |  -------------------------------------------------- |
    | **Azure Function App** | Create a function app in an Azure cloud environment. | 
    | **Create new** | A new function app, with related resources, is created in Azure. <br/>If you choose **Select Existing**, all files in the existing function app in Azure are overwritten by files from the local project. Use this option only when you republish updates to an existing function app. |
    | **Run from package file** | Your function app is deployed using [Zip Deploy](../articles/azure-functions/functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](../articles/azure-functions/run-functions-from-deployment-package.md) mode enabled. This deployment, which results in better performance, is the recommended way of running your functions. <br/>If you don't use this option, make sure to stop your function app project from running locally before you publish to Azure. |

    ![Pick a publish target](./media/functions-vstools-publish/functions-visual-studio-publish-profile.png)


3. Select **Publish**. If you haven't already signed-in to your Azure account from Visual Studio, select **Sign-in**. You can also create a free Azure account.

4. In **Azure App Service: Create new**, use the values specified in the following table:

    | Setting      | Value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Name** | Globally unique name | Name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription to use. Accept this subscription or select a new one from the drop-down list. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** | Name of your resource group |  The resource group in which to create your function app. Select an existing resource group from the drop-down list or choose **New** to create a new resource group.|
    | **[Hosting Plan](../articles/azure-functions/functions-scale.md)** | Name of your hosting plan | Select **New** to configure a serverless plan. Make sure to choose the **Consumption** under **Size**. When you publish your project to a function app that runs in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan), you pay only for executions of your functions app. Other hosting plans incur higher costs. If you run in a plan other than **Consumption**, you must manage the [scaling of your function app](../articles/azure-functions/functions-scale.md). Choose a **Location** in a [region](https://azure.microsoft.com/regions/) near you or other services your functions access.  |
    | **[Azure Storage](../articles/storage/common/storage-account-create.md)** | General-purpose storage account | An Azure Storage account is required by the Functions runtime. Select **New** to configure a general-purpose storage account. You can also choose an existing account that meets the [storage account requirements](../articles/azure-functions/functions-scale.md#storage-account-requirements).  |

    ![Create App Service dialog](./media/functions-vstools-publish/functions-visual-studio-publish.png)

5. Select **Create** to create a function app and its related resources in Azure with these settings and deploy your function project code. 

6. Select Publish and after the deployment completes, make a note of the **Site URL** value, which is the address of your function app in Azure.

    ![Publish success message](./media/functions-vstools-publish/functions-visual-studio-publish-complete.png)
