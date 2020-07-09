---
title: Protect an API by using OAuth 2.0 with AAD and API Management
titleSuffix: Azure API Management
description: Learn how to protect a web API backend with Azure Active Directory and API Management.
services: api-management
documentationcenter: ''
author: miaojiang
manager: dcscontentpm
editor: ''
ms.service: api-management
ms.workload: mobile
ms.topic: article
ms.date: 06/24/2020
ms.author: apimpm
---

# Protect an API by using OAuth 2.0 with Azure Active Directory and API Management

This guide shows you how to configure your Azure API Management instance to protect an API, by using the OAuth 2.0 protocol with Azure Active Directory (Azure AD). 

> [!NOTE]
> This feature is available in **Developer**, **Basic**, **Standard**, and **Premium** tiers of API Management.

## Prerequisites

To follow the steps in this article, you must have:

- An API Management instance
- An API being published that uses the API Management instance
- An Azure AD tenant

## Overview

The following is a quick overview of the steps:

1. Register an application (backend-app) in Azure AD to represent the API.
1. Register another application (client-app) in Azure AD to represent a client application that needs to call the API.
1. In Azure AD, grant permissions to allow the client-app to call the backend-app.
1. Configure the Developer Console to call the API using OAuth 2.0 user authorization.
1. Add the **validate-jwt** policy to validate the OAuth token for every incoming request.

## Register an application in Azure AD to represent the API

To protect an API with Azure AD, first register an application in Azure AD that represents the API. 

1. Go to the [Azure portal](https://portal.azure.com) to register your application. Search for and select **APP registrations**.

1. Select **New registration**. 

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *backend-app*. 
   - In the **Supported account types** section, select an option that suits your scenario. 

1. Leave the **Redirect URI** section empty.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Select **Expose an API** and set the **Application ID URI** with the default value. Record this value for later.

1. Select the **Add a scope** button to display the **Add a scope** page. Then create a new scope that's supported by the API (for example, `Files.Read`).

1. Select the **Add scope** button to create the scope. Repeat this step to add all scopes supported by your API.

1. When the scopes are created, make a note of them for use in a subsequent step. 

## Register another application in Azure AD to represent a client application

Every client application that calls the API needs to be registered as an application in Azure AD. In this example, the client application is the **Developer Console** in the API Management developer portal. 

To register another application in Azure AD to represent the Developer Console:

1. Go to the [Azure portal](https://portal.azure.com) to register your application.

1.  Search for and select **APP registrations**.

1. Select **New registration**.

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *client-app*. 
   - In the **Supported account types** section, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 

1. In the **Redirect URI** section, select `Web` and leave the URL field empty for now.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Create a client secret for this application to use in a subsequent step.

   1. From the list of pages for your client app, select **Certificates & secrets**, and select **New client secret**.

   1. Under **Add a client secret**, provide a **Description**. Choose when the key should expire, and select **Add**.

When the secret is created, note the key value for use in a subsequent step. 

## Grant permissions in Azure AD

Now that you have registered two applications to represent the API and the Developer Console, grant permissions to allow the client-app to call the backend-app.  

1. Go to the [Azure portal](https://portal.azure.com) to grant permissions to your client application. Search for and select **APP registrations**.

1. Choose your client app. Then in the list of pages for the app, select **API permissions**.

1. Select **Add a Permission**.

1. Under **Select an API**, select **My APIs**, and then find and select your backend-app.

1. Under **Delegated Permissions**, select the appropriate permissions to your backend-app, then select **Add permissions**.

1. Optionally, on the **API permissions** page, select **Grant admin consent for \<your-tenant-name>** to grant consent on behalf of all users in this directory. 

## Enable OAuth 2.0 user authorization in the Developer Console

At this point, you have created your applications in Azure AD, and have granted proper permissions to allow the client-app to call the backend-app. 

In this example, the Developer Console is the client-app. The following steps describe how to enable OAuth 2.0 user authorization in the Developer Console. 

1. In Azure portal, browse to your API Management instance.

1. Select **OAuth 2.0** > **Add**.

1. Provide a **Display name** and **Description**.

1. For the **Client registration page URL**, enter a placeholder value, such as `http://localhost`. The **Client registration page URL** points to a page that users can use to create and configure their own accounts for OAuth 2.0 providers that support this. In this example, users do not create and configure their own accounts, so you use a placeholder instead.

1. For **Authorization grant types**, select **Authorization code**.

1. Specify the **Authorization endpoint URL** and **Token endpoint URL**. Retrieve these values from the **Endpoints** page in your Azure AD tenant. Browse to the **App registrations** page again, and select **Endpoints**.


1. Copy the **OAuth 2.0 Authorization Endpoint**, and paste it into the **Authorization endpoint URL** text box. Select **POST** under Authorization request method.

1. Copy the **OAuth 2.0 Token Endpoint**, and paste it into the **Token endpoint URL** text box. 

   >[!IMPORTANT]
   > Use either **v1** or **v2** endpoints. However, depending on which version you choose, the below step will be different. We recommend using v2 endpoints. 

1. If you use **v1** endpoints, add a body parameter named **resource**. For the value of this parameter, use **Application ID** of the back-end app. 

1. If you use **v2** endpoints, use the scope you created for the backend-app in the **Default scope** field. Also, make sure to set the value for the [`accessTokenAcceptedVersion`](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest#accesstokenacceptedversion-attribute) property to `2` in your [application manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest).

1. Next, specify the client credentials. These are the credentials for the client-app.

1. For **Client ID**, use the **Application ID** of the client-app.

1. For **Client secret**, use the key you created for the client-app earlier. 

1. Immediately following the client secret is the **redirect_url** for the authorization code grant type. Make a note of this URL.

1. Select **Create**.

1. Go back to your client-app registration in Azure Active Directory and select **Authentication**.

1. Under **Platform configurations** click on **Add a platform**, and select the type as **Web**, paste the **redirect_url** under **Redirect URI**, and then click on **Configure** button to save.

Now that you have configured an OAuth 2.0 authorization server, the Developer Console can obtain access tokens from Azure AD. 

The next step is to enable OAuth 2.0 user authorization for your API. This enables the Developer Console to know that it needs to obtain an access token on behalf of the user, before making calls to your API.

1. Browse to your API Management instance, and go to **APIs**.

1. Select the API you want to protect. For example, `Echo API`.

1. Go to **Settings**.

1. Under **Security**, choose **OAuth 2.0**, and select the OAuth 2.0 server you configured earlier. 

1. Select **Save**.

## Successfully call the API from the developer portal

> [!NOTE]
> This section does not apply to the **Consumption** tier, which does not support the developer portal.

Now that the OAuth 2.0 user authorization is enabled on your API, the Developer Console will obtain an access token on behalf of the user, before calling the API.

1. Browse to any operation under the API in the developer portal, and select **Try it**. This brings you to the Developer Console.

1. Note a new item in the **Authorization** section, corresponding to the authorization server you just added.

1. Select **Authorization code** from the authorization drop-down list, and you are prompted to sign in to the Azure AD tenant. If you are already signed in with the account, you might not be prompted.

1. After successful sign-in, an `Authorization` header is added to the request, with an access token from Azure AD. The following is a sample token (Base64 encoded):

   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCIsImtpZCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCJ9.eyJhdWQiOiIxYzg2ZWVmNC1jMjZkLTRiNGUtODEzNy0wYjBiZTEyM2NhMGMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgvIiwiaWF0IjoxNTIxMTUyNjMzLCJuYmYiOjE1MjExNTI2MzMsImV4cCI6MTUyMTE1NjUzMywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhHQUFBQUptVzkzTFd6dVArcGF4ZzJPeGE1cGp2V1NXV1ZSVnd1ZXZ5QU5yMlNkc0tkQmFWNnNjcHZsbUpmT1dDOThscUJJMDhXdlB6cDdlenpJdzJLai9MdWdXWWdydHhkM1lmaDlYSGpXeFVaWk9JPSIsImFtciI6WyJyc2EiXSwiYXBwaWQiOiJhYTY5ODM1OC0yMWEzLTRhYTQtYjI3OC1mMzI2NTMzMDUzZTkiLCJhcHBpZGFjciI6IjEiLCJlbWFpbCI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiSmlhbmciLCJnaXZlbl9uYW1lIjoiTWlhbyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpcGFkZHIiOiIxMzEuMTA3LjE3NC4xNDAiLCJuYW1lIjoiTWlhbyBKaWFuZyIsIm9pZCI6IjhiMTU4ZDEwLWVmZGItNDUxMS1iOTQzLTczOWZkYjMxNzAyZSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IkFGaWtvWFk1TEV1LTNkbk1pa3Z3MUJzQUx4SGIybV9IaVJjaHVfSEM1aGciLCJ0aWQiOiI0NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgiLCJ1bmlxdWVfbmFtZSI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImFQaTJxOVZ6ODBXdHNsYjRBMzBCQUEiLCJ2ZXIiOiIxLjAifQ.agGfaegYRnGj6DM_-N_eYulnQdXHhrsus45QDuApirETDR2P2aMRxRioOCR2YVwn8pmpQ1LoAhddcYMWisrw_qhaQr0AYsDPWRtJ6x0hDk5teUgbix3gazb7F-TVcC1gXpc9y7j77Ujxcq9z0r5lF65Y9bpNSefn9Te6GZYG7BgKEixqC4W6LqjtcjuOuW-ouy6LSSox71Fj4Ni3zkGfxX1T_jiOvQTd6BBltSrShDm0bTMefoyX8oqfMEA2ziKjwvBFrOjO0uK4rJLgLYH4qvkR0bdF9etdstqKMo5gecarWHNzWi_tghQu9aE3Z3EZdYNI_ZGM-Bbe3pkCfvEOyA
   ```

1. Select **Send** to call the API successfully.

## Configure a JWT validation policy to pre-authorize requests

At this point, when a user tries to make a call from the Developer Console, the user is prompted to sign in. The Developer Console obtains an access token on behalf of the user, and includes the token in the request made to the API.

However, what if someone calls your API without a token or with an invalid token? For example, try to call the API without the `Authorization` header, the call will still go through. The reason is that API Management does not validate the access token at this point. It simply passes the `Authorization` header to the back-end API.

Use the [Validate JWT](https://docs.microsoft.com/azure/api-management/api-management-access-restriction-policies#ValidateJWT) policy to pre-authorize requests in API Management, by validating the access tokens of each incoming request. If a request does not have a valid token, API Management blocks it. For example, add the following policy to the `<inbound>` policy section of the `Echo API`. It checks the audience claim in an access token, and returns an error message if the token is not valid. For information on how to configure policies, see [Set or edit policies](https://docs.microsoft.com/azure/api-management/set-edit-policies).


```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/{aad-tenant}/.well-known/openid-configuration" />
    <required-claims>
        <claim name="aud">
            <value>{Application ID of backend-app}</value>
        </claim>
    </required-claims>
</validate-jwt>
```

> [!NOTE]
> This `openid-config` URL corresponds to the v1 endpoint. For the v2 `openid-config`endpoint, use the following URL:
>
> `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`.

## Build an application to call the API

In this guide, you used the Developer Console in API Management as the sample client application to call the `Echo API` protected by OAuth 2.0. To learn more about how to build an application and implement OAuth 2.0, see [Azure Active Directory code samples](../active-directory/develop/sample-v2-code.md).

## Next steps

- Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/authentication-scenarios.md).
- Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
- For other ways to secure your back-end service, see [Mutual Certificate authentication](./api-management-howto-mutual-certificates.md).
- [Create an API Management service instance](./get-started-create-service-instance.md).
- [Manage your first API](./import-and-publish.md).
