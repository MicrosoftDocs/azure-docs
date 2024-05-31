---
author: anaharris-ms
ms.service: reliability
ms.topic: include
ms.date: 01/05/2024
ms.author: anaharris
---

Azure services are grouped into three categories: *foundational*, *mainstream*, and *strategic*. Azure's general policy on deploying services into any given region is primarily driven by region type, service categories, and customer demand.

- **Foundational**: Available in all recommended and alternate regions when the region is generally available, or within 90 days of a new foundational service becoming generally available.
- **Mainstream**: Available in all recommended regions within 90 days of the region general availability. Demand-driven in alternate regions, and many are already deployed into a large subset of alternate regions.
- **Strategic** (previously Specialized): Targeted service offerings, often industry-focused or backed by customized hardware. Demand-driven availability across regions, and many are already deployed into a large subset of recommended regions.

To see which services are deployed in a region and the future roadmap for preview or general availability of services in a region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

If a service offering isn't available in a region, contact your Microsoft sales representative for more information and to explore options.

| Region type | Non-regional | Foundational | Mainstream | Strategic | Availability zones | Data residency |
| --- | --- | --- | --- | --- | --- | --- |
| Recommended | **Y** | **Y** | **Y** | Demand-driven | **Y** | **Y** |
| Alternate | **Y** | **Y** | Demand-driven | Demand-driven | N/A | **Y** |