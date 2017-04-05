---
title: Deploy a Sails.js web app to Azure App Service | Microsoft Docs 
description: Learn how to deploy a Node.js application Azure App Service. This tutorial shows you how to deploy a Sails.js web app.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: erikre
editor: ''

ms.assetid: 8877ddc8-1476-45ae-9e7f-3c75917b4564
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 12/16/2016
ms.author: cephalin

---
# Deploy a Sails.js web app to Azure App Service
This tutorial shows you how to deploy a Sails.js app to Azure App Service. In the process, you can glean some general knowledge
on how to configure your Node.js app to run in App Service.

Here, you will learn useful skills like:

* Configure a Sails.js app run in App Service.
* Deploy an app to App Service from the command line.
* Read stderr and stdout logs to troubleshoot any deployment issues.
* Store environment variables outside of source control.
* Access Azure environment variables from your app.
* Connect to a database (MongoDB).

You should have working knowledge of Sails.js. This tutorial is not intended to help you with issues related to running Sail.js in general.

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](app-service-web-nodejs-sails-cli-nodejs.md) – our CLI for the classic and resource management deployment models
- [Azure CLI 2.0](app-service-web-nodejs-sails.md) - our next generation CLI for the resource management deployment model

## Prerequisites
* [Node.js](https://nodejs.org/)
* [Sails.js](http://sailsjs.org/get-started)
* [Git](http://www.git-scm.com/downloads)
* [Azure CLI 2.0 Preview](/cli/azure/install-az-cli2)
* A Microsoft Azure account. If you don't have an account, you can
  [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) or
  [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

> [!NOTE]
> You can [Try App Service](https://azure.microsoft.com/try/app-service/) without an Azure account. Create a starter app and play with
> it for up to an hour--no credit card required, no commitments.
> 
> 

## Step 1: Create and configure a Sails.js app locally
First, quickly create a default Sails.js app in your development environment by following these steps:

1. Open the command-line terminal of your choice and `CD` to a working directory.
2. Create a Sails.js app and run it:

        sails new <app_name>
        cd <app_name>
        sails lift

    Make sure you can navigate to the default home page at http://localhost:1377.

1. Next, enable logging for Azure. In your root directory, create a file called `iisnode.yml` and add the following two lines:

        loggingEnabled: true
        logDirectory: iisnode

    Logging is now enabled for the [iisnode](https://github.com/tjanczuk/iisnode) server that Azure App Service uses to run Node.js apps. 
    For more information on how this works, see
    [How to debug a Node.js web app in Azure App Service](web-sites-nodejs-debug.md).

2. Next, configure the Sails.js app to use Azure environment variables. Open config/env/production.js to configure your production environment, 
and set `port` and `hookTimeout`:

        module.exports = {

            // Use process.env.port to handle web requests to the default HTTP port
            port: process.env.port,
            // Increase hooks timout to 30 seconds
            // This avoids the Sails.js error documented at https://github.com/balderdashy/sails/issues/2691
            hookTimeout: 30000,

            ...
        };

    You can find documentation for these configuration settings in the
    [Sails.js Documentation](http://sailsjs.org/documentation/reference/configuration/sails-config).

4. Next, hardcode the Node.js version you want to use. In package.json, add the following `engines` property to set the Node.js version to one that we want.

        "engines": {
            "node": "6.9.1"
        },

5. Finally, initialize a Git repository and commit your files. In the application root (where package.json is), run the following Git commands:

        git init
        git add .
        git commit -m "<your commit message>"

Your code is ready to be deployed. 

## Step 2: Create an Azure app and deploy Sails.js

Next, create the App Service resource in Azure and deploy your Sails.js app to it.

1. log in to Azure like so:

        az login

    Follow the prompt to continue the login in a browser with a Microsoft account that has your Azure subscription.

3. Set the deployment user for App Service. You will deploy code using these credentials later.
   
        az appservice web deployment user set --user-name <username> --password <password>

3. Create a [resource group](../azure-resource-manager/resource-group-overview.md) with a name. For this PHP tutorial, you don't really need to know
what it is.

        az group create --location "<location>" --name my-sailsjs-app-group

    To see what possible values you can use for `<location>`, use the `az appservice list-locations` CLI command.

3. Create a "FREE" [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) with a name. For this PHP tutorial, just 
know that you won't be charged for web apps in this plan.

        az appservice plan create --name my-sailsjs-appservice-plan --resource-group my-sailsjs-app-group --sku FREE

4. Create a new web app with a unique name in `<app_name>`.

        az appservice web create --name <app_name> --resource-group my-sailsjs-app-group --plan my-sailsjs-appservice-plan

## Step 3: Configure and deploy your Sails.js app

1. Configure local Git deployment for your new web app with the following command:

        az appservice web source-control config-local-git --name <app_name> --resource-group my-sailsjs-app-group

    You will get a JSON output like this, which means that the remote Git repository is configured:

        {
        "url": "https://<deployment_user>@<app_name>.scm.azurewebsites.net/<app_name>.git"
        }

6. Add the URL in the JSON as a Git remote for your local repository (called `azure` for simplicity).

        git remote add azure https://<deployment_user>@<app_name>.scm.azurewebsites.net/<app_name>.git
   
7. Deploy your sample code to the `azure` Git remote. When prompted, use the deployment credentials you configured earlier.

        git push azure master

7. Finally, just launch your live Azure app in the browser:

        az appservice web browse --name <app_name> --resource-group my-sailsjs-app-group

    You should now see the same Sails.js home page.

    ![](./media/app-service-web-nodejs-sails/sails-in-azure.png)

## Troubleshoot your deployment
If your Sails.js application fails for some reason in App Service, find the stderr logs to help troubleshoot it.
For more information, see [How to debug a Node.js web app in Azure App Service](web-sites-nodejs-debug.md).
If the app has started successfully, the stdout log should show you the familiar message:

                   .-..-.
    
       Sails              <|    .-..-.
       v0.12.11            |\
                          /|.\
                         / || \
                       ,'  |'  \
                    .-'.-==|/_--'
                    `--'-------' 
       __---___--___---___--___---___--___
     ____---___--___---___--___---___--___-__

    Server lifted in `D:\home\site\wwwroot`
    To see your app, visit http://localhost:\\.\pipe\c775303c-0ebc-4854-8ddd-2e280aabccac
    To shut down Sails, press <CTRL> + C at any time.

You can control granularity of the stdout logs in the [config/log.js](http://sailsjs.org/#!/documentation/concepts/Logging) file.

## Connect to a database in Azure
To connect to a database in Azure, you create the database of your choice in Azure, such as Azure SQL Database,
MySQL, MongoDB, Azure (Redis) Cache, etc., and use the corresponding
[datastore adapter](https://github.com/balderdashy/sails#compatibility) to connect to it. The steps in this section
show you how to connect to MongoDB by using an [Azure DocumentDB](../documentdb/documentdb-protocol-mongodb.md) database, which can support MongoDB client connections.

1. [Create a DocumentDB account with MongoDB protocol support](../documentdb/documentdb-create-mongodb-account.md).
2. [Create a DocumentDB collection and database](../documentdb/documentdb-create-collection.md). The name of the collection doesn't matter,
but you need the name of the database when you connect from Sails.js.
3. [Find the connection information for your DocumentDB database](../documentdb/documentdb-connect-mongodb-account.md#a-idgetcustomconnectiona-get-the-mongodb-connection-string-to-customize).
2. From your command-line terminal, install the MongoDB adapter:

        npm install sails-mongo --save

3. Open config/connections.js and add the following connection object to the list:

        docDbMongo: {
            adapter: 'sails-mongo',
            user: process.env.dbuser,
            password: process.env.dbpassword,
            host: process.env.dbhost,
            port: process.env.dbport,
            database: process.env.dbname,
            ssl: true
        },

    > [!NOTE] 
    > The `ssl: true` option is important because [Azure DocumentDB requires it](../documentdb/documentdb-connect-mongodb-account.md#connection-string-requirements). 
    >
    >

4. For each environment variable (`process.env.*`), you need to set it in App Service. To do this, run the following commands
   from your terminal. Use the connection information for your DocumentDB database.

        az appservice web config appsettings update --settings dbuser="<database user>" --name <app_name> --resource-group my-sailsjs-app-group
        az appservice web config appsettings update --settings dbpassword="<database password>" --name <app_name> --resource-group my-sailsjs-app-group
        az appservice web config appsettings update --settings dbhost="<database hostname>" --name <app_name> --resource-group my-sailsjs-app-group
        az appservice web config appsettings update --settings dbport="<database port>" --name <app_name> --resource-group my-sailsjs-app-group
        az appservice web config appsettings update --settings dbname="<database name>" --name <app_name> --resource-group my-sailsjs-app-group

    Putting your settings in Azure app settings keeps sensitive data out of your source control (Git). Next, you will
    configure your development environment to use the same connection information.
5. Open config/local.js and add the following connections object:

        connections: {
            docDbMongo: {
                user: "<database user>",
                password: "<database password>",
                host: "<database hostname>",
                database: "<database name>",
                ssl: true
            },
        },

    This configuration overrides the settings in your config/connections.js file for the local environment. This file
    is excluded by the default .gitignore in your project, so it will not be stored in Git. Now, you are able to connect
    to your DocumentDB (MongoDB) database both from your Azure web app and from your local development environment.
6. Open config/env/production.js to configure your production environment, and add the following `models` object:

        models: {
            connection: 'docDbMongo',
            migrate: 'safe'
        },
7. Open config/env/development.js to configure your development environment, and add the following `models` object:

        models: {
            connection: 'docDbMongo',
            migrate: 'alter'
        },

    `migrate: 'alter'` lets you use database migration features to create and update database collections or tables
    easily. However, `migrate: 'safe'` is used for your Azure (production) environment because Sails.js
    does not allow you to use `migrate: 'alter'` in a production environment (see
    [Sails.js Documentation](http://sailsjs.org/documentation/concepts/models-and-orm/model-settings)).
8. From the terminal, [generate](http://sailsjs.org/documentation/reference/command-line-interface/sails-generate) a Sails.js
   [blueprint API](http://sailsjs.org/documentation/concepts/blueprints) like you normally would, then run `sails lift` to
   create the database with Sails.js database migration. For example:

         sails generate api mywidget
         sails lift

    The `mywidget` model generated by this command is empty, but we can use it to show that we have database connectivity.
    When you run `sails lift`, it creates the missing collections and tables for the models your app uses.
9. Access the blueprint API you just created in the browser. For example:

        http://localhost:1337/mywidget/create

    The API should return the created entry back to you in the browser window, which means that your collection is created
    successfully.

        {"id":1,"createdAt":"2016-09-23T13:32:00.000Z","updatedAt":"2016-09-23T13:32:00.000Z"}
10. Now, push your changes to Azure, and browse to your app to make sure it still works.

         git add .
         git commit -m "<your commit message>"
         git push azure master
         az appservice web browse --name <app_name> --resource-group my-sailsjs-app-group

11. Access the blueprint API of your Azure web app. For example:

         http://<appname>.azurewebsites.net/mywidget/create

     If the API returns another new entry, then your Azure web app is talking to your DocumentDB (MongoDB) database.

## More resources
* [Get started with Node.js web apps in Azure App Service](app-service-web-get-started-nodejs.md)
* [Using Node.js Modules with Azure applications](../nodejs-use-node-modules-azure-apps.md)
