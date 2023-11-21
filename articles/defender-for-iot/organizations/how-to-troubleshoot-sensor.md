---
title: Troubleshoot the sensor | Microsoft Defender for IoT
description: Learn how to troubleshoot your Microsoft Defender for IoT OT sensor.
ms.date: 09/07/2023
ms.topic: troubleshooting
#CustomerIntent: As a Defender for IoT sensor admin, I want to know how to troubleshoot sensor issues so that I can get it back online quickly.
---
# Troubleshoot the sensor

This article describes basic troubleshooting tools for the sensor. In addition to the items described here, you can check the health of your system in the following ways:

- **Alerts**: An alert is created when the sensor interface that monitors the traffic is down.
- **SNMP**: Sensor health is monitored through SNMP. Microsoft Defender for IoT responds to SNMP queries sent from an authorized monitoring server.
- **System notifications**: When a management console controls the sensor, you can forward alerts about failed sensor backups and disconnected sensors.

For any other issues, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Prerequisites

To perform the procedures in this article, make sure that you have:

- Access to the OT network sensor as a **Support** user. For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

## Check sensor - cloud connectivity issues

OT sensors automatically run connectivity checks to ensure that your sensor has access to all required endpoints. If a sensor isn't connected, an error is indicated in the Azure portal, on the **Sites and sensors** page, and on the sensor's **Overview** page. For example:

:::image type="content" source="media/release-notes/connectivity-error.png" alt-text="Screenshot of a connectivity error on the Overview page." lightbox="media/release-notes/connectivity-error.png":::```

Use the **Cloud connectivity troubleshooting** page in your OT sensor to learn more about the error that occurred and recommended mitigation actions you can take.

**To troubleshoot connectivity errors**, sign into your OT sensor and do one of the following:

- From the sensor's **Overview** page, select the **Troubleshoot*** link in the error at the top of the page
- Select **System settings > Sensor management > Health and troubleshooting > Cloud connectivity troubleshooting**

The **Cloud connectivity troubleshooting** pane opens on the right. If the sensor is connected to the Azure portal, the pane indicates that **The sensor is connected to cloud successfully**. If the sensor isn't connected, a description of the issue and any mitigation instructions are listed instead. For example:

:::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/connectivity-troubleshooting.png" alt-text="Screenshot of the Connectivity troubleshooting pane.":::

The **Cloud connectivity troubleshooting** pane covers the following types of issues:

|Issue  |Description |
|---------|---------|
|**Errors establishing secure connections**     |   Occurs for SSL errors, which typically means that the sensor doesn't trust the certificate found. <br><br>This might occur due to an incorrect sensor time configuration, or using an SSL inspection service. SSL inspection services are often found in proxies and can lead to potential certificate errors. <br><br>For more information, see [Manage SSL/TLS certificates](how-to-manage-individual-sensors.md#manage-ssltls-certificates) and [Synchronize time zones on an OT sensor](how-to-manage-individual-sensors.md#synchronize-time-zones-on-an-ot-sensor).|
|**General connection errors**     | Occurs when the sensor can't connect with one or more required endpoints. <br><br>In such cases, ensure that all required endpoints are accessible from your sensor, and consider configuring more endpoints in your firewall. For more information, see [Provision sensors for cloud management](ot-deploy/provision-cloud-management.md).        |
|**Unreachable DNS server errors**     |  Occurs when the sensor can't perform name resolution due to an unreachable DNS server. In such cases, verify that your sensor can access the DNS server.   For more information, see [Update the OT sensor network configuration](how-to-manage-individual-sensors.md#update-the-ot-sensor-network-configuration)  |
|**Proxy authentication issues**     |  Occurs when a proxy demands authentication, but no credentials, or incorrect credentials, are provided. <br><br>In such cases, make sure that you've configured the proxy credentials correctly. For more information, see [Update the OT sensor network configuration](how-to-manage-individual-sensors.md#update-the-ot-sensor-network-configuration).      |
|**Name resolution failures**     | Occurs when the sensor can't perform name resolution for a specific endpoint. <br><br>In such cases, if your DNS server is reachable, make sure that the DNS server is configured on your sensor correctly. If the configuration is correct, we recommend reaching out to your DNS administrator.   <br><br>For more information, see [Update the OT sensor network configuration](how-to-manage-individual-sensors.md#update-the-ot-sensor-network-configuration).      |
|**Unreachable proxy server errors**     | Occurs when the sensor can't establish a connection with the proxy server. In such cases, confirm the reachability of your proxy server with your network team.    <br><br>For more information, see [Update the OT sensor network configuration](how-to-manage-individual-sensors.md#update-the-ot-sensor-network-configuration).      |


## Check system health

Check your system health from the sensor.

**To access the system health tool**:

1. Sign in to the sensor with the *support* user credentials and select **System Settings** > :::image type="icon" source="media/tutorial-install-components/system-health-check-icon.png" border="false"::: **System health check**.

1. In the **System health check** pane, select a command from the menu to view more details in the box. For example:

    :::image type="content" source="media/tutorial-install-components/system-health-check-sensor.png" alt-text="Screenshot that shows the system health check screen on the sensor console.":::

System health checks include the following:

|Name  |Description  |
|---------|---------|
|**Sanity**     |         |
|- Appliance     | Runs the appliance sanity check. You can perform the same check by using the CLI command `system-sanity`.        |
|- Version     | Displays the appliance version.        |
|- Network Properties     | Displays the sensor network parameters.        |
|**Redis**     |         |
|- Memory     |   Provides the overall picture of memory usage, such as how much memory was used and how much remained.      |
|- Longest Key     | Displays the longest keys that might cause extensive memory usage.        |
|**System**     |         |
|- Core Log     | Provides the last 500 rows of the core log, so that you can view the recent log rows without exporting the entire system log.        |
|- Task Manager     |  Translates the tasks that appear in the table of processes to the following layers: <br><br>  - Persistent layer (Redis)<br>  - Cache layer (SQL) |
|- Network Statistics     | Displays your network statistics.        |
|- TOP     |    Shows the table of processes. It's a Linux command that provides a dynamic real-time view of the running system.     |
|- Backup Memory Check     | Provides the status of the backup memory, checking the following:<br><br> - The location of the backup folder<br>  - The size of the backup folder<br>  - The limitations of the backup folder<br>  - When the last backup happened<br>  - How much space there is for the extra backup files        |
|- ifconfig     | Displays the parameters for the appliance's physical interfaces.        |
|- CyberX nload     | Displays network traffic and bandwidth by using the six-second tests.        |
|- Errors from core log     |  Displays errors from the core log file.       |

### Check system health by using the CLI

Verify that the system is up and running prior to testing the system's sanity.

For more information, see [CLI command reference from OT network sensors](cli-ot-sensor.md).

**To test the system's sanity**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user *support*.

1. Enter `system sanity`.

1. Check that all the services are green (running).

    :::image type="content" source="media/tutorial-install-components/support-screen.png" alt-text="Screenshot that shows running services.":::

1. Verify that **System is UP! (prod)** appears at the bottom.

Verify that the correct version is used:

**To check the system's version**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user *support*.

1. Enter `system version`.

1. Check that the correct version appears.

Verify that all the input interfaces configured during the installation process are running:

**To validate the system's network status**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the *support* user.

1. Enter `network list` (the equivalent of the Linux command `ifconfig`).

1. Validate that the required input interfaces appear. For example, if two quad Copper NICs are installed, there should be 10 interfaces in the list.

    :::image type="content" source="media/tutorial-install-components/interface-list-screen.png" alt-text="Screenshot that shows the list of interfaces.":::

Verify that you can access the console web GUI:

**To check that management has access to the UI**:

1. Connect a laptop with an Ethernet cable to the management port (**Gb1**).

1. Define the laptop NIC address to be in the same range as the appliance.

    :::image type="content" source="media/tutorial-install-components/access-to-ui.png" alt-text="Screenshot that shows management access to the UI." border="false":::

1. Ping the appliance's IP address from the laptop to verify connectivity (default: 10.100.10.1).

1. Open the Chrome browser in the laptop and enter the appliance's IP address.

1. In the **Your connection is not private** window, select **Advanced** and proceed.

1. The test is successful when the Defender for IoT sign-in screen appears.

   :::image type="content" source="media/tutorial-install-components/defender-for-iot-sign-in-screen.png" alt-text="Screenshot that shows access to management console.":::

## Download a diagnostics log for support

This procedure describes how to download a diagnostics log to send to support in connection with a specific support ticket.

This feature is supported for the following sensor versions:

- **22.1.1** - Download a diagnostic log from the sensor console.
- **22.1.3** and higher - For locally managed sensors, [upload a diagnostics log](how-to-manage-sensors-on-the-cloud.md#upload-a-diagnostics-log-for-support) from the **Sites and sensors** page in the Azure portal. This file is automatically sent to support when you open a ticket on a cloud-connected sensor.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

**To download a diagnostics log**:

1. On the sensor console, select **System settings > Sensor management > Health and troubleshooting > Backup & restore > Backup**.

1. Under **Logs**, select **Support Ticket Diagnostics**, and then select **Export**.

    :::image type="content" source="media/release-notes/support-ticket-diagnostics.png" alt-text="Screenshot of the Backup & Restore pane showing the Support Ticket Diagnostics option." lightbox="media/release-notes/support-ticket-diagnostics.png":::

1. For a locally managed sensor, version 22.1.3 or higher, continue with [Upload a diagnostics log for support](how-to-manage-sensors-on-the-cloud.md#upload-a-diagnostics-log-for-support).

## Retrieve forensics data

The following types of forensic data are stored locally on OT sensors, for devices detected by that sensor:

- Device data
- Alert data
- Alert PCAP files
- Event timeline data
- Log files

Use the OT sensor's [data mining reports](how-to-create-data-mining-queries.md) or [Azure Monitor workbooks](workbooks.md) on an OT network sensor to retrieve forensic data from that sensor’s storage. Each type of data has a different retention period and maximum capacity.

For more information, see [Data retention across Microsoft Defender for IoT](references-data-retention.md).

## You can't connect by using a web interface

1. Verify that the computer that you're trying to connect is on the same network as the appliance.

1. Verify that the GUI network is connected to the management port.

1. Ping the appliance's IP address. If there's no ping:

   1. Connect a monitor and a keyboard to the appliance.

   1. Use the *support* user and password to sign in.

   1. Use the command `network list` to see the current IP address.

1. If the network parameters are misconfigured, use the following procedure to change them:

   1. Use the command `network edit-settings`.

   1. To change the management network IP address, select **Y**.

   1. To change the subnet mask, select **Y**.

   1. To change the DNS, select **Y**.

   1. To change the default gateway IP address, select **Y**.

   1. For the input interface change (sensor only), select **N**.

   1. To apply the settings, select **Y**.

1. After restart, connect with the *support* user credentials and use the `network list` command to verify that the parameters were changed.

1. Try to ping and connect from the GUI again.

## The appliance isn't responding

1. Connect a monitor and keyboard to the appliance, or use PuTTY to connect remotely to the CLI.

1. Use the *support* user credentials to sign in.

1. Use the `system sanity` command and check that all processes are running. For example:

    :::image type="content" source="media/tutorial-install-components/system-sanity-screen.png" alt-text="Screenshot that shows the system sanity command.":::

For any other issues, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Investigate password failure at initial sign-in

When signing into a pre-configured sensor for the first time, you'll need to perform password recovery as follows:

1. On the Defender for IoT sign in screen, select  **Password recovery**. The **Password recovery** screen opens.

1. Select either **Support** or **CyberX**, and copy the unique identifier.

1. Navigate to the Azure portal and select **Sites and sensors**.

1. Select the **More Actions** drop down menu and select **Recover on-premises management console password**.

    :::image type="content" source="media/how-to-create-and-manage-users/recover-password.png" alt-text=" Screenshot of the recover on-premises management console password option.":::

1. Enter the unique identifier that you received on the **Password recovery** screen and select **Recover**. The `password_recovery.zip` file is downloaded. Don't extract or modify the zip file.

    :::image type="content" source="media/how-to-create-and-manage-users/enter-identifier.png" alt-text="Screenshot of the Recover dialog box.":::

1. On the **Password recovery** screen, select **Upload**. **The Upload Password Recovery File** window will open.

1. Select **Browse** to locate your `password_recovery.zip` file, or drag the `password_recovery.zip` to the window.

1. Select **Next**, and your user, and a system-generated password for your management console will then appear.

    > [!NOTE]
    > When you sign in to a sensor or on-premises management console for the first time, it's linked to your Azure subscription, which you'll need if you need to recover the password for the *support*, or *cyberx* user. For more information, see the relevant procedure for [sensors](manage-users-sensor.md#recover-privileged-access-to-a-sensor) or an [on-premises management console](legacy-central-management/manage-users-on-premises-management-console.md#recover-privileged-access-to-an-on-premises-management-console).

## Investigate a lack of traffic

An indicator appears at the top of the console when the sensor recognizes that there's no traffic on one of the configured ports. This indicator is visible to all users. When this message appears, you can investigate where there's no traffic. Make sure the span cable is connected and there was no change in the span architecture.

## Check system performance

When a new sensor is deployed or a sensor is working slowly or not showing any alerts, you can check system performance.

1. Sign in to the sensor and select **Overview**. Make sure that **PPS** is greater than 0, and that **Devices** are being discovered. 
1. In the **Data Mining** page, generate a report.
1. In the **Trends & Statistics** page, create a dashboard.
1. In the **Alerts** page, check that the alert was created.

## Investigate a lack of expected alerts

If the **Alerts** window doesn't show an alert that you expected, verify the following:

1. Check if the same alert already appears in the **Alerts** window as a reaction to a different security instance. If yes, and this alert hasn't been handled yet, the sensor console doesn't show a new alert.
1. Make sure you didn't exclude this alert by using the **Alert Exclusion** rules in the management console.

## Investigate dashboard that shows no data

When the dashboards in the **Trends & Statistics** window show no data, do the following:

1. [Check system performance](#check-system-performance).
1. Make sure the time and region settings are properly configured and not set to a future time.

## Investigate a device map that shows only broadcasting devices

When devices shown on the device map appear not connected to each other, something might be wrong with the SPAN port configuration. That is, you might be seeing only broadcasting devices and no unicast traffic.

1. Validate that you're only seeing the broadcast traffic. To do this, in **Data Mining**, select **Create report**. In **Create new report**, specify the report fields. In **Choose Category**, choose **Select all**.
1. Save the report, and review it to see if only broadcast and multicast traffic (and no unicast traffic) appears. If so, contact your networking team to fix the SPAN port configuration so that you can see the unicast traffic as well. Alternately, you can record a PCAP directly from the switch, or connect a laptop by using Wireshark. 

For more information, see:
- [Configure traffic mirroring](traffic-mirroring/traffic-mirroring-overview.md)
- [Upload and play PCAP files](how-to-manage-individual-sensors.md#upload-and-play-pcap-files)

## Connect the sensor to NTP

You can configure a standalone sensor and a management console, with the sensors related to it, to connect to NTP.

> [!TIP]
> When you're ready to start managing your OT sensor settings at scale, define NTP settings from the Azure portal. Once you apply settings from the Azure portal, settings on the sensor console are read-only. For more information, see [Configure OT sensor settings from the Azure portal (Public preview)](configure-sensor-settings-portal.md).

To connect a standalone sensor to NTP:

- [See the CLI documentation](./references-work-with-defender-for-iot-cli-commands.md).

To connect a sensor controlled by the management console to NTP:

- The connection to NTP is configured on the management console. All the sensors that the management console controls get the NTP connection automatically.

## Investigate when devices aren't shown on the map, or you have multiple internet-related alerts

Sometimes ICS devices are configured with external IP addresses. These ICS devices aren't shown on the map. Instead of the devices, an internet cloud appears on the map. The IP addresses of these devices are included in the cloud image. Another indication of the same problem is when multiple internet-related alerts appear. Fix the issue as follows:

1. Right-click the cloud icon on the device map and select **Export IP Addresses**.
1. Copy the public ranges that are private, and add them to the subnet list. For more information, see [Fine tune your subnet list](how-to-control-what-traffic-is-monitored.md#fine-tune-your-subnet-list).
1. Generate a new data-mining report for internet connections.
1. In the data-mining report, enter the administrator mode and delete the IP addresses of your ICS devices.

## Clearing sensor data

In cases where the sensor needs to be relocated or erased, all learned data can be cleared from the sensor.

For more information on how to clear system data, see [Clear OT sensor data](how-to-manage-individual-sensors.md#clear-ot-sensor-data).

## Export logs from the sensor console for troubleshooting

For further troubleshooting, you may want to export logs to send to the support team, such as database or operating system logs.

**To export log data**:

1. In the sensor console, go to **System settings** > **Sensor management** > **Backup & restore** > **Backup**.

1. In the **Export Troubleshooting Information** dialog:

    1. In the **File Name** field, enter a meaningful name for the exported log. The default filename uses the current date, such as **13:10-June-14-2022.tar.gz**.

    1. Select the logs you would like to export.

    1. Select **Export**.

    The file is exported and is linked from the **Archived Files** list at the bottom of the **Export Troubleshooting Information** dialog.

    For example:

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/export-logs-sensor.png" alt-text="Screenshot of the export troubleshooting information dialog in the sensor console. " lightbox="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/export-logs-sensor.png":::

1. Select the file link to download the exported log, and also select the :::image type="icon" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/eye-icon.png" border="false"::: button to view its one-time password.

1. To open the exported logs, forward the downloaded file and the one-time password to the support team. Exported logs can be opened only together with the Microsoft support team.

    To keep your logs secure, make sure to forward the password separately from the downloaded log.

> [!NOTE]
> Support ticket diagnostics can be downloaded from the sensor console and then uploaded directly to the support team in the Azure portal. For more information on downloading diagnostic logs, see [Download a diagnostics log for support](how-to-troubleshoot-sensor.md#download-a-diagnostics-log-for-support).

## Next steps

- [View alerts](how-to-view-alerts.md)

- [Set up SNMP MIB health monitoring on an OT sensor](how-to-set-up-snmp-mib-monitoring.md)

- [Monitor disconnected OT sensors](legacy-central-management/how-to-manage-sensors-from-the-on-premises-management-console.md#monitor-disconnected-ot-sensors)
