---
title: Register a SaaS application | Azure Marketplace 
description: Explains how to register a SaaS application using the Azure portal.
services: Azure, Marketplace, Cloud Partner Portal, Azure portal
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: evansma
---

# Authenticating the API calls

This article explains how to authenticate a SaaS application calling the Fulfillment APIs.  The Fulfillment APIs use the [OAuth 2.0 client credentials grant flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow) on Azure Active Directory (v1.0) endpoints.


Azure Marketplace does not impose any constraints on the authentication method the SaaS service uses for its end users. 


## Registering an Azure AD app

Follow the steps on this [Quickstart](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) to register an application with the Microsoft identity platform. The publisher needs to configure the app by adding credentials as described in this [section](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-credentials-to-your-web-application). The `Access tokens` option under the `Advanced settings` section on the `Authentication` section of the app registration should be checked for requesting access tokens.

## Using the Azure AD security token when calling the API

Once you have registered your application, you can programmatically request an Azure AD access token.  Fulfillment APIs use the OAuth 2.0 client credentials grant flow. 

The following code snippet shows how to request an `access_token` using [Azure Active Directory Authentication Library for .NET](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/activedirectory/client?view=azure-dotnet). Please note the use of the default value of the `Resource` parameter as `62d94f6c-d599-489b-a797-3e10e42fbe22`.

```c#
            var credential = new ClientCredential(<client_id>,<app_key>);
            var authContext = new AuthenticationContext("https://login.microsoftonline.com" + <tenant_id>, false);
            var token = await authContext.AcquireTokenAsync("62d94f6c-d599-489b-a797-3e10e42fbe22", credential);
```

Calls to the Fulfillment API need to use an `Authorization` header using the `access_token` value as a bearer token.

```c#
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);
```

### Get an access token with an HTTP POST
Alternatively, the publisher can request an Azure AD access token using an HTTP POST to the tenant-specific Azure AD endpoint directly.

```
https://login.microsoftonline.com/<tenant id>/oauth2/token
```
*URI parameter*

|  **Parameter name**  | **Required**  | **Description**                               |
|  ------------------  | ------------- | --------------------------------------------- |
| tenantId             | True          | Tenant ID of the registered AAD application   |
|  |  |  |


*Request header*

|  **Header name**  | **Required** |  **Description**                                   |
|  --------------   | ------------ |  ------------------------------------------------- |
|  Content-Type     | True         | Content type associated with the request. The default value is `application/x-www-form-urlencoded`.  |
|  |  |  |


*Request body*

| **Property name**   | **Required** |  **Description**                                                          |
| -----------------   | -----------  | ------------------------------------------------------------------------- |
|  grant_type         | True         | Grant type. The default value is `client_credentials`.                    |
|  client_id          | True         |  Client/app identifier associated with the Azure AD app.                  |
|  client_secret      | True         |  Password associated with the Azure AD app.                               |
|  resource           | True         |  Target resource for which the token is requested. The default value is `62d94f6c-d599-489b-a797-3e10e42fbe22`. |
|  |  |  |


*Response*

|  **Name**  | **Type**       |  **Description**    |
| ---------- | -------------  | ------------------- |
| 200 OK    | TokenResponse  | Request succeeded   |
|  |  |  |

*TokenResponse*

Sample response token:

``` json
  {
          "token_type": "Bearer",
          "expires_in": "3600",
          "ext_expires_in": "0",
          "expires_on": "15251…",
          "not_before": "15251…",
          "resource": "62d94f6c-d599-489b-a797-3e10e42fbe22",
          "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImlCakwxUmNxemhpeTRmcHhJeGRacW9oTTJZayIsImtpZCI6ImlCakwxUmNxemhpeTRmcHhJeGRacW9oTTJZayJ9…"
  }               
```


## Next steps

Your Azure AD-secured app can now use the [SaaS Fulfillment API Version 2](./pc-saas-fulfillment-api-v2.md).
