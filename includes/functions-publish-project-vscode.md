---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/20/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

## <a name="publish-the-project-to-azure"></a>Create the function app in Azure

In this section, you create a function app and related resources in your Azure subscription.

1. Choose the Azure icon in the Activity bar. Then in the **Resources** area, select the **+** icon and choose the **Create Function App in Azure** option.

    ![Create a resource in your Azure subscription](media/functions-publish-project-vscode/function-app-create-resource.png)

1. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select subscription**| Choose the subscription to use. You won't see this when you have only one subscription visible under **Resources**. |
    |**Enter a globally unique name for the function app**| Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.|
    |**Select a runtime stack**| Choose the language version on which you've been running locally. |
    |**Select a location for new resources**| For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.|

    The extension shows the status of individual resources as they are being created in Azure in the **Azure: Activity Log** panel.

    ![Log of Azure resource creation](media/functions-publish-project-vscode/resource-activity-log.png) 

1. When the creation is complete, the following Azure resources are created in your subscription. The resources are named based on your function app name:

    [!INCLUDE [functions-vs-code-created-resources](functions-vs-code-created-resources.md)]

    A notification is displayed after your function app is created and the deployment package is applied.

    [!INCLUDE [functions-vs-code-create-tip](functions-vs-code-create-tip.md)]

## Deploy the project to Azure

> [!IMPORTANT]
> Deploying to an existing function app always overwrites the contents of that app in Azure.

1. Choose the Azure icon in the Activity bar, then in the **Workspace** area, select your project folder and select the **Deploy...** button.

    :::image type="content" source="media/functions-publish-project-vscode/functions-vscode-deploy.png" alt-text="Deploy project from the Visual Studio Code workspace":::

1. After deployment completes, select **View Output** to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    :::image type="content" source="media/functions-publish-project-vscode/function-create-notifications.png" alt-text="Screenshot of the View Output window.":::

