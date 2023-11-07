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

To create a data connector with the Codeless Connector Platform (CCP), use this document as a supplement to the [Microsoft Sentinel REST API for Data Connectors](/rest/api/securityinsights/data-connectors) reference docs. Specifically this reference document expands on the following details:

- An updated data connector kind, `RestApiPoller`  
- Authorization configuration
- Data source request and response configuration options
- Data stream paging options
- Data collection rule map 

Each `dataConnector` represents a specific *connection* of a Microsoft Sentinel data connector. One data connector might have multiple connections which fetch data from different endpoints. The JSON configuration built using this reference document is used to complete the deployment template for the CCP data connector. 

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md#create-the-solution-deployment-template).

## Data Connectors - Create or Update 

Reference the Create or Update operation in the REST API docs, [here](/rest/api/securityinsights/data-connectors/create-or-update) to find the latest stable or preview API version. The difference between the *create* and the *update* operation is the update requires an **etag** value.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{dataConnectorId}?api-version=2022-11-01
```

## URI parameters

For more information, see [Data Connectors - Create or Update URI Parameters](/rest/api/securityinsights/data-connectors/create-or-update#uri-parameters)

|Name  | Description  |
|---------|---------|
| dataConnectorId | The data connector ID must be a unique name and is the same name parameter in the [request body](#request-body).|
| resourceGroupName | The name of the resource group, not case sensitive.  |
| subscriptionId | The ID of the target subscription. |
| workspaceName | The *name* of the workspace, not the ID.<br>Regex pattern: `^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
| api-version | The API version to use for this operation. |

## Request body

The request body for the CCP data connector has the following structure:

```json
{
   "name": "{dataConnectorId}",
   "kind": "RestApiPoller",
   "etag": "",
   "properties": {
        "connectorDefinitionName": "",
        "dataType": "",
        "auth": {},
        "request": {},
        "response": {},
        "paging": "",
        "dcrConfig": ""
   }
}

```

CodelessRestApiPollerConnector

| Name | Required | Type | Description |
| ---- | ---- | ---- | ---- |
| name | True | string | The unique name of the connection which matches the URI parameter |
| kind | True | string | Must be "RestApiPoller" |
| etag |  | GUID | Leave empty for creation of new connectors. For update operations, the etag must match the existing connector's etag (GUID). |
| properties.connectorDefinitionName |  | string | The name of the DataConnectorDefinition resource that defines the UI configuration of the data connector. For more information, see [Data Connector Definition](create-codeless-connector.md#data-connector-definition). |
| dataType | ? | string | ?? |
| properties.auth	| True | Nested JSON | Describes the authentication properties for polling the data. For more information, see [authentication configuration](#authentication-configuration). |
| properties.request | True | Nested JSON | Describes the request payload for polling the data, such as the API endpoint. For more information, see [request configuration](#request-configuration). |
| properties.response | True | Nested JSON | Describes the response object and nested message returned from the API when polling the data. For more information, see [response configuration](#response-configuration). |
| properties.paging |  | Nested JSON | Describes the pagination payload when polling the data. For more information, see [paging configuration](#paging-configuration). |
| properties.dcrConfig |  | Nested JSON | Required parameters when the data is sent to a Data Collection Rule (DCR). For more information, see [DCR configuration](#dcr-configuration). |

## Authentication configuration

The following authentication types are supported by the CCP.
- [Basic](#basic-auth)
- [APIKey](#apikey)
- [OAuth2](#oauth2) 

CCP OAuth2 implementation does not support certificate credentials.

#### Basic auth

| Field | Required | Type |
| ---- | ---- | ---- |
| UserName | True | string |
| Password | True | string |

Example Basic auth:
```json
"auth": {
    "type": "Basic",
    "UserName": "usernameXYZ",
    "Password": "password123"
}
```

#### APIKey

| Field | Required | Type | Description | Default value |
| ---- | ---- | ---- | ---- | ---- |
| ApiKey | Mandatory | string | user secret key | |
| ApiKeyName | | string | name of the Uri header containing the ApiKey value | "Authorization" |
| ApiKeyIdentifier | | string | string value to prepend the token | "token" |
| IsApiKeyInPostPayload | | boolean | send secret in POST body instead of header | false |

APIKey auth examples:
```json
"auth": {
    "type": "APIKey",
    "ApiKey": "123123123",
    "ApiKeyName": "X-MyApp-Auth-Header",
    "ApiKeyIdentifier": "Bearer"
}
``` 
This example results in the secret sent in the following header: **X-Random-Auth-Header: Bearer 123123123**

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

The Codeless Connector Platform supports OAuth 2.0 authorization code grant and client credentials.
The Authorization Code grant type is used by confidential and public clients to exchange an authorization code for an access token.
After the user returns to the client via the redirect URL, the application will get the authorization code from the URL and use it to request an access token.

|Field | Required | Type | Description |
| ---- | ---- | ---- | ---- | 
| ClientId | True	| String | The client id |
| ClientSecret	| True | String | The client secret |
| AuthorizationCode | Mandatory when grantType = `authorization_code` |	String | if grant type is `authorization_code` this will be the authorization code returned from the auth server |
| Scope | True for `authorization_code` grant type<br> optional for `client_credentials` grant type| String | A space-separated list of scopes for user consent. For more information, see [OAuth2 scopes and permissions](/entra/identity-platform/scopes-oidc). |
| RedirectUri | True | String | URL for redirect, must be `https://portal.azure.com/TokenAuthorize` |
| GrantType | True | String | `authorization_code` or `client_credentials` |
| TokenEndpoint | True | String | URL to exchange code with valid token in `authorization_code` grant or client id and secret with valid token in `client_credentials` grant. |
| TokenEndpointHeaders |  | Object | An optional key value object to send custom headers to token server |
| TokenEndpointQueryParameters |  | Object | An optional key value object to send custom query params to token server |
| AuthorizationEndpoint	| True | String | URL for user consent for `authorization_code` flow |
| AuthorizationEndpointHeaders |	 | Object | An optional key value object to send custom headers to auth server |
| AuthorizationEndpointQueryParameters	|  | Object | An optional key value pair used in OAuth2 authorization code flow request |

Example:
OAuth2 auth code grant

```json
"auth": {
    "type": "OAuth2",
    "tokenEndpoint": "https://login.microsoftonline.com/<tenant_id>/oauth2/v2.0/token",
    "authorizationEndpoint": "https://login.microsoftonline.com/<tenant_id>/oauth2/v2.0/authorize",
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
    "tokenEndpoint": "https://login.microsoftonline.com/<tenant_id>/oauth2/v2.0/token",
    "tokenEndpointHeaders": {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "TokenEndpointQueryParameters": {},
    "scope": "openid offline_access some_scope",
    "grantType": "client_credentials"
}
```
The difference between code flow to client credentials is that code flow is for fetching data on behalf of user (user permissions) and client credentials is for fetching data with the application permissions, the data server grant access / permissions to the application, there is no user, that is why in client credentials flow we don’t need authorization endpoint, only a token endpoint for retrieving tokens.

## Request configuration

The request section includes the following parameters:
Field	Required	Type	Description	Default value
ApiEndpoint	True	String	URL for remote server. Defines the endpoint to pull data from	
RateLimitQPS	False	Integer	Defines the number of calls or queries allowed in a second	
QueryWindowInMin	False	Integer	Defines the available query window, in minutes.	Minimum is 1 minute. Default is 5 minutes. successStatusValue

HttpMethod	False	String	Defines the API method: GET or Post	GET
QueryTimeFormat	False	String	Defines the date time presentation that the endpoint (remote server) expects. Possible values are the constants: "UnixTimestamp", "UnixTimestampInMills" or any other valid representation of date time, for example: "yyyy-MM-dd", "MM/dd/yyyy HH:mm:ss", etc..	ISO 8601 UTC
RetryCount	False	Integer	Defines how many retries are allowed in case of a failure.	A number from 1 to 6. Default is 3.
TimeoutInSeconds	False	Integer	Defines the request timeout, in seconds.	A number from 1 to 180. Default is 20
IsPostPayloadJson	False	Boolean	Determines whether the POST payload is in JSON format.	Default value is false
Headers	False	Object	Key value pairs - defines the request headers 	
QueryParameters	False	Object	Key value pairs - defines the request query parameters 	
StartTimeAttributeName	Depends on the scenario 	String	Defines the query parameter name for query Start time.

For example: if 
StartTimeAttributeName = "from"
and EndTimeAttributeName = "until"
and ApiEndpoint = "https://www.example.com"
Then, the query sent to the remote server will look as follows: 
 https://www.example.com?from={QueryTimeFormat}&until={QueryTimeFormat + QueryWindowInMin}	
EndTimeAttributeName 		String	see StartTimeAttributeName	
QueryTimeIntervalAttributeName	Depends on the scenario, 	String	In case the endpoint supports a special format of querying the data on a time frame, then this property may be used together with the QueryTimeIntervalPrepend parameter  and the QueryTimeIntervalDelimiter parameter. 
For example:
Setting   
QueryTimeIntervalAttributeName = "interval"
and QueryTimeIntervalPrepend = "time:"
and
QueryTimeIntervalDelimiter = ".."
and
ApiEndpoint = "https://www.example.com"
Will results in the following query:
https://www.example.com?interval="time:{QueryTimeFormat}..{QueryTimeFormat + QueryWindowInMin}"	
QueryTimeIntervalPrepend		String	See QueryTimeIntervalAttributeName	
QueryTimeIntervalDelimiter		String	See QueryTimeIntervalAttributeName	
QueryParametersTemplate	False	String	Defines the query parameters template to use when passing query parameters in advanced scenarios. 

For example: "queryParametersTemplate": "{'cid': 1234567, 'cmd': 'reporting', 'format': 'siem', 'data': { 'from': '{_QueryWindowStartTime}', 'to': '{_QueryWindowEndTime}'}, '{_APIKeyName}': '{_APIKey}'}"

{_QueryWindowStartTime} and {_QueryWindowEndTime} are only supported in the queryParameters and queryParametersTemplate request parameters.

{_APIKeyName} and {_APIKey} are only supported in the queryParametersTemplate request parameter.	

Examples: 
Let’s take 2 examples for getting data from Microsoft Graph API:
The first one is for querying messages with filter query parameter with a query syntax as shown in the docs :

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
  "QueryTimeIntervalAttributeName": "filter",
  "QueryTimeIntervalPrepend": "TimeStamp gt ",
  "QueryTimeIntervalDelimiter": " and Timestamp lt "
}
```
The JSON above will fire a GET request to https://graph.microsoft.com/v1.0/me/messages?filter=TimeStamp gt 2019-09-01T09:00:00.0000000 and Timestamp lt 2019-09-01T17:00:00.0000000
Of course time stamp will change each queryWindowInMin time.
Same results can be achieved with this option:

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
    "filter": "TimeStamp gt {_QueryWindowStartTime} and Timestamp lt {_QueryWindowEndTime}"
  }
}
```

Another option is when the data server expects 2 query parameters one for start time and one for end time, example:

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
  "StartTimeAttributeName": "startDateTime",
  "EndTimeAttributeName": "endDateTime",
}
```

This will result with a GET request to `https://graph.microsoft.com/me/calendarView?startDateTime=2019-09-01T09:00:00.0000000&endDateTime=2019-09-01T17:00:00.0000000`

For complex queries (POST requests) we can use QueryParametersTemplate as a body, for example:

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
This example will send a POST request with parameters in the body.

## Response configuration

The response section includes the following parameters:
Field	Required	Type	Description	Default Value
EventsJsonPaths	True	List of Strings	Defines the path to the message in the response JSON. 
A JSON path expression specifies a path to an element, or a set of elements, in a JSON structure 	
SuccessStatusJsonPath	False	String	Defines the path to the success message in the response JSON.
When this parameter is defined then SuccessStatusValue parameter should also be defined 	
SuccessStatusValue	False	String	Defines the path to the success message value in the response JSON	
IsGzipCompressed	False	Boolean	Determines whether the response is compressed in a gzip file	False
format	True	String	"json" or "csv" or "xml"	
CompressionAlgo	False	String	Can be either "multi-gzip" or "deflate". For gzip you can use IsGzipCompressed	
CsvDelimiter	False	String	If response format is CSV and you want to change the default CSV delimiter ","	","
HasCsvBoundary	False	Boolean	indicate if CSV data has a boundary	False
HasCsvHeader	False	Boolean	indicate if CSV data has a header	True
CsvEscape	False	String	Escape char for bound a field, for example double quote, 
CSV with headers id,name,avg
1, "my name", 5.5	‘"’ (double quotes)
ConvertChildPropertiesToArray	False	Boolean	Special case in which the remote server returns an object instead of a list of events which each property has data in it.	False

Note: CSV format type is parsed by this specification (RFC4180).
Examples: 
For server that response with JSON format and the data is inside a property called "value", also an indication for success call is in the response in property "status" and should only ingest the data if the value is "success"

```json
"response": {
  "EventsJsonPaths ": ["$.value"],
  "format": "json",
  "SuccessStatusJsonPath": "$.status",
  "SuccessStatusValue": "success",
  "IsGzipCompressed: true
 }
```

Another example for response in CSV format with no header:

```json
"response": {
  "EventsJsonPaths ": ["$"],
  "format": "csv",
  "HasCsvHeader": false
 }
```

## Paging configuration

The paging section includes the following parameters based on the paging type:
PagingType:  LinkHeader / PersistentLinkHeader
This is the most common paging type – see specification here.
In LinkHeader pagination, the API response includes links in the HTTP header, typically named "Link," that provide URLs to the next and previous pages of data. Clients can extract the next page URL from the header and make a new request to retrieve the next page of data.
LinkHeader and PersistentLinkHeader have the same properties, The difference is that in PersistentLinkHeader link header will be persisted at backend storage – so it can be used across different query windows. For example, some API doesn’t support query start time/end time, but it might support server side *cursor*, persistent* page types can be used to remember the server side *cursor*. Also note a side effect of this page type – there can be only one query running for the connector with PersistentLinkHeader to avoid race conditions on service side *cursor* so it can affect latency.

These are the paging types:
- LinkHeader
- PersistentLinkHeader
- NextPageToken
- PersistentToken
- NextPageUrl
- Offset


## DCR configuration

Field	Required	Type	Description
DataCollectionEndpoint	true	String	DCE (Data Collection Endpoint) for example: https://example.ingest.monitor.azure.com.
Create DCE here

DataCollectionRuleImmutableId	true	String	On DCR creation, the response for the DCR will have its immutable id
StreamName	true	string	Stream defined in DCR stream declaration for custom streams (prefix with “Custom-"), If stream is a standard stream prefix with “Microsoft-", for more information see docs

## Unified example

Here's an example of all the components of the CCP data connector JSON together.

```json
{
              "id": "/subscriptions/{subscription id} /resourceGroups/{resource group name}/providers/Microsoft.OperationalInsights/workspaces/{workspace name /providers/Microsoft.SecurityInsights/dataConnectors/{data connector name} ",
              "name": "DataConnectorExample",
              "type": "Microsoft.OperationalInsights/workspaces/providers/dataConnectors",
              "kind": "RestApiPoller",
              "properties": {
                "connectorDefinitionName": "ConnectorDefinitionExample",
                "dcrConfig": {
                  "streamName": "Custom-MyTable_CL",
                  "dataCollectionEndpoint": "{DCE collection endpoint (https://...)}",
                  "dataCollectionRuleImmutableId": "{dcr-immutable id} " 
                },
                "dataType": "ExampleLogs",
                "auth": {
                  "type": "Basic",
                  "password": "xxxxx",
                  "userName": "user1"
                },
                "request": {
                  "apiEndpoint": "{endpoint url (https://...)} ",
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
                    "User-Agent": "Scuba"
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