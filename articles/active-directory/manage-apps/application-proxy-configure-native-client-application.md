---
title: Publish native client apps - Azure AD | Microsoft Docs
description: Covers how to enable native client apps to communicate with Azure AD Application Proxy Connector to provide secure remote access to your on-premises apps.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/15/2019
ms.author: mimart
ms.reviewer: japere
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# How to enable native client applications to interact with proxy applications

You can use Azure Active Directory (Azure AD) Application Proxy to publish web apps, but it also can be used to publish native client applications that are configured with the Microsoft Authentication Library (MSAL). Native client applications differ from web apps because they're installed on a device, while web apps are accessed through a browser.

To support native client applications, Application Proxy accepts Azure AD-issued tokens that are sent in the header. The Application Proxy service does the authentication for the users. This solution doesn't use application tokens for authentication.

![Relationship between end users, Azure AD, and published applications](./media/application-proxy-configure-native-client-application/richclientflow.png)

To publish native applications, use the Microsoft Authentication Library, which takes care of authentication and supports many client environments. Application Proxy fits into the [Native Application to Web API scenario](../azuread-dev/native-app.md).

This article walks you through the four steps to publish a native application with Application Proxy and the Azure AD Authentication Library.

## Step 1: Publish your proxy application

Publish your proxy application as you would any other application and assign users to access your application. For more information, see [Publish applications with Application Proxy](application-proxy-add-on-premises-application.md).

## Step 2: Register your native application

You now need to register your application in Azure AD, as follows:

1. Sign in to the [Azure Active Directory portal](https://aad.portal.azure.com/). The **Dashboard** for the **Azure Active Directory admin center** appears.
1. In the sidebar, select **Azure Active Directory**. The **Azure Active Directory** overview page appears.
1. In the Azure AD overview sidebar, select **App registrations**. The list of all app registrations appears.
1. Select **New registration**. The **Register an application** page appears.

   ![Create a new app registration in the Azure portal](./media/application-proxy-configure-native-client-application/create.png)

1. In the **Name** heading, specify a user-facing display name for your application.
1. Under the **Supported account types** heading, select an access level using these guidelines:

   - To target only accounts that are internal to your organization, select **Accounts in this organizational directory only**.
   - To target only business or educational customers, select **Accounts in any organizational directory**.
   - To target the widest set of Microsoft identities, select **Accounts in any organizational directory and personal Microsoft accounts**.

1. In the **Redirect URI** heading, select **Public client (mobile & desktop)**, and then type the redirect URI **https://login.microsoftonline.com/common/oauth2/nativeclient** for your application.
1. Select and read the **Microsoft Platform Policies**, and then select **Register**. An overview page for the new application registration is created and displayed.

For more detailed information about creating a new application registration, see [Integrating applications with Azure Active Directory](../develop/quickstart-register-app.md).

## Step 3: Add the Microsoft Authentication Library to your code (.NET C# sample)

Edit the native application code in the authentication context of the Microsoft Authentication Library (MSAL) to include the following text: 

```         
// Acquire Access Token from AAD for Proxy Application
IPublicClientApplication clientApp = PublicClientApplicationBuilder
.Create(<App ID of the Native app>)
.WithDefaultRedirectUri() // will automatically use the default Uri for native app
.WithAuthority("https://login.microsoftonline.com/{<Tenant ID>}")
.Build();

AuthenticationResult authResult = null;
var accounts = await clientApp.GetAccountsAsync();
IAccount account = accounts.FirstOrDefault();

IEnumerable<string> scopes = new string[] {"<Scope>"};

try
 {
    authResult = await clientApp.AcquireTokenSilent(scopes, account).ExecuteAsync();
 }
    catch (MsalUiRequiredException ex)
 {
     authResult = await clientApp.AcquireTokenInteractive(scopes).ExecuteAsync();                
 }

if (authResult != null)
 {
  //Use the Access Token to access the Proxy Application

  HttpClient httpClient = new HttpClient();
  HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);
  HttpResponseMessage response = await httpClient.GetAsync("<Proxy App Url>");
 }
```

The required info in the sample code can be found in the Azure AD portal, as follows:

| Info required | How to find it in the Azure AD portal |
| --- | --- |
| \<Tenant ID> | **Azure Active Directory** > **Properties** > **Directory ID** |
| \<App ID of the Native app> | **Enterprise applications** > *your native application* > **Properties** > **Application ID** |
| \<Scope> | consists of the External Url of Proxy App (**Enterprise applications** > *your proxy application* > **Application proxy** > **External Url**) + "/user_impersonation"
| \<Proxy App Url> | the External Url and path to the API

After you edit the MSAL code with these parameters, your users can authenticate to native client applications even when they're outside of the corporate network.

## Next steps

For more information about the native application flow, see [Native apps in Azure Active Directory](../azuread-dev/native-app.md).

Learn about setting up [Single sign-on to applications in Azure Active Directory](what-is-single-sign-on.md#choosing-a-single-sign-on-method).
