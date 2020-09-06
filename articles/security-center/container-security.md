---
title: Container Security in Azure Security Center | Microsoft Docs
description: "Learn about Azure Security Center's container security features."
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2020
ms.author: memildin

---

# Container security in Security Center

Azure Security Center is the Azure-native solution for securing your containers. Security Center can protect the following container resource types:



|Resource |Name  |Details  |
|:---------:|---------|---------|
|![Container host](./media/security-center-virtual-machine-recommendations/icon-container-host-rec.png)|Container hosts (virtual machines that are running Docker)|Security Center scans your Docker configurations and gives you visibility into misconfigurations by providing a list of all failed rules that were assessed. Security Center provides guidelines to help you resolve these issues quickly and save time. Security Center continuously assesses the Docker configurations and provides you with their latest state.|
|![Kubernetes service](./media/security-center-virtual-machine-recommendations/icon-kubernetes-service-rec.png)|Azure Kubernetes Service (AKS) clusters|Gain deeper visibility to your AKS nodes, cloud traffic, and security controls with [Security Center's optional AKS bundle](azure-kubernetes-service-integration.md) for standard tier users.|
|![Container registry](./media/security-center-virtual-machine-recommendations/icon-container-registry-rec.png)|Azure Container Registry (ACR) registries|Gain deeper visibility into the vulnerabilities of the images in your ARM-based ACR registries with [Security Center's optional ACR bundle](azure-kubernetes-service-integration.md) for standard tier users.|
||||


This article describes how you can use these bundles to improve, monitor, and maintain the security of your containers and their apps. You'll learn how Security Center helps with these core aspects of container security:

- [Vulnerability management - scanning container images](#vulnerability-management---scanning-container-images)
- [Environment hardening - continuous monitoring of your Docker configuration and Kubernetes clusters](#environment-hardening)
- [Run-time protection - Real-time threat detection](#run-time-protection---real-time-threat-detection)


For instructions on how to use these features, see [Monitoring the security of your containers](monitor-container-security.md).




## Next steps

In this overview, you learned about the core elements of container security in Azure Security Center. Continue to [how to monitor the security of your containers](monitor-container-security.md).
> [!div class="nextstepaction"]
> [Monitoring the security of your containers](monitor-container-security.md)