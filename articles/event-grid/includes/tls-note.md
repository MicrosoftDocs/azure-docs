---
 title: Deprecation of Transport Layer Security (TLS) 1.0 and 1.1
 description: The include file contains a note about deprecation of TLS 1.0 and 1.1.
 author: robece
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 10/28/2024
 ms.author: robece
---

> [!NOTE]
> **Regarding TLS 1.0 / 1.1 deprecation**: For system topics, you need to take action only for the event delivery to webhook destinations. If the destination supports TLS 1.2, the event delivery happens using 1.2. If the destination doesn't support TLS 1.2, the event delivery automatically falls back to 1.0 and 1.1. Post March 1st, 2025, event delivery using 1.0 and 1.1 won't be supported. Ensure that your webhook destinations support TLS 1.2. One easy way to check for TLS 1.2 support is to use [Qualys SSL Labs](https://www.ssllabs.com/ssltest/). If the report shows that TLS 1.2 is supported, no action is required. For more information, see the following blog post: [Retirement: Upcoming TLS changes for Azure Event Grid](https://azure.microsoft.com/updates/v2/TLS-changes-for-Azure-Event-Grid)