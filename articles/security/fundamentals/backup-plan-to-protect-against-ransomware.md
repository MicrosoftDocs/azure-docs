---
title: Azure backup and restore plan to protect against ransomware | Microsoft Docs
description: Learn what to do before and during a ransomware attack to protect your critical business systems and ensure a rapid recovery of business operations.
author: TerryLanfear
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: terrylan
manager: rkarlin
ms.date: 08/29/2023
ms.custom: ignite-fall-2021
---

# Backup and restore plan to protect against ransomware

Ransomware attacks deliberately encrypt or erase data and systems to force your organization to pay money to attackers. These attacks target your data, your backups, and also key documentation required for you to recover without paying the attackers (as a means to increase the chances your organization will pay).

This article addresses what to do before an attack to protect your critical business systems and during an attack to ensure a rapid recovery of business operations.

> [!NOTE]
> Preparing for ransomware also improves resilience to natural disasters and rapid attacks like [WannaCry](https://en.wikipedia.org/wiki/WannaCry_ransomware_attack) & [(Not)Petya](https://attack.mitre.org/software/S0368/).

## What is ransomware?

Ransomware is a type of extortion attack that encrypts files and folders, preventing access to important data and systems. Attackers use ransomware to extort money from victims by demanding money, usually in the form of cryptocurrencies, in exchange for a decryption key or in exchange for not releasing sensitive data to the dark web or the public internet.

While early ransomware mostly used malware that spread with phishing or between devices, [human-operated ransomware](/security/compass/human-operated-ransomware) has emerged where a gang of active attackers, driven by human attack operators, target all systems in an organization (rather than a single device or set of devices). An attack can:

- Encrypt your data
- Exfiltrate your data
- Corrupt your backups

The ransomware leverages the attackers’ knowledge of common system and security misconfigurations and vulnerabilities to infiltrate the organization, navigate the enterprise network, and adapt to the environment and its weaknesses as they go.

Ransomware can be staged to exfiltrate your data first, over several weeks or months, before the ransomware actually executes on a specific date.

Ransomware can also slowly encrypt your data while keeping your key on the system. With your key still available, your data is usable to you and the ransomware goes unnoticed. Your backups, though, are of the encrypted data. Once all of your data is encrypted and recent backups are also of encrypted data, your key is removed so you can no longer read your data.

The real damage is often done when the attack exfiltrates files while leaving backdoors in the network for future malicious activity—and these risks persist whether or not the ransom is paid. These attacks can be catastrophic to business operations and difficult to clean up, requiring complete adversary eviction to protect against future attacks. Unlike early forms of ransomware that only required malware remediation, human-operated ransomware can continue to threaten your business operations after the initial encounter.

### Impact of an attack

The impact of a ransomware attack on any organization is difficult to quantify accurately. Depending on the scope of the attack, the impact could include:

- Loss of data access
- Business operation disruption
- Financial loss
- Intellectual property theft
- Compromised customer trust or tarnished reputation
- Legal expenses

## How can you protect yourself?

The best way to prevent falling victim to ransomware is to implement preventive measures and have tools that protect your organization from every step that attackers take to infiltrate your systems.

You can reduce your on-premises exposure by moving your organization to a cloud service. Microsoft has invested in native security capabilities that make Microsoft Azure resilient against ransomware attacks and helps organizations defeat ransomware attack techniques. For a comprehensive view of ransomware and extortion and how to protect your organization, use the information in the [Human-Operated Ransomware Mitigation Project Plan](https://download.microsoft.com/download/7/5/1/751682ca-5aae-405b-afa0-e4832138e436/RansomwareRecommendations.pptx) PowerPoint presentation.

You should assume that at some point in time you will fall victim to a ransomware attack. One of the most important steps you can take to protect your data and avoid paying a ransom is to have a reliable backup and restore plan for your business-critical information. Since ransomware attackers have invested heavily into neutralizing backup applications and operating system features like volume shadow copy, it is critical to have backups that are inaccessible to a malicious attacker.

### Azure Backup

[Azure Backup](../../backup/backup-overview.md) provides security to your backup environment, both when your data is in transit and at rest. With Azure Backup, [you can back up](../../backup/backup-overview.md#what-can-i-back-up):

- On-premises files, folders, and system state
- Entire Windows/Linux VMs
- Azure Managed Disks
- Azure file shares to a storage account
- SQL Server databases running on Azure VMs

The backup data is stored in Azure storage and the guest or attacker has no direct access to backup storage or its contents. With virtual machine backup, the backup snapshot creation and storage is done by Azure fabric where the guest or attacker has no involvement other than quiescing the workload for application consistent backups. With SQL and SAP HANA, the backup extension gets temporary access to write to specific blobs. In this way, even in a compromised environment, existing backups can't be tampered with or deleted by the attacker.

Azure Backup provides built-in monitoring and alerting capabilities to view and configure actions for events related to Azure Backup. Backup Reports serve as a one-stop destination for tracking usage, auditing of backups and restores, and identifying key trends at different levels of granularity. Using Azure Backup's monitoring and reporting tools can alert you to any unauthorized, suspicious, or malicious activity as soon as they occur.

Checks have been added to make sure only valid users can perform various operations. These include adding an extra layer of authentication. As part of adding an extra layer of authentication for critical operations, you're prompted to enter a security PIN before [modifying online backups](../../backup/backup-azure-security-feature.md#prevent-attacks).

Learn more about the [security features](../../backup/security-overview.md) built into Azure Backup.

### Validate backups

Validate that your backup is good as your backup is created and before you restore. We recommend that you use a [Recovery Services vault](../../backup/backup-azure-recovery-services-vault-overview.md), which is a storage entity in Azure that houses data. The data is typically copies of data, or configuration information for virtual machines (VMs), workloads, servers, or workstations. You can use Recovery Services vaults to hold backup data for various Azure services such as IaaS VMs (Linux or Windows) and Azure SQL databases as well as on-premises assets. Recovery Services vaults make it easy to organize your backup data and provide features such as:

- Enhanced capabilities to ensure you can secure your backups, and safely recover data, even if production and backup servers are compromised. [Learn more](../../backup/backup-azure-security-feature.md).
- Monitoring for your hybrid IT environment (Azure IaaS VMs and on-premises assets) from a central portal. [Learn more](../../backup/backup-azure-monitoring-built-in-monitor.md).
- Compatibility with Azure role-based access control (Azure RBAC), which restricts backup and restore access to a defined set of user roles. Azure RBAC provides various built-in roles, and Azure Backup has three built-in roles to manage recovery points. [Learn more](../../backup/backup-rbac-rs-vault.md).
- Soft delete protection, even if a malicious actor deletes a backup (or backup data is accidentally deleted). Backup data is retained for 14 additional days, allowing the recovery of a backup item with no data loss. [Learn more](../../backup/backup-azure-security-feature-cloud.md).
- Cross Region Restore which allows you to restore Azure VMs in a secondary region, which is an Azure paired region. You can restore the replicated data in the secondary region any time. This enables you to restore the secondary region data for audit-compliance, and during outage scenarios, without waiting for Azure to declare a disaster (unlike the GRS settings of the vault). [Learn more](../../backup/backup-azure-arm-restore-vms.md#cross-region-restore).

> [!NOTE]
> There are two types of vaults in Azure Backup. In addition to the Recovery Services vaults, there are also [Backup vaults](../../backup/backup-vault-overview.md) that house data for newer workloads supported by Azure Backup.

## What to do before an attack

As mentioned earlier, you should assume that at some point in time you will fall victim to a ransomware attack. Identifying your business-critical systems and applying best practices before an attack will get you back up and running as quickly as possible. 

### Determine what is most important to you

Ransomware can attack while you are planning for an attack so your first priority should be to identify the business-critical systems that are most important to you and begin performing regular backups on those systems.

In our experience, the five most important applications to customers fall into the following categories in this priority order:

- Identity systems – required for users to access any systems (including all others described below) such as Active Directory, [Microsoft Entra Connect](../../active-directory/hybrid/whatis-azure-ad-connect.md), AD domain controllers
- Human life – any system that supports human life or could put it at risk such as medical or life support systems, safety systems (ambulance, dispatch systems, traffic light control), large machinery, chemical/biological systems, production of food or personal products, and others
- Financial systems – systems that process monetary transactions and keep the business operating, such as payment systems and related databases, financial system for quarterly reporting
- Product or service enablement – any systems that are required to provide the business services or produce/deliver physical products that your customers pay you for, factory control systems, product delivery/dispatch systems, and similar
- Security (minimum) – You should also prioritize the security systems required to monitor for attacks and provide minimum security services. This should be focused on ensuring that the current attacks (or easy opportunistic ones) are not immediately able to gain (or regain) access to your restored systems

Your prioritized back up list also becomes your prioritized restore list. Once you’ve identified your critical systems and are performing regular backups, then take steps to reduce your exposure level.

### Steps to take before an attack

Apply these best practices before an attack.

| Task | Detail |
| --- | --- |
| Identify the important systems that you need to bring back online first (using top five categories above) and immediately begin performing regular backups of those systems. | To get back up and running as quickly as possible after an attack, determine today what is most important to you. |
| Migrate your organization to the cloud. <br><br>Consider purchasing a Microsoft Unified Support plan or working with a Microsoft partner to help support your move to the cloud. | Reduce your on-premises exposure by moving data to cloud services with automatic backup and self-service rollback. Microsoft Azure has a robust set of tools to help you back up your business-critical systems and restore your backups faster. <br><br>[Microsoft Unified Support](https://www.microsoft.com/en-us/msservices/unified-support-solutions) is a cloud services support model that is there to help you whenever you need it. Unified Support: <br><br>Provides a designated team that is available 24x7 with as-needed problem resolution and critical incident escalation <br><br>Helps you monitor the health of your IT environment and works proactively to make sure problems are prevented before they happen |
| Move user data to cloud solutions like OneDrive and SharePoint to take advantage of [versioning and recycle bin capabilities](/compliance/assurance/assurance-malware-and-ransomware-protection#sharepoint-online-and-onedrive-for-business-protection-against-ransomware). <br><br>Educate users on how to recover their files by themselves to reduce delays and cost of recovery.   For example, if a user’s OneDrive files were infected by malware, they can [restore](https://support.microsoft.com/office/restore-your-onedrive-fa231298-759d-41cf-bcd0-25ac53eb8a15?ui=en-US&rs=en-US&ad=US) their entire OneDrive to a previous time. <br><br>Consider a defense strategy, such as [Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-365-defender), before allowing users to restore their own files. | User data in the Microsoft cloud can be protected by built-in security and data management features. <br><br>It's good to teach users how to restore their own files but you need to be careful that your users do not restore the malware used to carry out the attack. You need to: <br><br>Ensure your users don't restore their files until you are confident that the attacker has been evicted <br><br>Have a mitigation in place in case a user does restore some of the malware <br><br>Microsoft Defender XDR uses AI-powered automatic actions and playbooks to remediate impacted assets back to a secure state. Microsoft Defender XDR leverages automatic remediation capabilities of the suite products to ensure all impacted assets related to an incident are automatically remediated where possible. |
| Implement the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction). | The Microsoft cloud security benchmark is our security control framework based on industry-based security control frameworks such as NIST SP800-53, CIS Controls v7.1. It provides organizations guidance on how to configure Azure and Azure services and implement the security controls. See [Backup and Recovery](/security/benchmark/azure/security-controls-v3-backup-recovery). |
| Regularly exercise your business continuity/disaster recovery (BC/DR) plan. <br><br>Simulate incident response scenarios. Exercises you perform in preparing for an attack should be planned and conducted around your prioritized backup and restore lists. <br><br>Regularly test ‘Recover from Zero’ scenario to ensure your BC/DR can rapidly bring critical business operations online from zero functionality (all systems down). | Ensures rapid recovery of business operations by treating a ransomware or extortion attack with the same importance as a natural disaster. <br><br>Conduct practice exercise(s) to validate cross-team processes and technical procedures, including out of band employee and customer communications (assume all email and chat is down). |
| Consider creating a risk register to identify potential risks and address how you will mediate through preventative controls and actions. Add ransomware to risk register as high likelihood and high impact scenario. | A risk register can help you prioritize risks based on the likelihood of that risk occurring and the severity to your business should that risk occur. <br><br>Track mitigation status via [Enterprise Risk Management (ERM)](/compliance/assurance/assurance-risk-management) assessment cycle. |
| Back up all critical business systems automatically on a regular schedule (including backup of critical dependencies like Active Directory). <br><br>Validate that your backup is good as your backup is created. | Allows you to recover data up to the last backup. |
| Protect (or print) supporting documents and systems required for recovery such as restoration procedure documents, CMDB, network diagrams, and SolarWinds instances. | Attackers deliberately target these resources because it impacts your ability to recover. |
| Ensure you have well-documented procedures for engaging any third-party support, particularly support from threat intelligence providers, antimalware solution providers, and from the malware analysis provider. Protect (or print) these procedures. | Third-party contacts may be useful if the given ransomware variant has known weaknesses or decryption tools are available. |
| Ensure backup and recovery strategy includes: <br><br>Ability to back up data to a specific point in time. <br><br>Multiple copies of backups are stored in isolated, offline (air-gapped) locations. <br><br>Recovery time objectives that establish how quickly backed up information can be retrieved and put into production environment. <br><br>Rapid restore of back up to a production environment/sandbox. | Backups are essential for resilience after an organization has been breached. Apply the 3-2-1 rule for maximum protection and availability: 3 copies (original + 2 backups), 2 storage types, and 1 offsite or cold copy. |
| Protect backups against deliberate erasure and encryption: <br><br>Store backups in offline or off-site storage and/or immutable storage. <br><br>Require out of band steps (such as [MFA](../../active-directory/authentication/concept-mfa-howitworks.md) or a security PIN) before permitting an online backup to be modified or erased. <br><br>Create private endpoints within your Azure Virtual Network to securely back up and restore data from your Recovery Services vault. | Backups that are accessible by attackers can be rendered unusable for business recovery. <br><br>Offline storage ensures robust transfer of backup data without using any network bandwidth. Azure Backup supports [offline backup](../../backup/offline-backup-overview.md), which transfers initial backup data offline, without the use of network bandwidth. It provides a mechanism to copy backup data onto physical storage devices. The devices are then shipped to a nearby Azure datacenter and uploaded onto a [Recovery Services vault](../../backup/backup-azure-recovery-services-vault-overview.md). <br><br>Online immutable storage (such as [Azure Blob](../../storage/blobs/immutable-storage-overview.md)) enables you to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. <br><br>[Multifactor authentication (MFA)](../../active-directory/authentication/concept-mfa-howitworks.md) should be mandatory for all admin accounts and is strongly recommended for all users. The preferred method is to use an authenticator app rather than SMS or voice where possible. When you set up Azure Backup you can configure your recovery services to enable MFA using a security PIN generated in the Azure portal. This ensures that a security pin is generated to perform critical operations such as updating or removing a recovery point. |
| Designate [protected folders](/windows/security/threat-protection/microsoft-defender-atp/controlled-folders). | Makes it more difficult for unauthorized applications to modify the data in these folders. |
| Review your permissions: <br><br>Discover broad write/delete permissions on file shares, SharePoint, and other solutions. Broad is defined as many users having write/delete permissions for business-critical data. <br><br>Reduce broad permissions while meeting business collaboration requirements. <br><br>Audit and monitor to ensure broad permissions don’t reappear. | Reduces risk from broad access-enabling ransomware activities. |
| Protect against a phishing attempt: <br><br>Conduct security awareness training regularly to help users identify a phishing attempt and avoid clicking on something that can create an initial entry point for a compromise. <br><br>Apply security filtering controls to email to detect and minimize the likelihood of a successful phishing attempt. | The most common method used by attackers to infiltrate an organization is phishing attempts via email. [Exchange Online Protection (EOP)](/microsoft-365/security/office-365-security/exchange-online-protection-overview) is the cloud-based filtering service that protects your organization against spam, malware, and other email threats. EOP is included in all Microsoft 365 organizations with Exchange Online mailboxes. <br><br>An example of a security filtering control for email is [Safe Links](/microsoft-365/security/office-365-security/safe-links). Safe Links is a feature in Defender for Office 365 that provides scanning and rewriting of URLs and links in email messages during inbound mail flow, and time-of-click verification of URLs and links in email messages and other locations (Microsoft Teams and Office documents). Safe Links scanning occurs in addition to the regular anti-spam and anti-malware protection in inbound email messages in EOP. Safe Links scanning can help protect your organization from malicious links that are used in phishing and other attacks. <br><br>Learn more about [anti-phishing protection](/microsoft-365/security/office-365-security/tuning-anti-phishing). |

## What to do during an attack

If you are attacked, your prioritized back up list becomes your prioritized restore list. Before you restore, validate again that your backup is good. You may be able to look for malware inside the backup.

### Steps to take during an attack

Apply these best practices during an attack.

| Task | Detail |
| --- | --- |
| Early in the attack, engage third-party support, particularly support from threat intelligence providers, antimalware solution providers and from the malware analysis provider. | These contacts may be useful if the given ransomware variant has a known weakness or decryption tools are available. <br><br>[Microsoft Detection and Response Team (DART)](https://www.microsoft.com/security/blog/2019/03/25/dart-the-microsoft-cybersecurity-team-we-hope-you-never-meet/) can help protect you from attacks. The DART engages with customers around the world, helping to protect and harden against attacks before they occur, as well as investigating and remediating when an attack has occurred. <br><br>Microsoft also provides Rapid Ransomware Recovery services. Services are exclusively delivered by the Microsoft Global [Compromise Recovery Security Practice (CRSP)](https://www.microsoft.com/security/blog/2021/06/09/crsp-the-emergency-team-fighting-cyber-attacks-beside-customers/). The focus of this team during a ransomware attack is to restore authentication service and limit the impact of ransomware. <br><br>DART and CRSP are part of Microsoft’s [Industry Solutions Delivery](https://www.microsoft.com/en-us/msservices/security) security service line. |
| Contact your local or federal law enforcement agencies. | If you are in the United States, contact the FBI to report a ransomware breach using the [IC3 Complaint Referral Form](https://ransomware.ic3.gov/default.aspx). |
| Take steps to remove malware or ransomware payload from your environment and stop the spread. <br><br>Run a full, current antivirus scan on all suspected computers and devices to detect and remove the payload that's associated with the ransomware. <br><br>Scan devices that are synchronizing data, or the targets of mapped network drives. | You can use [Windows Defender](https://www.microsoft.com/windows/comprehensive-security) or (for older clients) [Microsoft Security Essentials](https://www.microsoft.com/download/details.aspx?id=5201). <br><br>An alternative that will also help you remove ransomware or malware is the [Malicious Software Removal Tool (MSRT)](https://www.microsoft.com/download/details.aspx?id=9905). |
| Restore business-critical systems first. Remember to validate again that your backup is good before you restore.| At this point, you don’t need to restore everything. Focus on the top five business-critical systems from your restore list. |
| If you have offline backups, you can probably restore the encrypted data **after** you've removed the ransomware payload (malware) from your environment. | To prevent future attacks, ensure ransomware or malware is not on your offline backup before restoring. |
| Identify a safe point-in-time backup image that is known not to be infected. <br><br>If you use Recovery Services vault, carefully review the incident timeline to understand the right point-in-time to restore a backup. | To prevent future attacks, scan backup for ransomware or malware before restoring. |
| Use a safety scanner and other tools for full operating system restore as well as data restore scenarios. | [Microsoft Safety Scanner](/windows/security/threat-protection/intelligence/safety-scanner-download) is a scan tool designed to find and remove malware from Windows computers. Simply download it and run a scan to find malware and try to reverse changes made by identified threats. |
| Ensure that your antivirus or endpoint detection and response (EDR) solution is up to date. You also need to have up-to-date patches. | An EDR solution, such as [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint), is preferred. |
| After business-critical systems are up and running, restore other systems. <br><br>As systems get restored, start collecting telemetry data so you can make formative decisions about what you are restoring. | Telemetry data should help you identify if malware is still on your systems. |

## Post attack or simulation

After a ransomware attack or an incident response simulation, take the following steps to improve your backup and restore plans as well as your security posture:

1. Identify lessons learned where the process did not work well (and opportunities to simplify, accelerate, or otherwise improve the process)
2. Perform root cause analysis on the biggest challenges (at enough detail to ensure solutions address the right problem — considering people, process, and technology)
3. Investigate and remediate the original breach (engage the [Microsoft Detection and Response Team (DART)](https://www.microsoft.com/security/blog/2019/03/25/dart-the-microsoft-cybersecurity-team-we-hope-you-never-meet/) to help)
4. Update your backup and restore strategy based on lessons learned and opportunities — prioritizing based on highest impact and quickest implementation steps first

## Next steps

In this article, you learned how to improve your backup and restore plan to protect against ransomware. For best practices on deploying ransomware protection, see [Rapidly protect against ransomware and extortion](/security/compass/protect-against-ransomware).

Key industry information:

- [2021 Microsoft Digital Defense Report](https://www.microsoft.com/security/business/microsoft-digital-defense-report) (see pages 10-19)

Microsoft Azure:

- [Help protect from ransomware with Microsoft Azure Backup](https://www.youtube.com/watch?v=VhLOr2_1MCg) (26 minute video)
- [Recovering from systemic identity compromise](./recover-from-identity-compromise.md)
- [Advanced multistage attack detection in Microsoft Sentinel](../../sentinel/fusion.md#fusion-for-ransomware)

Microsoft 365:

- [Recover from a ransomware attack](/microsoft-365/security/office-365-security/recover-from-ransomware)
- [Malware and ransomware protection](/compliance/assurance/assurance-malware-and-ransomware-protection)
- [Protect your Windows 10 PC from ransomware](https://support.microsoft.com/windows/protect-your-pc-from-ransomware-08ed68a7-939f-726c-7e84-a72ba92c01c3)
- [Handling ransomware in SharePoint Online](/sharepoint/troubleshoot/security/handling-ransomware-in-sharepoint-online)

Microsoft Defender XDR:

- [Find ransomware with advanced hunting](/microsoft-365/security/defender/advanced-hunting-find-ransomware)

Microsoft Security team blog posts:

- [Becoming resilient by understanding cybersecurity risks: Part 4, navigating current threats (May 2021)](https://www.microsoft.com/security/blog/2021/05/26/becoming-resilient-by-understanding-cybersecurity-risks-part-4-navigating-current-threats/). See the Ransomware section
- [Human-operated ransomware attacks: A preventable disaster (March 2020)](https://www.microsoft.com/security/blog/2020/03/05/human-operated-ransomware-attacks-a-preventable-disaster/). Includes attack chain analysis of actual human-operated ransomware attacks
- [Ransomware response — to pay or not to pay? (December 2019)](https://www.microsoft.com/security/blog/2019/12/16/ransomware-response-to-pay-or-not-to-pay/)
- [Norsk Hydro responds to ransomware attack with transparency (December 2019)](https://www.microsoft.com/security/blog/2019/12/17/norsk-hydro-ransomware-attack-transparency/)
