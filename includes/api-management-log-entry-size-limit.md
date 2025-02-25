---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 05/15/2024
ms.author: danlep
---

> [!IMPORTANT]
> * If enabled in API Management Gateway logs, logged request or response payloads can be up to 8,192 bytes. API Management also enforces a 32 KB limit for a diagnostic log entry sent to Azure Monitor, which includes the payloads and other attributes such as status codes, headers, and timestamps. If the combined size of the attributes exceeds 32 KB, API Management trims the entry by removing all body and trace content. 
> * If enabled in LLM Gateway logs, request or response messages are logged up to 32 KB; messages larger than 32 KB are split and logged in 32 KB chunks including sequence numbers for later reconstruction. Request messages and response messages cannot exceed 2 MB each.