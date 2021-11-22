---
title: Request an authorization token
description: We support three OAuth2 flows- authorization code grant, implicit grant, and client credentials grant.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/22/2021
ms.topic: article
---
# Request an Authorization Token

The Log Analytics API supports three OAuth2 flows:
- Client credentials grant
- Authorization code grant
- Implicit grant
The Authorization code grant and implicit grant flows both require at least a one time user-interactive login to your application. If you need a totally non-interactive flow, you must use client credentials.

Before beginning, make sure you have all the values required to make OAuth2 calls successfully. All requests require your:
- your AAD tenant
- your workspace ID (with [workspace linked to your AAD app](aad-setup.md))
- your client ID for the AAD app
- a client secret for the AAD App (referred to as "keys" in the AAD App menu bar).


## Client Credentials Flow

In the client credentials flow, we use the token with the ARM endpoint. This flow requires a single request to receive a token, using the application permissions provided during the AAD application setup.
The resource we request is <https://management.azure.com/>. 
You can also use this flow to request a token to [https://api.loganalytics.io](https://api.loganalytics.io/), simply replace the "resource" in the example.

### Client Credentials Token URL (POST request)

```
    POST /YOUR_AAD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials
    &client_id=YOUR_CLIENT_ID
    &redirect_uri=YOUR_REDIRECT_URI
    &resource=https://management.azure.com/
    &client_secret=YOUR_CLIENT_SECRET
```

A successful request will receive an access token:

```
    {
        "token_type": "Bearer",
        "expires_in": "3600",
        "ext_expires_in": "0",
        "expires_on": "1505929459",
        "not_before": "1505925559",
        "resource": "https://management.azure.com/",
        "access_token": "ey.....A"
    }
```

This token may be used for authorization against the ARM API endpoint:

```
    GET https://management.azure.com/subscriptions/6c3ac85e-59d5-4e5d-90eb-27979f57cb16/resourceGroups/demo/providers/Microsoft.OperationalInsights/workspaces/demo-ws/api/query
    
    Authorization: Bearer <access_token>
    Prefer: response-v1=true
    
    {
        "query": "AzureActivity | limit 10"
    }
```

Example Response:

```
    {
        "tables": [
            {
                "name": "PrimaryResult",
                "columns": [
                    {
                        "name": "OperationName",
                        "type": "string"
                    },
                    {
                        "name": "Level",
                        "type": "string"
                    },
                    {
                        "name": "ActivityStatus",
                        "type": "string"
                    }
                ],
                "rows": [
                    [
                        "Metric Alert",
                        "Informational",
                        "Resolved",
                        ...
                    ],
                    ...
                ]
            },
            ...
        ]
    }
```

## Authorization Code Flow

The main OAuth2 flow supported is through [authorization codes](/azure/active-directory/develop/active-directory-protocols-oauth-code). This method requires two HTTP requests to acquire a token with which to call the Log Analytics API. There are two URLs, one endpoint per request. Their formats are as follows:

### Authorization Code URL (GET request):

```
    GET https://login.microsoftonline.com/YOUR_AAD_TENANT/oauth2/authorize?
    client_id=YOUR_CLIENT_ID
    &response_type=code
    &redirect_uri=YOUR_REDIRECT_URI
    &resource=https://api.loganalytics.io
```

When making a request to the Authorize URL, the client\_id is the Application ID from your AAD App, copied from the App's properties menu. The redirect\_uri is the home page/login URL from the same AAD App. Upon successful request, this endpoint will redirect to the login page you provided at signup with the authorization code appended to the URL. See following for example:

```
    http://YOUR_REDIRECT_URI/?code=AUTHORIZATION_CODE&session_state=STATE_GUID
```

At this point you will have obtained an authorization code, which you need now to request an access token.

### Authorization Code Token URL (POST request)

```
    POST /YOUR_AAD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=authorization_code
    &client_id=YOUR_CLIENT_ID
    &code=AUTHORIZATION_CODE
    &redirect_uri=YOUR_REDIRECT_URI
    &resource=https://api.loganalytics.io
    &client_secret=YOUR_CLIENT_SECRET
```

All values are as before, with some additions. The authorization code is the same code you received in the previous request after a successful redirect. We now combine it with the key we previously obtained from our AAD App, or if you did not save the key you can delete it and create a new one from the keys tab of the AAD App menu. The response will be JSON containing the token with the following schema. Exact values are indicated where they should not vary, with types indicated for the token values.

Response example:

```
    {
        "access_token": "YOUR_ACCESS_TOKEN",
        "expires_in": "3600",
        "ext_expires_in": "1503641912",
        "id_token": "not_needed_for_log_analytics",
        "not_before": "1503638012",
        "refresh_token": "YOUR_REFRESH_TOKEN",
        "resource": "https://api.loganalytics.io",
        "scope": "Data.Read",
        "token_type": "bearer"
    }
```

The access token portion of this response is what you present to the Log Analytics API in the `Authorization: Bearer` header. You may also use the refresh token in the future to acquire a new access\_token and refresh\_token when yours have gone stale. For this request, the format and endpoint are as follows.

```
    POST /YOUR_AAD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    client_id=YOUR_CLIENT_ID
    &refresh_token=YOUR_REFRESH_TOKEN
    &grant_type=refresh_token
    &resource=https://api.loganalytics.io
    &client_secret=YOUR_CLIENT_SECRET
```

Response example:

```
    {
      "token_type": "Bearer",
      "expires_in": "3600",
      "expires_on": "1460404526",
      "resource": "https://api.loganalytics.io",
      "access_token": "YOUR_TOKEN_HERE",
      "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
    }
```

## Implicit Code Flow

The Log Analytics API also supports the OAuth2 [implicit flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant). For this flow, only a single request is required but no refresh token may be acquired.

### Implicit Code Authorize URL

```
    GET https://login.microsoftonline.com/YOUR_AAD_TENANT/oauth2/authorize?
    client_id=YOUR_CLIENT_ID
    &response_type=token
    &redirect_uri=YOUR_REDIRECT_URI
    &resource=https://api.loganalytics.io
```

A successful request will produce a redirect to your redirect URI with the token in the URL as follows.

```
    http://YOUR_REDIRECT_URI/#access_token=YOUR_ACCESS_TOKEN&token_type=Bearer&expires_in=3600&session_state=STATE_GUID
```

This access\_token can be used as the `Authorization: Bearer` header value when passed to the Log Analytics API to authorize requests.

## More Information

Additional documentation on OAuth2 with Azure AD is availble from the following sources.

[Azure AD Authorization Code flow](/azure/active-directory/develop/active-directory-protocols-oauth-code)

[Azure AD Implicit Grant flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant)

[Azure AD S2S Client Credentials flow](/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service)
