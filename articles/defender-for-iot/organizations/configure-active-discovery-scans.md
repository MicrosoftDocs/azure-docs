---
title: Configure active discovery scans - Microsoft Defender for IoT
description: This article describes how to configure an active discovery scan on your OT sensor console for active monitoring with Microsoft Defender for IoT.
ms.date: 05/15/2022
ms.topic: how-to
---

# Configure active discovery scans

This article describes how to configure an active discovery scan on your OT sensor console for active monitoring with Microsoft Defender for IoT.

Configure active discovery scans when you want to run active monitoring across various device platforms and protocols. You can configure active discovery scan to run as a one-time scan, or to run periodically on the specified resources.

## Prerequisites

Make sure that you've completed the prerequisites listed in [Configure active monitoring for OT networks](configure-active-monitoring.md), and have confirmed that active monitoring is right for your network.

For more information, see [Active and passive OT monitoring in Defender for IoT](best-practices/passive-active-monitoring.md).

## Configure an active discovery scan

**To configure an active discovery scan**:

1. On your sensor console, select the **Active discovery (Preview)** page, and then select **Create scan**.

1. In the pane that opens on the right, configure the options for your scan.

    1. Enter a meaningful name and then select a **Use case** for your scan.

    1. Define the following scanning options, which depend on the use case selected:

        # [PLC discovery and enrichment](#tab/plc)

        - **Scan protocol**.  The protocol to use for your scan. Options depend on the use case selected. For more information, see [Supported protocols for active monitoring](best-practices/passive-active-monitoring.md#supported-protocols-for-active-monitoring).

        - **Port**. The port value is automatically populated with the default port for your selected protocol. Modify the value as needed.

        - **Timeout**.  Define a timeout in seconds for your scan, after which the scan stops running.

        - **Device limit**. Define a maximum number of devices or controllers to scan.

        - **Scan depth**.  Define the device depth for your scan. For example, a device connected to the main PLC is one level down, and a device connected to a first level device is two levels down from the main PLC.

        # [Switch discovery scan](#tab/switch)

        - **Switch vendor**. Select a switch vendor.

        - **Scan protocol**. The protocol to use for your scan. Options depend on the use case selected. For more information, see [Supported protocols for active monitoring](best-practices/passive-active-monitoring.md#supported-protocols-for-active-monitoring).

        Other scan fields differ, depending on the scan protocol you select. Enter community strings and credential details as needed.

        ---

    1. In the **Target** area, enter one or more IP address ranges to scan.

    1. In the **Schedule scan** area, select either **One-time event** or **Periodically**, depending on how often you want your scan to run. Then, define when exactly you want your scans to start running.

    Scans are scheduled according to the time and time zone configured on the sensor machine.

1. When you're done, select **Save**. Your active discovery scan will start running as configured.

> [!TIP]
> To run your scan immediately as a one-time scan, save your scan and then select **Run scan** in the **Active discovery** page toolbar.

## View scanning results

After your active discovery scan completes, scanning results are shown in the **Active discovery (Preview)** page.

Select a scan to view detailed results in a pane on the right.

:::image type="content" source="media/configure-active-monitoring/active-discovery-results.png" alt-text="Screenshot of the active discovery scan results." lightbox="media/configure-active-monitoring/active-discovery-results.png":::

Newly discovered or enriched devices are numbered in the **Update device** column. Select the linked number to view details about the new or enhanced devices.

## Next steps

Learn more about active monitoring options. For more information, see:

- [Active and passive OT monitoring in Defender for IoT](best-practices/passive-active-monitoring.md)
- [Configure active monitoring for OT networks](configure-active-monitoring.md)
- [Configure Windows Endpoint monitoring](configure-windows-endpoint-monitoring.md)
