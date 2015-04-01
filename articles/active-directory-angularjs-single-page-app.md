<properties 
	pageTitle="How to build an AngularJS single-page app with Azure AD" 
	description="Demonstrates the use of Active Directory Authentication Library (ADAL) for Javascript for securing an AngularJS based single page app, implemented with an ASP.NET Web API backend, that calls another ASP.NET Web API using CORS." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="terrylan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.devlang="javascript" 
	ms.topic="hero-article" 
	ms.tgt_pltfrm="na" 
	ms.workload="identity" 
	ms.date="04/01/2015" 
	ms.author="justinha"/>


# How to build an AngularJS single-page app with Azure AD 

This tutorial demonstrates the use of Active Directory Authentication Library (ADAL) for JavaScript for securing an AngularJS based single page app, implemented with an ASP.NET Web API backend, that calls another ASP.NET Web API using CORS. To see the code sample used for this tutorial, see [AzureADSamples/SinglePageApp-AngularJS-DotNet](https://github.com/AzureADSamples/SinglePageApp-AngularJS-DotNet) on github.

ADAL for Javascript is an open source library.  For distribution options, source code, and contributions, check out [the ADAL JS repo](https://github.com/AzureAD/azure-activedirectory-library-for-js).

For more information about how the protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](http://go.microsoft.com/fwlink/?LinkId=394414).

## How to run this sample

Getting started is simple!  To run this sample you will need:

- Visual Studio 2013
- An Internet connection
- An Azure subscription (a [free trial](https://account.windowsazure.com/organization) is sufficient)

Every Azure subscription has an associated Azure Active Directory (Azure AD) tenant. All of the Azure AD features used by this sample are available free of charge.

## Clone or download this repository

From your shell or command line:
`git clone https://github.com/AzureADSamples/SinglePageApp-WebAPI-AngularJS-DotNet.git`

## Register the To Go API Service with your Azure Active Directory tenant

1. Sign in to the [Azure management portal](https://manage.windowsazure.com).
2. Click on **Active Directory** in the left hand nav.
3. Click the directory where you wish to register the sample application.
4. Click the **Applications** tab.
5. In the drawer, click **Add**.
6. Click **Add an application my organization is developing**.
7. Enter a friendly name for the application, for example "To Go API", select **Web Application** and/or **Web API**, and click **Next**.
8. For the sign-on URL, enter the base URL for the sample, which is by default `https://localhost:44327/`.
9. For the App ID URI, enter `https://<your_directory_name>/ToGoAPI`, replacing `<your_directory_name>` with the name of your Azure AD directory.  Save the configuration.

All done!  Before moving on to the next step, you need to find the App ID URI of your api.

1. While still in the Azure portal, click the **Configure** tab of your application.
2. Find the App ID URI value and copy it to the clipboard.

## Configure the To Go API to use your Azure Active Directory tenant

1. Open the solution in Visual Studio 2013.
2. In the ToGoAPI project, open the `web.config` file.
3. Find the app key `ida:Tenant` and replace the value with your Azure AD tenant name.
4. Find the app key `ida:Audience` and replace the value with the App ID URI you copied from the Azure portal.
5. Also in the ToGoAPI project, open the file `Controllers/ToGoListController.cs`.  In the `[EnableCors...]` attribute, enter the location of the To Do SPA client.  By default it is `https://localhost:44326`.  Make sure to omit the trailing slash.
5. In the TodoSPA project, open the file `App/Scripts/App.js` and locate the declaration of the `endpoints` object.
6. Enter a mapping of the To Go API endpoint location to its resource identifier, or App ID URI.  The name of the property of the `endpoints` object should be the location of the To Go API.  By default, it is `https://localhost:44327/`.  The value of this property should be the App ID URI you copied from the portal, e.g. `https://<your_tenant_name>/ToGoAPI`.
8. Don't worry about the other configuration values in this file yet, we'll come back to that in a second.
9. Also in the TodoSPA project, open the file `App/Scripts/toGoListSvc.js`.  Replace the value of the `apiEndpoint` variable with the location of your To Go API.  By default, it is `https://localhost:44327/`.

## Register the To Do Single Page Application with your Azure Active Directory tenant

1. Sign in once again to the [Azure management portal](https://manage.windowsazure.com).
2. Click **Active Directory** in the left hand nav.
3. Click the tenant where you wish to register the sample application.
4. Click the **Applications** tab.
5. In the drawer, click **Add**.
6. Click **Add an application my organization is developing**.
7. Enter a friendly name for the application, for example "To Do SPA", select **Web Application and/or Web API**, and click **Next**.
8. For the sign-on URL, enter the base URL for the sample, which is by default `https://localhost:44326/`.
9. For the App ID URI, enter `https://<your_directory_name>/ToDoSPA`, replacing `<your_directory_name>` with the name of your Azure AD directory.
10. In the **Permissions to Other Applications** section, click **Add Application**.  Select **Other** in the **Show** drop-down, and click the upper check mark.  Locate and click the To Go API, and click the bottom check mark to add the application.  Select **Access To Go API** from the **Delegated Permissions** drop-down, and save the configuration.

All done!  Before moving on to the next step, you need to find the Client ID of your application.

1. While still in the Azure portal, click the **Configure** tab of your application.
2. Find the Client ID value and copy it to the clipboard.


## Enable the OAuth2 implicit grant for your application

By default, applications provisioned in Azure AD are not enabled to use the OAuth2 implicit grant. In order to run this sample, you need to explicitly opt in.

1. From the former steps, your browser should still be on the Azure management portal - and specifically, displaying the **Configure** tab of your application's entry.
2. Using the **Manage Manifest** button in the drawer, download the manifest file for the application and save it to disk.
3. Open the manifest file with a text editor. Search for the `oauth2AllowImplicitFlow` property. You will find that it is set to `false`; change it to `true` and save the file.
4. Using the **Manage Manifest** button, upload the updated manifest file. Save the configuration of the app.

## Configure the To Do SPA to use your Azure Active Directory tenant

1. Open the solution in Visual Studio 2013.
2. In the TodoSPA project, open the `web.config` file.
3. Find the app key `ida:Tenant` and replace the value with your Azure AD directory name.
4. Find the app key `ida:Audience` and replace the value with the Client ID from the Azure portal.
5. Also in the TodoSPA project, open the file `App/Scripts/App.js` once again and locate the line `adalAuthenticationServiceProvider.init(`.
6. Replace the value of `tenant` with your Azure AD directory name.
7. Replace the value of `clientId` with the Client ID from the Azure portal.

## Run the sample

Clean the solution, rebuild the solution, and run it. 

You can trigger the sign in experience by either clicking the sign in link on the top right corner, or by clicking directly on the **To Do List** or **To Go List** tabs.  Explore the sample by signing in, adding items to the To Do List, removing the user account, and starting again.  Add places to the To Go List, performing CRUD operations against the To Go API using CORS.

## How to deploy this sample to Azure

To deploy the To Do SPA and To Go API to Azure Web Sites, you will create two web sites, publish each project to a web site, and update both projects to reference the new locations instead of IIS Express.

### Create the To Go API Azure Web Site

1. Sign in to the [Azure management portal](https://manage.windowsazure.com).
2. Click **Web Sites** in the left hand nav.
3. Click **New** in the bottom left hand corner, select **Compute** > **Web Site** > **Custom Create**, select the hosting plan and region, and give your web site a name, e.g. togo-contoso.azurewebsites.net.  Select a database to use, or create a new one.  Click **Create Web Site**.
4. Once the web site is created, click it to manage it.  For this set of steps, download the .publishsettings file and save it.  Other deployment mechanisms, such as from source control, can also be used. For more information about using a .publishsettings file, see [How to: Connect to your subscription](http://azure.microsoft.com/documentation/articles/install-configure-powershell/#Connect). 

### Create the To Do SPA Azure Web Site

1. Navigate to the [Azure management portal](https://manage.windowsazure.com).
2. Click **Web Sites** in the left hand nav.
3. Click **New** in the bottom left hand corner, select **Compute** > **Web Site** > **Custom Create**, select the hosting plan and region, and give your web site a name, e.g. todo-contoso.azurewebsites.net.   Select a database to use; the same database as the To Go API will be fine.  Click **Create Web Site**.
4. Once the web site is created, click it to manage it.  Once again, download the .publishsettings file for this site and save it.

### Update both projects to use Azure Web Sites

1. In Visual Studio, go to the TodoSPA project.
2. Two changes are needed.  In `App\Scripts\app.js`, replace the property name of the `endpoints` object to the new location of your To Go API, e.g. `https://togo-contoso.azurewebsites.net/`.  In `App\Scripts\toGoListSvc.js`, replace the `apiEndpoint` variable with the same value.
3. In the ToGoAPI project, only one change is needed. In `Controllers\ToGoListController.cs`, update the `[EnableCors...]` attribute to reflect the new location of the To Do SPA, e.g. `https://todo-contoso.azurewebsites.net`.  Once again, make sure to omit the trailing slash.

### Publish the To Go API to Azure Web Sites

1. Switch to Visual Studio and go to the ToGoAPI project.  Right-click the project in the Solution Explorer and select **Publish**. Click **Import**, and import the To Go API publish profile you downloaded.
6. On the **Connection** tab, update the Destination URL so that it is https, such as https://togo-constoso.azurewebsites.net. Click **Next**.
7. On the **Settings** tab, make sure **Enable Organizational Authentication** is NOT selected.  Click **Publish**.
8. Visual Studio will publish the project and automatically open a browser to the URL of the project.  If you see the default web page of the project, the publication was successful.

### Publish the To Do SPA to Azure Web Sites

1. Switch to Visual Studio and go to the TodoSPA project.  Right-click the project in the Solution Explorer and select **Publish**.  Click **Import**, and import the To Do SPA .publishsettings file you downloaded.
6. On the **Connection** tab, update the Destination URL so that it is https, such as https://todo-contoso.azurewebsites.net.  Click **Next**.
7. On the **Settings** tab, make sure **Enable Organizational Authentication** is NOT selected.  Click **Publish**.
8. Visual Studio will publish the project and automatically open a browser to the URL of the project.  If you see the default web page of the project, the publication was successful.

### Update the To Do SPA Configuration in the Directory Tenant

1. Navigate to the [Azure management portal](https://manage.windowsazure.com).
2. In the left hand nav, click **Active Directory** and select your tenant.
3. On the **Applications** tab, select the **To Do SPA** application.
4. On the **Configure** tab, update the **Sign-On URL** and **Reply URL** fields to the address of your SPA, such as https://todo-contoso.azurewebsites.net.  Save the configuration.

## About the code

The key files containing authentication logic are the following:

- **App.js** - injects the ADAL module dependency, provides the app configuration values used by ADAL for driving protocol interactions with Azure AD and indicates which routes should not be accessed without previous authentication.

- **index.html** - contains a reference to adal.js

- **HomeController.js**- shows how to take advantage of the login() and logOut() methods in ADAL.

- **UserDataController.js** - shows how to extract user information from the cached id_token.
   
Special thanks to @matvelloso for the assist in getting this tutorial created.


## Next steps

Here are some additional resources to help you use Azure AD to add authentication and authorization to your web applications and web APIs: 

+ [Azure Active Directory Code Samples](https://msdn.microsoft.com/library/azure/dn646737.aspx)
+ [Authentication Scenarios for Azure AD](https://msdn.microsoft.com/library/azure/dn499820.aspx)



