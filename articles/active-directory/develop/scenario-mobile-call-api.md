---
title: Mobile app that calls web APIs - calling a web API | Microsoft identity platform
description: Learn how to build a mobile app that calls web APIs (calling a web API)
services: active-directory
documentationcenter: dev-center-name
author: danieldobalian
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
ms.collection: M365-identity-device-management
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

### iOS

```swift
        let url = URL(string: kGraphURI)
        var request = URLRequest(url: url!)

        // Put access token in HTTP request.
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

            // Successfully got data from Graph.
            self.updateLogging(text: "Result from Graph: \(result))")
        }.resume()
```

### Xamarin

```CSharp
httpClient = new HttpClient();

// Put access token in HTTP request.
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call Graph.
HttpResponseMessage response = await _httpClient.GetAsync(apiUri);
...
}
```

## Making several API requests

If you need to call the same API several times, or if you need to call multiple APIs, take the following into consideration when you build your app:

- **Incremental consent**: Microsoft identity platform allows apps to get user consent as permissions are required, rather than all at the start. Each time your app is ready to call an API, it should request only the scopes it needs to use.
- **Conditional Access**: In certain scenarios, you might get additional Conditional Access requirements when you make several API requests. This can happen if the first request has no Conditional Access policies applied and your app attempts to silently access a new API that requires Conditional Access. To handle this scenario, be sure to catch errors from silent requests and be prepared to make an interactive request.  To learn more, see [Guidance for Conditional Access](conditional-access-dev-guide.md).

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-mobile-production.md)
