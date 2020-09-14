---
title: 'Quickstart: Create a Node.js web app'
description: Deploy your first Node.js Hello World to Azure App Service in minutes.
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.topic: quickstart
ms.date: 08/01/2020
ms.custom: mvc, devcenter, seodec18
zone_pivot_groups: app-service-platform-windows-linux

---
# Create a Node.js web app in Azure

::: zone pivot="platform-windows"  

Get started with Azure App Service by creating a Node.js/Express app locally using Visual Studio Code and then deploying the app to the cloud. Because you use a free App Service tier, you incur no costs to complete this quickstart.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension).
- [Node.js and npm](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed.
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.

## Clone and run a local Node.js application

1. On your local computer, open a terminal and clone the sample repository:

    ```bash
    git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
    ```

1. Navigate into the new app folder:

    ```bash
    cd nodejs-docs-hello-world
    ```

1. Start the app to test it locally:

    ```bash
    npm start
    ```
    
1. Open your browser and navigate to `http://localhost:1337`. The browser should display "Hello World!".

1. Press **Ctrl**+**C** in the terminal to stop the server.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=create-app)

## Deploy the app to Azure

In this section, you deploy your Node.js app to Azure using VS Code and the Azure App Service extension.

1. In the terminal, make sure you're in the *nodejs-docs-hello-world* folder, then start Visual Studio Code with the following command:

    ```bash
    code .
    ```

1. In the VS Code activity bar, select the Azure logo to show the **AZURE APP SERVICE** explorer. Select **Sign in to Azure...** and follow the instructions. (See [Troubleshooting Azure sign-in](#troubleshooting-azure-sign-in) below if you run into errors.) Once signed in, the explorer should show the name of your Azure subscription.

    ![Sign in to Azure](media/quickstart-nodejs/sign-in.png)

1. In the **AZURE APP SERVICE** explorer of VS Code, select the blue up arrow icon to deploy your app to Azure. (You can also invoke the same command from the **Command Palette** (**Ctrl**+**Shift**+**P**) by typing 'deploy to web app' and choosing **Azure App Service: Deploy to Web App**).

    ![Deploy to Web App](media/quickstart-nodejs/deploy.png)
        
1. Choose the *nodejs-docs-hello-world* folder.

1. Choose a creation option based on the operating system to which you want to deploy:

    - Linux: Choose **Create new Web App**
    - Windows: Choose **Create new Web App... Advanced**

1. Type a globally unique name for your web app and press **Enter**. The name must be unique across all of Azure and use only alphanumeric characters ('A-Z', 'a-z', and '0-9') and hyphens ('-').

1. If targeting Linux, select a Node.js version when prompted. An **LTS** version is recommended.

1. If targeting Windows, follow the additional prompts:
    1. Select **Create a new resource group**, then enter a name for the resource group, such as `AppServiceQS-rg`.
    1. Select **Windows** for the operating system.
    1. Select **Create new App Service plan**, then enter a name for the plan (such as `AppServiceQS-plan`), then select **F1 Free** for the pricing tier.
    1. Choose **Skip for now** when prompted about Application Insights.
    1. Choose a region near you or near resources you wish to access.

1. After you respond to all the prompts, VS Code shows the Azure resources that are being created for your app in its notification popup.

    When deploying to Linux, select **Yes** when prompted to update your configuration to run `npm install` on the target Linux server.

    ![Prompt to update configuration on the target Linux server](media/quickstart-nodejs/server-build.png)

1. Select **Yes** when prompted with **Always deploy the workspace "nodejs-docs-hello-world" to (app name)"**. Selecting **Yes** tells VS Code to automatically target the same App Service Web App with subsequent deployments.

1. If deploying to Linux, select **Browse Website** in the prompt to view your freshly deployed web app once deployment is complete. The browser should display "Hello World!"

1. If deploying to Windows, you must first set the Node.js version number for the web app:

    1. In VS Code, expand the node for the new app service, right-click **Application Settings**, and select **Add New Setting...**:

        ![Add app setting command](media/quickstart-nodejs/add-setting.png)

    1. Enter `WEBSITE_NODE_DEFAULT_VERSION` for the setting key.
    1. Enter `10.15.2` for the setting value.
    1. Right-click the node for the app service and select **Restart**

        ![Restart app service command](media/quickstart-nodejs/restart.png)

    1. Right-click the node for the app service once more and select **Browse Website**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)

### Troubleshooting Azure sign-in

If you see the error **"Cannot find subscription with name [subscription ID]"** when signing into Azure, it might be because you're behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal using `export`.

```bash
export HTTPS_PROXY=https://username:password@proxy:8080
export HTTP_PROXY=http://username:password@proxy:8080
```

If setting the environment variables doesn't correct the issue, contact us by selecting the **I ran into an issue** button above.

### Update the app

You can deploy changes to this app by making edits in VS Code, saving your files, and then using the same process as before only choosing the existing app rather than creating a new one.

## Viewing Logs

You can view log output (calls to `console.log`) from the app directly in the VS Code output window.

1. In the **AZURE APP SERVICE** explorer, right-click the app node and choose **Start Streaming Logs**.

    ![Start Streaming Logs](media/quickstart-nodejs/view-logs.png)

1. When prompted, choose to enable logging and restart the application. Once the app is restarted, the VS Code output window opens with a connection to the log stream. 

    ![Enable Logging and Restart](media/quickstart-nodejs/enable-restart.png)

1. After a few seconds, the output window shows a message indicating that you're connected to the log-streaming service. You can generate more output activity by refreshing the page in the browser.

    <pre>
    Connecting to log stream...
    2020-03-04T19:29:44  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours.
    Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds).
    </pre>

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=tailing-logs)

## Next steps

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Tutorial: Node.js app with MongoDB](tutorial-nodejs-mongodb-app.md)

> [!div class="nextstepaction"]
> [Configure Node.js app](configure-language-nodejs.md)

Check out the other Azure extensions.

* [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
* [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
* [Docker Tools](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)
* [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
* [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

Or get them all by installing the
[Node Pack for Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension pack.
::: zone-end

::: zone pivot="platform-linux"  
## Prerequisites

If you don't have an Azure account, [sign up today](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension) for a free account with $200 in Azure credits to try out any combination of services.

You need [Visual Studio Code](https://code.visualstudio.com/) installed along with [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

You will also need to install the [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice), which you can use to create, manage, and deploy Linux Web Apps on the Azure Platform as a Service (PaaS).

### Sign in

Once the extension is installed, log into your Azure account. In the Activity Bar, select the Azure logo to show the **AZURE APP SERVICE** explorer. Select **Sign in to Azure...** and follow the instructions.

![sign in to Azure](./media/quickstart-nodejs/sign-in.png)

### Troubleshooting

If you see the error **"Cannot find subscription with name [subscription ID]"**, it might be because you're behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal using `export`.

```sh
export HTTPS_PROXY=https://username:password@proxy:8080
export HTTP_PROXY=http://username:password@proxy:8080
```

If setting the environment variables doesn't correct the issue, contact us by selecting the **I ran into an issue** button below.

### Prerequisite check

Before you continue, ensure that you have all the prerequisites installed and configured.

In VS Code, you should see your Azure email address in the Status Bar and your subscription in the **AZURE APP SERVICE** explorer.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=getting-started)

## Create your Node.js application

Next, create a Node.js application that can be deployed to the Cloud. This quickstart uses an application generator to quickly scaffold out the application from a terminal.

> [!TIP]
> If you have already completed the [Node.js tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial), you can skip ahead to [Deploy to Azure](#deploy-to-azure).

### Scaffold a new application with the Express Generator

[Express](https://www.expressjs.com) is a popular framework for building and running Node.js applications. You can scaffold (create) a new Express application using the [Express Generator](https://expressjs.com/en/starter/generator.html) tool. The Express Generator is shipped as an npm module and can be run directly (without installation) by using the npm command-line tool `npx`.

```bash
npx express-generator myExpressApp --view pug --git
```

The `--view pug --git` parameters tell the generator to use the [pug](https://pugjs.org/api/getting-started.html) template engine (formerly known as `jade`) and to create a `.gitignore` file.

To install all of the application's dependencies, go to the new folder and run `npm install`.

```bash
cd myExpressApp
npm install
```

### Run the application

Next, ensure that the application runs. From the terminal, start the application using the `npm start` command to start the server.

```bash
npm start
```

Now, open your browser and navigate to `http://localhost:3000`, where you should see something like this:

![Running Express Application](./media/quickstart-nodejs/express.png)

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=create-app)

## Deploy to Azure

In this section, you deploy your Node.js app using VS Code and the Azure App Service extension. This quickstart uses the most basic deployment model where your app is zipped and deployed to an Azure Web App on Linux.

### Deploy using Azure App Service

First, open your application folder in VS Code.

```bash
code .
```

In the **AZURE APP SERVICE** explorer, select the blue up arrow icon to deploy your app to Azure.

![Deploy to Web App](./media/quickstart-nodejs/deploy.png)

> [!TIP]
> You can also deploy from the **Command Palette** (CTRL + SHIFT + P) by typing 'deploy to web app' and running the **Azure App Service: Deploy to Web App** command.

1. Choose the directory that you currently have open, `myExpressApp`.

1. Choose **Create new Web App**, which deploys to App Service on Linux by default.

1. Type a globally unique name for your Web App and press ENTER. Valid characters for an app name are 'a-z', '0-9', and '-'.

1. Choose your **Node.js version**, LTS is recommended.

    The notification channel shows the Azure resources that are being created for your app.

1. Select **Yes** when prompted to update your configuration to run `npm install` on the target server. Your app is then deployed.

    ![Configured deployment](./media/quickstart-nodejs/server-build.png)

1. When the deployment starts, you're prompted to update your workspace so that later deployments will automatically target the same App Service Web App. Choose **Yes** to ensure your changes are deployed to the correct app.

    ![Configured deployment](./media/quickstart-nodejs/save-configuration.png)

> [!TIP]
> Be sure that your application is listening on the port provided by the PORT environment variable: `process.env.PORT`.

### Browse the app in Azure

Once the deployment completes, select **Browse Website** in the prompt to view your freshly deployed web app.

### Troubleshooting

If you see the error **"You do not have permission to view this directory or page."**, then the application probably failed to start correctly. Head to the next section and view the log output to find and fix the error. If you aren't able to fix it, contact us by selecting the **I ran into an issue** button below. We're happy to help!

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)

### Update the app

You can deploy changes to this app by using the same process and choosing the existing app rather than creating a new one.

## Viewing Logs

In this section, you learn how to view (or "tail") the logs from the running App Service app. Any calls to `console.log` in the app are displayed in the output window in Visual Studio Code.

Find the app in the **AZURE APP SERVICE** explorer, right-click the app, and choose **View Streaming Logs**.

The VS Code output window opens with a connection to the log stream.

![View Streaming Logs](./media/quickstart-nodejs/view-logs.png)

![Enable Logging and Restart](./media/quickstart-nodejs/enable-restart.png)

After a few seconds, you'll see a message indicating that you're connected to the log-streaming service. Refresh the page a few times to see more activity.

<pre>
2019-09-20 20:37:39.574 INFO  - Initiating warmup request to container msdocs-vscode-node_2_00ac292a for site msdocs-vscode-node
2019-09-20 20:37:55.011 INFO  - Waiting for response to warmup request for container msdocs-vscode-node_2_00ac292a. Elapsed time = 15.4373071 sec
2019-09-20 20:38:08.233 INFO  - Container msdocs-vscode-node_2_00ac292a for site msdocs-vscode-node initialized successfully and is ready to serve requests.
2019-09-20T20:38:21  Startup Request, url: /Default.cshtml, method: GET, type: request, pid: 61,1,7, SCM_SKIP_SSL_VALIDATION: 0, SCM_BIN_PATH: /opt/Kudu/bin, ScmType: None
</pre>

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=tailing-logs)

## Next steps

Congratulations, you've successfully completed this quickstart!

Next, check out the other Azure extensions.

* [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
* [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
* [Docker Tools](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)
* [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
* [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

Or get them all by installing the
[Node Pack for Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension pack.


::: zone-end
