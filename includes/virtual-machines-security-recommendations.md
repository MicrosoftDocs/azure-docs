---
 title: include file
 description: include file
 services: virtual-machines
 author: barclayn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/19/2019
 ms.author: barclayn
 ms.custom: include file
---

This article contains security recommendations for Azure Virtual Machines. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model and will improve the overall security for your Web App solutions. For more information on what Microsoft does to fulfill service provider responsibilities, read [Shared responsibilities for cloud computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91/file/153019/1/Shared%20responsibilities%20for%20cloud%20computing.pdf).

Some of the recommendations included in this article can be automatically monitored by Azure Security Center. Azure Security Center is the first line of defense in protecting your resources in Azure. It periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to address them.

- For more information on Azure Security Center recommendations, see [Security recommendations in Azure Security Center](../articles/security-center/security-center-recommendations.md).
- For information on Azure Security Center see the [What is Azure Security Center?](../articles/security-center/security-center-intro.md)

## Recommendations

| Category | Recommendation | Comments | Security Center |
|-|-|----|--|
| General | When building custom VM images use the latest updates | Before you create images ensure that all the latest updates are installed for the operating system and all applications that will be part of your image.  | - |
| General | Keep your VMs current | You can use the [Update Management](../articles/automation/automation-update-management.md) solution in Azure Automation to manage operating system updates for your Windows and Linux computers in Azure | [Yes](../articles/security-center/security-center-apply-system-updates.md) |
| General | Back-up your virtual machines | [Azure Backup](../articles/backup/backup-overview.md) helps protect your application data with minimal operating costs. Application errors can corrupt your data, and human errors can introduce bugs into your applications. With Azure Backup, your virtual machines running Windows and Linux are protected. | - |
| General | Use multiple VMs for greater resilience and availability | If your VM runs applications that need to have high availability you should multiple VMs or [availability sets](../articles/virtual-machines/windows/manage-availability.md) | - |
| General | Adopt a business continuity and disaster recovery (BCDR) strategy | Azure Site Recovery allows you to choose from different options designed to support your business continuity needs. It supports different replication and fails over scenarios. For more information, see  [About Site Recovery](../articles/site-recovery/site-recovery-overview.md) | - |
| Identity and access management | Centralize VM authentication | You can centralize the authentication of your Windows and Linux virtual machines using [Azure AD authentication](../articles/active-directory/develop/authentication-scenarios.md). | - |
| Data security | Encrypt operating system disks | [Azure Disk Encryption](../articles/security/azure-security-disk-encryption-overview.md) helps you encrypt your Windows and Linux IaaS virtual machine disks. Encrypting disks make the contents unreadable without the necessary keys. Disk encryption protects stored data from unauthorized access that would otherwise be possible if the disk was copied| [Yes](../articles/security-center/security-center-apply-disk-encryption.md) |
| Data security | Encrypt data disks | [Azure Disk Encryption](../articles/security/azure-security-disk-encryption-overview.md) helps you encrypt your Windows and Linux IaaS virtual machine disks. Encrypting disks make the contents unreadable without the necessary keys. Disk encryption protects stored data from unauthorized access that would otherwise be possible if the disk was copied| -  |
| Data security | Limit installed software | Limiting installed software to what is required to successfully implement your solution helps reduce your solution's attack surface | - |
| Data security | Use antivirus/Antimalware | In Azure you can use antimalware software from security vendors such as Microsoft, Symantec, Trend Micro, and Kaspersky. This software helps protect your virtual machines from malicious files, adware, and other threats. You can deploy Microsoft antimalware protection based on your application workloads, with either basic secure-by-default or advanced custom configuration. For more information on Microsoft Antimalware for Azure, see [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../articles/security/azure-security-antimalware.md) | - |
| Data security | Securely store keys and secrets | Simplifying the management of your secrets and keys by providing your application owners with a secure centrally managed option allows you to reduce the risk of accidental compromise or leaks. Azure Key Vault can securely store your keys in hardware security modules (HSMs) certified to FIPS 140-2 Level 2. If you need to store your keys and secrets using FIPs 140.2 Level 3, you can use [Azure Dedicated HSM](../articles/dedicated-hsm/overview.md) | - |
| Networking | Restrict access to management ports | Attackers scan public cloud IP ranges for open management ports and attempt “easy” attacks like common passwords and known unpatched vulnerabilities. [Just-in-time (JIT) virtual machine (VM) access](../articles/security-center/security-center-just-in-time.md) can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed. | - |
| Networking | Limit network access | Network security groups allow you to restrict network access and control the number of exposed endpoints. For more information, see [Create, change, or delete a network security group](../articles/virtual-network/manage-network-security-group.md) | - |
| Monitoring | Monitor your virtual machines | You can use [Azure monitor for VMs](../articles/azure-monitor/insights/vminsights-overview.md) to monitor the state of your Azure virtual machines and virtual machine scale sets. Performance issues with a VM can lead to service disruption, which violates the security principle of availability. | - |

## Next steps

Check with your application provider to see if there are additional security requirements. For more information on developing secure applications, see [Secure Development Documentation](../articles/security/fundamentals/abstract-develop-secure-apps.md).