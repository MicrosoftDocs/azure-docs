---
title: How to generate a refresh token for Microsoft Azure Data Manager for Energy
description: This article describes how to generate a refresh token
author: elizabethhalper
ms.author: elhalper
ms.service: energy-data-services
ms.topic: how-to
ms.date: 10/06/2022
ms.custom: template-how-to
#Customer intent: As a developer, I want to learn how to generate a refresh token
---

# How to generate a refresh token

In this article, you will learn how to generate a refresh token. The following are the basic steps to use the OAuth 2.0 authorization code grant flow to get a refresh token from the Microsoft identity platform endpoint:

  1. Register your app with Azure AD.
  2. Get authorization.
  3. Get a refresh token.

## Register your app with Azure AD
To use the Azure Data Manager for Energy platform endpoint, you must register your app using the [Azure app registration portal](https://go.microsoft.com/fwlink/?linkid=2083908). You can use either a Microsoft account or a work or school account to register an app.

To configure an app to use the OAuth 2.0 authorization code grant flow, save the following values when registering the app:

- The `Directory (tenant) ID` that will be used in place of `{Tenant ID}`
- The `application (client) ID` assigned by the app registration portal, which will be used instead of `client_id`.
- A `client (application) secret`, either a password or a public/private key pair (certificate). The client secret isn't required for native apps. This secret will be used instead of `{AppReg Secret}` later.
- A `redirect URI (or reply URL)` for your app to receive responses from Azure AD. If there's no redirect URIs specified, add a platform, select "Web", then add `http://localhost:8080`, and select save.

For steps on how to configure an app in the Azure portal, see [Register your app](../active-directory/develop/quickstart-register-app.md#register-an-application).

## Get authorization
The first step to getting an access token for many OpenID Connect (OIDC) and OAuth 2.0 flows is to redirect the user to the Microsoft identity platform `/authorize` endpoint. Azure AD will sign the user in and request their consent for the permissions your app requests. In the authorization code grant flow, after consent is obtained, Azure AD will return an `authorization_code` to your app that it can redeem at the Microsoft identity platform `/token` endpoint for an access token.

### Authorization request

The authorization code flow begins with the client directing the user to the `/authorize` endpoint. This step is the interactive part of the flow, where the user takes action. 

The following shows an example of an authorization request:
```bash
  https://login.microsoftonline.com/{Tenant ID}/oauth2/v2.0/authorize?client_id={AppReg ID}
  &response_type=code
  &redirect_uri=http%3a%2f%2flocalhost%3a8080
  &response_mode=query
  &scope={AppReg ID}%2f.default&state=12345&sso_reload=true
```

| Parameter | Required? | Description |
| --- | --- | --- |
|`{Tenant ID}`|Required|Name of your Azure AD tenant|
| client_id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| response_type |Required |The response type, which must include `code` for the authorization code flow. You can receive an ID token if you include it in the response type, such as `code+id_token`, and in this case, the scope needs to include `openid`.|
| redirect_uri |Required |The redirect URI of your app, where authentication responses are sent and received by your app. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL-encoded. |
| scope |Required |A space-separated list of scopes. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens. The `offline_access` scope is optional for web applications. It indicates that your application will need a *refresh token* for extended access to resources. The client-id indicates the token issued are intended for use by Azure AD B2C registered client. The `https://{tenant-name}/{app-id-uri}/{scope}` indicates a permission to protected resources, such as a web API. |
| response_mode |Recommended |The method that you use to send the resulting authorization code back to your app. It can be `query`, `form_post`, or `fragment`. |
| state |Recommended |A value included in the request that can be a string of any content that you want to use. Usually, a randomly generated unique value is  used, to prevent cross-site request forgery attacks. The state also is used to encode information about the user's state in the app before the authentication request occurred. For example, the page the user was on, or the user flow that was being executed. |

### Authorization response
In the response, you'll get an `authorization code` in the URL bar.

```bash
http://localhost:8080/?code=0.BRoAv4j5cvGGr0...au78f&state=12345&session....
```
The browser will redirect to `http://localhost:8080/?code={authorization code}&state=...` upon successful authentication.

> [!NOTE] 
> The browser may say that the site can't be reached, but it should still have the authorization code in the URL bar.

|Parameter| Description|
| --- | --- |
|code|The authorization_code that the app requested. The app can use the authorization code to request an access token for the target resource. Authorization_codes are short lived, typically they expire after about 10 minutes.|
|state|If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. This check helps to detect [Cross-Site Request Forgery (CSRF) attacks](https://tools.ietf.org/html/rfc6749#section-10.12) against the client.|
|session_state|A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination.|

Copy the code between `code=` and `&state`.

> [!WARNING]
> Running the URL in Postman won't work as it requires extra configuration for token retrieval.

## Get a refresh token
Your app uses the authorization code received in the previous step to request an access token by sending a POST request to the `/token` endpoint.

### Sample request

```bash
  curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id={AppReg ID}
  &scope={AppReg ID}%2f.default openid profile offline_access
  &code={authorization code}
  &redirect_uri=http%3A%2F%2Flocalhost%3a8080
  &grant_type=authorization_code
  &client_secret={AppReg Secret}' 'https://login.microsoftonline.com/{Tenant ID}/oauth2/v2.0/token'
```
|Parameter  |Required  |Description  |
|---------|---------|---------|
|tenant     | Required        | The {Tenant ID} value in the path of the request can be used to control who can sign into the application.|
|client_id     | Required         | The application ID assigned to your app upon registration         |
|scope     | Required        | A space-separated list of scopes. The scopes that your app requests in this leg must be equivalent to or a subset of the scopes that it requested in the first (authorization) leg. If the scopes specified in this request span multiple resource server, then the v2.0 endpoint will return a token for the resource specified in the first scope.        |
|code    |Required         |The authorization_code that you acquired in the first leg of the flow.         |
|redirect_uri     | Required        |The same redirect_uri value that was used to acquire the authorization_code.         |
|grant_type     | Required        | Must be authorization_code for the authorization code flow.        |
|client_secret | Required | The client secret that you created in the app registration portal for your app. It shouldn't be used in a native app, because client_secrets can't be reliably stored on devices. It's required for web apps and web APIs, which have the ability to store the client_secret securely on the server side.|

### Sample response

```bash
{
  "token_type": "Bearer",
  "scope": "User.Read profile openid email",
  "expires_in": 4557,
  "access_token": "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkJuUXdJd0ZFc...",
  "refresh_token": "0.ARoAv4j5cvGGr0GRqy180BHbR8lB8cvIWGtHpawGN..."
}
```

|Parameter  | Description  |
|---------|---------|
|token_type     |Indicates the token type value. The only type that Azure AD supports is Bearer.         |
|scope     |A space separated list of the Microsoft Graph permissions that the access_token is valid for.         |
|expires_in     |How long the access token is valid (in seconds).         |
|access_token     |The requested access token. Your app can use this token to call Microsoft Graph.         |
|refresh_token     |An OAuth 2.0 refresh token. Your app can use this token to acquire extra access tokens after the current access token expires. Refresh tokens are long-lived, and can be used to retain access to resources for extended periods of time.|

For more information, see [Generate refresh tokens](/graph/auth-v2-user#2-get-authorization).

OSDU&trade; is a trademark of The Open Group.

## Next steps
To learn more about how to use the generated refresh token, follow the section below:
> [!div class="nextstepaction"]
> [How to convert segy to ovds](how-to-convert-segy-to-zgy.md)
