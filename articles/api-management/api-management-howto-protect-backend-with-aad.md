---
title: Protect an API by using OAuth 2.0 with Azure Active Directory and API Management | Microsoft Docs
description: Learn how to protect a web API backend with Azure Active Directory and API Management.
services: api-management
documentationcenter: ''
author: miaojiang
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2018
ms.author: apimpm
---

# Protect an API by using OAuth 2.0 with Azure Active Directory and API Management

This guide shows you how to configure your Azure API Management instance to protect an API, by using the OAuth 2.0 protocol with Azure Active Directory (Azure AD). 

## Prerequisites
To follow the steps in this article, you must have:
* An API Management instance
* An API being published that uses the API Management instance
* An Azure AD tenant

## Overview

Here is a quick overview of the steps:

1. Register an application (backend-app) in Azure AD to represent the API.
2. Register another application (client-app) in Azure AD to represent a client application that needs to call the API.
3. In Azure AD, grant permissions to allow the client-app to call the backend-app.
4. Configure the Developer Console to use OAuth 2.0 user authorization.
5. Add the **validate-jwt** policy to validate the OAuth token for every incoming request.

## Register an application in Azure AD to represent the API

To protect an API with Azure AD, the first step is to register an application in Azure AD that represents the API. 

1. Browse to your Azure AD tenant, and then browse to **App registrations**.

2. Select **New application registration**. 

3. Provide a name of the application. (For this example, the name is `backend-app`.)  

4. Choose **Web app / API** as the **Application type**. 

5. For **Sign-on URL**, you can use `https://localhost` as a placeholder.

6. Select **Create**.

When the application is created, make a note of the **Application ID**, for use in a subsequent step. 

## Register another application in Azure AD to represent a client application

Every client application that calls the API needs to be registered as an application in Azure AD as well. For this example, the sample client application is the Developer Console in the API Management developer portal. Here's how to register another application in Azure AD to represent the Developer Console.

1. Select **New application registration**. 

2. Provide a name of the application. (For this example, the name is `client-app`.)

3. Choose **Web app / API** as the **Application type**.  

4. For **Sign-on URL**, you can use `https://localhost` as a placeholder, or use the sign-in URL of your API Management instance. (For this example, the URL is `https://contoso5.portal.azure-api.net/signin`.)

5. Select **Create**.

When the application is created, make a note of the **Application ID**, for use in a subsequent step. 

Now, create a client secret for this application, for use in a subsequent step.

1. Select **Settings** again, and go to **Keys**.

2. Under **Passwords**, provide a **Key description**. Choose when the key should expire, and select **Save**.

Make a note of the key value. 

## Grant permissions in Azure AD

Now that you have registered two applications to represent the API and the Developer Console, you need to grant permissions to allow the client-app to call the backend-app.  

1. Browse to **Application registrations**. 

2. Select `client-app`, and go to **Settings**.

3. Select **Required permissions** > **Add**.

4. Select **Select an API**, and search for `backend-app`.

5. Under **Delegated Permissions**, select `Access backend-app`. 

6. Select **Select**, and then select **Done**. 

> [!NOTE]
> If **Azure Active Directory** is not listed under permissions to other applications, select **Add** to add it from the list.
> 
> 

## Enable OAuth 2.0 user authorization in the Developer Console

At this point, you have created your applications in Azure AD, and have granted proper permissions to allow the client-app to call the backend-app. 

In this example, the Developer Console is the client-app. The following steps describe how to enable OAuth 2.0 user authorization in the Developer Console. 

1. Browse to your API Management instance.

2. Select **OAuth 2.0** > **Add**.

3. Provide a **Display name** and **Description**.

4. For the **Client registration page URL**, enter a placeholder value, such as `http://localhost`. The **Client registration page URL** points to the page that users can use to create and configure their own accounts for OAuth 2.0 providers that support this. In this example, users do not create and configure their own accounts, so you use a placeholder instead.

5. For **Authorization grant types**, select **Authorization code**.

6. Specify the **Authorization endpoint URL** and **Token endpoint URL**. Retrieve these values from the **Endpoints** page in your Azure AD tenant. Browse to the **App registrations** page again, and select **Endpoints**.

7. Copy the **OAuth 2.0 Authorization Endpoint**, and paste it into the **Authorization endpoint URL** text box.

8. Copy the **OAuth 2.0 Token Endpoint**, and paste it into the **Token endpoint URL** text box. In addition to pasting in the token endpoint, add a body parameter named **resource**. For the value of this parameter, use the **Application ID** for the back-end app.

9. Next, specify the client credentials. These are the credentials for the client-app.

10. For **Client ID**, use the **Application ID** for the client-app.

11. For **Client secret**, use the key you created for the client-app earlier. 

12. Immediately following the client secret is the **redirect_url** for the authorization code grant type. Make a note of this URL.

13. Select **Create**.

14. Go back to the **Settings** page of your client-app.

15. Select **Reply URLs**, and paste the **redirect_url** in the first row. In this example, you replaced `https://localhost` with the URL in the first row.  

Now that you have configured an OAuth 2.0 authorization server, the Developer Console can obtain access tokens from Azure AD. 

The next step is to enable OAuth 2.0 user authorization for your API. This enables the Developer Console to know that it needs to obtain an access token on behalf of the user, before making calls to your API.

1. Browse to your API Management instance, and go to **APIs**.

2. Select the API you want to protect. In this example, you use the `Echo API`.

3. Go to **Settings**.

4. Under **Security**, choose **OAuth 2.0**, and select the OAuth 2.0 server you configured earlier. 

5. Select **Save**.

## Successfully call the API from the developer portal

Now that the OAuth 2.0 user authorization is enabled on the `Echo API`, the Developer Console obtains an access token on behalf of the user, before calling the API.

1. Browse to any operation under the `Echo API` in the developer portal, and select **Try it**. This brings you to the Developer Console.

2. Note a new item in the **Authorization** section, corresponding to the authorization server you just added.

3. Select **Authorization code** from the authorization drop-down list, and you are prompted to sign in to the Azure AD tenant. If you are already signed in with the account, you might not be prompted.

4. After successful sign-in, an `Authorization` header is added to the request, with an access token from Azure AD. The following is a sample token (Base64 encoded):

   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCIsImtpZCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCJ9.eyJhdWQiOiIxYzg2ZWVmNC1jMjZkLTRiNGUtODEzNy0wYjBiZTEyM2NhMGMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgvIiwiaWF0IjoxNTIxMTUyNjMzLCJuYmYiOjE1MjExNTI2MzMsImV4cCI6MTUyMTE1NjUzMywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhHQUFBQUptVzkzTFd6dVArcGF4ZzJPeGE1cGp2V1NXV1ZSVnd1ZXZ5QU5yMlNkc0tkQmFWNnNjcHZsbUpmT1dDOThscUJJMDhXdlB6cDdlenpJdzJLai9MdWdXWWdydHhkM1lmaDlYSGpXeFVaWk9JPSIsImFtciI6WyJyc2EiXSwiYXBwaWQiOiJhYTY5ODM1OC0yMWEzLTRhYTQtYjI3OC1mMzI2NTMzMDUzZTkiLCJhcHBpZGFjciI6IjEiLCJlbWFpbCI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiSmlhbmciLCJnaXZlbl9uYW1lIjoiTWlhbyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpcGFkZHIiOiIxMzEuMTA3LjE3NC4xNDAiLCJuYW1lIjoiTWlhbyBKaWFuZyIsIm9pZCI6IjhiMTU4ZDEwLWVmZGItNDUxMS1iOTQzLTczOWZkYjMxNzAyZSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IkFGaWtvWFk1TEV1LTNkbk1pa3Z3MUJzQUx4SGIybV9IaVJjaHVfSEM1aGciLCJ0aWQiOiI0NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgiLCJ1bmlxdWVfbmFtZSI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImFQaTJxOVZ6ODBXdHNsYjRBMzBCQUEiLCJ2ZXIiOiIxLjAifQ.agGfaegYRnGj6DM_-N_eYulnQdXHhrsus45QDuApirETDR2P2aMRxRioOCR2YVwn8pmpQ1LoAhddcYMWisrw_qhaQr0AYsDPWRtJ6x0hDk5teUgbix3gazb7F-TVcC1gXpc9y7j77Ujxcq9z0r5lF65Y9bpNSefn9Te6GZYG7BgKEixqC4W6LqjtcjuOuW-ouy6LSSox71Fj4Ni3zkGfxX1T_jiOvQTd6BBltSrShDm0bTMefoyX8oqfMEA2ziKjwvBFrOjO0uK4rJLgLYH4qvkR0bdF9etdstqKMo5gecarWHNzWi_tghQu9aE3Z3EZdYNI_ZGM-Bbe3pkCfvEOyA
   ```

5. Select **Send**, and you can call the API successfully.


## Configure a JWT validation policy to pre-authorize requests

At this point, when a user tries to make a call from the Developer Console, the user is prompted to sign in. The Developer Console obtains an access token on behalf of the user.

But what if someone calls your API without a token or with an invalid token? For example, you can still call the API even if you delete the `Authorization` header. The reason is that API Management does not validate the access token at this point. It simply passes the `Authorization` header to the back-end API.

You can use the [Validate JWT](api-management-access-restriction-policies.md#ValidateJWT) policy to pre-authorize requests in API Management, by validating the access tokens of each incoming request. If a request does not have a valid token, API Management blocks it. For example, you can add the following policy to the `<inbound>` policy section of the `Echo API`. It checks the audience claim in an access token, and returns an error message if the token is not valid. For information on how to configure policies, see [Set or edit policies](set-edit-policies.md).

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

## Build an application to call the API

In this guide, you used the Developer Console in API Management as the sample client application to call the `Echo API` protected by OAuth 2.0. To learn more about how to build an application and implement OAuth 2.0, see [Azure Active Directory code samples](../active-directory/develop/sample-v1-code.md).

## Next steps
* Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/authentication-scenarios.md).
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your back-end service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).

* [Create an API Management service instance](get-started-create-service-instance.md).

* [Manage your first API](import-and-publish.md).
