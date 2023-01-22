---
title: Data retention across Microsoft Defender for IoT
description: Learn about the data retention periods and capacities for Microsoft Defender for IoT data stored in Azure, the OT sensor, and on-premises management console.
ms.topic: reference
ms.date: 01/22/2023
---

# Data retention across Microsoft Defender for IoT

Microsoft Defender for IoT stores data in the Azure portal, on OT network sensors, and on-premises management consoles.

Each storage location affords a certain storage capacity and retention times. This article describes how  much and how long each type of data is stored in each location before it's either deleted or overridden.

## Device data retention periods

The following table lists how long device data is stored in each Defender for IoT location.

| Storage type | Details |
|---------|---------|
| **Azure portal** | 90 days from the date of the **Last activity** value. <br><br> For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md). |
| **OT network sensor** | The retention of device inventory data isn't limited by time. <br><br> For more information, see [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md). |
| **On-promises management console** | The retention of device inventory data isn't limited by time. <br><br> For more information, see [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md). |

## Alert data retention

The following table lists how long alert data is stored in each Defender for IoT location. Alert data is stored as listed, regardless of the alert's status, or whether it's been learned or muted.

| Storage type | Details |
|---------|---------|
| **Azure portal** | 90 days from the date in the **First detection** value. <br><br> For more information, see [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md). |
| **OT network sensor** | 90 days from the date in the **First detection** value.<br><br> For more information, see [View alerts on your sensor](how-to-view-alerts.md). |
| **On-premises management console** |  90 days from the date in the **First detection** value.<br><br> For more information, see [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md). |

### OT alert PCAP data retention

The following table lists how long PCAP data is stored in each Defender for IoT location.

| Storage type | Details |
|---------|---------|
| **Azure portal** | PCAP files are available for download from the Azure portal for as long as the OT network sensor stores them. <br><br> Once downloaded, the files are cached on the Azure portal for 48 hours. <br><br> For more information, see [Access alert PCAP data](how-to-manage-cloud-alerts.md#access-alert-pcap-data). |
| **OT network sensor** | Dependent on [the sensor's storage capacity](#sensor-storage-capacity-by-hardware-profile). <br><br> If a sensor exceeds its maximum storage capacity, the oldest PCAP file is deleted to accommodate the new one. <br><br> For more information, see [Access alert PCAP data](how-to-view-alerts.md#access-alert-pcap-data). |
| **On-promises management console** | PCAP files aren't stored on the on-premises management console and are only accessed from the on-premises management console via a direct link to the OT sensor. |

The utilization of available PCAP storage space depends on factors such as the number of alerts, the type of the alert, and the network bandwidth, all of which affect the size of the PCAP file.

> [!TIP]
> Use external storage to back up PCAP data without being dependent on the sensor's storage capacity.

### Sensor storage capacity by hardware profile

| Hardware profile  | Allocated storage for alert PCAPS (filtered recordings)  |
|---------|---------|
| **C5600**     |   130 GB      |
| **E1800**     |   130 GB      |
| **E1000**     |   78 GB      |
| **E500**     |    78 GB     |
| **L500**     |    7 GB     |
| **L100**     |   2.5 GB      |
| **L60**     |    2.5 GB     |

## Security recommendation retention

Defender for IoT security recommendations are stored only on the Azure portal, for 90 days from when the recommendation is first detected.

For more information, see [Enhance security posture with security recommendations](recommendations.md).

## OT event timeline retention

OT event timeline data is stored on OT network sensors only, and the storage capacity differs depending on the sensor's [hardware profile](ot-appliance-sizing.md).

The retention of event timeline data isn't limited by time. If a sensor exceeds its maximum storage size, the oldest event timeline data file is deleted to accommodate the new one.

The following table lists the maximum number of events that can be stored for each hardware profile:

| Hardware profile | Number of events |
|---------|---------|
| **C5600** | 10M events |
| **E1800** | 10M events |
| **E1000** | 6M events |
| **E500** | 6M events |
| **L500** | 3M events |
| **L100** | 500-K events |
| **L60** | 500-K events |

For more information, see [Track sensor activity](how-to-track-sensor-activity.md).

## OT log file retention

Service and processing log files are stored on the Azure portal for 30 days from their creation date.

Other OT monitoring log files are stored only on the OT network sensor and the on-premises management console.

On both OT sensors and the on-premises management console, log files are stored in two different ways:

- Logs are saved on one file where the oldest content is overridden when the file reaches its maximum allocated size.

- Logs are saved on several files, and once the number of files reaches the maximum storage capacity, the oldest file is deleted to make room for a new one.

Log files sizes differ depending on the amount of content, but the average size per log file is 100-150 MB.

For more information, see:

- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
- [Download a diagnostics log for support](how-to-manage-individual-sensors.md#download-a-diagnostics-log-for-support)

## On-premises backup file capacity

Both the OT network sensor and the on-premises management console have automated backups running daily.

On both the OT sensor and the on-premises management console, older backup files are overridden when the configured storage capacity has reached its maximum.

For more information, see [Set up backup and restore files](how-to-manage-individual-sensors.md#set-up-backup-and-restore-files).

**Backups on the OT network sensor:**

The retention of backup files is dependent on the OT network sensor's architecture. Each type of device has a set amount of hard disk space allocated for backup history:

| Type of device  | Allocated hard disk space  |
|---------|---------|
| **Laptop**     |  zero       |
| **Rugged**     |  zero       |
| **Medium**     |  20 GB   |
| **Small prod** |   60 GB  |
| **Prod**       |   100 GB |
| **Core**       |   100 GB |

If the device has zero allocated hard disk space, then only the last backup will be saved.

**Backups on the on-premises management console:**

Allocated hard disk space for on-premises management console backup files is limited to 10 GB and to only 20 backups.

If you're using an on-premises management console, each connected OT sensor also has its own, extra backup directory on the on-premises management console:

- A single sensor backup file is limited to a maximum of 40 GB. If the size of the file exceeds that, it won't be sent to the on-premises management console.
- Total hard disk space allocated to sensor backup from all sensors on the on-premises management console is 100 GB.

For more information, see:

- [Configure backup settings for an OT network sensor](how-to-manage-individual-sensors.md#set-up-backup-and-restore-files)
- [Configure OT sensor backup settings from an on-premises management console](how-to-manage-sensors-from-the-on-premises-management-console.md#backup-storage-for-sensors)
- [Configure backup settings for an on-premises management console](how-to-manage-the-on-premises-management-console.md#define-backup-and-restore-settings)

## Next steps

For more information, see:

- [Manage individual OT network sensors](how-to-manage-individual-sensors.md)
- [Manage OT network sensors from an on-premises management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Manage an on-premises management console](how-to-manage-the-on-premises-management-console.md)
