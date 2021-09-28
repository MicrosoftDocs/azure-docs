---
title: Control what traffic is monitored
description: Sensors automatically perform deep packet detection for IT and OT traffic and resolve information about network devices, such as device attributes and network behavior. Several tools are available to control the type of traffic that each sensor detects. 
ms.date: 12/07/2020
ms.topic: how-to
---

# Control what traffic is monitored

Sensors automatically perform deep packet detection for IT and OT traffic and resolve information about network devices, such as device attributes and behavior. Several tools are available to control the type of traffic that each sensor detects.

## Learning and Smart IT Learning modes

The Learning mode instructs your sensor to learn your network's usual activity. Examples are devices discovered in your network, protocols detected in the network, file transfers between specific devices, and more. This activity becomes your network baseline.

The Learning mode is automatically enabled after installation and will remain enabled until turned off. The approximate learning mode period is between two to six weeks, depending on the network size and complexity. After this period, when the learning mode is disabled, any new activity detected will trigger alerts. Alerts are triggered when the policy engine discovers deviations from your learned baseline.

After the learning period is complete and the Learning mode is disabled, the sensor might detect an unusually high level of baseline changes that are the result of normal IT activity, such as DNS and HTTP requests. The activity is called nondeterministic IT behavior. The behavior might also trigger unnecessary policy violation alerts and system notifications. To reduce the amount of these alerts and notifications, you can enable the **Smart IT Learning** function.

When Smart IT Learning is enabled, the sensor tracks network traffic that generates nondeterministic IT behavior based on specific alert scenarios.

The sensor monitors this traffic for seven days. If it detects the same nondeterministic IT traffic within the seven days, it continues to monitor the traffic for another seven days. When the traffic is not detected for a full seven days, Smart IT Learning is disabled for that scenario. New traffic detected for that scenario will only then generate alerts and notifications.

Working with Smart IT Learning helps you reduce the number of unnecessary alerts and notifications caused by noisy IT scenarios.

If your sensor is controlled by the on-premises management console, you can't disable the learning modes. In cases like this, the learning mode can only be disabled from the management console.

The learning capabilities (Learning and Smart IT Learning) are enabled by default.

To enable or disable learning:

- Select **System Settings** and toggle the **Learning** and **Smart IT Learning** options.

:::image type="content" source="media/concept-learning-modes/toggle-options-for-learning-and-smart-it-learning.png" alt-text="System settings toggle screen.":::

## Configure subnets

Subnet configurations affect how you see devices in the device map.

By default, the sensor discovers your subnet setup and populates the **Subnet Configuration** dialog box with this information.

To enable focus on the OT devices, IT devices are automatically aggregated by subnet in the device map. Each subnet is presented as a single entity on the map, including an interactive collapsing/expanding capability to "drill down" into an IT subnet and back.

When you're working with subnets, select the ICS subnets to identify the OT subnets. You can then focus the map view on OT and ICS networks and collapse to a minimum the presentation of IT network elements. This effort reduces the total number of the devices shown on the map and provides a clear picture of the OT and ICS network elements.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/expand-network-option.png" alt-text="Screenshot that shows filtering to a network.":::

You can change the configuration or change the subnet information manually by exporting the discovered data, changing it manually, and then importing back the list of subnets that you manually defined. For more information about export and import, see [Import device information](how-to-import-device-information.md).

In some cases, such as environments that use public ranges as internal ranges, you can instruct the sensor to resolve all subnets as internal subnets by selecting the **Do Not Detect Internet Activity** option. When you select that option:

- Public IP addresses will be treated as local addresses.

- No alerts will be sent about unauthorized internet activity, which reduces notifications and alerts received on external addresses.

To configure subnets:

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Subnets**.

   :::image type="content" source="media/how-to-control-what-traffic-is-monitored/edit-subnets-configuration-screen.png" alt-text="Screenshot that shows the subnet configuration screen."::: 

3. To add subnets automatically when new devices are discovered, keep **Auto Subnets Learning** selected.

4. To resolve all subnets as internal subnets, select **Don't Detect Internet Activity**.

5. Select **Add network** and define the following parameters for each subnet:

    - The subnet IP address.
    - The subnet mask address.
    - The subnet name. We recommend that you name each subnet with a meaningful name that you can easily identify, so you can differentiate between IT and OT networks. The name can be up to 60 characters.

6. To mark this subnet as an OT subnet, select **ICS Subnet**.

7. To present the subnet separately when you're arranging the map according to the Purdue level, select **Segregated**.

8. To delete a subnet, select :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/delete-icon.png" border="false":::.

9. To delete all subnets, select **Clear All**.

10. To export configured subnets, select **Export**. The subnet table is downloaded to your workstation.

11. Select **Save**.

### Importing information 

To import subnet information, select **Import** and select a CSV file to import. The subnet information is updated with the information that you imported. If you important an empty field, you'll lose your data.

## Detection engines

Self-learning analytics engines eliminate the need for updating signatures or defining rules. The engines use ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies, malware, operational problems, protocol violations, and baseline network activity deviations.

> [!NOTE]
> We recommend that you enable all the security engines.

When an engine detects a deviation, an alert is triggered. You can view and manage alerts from the alert screen or from a partner system.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/deviation-alert-screen.png" alt-text="Screenshot that shows detection of deviation.":::

The name of the engine that triggered the alert appears under the alert title.

### Protocol violation engine 

A protocol violation occurs when the packet structure or field values don't comply with the protocol specification.

Example scenario:
*"Illegal MODBUS Operation (Function Code Zero)"* alert. This alert indicates that a primary device sent a request with function code 0 to a secondary device. This action is not allowed according to the protocol specification, and the secondary device might not handle the input correctly.

### Policy violation engine

A policy violation occurs with a deviation from baseline behavior defined in learned or configured settings.

Example scenario:
*"Unauthorized HTTP User Agent"* alert. This alert indicates that an application that was not learned or approved by policy is used as an HTTP client on a device. This might be a new web browser or application on that device.

### Malware engine

The Malware engine detects malicious network activity.

Example scenario: 
*"Suspicion of Malicious Activity (Stuxnet)"* alert. This alert indicates that the sensor detected suspicious network activity known to be related to the Stuxnet malware. This malware is an advanced persistent threat aimed at industrial control and SCADA networks.

### Anomaly engine

The Anomaly engine detects anomalies in network behavior.

Example scenario: 
*"Periodic Behavior in Communication Channel"* alert. The component inspects network connections and finds periodic and cyclic behavior of data transmission. This behavior is common in industrial networks.

### Operational engine

The Operational engine detects operational incidents or malfunctioning entities.

Example scenario: 
*"Device is Suspected to be Disconnected (Unresponsive)"* alert. This alert is raised when a device is not responding to any kind of request for a predefined period. This alert might indicate a device shutdown, disconnection, or malfunction.

### Enable and disable engines

When you disable a policy engine, information that the engine generates won't be available to the sensor. For example, if you disable the Anomaly engine, you won't receive alerts on network anomalies. If you created a forwarding rule, anomalies that the engine learns won't be sent. To enable or disable a policy engine, select **Enabled** or **Disabled** for the specific engine.

The overall score is displayed in the lower-right corner of the **System Settings** screen. The score indicates the percentage of available protection enabled through the threat protection engines. Each engine is 20 percent of available protection.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/protection-score-screen.png" alt-text="Screenshot that shows a score.":::

## Configure DHCP address ranges

Your network might consist of both static and dynamic IP addresses. Typically, static addresses are found on OT networks through historians, controllers, and network infrastructure devices such as switches and routers. Dynamic IP allocation is typically implemented on guest networks with laptops, PCs, smartphones, and other portable equipment (using Wi-Fi or LAN physical connections in different locations).

If you're working with dynamic networks, you handle IP address changes that occur when new IP addresses are assigned. You do this by defining DHCP address ranges.

Changes might happen, for example, when a DHCP server assigns IP addresses.

Defining dynamic IP addresses on each sensor enables comprehensive, transparent support in instances of IP address changes. This ensures comprehensive reporting for each unique device.

The sensor console presents the most current IP address associated with the device and indicates which devices are dynamic. For example:

- The Data Mining report and Device Inventory report consolidate all activity learned from the device as one entity, regardless of the IP address changes. These reports indicate which addresses were defined as DHCP addresses.

  :::image type="content" source="media/how-to-control-what-traffic-is-monitored/populated-device-inventory-screen-v2.png" alt-text="Screenshot that shows device inventory.":::

- The **Device Properties** window indicates if the device was defined as a DHCP device.

To set a DHCP address range:

1.  On the side menu, select **DHCP Ranges** from the **System Settings** window.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/dhcp-address-range-screen.png" alt-text="Screenshot that shows the selection of DHCP Ranges.":::

2.  Define a new range by setting **From** and **To** values.

3.  Optionally: Define the range name, up to 256 characters.

4.  To export the ranges to a CSV file, select **Export**.

5. To manually add multiple ranges from a CSV file, select **Import** and then select the file.

    > [!NOTE]
    > The ranges that you import from a CSV file overwrite the existing range settings.

6. Select **Save**.

## Configure DNS servers for reverse lookup resolution

To enhance device enrichment, you can configure multiple DNS servers to carryout reverse lookups. You can resolve host names or FQDNs associated with the IP addresses detected in network subnets. For example, if a sensor discovers an IP address, it might query multiple DNS servers to resolve the host name.

All CIDR formats are supported.

The host name appears in the device inventory, and device map, and in reports.

You can schedule reverse lookup resolution schedules for specific hourly intervals, such as every 12 hours. Or you can schedule a specific time.

To define DNS servers:

1. Select **System Settings** and then select **DNS Settings**.

2. Select **Add DNS Server**.

    :::image type="content" source="media/how-to-enrich-asset-information/dns-reverse-lookup-configuration-screen.png" alt-text="Screenshot that shows the selection of Add DNS Server.":::

3. In the **Schedule reverse DNS lookup** field, choose either:

    - Intervals (per hour).
  
    - A specific time. Use European formatting. For example, use **14:30** and not **2:30 PM**.

4. In the **DNS Server Address** field, enter the DNS IP address.

5. In the **DNS Server Port** field, enter the DNS port.

6. Resolve the network IP addresses to device FQDNs. In the **Number of Labels** field, add the number of domain labels to display. Up to 30 characters are displayed from left to right.

7. In the **Subnets** field, enter the subnets that you want the DNS server to query.

8. Select the **Enable** toggle if you want to initiate the reverse lookup.

### Test the DNS configuration 

By using a test device, verify that the settings you defined work properly:

1. Enable the **DNS Lookup** toggle.

2. Select **Test**.

3. Enter an address in **Lookup Address** for the **DNS reverse lookup test for server** dialog box.

    :::image type="content" source="media/how-to-enrich-asset-information/dns-reverse-lookup-test-screen.png" alt-text="Screenshot that shows the Lookup Address area.":::

4. Select **Test**.

## Configure Windows Endpoint Monitoring

With the Windows Endpoint Monitoring capability, you can configure Azure Defender for IoT to selectively probe Windows systems. This provides you with more focused and accurate information about your devices, such as service pack levels.

You can configure probing with specific ranges and hosts, and configure it to be performed only as often as desired. You accomplish selective probing by using the Windows Management Instrumentation (WMI), which is Microsoft's standard scripting language for managing Windows systems.

> [!NOTE]
> - You can run only one scan at a time.
> - You get the best results with users who have domain or local administrator privileges.
> - Before you begin the WMI configuration, configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

When the probe is finished, a log file with all the probing attempts is available from the option to export a log. The log contains all the IP addresses that were probed. For each IP address, the log shows success and failure information. There's also an error code, which is a free string derived from the exception. The scan of the last log only is kept in the system.

You can perform scheduled scans or manual scans. When a scan is finished, you can view the results in a CSV file.

**Prerequisites**

Configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

To configure an automatic scan:

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-icon-v2.png" border="false":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-screen-v2.png" alt-text="Screenshot that shows the selection of Windows Endpoint Monitoring.":::

3. On the **Scan Schedule** pane, configure options as follows:

      - **By fixed intervals (in hours)**: Set the scan schedule according to intervals in hours.

      - **By specific times**: Set the scan schedule according to specific times and select **Save Scan**.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/schedule-a-scan-screen-v2.png" alt-text="Screenshot that shows the Save Scan button.":::

4. To define the scan range, select **Set scan ranges**.

5. Set the IP address range and add your user and password.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/edit-scan-range-screen.png" alt-text="Screenshot that shows adding a user and password.":::

6. To exclude an IP range from a scan, select **Disable** next to the range.

7. To remove a range, select :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/remove-scan-icon.png" border="false"::: next to the range.

8. Select **Save**. The **Edit Scan Ranges Configuration** dialog box closes, and the number of ranges appears in the **Scan Ranges** pane.

To perform a manual scan:

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-icon-v2.png" border="false":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-screen-v2.png" alt-text="Screenshot that shows the Windows Endpoint Monitoring setup screen.":::

3. In the **Actions** pane, select **Start scan**. A status bar appears on the **Actions** pane and shows the progress of the scanning process.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/started-scan-screen-v2.png" alt-text="Screenshot that shows the Start scan button.":::

To view scan results:

1. When the scan is finished, on the **Actions** pane, select **View Scan Results**. The CSV file with the scan results is downloaded to your computer.

## See also

[Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
[Investigate sensor detections in the device map](how-to-work-with-the-sensor-device-map.md)
