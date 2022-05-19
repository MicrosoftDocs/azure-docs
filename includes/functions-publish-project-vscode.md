---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/19/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

## Publish the project to Azure

In this section, you'll create a function app and related resources in your Azure subscription and then deploy your code.

> [!IMPORTANT]
> Publishing to an existing function app overwrites the content of that app in Azure.

1. Select the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Deploy to function app...** button.

    :::image type="content" source="./media/functions-publish-project-vscode/function-app-publish-project.png" alt-text="Screenshot of the publish your project to Azure window.":::

1. Follow the prompts and provide the following information:

    - **Select folder**: Select a folder from your workspace or browse to the one that contains your function app. You won't see this prompt if you already have a valid function app opened.

    - **Select subscription**: Select the subscription to use. You won't see the subscription list if you only have one subscription.

    - **Select Function App in Azure**: Select `Create new Function App`. (Don't select the `Advanced` option, which isn't covered in this article.)

    - **Enter a globally unique name for the function app**: Enter a name that is valid in a URL path. The name you type is validated to ensure that it's unique in Azure Functions.

    - **Select a location for new resources**:  For better performance, select a [region](https://azure.microsoft.com/regions/) near you.

    The extension shows the status of individual resources as they're being created in Azure in the notification area.

    :::image type="content" source="media/functions-publish-project-vscode/resource-notification.png" alt-text="Screenshot of Azure resource creation notification.":::

1. When completed, the following Azure resources are created in your subscription, and resources are named based on your function app name:

    [!INCLUDE [functions-vs-code-created-resources](functions-vs-code-created-resources.md)]

    A notification displays after your function app is created and the deployment package is applied.

    [!INCLUDE [functions-vs-code-create-tip](functions-vs-code-create-tip.md)]

1. Select **View Output** in the notification to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower-right corner to see it again.

    :::image type="content" source="media/functions-publish-project-vscode/function-create-notifications.png" alt-text="Screenshot of the View Output window.":::
