---
title: Secure Azure Infrastructure for SAP Applications 
description: Links collection and guidance Secure Azure Infrastructure for SAP Applications 
services: virtual-machines-windows,virtual-network,storage
author: cgardin
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.date: 10/07/2025
ms.author: cgardin
# Customer intent: Secure Azure infrastructure for SAP applications 
---

# Secure Azure infrastructure for SAP applications 
A well secured SAP solution incorporates many security concepts with many layers spanning multiple domains:
-	Identity Management, Provisioning and Single Sign-on, MFA, Global Secure Access, Secure Network Connection (SNC)  
-	Auditing, Log Analytics and Event Management
-	SIEM/SOAR Solutions 
-	Antivirus and anti-malware Endpoint Protection 
-	Encryption and Key Management
-	Operating System Hardening 
-	Azure Infrastructure Hardening 


These topics are covered in a series of related pages. SAP applications should be incorporated into the overall Zero-Trust security solution for the entire IT landscape. [Zero Trust Strategy & Architecture | Microsoft Security](https://www.microsoft.com/security/business/zero-trust?msockid=343d619786f36e041990740887e36ff0)
The SAP Security Solution should reference the Zero-Trust security model. The Zero-Trust security solution validates each action at each layer such as Identity, Endpoint Network Access, Authentication, and MFA through SAP Application and Data Access. 

 :::image type="content" source="media/sap-security-instructure/microsoft-zero-trust-security-diagram.png" border="false" alt-text="Screenshot of Microsoft zero trust design." lightbox="media/sap-security-instructure/microsoft-zero-trust-security-diagram.png"::: 

The purpose of this documentation is to provide a single location with links and a brief description on how to implement Identity, Security, and Audit related features for SAP solutions running on Azure Hyperscale Cloud.   This documentation doesn't precisely specify which security features should be implemented as requirements are dependent on risk profile, industry, and regulatory environment. This document does make some default recommendations such as a general recommendation to use Defender for Endpoint, Transparent Database Encryption (TDE), and Backup Encryption on all systems.  
Customers designing and implementing Identity, Security, and Audit solutions for SAP review the concepts explained in [Microsoft cloud security benchmark introduction | Microsoft Learn](/security/benchmark/azure/introduction). 
More Checklists can be found [Secure Overview - Cloud Adoption Framework | Microsoft Learn](/azure/cloud-adoption-framework/secure/overview#cloud-security-checklist) 

## Deployment Checklist 
The design and implementation of a comprehensive security solution for SAP applications running on Azure is a consulting project. 
This documentation provides a basic deployment pattern covering a minimum security configuration and a more secure configuration.   Organizations that require high security solutions should seek expert consulting advice. Highly secured SAP landscapes could increase operational complexity and make tasks such as system refreshes, upgrades, remote access for support, debugging, or HA/DR testing difficult or complex.  

### Minimum - Security Deployment Checklist
-	Defender for Endpoint active in real-time Mode on all Endpoints (SAP and non-SAP). Unprotected Endpoints are a gateway that can be used to compromise other protected Endpoints
-	Defender XDR rules for alerting (and on Windows blocking) high risk executables 
-	Microsoft Sentinel for SAP and/or other SIEM/SOAR solution
-	All Database Management Systems (DBMS) protected with Transparent Database Encryption (TDE). Keys stored in Key Vault (if supported) or HSM (if supported)
-	Operating System, DBMS and other passwords stored in Azure Key Vault 
-	Linux sign-in via password disabled. Key sign-in only 
-	Generation 2 VMs and Secure Launch enabled on all VMs 
-	Storage Accounts – PMK 
-	VM, Hana, SQL, and Oracle Backups to Azure Backup Vault with Immutable storage 

### More Secure - Security Deployment Checklist
-	Defender for Endpoint active in real-time Mode on all Endpoints (SAP and non-SAP). Unprotected Endpoints are a gateway that can be used to compromise other protected Endpoints
-	Defender XDR rules for alerting (and on Windows blocking) high risk executables 
-	Microsoft Sentinel for SAP and/or other SIEM/SOAR solution
-	All DBMS protected with Transparent Database Encryption (TDE). Keys stored in Key Vault (if supported) or HSM (if supported)
-	Operating System, DBMS and other passwords stored in Azure Key Vault 
-	Linux sign-in via password disabled. Key sign-in only 
-	Generation 2 VMs and Secure Launch enabled on all VMs. Enable Boot Integrity Monitoring 
-	Host Based Encryption enabled for all VMs
-	All VMs are modern generation VMs supporting Intel TME memory encryption 
-	Storage Accounts – PMK for general storage. CMK for sensitive data 
-	VM, Hana, SQL, and Oracle Backups to Azure Backup Vault with Immutable storage 
-	Stronger Segregation of Duties between SAP Basis, Backup, Server Team, and Security/Key Management.  

## Defender for Endpoint 
Defender for Endpoint is the only comprehensive Antivirus (AV) and Endpoint Detection and Response (EDR) solution that is comprehensively benchmarked and tested with SAP Benchmarking tools and documented for SAP workloads. 
Defender for Endpoint should be deployed on all NetWeaver, S4HANA, Hana, and AnyDB servers without exception. The deployment guidance for Defender fully covers the correct deployment and configuration of Defender for Endpoint for SAP applications.

[Deployment guidance for Microsoft Defender for Endpoint on Linux for SAP - Microsoft Defender for Endpoint | Microsoft Learn](/defender-endpoint/mde-linux-deployment-on-sap)

[Microsoft Defender Endpoint on Windows Server with SAP - Microsoft Defender for Endpoint | Microsoft Learn](/defender-endpoint/mde-sap-windows-server)

## Defender XDR
In addition to AV and EDR protection Defender can provide more protection with features such as advanced threat hunting, Vulnerability Management, and other capabilities.  
The SAPXPG can be exploited and should be monitored using this procedure [Custom detection rules with advanced hunting: Protecting SAP external OS commands (SAPXPG) - Microsoft Defender for Endpoint | Microsoft Learn](/defender-endpoint/mde-sap-custom-detection-rules)

Defender Vulnerability Management can detect vulnerabilities in the Operating System and Database layer. [Microsoft Defender Vulnerability Management dashboard - Microsoft Defender Vulnerability Management | Microsoft Learn](/defender-vulnerability-management/tvm-dashboard-insights)  
Defender Vulnerability Management doesn't have the functionality to detect ABAP and Java vulnerabilities today

Defender for Storage for Blob What is [Microsoft Defender for Storage - Microsoft Defender for Cloud | Microsoft Learn](/azure/defender-for-cloud/defender-for-storage-introduction)
Support for Azure Files SMB [Azure Files support and new updates in advanced threat protection for Azure Storage | Microsoft Azure Blog](https://azure.microsoft.com/blog/azure-files-support-and-new-updates-in-advanced-threat-protection-for-azure-storage/).

Microsoft Secure Score and Vulnerability Management is discussed in the Operating System section below [Microsoft Defender Vulnerability Management dashboard - Microsoft Defender Vulnerability Management | Microsoft Learn](/defender-vulnerability-management/tvm-dashboard-insights)

## Microsoft Sentinel for SAP Connector  

Microsoft Sentinel SIEM/SOAR solution has a connector for SAP. SAP application specific signals such as user logons and access to sensitive transactions can be monitored and corelated with other SIEM/SOAR signals, such as network access and data exfiltration.  
[Microsoft Sentinel solution for SAP applications overview | Microsoft Learn](/azure/sentinel/sap/solution-overview)

[140 - The one with Microsoft Sentinel for SAP (Yoav Daniely, Yossi Hasson & Martin Pankraz, Sebastian Ullrich - YouTube](https://www.youtube.com/watch?v=uVsrqCoVWlI)

## Database Level Encryption – TDE and Backup Encryption

It's recommended to enable Transparent Database Encryption (TDE) for all DBMS running SAP applications on Azure. Testing shows that the performance overhead is between zero to two percent. The advantages of TDE far outweigh the disadvantages. Most DBMS platforms create encrypted backups if the database is TDE enabled mitigating one common attack vector, theft of backups. 
SAP Hana Transparent Database Encryption

SAP Hana doesn't support storing Keys in Azure Key Vault or any other HSM device. [3444154 - HSM for SAP HANA Encryption Key Management](https://me.sap.com/notes/3444154/E)  
To enable TDE on Hana follow [Enable Encryption | SAP Help Portal](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/4b11e7dee04f4dd98301fcd86e2f3d8b.html)

SQL Server Transparent Database Encryption is fully integrated into the Azure Key Vault.  
- [1380493 - SQL Server Transparent Data Encryption (TDE)](https://me.sap.com/notes/1380493)
- [Transparent data encryption (TDE) - SQL Server | Microsoft Learn](/sql/relational-databases/security/encryption/transparent-data-encryption)

Oracle DBMS supports TDE in combination with SAP applications. TDE keys can be stored in HSM PKCS#11 devices 
- [974876 - Oracle Transparent Data Encryption (TDE)](https://me.sap.com/notes/974876/E)
- [2591575 - Using Oracle Transparent Data Encryption (TDE) with SAP NetWeaver](https://me.sap.com/notes/2591575)
- [Oracle Database Transparent Data Encryption (TDE)](https://thalesdocs.com/gphsm/ptk/protectserver3/docs/integration_docs/oracle/index.html) – Thales 

DB2 Native Encryption is supported in combination with SAP applications. Encryption keys can be stored in HSM PKCS#11 devices.
- [Running an SAP NetWeaver Application Server on DB2 for LUW with the IBM DB2 Encryption Technology](https://www.sap.com/documents/2015/07/7e504681-5b7c-0010-82c7-eda71af511fa.html)
- [DB2 native encryption - IBM Documentation](https://www.ibm.com/docs/en/db2/12.1.0?topic=rest-db2-native-encryption)
- [IBM DB2 and Thales Luna HSMs - Integration Guide | Thales](https://cpl.thalesgroup.com/resources/encryption/ibm-db2-luna-hsms-integration-guide#:~:text=This%20document%20is%20intended%20to%20guide%20security%20administrators,databases%20and%20backup%20images%20using%20DB2%20native%20encryption.)

## Key Management – Azure Key Vault and HSM 

Azure supports two solutions for Key Management:
-	Azure Key Vault – a native Azure service that provides Key Management services (non PKCS#11 compliant) 
-	Azure Cloud HSM – a hardware level PKCS#11 FIPS 140-3 Level 3 single tenant solution
More information on these services

[What is Azure Key Vault? | Microsoft Learn](/azure/key-vault/general/basic-concepts)

[Overview of Azure Cloud HSM Preview | Microsoft Learn](/azure/cloud-hsm/overview)
 
[How to choose the right key management solution - How to choose between Azure Key Vault, Azure Managed HSM, Azure Dedicated HSM, and Azure Payment HSM | Microsoft Learn](/azure/security/fundamentals/key-management-choose)

It's recommended to store OS and application passwords in Azure Key Vault. Training on secret management [Manage secrets in your server apps with Azure Key Vault - Training | Microsoft Learn](/training/modules/manage-secrets-with-azure-key-vault/?source=recommendations)

Defender for Key Vault is recommended to alert if suspicious activity occurs on Azure Key Vault [Microsoft Defender for Key Vault - the benefits and features - Microsoft Defender for Cloud | Microsoft Learn](/azure/defender-for-cloud/defender-for-key-vault-introduction)

## Operating System Level Hardening 
Operating System patching is one key layer in a secure solution. It isn't possible to consistently and reliably update VMs at scale manually without the use of patch management tools. Azure Update Manager should be used to accelerate and automate this process [Azure Update Manager overview | Microsoft Learn](/azure/update-manager/overview)

> [!NOTE]
> Linux kernel hotpatching has restrictions when the target VMs are running Defender for Endpoint. Review the Defender for Endpoint for SAP documentation. Linux patching requiring OS reboot should be handled manually on Pacemaker systems. 

The Microsoft Secure Score should be used to monitor status of a landscape [Microsoft Secure Score for Devices - Microsoft Defender Vulnerability Management | Microsoft Learn](/defender-vulnerability-management/tvm-microsoft-secure-score-devices)

### SUSE, Redhat, and Oracle Linux 
The following links have resources for hardening Linux OS distributions:    
- [Azure security baseline for Virtual Machines - Linux Virtual Machines | Microsoft Learn](/security/benchmark/azure/baselines/virtual-machines-linux-virtual-machines-security-baseline) 
- [The 18 CIS Critical Security Controls](https://www.cisecurity.org/controls/cis-controls-list)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [Operating System Security Hardening Guide for SAP HANA for SUSE Linux Enterprise Server 15 GA and SP1](https://documentation.suse.com/sbp/sap-15/html/OS_Security_Hardening_Guide_for_SAP_HANA_SLES15/index.html)
- [Security hardening guide for SAP HANA | Red Hat Enterprise Linux for SAP Solutions | 9 | Red Hat Documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/9/html-single/security_hardening_guide_for_sap_hana/index)

High priority items for Linux Operating Systems include:
- Generation 2 VMs with Secure Boot     
- Don't allow third Party Repositories (supply chain attack)    
- Use Keys and disable password sign-in in sshd_config      
- Use Managed Identify for Pacemaker not SPN [Azure SAP Pacemaker MSI SPN](https://techcommunity.microsoft.com/blog/sapapplications/sap-on-azure-high-availability-%E2%80%93-change-from-spn-to-msi-for-pacemaker-clusters-u/3609278)
- Disable root sign-in

It's supported to use SELinux with modern RHEL releases. Microsoft doesn't provide support for SELinux and careful testing is required [3108302 - SAP HANA DB: Recommended OS Settings for RHEL 9](https://me.sap.com/notes/3108302/E)

### Windows Operating System
[Azure security baseline for Virtual Machines - Windows Virtual Machines | Microsoft Learn](/security/benchmark/azure/baselines/virtual-machines-windows-virtual-machines-security-baseline)

High priority items for Windows Operating System include:

- Generation 2 VMs with Secure Boot 
- Minimize the installation of any 3rd party software 
- Configure Windows Firewall with minimal open ports via Group Policy 
- SMB Encryption enforced via Group Policy [Configure the SMB client to require encryption in Windows | Microsoft Learn](/windows-server/storage/file-server/configure-smb-client-require-encryption?tabs=group-policy)
- After installation, it's supported to lock the \<sid>adm username as described in SAP Note 1837765.  The service account SAPService\<SID> should have "deny interactive login" (the default setting after installation).  The SAPService\<SID> and \<sid>adm account must not be deleted. Review [1837765 - Security policies for \<SID>adm and SAPService\<SID> on Windows](https://me.sap.com/notes/1837765/E)
- Configure Windows Group Policy to clear last user name, on permit AD authenticated sign-in (mitigates against cloning attack) and disable legacy TLS and SMB protocols 

Other links for Windows:  

https://aka.ms/ws2025securitybook 

[Windows Server Security documentation | Microsoft Learn](/windows-server/security/security-and-assurance)

## Azure Infrastructure Platform Security 
Azure infrastructure security configuration can be enhanced to reduce or eliminate attack vectors.
#### Generation 2 VM and Trusted Launch 
It's recommended to only deploy Generation 2 VMs and to activate Trusted Launch. 
> [!NOTE]
> Note only recent versions of SUSE 15 support Trusted Launch. [Trusted Launch for Azure VMs - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/trusted-launch#operating-systems-supported)

[Trusted Launch for Azure VMs - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/trusted-launch)

[Improve the security of Generation 2 VMs via Trusted Launch in Azure DevTest Labs | Develop from the cloud](https://devblogs.microsoft.com/develop-from-the-cloud/improve-the-security-of-generation-2-vms-via-trusted-launch-in-azure-devtest-labs/)

The conversion from Gen1 to Gen2 can be a little complex especially for Windows OS.   It's recommended to only deploy Gen2 Trusted Launch VMs by default. [Upgrade Gen1 VMs to Trusted launch - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/trusted-launch-existing-vm-gen-1?tabs=windows%2Cpowershell)
The list of Azure VMs supported Trusted Launch is listed here [Trusted Launch for Azure VMs - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/trusted-launch#virtual-machines-sizes)

Defender for Cloud can monitor Trusted Launch. [Trusted Launch for Azure VMs - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/trusted-launch#microsoft-defender-for-cloud-integration)
#### Encryption in Transit for Azure Files NFS & SMB 
Azure Files NFS traffic can be encrypted to protect against packet tracing and other threats.  
[How to Encrypt Data in Transit for NFS shares | Microsoft Learn](/azure/storage/files/encryption-in-transit-for-nfs-shares?tabs=Ubuntu)

[Azure Files NFS Encryption in Transit for SAP on Azure Systems | Microsoft Learn](/azure/sap/workloads/sap-azure-files-nfs-encryption-in-transit-guide?tabs=SUSE)
Azure Files SMB supports Encryption in Transit by default [SMB file shares in Azure Files | Microsoft Learn](/azure/storage/files/files-smb-protocol?tabs=azure-portal#security)
#### Encryption at Host (HBE)
Currently customers should contact Microsoft to verify M-series VMs have the latest drivers required for Encryption at Host. M-series v3, D series, and E series VMs can use Encryption at Host without restriction.
Encryption at Host is tested with SAP and can be used without restriction on modern Azure VMs.  The overhead is around 2%.
[Server-side encryption of Azure managed disks - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disk-encryption#encryption-at-host---end-to-end-encryption-for-your-vm-data)

[Overview of managed disk encryption options - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disk-encryption-overview#comparison)
#### Storage Account Encryption 
Storage Accounts use either Platform Managed Keys (PMK) or Customer Managed Keys (CMK). Both are fully supported with SAP applications.   [Azure Storage encryption for data at rest | Microsoft Learn](/azure/storage/common/storage-service-encryption)
Customer Managed Keys within one tenant or across tenants is supported Use a disk encryption set across [Microsoft Entra tenants - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disks-cross-tenant-customer-managed-keys?tabs=azure-portal)

Double Encryption at rest can be used for highly secure SAP systems [Enable double encryption at rest for managed disks - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disks-enable-double-encryption-at-rest-portal?tabs=portal)  (not supported on Ultra or Premium SSD v2). 
A comparison of Disk Encryption technologies can be found here [Overview of managed disk encryption options - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/disk-encryption-overview#comparison) 
> [!Important]
> Azure Disk Encryption isn't supported for SAP systems.  
#### Virtual Network Encryption 
Virtual Network Encryption can be considered for high security deployments and gateways. There are some [feature restrictions](/azure/virtual-network/virtual-network-encryption-overview#limitations). Virtual Network Encryption is currently used for specific high security scenarios.   
[What is Azure Virtual Network encryption? - Azure Virtual Network | Microsoft Learn](/azure/virtual-network/virtual-network-encryption-overview)

#### Intel Total Memory Encryption (TME)
Modern Azure VMs automatically use the TME-MK feature built into modern CPUs. High security customers should use modern VMs and contact Microsoft directly for confirmation that all VM types supported TME.  For more information [Runtime Encryption of Memory with Intel® Total Memory](https://www.intel.com/content/www/us/en/developer/articles/news/runtime-encryption-of-memory-with-intel-tme-mk.html) 
#### Azure Automation account for Azure Site Recovery Agent updates.  
Review the latest documentation for Azure Site Recovery to configure the Azure Automation user account required for Azure Site Recovery Agent updates from a 'Contributor' to a lower security context. More information can be found [Azure Site Recovery documentation | Microsoft Learn](/azure/site-recovery/)
#### Remove Public Endpoints 
Public endpoints for Azure objects such as storage accounts and Azure Files should be removed
[Use private endpoints - Azure Storage | Microsoft Learn](/azure/storage/common/storage-private-endpoints) 
[Set the default public network access rule: Azure Storage | Microsoft Learn](/azure/storage/common/storage-network-security-set-default-access?tabs=azure-portal)
#### DNS hijacking and Subdomain Takeover  
[Prevent subdomain takeovers with Azure DNS alias records and Azure App Service's custom domain verification | Microsoft Learn](/azure/security/fundamentals/subdomain-takeover)
In addition Defender for DNS can be used to protect against Malware/RAT command and control targets and other protections [Microsoft Defender for DNS - the benefits and features - Microsoft Defender for Cloud | Microsoft Learn](/azure/defender-for-cloud/defender-for-dns-introduction)
#### Azure Bastion 
System Administrator’s workstations can be infected with Malware such as Key loggers. Azure Bastion is recommended [Azure Bastion documentation | Microsoft Learn](/azure/bastion/)

## Ransomware Protection 
The Azure platform includes powerful ransomware protection features.  
It's recommended to use the Azure Immutable Backup Vault to prevent Ransomware or other trojans from encrypting backups. Azure offers WORM storage for this purpose.  
[Azure Backup for SAP Hana and SQL Server can write to Azure Blob Storage  Azure backup and restore plan to protect against ransomware | Microsoft Learn](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware#azure-backup) 
It's possible to configure storage to require a PIN code or MFA before any modification can be performed on backups.  

It's possible to configure fully SEC 17a-4(f) Locked Immutable storage policies. [Configure immutability policies for containers - Azure Storage | Microsoft Learn](/azure/storage/blobs/immutable-policy-configure-container-scope?tabs=azure-portal#lock-a-time-based-retention-policy)
It's recommended to review these steps and select the appropriate measures [Azure backup and restore plan to protect against ransomware | Microsoft Learn](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware#steps-to-take-before-an-attack)

Further links: 
- [Concept of Immutable vault for Azure Backup - Azure Backup | Microsoft Learn](/azure/backup/backup-azure-immutable-vault-concept?tabs=recovery-services-vault)
- [Azure security fundamentals documentation | Microsoft Learn](/azure/security/fundamentals/)
- [Microsoft Digital Defense Report and Security Intelligence Insights](https://www.microsoft.com/security/business/security-intelligence-report?msockid=343d619786f36e041990740887e36ff0)
- Microsoft also offers support and consulting services for security related topics 
[DART: the Microsoft cybersecurity team we hope you never meet | Microsoft Security Blog](https://www.microsoft.com/security/blog/2019/03/25/dart-the-microsoft-cybersecurity-team-we-hope-you-never-meet/)
- Microsoft provides tools to remove ransomware and other Malware from Windows [Microsoft Safety Scanner Download - Microsoft Defender for Endpoint | Microsoft Learn](/defender-endpoint/safety-scanner-download) 
- [Windows Malicious Software Removal Tool 64-bit](https://www.microsoft.com/download/details.aspx?id=9905)
- [FAQ - Protect backups from Ransomware with Azure Backup - Azure Backup | Microsoft Learn](/azure/backup/protect-backups-from-ransomware-faq)
 
Further recommendations for large organizations include segregation of duties. For example, the SAP Administrators and Server Administrators should only have Read Only access to the Backup Vault. Multiuser Authorization and Resource Guard can be implemented to protect against rouge administrators and ransomware [Configure Multi-user authorization using Resource Guard - Azure Backup | Microsoft Learn](/azure/backup/multi-user-authorization?tabs=azure-portal&pivots=vaults-recovery-services-vault)

 Extra protection from Ransomware can be achieved by deploying [Azure Firewall Premium Improve your security defenses for ransomware attacks with Azure Firewall Premium | Microsoft Learn](/azure/security/fundamentals/ransomware-protection-with-azure-firewall)

## Unsupported Technologies 
Azure Disk Encryption (ADE) isn't supported for SAP solutions. RHEL and SLES Linux images for SAP applications are considered to be 'custom images' and aren't tested or supported. Azure Encryption at Host is typically used for customers with a requirement for at rest encryption. 
> [!Important]
> Azure Disk Encryption is now a deprecated feature [Azure updates | Microsoft Azure](https://azure.microsoft.com/updates?id=493779)

## SAP Security Notes
SAP release information about vulnerabilities in their products on the second Tuesday of every month.  
Vulnerabilities with a CVE score between 9.0 and 10 are severe and should be immediately mitigated.
Entry point for [SAP Security Notes](https://support.sap.com/en/my-support/knowledge-base/security-notes-news.html)  
Second Tuesday of every month [SAP release Security Notes](https://support.sap.com/en/my-support/knowledge-base/security-notes-news.html?anchorId=section_370125364) 
Searchable [database of Security Notes](https://me.sap.com/app/securitynotes)

Security Analysts and Forums have reported an increase in the exploitation of SAP specific vulnerabilities.  It's recommended to expedite the implementation of CVE Score 9.0 and above.  Vulnerabilities that don't require authentication should be expedited through the SAP landscape.  

## Links  

- Microsoft Response Center [MSRC - Microsoft Security Response Center](https://www.microsoft.com/msrc?rtc=1&oneroute=true)
- [3356389 - Antivirus or other security software affecting SAP operations](https://me.sap.com/notes/3356389/E)
- [CVE: Common Vulnerabilities and Exposures](https://www.cve.org/)
- [Azure operational security checklist | Microsoft Learn](/azure/security/fundamentals/operational-checklist)
- [Microsoft Purview classic data governance best practices for security - Microsoft Purview | Azure Docs](/purview/data-gov-classic-security-best-practices)
- [Azure Bastion documentation | Microsoft Learn](/azure/bastion/)
- [Azure security fundamentals documentation | Microsoft Learn](/azure/security/fundamentals/)  
- [SAP HANA Database Encryption - SAP Community](https://community.sap.com/t5/technology-blog-posts-by-members/sap-hana-database-encryption/ba-p/13555367)
- [3345490 - Common Criteria Compliance FAQ](https://me.sap.com/notes/3345490)
- [Microsoft Security Compliance Toolkit Guide | Microsoft Learn](/windows/security/operating-system-security/device-management/windows-security-configuration-framework/security-compliance-toolkit-10)
- [SQL Server database security for SAP on Azure - Cloud Adoption Framework | Microsoft Learn](/azure/cloud-adoption-framework/scenarios/sap/sap-lza-database-security)
- [Firmware measured boot and host attestation - Azure Security | Microsoft Learn](/azure/security/fundamentals/measured-boot-host-attestation)

