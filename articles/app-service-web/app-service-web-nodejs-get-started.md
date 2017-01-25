---
title: Develop Node.js web apps for Azure App Service | Microsoft Docs 
description: Learn how to deploy a Node.js application to a web app in Azure App Service.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: wpickett
editor: ''

ms.assetid: fb2b90c8-02b6-4700-929b-5de9a35d67cc
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: get-started-article
ms.date: 12/16/2016
ms.author: cephalin

---
# Develop Node.js web apps for Azure App Service
[!INCLUDE [tabs](../../includes/app-service-web-get-started-nav-tabs.md)]

This tutorial shows how to create a simple [Node.js] application and deploy it to [Azure App Service] from a command-line environment, such as cmd.exe or bash. The instructions in this tutorial can be followed on any operating system that can run Node.js.

[!INCLUDE [app-service-linux](../../includes/app-service-linux.md)]

<a name="prereq"></a>

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](app-service-web-nodejs-get-started-cli-nodejs.md) – our CLI for the classic and resource management deployment models
- [Azure CLI 2.0 (Preview)](app-service-web-nodejs-get-started.md) - our next generation CLI for the resource management deployment model

## Prerequisites
* [Node.js]
* [Bower]
* [Yeoman]
* [Git]
* [Azure CLI 2.0 Preview](/cli/azure/install-az-cli2)
* A Microsoft Azure account. If you don't have an account, you can [sign up for a free trial] or [activate your Visual Studio subscriber benefits].

> [!NOTE]
> You can [Try App Service](https://azure.microsoft.com/try/app-service/) without an Azure account. Create a starter app and play with
> it for up to an hour--no credit card required, no commitments.
> 
> 

## Create and configure a simple Node.js app for Azure
1. Open the command-line terminal of your choice and install the [Express generator for Yeoman].
   
        npm install -g generator-express

2. `CD` to a working directory and generate an express app using the following syntax:
   
        yo express
   
    Choose the following options when prompted:  
   
    `? Would you like to create a new directory for your project?` **Yes**  
    `? Enter directory name` **{appname}**  
    `? Select a version to install:` **MVC**  
    `? Select a view engine to use:` **Jade**  
    `? Select a css preprocessor to use (Sass Requires Ruby):` **None**  
    `? Select a database to use:` **None**  
    `? Select a build tool to use:` **Grunt**

3. `CD` to the root directory of your new app and start it to make sure it runs in your development environment:
   
        npm start
   
    In your browser, navigate to <http://localhost:3000> to make sure that you can see the Express home page. Once you've verified your app runs properly, use `Ctrl-C` to stop it.

6. Open the ./config/config.js file from the root of your application and change the production port to `process.env.port`; your `production` property in the `config` object should look like the following example:
   
        production: {
            root: rootPath,
            app: {
                name: 'express1'
            },
            port: process.env.port,
        }
   
    > [!NOTE] 
    > By default, Azure App Service runs Node.js applications with the `production` environment variables (`process.env.NODE_ENV="production"`.
    > Therefore, your configuration here lets your Node.js app in Azure respond to web requests on the default port that iisnode listens.
    >
    >

7. Open ./package.json and add the `engines` property to [specify the desired Node.js version](#version).
   
        "engines": {
            "node": "6.9.1"
        }, 

8. Save your changes, then initialize a Git repository in the root of your application and commit your code:
   
        git add .
        git add -f config
        git commit -m "{your commit message}"

## Deploy your Node.js app to Azure

1. Log in to Azure (you need [Azure CLI 2.0 Preview](#prereq)):
   
        az login
   
    Follow the prompt to continue the login in a browser with a Microsoft account that has your Azure subscription.

3. Set the deployment user for App Service. You will deploy code using these credentials later.
   
        az appservice web deployment user set --user-name <username> --password <password>

3. Create a new [resource group](../azure-resource-manager/resource-group-overview.md). For this node.js tutorial, you don't really need to know
what it is.

        az group create --location "<location>" --name my-nodejs-app-group

    To see what possible values you can use for `<location>`, use the `az appservice list-locations` CLI command.

3. Create a new "FREE" [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). For this node.js tutorial, just 
know that you won't be charged for web apps in this plan.

        az appservice plan create --name my-nodejs-appservice-plan --resource-group my-nodejs-app-group --sku FREE

4. Create a new web app with a unique name in `<app_name>`.

        az appservice web create --name <app_name> --resource-group my-nodejs-app-group --plan my-nodejs-appservice-plan

5. Configure local Git deployment for your new web app with the following command:

        az appservice web source-control config-local-git --name <app_name> --resource-group my-nodejs-app-group

    You will get a JSON output like this, which means that the remote Git repository is configured:

        {
        "url": "https://<deployment_user>@<app_name>.scm.azurewebsites.net/<app_name>.git"
        }

6. Add the URL in the JSON as a Git remote for your local repository (called `azure` for simplicity).

        git remote add azure https://<deployment_user>@<app_name>.scm.azurewebsites.net/<app_name>.git
   
7. Deploy your sample code to the `azure` Git remote. When prompted, use the deployment credentials you configured earlier.

        git push azure master
   
    The Express generator already provides a .gitignore file, so your `git push` doesn't consume bandwidth trying to upload the node_modules/ directory.

9. Finally, launch your live Azure app in the browser:
   
        az appservice web browse --name <app_name> --resource-group my-nodejs-app-group
   
    You should now see your Node.js web app running live in Azure App Service.
   
    ![Example of browsing to the deployed application.][deployed-express-app]

## Update your Node.js web app
To make updates to your Node.js web app running in App Service, just run `git add`, `git commit`, and `git push` like you did when you first deployed your web app.

## How App Service deploys your Node.js app
Azure App Service uses [iisnode] to run Node.js apps. Azure CLI 2.0 Preview and the Kudu engine (Git deployment) work together to give you a streamlined experience when you develop and deploy Node.js apps from the command line. 

* You can create an iisnode.yml file in your root directory and use it to customize iisnode properties. All configurable settings are documented [here](https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/iisnode.yml).
* At `git push azure master`, Kudu automates the following deployment tasks:
  
  * If package.json is in the repository root, run `npm install --production`.
  * Generate a Web.config for iisnode that points to your start script in package.json (e.g. server.js or app.js).
  * Customize Web.config to ready your app for debugging with Node-Inspector.

## Use a Node.js framework
If you use a popular Node.js framework, such as [Sails.js][SAILSJS] or [MEAN.js][MEANJS] to develop apps, you can deploy those to App Service. Popular Node.js frameworks have their specific quirks, and their package dependencies keep getting updated. However, App Service makes the stdout and stderr logs available to you, so you can know exactly what's happening with your app and make changes accordingly. For more information, see [Get stdout and stderr logs from iisnode](#iisnodelog).

The following tutorials will show you how to work with a specific framework in App Service:

* [Deploy a Sails.js web app to Azure App Service]
* [Create a Node.js chat application with Socket.IO in Azure App Service]
* [How to use io.js with Azure App Service Web Apps]

<a name="version"></a>

## Use a specific Node.js engine
In your typical workflow, you tell App Service to use a specific Node.js engine as you normally would in package.json.
For example:

    "engines": {
        "node": "6.9.1"
    }, 

The Kudu deployment engine determines which Node.js engine to use in the following order:

* First, look at iisnode.yml to see if `nodeProcessCommandLine` is specified. If yes, then use that.
* Next, look at package.json to see if `"node": "..."` is specified in the `engines` object. If yes, then use that.
* Choose a default Node.js version by default.

For the updated list of all supported Node.js/NPM versions in Azure App Service, access the following URL for your app:

    https://<app_name>.scm.azurewebsites.net/api/diagnostics/runtime

> [!NOTE]
> It is recommended that you explicitly define the Node.js engine you want. The default Node.js version can change,
> and you may get errors in your Azure web app because the default Node.js version is not appropriate for your app.
> 
> 

<a name="iisnodelog"></a>

## Get stdout and stderr logs from iisnode
To read iisnode logs, follow these steps.

> [!NOTE]
> After completing these steps, log files may not exist until an error occurs.
> 
> 

1. Open the iisnode.yml file that Azure CLI 2.0 Preview provides.
2. Set the two following parameters: 
   
        loggingEnabled: true
        logDirectory: iisnode
   
    Together, they tell iisnode in App Service to put its stdout and stderror output in the D:\home\site\wwwroot\**iisnode** directory.
3. Save your changes, then push your changes to Azure with the following Git commands:
   
        git add .
        git commit -m "{your commit message}"
        git push azure master
   
    iisnode is now configured. The next steps show you how to access these logs.
4. In your browser, access the Kudu debug console for your app, which is at:
   
        https://{appname}.scm.azurewebsites.net/DebugConsole 
   
    This URL differs from the web app URL by the addition of "*.scm.*" to the DNS name. If you omit that addition to the URL, you will get a 404 error.
5. Navigate to D:\home\site\wwwroot\iisnode
   
    ![Navigating to the location of the iisnode log files.][iislog-kudu-console-find]
6. Click the **Edit** icon for the log you want to read. You can also click **Download** or **Delete** if you want.
   
    ![Opening an iisnode log file.][iislog-kudu-console-open]
   
    Now you can see the log to help you debug your App Service deployment.
   
    ![Examining an iisnode log file.][iislog-kudu-console-read]

## Debug your app with Node-Inspector
If you use Node-Inspector to debug your Node.js apps, you can use it for your live App Service app. Node-Inspector is preinstalled in the iisnode installation for App Service. And if you deploy through Git, the auto-generated Web.config from Kudu already contains all the configuration you need to enable Node-Inspector.

To enable Node-Inspector, follow these steps:

1. Open iisnode.yml at your repository root and specify the following parameters: 
   
        debuggingEnabled: true
        debuggerExtensionDll: iisnode-inspector.dll
2. Save your changes, then push your changes to Azure with the following Git commands:
   
        git add .
        git commit -m "{your commit message}"
        git push azure master
3. Now, just navigate to your app's start file as specified by the start script in your package.json, with /debug added to the URL. For example,
   
        http://{appname}.azurewebsites.net/server.js/debug
   
    Or,
   
        http://{appname}.azurewebsites.net/app.js/debug

## More resources
* [Specifying a Node.js version in an Azure application](../nodejs-specify-node-version-azure-apps.md)
* [Best practices and troubleshooting guide for Node.js applications on Azure](app-service-web-nodejs-best-practices-and-troubleshoot-guide.md)
* [How to debug a Node.js web app in Azure App Service](web-sites-nodejs-debug.md)
* [Using Node.js Modules with Azure applications](../nodejs-use-node-modules-azure-apps.md)
* [Azure App Service Web Apps: Node.js](http://blogs.msdn.com/b/silverlining/archive/2012/06/14/windows-azure-websites-node-js.aspx)
* [Node.js Developer Center](/develop/nodejs/)
* [Get started with web apps in Azure App Service](app-service-web-get-started.md)
* [Exploring the Super Secret Kudu Debug Console]

<!-- URL List -->

[Azure App Service]: ../app-service/app-service-value-prop-what-is.md
[activate your Visual Studio subscriber benefits]: http://go.microsoft.com/fwlink/?LinkId=623901
[Bower]: http://bower.io/
[Create a Node.js chat application with Socket.IO in Azure App Service]: ./web-sites-nodejs-chat-app-socketio.md
[Deploy a Sails.js web app to Azure App Service]: ./app-service-web-nodejs-sails.md
[Exploring the Super Secret Kudu Debug Console]: /documentation/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[Express generator for Yeoman]: https://github.com/petecoop/generator-express
[Git]: http://www.git-scm.com/downloads
[How to use io.js with Azure App Service Web Apps]: ./web-sites-nodejs-iojs.md
[iisnode]: https://github.com/tjanczuk/iisnode/wiki
[MEANJS]: http://meanjs.org/
[Node.js]: http://nodejs.org
[SAILSJS]: http://sailsjs.org/
[sign up for a free trial]: http://go.microsoft.com/fwlink/?LinkId=623901
[web app]: ./app-service-web-overview.md
[Yeoman]: http://yeoman.io/

<!-- IMG List -->

[deployed-express-app]: ./media/app-service-web-nodejs-get-started/deployed-express-app.png
[iislog-kudu-console-find]: ./media/app-service-web-nodejs-get-started/iislog-kudu-console-navigate.png
[iislog-kudu-console-open]: ./media/app-service-web-nodejs-get-started/iislog-kudu-console-open.png
[iislog-kudu-console-read]: ./media/app-service-web-nodejs-get-started/iislog-kudu-console-read.png
