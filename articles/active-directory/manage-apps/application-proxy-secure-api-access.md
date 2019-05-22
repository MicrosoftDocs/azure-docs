---
title: Secure API access beyond the intranet with Azure AD Application Proxy
description: Azure Active Directory's Application Proxy lets web apps securely access APIs and business logic you host on-premises or on cloud VMs. 
services: active-directory
author: v-thepet
manager: mtillman
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: celested
ms.reviewer: japere
---
# Azure AD Application Proxy: Secure APIs walkthrough

You may host your business logic and APIs on-premises, or on virtual machines in the cloud. Your native Android, iOS, Mac, and Windows apps may need to interact with these API endpoints to use data or provide user interaction. You can use Azure AD Application Proxy and the [Azure Active Directory Authentication Libraries (ADAL)](/azure/active-directory/develop/active-directory-authentication-libraries) to let your native apps securely access your on-premises APIs. Azure Active Directory Application Proxy is a faster and more secure solution than opening firewall ports and controlling authentication and authorization at the app layer. 

This article walks through an overview of the Azure AD Application Proxy solution for letting a registered native app access an API web service you host on-premises. 

## Overview

The following diagram shows a traditional way to publish on-premises APIs. This approach requires opening incoming ports 80 and 443.

![Traditional API access](./media/application-proxy-secure-api-access/image1.png)

The following diagram shows how you can use Azure AD Application Proxy to securely publish APIs without opening any incoming ports:

![Azure AD Application Proxy API access](./media/application-proxy-secure-api-access/image2.png)

The Azure AD Application Proxy forms the backbone of the solution, working as a public endpoint for API access, and providing authentication and authorization. You can access your APIs from a vast array of platforms by using the [ADAL](/azure/active-directory/develop/active-directory-authentication-libraries) libraries. 

Since Azure AD Application Proxy authentication and authorization are built on top of Azure AD, you can also use Azure AD conditional access to ensure only trusted devices access your APIs. Use Azure AD Join or Azure AD Hybrid Joined for desktops, and Intune Managed for devices. You can also take advantage of Azure Active Directory Premium features like Azure Multi-Factor Authentication, and the machine learning-backed security of [Azure Identity Protection](/azure/active-directory/active-directory-identityprotection).

## Prerequisites

To follow this walkthrough, you need:

- Admin access to an Azure directory, with an account that can create and register apps
- The sample web API and native client apps from [https://github.com/jeevanbisht/API-NativeApp-ADAL-SampleApp](https://github.com/jeevanbisht/API-NativeApp-ADAL-SampleApp) 

## Publish the API through Application Proxy

To publish an API outside of your intranet through Application Proxy, you follow the same pattern as for publishing web apps. For more information, see [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure Active Directory](application-proxy-add-on-premises-application.md).

To publish the SecretAPI web API through Application Proxy:

1. In the Azure portal, select **Azure Active Directory** in the left navigation. Then, on the **Overview** page, select **Enterprise applications**.
   
   ![Enterprise apps](./media/application-proxy-secure-api-access/1-enterprise-apps.png)
   
1. At the top of the **Enterprise applications - All applications** page, select **New application**.
   
1. On the **Add an application** page, under **Add your own app**, select **On-premises application**. 
   
   ![Add on-premises app](./media/application-proxy-secure-api-access/2-add-on-prem-app.png)
   
1. If you don't have an Application Proxy Connector installed, you'll be prompted to install it. Select **Download Application Proxy Connector** to download and install the connector. 
   
   ![Install Application Proxy Connector](./media/application-proxy-secure-api-access/2-2-install-app-proxy.png)
   
1. Once you've installed the Application Proxy Connector, on the **Add your own on-premises application** page:
   
   1. Enter *SecretAPI* next to **Name**.
      
   1. Enter the URL you use to access the API from within your intranet next to **Internal Url**. 
      
   1. Make sure **Pre-Authentication** is set to **Azure Active Directory**. 
      
   1. Select **Add** at the top of the page.
   
   ![Add API app](./media/application-proxy-secure-api-access/3-add-api-app.png)
   
1. On the **Enterprise applications - All applications** page, select the new **SecretAPI** app. 
   
1. On the **SecretAPI - Overview** page, select **Properties** in the left navigation.
   
1. You don't want APIs to be available to end users in the **MyApps** panel, so set **Visible to users** to **No** at the bottom of the **Properties** page, and then select **Save**.
   
   ![Not visible to users](./media/application-proxy-secure-api-access/5-not-visible-to-users.png)
   
You've published your web API through Azure AD Application Proxy. Now, add add users who can access the app. 

1. On the **SecretAPI - Overview** page, select **Users and groups** in the left navigation.
   
1. On the **Users and groups** page, select **Add user**.  
   
1. On the **Add assignment** page, select **Users and groups**. 
   
1. On the **Users and groups** page, search for and select listed users who can access the app, including at least yourself. For each user, select **Select**. 
   
   ![Select and assign user](./media/application-proxy-secure-api-access/7-select-admin-user.png)
   
1. Back on the **Add Assignment** page, select **Assign**. 

> [!NOTE]
> APIs that use Integrated Windows Authentication might require [additional steps](/azure/active-directory/manage-apps/application-proxy-configure-single-sign-on-with-kcd).

## Register the native app and grant access to the API

Native apps are programs developed to use on a particular platform or device. Before your native app can connect and access an API, you must register it in Azure AD. The following steps show how to register a native app, and give it access to the web API you published through Application Proxy.

To register the AppProxyNativeAppSample native app:

1. On the Azure Active Directory **Overview** page, select **App registrations**, and at the top of the **App registrations** pane, select **New registration**.
   
1. On the **Register an application** page:
   
   1. Under **Name**, enter *AppProxyNativeAppSample*. 
      
   1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**. 
      
   1. Under **Redirect URL**, drop down and select **Public client (mobile & desktop)**, and then enter *https:\//appproxynativeapp*. 
      
   1. Select **Register**. 
      
      ![New application registration](./media/application-proxy-secure-api-access/8-create-reg-ga.png)
   
You've now registered the AppProxyNativeAppSample app in Azure Active Directory. To give your native app access to the SecretAPI web API:

1. On the Azure Active Directory **Overview** > **App Registrations** page, select the **AppProxyNativeAppSample** app. 
   
1. On the **AppProxyNativeAppSample** page, select **API permissions** in the left navigation. 
   
1. On the **API permissions** page, select **Add a permission**.
   
1. On the first **Request API permissions** page, select the **MyAPIs** tab, and then select **SecretAPI**. 
   
1. On the next **Request API permissions** page, select the check box next to **user_impersonation**, and then select **Add permissions**. 
   
    ![Select an API](./media/application-proxy-secure-api-access/10-secretapi-added.png)
   
1. Back on the **API permissions** page, you can select **Grant admin consent for Contoso** to prevent other users from having to individually consent to the app. 

## Configure the native app code

The last step is to configure the native app. The following snippet from the *Form1.cs* file in the NativeClient sample app causes the ADAL library to acquire the token for requesting the API call, and attach it as bearer to the app header. 
   
   ```csharp
       AuthenticationResult result = null;
       HttpClient httpClient = new HttpClient();
       authContext = new AuthenticationContext(authority);
       result = await authContext.AcquireTokenAsync(todoListResourceId, clientId, redirectUri, new PlatformParameters(PromptBehavior.Auto));
       
       // Append the token as bearer in the request header.
       httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
       
       // Call the API.
       HttpResponseMessage response = await httpClient.GetAsync(todoListBaseAddress + "/api/values/4");
   
       // MessageBox.Show(response.RequestMessage.ToString());
       string s = await response.Content.ReadAsStringAsync();
       MessageBox.Show(s);
   ```
   
To configure the native app to connect to Azure Active Directory and call the API App Proxy:

1. Update the placeholder values in the *App.config* file of the NativeClient sample app: 
   
   - Paste the **Directory (tenant) ID** in the `<add key="ida:Tenant" value="" />` field. You can find and copy this value (a GUID) from the **Overview** page of either of your apps. 
     
   - Paste the AppProxyNativeAppSample **Application (client) ID** in the `<add key="ida:ClientId" value="" />` field. You can find and copy this value (a GUID) from the AppProxyNativeAppSample **Overview** page.
     
   - Paste the AppProxyNativeAppSample **Redirect URI** in the `<add key="ida:RedirectUri" value="" />` field. You can find and copy this value (a URI) from the AppProxyNativeAppSample **Authentication** page. 
     
   - Paste the SecretAPI **Redirect URI** in the `<add key="todo:TodoListResourceId" value="" />` field. You can find and copy this value (a URI) from the SecretAPI **Authentication** page.
     
   - Paste the SecretAPI **Home Page URL** in the `<add key="todo:TodoListBaseAddress" value="" />` field. You can find and copy this value (a URL) from the SecretAPI **Branding** page.
   
1. After you configure the parameters, build and run the native app, and confirm that it can successfully access the API by returning a success message.

## Next steps

- [Remote access to on-premises applications through Azure Active Directory's Application Proxy](application-proxy.md)
- [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure Active Directory](application-proxy-add-on-premises-application.md)
- [Quickstart: Configure a client application to access web APIs](../develop/quickstart-configure-app-access-web-apis.md)
- [How to enable native client applications to interact with proxy applications](application-proxy-configure-native-client-application.md)
- [Native apps](../develop/native-app.md)
- [Training guide: App registrations in the Azure portal](../develop/app-registrations-training-guide.md)
