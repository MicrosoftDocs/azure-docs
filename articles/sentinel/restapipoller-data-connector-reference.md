---
title: RestApiPoller data connector reference for the Codeless Connector Platform
description: This article provides reference JSON fields and properties for creating the RestApiPoller data connector type as part of the Codeless Connector Platform.
services: sentinel
author: austinmccollum
ms.topic: reference
ms.date: 10/19/2023
ms.author: austinmc

---

# RestApiPoller data connector reference for the Codeless Connector Platform

Still a work in progress

From DataConnector API doc.

- `pollingConfig`. Defines how Microsoft Sentinel collects data from your data source. For more information, see [Configure your connector's polling settings](#configure-your-connectors-polling-settings).

## Configure your connector's polling settings

This section describes the configuration for how data is polled from your data source for a codeless data connector.

The following code shows the syntax of the `pollingConfig` section of the [CCP configuration] file.

```json
"pollingConfig": {
    "auth": {
    },
    "request": {
    },
    "response": {
    },
    "paging": {
    }
 }
```

The `pollingConfig` section includes the following properties:

| Name         | Type        | Description  |
| ------------ | ----------- | ------------ |
| **auth**     | String      | Describes the authentication properties for polling the data. For more information, see [auth configuration](#auth-configuration). |
| <a name="authtype"></a>**auth.authType** | String | Mandatory. Defines the type of authentication, nested inside the `auth` object, as  one of the following values: `Basic`, `APIKey`, `OAuth2` |
| **request**  | Nested JSON | Mandatory. Describes the request payload for polling the data, such as the API endpoint.     For more information, see [request configuration](#request-configuration). |
| **response** | Nested JSON | Mandatory. Describes the response object and nested message returned from the API when polling the data. For more information, see [response configuration](#response-configuration). |
| **paging**   | Nested JSON | Optional. Describes the pagination payload when polling the data.  For more information, see [paging configuration](#paging-configuration). |

For more information, see [Sample pollingConfig code](#sample-pollingconfig-code).

### auth configuration

The `auth` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters, depending on the type defined in the [authType](#authtype) element:

#### Basic authType parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| **Username** | String | Mandatory. Defines user name. |
| **Password** | String | Mandatory. Defines user password. |

#### APIKey authType parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
|**APIKeyName**     |String | Optional. Defines the name of your API key, as one of the following values: <br><br>- `XAuthToken` <br>- `Authorization`        |
|**IsAPIKeyInPostPayload**     |Boolean | Determines where your API key is defined. <br><br>True: API key is defined in the POST request payload <br>False: API key is defined in the header     |
|**APIKeyIdentifier**     |  String | Optional. Defines the name of the identifier for the API key. <br><br>For example, where the authorization is defined as  `"Authorization": "token <secret>"`, this parameter is defined as: `{APIKeyIdentifier: “token”})`     |

#### OAuth2 authType parameters

The Codeless Connector Platform supports OAuth 2.0 authorization code grant.

The Authorization Code grant type is used by confidential and public clients to exchange an authorization code for an access token.

After the user returns to the client via the redirect URL, the application will get the authorization code from the URL and use it to request an access token.


| Name | Type | Description |
| ---- | ---- | ----------- |
| **FlowName** | String | Mandatory. Defines an OAuth2 flow.<br><br>Supported value: `AuthCode` - requires an authorization flow |
| **AccessToken** | String | Optional. Defines an OAuth2 access token, relevant when the access token doesn't expire. |
| **AccessTokenPrepend** | String | Optional. Defines an OAuth2 access token prepend. Default is `Bearer`. |
| **RefreshToken** | String | Mandatory for OAuth2 auth types. Defines the OAuth2 refresh token. |
| **TokenEndpoint** | String | Mandatory for OAuth2 auth types. Defines the OAuth2 token service endpoint. |
| **AuthorizationEndpoint** | String | Optional. Defines the OAuth2 authorization service endpoint. Used only during onboarding or when renewing a refresh token. |
| **RedirectionEndpoint** | String | Optional. Defines a redirection endpoint during onboarding. |
| **AccessTokenExpirationDateTimeInUtc** | String | Optional. Defines an access token expiration datetime, in UTC format. Relevant for when the access token doesn't expire, and therefore has a large datetime in UTC, or when the access token has a large expiration datetime. |
| **RefreshTokenExpirationDateTimeInUtc** | String | Mandatory for OAuth2 auth types. Defines the refresh token expiration datetime in UTC format. |
| **TokenEndpointHeaders** | Dictionary<string, object> | Optional. Defines the headers when calling an OAuth2 token service endpoint.<br><br>Define a string in the serialized `dictionary<string, string>` format: `{'<attr_name>': '<val>', '<attr_name>': '<val>'... }` |
| **AuthorizationEndpointHeaders** | Dictionary<string, object> | Optional. Defines the headers when calling an OAuth2 authorization service endpoint. Used only during onboarding or when renewing a refresh token.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ... }` |
| **AuthorizationEndpointQueryParameters** | Dictionary<string, object> | Optional. Defines query parameters when calling an OAuth2 authorization service endpoint. Used only during onboarding or when renewing a refresh token.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ... }` |
| **TokenEndpointQueryParameters** | Dictionary<string, object> | Optional. Define query parameters when calling OAuth2 token service endpoint.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ... }` |
| **IsTokenEndpointPostPayloadJson** | Boolean | Optional, default is false. Determines whether query parameters are in JSON format and set in the request POST payload. |
| **IsClientSecretInHeader** | Boolean | Optional, default is false. Determines whether the `client_id` and `client_secret` values are defined in the header, as is done in the Basic authentication schema, instead of in the POST payload. |
| **RefreshTokenLifetimeinSecAttributeName** | String | Optional. Defines the attribute name from the token endpoint response, specifying the lifetime of the refresh token, in seconds. |
| **IsJwtBearerFlow** | Boolean | Optional, default is false. Determines whether you are using JWT. |
| **JwtHeaderInJson** | Dictionary<string, object> | Optional. Define the JWT headers in JSON format.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>...}` |
| **JwtClaimsInJson** | Dictionary<string, object> | Optional. Defines JWT claims in JSON format.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ...}` |
| **JwtPem** | String | Optional. Defines a secret key, in PEM Pkcs1 format: `'-----BEGIN RSA PRIVATE KEY-----\r\n{privatekey}\r\n-----END RSA PRIVATE KEY-----\r\n'`<br><br>Make sure to keep the `'\r\n'` code in place. |
| **RequestTimeoutInSeconds** | Integer | Optional. Determines timeout in seconds when calling token service endpoint. Default is 180 seconds |

Here's an example of how an OAuth2 configuration might look:

```json
"pollingConfig": {
    "auth": {
        "authType": "OAuth2",
        "authorizationEndpoint": "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent",
        "redirectionEndpoint": "https://portal.azure.com/TokenAuthorize",
        "tokenEndpoint": "https://oauth2.googleapis.com/token",
        "authorizationEndpointQueryParameters": {},
        "tokenEndpointHeaders": {
            "Accept": "application/json"
        },
        "TokenEndpointQueryParameters": {},
        "isClientSecretInHeader": false,
        "scope": "https://www.googleapis.com/auth/admin.reports.audit.readonly",
        "grantType": "authorization_code",
        "contentType": "application/x-www-form-urlencoded",
        "FlowName": "AuthCode"
    },
```

#### Session authType parameters

| Name                        | Type                       | Description  |
| --------------------------- | -------------------------- | ------------ |
| **QueryParameters**         | Dictionary<string, object> | Optional. A list of query parameters, in the serialized `dictionary<string, string>` format: <br><br>`{'<attr_name>': '<val>', '<attr_name>': '<val>'... }` |
| **IsPostPayloadJson**       | Boolean                    | Optional. Determines whether the query parameters are in JSON format.  |
| **Headers**                 | Dictionary<string, object> | Optional. Defines the header used when calling the endpoint to get the session ID, and when calling the endpoint API.  <br><br> Define the string in the serialized `dictionary<string, string>` format: `{'<attr_name>': '<val>', '<attr_name>': '<val>'... }`        |
| **SessionTimeoutInMinutes** | String                     | Optional. Defines a session timeout, in minutes.       |
| **SessionIdName**           | String                     | Optional. Defines an ID name for the session.  |
| **SessionLoginRequestUri**  | String                     | Optional. Defines a session login request URI. |

### Request configuration

The `request` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters:

| Name                               | Type    | Description                                        |
| ---------------------------------- | ------- | -------------------------------------------------- |
| **apiEndpoint**                    | String  | Mandatory. Defines the endpoint to pull data from. |
| **httpMethod**                     | String  | Mandatory. Defines the API method: `GET` or `POST` |
| **queryTimeFormat**                | String, or *UnixTimestamp* or *UnixTimestampInMills* | Mandatory.  Defines the format used to define the query time.    <br><br>This value can be a string, or in *UnixTimestamp* or *UnixTimestampInMills* format to indicate the query start and end time in the UnixTimestamp. |
| **startTimeAttributeName**         | String  | Optional. Defines the name of the attribute that defines the query start time. |
| **endTimeAttributeName**           | String  | Optional. Defines the name of the attribute that defines the query end time. |
| **queryTimeIntervalAttributeName** | String  | Optional. Defines the name of the attribute that defines the query time interval. |
| **queryTimeIntervalDelimiter**     | String  | Optional. Defines the query time interval delimiter. |
| **queryWindowInMin**               | Integer | Optional. Defines the available query window, in minutes. <br><br>Minimum value: `5` |
| **queryParameters**                | Dictionary<string, object> | Optional. Defines the parameters passed in the query in the [`eventsJsonPaths`](#eventsjsonpaths) path. <br><br>Define the string in the serialized `dictionary<string, string>` format: `{'<attr_name>': '<val>', '<attr_name>': '<val>'... }`. |
| **queryParametersTemplate**        | String  | Optional. Defines the query parameters template to use when passing query parameters in advanced scenarios. <br><br>For example: `"queryParametersTemplate": "{'cid': 1234567, 'cmd': 'reporting', 'format': 'siem', 'data': { 'from': '{_QueryWindowStartTime}', 'to': '{_QueryWindowEndTime}'}, '{_APIKeyName}': '{_APIKey}'}"` <br><br>`{_QueryWindowStartTime}` and `{_QueryWindowEndTime}` are only supported in the `queryParameters` and `queryParametersTemplate` request parameters.  <br><br>`{_APIKeyName}` and `{_APIKey}` are only supported in the `queryParametersTemplate` request parameter. |
| **isPostPayloadJson**              | Boolean | Optional. Determines whether the POST payload is in JSON format. |
| **rateLimitQPS**                   | Double  | Optional. Defines the number of calls or queries allowed in a second. |
| **timeoutInSeconds**               | Integer | Optional. Defines the request timeout, in seconds. |
| **retryCount**                     | Integer | Optional. Defines the number of request retries to try if needed. |
| **headers**                        |  Dictionary<string, object> | Optional. Defines the request header value, in the serialized `dictionary<string, object>` format: `{'<attr_name>': '<serialized val>', '<attr_name>': '<serialized val>'... }` |

### Response configuration

The `response` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters:

|Name  |Type  |Description  |
|---------|---------|---------|
|  <a name="eventsjsonpaths"></a> **eventsJsonPaths**  |   List of strings | Mandatory.  Defines the path to the message in the response JSON. <br><br>A JSON path expression specifies a path to an element, or a set of elements, in a JSON structure |
| **successStatusJsonPath**    |  String | Optional. Defines the path to the success message in the response JSON. |
|  **successStatusValue**   | String | Optional. Defines the path to the success message value in the response JSON    |
|  **isGzipCompressed**   |   Boolean | Optional. Determines whether the response is compressed in a gzip file.      |


The following code shows an example of the [eventsJsonPaths](#eventsjsonpaths) value for a top-level message:

```json
"eventsJsonPaths": [
              "$"
            ]
```


### Paging configuration

The `paging` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters:

|Name  |Type  |Description  |
|---------|---------|---------|
|  **pagingType**   | String | Mandatory. Determines the paging type to use in results, as one of the following values: `None`, `LinkHeader`, `NextPageToken`, `NextPageUrl`, `Offset`     |
| **linkHeaderTokenJsonPath**    |  String | Optional. Defines the JSON path to link header in the response JSON, if the `LinkHeader` isn't defined in the response header. |
| **nextPageTokenJsonPath**    |  String | Optional. Defines the path to a next page token JSON. |
| **hasNextFlagJsonPath**    |String | Optional. Defines the path to the `HasNextPage` flag attribute. |
|  **nextPageTokenResponseHeader**   | String | Optional. Defines the *next page* token header name in the response. |
| **nextPageParaName**    |  String | Optional.  Determines the *next page* name in the request. |
| **nextPageRequestHeader**    |   String | Optional. Determines the *next page* header name in the request.   |
| **nextPageUrl**    |   String | Optional. Determines the *next page* URL, if it's different from the initial request URL. |
| **nextPageUrlQueryParameters**    |  String | Optional.  Determines the *next page* URL's query parameters if it's different from the initial request's URL. <br><br>Define the string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <val>, '<attr_name>': <val>... }`        |
|  **offsetParaName**   |    String | Optional. Defines the name of the offset parameter. |
|  **pageSizeParaName**   |   String | Optional. Defines the name of the page size parameter. |
| **PageSize**    |     Integer | Defines the paging size. |



### Sample pollingConfig code

The following code shows an example of the `pollingConfig` section of the [CCP configuration] file:

```json
"pollingConfig": {
    "auth": {
        "authType": "APIKey",
        "APIKeyIdentifier": "token",
        "APIKeyName": "Authorization"
     },
     "request": {
        "apiEndpoint": "https://api.github.com/../{{placeHolder1}}/audit-log",
        "rateLimitQPS": 50,
        "queryWindowInMin": 15,
        "httpMethod": "Get",
        "queryTimeFormat": "yyyy-MM-ddTHH:mm:ssZ",
        "retryCount": 2,
        "timeoutInSeconds": 60,
        "headers": {
           "Accept": "application/json",
           "User-Agent": "Scuba"
        },
        "queryParameters": {
           "phrase": "created:{_QueryWindowStartTime}..{_QueryWindowEndTime}"
        }
     },
     "paging": {
        "pagingType": "LinkHeader",
        "pageSizeParaName": "per_page"
     },
     "response": {
        "eventsJsonPaths": [
          "$"
        ]
     }
}
```