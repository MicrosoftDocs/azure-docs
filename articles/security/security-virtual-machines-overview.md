<properties
   pageTitle="Azure Virtual Machines Security Overview | Microsoft Azure"
   description=" Azure Virtual Machines give you the flexibility of virtualization without having to buy and maintain the physical hardware that runs the virtual machine.  This article provides an overview of the core Azure security features that can be used with Azure Virtual Machines. "
   services="security"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="terrylan"/>

# Azure Virtual Machines security overview

Azure Virtual Machines lets you deploy a wide range of computing solutions in an agile way. With support for Microsoft Windows, Linux, Microsoft SQL Server, Oracle, IBM, SAP, and Azure BizTalk Services, you can deploy any workload and any language on nearly any operating system.

An Azure virtual machine gives you the flexibility of virtualization without having to buy and maintain the physical hardware that runs the virtual machine.  You can build and deploy your applications with the assurance that your data is protected and safe in our highly secure datacenters.

With Azure you can build security-enhanced, compliant solutions that:

- Protect your virtual machines from viruses and malware
- Encrypt your sensitive data
- Secure network traffic
- Identify and detect threats
- Meet compliance requirements

The goal of this article is to provide an overview of the core Azure security features that can be used with virtual machines. We also provide links to articles that will give details of each feature so you can learn more.  

The core Azure Virtual Machine security capabilities to be covered in this article:

- Antimalware
- Hardware Security Module
- Virtual machine disk encryption
- Virtual machine backup
- Azure Site Recovery
- Virtual networking
- Security policy management and reporting
- Compliance

## Antimalware

With Azure you can use antimalware software from major security vendors such as Microsoft, Symantec, Trend Micro, McAfee, and Kaspersky to protect your virtual machines from malicious files, adware, and other threats. See the Learn More section below to find articles on partner solutions.

Microsoft Antimalware for Azure Cloud Services and Virtual Machines is a real-time protection capability that helps identify and remove viruses, spyware, and other malicious software.  Microsoft Antimalware provides configurable alerts when known malicious or unwanted software attempts to install itself or run on your Azure systems.

Microsoft Antimalware is a single-agent solution for applications and tenant environments, designed to run in the background without human intervention. You can deploy protection based on the needs of your application workloads, with either basic secure-by-default or advanced custom configuration, including antimalware monitoring.

When you deploy and enable Microsoft Antimalware, the following core features are available:

- Real-time protection - monitors activity in Cloud Services and on Virtual Machines to detect and block malware execution.
- Scheduled scanning - periodically performs targeted scanning to detect malware, including actively running programs.
- Malware remediation - automatically takes action on detected malware, such as deleting or quarantining malicious files and cleaning up malicious registry entries.
- Signature updates - automatically installs the latest protection signatures (virus definitions) to ensure protection is up-to-date on a pre-determined frequency.
- Antimalware Engine updates – automatically updates the Microsoft Antimalware engine.
- Antimalware Platform updates – automatically updates the Microsoft Antimalware platform.
- Active protection - reports telemetry metadata about detected threats and suspicious resources to Azure to ensure rapid response to the evolving threat landscape, as well as enabling real-time synchronous signature delivery through the Microsoft Active Protection System (MAPS).
- Samples reporting - provides and reports samples to the Microsoft Antimalware service to help refine the service and enable troubleshooting.
- Exclusions – allows application and service administrators to configure certain files, processes, and drives to exclude them from protection and scanning for performance and other reasons.
- Antimalware event collection - records the antimalware service health, suspicious activities, and remediation actions taken in the operating system event log and collects them into the customer’s Azure Storage account.

Learn more:
To learn more about antimalware software to protect your virtual machines, Microsoft Antimalware as well as antimalware software from other major security vendors such as Symantec and Trend Micro, see:

- [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../azure-security-antimalware.md)
- [Deploying Antimalware Solutions on Azure Virtual Machines](https://azure.microsoft.com/blog/deploying-antimalware-solutions-on-azure-virtual-machines/)
- [How to install and configure Trend Micro Deep Security as a Service on a Windows VM](../virtual-machines/virtual-machines-windows-classic-install-trend.md)
- [How to install and configure Symantec Endpoint Protection on a Windows VM](../virtual-machines/virtual-machines-windows-classic-install-symantec.md)
- [New Antimalware Options for Protecting Azure Virtual Machines – McAfee Endpoint Protection](https://azure.microsoft.com/blog/new-antimalware-options-for-protecting-azure-virtual-machines/)
- [Security solutions in the Azure Marketplace](https://azure.microsoft.com/marketplace/?term=security)

## Hardware security Module

Encryption and authentication do not improve security unless the keys themselves are well protected. You can simplify the management and security of your critical secrets and keys by storing them in Azure Key Vault. Key Vault provides the option to store your keys in hardware security modules (HSMs) certified to FIPS 140-2 Level 2 standards. Your SQL Server encryption keys for backup or [transparent data encryption](https://msdn.microsoft.com/library/bb934049.aspx) can all be stored in Key Vault with any keys or secrets from your applications. Permissions and access to these protected items are managed through [Azure Active Directory](https://azure.microsoft.com/documentation/services/active-directory/).

Learn more:

- [What is Azure Key Vault?](../key-vault/key-vault-whatis.md)
- [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md)
- [Azure Key Vault blog](https://blogs.technet.microsoft.com/kv/)

## Virtual machine disk encryption

Azure Disk Encryption is a new capability that lets you encrypt your Windows and Linux Azure Virtual Machine disks. Azure Disk Encryption leverages the industry standard [BitLocker](https://technet.microsoft.com/library/cc732774.aspx) feature of Windows and the [dm-crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide volume encryption for the OS and the data disks.

The solution is integrated with Azure Key Vault to help you control and manage the disk encryption keys and secrets in your key vault subscription, while ensuring that all data in the virtual machine disks are encrypted at rest in your Azure storage.

Learn more:

- [Azure Disk Encryption for Windows and Linux IaaS VMs](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0)
- [Azure Disk Encryption for Linux and Windows Virtual Machines](https://blogs.msdn.microsoft.com/azuresecurity/2015/11/16/azure-disk-encryption-for-linux-and-windows-virtual-machines-public-preview-now-available/)
- [Encrypt a virtual machine](../security-center/security-center-disk-encryption.md)

## Virtual machine backup

Azure Backup is a scalable solution that protects your application data with zero capital investment and minimal operating costs. Application errors can corrupt your data, and human errors can introduce bugs into your applications. With Azure Backup, your virtual machines running Windows and Linux are protected.

Learn more:

- [What is Azure Backup?](../backup/backup-introduction-to-azure-backup.md)
- [Azure Backup Learning Path](https://azure.microsoft.com/documentation/learning-paths/backup/)
- [Azure Backup Service - FAQ](../backup/backup-azure-backup-faq.md)

## Azure Site Recovery

An important part of your organization's BCDR strategy is figuring out how to keep corporate workloads and apps up and running when planned and unplanned outages occur. Azure Site Recovery helps do this by orchestrating replication, failover, and recovery of workloads and apps so that they'll be available from a secondary location if your primary location goes down.

Site Recovery:

- **Simplifies your BCDR strategy** — Site Recovery makes it easy to handle replication, failover and recovery of multiple business workloads and apps from a single location. Site recovery orchestrates replication and failover but doesn't intercept your application data or have any information about it.
- **Provides flexible replication** — Using Site Recovery you can replicate workloads running on Hyper-V virtual machines, VMware virtual machines, and Windows/Linux physical servers.
- **Supports failover and recovery** — Site Recovery provides test failovers to support disaster recovery drills without affecting production environments. You can also run planned failovers with a zero-data loss for expected outages, or unplanned failovers with minimal data loss (depending on replication frequency) for unexpected disasters. After failover you can failback to your primary sites. Site Recovery provides recovery plans that can include scripts and Azure automation workbooks so that you can customize failover and recovery of multi-tier applications.
- **Eliminates secondary datacenter** — You can replicate to a secondary on-premises site, or to Azure. Using Azure as a destination for disaster recovery eliminates the cost and complexity maintaining a secondary site, and replicated data is stored in Azure Storage, with all the resilience that provides.
- **Integrates with existing BCDR technologies** — Site Recovery partners with other application BCDR features. For example you can use Site Recovery to protect the SQL Server back end of corporate workloads, including native support for SQL Server AlwaysOn to manage the failover of availability groups.

Learn more:

- [What is Azure Site Recovery?](../site-recovery/site-recovery-overview.md)
- [How Does Azure Site Recovery Work?](../site-recovery/site-recovery-components.md)
- [What Workloads are Protected by Azure Site Recovery?](../site-recovery/site-recovery-workload.md)

## Virtual networking

Virtual machines need network connectivity. To support that requirement, Azure requires virtual machines to be connected to an Azure Virtual Network. An Azure Virtual Network is a logical construct built on top of the physical Azure network fabric. Each logical Azure Virtual Network is isolated from all other Azure Virtual Networks. This helps insure that network traffic in your deployments is not accessible to other Microsoft Azure customers.

Learn more:

- [Azure Network Security Overview](security-network-overview.md)
- [Virtual Network Overview](../virtual-network/virtual-networks-overview.md)
- [Networking features and partnerships for Enterprise scenarios](https://azure.microsoft.com/blog/networking-enterprise/)

## Security policy management and reporting

Azure Security Center helps you prevent, detect, and respond to threats, and provides you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Azure Security Center helps you optimize and monitor virtual machine security by:

- Providing virtual machine [security recommendations](../security-center/security-center-recommendations.md) such as apply system updates, configure ACLs endpoints, enable antimalware, enable network security groups, and apply disk encryption.
- Monitoring the state of your virtual machines

Learn more:

- [Introduction to Azure Security Center](../security-center/security-center-intro.md)
- [Azure Security Center Frequently Asked Questions](../security-center/security-center-faq.md)
- [Azure Security Center Planning and Operations](../security-center/security-center-planning-and-operations-guide.md)

## Compliance

Azure Virtual Machines is certified for FISMA, FedRAMP, HIPAA, PCI DSS Level 1, and other key compliance programs—which makes it easier for your own Azure applications to meet compliance requirements and for your business to address a wide range of domestic and international regulatory requirements.

Learn more:

- [Microsoft Trust Center: Compliance](https://www.microsoft.com/TrustCenter/Compliance/default.aspx)
- [Trusted Cloud: Microsoft Azure Security, Privacy, and Compliance](http://download.microsoft.com/download/1/6/0/160216AA-8445-480B-B60F-5C8EC8067FCA/WindowsAzure-SecurityPrivacyCompliance.pdf)
