---
title: Protect an API using OAuth 2.0 with Azure Active Directory and API Management | Microsoft Docs
description: Learn how to protect a Web API backend with Azure Active Directory and API Management.
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

# How to protect an API using OAuth 2.0 with Azure Active Directory and API Management

This guide shows you how to configure your API Management (APIM) instance to protect an API using the OAuth 2.0 protocol with Azure Active Directory (AAD). 

## Prerequisite
To follow the steps in this article, you must have:
* An APIM instance
* An API being published using the APIM instance
* An Azure AD tenant

## Overview

This guide shows you how to protect an API with OAuth 2.0 in APIM. In this article, Azure AD as the Authorization Server (OAuth Server) is used. Below is a quick overview of the steps:

1. Register an application (backend-app) in Azure AD to represent the API
2. Register another application (client-app) in Azure AD to represent a client application that needs to call the API
3. In Azure AD, grant permissions to allow client-app to call backend-app
4. Configure the Developer Console to use OAuth 2.0 user authorization
5. Add validate-jwt policy to validate the OAuth token for every incoming request

## Register an application in Azure AD to represent the API

To protect an API with Azure AD, the first step is to register an application in Azure AD that represents the API. 

Navigate to your Azure AD tenant, then navigate to **App registrations**.

Select **New application registration**. 

Provide a name of the application. In this example, `backend-app` is used.  

Choose **Web app / API** as the **Application type**. 

For **Sign-on URL**, you can use `https://localhost` as a placeholder.

Click on **Create**.

Once the application is created, make a note of the **Application ID** for use in a subsequent step. 

## Register another application in Azure AD to represent a client application

Every client application that needs to call the API needs to be registered as an application in Azure AD as well. In this guide, we will use the Developer Console in the APIM Developer Portal as the sample client application. 

We need to register another application in Azure AD to represent the Developer Console.

Click on **New application registration** again. 

Provide a name of the application and choose **Web app / API** as the **Application type**. In this example, `client-app` is used.  

For **Sign-on URL**, you can use `https://localhost` as a placeholder or use the sign-in URL of your APIM instance. In this example, `https://contoso5.portal.azure-api.net/signin` is used.

Click on **Create**.

Once the application is created, make a note of the **Application ID** for use in a subsequent step. 

Now we need to create a client secret for this application for use in a subsequent step.

Click on **Settings** again and go to **Keys**.

Under **Passwords**, provide a **Key description**, choose when the key should expire, and click on **Save**.

Make a note of the key value. 

## Grant permissions in AAD

Now we have registered two applications to represent the API (that is, backend-app) and the Developer Console (that is, client-app), we need to grant permissions to allow the client-app to call the backend-app.  

Navigate to **Application registrations** again. 

Click on `client-app` and go to **Settings**.

Click on **Required permissions** and then **Add**.

Click on **Select an API** and search for `backend-app`.

Check `Access backend-app` under **Delegated Permissions**. 

Click on **Select** and then **Done**. 

> [!NOTE]
> If **Windows** **Azure Active Directory** is not listed under permissions to other applications, click **Add** and add it from the list.
> 
> 

## Enable OAuth 2.0 User Authorization in the Developer Console

At this point, we have created our applications in Azure AD and have granted proper permissions to allow the client-app to call the backend-app. 

In this guide, we will use the Developer Console as the client-app. Below steps describe how to enable OAuth 2.0 User Authorization in the Developer Console 

Navigate to your APIM instance.

Click on **OAuth 2.0** and then **Add**.

Provide a **Display name** and **Description**.

For the Client registration page URL,** enter a placeholder value such as `http://localhost`.  The **Client registration page URL** points to the page that users can use to create and configure their own accounts for OAuth 2.0 providers that support user management of accounts. In this example,  users do not create and configure their own accounts so a placeholder is used.

Check **Authorization code** as the **Authorization grant types**.

Next, specify **Authorization endpoint URL** and **Token endpoint URL**.

These values can be retrieved from the **Endpoints** page in your Azure AD tenant. To access the endpoints, navigate to the **App registrations** page again and click on **Endpoints**.

Copy the **OAuth 2.0 Authorization Endpoint** and paste it into the **Authorization endpoint URL** textbox.

Copy the **OAuth 2.0 Token Endpoint** and paste it into the **Token endpoint URL** textbox.

In addition to pasting in the token endpoint, add an additional body parameter named **resource** and for the value use the **Application ID** for the backend-app.

Next, specify the client credentials. These are the credentials for the client-app.

For **Client Id**, use the **Application ID** for the client-app.

For **Client secret**, use the key you created for the client-app earlier. 

Immediately following the client secret is the **redirect_url** for the authorization code grant type.

Make a note of this URL.

Click on **Create**.

Navigate back to the **Settings** page of your client-app.

Click on **Reply URLs** and paste the **redirect_url** in the first row. In this example, we replaced `https://localhost` with the URL in the first row.  

Now we have configured an OAuth 2.0 Authorization Server, the Developer Console should be able to obtain access tokens from Azure AD. 

The next step is to enable OAuth 2.0 user authorization for our API, so that the Developer Console knows it needs to obtain an access token on behalf of the user before making calls to our API.

Navigate to your APIM instance, go to **APIs**.

Click on the API you want to protect. In this example, we will use the `Echo API`.

Go to **Settings**.

Under **Security**, choose **OAuth 2.0** and select the OAuth 2.0 server we configured earlier. 

Click on **Save**.

## Successfully call the API from the developer portal

Now that the OAuth 2.0 user authorization is enabled on the `Echo API`, the Developer Console will obtain an access token on behalf of the user before calling the API.

Navigate to any operation under the `Echo API` in the Developer Portal and click **Try it**, which will bring us to the Developer Console.

Note a new item in the **Authorization** section corresponding to the authorization server you just added.

Select **Authorization code** from the authorization drop-down list and you will be prompted to sign in to the Azure AD tenant. If you are already signed in with the account, you may not be prompted.

After successful sign-in, an `Authorization` header will be added to the request with an access token from Azure AD. 

A sample token looks like below, it is Base64 encoded.

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCIsImtpZCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCJ9.eyJhdWQiOiIxYzg2ZWVmNC1jMjZkLTRiNGUtODEzNy0wYjBiZTEyM2NhMGMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgvIiwiaWF0IjoxNTIxMTUyNjMzLCJuYmYiOjE1MjExNTI2MzMsImV4cCI6MTUyMTE1NjUzMywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhHQUFBQUptVzkzTFd6dVArcGF4ZzJPeGE1cGp2V1NXV1ZSVnd1ZXZ5QU5yMlNkc0tkQmFWNnNjcHZsbUpmT1dDOThscUJJMDhXdlB6cDdlenpJdzJLai9MdWdXWWdydHhkM1lmaDlYSGpXeFVaWk9JPSIsImFtciI6WyJyc2EiXSwiYXBwaWQiOiJhYTY5ODM1OC0yMWEzLTRhYTQtYjI3OC1mMzI2NTMzMDUzZTkiLCJhcHBpZGFjciI6IjEiLCJlbWFpbCI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiSmlhbmciLCJnaXZlbl9uYW1lIjoiTWlhbyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpcGFkZHIiOiIxMzEuMTA3LjE3NC4xNDAiLCJuYW1lIjoiTWlhbyBKaWFuZyIsIm9pZCI6IjhiMTU4ZDEwLWVmZGItNDUxMS1iOTQzLTczOWZkYjMxNzAyZSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IkFGaWtvWFk1TEV1LTNkbk1pa3Z3MUJzQUx4SGIybV9IaVJjaHVfSEM1aGciLCJ0aWQiOiI0NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgiLCJ1bmlxdWVfbmFtZSI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImFQaTJxOVZ6ODBXdHNsYjRBMzBCQUEiLCJ2ZXIiOiIxLjAifQ.agGfaegYRnGj6DM_-N_eYulnQdXHhrsus45QDuApirETDR2P2aMRxRioOCR2YVwn8pmpQ1LoAhddcYMWisrw_qhaQr0AYsDPWRtJ6x0hDk5teUgbix3gazb7F-TVcC1gXpc9y7j77Ujxcq9z0r5lF65Y9bpNSefn9Te6GZYG7BgKEixqC4W6LqjtcjuOuW-ouy6LSSox71Fj4Ni3zkGfxX1T_jiOvQTd6BBltSrShDm0bTMefoyX8oqfMEA2ziKjwvBFrOjO0uK4rJLgLYH4qvkR0bdF9etdstqKMo5gecarWHNzWi_tghQu9aE3Z3EZdYNI_ZGM-Bbe3pkCfvEOyA
```

Click **Send** and you should be able to call the API successfully.


## Configure a JWT validation policy to pre-authorize requests

At this point, when a user tries to make a call from the Developer Console, the user will be prompted to sign in and the Developer Console will obtain an Access Token on behalf of the user. Everything is working as expected. However, what if someone calls our API without a token or with an invalid token? For example, you can try deleting the `Authorization` header and will find you are still able to call the API. The reason is because APIM does not validate the Access Token at this point. It simply passes the `Auhtorization` header to the backend API.

We can use the [Validate JWT](api-management-access-restriction-policies.md#ValidateJWT) policy to pre-authorize requests in APIM by validating the access tokens of each incoming request. If a request does not have a valid token, it is blocked by API Management and is not passed along to the backend. For example, we can add the below policy to the `<inbound>` policy section of the `Echo API`. It checks the audience claim in an access token and returns an error message if the token is not valid. For information on how to configure policies, see [Set or edit policies](set-edit-policies.md).

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

In this guide, we used the Developer Console in APIM as the sample client application to call the `Echo API` protected by OAuth 2.0. To learn more about how to build an application and implement the OAuth 2.0 flow, please see [Azure Active Directory code samples](../active-directory/develop/active-directory-code-samples.md).

## Next steps
* Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/active-directory-authentication-scenarios.md)
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your backend service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).

[Create an API Management service instance]: get-started-create-service-instance.md
[Manage your first API]: import-and-publish.md
