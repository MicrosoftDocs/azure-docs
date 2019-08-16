---
title: Create a Node.js web app
description: Node.js deployment to Azure App Services
author: KarlErickson
ms.author: karler
ms.date: 07/18/2019
ms.topic: quickstart
ms.service: app-service
ms.devlang: javascript
---

# Create a Node.js app in Azure

Azure App Service provides a highly scalable, self-patching web hosting service. This quickstart shows how to deploy a Node.js app to Azure App Service.

## Prerequisites

If you don't have an Azure account, [sign up today](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension) for a free account with $200 in Azure credits to try out any combination of services.

You need [Visual Studio Code](https://code.visualstudio.com/) installed along with [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

You will also need to install the [Azure App Service extension](vscode:extension/ms-azuretools.vscode-azureappservice), which you can use to create, manage, and deploy Linux Web Apps on the Azure Platform as a Service (PaaS).

### Sign in

Once the extension is installed, log into your Azure account. In the Activity Bar, click on the Azure logo to show the **AZURE APP SERVICE** explorer. Click **Sign in to Azure...** and follow the instructions.

![sign in to Azure](./media/quickstart-nodejs/sign-in.png)

### Troubleshooting

If you see the error **"Cannot find subscription with name [subscription ID]"**, it might be because you're behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal using `export`.

```sh
export HTTPS_PROXY=https://username:password@proxy:8080
export HTTP_PROXY=http://username:password@proxy:8080
```

If setting the environment variables doesn't correct the issue, contact us by clicking the **I ran into an issue** button below.

### Prerequisite check

Before you continue, ensure that you have all the prerequisites installed and configured.

In VS Code, you should see your Azure email address in the Status Bar and your subscription in the **AZURE APP SERVICE** explorer.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=getting-started)

## Create your Node.js application

Next, create a Node.js application that can be deployed to the Cloud. This quickstart uses an application generator to quickly scaffold out the application from a terminal.

> [!TIP]
> If you have already completed the [Node.js tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial), you can skip ahead to [Deploy the website](#deploy-the-website).

### Install the Express generator

[Express](https://www.expressjs.com) is a popular framework for building and running Node.js applications. You can scaffold (create) a new Express application using the [Express Generator](https://expressjs.com/en/starter/generator.html) tool. The Express Generator is shipped as an npm module and installed by using the npm command-line tool `npm`.

```bash
npm install -g express-generator
```

The `-g` switch installs the Express Generator globally on your machine so you can run it from anywhere.

### Scaffold a new application

Next, scaffold a new Express application called `myExpressApp` by running:

```bash
express myExpressApp --view pug --git
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

Now, open your browser and navigate to [http://localhost:3000](http://localhost:3000), where you should see something like this:

![Running Express Application](./media/quickstart-nodejs/express.png)

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=create-app)

## Deploy the website

In this section, you deploy your Node.js website using VS Code and the Azure App Service extension. This quickstart uses the most basic deployment model where your app is zipped and deployed to an Azure Web App on Linux.

### Deploy using Azure App Service

First, open your application folder in VS Code.

```bash
code .
```

In the **AZURE APP SERVICE** explorer, click the blue up arrow icon to deploy your app to Azure.

![Deploy to Web App](./media/quickstart-nodejs/deploy.png)

> [!TIP]
> You can also deploy from the **Command Palette** (CTRL + SHIFT + P) by typing 'deploy to web app' and running the **Azure App Service: Deploy to Web App** command.

1. Choose the directory that you currently have open, `myExpressApp`.

2. Choose **Create new Web App**.

3. Type a globally unique name for your Web App and press ENTER. Valid characters for an app name are 'a-z', '0-9', and '-'.

4. Choose your **Node.js version**, LTS is recommended.

    The notification channel shows the Azure resources that are being created for your app.

Click **Yes** when prompted to update your configuration to run `npm install` on the target server. Your app is then deployed.

![Configured deployment](./media/quickstart-nodejs/server-build.png)

When the deployment starts, you're prompted to update your workspace so that later deployments will automatically target the same App Service Web App. Choose **Yes** to ensure your changes are deployed to the correct app.

![Configured deployment](./media/quickstart-nodejs/save-configuration.png)

> [!TIP]
> Be sure that your application is listening on the port provided by the PORT environment variable: `process.env.PORT`.

### Browse the website

Once the deployment completes, click **Browse Website** in the prompt to view your freshly deployed website.

### Troubleshooting

If you see the error **"You do not have permission to view this directory or page."**, then the application probably failed to start correctly. Head to the next section and view the log output to find and fix the error. If you aren't able to fix it, contact us by clicking the **I ran into an issue** button below. We're happy to help!

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)

### Updating the website

You can deploy changes to this app by using the same process and choosing the existing app rather than creating a new one.

## Viewing Logs

In this section, you learn how to view (or "tail") the logs from the running website. Any calls to `console.log` in the site are displayed in the output window in Visual Studio Code.

Find the app in the **AZURE APP SERVICE** explorer, right-click the app, and choose **View Streaming Logs**.

When prompted, choose to enable logging and restart the application. Once the app is restarted, the VS Code output window opens with a connection to the log stream.

![View Streaming Logs](./media/quickstart-nodejs/view-logs.png)

![Enable Logging and Restart](./media/quickstart-nodejs/enable-restart.png)

After a few seconds, you'll see a message indicating that you're connected to the log-streaming service.

```bash
Connecting to log-streaming service...
2017-12-21 17:33:51.428 INFO  - Container practical-mustache_2 for site practical-mustache initialized successfully.
2017-12-21 17:33:56.500 INFO  - Container logs
```

Refresh the page a few times in the browser to see log output.

```bash
2017-12-21 17:35:17.774 INFO  - Container logs
2017-12-21T17:35:14.955412230Z GET / 304 141.798 ms - -
2017-12-21T17:35:15.248930479Z GET /stylesheets/style.css 304 3.180 ms - -
2017-12-21T17:35:15.378623115Z GET /favicon.ico 404 53.839 ms - 995
```

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
