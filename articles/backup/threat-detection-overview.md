---
title: Threat Detection in Azure Backup with Microsoft Defender for Cloud Integration
description: Learn about threat detection for Azure VM backups, a feature that helps identify ransomware-infected restore points by using Microsoft Defender for Cloud.
#customer intent: As an IT admin, I want to enable threat detection for Azure VM backups so that I can identify and mitigate ransomware threats in restore points.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 11/12/2026
ms.topic: overview
ms.service: azure-backup
ms.custom: references_regions
---

# Threat detection in Azure Backup with Microsoft Defender for Cloud integration (preview)

Azure Backup integrates with Microsoft Defender for Cloud to offer advanced threat detection for Azure virtual machine (VM) backups. You can use this feature to assess the health of backup restore points by identifying potentially malicious or ransomware-infected backups.

Defender for Cloud detects threats on the source VM through Defender for Servers. Azure Backup uses the resulting alerts to flag potentially affected recovery points. Source-scan integration is alert-driven; it doesn't independently scan the recovery-point blobs stored in the vault for malware.

## Key benefits

Threat detection for Azure VM backups includes the following benefits:

- **Proactive threat identification**: Threat detection configuration at the vault level automatically identifies compromised restore points across all VM backups in the vault. This automatic identification enhances recovery confidence during a ransomware attack.

- **Faster recovery**: The feature can reduce time to recover by quickly identifying clean restore points that are suitable for ransomware recovery.

- **Seamless integration**: The feature works natively with [Defender for Servers Plan 1 and Plan 2](/azure/defender-for-cloud/defender-for-servers-overview#plan-protection-features) to provide a unified and consistent security experience across Azure workloads.

## How source-scan integration works

Source-scan integration depends on security alerts from Defender for Cloud for the source VM. Azure Backup tags recovery points based on those alerts, rather than inspecting backup content independently. Without a corresponding Defender for Cloud alert, source-scan integration doesn't flag a recovery point as **Suspicious**.

Defender protection on the live VM and source-scan integration serve different purposes. Remediating malware on the VM doesn't remove potentially malicious content from recovery points that were already created. Source-scan status helps you assess which recovery points to use during restore and reduce the risk of reintroducing malware. A **No Threats Reported** status means that no threats were reported through the integration, not that Azure Backup independently verified the backup content as malware-free.

For the configuration and validation steps, see [Configure threat detection and monitor backup health](threat-detection-configure-monitor-tutorial.md). For how unresolved alerts affect later recovery points, see [Resolve threats and ensure healthy backups](threat-detection-configure-monitor-tutorial.md#resolve-threats-and-ensure-healthy-backups).

## Source-scan status for Azure VM backups

You can use the Azure portal to monitor the status of source scans for Azure VM backups. There are two status categories: configuration and summary.

### Configuration statuses

The following table describes the available configuration statuses for source scans in Azure VM backups:

| Status | Description                                                                                                      |
|--------------------------|------------------------------------------------------------------------------------------------------------------|
| **Configured**           | Source-scan integration with Defender for Cloud is successfully configured for the protected items in the vault.  |
| **Not Configured**       | Source-scan integration with Defender for Cloud isn't yet configured for the protected items in the vault.     |
| **Configuration Failed** | Source-scan integration with Defender for Cloud failed due to configuration errors. |
| **Not Applicable**       | Defender for Servers plans are downgraded after configuration. |

### Summary statuses

The following table describes the available summary statuses for source scans in Azure VM backups:

| Status   | Description |
|-----------------------|-------------|
| **No Threats Reported**   | No Defender for Cloud alerts on the source VM flagged the backup recovery point (RP) as suspicious.<br><br>If all RPs for a backup item in the last seven days show no threats, the backup item is marked as **No Threats Reported**. |
| **Suspicious RPs found**  | Defender for Cloud alerts on the source VM caused Azure Backup to flag a backup RP as suspicious.<br><br>If a minimum of one backup RP is found to be suspicious in the last seven days, the summary for the backup item is marked as **Suspicious RPs Found**. |
| **Not Applicable**        | If the Defender for Servers plan is downgraded for the source virtual machine, the status for the RP is marked as **Not Applicable**.<br><br>If all RPs for a backup item aren't applicable in the last seven days, the summary is marked as **Not Applicable**. |
| **Unknown (-)**           | Source-scan integration isn't configured or failed. The summary for both backup RPs and the backup item is marked as **Unknown (-)**. |

## Supported regions for threat detection for Azure VM backups

Threat detection for Azure VM backups is available in preview in all Azure public regions except these regions: UAE Central, Israel Central, Qatar Central and Israel North West.

## Limitations and known issues

The preview feature has the following limitations and known issues:

- **Re-registration to multiple vaults**: When a virtual machine is configured to back up with multiple vaults, the threat detection feature shows only one vault name. The source-side scan status and summary show aggregated values across all protected items. However, you can view the scan details for each vault under **Protected items**.

- **Update for active ransomware alerts**: After you enable threat detection, if the VM has any active ransomware alerts, the backup scan summary might take up to 48 hours to correctly update the status to **Suspicious**.

- **Defender for Cloud pricing disabled for a VM or subscription**: When you disable Defender for Cloud pricing for a virtual machine or subscription, the protected item's status changes to **Configuration Failed**. Subsequent backups appear in an **Unknown (-)** state, and the source-scan summary for the protected item appears as **Unknown**.

## Related content

- [Configure threat detection and manage the health of Azure VM backups (preview)](threat-detection-configure-monitor-tutorial.md)
