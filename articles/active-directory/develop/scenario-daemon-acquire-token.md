---
title: Daemon app calling web APIs (acquiring tokens for the app) - Microsoft identity platform
description: Learn how to build a daemon app that calls web APIs (acquiring tokens)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Daemon app that calls web APIs - acquire a token

Once the confidential client application is constructed, you can acquire a token for the app by calling ``AcquireTokenForClient``, passing the scope, and forcing or not a refresh of the token.

## Scopes to request

The scope to request for a client credential flow is the name of the resource followed by `/.default`. This notation tells Azure AD to use the **application level permissions** declared statically during the application registration. Also, as seen previously, these API permissions must be granted by a tenant administrator

### .NET

```CSharp
ResourceId = "someAppIDURI";
var scopes = new [] {  ResourceId+"/.default"};
```

### Python

In MSAL.Python, the configuration file would look like the following code snippet:

```Python
{
    "authority": "https://login.microsoftonline.com/organizations",
    "client_id": "your_client_id",
    "secret": "This is a sample only. You better NOT persist your password."
    "scope": ["https://graph.microsoft.com/.default"]
}
```

### Java

```Java
public final static String KEYVAULT_DEFAULT_SCOPE = "https://vault.azure.net/.default";
```

### All

The scope used for client credentials should always be resourceId+"/.default"

### Case of v1.0 resources

> [!IMPORTANT]
> For MSAL (v2.0 endpoint) asking an access token for a resource accepting a v1.0 access token, Azure AD parses the desired audience from the requested scope by taking everything before the last slash and using it as the resource identifier.
> Therefore if, like Azure SQL (**https://database.windows.net**) the resource expects an audience ending with a slash (for Azure SQL: `https://database.windows.net/`), you'll need to request a scope of `https://database.windows.net//.default` (note the double slash). See also MSAL.NET issue [#747](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/747): Resource url's trailing slash is omitted, which caused sql auth failure.

## AcquireTokenForClient API

### .NET

```CSharp
using Microsoft.Identity.Client;

// With client credentials flows the scopes is ALWAYS of the shape "resource/.default", as the
// application permissions need to be set statically (in the portal or by PowerShell), and then granted by
// a tenant administrator
string[] scopes = new string[] { "https://graph.microsoft.com/.default" };

AuthenticationResult result = null;
try
{
 result = await app.AcquireTokenForClient(scopes)
                  .ExecuteAsync();
}
catch (MsalUiRequiredException ex)
{
    // The application does not have sufficient permissions
    // - did you declare enough app permissions in during the app creation?
    // - did the tenant admin needs to grant permissions to the application.
}
catch (MsalServiceException ex) when (ex.Message.Contains("AADSTS70011"))
{
    // Invalid scope. The scope has to be of the form "https://resourceurl/.default"
    // Mitigation: change the scope to be as expected !
}
```

#### Application token cache

In MSAL.NET, `AcquireTokenForClient` uses the **application token cache** (All the other AcquireTokenXX methods use the user token cache)
Don't call `AcquireTokenSilent` before calling `AcquireTokenForClient` as `AcquireTokenSilent` uses the **user** token cache. `AcquireTokenForClient` checks the **application** token cache itself and updates it.

### Python

```Python
# Firstly, looks up a token from cache
# Since we are looking for token for the current app, NOT for an end user,
# notice we give account parameter as None.
result = app.acquire_token_silent(config["scope"], account=None)

if not result:
    logging.info("No suitable token exists in cache. Let's get a new one from AAD.")
    result = app.acquire_token_for_client(scopes=config["scope"])
```

### Java

```Java
ClientCredentialParameters parameters = ClientCredentialParameters
        .builder(Collections.singleton(KEYVAULT_DEFAULT_SCOPE))
        .build();

CompletableFuture<AuthenticationResult> future = cca.acquireToken(parameters);

// You can complete the future in many different ways. Here we use .get() for simplicity
AuthenticationResult result = future.get();
```

### Protocol

If you don't have yet a library for your language of choice, you might want to use  the protocol directly:

#### First case: Access token request with a shared secret

```Text
POST /{tenant}/oauth2/v2.0/token HTTP/1.1           //Line breaks for clarity
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=535fb089-9ff3-47b6-9bfb-4f1264799865
&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_secret=qWgdYAmab0YSkuL1qKv5bPX
&grant_type=client_credentials
```

#### Second case: Access token request with a certificate

```Text
POST /{tenant}/oauth2/v2.0/token HTTP/1.1               // Line breaks for clarity
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_id=97e0a5b7-d745-40b6-94fe-5f77d35c6e05
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg
&grant_type=client_credentials
```

### Learn more about the protocol

For more information, see the protocol documentation: [Azure Active Directory v2.0 and the OAuth 2.0 client credentials flow](v2-oauth2-client-creds-grant-flow.md).

## Troubleshooting

### Did you use the resource/.default scope?

If you get an error message telling you that you used an invalid scope, you probably didn't use the `resource/.default` scope.

### Did you forget to provide admin consent? Daemon apps need it!

If you get an error when calling the API **Insufficient privileges to complete the operation**, the tenant administrator needs to grant permissions to the application. See step 6 of Register the client app above.
You'll typically see and error like the following error description:

```JSon
Failed to call the web API: Forbidden
Content: {
  "error": {
    "code": "Authorization_RequestDenied",
    "message": "Insufficient privileges to complete the operation.",
    "innerError": {
      "request-id": "<guid>",
      "date": "<date>"
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Daemon app - calling a web API](scenario-daemon-call-api.md)