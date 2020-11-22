---
author: memildin
ms.author: memildin
manager: rkarlin
ms.date: 11/22/2020
ms.topic: include
---

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|**Azure Defender for container registries** is billed as shown on [the pricing page](security-center-pricing.md)|
|Supported registries and images:|Linux images in ACR registries accessible from the public internet with shell access|
|Unsupported registries and images:|Windows images<br>'Private' registries<br>Registries with access limited with a firewall, service endpoint, or private endpoints such as Azure Private Link<br>Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images, or "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS|
|Required roles and permissions:|**Security reader** and [Azure Container Registry reader role](../container-registry/container-registry-roles.md)|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) US Gov - Only the scan on push feature is currently supported. Learn more in [When are images scanned?](defender-for-container-registries-introduction.md#when-are-images-scanned)<br>![No](./media/icons/no-icon.png) China Gov, Other Gov|
|||