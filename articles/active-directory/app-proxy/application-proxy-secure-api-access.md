---
title: Access on-premises APIs with Microsoft Entra application proxy
description: Microsoft Entra application proxy lets native apps securely access APIs and business logic you host on-premises or on cloud VMs.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
ms.custom: has-adal-ref
---
# Secure access to on-premises APIs with Microsoft Entra application proxy

You may have business logic APIs running on-premises, or hosted on virtual machines in the cloud. Your native Android, iOS, Mac, or Windows apps need to interact with the API endpoints to use data or provide user interaction. Microsoft Entra application proxy and the [Microsoft Authentication Library (MSAL)](../develop/reference-v2-libraries.md) let your native apps securely access your on-premises APIs. Microsoft Entra application proxy is a faster and more secure solution than opening firewall ports and controlling authentication and authorization at the app layer.

This article walks you through setting up a Microsoft Entra application proxy solution for hosting a web API service that native apps can access.

## Overview

The following diagram shows a traditional way to publish on-premises APIs. This approach requires opening incoming ports 80 and 443.

![Traditional API access](./media/application-proxy-secure-api-access/overview-publish-api-open-ports.png)

The following diagram shows how you can use Microsoft Entra application proxy to securely publish APIs without opening any incoming ports:

![Microsoft Entra application proxy API access](./media/application-proxy-secure-api-access/overview-publish-api-app-proxy.png)

The Microsoft Entra application proxy forms the backbone of the solution, working as a public endpoint for API access, and providing authentication and authorization. You can access your APIs from a vast array of platforms by using the [Microsoft Authentication Library (MSAL)](../develop/reference-v2-libraries.md) libraries.

Since Microsoft Entra application proxy authentication and authorization are built on top of Microsoft Entra ID, you can use Microsoft Entra Conditional Access to ensure only trusted devices can access APIs published through Application Proxy. Use Microsoft Entra join or Microsoft Entra hybrid joined for desktops, and Intune Managed for devices. You can also take advantage of Microsoft Entra ID P1 or P2 features like Microsoft Entra multifactor authentication, and the machine learning-backed security of [Microsoft Entra ID Protection](../identity-protection/overview-identity-protection.md).

## Prerequisites

To follow this walkthrough, you need:

- Admin access to an Azure directory, with an account that can create and register apps
- The sample web API and native client apps from [https://github.com/jeevanbisht/API-NativeApp-ADAL-SampleApp](https://github.com/jeevanbisht/API-NativeApp-ADAL-SampleApp)

## Publish the API through Application Proxy

To publish an API outside of your intranet through Application Proxy, you follow the same pattern as for publishing web apps. For more information, see [Tutorial: Add an on-premises application for remote access through Application Proxy in Microsoft Entra ID](application-proxy-add-on-premises-application.md).

To publish the SecretAPI web API through Application Proxy:

1. Build and publish the sample SecretAPI project as an ASP.NET web app on your local computer or intranet. Make sure you can access the web app locally.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).

1. Browse to **Identity** > **Applications** > **Enterprise applications**.

1. At the top of the **Enterprise applications - All applications** page, select **New application**.

1. On the **Browse Microsoft Entra Gallery** page, locate section **On-premises applications** and select **Add an on-premises application**. The **Add your own on-premises application** page appears.

1. If you don't have an Application Proxy Connector installed, you'll be prompted to install it. Select **Download Application Proxy Connector** to download and install the connector.

1. Once you've installed the Application Proxy Connector, on the **Add your own on-premises application** page:

   1. Next to **Name**, enter *SecretAPI*.

   1. Next to **Internal Url**, enter the URL you use to access the API from within your intranet.

   1. Make sure **Pre-Authentication** is set to **Microsoft Entra ID**.

   1. Select **Add** at the top of the page, and wait for the app to be created.

   ![Add API app](./media/application-proxy-secure-api-access/3-add-api-app.png)

1. On the **Enterprise applications - All applications** page, select the **SecretAPI** app.

1. On the **SecretAPI - Overview** page, select **Properties** in the left navigation.

1. You don't want APIs to be available to end users in the **MyApps** panel, so set **Visible to users** to **No** at the bottom of the **Properties** page, and then select **Save**.

   ![Not visible to users](./media/application-proxy-secure-api-access/5-not-visible-to-users.png)

You've published your web API through Microsoft Entra application proxy. Now, add users who can access the app.

1. On the **SecretAPI - Overview** page, select **Users and groups** in the left navigation.

1. On the **Users and groups** page, select **Add user**.

1. On the **Add assignment** page, select **Users and groups**.

1. On the **Users and groups** page, search for and select users who can access the app, including at least yourself. After selecting all users, select **Select**.

   ![Select and assign user](./media/application-proxy-secure-api-access/7-select-admin-user.png)

1. Back on the **Add Assignment** page, select **Assign**.

> [!NOTE]
> APIs that use integrated Windows authentication might require [additional steps](./application-proxy-configure-single-sign-on-with-kcd.md).

## Register the native app and grant access to the API

Native apps are programs developed to use on a particular platform or device. Before your native app can connect and access an API, you must register it in Microsoft Entra ID. The following steps show how to register a native app and give it access to the web API you published through Application Proxy.

To register the AppProxyNativeAppSample native app:
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).

1. Browse to **Identity** > **Applications** > **Enterprise applications** > **App registrations**.

1. Select **New registration**.

1. On the **Register an application** page:

   1. Under **Name**, enter *AppProxyNativeAppSample*.

   1. Under **Supported account types**, select **Accounts in this organizational directory only (Contoso only - Single tenant)**.

   1. Under **Redirect URL**, drop down and select **Public client/native (mobile & desktop)**, and then enter *https://login.microsoftonline.com/common/oauth2/nativeclient    *.

   1. Select **Register**, and wait for the app to be successfully registered.

      ![New application registration](./media/application-proxy-secure-api-access/8-create-reg-ga.png)

You've now registered the AppProxyNativeAppSample app in Microsoft Entra ID. To give your native app access to the SecretAPI web API:

1. On the **App registrations** page, select the **AppProxyNativeAppSample** app.

1. On the **AppProxyNativeAppSample** page, select **API permissions** in the left navigation.

1. On the **API permissions** page, select **Add a permission**.

1. On the first **Request API permissions** page, select the **APIs my organization uses** tab, and then search for and select **SecretAPI**.

1. On the next **Request API permissions** page, select the check box next to **user_impersonation**, and then select **Add permissions**.

    ![Select an A P I.](./media/application-proxy-secure-api-access/10-secretapi-added.png)

1. Back on the **API permissions** page, you can select **Grant admin consent for Contoso** to prevent other users from having to individually consent to the app.

## Configure the native app code

The last step is to configure the native app. The code snippet that's used in the following steps is based on [Add the Microsoft Authentication Library to your code (.NET C# sample)](application-proxy-configure-native-client-application.md#step-4-add-the-microsoft-authentication-library-to-your-code-net-c-sample). The code is customized for this example. The code must be added to the *Form1.cs* file in the NativeClient sample app where it will cause the [MSAL library](../develop/reference-v2-libraries.md) to acquire the token for requesting the API call and attach it as bearer to the header in the request.

> [!NOTE]
> The sample app uses Azure Active Directory Authentication Library (ADAL). Read how to [add MSAL to your project](../develop/tutorial-v2-windows-desktop.md#add-msal-to-your-project). Remember to [add the reference to MSAL](../develop/tutorial-v2-windows-desktop.md#add-the-code-to-initialize-msal) to the class and remove the ADAL reference.

To configure the native app code:

1. In *Form1.cs*, add the namespace `using Microsoft.Identity.Client;` to the code.
1. Remove the namespace `using Microsoft.IdentityModel.Clients.ActiveDirectory;` from the code.
1. Remove lines 26 and 30 because they are no longer needed.
1. Replace the contents of the `GetTodoList()` method with the following code snippet:

   ```csharp
   // Acquire Access Token from Azure AD for Proxy Application
   var clientApp = PublicClientApplicationBuilder
       .Create(clientId)
       .WithDefaultRedirectUri() // Will automatically use the default URI for native app
       .WithAuthority(authority)
       .Build();
   var accounts = await clientApp.GetAccountsAsync();
   var account = accounts.FirstOrDefault();

   var scopes = new string[] { todoListResourceId + "/user_impersonation" };

   AuthenticationResult authResult;
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
       // Use the Access Token to access the Proxy Application
       var httpClient = new HttpClient();
       httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);
       // Call the To Do list service
       var response = await httpClient.GetAsync(todoListBaseAddress + "/api/values/4");
       var responseString = await response.Content.ReadAsStringAsync();
       MessageBox.Show(responseString);
   }
   ```

To configure the native app to connect to Microsoft Entra ID and call the API App Proxy, update the placeholder values in the *App.config* file of the NativeClient sample app with values from Microsoft Entra ID:

1. Paste the **Directory (tenant) ID** in the `<add key="ida:Tenant" value="" />` field. You can find and copy this value (a GUID) from the **Overview** page of either of your apps.

1. Paste the AppProxyNativeAppSample **Application (client) ID** in the `<add key="ida:ClientId" value="" />` field. You can find and copy this value (a GUID) from the AppProxyNativeAppSample's **Overview** page, in the left navigation under **Manage**.

1. *This step is optional as MSAL uses the method PublicClientApplicationBuilder.WithDefaultRedirectUri() to insert the recommended reply URI.* Paste the AppProxyNativeAppSample **Redirect URI** in the `<add key="ida:RedirectUri" value="" />` field. You can find and copy this value (a URI) from the AppProxyNativeAppSample's **Authentication** page, in the left navigation under **Manage**.

1. Paste the SecretAPI **Application ID URI** in the `<add key="todo:TodoListResourceId" value="" />` field. This is the same value as `todo:TodoListBaseAddress` below. You can find and copy this value (a URI) from the SecretAPI's **Expose an API** page, in the left navigation under **Manage**.

1. Paste the SecretAPI **Home Page URL** in the `<add key="todo:TodoListBaseAddress" value="" />` field. You can find and copy this value (a URL) from the SecretAPI **Branding & properties** page, in the left navigation under **Manage**.

> [!NOTE]
> If the solution doesn't build and reports the error *invalid Resx file*, in Solution Explorer, expand **Properties**, right-click *Resources.resx*, and then select **View Code**. Comment lines 121 to 123.

After you configure the parameters, build and run the native app. When you select the **Sign In** button, the app lets you sign in, and then displays a success screen to confirm that it successfully connected to the SecretAPI.

![Screenshot shows a message Secret A P I Successful and an OK button.](./media/application-proxy-secure-api-access/success.png)

## Next steps

- [Tutorial: Add an on-premises application for remote access through Application Proxy in Microsoft Entra ID](application-proxy-add-on-premises-application.md)
- [Quickstart: Configure a client application to access web APIs](../develop/quickstart-configure-app-access-web-apis.md)
- [How to enable native client applications to interact with proxy applications](application-proxy-configure-native-client-application.md)
