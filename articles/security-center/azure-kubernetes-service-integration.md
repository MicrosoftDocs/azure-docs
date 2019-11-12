---
title: Azure Security Center and Azure Kubernetes Service | Microsoft Docs
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
ms.date: 11/04/2019
ms.author: memildin

---

# Azure Kubernetes Services integration with Security Center (Preview)
Azure Kubernetes Service (AKS) is Microsoft’s managed service for developing, deploying, and managing containerized applications. 

Use AKS together with Azure Security Center's standard tier (see [pricing](security-center-pricing.md)) to gain deeper visibility to your AKS nodes, cloud traffic, and security controls.

Security Center brings security benefits to your AKS clusters using  data already gathered by the AKS master node. 

![Azure Security Center and Azure Kubernetes Service (AKS) high-level overview](./media/azure-kubernetes-service-integration/aks-asc-integration-overview.png)

Together, these two tools form the best cloud-native Kubernetes security offering. 

## Benefits of integration

Using the two services together provides:

* **Security recommendations** - Security Center identifies your AKS resources and categorizes them: from clusters to individual virtual machines. You can then view security recommendations per resource. For more information, see [How to implement security recommendations](security-center-recommendations.md). 

    > [!NOTE]
    > If the name of a Security Center recommendation ends with a "(Preview)" tag, it's referring to the preview nature of the recommendation; not the feature.

* **Environment hardening** - Security Center constantly monitors the configuration of your Kubernetes clusters, and generates security recommendations that reflect industry standards.

* **Run-time protection** - Through continuous analysis of the following AKS sources, Security Center alerts you to threats and malicious activity detected at the host *and* AKS cluster level (for more information, see [Azure container service](https://docs.microsoft.com/azure/security-center/security-center-alerts-compute#azure-container-service-)):
    * Raw security events, such as network data and process creation
    * The Kubernetes audit log

![Azure Security Center and Azure Kubernetes Service (AKS) in more detail](./media/azure-kubernetes-service-integration/aks-asc-integration-detailed.png)

> [!NOTE]
> Some of the data scanned by Azure Security Center from your Kubernetes environment may contain sensitive information.

## Next steps

To learn more about Security Center's container security features, see:

* [Azure Security Center and container security](container-security.md)

* [Integration with Azure Container Registry](azure-container-registry-integration.md)

* [Virtual Machine protection](security-center-virtual-machine-protection.md) - Describes Security Center's recommendations

* [Data management at Microsoft](https://www.microsoft.com/trust-center/privacy/data-management) - Describes the data policies of Microsoft services (including Azure, Intune, and Office 365), details of Microsoft’s data management, and the retention policies that affect your data