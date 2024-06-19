---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/03/2024
ms.author: glenga
ms.custom: devdivchpfy22
---

In this section, you create a function app and related resources in your Azure subscription.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette and search for and run the command `Azure Functions: Create Function App in Azure...`. 

1. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select subscription**| Choose the subscription to use. You won't see this prompt when you have only one subscription visible under **Resources**. |
    |**Enter a globally unique name for the function app**| Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.|
    |**Select a runtime stack**| Choose the language version on which you've been running locally. |
    |**Select a location for new resources**| For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.|

    The extension shows the status of individual resources as they're being created in Azure in the **Azure: Activity Log** panel.

    ![Log of Azure resource creation](media/functions-publish-project-vscode/resource-activity-log.png) 

1. When the creation is complete, the following Azure resources are created in your subscription. The resources are named based on your function app name:

    [!INCLUDE [functions-vs-code-created-resources](functions-vs-code-created-resources.md)]

    A notification is displayed after your function app is created and the deployment package is applied.

    [!INCLUDE [functions-vs-code-create-tip](functions-vs-code-create-tip.md)]