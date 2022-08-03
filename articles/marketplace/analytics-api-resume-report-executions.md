---
title: Resume report executions API
description: Use this API to resume the scheduled execution of a paused commercial marketplace analytics report. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 03/14/2022
---

# Resume report executions API

This API, on execution, resumes the scheduled execution of a paused commercial marketplace analytics report.

**Request syntax**

| Method | Request URI |
| ------------ | ------------- |
| PUT | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledReport/resume/{reportId}` |

**Request header**

| Header | Type | Description |
| ------------ | ------------- | ------------- |
| Authorization | string | Required. The Azure Active Directory (Azure AD) access token in the form `Bearer <token>` |
| Content-Type | string | `Application/JSON` |

**Path parameter**

None

**Query parameter**

| Parameter name | Required | Type | Description |
| ------------ | ------------- | ------------- | ------------- |
| `reportId` | Yes | string | ID of the report being modified |

**Glossary**

None

**Response**

The response payload is structured as follows in JSON format:

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
      "RecurrenceCount": 0,
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

| Parameter | Description |
| ------------ | ------------- |
| `ReportId` | Universally unique identifier (UUID) of the resumed report |
| `ReportName` | Name given to the report during creation |
| `Description` | Description given during creation of the report |
| `QueryId` | Query ID passed at the time the report was created |
| `Query` | Query text that will be executed for this report |
| `User` | User ID used for creation of the report |
| `CreatedTime` | Time the report was created. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `ModifiedTime` | Time the report was last modified. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `StartTime` | Time at which report execution will begin. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `ReportStatus` | Status of the report execution. The possible values are Paused, Active, and Inactive. |
| `RecurrenceInterval` | Recurrence interval provided during report creation |
| `RecurrenceCount` | Recurrence count provided during report creation |
| `CallbackUrl` | Callback URL provided in the request |
| `Format` | Format of the report files |
