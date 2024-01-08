---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/29/2023
ms.author: glenga
ms.custom: devdivchpfy22
---

> [!IMPORTANT]
> Deploying to an existing function app always overwrites the contents of that app in Azure.

1. In the **Resources** area of the Azure activity, locate the function app resource you just created, right-click the resource, and select **Deploy to function app...**.

1. When prompted about overwriting previous deployments, select **Deploy** to deploy your function code to the new function app resource. 

1. After deployment completes, select **View Output** to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    :::image type="content" source="media/functions-publish-project-vscode/function-create-notifications.png" alt-text="Screenshot of the View Output window.":::
