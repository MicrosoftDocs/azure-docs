<properties
	pageTitle="Build and deploy a Node.js API app in Azure App Service"
	description="Learn how to create a Node.js API app package and deploy it to Azure App Service."
	services="app-service\api"
	documentationCenter="nodejs"
	authors="pkefal"
  manager="",
  editor=""/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="nodejs"
	ms.topic="article"
	ms.date="04/21/2015"
	ms.author="pakefali"/>

# Build and deploy a Node.js API app in Azure App Service

This tutorial shows how to create a [Node.js](http://nodejs.org) application and deploy it to Azure App Service API Apps using [Git](http://git-scm.com). The instructions in this tutorial can be followed on any operating system that is capable of running Node.

Here is a screenshot of the completed application:

![][sample-api-app-page]

## Create an API app in the Azure preview Portal

> [AZURE.NOTE] To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can [activate your MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/) or [sign up for a free trial](/pricing/free-trial/).
 You can also try for free [App Service App Samples](http://tryappservice.azure.com).

1. Log in to the [Azure preview portal](https://portal.azure.com).

2. Click **NEW** at the bottom left of the portal.

3. Click **Web + Mobile > API App**.

	![][portal-quick-create]

4. Enter a value for **Name**, such as NodejsAPIApp.

5. Select an App Service plan or create a new one. If you create a new plan, select the pricing tier, location, and other options.

	![][portal-create-api]

6. Click **Create**.

	![][api-app-blade]

	If you left **Add to Startboard** check box selected, the portal automatically opens the blade for your API app after it's created. If you cleared the checkbox, click **Notifications** on the portal home page to see the API app creation status, and click the notification to go to the blade for the new API app.

7. Click **Settings > Application Settings**.

9. Set the Access level to **Public (anonymous)**.

11. Click **Save**.

	![][set-api-app-access-level]

## Enable Git publishing for the new API app

[Git](http://git-scm.com/%20target="_blank) is a distributed version control system that you can use to deploy your Azure Website. You'll store the code you write for your API app in a local Git repository, and you'll deploy your code to Azure by pushing to a remote repository. This method of deployment is a feature of App Service web apps that you can use in an API app because API apps are based on web apps: an API app in Azure App Service is a web app with additional features for hosting web services.  

In the portal you manage the features specific to API apps in the **API App** blade, and you manage the features that are shared with web apps in the **API App Host** blade. So in this section you go to the **API App Host** blade to configure the Git deployment feature.

1. In the API App blade, click **API App host**.

	![][api-app-host]

2. Find the **Deployment** section of the **API App** blade and click **Set up continuous deployment**. You may need to scroll down to see this part of the blade.

	![][deployment-part]

3. Click **Choose Source > Local Git Repository**.

5. Click **OK**.

	![][setup-git-publishing]

6. If you have have not previously set up deployment credentials for publishing an API app or other App Service app, set them up now:

	* Click **Set deployment credentials**.

	* Create a user name and password.

	* Click **Save**.

	![][deployment-credentials]

1. In the **API App Host** blade, click **Settings > Properties**. The URL of the remote Git repository that you'll deploy to is shown under "GIT URL".

2. Copy the URL for use later in the tutorial.

	![][git-url]

## Download and inspect code for a Node.js API app

In this section, you'll download and take a look at the code provided as part of the NodeAPIApp sample.

1. Download the code in [this GitHub repository](http://go.microsoft.com/fwlink/?LinkID=534023&clcid=0x409). You can either clone the repository or click **Download Zip** to download it as a .zip file. If you download the .zip file, unzip it in your local disk.

2. Navigate to the folder were you unzipped the sample.

	![][api-app-folder-browse]

3. Open the **apiapp.json** file in a text editor and inspect the contents.

	![][apiapp-json]

	Azure App Service has two prerequisites in order to recognize a Node.js application as an API App:

	+ A file named *apiapp.json* has to be present in the root directory of the application.
	+ A Swagger 2.0 metadata endpoint has to be exposed by the application. The URL of this endpoint is specified in the *apiapp.json* file.

	Notice the **apiDefinition** property. The path for this URL is relative to your API's URL and it points to the Swagger 2.0 endpoint. Azure App Service uses this property to discover the definition of your API and enable many of the App Service API app capabilities.

	> [AZURE.NOTE] The endpoint has to be of Swagger 2.0 specification, as older versions (e.g. 1.2) are not supported by the platform. The sample application is using swaggerize-express to create a Swagger 2.0 specification endpoint.

4. Open the **server.js** file and inspect the code.

	![][server-js]

	The code uses the swaggerize-express module to create the Swagger 2.0 endpoint.

		app.use(swaggerize({
		    api: require('./api.json'),
		    docspath: '/swagger',
		    handlers: './handlers/'
		}));

	The `api` property points to the api.json file which contains the Swagger 2.0 spec definition of our API. You can manually create the file in a text editor or use the online [editor of Swagger](http://editor.swagger.io) and download the JSON file from there. (The *api.json* file specifies a `host` property but the value of this property is determined and replaced dynamically at runtime.)

	The `docspath` property points to the Swagger 2.0 endpoint. This URL is relative to the base path of your API. The base path is declared in the api.json file. In our example the base path is */api/data*, so the relative path to the swagger endpoint is */api/data/swagger*.

	> [AZURE.NOTE] As the base path is declared in the *api.json* file, trying to access the */swagger* endpoint as a relative path to your API app's URL will return 404. This is a common mistake when trying to access the swagger endpoint.

	The `handlers` property points to the local folder that contains the route handlers for the Express.js module.

## Run the API app code locally

In this section you run the application locally to verify it works prior to deployment.

1. Navigate to the folder were you downloaded the sample.

2. Open a command line prompt and enter the following command:

		npm install

3. When the *install* command finishes, enter the following command:

		node server.js

	The command line window output shows "Server started .."

5. Navigate your browser to http://localhost:1337/

	You see the following page

	![][sample-api-app-page]

6. To view the Swagger.json file, navigate to http://localhost:1337/api/data/swagger.

## Publish your API app code to Azure App Service

In this section you create a local Git repository and push from that repository to Azure in order to deploy your sample application to the API app running in Azure App Service.

1. If Git is not installed, install it from [the Git download page](http://git-scm.com/download%20target="_blank").

1. From the command-line, change directories to the sample application directory and enter the following commands to initialize a local Git repository.

		git init


2. Enter the following commands to add files to the repository:

		git add .
		git commit -m "Initial commit of the API App"

3. Create a remote reference for pushing updates to the web app (API app host) you created previously, using the Git URL that you copied earlier:

		git remote add azure [URL for remote repository]

4. Push your changes to Azure by entering the following command:

		git push azure master

	You are prompted for the password you created earlier.

	The output from this command ends with a message that deployment is successful:

		remote: Deployment successful.
		To https://user@testsite.scm.azurewebsites.net/testsite.git
	 	* [new branch]      master -> master

## View the API definition in the Azure preview portal

Now that you have deployed an API to your API app, you can see the API definition in the Azure preview portal. You'll begin by restarting the *gateway*, which enables Azure to recognize that an API app's API definition has changed. The gateway is a web app that handles API administration and authorization for the API apps in a resource group.

6. In the Azure preview portal, go to the **API App** blade for the API app that you created earlier, and click the **Gateway** link.

	![](./media/app-service-api-nodejs-api-app/clickgateway.png)

7. In the **Gateway** blade, click **Restart**. You can now close this blade.

	![](./media/app-service-api-nodejs-api-app/gatewayrestart.png)

8. In the **API App** blade, click **API Definition**.

	![](./media/app-service-api-nodejs-api-app/apidef.png)

	The **API Definition** blade shows two Get methods.

	![](./media/app-service-api-nodejs-api-app/apidefblade.png)

## Run the sample application in Azure

In the Azure preview portal, go to the **API App Host** blade for your API app, and click **Browse** .

![][browse-api-app-page]

The browser displays the home page that you saw earlier when you ran the sample app locally.  

[AZURE.INCLUDE [app-service-api-direct-deploy-metadata](../includes/app-service-api-direct-deploy-metadata.md)]

## Next steps

You've deployed a Node.js web application that uses an API app backend to Azure. For more information about using Node.js in Azure, see the [Node.js Developer Center](/develop/nodejs/).

* You can try this sample API App at [TryApp Service](http://tryappservice.azure.com)

[portal-quick-create]: ./media/app-service-api-nodejs-api-app/portal-quick-create.png
[portal-create-api]: ./media/app-service-api-nodejs-api-app/portal-create-api.png
[api-app-blade]: ./media/app-service-api-nodejs-api-app/api-app-blade.png
[api-app-folder-browse]: ./media/app-service-api-nodejs-api-app/api-app-folder-browse.png
[api-app-host]: ./media/app-service-api-nodejs-api-app/api-app-host.png
[deployment-part]: ./media/app-service-api-nodejs-api-app/continuous-deployment.png
[set-api-app-access-level]: ./media/app-service-api-nodejs-api-app/set-api-app-access.png
[setup-git-publishing]: ./media/app-service-api-nodejs-api-app/local-git-repo.png
[deployment-credentials]: ./media/app-service-api-nodejs-api-app/deployment-credentials.png
[git-url]: ./media/app-service-api-nodejs-api-app/git-url.png
[apiapp-json]: ./media/app-service-api-nodejs-api-app/apiapp-json.png
[server-js]: ./media/app-service-api-nodejs-api-app/server-js.png
[sample-api-app-page]: ./media/app-service-api-nodejs-api-app/sample-api-app-page.png
[browse-api-app-page]: ./media/app-service-api-nodejs-api-app/browse-api-app-page.png
