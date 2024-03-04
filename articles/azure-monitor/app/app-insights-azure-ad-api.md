---
title: Application Insights API Access with Microsoft Entra authentication
description: Learn how to authenticate and access the Azure Monitor Application Insights APIs using Microsoft Entra ID
ms.date: 04/11/2023
author: CourtGoodson
ms.topic: article
---
# Application Insights API Access with Microsoft Entra authentication

You can submit a query request by using the Azure Monitor Application Insights endpoint `https://api.applicationinsights.io`. To access the endpoint, you must authenticate through Microsoft Entra ID.

## Set up authentication

To access the API, you register a client app with Microsoft Entra ID and request a token.

1. [Register an app in Microsoft Entra ID](../logs/api/register-app-for-token.md).

1. On the app's overview page, select **API permissions**.
1. Select **Add a permission**.
1. On the **APIs my organization uses** tab, search for **Application Insights** and select **Application Insights API** from the list.

1. Select **Delegated permissions**.
1. Select the **Data.Read** checkbox.
1. Select **Add permissions**.

Now that your app is registered and has permissions to use the API, grant your app access to your Application Insights resource.

1. From your **Application Insights resource** overview page, select **Access control (IAM)**.
1. Select **Add role assignment**.

1. Select the **Reader** role and then select **Members**.

1. On the **Members** tab, choose **Select members**.
1. Enter the name of your app in the **Select** box.
1. Select your app and choose **Select**.
1. Select **Review + assign**.

1. After you finish the Active Directory setup and permissions, request an authorization token.

>[!Note]
> For this example, we applied the Reader role. This role is one of many built-in roles and might include more permissions than you require. More granular roles and permissions can be created. 

## Request an authorization token

Before you begin, make sure you have all the values required to make the request successfully. All requests require:
- Your Microsoft Entra tenant ID.
- Your App Insights App ID - If you are currently using API Keys, this is the same app ID.
- Your Microsoft Entra client ID for the app.
- A Microsoft Entra client secret for the app.

The Application Insights API supports Microsoft Entra authentication with three different [Microsoft Entra ID OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Client credentials
- Authorization code
- Implicit

### Client credentials flow

In the client credentials flow, the token is used with the Application Insights endpoint. A single request is made to receive a token by using the credentials provided for your app in the previous step when you [register an app in Microsoft Entra ID](../logs/api/register-app-for-token.md).

Use the `https://api.applicationinsights.io` endpoint.

#### Client credentials token URL (POST request)

```http
    POST /<your-tenant-id>/oauth2/token
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials
    &client_id=<app-client-id>
    &resource=https://api.applicationinsights.io
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

Use the token in requests to the Application Insights endpoint:

```http
    POST /v1/apps/yous_app_id/query?timespan=P1D
    Host: https://api.applicationinsights.io
    Content-Type: application/json
    Authorization: Bearer <your access token>

    Body:
    {
    "query": "requests | take 10"
    }
```

Example response:

```{
  "tables": [
    {
      "name": "PrimaryResult",
      "columns": [
        {
          "name": "timestamp",
          "type": "datetime"
        },
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "source",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "success",
          "type": "string"
        },
        {
          "name": "resultCode",
          "type": "string"
        },
        {
          "name": "duration",
          "type": "real"
        },
        {
          "name": "performanceBucket",
          "type": "string"
        },
        {
          "name": "customDimensions",
          "type": "dynamic"
        },
        {
          "name": "customMeasurements",
          "type": "dynamic"
        },
        {
          "name": "operation_Name",
          "type": "string"
        },
        {
          "name": "operation_Id",
          "type": "string"
        },
        {
          "name": "operation_ParentId",
          "type": "string"
        },
        {
          "name": "operation_SyntheticSource",
          "type": "string"
        },
        {
          "name": "session_Id",
          "type": "string"
        },
        {
          "name": "user_Id",
          "type": "string"
        },
        {
          "name": "user_AuthenticatedId",
          "type": "string"
        },
        {
          "name": "user_AccountId",
          "type": "string"
        },
        {
          "name": "application_Version",
          "type": "string"
        },
        {
          "name": "client_Type",
          "type": "string"
        },
        {
          "name": "client_Model",
          "type": "string"
        },
        {
          "name": "client_OS",
          "type": "string"
        },
        {
          "name": "client_IP",
          "type": "string"
        },
        {
          "name": "client_City",
          "type": "string"
        },
        {
          "name": "client_StateOrProvince",
          "type": "string"
        },
        {
          "name": "client_CountryOrRegion",
          "type": "string"
        },
        {
          "name": "client_Browser",
          "type": "string"
        },
        {
          "name": "cloud_RoleName",
          "type": "string"
        },
        {
          "name": "cloud_RoleInstance",
          "type": "string"
        },
        {
          "name": "appId",
          "type": "string"
        },
        {
          "name": "appName",
          "type": "string"
        },
        {
          "name": "iKey",
          "type": "string"
        },
        {
          "name": "sdkVersion",
          "type": "string"
        },
        {
          "name": "itemId",
          "type": "string"
        },
        {
          "name": "itemType",
          "type": "string"
        },
        {
          "name": "itemCount",
          "type": "int"
        }
      ],
      "rows": [
        [
          "2018-02-01T17:33:09.788Z",
          "|0qRud6jz3k0=.c32c2659_",
          null,
          "GET Reports/Index",
          "http://fabrikamfiberapp.azurewebsites.net/Reports",
          "True",
          "200",
          "3.3833",
          "<250ms",
          "{\"_MS.ProcessedByMetricExtractors\":\"(Name:'Requests', Ver:'1.0')\"}",
          null,
          "GET Reports/Index",
          "0qRud6jz3k0=",
          "0qRud6jz3k0=",
          "Application Insights Availability Monitoring",
          "9fc6738d-7e26-44f0-b88e-6fae8ccb6b26",
          "us-va-ash-azr_9fc6738d-7e26-44f0-b88e-6fae8ccb6b26",
          null,
          null,
          "AutoGen_49c3aea0-4641-4675-93b5-55f7a62d22d3",
          "PC",
          null,
          null,
          "52.168.8.0",
          "Boydton",
          "Virginia",
          "United States",
          null,
          "fabrikamfiberapp",
          "RD00155D5053D1",
          "cf58dcfd-0683-487c-bc84-048789bca8e5",
          "fabrikamprod",
          "5a2e4e0c-e136-4a15-9824-90ba859b0a89",
          "web:2.5.0-33031",
          "051ad4ef-0776-11e8-ac6e-e30599af6943",
          "request",
          "1"
        ],
        [
          "2018-02-01T17:33:15.786Z",
          "|x/Ysh+M1TfU=.c32c265a_",
          null,
          "GET Home/Index",
          "http://fabrikamfiberapp.azurewebsites.net/",
          "True",
          "200",
          "716.2912",
          "500ms-1sec",
          "{\"_MS.ProcessedByMetricExtractors\":\"(Name:'Requests', Ver:'1.0')\"}",
          null,
          "GET Home/Index",
          "x/Ysh+M1TfU=",
          "x/Ysh+M1TfU=",
          "Application Insights Availability Monitoring",
          "58b15be6-d1e6-4d89-9919-52f63b840913",
          "emea-se-sto-edge_58b15be6-d1e6-4d89-9919-52f63b840913",
          null,
          null,
          "AutoGen_49c3aea0-4641-4675-93b5-55f7a62d22d3",
          "PC",
          null,
          null,
          "51.141.32.0",
          "Cardiff",
          "Cardiff",
          "United Kingdom",
          null,
          "fabrikamfiberapp",
          "RD00155D5053D1",
          "cf58dcfd-0683-487c-bc84-048789bca8e5",
          "fabrikamprod",
          "5a2e4e0c-e136-4a15-9824-90ba859b0a89",
          "web:2.5.0-33031",
          "051ad4f0-0776-11e8-ac6e-e30599af6943",
          "request",
          "1"
        ]
      ]
    }
  ]
}
```

### Authorization code flow

The main OAuth2 flow supported is through [authorization codes](/azure/active-directory/develop/active-directory-protocols-oauth-code). This method requires two HTTP requests to acquire a token with which to call the Azure Monitor Application Insights API. There are two URLs, with one endpoint per request. Their formats are described in the following sections.

#### Authorization code URL (GET request)

```http
    GET https://login.microsoftonline.com/YOUR_Azure AD_TENANT/oauth2/authorize?
    client_id=<app-client-id>
    &response_type=code
    &redirect_uri=<app-redirect-uri>
    &resource=https://api.applicationinsights.io
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
    &resource=https://api.applicationinsights.io
    &client_secret=<app-client-secret>
```

All values are the same as before, with some additions. The authorization code is the same code you received in the previous request after a successful redirect. The code is combined with the key obtained from the Microsoft Entra app. If you didn't save the key, you can delete it and create a new one from the keys tab of the Microsoft Entra app menu. The response is a JSON string that contains the token with the following schema. Types are indicated for the token values.

Response example:

```http
    {
        "access_token": "eyJ0eXAiOiJKV1QiLCJ.....Ax",
        "expires_in": "3600",
        "ext_expires_in": "1503641912",
        "id_token": "not_needed_for_app_insights",
        "not_before": "1503638012",
        "refresh_token": "eyJ0esdfiJKV1ljhgYF.....Az",
        "resource": "https://api.applicationinsights.io",
        "scope": "Data.Read",
        "token_type": "bearer"
    }
```

The access token portion of this response is what you present to the Application Insights API in the `Authorization: Bearer` header. You can also use the refresh token in the future to acquire a new access\_token and refresh\_token when yours have gone stale. For this request, the format and endpoint are:

```http
    POST /YOUR_AAD_TENANT/oauth2/token HTTP/1.1
    Host: https://login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    
    client_id=<app-client-id>
    &refresh_token=<refresh-token>
    &grant_type=refresh_token
    &resource=https://api.applicationinsights.io
    &client_secret=<app-client-secret>
```

Response example:

```http
    {
      "token_type": "Bearer",
      "expires_in": "3600",
      "expires_on": "1460404526",
      "resource": "https://api.applicationinsights.io",
      "access_token": "eyJ0eXAiOiJKV1QiLCJ.....Ax",
      "refresh_token": "eyJ0esdfiJKV1ljhgYF.....Az"
    }
```

### Implicit code flow

The Application Insights API supports the OAuth2 [implicit flow](/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant). For this flow, only a single request is required, but no refresh token can be acquired.

#### Implicit code authorize URL

```http
    GET https://login.microsoftonline.com/YOUR_AAD_TENANT/oauth2/authorize?
    client_id=<app-client-id>
    &response_type=token
    &redirect_uri=<app-redirect-uri>
    &resource=https://api.applicationinsights.io
```

A successful request produces a redirect to your redirect URI with the token in the URL:

```http
    http://YOUR_REDIRECT_URI/#access_token=YOUR_ACCESS_TOKEN&token_type=Bearer&expires_in=3600&session_state=STATE_GUID
```

This access\_token can be used as the `Authorization: Bearer` header value when it's passed to the Application Insights API to authorize requests.
