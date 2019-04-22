---
title: mobile app that calls Web APIs - calling a Web API | Azure
description: Learn how to build a mobile app that calls Web APIs (calling a Web API)
services: active-directory
documentationcenter: dev-center-name
author: dadobali
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2019
ms.author: dadobali
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Mobile app that calls web APIs - calling a web API

Now that you have a token, you can call a protected Web API!

## Calling a web API 

### Basics 
When your app has successfully gotten a token for a user, you can begin calling web APIs. In addition to this token, MSAL also provides apps with several properties (via `AuthenticationResult` or `result`):

- `AccessToken`: Used to call protected web APIs in a HTTP request. 
- `IdToken`: Contains useful claims about the signed in user like their name, home tenant, and unique identifier for storage.
- `ExpiresOn`: the expiration time of the token. MSAL handles auto-refresh for apps. 
- `TenantId`: The identifier of the user's tenant used to sign in. For guest users (Azure AD B2B), this will be the tenant the user signed in with, not their home tenant.  
- `Scopes`: the scopes that were granted with your token. This may be a subset of what you requested. 

Additionally, MSAL also provides an abstraction for an `Account`. An Account represents the current user's signed in account. It contains several properties:
- `HomeAccountIdentifier`: The identifier of the user's home tenant. 
- `UserName`: The user's preferred username. This may be empty for Azure AD B2C users. 
- `AccountIdentifier`: The identifier of the signed in user. This will be the same as the `HomeAccountIdentifier` in most cases unless the user is a guest in another tenant. 

### Calling an API

Once you have the Access token ready, it's simple to call a web API! Your app will need to take this token, construct an HTTP request, and execute it. 

Android
```Java
        RequestQueue queue = Volley.newRequestQueue(this);
        JSONObject parameters = new JSONObject();

        try {
            parameters.put("key", "value");
        } catch (Exception e) {
            // Error when constructing
        }
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, MSGRAPH_URL,
                parameters,new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                // Successfully called graph, process data and send to UI 
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // Error
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
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

iOS
```swift
        let url = URL(string: kGraphURI)
        var request = URLRequest(url: url!)
        request.setValue("Bearer \(self.accessToken)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                self.updateLogging(text: "Couldn't get graph result: \(error)")
                return
            }
            guard let result = try? JSONSerialization.jsonObject(with: data!, options: []) else {
                self.updateLogging(text: "Couldn't deserialize result JSON")
                return
            }
            self.updateLogging(text: "Result from Graph: \(result))")
        }.resume()
```

Xamarin
```CSharp
httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call Web API.
HttpResponseMessage response = await _httpClient.GetAsync(apiUri);
...
}
```

## Making several API requests

If you need to call the same API several times or multiple APIs, there are additional considerations when building your app,
- ***Incremental Consent***: Microsoft identity platform allows apps to progressively request user consent for permissions. Each time your app is ready to call an API, it should request only the scopes it intends to use. 
- ***Conditional Access***: In certain scenarios, you may get additional Conditional Access requirements when making several API requests. To handle this scenario, be sure to catch errors from silent requests and be prepared to make an interactive request. This can happen if the first request has no Conditional Access policies applied and your app attempts to silently access a new API that requires Conditional Access. 

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-mobile-production.md)
