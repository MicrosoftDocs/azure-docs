<properties
	pageTitle="Get started with API Apps and ASP.NET in App Service | Microsoft Azure"
	description="Learn how to create, deploy, and consume an ASP.NET API app in Azure App Service, by using Visual Studio 2015."
	services="app-service\api"
	documentationCenter=".net"
	authors="tdykstra"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-api"
	ms.workload="na"
	ms.tgt_pltfrm="dotnet"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="03/09/2016"
	ms.author="tdykstra"/>

# Get started with API Apps and ASP.NET in Azure App Service

[AZURE.INCLUDE [selector](../../includes/app-service-api-get-started-selector.md)]

## Overview

This is the first in a series of tutorials that show how to use features of Azure App Service that are helpful for developing and hosting RESTful APIs:

* Integrated support for API metadata
* [Cross-Origin Resource Sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) support
* Authentication and authorization support

You'll deploy a sample application to two [API apps](app-service-api-apps-why-best-platform.md) and a web app in Azure App Service. The sample application is a to-do list that has a single-page application (SPA) front end, an ASP.NET Web API middle tier, and an ASP.NET Web API data tier. The SPA front-end is based on the [AngularJS](https://angularjs.org/) framework.

![API Apps sample application diagram](./media/app-service-api-dotnet-get-started/noauthdiagram.png)

Here's a screen shot of the SPA front end.

![API Apps sample application to do list](./media/app-service-api-dotnet-get-started/todospa.png)

On completing this tutorial, you'll have the two Web APIs up and running in App Service API apps. After completing the following tutorial you'll have the entire application running in the cloud, with the SPA in an App Service web app. In subsequent tutorials, you add authentication and authorization.

## What you'll learn

In this tutorial, you'll learn:

* How to work with API apps and web apps in Azure App Service by using tools built into Visual Studio 2015.
* How to automate API discovery by using the Swashbuckle NuGet package to dynamically generate Swagger API definition JSON.
* How to use automatically generated client code to consume an API app from a .NET client.
* How to use the Azure portal to configure the endpoint for API app metadata.

## Prerequisites

[AZURE.INCLUDE [prerequisites](../../includes/app-service-api-dotnet-get-started-prereqs.md)]

## Download the sample application 

1. Download the [Azure-Samples/app-service-api-dotnet-to-do-list](https://github.com/Azure-Samples/app-service-api-dotnet-todo-list) repository.

	You can click the **Download ZIP** button or clone the repository on your local machine. 

2. Open the ToDoList solution in Visual Studio 2015 or 2013.

	The Visual Studio solution is a sample application that works with simple to-do items that consist of a description and an owner. The solution includes three projects:

	![](./media/app-service-api-dotnet-get-started/projectsinse.png)

	* **ToDoListAngular** - The front end: an AngularJS SPA that calls the middle tier. 

	* **ToDoListAPI** - The middle tier: an ASP.NET Web API project that calls the data tier to perform CRUD operations on to-do items.

	* **ToDoListDataAPI** - The data tier:  an ASP.NET Web API project that performs CRUD operations on to-do items. 

	The three-tier architecture is typical of many applications but is not appropriate for every scenario. Here it is used mainly to facilitate a demonstration of API Apps features, and the code in each tier is simplified with that purpose in mind. Unlike a real application, the middle tier has no significant business logic. And the data tier uses server memory rather than a database as its persistence mechanism, which means that whenever the application is restarted all changes are lost.

2. Build the solution to restore the NuGet packages.

## Optional: run the application locally

In this section, you verify that you can run the client locally and can call the API while it too is running locally.

**Note:** These instructions work for Internet Explorer and Edge browsers because these browsers allow cross-origin JavaScript calls from and to `http://localhost` URLs. If you're using Chrome, start the browser with the `--disable-web-security` switch. If you're using Firefox, skip this section.

1. Set all three projects as startup projects, with ToDoListDataAPI starting first, then ToDoListAPI, and then ToDoListAngular.

	a. In **Solution Explorer**, right-click the solution, and then click **Properties**.

	b. Select **Multiple startup projects**, and then put the projects in the correct order.

	c. Set **Action** to **Start** for each project.  

2. Press F5 or click **Debug > Start Debugging** to start the projects in debug mode.

	Three browser windows open. Two browser windows show HTTP 403 error pages (directory browsing not allowed), which is normal for Web API projects.  The third browser window shows the AngularJS UI. 

	In some browsers you'll see dialog boxes indicating that the project is configured to use SSL. If you want to 

3. In the browser window that shows the AngularJS UI, click the **To Do List** tab.

	The UI shows two default to-do items.

	![API Apps sample application to do list](./media/app-service-api-dotnet-get-started/todospa.png)

4. Add, edit, and delete to-do items to see how the application works. 

	Any changes you make are stored in memory and are lost when you restart the application.

3. Close the browser windows and stop Visual Studio debugging.

## Use Swagger metadata and UI

Support for [Swagger](http://swagger.io/) 2.0 API metadata is built into Azure App Service. Each API app specifies a URL endpoint that returns metadata for the API in Swagger JSON format. The metadata returned from that endpoint can be used to generate client code. 

An ASP.NET Web API project can dynamically generate Swagger metadata by using the [Swashbuckle](https://www.nuget.org/packages/Swashbuckle) NuGet package. The Swashbuckle NuGet package is already installed in the ToDoListDataAPI and ToDoListAPI projects that you downloaded.

In this section of the tutorial, you look at the generated Swagger 2.0 metadata, and then you try out a test UI that is based on the Swagger metadata.

2. Set the ToDoListDataAPI project (**not** the ToDoListAPI project) as the startup project. 
 
4. Press F5 or click **Debug > Start Debugging** to run the project in debug mode.

	The browser opens and shows the HTTP 403 error page.

12. In your browser address bar, add `swagger/docs/v1` to the end of the line, and then press Return. (The URL is `http://localhost:45914/swagger/docs/v1`.)

	This is the default URL used by Swashbuckle to return Swagger 2.0 JSON metadata for the API.

	If you're using Internet Explorer, the browser prompts you to download a *v1.json* file.

	![Download JSON metadata in IE](./media/app-service-api-dotnet-get-started/iev1json.png)

	If you're using Chrome, Firefox, or Edge, the browser displays the JSON in the browser window.

	![JSON metadata in Chrome](./media/app-service-api-dotnet-get-started/chromev1json.png)

	The following sample shows the first section of the Swagger metadata for the API, with the definition for the Get method. This metadata is what drives the Swagger UI that you use in the following steps, and you use it in a later section of the tutorial to automatically generate client code.

		{
		  "swagger": "2.0",
		  "info": {
		    "version": "v1",
		    "title": "ToDoListDataAPI"
		  },
		  "host": "localhost:45914",
		  "schemes": [ "http" ],
		  "paths": {
		    "/api/ToDoList": {
		      "get": {
		        "tags": [ "ToDoList" ],
		        "operationId": "ToDoList_GetByOwner",
		        "consumes": [ ],
		        "produces": [ "application/json", "text/json", "application/xml", "text/xml" ],
		        "parameters": [
		          {
		            "name": "owner",
		            "in": "query",
		            "required": true,
		            "type": "string"
		          }
		        ],
		        "responses": {
		          "200": {
		            "description": "OK",
		            "schema": {
		              "type": "array",
		              "items": { "$ref": "#/definitions/ToDoItem" }
		            }
		          }
		        },
		        "deprecated": false
		      },

1. Close the browser and stop Visual Studio debugging.

3. In the ToDoListDataAPI project in **Solution Explorer**, open the *App_Start\SwaggerConfig.cs* file, then scroll down to the following code and uncomment it.

		/*
		    })
		.EnableSwaggerUi(c =>
		    {
		*/

	The *SwaggerConfig.cs* file is created when you install the Swashbuckle package in a project. The file provides a number of ways to configure Swashbuckle.

	The code you've uncommented enables the Swagger UI that you use in the following steps. When you create a Web API project by using the API app project template, this code is commented out by default as a security measure.

5. Run the project again.

3. In your browser address bar, add `swagger` to the end of the line, and then press Return. (The URL is `http://localhost:45914/swagger`.)

4. When the Swagger UI page appears, click **ToDoList** to see the methods available.

	![Swagger UI available methods](./media/app-service-api-dotnet-get-started/methods.png)

5. Click the first **Get** button in the list.

6. Enter an asterisk as the value of the `owner` parameter, and then click **Try it out**.

	When you add authentication in later tutorials, the middle tier will provide the actual user ID to the data tier. For now, all tasks will have asterisk as their owner ID while the application runs without authentication enabled. 

	![Swagger UI try it out](./media/app-service-api-dotnet-get-started/gettryitout1.png)

	The Swagger UI calls the ToDoList Get method and displays the response code and JSON results.

	![Swagger UI try it out results](./media/app-service-api-dotnet-get-started/gettryitout.png)

6. Click **Post**, and then click the box under **Model Schema**.

	Clicking the model schema prefills the input box where you can specify the parameter value for the Post method. (If this doesn't work in Internet Explorer, use a different browser or enter the parameter value manually in the next step.)  

	![Swagger UI try it out Post](./media/app-service-api-dotnet-get-started/post.png)

7. Change the JSON in the `todo` parameter input box so that it looks like the following example, or substitute your own description text:

		{
		  "ID": 2,
		  "Description": "buy the dog a toy",
		  "Owner": "*"
		}

10. Click **Try it out**.

	The ToDoList API returns an HTTP 204 response code that indicates success.

11. Click the first **Get** button, and then in that section of the page click the **Try it out** button.

	The Get method response now includes the new to do item. 

12. Optional: Try also the Put, Delete, and Get by ID methods.

14. Close the browser and stop Visual Studio debugging.

Swashbuckle works with any ASP.NET Web API project. If you want to add Swagger metadata generation to an existing project, just install the Swashbuckle package. 

**Note:** Swagger metadata includes a unique ID for each API operation. By default, Swashbuckle may generate duplicate Swagger operation IDs for your Web API controller methods. This happens if your controller has overloaded HTTP methods, such as `Get()` and `Get(id)`. For information about how to handle overloads, see [Customize Swashbuckle-generated API definitions](app-service-api-dotnet-swashbuckle-customize.md). If you create a Web API project in Visual Studio by using the Azure API App template, code that generates unique operation IDs is automatically added to the *SwaggerConfig.cs* file.  

## Create an API app in Azure and deploy the ToDoListAPI project to it

In this section, you use Azure tools that are integrated into the Visual Studio **Publish Web** wizard to create a new API app in Azure. Then you deploy the ToDoListDataAPI project to the new API app and call the API by running the Swagger UI again, this time while it runs in the cloud.

1. In **Solution Explorer**, right-click the ToDoListDataAPI project, and then click **Publish**.

	![Click Publish in Visual Studio](./media/app-service-api-dotnet-get-started/pubinmenu.png)

3.  In the **Profile** step of the **Publish Web** wizard, click **Microsoft Azure App Service**.

	![Click Azure App Service in Publish Web](./media/app-service-api-dotnet-get-started/selectappservice.png)

4. Sign in to your Azure account if you have not already done so, or refresh your credentials if they're expired.

4. In the App Service dialog box, choose the Azure **Subscription** you want to use, and then click **New**.

	![Click New in App Service dialog](./media/app-service-api-dotnet-get-started/clicknew.png)

	The **Hosting** tab of the **Create App Service** dialog box appears.

	Because you're deploying a Web API project that has Swashbuckle installed, Visual Studio assumes that you want to create an API App. This is indicated by the **API App Name** title and by the fact that the **Change Type** drop-down list is set to **API App**.

	![App type in App Service dialog](./media/app-service-api-dotnet-get-started/apptype.png)

	The app type doesn't determine the features that are available to the new API app, web app, or mobile app. All of the API app features shown in these tutorials are available to all three types. The only difference is in the icon and text that the Azure portal displays to identify the app type, and the order in which features are listed on some pages in the portal. You'll see the Azure portal later in the tutorial; it's a web interface for managing Azure resources. 

	For these tutorials the SPA front end is running in a web app, and each Web API back end is running in an API app, but everything would work the same if all three were web apps or all three were API apps. Also, a single API app or web app could host both the SPA front end and the middle tier back end.

4. Enter an **API App Name** that is unique in the *azurewebsites.net* domain, such as ToDoListDataAPI plus a number to make it unique. 

	Visual Studio proposes a unique name by appending a date-time string to the project name. You can accept that name if you prefer. 

	If you enter a name that someone else has already used, you see a red exclamation mark to the right instead of a green check mark, and you need to enter a different name.

	Azure uses this name as the prefix for your application's URL. The complete URL consists of this name plus *.azurewebsites.net*. For example, if the name is `ToDoListDataAPI`, the URL is `todolistdataapi.azurewebsites.net`.

6. In the **Resource Group** drop-down, click **New**, and then enter "ToDoListGroup" or another name if you prefer. 

	A resource group is a collection of Azure resources such as API apps, databases, VMs, and so forth.	For this tutorial, it's best to create a new resource group because that makes it easy to delete in one step all the Azure resources that you create for the tutorial.

	This box lets you select an existing [resource group](../azure-portal/resource-group-portal.md) or create a new one by typing in a name that is different from any existing resource group in your subscription.

4. Click the **New** button next to the **App Service Plan** drop-down.

	The screen shot shows sample values for **API App Name**, **Subscription**, and **Resource Group** -- your values will be different.

	![Create App Service dialog](./media/app-service-api-dotnet-get-started/createas.png)

	In the following steps you create an App Service plan for the new resource group. An App Service plan specifies the compute resources that your API app runs on. For example, if you choose the free tier, your API app runs on shared VMs, while for some paid tiers it runs on dedicated VMs. For information about App Service plans, see [App Service plans overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

5. In the **Configure App Service Plan** dialog, enter "ToDoListPlan" or another name if you prefer.

5. In the **Location** drop-down list, choose the location that is closest to you.

	This setting specifies which Azure datacenter your app will run in. For this tutorial, you can select any region and it won't make a noticeable difference. But for a production app, you want your server to be as close as possible to the clients that are accessing it in order to minimize [latency](http://www.bing.com/search?q=web%20latency%20introduction&qs=n&form=QBRE&pq=web%20latency%20introduction&sc=1-24&sp=-1&sk=&cvid=eefff99dfc864d25a75a83740f1e0090).

5. In the **Size** drop-down, click **Free**.

	For this tutorial, The free pricing tier will provide sufficient performance.

6. In the **Configure App Service Plan** dialog, click **OK**.

	![Click OK in Configure App Service Plan](./media/app-service-api-dotnet-get-started/configasp.png)

7. In the **Create App Service** dialog box, click **Create**.

	![Click Create in Create App Service dialog](./media/app-service-api-dotnet-get-started/clickcreate.png)

	Visual Studio creates the API app and a publish profile that has all of the required settings for the API app. Then it opens the **Publish Web** wizard, which you'll use to deploy the project.

	**Note:** There are other ways to create API apps in Azure App Service. For example, in Visual Studio when you create a new project, you can create Azure resources for it the same way you just saw for an existing project. You can also create API apps by using the [Azure portal](https://portal.azure.com/), [Azure cmdlets for Windows PowerShell](../powershell-install-configure.md), or the [cross-platform command-line interface](../xplat-cli.md).

	The **Publish Web** wizard opens on the **Connection** tab (shown below). 

	On the **Connection** tab, the **Server** and **Site name** settings point to your API app. The **User name** and **Password** are deployment credentials that Azure creates for you. After deployment, Visual Studio opens a browser to the **Destination URL** (that's the only purpose for **Destination URL**).  

8. Click **Next**. 

	![Click Next in Connection tab of Publish Web](./media/app-service-api-dotnet-get-started/connnext.png)

	The next tab is the **Settings** tab (shown below). Here you can change the build configuration tab to deploy a debug build for [remote debugging](../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md#remotedebug). The tab also offers several **File Publish Options**:

	* Remove additional files at destination
	* Precompile during publishing
	* Exclude files from the App_Data folder

	For this tutorial you don't need any of these. For detailed explanations of what they do, see [How to: Deploy a Web Project Using One-Click Publish in Visual Studio](https://msdn.microsoft.com/library/dd465337.aspx).

14. Click **Next**.

	![Click Next in Settings tab of Publish Web](./media/app-service-api-dotnet-get-started/settingsnext.png)

	Next is the **Preview** tab (shown below), which gives you an opportunity to see what files are going to be copied from your project to the API app. When you're deploying a project to an API app that you already deployed to earlier, only changed files are copied. If you want to see a list of what will be copied, you can click the **Start Preview** button.

15. Click **Publish**.

	![Click Publish in Preview tab of Publish Web](./media/app-service-api-dotnet-get-started/clickpublish.png)

	Visual Studio deploys the ToDoListDataAPI project to the new API app. The **Output** window logs successful deployment, and a "successfully created" page appears in a browser window opened to the URL of the API app.

	![Output window successful deployment](./media/app-service-api-dotnet-get-started/deploymentoutput.png)

	![New API app successfully created page](./media/app-service-api-dotnet-get-started/appcreated.png)

11. Add "swagger" to the URL in the browser's address bar, and then press Enter. (The URL is `http://{apiappname}.azurewebsites.net/swagger`.)

	The browser displays the same Swagger UI that you saw earlier, but now it's running in the cloud. Try out the Get method, and you see that you're back to the default 2 to-do items. The changes you made earlier were saved in memory in the local machine.

12. Open the [Azure portal](https://portal.azure.com/).

	The Azure portal is a web interface for managing Azure resources such as API apps.
 
14. Click **Browse > App Services**.

	![Browse App Services](./media/app-service-api-dotnet-get-started/browseas.png)

15. In the **App Services** blade, find and click your new API app. (In the Azure portal, windows that open to the right are called *blades*.)

	![App Services blade](./media/app-service-api-dotnet-get-started/choosenewapiappinportal.png)

	Two blades open. One blade has an overview of the API app, and one has a long list of settings that you can view and change.

16. In the **Settings** blade, find the **API** section and click **API Definition**. 

	![API Definition in Settings blade](./media/app-service-api-dotnet-get-started/apidefinsettings.png)

	The **API Definition** blade lets you specify the URL that returns Swagger 2.0 metadata in JSON format. When Visual Studio creates the API app, it sets the API definition URL to the default value for Swashbuckle-generated metadata that you saw earlier, which is the API app's base URL plus `/swagger/docs/v1`. 

	![API definition URL](./media/app-service-api-dotnet-get-started/apidefurl.png)

	When you select an API app to generate client code for it, Visual Studio retrieves the metadata from this URL. 

## <a id="codegen"></a> Consume the API app by using generated client code

One of the advantages of integrating Swagger into Azure API apps is automatic code generation. Generated client classes make it easier to write code that calls an API app.

In this section, you see how to consume an API app from ASP.NET Web API code. 

### Generate client code

You can generate client code for an API app by using Visual Studio or from the command line. For this tutorial, you use Visual Studio. For information about how to do it from the command line, see the readme file of the [Azure/autorest](https://github.com/azure/autorest) repository on GitHub.com.

The ToDoListAPI project already has the generated client code, but you'll delete it and regenerate it to see how it's done.

1. In Visual Studio **Solution Explorer**, in the ToDoListAPI project, delete the *ToDoListDataAPI* folder.

	This folder was created by using the code generation process that you're about to go through.

	![Delete generated client code](./media/app-service-api-dotnet-get-started/deletecodegen.png)

2. Right-click the ToDoListAPI project, and then click **Add > REST API Client**.

	![Add REST API client in Visual Studio](./media/app-service-api-dotnet-get-started/codegenmenu.png)

3. In the **Add REST API Client** dialog box, click **Swagger URL**, and then click **Select Azure Asset**.

	![Select Azure Asset](./media/app-service-api-dotnet-get-started/codegenbrowse.png)

8. In the **App Service** dialog box, expand the resource group you're using for this tutorial and select your API app, and then click **OK**.

	![Select API app for code generation](./media/app-service-api-dotnet-get-started/codegenselect.png)

	This dialog box gives more than one way to organize API apps in the list, in case you have too many to scroll through. It also lets you enter a search string to filter API apps by name.

	Notice that when you return to the **Add REST API Client** dialog, the text box has been filled in with the API definition URL value that you saw earlier in the portal. 

	![API Definition URL](./media/app-service-api-dotnet-get-started/codegenurlplugged.png)

	An alternative way to get metadata for code generation is to enter the URL directly instead of going through the browse dialog. Another alternative is to use the **Select an existing Swagger metadata file** option. For example, if you want to generate client code before deploying to Azure, you could run the Web API project locally, go to the URL that provides the Swagger JSON file, save the file, and select it here.

9. In the **Add REST API Client** dialog box, click **OK**.

	Visual Studio creates a folder named after the API app and generates client classes.

	![Code files for generated client](./media/app-service-api-dotnet-get-started/codegenfiles.png)

5. In the ToDoListAPI project, open *Controllers\ToDoListController.cs* to see the code that calls the API by using the generated client. 

	The following snippet shows how the code instantiates the client object and calls the Get method.

		private static ToDoListDataAPI NewDataAPIClient()
		{
		    var client = new ToDoListDataAPI(new Uri(ConfigurationManager.AppSettings["toDoListDataAPIURL"]));
		    return client;
		}
		
		public async Task<IEnumerable<ToDoItem>> Get()
		{
		    using (var client = NewDataAPIClient())
		    {
		        var results = await client.ToDoList.GetByOwnerAsync(owner);
		        return results.Select(m => new ToDoItem
		        {
		            Description = m.Description,
		            ID = (int)m.ID,
		            Owner = m.Owner
		        });
		    }
		}

	The constructor parameter gets the endpoint URL from  the `toDoListDataAPIURL` app setting. In the Web.config file, that value is set to the local IIS Express URL of the API project so that you can run the application locally. If you omit the constructor parameter, the default endpoint is the URL that you generated the code from.

6. Your client class will be generated with a different name based on your API app name; change the code in *Controllers\ToDoListController.cs* so that the type name matches what was generated in your project. For example, if you named your API App ToDoListDataAPI0121, the code would look like the following example:

		private static ToDoListDataAPI0121 NewDataAPIClient()
		{
		    var client = new ToDoListDataAPI0121(new Uri(ConfigurationManager.AppSettings["toDoListDataAPIURL"]));

### Create an API app to host the middle tier

1. In **Solution Explorer**, right-click the ToDoListAPI  project (not ToDoListDataAPI), and then click **Publish**.

3.  In the **Profile** tab of the **Publish Web** wizard, click **Microsoft Azure App Service**.

5. In the **App Service** dialog box, click **New**.

3. In the **Hosting** tab of the **Create App Service** dialog box, enter an **API App Name** that is unique in the *azurewebsites.net* domain. 

5. Choose the Azure **Subscription** you want to work with.

6. In the **Resource Group** drop-down, choose the same resource group you created earlier.

4. In the **App Service Plan** drop-down, choose the same plan you created earlier. It will default to that value. 

7. Click **Create**.

	Visual Studio creates the API app, creates a publish profile for it, and displays the **Connection** step of the **Publish Web** wizard.

3.  In the **Connection** step of the **Publish Web** wizard, click **Publish**.

	Visual Studio deploys the ToDoListAPI project to the new API app and opens a browser to the URL of the API app. The "successfully created" page appears.

### Set the data tier API app URL in the middle tier API app

If you called the middle tier API app now, it would try to call the data tier using the localhost URL that is still in the Web.config file. In this section you enter the data tier API app URL into an environment setting in the middle tier API app. When the code in the middle tier API app retrieves the data tier URL setting, the environment setting will override what's in the Web.config file. 
 
1. Go to the [Azure portal](https://portal.azure.com/), and then navigate to the **API App** blade for the API app that you created to host the TodoListAPI (middle tier) project.

2. In the API App's **Settings** blade, click **Application settings**.
 
4. In the API App's **Application Settings** blade, scroll down to the **App settings** section and add the following key and value:

	| **Key** | toDoListDataAPIURL |
	|---|---|
	| **Value** | https://{your data tier API app name}.azurewebsites.net |
	| **Example** | https://todolistdataapi0121.azurewebsites.net |

4. Click **Save**.

	![Click Save for App Settings](./media/app-service-api-dotnet-get-started/asinportal.png)

	When the code runs in Azure, this value will now override the localhost URL that is in the Web.config file. 

### Test to verify that ToDoListAPI calls ToDoListDataAPI

11. In a browser window, browse to the URL of the new middle tier API app that you just created (you can get there by clicking the URL in the API app's main blade in the portal).

13. Add "swagger" to the URL in the browser's address bar, and then press Enter. (The URL is `http://{apiappname}.azurewebsites.net/swagger`.)

	The browser displays the same Swagger UI that you saw earlier for ToDoListDataAPI, but now `owner` is not a required field for the Get operation, because the middle tier API app is sending that value to the data tier API app for you. (When you do the authentication tutorials, the middle tier will send actual user IDs for the `owner` parameter; for now it is hard-coding an asterisk.)

12. Try out the Get method and the other methods to validate that the middle tier API app is successfully calling the data tier API app.

	![Swagger UI Get method](./media/app-service-api-dotnet-get-started/midtierget.png)

For more information about the generated client, see the [AutoRest GitHub repository](https://github.com/azure/autorest). For help with problems using the generated client, open an [issue in the AutoRest repository](https://github.com/azure/autorest/issues).

## <a id="creating"></a> Optional: Creating an API app project from scratch

In this tutorial you download ASP.NET Web API projects for deployment to App Service, rather than create new projects from scratch. To create a project that you intend to deploy to an API app, you can create a typical Web API project and install the Swashbuckle package, or you can use the **Azure API App** new-project template. To use that template, click **File > New > Project > ASP.NET Web Application > Azure API App**.

![API App template in Visual Studio](./media/app-service-api-dotnet-get-started/apiapptemplate.png)

The **Azure API App** project template is equivalent to choosing the **Empty** ASP.NET 4.5.2 template, clicking the check box to add Web API support, and installing the Swashbuckle package. In addition, the template adds some Swashbuckle configuration code designed to prevent the creation of duplicate Swagger operation IDs.

## Optional: API definition URL in Azure Resource Manager templates

In this tutorial, you've seen the API definition URL in Visual Studio and in the Azure portal. You can also configure the API definition URL for an API app by using [Azure Resource Manager templates](../resource-group-authoring-templates.md) in command line tools such as [Azure PowerShell](../powershell-install-configure.md) and the [Azure CLI](../xplat-cli-install.md). 

For an example of an Azure Resource Manager template that sets the API definition property, open the [azuredeploy.json file in the repository for this tutorial's sample application](https://github.com/azure-samples/app-service-api-dotnet-todo-list/blob/master/azuredeploy.json). Find the section of the template that looks like the following example:

		"apiDefinition": {
		  "url": "https://todolistdataapi.azurewebsites.net/swagger/docs/v1"
		}

## Troubleshooting

If you run into a problem as you go through this tutorial, make sure that you're using the latest version of the Azure SDK for .NET. The easiest way to do that is to [download the Azure SDK for Visual Studio 2015](http://go.microsoft.com/fwlink/?linkid=518003) -- if you have the current version installed, the Web Platform Installer lets you know that no installation is needed.

Two of the project names are similar (ToDoListAPI, ToDoListDataAPI). If things don't look as described in the instructions when you are working with a project, make sure you have opened the correct project.

If you're on a corporate network and are trying to deploy to Azure App Service through a firewall, make sure that ports 443 and 8172 are open for Web Deploy. If you can't open those ports, see the following Next steps section for other deployment options.

If you accidentally deploy the wrong project to an API app and then later deploy the correct one to it, you might see "Route names must be unique" errors.  To correct this, redeploy the project to the API app, and on the **Settings** tab of the **Publish Web** wizard select **Remove additional files at destination**.

After you have your ASP.NET API app running in Azure App Service, you may want to learn more about Visual Studio features that simplify troubleshooting. For information about logging, remote debugging, and more, see  [Troubleshooting Azure App Service apps in Visual Studio](../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md).

## Next steps

In this tutorial, you've seen how to create API apps, deploy code to them, generate client code for them, and consume them from .NET clients. The next tutorial in the API Apps getting started series shows how to [consume API apps from JavaScript clients, using CORS](app-service-api-cors-consume-javascript.md). Later tutorials in the series show how to implement authentication and authorization.
