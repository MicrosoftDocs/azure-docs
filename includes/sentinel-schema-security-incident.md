---
title: include file
description: include file
services: azure-sentinel
author: yelevin
ms.service: azure-sentinel
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
| **ClassificationComment** | string | Incident closing classification |
| **ClassificationReason** | string | Incident closing classification |
| **Comments** | dynamic | Incident comments |
| **CreatedTime** | datetime |  |
| **Description** | string | Incident description |
| **FirstActivityTime** | datetime | First event time |
| **IncidentName** | string |  |
| **IncidentNumber** | int |  |
| **IncidentUrl** | string |  |
| **Labels** | dynamic | Tags |
| **LastActivityTime** | datetime | Last event time |
| **LastModifiedTime** | datetime | Last modification time of incident |
| **ModifiedBy** | string | User or system that modified the incident<br>*All modifications or last modification?* |
| **Owner** | dynamic |  |
| **RelatedAnalyticRuleIds** | dynamic | Rules from which the incident's alerts were triggered |
| **Severity** | string | *Severity of the incident (High/Medium/Low/Informational)* |
| **SourceSystem** | string | Constant ('Azure') |
| **Status** | string |  |
| **TenantId** | string |  |
| **TimeGenerated** | datetime | *UTC timestamp on which the incident was created* |
| **Title** | string | 
| **Type** | string | Constant ('SecurityIncident') |
|
