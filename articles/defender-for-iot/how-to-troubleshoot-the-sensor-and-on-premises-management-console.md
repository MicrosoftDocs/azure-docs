---
title: Troubleshoot the sensor and on-premises management console
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/12/2020
ms.topic: article
ms.service: azure
---

# Export troubleshooting logs

## Sensor troubleshooting logs

### *No traffic* indication

The *No traffic* indicator appears at the top of the console when the sensor recognizes that there is no traffic on one of the configured ports. This indication is visible to all users.

:::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image322.png" alt-text="No traffic":::
 
When this message appears, you can investigate where there is no traffic. Make sure the span cable is connected and there was no change in the span architecture.  

For support and troubleshooting information, please contact [support.microsoft.com](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099)

### Checking system performance indicators 

When a new sensor is deployed or if, for example, the sensor is working slowly or not showing any alerts, you can check system sanity.

**To check:**

1. In the **Dashboard**, make sure that PPS > 0.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image323.png" alt-text="Dashboard":::

2. From the side menu, select **Assets**.

3. In the **Assets** window, make sure assets are being discovered.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image324.png" alt-text="Assets":::

4. From the side menu, select **Data Mining**.

5. In the **Data Mining** window, select **ALL** and generate a report.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image325.png" alt-text="Data Mining":::

6. Make sure the report contains data.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image326.png" alt-text="contains data":::

7. From the side menu, select **Trends & Statistics**.

8. In the **Trends & Statistics** window, select **Add Widget**.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image327.png" alt-text="Add Widget":::

9. Add a widget and make sure it shows data.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image328.png" alt-text="traffic by port":::

10. From the side menu, select Alerts. The Alerts window appears.

11. Make sure the alerts were created.

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image329.png" alt-text="alerts":::

### Sensor health checks

You can check the health of your system in the following ways:

  - **Alerts:** An alert is created when the sensor interface that monitors the traffic is down. For more information about working with alerts in the Alerts window, see ***Alerts***.

  - **SNMP:** Sensor health is monitored using SNMP. Defender for IoT responds to SNMP queries sent from an authorized monitoring server. For more information about SNMP, refer to Configuring SNMP MIB Monitoring.

  - **System Notifications:** When the sensor is controlled by a management console, you can receive notifications from it about:

      - the sensor connection status
      
      - remote backup failures

For information about enabling System Notifications on the on-premises management console, refer to the *On-premises Management Console User Guide*.

### Expected alerts are not shown

If an expected alert is not shown in the Alerts window, verify the following:

  - Check if the same alert already appears in the Alerts window as a reaction to a different security instance. If yes, and this alert has not been handled yet, the sensor console does not show a new alert.

  - Make sure you did not exclude this alert using the Alert Exclusion rules in the management console. For more information about alert exclusions, refer to the Management console user guide.

### Widgets show no data

When the widgets in the **Trends & Statistics** window show no data, verify the following:

  - Check the system sanity, see Checking System page 159.

  - Make sure the Time & Regional settings are properly configured and not set to the future time. For more information about setting the Time & Regional, refer to [Configure Time and Region](./configure-time-and-region.md).

### Asset map shows only broadcasting assets

When assets shown on the map appear not connected to each other, it might indicate that something is wrong with the SPAN port configuration and therefore you can see only broadcasting devices and no unicast traffic.

  :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image330.png" alt-text="broadcasting assets":::

In such a case, you need to validate that you can see only the broadcast traffic and then ask the network engineer to fix the SPAN port configuration so that you could see the unicast traffic.

**To validate you are seeing only the broadcast traffic:**

   - In Data Mining, create a report using the All option, then look at the traffic. The broadcast/multicast traffic only appears in the report and no unicast traffic.

  Or,

   - Record a PCAP directly from the switch, Or connect a laptop using Wireshark.

### Connect the sensor to NTP

You can configure a standalone sensor and a management console with the sensors related to it to connect to NTP.

**To connect a standalone sensor to NTP:**

  - Contact the Support team for assistance: [support.microsoft.com](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

**To connect a sensor-controlled by Management console to NTP:**

  - The connection to NTP is configured on the Management console and all the sensors controlled by the Management console get the NTP connection automatically.

### Assets not shown on map, multiple internet related alerts

Sometimes ICS assets are configured with external IP addresses. These ICS assets are not shown on the map. Instead of the assets, an Internet cloud is presented on the map and the IPs of these assets are included in the cloud.

Another indication of the same problem is when multiple internet related alerts are created.

  :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image331.png" alt-text="alerts":::

**To fix the configuration:**

1. Right-click on the Cloud icon on the Device map and select Export IP Addresses. Copy the public ranges that are private and add them to the subnet list. See [Configure Subnets](./configure-subnets.md).

2. Generate a new data mining report for internet connections.

3. In the data mining report, select :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/image332.png" alt-text="Admin mode"::: to enter the Admin mode and delete the IP addresses of your ICS assets.

### Tweaking the sensor quality of service

To save your network resources, you can limit the interface bandwidth used by the sensor for day-to-day procedures.

To limit the interface bandwidth, use the `cyberx-xsense-limit-interface` CLI tool that needs to be executed with sudo permissions. The tool gets the following arguments:

  - `* -i`: interfaces (ex: eth0)

  - `* -l`: limit (ex: 30kbit / 1mbit). You can use the following bandwidth units: kbps, mbps, kbit, mbit or bps

  - `* -c`: clear (to clear the interface bandwidth limitation)

**To tweak the Quality of Service:**

1. Login as user 'cyberx' to the sensor CLI: `sudo cyberx-xsense-limit-interface-I eth0 -l value`

   For example: `sudo cyberx-xsense-limit-interface -i eth0 -l 30kbit`

   > [!NOTE]
   > For physical appliance use the “em1” interface.

2. To clear interface limitation: `sudo cyberx-xsense-limit-interface -i eth0 -l 1mbps -c`



## On-premises management console troubleshooting solutions

### Health check

You can check the health of the on-premises management console as follows:

- **Alerts**: An alert is created when the sensor interface that monitors the traffic is down. For more information about working with alerts in the Alerts window, refer to *Alerts*. 

- **SNMP**: On-premises management console's health is monitored using SNMP. CyberX responds to SNMP queries sent from an authorized monitoring server. For more information about SNMP, refer to **Set Up SNMP MIB Monitoring**.

- **System Notifications**: When the sensor is controlled by an on-premises management console, you can receive from the On-premises management console notifications about Sensors' health status, for more information about getting system notifications, refer to **Define Forwarding Rules**.

### Expected alerts are not shown

In case an expected alert is not shown in the Alerts window, verify the following:

- Check if the same alert already appears in the Alerts window as a reaction to a different security instance. If yes, and this alert has not been handled yet, a new alert is not shown.   

- Verify that you did not exclude this alert using the Alert Exclusion rules in the on-premises management console.  

### Tweak the Quality of Service

To save your network resources, you can limit the number of alerts sent to external systems (like emails or SIEM) in 1 sync operation between an appliance and the on-premises management console.

The default is 50. This means that in 1 communication session between an appliance and on-premises management console, there will be no more than 50 alerts to external systems. 

To limit the number of alerts, use the `notifications.max_number_to_report` property available in `/var/cyberx/properties/management.properties`.

No restart is needed after changing this property.

**To tweak the Quality of Service:**

1. Login as user: *cyberx*. 

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
