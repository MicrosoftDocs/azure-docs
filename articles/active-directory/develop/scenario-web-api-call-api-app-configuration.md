---
title: Configure a web API that calls web APIs | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a web API that calls web APIs (app's code configuration)
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/05/2020
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
---

# A web API that calls web APIs: Code configuration

After you've registered your web API, you can configure the code for the application.

The code that you use to configure your web API so that it calls downstream web APIs builds on top of the code that's used to protect a web API. For more information, see [Protected web API: App configuration](scenario-protected-web-api-app-configuration.md).

# [ASP.NET Core](#tab/aspnetcore)

## Client secrets or client certificates

Given that your web API now calls a downstream web API, you need to provide a client secret or client certificate in the *appsettings.json* file.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-api-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    "TenantId": "common"
  
   // To call an API
   "ClientSecret": "[Copy the client secret added to the app from the Azure portal]",
   "ClientCertificates": [
  ]
 }
}
```

Instead of a client secret, you can provide a client certificate. The following code snippet shows using a certificate stored in Azure Key Vault.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "[Client_id-of-web-api-eg-2ec40e65-ba09-4853-bcde-bcb60029e596]",
    "TenantId": "common"
  
   // To call an API
   "ClientCertificates": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
  ]
 }
}
```

Microsoft.Identity.Web provides several ways to describe certificates, both by configuration or by code. For details, see [Microsoft.Identity.Web wiki - Using certificates](https://github.com/AzureAD/microsoft-identity-web/wiki/Using-certificates) on GitHub.

## Startup.cs

Using Microsoft.Identity.Web, if you want your web API to call downstream web APIs, add the `.EnableTokenAcquisitionToCallDownstreamApi()` line after `.AddMicrosoftIdentityWebApi(Configuration)`, and then choose a token cache implementation, for example `.AddInMemoryTokenCaches()`, in *Startup.cs*:

```csharp
using Microsoft.Identity.Web;

public class Startup
{
  ...
  public void ConfigureServices(IServiceCollection services)
  {
   // ...
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(Configuration, "AzureAd")
                .EnableTokenAcquisitionToCallDownstreamApi()
                .AddInMemoryTokenCaches();
  // ...
  }
  // ...
}
```

As with web apps, you can choose various token cache implementations. For details, see [Microsoft identity web wiki - Token cache serialization](https://aka.ms/ms-id-web/token-cache-serialization) on GitHub.

# [Java](#tab/java)

The On-behalf-of (OBO) flow is used to obtain a token to call the downstream web API. In this flow, your web API receives a bearer token with user delegated permissions from the client application and then exchanges this token for another access token to call the downstream web API.

The code below uses Spring Security framework's `SecurityContextHolder` in the web API to get the validated bearer token. It then uses the MSAL Java library to obtain a token for downstream API using the `acquireToken` call with `OnBehalfOfParameters`. MSAL caches the token so that subsequent calls to the API can use `acquireTokenSilently` to get the cached token.

```Java
@Component
class MsalAuthHelper {

    @Value("${security.oauth2.client.authority}")
    private String authority;

    @Value("${security.oauth2.client.client-id}")
    private String clientId;

    @Value("${security.oauth2.client.client-secret}")
    private String secret;

    @Autowired
    CacheManager cacheManager;

    private String getAuthToken(){
        String res = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication != null){
            res = ((OAuth2AuthenticationDetails) authentication.getDetails()).getTokenValue();
        }
        return res;
    }

    String getOboToken(String scope) throws MalformedURLException {
        String authToken = getAuthToken();

        ConfidentialClientApplication application =
                ConfidentialClientApplication.builder(clientId, ClientCredentialFactory.create(secret))
                        .authority(authority).build();

        String cacheKey = Hashing.sha256()
                .hashString(authToken, StandardCharsets.UTF_8).toString();

        String cachedTokens = cacheManager.getCache("tokens").get(cacheKey, String.class);
        if(cachedTokens != null){
            application.tokenCache().deserialize(cachedTokens);
        }

        IAuthenticationResult auth;
        SilentParameters silentParameters =
                SilentParameters.builder(Collections.singleton(scope))
                        .build();
        auth = application.acquireTokenSilently(silentParameters).join();

        if (auth == null){
            OnBehalfOfParameters parameters =
                    OnBehalfOfParameters.builder(Collections.singleton(scope),
                            new UserAssertion(authToken))
                            .build();

            auth = application.acquireToken(parameters).join();
        }

        cacheManager.getCache("tokens").put(cacheKey, application.tokenCache().serialize());

        return auth.accessToken();
    }
}
```

# [Python](#tab/python)

The On-behalf-of (OBO) flow is used to obtain a token to call the downstream web API. In this flow, your web API receives a bearer token with user delegated permissions from the client application and then exchanges this token for another access token to call the downstream web API.

A Python web API will need to use some middleware to validate the bearer token received from the client. The web API can then obtain the access token for downstream API using MSAL Python library by calling the [`acquire_token_on_behalf_of`](https://msal-python.readthedocs.io/en/latest/?badge=latest#msal.ConfidentialClientApplication.acquire_token_on_behalf_of) method. For an example of using this API, see the [test code for the microsoft-authentication-library-for-python on GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/1.2.0/tests/test_e2e.py#L429-L472). Also see the discussion of [issue 53](https://github.com/AzureAD/microsoft-authentication-library-for-python/issues/53) in that same repository for an approach that bypasses the need for a middle-tier application.

---

You can also see an example of OBO flow implementation in [Node.js and Azure Functions](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-onbehalfof-azurefunctions/blob/master/MiddleTierAPI/MyHttpTrigger/index.js#L61).

## Protocol

For more information about the OBO protocol, see [Microsoft identity platform and OAuth 2.0 On-Behalf-Of flow](./v2-oauth2-on-behalf-of-flow.md).

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md)