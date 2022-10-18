---
title: Update report API
description: Use this API to report parameter for commercial marketplace analytics reports. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 03/14/2022
---

# Update report API

This API helps you modify a report parameter.

**Request syntax**

| Method | Request URI |
| ------------ | ------------- |
| PUT | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledReport/{Report ID}` |

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

**Request payload**

```json
{
  "ReportName": "string",
  "Description": "string",
  "StartTime": "string",
  "RecurrenceInterval": 0,
  "RecurrenceCount": 0,
  "Format": "string",
  "CallbackUrl": "string"
}
```

**Glossary**

This table lists the key definitions of elements in the request payload.

| Parameter | Required | Description | Allowed values |
| ------------ | ------------- | ------------- | ------------- |
| `ReportName` | Yes | Name to be assigned to the report | string |
| `Description` | No | Description of the created report | string |
| `StartTime` | Yes | Timestamp after which the report generation will begin | string |
| `RecurrenceInterval` | No | Frequency at which the report should be generated in hours. Minimum value is 4 | integer |
| `RecurrenceCount` | No | Number of reports to be generated. Default is indefinite | integer |
| `Format` | Yes | File format of the exported file. Default is CSV. | CSV/TSV |
| `CallbackUrl` | Yes | https callback URL to be called on report generation | string |

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
| `ReportId` | Universally unique identifier (UUID) of the report being updated |
| `ReportName` | Name given to the report in the request payload |
| `Description` | Description given during creation of the report |
| `QueryId` | Query ID passed at the time the report was created |
| `Query` | Query text that will be executed for this report |
| `User` | User ID used to create the report |
| `CreatedTime` | Time the report was created. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `ModifiedTime` | Time the report was last modified. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `StartTime` | Time the report execution will begin. The time format is yyyy-MM-ddTHH:mm:ssZ |
| `ReportStatus` | Status of the report execution. The possible values are Paused, Active, and Inactive. |
| `RecurrenceInterval` | Recurrence interval provided during report creation |
| `RecurrenceCount` | Recurrence count provided during report creation |
| `CallbackUrl` | Callback URL provided in the request |
| `Format` | Format of the report files |
