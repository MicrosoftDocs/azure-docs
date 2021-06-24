---
title: Delete report queries API
description: Use this API to delete user-defined queries for commercial marketplace analytics. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Delete report queries API

This API deletes user-defined queries.

**Request syntax**

| **Method** | **Request URI** |
| --- | --- |
| DELETE | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledQueries/{queryId}` |

**Request header**

| **Header** | **Type** | **Description** |
| --- | --- | --- |
| Authorization | string | Required. The Azure Active Directory (Azure AD) access token in the form `Bearer <token>` |
| Content-Type | string | `Application/JSON` |

**Path Parameter**

| **Parameter name** | **Type** | **Description** |
| --- | --- | --- |
| `queryId` | string | Filter to get details of only queries with the ID given in this argument |

**Query Parameter**

None

**Request Payload**

None

**Glossary**

None

**Response**

The response payload is structured as follows in JSON format.

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

This table lists the key definitions of elements in the response.

| **Parameter** | **Description** |
| --- | --- |
| `QueryId` | Unique UUID of the query that was deleted. |
| `Name` | Name of the query that was deleted |
| `Description` | Description of the deleted query |
| `Query` | Report query string of the deleted query |
| `Type` | userDefined |
| `User` | User ID who created the query |
| `CreatedTime` | Time the query was created |
| `ModifiedTime` | Null |
| `TotalCount` | Number of datasets in the Value array |
| `StatusCode` | Result Code. The possible values are 200, 400, 401, 403, 500 |
