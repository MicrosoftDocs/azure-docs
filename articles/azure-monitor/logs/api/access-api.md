---
title: API access and authentication
description: Learn how to authenticate and access the Azure Monitor Log Analytics API.
ms.date: 11/28/2022
author: guywi-ms
ms.author: guywild
ms.topic: article
---
# Access the Azure Monitor Log Analytics API

You can submit a query request to a workspace by using the Azure Monitor Log Analytics endpoint `https://api.loganalytics.azure.com`. To access the endpoint, you must authenticate through Microsoft Entra ID.

>[!Note]
> The `api.loganalytics.io` endpoint is being replaced by `api.loganalytics.azure.com`. The `api.loganalytics.io` endpoint will continue to be supported for the forseeable future.

## Authenticate with a demo API key

To quickly explore the API without Microsoft Entra authentication, use the demonstration workspace with sample data, which supports API key authentication.

To authenticate and run queries against the sample workspace, use `DEMO_WORKSPACE` as the {workspace-id} and pass in the API key `DEMO_KEY`.

If either the Application ID or the API key is incorrect, the API service returns a [403](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error) (Forbidden) error.

The API key `DEMO_KEY` can be passed in three different ways, depending on whether you want to use a header, the URL, or basic authentication:

- **Custom header**: Provide the API key in the custom header `X-Api-Key`.
- **Query parameter**: Provide the API key in the URL parameter `api_key`.
- **Basic authentication**: Provide the API key as either username or password. If you provide both, the API key must be in the username.

This example uses the workspace ID and API key in the header:

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
 - **api-version**: The API version. The current version is "v1."
 - **workspaceId**: Your workspace ID.
 
The query is passed in the request body.
 
For example:
 ```
    https://api.loganalytics.azure.com/v1/workspaces/1234abcd-def89-765a-9abc-def1234abcde
    
    Body:
    {
        "query": "Usage"
    }
```

## Set up authentication

To access the API, you register a client app with Microsoft Entra ID and request a token.

1. [Register an app in Microsoft Entra ID](./register-app-for-token.md).

1. On the app's overview page, select **API permissions**.
1. Select **Add a permission**.
1. On the **APIs my organization uses** tab, search for **Log Analytics** and select **Log Analytics API** from the list.

   :::image type="content" source="../media/api-register-app/request-api-permissions.png" alt-text="A screenshot that shows the Request API permissions page.":::

1. Select **Delegated permissions**.
1. Select the **Data.Read** checkbox.
1. Select **Add permissions**.

   :::image type="content" source="../media/api-register-app/add-requested-permissions.png" alt-text="A screenshot that shows the continuation of the Request API permissions page.":::

Now that your app is registered and has permissions to use the API, grant your app access to your Log Analytics workspace.

1. From your **Log Analytics workspace** overview page, select **Access control (IAM)**.
1. Select **Add role assignment**.

    :::image type="content" source="../media/api-register-app/workspace-access-control.png" alt-text="A screenshot that shows the Access control page for a Log Analytics workspace.":::

1. Select the **Reader** role and then select **Members**.

    :::image type="content" source="../media/api-register-app/add-role-assignment.png" alt-text="A screenshot that shows the Add role assignment page for a Log Analytics workspace.":::

1. On the **Members** tab, choose **Select members**.
1. Enter the name of your app in the **Select** box.
1. Select your app and choose **Select**.
1. Select **Review + assign**.

    :::image type="content" source="../media/api-register-app/select-members.png" alt-text="A screenshot that shows the Select members pane on the Add role assignment page for a Log Analytics workspace.":::

1. After you finish the Active Directory setup and workspace permissions, request an authorization token.

>[!Note]
> For this example, we applied the Reader role. This role is one of many built-in roles and might include more permissions than you require. More granular roles and permissions can be created. For more information, see [Manage access to Log Analytics workspaces](../../logs/manage-access.md).

## Request an authorization token

Before you begin, make sure you have all the values required to make the request successfully. All requests require:
- Your Microsoft Entra tenant ID.
- Your workspace ID.
- Your Microsoft Entra client ID for the app.
- A Microsoft Entra client secret for the app.

The Log Analytics API supports Microsoft Entra authentication with three different [Microsoft Entra ID OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Client credentials
- Authorization code
- Implicit

### Client credentials flow

In the client credentials flow, the token is used with the Log Analytics endpoint. A single request is made to receive a token by using the credentials provided for your app in the previous step when you [register an app in Microsoft Entra ID](./register-app-for-token.md).

Use the `https://api.loganalytics.azure.com` endpoint.

#### Client credentials token URL (POST request)

```http
    POST /<your-tenant-id>/oauth2/token
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

Use the token in requests to the Log Analytics endpoint:

```http
    POST /v1/workspaces/your workspace id/query?timespan=P1D
    Host: https://api.loganalytics.azure.com
    Content-Type: application/json
    Authorization: Bearer <your access token>

    Body:
    {
    "query": "AzureActivity |summarize count() by Category"
    }
```

Example response:

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

### Authorization code flow

The main OAuth2 flow supported is through [authorization codes](/azure/active-directory/develop/active-directory-protocols-oauth-code). This method requires two HTTP requests to acquire a token with which to call the Azure Monitor Log Analytics API. There are two URLs, with one endpoint per request. Their formats are described in the following sections.

#### Authorization code URL (GET request)

```http
    GET https://login.microsoftonline.com/YOUR_Azure AD_TENANT/oauth2/authorize?
    client_id=<app-client-id>
    &response_type=code
    &redirect_uri=<app-redirect-uri>
    &resource=https://api.loganalytics.io
```

When a request is made to the authorize URL, the client\_id is the application ID from your Microsoft Entra app, copied from the app's properties menu. The redirect\_uri is the homepage/login URL from the same Microsoft Entra app. When a request is successful, this endpoint redirects you to the sign-in page you provided at sign-up with the authorization code appended to the URL. See the following example:

```http
    http://<app-client-id>/?code=AUTHORIZATION_CODE&session_state=STATE_GUID
```

At this point, you've obtained an authorization code, which you need now to request an access token.

#### Authorization code token URL (POST request)

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

All values are the same as before, with some additions. The authorization code is the same code you received in the previous request after a successful redirect. The code is combined with the key obtained from the Microsoft Entra app. If you didn't save the key, you can delete it and create a new one from the keys tab of the Microsoft Entra app menu. The response is a JSON string that contains the token with the following schema. Types are indicated for the token values.

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

The access token portion of this response is what you present to the Log Analytics API in the `Authorization: Bearer` header. You can also use the refresh token in the future to acquire a new access\_token and refresh\_token when yours have gone stale. For this request, the format and endpoint are:

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

### Implicit code flow

The Log Analytics API supports the OAuth2 [implicit flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant). For this flow, only a single request is required, but no refresh token can be acquired.

#### Implicit code authorize URL

```http
    GET https://login.microsoftonline.com/YOUR_AAD_TENANT/oauth2/authorize?
    client_id=<app-client-id>
    &response_type=token
    &redirect_uri=<app-redirect-uri>
    &resource=https://api.loganalytics.io
```

A successful request produces a redirect to your redirect URI with the token in the URL:

```http
    http://YOUR_REDIRECT_URI/#access_token=YOUR_ACCESS_TOKEN&token_type=Bearer&expires_in=3600&session_state=STATE_GUID
```

This access\_token can be used as the `Authorization: Bearer` header value when it's passed to the Log Analytics API to authorize requests.

## More information

You can find documentation about OAuth2 with Microsoft Entra here:
 - [Microsoft Entra authorization code flow](/azure/active-directory/develop/active-directory-protocols-oauth-code)
 - [Microsoft Entra implicit grant flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant)
 - [Microsoft Entra S2S client credentials flow](/azure/active-directory/develop/active-directory-protocols-oauth-service-to-service)

## Next steps

- [Request format](./request-format.md)
- [Response format](./response-format.md)
- [Querying logs for Azure resources](./azure-resource-queries.md)
- [Batch queries](./batch-queries.md)
