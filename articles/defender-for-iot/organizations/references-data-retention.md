---
title: Data retention and sharing across Microsoft Defender for IoT
description: Learn about the data retention periods and capacities for Microsoft Defender for IoT data stored in Microsoft Azure, the OT sensor, and on-premises management console.
ms.topic: conceptual
ms.date: 06/30/2024
---

# Data retention, privacy, and sharing across Microsoft Defender for IoT

Microsoft Defender for IoT stores data in the Microsoft Azure portal, in OT network sensors, and in on-premises management consoles.

Each storage type has varying storage capacity options and retention times. This article describes the data retention policy for the amount of data and length of time the data is stored in each storage type before being deleted or overwritten.

## What are we collecting? 

Defender for IoT collects information from your configured devices and stores it in a service specific, customer-dedicated and segregated tenant. The stored data is for administration, tracking, and reporting purposes.

Information collected includes network connection data (IPs and ports), and device details (device identifiers, names, operating system versions, firmware versions). Defender for IoT stores this data securely in accordance with Microsoft privacy practices and [Microsoft Trust Center policies](https://azure.microsoft.com/explore/trusted-cloud/).

This data enables Defender for IoT to: 

- Proactively identify indicators of attack (IOAs) in your organization.
- Generate alerts if a possible attack is detected.
- Provide your security team a view into devices and addresses related to threat signals from your network, enabling you to investigate and explore possible network security threats.

Microsoft doesn't use your data for advertising. 

## Data location 

Defender for IoT uses the Microsoft Azure data centers in the European Union and the United States. Customer data collected by the service might be stored in one of two geo-locations:

- The geolocation of the tenant as identified during provisioning. 
- The geolocation as defined by the data storage rules of an online service, that's used by Defender for IoT to process its data. 

## Data retention 

Data from Defender for IoT is retained for as long as a customer is active or for 90 days after the end of your contract. During this period the data is visible across your other services on the portal.

Your data is kept and is available while your license is under a grace period or in suspended mode. 90 days after the end of this period, your data is erased from Microsoft's systems making it unrecoverable.

## Device data retention periods

The following table lists how long device data is stored in each Defender for IoT storage type.

| Storage type | Details |
|---------|---------|
| **Azure portal** | 90 days from the date of the **Last activity** value. <br><br> For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md). |
| **OT network sensor** | 90 days from the date of the **Last activity** value. <br><br> For more information, see [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md). |
| **On-premises management console** | 90 days from the date of the **Last activity** value. <br><br> For more information, see [Manage your OT device inventory from an on-premises management console](legacy-central-management/how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md). |

## Alert data retention

The following table lists how long alert data is stored in each Defender for IoT storage type. Alert data is stored as listed, regardless of the alert's status, or whether it's been learned or muted.

| Storage type | Details |
|---------|---------|
| **Azure portal** | 90 days from the date in the **First detection** value. <br><br> For more information, see [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md). |
| **OT network sensor** | 90 days from the date in the **First detection** value.<br><br> For more information, see [View alerts on your sensor](how-to-view-alerts.md). |
| **On-premises management console** |  90 days from the date in the **First detection** value.<br><br> For more information, see [Work with alerts on the on-premises management console](legacy-central-management/how-to-work-with-alerts-on-premises-management-console.md). |

### OT alert PCAP data retention

The following table lists how long PCAP data is stored in each Defender for IoT storage type.

| Storage type | Details |
|---------|---------|
| **Azure portal** | PCAP files are available for download from the Azure portal for as long as the OT network sensor stores them. <br><br> Once downloaded, the files are cached on the Azure portal for 48 hours. <br><br> For more information, see [Access alert PCAP data](how-to-manage-cloud-alerts.md#access-alert-pcap-data). |
| **OT network sensor** | Dependent on the sensor's storage capacity allocated for PCAP files, which determines its [hardware profile](ot-appliance-sizing.md): <br><br>- **C5600**:   130 GB  <br>- **E1800**:   130 GB  <br>-  **E1000** :   78 GB<br>- **E500**:    78 GB <br>- **L500**: 7 GB   <br>- **L100**:    2.5 GB<br><br> If a sensor exceeds its maximum storage capacity, the oldest PCAP file is deleted to accommodate the new one. <br><br> For more information, see [Access alert PCAP data](how-to-view-alerts.md#access-alert-pcap-data) and [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md). |
| **On-premises management console** | PCAP files aren't stored on the on-premises management console and are only accessed from the on-premises management console via a direct link to the OT sensor. |

The usage of available PCAP storage space depends on factors such as the number of alerts, the type of the alert, and the network bandwidth, all of which affect the size of the PCAP file.

> [!TIP]
> To avoid being dependent on the sensor's storage capacity, use external storage to back up your PCAP data.

## Security recommendation retention

Defender for IoT security recommendations are stored only on the Azure portal, for 90 days from when the recommendation is first detected.

For more information, see [Enhance security posture with security recommendations](recommendations.md).

## OT event timeline retention

OT event timeline data is stored on OT network sensors only, and the storage capacity differs depending on the sensor's [hardware profile](ot-appliance-sizing.md).

The retention of event timeline data isn't limited by time. However, assuming a frequency of 500 events per day, all hardware profiles are able to retain the events for at least **90 day**s.

If a sensor exceeds its maximum storage size, the oldest event timeline data file is deleted to accommodate the new one.

The following table lists the maximum number of events that can be stored for each hardware profile:

| Hardware profile | Number of events |
|---------|---------|
| **C5600** | 10M events |
| **E1800** | 10M events |
| **E1000** | 6M events |
| **E500** | 6M events |
| **L500** | 3M events |
| **L100** | 500-K events |

For more information, see [Track sensor activity](how-to-track-sensor-activity.md) and [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md).

## OT log file retention

Service and processing log files are stored on the Azure portal for 30 days from their creation date.

Other OT monitoring log files are stored only on the OT network sensor and the on-premises management console.

For more information, see:

- [Troubleshoot the sensor](how-to-troubleshoot-sensor.md)
- [Troubleshoot the on-premises management console](legacy-central-management/how-to-troubleshoot-on-premises-management-console.md)

## Backup file capacity

Both the OT network sensor and the on-premises management console have automated backups running daily, and older backup files are overwritten when the configured storage capacity reaches its limit.

For more information, see:

- [Set up backup and restore files on an OT sensor](back-up-restore-sensor.md#set-up-backup-and-restore-files)
- [Configure OT sensor backup settings on an on premises management console](legacy-central-management/back-up-sensors-from-management.md#configure-ot-sensor-backup-settings)

### Backups on the OT network sensor

The retention of backup files depends on the sensor's architecture, as each hardware profile has a set amount of hard disk space allocated for backup history:

| Hardware profile  | Allocated hard disk space  |
|---------|---------|
| **L100**  |  Backups aren't supported |
| **L500**  |   20 GB  |
| **E1000** |   60 GB  |
| **E1800** |   100 GB |
| **C5600** |   100 GB |

If the device can't allocate enough hard disk space, then only the last backup is saved on the on-premises management console.

### Backups on the on-premises management console

Allocated hard disk space for on-premises management console backup files is limited to 10 GB and to only 20 backups.

If you're using an on-premises management console, each connected OT sensor also has its own, extra backup directory on the on-premises management console:

- A single sensor backup file is limited to a maximum of 40 GB. A file exceeding that size isn't sent to the on-premises management console.
- Total hard disk space allocated to sensor backup from all sensors on the on-premises management console is 100 GB.

## Data sharing for Microsoft Defender for IoT 

Microsoft Defender for IoT shares data, including customer data, among the following Microsoft products, also licensed by the customer. 

- Microsoft Defender XDR 
- Microsoft Sentinel 
- Microsoft Threat Intelligence Center 
- Microsoft Defender for Cloud 
- Microsoft Defender for Endpoint 
- Microsoft Security Exposure Management

## Next steps

For more information, see:

- [Manage individual OT network sensors](how-to-manage-individual-sensors.md)
- [Manage OT network sensors from an on-premises management console](legacy-central-management/how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Manage an on-premises management console](legacy-central-management/how-to-manage-the-on-premises-management-console.md)
- [Azure data encryption](/azure/security/fundamentals/encryption-overview)
