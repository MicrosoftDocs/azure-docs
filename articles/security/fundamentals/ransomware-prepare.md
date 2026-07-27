---
title: Prepare for a ransomware attack
description: Learn how to prepare for ransomware attacks with Azure-specific security controls, backup planning, and recovery guidance.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ai-usage: ai-assisted
ms.date: 05/05/2026
---

# Prepare for a ransomware attack

This article provides Azure-specific guidance for preparing your organization to defend against and recover from ransomware attacks.

> [!TIP]
> This article focuses on Azure-specific preparation. For comprehensive guidance, see [Protect your organization against ransomware and extortion](/security/ransomware/protect-against-ransomware).

## Adopt a cybersecurity framework

A good place to start is to adopt the [Microsoft cloud security benchmark (MCSB)](/security/benchmark/azure) to secure the Azure environment. The Microsoft cloud security benchmark is the Azure security control framework, based on industry-based security control frameworks such as NIST SP800-53, CIS Controls v7.1.

:::image type="content" source="./media/ransomware/ransomware-13.png" alt-text="Screenshot of the NS-1: Establish Network Segmentation Boundaries security control":::

The Microsoft cloud security benchmark provides organizations guidance on how to configure Azure and Azure services and implement the security controls. Organizations can use [Microsoft Defender for Cloud](/azure/defender-for-cloud/) to monitor their live Azure environment status with all the MCSB controls.

Ultimately, the framework aims to reduce and better manage cybersecurity risks.

| Microsoft cloud security benchmark stack |
|--|
| [Network&nbsp;security&nbsp;(NS)](/security/benchmark/azure/mcsb-v2-network-security) |
| [Identity&nbsp;Management&nbsp;(IM)](/security/benchmark/azure/mcsb-v2-identity-management) |
| [Privileged&nbsp;Access&nbsp;(PA)](/security/benchmark/azure/mcsb-v2-privileged-access) |
| [Data&nbsp;Protection&nbsp;(DP)](/security/benchmark/azure/mcsb-v2-data-protection) |
| [Asset&nbsp;Management&nbsp;(AM)](/security/benchmark/azure/mcsb-v2-asset-management) |
| [Logging&nbsp;and&nbsp;Threat&nbsp;Detection (LT)](/security/benchmark/azure/mcsb-v2-logging-threat-detection) |
| [Incident&nbsp;Response&nbsp;(IR)](/security/benchmark/azure/mcsb-v2-incident-response) |
| [Posture&nbsp;and&nbsp;Vulnerability&nbsp;Management&nbsp;(PV)](/security/benchmark/azure/mcsb-v2-posture-vulnerability-management) |
| [Endpoint&nbsp;Security&nbsp;(ES)](/security/benchmark/azure/mcsb-v2-endpoint-security) |
| [Backup&nbsp;and&nbsp;Recovery&nbsp;(BR)](/security/benchmark/azure/mcsb-v2-backup-recovery) |
| [DevOps&nbsp;Security&nbsp;(DS)](/security/benchmark/azure/mcsb-v2-devop-security) |
| [Governance&nbsp;and&nbsp;Strategy&nbsp;(GS)](/security/benchmark/azure/mcsb-governance-strategy) |

## Azure technical controls for ransomware protection

Azure provides a wide variety of native technical controls to protect, detect, and respond to ransomware incidents with emphasis on prevention. If your organization runs workloads in Azure, use these Azure-native capabilities:

### Detection and prevention tools for Azure

- **[Microsoft Defender for Cloud](/azure/defender-for-cloud/)** - Unified security management that provides threat protection for Azure workloads, including VMs, containers, databases, and storage
- **[Azure Firewall Premium](../../firewall/premium-features.md)** - Next-generation firewall with IDPS capabilities to detect and block ransomware C&C communications
- **[Microsoft Sentinel](/azure/sentinel/)** - Cloud-native SIEM/SOAR platform with built-in ransomware detection analytics and automated response
- **[Azure Network Watcher](../../network-watcher/index.yml)** - Network monitoring and diagnostics to detect anomalous traffic patterns
- **[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/)** - Protection for Azure VMs running Windows or Linux

### Data protection for Azure resources

- **[Azure Backup](../../backup/index.yml)** with immutability and soft delete for Azure VMs, SQL databases, and file shares
- **[Azure Storage immutable blobs](../../storage/blobs/immutable-storage-overview.md)** - WORM (Write Once, Read Many) storage that attackers can't modify or delete
- **[Azure role-based access control (RBAC)](../../role-based-access-control/index.yml)** - Principle of least privilege for Azure resource access
- **[Azure Policy](../../governance/policy/index.yml)** - Enforce backup policies and security configurations across Azure subscriptions
- **Regular backup verification** by using Azure Site Recovery for disaster recovery testing

For comprehensive incident handling guidance, see [Prepare your ransomware recovery plan](/security/ransomware/protect-against-ransomware-phase1).

## Azure backup and recovery capabilities

Make sure appropriate processes and procedures are in place for Azure workloads. Almost all ransomware incidents result in the need to restore compromised systems. Use appropriate and tested backup and restore processes for Azure resources, along with suitable containment strategies to stop ransomware from spreading.

The Azure platform provides multiple backup and recovery options through Azure Backup and built-in capabilities within various Azure data services and workloads:

### Isolated backups with Azure Backup

[Azure Backup](../../backup/backup-azure-security-feature.md#prevent-attacks) provides immutable, isolated backups with soft delete and MFA protection for:
- Azure Virtual Machines
- Databases in Azure VMs: SQL, SAP HANA
- Azure Database for PostgreSQL
- On-premises Windows Servers that back up to the cloud by using the MARS agent

### Operational backups

- **Azure Files** - Share snapshots with point-in-time restore
- **Azure Blobs** - Soft delete, versioning, and immutable storage
- **Azure Disks** - Incremental snapshots

### Built-in backups from Azure data services

Data services like Azure SQL Database, Azure Database for MySQL/MariaDB/PostgreSQL, Azure Cosmos DB, and Azure NetApp Files offer built-in backup capabilities with automated schedules.

For detailed guidance, see [Backup and restore plan to protect against ransomware](backup-plan-to-protect-against-ransomware.md).

## What's next

For comprehensive ransomware protection guidance across all Microsoft platforms and services, see [Protect your organization against ransomware and extortion](/security/ransomware/protect-against-ransomware).

Other Azure ransomware articles:

- [Ransomware protection in Azure](ransomware-protection.md)
- [Detect and respond to ransomware attack](ransomware-detect-respond.md)
- [Azure features and resources that help you protect, detect, and respond](ransomware-features-resources.md)
- [Improve your security defenses for ransomware attacks with Azure Firewall Premium](ransomware-protection-with-azure-firewall.md)
