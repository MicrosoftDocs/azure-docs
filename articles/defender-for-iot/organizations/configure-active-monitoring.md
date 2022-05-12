---
title: Configure active monitoring - Microsoft Defender for IoT
description: Describes how Microsoft Defender for IoT provides both passive and active monitoring on your network devices, and provides guidance as to when to use each method.
ms.date: 05/10/2022
ms.topic: conceptual
---

# Configure active monitoring

This article describes how to configure active monitoring with Microsoft Defender for IoT, including methods for Windows Event monitoring, reverse DNS lookup, and active discovery scans.

For more information, see [Active and passive OT monitoring in Defender for IoT](best-practices/passive-active-monitoring.md).

## Plan your active monitoring scans

> [!IMPORTANT]
> Active monitoring runs detection activity directly in your network and may cause some downtime. Take care when configuring active monitoring so that you only scan necessary resources.

When planning an active discovery scan:

- **Verify the following questions**:

    - Can the devices you want to scan be discovered by the default Defender for IoT monitoring? If so, active monitoring may be unnecessary.
    - Are you able to run active queries on your network and on the devices you want to scan? To make sure, try running an active query on a staging environment.

    Use the answers to these questions to determine exactly which sites and address ranges you want to monitor.

- **Identify maintenance windows** where you can schedule active monitoring intervals safely.

- **Identify active monitoring owners**, which are personnel who can supervise the active monitoring activity and stop the monitoring process if needed.

- **Determine which active monitoring method to use**:

    - Use active discovery scans to combine various protocols, device types, and advanced configurations.
    - Use Windows Endpoint Monitoring to monitor WMI events
    - Use DNS lookup to <x?>

## Prerequisite: Configure network access

Before you can configure active monitoring, you must also configure your network to allow the sensor's management port IP address access to the OT network where your devices reside.

For example, the following image highlights in grey the extra network access you must configure from the management interface to the OT network.

:::image type="content" source="media/active-discovery/architecture.png" alt-text="Diagram highlighting the extra management network configuration required for active discovery scans.":::

## Configure an active discovery scan

Configure active discovery scans when you want to run active monitoring across various device platforms and protocols. You can configure active discovery scan to run as a one-time scan, or to run periodically on the specified resources.

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

### View scanning results

After your active discovery scan completes, scanning results are shown in the **Active discovery (Preview)** page.

Select a scan to view detailed results in a pane on the right.

:::image type="content" source="media/active-discovery/active-discovery-results.png" alt-text="Screenshot of the active discovery scan results." lightbox="media/active-discovery/active-discovery-results.png":::

Newly discovered or enriched devices are numbered in the **Update device** column. Select the linked number to view details about the new or enhanced devices.

## Configure Windows Endpoint Monitoring

Use Windows Endpoint Monitoring (WEM) to have Defender for IoT selectively and actively probe Windows systems. WEM can provide more focused and accurate information about your Windows devices, such as service pack levels.

**Supported protocols**: WMI, Microsoft's standard scripting language for managing Windows systems

While you can configure your WEM scan to run as often as you like, only one WEM scan can run at a time.


> [!NOTE]
> - You can run only one scan at a time.
> - You get the best results with users who have domain or local administrator privileges.
> - Before you begin the WMI configuration, configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

When the probe is finished, a log file with all the probing attempts is available from the option to export a log. The log contains all the IP addresses that were probed. For each IP address, the log shows success and failure information. There's also an error code, which is a free string derived from the exception. The scan of the last log only is kept in the system.

You can perform scheduled scans or manual scans. When a scan is finished, you can view the results in a CSV file.

**Prerequisites**

Configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

**To configure an automatic scan:**

1. Select **System settings**> **Network monitoring**, then select **Windows Endpoint Monitoring (WMI)**.

1. In the **Edit scan ranges configuration** section, enter the ranges you want to scan and add your username and password.

3. Define how you want to run the scan:

      - **By fixed intervals (in hours)**: Set the scan schedule according to intervals in hours.

      - **By specific times**: Set the scan schedule according to specific times and select **Save Scan**.

8. Select **Save**. The dialog box closes.

**To perform a manual scan:**

1. Define the scan ranges.

3. Select **Save** and **Apply changes** and then select **Manually scan**.

**To view scan results:**

1. When the scan is finished, select **View Scan Results**. A .csv file with the scan results is downloaded to your computer.


## Configure DNS servers for reverse lookup resolution

To enhance device enrichment, you can configure multiple DNS servers to carryout reverse lookups. You can resolve host names or FQDNs associated with the IP addresses detected in network subnets. For example, if a sensor discovers an IP address, it might query multiple DNS servers to resolve the host name.

All CIDR formats are supported.

The host name appears in the device inventory, and device map, and in reports.

You can schedule reverse lookup resolution schedules for specific hourly intervals, such as every 12 hours. Or you can schedule a specific time.

**To define DNS servers:**

1. Select **System settings**> **Network monitoring**, then select **Reverse DNS Lookup**.

2. Select **Add DNS Server**.

3. In the **Schedule Reverse lookup** field, choose either:

    - Intervals (per hour).
  
    - A specific time. Use European formatting. For example, use **14:30** and not **2:30 PM**.

4. In the **DNS server address** field, enter the DNS IP address.

5. In the **DNS server port** field, enter the DNS port.

6. Resolve the network IP addresses to device FQDNs. In the **Number of labels** field, add the number of domain labels to display. Up to 30 characters are displayed from left to right.

7. In the **Subnets** field, enter the subnets that you want the DNS server to query.

8. Select the **Enable** toggle if you want to initiate the reverse lookup.

1. Select **Save**.

### Test the DNS configuration 

By using a test device, verify that the settings you defined work properly:

1. Enable the **DNS Lookup** toggle.

2. Select **Test**.

3. Enter an address in **Lookup Address** for the **DNS reverse lookup test for server** dialog box.

4. Select **Test**.

## Next steps

For more information, see:

- [View your device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [View your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)