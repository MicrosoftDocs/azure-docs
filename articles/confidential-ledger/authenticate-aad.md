---
title: Azure Active Directory authentication with Azure confidential ledger
description: Azure Active Directory authentication with Azure confidential ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 07/12/2022
ms.author: mbaldwin

---
# Azure confidential ledger with Azure Active Directory (Azure AD)

The recommended way to access Azure confidential ledger is by authenticating to the **Azure Active Directory (Azure AD)** service; doing so guarantees that Azure confidential ledger never gets the accessing principal's directory credentials.

To do so, the client performs a two-steps process:

1. In the first step, the client:
    1. Communicates with the Azure AD service.
    1. Authenticates to the Azure AD service.
    1. Requests an access token issued specifically for Azure confidential ledger.
1. In the second step, the client issues requests to Azure confidential ledger, providing the access token acquired in the first step as a proof of identity to Azure confidential ledger.

Azure confidential ledger then executes the request on behalf of the security principal for which Azure AD issued the access token. All authorization checks are performed using this identity.

In most cases, the recommendation is to use one of Azure confidential ledger SDKs to access the service programmatically, as they remove much of the hassle of implementing the
flow above (and much more). See, for example, the [Python client library](https://pypi.org/project/azure-confidentialledger/) and [.NET client library](/dotnet/api/overview/azure/storage.confidentialledger-readme-pre).

The main authenticating scenarios are:

- **A client application authenticating a signed-in user**: In this scenario, an interactive (client) application triggers an Azure AD prompt to the user for credentials (such as username and password). See [user authentication](#user-authentication),

- **A "headless" application**: In this scenario, an application is running with no user present to provide credentials. Instead the application authenticates as "itself" to Azure AD using some credentials it has been configured with. See [application authentication](#application-authentication).

- **On-behalf-of authentication**. In this scenario, sometimes called the "web service" or "web app" scenario, the application gets an Azure AD access token from another application, and then "converts" it to another Azure AD access token that can be used with Azure confidential ledger. In other words, the application acts as a mediator between the user or application that provided credentials and the Azure confidential ledger service. See [on-behalf-of authentication](#on-behalf-of-authentication).

## Specifying the Azure AD resource for Azure confidential ledger

When acquiring an access token from Azure AD, the client must indicate which *Azure AD resource* the token should be issued to. The Azure AD resource of an Azure confidential ledger endpoint is the URI of the endpoint, barring the port information and the path. For example:

```txt
https://myACL.confidential-ledger.azure.com
```

## Specifying the Azure AD tenant ID

Azure AD is a multi-tenant service, and every organization can create an object called **directory** in Azure AD. The directory object holds security-related objects such as user accounts, applications, and groups. Azure AD often refers to the directory as a **tenant**. Azure AD tenants are identified by a GUID (**tenant ID**). In many cases, Azure AD tenants can also be identified by the domain name of the organization.

For example, an organization called "Contoso" might have the tenant ID `4da81d62-e0a8-4899-adad-4349ca6bfe24` and the domain name `contoso.com`.

## Specifying the Azure AD authority endpoint

Azure AD has many endpoints for authentication:

- When the tenant hosting the principal being authenticated is known (in other words, when one knows which Azure AD directory the user or application are in), the Azure AD endpoint is `https://login.microsoftonline.com/{tenantId}`. Here, `{tenantId}` is either the organization's tenant ID in Azure AD, or its domain name (for example, `contoso.com`).

- When the tenant hosting the principal being authenticated isn't known, the "common" endpoint can be used by replacing the `{tenantId}` above with the value `common`.

> [!NOTE]
> The Azure AD service endpoint used for authentication is also called *Azure AD authority URL* or simply **Azure AD authority**.

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer service deployed in a national cloud, please set the corresponding national cloud Azure AD service endpoint. To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

## Azure AD local token cache

While using the Azure Data Explorer SDK, the Azure AD tokens are stored on the local machine in a per-user token cache (a file called **%APPDATA%\Kusto\userTokenCache.data** which can only be accessed or decrypted by the signed-in user.) The cache is inspected for tokens before prompting the user for credentials, reducing the number of times a user is prompted for credentials.

> [!NOTE]
> The Azure AD token cache reduces the number of interactive prompts that a user would be presented with accessing Azure Data Explorer, but doesn't reduce them completely. Additionally, users cannot anticipate in advance when they will be prompted for credentials. This means that one must not attempt to use a user account to access Azure Data Explorer if there's a need to support non-interactive logons (such as when scheduling tasks for example), because when the time comes for prompting the logged on user for credentials that prompt will fail if running under non-interactive logon.

## User authentication

The easiest way to access Azure Data Explorer with user authentication is to use the Azure Data Explorer SDKand set the `Federated Authentication` property of the Azure Data Explorer connection string to`true`. The first time the SDK is used to send a request to the service the userwill be presented with a sign-in form to enter the Azure AD credentials. Following a successful authentication the request will be sent to Azure Data Explorer.

Applications that don't use the Azure Data Explorer SDK can still use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) instead of implementing the Azure AD service security protocol client. See [https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet]for an example of doing so from a .NET application.

If your application is intended to serve as front-end and authenticate users for an Azure Data Explorer cluster, the application must be granted delegated permissions on Azure Data Explorer.The full step-by-step process is described in [Configure delegated permissions for the application registration](../../../provision-azure-ad-app.md#configure-delegated-permissions-for-the-application-registration).

The following brief code snippet demonstrates using [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an Azure AD usertoken to access Azure Data Explorer (launches logon UI):

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri($"https://{serviceName}.{region}.kusto.windows.net"));

// Create a public authentication client for Azure AD:
var authClient = PublicClientApplicationBuilder.Create("<your client app ID>")
            .WithAuthority("https://login.microsoftonline.com/{Azure AD Tenant ID or name}")
            .WithRedirectUri(@"<your client app redirect URI>")
            .Build();

// Define scopes for accessing Azure Data Explorer cluster
string[] scopes = new string[] { $"https://{serviceName}.{region}.kusto.windows.net/.default" };

// Acquire user token for the interactive user for Azure Data Explorer:
AuthenticationResult result = authClient.AcquireTokenInteractive(scopes).ExecuteAsync().Result;

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## Application authentication

The following brief code snippet demonstrates using [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire anAzure AD application token to access Azure Data Explorer. In this flow no prompt is presented, andthe application must be registered with Azure AD and equipped with credentials neededto perform application authentication (such as an app key issued by Azure AD,or an X509v2 certificate that has been pre-registered with Azure AD).

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://{serviceName}.{region}.kusto.windows.net"));

// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create("<your client app ID>")
            .WithAuthority("https://login.microsoftonline.com/{Azure AD Tenant ID or name}")
            .WithClientSecret("<your client app secret key>") // can be replaced by .WithCertificate to authenticate with an X.509 certificate
            .Build();

// Define scopes for accessing Azure Data Explorer cluster
string[] scopes = new string[] { $"https://{serviceName}.{region}.kusto.windows.net/.default" };

// Acquire aplpication token for Azure Data Explorer:
AuthenticationResult result = authClient.AcquireTokenForClient(scopes).ExecuteAsync().Result;

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## On-behalf-of authentication

In this scenario, an application was sent an Azure AD access token for some arbitraryresource managed by the application, and it uses that token to acquire a new Azure ADaccess token for the Azure Data Explorer resource so that the application could access Kustoon behalf of the principal indicated by the original Azure AD access token.

This flow is called the[OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04).It generally requires multiple configuration steps with Azure AD, and in some cases(depending on the Azure AD tenant configuration) might require special consent fromthe administrator of the Azure AD tenant.

**Step 1: Establish trust relationship between your application and the Azure Data Explorer service**

1. Open the [Azure portal](https://portal.azure.com/) and make sure that you're signed-in to the correct tenant (see top/right corner for the identity used to sign in to the portal).
1. On the resources pane, click **Azure Active Directory**, then **App registrations**.
1. Locate the application that uses the on-behalf-of flow and open it.
1. Click **API permissions**, then **Add a permission**.
1. Search for the application named **Azure Data Explorer** and select it.
1. Select **user_impersonation / Access Kusto**.
1. Click **Add permission**.

**Step 2: Perform token exchange in your server code**

```csharp
// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create("<your client app ID>")
            .WithAuthority("https://login.microsoftonline.com/{Azure AD Tenant ID or name}")
            .WithClientSecret("<your client app >") // can be replaced by .WithCertificate to authenticate with an X.509 certificate
            .Build();

// Define scopes for accessing Azure Data Explorer cluster
string[] scopes = new string[] { $"https://{serviceName}.{region}.kusto.windows.net/.default" };

// Encode the "original" token that will be used for exchange
var userAssertion = new UserAssertion(accessToken);

// Acquire on-behalf-of user token for the interactive user for Azure Data Explorer based on provided token:
AuthenticationResult result = authClient.AcquireTokenOnBehalfOf(scopes, userAssertion).ExecuteAsync().Result;

string accessTokenForAdx = result.AccessToken;
```

**Step 3: Provide the token to Kusto client library and execute queries**

```csharp
// Create KustoConnectionStringBuilder using the previously acquired Azure AD token
var kcsb = new KustoConnectionStringBuilder($"https://{serviceName}.{region}.kusto.windows.net")
            .WithAadUserTokenAuthentication(accessTokenForAdx);

// Create an ADX query client base on the conneciton string object
var queryClient = KustoClientFactory.CreateCslQueryProvider(kcsb);

// Execute query
var queryResult = queryclient.ExecuteQuery(databaseName, query, null);
```

## Web Client (JavaScript) authentication and authorization

**Azure AD application configuration**

> [!NOTE]
> In addition to the standard [steps](../../../provision-azure-ad-app.md) you need to follow in order to setup an Azure AD application, you should also enable oauth implicit flow in your Azure AD application. You can achieve that by selecting manifest from your application page in the azure portal, and set oauth2AllowImplicitFlow to true.

**Details**

When the client is a JavaScript code running in the user's browser, the implicit grant flow is used. The token granting the client application access to the Azure Data Explorer service is provided immediately following a successful authentication as part of the redirect URI (in a URI fragment). No refresh token is given in this flow, so the client can't cache the token for prolonged periods of time and reuse it.

Like in the native client flow, there should be  two Azure AD applications (Server and Client) with a configured relationship between them.

AdalJs requires getting an id_token before any access_token calls are made.

The access token is obtained by calling the `AuthenticationContext.login()` method, and access_tokens are obtained by calling `Authenticationcontext.acquireToken()`.

* Create an AuthenticationContext with the right configuration:

```javascript
var config = {
    tenant: "microsoft.com",
    clientId: "<Web Azure AD app with current website as reply URL. for example, KusDash uses f86897ce-895e-44d3-91a6-aaeae54e278c>",
    redirectUri: "<where you'd like Azure AD to redirect after authentication succeeds (or fails).>",
    postLogoutRedirectUri: "where you'd like Azure AD to redirect the browser after logout."
};

var authContext = new AuthenticationContext(config);
```

* Call `authContext.login()` before trying to `acquireToken()` if you aren't logged in. a good way to know if you're logged in or not is to call `authContext.getCachedUser()` and see if it returns `false`)
* Call `authContext.handleWindowCallback()` whenever your page loads. This is the piece of code that intercepts the redirect back from Azure AD and pulls the token out of the fragment URL and caches it.
* Call `authContext.acquireToken()` to get the actual access token, now that you have a valid ID token. The first parameter to acquireToken will be the Kusto server Azure AD application resource URL.

```javascript
 authContext.acquireToken("<Kusto cluster URL>", callbackThatUsesTheToken);
 ```

* in the callbackThatUsesTheToken you can use the token as a bearer token in the Azure Data Explorer request. for example:

```javascript
var settings = {
    url: "https://" + clusterAndRegionName + ".kusto.windows.net/v1/rest/query",
    type: "POST",
    data: JSON.stringify({
        "db": dbName,
        "csl": query,
        "properties": null
    }),
    contentType: "application/json; charset=utf-8",
    headers: { "Authorization": "Bearer " + token },
    dataType: "json",
    jsonp: false,
    success: function(data, textStatus, jqXHR) {
        if (successCallback !== undefined) {
            successCallback(data.Tables[0]);
        }

    },
    error: function(jqXHR, textStatus, errorThrown) {
        if (failureCallback !==  undefined) {
            failureCallback(textStatus, errorThrown, jqXHR.responseText);
        }

    },
};

$.ajax(settings).then(function(data) {/* do something wil the data */});
```

> Warning - if you get the following or similar exception when authenticating: `ReferenceError: AuthenticationContext is not defined` it's probably because you don't have AuthenticationContext in the global namespace. Unfortunately AdalJS currently has an undocumented requirement that the authentication context will be defined in the global namespace.
