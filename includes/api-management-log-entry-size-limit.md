---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/28/2025
ms.author: danlep
---

> [!IMPORTANT]
> API Management enforces a 32 KB limit for the size of log entries sent to Azure Monitor. The behavior when the logged data exceeds the limit depends on the log category and the data attributes that are logged:
> * **API Management Gateway logs** - Logged request or response payloads in a log entry, if collected, can be up to 8,192 bytes each. If the combined size of the logged attributes exceeds 32 KB, API Management trims the entry by removing all body and trace content. 
> * **LLM Gateway logs** - Request or response messages, if collected, are logged up to 32 KB; messages larger than 32 KB are split and logged in 32 KB chunks including sequence numbers for later reconstruction. Request messages and response messages can't exceed 2 MB each.