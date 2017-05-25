---
title: Configure authentication and authorization for a custom application that calls Azure Time Series Insights API | Microsoft Docs
description: This tutorial explains how to configure authentication and authorization for a custom application that calls Azure Time Series Insights API
keywords:
services: time-series-insights
documentationcenter:
author: dmdenmsft
manager: almineev
editor: cgronlun

ms.assetid:
ms.service: time-series-insights
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/24/2017
ms.author: dmden
---
# Authentication and authorization for Azure Time Series Insights API

This page explains how to configure a custom application that calls data plane Time Series Insights API.

## Using service principal

This section explains how to configure an application to access Time Series Insights API on behalf of the application. Application can then query data or publish reference data in Time Series Insights environment with application credentials and not the user credentials.

When you have an application that needs to access Time Series Insights, you must set up an Azure Active Directory (AD) application and assign the data access policies in Time Series Insights environment. This approach is preferable to running the app under your own credentials because:

* You can assign permissions to the app identity that are different than your own permissions. Typically, these permissions are restricted to exactly what the app needs to do. For example, the application can only be allowed to read data in a particular Time Series Insights environment.
* You do not have to change the app's credentials if your responsibilities change.
* You can use a certificate or application key to automate authentication when executing an unattended script.

This topic shows you how to perform those steps through the portal. It focuses on a single-tenant application where the application is intended to run within only one organization. You typically use single-tenant applications for line-of-business applications that run within your organization.

Set up flow consists of three high-level steps:

1. Create an application in Azure Active Directory.
2. Authorize this application to access Time Series Insights environment.
3. Use application ID and key to acquire token to `"https://api.timeseries.azure.com/"` audience or resource. The token can then be used to call Time Series Insights API.

Detailed steps:

1. In Azure portal, select your Azure Active Directory, App registrations, and New application registration.

   ![New application registration in Azure Active Directory](media/authentication-and-authorization/active-directory-new-application-registration.png)  

2. Give the application name, select type to be "Web app / API", any valid URI for Sign-on URL, and click Create button.

   ![Create application in Azure Active Directory](media/authentication-and-authorization/active-directory-create-web-api-application.png)

3. Select your newly created application and copy its Application ID to your favorite text editor.

   ![Copy application ID](media/authentication-and-authorization/active-directory-copy-application-id.png)

4. Select Keys section, enter key name, select expiration, and click Save button.

   ![Select application Keys section](media/authentication-and-authorization/active-directory-application-keys.png)

   ![Enter key name and expiration and click Save](media/authentication-and-authorization/active-directory-application-keys-save.png)

5. Copy the key to your favorite text editor.

   ![Copy application key](media/authentication-and-authorization/active-directory-copy-application-key.png)

6. Select your Time Series Insights environment, Data Access Policies section, and click Add button.

   ![Add new data access policy to Time Series Insights environment](media/authentication-and-authorization/time-series-insights-data-access-policies-add.png)

7. In the Select User dialog, paste the application name (from Step 2) or application ID (from Step 3).

   ![Find an application in Select User dialog](media/authentication-and-authorization/time-series-insights-data-access-policies-select-user.png)

8. Select role (Reader for querying data, Contributor for querying data and changing Reference Data) and click Ok button.

   ![Pick Reader or Contributor in Select Role dialog](media/authentication-and-authorization/time-series-insights-data-access-policies-select-role.png)

9. Save the policy by clicking Ok button.

10. Use the application ID (from Step 3) and application key (from Step 5) to acquire the token on behalf of the application. The token can then be passed in `Authorization` header when making calls to Time Series Insights API.

    If using C#, you can use the following code to acquire the token on behalf of the application. For complete sample, see [Query data using C#](time-series-insights-query-data-csharp.md).

    ```csharp
    var authenticationContext = new AuthenticationContext(
        "https://login.windows.net/common",
        TokenCache.DefaultShared);

    AuthenticationResult token = await authenticationContext.AcquireTokenAsync(
        // Set Resource URI to Azure Time Series Insights API
        resource: "https://api.timeseries.azure.com/", 
        clientCredential: new ClientCredential(
            // Application ID of application registered in your Azure Active Directory
            clientId: "1bc3af48-7e2f-4845-880a-c7649a6470b8", 
            // Application key of the application registered in your Azure Active Directory
            clientSecret: "aBcdEffs4XYxoAXzLB1n3R2meNCYdGpIGBc2YC5D6L2="));

    string accessToken = token.AccessToken;
    ```

## Next steps

* Use application ID and key in your application. See [Query data using C#](time-series-insights-query-data-csharp.md) for sample  code that calls Time Series Insights API.

## See also

* [Query API](/rest/api/time-series-insights/time-series-insights-reference-queryapi) for the full Query API reference
* [How to create service principal in Azure portal](/azure/azure-resource-manager/resource-group-create-service-principal-portal)
