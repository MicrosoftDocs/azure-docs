---
title: Data connectors reference for the Codeless Connector Platform
description: This article provides reference JSON fields and properties for creating the RestApiPoller data connector type and its data connection rules as part of the Codeless Connector Platform.
services: sentinel
author: austinmccollum
ms.topic: reference
ms.date: 11/13/2023
ms.author: austinmc

---

# Data connector reference for the Codeless Connector Platform

To create a data connector with the Codeless Connector Platform (CCP), use this document as a supplement to the [Microsoft Sentinel REST API for Data Connectors](/rest/api/securityinsights/data-connectors) reference docs. Specifically this reference document expands on the following details:

- The data connector kind, `RestApiPoller`, which is used for the CCP.
- Authorization configuration
- Data source request and response configuration options
- Data stream paging options
- Data collection rule map 

Each `dataConnector` represents a specific *connection* of a Microsoft Sentinel data connector. One data connector might have multiple connections, which fetch data from different endpoints. The JSON configuration built using this reference document is used to complete the deployment template for the CCP data connector. 

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md#create-the-solution-deployment-template).

## Data Connectors - Create or update 

Reference the [Create or Update](/rest/api/securityinsights/data-connectors/create-or-update) operation in the REST API docs to find the latest stable or preview API version. The difference between the *create* and the *update* operation is the update requires the **etag** value.

**PUT** method
```http
https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.OperationalInsights/workspaces/{{workspaceName}}/providers/Microsoft.SecurityInsights/dataConnectors/{{dataConnectorId}}?api-version=
```

## URI parameters

For more information, see [Data Connectors - Create or Update URI Parameters](/rest/api/securityinsights/data-connectors/create-or-update#uri-parameters)

|Name  | Description  |
|---------|---------|
| **dataConnectorId** | The data connector ID must be a unique name and is the same as the `name` parameter in the [request body](#request-body).|
| **resourceGroupName** | The name of the resource group, not case sensitive.  |
| **subscriptionId** | The ID of the target subscription. |
| **workspaceName** | The *name* of the workspace, not the ID.<br>Regex pattern: `^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
| **api-version** | The API version to use for this operation. |

## Request body

The request body for the CCP data connector has the following structure:

```json
{
   "name": "{{dataConnectorId}}",
   "kind": "RestApiPoller",
   "etag": "",
   "DataType": ""
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

**RestApiPoller** represents the codeless API Poller connector.

| Name | Required | Type | Description |
| ---- | ---- | ---- | ---- |
| **name** | True | string | The unique name of the connection matching the URI parameter |
| **kind** | True | string | Must be `RestApiPoller` |
| **etag** |  | GUID | Leave empty for creation of new connectors. For update operations, the etag must match the existing connector's etag (GUID). |
| properties.connectorDefinitionName |  | string | The name of the DataConnectorDefinition resource that defines the UI configuration of the data connector. For more information, see [Data Connector Definition](create-codeless-connector.md#data-connector-user-interface). |
| properties.**auth**	| True | Nested JSON | Describes the authentication properties for polling the data. For more information, see [authentication configuration](#authentication-configuration). |
| properties.**request** | True | Nested JSON | Describes the request payload for polling the data, such as the API endpoint. For more information, see [request configuration](#request-configuration). |
| properties.**response** | True | Nested JSON | Describes the response object and nested message returned from the API when polling the data. For more information, see [response configuration](#response-configuration). |
| properties.**paging** |  | Nested JSON | Describes the pagination payload when polling the data. For more information, see [paging configuration](#paging-configuration). |
| properties.**dcrConfig** |  | Nested JSON | Required parameters when the data is sent to a Data Collection Rule (DCR). For more information, see [DCR configuration](#dcr-configuration). |

## Authentication configuration

The CCP supports the following authentication types:
- [Basic](#basic-auth)
- [APIKey](#apikey)
- [OAuth2](#oauth2)

> [!NOTE]
> CCP OAuth2 implementation does not support certificate credentials.

 As a best practice, use parameters in the auth section instead of hard-coding credentials. To enable the credentials to be entered from the UI, the `connectorUIConfig` section requires `instructions` with the desired parameters. For more information, see [Data connector definitions reference for the Codeless Connector Platform](connectorUIConfig-supplemental-reference.md#instructions).

#### Basic auth

| Field | Required | Type |
| ---- | ---- | ---- |
| UserName | True | string |
| Password | True | string |

Example Basic auth using parameters defined in `connectorUIconfig`:
```json
"auth": {
    "type": "Basic",
    "UserName": "[parameters('username')]",
    "Password": "[parameters('password')]"
}
```

#### APIKey

| Field | Required | Type | Description | Default value |
| ---- | ---- | ---- | ---- | ---- |
| **ApiKey** | Mandatory | string | user secret key | |
| **ApiKeyName** | | string | name of the Uri header containing the ApiKey value | `Authorization` |
| **ApiKeyIdentifier** | | string | string value to prepend the token | `token` |
| **IsApiKeyInPostPayload** | | boolean | send secret in POST body instead of header | `false` |

APIKey auth examples:
```json
"auth": {
    "type": "APIKey",
    "ApiKey": "[parameters('apikey')]",
    "ApiKeyName": "X-MyApp-Auth-Header",
    "ApiKeyIdentifier": "Bearer"
}
``` 
This example results in the secret defined from user input sent in the following header: **X-MyApp-Auth-Header: Bearer <apikey>**

```json
"auth": { 
    "type": "APIKey",
    "ApiKey": "123123123",
}
```
This example uses the default values and results in the following header: **Authorization: token 123123123**

```json
"auth": { 
    "type": "APIKey",
    "ApiKey": "123123123",
    "ApiKeyName": ""
}
```
Since the `ApiKeyName` is explicitly set to `""`, the result is the following header: **Authorization: 123123123**

#### OAuth2

The Codeless Connector Platform supports OAuth 2.0 authorization code grant and client credentials. The Authorization Code grant type is used by confidential and public clients to exchange an authorization code for an access token.
After the user returns to the client via the redirect URL, the application will get the authorization code from the URL and use it to request an access token.

|Field | Required | Type | Description |
| ---- | ---- | ---- | ---- | 
| **ClientId** | True	| String | The client id |
| **ClientSecret**	| True | String | The client secret |
| **AuthorizationCode** | Mandatory when grantType = `authorization_code` |	String | If grant type is `authorization_code` this field value will be the authorization code returned from the auth serve. |
| **Scope** | True for `authorization_code` grant type<br> optional for `client_credentials` grant type| String | A space-separated list of scopes for user consent. For more information, see [OAuth2 scopes and permissions](/entra/identity-platform/scopes-oidc). |
| **RedirectUri** | True | String | URL for redirect, must be `https://portal.azure.com/TokenAuthorize` |
| **GrantType** | True | String | `authorization_code` or `client_credentials` |
| **TokenEndpoint** | True | String | URL to exchange code with valid token in `authorization_code` grant or client id and secret with valid token in `client_credentials` grant. |
| **TokenEndpointHeaders** |  | Object | An optional key value object to send custom headers to token server |
| **TokenEndpointQueryParameters** |  | Object | An optional key value object to send custom query params to token server |
| **AuthorizationEndpoint**	| True | String | URL for user consent for `authorization_code` flow |
| **AuthorizationEndpointHeaders** |	 | Object | An optional key value object to send custom headers to auth server |
| **AuthorizationEndpointQueryParameters**	|  | Object | An optional key value pair used in OAuth2 authorization code flow request |

Auth code flow is for fetching data on behalf of a user's permissions and client credentials is for fetching data with application permissions. The data server grants access to the application. Since there is no user in client credentials flow, no authorization endpoint is needed, only a token endpoint.

Example:
OAuth2 auth code grant

```json
"auth": {
    "type": "OAuth2",
    "ClientId": "[parameters('appId')]",
    "ClientSecret": "[parameters('appSecret')]",
    "tokenEndpoint": "https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token",
    "authorizationEndpoint": "https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/authorize",
    "authorizationEndpointHeaders": {},
    "authorizationEndpointQueryParameters": {
        "prompt": "consent"
    },
    "redirectionUri": "https://portal.azure.com/TokenAuthorize",
    "tokenEndpointHeaders": {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "TokenEndpointQueryParameters": {},
    "scope": "openid offline_access some_scope",
    "grantType": "authorization_code"
}
```
Example:
```json
"auth": {
    "type": "OAuth2",
    "ClientId": "[parameters('appId')]",
    "ClientSecret": "[parameters('appSecret')]",
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

## Request configuration

The request section defines how the CCP data connector sends requests to your data source. This section includes some available built-in variables.
- `_QueryWindowStartTime`
- `_QueryWindowEndTime`

{_QueryWindowStartTime} and {_QueryWindowEndTime} are only supported in the queryParameters and queryParametersTemplate request parameters.
{_APIKeyName} and {_APIKey} are only supported in the queryParametersTemplate request parameter.

|Field |Required |Type |Description	|
| ---- | ---- | ---- | ---- |
| **apiEndpoint** | True | String | URL for remote server. Defines the endpoint to pull data from. |
| **rateLimitQPS** |  | Integer | Defines the number of calls or queries allowed in a second. |
| **queryWindowInMin** |  | Integer | Defines the available query window in minutes. Minimum is 1 minute. Default is 5 minutes.|
| **httpMethod** |  | String | Defines the API method: `GET`(default) or `POST` |
| **queryTimeFormat** |  | String | Defines the date time presentation that the endpoint (remote server) expects. Possible values are the constants: `UnixTimestamp`, `UnixTimestampInMills` or any other valid representation of date time, for example: `yyyy-MM-dd`, `MM/dd/yyyy HH:mm:ss`<br>default is ISO 8601 UTC |
| **RetryCount** |  | Integer (1...6) | Defines `1` to `6` retries allowed to recover from a failure. Default is `3`.|
| **TimeoutInSeconds** |  | Integer (1...180) | Defines the request timeout, in seconds. Default is `20` |
| **IsPostPayloadJson** |  | Boolean | Determines whether the POST payload is in JSON format.	Default is `false`|
| **Headers** |  | Object | Key value pairs that define the request headers. |
| **QueryParameters** |  | Object | Key value pairs that define the request query parameters. |
| **StartTimeAttributeName** | True when `EndTimeAttributeName` is set | String | Defines the query parameter name for query start time. See [example](#starttimeattributename-example). |
| **EndTimeAttributeName** | True when `StartTimeAttributeName` is set | String | Defines the query parameter name for query end time. |
| **QueryTimeIntervalAttributeName** |  | String | If the endpoint requires a specialized format for querying the data on a time frame, then use this property with the `QueryTimeIntervalPrepend` and the `QueryTimeIntervalDelimiter` parameters. See [example](#querytimeintervalattributename-example). | 
| **QueryTimeIntervalPrepend** | True when `QueryTimeIntervalAttributeName` is set | String | See `QueryTimeIntervalAttributeName` |
| **QueryTimeIntervalDelimiter** |  True when `QueryTimeIntervalAttributeName` is set | String | See `QueryTimeIntervalAttributeName` |
| **QueryParametersTemplate** |  | String | Query template to use when passing parameters in advanced scenarios.<br>br>For example: `"queryParametersTemplate": "{'cid': 1234567, 'cmd': 'reporting', 'format': 'siem', 'data': { 'from': '{_QueryWindowStartTime}', 'to': '{_QueryWindowEndTime}'}, '{_APIKeyName}': '{_APIKey}'}"` | 

### StartTimeAttributeName example

Consider this example:
- `StartTimeAttributeName` = `from` 
- `EndTimeAttributeName` = `until`
- `ApiEndpoint` = `https://www.example.com`

The query sent to the remote server is: `https://www.example.com?from={QueryTimeFormat}&until={QueryTimeFormat + QueryWindowInMin}`

### QueryTimeIntervalAttributeName example

Consider this example:
- `QueryTimeIntervalAttributeName` = `interval`
- `QueryTimeIntervalPrepend` = `time:`
- `QueryTimeIntervalDelimiter` = `..`
- `ApiEndpoint` = `https://www.example.com`

The query sent to the remote server is: `https://www.example.com?interval=time:{QueryTimeFormat}..{QueryTimeFormat + QueryWindowInMin}`	

### Request examples using Microsoft Graph as data source API

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
The previous example sends a `GET` request to `https://graph.microsoft.com/v1.0/me/messages?filter=receivedDateTime gt 2019-09-01T09:00:00.0000000 and receivedDateTime lt 2019-09-01T17:00:00.0000000`. The time stamp updates for each `queryWindowInMin` time.

The same results are achieved with this example:

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

Another option is when the data source expects 2 query parameters, one for start time and one for end time. 

Example:

```json
"request": {
  "apiEndpoint": "https://graph.microsoft.com/v1.0/me/calendar",
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

This sends a `GET` request to `https://graph.microsoft.com/me/calendarView?startDateTime=2019-09-01T09:00:00.0000000&endDateTime=2019-09-01T17:00:00.0000000`

For complex queries, use `QueryParametersTemplate`. This next example sends a `POST` request with parameters in the body.

Example:

```json
request: {
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

Define the response handling of your data connector with the following parameters:

| Field | Required | Type | Description |
|----|----|----|----|
| **EventsJsonPaths** | True | List of Strings | Defines the path to the message in the response JSON. A JSON path expression specifies a path to an element, or a set of elements, in a JSON structure |
| **SuccessStatusJsonPath** |  | String | Defines the path to the success message in the response JSON. When this parameter is defined, the `SuccessStatusValue` parameter should also be defined. |
| **SuccessStatusValue** |  | String | Defines the path to the success message value in the response JSON |
| **IsGzipCompressed** |  | Boolean | Determines whether the response is compressed in a gzip file	|
| **format** | True | String | `json` or `csv` or `xml` |
| **CompressionAlgo** |  | String | The compressions algorithm, either `multi-gzip` or `deflate`. For gzip compression algorithm, just configure `IsGzipCompressed` to `True` instead of setting a value for this parameter. |
| **CsvDelimiter** |  | String | If response format is CSV and you want to change the default CSV delimiter of `","` |
| **HasCsvBoundary** |  | Boolean | Indicate if CSV data has a boundary |
| **HasCsvHeader** |  | Boolean | Indicate if CSV data has a header, default is `True` |
| **CsvEscape** |  | String | Escape character for a field boundary, default is `"`<br><br>For example, a CSV with headers `id,name,avg` and a row of data containing spaces like `1,"my name",5.5` requires the `"` field boundary. |
| **ConvertChildPropertiesToArray** |  | Boolean | Special case in which the remote server returns an object instead of a list of events where each property has data in it. |

> [!NOTE]
> CSV format type is parsed by the [RFC4180](https://www.rfc-editor.org/rfc/rfc4180) specification.

### Response configuration examples

A server response with JSON format is expected, with the requested data in the property *value*. The response property *status* indicates to ingest the data only if the value is `success`.

```json
"response": {
  "EventsJsonPaths ": ["$.value"],
  "format": "json",
  "SuccessStatusJsonPath": "$.status",
  "SuccessStatusValue": "success",
  "IsGzipCompressed: true
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

When the data source can't send the entire response payload all at once, the CCP data connector needs to know how to receive portions of the data in response *pages*. The paging types to choose from are:

| Paging type | decision factor |
|----|----|
| <ul><li>[LinkHeader](#configure-linkheader-or-persistentlinkheader)</li><li>[PersistentLinkHeader](#configure-linkheader-or-persistentlinkheader)</li><li>[NextPageUrl](#configure-nextpageurl)</li></ul> | Does the API response have links to next and previous pages? |
| <ul><li>[NextPageToken](#configure-nextpagetoken-or-persistenttoken)</li><li>[PersistentToken](#configure-nextpagetoken-or-persistenttoken)</li> | Does the API response have a token or cursor for the next and previous pages? |
| <ul><li>[Offset](#configure-offset)</li></ul> | Does the API response support a parameter for the number of objects to skip when paging? | 

#### Configure LinkHeader or PersistentLinkHeader

The most common paging type is when a server data source API provides URLs to the next and previous pages of data. For more information on the *Link Header* specification, see [RFC 5988](https://www.rfc-editor.org/rfc/rfc5988#section-5).

`LinkHeader` paging means the API response includes either:
- the `Link` HTTP response header
- or a JSON path to retrieve the link from the response body. 

`PersistentLinkHeader` paging has the same properties as `LinkHeader`, except the link header persists in backend storage. This option enables paging links across query windows. For example, some APIs don't support query start times or end times. Instead, they support a server side *cursor*. Persistent page types can be used to remember the server side *cursor*. For more information, see [What is a cursor?](/office/client-developer/access/desktop-database-reference/what-is-a-cursor).

> [!NOTE]
> There can be only one query running for the connector with PersistentLinkHeader to avoid race conditions on the server side *cursor*. This may affect latency.

| Field | Required | Type | Description |
|----|----|----|----|
| **LinkHeaderTokenJsonPath** | False | String | Use this property to indicate where to get the value in the response body.<br><br>For example, if the data source returns the following JSON: `{ nextPage: "foo", value: [{data}]}` then `LinkHeaderTokenJsonPath` will be `$.nextPage` |
| **PageSize** | False | Integer | How many events per page |
| **PageSizeParameterName** | False | String | Query parameter name for the page size |

Here are some examples:

```json
Paging: {
  "pagingType": "LinkHeader",
  "linkHeaderTokenJsonPath" : "$.metadata.links.next"
}
```

```json
Paging: {
 "pagingType" = "PersistentLinkHeader", 
 "pageSizeParameterName" : "limit", 
 "pageSize" : 500 
}
```

#### Configure NextPageUrl

`NextPageUrl` paging means the API response includes a complex link in the response body similar to `LinkHeader`, but the 

| Field | Required | Type | Description |
|----|----|----|----|
| **PageSize** | False | Integer | How many events per page |
| **PageSizeParameterName** | False | String | Query parameter name for the page size |
| **NextPageUrl** | False | String | Only if the connector is for Coralogix API |
| **NextPageUrlQueryParameters** | False | Object Key value pairs – adding custom query parameter to each request for the next page |
| **NextPageParaName** | False | String | Determines the next page name in the request. |
| **HasNextFlagJsonPath** | False | String | Defines the path to the HasNextPage flag attribute |
| **NextPageRequestHeader** | False | String | Determines the next page header name in the request. |
| **NextPageUrlQueryParametersTemplate** | False | String | Only if the connector is for Coralogix API |

Example:

```json
Paging: {
 "pagingType" : "NextPageUrl", 
  "nextPageTokenJsonPath" : "$.data.repository.pageInfo.endCursor", 
  "hasNextFlagJsonPath" : "$.data.repository.pageInfo.hasNextPage", 
  "nextPageUrl" : "https://api.github.com/graphql", 
  "nextPageUrlQueryParametersTemplate" : "{'query':'query{repository(owner:\"xyz\")}" 
}
```

#### Configure NextPageToken or PersistentToken

`NextPageToken` pagination uses a token (a hash or a cursor) that represents the state of the current page. The token is included in the API response, and the client appends it to the next request to fetch the next page. This method is often used when the server needs to maintain the exact state between requests.

`PersistentToken` pagination uses a token that persists server side. The server remembers the last token retrieved by the client and provides the next token in subsequent requests. The client continues where it left off even if it makes new requests later.

| Field | Required | Type | Description |
|----|----|----|----|
| **PageSize** | False | Integer | How many events per page |
| **PageSizeParameterName** | False | string | Query parameter name for the page size |
| **NextPageTokenJsonPath** | False | string | JSON path for next page token in the response body. |
| **NextPageTokenResponseHeader** | False | string | If `NextPageTokenJsonPath` is empty, use the token is in this header name for the next page. |
| **NextPageParaName** | False | string | Determines the next page name in the request. |
| **HasNextFlagJsonPath** | False | string | Defines the path to a **HasNextPage** flag attribute when determining if more pages are left in the response.	|
| **NextPageRequestHeader** | False | string | Determines the next page header name in the request. |

Examples:

```json
Paging: {
 "pagingType" : "NextPageToken", 
 "nextPageRequestHeader" : "ETag", 
 "nextPageTokenResponseHeader" : "ETag" 
}
```

```json
Paging: {
 "pagingType" : "PersistentToken", 
    "nextPageParaName" : "gta", 
    "nextPageTokenJsonPath" : "$.alerts[-1:]._id" 
}
```

#### Configure Offset

`Offset` pagination specifies the number of pages to skip and a limit on the number of events to retrieve per page in the request. Clients fetch a specific range of items from the data set.

| Field | Required | Type | Description |
|----|----|----|----|
| **PageSize** | False | Integer | How many events per page |
| **PageSizeParameterName** | False | String | Query parameter name for the page size |
| **OffsetParaName** | False | String | The next request query parameter name. The CCP calculates the offset value for each request, (all events ingested + 1) |

Example:
```json
Paging: {
   
       "pagingType": "Offset", 
        "offsetParaName": "offset" 
 }
```

## DCR configuration

| Field | Required | Type | Description |
|----|----|----|----|
| **DataCollectionEndpoint** | True | String | DCE (Data Collection Endpoint) for example: `https://example.ingest.monitor.azure.com`. |
| **DataCollectionRuleImmutableId** | True | String | The DCR immutable ID. Find it by viewing the DCR creation response or using the [DCR API](/rest/api/monitor/data-collection-rules/get) |
| **StreamName** | True | string | This value is the `streamDeclaration` defined in the DCR (prefix must begin with *Custom-*) |

## Example CCP data connector

Here's an example of all the components of the CCP data connector JSON together.

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
         "password": "[parameters('username')]",
         "userName": "[parameters('password')]"
      },
      "request": {
         "apiEndpoint": "https://rest.contoso.com/example",
         "rateLimitQPS": 10,
         "queryWindowInMin": 5,
         "httpMethod": "GET",
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
         "pagingType": "LinkHeader"
      },
      "response": {
         "eventsJsonPaths": ["$"]
      }
   }
}
```