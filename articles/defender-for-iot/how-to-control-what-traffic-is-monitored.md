---
title: Control what traffic is monitored
description: Sensors automatically perform Deep Packet Detection for IT and OT traffic and resolve information about network devices, for example device attributes and network behavior. Several tools are available to control the type of traffic detected by each sensor. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure
---

# Control what traffic is monitored

Sensors automatically perform Deep Packet Detection for IT and OT traffic and resolve information about network devices, for example device attributes and behavior. Several tools are available to control the type of traffic detected by each sensor.  

## Learning modes

The Learning mode instructs your sensor to learn your networks usual activity. For example, devices discovered in your network, protocols detected in the network, file transfers between specific devices, and more. This activity becomes your network baseline.

The Learning mode is automatically enabled after installation and will remain enabled until turned off. The approximate learning mode period is between two to six weeks, depending on the network size and complexity. After this period, when the learning mode is disabled, any new activity detected will trigger alerts. Alerts are triggered when the policy engine discovers deviations from your learned baseline.

### About the Smart IT Learning mode

After the learning period is complete and the learning mode is disabled, the sensor may detect an unusually high level of baseline changes that are the result of normal IT activity, for example DNS and HTTP requests. The activity is referred to as nondeterministic IT behavior. The behavior may also trigger unnecessary policy violation alerts and system notifications. To reduce the amount of these alerts and notifications, you can enable the **Smart IT Learning** function.

When Smart IT Learning is enabled, the sensor tracks network traffic that generates non-deterministic IT behavior based on specific alert scenarios.

The sensor monitors this traffic for seven days. If it detects the same nondeterministic IT traffic within the seven days, it continues to monitor the traffic for another seven days. When the traffic is not detected for a full seven days, Smart IT Learning is disabled for that scenario. New traffic detected for that scenario will only then generate alerts and notifications.

Working with Smart IT Learning helps you reduce the number of unnecessary alerts and notifications caused by noisy IT scenarios.

If your sensor is controlled by the on-premises management console, you cannot disable the learning modes. In cases like this, the learning mode can only be disabled from the management console.

The learning capabilities (Learning, and Smart IT Learning) are enabled by default.

To enable or disable learning:

- Select **System Settings** and toggle the **Learning** and **Smart IT Learning** options.

:::image type="content" source="media/concept-learning-modes/toggle-options-for-learning-and-smart-it-learning.png" alt-text="System settings toggle screen":::

## Configure subnets

Subnet configurations impact how you see devices in the device map.

By default, the sensor discovers your subnet setup, and populates the Subnet Configuration dialog box with this information.

To enable focus on the OT devices, IT devices are automatically aggregated by subnet in the device map. Each subnet is presented as a single entity on the map, including an interactive collapsing/expanding capability to “drill down” into an IT subnet and back.

When working with subnets, select the ICS subnets to identify the OT subnets. This way you can focus the map view on OT and ICS networks and collapse to a minimum the presentation of IT network elements, which reduces the total number of the devices presented on the map and provides a clear picture of the OT and ICS network elements.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/expand-network-option.png" alt-text="filter to network":::

You can change the configuration or change the subnet information manually by exporting the discovered data, changing it manually and then importing back the list of subnets that you manually defined. For more information about export and import, see [Import device information](how-to-import-device-information.md).

In some cases, such as environments that use public ranges as internal ranges, you can instruct the sensor to resolve all subnets as internal subnets by selecting the **Do Not Detect Internet Activity** option. When selected:

- *Public IP addresses will be treated as local addresses.*

- No alerts will be sent about unauthorized internet activity, which reduces notifications and alerts received on external addresses.
To configure subnets:

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Subnets**.

   :::image type="content" source="media/how-to-control-what-traffic-is-monitored/edit-subnets-configuration-screen.png" alt-text="Subnets configuration screen"::: 

3. To add subnets automatically when new devices are discovered, keep **Auto Subnets Learning** selected.

4. To resolve all subnets as internal subnets, select **Don’t Detect Internet Activity**.

5. Select **Add network** and define the following parameters for each subnet:

    - The subnet IP address.
    - The subnet mask address.
    - The subnet name, it is recommended to name each subnet with a meaningful name that you can easily identify in order to differentiate between IT and OT networks. The name can be up to 60 characters.

6. To mark this subnet as an OT subnet, select **ICS Subnet**.

7. To present the subnet separately when arranging the map according to the Purdue level, select **Segregated**.

8. To delete a subnet, select :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/delete-icon.png" border="false":::.

9. To delete all subnets, select **Clear All**.

10. To export subnets configured, select **Export**. The subnets table is downloaded to your workstation.

11. Select **Save**.

### Importing information 

To import subnets information, select **Import** and select a CSV file to import. The subnet information is updated with the information you imported. If you important an empty field, you will lose your data.

## Detection engines

Self-learning analytics engines eliminate the need for updating signatures or defining rules. The engines use ICS specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies, malware, operational, protocol violations, and baseline network activity deviations.

> [!NOTE]
> It is recommended to enable all the security engines.

When an engine detects a deviation, an alert is triggered. Alerts can be viewed and managed from the alerts screen or from a partner system.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/deviation-alert-screen.png" alt-text="detects deviation":::

The name of the engine that triggered the alert is displayed under the alert title.

### Protocol violation engine 

A protocol violation occurs when the packet structure or field values don't comply with the protocol specification.

Example scenario:
"*Illegal MODBUS Operation (Function Code Zero)*" alert. This alert indicates that a primary device sent a request with function code 0 to a secondary device. This action is not allowed according to the protocol specification and the secondary device might not handle the input correctly.

### Policy violation engine

A policy violation occurs with a deviation from baseline behavior defined in learned or configured settings.

Example scenario:
"*Unauthorized HTTP User Agent*" alert. This alert indicates that an application that was not learned or approved by policy is used as an HTTP client on a device. This may be a new web browser or application on that device.

### Malware engine

The malware engine detects malicious network activity.

Example scenario: 
"*Suspicion of Malicious Activity (Stuxnet)*" alert. This alert indicates that the sensor detected suspicious network activity known to be related to the Stuxnet malware, which is an advanced persistent threat aimed at industrial control and SCADA networks.

### Anomaly engine

An anomaly in network behavior.

Example scenario: 
"*Periodic Behavior in Communication Channel.*" This is a component that inspects network connections and finds periodic and cyclic behavior of data transmission, which is common in industrial networks.

### Operational engine

Operational incidents or malfunctioning entities.

Example scenario: 
*“Device is Suspected to be Disconnected (Unresponsive)*" alert. This alert is raised when a device is not responding to any kind of request for a pre-defined period, this alert may indicate on a device shutdown, disconnection, or malfunction

### Enable and disable engines

When you disable a policy engine, information generated by that engine will not be available to the sensor. For example, if you disable the Anomaly engine you won’t receive alerts on network anomalies. If you created a forwarding rule, anomalies learned by the engine won’t be sent. To enable or disable a policy engine, select **Enabled** or **Disabled** for the specific engine.

The overall score is displayed in the lower right corner of the System Settings screen. The score indicates the percentage of available protection enabled through the threat protection engines. Each engine is 20% of available protection.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/protection-score-screen.png" alt-text="score":::

## Configure DHCP address ranges

Your network may consist of both static and dynamic IP addresses. Typically, static addresses are found on OT networks using historians, controllers, and network infrastructure devices such as switches and router. Dynamic IP allocation is typically implemented on guest networks, with laptops, PC’s, smartphones and other portable equipment (Using WIFI or LAN physical connections in different locations).

If you are working with dynamic networks, you handle IP address changes that occur when new IP addresses are assigned. This is done by defining DHCP address ranges.

This may happen, for example, when IP addresses are assigned by a DHCP server.

Defining dynamic IP addresses on each sensor enables comprehensive, transparent support in instances of IP address changes. This ensures comprehensive reporting for each unique device.

The sensor console presents the most current IP address associated with the device and provides information indicating which devices are dynamic. For example,

- The Data Mining Report, and Device Inventory consolidate all activity learned from the device as one entity, regardless of the IP address changes. These reports indicate which addresses were defined as DHCP addresses.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/populated-device-inventory-screen.png" alt-text="device inventory":::

- The Device Properties window indicates if the device was defined as a DHCP device.

To set a DHCP address range:

1.  On the side menu, select **DHCP Ranges** from the **System Settings** window.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/dhcp-address-range-screen.png" alt-text="DHCP Ranges":::

2.  Define a new range by setting **From** and **To** values.

3.  Optionally: Define the range name, up to 256 characters.

4.  To export the ranges to a CSV file, select **Export**.

5. To manually add multiple ranges from a CSV file, select **Import** and then select the file.

    > [!NOTE]
    > The ranges that you import from a CSV file overwrite the existing range settings.

6. Select **Save**.

## Configure DNS servers for reverse lookup resolution

To enhance asset enrichment, you can configure multiple DNS servers to carryout reverse lookups. You can resolve host names or FQDNs associated with the IP addresses detected in network subnets. For example, if a sensor discovers an IP address it may query multiple DNS servers to resolve the hostname.

All CIDR formats are supported.

The hostname appears in the asset inventory and asset map, as well as reports.

You can schedule reverse lookup resolution schedules for specific hourly intervals, for example every 12 hours, or at a specific time.

To define DNS servers:

1. Select **System Settings** and then select **DNS Settings.**

2. Select **Add DNS Server**.

    :::image type="content" source="media/how-to-enrich-asset-information/dns-reverse-lookup-configuration-screen.png" alt-text="Add DNS Server":::

3. In the schedule reverse DNS lookup field chose either:

    - intervals (per hour)
  
    - a specific time (use European formatting, 14:30 and not 2:30 PM)

4. In the **DNS Server Address** field, enter the DNS IP address.

5. In the **DNS Server Port** field, enter the DNS port.

6. Resolve the network IP addresses to asset FQDNs. Add the number of domain labels to display in **Number of Labels fields. Up to 30 characters are displayed from left to right.

7. Enter the subnets you want the DNS server to query in the **Subnets** field.

8. Select the **Enable** toggle if you want to initiate the reverse lookup.

### Test the DNS configuration 

Verify the settings you defined work properly using a test asset.

To test:

1. Enable the DNS Lookup toggle.

2. Select **Test**.

3. Enter an address in the **Lookup Address** of the DNS reverse lookup test for server dialog box.

    :::image type="content" source="media/how-to-enrich-asset-information/dns-reverse-looup-test-screen.png" alt-text="Lookup Address":::

4. Select **Test.**

## Configure windows endpoint monitoring

With the Windows Endpoint Monitoring capability, you can configure the Defender for IoT to selectively probe Windows systems. This provides you with more focused and accurate information about your devices, such as Service Pack levels.

Probing can be configured with specific ranges and hosts, and to be performed only as often as desired. Selective probing is accomplished using the Windows Management Interface (WMI), which is Microsoft's standard scripting language for managing Windows systems.

> [!NOTE]
> - You can run only one scan at a time.
> - The best results are obtained with users that have the domain or local administrator privileges.
> - Before you begin the WMI configuration, configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet using UDP port 135 and all TCP ports above 1024.

When the probe is finished, a log file with all the probing attempts is available from the export log option. The log contains all the IP addresses that were probed. For each IP address, there is success and failure info, and the error code - a free string derived from the exception. The scan of the last log only is kept in the system.

You can perform scheduled scans or manual scans. When the scan is finished, you can view the scan results in the CSV file.

**Prerequisites**

Configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet using UDP port 135 and all TCP ports above 1024.

To configure an automatic scan:

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-icon.png" border="false":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-screen.png" alt-text="Windows Endpoint Monitoring":::

3. In the Scan Schedule pane, configure as follows:

      - **By fixed intervals (in hours)**: Set the scan schedule according to intervals in hours.

      - **By specific times**: Set the scan schedule according to specific times and select **Save Scan**.

        :::image type="content" source="media/how-to-control-what-traffic-is-monitored/schedule-a-scan-screen.png" alt-text="Save Scan":::

4. To define the scan range, select **Set scan ranges**.

5. Set the IP address range and add your user and password.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/edit-scan-range-screen.png" alt-text="add user and password":::

6. To exclude an IP range from a scan, select **Disable** next to the range.

7. To remove a range, select :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/remove-scan-icon.png" border="false"::: next to the range.

8. Select **Save**. The **Edit Scan Ranges Configuration** dialog box closes, and the number of ranges appears in the **Scan Ranges** pane.

To perform a manual scan:

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-icon.png" border="false":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-screen.png" alt-text="Windows endpoint monitoring setup screen":::

3. In the **Actions** pane, select **Start scan**. A status bar appears in the **Actions** pane showing the progress of the scanning process.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/started-scan-screen.png" alt-text="Start scan":::

To view scan results:

1. When the scan is finished, in the **Actions** pane, select **View Scan Results**. The CSV file with the scan results is downloaded to your computer.

## See also

[Investigate sensor detections in a Device Inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)

[Investigate sensor detections in the device map](how-to-work-with-the-sensor-device-map.md)
