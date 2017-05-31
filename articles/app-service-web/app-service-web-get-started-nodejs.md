---
title: Create a Node.js Application on Azure Web App | Microsoft Docs
description: Deploy your first Node.js Hello World in App Service Web App in minutes.
services: app-service\web
documentationcenter: ''
author: syntaxc4
manager: erikre
editor: ''

ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 05/05/2017
ms.author: cfowler
---
# Create a Node.js Application on Web App

This quickstart tutorial walks through how to develop and deploy a Node.js app to Azure. We’ll run the app using an [Azure App Service plan](https://docs.microsoft.com/azure/app-service/azure-web-sites-web-hosting-plans-in-depth-overview), and create and configure a new Web App within it using the Azure CLI. We’ll then use git to deploy our Node.js app to Azure.

![hello-world-in-browser](media/app-service-web-get-started-nodejs-poc/hello-world-in-browser.png)

You can follow the steps below using a Mac, Windows, or Linux machine. It should take you only about 5 minutes to complete all of the steps below.

## Prerequisites

Before creating this sample, download and install the following:

* [Git](https://git-scm.com/)
* [ Node.js and NPM](https://nodejs.org/)
* [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample

Clone the Hello World sample app repository to your local machine.

```bash
git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
```

Change to the directory that contains the sample code.

```bash
cd nodejs-docs-hello-world
```

## Run the app locally

Run the application locally by opening a terminal window and using the `npm start` script for the sample to launch the built in Node.js http server.

```bash
npm start
```

Open a web browser, and navigate to the sample.

```bash
http://localhost:1337
```

You can see the **Hello World** message from the sample app displayed in the page.

![localhost-hello-world-in-browser](media/app-service-web-get-started-nodejs-poc/localhost-hello-world-in-browser.png)

In your terminal window, press **Ctrl+C** to exit the web server.

## Log in to Azure

We are now going to use the Azure CLI 2.0 in a terminal window to create the resources needed to host our Node.js app in Azure. Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

<!-- ## Configure a Deployment User -->
[!INCLUDE [login-to-azure](../../includes/configure-deployment-user.md)]

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like web apps, databases and storage accounts are deployed and managed.

```azurecli
az group create --name myResourceGroup --location westeurope
```

## Create an Azure App Service plan

Create a "FREE" [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) with the [az appservice plan create](/cli/azure/appservice/plan#create) command.

<!--
 An App Service plan represents the collection of physical resources used to ..
-->
[!INCLUDE [app-service-plan](../../includes/app-service-plan.md)]

The following example creates an App Service plan named `quickStartPlan` using the **Free** pricing tier.

```azurecli
az appservice plan create --name quickStartPlan --resource-group myResourceGroup --sku FREE
```

When the App Service Plan has been created, the Azure CLI shows information similar to the following example:

```json
{
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/quickStartPlan",
    "location": "West Europe",
    "sku": {
    "capacity": 1,
    "family": "S",
    "name": "S1",
    "tier": "Standard"
    },
    "status": "Ready",
    "type": "Microsoft.Web/serverfarms"
}
```

## Create a web app

Now that an App Service plan has been created, create a [Web App](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) within the `quickStartPlan` App Service plan. The web app gives us a hosting space to deploy our code as well as provides a URL for us to view the deployed application. Use the [az appservice web create](/cli/azure/appservice/web#create) command to create the Web App.

In the command below substitute your own unique app name where you see the `<app_name>` placeholder. The `<app_name>` is used in the default DNS site for the web app. If `<app_name>` is not unique, you get the friendly error message "Website with given name <app_name> already exists."

<!-- removed per https://github.com/Microsoft/azure-docs-pr/issues/11878
You can later map any custom DNS entry to the web app before you expose it to your users.
-->

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan quickStartPlan
```

When the Web App has been created, the Azure CLI shows information similar to the following example.

```json
{
    "clientAffinityEnabled": true,
    "defaultHostName": "<app_name>.azurewebsites.net",
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/<app_name>",
    "isDefaultContainer": null,
    "kind": "app",
    "location": "West Europe",
    "name": "<app_name>",
    "repositorySiteName": "<app_name>",
    "reserved": true,
    "resourceGroup": "myResourceGroup",
    "serverFarmId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/quickStartPlan",
    "state": "Running",
    "type": "Microsoft.Web/sites",
}
```

Browse to the site to see your newly created Web App.

```bash
http://<app_name>.azurewebsites.net
```

![app-service-web-service-created](media/app-service-web-get-started-nodejs-poc/app-service-web-service-created.png)

We’ve now created an empty new Web App in Azure.

## Configure local Git deployment

You can deploy to your Web App in a variety of ways including FTP, local Git as well as GitHub, Visual Studio Team Services, and Bitbucket.

Use the [az appservice web source-control config-local-git](/cli/azure/appservice/web/source-control#config-local-git) command to configure local git access to the Web App.

```azurecli
az appservice web source-control config-local-git --name <app_name> --resource-group myResourceGroup --query url --output tsv
```

Copy the output from the terminal as it will be used in the next step.

```bash
https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git
```

## Push to Azure from Git

Add an Azure remote to your local Git repository.

```bash
git remote add azure <paste-previous-command-output-here>
```

Push to the Azure remote to deploy your app. You are prompted for the password you supplied earlier when you created the deployment user. Make sure that you enter the password you created in [Configure a deployment user](#configure-a-deployment-user), not the password you use to log in to the Azure portal.

```bash
git push azure master
```

During deployment, Azure App Service will communicate its progress with Git.

```bash
Counting objects: 23, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (21/21), done.
Writing objects: 100% (23/23), 3.71 KiB | 0 bytes/s, done.
Total 23 (delta 8), reused 7 (delta 1)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id 'bf114df591'.
remote: Generating deployment script.
remote: Generating deployment script for node.js Web Site
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling node.js deployment.
remote: Kudu sync from: '/home/site/repository' to: '/home/site/wwwroot'
remote: Copying file: '.gitignore'
remote: Copying file: 'LICENSE'
remote: Copying file: 'README.md'
remote: Copying file: 'index.js'
remote: Copying file: 'package.json'
remote: Copying file: 'process.json'
remote: Deleting file: 'hostingstart.html'
remote: Ignoring: .git
remote: Using start-up script index.js from package.json.
remote: Node.js versions available on the platform are: 4.4.7, 4.5.0, 6.2.2, 6.6.0, 6.9.1.
remote: Selected node.js version 6.9.1. Use package.json file to choose a different version.
remote: Selected npm version 3.10.8
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
To https://<app_name>.scm.azurewebsites.net:443/<app_name>.git
 * [new branch]      master -> master
```

## Browse to the app

Browse to the deployed application using your web browser.

```bash
http://<app_name>.azurewebsites.net
```

This time, the page that displays the Hello World message is running using our Node.js code running as an Azure App Service web app.

## Updating and Deploying the Code

Using a local text editor, open the `index.js` file within the Node.js app, and make a small change to the text within the call to `response.end`:

```nodejs
response.end("Hello Azure!");
```

Commit your changes in git, then push the code changes to Azure.

```bash
git commit -am "updated output"
git push azure master
```

Once deployment has completed, switch back to the browser window that opened in the **Browse to the app** step, and hit refresh.

![hello-world-in-browser](media/app-service-web-get-started-nodejs-poc/hello-world-in-browser.png)

## Manage your new Azure web app

Go to the Azure portal to take a look at the web app you just created.

To do this, sign in to [https://portal.azure.com](https://portal.azure.com).

From the left menu, click **App Services**, then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-get-started-nodejs-poc/nodejs-docs-hello-world-app-service-list.png)

You have landed in your web app's _blade_ (a portal page that opens horizontally).

By default, your web app's blade shows the **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the blade shows the different configuration pages you can open.

![App Service blade in Azure portal](media/app-service-web-get-started-nodejs-poc/nodejs-docs-hello-world-app-service-detail.png)

These tabs in the blade show the many great features you can add to your web app. The following list gives you just a few of the possibilities:

* Map a custom DNS name
* Bind a custom SSL certificate
* Configure continuous deployment
* Scale up and out
* Add user authentication

**Congratulations!** You've deployed your first Node.js app to App Service.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

> [!div class="nextstepaction"]
> [Explore sample Web Apps CLI scripts](app-service-cli-samples.md)
