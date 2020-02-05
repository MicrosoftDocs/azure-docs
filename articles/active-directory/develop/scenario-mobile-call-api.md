---
title: Call a web API from a mobile app | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a mobile app that calls web APIs (calling a web API)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.reviwer: brandwe
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform for developers.
---

# Mobile app that calls web APIs - call a web API

After your app has signed in a user and received tokens, MSAL exposes several pieces of information about the user, the user's environment, and the tokens issued. Your app can use these values to call a web API or display a welcome message to the user.

First, we'll look at the MSAL result. Then we'll look at how to use an access token from the `AuthenticationResult` or `result` to call a protected web API.

## MSAL result
MSAL provides the following values: 

- `AccessToken`: Used to call protected web APIs in an HTTP Bearer request.
- `IdToken`: Contains useful information about the signed-in user, like the user's name, the home tenant, and a unique identifier for storage.
- `ExpiresOn`: The expiration time of the token. MSAL handles auto refresh for apps.
- `TenantId`: The identifier of the tenant that the user signed in with. For guest users (Azure Active Directory B2B), this value will identify the tenant that the user signed in with, not the user's home tenant.  
- `Scopes`: The scopes that were granted with your token. The granted scopes might be a subset of the scopes that you requested.

MSAL also provides an abstraction for an `Account`. An `Account` represents the current user's signed-in account.

- `HomeAccountIdentifier`: The identifier of the user's home tenant.
- `UserName`: The user's preferred user name. This might be empty for Azure Active Directory B2C users.
- `AccountIdentifier`: The identifier of the signed-in user. This value will be the same as the `HomeAccountIdentifier` value in most cases, unless the user is a guest in another tenant.

## Call an API

After you have the access token, it's easy to call a web API. Your app will use the token to construct an HTTP request and then run the request.

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

The methods to acquire tokens return an `MSALResult` object. `MSALResult` exposes an `accessToken` property which can be used to call a web API. Access token should be added to the HTTP authorization header, before making the call to access the protected Web API.

Objective-C:

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

Swift:

```swift
let urlRequest = NSMutableURLRequest()
urlRequest.url = URL(string: "https://contoso.api.com")!
urlRequest.httpMethod = "GET"
urlRequest.allHTTPHeaderFields = [ "Authorization" : "Bearer \(accessToken)" ]
     
let task = URLSession.shared.dataTask(with: urlRequest as URLRequest) { (data: Data?, response: URLResponse?, error: Error?) in }
task.resume()
```

### Xamarin

[!INCLUDE [Call web API in .NET](../../../includes/active-directory-develop-scenarios-call-apis-dotnet.md)]

## Making several API requests

If you need to call the same API several times, or if you need to call multiple APIs, take the following into consideration when you build your app:

- **Incremental consent**: Microsoft identity platform allows apps to get user consent as permissions are required, rather than all at the start. Each time your app is ready to call an API, it should request only the scopes it needs to use.
- **Conditional Access**: In certain scenarios, you might get additional Conditional Access requirements when you make several API requests. This can happen if the first request has no Conditional Access policies applied and your app attempts to silently access a new API that requires Conditional Access. To handle this scenario, be sure to catch errors from silent requests and be prepared to make an interactive request.  To learn more, see [Guidance for Conditional Access](conditional-access-dev-guide.md).

## Calling several APIs in Xamarin or UWP - Incremental consent and Conditional Access

If you need to call several APIs for the same user, once you've acquired a token for a user, you can avoid repeatedly asking the user for credentials by subsequently calling `AcquireTokenSilent` to get a token.

```csharp
var result = await app.AcquireTokenXX("scopeApi1")
                      .ExecuteAsync();

result = await app.AcquireTokenSilent("scopeApi2")
                  .ExecuteAsync();
```

The cases where interaction is required is when:

- The user consented for the first API, but now needs to consent for more scopes (incremental consent)
- The first API didn't require multiple-factor authentication, but the next one does.

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

> [!div class="nextstepaction"]
> [Move to production](scenario-mobile-production.md)
