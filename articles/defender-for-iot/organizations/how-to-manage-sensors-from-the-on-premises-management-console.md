---
title: Manage OT sensors from the on-premises management console
description: Learn how to manage OT sensors from the on-premises management console, such as pushing system settings to OT sensors across your network.
ms.date: 03/09/2023
ms.topic: how-to
---

# Manage sensors from the on-premises management console

This article describes how you can manage OT sensors from an on-premises management console, such as pushing system settings to OT sensors across your network.

## Prerequisites

To perform the procedures in this article, make sure you have:

- An on-premises management console [installed](ot-deploy/install-software-on-premises-management-console.md) and [activated](ot-deploy/activate-deploy-management.md)

- One or more OT network sensors [installed](ot-deploy/install-software-ot-sensor.md), [activated](ot-deploy/activate-deploy-sensor.md), and [connected to your on-premises management console](ot-deploy/connect-sensors-to-management.md)

- Access to the on-premises management console as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Push system settings to OT sensors

If you have an OT sensor already configured with system settings that you want to share across to other OT sensors, push those settings from the on-premises management console. Sharing system settings across OT sensors saves time and streamlines your settings across your system.

Supported settings include:

- Mail server settings
- SNMP MIB monitoring settings
- Active Directory settings
- DNS reverse lookup settings
- Subnet settings
- Port aliases

**To push system settings across OT sensors**:

1. Sign into your on-premises management console and select **System settings**.

1. Scroll down to view the **Configure Sensors** area and select the setting you want to push across your OT sensors.

1. In the **Edit ... Configuration** dialog, select the OT sensor you want to share settings *from*. The dialog shows the current settings defined for the selected sensor.

1. Confirm that the current settings are the ones you want to share across your system, and then select **Duplicate**.

1. Select **Save** to save your changes.

The selected settings are applied across all connected OT sensors.

## Monitor disconnected OT sensors

If you're working with locally managed OT network sensors and on-premises management console, we recommend that you forward alerts about OT sensors that are disconnected from the on-premises management console to partner services.

### View OT sensor connection statuses

Sign into the on-premises management console and select **Site Management** to check for any disconnected sensors.

For example, you might see one of the following disconnection messages:

- **The on-premises management console can’t process data received from the sensor.**

- **Times drift detected. The on-premises management console has been disconnected from sensor.**

- **Sensor not communicating with on-premises management console. Check network connectivity or certificate validation.**

> [!TIP]
> You may want to send alerts about your OT sensor connection status on the on-premises management console to partner services. 
>
> To do this, [create a forwarding alert rule](how-to-forward-alert-information-to-partners.md#create-forwarding-rules-on-an-on-premises-management-console) on your on-premises management console. In the **Create Forwarding Rule** dialog box, make sure to select **Report System Notifications**.

## Retrieve forensics data stored on the sensor

Use Defender for IoT data mining reports on an OT network sensor to retrieve forensic data from that sensor’s storage. The following types of forensic data are stored locally on OT sensors, for devices detected by that sensor:

- Device data
- Alert data
- Alert PCAP files
- Event timeline data
- Log files

Each type of data has a different retention period and maximum capacity. For more information, see [Create data mining queries](how-to-create-data-mining-queries.md) and [Data retention across Microsoft Defender for IoT](references-data-retention.md).

### Turn off learning mode from your on-premises management console

A Microsoft Defender for IoT OT network sensor starts monitoring your network automatically after your [first sign-in](ot-deploy/activate-deploy-sensor.md#sign-in-to-your-ot-sensor). Network devices start appearing in your [device inventory](device-inventory.md), and [alerts](alerts.md) are triggered for any security or operational incidents that occur in your network.

Initially, this activity happens in *learning* mode, which instructs your OT sensor to learn your network's usual activity, including the devices and protocols in your network, and the regular file transfers that occur between specific devices. Any regularly detected activity becomes your network's [baseline traffic](ot-deploy/create-learned-baseline.md).

This procedure describes how to turn off learning mode manually for all connected sensors if you feel that the current alerts accurately reflect your network activity.

**To turn off learning mode**:

1. Sign into your on-premises management console and select **System Settings**.

1. In the **Sensor Engine Configuration** section, select one or more OT sensors you want to apply settings for, and clear the **Learning Mode** option.

1. Select **SAVE CHANGES** to save your changes.

## Next steps

For more information, see:

- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [Connect your OT sensors to the cloud](connect-sensors.md)
- [Track sensor activity](how-to-track-sensor-activity.md)
- [Update OT system software](update-ot-software.md)
- [Troubleshoot on-premises management console](how-to-troubleshoot-on-premises-management-console.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Manage threat intelligence packages on OT sensors](how-to-work-with-threat-intelligence-packages.md)
- [Control the OT traffic monitored by Microsoft Defender for IoT](how-to-control-what-traffic-is-monitored.md)