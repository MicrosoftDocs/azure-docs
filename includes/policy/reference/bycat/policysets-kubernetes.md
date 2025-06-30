---
ms.service: azure-policy
ms.topic: include
ms.date: 06/23/2025
ms.author: jasongroce
author: jasongroce
ms.custom: generated
---

|Name |Description |Policies |Version |
|---|---|---|---|
|[\[Preview\]: Use Image Integrity to ensure only trusted images are deployed](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/AKS_ImageIntegrity.json) |Use Image Integrity to ensure AKS clusters deploy only trusted images by enabling the Image Integrity and Azure Policy Add-Ons on AKS clusters. Image Integrity Add-On and Azure Policy Add-On are both pre-requisites to using Image Integrity to verify if image is signed upon deployment. For more info, visit [https://aka.ms/aks/image-integrity](https://aka.ms/aks/image-integrity). |3 |1.1.0-preview |
|[\[Preview\]: Deployment safeguards should help guide developers towards AKS recommended best practices](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/AKS_Safeguards.json) |A collection of Kubernetes best practices that are recommended by Azure Kubernetes Service (AKS). For the best experience, use deployment safeguards to assign this policy initiative: [https://aka.ms/aks/deployment-safeguards](https://aka.ms/aks/deployment-safeguards). Azure Policy Add-On for AKS is a pre-requisite for applying these best practices to your clusters. For instructions on enabling the Azure Policy Add-On, go to aka.ms/akspolicydoc |21 |2.0.0-preview |
|[\[Preview\]: Kubernetes cluster should follow the security control recommendations of Center for Internet Security (CIS) Kubernetes benchmark](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/AKS_CISBenchmark.json) |This initiative includes the policies for the security recommendation for Center for Internet Security (CIS) Kubernetes benchmark, you can use this initiative to stay compliant with CIS Kubernetes benchmark. For more information of CIS compliance, visit: [https://aka.ms/aks/cis-kubernetes](https://aka.ms/aks/cis-kubernetes) |7 |1.0.0-preview |
|[Kubernetes cluster pod security baseline standards for Linux-based workloads](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/PSPBaselineStandard.json) |This initiative includes the policies for the Kubernetes cluster pod security baseline standards. This policy is generally available for Kubernetes Service (AKS), and preview for Azure Arc enabled Kubernetes. For instructions on using this policy, visit [https://aka.ms/kubepolicydoc](https://aka.ms/kubepolicydoc). |5 |1.4.0 |
|[Kubernetes cluster pod security restricted standards for Linux-based workloads](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/PSPRestrictedStandard.json) |This initiative includes the policies for the Kubernetes cluster pod security restricted standards. This policy is generally available for Kubernetes Service (AKS), and preview for Azure Arc enabled Kubernetes. For instructions on using this policy, visit [https://aka.ms/kubepolicydoc](https://aka.ms/kubepolicydoc). |8 |2.5.0 |
