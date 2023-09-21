---
title: Create a JavaScript function using Visual Studio Code - Azure Functions
description: Learn how to create a JavaScript function, then publish the local Node.js project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 08/03/2023
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-vs-code-node_uiex
ms.devlang: javascript
ms.custom: mode-api, vscode-azure-extension-update-complete, devx-track-js
zone_pivot_groups: functions-nodejs-model
---

# Quickstart: Create a JavaScript function in Azure using Visual Studio Code

Use Visual Studio Code to create a JavaScript function that responds to HTTP requests. Test the code locally, then deploy it to the serverless environment of Azure Functions.

[!INCLUDE [functions-nodejs-model-pivot-description](../../includes/functions-nodejs-model-pivot-description.md)]

Completion of this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-node.md) of this article.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

::: zone pivot="nodejs-model-v3" 
[!INCLUDE [functions-requirements-visual-studio-code-node](../../includes/functions-requirements-visual-studio-code-node.md)]
::: zone-end
::: zone pivot="nodejs-model-v4" 
[!INCLUDE [functions-requirements-visual-studio-code-node-v4](../../includes/functions-requirements-visual-studio-code-node-v4.md)]
::: zone-end

[!INCLUDE [functions-install-core-tools-vs-code](../../includes/functions-install-core-tools-vs-code.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in JavaScript. Later in this article, you publish your function code to Azure.

1. Choose the Azure icon in the Activity bar. Then in the **Workspace (local)** area, select the **+** button, choose **Create Function** in the dropdown. When prompted, choose **Create new project**.

    :::image type="content" source="./media/functions-create-first-function-vs-code/create-new-project.png" alt-text="Screenshot of create a new project window.":::

2. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.

::: zone pivot="nodejs-model-v3" 
3. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `JavaScript`.|
    |**Select a JavaScript programming model**|Choose `Model V3`|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).|
    |**Select how you would like to open your project**|Choose `Open in current window`.|

    Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md?tabs=javascript#generated-project-files). 
::: zone-end
::: zone pivot="nodejs-model-v4" 
3. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `JavaScript`.|
    |**Select a JavaScript programming model**|Choose `Model V4`|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Select how you would like to open your project**|Choose `Open in current window`|

    Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Azure Functions JavaScript developer guide](functions-reference-node.md?tabs=javascript). 
::: zone-end

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Create the function app in Azure

[!INCLUDE [functions-create-azure-resources-vs-code](../../includes/functions-create-azure-resources-vs-code.md)]

## Deploy the project to Azure

[!INCLUDE [functions-deploy-project-vs-code](../../includes/functions-deploy-project-vs-code.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

::: zone pivot="nodejs-model-v3" 
## Change the code and redeploy to Azure

1. In Visual Studio Code in the Explorer view, select the `./HttpExample/index.js` file. 

1. Replace the file with the following code to construct a JSON object and return it.

    ```javascript
    module.exports = async function (context, req) {
        
        try {
            context.log('JavaScript HTTP trigger function processed a request.');
    
            // Read incoming data
            const name = (req.query.name || (req.body && req.body.name));
            const sport = (req.query.sport || (req.body && req.body.sport));
        
            // fail if incoming data is required
            if (!name || !sport) {
    
                context.res = {
                    status: 400
                };
                return;
            }
            
            // Add or change code here
            const message = `${name} likes ${sport}`;
        
            // Construct response
            const responseJSON = {
                "name": name,
                "sport": sport,
                "message": message,
                "success": true
            }
    
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: responseJSON,
                contentType: 'application/json'
            };
        } catch(err) {
            context.res = {
                status: 500
            };
        }
    }
    ```
1. [Rerun the function](#run-the-function-locally) app locally.

1. In the prompt **Enter request body**, change the request message body to { "name": "Tom","sport":"basketball" }. Press Enter to send this request message to your function.

1. View the response in the notification:

    ```json
    {
      "name": "Tom",
      "sport": "basketball",
      "message": "Tom likes basketball",
      "success": true
    }
    ```

1. [Redeploy the function](#deploy-the-project-to-azure) to Azure.
::: zone-end

## Troubleshooting

Use the following table to resolve the most common issues encountered when using this quickstart.

|Problem|Solution|
|--|--|
|Can't create a local function project?|Make sure you have the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.|
|Can't run the function locally?|Make sure you have the latest version of [Azure Functions Core Tools installed](functions-run-local.md?tabs=node) installed. <br/>When running on Windows, make sure that the default terminal shell for Visual Studio Code isn't set to WSL Bash.|
|Can't deploy function to Azure?|Review the Output for error information. The bell icon in the lower right corner is another way to view the output. Did you publish to an existing function app? That action overwrites the content of that app in Azure.|
|Couldn't run the cloud-based Function app?|Remember to use the query string to send in parameters.|

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code-extension.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=javascript) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to either Azure Cosmos DB or Azure Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=javascript). If you want to learn more about security, see [Securing Azure Functions](security-concepts.md).

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-javascript)
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-javascript)
> [Connect to Azure SQL](functions-add-output-binding-azure-sql-vs-code.md?pivots=programming-language-javascript)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
