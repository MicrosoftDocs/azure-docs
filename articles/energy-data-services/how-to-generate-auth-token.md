---
title: How to generate a refresh token for Microsoft Azure Data Manager for Energy
description: This article describes how to generate an auth token
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: how-to
ms.date: 01/03/2024
ms.custom: template-how-to
#Customer intent: As a developer, I want to learn how to generate an auth token
---

# How to generate auth token

In this article, you learn how to generate the service principal auth token, user's auth token and user's refresh token. 

## Register your app with Microsoft Entra ID
1. To provision the Azure Data Manager for Energy platform, you must register your app in the [Azure portal app registration page](https://go.microsoft.com/fwlink/?linkid=2083908). You can use either a Microsoft account or a work or school account to register an app. For steps on how to configure, see [Register your app documentation](../active-directory/develop/quickstart-register-app.md#register-an-application).
2. In the app overview section, if there's no redirect URIs specified, you can add a platform, select "Web", add `http://localhost:8080`, and select save.
  
:::image type="content" source="media/how-to-generate-auth-token/app-registration-uri.png" alt-text="Screenshot of adding URI to the app.":::

3. Fetch the `redirect-uri` (or reply URL) for your app to receive responses from Microsoft Entra ID.


## Fetch parameters
You can also find the parameters once the app is registered on the Azure portal. 

#### Find `tenant-id`
1. Navigate to the Microsoft Entra account for your organization. You can search for "Microsoft Entra ID" in the Azure portal's search bar.
2. Locate `tenant-id` under the basic information section in the *Overview* tab.
3. Copy the `tenant-id` and paste it into an editor to be used later.  

:::image type="content" source="media/how-to-generate-auth-token/azure-active-directory.png" alt-text="Screenshot of search for Microsoft Entra ID.":::

:::image type="content" source="media/how-to-generate-auth-token/tenant-id.png" alt-text="Screenshot of finding the tenant-id.":::

#### Find `client-id`
It's the same value that you use to register your application during the provisioning of your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md). It is often referred to as `app-id`.

1. Find the `client-id` in the *Essentials* pane of Azure Data Manager for Energy *Overview* page.
2. Copy the `client-id` and paste it into an editor to be used later.
3. Currently, one Azure Data Manager for Energy instance allows one app-id to be as associated with one instance.

> [!IMPORTANT]
> The 'client-id' that is passed as values in the entitlement API calls needs to be the same that was used for provisioning your Azure Data Manager for the Energy instance.

:::image type="content" source="media/how-to-generate-auth-token/client-id-or-app-id.png" alt-text="Screenshot of finding the client-id for your registered App.":::

#### Find `client-secret`
A `client-secret` is a string value your app can use in place of a certificate to identify itself. It's sometimes referred to as an application password. 

1. Navigate to *App Registrations*.
2. Open 'Certificates & secrets' under the *Manage* section.
3. Create a `client-secret` for the `client-id` that you used to create your Azure Data Manager for Energy instance.
4. Add one now by clicking on *New Client Secret*.
5. Record the `secret's value` for later use in your client application code.
6. The access token of the `app-id` and client secret has the Infra Admin access to the instance.

> [!CAUTION]
> Don't forget to record the secret's value. This secret value is never displayed again after you leave this page of 'client secret' creation.

:::image type="content" source="media/how-to-generate-auth-token/client-secret.png" alt-text="Screenshot of finding the client secret.":::

#### Find the `URL` for your Azure Data Manager for Energy instance
1. Create [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
2. Navigate to your Azure Data Manager for Energy *Overview* page on the Azure portal.
3. Copy the URI from the essentials pane. 

:::image type="content" source="media/how-to-generate-auth-token/endpoint-url.png" alt-text="Screenshot of finding the URL from Azure Data Manager for Energy instance.":::

#### Find the `data-partition-id` 
You have two ways to get the list of data partitions in your Azure Data Manager for Energy instance.
- One option is to navigate the *Data Partitions* menu item under the Advanced section of your Azure Data Manager for Energy UI.

:::image type="content" source="media/how-to-generate-auth-token/data-partition-id.png" alt-text="Screenshot of finding the data-partition-id from the Azure Data Manager for Energy instance.":::

- Another option is to click on the *view* below the *data partitions* field in the essentials pane of your Azure Data Manager for Energy *Overview* page. 

:::image type="content" source="media/how-to-generate-auth-token/data-partition-id-second-option.png" alt-text="Screenshot of finding the data-partition-id from the Azure Data Manager for Energy instance overview page.":::

:::image type="content" source="media/how-to-generate-auth-token/data-partition-id-second-option-step-2.png" alt-text="Screenshot of finding the data-partition-id from the Azure Data Manager for Energy instance overview page with the data partitions.":::

## Generate client-id auth token

Run the below curl command in Azure Cloud Bash after replacing the placeholder values with the corresponding values found earlier in the above steps. The access token in the response is the client-id auth token.
 
**Request format**

```bash
curl --location --request POST 'https://login.microsoftonline.com/<tenant-id>/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=<client-id>.default' \
--data-urlencode 'client_id=<client-id>' \
--data-urlencode 'client_secret=<client-secret>' \
--data-urlencode 'resource=<client-id>'
```

**Sample response**

```JSON
    {
        "token_type": "Bearer",
        "expires_in": 86399,
        "ext_expires_in": 86399,
        "access_token": "abcdefgh123456............."
    }
```

## Generate user auth token
Generating a user's auth token is a two step process. 

### Get authorization code
The first step to getting an access token for many OpenID Connect (OIDC) and OAuth 2.0 flows is to redirect the user to the Microsoft identity platform `/authorize` endpoint. Microsoft Entra ID signs the user in and requests their consent for the permissions your app requests. In the authorization code grant flow, after consent is obtained, Microsoft Entra ID returns an `authorization_code` to your app that it can redeem at the Microsoft identity platform `/token` endpoint for an access token.

1. After replacing the parameters, you can paste the request in the URL of any browser and hit enter.
2. It asks you to log in to your Azure portal if not logged in already.
3. You might see 'can't reach this page' error in the browser. You can ignore that.
   
:::image type="content" source="media/how-to-generate-auth-token/localhost-redirection-error.png" alt-text="Screenshot of localhost redirection.":::

4. The browser redirects to `http://localhost:8080/?code={authorization code}&state=...` upon successful authentication.
5. Copy the response from the URL bar of the browser and fetch the text between `code=` and `&state`
6. This is the `authorization_code` to keep handy for future use.
   
#### Request format
 ```bash
  https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize?client_id={client-id}
  &response_type=code
  &redirect_uri={redirect-uri}
  &response_mode=query
  &scope={client-id}%2f.default&state=12345&sso_reload=true
```
  
| Parameter | Required? | Description |
| --- | --- | --- |
|tenant-id|Required|Name of your Microsoft Entra tenant|
| client-id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| response_type |Required |The response type, which must include `code` for the authorization code flow. You can receive an ID token if you include it in the response type, such as `code+id_token`, and in this case, the scope needs to include `openid`.|
| redirect_uri |Required |The redirect URI of your app, where your app sends and receives the authentication responses. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL-encoded. |
| scope |Required |A space-separated list of scopes. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens. The `offline_access` scope is optional for web applications. It indicates that your application needs a *refresh token* for extended access to resources. The client-id indicates the token issued are intended for use by Azure AD B2C registered client. The `https://{tenant-name}/{app-id-uri}/{scope}` indicates a permission to protected resources, such as a web API. |
| response_mode |Recommended |The method that you use to send the resulting authorization code back to your app. It can be `query`, `form_post`, or `fragment`. |
| state |Recommended |A value included in the request that can be a string of any content that you want to use. Usually, a randomly generated unique value is  used, to prevent cross-site request forgery attacks. The state also is used to encode information about the user's state in the app before the authentication request occurred. For example, the page the user was on, or the user flow that was being executed. |

#### Sample response
```bash
http://localhost:8080/?code=0.BRoAv4j5cvGGr0...au78f&state=12345&session....
```
> [!NOTE] 
> The browser may say that the site can't be reached, but it should still have the authorization code in the URL bar.

|Parameter| Description|
| --- | --- |
|code|The authorization_code that the app requested. The app can use the authorization code to request an access token for the target resource. Authorization_codes are short lived, typically they expire after about 10 minutes.|
|state|If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. This check helps to detect [Cross-Site Request Forgery (CSRF) attacks](https://tools.ietf.org/html/rfc6749#section-10.12) against the client.|
|session_state|A unique value that identifies the current user session. This value is a GUID, but should be treated as an opaque value that is passed without examination.|

> [!WARNING]
> Running the URL in Postman won't work as it requires extra configuration for token retrieval.

### Get an auth token and refresh token
The second step is to get the auth token and refresh token. Your app uses the `authorization_code` received in the previous step to request an access token by sending a POST request to the `/token` endpoint.

#### Request format

```bash
  curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id={client-id}
  &scope={client-id}%2f.default openid profile offline_access
  &code={authorization code}
  &redirect_uri=http%3A%2F%2Flocalhost%3a8080
  &grant_type=authorization_code
  &client_secret={client-secret}' 'https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token'
```
|Parameter  |Required  |Description  |
|---------|---------|---------|
|tenant     | Required        | The {tenant-id} value in the path of the request can be used to control who can sign into the application.|
|client_id     | Required         | The application ID assigned to your app upon registration         |
|scope     | Required        | A space-separated list of scopes. The scopes that your app requests in this leg must be equivalent to or a subset of the scopes that it requested in the first (authorization) leg. If the scopes specified in this request span multiple resource server, then the v2.0 endpoint returns a token for the resource specified in the first scope.        |
|code    |Required         |The authorization_code that you acquired in the first step of the flow.         |
|redirect_uri     | Required        |The same redirect_uri value that was used to acquire the authorization_code.         |
|grant_type     | Required        | Must be authorization_code for the authorization code flow.        |
|client_secret | Required | The client secret that you created in the app registration portal for your app. It shouldn't be used in a native app, because client_secrets can't be reliably stored on devices. It's required for web apps and web APIs, which have the ability to store the client_secret securely on the server side.|

#### Sample response

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
|token_type     |Indicates the token type value. The only type that Microsoft Entra ID supports is Bearer.         |
|scope     |A space separated list of the Microsoft Graph permissions that the access_token is valid for.         |
|expires_in     |How long the access token is valid (in seconds).         |
|access_token     |The requested access token. Your app can use this token to call Microsoft Graph.         |
|refresh_token     |An OAuth 2.0 refresh token. Your app can use this token to acquire extra access tokens after the current access token expires. Refresh tokens are long-lived, and can be used to retain access to resources for extended periods of time.|

For more information on generating user access token and using refresh token to generate new access token, see the [Generate refresh tokens](/graph/auth-v2-user#2-get-authorization).




OSDU&trade; is a trademark of The Open Group.

## Next steps
To learn more about how to use the generated refresh token, follow the section below:
> [!div class="nextstepaction"]
> [How to convert segy to ovds](how-to-convert-segy-to-zgy.md)
