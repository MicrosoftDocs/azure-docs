---
title: Security features used with Azure VMs
titleSuffix: Azure security
description: This article provides an overview of the core Azure security features that can be used with Azure Virtual Machines.
services: security
author: msmbaldwin
manager: rkarlin

ms.assetid: 467b2c83-0352-4e9d-9788-c77fb400fe54
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 06/27/2024
ms.author: mbaldwin

---
# Azure Virtual Machines security overview
This article provides an overview of the core Azure security features that can be used with virtual machines.

You can use Azure Virtual Machines to deploy a wide range of computing solutions in an agile way. The service supports Microsoft Windows, Linux, Microsoft SQL Server, Oracle, IBM, SAP, and Azure BizTalk Services. So you can deploy any workload and any language on nearly any operating system.

An Azure virtual machine gives you the flexibility of virtualization without having to buy and maintain the physical hardware that runs the virtual machine. You can build and deploy your applications with the assurance that your data is protected and safe in highly secure datacenters.

With Azure, you can build security-enhanced, compliant solutions that:

* Protect your virtual machines from viruses and malware.
* Encrypt your sensitive data.
* Secure network traffic.
* Identify and detect threats.
* Meet compliance requirements.  

## Antimalware

With Azure, you can use antimalware software from security vendors such as Microsoft, Symantec, Trend Micro, and Kaspersky. This software helps protect your virtual machines from malicious files, adware, and other threats.

Microsoft Antimalware for Azure Cloud Services and Virtual Machines is a real-time protection capability that helps identify and remove viruses, spyware, and other malicious software.  Microsoft Antimalware for Azure provides configurable alerts when known malicious or unwanted software attempts to install itself or run on your Azure systems.

Microsoft Antimalware for Azure is a single-agent solution for applications and tenant environments. It's designed to run in the background without human intervention. You can deploy protection based on the needs of your application workloads, with either basic secure-by-default or advanced custom configuration, including antimalware monitoring.

Learn more about [Microsoft Antimalware for Azure](antimalware.md) and the core features available.

Learn more about antimalware software to help protect your virtual machines:

* [Deploying Antimalware Solutions on Azure Virtual Machines](https://azure.microsoft.com/blog/deploying-antimalware-solutions-on-azure-virtual-machines/)
* [How to install and configure Trend Micro Deep Security as a service on a Windows VM](/previous-versions/azure/virtual-machines/extensions/trend)
* [Security solutions in the Azure Marketplace](https://azure.microsoft.com/marketplace/?term=security)

For even more powerful protection, consider using [Microsoft Defender for Endpoint](/mem/configmgr/protect/deploy-use/defender-advanced-threat-protection). With Defender for Endpoint, you get:

* [Attack surface reduction](/windows/security/threat-protection/windows-defender-atp/overview-attack-surface-reduction)  
* [Next generation protection](/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-in-windows-10)  
* [Endpoint protection and response](/windows/security/threat-protection/windows-defender-atp/overview-endpoint-detection-response)
* [Automated investigation and remediation](/windows/security/threat-protection/windows-defender-atp/automated-investigations-windows-defender-advanced-threat-protection)
* [Secure score](/windows/security/threat-protection/microsoft-defender-atp/tvm-microsoft-secure-score-devices)
* [Advanced hunting](/windows/security/threat-protection/windows-defender-atp/overview-hunting-windows-defender-advanced-threat-protection)
* [Management and APIs](/windows/security/threat-protection/windows-defender-atp/management-apis)
* [Microsoft Threat Protection](/windows/security/threat-protection/windows-defender-atp/threat-protection-integration)

Learn more: [Get Started with Microsoft Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection)  

## Hardware security module

Improving key security can enhance encryption and authentication protections. You can simplify the management and security of your critical secrets and keys by storing them in Azure Key Vault.

Key Vault provides the option to store your keys in hardware security modules (HSMs) certified to [FIPS 140 validated](/azure/key-vault/keys/about-keys#compliance) standards. Your SQL Server encryption keys for backup or [transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption) can all be stored in Key Vault with any keys or secrets from your applications. Permissions and access to these protected items are managed through [Microsoft Entra ID](../../active-directory/index.yml).

Learn more:

* [What is Azure Key Vault?](/azure/key-vault/general/overview)
* [Azure Key Vault blog](/archive/blogs/kv/)

## Virtual machine disk encryption

Azure Disk Encryption is a new capability for encrypting your Windows and Linux virtual machine disks. Azure Disk Encryption uses the industry-standard [BitLocker](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc732774(v=ws.11)) feature of Windows and the [dm-crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide volume encryption for the OS and the data disks.

The solution is integrated with Azure Key Vault to help you control and manage the disk encryption keys and secrets in your key vault subscription. It ensures that all data in the virtual machine disks are encrypted at rest in Azure Storage.

Learn more:

* [Azure Disk Encryption for Linux VMs](/azure/virtual-machines/linux/disk-encryption-overview) and [Azure Disk Encryption for Windows VMs](/azure/virtual-machines/windows/disk-encryption-overview)
* [Quickstart: Encrypt a Linux IaaS VM with Azure PowerShell](/azure/virtual-machines/linux/disk-encryption-powershell-quickstart)

## Virtual machine backup

Azure Backup is a scalable solution that helps protect your application data with zero capital investment and minimal operating costs. Application errors can corrupt your data, and human errors can introduce bugs into your applications. With Azure Backup, your virtual machines running Windows and Linux are protected.

Learn more:

* [What is Azure Backup?](../../backup/backup-overview.md)
* [Azure Backup service FAQ](../../backup/backup-azure-backup-faq.yml)

## Azure Site Recovery

An important part of your organization's BCDR strategy is figuring out how to keep corporate workloads and apps running when planned and unplanned outages occur. Azure Site Recovery helps orchestrate replication, failover, and recovery of workloads and apps so that they're available from a secondary location if your primary location goes down.

Site Recovery:

* **Simplifies your BCDR strategy**: Site Recovery makes it easy to handle replication, failover, and recovery of multiple business workloads and apps from a single location. Site Recovery orchestrates replication and failover but doesn't intercept your application data or have any information about it.
* **Provides flexible replication**: By using Site Recovery, you can replicate workloads running on Hyper-V virtual machines, VMware virtual machines, and Windows/Linux physical servers.
* **Supports failover and recovery**: Site Recovery provides test failovers to support disaster recovery drills without affecting production environments. You can also run planned failovers with a zero-data loss for expected outages, or unplanned failovers with minimal data loss (depending on replication frequency) for unexpected disasters. After failover, you can fail back to your primary sites. Site Recovery provides recovery plans that can include scripts and Azure Automation workbooks so that you can customize failover and recovery of multi-tier applications.
* **Eliminates secondary datacenters**: You can replicate to a secondary on-premises site, or to Azure. Using Azure as a destination for disaster recovery eliminates the cost and complexity of maintaining a secondary site. Replicated data is stored in Azure Storage.
* **Integrates with existing BCDR technologies**: Site Recovery partners with other applications' BCDR features. For example, you can use Site Recovery to help protect the SQL Server back end of corporate workloads. This includes native support for SQL Server Always On to manage the failover of availability groups.

Learn more:

* [What is Azure Site Recovery?](../../site-recovery/site-recovery-overview.md)
* [How does Azure Site Recovery work?](../../site-recovery/azure-to-azure-architecture.md)
* [What workloads are protected by Azure Site Recovery?](../../site-recovery/site-recovery-workload.md)

## Virtual networking

Virtual machines need network connectivity. To support that requirement, Azure requires virtual machines to be connected to an Azure virtual network.

An Azure virtual network is a logical construct built on top of the physical Azure network fabric. Each logical Azure virtual network is isolated from all other Azure virtual networks. This isolation helps ensure that network traffic in your deployments is not accessible to other Microsoft Azure customers.

Learn more:

* [Azure network security overview](network-overview.md)
* [Virtual Network overview](../../virtual-network/virtual-networks-overview.md)
* [Networking features and partnerships for enterprise scenarios](https://azure.microsoft.com/blog/networking-enterprise/)

## Security policy management and reporting

Microsoft Defender for Cloud helps you prevent, detect, and respond to threats. Defender for Cloud gives you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions. It helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Defender for Cloud helps you optimize and monitor the security of your virtual machines by:

* Providing [security recommendations](../../security-center/security-center-recommendations.md) for the virtual machines. Example recommendations include: apply system updates, configure ACLs endpoints, enable antimalware, enable network security groups, and apply disk encryption.
* Monitoring the state of your virtual machines.

Learn more:

* [Introduction to Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)
* [Microsoft Defender for Cloud frequently asked questions](../../security-center/faq-general.yml)
* [Microsoft Defender for Cloud planning and operations](/azure/defender-for-cloud/defender-for-cloud-planning-and-operations-guide)

## Compliance

Azure Virtual Machines is certified for FISMA, FedRAMP, HIPAA, PCI DSS Level 1, and other key compliance programs. This certification makes it easier for your own Azure applications to meet compliance requirements and for your business to address a wide range of domestic and international regulatory requirements.

Learn more:

* [Microsoft Trust Center: Compliance](https://www.microsoft.com/en-us/trustcenter/compliance)
* [Trusted Cloud: Microsoft Azure Security, Privacy, and Compliance](https://download.microsoft.com/download/1/6/0/160216AA-8445-480B-B60F-5C8EC8067FCA/WindowsAzure-SecurityPrivacyCompliance.pdf)

## Confidential Computing

While confidential computing is not technically part of virtual machine security, the topic of virtual machine security belongs to the higher-level subject of "compute" security. Confidential computing belongs within the category of "compute" security.

Confidential computing ensures that when data is "in the clear," which is required for efficient processing, the data is protected inside a Trusted Execution Environment  https://en.wikipedia.org/wiki/Trusted_execution_environment (TEE - also known as an enclave), an example of which is shown in the figure below.  

TEEs ensure there is no way to view data or the operations inside from the outside, even with a debugger. They even ensure that only authorized code is permitted to access data. If the code is altered or tampered, the operations are denied and the environment disabled. The TEE enforces these protections throughout the execution of code within it.

Learn more:

* [Introducing Azure confidential computing](https://azure.microsoft.com/blog/introducing-azure-confidential-computing/)  
* [Azure confidential computing](https://azure.microsoft.com/blog/azure-confidential-computing/)  

## Next steps

Learn about [security best practices](iaas.md) for VMs and operating systems.
