---
title: Security best practices for IaaS workloads in Azure | Microsoft Docs
description: " The migration of workloads to Azure IaaS brings opportunities to reevaluate our designs "
services: security
documentationcenter: na
author: terrylanfear
manager: rkarlin

ms.assetid: 02c5b7d2-a77f-4e7f-9a1e-40247c57e7e2
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/29/2023
ms.author: terrylan
---

# Security best practices for IaaS workloads in Azure
This article describes security best practices for VMs and operating systems.

The best practices are based on a consensus of opinion, and they work with current Azure platform capabilities and feature sets. Because opinions and technologies can change over time,  this article will be updated to reflect those changes.

In most infrastructure as a service (IaaS) scenarios, [Azure virtual machines (VMs)](../../virtual-machines/index.yml) are the main workload for organizations that use cloud computing. This fact is evident in [hybrid scenarios](https://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) where organizations want to slowly migrate workloads to the cloud. In such scenarios, follow the [general security considerations for IaaS](https://social.technet.microsoft.com/wiki/contents/articles/3808.security-considerations-for-infrastructure-as-a-service-iaas.aspx), and apply security best practices to all your VMs.

## Protect VMs by using authentication and access control
The first step in protecting your VMs is to ensure that only authorized users can set up new VMs and access VMs.

> [!NOTE]
> To improve the security of Linux VMs on Azure, you can integrate with Azure AD authentication. When you use [Azure AD authentication for Linux VMs](../../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md), you centrally control and enforce policies that allow or deny access to the VMs.
>
>

**Best practice**: Control VM access.
**Detail**: Use [Azure policies](../../governance/policy/overview.md) to establish conventions for resources in your organization and create customized policies. Apply these policies to resources, such as [resource groups](../../azure-resource-manager/management/overview.md). VMs that belong to a resource group inherit its policies.

If your organization has many subscriptions, you might need a way to efficiently manage access, policies, and compliance for those subscriptions. [Azure management groups](../../governance/management-groups/overview.md) provide a level of scope above subscriptions. You organize subscriptions into management groups (containers) and apply your governance conditions to those groups. All subscriptions within a management group automatically inherit the conditions applied to the group. Management groups give you enterprise-grade management at a large scale no matter what type of subscriptions you might have.

**Best practice**: Reduce variability in your setup and deployment of VMs.
**Detail**: Use [Azure Resource Manager](../../azure-resource-manager/templates/syntax.md) templates to strengthen your deployment choices and make it easier to understand and inventory the VMs in your environment.

**Best practice**: Secure privileged access.
**Detail**: Use a [least privilege approach](/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models) and built-in Azure roles to enable users to access and set up VMs:

- [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor): Can manage VMs, but not the virtual network or storage account to which they are connected.
- [Classic Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#classic-virtual-machine-contributor): Can manage VMs created by using the classic deployment model, but not the virtual network or storage account to which the VMs are connected.
- [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin): In Defender for Cloud only: Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations.
- [DevTest Labs User](../../role-based-access-control/built-in-roles.md#devtest-labs-user): Can view everything and connect, start, restart, and shut down VMs.

Your subscription admins and coadmins can change this setting, making them administrators of all the VMs in a subscription. Be sure that you trust all of your subscription admins and coadmins to log in to any of your machines.

> [!NOTE]
> We recommend that you consolidate VMs with the same lifecycle into the same resource group. By using resource groups, you can deploy, monitor, and roll up billing costs for your resources.
>
>

Organizations that control VM access and setup improve their overall VM security.

## Use multiple VMs for better availability
If your VM runs critical applications that need to have high availability, we strongly recommend that you use multiple VMs. For better availability, use an [availability set](../../virtual-machines/availability-set-overview.md) or availability [zones](../../availability-zones/az-overview.md).

An availability set is a logical grouping that you can use in Azure to ensure that the VM resources you place within it are isolated from each other when they're deployed in an Azure datacenter. Azure ensures that the VMs you place in an availability set run across multiple physical servers, compute racks, storage units, and network switches. If a hardware or Azure software failure occurs, only a subset of your VMs are affected, and your overall application continues to be available to your customers. Availability sets are an essential capability when you want to build reliable cloud solutions.

## Protect against malware
You should install antimalware protection to help identify and remove viruses, spyware, and other malicious software. You can install [Microsoft Antimalware](antimalware.md) or a Microsoft partner's endpoint protection solution ([Trend Micro](https://cloudone.trendmicro.com/docs/workload-security/), [Broadcom](https://www.broadcom.com/products), [McAfee](https://www.mcafee.com/us/products.aspx), [Windows Defender](https://www.microsoft.com/windows/comprehensive-security), and [System Center Endpoint Protection](/configmgr/protect/deploy-use/endpoint-protection)).

Microsoft Antimalware includes features like real-time protection, scheduled scanning, malware remediation, signature updates, engine updates, samples reporting, and exclusion event collection. For environments that are hosted separately from your production environment, you can use an antimalware extension to help protect your VMs and cloud services.

You can integrate Microsoft Antimalware and partner solutions with [Microsoft Defender for Cloud](../../security-center/index.yml) for ease of deployment and built-in detections (alerts and incidents).

**Best practice**: Install an antimalware solution to protect against malware.   
**Detail**: [Install a Microsoft partner solution or Microsoft Antimalware](../../security-center/security-center-services.md#supported-endpoint-protection-solutions-)

**Best practice**: Integrate your antimalware solution with Defender for Cloud to monitor the status of your protection.   
**Detail**: [Manage endpoint protection issues with Defender for Cloud](../../security-center/security-center-partner-integration.md)

## Manage your VM updates
Azure VMs, like all on-premises VMs, are meant to be user managed. Azure doesn't push Windows updates to them. You need to manage your VM updates.

**Best practice**: Keep your VMs current.   
**Detail**: Use the [Update Management](../../automation/update-management/overview.md) solution in Azure Automation to manage operating system updates for your Windows and Linux computers that are deployed in Azure, in on-premises environments, or in other cloud providers. You can quickly assess the status of available updates on all agent computers and manage the process of installing required updates for servers.

Computers that are managed by Update Management use the following configurations to perform assessment and update deployments:

- Microsoft Monitoring Agent (MMA) for Windows or Linux
- PowerShell Desired State Configuration (DSC) for Linux
- Automation Hybrid Runbook Worker
- Microsoft Update or Windows Server Update Services (WSUS) for Windows computers

If you use Windows Update, leave the automatic Windows Update setting enabled.

**Best practice**: Ensure at deployment that images you built include the most recent round of Windows updates.   
**Detail**: Check for and install all Windows updates as a first step of every deployment. This measure is especially important to apply when you deploy images that come from either you or your own library. Although images from the Azure Marketplace are updated automatically by default, there can be a lag time (up to a few weeks) after a public release.

**Best practice**: Periodically redeploy your VMs to force a fresh version of the OS.   
**Detail**: Define your VM with an [Azure Resource Manager template](../../azure-resource-manager/templates/syntax.md) so you can easily redeploy it. Using a template gives you a patched and secure VM when you need it.

**Best practice**: Rapidly apply security updates to VMs.   
**Detail**: Enable Microsoft Defender for Cloud (Free tier or Standard tier) to [identify missing security updates and apply them](../../security-center/asset-inventory.md).

**Best practice**: Install the latest security updates.   
**Detail**: Some of the first workloads that customers move to Azure are labs and external-facing systems. If your Azure VMs host applications or services that need to be accessible to the internet, be vigilant about patching. Patch beyond the operating system. Unpatched vulnerabilities on partner applications can also lead to problems that can be avoided if good patch management is in place.

**Best practice**: Deploy and test a backup solution.   
**Detail**: A backup needs to be handled the same way that you handle any other operation. This is true of systems that are part of your production environment extending to the cloud.

Test and dev systems must follow backup strategies that provide restore capabilities that are similar to what users have grown accustomed to, based on their experience with on-premises environments. Production workloads moved to Azure should integrate with existing backup solutions when possible. Or, you can use [Azure Backup](../../backup/backup-azure-vms-first-look-arm.md) to help address your backup requirements.

Organizations that don't enforce software-update policies are more exposed to threats that exploit known, previously fixed vulnerabilities. To comply with industry regulations, companies must prove that they are diligent and using correct security controls to help ensure the security of their workloads located in the cloud.

Software-update best practices for a traditional datacenter and Azure IaaS have many similarities. We recommend that you evaluate your current software update policies to include VMs located in Azure.

## Manage your VM security posture
Cyberthreats are evolving. Safeguarding your VMs requires a monitoring capability that can quickly detect threats, prevent unauthorized access to your resources, trigger alerts, and reduce false positives.

To monitor the security posture of your [Windows](../../security-center/security-center-introduction.md) and [Linux VMs](../../security-center/security-center-introduction.md), use [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md). In Defender for Cloud, safeguard your VMs by taking advantage of the following capabilities:

- Apply OS security settings with recommended configuration rules.
- Identify and download system security and critical updates that might be missing.
- Deploy recommendations for endpoint antimalware protection.
- Validate disk encryption.
- Assess and remediate vulnerabilities.
- Detect threats.

Defender for Cloud can actively monitor for threats, and potential threats are exposed in security alerts. Correlated threats are aggregated in a single view called a security incident.

Defender for Cloud stores data in [Azure Monitor logs](../../azure-monitor/logs/log-query-overview.md). Azure Monitor logs provides a query language and analytics engine that gives you insights into the operation of your applications and resources. Data is also collected from [Azure Monitor](../../batch/monitoring-overview.md), management solutions, and agents installed on virtual machines in the cloud or on-premises. This shared functionality helps you form a complete picture of your environment.

Organizations that don't enforce strong security for their VMs remain unaware of potential attempts by unauthorized users to circumvent security controls.

## Monitor VM performance
Resource abuse can be a problem when VM processes consume more resources than they should. Performance issues with a VM can lead to service disruption, which violates the security principle of availability. This is particularly important for VMs that are hosting IIS or other web servers, because high CPU or memory usage might indicate a denial of service (DoS) attack. It’s imperative to monitor VM access not only reactively while an issue is occurring, but also proactively against baseline performance as measured during normal operation.

We recommend that you use [Azure Monitor](../../azure-monitor/data-platform.md) to gain visibility into your resource’s health. Azure Monitor features:

- [Resource diagnostic log files](../../azure-monitor/essentials/platform-logs-overview.md): Monitors your VM resources and identifies potential issues that might compromise performance and availability.
- [Azure Diagnostics extension](../../azure-monitor/agents/diagnostics-extension-overview.md): Provides monitoring and diagnostics capabilities on Windows VMs. You can enable these capabilities by including the extension as part of the [Azure Resource Manager template](../../virtual-machines/extensions/diagnostics-template.md).

Organizations that don't monitor VM performance can’t determine whether certain changes in performance patterns are normal or abnormal. A VM that’s consuming more resources than normal might indicate an attack from an external resource or a compromised process running in the VM.

## Encrypt your virtual hard disk files
We recommend that you encrypt your virtual hard disks (VHDs) to help protect your boot volume and data volumes at rest in storage, along with your encryption keys and secrets.

[Azure Disk Encryption for Linux VMs](../../virtual-machines/linux/disk-encryption-overview.md) and [Azure Disk Encryption for Windows VMs](../../virtual-machines/linux/disk-encryption-overview.md) helps you encrypt your Linux and Windows IaaS virtual machine disks. Azure Disk Encryption uses the industry-standard [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux and the [BitLocker](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc732774(v=ws.11)) feature of Windows to provide volume encryption for the OS and the data disks. The solution is integrated with [Azure Key Vault](../../key-vault/index.yml) to help you control and manage the disk-encryption keys and secrets in your key vault subscription. The solution also ensures that all data on the virtual machine disks are encrypted at rest in Azure Storage.

Following are best practices for using Azure Disk Encryption:

**Best practice**: Enable encryption on VMs.   
**Detail**: Azure Disk Encryption generates and writes the encryption keys to your key vault. Managing encryption keys in your key vault requires Azure AD authentication. Create an Azure AD application for this purpose. For authentication purposes, you can use either client secret-based authentication or [client certificate-based Azure AD authentication](../../active-directory/authentication/active-directory-certificate-based-authentication-get-started.md).

**Best practice**: Use a key encryption key (KEK) for an additional layer of security for encryption keys. Add a KEK to your key vault.   
**Detail**: Use the [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey) cmdlet to create a key encryption key in the key vault. You can also import a KEK from your on-premises hardware security module (HSM) for key management. For more information, see the [Key Vault documentation](../../key-vault/keys/hsm-protected-keys.md). When a key encryption key is specified, Azure Disk Encryption uses that key to wrap the encryption secrets before writing to Key Vault. Keeping an escrow copy of this key in an on-premises key management HSM offers additional protection against accidental deletion of keys.

**Best practice**: Take a [snapshot](../../virtual-machines/windows/snapshot-copy-managed-disk.md) and/or backup before disks are encrypted. Backups provide a recovery option if an unexpected failure happens during encryption.   
**Detail**: VMs with managed disks require a backup before encryption occurs. After a backup is made, you can use the **Set-AzVMDiskEncryptionExtension** cmdlet to encrypt managed disks by specifying the *-skipVmBackup* parameter. For more information about how to back up and restore encrypted VMs, see the [Azure Backup](../../backup/backup-azure-vms-encryption.md) article.

**Best practice**: To make sure the encryption secrets don’t cross regional boundaries, Azure Disk Encryption needs the key vault and the VMs to be located in the same region.   
**Detail**: Create and use a key vault that is in the same region as the VM to be encrypted.

When you apply Azure Disk Encryption, you can satisfy the following business needs:

- IaaS VMs are secured at rest through industry-standard encryption technology to address organizational security and compliance requirements.
- IaaS VMs start under customer-controlled keys and policies, and you can audit their usage in your key vault.

## Restrict direct internet connectivity
Monitor and restrict VM direct internet connectivity. Attackers constantly scan public cloud IP ranges for open management ports and attempt “easy” attacks like common passwords and known unpatched vulnerabilities. The following table lists best practices to help protect against these attacks:

**Best practice**: Prevent inadvertent exposure to network routing and security.   
**Detail**: Use Azure RBAC to ensure that only the central networking group has permission to networking resources.

**Best practice**: Identify and remediate exposed VMs that allow access from “any” source IP address.   
**Detail**: Use Microsoft Defender for Cloud. Defender for Cloud will recommend that you restrict access through internet-facing endpoints if any of your network security groups has one or more inbound rules that allow access from “any” source IP address. Defender for Cloud will recommend that you edit these inbound rules to [restrict access](../../security-center/security-center-network-recommendations.md) to source IP addresses that actually need access.

**Best practice**: Restrict management ports (RDP, SSH).   
**Detail**: [Just-in-time (JIT) VM access](../../security-center/security-center-just-in-time.md) can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed. When JIT is enabled, Defender for Cloud locks down inbound traffic to your Azure VMs by creating a network security group rule. You select the ports on the VM to which inbound traffic will be locked down. These ports are controlled by the JIT solution.

## Next steps
See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.

The following resources are available to provide more general information about Azure security and related Microsoft services:
* [Azure Security Team Blog](/archive/blogs/azuresecurity/) - for up to date information on the latest in Azure Security
* [Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to secure@microsoft.com