---
title: Create a Python web app in Azure | Microsoft Docs
description: Deploy your first Python Hello World in Azure App Service Web Apps in minutes.
services: app-service\web
documentationcenter: ''
author: syntaxc4
manager: erikre
editor: ''

ms.assetid: 928ee2e5-6143-4c0c-8546-366f5a3d80ce
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 03/17/2017
ms.author: cfowler
ms.custom: mvc
---
# Create a Python web app in Azure

[Azure Web Apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) provides a highly scalable, self-patching web hosting service.  This quickstart walks through how to develop and deploy a Python app to Azure Web Apps. You create the web app using the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), and you use Git to deploy sample Python code to the web app.

![Sample app running in Azure](media/app-service-web-get-started-python/hello-world-in-browser.png)

You can follow the steps below using a Mac, Windows, or Linux machine. Once the prerequisites are installed, it takes about five minutes to complete the steps.
## Prerequisites

To complete this tutorial:

1. [Install Git](https://git-scm.com/)
1. [Install Python](https://www.python.org/downloads/)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine.

```bash
git clone https://github.com/Azure-Samples/python-docs-hello-world
```

You use this terminal window to run all the commands in this quickstart.

Change to the directory that contains the sample code.

```bash
cd Python-docs-hello-world
```

## Run the app locally

Run the application locally by opening a terminal window and using the `Python` command to launch the built-in Python web server.

```bash
python main.py
```

Open a web browser, and navigate to the sample app at http://localhost:5000.

You can see the **Hello World** message from the sample app displayed in the page.

![Sample app running locally](media/app-service-web-get-started-python/localhost-hello-world-in-browser.png)

In your terminal window, press **Ctrl+C** to exit the web server.

[!INCLUDE [Log in to Azure](../../includes/login-to-azure.md)] 

[!INCLUDE [Configure deployment user](../../includes/configure-deployment-user.md)] 

<<<<<<< HEAD
```azurecli
az login
```

## Configure a Deployment User

For FTP and local Git it is necessary to have a deployment user configured on the server to authenticate your deployment. Creating a deployment user is a one time configuration, take a note of the `username` and `password` as they will be used in a step below.

> [!NOTE]
> A deployment user is required for FTP and Local Git deployment to a web app.
> The `username` and `password` are account-level, and as such are different from your Azure Subscription credentials. **These credentials are only required to be created once**.
>
=======
[!INCLUDE [Create resource group](../../includes/app-service-web-create-resource-group.md)] 
>>>>>>> refs/remotes/Microsoft/master

[!INCLUDE [Create app service plan](../../includes/app-service-web-create-app-service-plan.md)] 

[!INCLUDE [Create web app](../../includes/app-service-web-create-web-app.md)] 

<<<<<<< HEAD
Create a resource group with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like web apps, databases and storage accounts are deployed and managed.

```azurecli
az group create --name myResourceGroup --location westeurope
```

## Create an Azure App Service

Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command.

> [!NOTE]
> An App Service plan represents the collection of physical resources used to host your apps. All applications assigned to an App Service plan share the resources defined by it allowing you to save cost when hosting multiple apps.
>
> App Service plans define:
> * Region (North Europe, East US, Southeast Asia)
> * Instance Size (Small, Medium, Large)
> * Scale Count (one, two or three instances, etc.)
> * SKU (Free, Shared, Basic, Standard, Premium)
>

The following example creates an App Service Plan named `quickStartPlan` using the **FREE** pricing tier.

```azurecli
az appservice plan create --name quickStartPlan --resource-group myResourceGroup --sku FREE
```

When the App Service Plan has been created, the Azure CLI shows information similar to the following example.

```json
{
"appServicePlanName": "quickStartPlan",
"geoRegion": "North Europe",
"id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/quickStartPlan",
"kind": "app",
"location": "North Europe",
"maximumNumberOfWorkers": 1,
"name": "quickStartPlan",
"provisioningState": "Succeeded",
"resourceGroup": "myResourceGroup",
"sku": {
  "capacity": 0,
  "family": "F",
  "name": "F1",
  "size": "F1",
  "tier": "Free"
},
"status": "Ready",
"type": "Microsoft.Web/serverfarms",
}
```

## Create a web app

Now that an App Service plan has been created, create a web app within the `quickStartPlan` App Service plan. The web app gives us a hosting space to deploy our code as well as provides a URL for us to view the deployed application. Use the [az appservice web create](/cli/azure/appservice/web#create) command to create the web app.

In the command below please substitute your own unique app name where you see the `<app_name>` placeholder. The `<app_name>` will be used as the default DNS site for the web app, and so the name needs to be unique across all apps in Azure. You can later map any custom DNS entry to the web app before you expose it to your users.

```azurecli
az appservice web create --name **<app_name>** --resource-group myResourceGroup --plan quickStartPlan
```

When the web app has been created, the Azure CLI shows information similar to the following example.

```json
{
  "clientAffinityEnabled": true,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "<app_name>.azurewebsites.net",
    "<app_name>.scm.azurewebsites.net"
  ],
  "hostNames": [
    "<app_name>.azurewebsites.net"
  ],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/<app_name>",
  "kind": "app",
  "location": "North Europe",
  "outboundIpAddresses": "13.69.190.80,13.69.191.239,13.69.186.193,13.69.187.34",
  "resourceGroup": "myResourceGroup",
  "serverFarmId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/quickStartPlan",
  "state": "Running",
  "type": "Microsoft.Web/sites",
}
```


Browse to *http://<app_name>.azurewebsites.net* to see your newly created Web App.



![app-service-web-service-created](media/app-service-web-get-started-python/app-service-web-service-created.png)


We’ve now created an empty new Web App in Azure. Let’s configure our Web App to use Python and deploy our app to it.

=======
![Empty web app page](media/app-service-web-get-started-python/app-service-web-service-created.png)

You’ve created an empty new web app in Azure.
>>>>>>> refs/remotes/Microsoft/master

## Configure to use Python

Use the [az appservice web config update](/cli/azure/app-service/web/config#update) command to configure the web app to use Python version `3.4`.

<<<<<<< HEAD
> [!TIP]
> Setting the Python version this way uses a default container provided by the platform, if you would like to use your own container refer to the CLI reference for the  [az appservice web config container update](https://docs.microsoft.com/cli/azure/appservice/web/config/container#update) command.

```azurecli
az appservice web config update --python-version 3.4 --name <app-name> --resource-group myResourceGroup
```

## Configure local git deployment

You can deploy to your web app in a variety of ways including FTP, local Git as well as GitHub, Visual Studio Team Services and Bitbucket.

Use the [az appservice web source-control config-local-git](/cli/azure/appservice/web/source-control#config-local-git) command to configure local git access to the web app.

```azurecli
az appservice web source-control config-local-git --name <app_name> --resource-group myResourceGroup --query url --output tsv
```

Copy the output from the terminal as it will be used in the next step. Now browse to *https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git*


## Push to Azure from Git

Add an Azure remote to your local Git repository.

```bash
git remote add azure <paste-previous-command-output-here>
=======
```azurecli-interactive
az appservice web config update --python-version 3.4 --name <app_name> --resource-group myResourceGroup
>>>>>>> refs/remotes/Microsoft/master
```

Setting the Python version this way uses a default container provided by the platform. To use your own container, see the CLI reference for the [az appservice web config container update](https://docs.microsoft.com/cli/azure/appservice/web/config/container#update) command.

[!INCLUDE [Configure local git](../../includes/app-service-web-configure-local-git.md)] 

[!INCLUDE [Push to Azure](../../includes/app-service-web-git-push-to-azure.md)] 

```bash
Counting objects: 18, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (16/16), done.
Writing objects: 100% (18/18), 4.31 KiB | 0 bytes/s, done.
Total 18 (delta 4), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id '44e74fe7dd'.
remote: Generating deployment script.
remote: Generating deployment script for python Web Site
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling python deployment.
remote: KuduSync.NET from: 'D:\home\site\repository' to: 'D:\home\site\wwwroot'
remote: Deleting file: 'hostingstart.html'
remote: Copying file: '.gitignore'
remote: Copying file: 'LICENSE'
remote: Copying file: 'main.py'
remote: Copying file: 'README.md'
remote: Copying file: 'requirements.txt'
remote: Copying file: 'virtualenv_proxy.py'
remote: Copying file: 'web.2.7.config'
remote: Copying file: 'web.3.4.config'
remote: Detected requirements.txt.  You can skip Python specific steps with a .skipPythonDeployment file.
remote: Detecting Python runtime from site configuration
remote: Detected python-3.4
remote: Creating python-3.4 virtual environment.
remote: .................................
remote: Pip install requirements.
remote: Successfully installed Flask click itsdangerous Jinja2 Werkzeug MarkupSafe
remote: Cleaning up...
remote: .
remote: Overwriting web.config with web.3.4.config
remote:         1 file(s) copied.
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
To https://<app_name>.scm.azurewebsites.net/<app_name>.git
 * [new branch]      master -> master
```

## Browse to the app

Browse to the deployed application at *http://<app_name>.azurewebsites.net* using your web browser.

The Python sample code is running in an Azure App Service web app.

<<<<<<< HEAD

![hello-world-in-browser](media/app-service-web-get-started-python/hello-world-in-browser.png)


## Updating and Deploying the Code
=======
![Sample app running in Azure](media/app-service-web-get-started-python/hello-world-in-browser.png)

**Congratulations!** You've deployed your first Python app to App Service.

## Update and redeploy the code
>>>>>>> refs/remotes/Microsoft/master

Using a local text editor, open the `main.py` file in the Python app, and make a small change to the text next to the `return` statement:

```python
return 'Hello, Azure!'
```

Commit your changes in Git, and then push the code changes to Azure.

```bash
git commit -am "updated output"
git push azure master
```

Once deployment has completed, switch back to the browser window that opened in the [Browse to the app](#browse-to-the-app) step, and refresh the page.

![Updated sample app running in Azure](media/app-service-web-get-started-python/hello-azure-in-browser.png)

## Manage your new Azure web app

Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the web app you created.

From the left menu, click **App Services**, and then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-get-started-nodejs-poc/nodejs-docs-hello-world-app-service-list.png)

You see your web app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete. 

![App Service blade in Azure portal](media/app-service-web-get-started-nodejs-poc/nodejs-docs-hello-world-app-service-detail.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Python with PostgreSQL](app-service-web-tutorial-docker-python-postgresql-app.md)
