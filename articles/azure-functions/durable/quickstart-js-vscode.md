---
title: Create your first durable function in Azure using JavaScript
description: Create and publish an Azure Durable Function using Visual Studio Code.
services: functions
documentationcenter: na
author: ColbyTresness
manager: jeconnoc
keywords: azure functions, functions, event processing, compute, serverless architecture

ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.date: 11/07/2018
ms.author: azfuncdf, cotresne, glenga

---
# Create your first durable function in JavaScript

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you.

In this article, you learn how to use the Visual Studio Code Azure Functions extension to locally create and test a "hello world" durable function.  This function will orchestrate and chain together calls to other functions. You then publish the function code to Azure.

## Prerequisites

To complete this tutorial:

* Install [Visual Studio Code](https://code.visualstudio.com/download).

* Make sure you have the [latest Azure Functions tools](../functions-develop-vs.md#check-your-tools-version).

* Verify you have the [Azure Storage Emulator](../../storage/common/storage-use-emulator.md) installed and running.

* Verify you have [Node 8.0+](https://nodejs.org/en/) installed on your machine.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Install the Azure Function extension

The Azure Functions extension is used to create, test, and deploy functions to Azure.

1. In Visual Studio Code, open **Extensions** and search for `azure functions`, or [open this link in Visual Studio Code](vscode:extension/ms-azuretools.vscode-azurefunctions).

1. Select **Install** to install the extension to Visual Studio Code. 

    ![Install the extension for Azure Functions](../media/functions-create-first-function-vs-code/vscode-install-extension.png)

1. Restart Visual Studio Code and select the Azure icon on the Activity bar. You should see an Azure Functions area in the Side Bar.

    ![Azure Functions area in the Side Bar](../media/functions-create-first-function-vs-code/azure-functions-window-vscode.png)

## Create an Azure Functions project

The Azure Functions project template in Visual Studio Code creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio Code, select the Azure logo to display the **Azure: Functions** area, and then select the Create New Project icon.

    ![Create a function app project](../media/functions-create-first-function-vs-code/create-function-app-project.png)

1. Choose a location for your project workspace and choose **Select**.

    > [!NOTE]
    > This article was designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Select the language for your function app project. In this article, JavaScript is used.
    ![Choose project language](../media/functions-create-first-function-vs-code/create-function-app-project-language.png)

1. When prompted, choose **Add to workspace**.

Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-run-local.md#local-settings-file) configuration files, plus any language-specific project files. You also get a new Git repository in the project folder.

## Create a Starter Function

1. From **Azure: Functions**, choose the Create Function icon.

    ![Create a function](../media/functions-create-first-function-vs-code/create-function.png)

1. Select the folder with your function app project and select the **HTTP trigger** function template.

    ![Choose the HTTP trigger template](../media/functions-create-first-function-vs-code/create-function-choose-template.png)

1. Type `HttpStart` for the function name and press Enter, then select **Anonymous** authentication.

    ![Choose anonymous authentication](../media/functions-create-first-function-vs-code/create-function-anonymous-auth.png)

    A function is created in your chosen language using the template for an HTTP-triggered function.

    ![HTTP triggered function template in Visual Studio Code](../media/functions-create-first-function-vs-code/new-function-full.png)

1. Replace index.js with the below JavaScript:

```JavaScript
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);
    const instanceId = await client.startNew(req.params.functionName, undefined, req.body);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
```

1. Replace function.json with the below JSON:

```JSON
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "route": "orchestrators/{functionName}",
      "methods": ["post"]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

We've now created an entry-point into our Durable Function. Let's add an orchestrator.

## Create an Orchestrator Function

1. From **Azure: Functions**, choose the Create Function icon.

    ![Create a function](../media/functions-create-first-function-vs-code/create-function.png)

1. Select the folder with your function app project and select the **HTTP trigger** function template. Since you'll be replacing this code,     the trigger itself doesn't matter.

    ![Choose the HTTP trigger template](../media/functions-create-first-function-vs-code/create-function-choose-template.png)

1. Type `OrchestratorFunction` for the function name and press Enter, then select **Anonymous** authentication.

    ![Choose anonymous authentication](../media/functions-create-first-function-vs-code/create-function-anonymous-auth.png)

1. Replace index.js with the below JavaScript:

```JavaScript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context){
    context.log("Starting chain sample");
    const output = [];
    output.push(yield context.df.callActivity("SayHello", "Tokyo"));
    output.push(yield context.df.callActivity("SayHello", "Seattle"));
    output.push(yield context.df.callActivity("SayHello", "London"));

    return output;
});
```

1. Replace function.json with the below JSON:

[!code-json[Main](~/samples-durable-functions/samples/csx/E1_HelloSequence/function.json)]

We've added an orchestrator to coordinate activity functions. Let's now add the referenced activity function.

## Create an Activity Function

1. From **Azure: Functions**, choose the Create Function icon.

    ![Create a function](../media/functions-create-first-function-vs-code/create-function.png)

1. Select the folder with your function app project and select the **HTTP trigger** function template. Since you'll be replacing this code, the trigger itself doesn't matter.

    ![Choose the HTTP trigger template](../media/functions-create-first-function-vs-code/create-function-choose-template.png)

1. Type `SayHello` for the function name and press Enter, then select **Anonymous** authentication.

    ![Choose anonymous authentication](../media/functions-create-first-function-vs-code/create-function-anonymous-auth.png)

1. Replace index.js with the below JavaScript:

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E1_SayHello/index.js)]

1. Replace function.json with the below JSON:

[!code-json[Main](~/samples-durable-functions/samples/csx/E1_SayHello/function.json)]

We've now added all components necessary to start off our orchestration and chain together activity functions.

## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function from Visual Studio Code.  

1.  Install the durable-functions npm package by running `npm install durable-functions` in the root directory of the function app.

1.  Next, start the Azure Storage Emulator, and ensure that the "AzureWebJobsStorage" property of local.settings.json is set to "UseDevelopmentStorage=true".

1.  To test your function, set a breakpoint in the function code and press F5 to start the function app project. Output from Core Tools is displayed in the **Terminal** panel. If this is your first time using Durable Functions, the Durable Functions extension will be installed, so the build might take a few seconds.

1. In the **Terminal** panel, copy the URL endpoint of your HTTP-triggered function.

    ![Azure local output](../media/functions-create-first-function-vs-code/functions-vscode-f5.png)

1. Paste the URL for the HTTP request into your browser's address bar, and see the status of your orchestration.

1. To stop debugging, press Shift + F1.

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Sign in to Azure

Before you can publish your app, you must sign in to Azure.

1. In the **Azure: Functions** area, choose **Sign in to Azure...**. If you don't already have one, you can **Create a free Azure account**.

    ![Function localhost response in the browser](../media/functions-create-first-function-vs-code/functions-sign-into-azure.png)

1. When prompted, select **Copy & Open**, or copy the displayed code and open <https://aka.ms/devicelogin> in your browser.

1. Paste the copied code in the **Device Login** page, verify the sign in for Visual Studio Code, then select **Continue**.  

1. Complete the sign in using your Azure account credentials. After you have successfully signed in, you can close the browser.

## Publish the project to Azure

Visual Studio Code lets you publish your functions project directly to Azure. In the process, you create a function app and related resources in your Azure subscription. The function app provides an execution context for your functions. The project is packaged and deployed to the new function app in your Azure subscription. 

This article assumes that you are creating a new function app. Publishing to an existing function app overwrites the content of that app in Azure.

1. In the **Azure: Functions** area, select the Deploy to function app icon.

    ![Function app settings](../media/functions-create-first-function-vs-code/function-app-publish-project.png)

1. Choose the project folder, which is your current workspace.

1. If you have more than one subscription, choose the one you want to host your function app, then choose **+ Create New Function App**.

1. Type a globally unique name that identifies your function app and press Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`.

1. Choose **+ Create New Resource Group**, type a resource group name, like `myResourceGroup`, and press enter. You can also use an existing resource group.

1. Choose **+Create New Storage Account**, type a globally unique name of the new storage account used by your function app and press Enter. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also use an existing account.

1. Choose a location in a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access.

    Function app creation starts after you choose your location. A notification is displayed after your function app is created and the deployment package is applied.

1. Select **View Output** in the notifications to view the creation and deployment results, including the Azure resources that you created.

    ![Function app creation output](../media/functions-create-first-function-vs-code/function-create-notifications.png)

1. Make a note of the URL of the new function app in Azure. You use this URL to test your function after the project is published to Azure.

    ![Function app creation output](../media/functions-create-first-function-vs-code/function-create-output.png)

1. Back in the **Azure: Functions** area, you see the new function app displayed under your subscription. When you expand this node, you see the functions in the function app, as well as application settings and function proxies.

    ![Function app settings](../media/functions-create-first-function-vs-code/function-app-project-settings.png)

    From your function app node, type Ctrl and click (right-click) to choose to perform various management and configuration tasks against the function app in Azure. You can also choose to view the function app in the Azure portal.

## Test your function in Azure

1. Copy the URL of the HTTP trigger from the **Output** panel. 
    The URL that calls your HTTP-triggered function should be in the following format:

        http://<functionappname>.azurewebsites.net/api/<functionname>

1. Paste this new URL for the HTTP request into your browser's address bar. 

## Next steps

You have used Visual Studio Code to create and publish a JavaScript durable function app.

* [Learn about common durable function patterns.](durable-functions-overview.md)
* [Learn more about the different types and features of durable functions.](durable-functions-types-features-overview.md).
