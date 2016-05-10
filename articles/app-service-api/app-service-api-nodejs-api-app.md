<properties
	pageTitle="Node.js API app in Azure App Service| Microsoft Azure"
	description="Learn how to create a Node.js RESTful API and deploy it to an API app in Azure App Service."
	services="app-service\api"
	documentationCenter="node"
	authors="bradygaster"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="node"
	ms.topic="get-started-article"
	ms.date="05/06/2016"
	ms.author="bradygaster"/>

# Build a Node.js RESTful API and deploy it to an API app in Azure

[AZURE.INCLUDE [app-service-api-get-started-selector](../../includes/app-service-api-get-started-selector.md)]

This tutorial shows how to create a simple [Node.js](http://nodejs.org) API and deploy it to an [API app](app-service-api-apps-why-best-platform.md) in 
[Azure App Service](../app-service/app-service-value-prop-what-is.md). You'll do all your work using command line tools such as cmd.exe or bash, and you can use any operating system that is capable of running Node.js.

## Prerequisites

1. [Node.js](http://nodejs.org) installed (this sample assumes you have Node.js version 4.2.2)
2. [Git](https://git-scm.com/) installed
1. [GitHub](https://github.com/) account
1. Microsoft Azure [free trial account](https://azure.microsoft.com/pricing/free-trial/)

## API development workflow overview

The API development workflow modeled by this tutorial involves creating a Swagger metadata JSON file and using that to scaffold server code for the API. 

You would typically use a tool such as the [Swagger editor](http://swagger.io/swagger-editor/) to create the metadata file, but for this tutorial you'll download a sample Swagger metadata for a simple contact list API. Then you'll do the following steps:

* Use Yeoman to scaffold Node.js code for the contact list API.
* Customize the scaffolded code.
* Test the API as it runs locally.
* Create an API app in Azure.
* Deploy your Node.js code to the new API app.
* Test the API in Azure.

## Set up the development environment and get the sample code

The commands below should be performed using the Node.js command line. By using the Swaggerize Yo generator, you can scaffold the baseline Node.js code you'll need to service HTTP requests defined in a Swagger JSON file. 
 
1. Install **yo** and the **generator-swaggerize** NPM modules globally.

		npm install -g yo
		npm install -g generator-swaggerize

1. Clone the [GitHub repository containing the sample code](https://github.com/Azure-Samples/app-service-api-node-contact-list).

		git clone https://github.com/Azure-Samples/app-service-api-node-contact-list.git

## Scaffold Node.js code based on Swagger metadata

2. Navigate to the *start* folder, and then execute the `yo swaggerize` command to scaffold the API based on the **api.json** file included with the source code. When you're asked for a project name, enter "contactlist", and when you're asked to select a view engine, select "express".

	**Note**: if you encounter an error in this step, the next step explains how to fix it.

		yo swaggerize

	![Swaggerize Command Line](media/app-service-api-nodejs-api-app/swaggerize-command-line.png)
    
	The **api.json** file contains Swagger JSON that represents the actual API that will be hosted by the API app. Swaggerize will scaffold the handlers and config based on the Swagger metadata included in **api.json**. Swaggerize generates a **package.json** file in your application's folder.  This sample will make use of the express view engine to generate the Swagger help page later when your API app is running in Azure (or locally).  

3. If the swaggerize command fails with an "unexpected token" or "invalid escape sequence" error, correct the cause of the error by editing the generated *package.json* file. In the `regenerate` line under `scripts`, change the back slash that precedes *api.json* to a forward slash, so that the line looks like the following example:

 		"regenerate": "yo swaggerize --only=handlers,models,tests --framework express --apiPath config/api.json"

1. Move into the folder containing the scaffolded code (in this case, the *ContactList* subfolder).

1. Run `npm install`.
	
		npm install
		
2. Install the **jsonpath** NPM module. 

		npm install --save jsonpath
        
    ![Jsonpath Install](media/app-service-api-nodejs-api-app/jsonpath-install.png)

1. Install the **swaggerize-ui** NPM module. 

		npm install --save swaggerize-ui
        
    ![Swaggerize Ui Install](media/app-service-api-nodejs-api-app/swaggerize-ui-install.png)

## Customize the scaffolded code

1. Copy the **lib** folder from the **start** folder into the **ContactList** folder created by the scaffolder. 

1. Replace the code in the **handlers/contacts.js** file with the code below. This code uses the JSON data stored in the **lib/contacts.json** file that is served by **lib/contactRepository.js**. The new contacts.js code below will respond to HTTP requests to get all of the contacts using this code. 

        'use strict';
        
        var repository = require('../lib/contactRepository');
        
        module.exports = {
            get: function contacts_get(req, res) {
                res.json(repository.all())
            }
        };

1. Replace the code in the **handlers/contacts/{id}.js** file with the code below, which will use **lib/contactRepository.js** to get the contact requested by the HTTP request and return it as a JSON payload. 

        'use strict';

        var repository = require('../../lib/contactRepository');
        
        module.exports = {
            get: function contacts_get(req, res) {
                res.json(repository.get(req.params['id']));
            }    
        };

1. Replace the code in **server.js** with the code below. Note, the changes made to the server.js file are highlighted using comments so you can see the changes being made. 

        'use strict';

        var port = process.env.PORT || 8000; // first change

        var http = require('http');
        var express = require('express');
        var bodyParser = require('body-parser');
        var swaggerize = require('swaggerize-express');
        var swaggerUi = require('swaggerize-ui'); // second change
        var path = require('path');

        var app = express();

        var server = http.createServer(app);

        app.use(bodyParser.json());

        app.use(swaggerize({
            api: path.resolve('./config/api.json'), // third change
            handlers: path.resolve('./handlers'),
            docspath: '/swagger' // fourth change
        }));

        // change four
        app.use('/docs', swaggerUi({
          docs: '/swagger'  
        }));

        server.listen(port, function () { // fifth and final change
        });

## Test with the API running locally

1. Activate the server using the Node.js command-line executable. 

        node server.js

    Executing this command will launch the Node.js HTTP server and start serving your API. 

1. When you browse to **http://localhost:8000/contacts** you will see the JSON output of the contact list (or be prompted to download it, depending on your browser). 

    ![All Contacts Api Call](media/app-service-api-nodejs-api-app/all-contacts-api-call.png)

1. When you browse to **http://localhost:8000/contacts/2** you'll see the contact represented by that id value. 

    ![Specific Contact Api Call](media/app-service-api-nodejs-api-app/specific-contact-api-call.png)

1. The Swagger JSON data is served via the **/swagger** endpoint:

    ![Contacts Swagger Json](media/app-service-api-nodejs-api-app/contacts-swagger-json.png)

1. The Swagger UI is served via the **/docs** endpoint. In the Swagger UI you can use the rich HTML client features to test out your API.

    ![Swagger Ui](media/app-service-api-nodejs-api-app/swagger-ui.png)

## Create a new API App in the Azure Portal

In this section you'll walk through the process of creating a new, empty API App in Azure. Then, you'll wire up the app to a Git repository so you can enable continuous delivery of your code changes. 

1. Browse to the [Azure Portal](https://portal.azure.com/). 

1. Click **New > Web + Mobile > API App**. 

    ![New API app in portal](media/app-service-api-nodejs-api-app/new-api-app-portal.png)

4. Enter an **App name** that is unique in the *azurewebsites.net* domain, such as NodejsAPIApp plus a number to make it unique. 

	If you enter a name that someone else has already used, you see a red exclamation mark to the right instead of a green check mark, and you need to enter a different name.

	Azure uses this name as the prefix for your application's URL. The complete URL consists of this name plus *.azurewebsites.net*. For example, if the name is `ToDoListDataAPI`, the URL is `todolistdataapi.azurewebsites.net`.

6. In the **Resource Group** drop-down, click **New**, and then in **New resource group name** enter "NodejsAPIAppGroup" or another name if you prefer. 

	A [resource group](../azure-portal/resource-group-portal.md) is a collection of Azure resources such as API apps, databases, VMs, and so forth.	For this tutorial, it's best to create a new resource group because that makes it easy to delete in one step all the Azure resources that you create for the tutorial.

4. Click **App Service plan/Location**, and then click **Create New**.

	![Create App Service plan](./media/app-service-api-nodejs-api-app/newappserviceplan.png)

	In the following steps you create an App Service plan for the new resource group. An App Service plan specifies the compute resources that your API app runs on. For example, if you choose the free tier, your API app runs on shared VMs, while for some paid tiers it runs on dedicated VMs. For information about App Service plans, see [App Service plans overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

5. In the **App Service Plan** blade, enter "NodejsAPIAppPlan" or another name if you prefer.

5. In the **Location** drop-down list, choose the location that is closest to you.

	This setting specifies which Azure datacenter your app will run in. For this tutorial, you can select any region and it won't make a noticeable difference. But for a production app, you want your server to be as close as possible to the clients that are accessing it in order to minimize [latency](http://www.bing.com/search?q=web%20latency%20introduction&qs=n&form=QBRE&pq=web%20latency%20introduction&sc=1-24&sp=-1&sk=&cvid=eefff99dfc864d25a75a83740f1e0090).

5. Click **Pricing tier > View All > F1 Free**.

	For this tutorial, the free pricing tier will provide sufficient performance.

	![Select Free pricing tier](./media/app-service-api-nodejs-api-app/selectfreetier.png)

6. In the **App Service Plan** blade, click **OK**.

7. In the **API App** blade, click **Create**.

## Set up your new API app for Git deployment

In this section of the tutorial you create credentials you'll use for deployment and a Git repository for the API app in Azure App Service. You'll deploy your code to the API app by pushing commits to this repository in Azure App Service. 

1. After your API app has been created, click **App Services > {your API app}**. 

	The portal displays the **API App** and **Settings** blades.

    ![Portal API app blade](media/app-service-api-nodejs-api-app/portalapiappblade.png)

    ![Portal Settings blade](media/app-service-api-nodejs-api-app/portalsettingsblade.png)

1. In the **Settings** blade, scroll down to the **Publishing** section, and then click **Deployment credentials**.
 
3. In the **Set deployment credentials** blade, enter a user name and password, and then click **Save**.

	You'll use these credentials for publishing your Node.js code to your API app. In the next step you create the Azure Git repository that is associated with your API app.  

    ![Deployment Credentials](media/app-service-api-nodejs-api-app/deployment-credentials.png)

1. In the **Settings** blade, click **Deployment source > Choose Source > Local Git Repository**, then click **OK**.

    ![Create Git Repo](media/app-service-api-nodejs-api-app/create-git-repo.png)

1. Once your Git repository has been created the blade will change and show you your active deployments. Since the repository is new, you have no active deployments in the list. 

    ![No Active Deployments](media/app-service-api-nodejs-api-app/no-active-deployments.png)

1. Copy the Git repository URL to your clipboard. To do this, navigate to the blade for your new API App and look at the **Essentials** section of the blade. You'll see the **Git clone URL** in the **Essentials** section. When you hover over this URL, you'll see an icon on the right that will copy the URL to your clipboard. Click this icon to copy the URL.

    ![Get The Git Url From The Portal](media/app-service-api-nodejs-api-app/get-the-git-url-from-the-portal.png)

    **Note**: You will need the Git clone URL in the next step so make sure to save it somewhere for the moment.

Now that you have a new API App with a Git repository backing it up, you can push code into the repository and utilize the continuous deployment features of Azure to automatically deploy your changes. 

## Deploy your API code to Azure

Using the built-in continuous delivery features Azure App Service provides, you can simply commit your code to the Git repository associated with your API app, and Azure will pick up your source code and deploy it to your API app. 

1. Copy the **ContactList** folder created by the swaggerize scaffolder to some other folder. as you'll be creating a new local Git repository for the code. 

2. Open the command line.

1. Navigate into the new folder, then execute the following command to create a new local Git repository. 

        git init

    This command will create a local Git repository, and you'll be shown a confirmation that your new repository was initialized. 

    ![New Local Git Repo](media/app-service-api-nodejs-api-app/new-local-git-repo.png)

1. Execute the following command, which will add a Git remote to your local repository. The remote repository will be the one you just created and associated with your API App running in Azure. 

        git remote add azure YOUR_GIT_CLONE_URL_HERE

    **Note**: Replace the string "YOUR_GIT_CLONE_URL_HERE" with your own Git clone URL that you copied earlier. 

1. Execute the two commands below from the command line, to create a commit that contains all of your code. 

        git add .
        git commit -m "initial revision"

    ![Git Commit Output](media/app-service-api-nodejs-api-app/git-commit-output.png)

1. To push your code to Azure, which will trigger a deployment to your API App, execute the following command. Use the password that you created earlier in the Azure portal. 

        git push azure master

1. If you navigate back to the **Continuous Deployment** blade for your API app, you'll see the deployment is occurring. 

    ![Deployment Happening](media/app-service-api-nodejs-api-app/deployment-happening.png)

    Simultaneously, the Node.js command line will reflect the status of your deployment while it is happening. 

    ![Node Js Deployment Happening](media/app-service-api-nodejs-api-app/node-js-deployment-happening.png)

1. Once the deployment has completed, the **Continous Deployment** blade will reflect the successful deployment of your code changes to your API App. Copy the **URL** in the **Essentials** section of your API App blade. 

    ![Deployment Completed](media/app-service-api-nodejs-api-app/deployment-completed.png)

## Test with the API running in Azure
 
1. Using a REST API client such as Postman or Fiddler (or your web browser), provide the URL of your contacts API call, which should be the `/contacts` endpoint of your API App. 

    **Note:** The URL will be something like http://myapiapp.azurewebsites.net/contacts

    When you issue a GET request to this endpoint you see the JSON output of your API App.

    ![Postman Hitting Api](media/app-service-api-nodejs-api-app/postman-hitting-api.png)

2. In a browser, go to the `/swagger` endpoint to try out the Swagger UI.

Now that you have continuous delivery wired up, changing your API App's functionality and deploying the changes is as easy as making commits in your local Git repository and pushing them to your Azure Git repository.

## Next steps

At this point you've successfully created and deployed your first API App using Node.js. The next tutorial in the API Apps getting started series shows how to [consume API apps from JavaScript clients, using CORS](app-service-api-cors-consume-javascript.md).
