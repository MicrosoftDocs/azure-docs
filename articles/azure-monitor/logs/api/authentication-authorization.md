---
title: Request an authorization token
description: Set up authentication and authorization for the Azure Monitor Log Analytics API.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/22/2021
ms.topic: article
---
# Set Up Authentication and Authorization for the Azure Monitor Log Analytics API

To set up authentication and authorization for the Azure Monitor Log Analytics API:

## Set Up Authentication
1. [Set up Azure Directory](../../../active-directory/develop/quickstart-register-app.md). During setup, use these settings at the relevant steps:
     - When asked for the API to connect to, select **APIs my organization uses** and then search for "Log Analytics API".
     - For the API permissions, select **Delegated permissions**.
1. After completing the Active Directory setup, [Request an Authorization Token](#request-an-authorization-token).
1. (Optional) If you only want to work with sample data in a non-production environment, you can just [use an API key](#authenticating-with-an-api-key).
## Request an Authorization Token

Before beginning, make sure you have all the values required to make OAuth2 calls successfully. All requests require:
- Your Azure AD tenant
- Your workspace ID
- Your client ID for the Azure AD app
- A client secret for the Azure AD app (referred to as "keys" in the Azure AD App menu bar).


### Client Credentials Flow

In the client credentials flow, the token is used with the ARM endpoint. A single request is made to receive a token, using the application permissions provided during the Azure AD application setup.
The resource requested is: `https://management.azure.com`. 
You can also use this flow to request a token to `https://api.loganalytics.io`. Replace the "resource" in the example.

#### Client Credentials Token URL (POST request)

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

A successful request receives an access token:

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

The token can be used for authorization against the ARM API endpoint:

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

### Authorization Code Flow

The main OAuth2 flow supported is through [authorization codes](/azure/active-directory/develop/active-directory-protocols-oauth-code). This method requires two HTTP requests to acquire a token with which to call the Azure Monitor Log Analytics API. There are two URLs, one endpoint per request. Their formats are:

#### Authorization Code URL (GET request):

```
    GET https://login.microsoftonline.com/YOUR_Azure AD_TENANT/oauth2/authorize?
    client_id=YOUR_CLIENT_ID
    &response_type=code
    &redirect_uri=YOUR_REDIRECT_URI
    &resource=https://api.loganalytics.io
```

When making a request to the Authorize URL, the client\_id is the Application ID from your Azure AD App, copied from the App's properties menu. The redirect\_uri is the home page/login URL from the same Azure AD App. When a request is successful, this endpoint redirects you to the sign in page you provided at sign-up with the authorization code appended to the URL. See the following example:

```
    http://YOUR_REDIRECT_URI/?code=AUTHORIZATION_CODE&session_state=STATE_GUID
```

At this point you will have obtained an authorization code, which you need now to request an access token.

#### Authorization Code Token URL (POST request)

```
    POST /YOUR_Azure AD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=authorization_code
    &client_id=YOUR_CLIENT_ID
    &code=AUTHORIZATION_CODE
    &redirect_uri=YOUR_REDIRECT_URI
    &resource=https://api.loganalytics.io
    &client_secret=YOUR_CLIENT_SECRET
```

All values are the same as before, with some additions. The authorization code is the same code you received in the previous request after a successful redirect. The code is combined with the key obtained from the Azure AD App. If you did not save the key, you can delete it and create a new one from the keys tab of the Azure AD App menu. The response is a JSON string containing the token with the following schema. Exact values are indicated where they should not be changed. Types are indicated for the token values.

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

The access token portion of this response is what you present to the Log Analytics API in the `Authorization: Bearer` header. You may also use the refresh token in the future to acquire a new access\_token and refresh\_token when yours have gone stale. For this request, the format and endpoint are:

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

### Implicit Code Flow

The Log Analytics API also supports the OAuth2 [implicit flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant). For this flow, only a single request is required but no refresh token can be acquired.

#### Implicit Code Authorize URL

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

## Authenticating with an API key

To quickly explore the API without needing to use Azure AD authentication, use the demonstration workspace with sample data, which supports API key authentication.

To authenticate and run queries against the sample workspace, use `DEMO_WORKSPACE` as the {workspace-id} and pass in the API key `DEMO_KEY`.

If either the Application ID or the API key are incorrect, the API service will return a [403](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error) (Forbidden) error.

The API key `DEMO_KEY` can be passed in three different ways, depending on whether you prefer to use the URL, a header, or basic authentication.

1.  **Custom header**: provide the API key in the custom header `X-Api-Key`
2.  **Query parameter**: provide the API key in the URL parameter `api_key`
3.  **Basic authentication**: provide the API key as either username or password. If you provide both, the API key must be in the username.

This example uses the Workspace ID and API key in the header:

```
    POST https://api.loganalytics.io/v1/workspaces/DEMO_WORKSPACE/query
    X-Api-Key: DEMO_KEY
    Content-Type: application/json
    
    {
        "query": "AzureActivity | summarize count() by Category"
    }
```
## More Information

You can find documentation about OAuth2 with Azure AD here:
 - [Azure AD Authorization Code flow](/azure/active-directory/develop/active-directory-protocols-oauth-code)
 - [Azure AD Implicit Grant flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant)
 - [Azure AD S2S Client Credentials flow](/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service)
