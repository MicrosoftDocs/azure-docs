<properties
	pageTitle="Azure AD Java Getting Started | Microsoft Azure| Microsoft Azure"
	description="How to build a Java web app that signs users in with a work or school account."
	services="active-directory"
	documentationCenter="java"
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
  ms.tgt_pltfrm="na"
	ms.devlang="java"
	ms.topic="article"
	ms.date="10/23/2015"
	ms.author="brandwe"/>


# Java Web App Sign In & Sign Out with Azure AD

[AZURE.INCLUDE [active-directory-devguide](../../includes/active-directory-devguide.md)]

Azure AD makes it simple and straightforward to outsource your web app's identity management, providing single sign-in and sign-out with only a few lines of code.  In Asp.NET web apps, you can accomplish this using Microsoft's implementation of the community-driven OWIN middleware included in .NET Framework 4.5.  Here we'll use OWIN to:
- Sign the user into the app using Azure AD as the identity provider.
- Display some information about the user.
- Sign the user out of the app.

In order to do this, you'll need to:

1. Register an application with Azure AD
2. Set up your app to use the OWIN authentication pipeline.
3. Use OWIN to issue sign-in and sign-out requests to Azure AD.
4. Print out data about the user.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/WebApp-OpenIdConnect-DotNet/archive/complete.zip).  You'll also need an Azure AD tenant in which to register your application.  If you don't have one already, [learn how to get one](active-directory-howto-tenant.md).

## *1.  Register an Application with Azure AD*
To enable your app to authenticate users, you'll first need to register a new application in your tenant.

- Sign into the Azure Management Portal.
- In the left hand nav, click on **Active Directory**.
- Select the tenant where you wish to register the application.
- Click the **Applications** tab, and click add in the bottom drawer.
- Follow the prompts and create a new **Web Application and/or WebAPI**.
    - The **name** of the application will describe your application to end-users
    - The **Sign-On URL** is the base URL of your app.  The skeleton's default is `https://localhost:44320/`.
    - The **App ID URI** is a unique identifier for your application.  The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`
- Once you've completed registration, AAD will assign your app a unique client identifier.  You'll need this value in the next sections, so copy it from the Configure tab.

## *2. Set up your app to use the OWIN authentication pipeline*
Here, we'll configure the OWIN middleware to use the OpenID Connect authentication protocol.  OWIN will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

##Next Steps

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs/archive/complete.zip), or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git```

You can now move onto more advanced topics.  You may want to try:

[Secure a Web API with the v2.0 app model in node.js >>](active-directory-v2-devquickstarts-webapi-nodejs.md)

For additional resources, check out:
- [The App Model v2.0 Preview >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "azure-active-directory" tag >>](http://stackoverflow.com/questions/tagged/azure-active-directory)
