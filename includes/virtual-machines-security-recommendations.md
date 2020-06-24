---
 title: include file
 description: include file
 services: virtual-machines
 author: msmbaldwin
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/13/2019
 ms.author: mbaldwin
 ms.custom: include file
---

This article contains security recommendations for Azure Virtual Machines. Follow these recommendations to help fulfill the security obligations described in our model for shared responsibility. The recommendations will also help you improve overall security for your web app solutions. For more information about what Microsoft does to fulfill service-provider responsibilities, see [Shared responsibilities for cloud computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91).

Some of this article's recommendations can be automatically addressed by Azure Security Center. Azure Security Center is the first line of defense for your resources in Azure. It periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then recommends how to address the vulnerabilities. For more information, see [Security recommendations in Azure Security Center](../articles/security-center/security-center-recommendations.md).

For general information about Azure Security Center, see [What is Azure Security Center?](../articles/security-center/security-center-intro.md).

## General

| Recommendation | Comments | Security Center |
|-|----|--|
| When you build custom VM images, apply the latest updates. | Before you create images, install the latest updates for the operating system and for all applications that will be part of your image.  | - |
| Keep your VMs current. | You can use the [Update Management](../articles/automation/automation-update-management.md) solution in Azure Automation to manage operating system updates for your Windows and Linux computers in Azure. | [Yes](../articles/security-center/security-center-apply-system-updates.md) |
| Back up your VMs. | [Azure Backup](../articles/backup/backup-overview.md) helps protect your application data and has minimal operating costs. Application errors can corrupt your data, and human errors can introduce bugs into your applications. Azure Backup protects your VMs that run Windows and Linux. | - |
| Use multiple VMs for greater resilience and availability. | If your VM runs applications that must be highly available, use multiple VMs or [availability sets](../articles/virtual-machines/windows/manage-availability.md). | - |
| Adopt a business continuity and disaster recovery (BCDR) strategy. | Azure Site Recovery allows you to choose from different options designed to support business continuity. It supports different replication and failover scenarios. For more information, see  [About Site Recovery](../articles/site-recovery/site-recovery-overview.md). | - |

## Data security

| Recommendation | Comments | Security Center |
|-|----|--|
| Encrypt operating system disks. | [Azure Disk Encryption](../articles/security/azure-security-disk-encryption-overview.md) helps you encrypt your Windows and Linux IaaS VM disks. Without the necessary keys, the contents of encrypted disks are unreadable. Disk encryption protects stored data from unauthorized access that would otherwise be possible if the disk were copied.| [Yes](../articles/security-center/security-center-apply-disk-encryption.md) |
| Encrypt data disks. | [Azure Disk Encryption](../articles/security/azure-security-disk-encryption-overview.md) helps you encrypt your Windows and Linux IaaS VM disks. Without the necessary keys, the contents of encrypted disks are unreadable. Disk encryption protects stored data from unauthorized access that would otherwise be possible if the disk were copied.| -  |
| Limit installed software. | Limit installed software to what is required to successfully apply your solution. This guideline helps reduce your solution's attack surface. | - |
| Use antivirus or antimalware. | In Azure, you can use antimalware software from security vendors such as Microsoft, Symantec, Trend Micro, and Kaspersky. This software helps protect your VMs from malicious files, adware, and other threats. You can deploy Microsoft Antimalware based on your application workloads. Use either basic secure-by-default or advanced custom configuration. For more information, see [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../articles/security/azure-security-antimalware.md). | - |
| Securely store keys and secrets. | Simplify the management of your secrets and keys by providing your application owners with a secure, centrally managed option. This management reduces the risk of an accidental compromise or leak. Azure Key Vault can securely store your keys in hardware security modules (HSMs) that are certified to FIPS 140-2 Level 2. If you need to use FIPs 140.2 Level 3 to store your keys and secrets, you can use [Azure Dedicated HSM](../articles/dedicated-hsm/overview.md). | - |

## Identity and access management 

| Recommendation | Comments | Security Center |
|-|----|--|
| Centralize VM authentication. | You can centralize the authentication of your Windows and Linux VMs by using [Azure Active Directory authentication](../articles/active-directory/develop/authentication-scenarios.md). | - |

## Monitoring

| Recommendation | Comments | Security Center |
|-|----|--|
| Monitor your VMs. | You can use [Azure Monitor for VMs](../articles/azure-monitor/insights/vminsights-overview.md) to monitor the state of your Azure VMs and virtual machine scale sets. Performance issues with a VM can lead to service disruption, which violates the security principle of availability. | - |

## Networking

| Recommendation | Comments | Security Center |
|-|----|--|
| Restrict access to management ports. | Attackers scan public cloud IP ranges for open management ports and attempt "easy" attacks like common passwords and known unpatched vulnerabilities. You can use [just-in-time (JIT) VM access](../articles/security-center/security-center-just-in-time.md) to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy connections to VMs when they're needed. | - |
| Limit network access. | Network security groups allow you to restrict network access and control the number of exposed endpoints. For more information, see [Create, change, or delete a network security group](../articles/virtual-network/manage-network-security-group.md). | - |

## Next steps

Check with your application provider to learn about additional security requirements. For more information about developing secure applications, see [Secure-development documentation](../articles/security/fundamentals/abstract-develop-secure-apps.md).
