---
title: Secure Azure Infrastructure for SAP Applications
description: This article provides a link collection and guidance about secure Azure infrastructure for SAP applications.
services: virtual-machines-windows,virtual-network,storage
author: cgardin
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: concept-article
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.date: 10/07/2025
ms.author: cgardin
# Customer intent: Secure Azure infrastructure for SAP applications
---

# Secure Azure infrastructure for SAP applications

A well-secured SAP solution incorporates many security concepts with many layers that span multiple domains:

- Identity management, provisioning and single sign-on (SSO), multifactor authentication (MFA), Global Secure Access, and secure network connection
- Auditing, log analytics, and event management
- Security Information and Event Management (SIEM) and Security Orchestration, Automation, and Response (SOAR) solutions
- Antivirus and anti-malware endpoint protection
- Encryption and key management
- Operating system hardening
- Azure infrastructure hardening

SAP applications should be incorporated into the overall Zero Trust security solution for the entire IT landscape. For more information, see the [Microsoft Security page about Zero Trust strategy and architecture](https://www.microsoft.com/security/business/zero-trust?msockid=343d619786f36e041990740887e36ff0).

The SAP security solution should reference the Zero Trust security model. A Zero Trust security solution validates each action at each layer, such as identity, endpoint network access, authentication, and MFA, through SAP application and data access.

:::image type="content" source="media/sap-security-instructure/microsoft-zero-trust-security-diagram.png" border="false" alt-text="Diagram of Microsoft Zero Trust design." lightbox="media/sap-security-instructure/microsoft-zero-trust-security-diagram.png":::

The purpose of this article is to provide links and brief descriptions on how to implement identity, security, and audit-related features for SAP solutions running on the Azure Hyperscale service tier. This article doesn't specify which security features you should implement, because requirements depend on risk profile, industry, and regulatory environment. This article does make some general recommendations, such as using Microsoft Defender for Endpoint, transparent data encryption (TDE), and backup encryption on all systems.

If you're designing and implementing identity, security, and audit solutions for SAP, review the concepts in [Introduction to the Microsoft cloud security benchmark](/security/benchmark/azure/introduction). You can find more checklists in [Secure overview (Cloud Adoption Framework)](/azure/cloud-adoption-framework/secure/overview#cloud-security-checklist).

## Deployment checklist

The design and implementation of a comprehensive security solution for SAP applications running on Azure is a consulting project.

This article provides a basic deployment pattern that covers a minimum security configuration and a more secure configuration. Organizations that require high security solutions should seek expert consulting advice. Highly secured SAP landscapes might increase operational complexity. They also might make tasks such as system refreshes, upgrades, remote access for support, debugging, and testing for high availability and disaster recovery difficult or complex.

### Minimum: Security deployment checklist

- Defender for Endpoint is active in real-time mode on all endpoints (SAP and non-SAP). Unprotected endpoints are a gateway that an attacker can use to compromise protected endpoints.
- Defender XDR rules are in place for alerting on (and on Windows, blocking) high-risk executable files.
- Microsoft Sentinel for SAP or another SIEM/SOAR solution is in place.
- All database management systems (DBMSs) are protected with TDE. Keys are stored in Azure Key Vault or hardware security modules (HSMs), if your environment supports them.
- Operating system, DBMS, and other passwords are stored in Key Vault.
- Linux sign-in has passwords disabled. Users can sign in only by using keys.
- All virtual machines (VMs) are generation 2 with Trusted Launch enabled.
- Storage accounts use platform-managed keys (PMKs).
- VM, HANA, SQL, and Oracle backups go to an Azure Backup vault with immutable storage.

### More secure: Security deployment checklist

- Defender for Endpoint is active in real-time mode on all endpoints (SAP and non-SAP). Unprotected endpoints are a gateway that an attacker can use to compromise protected endpoints.
- Defender XDR rules are in place for alerting on (and on Windows, blocking) high-risk executable files.
- Microsoft Sentinel for SAP or another SIEM/SOAR solution is in place.
- All DBMSs are protected with TDE. Keys are stored in Key Vault or HSMs, if your environment supports them.
- Operating system, DBMS, and other passwords are stored in Key Vault.
- Linux sign-in has passwords disabled. Users can sign in only by using keys.
- All VMs are generation 2. Trusted Launch, boot integrity monitoring, and host-based encryption are enabled for all VMs.
- All VMs support Intel Total Memory Encryption (TME).
- Storage accounts use PMKs for general storage and customer-managed keys (CMKs) for sensitive data.
- VM, HANA, SQL, and Oracle backups go to an Azure Backup vault with immutable storage.
- There's a stronger segregation of duties among SAP Basis, backup, the server team, and security/key management.

## Defender for Endpoint

Defender for Endpoint is the only comprehensive antivirus and SAP Endpoint Detection and Response (EDR) solution that's comprehensively benchmarked and tested with SAP benchmarking tools and documented for SAP workloads.

Defender for Endpoint should be deployed on all NetWeaver, S/4HANA, HANA, and AnyDB servers without exception. The following deployment guides cover the correct deployment and configuration of Defender for Endpoint with SAP applications:

- [Microsoft Defender for Endpoint on Linux with SAP](/defender-endpoint/mde-linux-deployment-on-sap)
- [Microsoft Defender for Endpoint on Windows Server with SAP](/defender-endpoint/mde-sap-windows-server)

## Defender XDR

In addition to antivirus and EDR protection, Defender can provide more protection through features and services:

- For information about using and monitoring SAPXPG, see [Custom detection rules with advanced hunting: Protecting SAP external OS commands (SAPXPG)](/defender-endpoint/mde-sap-custom-detection-rules).
- Defender Vulnerability Management can detect vulnerabilities in the operating system and database layer. Currently, it can't detect Advanced Business Application Programming (ABAP) and Java vulnerabilities. For more information, see [Microsoft Defender Vulnerability Management dashboard](/defender-vulnerability-management/tvm-dashboard-insights).
- For information about Defender for Storage, see [What is Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction).
- For information about support for Server Message Block (SMB) in Azure Files, see the Microsoft blog post [Azure Files support and new updates in advanced threat protection for Azure Storage](https://azure.microsoft.com/blog/azure-files-support-and-new-updates-in-advanced-threat-protection-for-azure-storage/).

Microsoft Secure Score and Defender Vulnerability Management are discussed in the [section about OS-level hardening](#os-level-hardening) later in this article.

## Microsoft Sentinel for SAP connectors

The Microsoft Sentinel SIEM/SOAR solution has a connector for SAP. SAP application-specific signals, such as user logons and access to sensitive transactions, can be monitored and correlated with other SIEM/SOAR signals, such as network access and data exfiltration. For more information, see:

- [Microsoft Sentinel solutions for SAP applications](/azure/sentinel/sap/solution-overview)
- [YouTube video about Microsoft Sentinel for SAP](https://www.youtube.com/watch?v=uVsrqCoVWlI)

## Database-level encryption: TDE and backup encryption

We recommend that you enable TDE for all DBMSs that run SAP applications on Azure. Testing shows that the performance overhead is 0% to 2%. The advantages of TDE far outweigh the disadvantages.

Most DBMS platforms create encrypted backups if the database is enabled for TDE. This configuration mitigates one common attack vector: theft of backups.

SAP HANA doesn't support storing keys in Azure Key Vault or any other HSM device. For more information, see [SAP Note 3444154: HSM for SAP HANA Encryption Key Management](https://userapps.support.sap.com/sap/support/knowledge/en/3444154). To enable TDE on HANA, see [Enable Encryption](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/4b11e7dee04f4dd98301fcd86e2f3d8b.html) in the SAP Help Portal.

SQL Server TDE is fully integrated into Key Vault. For more information, see:

- [SAP Note 1380493: SQL Server Transparent Data Encryption](https://me.sap.com/notes/1380493)
- [Transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption)

Oracle DBMS supports TDE in combination with SAP applications. Keys for TDE can be stored in HSM PKCS#11 devices. For more information, see:

- [SAP Note 974876: Oracle Transparent Data Encryption](https://me.sap.com/notes/974876/E)
- [SAP Note 2591575: Using Oracle Transparent Data Encryption with SAP NetWeaver](https://me.sap.com/notes/2591575)
- [Oracle Database Transparent Data Encryption](https://thalesdocs.com/gphsm/ptk/protectserver3/docs/integration_docs/oracle/index.html) (Thales documentation)

DB2 native encryption is supported in combination with SAP applications. Encryption keys can be stored in HSM PKCS#11 devices. For more information, see:

- [Running an SAP NetWeaver Application Server on DB2 for LUW with the IBM DB2 Encryption Technology](https://www.sap.com/documents/2015/07/7e504681-5b7c-0010-82c7-eda71af511fa.html) (SAP documentation)
- [DB2 native encryption](https://www.ibm.com/docs/en/db2/12.1.0?topic=rest-db2-native-encryption) (IBM documentation)
- [IBM DB2 and Thales Luna HSMs - Integration Guide](https://cpl.thalesgroup.com/resources/encryption/ibm-db2-luna-hsms-integration-guide#:~:text=This%20document%20is%20intended%20to%20guide%20security%20administrators,databases%20and%20backup%20images%20using%20DB2%20native%20encryption) (Thales documentation)

## Key management: Azure Key Vault and HSM

Azure supports two solutions for key management:

- Azure Key Vault: A native Azure service that provides key management services (not PKCS#11 compliant).
- Azure Cloud HSM: A hardware-level, PKCS#11, FIPS 140-3 Level 3, single-tenant solution.

For more information on these services, see:

- [Azure Key Vault basic concepts](/azure/key-vault/general/basic-concepts)
- [What is Azure Cloud HSM?](/azure/cloud-hsm/overview)
- [How to choose the right Azure key management solution](/azure/security/fundamentals/key-management-choose)

We recommend that you store OS and application passwords in Key Vault. For training on secret management, see [Manage secrets in your server apps with Azure Key Vault](/training/modules/manage-secrets-with-azure-key-vault/?source=recommendations).

Defender for Key Vault can alert you if suspicious activity occurs in Key Vault. For more information, see [Overview of Microsoft Defender for Key Vault](/azure/defender-for-cloud/defender-for-key-vault-introduction).

## OS-level hardening

Operating system patching is one key layer in a secure solution. It isn't possible to consistently and reliably update VMs at scale manually without the use of patch management tools. You can use [Azure Update Manager](/azure/update-manager/overview) to accelerate and automate this process.

> [!NOTE]
> Linux kernel hotpatching has restrictions when the target VMs are running Defender for Endpoint. Review the documentation about using Defender for Endpoint with SAP, as listed [earlier in this article](#defender-for-endpoint). Linux patching that requires OS reboot should be handled manually on Pacemaker systems.

You can use [Microsoft Secure Score](/defender-vulnerability-management/tvm-microsoft-secure-score-devices) to monitor the status of a landscape.

### SUSE, Red Hat, and Oracle Linux

High-priority items for Linux operating systems include:

- Use generation 2 VMs with Secure Boot.
- Don't allow third-party repositories (to avoid supply chain attacks).
- Use keys and disable password sign-in in `sshd_config`.
- Use a managed identity for Pacemaker, not a service principal name (SPN). For more information, see the Microsoft blog post [SAP on Azure high availability - change from SPN to MSI for Pacemaker clusters using Azure fencing](https://techcommunity.microsoft.com/blog/sapapplications/sap-on-azure-high-availability-%E2%80%93-change-from-spn-to-msi-for-pacemaker-clusters-u/3609278).
- Disable root sign-in.

SELinux is supported with modern Red Hat Enterprise Linux (RHEL) releases. Microsoft doesn't provide support for SELinux, and careful testing is required. For more information, see [SAP Note 3108302 for SAP HANA DB: Recommended OS Settings for RHEL 9](https://me.sap.com/notes/3108302/E).

Here are resources for hardening Linux OS distributions:

- [Azure security baseline for Virtual Machines - Linux Virtual Machines](/security/benchmark/azure/baselines/virtual-machines-linux-virtual-machines-security-baseline) (Microsoft documentation)
- [The 18 CIS Critical Security Controls](https://www.cisecurity.org/controls/cis-controls-list) (CIS documentation)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) (CIS documentation)
- [Operating System Security Hardening Guide for SAP HANA for SUSE Linux Enterprise Server 15 GA and SP1](https://documentation.suse.com/sbp/sap-15/html/OS_Security_Hardening_Guide_for_SAP_HANA_SLES15/index.html) (SUSE documentation)
- [Security hardening guide for SAP HANA](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/9/html-single/security_hardening_guide_for_sap_hana/index) (Red Hat documentation)

### Windows operating systems

High-priority items for Windows operating systems include:

- Use generation 2 VMs with Secure Boot.
- Minimize the installation of any third-party software.
- Configure Windows Firewall with minimal open ports via Group Policy.
- Enforce SMB encryption via Group Policy. For more information, see [Configure the SMB client to require encryption in Windows](/windows-server/storage/file-server/configure-smb-client-require-encryption?tabs=group-policy).
- After installation, lock the \<SID>adm username as described in [SAP Note 1837765: Security policies for \<SID>adm and SAPService\<SID> on Windows](https://userapps.support.sap.com/sap/support/knowledge/en/1837765). The service account SAPService\<SID> should be set to deny interactive login (the default setting after installation). The SAPService\<SID> and \<sid>adm accounts must not be deleted.
- Configure Windows Group Policy to clear the last user name after you permit Active Directory authenticated sign-in. This configuration mitigates cloning attacks. Disable legacy TLS and SMB protocols.

Here are resources for Windows OS distributions:

- [Azure security baseline for Virtual Machines - Windows Virtual Machines](/security/benchmark/azure/baselines/virtual-machines-windows-virtual-machines-security-baseline)
- [Windows Server 2025 Security Book (download)](https://aka.ms/ws2025securitybook)
- [Windows Server Security documentation](/windows-server/security/security-and-assurance)

## Azure infrastructure security

You can enhance your Azure infrastructure security configuration to reduce or eliminate attack vectors.

### Generation 2 VM and Trusted Launch

We recommend that you deploy only generation 2 VMs and activate Trusted Launch. For more information, see the following Microsoft article and blog post:

- [Trusted Launch for Azure virtual machines](/azure/virtual-machines/trusted-launch)
- [Improve the security of Generation 2 VMs via Trusted Launch in Azure DevTest Labs](https://devblogs.microsoft.com/develop-from-the-cloud/improve-the-security-of-generation-2-vms-via-trusted-launch-in-azure-devtest-labs/)

> [!NOTE]
> Only recent versions of SUSE 15 support Trusted Launch. See the [list of supported operating systems](/azure/virtual-machines/trusted-launch#operating-systems-supported).

The conversion from generation 1 to generation 2 can be complex, especially for Windows. We recommend that you deploy only generation 2 Trusted Launch VMs by default. For more information, see [Upgrade existing Azure Gen1 VMs to Trusted launch](/azure/virtual-machines/trusted-launch-existing-vm-gen-1?tabs=windows%2Cpowershell).

For the list of Azure VMs supported for Trusted Launch, see [Virtual machine sizes](/azure/virtual-machines/trusted-launch#virtual-machines-sizes).

Defender for Cloud can monitor Trusted Launch. For more information, see [Microsoft Defender for Cloud integration](/azure/virtual-machines/trusted-launch#microsoft-defender-for-cloud-integration).

### Encryption in transit for Azure Files NFS and SMB

You can encrypt Network File Share (NFS) traffic in Azure Files to help protect against packet tracing and other threats. For more information, see:

- [Encryption in transit for NFS Azure file shares](/azure/storage/files/encryption-in-transit-for-nfs-shares?tabs=Ubuntu)
- [Azure Files NFS encryption in transit for SAP on Azure systems](/azure/sap/workloads/sap-azure-files-nfs-encryption-in-transit-guide?tabs=SUSE)

For SMB, Azure Files supports encryption in transit by default. For more information, see [SMB file shares in Azure Files](/azure/storage/files/files-smb-protocol?tabs=azure-portal#security).

### Encryption at host

To verify that M-series VMs have the latest drivers required for encryption at host, contact Microsoft. M-series v3, D-series, and E-series VMs can use encryption at host without restriction.

Encryption at host is tested with SAP, and you can use it without restriction on modern Azure VMs. The overhead is around 2%.

For more information about this feature, see:

- [Encryption at host: End-to-end encryption for your VM data](/azure/virtual-machines/disk-encryption#encryption-at-host---end-to-end-encryption-for-your-vm-data)
- [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview#comparison)

### Storage account encryption

Storage accounts use either PMKs or CMKs. Both are fully supported with SAP applications. For more information, see [Azure Storage encryption for data at rest](/azure/storage/common/storage-service-encryption).

CMKs within one tenant or across tenants are supported. For more information, see [Encrypt managed disks with cross-tenant customer-managed keys](/azure/virtual-machines/disks-cross-tenant-customer-managed-keys?tabs=azure-portal).

You can use double encryption at rest for highly secure SAP systems. For more information, see [Enable double encryption at rest for managed disks](/azure/virtual-machines/disks-enable-double-encryption-at-rest-portal?tabs=portal). This capability isn't supported on Azure Ultra Disk Storage or Premium SSD v2 disks.

For a comparison of disk encryption technologies, see [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview#comparison).

> [!IMPORTANT]
> Azure Disk Encryption isn't supported for SAP systems.

### Virtual network encryption

Consider using [virtual network encryption](/azure/virtual-network/virtual-network-encryption-overview) for high-security deployments and gateways. There are some [feature restrictions](/azure/virtual-network/virtual-network-encryption-overview#limitations). Virtual network encryption is currently used for specific high-security scenarios.

### Intel Total Memory Encryption

Modern Azure VMs automatically use the Total Memory Encryption - Multi-Key (TME-MK) feature built into modern CPUs. High-security customers should use modern VMs and contact Microsoft directly for confirmation that all VM types support TME. For more information about the feature, see the [Intel TME-MK documentation](https://www.intel.com/content/www/us/en/developer/articles/news/runtime-encryption-of-memory-with-intel-tme-mk.html).

### Azure Automation account for Azure Site Recovery agent updates

To change the Azure Automation user account required for Azure Site Recovery agent updates from Contributor to a lower security context, review the [latest documentation for Site Recovery](/azure/site-recovery/).

### Removal of public endpoints

Public endpoints for Azure objects such as storage accounts and Azure Files should be removed. For more information, see:

- [Use private endpoints for Azure Storage](/azure/storage/common/storage-private-endpoints)
- [Set the default public network access rule for an Azure Storage account](/azure/storage/common/storage-network-security-set-default-access?tabs=azure-portal)

### DNS hijacking and subdomain takeover

You can prevent subdomain takeovers by using Azure DNS alias records and custom domain verification in Azure App Service. For more information, see [Prevent dangling DNS entries and avoid subdomain takeover](/azure/security/fundamentals/subdomain-takeover).

In addition, you can use Defender for DNS to help protect against malware and remote access trojan (RAT) command-and-control targets. For more information, see [Overview of Microsoft Defender for DNS](/azure/defender-for-cloud/defender-for-dns-introduction).

### Azure Bastion

Azure Bastion can help prevent system administrators' workstations from becoming infected with malware such as key loggers. For more information, see the [Azure Bastion documentation](/azure/bastion/).

## Ransomware protection

The Azure platform includes powerful ransomware protection features.
We recommend that you use an Azure immutable vault to prevent ransomware or other trojans from encrypting backups. Azure offers write once, read many (WORM) storage for this purpose.

Azure Backup for SAP HANA and SQL Server can write to Azure Blob Storage. For more information, see [Backup and restore plan to protect against ransomware](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware#azure-backup). It's possible to configure storage to require a PIN or MFA before anyone can modify backups.

You can configure fully locked, SEC 17a-4(f)-compliant immutable storage policies. For more information, see [Lock a time-based retention policy](/azure/storage/blobs/immutable-policy-configure-container-scope?tabs=azure-portal#lock-a-time-based-retention-policy).

We recommend that you review [Steps to take before an attack](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware#steps-to-take-before-an-attack) and select the appropriate measures.

Here are more resources:

- [Immutable vault for Azure Backup](/azure/backup/backup-azure-immutable-vault-concept?tabs=recovery-services-vault)
- [Azure security fundamentals documentation](/azure/security/fundamentals/)
- [Microsoft Digital Defense Report](https://www.microsoft.com/security/business/security-intelligence-report?msockid=343d619786f36e041990740887e36ff0)
- [Microsoft Safety Scanner](/defender-endpoint/safety-scanner-download)
- [Windows Malicious Software Removal Tool 64-bit](https://www.microsoft.com/download/details.aspx?id=9905)
- [FAQ: Protect backups from ransomware with Azure Backup](/azure/backup/protect-backups-from-ransomware-faq)

In addition, Microsoft offers support and consulting services for security-related topics. See the Microsoft blog post [DART: the Microsoft cybersecurity team we hope you never meet](https://www.microsoft.com/security/blog/2019/03/25/dart-the-microsoft-cybersecurity-team-we-hope-you-never-meet/).

Further recommendations for large organizations include segregation of duties. For example, SAP administrators and server administrators should have read-only access to the Azure Backup vault. You can implement [multi-user authorization and a resource guard](/azure/backup/multi-user-authorization?tabs=azure-portal&pivots=vaults-recovery-services-vault) to help protect against rogue administrators and ransomware.

You can achieve extra protection from ransomware by deploying Azure Firewall Premium. For more information, see [Improve your security defenses for ransomware attacks with Azure Firewall Premium](/azure/security/fundamentals/ransomware-protection-with-azure-firewall).

## Unsupported technologies

Azure Disk Encryption isn't supported for SAP solutions. RHEL and SUSE Linux Enterprise Server (SLES) Linux images for SAP applications are considered *custom images*, so they aren't tested or supported. Customers who have a requirement for at-rest encryption typically use Azure encryption at host.

> [!IMPORTANT]
> Azure Disk Encryption is now a deprecated feature. For more information, see [Azure Updates](https://azure.microsoft.com/updates?id=493779).

## SAP Security Notes

For information about SAP Security Notes, go to the [entry point](https://support.sap.com/en/my-support/knowledge-base/security-notes-news.html) or the [searchable database](https://me.sap.com/app/securitynotes).

SAP releases information about vulnerabilities in its products on the [second Tuesday of every month](https://support.sap.com/en/my-support/knowledge-base/security-notes-news.html?anchorId=section_370125364). Vulnerabilities with a Common Vulnerability Scoring System (CVSS) score between 9.0 and 10 are severe, and we recommend that you mitigate them immediately.

Security analysts and forums have reported an increase in the exploitation of SAP-specific vulnerabilities. Vulnerabilities that don't require authentication should be expedited through the SAP landscape.

## Related content

- [Microsoft Security Response Center](https://www.microsoft.com/msrc?rtc=1&oneroute=true)
- [SAP Note 3356389: Antivirus or other security software affecting SAP operations](https://me.sap.com/notes/3356389/E)
- [CVE: Common Vulnerabilities and Exposures](https://www.cve.org/)
- [Azure operational security checklist](/azure/security/fundamentals/operational-checklist)
- [Data governance best practices for security](/purview/data-gov-classic-security-best-practices)
- [Azure Bastion documentation](/azure/bastion/)
- [Azure security fundamentals documentation](/azure/security/fundamentals/)
- [SAP HANA Database Encryption - SAP Community](https://community.sap.com/t5/technology-blog-posts-by-members/sap-hana-database-encryption/ba-p/13555367)
- [SAP Note 3345490: Common Criteria Compliance FAQ](https://me.sap.com/notes/3345490)
- [Microsoft Security Compliance Toolkit guide](/windows/security/operating-system-security/device-management/windows-security-configuration-framework/security-compliance-toolkit-10)
- [SQL Server database security for SAP on Azure](/azure/cloud-adoption-framework/scenarios/sap/sap-lza-database-security)
- [Measured boot and host attestation](/azure/security/fundamentals/measured-boot-host-attestation)
