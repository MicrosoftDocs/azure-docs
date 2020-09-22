---
title: Azure Security Center and Azure Kubernetes Service
description: "Learn about Azure Security Center's integration with Azure Kubernetes Services"
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin

---

# Azure Kubernetes Services integration with Security Center

Azure Kubernetes Service (AKS) is Microsoft's managed service for developing, deploying, and managing containerized applications. 

Enable Azure **Defender for Kubernetes** to gain deeper visibility to your AKS nodes, cloud traffic, and security controls.

Together, Security Center and AKS form the best cloud-native Kubernetes security offering.

## What are the components of Security Center's Kubernetes protection?

Security Center's protections for Kubernetes are provided by a combination of two elements:

- **Azure Security Center's threat protection for virtual machines** - Using the same Log Analytics agent that Security Center uses on other VMs, Security Center can show you security issues occurring on your AKS nodes. The agent also monitors for container-specific analytics.

- **Azure Security Center's optional Azure Defender for Kubernetes plan** - The Kubernetes plan receives logs and information from the Kubernetes subsystem via the AKS service. These logs are already available in Azure through the AKS service. When you enable Azure Defender for Kubernetes, you grant Security Center access to the logs. So Security Center brings security benefits to your AKS clusters using data already gathered by the AKS master node. Some of the data scanned by Azure Security Center from your Kubernetes environment may contain sensitive information.


## Next steps

To learn more about Security Center's container security features, see:

* [Azure Security Center and container security](container-security.md)

* [Integration with Azure Container Registry](azure-container-registry-integration.md)

* [Data management at Microsoft](https://www.microsoft.com/trust-center/privacy/data-management) - Describes the data policies of Microsoft services (including Azure, Intune, and Microsoft 365), details of Microsoft's data management, and the retention policies that affect your data
