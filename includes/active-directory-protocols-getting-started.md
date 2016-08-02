<properties
	pageTitle="Azure AD .NET Protocol Overview | Microsoft Azure"
	description="How to use HTTP messages to authorize access to web applications and web APIs in your tenant using Azure AD."
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>

<!--TODO: Introduction -->

## Register your application with your AD tenant

First, you will need to register your application with your Active Directory tenant. This will give you a client ID for your application, as well as enable it to receive tokens.

- Sign into the Azure Management Portal.

- In the left hand navigation pane, click on **Active Directory**.

- Select a tenant in which to register the application.

- Click on the **Applications** tab, and click **Add** in the bottom drawer.

- Follow the prompts and create a new application. It doesn't matter if it is a web application or a native application for this tutorial, but if you'd like specific examples for web applications or native applications, check out our quickstarts [here](../articles/active-directory/active-directory-developers-guide.md).

- For Web Applications, provide the **Sign-On URL** which is the base URL of your app, where users can sign in e.g `http://localhost:12345`. The **App ID URI** is a unique identifier for your application. The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`

- For Native Applications, provide a **Redirect URI**, which Azure AD will use to return token responses. Enter a value specific to your application, .e.g `http://MyFirstAADApp`

- Once you've completed registration, AAD will assign your application a unique client identifier. You will need this value in the next sections, so copy it in the **Configure** tab of your application.
