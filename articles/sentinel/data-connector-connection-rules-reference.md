---
title: RestApiPoller data connector reference for the Codeless Connector Framework
titleSuffix: Microsoft Sentinel
description: This article provides reference JSON fields and properties to create the RestApiPoller data connector type and its data connection rules for the Codeless Connector Framework.
services: sentinel
author: EdB-MSFT
ms.topic: reference
ms.date: 9/30/2024
ms.author: edbaynash

#Customer intent: As a security engineer, I want to reference paging, authentication, and payload options to create and configure RestApiPoller data connectors by using the Codeless Connector Framework. By using RestApiPoller data connectors, I can integrate a specific data source into Microsoft Sentinel without writing custom code.

---

# RestApiPoller data connector reference for the Codeless Connector Framework

You can create a `RestApiPoller` data connector with the Codeless Connector Framework (CCF) by using this article as a supplement to the [Microsoft Sentinel REST API for data connectors](/rest/api/securityinsights/data-connectors) docs.

Each data connector represents a specific *connection* of a Microsoft Sentinel data connector. One data connector might have multiple connections, which fetch data from different endpoints. You can complete the deployment template for the CCF data connector by using the JSON configuration that you build with this article.

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md#create-the-deployment-template).

## Creating or updating data connectors

Find the latest stable or preview API version by referencing the [`create` or `update`](/rest/api/securityinsights/data-connectors/create-or-update) operations in the REST API docs. The difference between the `create` and `update` operations is that `update` requires the `etag` value.

`PUT` method:

```http
https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.OperationalInsights/workspaces/{{workspaceName}}/providers/Microsoft.SecurityInsights/dataConnectors/{{dataConnectorId}}?api-version={{apiVersion}}
```

## URI parameters

For more information about the latest API version, see [Data connectors: create or update URI parameters](/rest/api/securityinsights/data-connectors/create-or-update#uri-parameters).

|Name  | Description  |
|---------|---------|
| `dataConnectorId` | The data connector ID. It must be a unique name that's the same as the `name` parameter in the [request body](#request-body). |
| `resourceGroupName` | The name of the resource group, not case sensitive. |
| `subscriptionId` | The ID of the target subscription. |
| `workspaceName` | The *name* of the workspace, not the ID.<br> The regex pattern is `^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$`. |
| `api-version` | The API version to use for this operation. |

## Request body

The request body for a `RestApiPoller` CCF data connector has the following structure:

```json
{
   "name": "{{dataConnectorId}}",
   "kind": "RestApiPoller",
   "etag": "",
   "properties": {
        "connectorDefinitionName": "",
        "auth": {},
        "request": {},
        "response": {},
        "paging": "",
        "dcrConfig": ""
   }
}

```

### RestApiPoller

`RestApiPoller` is an API poller CCF data connector that you can use to customize paging, authorization, and request/response payloads for your data source.

| Name | Required | Type | Description |
| ---- | ---- | ---- | ---- |
| `name` | True | String | The unique name of the connection that matches the URI parameter. |
| `kind` | True | String | The `kind` value. This field must be set to `RestApiPoller`. |
| `etag` |  | GUID | The `etag` value. This field must be left empty for new connector creation. For update operations, `etag` must match the existing connector `etag` (GUID). |
| `properties.connectorDefinitionName` |  | String | The name of the `DataConnectorDefinition` resource that defines the UI configuration of the data connector. For more information, go to [Data connector definition](create-codeless-connector.md#data-connector-user-interface). |
| `properties.auth`	| True | Nested JSON | The authentication properties for polling the data. For more information, go to [Authentication configuration](#authentication-configuration). |
| `properties.request` | True | Nested JSON | The request payload for polling the data, such as the API endpoint. For more information, go to [Request configuration](#request-configuration). |
| `properties. response` | True | Nested JSON | The response object and nested message the API returns when it polls the data. For more information, go to [Response configuration](#response-configuration). |
| `properties.paging` |  | Nested JSON | The pagination payload when polling the data. For more information, go to [Paging configuration](#paging-configuration). |
| `properties.dcrConfig` |  | Nested JSON | The required parameters when the data is sent to a data collection rule (DCR). For more information, go to [DCR configuration](#dcr-configuration). |

## Authentication configuration

The CCF supports the following authentication types:

- [Basic](#basic-auth)
- [API key](#api-key)
- [OAuth2](#oauth2)
- [JWT](#jwt)

> [!NOTE]
> CCF OAuth2 implementation doesn't support client certificate credentials.

As a best practice, use parameters in the authentication section instead of hard-coding credentials. For more information, see [Secure confidential input](create-codeless-connector.md#secure-confidential-input).

To create the deployment template, which also uses parameters, you need to escape the parameters in this section with an extra starting `[`. This step allows the parameters to assign a value based on the user interaction with the connector. For more information, see [Template expressions escape characters](../azure-resource-manager/templates/template-expressions.md#escape-characters).

To enable the credentials to be entered from the UI, the `connectorUIConfig` section requires you enter the desired parameters in `instructions`. For more information, see [Data connector definitions reference for the Codeless Connector Framework](data-connector-ui-definitions-reference.md#instructions).

#### <a name = "basic-auth"></a> Basic authentication

| Field | Required | Type |
| ---- | ---- | ---- |
| `UserName` | True | String |
| `Password` | True | String |

Here's an example of basic authentication that uses parameters defined in `connectorUIconfig`:

```json
"auth": {
    "type": "Basic",
    "UserName": "[[parameters('username')]",
    "Password": "[[parameters('password')]"
}
```

#### API key

| Field | Required | Type | Description | Default value |
| ---- | ---- | ---- | ---- | ---- |
| `ApiKey` | True | String | User secret key. | |
| `ApiKeyName` | | String | Name of the URI header that contains the `ApiKey` value. | `Authorization` | 
| `ApiKeyIdentifier` | | String | String value to prepend the token. | `token` |
| `IsApiKeyInPostPayload` | | Boolean | Value that determines whether to send the secret in the `POST` body instead of header. | `false` |

`APIKey` authentication examples:

```json
"auth": {
    "type": "APIKey",
    "ApiKey": "[[parameters('apikey')]",
    "ApiKeyName": "X-MyApp-Auth-Header",
    "ApiKeyIdentifier": "Bearer"
}
```

The result of this example is the secret defined from the user input sent in the following header: `X-MyApp-Auth-Header`: `Bearer apikey`.

```json
"auth": { 
    "type": "APIKey",
    "ApiKey": "123123123",
}
```

This example uses the default values and results in the following header: `Authorization`: `token 123123123`.

```json
"auth": { 
    "type": "APIKey",
    "ApiKey": "123123123",
    "ApiKeyName": ""
}
```

Because `ApiKeyName` is explicitly set to `""`, the result is the following header: `Authorization`: `123123123`.

#### OAuth2

The Codeless Connector Framework supports OAuth 2.0 authorization code grant and client credentials. The **Authorization Code** grant type is used by confidential and public clients to exchange an authorization code for an access token.

After the user returns to the client via the redirect URL, the application will get the authorization code from the URL and use it to request an access token.

|Field | Required | Type | Description |
| ---- | ---- | ---- | ---- | 
| `ClientId` | True. | String | The client ID. |
| `ClientSecret`| True. | String | The client secret. |
| `AuthorizationCode` | True when the `grantType` value is `authorization_code`. | String | If the grant type is `authorization_code`, this field value is the authorization code that the authentication server returned. |
| `Scope` | True for the `authorization_code` grant type.<br> Optional for the `client_credentials` grant type. | String | A space-separated list of scopes for user consent. For more information, see [OAuth2 scopes and permissions](/entra/identity-platform/scopes-oidc). |
| `RedirectUri` | True when the `grantType` value is `authorization_code`. | String | The URL for redirect must be `https://portal.azure.com/TokenAuthorize/ExtensionName/Microsoft_Azure_Security_Insights`. |
| `GrantType` | True. | String | The grant type. Can be `authorization_code` or `client_credentials`. |
| `TokenEndpoint` | True. | String | The URL to exchange code with a valid token in the `authorization_code` grant, or a client ID and secret with a valid token in the `client_credentials` grant. |
| `TokenEndpointHeaders` |  | Object | An optional key/value object to send custom headers to the token server. |
| `TokenEndpointQueryParameters` |  | Object | An optional key/value object to send custom query parameters to the token server. |
| `AuthorizationEndpoint`	| True. | String | The URL for user consent for the `authorization_code` flow. |
| `AuthorizationEndpointHeaders` |	 | Object | An optional key/value object to send custom headers to the authentication server. |
| `AuthorizationEndpointQueryParameters`	|  | Object | An optional key/value pair used in an OAuth2 authorization code flow request. |

You can use authentication code flow to fetch data on behalf of a user's permissions. You can use client credentials to fetch data with application permissions. The data server grants access to the application. Because there's no user in client credentials flow, no authorization endpoint is needed, only a token endpoint.

Here's an example of the OAuth2 `authorization_code` grant type:

```json
"auth": {
    "type": "OAuth2",
    "ClientId": "[[parameters('appId')]",
    "ClientSecret": "[[parameters('appSecret')]",
    "tokenEndpoint": "https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token",
    "authorizationEndpoint": "https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/authorize",
    "authorizationEndpointHeaders": {},
    "authorizationEndpointQueryParameters": {
        "prompt": "consent"
    },
    "redirectUri": "https://portal.azure.com/TokenAuthorize/ExtensionName/Microsoft_Azure_Security_Insights",
    "tokenEndpointHeaders": {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "TokenEndpointQueryParameters": {},
    "scope": "openid offline_access some_scope",
    "grantType": "authorization_code"
}
```

Here's an example of the OAuth2 `client_credentials` grant type:

```json
"auth": {
    "type": "OAuth2",
    "ClientId": "[[parameters('appId')]",
    "ClientSecret": "[[parameters('appSecret')]",
    "tokenEndpoint": "https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token",
    "tokenEndpointHeaders": {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "TokenEndpointQueryParameters": {},
    "scope": "openid offline_access some_scope",
    "grantType": "client_credentials"
}
```

#### JWT

JSON Web Token (JWT) authentication supports obtaining tokens via username and password credentials and using them for API requests.

##### Basic example

```json
"auth": {
    "type": "JwtToken",
    "userName": {
        "key": "username",
        "value": "[[parameters('UserName')]"
    },
    "password": {
        "key": "password", 
        "value": "[[parameters('Password')]"
    },
    "TokenEndpoint": "https://token_endpoint.contoso.com",
    "IsJsonRequest": true,
    "JwtTokenJsonPath": "$.access_token"
}
```

##### Credentials in POST body (default)

```json
"auth": {
    "type": "JwtToken",
    "userName": {
        "key": "username",
        "value": "[[parameters('UserName')]"
    },
    "password": {
        "key": "password",
        "value": "[[parameters('Password')]"
    },
    "TokenEndpoint": "https://api.example.com/token",
    "Headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    "IsCredentialsInHeaders": false,
    "IsJsonRequest": true,
    "JwtTokenJsonPath": "$.access_token"
}
```

##### Credentials in headers (basic authentication)

```json
"auth": {
    "type": "JwtToken",
    "userName": {
        "key": "client_id",
        "value": "[[parameters('ClientId')]"
    },
    "password": {
        "key": "client_secret",
        "value": "[[parameters('ClientSecret')]"
    },
    "TokenEndpoint": "https://api.example.com/oauth/token",
    "Headers": {
        "Accept": "application/json"
    },
    "IsCredentialsInHeaders": true,
    "IsJsonRequest": true,
    "JwtTokenJsonPath": "$.access_token",
    "RequestTimeoutInSeconds": 30
}
```

##### Credentials in headers (user token)

```json
"auth": {
    "type": "JwtToken",
    "UserToken": "[[parameters('userToken')]",
    "UserTokenPrepend": "Bearer",
    "TokenEndpoint": "https://api.example.com/oauth/token",
    "Headers": {
        "Accept": "application/json"
    },
    "TokenEndpointHttpMethod": "GET",
    "NoAccessTokenPrepend": true,
    "JwtTokenJsonPath": "$.systemToken"
}
```

Follow this authentication flow:

1. Send credentials to `TokenEndpoint` to obtain JWT token, when using `userName` and `password`, `IsCredentialsInHeaders` is used to determine where to put credentials in the request.

   - If `IsCredentialsInHeaders: true`: Sends a basic authentication header with `username:password`.
   - If `IsCredentialsInHeaders: false`: Sends credentials in a `POST` body.

2. Extract the token by using `JwtTokenJsonPath` or from the response header.

3. The Authorization header for the JWT tokens is a constant and will always be "Authorization".

|Field |Required |Type |Description	|
| ---- | ---- | ---- | ---- |
| `type`                      | True      | String   | The type. Must be `JwtToken` |
| `userName`                  | True (if `userToken` isn't used)      | Object   | The key/value pair for the `userName` credential. If `userName` and `password` are sent in the header request, specify the `value` property with the username. If `userName` and `password` are sent in the body request, specify `Key` and `Value`. |
| `password`                  | True (if `userToken` isn't used) | Object   | The key/value pair for the password credential. If `userName` and `password` are sent in the header request, specify the `value` property with the `userName`. If `userName` and `password` are sent in the body request, specify `Key` and `Value`. |
| `userToken`                  | True (if `userName` isn't used)     | String   | The user token generated by the client to get the system token for authentication. |
| `UserTokenPrepend`                  | False     | String   | The value that indicates whether to prepend text before the token. Default: `Bearer`. |
| `NoAccessTokenPrepend`                  | False     | Boolean   | An access flag that indicates that the token shouldn't prepend anything. |
| `TokenEndpointHttpMethod`                  | False     | String   | The HTTP method for token endpoint. It can be `Get` or `Post`. The default is `Post`. |
| `TokenEndpoint`             | True      | String   | The URL endpoint that's used to obtain the JWT token. |
| `IsCredentialsInHeaders`    |           | Boolean  | The value that indicates whether to send credentials as a basic authentication header (`true`) versus a `POST` body (`false`), ignored when using `userToken`. The default is `false`. |
| `IsJsonRequest`             |           | Boolean  | The value that indicates whether to send the request in JSON (header `Content-Type = application/json`) versus form-encoded (header `Content-Type = application/x-www-form-urlencoded`). The default is `false`. |
| `JwtTokenJsonPath`          |           | String   | The value that indicates the `JSONPath` value to use to extract the token from the response. For example: `$.access_token`. |
| `JwtTokenInResponseHeader`  |           | Boolean  | The value that indicates whether to extract the token from the response header versus the body. The default is `false`. |
| `JwtTokenHeaderName`.        |           | String   | The value that indicates the header name when the token is in the response header. The default is `Authorization`. |
| `JwtTokenIdentifier`        |           | String   | The identifier used to extract the JWT from a prefixed token string. |
| `QueryParameters`           |           | Object   | The custom query parameters to include when sending the request to the token endpoint. |
| `Headers`                   |           | Object   | The custom headers to include when sending the request to the token endpoint. |
| `RequestTimeoutInSeconds`   |           | Integer  | The request timeout in seconds. The default value is `100`, with a maximum value of `180`. |

   > [!NOTE]
   > Limitations
   >
   > - Requires username and password authentication for token acquisition
   > - Doesn't support API key-based token requests
   > - Doesn't support custom header authentication (without username and password)

## Request configuration

The request section defines how the CCF data connector sends requests to your data source (for example, the API endpoint and how often to poll that endpoint).

|Field |Required |Type |Description	|
| ---- | ---- | ---- | ---- |
| `ApiEndpoint` | True. | String | This field determines the URL for the remote server and defines the endpoint from which to pull data. |
| `RateLimitQPS` |  | Integer | This field defines the number of calls or queries allowed in a second. |
| `RateLimitConfig` |  | Object | This field defines the rate-limit configuration for the RESTful API. For more, go to [`RateLimitConfig` example](#ratelimitconfig-example). |
| `QueryWindowInMin` |  | Integer | This field defines the available query window in minutes. The minimum is 1 minute. The default is 5 minutes.|
| `HttpMethod` |  | String | This field defines the API method: `GET`(default) or `POST`. |
| `QueryTimeFormat` |  | String | This field defines the date and time format the endpoint (remote server) expects. The CCF uses the current date and time wherever this variable is used. Possible values are the constants: `UnixTimestamp`, `UnixTimestampInMills`, or any other valid representation of date and time. For example: `yyyy-MM-dd`, `MM/dd/yyyy HH:mm:ss`.<br> The default is `ISO 8601 UTC`. |
| `RetryCount` |  | Integer (1...6) | This field defines that values of `1` to `6` retries are allowed to recover from a failure. The default value is `3`. |
| `TimeoutInSeconds` |  | Integer (1...180) | This field defines the request timeout in seconds. The default value is `20`. |
| `IsPostPayloadJson` |  | Boolean | This field determines whether the `POST` payload is in JSON format. The default value is `false`. |
| `Headers` |  | Object | This field includes key/value pairs that define the request headers. |
| `QueryParameters` |  | Object | This field includes key/value pairs that define the request query parameters. |
| `StartTimeAttributeName` | True when the `EndTimeAttributeName` value is set. | String | This field defines the query parameter name for the query start time. For more, go to [`StartTimeAttributeName` example](#starttimeattributename-example). |
| `EndTimeAttributeName` | True when `StartTimeAttributeName` is set. | String | This field defines the query parameter name for query end time. |
| `QueryTimeIntervalAttributeName` |  | String | This field is used if the endpoint requires a specialized format for querying the data on a time frame. Use this property with the `QueryTimeIntervalPrepend` and `QueryTimeIntervalDelimiter` parameters. For more, go to [`QueryTimeIntervalAttributeName` example](#querytimeintervalattributename-example). |
| `QueryTimeIntervalPrepend` | True when `QueryTimeIntervalAttributeName` is set. | String | Reference `QueryTimeIntervalAttributeName`. |
| `QueryTimeIntervalDelimiter` |  True when `QueryTimeIntervalAttributeName` is set. | String | Reference `QueryTimeIntervalAttributeName`. |
| `QueryParametersTemplate` |  | String | This field references the query template to use when passing parameters in advanced scenarios.<br><br>For example: `"queryParametersTemplate": "{'cid': 1234567, 'cmd': 'reporting', 'format': 'siem', 'data': { 'from': '{_QueryWindowStartTime}', 'to': '{_QueryWindowEndTime}'}, '{_APIKeyName}': '{_APIKey}'}"`. |
| `InitialCheckpointTimeUtc` |  | DateTime (UTC) | Specifies the query start time for the very first poll when no stored checkpoint exists. Once a checkpoint is persisted after the first successful poll, this value is ignored. This setting only takes effect when the connector's request configuration defines a start-time query parameter (such as `startTimeAttributeName` or the `{_QueryWindowStartTime}` replacement token) without a corresponding end-time parameter. It has no effect on connectors that rely solely on pagination cursors or tokens. Format: ISO 8601 UTC datetime (for example, `2024-01-15T00:00:00Z`). |

When the API requires complex parameters, use `queryParameters` or `queryParametersTemplate`. These commands include some built-in variables.

| Built-in variable | For use in `queryParameters` | For use in `queryParametersTemplate` |
| ---- | ---- | ---- |
| `_QueryWindowStartTime` | Yes | Yes |
| `_QueryWindowEndTime` | Yes | Yes |
| `_APIKeyName` | No | Yes |
| `_APIKey` | No | Yes |

### StartTimeAttributeName example

Consider this example:

- `StartTimeAttributeName` = `from`
- `EndTimeAttributeName` = `until`
- `ApiEndpoint` = `https://www.example.com`

The query sent to the remote server is: `https://www.example.com?from={QueryTimeFormat}&until={QueryTimeFormat + QueryWindowInMin}`.

### QueryTimeIntervalAttributeName example

Consider this example:

- `QueryTimeIntervalAttributeName` = `interval`
- `QueryTimeIntervalPrepend` = `time:`
- `QueryTimeIntervalDelimiter` = `..`
- `ApiEndpoint` = `https://www.example.com`

The query sent to the remote server is: `https://www.example.com?interval=time:{QueryTimeFormat}..{QueryTimeFormat + QueryWindowInMin}`.

### RateLimitConfig example

Consider this example:

`ApiEndpoint` = `https://www.example.com`.

```json
"rateLimitConfig": {
  "evaluation": {
    "checkMode": "OnlyWhen429"
  },
  "extraction": {
    "source": "CustomHeaders",
    "headers": {
      "limit": {
        "name": "X-RateLimit-Limit",
        "format": "Integer"
      },
      "remaining": {
        "name": "X-RateLimit-Remaining",
        "format": "Integer"
      },
      "reset": {
        "name": "X-RateLimit-RetryAfter",
        "format": "UnixTimeSeconds"
      }
    }
  },
  "retryStrategy": {
    "useResetOrRetryAfterHeaders": true
  }
}
```

When the response includes rate limit headers, the connector can use this information to adjust its request rate.

### Request examples that use Microsoft Graph as the data source API

This example queries messages with a filter query parameter. For more information, see [Microsoft Graph API query parameters](/graph/use-the-api#query-parameters).

```json
"request": {
  "apiEndpoint": "https://graph.microsoft.com/v1.0/me/messages",
  "httpMethod": "Get",
  "queryTimeFormat": "yyyy-MM-ddTHH:mm:ssZ",
  "queryWindowInMin": 10,
  "retryCount": 3,
  "rateLimitQPS": 20,
  "headers": {
    "Accept": "application/json",
    "User-Agent": "Example-app-agent"
  },
  "QueryTimeIntervalAttributeName": "filter",
  "QueryTimeIntervalPrepend": "receivedDateTime gt ",
  "QueryTimeIntervalDelimiter": " and receivedDateTime lt "
}
```

The previous example sends a `GET` request to `https://graph.microsoft.com/v1.0/me/messages?filter=receivedDateTime gt {time of request} and receivedDateTime lt 2019-09-01T17:00:00.0000000`. The time stamp updates for each `queryWindowInMin` time.

You achieve the same results with this example:

```json
"request": {
  "apiEndpoint": "https://graph.microsoft.com/v1.0/me/messages",
  "httpMethod": "Get",
  "queryTimeFormat": "yyyy-MM-ddTHH:mm:ssZ",
  "queryWindowInMin": 10,
  "retryCount": 3,
  "rateLimitQPS": 20,
  "headers": {
    "Accept": "application/json",
  },
  "queryParameters": {
    "filter": "receivedDateTime gt {_QueryWindowStartTime} and receivedDateTime lt {_QueryWindowEndTime}"
  }
}
```

There's another option for situations when the data source expects two query parameters (one for start time and one for end time).

Example:

```json
"request": {
  "apiEndpoint": "https://graph.microsoft.com/v1.0/me/calendarView",
  "httpMethod": "Get",
  "queryTimeFormat": "yyyy-MM-ddTHH:mm:ssZ",
  "queryWindowInMin": 10,
  "retryCount": 3,
  "rateLimitQPS": 20,
  "headers": {
    "Accept": "application/json",
  },
  "StartTimeAttributeName": "startDateTime",
  "EndTimeAttributeName": "endDateTime",
}
```

This option sends a `GET` request to `https://graph.microsoft.com/me/calendarView?startDateTime=2019-09-01T09:00:00.0000000&endDateTime=2019-09-01T17:00:00.0000000`.

For complex queries, use `QueryParametersTemplate`. This example sends a `POST` request with parameters in the body:

```json
"request": {
  "apiEndpoint": "https://graph.microsoft.com/v1.0/me/messages",
  "httpMethod": "POST",
  "queryTimeFormat": "yyyy-MM-ddTHH:mm:ssZ",
  "queryWindowInMin": 10,
  "retryCount": 3,
  "rateLimitQPS": 20,
  "headers": {
    "Accept": "application/json",
  },
  "isPostPayloadJson": true,
  "queryParametersTemplate": "{\"query":"TableName | where createdTimestamp between (datetime({_QueryWindowStartTime}) .. datetime({_QueryWindowEndTime}))\"}"
}
```

## Response configuration

Define how your data connector handles responses by using the following parameters:

| Field | Required | Type | Description |
|----|----|----|----|
| `EventsJsonPaths` | True | List of strings | Defines the path to the message in the response JSON. A JSON path expression specifies a path to an element, or a set of elements, in a JSON structure. |
| `SuccessStatusJsonPath` |  | String | Defines the path to the success message in the response JSON. When this parameter is defined, the `SuccessStatusValue` parameter should also be defined. |
| `SuccessStatusValue` |  | String | Defines the path to the success message value in the response JSON. |
| `IsGzipCompressed` |  | Boolean | Determines whether the response is compressed in a GZIP file.	|
| `format` | True | String | Determines whether the format is `json`, `csv`, or `xml`. |
| `CompressionAlgo` |  | String | Defines the compressions algorithm, either `multi-gzip` or `deflate`. For the GZIP compression algorithm, configure `IsGzipCompressed` to `True` instead of setting a value for this parameter. |
| `CsvDelimiter` |  | String | References if the response format is CSV and you want to change the default CSV delimiter of `","`. |
| `HasCsvBoundary` |  | Boolean | Indicates if the CSV data has a boundary. |
| `HasCsvHeader` |  | Boolean | Indicates if the CSV data has a header. The default is `True`. |
| `CsvEscape` |  | String | Defines an escape character for a field boundary. The default is `"`<br><br>For example, a CSV with headers `id,name,avg` and a row of data containing spaces like `1,"my name",5.5` requires the `"` field boundary. |
| `ConvertChildPropertiesToArray` |  | Boolean | References a special case in which the remote server returns an object instead of a list of events where each property includes data. |

> [!NOTE]
> CSV format type is parsed by the [`RFC4180`](https://www.rfc-editor.org/rfc/rfc4180) specification.

### Response configuration examples

A server response in JSON format is expected. The response has the requested data in the property *value*. The response property *status* indicates to ingest the data only if the value is `success`.

```json
"response": {
  "EventsJsonPaths ": ["$.value"],
  "format": "json",
  "SuccessStatusJsonPath": "$.status",
  "SuccessStatusValue": "success",
  "IsGzipCompressed": true
 }
```

The expected response in this example prepares for a CSV with no header.

```json
"response": {
  "EventsJsonPaths ": ["$"],
  "format": "csv",
  "HasCsvHeader": false
 }
```

## Paging configuration

When the data source can't send the entire response payload all at once, the CCF data connector needs to know how to receive portions of the data in response *pages*. The paging types to choose from are:

| Paging type | Decision factor |
|----|----|
| <ul><li>[`LinkHeader`](#configure-linkheader-or-persistentlinkheader)</li><li>[`PersistentLinkHeader`](#configure-linkheader-or-persistentlinkheader)</li><li>[`NextPageUrl`](#configure-nextpageurl)</li></ul> | Does the API response have links to the next and previous pages? |
| <ul><li>[`NextPageToken`](#configure-nextpagetoken-or-persistenttoken)</li><li>[`PersistentToken`](#configure-nextpagetoken-or-persistenttoken)</li> | Does the API response have a token or cursor for the next and previous pages? |
| <ul><li>[`Offset`](#configure-offset)</li></ul> | Does the API response support a parameter for the number of objects to skip when paging? |
| <ul><li>[`CountBasedPaging`](#configure-countbasedpaging)</li></ul> | Does the API response support a parameter for the number of objects to return? |

#### Configure LinkHeader or PersistentLinkHeader

The most common paging type is when a server data source API provides URLs to the next and previous pages of data. For more information on the **Link Header** specification, see [`RFC 5988`](https://www.rfc-editor.org/rfc/rfc5988#section-5).

`LinkHeader` paging means the API response includes either:

- The `Link` HTTP response header.
- A JSON path to retrieve the link from the response body.

`PersistentLinkHeader`-type paging has the same properties as `LinkHeader`, except the link header persists in back-end storage. This option enables paging links across query windows.

For example, some APIs don't support query start times or end times. Instead, they support a server side *cursor*. You can use persistent page types to remember the server side *cursor*. For more information, see [What is a cursor?](/office/client-developer/access/desktop-database-reference/what-is-a-cursor).

> [!NOTE]
> Only one query for the connector can run with `PersistentLinkHeader` to avoid race conditions on the server side *cursor*. This issue might affect latency.

| Field | Required | Type | Description |
|----|----|----|----|
| `LinkHeaderTokenJsonPath` | False | String | Use this property to indicate where to get the value in the response body.<br><br>For example, if the data source returns the following JSON: `{ nextPage: "foo", value: [{data}]}`, the `LinkHeaderTokenJsonPath` value is `$.nextPage`. |
| `PageSize` | False | Integer | Use this property to determine the number of events per page. |
| `PageSizeParameterName` | False | String | Use this query parameter name to indicate the page size. |
| `PagingInfoPlacement` | False | String | Use this property to determine how paging info is populated. Accepts either `QueryString` or `RequestBody`. |
| `PagingQueryParamOnly` | False | Boolean | Use this property to specify query parameters. If set to true, it omits all other query parameters except paging query parameters. |

Here are some examples:

```json
"paging": {
  "pagingType": "LinkHeader",
  "linkHeaderTokenJsonPath" : "$.metadata.links.next"
}
```

```json
"paging": {
 "pagingType" : "PersistentLinkHeader", 
 "pageSizeParameterName" : "limit", 
 "pageSize" : 500 
}
```

#### Configure NextPageUrl

`NextPageUrl`-type paging means the API response includes a complex link in the response body similar to `LinkHeader`, but the URL is included in the response body instead of the header.

| Field | Required | Type | Description |
|----|----|----|----|
| `PageSize` | False | Integer | The number of events per page. |
| `PageSizeParameterName` | False | String | The query parameter name for the page size. |
| `NextPageUrl` | False | String | Field that's used only if the connector is for the Coralogix API. |
| `NextPageUrlQueryParameters` | False | Object | Key/value pairs that add a custom query parameter to each request for the next page. |
| `NextPageParaName` | False | String | The next page name in the request. |
| `HasNextFlagJsonPath` | False | String | The path to the `HasNextPage` flag attribute. |
| `NextPageRequestHeader` | False | String | The next page header name in the request. |
| `NextPageUrlQueryParametersTemplate` | False | String | Field that's used only if the connector is for the Coralogix API. |
| `PagingInfoPlacement` | False | String | Field that determines how paging info is populated. Accepts either `QueryString` or `RequestBody`. |
| `PagingQueryParamOnly` | False | Boolean | Field that determines query parameters. If set to true, it omits all other query parameters except paging query parameters. |

Example:

```json
"paging": {
 "pagingType" : "NextPageUrl", 
  "nextPageTokenJsonPath" : "$.data.repository.pageInfo.endCursor", 
  "hasNextFlagJsonPath" : "$.data.repository.pageInfo.hasNextPage", 
  "nextPageUrl" : "https://api.github.com/graphql", 
  "nextPageUrlQueryParametersTemplate" : "{'query':'query{repository(owner:\"xyz\")}" 
}
```

#### Configure NextPageToken or PersistentToken

`NextPageToken`-type pagination uses a token (a hash or a cursor) that represents the state of the current page. The token is included in the API response and the client appends it to the next request to fetch the next page. This method is often used when the server needs to maintain the exact state between requests.

`PersistentToken` pagination uses a token that persists server side. The server remembers the last token the client retrieved and provides the next token in subsequent requests. The client continues where it left off, even if it makes new requests later.

| Field | Required | Type | Description |
|----|----|----|----|
| `PageSize` | False | Integer | Number of events per page. |
| `PageSizeParameterName` | False | String | Query parameter name for the page size. |
| `NextPageTokenJsonPath` | False | String | JSON path for the next page token in the response body. |
| `NextPageTokenResponseHeader` | False | String | Field that specifies that if `NextPageTokenJsonPath` is empty, use the token in this header name for the next page. |
| `NextPageParaName` | False | String | Field that determines the next page name in the request. |
| `HasNextFlagJsonPath` | False | String | Field that defines the path to a `HasNextPage` flag attribute when determining if more pages are left in the response. |
| `NextPageRequestHeader` | False | String | Field that determines the next page header name in the request. |
| `PagingInfoPlacement` | False | String | Field that determines how paging info is populated. Accepts either `QueryString` or `RequestBody`. |
| `PagingQueryParamOnly` | False | Boolean | Field that determines query parameters. If set to true, it omits all other query parameters except paging query parameters. |

Examples:

```json
"paging": {
 "pagingType" : "NextPageToken", 
 "nextPageRequestHeader" : "ETag", 
 "nextPageTokenResponseHeader" : "ETag" 
}
```

```json
"paging": {
 "pagingType" : "PersistentToken", 
    "nextPageParaName" : "gta", 
    "nextPageTokenJsonPath" : "$.alerts[-1:]._id" 
}
```

#### Configure Offset

`Offset`-type pagination specifies the number of pages to skip and a limit on the number of events to retrieve per page in the request. Clients fetch a specific range of items from the data set.

| Field | Required | Type | Description |
|----|----|----|----|
| `PageSize` | False | Integer | Number of events per page. |
| `PageSizeParameterName` | False | String | Query parameter name for the page size. |
| `OffsetParaName` | False | String | The next request query parameter name. The CCF calculates the offset value for each request (all events ingested + 1). |
| `PagingInfoPlacement` | False | String | Field that determines how paging info is populated. Accepts either `QueryString` or `RequestBody`. |
| `PagingQueryParamOnly` | False | Boolean | Field that determines query parameters. If set to true, it omits all other query parameters except paging query parameters. |

Example:

```json
"paging": {
  "pagingType": "Offset", 
  "offsetParaName": "offset",
  "pageSize": 50,
  "pagingQueryParamOnly": true,
  "pagingInfoPlacement": "QueryString"
}
```

#### Configure CountBasedPaging

`CountBasedPaging`-type pagination allows the client to specify the number of items to return in the response. This ability is useful for APIs that support pagination based on a count parameter as part of the response payload.

| Field | Required | Type | Description |
|----|----|----|----|
| `pageNumberParaName` | True | String | Parameter name of the page number in the HTTP request. |
| `PageSize` | False | Integer | Number of events per page. |
| `ZeroBasedIndexing` | False | Boolean | Flag that indicates that the count is zero based. |
| `HasNextFlagJsonPath` | False | String | The JSON path of the flag in the HTTP response payload that indicates there are more pages. |
| `TotalResultsJsonPath` | False | String | The JSON path of the total number of results in the HTTP response payload. |
| `PageNumberJsonPath` | False | String | The JSON path of the page number in the HTTP response payload. Required if `totalResultsJsonPath` is provided.  |
| `PageCountJsonPath` | False | String | The JSON path of the page count in the HTTP response payload. Required if `totalResultsJsonPath` is provided. |
| `PagingInfoPlacement` | False | String | Field that determines how paging info is populated. Accepts either `QueryString` or `RequestBody`. |
| `PagingQueryParamOnly` | False | Boolean | Field that determines query parameters. If set to true, it omits all other query parameters except paging query parameters. |

Example:

```json
"paging": {
 "pagingType" : "CountBasedPaging", 
 "pageNumberParaName" : "page", 
 "pageSize" : 10, 
 "zeroBasedIndexing" : true, 
 "hasNextFlagJsonPath" : "$.hasNext", 
 "totalResultsJsonPath" : "$.totalResults", 
 "pageNumberJsonPath" : "$.pageNumber", 
 "pageCountJsonPath" : "$.pageCount"
}
```

## DCR configuration

| Field | Required | Type | Description |
|----|----|----|----|
| `DataCollectionEndpoint` | True | String | Data collection endpoint (DCE). For example: `https://example.ingest.monitor.azure.com`. |
| `DataCollectionRuleImmutableId` | True | String | The DCR immutable ID. Find it by viewing the DCR creation response or by using the [DCR API](/rest/api/monitor/data-collection-rules/get). |
| `StreamName` | True | String | This value is the `streamDeclaration` defined in the DCR. The prefix must begin with `Custom-`. |

## Example CCF data connector

Here's an example of all the components of the CCF data connector JSON:

```json
{
   "kind": "RestApiPoller",
   "properties": {
      "connectorDefinitionName": "ConnectorDefinitionExample",
      "dcrConfig": {
           "streamName": "Custom-ExampleConnectorInput",
           "dataCollectionEndpoint": "https://example-dce-sbsr.location.ingest.monitor.azure.com",
           "dataCollectionRuleImmutableId": "dcr-32_character_hexadecimal_id"
            },
      "dataType": "ExampleLogs",
      "auth": {
         "type": "Basic",
         "password": "[[parameters('username')]",
         "userName": "[[parameters('password')]"
      },
      "request": {
         "apiEndpoint": "https://rest.contoso.com/example",
         "rateLimitQPS": 10,
         "rateLimitConfig": {
            "evaluation": {
              "checkMode": "OnlyWhen429"
            },
            "extraction": {
              "source": "CustomHeaders",
              "headers": {
                "limit": {
                  "name": "X-RateLimit-Limit",
                  "format": "Integer"
                },
                "remaining": {
                  "name": "X-RateLimit-Remaining",
                  "format": "Integer"
                },
                "reset": {
                  "name": "X-RateLimit-RetryAfter",
                  "format": "UnixTimeSeconds"
                }
              }
            },
            "retryStrategy": {
              "useResetOrRetryAfterHeaders": true
            }
         },
         "queryWindowInMin": 5,
         "httpMethod": "POST",
         "queryTimeFormat": "UnixTimestamp",
         "startTimeAttributeName": "t0",
         "endTimeAttributeName": "t1",
         "retryCount": 3,
         "timeoutInSeconds": 60,
         "headers": {
            "Accept": "application/json",
            "User-Agent": "Example-app-agent"
         } 
      },
      "paging": {
         "pagingType": "LinkHeader",
         "pagingInfoPlacement": "RequestBody",
         "pagingQueryParamOnly": true
      },
      "response": {
         "eventsJsonPaths": ["$"]
      }
   }
}
```
