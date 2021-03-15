---
title: 'Quickstart: Create a Node.js web app'
description: Deploy your first Node.js Hello World to Azure App Service in minutes.
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.topic: quickstart
ms.date: 08/01/2020
ms.custom: mvc, devcenter, seodec18
zone_pivot_groups: app-service-platform-windows-linux
ROBOTS: NOINDEX,NOFOLLOW
---
# Create a Node.js web app in Azure

Get started with <abbr title="An HTTP-based service for hosting web applications, REST APIs, and mobile back-end applications.">Azure App Service</abbr> by creating a Node.js/Express app locally using Visual Studio Code and then deploying the app to the Azure cloud. Because you use a <abbr title="In Azure App Service, a base tier in which your app runs on the same VMs as other apps, including the apps of other customers. This tier is intended for development and testing.">free tier</abbr>, you incur no costs to complete this quickstart.

## 1. Prepare your environment

- An Azure account with an active <abbr title="An Azure subscription is a logical container used to provision resources in Azure. It holds the details of all your resources like virtual machines (VMs), databases, and more.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension).
- <a href="https://git-scm.com/" target="_blank">Install Git</a>
- [Node.js and npm](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed.
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.

[Report a problem](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&prepare-your-environment)




<br>
<hr/>

## 2. Clone and run a local Node.js application

1. On your local computer, open a terminal and clone the sample repository:

    ```bash
    git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
    ```

1. Navigate into the new app folder:

    ```bash
    cd nodejs-docs-hello-world
    ```

1. Install the dependencies:

    ```bash
    npm install
    ```

1. Start the app to test it locally:

    ```bash
    npm start
    ```
    
1. Open your browser and navigate to `http://localhost:1337`. The browser should display "Hello World!".

1. Press <kbd>Ctrl</kbd> + <kbd>C</kbd> in the terminal to stop the server.

[Report a problem](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&prepare-your-environment)


<br>
<hr/>




<!-- VS Code extension works differently for Windows/Linus - Step 3 -->

::: zone pivot="platform-windows"  

[!INCLUDE [Windows](./includes/quickstart-nodejs-uiex-windows.md)]


::: zone-end

::: zone pivot="platform-linux"  

[!INCLUDE [Windows](./includes/quickstart-nodejs-uiex-linux.md)]

::: zone-end


## 4. Viewing Logs from Visual Studio Code

View the <abbr title="Any calls to `console.log` in the app are displayed in the output window in Visual Studio Code.">log</abbr> of the running App Service app.

1. Find the app in the **AZURE APP SERVICE** explorer, right-click the app name, and choose **Start Streaming Logs**.

1. The Visual Studio Code output window opens.

    ![View Streaming Logs](./media/quickstart-nodejs/view-logs.png)

    :::image type="content" source="./media/quickstart-nodejs/enable-restart.png" alt-text="Screenshot of the VS Code prompt to enable file logging and restart the web app, with the yes button selected.":::

1. After a few seconds, you'll see a message indicating that you're connected to the log-streaming service. 
1. Refresh the page a few times to see more activity.

    <pre class="is-monospace is-size-small has-padding-medium has-background-tertiary has-text-tertiary-invert">
    2020-09-20 20:37:39.574 INFO  - Initiating warmup request to container msdocs-vscode-node_2_00ac292a for site msdocs-vscode-node
    2020-09-20 20:37:55.011 INFO  - Waiting for response to warmup request for container msdocs-vscode-node_2_00ac292a. Elapsed time = 15.4373071 sec
    2020-09-20 20:38:08.233 INFO  - Container msdocs-vscode-node_2_00ac292a for site msdocs-vscode-node initialized successfully and is ready to serve requests.
    2020-09-20T20:38:21  Startup Request, url: /Default.cshtml, method: GET, type: request, pid: 61,1,7, SCM_SKIP_SSL_VALIDATION: 0, SCM_BIN_PATH: /opt/Kudu/bin, ScmType: None
    </pre>

<br>

[Report a problem](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&prepare-your-environment)

<br>
<hr/>

## 5. Clean up resources

Find the app in the **AZURE APP SERVICE** explorer, right-click the app name, and choose **Delete**. 

:::image type="content" source="./media/quickstart-nodejs/delete-resource-ieux.png" alt-text="Find the app in the `**`AZURE APP SERVICE`**` explorer, right-click the app name, and choose `Delete`":::

## Next steps

Congratulations, you've successfully completed this quickstart! You can deploy changes to this app by using the same process and choosing the existing app rather than creating a new one.

Next, check out the other Azure extensions.

* [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
* [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
* [Docker Tools](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)
* [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
* [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

Or get them all by installing the
[Node Pack for Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension pack.