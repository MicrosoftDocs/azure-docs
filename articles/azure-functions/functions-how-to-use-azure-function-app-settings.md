<properties
	pageTitle="Configure Azure Functions App Settings | Microsoft Azure"
	description="Learn how to configure Azure function app settings."
	services=""
	documentationCenter=".net"
	authors="rachelap"
	manager="erikre"
	editor=""/>

<tags
	ms.assetID="9a0dd308-74c3-447c-9d78-7b7321c7a875"
	ms.service=""
	ms.workload="na"
	ms.tgt_pltfrm="dotnet"
	ms.devlang="na"
	ms.topic=""
	ms.date="10/DD/2016"
	ms.author="rachelap"/>

# How to Configure Azure Function App Settings

## Settings Overview

You can manage app settings for Azure Function Apps by clicking the **Function App Settings** link in the bottom-left corner of the portal. Azure function app settings apply to all functions in the app.

1. Go to the [Azure portal](http://portal.azure.com) and sign-in with your Azure account.

2. Click **Function App Settings** in the bottom-left corner of the portal. This reveals several configuration options to choose from. 

![Azure Function App settings](./media/how-to-use-azure-function-app-settings/azure-function-app-main.png)

## Memory Size

You can configure how much memory to allocate for your functions in the current function app. 

1. To configure memory, slide the slider to the desired amount of memory. The maximum is 128 MB.

![Configure function app memory size](./media/how-to-use-azure-function-app-settings/configure-function-app-memory-size.png)

## Continuous Integration

You can integrate your Function App with GitHub, Visual Studio Team Services, and more.

1. Click the  **Configure continuous integration** link. This will open a **Deployments** pane with options.

2. Click **Setup** in the **Deployments** pane to reveal a **Deployment Source** pane with one option: Click **Choose Source** to show available sources. 

3. Chooose any of the deployment sources available: Visual Studio Team Services, OneDrive, Local Git Repository, GitHub, Bitbucket, DropBox or an External Repository by clicking on it. 

![Configure App Function's CI](./media/how-to-use-azure-function-app-settings/configure-function-ci.png)

4. Enter your credentials and information as prompted by the various deployment sources. The credentials and information requested may be slightly different depending on what source you have chosen. 

Once you have setup CI, connected code you push to the configured source will automatically be deployed to this function app.

## Authentication/Authorization

For functions that use an HTTP trigger, you can require calls to be authenticated.

1. To configure authentication, Click the  **Configure authentication** link.

2. Toggle the **App Service Authentication** button to **On**.

![Configure App Function's CI](./media/how-to-use-azure-function-app-settings/configure-function-app-authentication.png)

Most authentication providers ask for a API Key/Client ID and a Secret; however, both the Microsoft Account and Facebook options also allow you to define scopes (specific authorization credentials). Active Directory has several express or advanced configuration settings you can set.

For details on configuring specific authentication providers, see 
[Azure App Service authentication overview](https://azure.microsoft.com/en-us/documentation/articles/app-service-authentication-overview/).

## CORS

Normally, for security reasons, calls to your hosts (domains) from external sources, such as Ajax calls from a browser, are not allowed. Otherwise, malicious code could be sent to and executed on the backend. The safest route then is to blacklist all sources of code, except for a few of your own trusted ones. You can do this in Azure functions by configuring Cross-Origin Resource Sharing (CORS). CORS allows you to list domains that are the source of JavaScript that can call functions in your Azure Function App. 

1. To configure CORS, Click the  **Configure CORS** link. 

2. Enter domain(s) that you want to whitelist.

![Configure App Function's CORS](./media/how-to-use-azure-function-app-settings/configure-function-app-cors.png)

## API definition

Allow clients to more easily consume your HTTP-triggered functions.

1. To setup an API, click **Configure API metadata**. 

2. Enter the URL that points to a Swagger json file.

![Configure App Function's API](./media/how-to-use-azure-function-app-settings/configure-function-app-apidef.png)

For more information on creating API definitions with Swagger, visit [Get Started with API Apps, ASP.NET, and Swagger in Azure ](https://azure.microsoft.com/en-us/documentation/articles/app-service-api-dotnet-get-started/).

## Application settings

Manage environment variables, Framework versions, remote debugging, app settings, connection strings, default docs, etc... These settings are specific to your Function App. 

1. To configure app settings, Click the  **Configure App Settings** link. 

![Configure App Settings](./media/how-to-use-azure-function-app-settings/configure-function-app-settings.png)

## In-portal console

You can execute DOS style commands with the Azure functions in-portal console. Common commands include directory and file creation and navigation, as well as executing batch files and scripts. 

 >[AZURE.NOTE] You can upload scripts, but first you must configure an FTP client in the Azure Function's **Advanced Settings**.

1. To open the In-portal console, click **Open dev console**.

![Configure function app memory size](./media/how-to-use-azure-function-app-settings/configure-function-console.png)

>[AZURE.NOTE] Working in a console with ASCII art like that will make you look cool.

## Kudu

Kudu allows you to access advanced administrative features of a Function App.

1. To open Kudu, click **Go to Kudu**. This will open an entirely new browser window with the Kudu web admin.

 >[AZURE.NOTE] You can alternatively launch **Kudu** by inserting "scm" into your function's URL, as shown here: ```https://<YourFunctionName>.scm.azurewebsites.net/```

From the Kudu webpage, you can view and manage system information, app settings, connection strings, environment variables, PATH variables, HTTP headers, server variables, and more.

![Configure Kudu](./media/how-to-use-azure-function-app-settings/configure-function-app-kudu.png)

## Advanced Settings

Manage your function app like any other App Service instance. This option gives you access to all the previously discussed settings, plus several more.  

1. To open advanced settings, click the **Advanced Settings** link. 

![Configure App Service Settings](./media/how-to-use-azure-function-app-settings/configure-function-app-appservice-settings.png)

For details on how to configure each App Service setting, see 
[Configure Azure App Service Settings](https://azure.microsoft.com/en-us/documentation/articles/web-sites-configure/).

