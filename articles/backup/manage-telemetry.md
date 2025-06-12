---
title: Manage telemetry settings in Microsoft Azure Backup Server (MABS)
description: This article provides information about how to manage the telemetry settings in MABS.
ms.date:  06/12/2025
ms.topic: how-to
author: jyothisuri
ms.author: jsuri
---

# Manage telemetry settings in Microsoft Azure Backup Server

>[!NOTE]
>This feature is applicable for MABS V3 UR2 and later.

This article describes how to manage telemetry (Diagnostics and utility data) settings in Microsoft Azure Backup Server (MABS).

By default, MABS sends diagnostic and connectivity data to Microsoft. Microsoft uses this data to enhance the quality, security, and reliability of its products and services.

Administrators can turn off this feature at any point of time. Learn about the [data collected details](#telemetry-data-collected).

## Enable/disable telemetry from the MABS console

To enable/disable telemetry from the MABS console, follow these steps:

1. In the Microsoft Azure Backup Server console, go to **Management** and select **Options**.
1. On the **Options** pane, select **Diagnostic and Usage Data Settings**.

    :::image type="content" source="./media/telemetry/telemetry-options.png" alt-text="Screenshot shows the console telemetry options.":::

1. Select the diagnostic and usage data sharing preference, and then select **OK**.

    >[!NOTE]
    >We recommend you to read the [Privacy Statement](https://privacy.microsoft.com/privacystatement) before you select the option.
    >- To enable telemetry, select **Yes, I am willing to send data to Microsoft**.
    >- To disable telemetry, select **No, I prefer not to send data to Microsoft**.

## Telemetry data collected

| Data related To | Data collected* |
| --- | --- |
| **Setup** | Version of MABS installed. <br/><br/>Version of the MABS update rollup installed. <br/><br/> Unique machine identifier. <br/><br/> Operating system on which MABS is installed. <br/><br/> Unique cloud subscription identifier.<br/><br/> MARS agent version.<br/><br/> Tiered storage is enabled/ disabled. <br/><br/> Size of the storage used. |
| **Workload Protected** | Workload unique Identifier. <br/><br/>Size of the workload being backed up. <br/><br/>Workload type and its version number. <br/><br/>The workload is currently protected/ unprotected by MABS. <br/><br/>Unique Identifier of the Protection Group under which the workload is protected.<br/><br/> Location where the workload is getting backed up - to disk/tape or cloud.|
| **Jobs** | Status of the backup/restore job. <br/><br/> Size of the data backed up/restored. <br/><br/>Failure message, in case backup/restore job fails.<br/><br/> Time taken for the restore job.<br/><br/>Details of the workload for which the backup/restore job was run. |
| **Telemetry change status** | The status change details for the telemetry settings, if enabled or disabled, and when. |
| **MABS Console Crash Error** | The details of the error when a MABS console crashes.|

## Next steps

[Protect workloads](./back-up-hyper-v-virtual-machines-mabs.md)