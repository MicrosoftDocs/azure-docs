---
title: Get report queries API
description: Use this API to get all queries that are available for use in commercial marketplace analytics reports. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 03/14/2022
---

# Get report queries API

The Get report queries API gets all queries that are available for use in reports. It gets all the system and user-defined queries by default.

**Request syntax**

| **Method** | **Request URI** |
| --- | --- |
| GET | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledQueries?queryId={QueryID}&queryName={QueryName}&includeSystemQueries={include_system_queries}&includeOnlySystemQueries={include_only_system_queries}` |

**Request header**

| **Header** | **Type** | **Description** |
| --- | --- | --- |
| Authorization | string | Required. The Azure Active Directory (Azure AD) access token in the form `Bearer <token>` |
| Content-Type | string | `Application/JSON` |

**Path parameter**

None

**Query parameter**

| **Parameter name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `queryId` | string | No | Filter to get details of only queries with the ID given in the argument |
| `queryName` | string | No | Filter to get details of only queries with the name given in the argument |
| `IncludeSystemQueries` | boolean | No | Include predefined system queries in the response |
| `IncludeOnlySystemQueries` | boolean | No | Include only system queries in the response |

**Request payload**

None

**Glossary**

None

**Response**

The response payload is structured as follows:

Response code: 200, 400, 401, 403, 404, 500

Response payload:

```json
{
  "Value": [
    {
      "QueryId": "string",
      "Name": "string",
      "Description": "string",
      "Query": "string",
      "Type": "string",
      "User": "string",
      "CreatedTime": "string",
      "ModifiedTime": "string"
    }
  ],
  "TotalCount": 0,
  "Message": "string",
  "StatusCode": 0
}
```

**Glossary**

This table describes the key definitions of elements in the response.

| **Parameter** | **Description** |
| --- | --- |
| `QueryId` | Unique UUID of the query |
| `Name` | Name given to the query at the time of query creation |
| `Description` | Description given during creation of the query |
| `Query` | Report query string |
| `Type` | Set to `userDefined` for user created queries and `system` for predefined system queries |
| `User` | User ID who created the query |
| `CreatedTime` | Time of creation of query |
| `TotalCount` | Number of datasets in the Value array |
| `StatusCode` | Result Code. The possible values are 200, 400, 401, 403, 500 |
