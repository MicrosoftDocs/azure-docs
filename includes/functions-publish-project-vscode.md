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

    + **Select subscription**: Choose the subscription to use. You won't see this if you only have one subscription.

    + **Select Function App in Azure**: Choose `+ Create new Function App` (not `Advanced`). This article doesn't support the [advanced publishing flow](../articles/azure-functions/functions-develop-vs-code.md#enable-publishing-with-advanced-create-options). 
    
    >[!IMPORTANT]
    > Publishing to an existing function app overwrites the content of that app in Azure. 
    
    + **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. 
    
    ::: zone pivot="programming-language-python"
    + **Select a runtime**: Choose the version of Python you've been running on locally. You can use the `python --version` command to check your version.
    ::: zone-end

    ::: zone pivot="programming-language-javascript,programming-language-typescript"
    + **Select a runtime**: Choose the version of Node.js you've been running on locally. You can use the `node --version` command to check your version.
    ::: zone-end

    + **Select a location for new resources**:  For better performance, choose a [region](https://azure.microsoft.com/regions/) near you. 
    
1.  When completed, the following Azure resources are created in your subscription:

    + **[Resource group](../articles/azure-resource-manager/management/overview.md)**: Contains all of the created Azure resources. The name is based on your function app name.
    + **[Storage account](../articles//storage/common/storage-introduction.md#types-of-storage-accounts)**: A standard Storage account is created with a unique name that is based on your function app name.
    + **[Hosting plan](../articles/azure-functions/functions-scale.md)**: A consumption plan is created in the West US region to host your serverless function app.
    + **Function app**: Your project is deployed to and runs in this new function app.
    + **Application Insights**: An instance, which is connected to your function app, is created based on your function name.

    A notification is displayed after your function app is created and the deployment package is applied. 
    
1. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    ![Create complete notification](media/functions-publish-project-vscode/function-create-notifications.png)
