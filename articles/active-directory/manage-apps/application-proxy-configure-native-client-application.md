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

You can use Azure Active Directory (Azure AD) Application Proxy to publish web apps, but it also can be used to publish native client applications that are configured with the Azure AD Authentication Library (ADAL). Native client applications differ from web apps because they're installed on a device, while web apps are accessed through a browser.

To support native client applications, Application Proxy accepts Azure AD-issued tokens that are sent in the header. The Application Proxy service does the authentication for the users. This solution doesn't use application tokens for authentication.

![Relationship between end users, Azure AD, and published applications](./media/application-proxy-configure-native-client-application/richclientflow.png)

To publish native applications, use the Azure AD Authentication Library, which takes care of authentication and supports many client environments. Application Proxy fits into the [Native Application to Web API scenario](../develop/native-app.md).

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

1. In the **Redirect URI** heading, select **Public client (mobile & desktop)**, and then type the redirect URI for your application.
1. Select and read the **Microsoft Platform Policies**, and then select **Register**. An overview page for the new application registration is created and displayed.

For more detailed information about creating a new application registration, see [Integrating applications with Azure Active Directory](../develop/quickstart-v1-integrate-apps-with-azure-ad.md).

## Step 3: Grant access to your proxy application

Now that you've registered your native application, you can give it access to other applications in your directory, in this case to access the proxy application. To enable the native application to be exposed to the proxy application:

1. In the sidebar of the new application registration page, select **API permissions**. The **API permissions** page for the new application registration appears.
1. Select **Add a permission**. The **Request API permissions** page appears.
1. Under the **Select an API** setting, select **APIs my organization uses**. A list appears, containing the applications in your directory that expose APIs.
1. Type in the search box or scroll to find the proxy application that you published in [Step 1: Publish your proxy application](#step-1-publish-your-proxy-application), and then select the proxy application.
1. In the **What type of permissions does your application require?** heading, select the permission type. If your native application needs to access the proxy application API as the signed-in user, choose **Delegated permissions**. If your native application runs as a background service or daemon without a signed-in user, choose **Application permissions**.
1. In the **Select permissions** heading, select the desired permission, and select **Add permissions**. The **API permissions** page for your native application now shows the proxy application and permission API that you added.

## Step 4: Edit the Active Directory Authentication Library

Edit the native application code in the authentication context of the Active Directory Authentication Library (ADAL) to include the following text:

```
// Acquire Access Token from AAD for Proxy Application
AuthenticationContext authContext = new AuthenticationContext("https://login.microsoftonline.com/<Tenant ID>");
AuthenticationResult result = await authContext.AcquireTokenAsync("< External Url of Proxy App >",
        "<App ID of the Native app>",
        new Uri("<Redirect Uri of the Native App>"),
        PromptBehavior.Never);

//Use the Access Token to access the Proxy Application
HttpClient httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
HttpResponseMessage response = await httpClient.GetAsync("< Proxy App API Url >");
```

The required info in the sample code can be found in the Azure AD portal, as follows:

| Info required | How to find it in the Azure AD portal |
| --- | --- |
| \<Tenant ID> | **Azure Active Directory** > **Properties** > **Directory ID** |
| \<External Url of Proxy App> | **Enterprise applications** > *your proxy application* > **Application proxy** > **External Url** |
| \<App ID of the Native app> | **Enterprise applications** > *your native application* > **Properties** > **Application ID** |
| \<Redirect URI of the Native App> | **Azure Active Directory** > **App registrations** > *your native application* > **Redirect URIs** |
| \<Proxy App API Url> | **Azure Active Directory** > **App registrations** > *your native application* > **API permissions** > **API / PERMISSIONS NAME** |

After you edit the ADAL with these parameters, your users can authenticate to native client applications even when they're outside of the corporate network.

## Next steps

For more information about the native application flow, see [Native apps in Azure Active Directory](../develop/native-app.md).

Learn about setting up [Single sign-on to applications in Azure Active Directory](what-is-single-sign-on.md#choosing-a-single-sign-on-method).
