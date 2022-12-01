---
title:  API Access and Authentication
description: How to Authenticate and access the Azure Monitor Log Analytics API.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/28/2022
ms.topic: article
---
# Access the Azure Monitor Log Analytics API

You can submit a query request to a workspace using the Azure Monitor Log Analytics endpoint `https://api.loganalytics.azure.com`. To access the endpoint, you must authenticate through Azure Active Directory (Azure AD). 
>[!Note]
> The `api.loganalytics.io` endpoint is being replaced by `api.loganalytics.azure.com`. `api.loganalytics.io` will continue to be be supported for the forseeable future.
## Authenticating with a demo API key

To quickly explore the API without Azure Active Directory authentication, use the demonstration workspace with sample data, which supports API key authentication.

To authenticate and run queries against the sample workspace, use `DEMO_WORKSPACE` as the {workspace-id} and pass in the API key `DEMO_KEY`.

If either the Application ID or the API key is incorrect, the API service will return a [403](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error) (Forbidden) error.

The API key `DEMO_KEY` can be passed in three different ways, depending on whether you prefer to use the URL, a header, or basic authentication.

1.  **Custom header**: provide the API key in the custom header `X-Api-Key`
2.  **Query parameter**: provide the API key in the URL parameter `api_key`
3.  **Basic authentication**: provide the API key as either username or password. If you provide both, the API key must be in the username.

This example uses the Workspace ID and API key in the header:

```
    POST https://api.loganalytics.azure.com/v1/workspaces/DEMO_WORKSPACE/query
    X-Api-Key: DEMO_KEY
    Content-Type: application/json
    
    {
        "query": "AzureActivity | summarize count() by Category"
    }
```
## Public API endpoint

The public API endpoint is:

```
    https://api.loganalytics.azure.com/{api-version}/workspaces/{workspaceId}
```
where:
 - **api-version**: The API version. The current version is "v1"
 - **workspaceId**: Your workspace ID  
 
The query is passed in the request body.
 
For example, 
 ```
    https://api.loganalytics.azure.com/v1/workspaces/1234abcd-def89-765a-9abc-def1234abcde
    
    Body:
    {
        "query": "Usage"
    }
```
## Set up Authentication

To access the  API, you need to register a client app with Azure Active Directory and request a token.
1. [Register an app in Azure Active Directory](./register-app-for-token.md).
1. After completing the Active Directory setup and workspace permissions, request an authorization token.

## Request an Authorization Token

Before beginning, make sure you have all the values required to make the request successfully. All requests require:
- Your Azure Active Directory tenant ID.
- Your workspace ID.
- Your Azure Active Directory client ID for the app.
- An Azure Active Directory client secret for the  app.

The Log Analytics API supports Azure Active Directory authentication with three different [Azure AD OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Client credentials 
- Authorization code
- Implicit


### Client Credentials Flow

In the client credentials flow, the token is used with the log analytics endpoint. A single request is made to receive a token, using the credentials provided for your app in the [Register an app for in Azure Active Directory](./register-app-for-token.md) step above.  
Use the `https://api.loganalytics.azure.com` endpoint. 

##### Client Credentials Token URL (POST request)

```http
    POST /<your-tenant-id>/oauth2/v2.0/token
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
        "access_token": ""eyJ0eXAiOiJKV1QiLCJ.....Ax"
    }
```

Use the token in requests to the log analytics endpoint:

```http
    POST /v1/workspaces/your workspace id/query?timespan=P1D
    Host: https://api.loganalytics.azure.com
    Content-Type: application/json
    Authorization: bearer <your access token>

    Body:
    {
    "query": "AzureActivity |summarize count() by Category"
    }
```


Example Response:

```http
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

```http
    GET https://login.microsoftonline.com/YOUR_Azure AD_TENANT/oauth2/authorize?
    client_id=<app-client-id>
    &response_type=code
    &redirect_uri=<app-redirect-uri>
    &resource=https://api.loganalytics.io
```

When making a request to the Authorize URL, the client\_id is the Application ID from your Azure AD App, copied from the App's properties menu. The redirect\_uri is the home page/login URL from the same Azure AD App. When a request is successful, this endpoint redirects you to the sign-in page you provided at sign-up with the authorization code appended to the URL. See the following example:

```http
    http://<app-client-id>/?code=AUTHORIZATION_CODE&session_state=STATE_GUID
```

At this point you'll have obtained an authorization code, which you need now to request an access token.

#### Authorization Code Token URL (POST request)

```http
    POST /YOUR_Azure AD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=authorization_code
    &client_id=<app client id>
    &code=<auth code fom GET request>
    &redirect_uri=<app-client-id>
    &resource=https://api.loganalytics.io
    &client_secret=<app-client-secret>
```

All values are the same as before, with some additions. The authorization code is the same code you received in the previous request after a successful redirect. The code is combined with the key obtained from the Azure AD App. If you didn't save the key, you can delete it and create a new one from the keys tab of the Azure AD App menu. The response is a JSON string containing the token with the following schema. Types are indicated for the token values.

Response example:

```http
    {
        "access_token": "eyJ0eXAiOiJKV1QiLCJ.....Ax",
        "expires_in": "3600",
        "ext_expires_in": "1503641912",
        "id_token": "not_needed_for_log_analytics",
        "not_before": "1503638012",
        "refresh_token": "eyJ0esdfiJKV1ljhgYF.....Az",
        "resource": "https://api.loganalytics.io",
        "scope": "Data.Read",
        "token_type": "bearer"
    }
```

The access token portion of this response is what you present to the Log Analytics API in the `Authorization: Bearer` header. You may also use the refresh token in the future to acquire a new access\_token and refresh\_token when yours have gone stale. For this request, the format and endpoint are:

```http
    POST /YOUR_AAD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    client_id=<app-client-id>
    &refresh_token=<refresh-token>
    &grant_type=refresh_token
    &resource=https://api.loganalytics.io
    &client_secret=<app-client-secret>
```

Response example:

```http
    {
      "token_type": "Bearer",
      "expires_in": "3600",
      "expires_on": "1460404526",
      "resource": "https://api.loganalytics.io",
      "access_token": "eyJ0eXAiOiJKV1QiLCJ.....Ax",
      "refresh_token": "eyJ0esdfiJKV1ljhgYF.....Az"
    }
```

### Implicit Code Flow

The Log Analytics API supports the OAuth2 [implicit flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant). For this flow, only a single request is required but no refresh token can be acquired.

#### Implicit Code Authorize URL

```http
    GET https://login.microsoftonline.com/YOUR_AAD_TENANT/oauth2/authorize?
    client_id=<app-client-id>
    &response_type=token
    &redirect_uri=<app-redirect-uri>
    &resource=https://api.loganalytics.io
```

A successful request will produce a redirect to your redirect URI with the token in the URL as follows.

```http
    http://YOUR_REDIRECT_URI/#access_token=YOUR_ACCESS_TOKEN&token_type=Bearer&expires_in=3600&session_state=STATE_GUID
```

This access\_token can be used as the `Authorization: Bearer` header value when passed to the Log Analytics API to authorize requests.

## More Information

You can find documentation about OAuth2 with Azure AD here:
 - [Azure AD Authorization Code flow](/azure/active-directory/develop/active-directory-protocols-oauth-code)
 - [Azure AD Implicit Grant flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant)
 - [Azure AD S2S Client Credentials flow](/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service)


## Next steps

- [Request format](./request-format.md)  
- [Response format](./response-format.md)  
- [Querying logs for Azure resources](./azure-resource-queries.md)  
- [Batch queries](./batch-queries.md)  
