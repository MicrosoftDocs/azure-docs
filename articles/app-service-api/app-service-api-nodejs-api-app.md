<properties
	pageTitle="Node.js API app in Azure App Service | Microsoft Azure"
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
	ms.date="05/26/2016"
	ms.author="rachelap"/>

# Build a Node.js RESTful API and deploy it to an API app in Azure

[AZURE.INCLUDE [app-service-api-get-started-selector](../../includes/app-service-api-get-started-selector.md)]

This tutorial shows how to create a simple [Node.js](http://nodejs.org) API and deploy it to an [API app](app-service-api-apps-why-best-platform.md) in 
[Azure App Service](../app-service/app-service-value-prop-what-is.md) by using [Git](http://git-scm.com). You can use any operating system that can run Node.js, and you'll do all your work using command line tools such as cmd.exe or bash.

## Prerequisites

1. Microsoft Azure account ([open a free account here](https://azure.microsoft.com/pricing/free-trial/))
1. [Node.js](http://nodejs.org) installed (this sample assumes that you have Node.js version 4.2.2)
2. [Git](https://git-scm.com/) installed
1. [GitHub](https://github.com/) account

While App Service supports many ways to deploy your code to an API app, this tutorial shows the Git method and assumes that you have basic knowledge of how to work with Git. For information about other deployment methods, see [Deploy your app to Azure App Service](../app-service-web/web-sites-deploy.md).

## Get the sample code

1. Open a command line interface that can run Node.js and Git commands.

1. Navigate to a folder that you can use for a local Git repository, and clone the [GitHub repository containing the sample code](https://github.com/Azure-Samples/app-service-api-node-contact-list).

		git clone https://github.com/Azure-Samples/app-service-api-node-contact-list.git

	The sample API provides two endpoints: a Get request to `/contacts` returns a list of names and email addresses in JSON format, while `/contacts/{id}` returns only the selected contact.

## Scaffold (auto-generate) Node.js code based on Swagger metadata

[Swagger](http://swagger.io/) is a file format for metadata that describes a RESTful API. Azure App Service has [built-in support for Swagger metadata](app-service-api-metadata.md). This section of the tutorial models an API development workflow in which you create Swagger metadata first and use that to scaffold (auto-generate) server code for the API. 

>[AZURE.NOTE] You can skip this section if you don't want to learn how to scaffold Node.js code from a Swagger metadata file. If you want to just deploy sample code to a new API app, go directly to the [Create an API app in Azure](#createapiapp) section.

### Install and execute Swaggerize

1. Execute the following commands to install the **yo** and **generator-swaggerize** NPM modules globally.

		npm install -g yo
		npm install -g generator-swaggerize

	Swaggerize is a tool that generates server code for an API described by a Swagger metadata file. The Swagger file that you'll use is named *api.json* and is located in the *start* folder of the repository you cloned.

2. Navigate to the *start* folder, and then execute the `yo swaggerize` command. Swaggerize will ask a series of questions.  For **what to call this project**, enter "contactlist", for **path to swagger document**, enter "api.json", and for **Express, Hapi, or Restify**, enter "express".

		yo swaggerize

	![Swaggerize Command Line](media/app-service-api-nodejs-api-app/swaggerize-command-line.png)
    
	**Note**: if you encounter an error in this step, the next step explains how to fix it.

	Swaggerize creates an application folder, scaffolds handlers and configuration files, and generates a **package.json** file. The express view engine is used to generate the Swagger help page.  

3. If the `swaggerize` command fails with an "unexpected token" or "invalid escape sequence" error, correct the cause of the error by editing the generated *package.json* file. In the `regenerate` line under `scripts`, change the back slash that precedes *api.json* to a forward slash, so that the line looks like the following example:

 		"regenerate": "yo swaggerize --only=handlers,models,tests --framework express --apiPath config/api.json"

1. Navigate to the folder that contains the scaffolded code (in this case, the *ContactList* subfolder).

1. Run `npm install`.
	
		npm install
		
2. Install the **jsonpath** NPM module. 

		npm install --save jsonpath
        
    ![Jsonpath Install](media/app-service-api-nodejs-api-app/jsonpath-install.png)

1. Install the **swaggerize-ui** NPM module. 

		npm install --save swaggerize-ui
        
    ![Swaggerize Ui Install](media/app-service-api-nodejs-api-app/swaggerize-ui-install.png)

### Customize the scaffolded code

1. Copy the **lib** folder from the **start** folder into the **ContactList** folder created by the scaffolder. 

1. Replace the code in the **handlers/contacts.js** file with the following code. 

	This code uses the JSON data stored in the **lib/contacts.json** file that is served by **lib/contactRepository.js**. The new contacts.js code responds to HTTP requests to get all of the contacts and return them as a JSON payload. 

        'use strict';
        
        var repository = require('../lib/contactRepository');
        
        module.exports = {
            get: function contacts_get(req, res) {
                res.json(repository.all())
            }
        };

1. Replace the code in the **handlers/contacts/{id}.js** file with the fofllowing code. 

        'use strict';

        var repository = require('../../lib/contactRepository');
        
        module.exports = {
            get: function contacts_get(req, res) {
                res.json(repository.get(req.params['id']));
            }    
        };

1. Replace the code in **server.js** with the following code. 

	The changes made to the server.js file are called out by using comments so you can see the changes being made. 

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

### Test with the API running locally

1. Activate the server using the Node.js command-line executable. 

        node server.js

1. When you browse to **http://localhost:8000/contacts**, you see the JSON output of the contact list (or you're prompted to download it, depending on your browser). 

    ![All Contacts Api Call](media/app-service-api-nodejs-api-app/all-contacts-api-call.png)

1. When you browse to **http://localhost:8000/contacts/2**, you'll see the contact represented by that id value.

    ![Specific Contact Api Call](media/app-service-api-nodejs-api-app/specific-contact-api-call.png)

1. The Swagger JSON data is served via the **/swagger** endpoint:

    ![Contacts Swagger Json](media/app-service-api-nodejs-api-app/contacts-swagger-json.png)

1. The Swagger UI is served via the **/docs** endpoint. In the Swagger UI, you can use the rich HTML client features to test out your API.

    ![Swagger Ui](media/app-service-api-nodejs-api-app/swagger-ui.png)

## <a id="createapiapp"></a> Create a new API App

In this section you use the Azure portal to create a new API App in Azure. This API app represents the compute resources that Azure will provide to run your code. In later sections you'll deploy your code to the new API app.

1. Browse to the [Azure Portal](https://portal.azure.com/). 

1. Click **New > Web + Mobile > API App**. 

    ![New API app in portal](media/app-service-api-nodejs-api-app/new-api-app-portal.png)

4. Enter an **App name** that is unique in the *azurewebsites.net* domain, such as NodejsAPIApp plus a number to make it unique. 

	For example, if the name is `NodejsAPIApp`, the URL will be `nodejsapiapp.azurewebsites.net`.

	If you enter a name that someone else has already used, you see a red exclamation mark to the right.

6. In the **Resource Group** drop-down, click **New**, and then in **New resource group name** enter "NodejsAPIAppGroup" or another name if you prefer. 

	A [resource group](../resource-group-overview.md) is a collection of Azure resources such as API apps, databases, and VMs. For this tutorial, it's best to create a new resource group because that makes it easy to delete in one step all the Azure resources that you create for the tutorial.

4. Click **App Service plan/Location**, and then click **Create New**.

	![Create App Service plan](./media/app-service-api-nodejs-api-app/newappserviceplan.png)

	In the following steps, you create an App Service plan for the new resource group. An App Service plan specifies the compute resources that your API app runs on. For example, if you choose the free tier, your API app runs on shared VMs, while for some paid tiers it runs on dedicated VMs. For information about App Service plans, see [App Service plans overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

5. In the **App Service Plan** blade, enter "NodejsAPIAppPlan" or another name if you prefer.

5. In the **Location** drop-down list, choose the location that is closest to you.

	This setting specifies which Azure datacenter your app will run in. For this tutorial, you can select any region and it won't make a noticeable difference. But for a production app, you want your server to be as close as possible to the clients that are accessing it to minimize [latency](http://www.bing.com/search?q=web%20latency%20introduction&qs=n&form=QBRE&pq=web%20latency%20introduction&sc=1-24&sp=-1&sk=&cvid=eefff99dfc864d25a75a83740f1e0090).

5. Click **Pricing tier > View All > F1 Free**.

	For this tutorial, the free pricing tier will provide sufficient performance.

	![Select Free pricing tier](./media/app-service-api-nodejs-api-app/selectfreetier.png)

6. In the **App Service Plan** blade, click **OK**.

7. In the **API App** blade, click **Create**.

## Set up your new API app for Git deployment

You'll deploy your code to the API app by pushing commits to a Git repository in Azure App Service. In this section of the tutorial, you create the credentials and Git repository in Azure that you'll use for deployment.  

1. After your API app has been created, click **App Services > {your API app}** from the portal home page. 

	The portal displays the **API App** and **Settings** blades.

    ![Portal API app and Settings blade](media/app-service-api-nodejs-api-app/portalapiappblade.png)

1. In the **Settings** blade, scroll down to the **Publishing** section, and then click **Deployment credentials**.
 
3. In the **Set deployment credentials** blade, enter a user name and password, and then click **Save**.

	You'll use these credentials for publishing your Node.js code to your API app. 

    ![Deployment Credentials](media/app-service-api-nodejs-api-app/deployment-credentials.png)

1. In the **Settings** blade, click **Deployment source > Choose Source > Local Git Repository**, then click **OK**.

    ![Create Git Repo](media/app-service-api-nodejs-api-app/create-git-repo.png)

1. Once your Git repository has been created the blade changes to show you your active deployments. Since the repository is new, you have no active deployments in the list. 

    ![No Active Deployments](media/app-service-api-nodejs-api-app/no-active-deployments.png)

1. Copy the Git repository URL. To do this, navigate to the blade for your new API App and look at the **Essentials** section of the blade. Notice the **Git clone URL** in the **Essentials** section. When you hover over this URL, you see an icon on the right that will copy the URL to your clipboard. Click this icon to copy the URL.

    ![Get The Git Url From The Portal](media/app-service-api-nodejs-api-app/get-the-git-url-from-the-portal.png)

    **Note**: You will need the Git clone URL in the next section so make sure to save it somewhere for the moment.

Now that you have an API App with a Git repository backing it up, you can push code into the repository to deploy the code to the API app. 

## Deploy your API code to Azure

In this section you create a local Git repository that contains your server code for the API, and then you push your code from that repository to the repository in Azure that you created earlier.

1. Copy the `ContactList` folder to a location that you can use for a new local Git repository. If you did the first part of the tutorial, copy `ContactList` from the `start` folder; otherwise, copy `ContactList` from the `end` folder.

1. In your command line tool, navigate to the new folder, then execute the following command to create a new local Git repository. 

        git init

     ![New Local Git Repo](media/app-service-api-nodejs-api-app/new-local-git-repo.png)

1. Execute the following command to add a Git remote for your API app's repository. 

        git remote add azure YOUR_GIT_CLONE_URL_HERE

    **Note**: Replace the string "YOUR_GIT_CLONE_URL_HERE" with your own Git clone URL that you copied earlier. 

1. Execute the following commands to create a commit that contains all of your code. 

        git add .
        git commit -m "initial revision"

    ![Git Commit Output](media/app-service-api-nodejs-api-app/git-commit-output.png)

1. Execute the command to push your code to Azure. When you're prompted for a password, enter the one that you created earlier in the Azure portal.

        git push azure master

	This triggers a deployment to your API app.  

1. In your browser, navigate back to the **Deployments** blade for your API app, and you see that the deployment is occurring. 

    ![Deployment Happening](media/app-service-api-nodejs-api-app/deployment-happening.png)

    Simultaneously, the command line interface reflects the status of your deployment while it is happening. 

    ![Node Js Deployment Happening](media/app-service-api-nodejs-api-app/node-js-deployment-happening.png)

	Once the deployment has completed, the **Deployments** blade reflects the successful deployment of your code changes to your API App. 

## Test with the API running in Azure
 
3. Copy the **URL** in the **Essentials** section of your API App blade. 

    ![Deployment Completed](media/app-service-api-nodejs-api-app/deployment-completed.png)

1. Using a REST API client such as Postman or Fiddler (or your web browser), provide the URL of your contacts API call, which is the `/contacts` endpoint of your API app. The URL will be `https://{your API app name}.azurewebsites.net/contacts`

    When you issue a GET request to this endpoint, you get the JSON output of your API app.

    ![Postman Hitting Api](media/app-service-api-nodejs-api-app/postman-hitting-api.png)

2. In a browser, go to the `/docs` endpoint to try out the Swagger UI as it runs in Azure.

Now that you have continuous delivery wired up, you can make code changes and deploy them to Azure simply by pushing commits to your Azure Git repository.

## Next steps

At this point you've successfully created an API App and deployed Node.js API code to it. The next tutorial shows how to [consume API apps from JavaScript clients, using CORS](app-service-api-cors-consume-javascript.md).
