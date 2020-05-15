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
ms.date: 07/16/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
---

# A web API that calls web APIs: Code configuration

After you've registered your web API, you can configure the code for the application.

The code that you use to configure your web API so that it calls downstream web APIs builds on top of the code that's used to protect a web API. For more information, see [Protected web API: App configuration](scenario-protected-web-api-app-configuration.md).

# [ASP.NET Core](#tab/aspnetcore)

## Code subscribed to OnTokenValidated

On top of the code configuration for any protected web APIs, you need to subscribe to the validation of the bearer token that you receive when your API is called:

```csharp
/// <summary>
/// Protects the web API with the Microsoft identity platform, or Azure Active Directory (Azure AD) developer platform
/// This supposes that the configuration files have a section named "AzureAD"
/// </summary>
/// <param name="services">The service collection to which to add authentication</param>
/// <param name="configuration">Configuration</param>
/// <returns></returns>
public static IServiceCollection AddProtectedApiCallsWebApis(this IServiceCollection services,
                                                             IConfiguration configuration,
                                                             IEnumerable<string> scopes)
{
    services.AddTokenAcquisition();
    services.Configure<JwtBearerOptions>(AzureADDefaults.JwtBearerAuthenticationScheme, options =>
    {
        // When an access token for our own web API is validated, we add it
        // to the MSAL.NET cache so that it can be used from the controllers.
        options.Events = new JwtBearerEvents();

        options.Events.OnTokenValidated = async context =>
        {
            context.Success();

            // Adds the token to the cache and handles the incremental consent
            // and claim challenges
            AddAccountToCacheFromJwt(context, scopes);
            await Task.FromResult(0);
        };
    });
    return services;
}
```

## On-Behalf-Of flow

The AddAccountToCacheFromJwt() method needs to:

- Instantiate a Microsoft Authentication Library (MSAL) confidential client application.
- Call the `AcquireTokenOnBehalf` method. This call exchanges the bearer token that was acquired by the client for the web API against a bearer token for the same user, but it has the API call a downstream API.

### Instantiate a confidential client application

This flow is available only in the confidential client flow, so that the protected web API provides client credentials (client secret or certificate) to the [ConfidentialClientApplicationBuilder class](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder) via either the `WithClientSecret` or `WithCertificate` method.

![List of IConfidentialClientApplication methods](https://user-images.githubusercontent.com/13203188/55967244-3d8e1d00-5c7a-11e9-8285-a54b05597ec9.png)

```csharp
IConfidentialClientApplication app;

#if !VariationWithCertificateCredentials
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
           .WithClientSecret(config.ClientSecret)
           .Build();
#else
// Building the client credentials from a certificate
X509Certificate2 certificate = ReadCertificate(config.CertificateName);
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
    .WithCertificate(certificate)
    .Build();
#endif
```

Finally, instead of proving their identity via a client secret or a certificate, confidential client applications can prove their identity by using client assertions.
For more information about this advanced scenario, see [Confidential client assertions](msal-net-client-assertions.md).

### How to call On-Behalf-Of

You make the On-Behalf-Of (OBO) call by calling the [AcquireTokenOnBehalf method](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.acquiretokenonbehalfofparameterbuilder) on the `IConfidentialClientApplication` interface.

The `UserAssertion` class is built from the bearer token that's received by the web API from its own clients. There are [two constructors](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.clientcredential.-ctor?view=azure-dotnet):
* One that takes a JSON Web Token (JWT) bearer token
* One that takes any kind of user assertion, another kind of security token, whose type is then specified in an additional parameter named `assertionType`

![UserAssertion properties and methods](https://user-images.githubusercontent.com/13203188/37082180-afc4b708-21e3-11e8-8af8-a6dcbd2dfba8.png)

In practice, the OBO flow is often used to acquire a token for a downstream API and store it in the MSAL.NET user token cache. You do this so that other parts of the web API can later call on the [overrides](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.clientapplicationbase.acquiretokensilent?view=azure-dotnet) of ``AcquireTokenOnSilent`` to call the downstream APIs. This call has the effect of refreshing the tokens, if needed.

```csharp
private void AddAccountToCacheFromJwt(IEnumerable<string> scopes, JwtSecurityToken jwtToken, ClaimsPrincipal principal, HttpContext httpContext)
{
    try
    {
        UserAssertion userAssertion;
        IEnumerable<string> requestedScopes;
        if (jwtToken != null)
        {
            userAssertion = new UserAssertion(jwtToken.RawData, "urn:ietf:params:oauth:grant-type:jwt-bearer");
            requestedScopes = scopes ?? jwtToken.Audiences.Select(a => $"{a}/.default");
        }
        else
        {
            throw new ArgumentOutOfRangeException("tokenValidationContext.SecurityToken should be a JWT Token");
        }

        // Create the application
        var application = BuildConfidentialClientApplication(httpContext, principal);

        // .Result to make sure that the cache is filled in before the controller tries to get access tokens
        var result = application.AcquireTokenOnBehalfOf(requestedScopes.Except(scopesRequestedByMsalNet),
                                                        userAssertion)
                                .ExecuteAsync()
                                .GetAwaiter().GetResult();
     }
     catch (MsalException ex)
     {
         Debug.WriteLine(ex.Message);
         throw;
     }
}
```
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

For more information about the OBO protocol, see [Microsoft identity platform and OAuth 2.0 On-Behalf-Of flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow).

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md)
