<properties
	pageTitle="Deploy a Sails.js web app to Azure App Service"
	description="Learn how to deploy a Node.js application Azure App Service. This tutorial shows you how to deploy a Sails.js web app."
	services="app-service\web"
	documentationCenter="nodejs"
	authors="cephalin"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="nodejs"
	ms.topic="article"
	ms.date="09/23/2016"
	ms.author="cephalin"/>

# Deploy a Sails.js web app to Azure App Service

This tutorial shows you how to deploy a Sails.js app to Azure App Service. In the process, you can glean some general knowledge
on how to configure your Node.js app to run in App Service. 

You should have working knowledge of Sails.js. This tutorial is not intended to help you with issues related to running Sail.js in general.


## Prerequisites

- [Node.js](https://nodejs.org/)
- [Sails.js](http://sailsjs.org/get-started)
- [Git](http://www.git-scm.com/downloads)
- [Azure CLI](../xplat-cli-install.md)
- A Microsoft Azure account. If you don't have an account, you can
[sign up for a free trial](/pricing/free-trial/?WT.mc_id=A261C142F) or
[activate your Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

>[AZURE.NOTE] To see Azure App Service in action before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751). There,
you can immediately create a short-lived starter app in App Service—no credit card required, no commitments.

## Step 1: Create a Sails.js app locally

First, quickly create a default Sails.js app in your development environment by following these steps:

1. Open the command-line terminal of your choice and `CD` to a working directory.

2. Create a Sails.js app and run it:

        sails new <appname>
        cd <appname>
        sails lift

    Make sure you can navigate to the default home page at http://localhost:1377.

## Step 2: Create the Azure app resource

Next, create the App Service resource in Azure. You're going to deploy your Sails.js app to it later.

1. log in to Azure like so:
1. In the same terminal, change into ASM mode and log in to Azure:

        azure config mode asm
        azure login

    Follow the prompt to continue the login in a browser with a Microsoft account that has your Azure subscription.

2. Make sure you're still in the root directory of your Sails.js project. Create the App Service app resource in Azure with a unique
app name with the next command. Your web app's URL is http://&lt;appname>.azurewebsites.net.

        azure site create --git <appname>

    Follow the prompt to select an Azure region to deploy to. If you've never set up Git/FTP deployment credentials for your Azure
    subscription, you'll also be prompted to create them.

    Once the App Service app resource is created:

    - Sails.js app is Git-initialized,
    - Your local Git-initialized repository is connected to the new App Service app as a Git remote, aptly named "azure", and
    - And iisnode.yml file is created in your root directory. You can use this file to configure [iisnode](https://github.com/tjanczuk/iisnode),
    which App Service uses to run Node.js apps.

## Step 3: Configure and deploy your Sails.js app

 Working with a Sails.js app in App Service consists of three main steps:

 - Configure your app for it to run in App Service
 - Deploy it to App Service
 - Read stderr and stdout logs to troubleshoot any deployment issues

Follow these steps:

1. Open the new iisnode.yml file in your root directory and add the following two lines:

        loggingEnabled: true
        logDirectory: iisnode

    Logging is now enabled for iisnode. For more information on how this works, see
    [Get stdout and stderr logs from iisnode](app-service-web-nodejs-get-started.md#iisnodelog).

2. Open config/env/production.js to configure your production environment, and set `port` and `hookTimeout`:

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

    Next, you need to make sure that [Grunt](https://www.npmjs.com/package/grunt) is compatible with Azure's network 
    drives. Grunt versions less than 1.0.0 uses an outdated [glob](https://www.npmjs.com/package/glob) package 
    (less than 5.0.14), which doesn't support network drives. 

3. Open package.json and change the `grunt` version to `1.0.0` and remove all `grunt-*` packages. Your `dependencies` 
property should look like this:

        "dependencies": {
            "ejs": "<leave-as-is>",
            "grunt": "1.0.0",
            "include-all": "<leave-as-is>",
            "rc": "<leave-as-is>",
            "sails": "<leave-as-is>",
            "sails-disk": "<leave-as-is>",
            "sails-sqlserver": "<leave-as-is>"
        },

3. In package.json, add the following `engines` property to set the Node.js version to one that we want.

        "engines": {
            "node": "6.6.0"
        },

6. Save your changes and test your changes to make sure that your app still runs locally. To do this, delete the
`node_modules` folder and then run:

        npm install
        sails lift

4. Now, use git to deploy your app to Azure:

        git add .
        git commit -m "<your commit message>"
        git push azure master

5. Finally, just launch your live Azure app in the browser:

        azure site browse

    You should now see the same Sails.js home page.
    
    ![](./media/app-service-web-nodejs-sails/sails-in-azure.png)

## Troubleshoot your deployment

If your Sails.js application fails for some reason in App Service, find the stderr logs to help troubleshoot it.
For more information, see [Get stdout and stderr logs from iisnode](app-service-web-nodejs-sails.md#iisnodelog).
If it has started successfully, the stdout log should show you the familiar message:

                .-..-.

    Sails              <|    .-..-.
    v0.12.4             |\
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
show you how to connect to a MySQL database in Azure.

1. Follow the tutorial [here](../store-php-create-mysql-database.md) to create a MySQL database in Azure.

2. From your command-line terminal, install the MySQL adapter:

        npm install sails-mysql --save

3. Open config/connections.js and add the following connection object to the list: 

        mySql: {
            adapter: 'sails-mysql',
            user: process.env.dbuser,
            password: process.env.dbpassword,
            host: process.env.dbhost, 
            database: process.env.dbname,
            options: {
                encrypt: true
            }
        },

4. For each environment variable (`process.env.*`), you need to set it in App Service. To do this, run the following commands 
from your terminal. All connection information you need is in the Azure portal (see 
[Connect to your MySQL database](../store-php-create-mysql-database.md#connect)).

        azure site appsetting add dbuser="<database user>"
        azure site appsetting add dbpassword="<database password>"
        azure site appsetting add dbhost="<database hostname>"
        azure site appsetting add dbname="<database name>"
        
    Putting your settings in Azure app settings keeps sensitive data out of your source control (Git). Next, you will
    configure your development environment to use the same connection information.

4. Open config/local.js and add the following connections object:

        connections: {
            mySql: {
                user: "<database user>",
                password: "<database password>",
                host: "<database hostname>", 
                database: "<database name>",
            },
        },
    
    This configuration overrides the settings in your config/connections.js file for the local environment. This file
    is excluded by the default .gitignore in your project, so it will not be stored in Git. Now, you are able to connect
    to your MySQL database both from your Azure web app and from your local development environment.

4. Open config/env/production.js to configure your production environment, and add the following `models` object:

        models: {
            connection: 'mySql',
            migrate: 'safe'
        },

4. Open config/env/development.js to configure your development environment, and add the following `models` object:

        models: {
            connection: 'mySql',
            migrate: 'alter'
        },

    `migrate: 'alter'` lets you use database migration features to create and update your database tables in your
    MySQL easily. However, `migrate: 'safe'` is used for your Azure (production) environment because Sails.js
    does not allow you to use `migrate: 'alter'` in a production environment (see 
    [Sails.js Documentation](http://sailsjs.org/documentation/concepts/models-and-orm/model-settings)).

4. From the terminal, [generate](http://sailsjs.org/documentation/reference/command-line-interface/sails-generate) a Sails.js 
[blueprint API](http://sailsjs.org/documentation/concepts/blueprints) like you normally would, then run `sails lift` to
create the database with Sails.js database migration. For example:

         sails generate api mywidget
         sails lift

    The `mywidget` model generated by this command is empty, but we can use it to show that we have database connectivity.
    When you run `sails lift`, it creates the missing tables for the models your app uses.

6. Access the blueprint API you just created in the browser. For example:

        http://localhost:1337/mywidget/create
    
    The API should return the created entry back to you in the browser window, which means that your database is created
    successfully.

        {"id":1,"createdAt":"2016-09-23T13:32:00.000Z","updatedAt":"2016-09-23T13:32:00.000Z"}

5. Now, push your changes to Azure, and browse to your app to make sure it still works.

        git add .
        git commit -m "<your commit message>"
        git push azure master
        azure site browse

6. Access the blueprint API of your Azure web app. For example:

        http://<appname>.azurewebsites.net/mywidget/create

    If the API returns another new entry, then your Azure web app is talking to your MySQL database.

## More resources

- [Get started with Node.js web apps in Azure App Service](app-service-web-nodejs-get-started.md)
- [Using Node.js Modules with Azure applications](../nodejs-use-node-modules-azure-apps.md)
