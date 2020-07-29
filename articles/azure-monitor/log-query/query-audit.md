---
title: Audit queries in Azure Monitor Logs
description: 
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/29/2020

---

# Audit queries in Azure Monitor Logs
This feature introduces the ability to audit Azure Monitor Logs queries. When enabled through the Azure Diagnostics mechanism, you will be able to collect telemetry about who ran a query, when the query was run, what tool was used to run the query, the query text, and performance stats around the query execution. This telemetry, as with any other Azure Diagnostics-based telemetry, can be sent to an Azure Storage Blob, Azure Event Hub, or into Azure Monitor Logs.

| Field | Description |
|:---|:---|
| TimeGenerated | UTC time when query was submitted. |
| CorrelationId | A unique ID to identify the query. Can be used in troubleshooting scenarios when contacting Microsoft. |
| AADObjectId |  |
| AADTenantId  |  |
| AADEmail |  |
| AADClientId | The ID and resolved name of the application that was used to invoke the query. |
| RequestClientApp |  |
| QueryTimeRangeStart | The start and end time specified for the query. These correlate to the time picker when using Azure Monitor UI, or explicit headers passed in when the query is sent via the API. Not populated in certain scenarios, such as when the user uses the Log Analytics UI, and specifies the time range inside the query rather than using the time picker. |
| QueryTimeRangeEnd |  |
| QueryText | The actual text of the query, as submitted. |
| RequestTarget | The API URL that was used to submit the query.  |
| RequestContext | The full list of resources that the user submitting the query requested to run the query against. A dynamic property containing (up to) three arrays of string: workspaces, applications, and resources. Subscription or resource group-targeted queries will show up under “resources”. Includes the target implied by RequestTarget. |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |