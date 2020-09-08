---
title: How to use Azure Defender for Kubernetes
description: Learn about using Azure Defender for Kubernetes to defend your containerized workloads
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: conceptual
ms.service: security-center
manager: rkarlin

---

# Use Azure Defender for Kubernetes to defend your containerized workloads

Enable **Azure Defender for Kubernetes** in Azure Security Center to gain deeper visibility into your AKS nodes, cloud traffic, and security controls.

Together, Azure Security Center and AKS form the best cloud-native Kubernetes security offering.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally Available|
|Pricing:|Requires **Azure Defender for Kubernetes**|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||

## Threat detection for Azure Kubernetes Service clusters

[!INCLUDE [AKS in ASC threat protection](../../includes/security-center-azure-kubernetes-threat-protection.md)] 



## Next steps

In this page you learned about the threat protection offered with **Azure Defender for Kubernetes**. For related information, see the following pages:

- Scan your container registries for vulnerabilities with [Azure Defender for container registries](defender-for-container-registries-intro.md)
- 