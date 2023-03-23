---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/20/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

> [!IMPORTANT]
> Deploying to an existing function app always overwrites the contents of that app in Azure.

1. Choose the Azure icon in the Activity bar, then in the **Workspace** area, select your project folder and select the **Deploy...** button.

    :::image type="content" source="media/functions-publish-project-vscode/functions-vscode-deploy.png" alt-text="Deploy project from the Visual Studio Code workspace":::

1. Select **Deploy to Function App...**, choose the function app you just created, and select **Deploy**.   

1. After deployment completes, select **View Output** to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    :::image type="content" source="media/functions-publish-project-vscode/function-create-notifications.png" alt-text="Screenshot of the View Output window.":::
