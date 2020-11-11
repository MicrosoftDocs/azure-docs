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
ms.date: 09/26/2020
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
---

# A web API that calls web APIs: Code configuration

After you've registered your web API, you can configure the code for the application.

The code that you use to configure your web API so that it calls downstream web APIs builds on top of the code that's used to protect a web API. For more information, see [Protected web API: App configuration](scenario-protected-web-api-app-configuration.md).

# [ASP.NET Core](#tab/aspnetcore)

## Microsoft.Identity.Web

Microsoft recommends that you use the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) NuGet package when developing an ASP.NET Core protected API calling downstream web APIs. See [Protected web API: Code configuration | Microsoft.Identity.Web](scenario-protected-web-api-app-configuration.md#microsoftidentityweb) for a quick presentation of that library in the context of a web API.

## Client secrets or client certificates

Given that your web API now calls a downstream web API, you need to provide a client secret or client certificate in the *appsettings.json* file. You can also add a section that specifies:

- The URL of the downstream web API
- The scopes required for calling the API

In the following example, the `GraphBeta` section specifies these settings.

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
 },
 "GraphBeta": {
    "BaseUrl": "https://graph.microsoft.com/beta",
    "Scopes": "user.read"
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
  },
  "GraphBeta": {
    "BaseUrl": "https://graph.microsoft.com/beta",
    "Scopes": "user.read"
  }
}
```

Microsoft.Identity.Web provides several ways to describe certificates, both by configuration or by code. For details, see [Microsoft.Identity.Web wiki - Using certificates](https://github.com/AzureAD/microsoft-identity-web/wiki/Using-certificates) on GitHub.

## Startup.cs

Your web API will need to acquire a token for the downstream API. You specify it by adding the `.EnableTokenAcquisitionToCallDownstreamApi()` line after `.AddMicrosoftIdentityWebApi(Configuration)`. This line exposes the `ITokenAcquisition` service, that you can use in your controller/pages actions. However, as you'll see in the next two bullet points, you can do even simpler. You'll also need to choose a token cache implementation, for example `.AddInMemoryTokenCaches()`, in *Startup.cs*:

```csharp
using Microsoft.Identity.Web;

public class Startup
{
  // ...
  public void ConfigureServices(IServiceCollection services)
  {
  // ...
  services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddMicrosoftIdentityWebApi(Configuration, Configuration.GetSection("AzureAd"))
            .EnableTokenAcquisitionToCallDownstreamApi()
            .AddInMemoryTokenCaches();
   // ...
  }
  // ...
}
```

If you don't want to acquire the token yourself, *Microsoft.Identity.Web* provides two mechanisms for calling a downstream web API from another API. The option you choose depends on whether you want to call Microsoft Graph or another API.

### Option 1: Call Microsoft Graph

If you want to call Microsoft Graph, Microsoft.Identity.Web enables you to directly use the `GraphServiceClient` (exposed by the Microsoft Graph SDK) in your API actions. To expose Microsoft Graph:

1. Add the [Microsoft.Identity.Web.MicrosoftGraph](https://www.nuget.org/packages/Microsoft.Identity.Web.MicrosoftGraph) NuGet package to your project.
1. Add `.AddMicrosoftGraph()` after `.EnableTokenAcquisitionToCallDownstreamApi()` in the *Startup.cs* file. `.AddMicrosoftGraph()` has several overrides. Using the override that takes a configuration section as a parameter, the code becomes:

```csharp
using Microsoft.Identity.Web;

public class Startup
{
  // ...
  public void ConfigureServices(IServiceCollection services)
  {
  // ...
  services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddMicrosoftIdentityWebApi(Configuration, Configuration.GetSection("AzureAd"))
            .EnableTokenAcquisitionToCallDownstreamApi()
               .AddMicrosoftGraph(Configuration.GetSection("GraphBeta"))
            .AddInMemoryTokenCaches();
   // ...
  }
  // ...
}
```

### Option 2: Call a downstream web API other than Microsoft Graph

To call a downstream API other than Microsoft Graph, *Microsoft.Identity.Web* provides `.AddDownstreamWebApi()`, which requests tokens and calls the downstream web API.

```csharp
using Microsoft.Identity.Web;

public class Startup
{
  // ...
  public void ConfigureServices(IServiceCollection services)
  {
  // ...
  services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddMicrosoftIdentityWebApi(Configuration, "AzureAd")
            .EnableTokenAcquisitionToCallDownstreamApi()
               .AddDownstreamWebApi("MyApi", Configuration.GetSection("GraphBeta"))
            .AddInMemoryTokenCaches();
   // ...
  }
  // ...
}
```

As with web apps, you can choose various token cache implementations. For details, see [Microsoft identity web - Token cache serialization](https://aka.ms/ms-id-web/token-cache-serialization) on GitHub.

The following image shows the various possibilities of *Microsoft.Identity.Web* and their impact on the *Startup.cs* file:

:::image type="content" source="media/scenarios/microsoft-identity-web-startup-cs.svg" alt-text="Block diagram showing service configuration options in startup dot C S for calling a web API and specifying a token cache implementation":::

> [!NOTE]
> To fully understand the code examples here, you need to be familiar with [ASP.NET Core fundamentals](/aspnet/core/fundamentals), and in particular with [dependency injection](/aspnet/core/fundamentals/dependency-injection) and [options](/aspnet/core/fundamentals/configuration/options).

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

You can also see an example of OBO flow implementation in [Node.js and Azure Functions](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-onbehalfof-azurefunctions/blob/master/Function/MyHttpTrigger/index.js#L61).

## Protocol

For more information about the OBO protocol, see [Microsoft identity platform and OAuth 2.0 On-Behalf-Of flow](./v2-oauth2-on-behalf-of-flow.md).

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md)
