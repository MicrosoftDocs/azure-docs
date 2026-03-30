---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 02/26/2026
---

> [!IMPORTANT]
> If your organization uses Customer-Managed Keys (CMK) for data encryption, be aware that CMK isn't supported for data stored in the Microsoft Sentinel data lake. Sentinel workspaces applying CMK aren't accessible via data lake experiences.
>
>Any data ingested into the data lake, such as custom tables or transformed data is encrypted using Microsoft-managed keys.
>
>Onboarding to the Microsoft Sentinel data lake may not fully align with your organization's encryption policies or data protection standards.