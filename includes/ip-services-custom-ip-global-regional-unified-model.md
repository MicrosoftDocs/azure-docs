---
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: include
ms.date: 06/04/2024
---

## Global/Regional vs Unified model

Before onboarding your range to Azure, you need to decide on the model that would work best for your architecture. For BYOIPv4, Azure offers two deployment models: "global/regional" and "unified".

* The Global/Regional model uses a *parent*/*child* paradigm. In this paradigm, the Microsoft Wide Area Network (WAN) advertises the global (parent) range, and the respective Azure regions advertise the regional (child) ranges. By default, global ranges can be anywhere from /21 to /24 in size, and regional ranges can be from /22 to /26 in size. Regional ranges are dependent on the size of their respective parent range, and they must be at least one level smaller. For example, a global range using /23 would allow a regional range of /24 to /26. Only the global range needs to be validated as part of the provisioning. The regional ranges are derived from the global range in a similar manner to the way public IP prefixes are derived from custom IP prefixes.  Regional ranges can be in different subscriptions from the global range, but must be in the same tenant.

* The Unified model is a simplified system where both the Microsoft Wide Area Network (WAN) and the Azure region advertises the same range. By default, a unified range can be anywhere from /21 to /24 in size.

* The choice of the model is dependent on the scope of the desired onboarding. For example, if your plan only involves onboarding a range to a single Azure region, the unified model is the more logical choice and avoids management overhead. If your organization is instead looking to deploy BYOIPv4 ranges to multiple regions--potentially spread across different teams within the organization and over an extended period of time--then a global/regional model can provide more flexibility.

> [!NOTE]
> Ranges cannot be "migrated" between the two models once they are onboarded; they must be fully deprovisioned and re-onboarded to utilize the other model.
