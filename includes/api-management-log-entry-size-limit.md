---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/15/2024
ms.author: danlep
---

API Management limits the size of logged request or response payloads to 8,192 bytes. It also has a 32 KB limit for the size of a diagnostic log entry sent to Azure Monitor. The diagnostic log entry includes the request or response payloads and other attributes such as status codes, headers, URLs, and timestamps. If the size of the combined attributes exceeds 32 KB, API Management trims the log entry to 32 KB by removing all body and trace content. An entry that still exceeds the limit is dropped. 