---
title: Get report API
description: Use this API to get analytics reports that have been scheduled in Partner Center. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Get report API

This API gets all the reports that have been scheduled.

**Request syntax**

| **Method** | **Request URI** |
| --- | --- |
| GET | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledReport?reportId={Report ID}&reportName={Report Name}&queryId={Query ID} ` |

**Request header**

| **Header** | **Type** | **Description** |
| --- | --- | --- |
| Authorization | string | Required. The Azure Active Directory (Azure AD) access token in the form `Bearer <token>` |
| Content-Type | string | `Application/JSON` |

**Path Parameter**

None

**Query Parameter**

| **Parameter Name** | **Required** | **Type** | **Description** |
| --- | --- | --- | --- |
| `reportId` | No | string | Filter to get details of only reports with the `reportId` given in this argument |
| `reportName` | No | string | Filter to get details of only reports with the `reportName` given in this argument |
| `queryId` | No | boolean | Include predefined system queries in the response |

**Glossary**

None

**Response**

The response payload is structured in JSON format as follows:

Response code: 200, 400, 401, 403, 404, 500

Response payload:

```json
{
  "Value": [
    {
      "ReportId": "string",
      "ReportName": "string",
      "Description": "string",
      "QueryId": "string",
      "Query": "string",
      "User": "string",
      "CreatedTime": "string",
      "ModifiedTime": "string",
      "StartTime": "string",
      "ReportStatus": "string",
      "RecurrenceInterval": 0,
      " RecurrenceCount": 0,
      "CallbackUrl": "string",
      "Format": "string"
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
| `ReportId` | Unique UUID of the report that was created |
| `ReportName` | Name given to the report in the request payload |
| `Description` | Description given when the report was created |
| `QueryId` | Query ID passed at the time the report was created |
| `Query` | Query text that will be executed for this report |
| `User` | User ID used to create the report |
| `CreatedTime` | Time the report was created. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `ModifiedTime` | Time the report was last modified. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `StartTime` | Time execution will begin. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `ReportStatus` | Status of the report execution. The possible values are Paused, Active, and Inactive. |
| `RecurrenceInterval` | Recurrence interval provided during report creation |
| `RecurrenceCount` | Recurrence count provided during report creation |
| `CallbackUrl` | Callback URL provided in the request |
| `Format` | Format of the report files |
