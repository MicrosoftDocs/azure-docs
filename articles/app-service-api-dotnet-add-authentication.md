<properties 
	pageTitle="Remotely debug an Azure API App" 
	description="Learn how to remotely debug an Azure API App using Visual Studio." 
	services="app-service-api" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="tdykstra"/>

# Protect an API App: Add Azure Active Directory or social provider authentication

## Overview

In the [deploy an API app](/app-service-dotnet-deploy-api-app/) tutorial, you deployed an API app with **Available to anyone** access level. This tutorial shows how to protect an API app so that only authenticated users can acess it.

## Use Swagger to Access the API 

You can use Swagger to easily access your Azure API app from a web page. The Swagger UI provides an easy-to-use interface that provides details about your API App's endpoints.

The URL to access Swagger is the URL of your running Azure API app's gateway site, with the API app's ID appended to it.The exact URL format of the Swagger UI dashboard is as follows:

    	http://[AzureApiAppProxySite].azurewebsites.net/[Azure API ID]/Swagger

The first node of the proxy site URL is the name of the resource group followed by "proxysite". For example, if you named your resource group ContactsListRG and your API ID ContactsList2, the URL would be as follows:

		http://contactsListrgproxysite.azurewebsites.net/contactslist2/Swagger 

1. In your browser, go to the URL for Swagger for your API app.  

	![Swagger UI](./media/app-service-dotnet-remotely-debug-api-app/40-swagger-ui.png)

2. Click **Try it out!** to call the API method directly from the Swagger UI. 

## Generate an API App Client for use in a Desktop App

In this tutorial you'll learn how easy the API App tools in Visual Studio make it for you to generate C# code used for calling out to your Azure API Apps from desktop, store, and mobile apps. 

1. Right-click your solution and select the **Add -> New Project** option.

![Add a new project](./media/app-service-dotnet-remotely-debug-api-app/01-add-new-project.png)

2. Select the **Windows Desktop** category and **Console Application** project template.

	![Add a new project](./media/app-service-dotnet-remotely-debug-api-app/02-contact-list-console-project.png)

3. Once the solution returns to focus, right-click the Console Application project you created and select the **Add - Azure API App Client** menu item. 

	![Add a new Client](./media/app-service-dotnet-remotely-debug-api-app/03-add-azure-api-client.png)
	
4. Select the API App you want to code against from the dialog

	![Generation Screen](./media/app-service-dotnet-remotely-debug-api-app/04-select-the-api.png)

5. Once you select the API App for which your client code will need a client, code will be dropped into your C# project enabling a typed interface to the API App layer.

	![Generation Happening](./media/app-service-dotnet-remotely-debug-api-app/05-metadata-downloading.png)

6. Once code generation is complete you'll see a new folder in your Visual Studio Solution Explorer named with the name of the API App you're hitting in Azure. Within that folder is code that exposes strongly-typed classes that make it easy for client developers to reach out to the APIs. 

	![Generation Complete](./media/app-service-dotnet-remotely-debug-api-app/06-code-gen-output.png)

## Protect the API app

1. In the Azure [preview portal](https://portal.azure.com/) click **Browse > API Apps**, and then click the name of the API app that you want to protect.

	![Browse](./media/app-service-api-dotnet-add-authentication/browse.png)

	![Select API app](./media/app-service-api-dotnet-add-authentication/select.png)

2. In the API app blade, click **Settings**, and then click **Basic settings**.

	![Click Settings](./media/app-service-api-dotnet-add-authentication/clicksettings.png)

	![Click Basic settings](./media/app-service-api-dotnet-add-authentication/clickbasicsettings.png)

3. In the **Basic Settings** blade, change **Access Level** to **Public (authenticated)**, and then click **Save**.

	![Click Basic settings](./media/app-service-api-dotnet-add-authentication/setpublicauth.png)

4. Scroll left back to the API app blade, and then click the link to the gateway.

	![Click gateway](./media/app-service-api-dotnet-add-authentication/gateway.png)

5. Make a note of the gateway URL, as you might need it later to configure authentication.

	![Click gateway](./media/app-service-api-dotnet-add-authentication/gatewayurl.png)
 
7. Click **Settings**, and then click **Identity**.

	![Click Settings](./media/app-service-api-dotnet-add-authentication/clicksettingsingateway.png)

	![Click Identity](./media/app-service-api-dotnet-add-authentication/clickidentity.png)

	From the **Identity** blade you can navigate to different blades for configuring authentication using Azure Active Directory and several other providers.

	![Identity blade](./media/app-service-api-dotnet-add-authentication/identityblade.png)
  
3. Choose the identity provider you want to use, and follow the steps in the following corresponding document to configure your API app with that provider. You can choose more than one provider.  These documents refer to mobile apps, but the procedures are the same for API apps.

 - [Microsoft Account](../app-service-mobile-how-to-configure-microsoft-authentication-preview/)
 - [Facebook login](../app-service-mobile-how-to-configure-facebook-authentication-preview/)
 - [Twitter login](../app-service-mobile-how-to-configure-twitter-authentication-preview/)
 - [Google login](../app-service-mobile-how-to-configure-google-authentication-preview/)
 - [Azure Active Directory](../app-service-mobile-how-to-configure-active-directory-authentication-preview/)

	Your application is now configured to work with your chosen authentication provider.

## Summary

The remote debugging features available for Azure API Apps make it simple to determine how your code is running in the Azure App Service. Rich diagnostic and debugging data is available right in the Visual Studio IDE for your remotely-running Azure API Apps.
