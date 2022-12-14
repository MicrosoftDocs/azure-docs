---
title: Data retention - Microsoft Defender for IoT
description: Learn about the retention periods / capacities for the different types of data stored on local, central, and global Microsoft Defender for IoT storage.
ms.topic: reference
ms.date: 12/14/2022
---

# Data retention

There are several types of forensic data stored on either a local sensor, a local central manager, or on the Azure portal. Each destination allows a certain storage capacity for each type of data, depending on its architecture. This article details how long a certain data type is stored, or, alternatively, how much of that data is stored until it's either deleted or overridden.

## Alerts retention periods

**Local storage on the sensor**:

Alerts are stored on the local sensor for 90 days.

New alerts are automatically closed if no identical traffic is detected 14 days after the initial detection. After 90 days of being closed, the alert is removed from the sensor console.  

If identical traffic is detected after the initial 14 days, the 14-day count for network traffic is reset.

Changing the status of an alert to *Learn*, *Mute* or *Close* doesn't affect how long the alert is displayed in the sensor console.

For more information, see [View alerts on your sensor](how-to-view-alerts.md).

**Central storage on the on-promises management console**:

Alerts are stored on the on-premises management console for 90 days from first detection time.

For more information, see [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md).

**Global cloud storage on the Azure portal**:

Alerts are stored on the Azure portal for 90 days from first detection time.

For more information, see [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md).

### PCAPs retention periods

**Local storage on the sensor**:

PCAP files are stored on the sensor for up to 90 days, depending on the sensor storage capacity. Maximum size of filtered PCAPs allowed is 133,120 MB. If you exceed this size, the oldest backed-up file is deleted to accommodate the new one.

For more information, see [Download PCAP files](how-to-view-alerts.md#download-pcap-files).

**Central storage on the on-promises management console**:

PCAPs aren't stored on the on-premises management console, but can be accessed through a direct link between the on-premises management console and the sensor, for as long as the on premises sensor stores them.

**Global cloud storage on the Azure portal**:

PCAP files are available for download from the Azure portal for as long as the on premises sensor stores them. Once downloaded, the files are cached on the Azure portal for 48 hours.

For more information, see [Access alert PCAP data (Public preview)](how-to-manage-cloud-alerts.md#access-alert-pcap-data-public-preview).

## Backups retention capacity

**Local storage on the sensor**:

The maximum size of sensor backup files stored on the sensor itself is 100 GB. If the size of the backup files passes this limit, old backup files are deleted. However, each sensor has its own backup directory on the management console.

For more information, see [Set up backup and restore files](how-to-manage-individual-sensors.md#set-up-backup-and-restore-files).

**Central storage on the on-promises management console**:

There are two types of backups saved on the on-premises management console, and each has a property of maximum size allowed:

- On-premises management console backups, where the maximum size is `backup.max_directory_size.gb` (about 10 GB)
- [Sensor backups on the on-premises management console](how-to-manage-sensors-from-the-on-premises-management-console.md#backup-storage-for-sensors), where the size is `sensors_backup.total_size_allowed.gb` (about 40 GB).

For more information, see [Define sensor backup schedules](how-to-manage-sensors-from-the-on-premises-management-console.md#define-sensor-backup-schedules).

> [!TIP]
> Though there are set default values for **Backups** and **PCAPs**, those values are customizable.

## Devices retention periods

**Local storage on the sensor**:

Device inventory data is stored for 90 days, for all sensors from sensor version 22.3 minor and up.

For more information, see [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).

**Central storage on the on-promises management console**:

Device inventory data is stored for 90 days, depending on the sensor.

For more information, see [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).

**Global cloud storage on the Azure portal**:

Device inventory data is stored for 90 days from last seen/activity field.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

## Event timelines retention capacity

Event timeline data is stored according to the sensor's [hardware profile](ot-appliance-sizing.md). Each hardware profile has a capacity to store a set number of events:

| Hardware profile | Number of events |
|---------|---------|
| C5600 | 10M events |
| E1800 | 10M events |
| E1000 | 6M events |
| E500 | 6M events |
| L500 | 3M events |
| L100 | 500-K events |
| L60 | 500-K events |

For more information about event timelines, see [Track sensor activity](how-to-track-sensor-activity.md).

## Logs retention capacity

There are numerous different kinds of log files, and they have different storage capacities. The following statements, however, are relevant to all logs:

- Logs are stored on the local sensor and the local central manager, and are overridden when they reach their maximum storage size.
- Depending on the amount of content, the average size per log is around 100-150 MB.
- Some of the logs have rotation and the data isn't overridden immediately.
- Though no logs are stored on the Azure portal itself, services/processing logs are stored for 30 days.

## Recommendations retention periods

Recommendations are stored only on the Azure portal for 90 days from first update time (discovered time).

For more information, see [Enhance security posture with security recommendations](recommendations.md).
