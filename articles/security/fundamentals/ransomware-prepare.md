---
title: Prepare for a ransomware attack
description: Prepare for a ransomware attack with Azure-specific guidance
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 01/06/2026
---

# Prepare for a ransomware attack

This article provides Azure-specific guidance for preparing your organization to defend against and recover from ransomware attacks.

> [!TIP]
> This article focuses specifically on Azure capabilities and best practices. For comprehensive ransomware preparation guidance across all Microsoft platforms and services, see [Prepare your ransomware recovery plan](/security/ransomware/protect-against-ransomware-phase1).

## Adopt a Cybersecurity framework

A good place to start is to adopt the [Microsoft cloud security benchmark (MCSB)](/security/benchmark/azure) to secure the Azure environment. The Microsoft cloud security benchmark is the Azure security control framework, based on industry-based security control frameworks such as NIST SP800-53, CIS Controls v7.1.

:::image type="content" source="./media/ransomware/ransomware-13.png" alt-text="Screenshot of the NS-1: Establish Network Segmentation Boundaries security control":::

The Microsoft cloud security benchmark provides organizations guidance on how to configure Azure and Azure Services and implement the security controls. Organizations can use [Microsoft Defender for Cloud](/azure/defender-for-cloud/) to monitor their live Azure environment status with all the MCSB controls.

Ultimately, the Framework is aimed at reducing and better managing cybersecurity risks.

| Microsoft cloud security benchmark stack |
|--|
| [Network&nbsp;security&nbsp;(NS)](/security/benchmark/azure/mcsb-network-security) |
| [Identity&nbsp;Management&nbsp;(IM)](/security/benchmark/azure/mcsb-identity-management) |
| [Privileged&nbsp;Access&nbsp;(PA)](/security/benchmark/azure/mcsb-privileged-access) |
| [Data&nbsp;Protection&nbsp;(DP)](/security/benchmark/azure/mcsb-data-protection) |
| [Asset&nbsp;Management&nbsp;(AM)](/security/benchmark/azure/mcsb-asset-management) |
| [Logging&nbsp;and&nbsp;Threat&nbsp;Detection (LT)](/security/benchmark/azure/security-controls-v2-logging-threat-detection) |
| [Incident&nbsp;Response&nbsp;(IR)](/security/benchmark/azure/mcsb-incident-response) |
| [Posture&nbsp;and&nbsp;Vulnerability&nbsp;Management&nbsp;(PV)](/security/benchmark/azure/mcsb-posture-vulnerability-management) |
| [Endpoint&nbsp;Security&nbsp;(ES)](/security/benchmark/azure/mcsb-endpoint-security) |
| [Backup&nbsp;and&nbsp;Recovery&nbsp;(BR)](/security/benchmark/azure/mcsb-backup-recovery) |
| [DevOps&nbsp;Security&nbsp;(DS)](/security/benchmark/azure/mcsb-devops-security) |
| [Governance&nbsp;and&nbsp;Strategy&nbsp;(GS)](/security/benchmark/azure/mcsb-governance-strategy) |

## Prioritize mitigation

Based on our experience with ransomware attacks on Azure environments, we find that prioritization should focus on:
1. Prepare - Have backups and recovery plans for your Azure resources
1. Limit - Protect privileged access to Azure resources
1. Prevent - Harden Azure security controls
 
This may seem counterintuitive, since most people want to prevent an attack and move on. Unfortunately, we must assume breach (a key Zero Trust principle) and focus on reliably mitigating the most damage first. This prioritization is critical because of the high likelihood of a worst-case scenario with ransomware. While it's not a pleasant truth to accept, we're facing creative and motivated human attackers who are adept at finding a way to control the complex real-world environments in which we operate. Against that reality, it's important to prepare for the worst and establish frameworks to contain and prevent attackers' ability to get what they're after.

While these priorities should govern what to do first, we encourage organizations to run steps in parallel where possible, including pulling quick wins forward from step 1 when you can.

For comprehensive guidance on the three-phase approach to ransomware protection, see [Protect your organization against ransomware and extortion](/security/ransomware/protect-against-ransomware).

## Make it harder to get in

Prevent a ransomware attacker from entering your Azure environment and rapidly respond to incidents to remove attacker access before they can steal and encrypt data. This causes attackers to fail earlier and more often, undermining the profit of their attacks. While prevention is the preferred outcome, it's a continuous journey and may not be possible to achieve 100% prevention and rapid response across a real-world organization's complex multi-platform and multicloud estate with distributed IT responsibilities.

To achieve this, organizations should identify and execute quick wins to strengthen security controls for their Azure resources to prevent entry, and rapidly detect/evict attackers while implementing a sustained program that helps them stay secure. Microsoft recommends organizations follow the principles outlined in the Zero Trust strategy. Specifically, for Azure resources, organizations should prioritize:
- Improving security hygiene by focusing efforts on attack surface reduction and threat and vulnerability management for Azure resources. 
- Implementing Protection, Detection and Response controls for Azure workloads that can protect against commodity and advanced threats, provide visibility, and alerting on attacker activity and respond to active threats.

For comprehensive guidance on making it harder for attackers to access your environment, see [Defend against ransomware attacks](/security/ransomware/protect-against-ransomware-phase3).

## Limit scope of damage

Ensure you have strong controls (prevent, detect, respond) for privileged accounts with access to your Azure resources like IT Admins and other roles with control of business-critical systems. This slows and/or blocks attackers from gaining complete access to your Azure resources to steal and encrypt them. Taking away the attackers' ability to use IT Admin accounts as a shortcut to resources drastically lowers the chances they're successful at attacking you and demanding payment / profiting.

Organizations should have elevated security for privileged accounts with Azure access (tightly protect, closely monitor, and rapidly respond to incidents related to these roles). See Microsoft's Security rapid modernization plan, which covers:
- End to End Session Security (including multifactor authentication (MFA) for admins)
- Protect and Monitor Identity Systems
- Mitigate Lateral Traversal
- Rapid Threat Response

For comprehensive guidance on limiting the scope of damage, see [Limit the impact of ransomware attacks](/security/ransomware/protect-against-ransomware-phase2).

## Prepare for the worst

Plan for the worst-case scenario and expect that it happens (at all levels of the organization). This helps your organization and others in the world you depend on:

- Limits damage for the worst-case scenario – While restoring all systems from backups is highly disruptive to business, this is more effective and efficient than trying to recovery using (low quality) attacker-provided decryption tools after paying to get the key. Note: Paying is an uncertain path – You have no formal or legal guarantee that the key works on all files, the tools work effectively, or that the attacker (who may be an amateur affiliate using a professional's toolkit) will act in good faith.
- Limit the financial return for attackers – If an organization can restore business operations without paying the attackers, the attack fails and results in zero return on investment (ROI) for the attackers. This makes it less likely that they'll target the organization in the future (and deprives them of more funding to attack others).

The attackers may still attempt to extort the organization through data disclosure or abusing/selling the stolen data, but this gives them less leverage than if they have the only access path to your data and systems.

To realize this, organizations should ensure they:
- Register Risk - Add ransomware to risk register as high likelihood and high impact scenario. Track mitigation status via Enterprise Risk Management (ERM) assessment cycle.
- Define and Backup Critical Business Assets – Define systems required for critical business operations and automatically back them up on a regular schedule (including correct backup of critical dependencies like Active Directory)
Protect backups against deliberate erasure and encryption with offline storage, immutable storage, and/or out of band steps (MFA or PIN) before modifying/erasing online backups.
- Test 'Recover from Zero' Scenario – test to ensure your business continuity / disaster recovery (BC/DR) can rapidly bring critical business operations online from zero functionality (all systems down). Conduct practice exercises to validate cross-team processes and technical procedures, including out-of-band employee and customer communications (assume all email/chat/etc. is down).  
  It's critical to protect (or print) supporting documents and systems required for recovery including restoration procedure documents, CMDBs, network diagrams, SolarWinds instances, etc. Attackers destroy these regularly.
- Reduce on-premises exposure – by moving data to Azure cloud services with automatic backup & self-service rollback.

For comprehensive guidance on preparing for the worst case scenario, including awareness training and SOC readiness, see [Prepare your ransomware recovery plan](/security/ransomware/protect-against-ransomware-phase1).

## Azure-specific technical controls for ransomware protection

Azure provides a wide variety of native technical controls to protect, detect, and respond to ransomware incidents with emphasis on prevention. Organizations running workloads in Azure should leverage these Azure-native capabilities:

### Detection and prevention tools for Azure

- **[Microsoft Defender for Cloud](/azure/defender-for-cloud/)** - Unified security management providing threat protection for Azure workloads including VMs, containers, databases, and storage
- **[Azure Firewall Premium](../../firewall/premium-features.md)** - Next-generation firewall with IDPS capabilities to detect and block ransomware C&C communications
- **[Microsoft Sentinel](/azure/sentinel/)** - Cloud-native SIEM/SOAR platform with built-in ransomware detection analytics and automated response
- **[Azure Network Watcher](/azure/network-watcher/)** - Network monitoring and diagnostics to detect anomalous traffic patterns
- **[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/)** - For Azure VMs running Windows or Linux

### Data protection for Azure resources

- **[Azure Backup](/azure/backup/)** with immutability and soft delete for Azure VMs, SQL databases, and file shares
- **[Azure Storage immutable blobs](/azure/storage/blobs/immutable-storage-overview)** - WORM (Write Once, Read Many) storage that cannot be modified or deleted
- **[Azure role-based access control (RBAC)](/azure/role-based-access-control/)** - Principle of least privilege for Azure resource access
- **[Azure Policy](/azure/governance/policy/)** - Enforce backup policies and security configurations across Azure subscriptions
- **Regular backup verification** using Azure Site Recovery for disaster recovery testing

For comprehensive incident handling guidance, see [Prepare your ransomware recovery plan](/security/ransomware/protect-against-ransomware-phase1).

## Azure backup and recovery capabilities

Ensure that you have appropriate processes and procedures in place for Azure workloads. Almost all ransomware incidents result in the need to restore compromised systems. Appropriate and tested backup and restore processes should be in place for Azure resources, along with suitable containment strategies to stop ransomware from spreading.

The Azure platform provides multiple backup and recovery options through Azure Backup and built-in capabilities within various Azure data services and workloads:

### Isolated backups with Azure Backup

[Azure Backup](../../backup/backup-azure-security-feature.md#prevent-attacks) provides immutable, isolated backups with soft delete and MFA protection for:
- Azure Virtual Machines
- Databases in Azure VMs: SQL, SAP HANA
- Azure Database for PostgreSQL
- On-premises Windows Servers (back up to cloud using MARS agent)

### Operational backups

- **Azure Files** - Share snapshots with point-in-time restore
- **Azure Blobs** - Soft delete, versioning, and immutable storage
- **Azure Disks** - Incremental snapshots

### Built-in backups from Azure data services

Data services like Azure SQL Database, Azure Database for MySQL/MariaDB/PostgreSQL, Azure Cosmos DB, and Azure NetApp Files offer built-in backup capabilities with automated schedules.

For detailed guidance, see [Backup and restore plan to protect against ransomware](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware).

## What's Next

For comprehensive ransomware protection guidance across all Microsoft platforms and services, see [Protect your organization against ransomware and extortion](/security/ransomware/protect-against-ransomware).

Other Azure ransomware articles:

- [Ransomware protection in Azure](ransomware-protection.md)
- [Detect and respond to ransomware attack](ransomware-detect-respond.md)
- [Azure features and resources that help you protect, detect, and respond](ransomware-features-resources.md)
- [Improve your security defenses for ransomware attacks with Azure Firewall Premium](ransomware-protection-with-azure-firewall.md)
