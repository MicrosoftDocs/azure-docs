<properties
	pageTitle="User authentication for API Apps in Azure App Service | Microsoft Azure"
	description="Learn how to protect an API app in Azure App Service by allowing access only to authenticated users."
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
	ms.date="11/30/2015"
	ms.author="tdykstra"/>

# User authentication for API Apps in Azure App Service

[AZURE.INCLUDE [app-service-api-get-started-selector](../../includes/app-service-api-get-started-selector.md)]

## Overview

This tutorial shows how to use the Authentication and Authorization features of Azure App Service to protect an API app, and how to consume the API app on behalf of end users. The authentication provider shown in the tutorial is Azure Active Directory, and the sample client is an AngularJS single page application running in a browser.

![](./media/app-service-api-dotnet-user-principal-auth/contactspageazure.png)
 
## Authentication and authorization in App Service

For an introduction to authentication features used in this tutorial, see the previous tutorial in this series, [authentication and authorization for API Apps in Azure App Service](app-service-api-dotnet-get-started.md).

## How to follow this tutorial

This tutorial builds on a sample application that you download and create an API app for in the [first tutorial of the ASP.NET version of this series](app-service-api-dotnet-get-started.md). If you are following the Node or Java getting started series, the instructions for configuring authentication in Azure apply to all API languages and frameworks.

## The ContactsList.Angular.AAD sample project

In the [ContactsList sample application](https://github.com/Azure-Samples/app-service-api-dotnet-contact-list), the ContactsList.Angular.AAD project is an AngularJS client that includes code for working with Azure Active Directory. The code is based on an AAD sample that can be found in the [Azure-Samples/active-directory-angularjs-singlepageapp](https://github.com/Azure-Samples/active-directory-angularjs-singlepageapp) repository.

The code in the ContactsList.Angular.AAD project is structured differently than the simpler ContactsLists.Angular project. The code that calls the API is in the *app/scripts/contactsSvc.js* file in the ContactsList.Angular.AAD project. 

		angular.module('contactsListApp')
		.factory('contactsSvc', ['$http', function ($http) {
		    //var apiEndpoint = "https://{your api app name}.azurewebsites.net";
		    var apiEndpoint = "https://localhost:44300";
		
		    $http.defaults.useXDomain = true;
		    delete $http.defaults.headers.common['X-Requested-With']; 
		
		    return {
		        getItems: function () {
		            return $http.get(apiEndpoint + '/api/contacts');
		        },
		        getItem : function(id){
		            return $http.get(apiEndpoint + '/api/contacts/' + id);
		        },
		        postItem : function(item){
		            return $http.post(apiEndpoint + '/api/contacts', item);
		        },
		        putItem : function(item){
		            return $http.put(apiEndpoint + '/api/contacts/', item);
		        },
		        deleteItem : function(id){
		            return $http({
		                method: 'DELETE',
		                url: apiEndpoint + '/api/contacts/' + id
		            });
		        }
		    };
		}]);

Here, the `Get` method is labeled `getItems`, and in the controller (*app/scripts/contactsCtrl.js*) `getItems` is wired up to `$scope.populate`.

		$scope.populate = function () {
		    contactsSvc.getItems().then(function (results) {
		        $scope.contactsList = results.data;
		        $scope.loadingMessage = "";
		    }, function (err) {
		        $scope.loadingMessage = "";
		        $scope.error = "Error: " + err;
		    });
		};

In the view (*app/views/Contacts.html*), $scope.populate is called on initialization.

		<div ng-init="populate()">

## Set up authentication and authorization in Azure

1. In the [Azure portal](https://portal.azure.com/), navigate to the **API App** blade of the API app that you want to protect for access by authenticated users. (For this tutorial, choose the API app to which you deployed the ContactsList.API project.)

2. Click **Settings**

2. Find the **Features** section, and then click **Authentication/ Authorization**.

	![](./media/app-service-api-dotnet-user-principal-auth/features.png)

3. In the **Authentication / Authorization** blade, click **On**.

4. In the **Action to take when request is not authenticated** drop-down list, select **Log in with Azure Active Directory**.

5. Under **Authentication Providers**, click **Azure Active Directory**.

	![](./media/app-service-api-dotnet-user-principal-auth/authblade.png)

6. In the **Azure Active Directory Settings** blade, click **Express**

	![](./media/app-service-api-dotnet-user-principal-auth/aadsettings.png)

	"Express" here means that Azure will automatically create an AAD application in your AAD tenant. Make a note of the name of the new AAD application, as you'll select it later when you go to the Azure classic portal to get the client ID of the new AAD application.

7. Click **OK**.

10. In the **Authentication / Authorization** blade, click **Save**.

8. To verify that the API app is now protected, go to the API app's URL + `/swagger` as you did in the first tutorial to use the Swagger UI. 

	This time you are redirected to a logon page.

	![](./media/app-service-api-dotnet-user-principal-auth/loginpage.png)

11. In the [Azure classic portal](https://manage.windowsazure.com/), go to **Azure Active Directory**.

	You have to go to the classic portal because certain Azure Active Directory settings that you need to complete the configuration process are not yet available in the current Azure portal.

12. On the **Directory** tab, click your AAD tenant.

	![](./media/app-service-api-dotnet-user-principal-auth/selecttenant.png)

14. Click **Applications > Application my company owns**, and then click the check mark.

	You might also have to refresh the page to see the new application.

15. In the list of applications, click the name of the one that Azure created for you when you enabled authentication for your API app.

	![](./media/app-service-api-dotnet-user-principal-auth/appstab.png)

16. Click **Configure**.

	![](./media/app-service-api-dotnet-user-principal-auth/configure.png)

15. At the bottom of the page, click **Manage manifest > Download manifest**, and save the file in a location where you can edit it.

16. In the downloaded manifest file, search for the  `oauth2AllowImplicitFlow` property. Change the value of this property from `false` to `true`, and then save the file.

16. Click **Manage manifest > Upload manifest**, and upload the file that you updated in the preceding step.

17. Keep this page open so you can copy and paste values from it and update values on the page in later steps of the tutorial.

## Set up the Visual Studio projects for https

1. In **Solution Explorer**, click the ContactList.API project and then in the **Properties** window change **SSL Enabled** to **True**.

2. Copy the SSL URL.

	![](./media/app-service-api-dotnet-user-principal-auth/enablessl.png)

3. Right-click the ContactsList.API project, and then click **Properties**.

5. Click the **Web** tab, paste the SSL URL into the **Project Url** field, and then save your changes.

	![](./media/app-service-api-dotnet-user-principal-auth/setprojecturl.png)

1. Follow the same procedure to enable SSL for the ContactsList.Angular.AAD project.

2. Set the ContactsList.API project and the ContactsList.Angular.AAD projects as startup projects, and set the ContactsList.API project to start first.

## Update endpoint URL and AAD settings in the ContactsList.Angular.AAD project

7. In the ContactsList.Angular.AAD project, open the *app/scripts/app.js* file.

8. In the code that sets the `endpoints` variable, make sure that it has the right SSL URL for the ContactsList.API project, and replace both instances of "yourclientid" with the actual value of the AAD application's client ID from the classic portal's **Configure** tab for the AAD application. Make sure the endpoint URL ends with a slash.

	The code will look similar to the following example:

		var endpoints = {
		    //"https://{your api app name}.azurewebsites.net/": "1cf55bc9-9ed8-4df31cf55bc9-9ed8-4df3"
		    "https://localhost:44300/": "1cf55bc9-9ed8-4df31cf55bc9-9ed8-4df3"
		};

9. Also in *app.js*, in the `adalProvider.init` code, replace "{your tenant url}" and "{your client id}" with the actual values.

	The code will look similar to the following example:

		adalProvider.init(
		    {
		        instance: 'https://login.microsoftonline.com/', 
		        tenant: 'contoso.onmicrosoft.com',
		        clientId: '1cf55bc9-9ed8-4df31cf55bc9-9ed8-4df3',
		        extraQueryParameter: 'nux=1',
		        endpoints: endpoints
		    },
		    $httpProvider
		    );

10. In *app/scripts/contactsSvc.js*, make sure that apiEndpoint is set to the correct SSL URL for the ContactsList.API project.

		//var apiEndpoint = "https://{your api app name}.azurewebsites.net";
		var apiEndpoint = "https://localhost:44300";

## Update AAD settings in the ContactsList.API project

1. In the ContactsList.API project, open the application *Web.config* file.

2. In the appSettings element, set ida:Authority to the value "https://login.windows.net/{your tenant url}", and set ida:ClientId to your AAD application's client ID, as shown in the following example.

		<appSettings>
		  <add key="ida:Authority" value="https://login.windows.net/contoso.onmicrosoft.com" />
		  <add key="ida:ClientId" value="1cf55bc9-9ed8-4df31cf55bc9-9ed8-4df3" />
		</appSettings>

## Configure the AAD application for localhost 

1. In the **Configure** tab for the AAD application in the classic portal, in the **Sign-on URL** field, paste the ContactsList.Angular.AAD project SSL URL, including the trailing slash.

	![](./media/app-service-api-dotnet-user-principal-auth/signonurl.png)

3. Near the bottom of the **Configure** tab, in the **Reply URL** field, paste the ContactsList.Angular.AAD project SSL URL, replacing the value already there. 

	![](./media/app-service-api-dotnet-user-principal-auth/replyurl.png)

4. Click **Save**.

## Run the API and client projects locally

When running HTTPS locally, you will receive warning messages about the IIS Express SSL certificate for localhost. To run locally you can click past these messages. If you prefer, you can skip this section and go directly to the next section where you prepare to run the application and API in Azure.

If you have trouble logging on, try using a different browser or opening an Incognito or InPrivate window to the URL of the AngularJS project, e.g., `https://localhost:44301`.

5. In Visual Studio, press F5 to run the API and AngularJS projects locally.

	The AngularJS application's home tab appears.

10. Click the **Login** tab.

	You are prompted to log in.

7. Log in with user credentials for a user in your AAD tenant.

10. Click the **Contacts** tab.

	The **Contacts** page appears.

	![](./media/app-service-api-dotnet-user-principal-auth/contactspagelocal.png)

11. Close the browser windows.

The ContactsList.Angular.AAD project code requires you to be logged on before it will call the API and display contacts. However, there is nothing to prevent unauthenticated callers from calling the API. You could verify that by running the Swagger UI in the browser window that is opened to the ContactsList.API project SSL URL. The API will be protected from unauthenticated callers only when it runs in Azure App Service.

In the following sections you'll configure the projects and AAD for running the client and API in Azure App Service, deploy the projects to Azure, and test them in Azure. 

## Configure the ContactsList.Angular.AAD project to call the Azure API app

1. In the ContactsList.Angular.AAD project, open the *app/scripts/app.js* file.

2. Comment out the localhost endpoint, uncomment the Azure endpoint, and replace "{your api app name}" with your API app name.

	The code is now similar to the following example.

		var endpoints = {
		    "https://contactslistapi.azurewebsites.net/": "1cf55bc9-9ed8-4df31cf55bc9-9ed8-4df3"
		    //"https://localhost:44300/": "1cf55bc9-9ed8-4df31cf55bc9-9ed8-4df3"
		};

1. Make the same endpoint URL change in the *app/scripts/contactsSvc.js* file.

	The code is now similar to the following example.

		var apiEndpoint = "https://contactslistapi.azurewebsites.net";
		//var apiEndpoint = "https://localhost:44300";


## Configure the AAD application for the Azure web app

1. In the **Configure** tab for the AAD application in the classic portal, in the **Sign-on URL** field, delete the ContactsList.Angular.AAD project SSL URL and replace it with the web app's base URL, including the trailing slash. (Note that this is the web app's URL, not the API app's URL.)

	![](./media/app-service-api-dotnet-user-principal-auth/signonurlazure.png)

3. In the **Reply URL** field, replace the ContactsList.Angular.AAD project SSL URL with the web app's base URL. 

	![](./media/app-service-api-dotnet-user-principal-auth/replyurlazure.png)

4. Click **Save**.

## Deploy the ContactsList.API project to Azure

8. In **Solution Explorer**, right-click the ContactsList.API project, and then click **Publish**.

	The **Publish Web** wizard opens to the last used publish profile for this project, which is for deploying to the API app you created earlier.

7. Click **Publish**.

8. Close the browser window that opens automatically.

## Deploy the ContactsList.Angular.AAD project to Azure

8. In **Solution Explorer**, right-click the ContactsList.Angular.API project, and then click **Publish**.

9. Click **Microsoft Azure App Service**.

10. In the **App Service** dialog box, in the **Subscription** drop-down list, choose your subscription.

11. Expand the resource group that you created for this tutorial, and select the web app that you created in the second tutorial.

	![](./media/app-service-api-dotnet-user-principal-auth/deploytowebapp.png)

12. Click **OK**.

12. In the **Publish Web** wizard, click the **Connection** tab, and then in the **Destination URL** box change `http://` to `https://`

	![](./media/app-service-api-dotnet-user-principal-auth/httpsinconntab.png)

12. In the **Publish Web** wizard, click the **Settings** tab, expand **File Publish Options**, and select the **Remove additional files at destination** check box.

7. Click **Publish**.

	Visual Studio deploys the project and opens a browser to the app's home page.

## Test the AngularJS web app in Azure

8. Click the **Contacts** tab.

	You are prompted to log in.

9. Log in with the credentials of a user in your AAD tenant.

10. The **Contacts** page appears.

	![](./media/app-service-api-dotnet-user-principal-auth/contactspageazure.png)

11. To verify that the API app is protected, go to its Swagger UI URL in an InPrivate or Incognito browser window.

	You get redirected to a logon page. 

	The front-end can now call the API on behalf of an authenticated user, but unauthenticated users can't call the API.

## Next steps

In this tutorial you used App Service Authentication/Authorization to restrict access to an API app so that only authenticated users can call it. In the next tutorial in the series you'll learn how to [restrict access to your API app for service-to-service scenarios](app-service-api-dotnet-service-principal-auth.md).
