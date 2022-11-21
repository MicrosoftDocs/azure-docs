---
title: Access the API
description: There are two endpoints through which you can communicate with the Azure Monitor Log Analytics API.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/18/2021
ms.topic: article
---
# Access the Azure Monitor Log Analytics API

You can communicate with the Azure Monitor Log Analytics API using this endpoint: `https://api.loganalytics.io`. To access the API, you must authenticate through Azure Active Directory (Azure AD). 

## Authenticating with an demo API key

To quickly explore the API without Azure Active Directory authentication, use the demonstration workspace with sample data, which supports API key authentication.

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
## Public API endpoint

The public API endpoint is:

```
    https://api.loganalytics.io/{api-version}/workspaces/{workspaceId}
```
where:
 - **api-version**: The API version. The current version is "v1"
 - **workspaceId**: Your workspace ID
 - **parameters**: The data required for this query
 
For example, 
 ```
    https://api.loganalytics.io/v1/workspaces/1234abcd-def89-765a-9abc-def1234abcde
```
## Set up Authentication

1. [Register an app for in Azure Active Directory](./register-app-for-token.md).

1. After completing the Active Directory setup and workspace permissions, [Request an Authorization Token](#request-an-authorization-token).

## Request an Authorization Token

Before beginning, make sure you have all the values required to make OAuth2 calls successfully. All requests require:
- Your Azure Active Directory tenant ID
- Your workspace ID
- Your client ID for the Azure AD app
- A client secret for the Azure AD app (referred to as "keys" in the Azure AD App menu bar).


### Client Credentials Flow

In the client credentials flow, the token is used with the log analytics endpoint. A single request is made to receive a token, using the credentials provided for your app in the [Register an app for in Azure Active Directory](./register-app-for-token.md) step above.  
Use the `https://api.loganalytics.io` endpoint. 

##### Microsoft identity platform v2.0

```http
    POST /<your-tenant-id>/oauth2/v2.0/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials
    &client_id=<app-client-id>
    &resource=https://api.loganalytics.io
    &client_secret=<app-client-secret>
```

A successful request receives an access token in the response:

```http
    {
        token_type": "Bearer",
        "expires_in": "86399",
        "ext_expires_in": "86399",
        "expires_on": "1668778654",
        "not_before": "1668691954",
        "resource": "https://api.loganalytics.io",
        "access_token": ""eyJ0eXAiOiJKV1QiLCJ.....Ax"
    }
```

#### Client Credentials Token URL (POST request)

```http
    POST /your-AAD-tenant_id/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials
    &client_id=<app-client-id>
    &redirect_uri=<app-redirect-id>
    &resource=https://api.loganalytics.io
    &client_secret=<app-client-secret>
```

Use the token in requests to the log analytics endpoint:

```http
    POST /v1/workspaces/your workspace id/query?timespan=P1D
    Host: https://api.loganalytics.io
    Content-Type: application/json
    Authorization: bearer <your access token>

    Body:
    {
    "query": "AzureActivity |summarize count() by Category"
    }
```

To use the ARM API endpoint, substitute `&resource=https://management.azure.com` in the body of the HTTP POST. You can then use the endpoint`https://management.azure.com/` as per the exam[ple below:

>[!NOTE]
> The ARM API endpoint has stricter limitation and does not support all features. For more information on ARM limitations for Log Analytics queries see [XXXXXXXXXXXX](https:learn.microsof.com/) 

```http
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


## More Information

You can find documentation about OAuth2 with Azure AD here:
 - [Azure AD Authorization Code flow](/azure/active-directory/develop/active-directory-protocols-oauth-code)
 - [Azure AD Implicit Grant flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant)
 - [Azure AD S2S Client Credentials flow](/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service)
