---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/12/2020
ms.author: glenga
---

## Publish the project to Azure

In this section, you create a function app and related resources in your Azure subscription and then deploy your code. 

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app...** button.

    ![Publish your project to Azure](media/functions-publish-project-vscode/function-app-publish-project.png)

1. Provide the following information at the prompts:

    ::: zone pivot="programming-language-csharp,programming-language-powershell"

    | Prompt | Value | Description |
    | ------ | ----- | ----- |
    | Select subscription | Your subscription | Shown when you have multiple subscriptions. |
    | Select Function App in Azure | + Create new Function App | Publishing to an existing function app overwrites the content of that app in Azure. |
    | Enter a globally unique name for the function app | Unique name | Valid characters for a function app name are `a-z`, `0-9`, and `-`. |
    | Select a location for new resources | Region | Choose a [region](https://azure.microsoft.com/regions/) near you. | 

    ::: zone-end

    ::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python"

    | Prompt | Value | Description |
    | ------ | ----- | ----- |
    | Select subscription | Your subscription | Shown when you have multiple subscriptions. |
    | Select Function App in Azure | + Create new Function App | Publishing to an existing function app overwrites the content of that app in Azure. |
    | Enter a globally unique name for the function app | Unique name | Valid characters for a function app name are `a-z`, `0-9`, and `-`. |
    | Select a runtime | Your version | Choose the language version you've been running on locally. |
    | Select a location for new resources | Region | Choose a [region](https://azure.microsoft.com/regions/) near you. | 

    ::: zone-end

    
1.  When completed, the following Azure resources are created in your subscription:

    + **[Resource group](../articles/azure-resource-manager/management/overview.md)**: Contains all of the created Azure resources. The name is based on your function app name.
    + **[Storage account](../articles//storage/common/storage-introduction.md#types-of-storage-accounts)**: A standard Storage account is created with a unique name that is based on your function app name.
    + **[Hosting plan](../articles/azure-functions/functions-scale.md)**: A consumption plan is created in the West US region to host your serverless function app.
    + **Function app**: Your project is deployed to and runs in this new function app.
    + **[Application Insights]()**: An instance, which is connected to your function app, is created based on your function name.

    A notification is displayed after your function app is created and the deployment package is applied. 
    
1. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created.

    ![Create complete notification](media/functions-publish-project-vscode/function-create-notifications.png)

1. Back in the **Azure: Functions** area in the side bar, expand the new function app under your subscription. Expand **Functions**, right-click (Windows) or Ctrl + click (MacOS) on **HttpExample**, and then choose **Copy function URL**.

    ![Copy the function URL for the new HTTP trigger](./media/functions-publish-project-vscode/function-copy-endpoint-url.png)
