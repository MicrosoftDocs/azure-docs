---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/15/2024
ms.author: danlep
---
> [!IMPORTANT]
> When logging large request or response payloads, consider both the payload (body) size limit and API Management's log entry limit of 32 KB. The API Management log entry includes other attributes such as status codes, headers, URLs, and timestamps. If a log entry could exceed the limit, API Management trims it by removing all body and trace content. An entry that still exceeds the limit is dropped. 