---
title: Troubleshoot the sensor and on-premises management console
description: Troubleshoot you sensor and on-premises management console to eliminate any issues you may be having.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/12/2020
ms.topic: article
ms.service: azure
---
# Troubleshooting

This article describes basic troubleshooting tools for the sensor and management console. In addition to the items described here, you can also:

- Export Troubleshooting logs to support for further investigation.

- Check the health of your system in the following ways:

    - Alerts: An alert is created when the sensor interface that monitors the traffic is down. 

    - SNMP: Sensor health is monitored using SNMP. Defender for IoT responds to SNMP queries sent from an authorized monitoring server. For more information about SNMP, see [Set up SNMP MIB monitoring](how-to-set-up-snmp-mib-monitoring.md).

    - System Notifications: When the sensor is controlled by a management console, you can forward alerts about failed sensor backups and disconnected sensors.

## Sensor Troubleshoot tools
### No traffic indication

The No Traffic indicator appears at the top of the console when the sensor recognizes that there is no traffic on one of the configured ports. This indication is visible to all users.

:::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/no-traffic-detected.png" alt-text="Screenshot of no traffic detected alert.":::
 
When this message appears, you can investigate where there is no traffic. Make sure the span cable is connected and there was no change in the span architecture.  

For support and troubleshooting information, contact [support.microsoft.com](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099)

### Check system performance indicators 

When a new sensor is deployed or, for example, the sensor is working slowly or not showing any alerts, you can check the system sanity.

To check the system sanity:

1. In the Dashboard, make sure that `PPS > 0`.

   :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/dashboard-view.png" alt-text="Screenshot of a sample dashboard."::: 

2. From the side menu, select **Devices**.

3. In the Devices window, make sure devices are being discovered.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/discovered-devices.png" alt-text="Endure that devices are discovered.":::

4. From the side menu, select **Data Mining**.

5. In the Data Mining window, select **ALL** and generate a report.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/new-report-generated.png" alt-text="Generate a new report using data mining.":::

6. Make sure the report contains data.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/new-report-generated.png" alt-text="Ensure that your report contains data.":::

7. From the side menu, select **Trends & Statistics**.

8. In the Trends & Statistics window, select **Add Widget**.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/add-widget.png" alt-text="Add a widget by selecting it.":::

9. Add a widget and make sure it shows data.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/widget-data.png" alt-text="Ensure your widget is showing data.":::

10. From the side menu, select **Alerts**. The Alerts window appears.

11. Make sure the alerts were created.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/alerts-created.png" alt-text="Ensure that alerts were created.":::


### Expected alerts are not shown

If an expected alert is not shown in the Alerts window, verify the following:

  - Check if the same alert already appears in the Alerts window as a reaction to a different security instance. If yes, and this alert has not been handled yet, the sensor console does not show a new alert.

  - Make sure you did not exclude this alert using the Alert Exclusion rules in the management console. 

### Widgets show no data

When the widgets in the **Trends & Statistics** window show no data, verify the following:

  - Check the system sanity, see Checking System page 159.

  - Make sure the time and regional settings are properly configured and not set to the future time. 

### Device map shows only broadcasting devices

When devices shown on the map appear not connected to each other, it might indicate that something is wrong with the SPAN port configuration and therefore you can see only broadcasting devices and no unicast traffic.

  :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/broadcasting-devices.png" alt-text="View your broadcasting devices.":::

In such a case, you need to validate that you can see only the broadcast traffic and then ask the network engineer to fix the SPAN port configuration so that you could see the unicast traffic.

To validate you are seeing only the broadcast traffic:

   - In the Data Mining screen, create a report using the **All** option, then look at the traffic. The broadcast and multicast traffic only appears in the report and no unicast traffic.

  Or,

   - Record a PCAP directly from the switch, or connect a laptop using Wireshark.

### Connect the sensor to NTP

You can configure a standalone sensor and a management console with the sensors related to it to connect to NTP.

To connect a standalone sensor to NTP:

  - Contact the Support team for assistance: [support.microsoft.com](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

To connect a sensor controlled by the management console to NTP:

  - The connection to NTP is configured on the management console and all the sensors controlled by the management console get the NTP connection automatically.

### Devices not shown on map, multiple internet-related alerts

Sometimes ICS devices are configured with external IP addresses. These ICS devices are not shown on the map. Instead of the devices, an internet cloud is presented on the map and the IP addresses of these devices are included in the cloud.

Another indication of the same problem, is when multiple internet-related alerts are created.

  :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/alert-problems.png" alt-text="Multiple internet-related alerts.":::

To fix the configuration:

1. Right-click on the Cloud icon on the Device map and select Export IP Addresses. Copy the public ranges that are private and add them to the subnet list. For more information, see [Configure subnets](how-to-control-what-traffic-is-monitored.md#configure-subnets).

2. Generate a new data mining report for internet connections.

3. In the data mining report, select :::image type="icon" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/administrator-mode.png" border="false"::: to enter the administrator mode and delete the IP addresses of your ICS devices.

### Tweak the sensor quality of service

To save your network resources, you can limit the interface bandwidth used by the sensor for day-to-day procedures.

To limit the interface bandwidth, use the `cyberx-xsense-limit-interface` CLI tool that needs to be executed with sudo permissions. The tool gets the following arguments:

  - `* -i`: interfaces (ex: eth0)

  - `* -l`: limit (ex: 30 kbit / 1 mbit). You can use the following bandwidth units: kbps, mbps, kbit, mbit, or bps

  - `* -c`: clear (to clear the interface bandwidth limitation)

To tweak the quality of service:

1. Sign in as user Defender for IoT to the sensor CLI and enter: `sudo cyberx-xsense-limit-interface-I eth0 -l value`

   For example: `sudo cyberx-xsense-limit-interface -i eth0 -l 30kbit`

   > [!NOTE]
   > For physical appliance use the em1 interface.

2. To clear interface limitation: `sudo cyberx-xsense-limit-interface -i eth0 -l 1mbps -c`

## On-premises management console troubleshooting solutions

### Expected alerts are not shown

In case an expected alert is not shown in the Alerts window, verify the following:

- Check if the same alert already appears in the Alerts window as a reaction to a different security instance. If yes, and this alert has not been handled yet, a new alert is not shown.

- Verify that you did not exclude this alert using the Alert Exclusion rules in the on-premises management console.  

### Tweak the quality of service

To save your network resources, you can limit the number of alerts sent to external systems (such as emails, or SIEM) in one sync operation between an appliance and the on-premises management console.

The default is 50. This means that in one communication session between an appliance and on-premises management console, there will be no more than 50 alerts to external systems. 

To limit the number of alerts, use the `notifications.max_number_to_report` property available in `/var/cyberx/properties/management.properties`.

No restart is needed after changing this property.

To tweak the Quality of Service:

1. Sign in as user: Defender for IoT. 

2. Verify the default values:

```bash
grep \"notifications\" /var/cyberx/properties/management.properties
```

The following default values appear:

```bash
notifications.max_number_to_report=50
notifications.max_time_to_report=10 (seconds)
```

3. To edit the default settings:

```bash
sudo nano /var/cyberx/properties/management.properties
```

4. Edit the settings of the following lines:

```bash
notifications.max_number_to_report=50
notifications.max_time_to_report=10 (seconds)
```

5. Save the changes, no reboot is required.

## See also

- [View alerts](how-to-view-alerts.md)

- [Set up SNMP MIB monitoring](how-to-set-up-snmp-mib-monitoring.md)

- [Understand sensor disconnection events](how-to-manage-sensors-from-the-on-premises-management-console.md#understand-sensor-disconnection-events)

