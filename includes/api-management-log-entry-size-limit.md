---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/15/2024
ms.author: danlep
---

> [!IMPORTANT]
> If enabled, logged request or response payloads can be up to 8,192 bytes. API Management also enforces a 32 KB limit for a diagnostic log entry sent to Azure Monitor, which includes the payloads and other attributes such as status codes, headers, and timestamps. If the combined size of the attributes exceeds 32 KB, API Management trims the entry by removing all body and trace content. 