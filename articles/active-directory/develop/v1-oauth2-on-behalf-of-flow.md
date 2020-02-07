---
title: Service-to-service authentication with OAuth2.0 on-behalf-of flow | Microsoft Docs
description: This article describes how to use HTTP messages to implement service-to-service authentication with the OAuth2.0 On-Behalf-Of flow.
services: active-directory
documentationcenter: .net
author: navyasric
manager: CelesteDG
editor: ''

ms.assetid: 09f6f318-e88b-4024-9ee1-e7f09fb19a82
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: ryanwi
ms.reviewer: hirsin, nacanuma
ms.custom: aaddev
---

# Service-to-service calls that use delegated user identity in the On-Behalf-Of flow

[!INCLUDE [active-directory-develop-applies-v1](../../../includes/active-directory-develop-applies-v1.md)]

The OAuth 2.0 On-Behalf-Of (OBO) flow enables an application that invokes a service or web API to pass user authentication to another service or web API. The OBO flow propagates the delegated user identity and permissions through the request chain. For the middle-tier service to make authenticated requests to the downstream service, it must secure an access token from Azure Active Directory (Azure AD) on behalf of the user.

> [!IMPORTANT]
> As of May 2018, an `id_token` can't be used for the On-Behalf-Of flow.  Single-page apps (SPAs) must pass an access token to a middle-tier confidential client to perform OBO flows. For more detail about the clients that can perform On-Behalf-Of calls, see [limitations](#client-limitations).

## On-Behalf-Of flow diagram

The OBO flow starts after the user has been authenticated on an application that uses the [OAuth 2.0 authorization code grant flow](v1-protocols-oauth-code.md). At that point, the application sends an access token (token A) to the middle-tier web API (API A) containing the user’s claims and consent to access API A. Next, API A makes an authenticated request to the downstream web API (API B).

These steps constitute the On-Behalf-Of flow:
![Shows the steps in the OAuth2.0 On-Behalf-Of flow](./media/v1-oauth2-on-behalf-of-flow/active-directory-protocols-oauth-on-behalf-of-flow.png)

1. The client application makes a request to API A with the token A.
1. API A authenticates to the Azure AD token issuance endpoint and requests a token to access API B.
1. The Azure AD token issuance endpoint validates API A's credentials with token A and issues the access token for API B (token B).
1. The request to API B contains token B in the authorization header.
1. API B returns data from the secured resource.

>[!NOTE]
>The audience claim in an access token used to request a token for a downstream service must be the ID of the service making the OBO request. The token also must be signed with the Azure Active Directory global signing key (which is the default for applications registered via **App registrations** in the portal).

## Register the application and service in Azure AD

Register both the middle-tier service and the client application in Azure AD.

### Register the middle-tier service

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, select your account and look under the **Directory** list to select an Active Directory tenant for your application.
1. Select **More Services** on the left pane and choose **Azure Active Directory**.
1. Select **App registrations** and then **New registration**.
1. Enter a friendly name for the application and select the application type.
1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. Set the redirect URI to the base URL.
1. Select **Register** to create the application.
1. Generate a client secret before exiting the Azure portal.
1. In the Azure portal, choose your application and select **Certificates & secrets**.
1. Select **New client secret** and add a secret with a duration of either one year or two years.
1. When you save this page, the Azure portal displays the secret value. Copy and save the secret value in a safe location.

> [!IMPORTANT]
> You need the secret to configure the application settings in your implementation. This secret value is not displayed again, and it isn't retrievable by any other means. Record it as soon as it is visible in the Azure portal.

### Register the client application

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, select your account and look under the **Directory** list to select an Active Directory tenant for your application.
1. Select **More Services** on the left pane and choose **Azure Active Directory**.
1. Select **App registrations** and then **New registration**.
1. Enter a friendly name for the application and select the application type.
1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. Set the redirect URI to the base URL.
1. Select **Register** to create the application.
1. Configure permissions for your application. In **API permissions**, select **Add a permission** and then **My APIs**.
1. Type the name of the middle-tier service in the text field.
1. Choose **Select Permissions** and then select **Access \<service name>**.

### Configure known client applications

In this scenario, the middle-tier service needs to obtain the user's consent to access the downstream API without a user interaction. The option to grant access to the downstream API must be presented up front as part of the consent step during authentication.

Follow the steps below to explicitly bind the client app's registration in Azure AD with the middle-tier service's registration. This operation merges the consent required by both the client and middle-tier into a single dialog.

1. Go to the middle-tier service registration and select **Manifest** to open the manifest editor.
1. Locate the `knownClientApplications` array property and add the client ID of the client application as an element.
1. Save the manifest by selecting **Save**.

## Service-to-service access token request

To request an access token, make an HTTP POST to the tenant-specific Azure AD endpoint with the following parameters:

```
https://login.microsoftonline.com/<tenant>/oauth2/token
```

The client application is secured either by a shared secret or by a certificate.

### First case: Access token request with a shared secret

When using a shared secret, a service-to-service access token request contains the following parameters:

| Parameter |  | Description |
| --- | --- | --- |
| grant_type |required | The type of the token request. An OBO request uses a JSON Web Token (JWT) so the value must be **urn:ietf:params:oauth:grant-type:jwt-bearer**. |
| assertion |required | The value of the access token used in the request. |
| client_id |required | The app ID assigned to the calling service during registration with Azure AD. To find the app ID in the Azure portal, select **Active Directory**, choose the directory, and then select the application name. |
| client_secret |required | The key registered for the calling service in Azure AD. This value should have been noted at the time of registration. |
| resource |required | The app ID URI of the receiving service (secured resource). To find the app ID URI in the Azure portal, select **Active Directory** and choose the directory. Select the application name, choose **All settings**, and then select **Properties**. |
| requested_token_use |required | Specifies how the request should be processed. In the On-Behalf-Of flow, the value must be **on_behalf_of**. |
| scope |required | A space separated list of scopes for the token request. For OpenID Connect, the scope **openid** must be specified.|

#### Example

The following HTTP POST requests an access token for the https://graph.windows.net web API. The `client_id` identifies the service that requests the access token.

```
// line breaks for legibility only

POST /oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer
&client_id=625391af-c675-43e5-8e44-edd3e30ceb15
&client_secret=0Y1W%2BY3yYb3d9N8vSjvm8WrGzVZaAaHbHHcGbcgG%2BoI%3D
&resource=https%3A%2F%2Fgraph.windows.net
&assertion=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCIsImtpZCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCJ9.eyJhdWQiOiJodHRwczovL2Rkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tLzE5MjNmODYyLWU2ZGMtNDFhMy04MWRhLTgwMmJhZTAwYWY2ZCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzI2MDM5Y2NlLTQ4OWQtNDAwMi04MjkzLTViMGM1MTM0ZWFjYi8iLCJpYXQiOjE0OTM0MjMxNTIsIm5iZiI6MTQ5MzQyMzE1MiwiZXhwIjoxNDkzNDY2NjUyLCJhY3IiOiIxIiwiYWlvIjoiWTJaZ1lCRFF2aTlVZEc0LzM0L3dpQndqbjhYeVp4YmR1TFhmVE1QeG8yYlN2elgreHBVQSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJiMzE1MDA3OS03YmViLTQxN2YtYTA2YS0zZmRjNzhjMzI1NDUiLCJhcHBpZGFjciI6IjAiLCJlX2V4cCI6MzAyNDAwLCJmYW1pbHlfbmFtZSI6IlRlc3QiLCJnaXZlbl9uYW1lIjoiTmF2eWEiLCJpcGFkZHIiOiIxNjcuMjIwLjEuMTc3IiwibmFtZSI6Ik5hdnlhIFRlc3QiLCJvaWQiOiIxY2Q0YmNhYy1iODA4LTQyM2EtOWUyZi04MjdmYmIxYmI3MzkiLCJwbGF0ZiI6IjMiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJEVXpYbkdKMDJIUk0zRW5pbDFxdjZCakxTNUllQy0tQ2ZpbzRxS1MzNEc4IiwidGlkIjoiMjYwMzljY2UtNDg5ZC00MDAyLTgyOTMtNWIwYzUxMzRlYWNiIiwidW5pcXVlX25hbWUiOiJuYXZ5YUBkZG9iYWxpYW5vdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6Im5hdnlhQGRkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tIiwidmVyIjoiMS4wIn0.R-Ke-XO7lK0r5uLwxB8g5CrcPAwRln5SccJCfEjU6IUqpqcjWcDzeDdNOySiVPDU_ZU5knJmzRCF8fcjFtPsaA4R7vdIEbDuOur15FXSvE8FvVSjP_49OH6hBYqoSUAslN3FMfbO6Z8YfCIY4tSOB2I6ahQ_x4ZWFWglC3w5mK-_4iX81bqi95eV4RUKefUuHhQDXtWhrSgIEC0YiluMvA4TnaJdLq_tWXIc4_Tq_KfpkvI004ONKgU7EAMEr1wZ4aDcJV2yf22gQ1sCSig6EGSTmmzDuEPsYiyd4NhidRZJP4HiiQh-hePBQsgcSgYGvz9wC6n57ufYKh2wm_Ti3Q
&requested_token_use=on_behalf_of
&scope=openid
```

### Second case: Access token request with a certificate

A service-to-service access token request with a certificate contains the following parameters:

| Parameter |  | Description |
| --- | --- | --- |
| grant_type |required | The type of the token request. An OBO request uses a JWT access token so the value must be **urn:ietf:params:oauth:grant-type:jwt-bearer**. |
| assertion |required | The value of the token used in the request. |
| client_id |required | The app ID assigned to the calling service during registration with Azure AD. To find the app ID in the Azure portal, select **Active Directory**, choose the directory, and then select the application name. |
| client_assertion_type |required |The value must be `urn:ietf:params:oauth:client-assertion-type:jwt-bearer` |
| client_assertion |required | A JSON Web Token that you create and sign with the certificate you registered as credentials for your application. See  [certificate credentials](active-directory-certificate-credentials.md) to learn about assertion format and about how to register your certificate.|
| resource |required | The app ID URI of the receiving service (secured resource). To find the app ID URI in the Azure portal, select **Active Directory** and choose the directory. Select the application name, choose **All settings**, and then select **Properties**. |
| requested_token_use |required | Specifies how the request should be processed. In the On-Behalf-Of flow, the value must be **on_behalf_of**. |
| scope |required | A space separated list of scopes for the token request. For OpenID Connect, the scope **openid** must be specified.|

These parameters are almost the same as with the request by shared secret except that the `client_secret parameter` is replaced by two parameters: `client_assertion_type` and `client_assertion`.

#### Example

The following HTTP POST requests an access token for the https://graph.windows.net web API with a certificate. The `client_id` identifies the service that requests the access token.

```
// line breaks for legibility only

POST /oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer
&client_id=625391af-c675-43e5-8e44-edd3e30ceb15
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg
&resource=https%3A%2F%2Fgraph.windows.net
&assertion=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCIsImtpZCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCJ9.eyJhdWQiOiJodHRwczovL2Rkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tLzE5MjNmODYyLWU2ZGMtNDFhMy04MWRhLTgwMmJhZTAwYWY2ZCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzI2MDM5Y2NlLTQ4OWQtNDAwMi04MjkzLTViMGM1MTM0ZWFjYi8iLCJpYXQiOjE0OTM0MjMxNTIsIm5iZiI6MTQ5MzQyMzE1MiwiZXhwIjoxNDkzNDY2NjUyLCJhY3IiOiIxIiwiYWlvIjoiWTJaZ1lCRFF2aTlVZEc0LzM0L3dpQndqbjhYeVp4YmR1TFhmVE1QeG8yYlN2elgreHBVQSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJiMzE1MDA3OS03YmViLTQxN2YtYTA2YS0zZmRjNzhjMzI1NDUiLCJhcHBpZGFjciI6IjAiLCJlX2V4cCI6MzAyNDAwLCJmYW1pbHlfbmFtZSI6IlRlc3QiLCJnaXZlbl9uYW1lIjoiTmF2eWEiLCJpcGFkZHIiOiIxNjcuMjIwLjEuMTc3IiwibmFtZSI6Ik5hdnlhIFRlc3QiLCJvaWQiOiIxY2Q0YmNhYy1iODA4LTQyM2EtOWUyZi04MjdmYmIxYmI3MzkiLCJwbGF0ZiI6IjMiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJEVXpYbkdKMDJIUk0zRW5pbDFxdjZCakxTNUllQy0tQ2ZpbzRxS1MzNEc4IiwidGlkIjoiMjYwMzljY2UtNDg5ZC00MDAyLTgyOTMtNWIwYzUxMzRlYWNiIiwidW5pcXVlX25hbWUiOiJuYXZ5YUBkZG9iYWxpYW5vdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6Im5hdnlhQGRkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tIiwidmVyIjoiMS4wIn0.R-Ke-XO7lK0r5uLwxB8g5CrcPAwRln5SccJCfEjU6IUqpqcjWcDzeDdNOySiVPDU_ZU5knJmzRCF8fcjFtPsaA4R7vdIEbDuOur15FXSvE8FvVSjP_49OH6hBYqoSUAslN3FMfbO6Z8YfCIY4tSOB2I6ahQ_x4ZWFWglC3w5mK-_4iX81bqi95eV4RUKefUuHhQDXtWhrSgIEC0YiluMvA4TnaJdLq_tWXIc4_Tq_KfpkvI004ONKgU7EAMEr1wZ4aDcJV2yf22gQ1sCSig6EGSTmmzDuEPsYiyd4NhidRZJP4HiiQh-hePBQsgcSgYGvz9wC6n57ufYKh2wm_Ti3Q
&requested_token_use=on_behalf_of
&scope=openid
```

## Service-to-service access token response

A success response is a JSON OAuth 2.0 response with the following parameters:

| Parameter | Description |
| --- | --- |
| token_type |Indicates the token type value. The only type that Azure AD supports is **Bearer**. For more information about bearer tokens, see the [OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt). |
| scope |The scope of access granted in the token. |
| expires_in |The length of time the access token is valid (in seconds). |
| expires_on |The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens. |
| resource |The app ID URI of the receiving service (secured resource). |
| access_token |The requested access token. The calling service can use this token to authenticate to the receiving service. |
| id_token |The requested ID token. The calling service can use this token to verify the user's identity and begin a session with the user. |
| refresh_token |The refresh token for the requested access token. The calling service can use this token to request another access token after the current access token expires. |

### Success response example

The following example shows a success response to a request for an access token for the https://graph.windows.net web API.

```json
{
    "token_type":"Bearer",
    "scope":"User.Read",
    "expires_in":"43482",
    "ext_expires_in":"302683",
    "expires_on":"1493466951",
    "not_before":"1493423168",
    "resource":"https://graph.windows.net",
    "access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCIsImtpZCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLndpbmRvd3MubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMjYwMzljY2UtNDg5ZC00MDAyLTgyOTMtNWIwYzUxMzRlYWNiLyIsImlhdCI6MTQ5MzQyMzE2OCwibmJmIjoxNDkzNDIzMTY4LCJleHAiOjE0OTM0NjY5NTEsImFjciI6IjEiLCJhaW8iOiJBU1FBMi84REFBQUE1NnZGVmp0WlNjNWdBVWwrY1Z0VFpyM0VvV2NvZEoveWV1S2ZqcTZRdC9NPSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiI2MjUzOTFhZi1jNjc1LTQzZTUtOGU0NC1lZGQzZTMwY2ViMTUiLCJhcHBpZGFjciI6IjEiLCJlX2V4cCI6MzAyNjgzLCJmYW1pbHlfbmFtZSI6IlRlc3QiLCJnaXZlbl9uYW1lIjoiTmF2eWEiLCJpcGFkZHIiOiIxNjcuMjIwLjEuMTc3IiwibmFtZSI6Ik5hdnlhIFRlc3QiLCJvaWQiOiIxY2Q0YmNhYy1iODA4LTQyM2EtOWUyZi04MjdmYmIxYmI3MzkiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzNGRkZBMTJFRDdGRSIsInNjcCI6IlVzZXIuUmVhZCIsInN1YiI6IjNKTUlaSWJlYTc1R2hfWHdDN2ZzX0JDc3kxa1l1ekZKLTUyVm1Zd0JuM3ciLCJ0aWQiOiIyNjAzOWNjZS00ODlkLTQwMDItODI5My01YjBjNTEzNGVhY2IiLCJ1bmlxdWVfbmFtZSI6Im5hdnlhQGRkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tIiwidXBuIjoibmF2eWFAZGRvYmFsaWFub3V0bG9vay5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJ4Q3dmemhhLVAwV0pRT0x4Q0dnS0FBIiwidmVyIjoiMS4wIn0.cqmUVjfVbqWsxJLUI1Z4FRx1mNQAHP-L0F4EMN09r8FY9bIKeO-0q1eTdP11Nkj_k4BmtaZsTcK_mUygdMqEp9AfyVyA1HYvokcgGCW_Z6DMlVGqlIU4ssEkL9abgl1REHElPhpwBFFBBenOk9iHddD1GddTn6vJbKC3qAaNM5VarjSPu50bVvCrqKNvFixTb5bbdnSz-Qr6n6ACiEimiI1aNOPR2DeKUyWBPaQcU5EAK0ef5IsVJC1yaYDlAcUYIILMDLCD9ebjsy0t9pj_7lvjzUSrbMdSCCdzCqez_MSNxrk1Nu9AecugkBYp3UVUZOIyythVrj6-sVvLZKUutQ",
    "refresh_token":"AQABAAAAAABnfiG-mA6NTae7CdWW7QfdjKGu9-t1scy_TDEmLi4eLQMjJGt_nAoVu6A4oSu1KsRiz8XyQIPKQxSGfbf2FoSK-hm2K8TYzbJuswYusQpJaHUQnSqEvdaCeFuqXHBv84wjFhuanzF9dQZB_Ng5za9xKlUENrNtlq9XuLNVKzxEyeUM7JyxzdY7JiEphWImwgOYf6II316d0Z6-H3oYsFezf4Xsjz-MOBYEov0P64UaB5nJMvDyApV-NWpgklLASfNoSPGb67Bc02aFRZrm4kLk-xTl6eKE6hSo0XU2z2t70stFJDxvNQobnvNHrAmBaHWPAcC3FGwFnBOojpZB2tzG1gLEbmdROVDp8kHEYAwnRK947Py12fJNKExUdN0njmXrKxNZ_fEM33LHW1Tf4kMX_GvNmbWHtBnIyG0w5emb-b54ef5AwV5_tGUeivTCCysgucEc-S7G8Cz0xNJ_BOiM_4bAv9iFmrm9STkltpz0-Tftg8WKmaJiC0xXj6uTf4ZkX79mJJIuuM7XP4ARIcLpkktyg2Iym9jcZqymRkGH2Rm9sxBwC4eeZXM7M5a7TJ-5CqOdfuE3sBPq40RdEWMFLcrAzFvP0VDR8NKHIrPR1AcUruat9DETmTNJukdlJN3O41nWdZOVoJM-uKN3uz2wQ2Ld1z0Mb9_6YfMox9KTJNzRzcL52r4V_y3kB6ekaOZ9wQ3HxGBQ4zFt-2U0mSszIAA",
    "id_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiI2MjUzOTFhZi1jNjc1LTQzZTUtOGU0NC1lZGQzZTMwY2ViMTUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yNjAzOWNjZS00ODlkLTQwMDItODI5My01YjBjNTEzNGVhY2IvIiwiaWF0IjoxNDkzNDIzMTY4LCJuYmYiOjE0OTM0MjMxNjgsImV4cCI6MTQ5MzQ2Njk1MSwiYW1yIjpbInB3ZCJdLCJmYW1pbHlfbmFtZSI6IlRlc3QiLCJnaXZlbl9uYW1lIjoiTmF2eWEiLCJpcGFkZHIiOiIxNjcuMjIwLjEuMTc3IiwibmFtZSI6Ik5hdnlhIFRlc3QiLCJvaWQiOiIxY2Q0YmNhYy1iODA4LTQyM2EtOWUyZi04MjdmYmIxYmI3MzkiLCJwbGF0ZiI6IjMiLCJzdWIiOiJEVXpYbkdKMDJIUk0zRW5pbDFxdjZCakxTNUllQy0tQ2ZpbzRxS1MzNEc4IiwidGlkIjoiMjYwMzljY2UtNDg5ZC00MDAyLTgyOTMtNWIwYzUxMzRlYWNiIiwidW5pcXVlX25hbWUiOiJuYXZ5YUBkZG9iYWxpYW5vdXRsb29rLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6Im5hdnlhQGRkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tIiwidXRpIjoieEN3ZnpoYS1QMFdKUU9MeENHZ0tBQSIsInZlciI6IjEuMCJ9."
}
```

### Error response example

The Azure AD token endpoint returns an error response when it tries to acquire an access token for a downstream API that is set with a Conditional Access policy (for example, multi-factor authentication). The middle-tier service should surface this error to the client application so that the client application can provide the user interaction to satisfy the Conditional Access policy.

```json
{
    "error":"interaction_required",
    "error_description":"AADSTS50079: Due to a configuration change made by your administrator, or because you moved to a new location, you must enroll in multi-factor authentication to access 'bf8d80f9-9098-4972-b203-500f535113b1'.\r\nTrace ID: b72a68c3-0926-4b8e-bc35-3150069c2800\r\nCorrelation ID: 73d656cf-54b1-4eb2-b429-26d8165a52d7\r\nTimestamp: 2017-05-01 22:43:20Z",
    "error_codes":[50079],
    "timestamp":"2017-05-01 22:43:20Z",
    "trace_id":"b72a68c3-0926-4b8e-bc35-3150069c2800",
    "correlation_id":"73d656cf-54b1-4eb2-b429-26d8165a52d7",
    "claims":"{\"access_token\":{\"polids\":{\"essential\":true,\"values\":[\"9ab03e19-ed42-4168-b6b7-7001fb3e933a\"]}}}"
}
```

## Use the access token to access the secured resource

The middle-tier service can use the acquired access token to make authenticated requests to the downstream web API by setting the token in the `Authorization` header.

### Example

```
GET /me?api-version=2013-11-08 HTTP/1.1
Host: graph.windows.net
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCIsImtpZCI6InowMzl6ZHNGdWl6cEJmQlZLMVRuMjVRSFlPMCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLndpbmRvd3MubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMjYwMzljY2UtNDg5ZC00MDAyLTgyOTMtNWIwYzUxMzRlYWNiLyIsImlhdCI6MTQ5MzQyMzE2OCwibmJmIjoxNDkzNDIzMTY4LCJleHAiOjE0OTM0NjY5NTEsImFjciI6IjEiLCJhaW8iOiJBU1FBMi84REFBQUE1NnZGVmp0WlNjNWdBVWwrY1Z0VFpyM0VvV2NvZEoveWV1S2ZqcTZRdC9NPSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiI2MjUzOTFhZi1jNjc1LTQzZTUtOGU0NC1lZGQzZTMwY2ViMTUiLCJhcHBpZGFjciI6IjEiLCJlX2V4cCI6MzAyNjgzLCJmYW1pbHlfbmFtZSI6IlRlc3QiLCJnaXZlbl9uYW1lIjoiTmF2eWEiLCJpcGFkZHIiOiIxNjcuMjIwLjEuMTc3IiwibmFtZSI6Ik5hdnlhIFRlc3QiLCJvaWQiOiIxY2Q0YmNhYy1iODA4LTQyM2EtOWUyZi04MjdmYmIxYmI3MzkiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzNGRkZBMTJFRDdGRSIsInNjcCI6IlVzZXIuUmVhZCIsInN1YiI6IjNKTUlaSWJlYTc1R2hfWHdDN2ZzX0JDc3kxa1l1ekZKLTUyVm1Zd0JuM3ciLCJ0aWQiOiIyNjAzOWNjZS00ODlkLTQwMDItODI5My01YjBjNTEzNGVhY2IiLCJ1bmlxdWVfbmFtZSI6Im5hdnlhQGRkb2JhbGlhbm91dGxvb2sub25taWNyb3NvZnQuY29tIiwidXBuIjoibmF2eWFAZGRvYmFsaWFub3V0bG9vay5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJ4Q3dmemhhLVAwV0pRT0x4Q0dnS0FBIiwidmVyIjoiMS4wIn0.cqmUVjfVbqWsxJLUI1Z4FRx1mNQAHP-L0F4EMN09r8FY9bIKeO-0q1eTdP11Nkj_k4BmtaZsTcK_mUygdMqEp9AfyVyA1HYvokcgGCW_Z6DMlVGqlIU4ssEkL9abgl1REHElPhpwBFFBBenOk9iHddD1GddTn6vJbKC3qAaNM5VarjSPu50bVvCrqKNvFixTb5bbdnSz-Qr6n6ACiEimiI1aNOPR2DeKUyWBPaQcU5EAK0ef5IsVJC1yaYDlAcUYIILMDLCD9ebjsy0t9pj_7lvjzUSrbMdSCCdzCqez_MSNxrk1Nu9AecugkBYp3UVUZOIyythVrj6-sVvLZKUutQ
```

## SAML assertions obtained with an OAuth2.0 OBO flow

Some OAuth-based web services need to access other web service APIs that accept SAML assertions in non-interactive flows. Azure Active Directory can provide a SAML assertion in response to an On-Behalf-Of flow that uses a SAML-based web service as a target resource.

>[!NOTE]
>This is a non-standard extension to the OAuth 2.0 On-Behalf-Of flow that allows an OAuth2-based application to access web service API endpoints that consume SAML tokens.

> [!TIP]
> When you call a SAML-protected web service from a front-end web application, you can simply call the API and initiate a normal interactive authentication flow with the user's existing session. You only need to use an OBO flow when a service-to-service call requires a SAML token to provide user context.

### Obtain a SAML token by using an OBO request with a shared secret

A service-to-service request for a SAML assertion contains the following parameters:

| Parameter |  | Description |
| --- | --- | --- |
| grant_type |required | The type of the token request. For a request that uses a JWT, the value must be **urn:ietf:params:oauth:grant-type:jwt-bearer**. |
| assertion |required | The value of the access token used in the request.|
| client_id |required | The app ID assigned to the calling service during registration with Azure AD. To find the app ID in the Azure portal, select **Active Directory**, choose the directory, and then select the application name. |
| client_secret |required | The key registered for the calling service in Azure AD. This value should have been noted at the time of registration. |
| resource |required | The app ID URI of the receiving service (secured resource). This is the resource that will be the Audience of the SAML token. To find the app ID URI in the Azure portal, select **Active Directory** and choose the directory. Select the application name, choose **All settings**, and then select **Properties**. |
| requested_token_use |required | Specifies how the request should be processed. In the On-Behalf-Of flow, the value must be **on_behalf_of**. |
| requested_token_type | required | Specifies the type of token requested. The value can be **urn:ietf:params:oauth:token-type:saml2** or **urn:ietf:params:oauth:token-type:saml1** depending on the requirements of the accessed resource. |

The response contains a SAML token encoded in UTF8 and Base64url.

- **SubjectConfirmationData for a SAML assertion sourced from an OBO call**: If the target application requires a recipient value in **SubjectConfirmationData**, then the value must be a non-wildcard Reply URL in the resource application configuration.
- **The SubjectConfirmationData node**: The node can't contain an **InResponseTo** attribute since it's not part of a SAML response. The application receiving the SAML token must be able to accept the SAML assertion without an **InResponseTo** attribute.

- **Consent**: Consent must have been granted to receive a SAML token containing user data on an OAuth flow. For information on permissions and obtaining administrator consent, see [Permissions and consent in the Azure Active Directory v1.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/v1-permissions-and-consent).

### Response with SAML assertion

| Parameter | Description |
| --- | --- |
| token_type |Indicates the token type value. The only type that Azure AD supports is **Bearer**. For more information about bearer tokens, see [OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt). |
| scope |The scope of access granted in the token. |
| expires_in |The length of time the access token is valid (in seconds). |
| expires_on |The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens. |
| resource |The app ID URI of the receiving service (secured resource). |
| access_token |The parameter that returns the SAML assertion. |
| refresh_token |The refresh token. The calling service can use this token to request another access token after the current SAML assertion expires. |

- token_type: Bearer
- expires_in: 3296
- ext_expires_in: 0
- expires_on: 1529627844
- resource: `https://api.contoso.com`
- access_token: \<SAML assertion\>
- issued_token_type: urn:ietf:params:oauth:token-type:saml2
- refresh_token: \<Refresh token\>

## Client limitations

Public clients with wildcard reply URLs can't use an `id_token` for OBO flows. However, a confidential client can still redeem **access** tokens acquired through the implicit grant flow even if the public client has a wildcard redirect URI registered.

## Next steps

Learn more about the OAuth 2.0 protocol and another way to perform service-to-service authentication that uses client credentials:

* [Service to service authentication using OAuth 2.0 client credentials grant in Azure AD](v1-oauth2-client-creds-grant-flow.md)
* [OAuth 2.0 in Azure AD](v1-protocols-oauth-code.md)
