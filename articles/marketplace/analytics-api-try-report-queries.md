---
title: Try report queries API
description: Use this API to execute a report query for commercial marketplace analytics reports. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 03/14/2022
---

# Try report queries API

This API executes a Report query statement. The API returns only 10 records that you as a partner can use to verify if the data is as you expected.

> [!IMPORTANT]
> This API has a query execution timeout of 100 seconds. If you notice the API is taking more than 100 seconds, it is highly likely that the query is syntactically correct or else you would have received an error code other than 200. The actual report generation will pass if the query syntax is correct.

**Request syntax**

| **Method** | **Request URI** |
| --- | --- |
| GET | `https://api.partnercenter.microsoft.com/insights/v1/cmp/ScheduledQueries/testQueryResult?exportQuery={query text}` |

**Request header**

| **Header** | **Type** | **Description** |
| --- | --- | --- |
| Authorization | string | Required. The Azure Active Directory (Azure AD) access token in the form `Bearer <token>` |
| Content-Type | string | `Application/JSON` |

**QueryParameter**

| **Parameter Name** | **Type** | **Description** |
| --- | --- | --- |
| `exportQuery` | string | Report query string that needs to be executed |
| `queryId` | string | A valid existing query ID |

**Path**  **Parameter**

None

**Request Payload**

None

**Glossary**

None

**Response**

The response payload is structured as follows:

Response code: 200, 400, 401, 403, 404, 500

Response payload: Top 10 rows of query execution
