---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 07/15/2025
---

## Service parameters and limits for tables, data management, and ingestion

[!INCLUDE [Customer-managed keys limitation](../includes/customer-managed-keys-limitation.md)]
  
The following table lists the service parameters and limits for the Microsoft Sentinel data lake service related to table management, data ingestion, and retention. These limits include, but aren't limited to, Azure Resource Graph data, Microsoft 365 data, and data mirroring.

| Category                                         | Parameter/limit                              |
|--------------------------------------------------|----------------------------------------------|
| Workspaces per tenant                             | 20 workspaces                |
| Data ingestion per minute to a data collection endpoint    | 50 GB                              |
| Default ingestion volume rate threshold in LALog Analytics workspaces | 6 GB/min uncompressed   |
| Ingestion requests per minute to a data collection endpoint | 15,000                            |
| Lake Retention (Asset data)                       | 12 years                                    |
| Lake Retention (Aux)                              | 12 years                                    |
| Maximum size for field values (Log Analytics)     | 32 KB (truncated above the limit)           |
| Table setup latency during onboarding              | 90-120 minutes                             |
| New table setup latency                            | 90-120 minutes                             |
| Switching data between tiers latency               | 90-120 minutes                             |
