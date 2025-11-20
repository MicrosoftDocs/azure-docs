---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 07/15/2025
---

## Service parameters and limits for KQL queries in the lake tier

The following service parameters limitations apply when writing queries in Microsoft Sentinel data lake.

| Category                   | Parameter/limit                                         |
|----------------------------|-----------------------------------------------|
| Concurrent interactive queries | 45 per minute                             |
| Query result data          | 64 MB                                         |
| Query result rows          | 500,000 rows                                  |
| Query Scope                | Multiple workspaces                           |
| Query timeout              | 8 minutes                                     |
| Queryable time range       | Up to 12 years, depending on data retention.  |