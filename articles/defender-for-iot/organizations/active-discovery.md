---
title: Run active discovery scans from your OT sensor - Microsoft Defender for IoT
description: Learn how to run active discovery scans from your OT sensor interface to detect more device data and new devices in your network.
ms.date: 04/06/2022
ms.topic: how-to
---

# Run active discovery scans from your OT sensor

Run active discovery scans from your OT sensors to dive deeper into your device data and detect more devices on your network. For example, OT engineers might want to enrich existing device visibility, and SOC teams might want to collect more data, identifying more CVEs and assist in investigations for alerts and possible penetration paths.

> [!IMPORTANT]
> Active discovery scans run detection activity directly in your network and may cause some downtime. Take care when configuring your active discovery scan so that you only scan necessary resources.

## Recommended scenarios

We recommend running active discovery scans in the following scenarios:

- **Non-optimal port monitoring locations**, such as in remote locations with only one or two PLCs and legacy network wiring
- **Data that doesn't pass over the wire**, such as patches installed on Windows machines, USB-enabled or disabled properties, MAC address tables in routers, and more
- **Lower-level traffic** that can't otherwise be captured
- **Switches that don't support SPAN/mirror ports**, where you'll need other methods to capture device data
- **Highly segmented networks**, where costs would be prohibitive to put sensors on each segment
- **Local programs that prevent ping access**, such as dormant assets that don't communicate over the network

## Supported protocols

Active discovery scans are supported for the following protocols:

|Scan type  |Supported protocols  |
|---------|---------|
|**Switch discovery scans**     |  - SNMPv1<br>- SNMPv2<br>- SNMPv3<br>- HTTP       |
|**PLC discovery and enrichment scans**     | - S7 (Siemens) <br>- CIP (Rockwell)        |


## Configure an active discovery scan

Configure an active discovery scan to run as a one-time scan, or to run periodically on the specified resources.

**To configure an active discovery scan**:

1. On your sensor console, select the **Active discovery (Preview)** page, and then select **Create scan**.

1. In the pane that opens on the right, configure the options for your scan.

    1. Enter a meaningful name and then select a **Use case** for your scan.

    1. Define the following scanning options, which depend on the use case selected:
        # [PLC discovery and enrichment](#tab/plc)

        - **Scan protocol**.  The protocol to use for your scan. Options depend on the use case selected. For more information, see [Supported protocols](#supported-protocols).

        - **Port**. The port value is automatically populated with the default port for your selected protocol. Modify the value as needed.

        - **Timeout**.  Define a timeout in seconds for your scan, after which the scan stops running.

        - **Device limit**. Define a maximum number of devices or controllers to scan.

        - **Scan depth**.  Define the device depth for your scan. For example, a device connected to the main PLC is one level down, and a device connected to a first level device is two levels down from the main PLC.

        # [Switch discovery scan](#tab/switch)

        - **Switch vendor**. Select a switch vendor.

        - **Scan protocol**. The protocol to use for your scan. Options depend on the use case selected. For more information, see [Supported protocols](#supported-protocols).

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

:::image type="content" source="media/active-discovery/active-discovery-results.png" alt-text="Screenshot of the active discovery scan results." lightbox="media/active-discovery/active-discovery-results.png":::

Newly discovered or enriched devices are numbered in the **Update device** column. Select the linked number to view details about the new or enhanced devices.

## Next steps

For more information, see:

- [View your device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [View your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)