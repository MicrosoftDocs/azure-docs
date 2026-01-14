---
title: About Threat Detection in Azure Backup with Microsoft Defender for Cloud integration
description: Learn about threat detection for Azure VM backups, a feature that helps identify ransomware-infected restore points using Microsoft Defender for Cloud.
#customer intent: As an IT admin, I want to enable threat detection for Azure VM backups so that I can identify and mitigate ransomware threats in restore points.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 11/10/2025
ms.topic: tutorial
ms.service: azure-backup
ms.custom: references_regions
---

# Threat Detection in Azure Backup with Microsoft Defender for Cloud integration (preview)

This article provides an overview of the Threat Detection feature for Azure Virtual Machine (VM) backups, which is integrated with Microsoft Defender for Cloud (MDC). 

Azure Backup integrates with Microsoft Defender for Cloud (MDC) to offer advanced threat detection for Azure Virtual Machine (VM) backups. This feature allows you to assess the health of backup restore points by identifying potentially malicious or ransomware-infected backups.

With security signals from Microsoft Defender for Servers, Azure Backup detects compromise indicators such as disruption patterns, behavioral anomalies, and ransomware signatures. Microsoft Defender for Cloud scans the source virtual machine for malware, and Azure Backup evaluates restore point health using these signals when creating the backup snapshot.


## Key benefits of Threat Detection for Azure VM Backups

Threat detection for Azure VM backups includes the following benefits:

- **Proactive threat identification:** Threat detection Configuration at the vault level automatically identifies compromised restore points across all VM backups in the vault, which enhances recovery confidence during a ransomware attack scenario.

- **Faster recovery:** Reduced time to recover by quickly identifying clean restore points that are suitable for ransomware recovery.

- **Seamless integration:** Works natively with [Microsoft Defender for Servers Plan 1 and Plan 2](/azure/defender-for-cloud/defender-for-servers-overview#plan-protection-features), ensuring a unified and consistent security experience across Azure workloads.

## Source scan status for Azure VM Backups

You can monitor the threat detection status for Azure VM backups in the Azure portal. The threat detection status includes two components - **Configuration Status** and **Summary Status**.

### Configuration status

The following table describes the available source scan configuration statuses for Azure VM backups:

| Status | Description                                                                                                      |
|--------------------------|------------------------------------------------------------------------------------------------------------------|
| **Configured**           | Source-scan integration with Microsoft Defender for Cloud is successfully configured for the protected items in the vault.  |
| **Not Configured**       | Source-scan integration with Microsoft Defender for Cloud isn't yet configured for the protected items in the vault.     |
| **Configuration Failed** | Source-scan integration with Microsoft Defender for Cloud failed due to configuration errors. |
| **Not Applicable**       | Plans for Defender for Servers are downgraded post-configuration. |

### Summary status

The following table describes the available source scan summary statuses for Azure VM backups:

| Source Scan Summary   | Description |
|-----------------------|-------------|
| **No Threats Reported**   | Microsoft Defender for Cloud didn't find any malware or ransomware threats for a backup recovery point.<br><br>If all recovery points (RPs) for a backup item in the last seven days show no threats, the backup item is marked as **No Threats Reported**. |
| **Suspicious RPs found**  | Microsoft Defender for Cloud detected ransomware or malware threats for a backup recovery point.<br><br>If a minimum of one backup recovery point (RP) is found suspicious in the last seven days, the summary for the backup item is marked as **Suspicious RPs Found**. |
| **Not Applicable**        | If the Defender for Servers Plan is downgraded for the source virtual machine, the status for the recovery point is marked as **Not Applicable**.<br><br>If all backup RPs for a backup item aren't applicable in the last seven days, the summary is marked as  **Not Applicable**. |
| **Unknown (-)**           | Source scan integration isn't configured or failed. The summary for both backup recovery points and the backup item is marked as **Unknown (-)**. |

## Supported regions for Threat Detection for Azure VM Backups

This feature is available in public preview in limited regions: West Central US, Australia East, North Europe, Switzerland North, West Europe, Central US, East US, East US2, West US, UK South, UK West, Canada Central.

## Limitations and known issues

This preview feature has the following limitations and known issues:

- **Re-registration to Multiple Vaults**: When a virtual machine is configured to back up with multiple vaults, the threat detection feature shows only one vault name, and the source-side scan status and summary show aggregated values across all protected items. However, you can view the scan details for a respective vault under **Protected items**.
- **Update for Active Ransomware Alerts**: After the threat detection is enabled, if the VM has any active ransomware alerts, the backup scan summary might take up to 48 hours to correctly update and reflect as **Suspicious**.

- **MDC Pricing Disabled for VM or Subscription:** When you disable Microsoft Defender for Cloud (MDC) pricing for a virtual machine or subscription, the protected item status changes to **Configuration Failed**. Subsequent backups appear in an **Unknown (-)** state, and the source scan summary for the protected item appears as **Unknown**.

## Next steps

[Configure Threat Detection and manage health of Azure VM Backups (preview)](threat-detection-configure-monitor-tutorial.md).

