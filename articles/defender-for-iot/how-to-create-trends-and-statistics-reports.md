---
title: Generate trends and statistics reports
description: Gain insight into network activity, statistics and trends by using Defender for IoT Trends and Statistics widgets.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 01/24/2021
ms.topic: how-to
ms.service: azure
---

# Sensor trends and statistics reports

## About sensor trends and statistics reports

You can create widget graphs and pie charts to gain insight into network trends and statistics. Widgets can be grouped under user-defined dashboards.

> [!NOTE]
> Administrator and security analysts can create Trends and Statistics reports.

The dashboard consists of widgets that graphically describe the following types of information:

- Traffic by port
- Top traffic by port
- Channel bandwidth
- Total bandwidth
- Active TCP connection
- Top Bandwidth by VLAN
- Devices:
  - New devices
  - Busy devices
  - Devices by vendor
  - Devices by OS
  - Number of devices per VLAN
  - Disconnected devices
- Connectivity drops by hours
- Alerts for incidents by type
- Database table access
- Protocol dissection widgets
- DELTAV
  - DeltaV roc operations distribution
  - DeltaV roc events by name
  - DeltaV events by time
- AMS
  - AMS traffic by server port
  - AMS traffic by command
- Ethernet and IP address:
  - Ethernet and IP address traffic by CIP service
  - Ethernet and IP address traffic by CIP class
  - Ethernet and IP address traffic by command
- OPC:
  - OPC top management operations
  - OPC top I/O operations
- Siemens S7:
  - S7 traffic by control function
  - S7 traffic by subfunction
- VLAN
  - Number of devices per VLAN
  - Top bandwidth by VLAN
- 60870-5-104
  - IEC-60870 Traffic by ASDU
- BACNET
  - BACnet Services
- DNP3
  -	DNP3 traffic by function
- SRTP:
  - SRTP traffic by service code
  - SRTP errors by day
- SuiteLink:
  - SuiteLink top queried tags
  - SuiteLink numeric tag behavior
- IEC-60870 traffic by ASDU
- DNP3 traffic by function
- MMS traffic by service
- Modbus traffic by function
- OPC-UA traffic by service

> [!NOTE]
>  The time in the widgets is set according to the sensor time.

## Create reports

To see dashboards and widgets:

Select **Trends & Statistics** on the side menu.

:::image type="content" source="media/how-to-generate-reports/investigation-screenshot.png" alt-text="Screenshot of an investigation.":::

By default, results are displayed for detections over the last 7 days. You can use filter tools change this range. For example a free text search.

## See also

[Risk assessment reporting](how-to-create-risk-assessment-reports.md)
[Sensor data mining queries](how-to-create-data-mining-queries.md)
[Attack vector reporting](how-to-create-attack-vector-reports.md)