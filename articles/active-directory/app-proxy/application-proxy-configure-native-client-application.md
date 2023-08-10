---
title: Publish native client apps
description: Covers how to enable native client apps to communicate with Azure Active Directory Application Proxy Connector to provide secure remote access to your on-premises apps.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.custom: devx-track-dotnet
ms.topic: how-to
ms.date: 11/17/2022
ms.author: kenwith
ms.reviewer: ashishj
---

# How to enable native client applications to interact with proxy applications

You can use Azure Active Directory (Azure AD) Application Proxy to publish web apps, but it also can be used to publish native client applications that are configured with the Microsoft Authentication Library (MSAL). Native client applications differ from web apps because they're installed on a device, while web apps are accessed through a browser.

To support native client applications, Application Proxy accepts Azure AD-issued tokens that are sent in the header. The Application Proxy service does the authentication for the users. This solution doesn't use application tokens for authentication.

![Relationship between end users, Azure AD, and published applications](./media/application-proxy-configure-native-client-application/richclientflow.png)

To publish native applications, use the Microsoft Authentication Library, which takes care of authentication and supports many client environments. Application Proxy fits into the [Desktop app that calls a web API on behalf of a signed-in user](../develop/authentication-flows-app-scenarios.md#desktop-app-that-calls-a-web-api-on-behalf-of-a-signed-in-user) scenario.

This article walks you through the four steps to publish a native application with Application Proxy and the Azure AD Authentication Library.

## Step 1: Publish your proxy application

Publish your proxy application as you would any other application and assign users to access your application. For more information, see [Publish applications with Application Proxy](../app-proxy/application-proxy-add-on-premises-application.md).

## Step 2: Register your native application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You now need to register your application in Azure AD, as follows:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory** > **App registrations**. The list of all app registrations appears.
1. Select **New registration**. The **Register an application** page appears.

   ![Create a new app registration in the Azure portal](./media/application-proxy-configure-native-client-application/create.png)

1. In the **Name** heading, specify a user-facing display name for your application.
1. Under the **Supported account types** heading, select an access level using these guidelines:

   - To target only accounts that are internal to your organization, select **Accounts in this organizational directory only**.
   - To target only business or educational customers, select **Accounts in any organizational directory**.
   - To target the widest set of Microsoft identities, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. Under **Redirect URI**, select **Public client (mobile & desktop)**, and then type the redirect URI `https://login.microsoftonline.com/common/oauth2/nativeclient` for your application.
1. Select and read the **Microsoft Platform Policies**, and then select **Register**. An overview page for the new application registration is created and displayed.

For more detailed information about creating a new application registration, see [Integrating applications with Azure Active Directory](../develop/quickstart-register-app.md).

## Step 3: Grant access to your proxy application

Now that you've registered your native application, you can give it access to other applications in your directory, in this case to access the proxy application. To enable the native application to be exposed to the proxy application:

1. In the sidebar of the new application registration page, select **API permissions**. The **API permissions** page for the new application registration appears.
1. Select **Add a permission**. The **Request API permissions** page appears.
1. Under the **Select an API** setting, select **APIs my organization uses**. A list appears, containing the applications in your directory that expose APIs.
1. Type in the search box or scroll to find the proxy application that you published in [Step 1: Publish your proxy application](#step-1-publish-your-proxy-application), and then select the proxy application.
1. In the **What type of permissions does your application require?** heading, select the permission type. If your native application needs to access the proxy application API as the signed-in user, choose **Delegated permissions**.
1. In the **Select permissions** heading, select the desired permission, and select **Add permissions**. The **API permissions** page for your native application now shows the proxy application and permission API that you added.

## Step 4: Add the Microsoft Authentication Library to your code (.NET C# sample)

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

The required info in the sample code can be found in the Azure portal, as follows:

| Info required | How to find it in the Azure portal |
| --- | --- |
| \<Tenant ID> | **Azure Active Directory** > **Properties** > **Directory ID** |
| \<App ID of the Native app> | **Application registration** > *your native application* > **Overview** > **Application ID** |
| \<Scope> | **Application registration** > *your native application* > **API permissions** > Click on the Permission API (user_impersonation) > A panel with the caption **user_impersonation** appears on the right hand side. > The scope is the URL in the edit box.
| \<Proxy App URL> | the External URL and path to the API

After you edit the MSAL code with these parameters, your users can authenticate to native client applications even when they are outside of the corporate network.

## Next steps

For more information about the native application flow, see [mobile](../develop/authentication-flows-app-scenarios.md#mobile-app-that-calls-a-web-api-on-behalf-of-an-interactive-user) and [desktop](../develop/authentication-flows-app-scenarios.md#desktop-app-that-calls-a-web-api-on-behalf-of-a-signed-in-user) apps in Azure Active Directory.

Learn about setting up [Single sign-on to applications in Azure Active Directory](../manage-apps/sso-options.md#choosing-a-single-sign-on-method).
