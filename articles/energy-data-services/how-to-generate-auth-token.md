---
title: Generate a refresh token for Azure Data Manager for Energy
description: This article describes how to generate an auth token.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: how-to
ms.date: 01/03/2024
ms.custom: template-how-to
#Customer intent: As a developer, I want to learn how to generate an auth token.
---

# Generate an auth token

In this article, you learn how to generate the service principal auth token, a user's auth token, and a user's refresh token.

## Register your app with Microsoft Entra ID

1. To provision the Azure Data Manager for Energy platform, you must register your app on the [Azure portal app registration page](https://go.microsoft.com/fwlink/?linkid=2083908). You can use either a Microsoft account or a work or school account to register an app. For steps on how to configure, see [Register your app documentation](../active-directory/develop/quickstart-register-app.md#register-an-application).
1. In the app overview section, if there are no redirect URIs specified, you can select **Add a platform** > **Web**, add `http://localhost:8080`, and select **Save**.
  
   :::image type="content" source="media/how-to-generate-auth-token/app-registration-uri.png" alt-text="Screenshot that shows adding the URI to the app.":::


## Fetch parameters

You can also find the parameters after the app is registered on the Azure portal.

### Find tenant-id

1. Go to the Microsoft Entra account for your organization. You can search for **Microsoft Entra ID** in the Azure portal's search bar.
1. On the **Overview** tab, under the **Basic information** section, find **Tenant ID**.
1. Copy the `tenant-ID` value and paste it into an editor to be used later.  

   :::image type="content" source="media/how-to-generate-auth-token/azure-active-directory.png" alt-text="Screenshot that shows searching for Microsoft Entra ID.":::

   :::image type="content" source="media/how-to-generate-auth-token/tenant-id.png" alt-text="Screenshot that shows finding the tenant ID.":::

### Find client-id

A `client-id` is the same value that you use to register your application during the provisioning of your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md). It's often referred to as `app-id`.

1. Go to the Azure Data Manager for Energy **Overview** page. On the **Essentials** pane, find **client ID**.
1. Copy the `client-id` value and paste it into an editor to be used later.
1. Currently, one Azure Data Manager for Energy instance allows one `app-id` to be associated with one instance.

   > [!IMPORTANT]
   > The `client-id` that's passed as a value in the Entitlement API calls needs to be the same one that was used for provisioning your Azure Data Manager for Energy instance.

   :::image type="content" source="media/how-to-generate-auth-token/client-id-or-app-id.png" alt-text="Screenshot that shows finding the client ID for your registered app.":::

### Find client-secret

A `client-secret` is a string value your app can use in place of a certificate to identify itself. It's sometimes referred to as an application password.

1. Go to **App registrations**.
1. Under the **Manage** section, select **Certificates & secrets**.
1. Select **New client secret** to create a client secret for the client ID that you used to create your Azure Data Manager for Energy instance.
1. Record the secret's **Value** for later use in your client application code.
   
   The access token of the `app-id` and `client-secret` has the infrastructure administrator access to the instance.

   > [!CAUTION]
   > Don't forget to record the secret's value. This secret value is never displayed again after you leave this page for client secret creation.

   :::image type="content" source="media/how-to-generate-auth-token/client-secret.png" alt-text="Screenshot that shows finding the client secret.":::

### Find redirect-uri
The `redirect-uri` of your app, where your app sends and receives the authentication responses. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL encoded.

1. Go to **App registrations**.
1. Under the **Manage** section, select **Authentication**.
1. Fetch the `redirect-uri` (or reply URL) for your app to receive responses from Microsoft Entra ID.

 :::image type="content" source="media/how-to-generate-auth-token/redirect-uri.png" alt-text="Screenshot that shows redirect-uri.":::

### Find the adme-url for your Azure Data Manager for Energy instance

1. Create an [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) using the `client-id` generated above.
1. Go to your Azure Data Manager for Energy **Overview** page on the Azure portal.
1. On the **Essentials** pane, copy the URI.

   :::image type="content" source="media/how-to-generate-auth-token/endpoint-url.png" alt-text="Screenshot that shows finding the URI for the Azure Data Manager for Energy instance.":::

### Find data-partition-id

You have two ways to get the list of data partitions in your Azure Data Manager for Energy instance.

- **Option 1**: Under the **Advanced** section of your Azure Data Manager for Energy UI, go to the **Data Partitions** menu item.

   :::image type="content" source="media/how-to-generate-auth-token/data-partition-id.png" alt-text="Screenshot that shows finding the data-partition-id from the Azure Data Manager for Energy instance.":::

- **Option 2**: On the **Essentials** pane of your Azure Data Manager for Energy **Overview** page, underneath the **Data Partitions** field, select **view**.

   :::image type="content" source="media/how-to-generate-auth-token/data-partition-id-second-option.png" alt-text="Screenshot that shows finding the data-partition-id from the Azure Data Manager for Energy instance Overview page.":::

   :::image type="content" source="media/how-to-generate-auth-token/data-partition-id-second-option-step-2.png" alt-text="Screenshot that shows finding the data-partition-id from the Azure Data Manager for Energy instance Overview page with the data partitions.":::

### Find domain
By default, the `domain` is dataservices.energy for all the Azure Data Manager for Energy instances.

## Generate the client-id auth token

Run the following curl command in [Azure Cloud Bash](../cloud-shell/overview.md) after you replace the placeholder values with the corresponding values found earlier in the previous steps. The access token in the response is the `client-id` auth token.

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

## Generate the user auth token

Generating a user's auth token is a two-step process.

### Get the authorization-code

The first step to get an access token for many OpenID Connect (OIDC) and OAuth 2.0 flows is to redirect the user to the Microsoft identity platform `/authorize` endpoint. Microsoft Entra ID signs the user in and requests their consent for the permissions your app requests. In the authorization code grant flow, after consent is obtained, Microsoft Entra ID returns an authorization code to your app that it can redeem at the Microsoft identity platform `/token` endpoint for an access token.

1. Prepare the request format using the parameters.
   ```bash
   https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/authorize?client_id=<client-id>
   &response_type=code
   &redirect_uri=<redirect-uri>
   &response_mode=query
   &scope=<client-id>%2f.default&state=12345&sso_reload=true
   ```
2. After you replace the parameters, you can paste the request in the URL of any browser and select Enter.
3. Sign in to your Azure portal if you aren't signed in already.
4. You might see the "Hmmm...can't reach this page" error message in the browser. You can ignore it.

   :::image type="content" source="media/how-to-generate-auth-token/localhost-redirection-error.png" alt-text="Screenshot of localhost redirection.":::

5. The browser redirects to `http://localhost:8080/?code={authorization code}&state=...` upon successful authentication.
6. Copy the response from the URL bar of the browser and fetch the text between `code=` and `&state`.
   ```bash
   http://localhost:8080/?code=0.BRoAv4j5cvGGr0...au78f&state=12345&session....
   ```

7. Keep this `authorization-code` handy for future use.

   |Parameter| Description|
   | --- | --- |
   |code|The authorization code that the app requested. The app can use the authorization code to request an access token for the target resource. Authorization codes are short lived. Typically, they expire after about 10 minutes.|
   |state|If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. This check helps to detect [CSRF attacks](https://tools.ietf.org/html/rfc6749#section-10.12) against the client.|
   |session_state|A unique value that identifies the current user session. This value is a GUID, but it should be treated as an opaque value that's passed without examination.|

> [!WARNING]
> Running the URL in Postman won't work because it requires extra configuration for token retrieval.

### Get an auth token and a refresh token

The second step is to get the auth token and the refresh token. Your app uses the authorization code received in the previous step to request an access token by sending a POST request to the `/token` endpoint.

#### Request format

```bash
  curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id=<client-id>
  &scope=<client-id>%2f.default openid profile offline_access
  &code=<authorization-code>
  &redirect_uri=<redirect-uri>
  &grant_type=authorization_code
  &client_secret=<client-secret>' 'https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token'
```

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
|scope     |A space-separated list of the Microsoft Graph permissions that the access token is valid for.         |
|expires_in     |How long the access token is valid (in seconds).         |
|access_token     |The requested access token. Your app can use this token to call Microsoft Graph.         |
|refresh_token     |An OAuth 2.0 refresh token. Your app can use this token to acquire extra access tokens after the current access token expires. Refresh tokens are long-lived and can be used to retain access to resources for extended periods of time.|

For more information on generating a user access token and using a refresh token to generate a new access token, see [Generate refresh tokens](/graph/auth-v2-user#2-get-authorization).

OSDU&reg; is a trademark of The Open Group.

## Next steps

To learn more about how to use the generated refresh token, see:
> [!div class="nextstepaction"]
> [How to convert segy to ovds](how-to-convert-segy-to-zgy.md)
