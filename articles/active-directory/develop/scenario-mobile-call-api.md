---
title: Call a web API from a mobile app
description: Learn how to build a mobile app that calls web APIs. (Call a web API.)
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/18/2020
ms.author: henrymbugua
ms.reviewer: brandwe, jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform.
---

# Call a web API from a mobile app

After your app signs in a user and receives tokens, the Microsoft Authentication Library (MSAL) exposes information about the user, the user's environment, and the issued tokens. Your app can use these values to call a web API or display a welcome message to the user.

In this article, we'll first look at the MSAL result. Then we'll look at how to use an access token from `AuthenticationResult` or `result` to call a protected web API.

## MSAL result
MSAL provides the following values:

- `AccessToken` calls protected web APIs in an HTTP bearer request.
- `IdToken` contains useful information about the signed-in user. This information includes the user's name, the home tenant, and a unique identifier for storage.
- `ExpiresOn` is the expiration time of the token. MSAL handles an app's automatic refresh.
- `TenantId` is the identifier of the tenant where the user signed in. For guest users in Azure Active Directory (Azure AD) B2B, this value identifies the tenant where the user signed in. The value doesn't identify the user's home tenant.
- `Scopes` indicates the scopes that were granted with your token. The granted scopes might be a subset of the scopes that you requested.

MSAL also provides an abstraction for an `Account` value. An `Account` value represents the current user's signed-in account:

- `HomeAccountIdentifier` identifies the user's home tenant.
- `UserName` is the user's preferred username. This value might be empty for Azure AD B2C users.
- `AccountIdentifier` identifies the signed-in user. In most cases, this value is the same as the `HomeAccountIdentifier` value unless the user is a guest in another tenant.

## Call an API

After you have the access token, you can call a web API. Your app will use the token to build an HTTP request and then run the request.

### Android

```Java
        RequestQueue queue = Volley.newRequestQueue(this);
        JSONObject parameters = new JSONObject();

        try {
            parameters.put("key", "value");
        } catch (Exception e) {
            // Error when constructing.
        }
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, MSGRAPH_URL,
                parameters,new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                // Successfully called Graph. Process data and send to UI.
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // Error.
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();

                // Put access token in HTTP request.
                headers.put("Authorization", "Bearer " + authResult.getAccessToken());
                return headers;
            }
        };

        request.setRetryPolicy(new DefaultRetryPolicy(
                3000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(request);
```

### MSAL for iOS and macOS

The methods to acquire tokens return an `MSALResult` object. `MSALResult` exposes an `accessToken` property. You can use `accessToken` to call a web API. Add this property to the HTTP authorization header before you call to access the protected web API.

```objc
NSMutableURLRequest *urlRequest = [NSMutableURLRequest new];
urlRequest.URL = [NSURL URLWithString:"https://contoso.api.com"];
urlRequest.HTTPMethod = @"GET";
urlRequest.allHTTPHeaderFields = @{ @"Authorization" : [NSString stringWithFormat:@"Bearer %@", accessToken] };

NSURLSessionDataTask *task =
[[NSURLSession sharedSession] dataTaskWithRequest:urlRequest
     completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {}];
[task resume];
```

```swift
let urlRequest = NSMutableURLRequest()
urlRequest.url = URL(string: "https://contoso.api.com")!
urlRequest.httpMethod = "GET"
urlRequest.allHTTPHeaderFields = [ "Authorization" : "Bearer \(accessToken)" ]

let task = URLSession.shared.dataTask(with: urlRequest as URLRequest) { (data: Data?, response: URLResponse?, error: Error?) in }
task.resume()
```

### Xamarin

[!INCLUDE [Call web API in .NET](./includes/scenarios/scenarios-call-apis-dotnet.md)]

## Make several API requests

To call the same API several times, or call multiple APIs, then consider the following subjects when you build your app:

- **Incremental consent**: The Microsoft identity platform allows apps to get user consent when permissions are required rather than all at the start. Each time your app is ready to call an API, it should request only the scopes that it needs.

- **Conditional Access**: When you make several API requests, in certain scenarios you might have to meet additional conditional-access requirements. Requirements can increase in this way if the first request has no conditional-access policies and your app attempts to silently access a new API that requires Conditional Access. To handle this problem, be sure to catch errors from silent requests, and be prepared to make an interactive request.  For more information, see [Guidance for Conditional Access](v2-conditional-access-dev-guide.md).

## Call several APIs by using incremental consent and Conditional Access

To call several APIs for the same user, after you acquire a token for the user, you can avoid repeatedly asking the user for credentials by subsequently calling `AcquireTokenSilent` to get a token:

```csharp
var result = await app.AcquireTokenXX("scopeApi1")
                      .ExecuteAsync();

result = await app.AcquireTokenSilent("scopeApi2")
                  .ExecuteAsync();
```

Interaction is required when:

- The user consented for the first API but now needs to consent for more scopes. In this case, you use incremental consent.
- The first API doesn't require [multi-factor authentication](../authentication/concept-mfa-howitworks.md), but the next API does.

```csharp
var result = await app.AcquireTokenXX("scopeApi1")
                      .ExecuteAsync();

try
{
 result = await app.AcquireTokenSilent("scopeApi2")
                  .ExecuteAsync();
}
catch(MsalUiRequiredException ex)
{
 result = await app.AcquireTokenInteractive("scopeApi2")
                  .WithClaims(ex.Claims)
                  .ExecuteAsync();
}
```

## Next steps

Move on to the next article in this scenario,
[Move to production](scenario-mobile-production.md).
