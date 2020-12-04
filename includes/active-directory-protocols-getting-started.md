---
title: Azure AD .NET Protocol Overview | Microsoft Docs
description: How to use HTTP messages to authorize access to web applications and web APIs in your tenant using Azure AD.
services: active-directory
documentationcenter: .net
author: priyamohanram
manager: daveba
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 05/22/2019
ms.author: priyamo
---
## Register your application with your AD tenant
First, register your application with your Azure Active Directory (Azure AD) tenant. This will give you an Application ID for your application, as well as enable it to receive tokens.

1. Sign in to the [Azure portal](https://portal.azure.com).
   
1. Choose your Azure AD tenant by selecting your account in the top right corner of the page, followed by selecting the **Switch Directory** navigation and then selecting the appropriate tenant. 
   - Skip this step if you only have one Azure AD tenant under your account, or if you've already selected the appropriate Azure AD tenant.
   
1. In the Azure portal, search for and select **Azure Active Directory**.
   
1. In the **Azure Active Directory** left menu, select **App Registrations**, and then select **New registration**.
   
1. Follow the prompts and create a new application. It doesn't matter if it is a web application or a public client (mobile & desktop) application for this tutorial, but if you'd like specific examples for web applications or public client applications, check out our [quickstarts](../articles/active-directory/azuread-dev/v1-overview.md).
   
   - **Name** is the application name and describes your application to end users.
   - Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
   - Provide the **Redirect URI**. For web applications, this is the base URL of your app where users can sign in.  For example, `http://localhost:12345`. For public client (mobile & desktop), Azure AD uses it to return token responses. Enter a value specific to your application.  For example, `http://MyFirstAADApp`.
   <!--TODO: add once App ID URI is configurable: The **App ID URI** is a unique identifier for your application. The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`-->  
   
1. Once you've completed registration, Azure AD will assign your application a unique client identifier (the **Application ID**). You need this value in the next sections, so copy it from the application page.
   
1. To find your application in the Azure portal, select **App registrations**, and then select **View all applications**.