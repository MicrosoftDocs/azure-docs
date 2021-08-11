---
author: memildin
ms.author: memildin
manager: rkarlin
ms.date: 05/19/2021
ms.topic: include
---

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|**Azure Defender for container registries** is billed as shown on [the pricing page](../articles/security-center/security-center-pricing.md)|
|Supported registries and images:|Linux images in ACR registries accessible from the public internet with shell access|
|Unsupported registries and images:|Windows images<br>'Private' registries (unless access is granted to [Trusted Services](..articles/container-registry/allow-access-trusted-services.md#trusted-services))<br>Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images, or "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br>Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md)|
|Required roles and permissions:|**Security reader** and [Azure Container Registry roles and permissions](../articles/container-registry/container-registry-roles.md)|
|Clouds:|:::image type="icon" source="../articles/security-center/media/icons/yes-icon.png" border="false"::: Commercial clouds<br>:::image type="icon" source="../articles/security-center/media/icons/yes-icon.png" border="false"::: US Gov and China Gov - Only the scan on push feature is currently supported. Learn more in [When are images scanned?](../articles/security-center/defender-for-container-registries-introduction.md#when-are-images-scanned)|
|||
