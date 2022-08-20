---
title: How to generate a refresh token #Required; page title is displayed in search results. Include the brand.
description: This article describes how to generate a refresh token #Required; article description that is displayed in search results. 
author: elhalper #Required; your GitHub user alias, with correct capitalization.
ms.author: elhalper #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 06/06/2022 #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to generate a refresh token

## Authorization Code

To generate a refresh token, you first need to obtain an authorization code from your application registration. To do so, first ensure that your application registration has a reply/redirect URL. To do this, navigate to the "Authentication" pane of your app registration in the Azure portal. If there's no redirect URIs specified, add a platform, select "Web", then add `http://localhost:8080`, and select save.

Next, navigate the following URL in a browser, replacing `{Tenant ID}` with your Azure `Directory (tenant) ID` and `{AppReg ID}` with your `Application (client) ID`:

```bash
https://login.microsoftonline.com/{Tenant ID}/oauth2/v2.0/authorize?client_id={AppReg ID}&response_type=code&redirect_uri=http%3a%2f%2flocalhost%3a8080&response_mode=query&scope={AppReg ID}%2f.default&state=12345&sso_reload=true
```

The browser will redirect to `http://localhost:8080/?code={authorization code}&state=...` upon successful authentication. **Note:** The browser may say that the site can't be reached, but **it should still have the authorization code in the URL bar.**

### Sample response

In the response you'll, get an authorization code in the URL bar.

```bash
http://localhost:8080/?code=0.BRoAv4j5cvGGr0...au78f&state=12345&session....
```

Copy the code between `code=` and `&state`.

> [!WARNING]
> Running the URL in Postman won't work as it requires extra configuration for token retrieval.

## Refresh Token

Next run the following command in a command line to obtain the refresh token. Make sure to replace `{AppReg ID}` with your Application Registration ID, `{authorization code}` with the code retrieved in the previous step, `{AppReg Secret}` with a secret generated in your Application Registration and `{Tenant ID}` with your Azure AD tenant ID.

```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id={AppReg ID}&scope={AppReg ID}%2f.default+openid+profile+offline_access&code={authorization code}&redirect_uri=http%3A%2F%2Flocalhost%3a8080&grant_type=authorization_code&client_secret={AppReg Secret}' 'https://login.microsoftonline.com/{Tenant ID}/oauth2/v2.0/token'
```

#### Sample response

```bash
{
  "token_type": "Bearer",
  "scope": "User.Read profile openid email",
  "expires_in": 4557,
  "ext_expires_in": 4557,
  "access_token": "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkJuUXdJd0ZFc...",
  "refresh_token": "0.ARoAv4j5cvGGr0GRqy180BHbR8lB8cvIWGtHpawGN...",
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCdrQ..."
}
```
Copy the `refresh token`, which will be used by the `data-loader` script for authentication purposes.

For more information, see [Generate refresh tokens](/en-us/graph/auth-v2-user#2-get-authorization).

## Alternative Options

If you're struggling with getting a proper authorization token, follow the steps in [this documentation](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/tree/master/tools/rest/osduauth) to locally run a static webpage that generates the refresh token for you. Once it's running, fill in the correct values in the UI of the static webpage (they may be filled in with the wrong values to start). Use the UI to generate a refresh token.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to convert segy to ovds](/how-to-convert-segy-to-ovds.md)