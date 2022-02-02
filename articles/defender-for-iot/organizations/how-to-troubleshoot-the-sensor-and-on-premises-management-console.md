---
title: Troubleshoot the sensor and on-premises management console
description: Troubleshoot your sensor and on-premises management console to eliminate any problems you might be having.
ms.date: 01/31/2022
ms.topic: article
---
# Troubleshoot the sensor and on-premises management console

This article describes basic troubleshooting tools for the sensor and the on-premises management console. In addition to the items described here, you can check the health of your system in the following ways:

- **Alerts**: An alert is created when the sensor interface that monitors the traffic is down.
- **SNMP**: Sensor health is monitored through SNMP. Microsoft Defender for IoT responds to SNMP queries sent from an authorized monitoring server.
- **System notifications**: When a management console controls the sensor, you can forward alerts about failed sensor backups and disconnected sensors.

## Troubleshoot sensors


### Investigate password failure at initial sign in

When signing into a preconfigured sensor for the first time, you'll need to perform password recovery as follows:

1. On the Defender for IoT sign in screen, select  **Password recovery**. The **Password recovery** screen opens.

1. Select either **CyberX** or **Support**, and copy the unique identifier.

1. Navigate to the Azure portal and select **Sites and Sensors**.  

1. Select the **More Actions** drop down menu and select **Recover on-premises management console password**.

    :::image type="content" source="media/how-to-create-and-manage-users/recover-password.png" alt-text=" Screenshot of the recover on-premises management console password option.":::

1. Enter the unique identifier that you received on the **Password recovery** screen and select **Recover**. The `password_recovery.zip` file is downloaded.

    :::image type="content" source="media/how-to-create-and-manage-users/enter-identifier.png" alt-text="Screenshot of the enter the unique identifier and then select recover.":::

    > [!NOTE]
    > Don't alter the password recovery file. It's a signed file and won't work if you tamper with it.

1. On the **Password recovery** screen, select **Upload**. **The Upload Password Recovery File** window will open.

1. Select **Browse** to locate your `password_recovery.zip` file, or drag the `password_recovery.zip` to the window.

1. Select **Next**, and your user, and system-generated password for your management console will then appear.

    > [!NOTE]
    > When you sign in to a sensor or on-premise management console for the first time it will be linked to the subscription you connected it to. If you need to reset the password for the CyberX, or Support user you will need to select that subscription. For more information on recovering a CyberX, or Support user password, see [Recover the password for the on-premises management console, or the sensor](how-to-create-and-manage-users.md#recover-the-password-for-the-on-premises-management-console-or-the-sensor).

### Investigate a lack of traffic

An indicator appears at the top of the console when the sensor recognizes that there's no traffic on one of the configured ports. This indicator is visible to all users. When this message appears, you can investigate where there's no traffic. Make sure the span cable is connected and there was no change in the span architecture.  


### Check system performance

When a new sensor is deployed or a sensor is working slowly or not showing any alerts, you can check system performance.

1. In the Defender for IoT dashboard > **Overview**, make sure that `PPS > 0`.
1. In *Devices** check that devices are being discovered.
1. In **Data Mining**, generate a report. 
1. In **Trends & Statistics** window, create a dashboard.
1. In **Alerts**, check that the alert was created.


### Investigate a lack of expected alerts 

If the **Alerts** window doesn't show an alert that you expected, verify the following:

1. Check if the same alert already appears in the **Alerts** window as a reaction to a different security instance. If yes, and this alert has not been handled yet, the sensor console does not show a new alert.
1. Make sure you did not exclude this alert by using the **Alert Exclusion** rules in the management console.

### Investigate dashboard that show no data

When the dashboards in the **Trends & Statistics** window show no data, do the following:
1. [Check system performance](#check-system-performance).
1. Make sure the time and region settings are properly configured and not set to a future time.

### Investigate a device map that shows only broadcasting devices

When devices shown on the device map appear not connected to each other, something might be wrong with the SPAN port configuration. That is, you might be seeing only broadcasting devices and no unicast traffic.

1. Validate that you're only seeing the broadcast traffic. To do this, in **Data Mining**, select **Create report**. In **Create new report**,specify the report fields. In **Choose Category**, choose **Select all**.
1. Save the report, and review it to see if only broadcast and multicast traffic (and no unicast traffic) appears. If so, asking networking to fix the SPAN port configuration so that you can see the unicast traffic as well. Alternately, you can record a PCAP directly from the switch, or connect a laptop by using Wireshark.

### Connect the sensor to NTP

You can configure a standalone sensor and a management console, with the sensors related to it, to connect to NTP.

To connect a standalone sensor to NTP:

- [Contact the Support team for assistance](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

To connect a sensor controlled by the management console to NTP:

- The connection to NTP is configured on the management console. All the sensors that the management console controls get the NTP connection automatically.

### Investigate when devices aren't shown on the map, or you have multiple internet-related alerts

Sometimes ICS devices are configured with external IP addresses. These ICS devices are not shown on the map. Instead of the devices, an internet cloud appears on the map. The IP addresses of these devices are included in the cloud image. Another indication of the same problem is when multiple internet-related alerts appear. Fix the issue as follows:

1. Right-click the cloud icon on the device map and select **Export IP Addresses**. 
1. Copy the public ranges that are private, and add them to the subnet list. Learn more about [configuring subnets](how-to-control-what-traffic-is-monitored.md#configure-subnets).
1. Generate a new data-mining report for internet connections.
1. In the data-mining report, enter the administrator mode and delete the IP addresses of your ICS devices.

### Tweak the sensor's Quality of Service (QoS)

To save your network resources, you can limit the interface bandwidth that the sensor uses for day-to-day procedures.

To limit the interface bandwidth, use the `cyberx-xsense-limit-interface` CLI tool that needs to be run with sudo permissions. The tool gets the following arguments:

- `* -i`: interfaces (example: eth0).

- `* -l`: limit (example: 30 kbit / 1 mbit). You can use the following bandwidth units: kbps, mbps, kbit, mbit, or bps.

- `* -c`: clear (to clear the interface bandwidth limitation).

**To tweak the Quality of Service (QoS)**:

1. Sign in to the sensor CLI as a Defender for IoT user, and enter `sudo cyberx-xsense-limit-interface-I eth0 -l value`.

   For example: `sudo cyberx-xsense-limit-interface -i eth0 -l 30kbit`

   > [!NOTE]
   > For a physical appliance, use the em1 interface.

1. To clear interface limitation, enter `sudo cyberx-xsense-limit-interface -i eth0 -l 1mbps -c`.


## Export sensor information

In addition to tools for monitoring and analyzing your network, you can export logs for further investigation.

- When you export logs, the sensor will automatically generate a one-time password (OTP), unique for the exported logs, in a separate text file.
- The exported logs are added to the **Archived Logs** list.
- Send the OTP to the support team in a separate message and medium from the exported logs. The support team will be able to extract exported logs only by using the unique OTP that's used to encrypt the logs.
- The list of archived logs can contain up to five items. If the number of items in the list goes beyond that number, the earliest item is deleted.

Export logs as follows:

1. On the left pane, select **System Settings**.
1. Under **Sensor management**, select **Backup & Restore**.
1. In **File Name**, type the name you want to use for the log export. The default is the current date.
1. You can export all data, all system data to investigate system state, or select specific logs.

    **Export category** | **Description** 
    --- | ---
    **Core Application Logs** | Select this option to export data about the core application configuration and operation.
    **Communication with CM logs** | Select this option if there are continuous problems or interruptions of connection with the management console.  **SNMP Logs** | Select this option to receive SNMP health check information.
    **System Sanity Output** | Select this option to check system performance.
    **Dissection Logs** | Select this option to check protocol logs.
    **Database Logs** | Select this option to export logs from the system database. Investigating system logs helps identify system problems. 
    **Operating System Logs** | Select this option to get information about the operating system state.
    **OS Kernel Dumps** | Select this option to export your kernel memory dump. A kernel memory dump contains all the memory that the kernel is using at the time of the problem that occurred in this kernel. The size of the dump file is smaller than the complete memory dump. Typically, the dump file is around one-third the size of the physical memory on the system.
    **Configuration** | Select this option to export information about all the configurable parameters to make sure everything was configured correctly.
    **Web Application Logs** | Select this option to get information about all the requests sent from the application's web interface.
    **Forwarding logs** | Select this option for investigation of the forwarding rules.
    **Installation/Upgrade logs** | Select this option for investigation of the installation and upgrade configuration parameters.
    **Dissection Statistics** | Select this option to allow advanced inspection of protocol statistics.
    **Profiling Service Log** | Select this option to allow advanced inspection of protocol statistics.

1. Select **Export**.



## Troubleshoot the on-premises console

### Investigate a lack of expected alerts on the management console

If an expected alert is not shown in the **Alerts** window, verify the following:

- Check if the same alert already appears in the **Alerts** window as a reaction to a different security instance. If yes, and this alert has not been handled yet, a new alert is not shown.

- Verify that you did not exclude this alert by using the **Alert Exclusion** rules in the on-premises management console.  

### Tweak the Quality of Service (QoS)

To save your network resources, you can limit the number of alerts sent to external systems (such as emails or SIEM) in one sync operation between an appliance and the on-premises management console.

The default is 50. This means that in one communication session between an appliance and the on-premises management console, there will be no more than 50 alerts to external systems. 

To limit the number of alerts, use the `notifications.max_number_to_report` property available in `/var/cyberx/properties/management.properties`. No restart is needed after you change this property.

**To tweak the Quality of Service (QoS)**:

1. Sign in as a Defender for IoT user.

1. Verify the default values:

   ```bash
   grep \"notifications\" /var/cyberx/properties/management.properties
   ```

   The following default values appear:

   ```bash
   notifications.max_number_to_report=50
   notifications.max_time_to_report=10 (seconds)
   ```

1. Edit the default settings:

   ```bash
   sudo nano /var/cyberx/properties/management.properties
   ```

1. Edit the settings of the following lines:

   ```bash
   notifications.max_number_to_report=50
   notifications.max_time_to_report=10 (seconds)
   ```

1. Save the changes. No restart is required.



## Export audit log from the management console

Audit logs record key information at the time of occurrence. Audit logs are useful when you are trying to figure out what changes were made, and by who. Audit logs can be exported in the management console, and contain the following information:

| Action | Information logged |
|--|--|
| **Learn, and remediation of alerts** | Alert ID |
| **Password changes** | User, User ID |
| **Login** | User |
| **User creation** | User, User role |
| **Password reset** | User name |
| **Exclusion rules-Creation**| Rule summary |
| **Exclusion rules-Editing**| Rule ID, Rule Summary |
| **Exclusion rules-Deletion** | Rule ID |
| **Management Console Upgrade** | The upgrade file used |
| **Sensor upgrade retry** | Sensor ID |
| **Uploaded TI package** | No additional information recorded. |

**To export the audit log**:

1. In the management console, in the left pane, select **System Settings**.

1. Select **Export**.

1. In the File Name field, enter the file name that you want to use for the exported log. If no name is entered, the default file name will be the current date.

1. Select **Audit Logs**.

1. Select **Export**.

The exported log is added to the **Archived Logs** list. Select the :::image type="icon" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/eye-icon.png" border="false"::: button to view the OTP. Send the OTP string to the support team in a separate message from the exported logs. The support team will be able to extract exported logs only by using the unique OTP that's used to encrypt the logs.

## Next steps

- [View alerts](how-to-view-alerts.md)

- [Set up SNMP MIB monitoring](how-to-set-up-snmp-mib-monitoring.md)

- [Understand sensor disconnection events](how-to-manage-sensors-from-the-on-premises-management-console.md#understand-sensor-disconnection-events)
