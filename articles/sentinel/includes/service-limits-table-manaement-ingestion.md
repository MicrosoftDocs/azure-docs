---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 06/30/2025
---

## Service limits for tables, data management, and ingestion

The following table lists the service limits for the Microsoft Sentinel data lake (Preview) service related to table management, data ingestion, and retention. These limits include, but aren't limited to, Azure Resource Graph data, Microsoft 365 data, and data mirroring.

| Description                                         | Limit                        | 
|-----------------------------------------------------|------------------------------|
| Lake Retention (Aux)                                | 12 years                     | 
| Lake Retention (Asset data)                         | 12 years                     | 
| Ingestion requests per minute to a data collection endpoint | 15,000               |
| Data ingestion per minute to a data collection endpoint    | 50 GB                 |
| Maximum size for field values (Log Analytics)                  | 32 KB (truncated above the limit) | 
| Default ingestion volume rate threshold in LALog Analytics workspaces   | 6 GB/min uncompressed |

