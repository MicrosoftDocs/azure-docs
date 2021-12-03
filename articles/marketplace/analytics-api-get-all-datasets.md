---
title: Get all datasets API
description: Use this API to get all available datasets for commercial marketplace analytics. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 3/08/2021
---

# Get all datasets API

The Get all datasets API gets all the available datasets. Datasets list the tables, columns, metrics, and time ranges.

**Request syntax**

| **Method** | **Request URI** |
| --- | --- |
| GET | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledDataset?datasetName={Dataset Name}` |

**Request header**

| **Header** | **Type** | **Description** |
| --- | --- | --- |
| Authorization | string | Required. The Azure Active Directory (Azure AD) access token in the form `Bearer <token>` |
| Content-Type | string | `Application/JSON` |

**Path parameter**

None

**Query parameter**

| **Parameter Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `datasetName` | string | No | Filter to get details of only one dataset |

**Request payload**

None

**Glossary**

None

**Response**

The response payload is structured as follows:

Response code: 200, 400, 401, 403, 404, 500

Response payload example:

```json
{
   "Value":[
      {
         "DatasetName ":"string",
         "SelectableColumns":[
            "string"
         ],
         "AvailableMetrics":[
            "string"
         ],
         "AvailableDateRanges ":[
            "string"
         ]
      }
   ],
   "TotalCount":int,
   "Message":"<Error Message>",
   "StatusCode": int
}
```

**Glossary**

This table defines the key elements in the response:

| **Parameter** | **Description** |
| --- | --- |
| `DatasetName` | Name of the dataset that this array object defines |
| `SelectableColumns` | Raw columns that can be specified in the select columns |
| `AvailableMetrics` | Aggregation/metric column names that can be specified in the select columns |
| `AvailableDateRanges` | Date range that can be used in report queries for the dataset |
| `NextLink` | Link to Next page if the data is paginated |
| `TotalCount` | Number of datasets in the Value array |
| `StatusCode` | Result Code. The possible values are 200, 400, 401, 403, 500 |
