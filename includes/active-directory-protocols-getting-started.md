---
title: Azure AD .NET Protocol Overview | Microsoft Docs
description: How to use HTTP messages to authorize access to web applications and web APIs in your tenant using Azure AD.
services: active-directory
documentationcenter: .net
author: priyamohanram
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 01/21/2016
ms.author: priyamo
---
## Register your application with your AD tenant
First, you will need to register your application with your Azure Active Directory (Azure AD) tenant. This will give you an Application ID for your application, as well as enable it to receive tokens.

* Sign in to the [Azure Portal](https://portal.azure.com).
* Choose your Azure AD tenant by clicking on your account in the top right corner of the page.
* In the left hand navigation pane, click on **Azure Active Directory**.
* Click on **App Registrations** and click on **Add**.
* Follow the prompts and create a new application. It doesn't matter if it is a web application or a native application for this tutorial, but if you'd like specific examples for web applications or native applications, check out our [quickstarts](../articles/active-directory/develop/active-directory-developers-guide.md).
  * For Web Applications, provide the **Sign-On URL** which is the base URL of your app, where users can sign in e.g `http://localhost:12345`.
<!--TODO: add once App ID URI is configurable: The **App ID URI** is a unique identifier for your application. The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`-->
  * For Native Applications, provide a **Redirect URI**, which Azure AD will use to return token responses. Enter a value specific to your application, .e.g `http://MyFirstAADApp`
* Once you've completed registration, Azure AD will assign your application a unique client identifier, the Application ID. You will need this value in the next sections, so copy it from the application page.
