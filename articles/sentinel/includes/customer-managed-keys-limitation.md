---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 07/30/2025
---

> [!IMPORTANT]
> If your organization uses Customer-Managed Keys (CMK) for data encryption, be aware that CMK isn't fully supported for data stored in the Microsoft Sentinel data lake. Any data ingested into the data lake, such as custom tables or transformed data is encrypted using Microsoft-managed keys. Onboarding to the Microsoft Sentinel data lake may not fully align with your organization's encryption policies or data protection standards.