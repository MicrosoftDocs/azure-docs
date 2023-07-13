---
title: include file
description: include file
services: azure-sentinel
author: yelevin
ms.service: microsoft-sentinel
ms.topic: include
ms.date: 06/28/2020
ms.author: yelevin
ms.custom: include file
---
### The data model of the schema

| Field | Data type | Description |
| ---- | ---- | ---- |
| **AdditionalData** | dynamic | Alerts count, bookmarks count, comments count, alert products names and tactics |
| **AlertIds** | dynamic | Alerts from which incident was created |
| **BookmarkIds** | dynamic | Bookmarked entities |
| **Classification** | string | Incident closing classification |
| **ClassificationComment** | string | Incident closing classification comment |
| **ClassificationReason** | string | Incident closing classification reason |
| **ClosedTime** | datetime | Timestamp (UTC) of when the incident was last closed |
| **Comments** | dynamic | Incident comments |
| **CreatedTime** | datetime | Timestamp (UTC) of when the incident was created |
| **Description** | string | Incident description |
| **FirstActivityTime** | datetime | First event time |
| **FirstModifiedTime** | datetime | Timestamp (UTC) of when the incident was first modified |
| **IncidentName** | string | Internal GUID |
| **IncidentNumber** | int |  |
| **IncidentUrl** | string | Link to incident |
| **Labels** | dynamic | Tags |
| **LastActivityTime** | datetime | Last event time |
| **LastModifiedTime** | datetime | Timestamp (UTC) of when the incident was last modified <br>(the modification described by the current record) |
| **ModifiedBy** | string | User or system that modified the incident |
| **Owner** | dynamic |  |
| **RelatedAnalyticRuleIds** | dynamic | Rules from which the incident's alerts were triggered |
| **Severity** | string | Severity of the incident (High/Medium/Low/Informational) |
| **SourceSystem** | string | Constant ('Azure') |
| **Status** | string |  |
| **TenantId** | string |  |
| **TimeGenerated** | datetime | Timestamp (UTC) of when the current record was created <br>(upon modification of the incident) |
| **Title** | string | 
| **Type** | string | Constant ('SecurityIncident') |
|
