---
title: Tutorial - Configure Threat Detection and manage health of Azure VM Backups
description: Learn how to enable threat detection for Azure VM backups using Azure Backup. The feature is integrated with Microsoft Defender for Cloud, configure settings, and monitor backup restore point health.
ms.service: azure-backup
ms.date: 11/20/2025
ms.topic: tutorial
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
#customer intent: As an IT admin, I want to enable threat detection for Azure VM backups so that I can identify and mitigate ransomware threats in restore points.

---

# Tutorial: Configure Threat Detection and manage health of Azure VM Backups (preview)

This tutorial describes how to enable threat detection for Azure Virtual Machine (VM) backups and manage them using Azure Backup. This feature is integrated with Microsoft Defender for Cloud, configure settings, and monitor backup restore point health.

Azure Backup now uses Microsoft Defender for Cloud (MDC) to provide threat detection for Azure VM backups. By integrating security signals and malware scans from Defender for Servers, Azure Backup automatically assesses the health of restore points during backup creation. This feature helps you quickly identify and respond to suspicious or ransomware-infected backups, ensuring safer recovery options for your VMs. 

[Learn about Azure Backup threat detection feature and supported scenarios](threat-detection-overview.md).

## Prerequisites

Before you enable and manage threat detection for Azure VM backups, ensure the following prerequisites are met:

- Enable Microsoft Defender for Servers Plan 1 or Plan 2 on your Azure subscription. For Plan 1, enable Microsoft Defender for Endpoint (MDE) on virtual machines and verify correct configuration on the source VM; otherwise, backups might be incorrectly tagged. For Plan 2, ensure that you enable agentless malware scan. [Learn more about Defender for Server plans](/azure/defender-for-cloud/defender-for-servers-overview).
- Enable bi-directional alert synchronization in Microsoft Sentinel to accurately identify backup recovery points (RPs). [Learn how to Ingest Microsoft Defender for Cloud alerts to Microsoft Sentinel](/azure/sentinel/connect-defender-for-cloud).
- Mark alerts as resolved in Microsoft Defender for Cloud when using any third-party incident management solution alongside Defender.


## Enable threat detection for Azure VM backups

You can configure source-scan at-scale at the vault level, which allows Azure Backup to perform Malware scans using Microsoft Defender at the source virtual machine. This capability allows Azure Backup to assess the health of recovery points when snapshots are taken.

You can enable threat detection for Azure VM backups with one of the methods - Resiliency or Vault properties. After the threat detection scan is configured on the vaults, the vault applies scan status to all new restore points created for VM backups.


>[!Important]
>- With the required Microsoft Defender for Cloud (MDC) plans, you can enable source-scan integration. Once enabled, this security feature can't be turned off.
>- You can configure Source scan only when the selected subscription has the required Microsoft Defender for Servers plan.

### Option 1: Configure threat detection using Resiliency


To enable threat detection for Azure VM backups using Resiliency, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency**.

1. On the **overview** pane,  select the **Threat detection (Preview)** tile.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/threat-detection-tile.png" alt-text="Screenshot shows the Threat detection tile in Resiliency." lightbox="./media/threat-detection-configure-monitor-tutorial/threat-detection-tile.png":::

1. On the **Threat detection (Preview)** pane, select **+ Configure scan** to start configuring source-scan integration.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/configure-threat-detection.png" alt-text="Screenshot shows how to initiate threat detection scan configuration." lightbox="./media/threat-detection-configure-monitor-tutorial/configure-threat-detection.png":::   

1. On the **Configure source-scan integration (preview)** pane, click **+ Select Vaults**.
1. On the **Select Vaults** pane, under **Select subscription**, choose the subscription under which you want to enable the source-scan integration.

1. To enable integration with Microsoft Defender for Cloud, select the vaults from the list that contain the protected datasources (VM backups), and then select **Add**.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/select-vault.png" alt-text="Screenshot shows the vault selection for scan configuration." lightbox="./media/threat-detection-configure-monitor-tutorial/select-vault.png":::   

1. On the **Configure source-scan integration (preview)** pane, select **Configure scan** to enable threat detection for the vaults in the supported regions.

All the new recovery points created for the VM backups in the vault start showing the scan status as **Configured**.

### Option 2: Configure threat detection from vault properties

To enable threat detection for Azure VM backups from the Recovery Services Vault properties, follow these steps:

1. Go to the **Recovery Services vault** that contains the VM backups requiring threat detection, and then select **Properties**.
1. On the **Properties** pane, under **Security Settings** > **Threat detection (Preview)**, select **Update**.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/enable-threat-detection-vault.png" alt-text="Screenshot shows the enable threat detection option in the vault properties." lightbox="./media/threat-detection-configure-monitor-tutorial/enable-threat-detection-vault.png":::

1. On the **Threat Detection (Preview)** pane, turn on **Enable source-scan integration**, accept the terms by selecting the checkbox.
1. Select **Update**.

## Monitor the health of Azure VM recovery points

To monitor the health of Azure VM recovery points using Resiliency, follow these steps:

1. Go to **Resiliency**, and select the **Threat detection (Preview)** tile and view the summary of the recovery point health.

1. On the **Threat detection (Preview)** pane, select the protected item  with **Scan summary** status as **Suspicious RPs found**

   You can view the **Scan status** and **Scan summary** of all protected items across subscriptions. Scan summary is aggregated value based on the scan status of the recovery points created in the last seven days.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/threat-detection-status-protected-items.png" alt-text="Screenshot shows the threat detection status of the protected items." lightbox="./media/threat-detection-configure-monitor-tutorial/threat-detection-status-protected-items.png":::

1. On the selected protected item pane, select the associated item from the list.

1. On the associated item pane, from the list of recovery points, select the hyper link with **Recent scan status** as **Suspicious** and view the scan details.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/suspicious-recovery-point.png" alt-text="Screenshot shows the suspicious recovery points." lightbox="./media/threat-detection-configure-monitor-tutorial/suspicious-recovery-point.png":::

5.  You can see the alerts that led to tagging this RP as **Suspicious**. You can remediate and take actions by selecting the alert and navigating to MDC. You can stop backups or increase security level of backups by enabling immutability or Multi-user authorization.

     :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/scan-details.png" alt-text="Screenshot shows the scan details for the suspicious recovery point." lightbox="./media/threat-detection-configure-monitor-tutorial/scan-details.png":::

   You can also view the scan status of each recovery point during Azure VM restore, which helps you to select the appropriate restore point for ransomware recovery.

   :::image type="content" source="./media/threat-detection-configure-monitor-tutorial/view-restore-point-scan-status.png" alt-text="Screenshot shows the restore point scan status." lightbox="./media/threat-detection-configure-monitor-tutorial/view-restore-point-scan-status.png":::

## Resolve threats and ensure healthy backups

If a backup recovery point is flagged as **Suspicious**, all subsequent recovery points remain flagged until the related alerts are triaged and resolved.

 To resolve the alerts, select the  alert from the **Scan details** pane and go to the Defender portal and perform one of the following actions:

- Resolve the alert in the Defender for Cloud. Learn how to [Manage security alerts in Microsoft Defender for Cloud](/azure/defender-for-cloud/manage-respond-alerts).
- [Resolve alerts in Microsoft Sentinel](/azure/sentinel/incident-navigate-triage).

  Ensure that the alert status is synchronized back to Defender for Cloud. Learn how to [Ingest Microsoft Defender for Cloud alerts to Microsoft Sentinel](/azure/sentinel/connect-defender-for-cloud).

- For alerts managed through third-party incident management tools, resolve them in the Defender for Cloud portal.

After you resolve all alerts and mark them as *resolved* in Microsoft Defender for Cloud, protected items are marked as **No threats reported**.

## Related content

- [About security features for Azure Backup](security-overview.md).
- [About Microsoft Defender for Servers](/azure/defender-for-cloud/defender-for-servers-overview).
- [About Microsoft Sentinel](/azure/sentinel/sentinel-overview).





