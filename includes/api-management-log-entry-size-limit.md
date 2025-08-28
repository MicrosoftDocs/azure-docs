---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 05/13/2025
ms.author: danlep
ms.custom:
  - build-2025
---

> [!IMPORTANT]
> API Management enforces a 32 KB limit for the size of log entries sent to Azure Monitor. The behavior when a log entry exceeds the limit depends on the log category and the data attributes that are logged:
> * **API Management gateway logs** - Logged request or response payloads in a log entry, if collected, can be up to 8,192 bytes each. If the combined size of the attributes in an entry exceeds 32 KB, API Management trims the entry by removing all body and trace content. 
> * **Generative AI gateway logs** - LLM request or response messages up to 32 KB in size, if collected, are sent in a single entry. Messages larger than 32 KB are split and logged in 32 KB chunks with sequence numbers for later reconstruction. Request messages and response messages can't exceed 2 MB each.