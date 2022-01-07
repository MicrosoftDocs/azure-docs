---
title: Concepts - Security recommendations for Azure VMware Solution
Description: Learn about tips and best practices to help protect Azure VMware Solution deployments from vulnerabilities and malicious actors. 
ms.topic: conceptual
ms.date: 01/10/2022
---


# Security recommendations for Azure VMware Solution

It's important that proper measures are taken to secure your Azure VMware Solution deployments. Use this information as a high-level guide to achieve your security goals.

## General

Use the following guidelines and links for general security recommendations for both Azure VMware Solution and VMware best practices.

| **Recommendation** | **Comments** |
| :-- | :-- |
| Review and follow VMware Security Best Practices. | It's important to stay updated on Azure security practices as well as [VMware Security Best Practices](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-412EF981-D4F1-430B-9D09-A4679C2D04E7.html). |
| Keep up to date on VMware Security Advisories. | Subscribe to VMware notifications in my.vmware.com and regularly review and remediate any [VMware Security Advisories](https://www.vmware.com/security/advisories.html). |
| Enable Microsoft Defender for Cloud. | [Microsoft Defender for Cloud](https://docs.microsoft.com/azure/defender-for-cloud/) provides unified security management and advanced threat protection across hybrid cloud workloads. |
| Follow the Microsoft Security Response Center blog. | [Microsoft Security Response Center](https://msrc-blog.microsoft.com/) |
| Review and implement recommendations within the Azure Security Baseline for Azure VMware Solution. | [Azure security baseline for VMware Solution](https://docs.microsoft.com/security/benchmark/azure/baselines/vmware-solution-security-baseline) |


## Network

The following are network related security recommendations for Azure VMware Solution.

| **Recommendation** | **Comments** |
| :-- | :-- |
| Only allow trusted networks. | Only allow access to your environments over ExpressRoute or other secured networks. Avoid exposing your management services, like vCenter for example, on the internet. |
| 