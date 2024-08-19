---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/18/2024
ms.author: glenga
ms.custom: devdivchpfy22
---

In this section, you create a function app and related resources in your Azure subscription. Many of the resource creation decisions are made for you based on default behaviors. For more control over the created resources, you must instead [create your function app with advanced options](functions-develop-vs-code.md?tabs=advanced-options#publish-to-azure).

1. In Visual Studio Code, select F1 to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create Function App in Azure**.

1. At the prompts, provide the following information:

    |Prompt|Action|
    |--|--|
    |**Select subscription**| Select the Azure subscription to use. The prompt doesn't appear when you have only one subscription visible under **Resources**. |
    |**Enter a globally unique name for the function app**| Enter a name that is valid in a URL path. The name you enter is validated to make sure that it's unique in Azure Functions.|
    |**Select a runtime stack**| Select the language version you currently run locally. |
    |**Select a location for new resources**| Select an Azure region. For better performance, select a [region](https://azure.microsoft.com/regions/) near you.|

    In the **Azure: Activity Log** panel, the Azure extension shows the status of individual resources as they're created in Azure.

    ![Screenshot that shows the log of Azure resource creation.](media/functions-publish-project-vscode/resource-activity-log.png)

1. When the function app is created, the following related resources are created in your Azure subscription. The resources are named based on the name you entered for your function app.

    [!INCLUDE [functions-vs-code-created-resources](functions-vs-code-created-resources.md)]

    A notification is displayed after your function app is created and the deployment package is applied.

    [!INCLUDE [functions-vs-code-create-tip](functions-vs-code-create-tip.md)]
    
