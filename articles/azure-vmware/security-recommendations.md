---
title: Security recommendations for Azure VMware Solution
description: Learn about tips and best practices to help protect Azure VMware Solution deployments from vulnerabilities and malicious actors. 
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 01/08/2025
ms.custom: engagement-fy23
---


# Security recommendations for Azure VMware Solution

It's important to take proper measures to secure your Azure VMware Solution deployments. Use the information in this article as a high-level guide to achieve your security goals.

## General

Use the following guidelines and links for general security recommendations for both Azure VMware Solution and VMware best practices.

| Recommendation | Comments |
| :-- | :-- |
| Review and follow VMware Security Best Practices. | It's important to stay updated on Azure security practices and [VMware Security Best Practices](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security-8-0/security-in-the-vsphere-environment/security-best-practices-and-resources.html). |
| Keep up to date on VMware Security Advisories. | Subscribe to VMware notifications in `my.vmware.com`. Regularly review and remediate any [VMware Security Advisories](https://support.broadcom.com/web/ecx/security-advisory?). |
| Enable Microsoft Defender for Cloud. | [Microsoft Defender for Cloud](/azure/defender-for-cloud/) provides unified security management and advanced threat protection across hybrid cloud workloads. |
| Follow the Microsoft Security Response Center blog. | [Microsoft Security Response Center](https://msrc-blog.microsoft.com/) |
| Review and implement recommendations within the Azure security baseline for Azure VMware Solution. | [Azure security baseline for VMware Solution](/security/benchmark/azure/baselines/vmware-solution-security-baseline/) |

## Network

The following recommendations for network-related security apply to Azure VMware Solution.

| Recommendation | Comments |
| :-- | :-- |
| Only allow trusted networks. | Only allow access to your environments over Azure ExpressRoute or other secured networks. Avoid exposing your management services like vCenter Server, for example, on the internet. |
| Use Azure Firewall Premium. | If you must expose management services on the internet, use [Azure Firewall Premium](../firewall/premium-migrate.md) with both intrusion detection and detention system (IDPS) Alert and Deny mode along with Transport Layer Security (TLS) inspection for proactive threat detection. |
| Deploy and configure network security groups on a virtual network. | Ensure that any deployed virtual network has [network security groups](../virtual-network/network-security-groups-overview.md) configured to control ingress and egress to your environment. |
| Review and implement recommendations within the Azure security baseline for Azure VMware Solution. | [Azure security baseline for Azure VMware Solution](/security/benchmark/azure/baselines/vmware-solution-security-baseline/) |

## VMware HCX

See the following information for recommendations to secure your VMware HCX deployment.

| Recommendation | Comments |
| :-- | :-- |
| Stay current with VMware HCX service updates. | VMware HCX service updates can include new features, software fixes, and security patches. To apply service updates during a maintenance window where no new VMware HCX operations are queued up, follow [these steps](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-9/vmware-hcx-user-guide-4-9/updating-vmware-hcx/planning-for-hcx-updates.html). |
