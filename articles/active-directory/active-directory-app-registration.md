---
title: Azure Active Directory App Registration | Microsoft Docs
description: This article describes how to use the Azure portal to register an application with Azure Active Directory
services: active-directory
documentationcenter: .net
author: priyamohanram
manager: mbaldwin
editor: ''

ms.assetid: 7dc7b89f-653f-405a-b5f4-2c1288720c15
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/30/2016
ms.author: priyamo
---

# Register your application with your Azure Active Directory tenant

You can use the Azure portal to register your application with your Azure Active Directory (Azure AD) tenant. This creates an Application ID for the application, and enables it to receive tokens.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Choose your Azure AD tenant by selecting your account in the top right corner of the page.
3. In the left-hand navigation pane, choose **More Services**, click **App Registrations**, and click **Add**.
4. Follow the prompts and create a new application. If you'd like specific examples for web applications or native applications, check out our [quickstarts](active-directory-developers-guide.md).
  * For Web Applications, provide the **Sign-On URL**, which is the base URL of your app, where users can sign in e.g `http://localhost:12345`.
<!--TODO: add once App ID URI is configurable: The **App ID URI** is a unique identifier for your application. The convention is to use `https://<tenant-domain>/<app-name>`, e.g. `https://contoso.onmicrosoft.com/my-first-aad-app`-->
  * For Native Applications, provide a **Redirect URI**, which Azure AD uses to return token responses. Enter a value specific to your application, .e.g `http://MyFirstAADApp`
5. Once you've completed registration, Azure AD assigns your application a unique client identifier, the Application ID.

## Update application settings from the Azure portal

You can easily modify an existing application's settings using the Azure portal. For example, you may want to configure a reply URL, which is where Azure AD issues token responses. You may also want to configure permissions to other applications, for instance to allow your application to access the Microsoft Graph API. You can do all this through the application settings page.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Choose your Azure AD tenant by selecting your account in the top right corner of the page.
3. In the left-hand navigation pane, choose **More Services**, click **App Registrations**, and choose your application from the list.
4. Click **Settings** to open up the settings page for the application.
  * The **Properties** page lets you modify the general information for the application. This includes the application name, the sign-on URL, and the logout URL.
  * The **Reply URLs** page allows you to add a reply URL, which is where Azure AD sends token responses.
  * The **Owners** page allows you to add application owners.
  * The **Permissions** page allows you to configure permissions for the app. For example, to access the Microsoft Graph API, click **Add** and select **Microsoft Graph** in the API selector, then choose the permission required, for example **Read Directory Data**.
  * The **Keys** page allows you to add application secrets. The secret will only be displayed once immediately after creation, so make sure to copy it for further use.

## Use the inline manifest editor

You can use the inline manifest editor to modify certain application properties that are not exposed directly in the Azure portal. For example, you can use it to modify the application's App ID URI or to enable the OAuth2.0 implicit flow instead of the default authorization grant code flow.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Choose your Azure AD tenant by selecting your account in the top right corner of the page.
3. In the left-hand navigation pane, choose **More Services**, click **App Registrations**, and choose your application from the list.
4. Click **Manifest** from the application page to open the inline manifest editor.
5. You can directly make changes to the manifest and save it when you're ready. Alternatively, you can download the manifest to open it in your favorite editor and upload the updated manifest.

## Next Steps

1. Check out the [Quickstarts](active-directory-developers-guide.md) for detailed walkthroughs of applications performing authentication using Azure AD.
2. Check out our full list of code samples in [GitHub](https://github.com/azure-samples).
