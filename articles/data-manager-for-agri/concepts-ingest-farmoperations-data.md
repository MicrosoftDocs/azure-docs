---
title: Ingesting Farm Operations Data
description: Provides step by step guidance to ingest Farm Operations data
author: gourdsay #Required; your GitHub user alias, with correct capitalization.
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Working with Farm Operations Data 
Farm operation data is one of the most important ground truth datasets in Agronomy. Users can choose to push this data into Azure Data Manager for Agriculture using APIs OR choose to fetch them from farm equipment manufacturers like John Deere. 

> [!NOTE]
> Microsoft Azure Data Manager for Agriculture is currently in preview. For legal terms that apply to features that are in beta, in preview, or otherwise not yet released into general availability, see the [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> Microsoft Azure Data Manager for Agriculture requires registration and is available to only approved customers and partners during the preview period. To request access to Microsoft Data Manager for Agriculture during the preview period, use this [**form**](https://aka.ms/agridatamanager).

## Our Service supports the following types of farm Operations data:
* Planting Data
* Application Data 
* Harvest Data
* Tillage Data 

### Supported farm management data

As part of the data ingestion job created to ingest data from John Deere, our service ingests farm management data associated with the end user from John Deere.

Below are the ingested farm management data:
* Farm
* Field
* Boundary

Azure Data Manager for Agriculture stores the above mentioned farm management data in a **STAGED** state. The data stored in STAGED state must be queried explicitly as shown since this data is not visible by default.

### How to query the staged farm management data

Use the existing REST APIs present for farm, field & boundary and provide a property filter to specifically query staged resources as shown

```json
{
"propertyFilters":{
"SYSTEM-STATE": "STAGED"
  }
}
```

Azure Data Manager for Agriculture uses the above property filter and returns all staged (farm, field, boundary) data that is present for a given "partyid". You can also query for the source of the farm management data that was staged by using the property filter:

```json
{
"propertyFilters":{
"SYSTEM-STATE": "STAGED",
"SYSTEM-SOURCE": "JOHNDEERE"
  }
}
```

## Integration with John Deere
Azure Data Manager for Agriculture provides first class integration with farm equipment manufacturers like John Deere. Users can fetch farm operations data from John Deere to Azure Data Manager for Agriculture directly. 

## Configure oAuth based authorization

Azure Data Manager for Agriculture provides oAuth based authorization to connect your end-users with their farm operations data provider (for example: John Deere & Climate FieldView). **Configuring oAuth flow is a pre-requisite for integrating with John Deere** to fetch farm operations data. To successfully integrate with oAuth callback service built by Azure Data Manager for Agriculture use the following the steps:

> [!NOTE]
> Step 1 to Step 3 are part of the one-time initial configuration setup. Once integrated, you will be able to enable all your end users to use the existing oAuth workflow and call the config API (Step 4) per user (partyid) to get access token.

## Step 1: App Creation

If you are creating John Deere application, go to [John Deere portal](https://developer-portal.deere.com/#/applications/) and create a new application. Once the application is created, **request Data Subscription Services (DSS) for the app via Contact Us button in John Deere portal**. DSS enables an application to receive notifications for data updates and DSS needs to be explicitly enabled on John Deere side.

## Step 2: Provider Configuration

Use the `oAuthProvider` API to configure the oAuth provider (Ex: JOHNDEERE) with appropriate credentials (AppID & AppSecret) of the newly created App. The API creates or updates an oauthProvider resource.

### Request

#### Operation

|Method |Request URI | Description|
|:-----:|----|----|
| PATCH | `https://{{resourceName}}.farmbeats.azure.net/oauth/providers/{oauthProviderID}` | Resource name is the Azure Data Manager for Agriculture resource name.|

> Important
>The contentType in the request header should be **application/merge-patch+json** for PATCH requests and **application/json** for all other requests.

#### URI parameters

|Name | In | Required | Type | Description|
|:-----:|:----:|:----:|:----:|----|
| api-version | query | true | string | The api version to use.|
| oauthProviderID | path | true | string | The oAuth provider ID (Currently supported ID is JOHNDEERE [case sensitive]).|


#### Request body

|Name | Required | Type | Description|
|:-----:|:----:|:----:|----|
| appID | true | string | OAuth App ID for given Auth Provider.|
| appSecret | true | string | OAuth App secret for given Provider. Note: Won't be sent in response.|
| apiKey | | string | OAuth Api key for given Provider (optional). Note: currently Applicable to Climate provider. Won't be sent in response.|
| isProductionApp | | boolean | An optional flag to determine if the App is ready to be used for Production scenarios in the provider side or not. (Default value: false) Note: Currently applicable for JohnDeere.|
| name | | string | User provided name to identify the resource.|
| description | | string | User provided description.|
| properties | | dictionary (string, string/double)  | User defined dictionary containing key-value pairs.|

### Response

#### Status codes

|Name | Description|
|-----|----|
| 201 Success | Successful operation.|
| 400 Bad Request | The server couldn't understand the request due to invalid syntax.|
| 401 Unauthorized | The token is missing, invalid, or has expired.|
| 403 Forbidden | Not authorized to perform the operation.|
| 404 Not Found | Couldn't find the requested resource.|
| 500 Internal Server Error | The server has encountered an unexpected situation. Retry after some time and if the problem persists, write to madma@microsoft.com|

#### Response body

|Name | Type | Description|
|:-----:|:----:|----|
| id (oauthProviderID) | string | ID of the OAuth Provider (JOHNDEERE).|
| appID |  string | OAuth App ID for given Auth Provider.|
| isProductionApp | boolean | An optional flag to determine if the App is ready to be used for Production scenarios in the provider side or not. (Default value: false) Note: Currently applicable for JohnDeere.|
| eTag | string | The ETag value to implement optimistic concurrency.|
| createdDateTime | string | Date when resource was created.|
| modifiedDateTime | string | Date when resource was last modified.|
| name | string | User provided name to identify the resource.|
| description | string | User provided description.|
| properties | dictionary (string, string/double)  | User defined dictionary containing key-value pairs.|

### Example

#### Sample request body

```json
{
  "appID": "appID",
  "appSecret": "appSecret",
  "apiKey": "apiKey",
  "isProductionApp": true,
  "name": "JD integration",
  "description": "Integrating JD oAuth flow",
  "properties": {
    "Data": "FarmOperations"
  }
}
```

#### Sample response body

```json
{
  "id": "JOHNDEERE",
  "appID": "appID",
  "isProductionApp": true,
  "eTag": "2b00a419-0000-0700-0000-5fe1ae4c0000",
  "createdDateTime": "2021-03-10T16:22:12.407Z",
  "modifiedDateTime": "2021-03-10T16:22:12.407Z",
  "name": "JD integration",
  "description": "Integrating JD oAuth flow",
  "properties": {
    "Data": "FarmOperations"
  }
}
```

## Step 3: Endpoint Configuration

There are two endpoints that need to be configured

1. **oAuth callback endpoint**: This endpoint is what the oAuth provider (Ex: John Deere) would be calling into during the oAuth flow. The oAuth callback endpoint will be generated in the following fashion **`https://<farmbeats-resource-name>.farmbeats.azure.net/oauth/callback`**.

2. **User redirect endpoint**: This endpoint is where you want your users (farmers) to be redirected to once the oAuth flow is completed. You need to generate and provide this endpoint to Azure Data Manager for Agriculture as `userRedirectLink` in the oauth/tokens/:connect API.

**Register both these endpoints with your APP on John Deere portal.**

## Step 4: Farmer (End-user) Integration

When a farmer (end-user) lands on your webpage where the user action is expected (Ex: Connect to John Deere button), make a call to `oauth/tokens/:connect` API as shown, to get the oAuth provider's (Ex: John Deere) sign-in uri back to start the end-user oAuth flow.

This API returns Connection link needed in the OAuth flow.

### Request

#### Operation

|Method |Request URI | Description|
|:-----:|----|----|
| POST | `https://{{resourceName}}.farmbeats.azure.net/oauth/tokens/:connect?api-version={{apiVersion}}` | Resource name is the Azure Data Manager for Agriculture resource name.|

#### URI parameters

|Name | In | Required | Type | Description|
|:-----:|:----:|:----:|:----:|----|
| api-version | query | true | string | The api version to use.|

#### Request body

|Name | Required | Type | Description|
|:-----:|:----:|:----:|----|
| partyid | true | string | ID of the farmer for whom the oAuth flow is being triggered.|
| oAuthProviderID | true | string | The oAuth provider ID (Currently supported ID is JOHNDEERE in all caps).|
| userRedirectLink | true | string | Link to redirect the user to, at the end of the oauth flow.|
| userRedirectState | | string  | State to provide back when redirecting the user, at the end of the oauth flow to uniquely identify the user at customer end.|

### Response

#### Status codes

|Name | Description|
|-----|----|
| 200 Success | Successful operation.|
| 400 Bad Request | The server couldn't understand the request due to invalid syntax.|
| 401 Unauthorized | The token is missing, invalid, or has expired.|
| 403 Forbidden | Not authorized to perform the operation.|
| 404 Not Found | Couldn't find the requested resource.|
| 500 Internal Server Error | The server has encountered an unexpected situation. Retry after some time and if the problem persists, write to madma@microsoft.com|

#### Response body

|Name | Type | Description|
|:-----:|:----:|----|
|  | string | Link used by solution providers (customers) to generate end-user facing oAuth link. (Ex: `Connect to John Deere` link)|

### Example

#### Sample request body

```json
{
  "partyid": "TEST-FARMER",
  "oAuthProviderID": "JOHNDEERE", 
  "userRedirectLink": "https://www.customerWebsite.com",
  "userRedirectState": "uniqueCode"
}
```

#### Sample response body

"https://www.oAuthAuthorizationLink.com"


Once the `oauth/tokens/:connect` API successfully returns the `oauthAuthorizationLink`, **end-user clicks on this link to go through the oAuth flow** (for example: The user will be served a John Deere oAuth page). On completion of the oAuth flow, our service redirects the user to the endpoint provided by the customer (`userRedirectLink`) with the following query parameters in the url

1. **status** (success/failure)
2. **state** (optional string to uniquely identify the user at customer end)
3. **message** (optional string)
4. **errorCode** (optional string when there is an error) in the parameters.

> [!NOTE]
>
> If the API returns 404, then it implies the oAuth flow failed and Azure Data Manager for Agriculture  couldn't acquire the access token.

## Step 5: Check Access Token Info (Optional)

This step is optional, only to confirm if for a given user or list of users, the required valid access token was acquired or not. This can be done via making a call to the `oauth/tokens` API as shown, and **check for the entry `isValid: true` in the response body**.

This API returns a list of OAuthToken documents.

### Request

#### Operation

|Method |Request URI | Description|
|:-----:|----|----|
| GET | `https://{{resourceName}}.Azure Data Manager for Agriculture .azure.net/oauth/tokens?api-version={{apiVersion}}` | Resource name is the Azure Data Manager for Agriculture resource name.|

#### URI parameters

|Name | In | Required | Type | Description|
|:-----:|:----:|:----:|:----:|----|
| api-version | query | true | string | The api version to use.|
| partyids  | query | true | array[string] | List of party IDs.|
| authProviderIDs | query | | array[string] | Name of AuthProvider.|
| isValid | query | | boolean | If the token object is valid.|
| minCreatedDateTime | query | | string($date-time) | Minimum creation date of resource (inclusive).|
| maxCreatedDateTime | query | | string($date-time) | Maximum creation date of resource (inclusive).|
| minLastModifiedDateTime | query | | string($date-time) | Minimum last modified date of resource (inclusive).|
| maxLastModifiedDateTime | query | | string($date-time) | Maximum last modified date of resource (inclusive).|
| $maxPageSize | query | | integer($int32) | Maximum number of items needed (inclusive). Minimum = 10, Maximum = 1000, Default value = 50.|
| $skipToken | query | | string | Skip token for getting next set of results.|

#### Request body

No Body

### Response

#### Status codes

|Name | Description|
|-----|----|
| 200 Success | Successful operation.|
| 400 Bad Request | The server couldn't understand the request due to invalid syntax.|
| 401 Unauthorized | The token is missing, invalid, or has expired.|
| 403 Forbidden | Not authorized to perform the operation.|
| 404 Not Found | Couldn't find the requested resource.|
| 500 Internal Server Error | The server has encountered an unexpected situation. Retry after some time and if the problem persists, write to madma@microsoft.com|

#### Response body

|Name | Type | Description|
|:-----:|:----:|----|
| partyid | string | ID of the associated farmer.|
| authProviderID | string | Name of AuthProvider.|
| isValid | boolean | Indicates if the token is a valid and working one or expired.|
| createdDateTime | string | Creation Date.|
| modifiedDateTime | string | Modification Date.|
| eTag | string | The ETag value to implement optimistic concurrency.|
| $skipToken | string | Token used in retrieving the next page. If null, there are no other pages.|
| nextLink | string | Continuation link (absolute URI) to the next page of results in the list.|


### Example

#### Sample request body

```json
No Body
```

#### Sample response body

```json
{
  "value": [
    {
      "partyid": "TEST-FARMER",
      "authProviderID": "JOHNDEERE",
      "isValid": true,
      "createdDateTime": "2021-03-11T04:15:04.014Z",
      "modifiedDateTime": "2021-03-11T04:15:04.014Z",
      "eTag": "2b00a419-0000-0700-0000-5fe1ae4c0000"
    }
  ],
  "$skipToken": "string",
  "nextLink": "string"
}
```

**This step marks the successful completion of the oAuth flow for a user**. Now, you are ready to trigger a new FarmOperationsDataJob using the `/farm-operations/ingest-data/{jobID}` API to start pulling the farm operations data from JohnDeere.

You can now create a farm operation data ingestion job to **pull farm, field & boundary** information associated with the given "partyid" and also pull the **associated farm operations data** that is being requested.

This API creates a farm operation data ingestion job.

## Request

### Operation

|Method |Request URI | Description|
|:-----:|----|----|
| PUT | https://{{resourceName}}.farmbeats.azure.net/farm-operations/ingest-data/{jobID}?api-version={{apiVersion}} | Resource name is the Azure Data Manager for Agriculture resource name.|

#### Note
The contentType in the request header should be **application/merge-patch+json** for PATCH requests and **application/json** for all other requests.

### URI parameters

|Name | In | Required | Type | Description|
|:-----:|:----:|:----:|:----:|----|
| jobID | path | true | string | Job ID supplied by user.|
| api-version | query | true | string | The api version to use.|

### Request body

|Name | Required | Type | Description|
|:-----:|:----:|:----:|----|
| partyid | true | string | The ID of the Party.|
| authProviderID | true | string | Auth provider ID (Currently supported one is `JohnDeere`).|
| startYear | true | integer | Start Year (Minimum = 2000, Maximum = CurrentYear).|
| isIncremental |  | boolean | Use to pull incremental changes from the last run.|
| operations |  | enum | List of operation types for which data needs to be downloaded. Currently supported operation types are `AllOperations`, `Application`, `Planting`, `Harvest`, `Tillage`.|
| name |  | string | Name of the farm operations job.|
| description |  | string | User provided description.|
| properties | | dictionary (string, string/double) | This is a user defined dictionary containing key-value pairs.|

## Response

### Status codes

|Name | Description|
|-----|----|
| 202 Success | Successful operation. The job is created.|
| 400 Bad Request | The server couldn't understand the request due to invalid syntax.|
| 401 Unauthorized | The token is missing, invalid, or has expired.|
| 403 Forbidden | Not authorized to perform the operation.|
| 404 Not Found | Couldn't find the requested resource.|
| 500 Internal Server Error | The server has encountered an unexpected situation. Retry after some time and if the problem persists, write to madma@microsoft.com|

### Response body

|Name | Type | Description|
|:-----:|:----:|----|
| partyid | string | ID of the farmer.|
| authProviderID | string | Authentication provider ID.|
| operations | enum | List of operation types for which data needs to be downloaded. Available values: AllOperations, Application, Planting, Harvest, Tillage.|
| startYear |  string | Start Year (Minimum = 2000, Maximum = CurrentYear).|
| isIncremental | boolean | Use this to pull only the incremental changes from the last run.|
| durationInSeconds | string | Duration of the job in seconds.|
| id | string | ID of the job.|
| status | enum | Various states a job can be in [ Waiting, Running, Succeeded, Failed, Cancelled ].|
| message | string | Status message to capture more details of the job.|
| createdDateTime | string | Job created at date time.|
| lastActionDateTime | string | Job was last acted upon at.|
| startTime | string | Job start time when available.|
| endTime | string | Job end time when available.|
| name | string | Name of the farm operations job.|
| description | string | User provided description.|
| properties | dictionary (string, string/double) | This is a user defined dictionary containing key-value pairs.|

## Example

### Sample request body

```json
{
  "partyid": "TEST-FARMER",
  "authProviderID": "JOHNDEERE",
  "operations": [
    "AllOperations"
  ],
  "startYear": 2012,
  "name": "Farm Operations Job",
  "description": "For TEST-FARMER",
  "properties": {
    "Operation": "All"
  }
}
```

#### Sample response body

```json
{
  "partyid": "TEST-FARMER",
  "authProviderID": "JOHNDEERE",
  "operations": [
    "AllOperations"
  ],
  "startYear": 2012,
  "durationInSeconds": "2.5",
  "id": "sdi-0916aeec-ad8d-41d0-9797-63924f818cd7",
  "status": "Waiting",
  "isIncremental": false,
  "message": "string",
  "createdDateTime": "2021-03-15T07:14:14.576Z",
  "lastActionDateTime": "2021-03-15T07:14:14.576Z",
  "startTime": "2021-03-15T07:14:14.576Z",
  "endTime": "2021-03-15T07:14:14.576Z",
  "name": "Farm Operations Job",
  "description": "For TEST-FARMER",
  "properties": {
    "Operation": "All"
  }
}
```

Based on the startYear & operations list provided, Azure Data Manager for Agriculture will fetch the operations data from the start year to the current date. In addition to operations data, **Azure Data Manager for Agriculture will also fetch the farm, field & boundary** information for the given `"partyid"` associated with the John Deere system. These farm hierarchy entities **would be stored in Azure Data Manager for Agriculture as staged resources**. Staged resources which aren't made available by default.

## How to query the staged farm hierarchy resources

Use the existing CRUD APIs present for farm, field, boundary and provide a property filter to specifically query staged resources as shown, either using Swagger UI or API Client.

**`propertyFilters: SYSTEM-STATE eq STAGED`** 

OR

```json
"propertyFilters":{
"SYSTEM-STATE": "STAGED"
}
```

Azure Data Manager for Agriculture will return all staged (farm, field, boundary) resources that are present under a given "partyid" when you use the property filter.
