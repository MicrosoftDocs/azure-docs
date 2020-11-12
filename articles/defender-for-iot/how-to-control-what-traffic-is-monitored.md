---
title: Control what traffic is monitored
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/12/2020
ms.topic: article
ms.service: azure
---

# Overview

## Configure subnets

Subnet configurations impact how you see assets in the Asset map.

By default, the sensor discovers your subnet setup, and populates the Subnet Configuration dialog box with this information.

To enable focus on the OT assets, IT assets are automatically aggregated by subnet in the asset map. Each subnet is presented as a single entity on the map, including an interactive collapsing/expanding capability to “drill down” into an IT subnet and back.

When working with subnets, select the ICS subnets to identify the OT subnets. This way you can focus the map view on OT/ICS networks and collapse to a minimum the presentation of IT network elements, which reduces the total number of the assets presented on the map and provides a clear picture of the OT/ICS network elements.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/image64.png" alt-text="filter to network":::

You can change the configuration or change the subnet information manually by exporting the discovered data, changing it manually and then importing back the list of subnets that you manually defined. For more information about export/import, refer to [Import Asset Information](./import-asset-information.md).

In some cases, such as environments that use public ranges as internal ranges, you can instruct the sensor to resolve all subnets as internal subnets by selecting the **Do Not Detect Internet Activity** option. When selected:

  - *Public IPs will be treated as local addresses.*

  - No alerts will be sent about unauthorized internet activity. This reduces notifications and alerts received on external addresses.

**To configure subnets:**

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Subnets**.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image284.png" alt-text="C:\Users\cyberx\AppData\Local\Temp\SNAGHTML4852db0a.PNG":::

3. To add subnets automatically when new assets are discovered, keep **Auto Subnets Learning** selected.

4. To resolve all subnets as internal subnets, select **Don’t Detect Internet Activity**.

5. Select **Add network** and define the following parameters for each subnet:

    - The subnet IP address
    
    - The subnet mask address
    
    - The subnet name, it is recommended to name each subnet with a meaningful name that you can easily identify in order to differentiate between IT and OT networks. The name can be up to 60 characters.

6. To mark this subnet as an OT subnet, select **ICS Subnet**.

7. To present the subnet separately when arranging the map according to the Purdue, select **Segregated**.

8. To delete a subnet, select :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image285.png" alt-text="delete":::.

9. To delete all subnets, select **Clear All**.

10. To export subnets configured, select **Export**. The subnets table is downloaded to your workstation.

11. Select **Save**.

### Importing information 

To import subnets information, select **Import** and select a CSV file to import. The subnet information is updated with the information you imported. If you important an empty field, you will lose your data.

## Configure Detection Engines

Self-learning analytics engines eliminate the need for updating signatures or defining rules. The engines leverage ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies, malware, operational, protocol violations, and baseline network activity deviations.

> [!NOTE]
> It is recommended to enable all the security engines.

When an engine detects a deviation, an alert is triggered. Alerts can be viewed and managed from the Alerts screen or from a third-party system. See [Alerts](./alerts.md) for details.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/image280.png" alt-text="detects deviation":::

The name of the engine that triggered the alert is displayed under the alert title.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/image281.png" alt-text="operational":::

#### Protocol violation engine 

A protocol violation occurs when the packet structure or field values don't comply with the protocol specification.

#### Example scenario

"*Illegal MODBUS Operation (Function Code Zero)*" alert. This alert indicates that the master asset sent a request with function code 0 to a slave asset. This is not allowed according to the protocol specification and the slave asset might not handle the input correctly.

#### Policy violation engine

A policy violation occurs with a deviation from baseline behavior defined in learned or configured settings.

#### Example scenario

"*Unauthorized HTTP User Agent*" alert. This alert indicates that an application that was not learned or approved by policy is used as an HTTP client on an asset. This may be a new web browser or application on that asset.

#### Malware engine

The malware engine detects malicious network activity.

#### Example scenario

"*Suspicion of Malicious Activity (Stuxnet)*" alert. This alert indicates that the sensor detected suspicious network activity known to be related to the Stuxnet malware, which is an advanced persistent threat aimed at industrial control / SCADA networks.

#### Anomaly engine

An anomaly in network behavior.

#### Example scenario

"*Periodic Behavior in Communication Channel.*" This is a component that inspects network connections and finds periodic/cyclic behavior of data transmission, which is very common in industrial networks.

#### Operational engine

Operational incidents or malfunctioning entities.

#### Example scenario

*“Asset is Suspected to be Disconnected (Unresponsive)*" alert. This alert is raised when an asset is not responding to any kind of request for a pre-defined period, this may indicate on an asset shutdown, disconnection or malfunction

### Enabling and disabling engines

When you disable a policy engine, information generated by that engine will not be available to the sensor. For example, if you disable the Anomaly engine you won’t receive alerts on network anomalies. If you created a forwarding rule, anomalies learned by the engine won’t be sent. To enable or disable a policy engine, select **Enabled** or **Disabled** for the specific engine.

The overall score is displayed in the lower right corner of the System Settings screen. The score indicates the percentage of available protection enabled through the threat protection engines. Each engine is 20% of available protection.

:::image type="content" source="media/how-to-control-what-traffic-is-monitored/image282.png" alt-text="score":::

## Configure DHCP address ranges

Your network may consist of both static and dynamic IP addresses. Typically, static addresses are found on OT networks using historians, controllers, and network infrastructure assets such as switches and router. Dynamic IP allocation is typically implemented on guest networks, with laptops, PC’s, smartphones and other portable equipment (Using WIFI or LAN physical connections in different locations).

If you are working with dynamic networks, you handle IP address changes that occur when new IPs are assigned. This is done by defining DHCP address ranges.

This may happen for example when IPs are assigned by a DHCP server.

Defining dynamic IPs enables comprehensive, transparent support in instances of IP address changes. This ensures comprehensive reporting for each unique asset.

The sensor console presents the most current IP address associated with the asset and provides information indicating which assets are dynamic. For example,

  - The Data Mining Report, and Asset Inventory consolidate all activity learned from the asset as one entity, regardless of the IP address changes. These reports indicate which addresses were defined as DHCP addresses.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image290.png" alt-text="ethernet IP":::

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image291.png" alt-text="asset inventory":::

  - The Asset Properties window indicates if the asset was defined as a DHCP asset.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image292.png" alt-text="Asset Properties":::

**To set a DHCP address range:**

1.  On the side menu, select **DHCP Ranges** from the **System Settings** window.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image293.png" alt-text="DHCP Ranges":::

2.  Define a new range by setting **From**/**To** values.

3.  Optionally: Define the range name, up to 256 characters.

4.  To export the ranges to a CSV file, select **Export**.

5. To manually add multiple ranges from a CSV file, select **Import** and select the file.

    > [!NOTE]
    > The ranges that you import from a CSV file overwrite the existing range settings.

6. Select **Save**.

## Configuring windows endpoint monitoring

With the Windows Endpoint Monitoring capability, you can configure the Defender for IoT to selectively probe Windows systems. This provides you with more focused and accurate information about your assets, such as Service Pack levels.

Probing can be configured with specific ranges/hosts, and to be performed only as often as desired. Selective probing is accomplished using the Windows Management Interface (WMI), which is Microsoft's standard scripting language for managing Windows systems.

> [!NOTE]
> - You can run only one scan at a time.
> - The best results are obtained with users that have the DOMAIN or LOCAL administrator privileges.
> - Before you begin the WMI configuration, configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet using UDP port 135 and all TCP ports above 1024.

When the probe is finished, a log file with all the probing attempts is available from the Export Log option, refer to [Exporting Information for](./exporting-information-for-troubleshooting.md) on page 149. The log contains all the IPs that were probed. For each IP there is Success/Failure info, and the error code - a free string derived from the exception. The scan of the last log only is kept in the system.

You can perform scheduled scans or manual scans. When the scan is finished, you can view the scan results in the CSV file.

**Pre-Requisites**

Configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet using UDP port 135 and all TCP ports above 1024.

**To configure an automatic scan:**

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image313.png" alt-text="select":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image314.png" alt-text="Windows Endpoint Monitoring":::

3. In the Scan Schedule pane, configure as follows:

      - **By fixed intervals (in hours)**: Set the scan schedule according to intervals in hours.

      - **By specific times**: Set the scan schedule according to specific times and select **Save Scan**.

        :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image315.png" alt-text="Save Scan":::

4. To define the scan range, select **Set scan ranges**.

5. Det the IP address range and add your user and password.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image316.png" alt-text="add user and password":::

6. To exclude an IP range from a scan, select **Disable** next to the range.

7. To remove a range, select :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image317.png" alt-text="remove"::: next to the range.

8. Select **Save**. The **Edit Scan Ranges Configuration** dialog box closes, and the number of ranges appears in the **Scan Ranges** pane.

**To perform a manual scan:**

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image313.png" alt-text="select 2":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image314.png" alt-text="Windows Endpoint Monitoring 2":::

3. In the **Actions** pane, select **Start scan**. A status bar appears in the **Actions** pane showing the progress of the scanning process.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/image318.png" alt-text="Start scan":::

**To view scan results:**

  - When the scan is finished, in the **Actions** pane, select **View Scan Results**. The CSV file with the scan results is downloaded to your computer.
