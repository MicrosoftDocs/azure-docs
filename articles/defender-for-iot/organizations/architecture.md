---
title: System architecture for OT monitoring - Microsoft Defender for IoT
description: Learn about the Microsoft Defender for IoT system architecture and data flow.
ms.topic: overview
ms.date: 12/25/2022
---

# System architecture for OT system monitoring

The Microsoft Defender for IoT system is built to provide broad coverage and visibility from diverse data sources.

The following image shows how data can stream into Defender for IoT from network sensors and third-party sources to provide a unified view of IoT/OT security. Defender for IoT in the Azure portal provides asset inventories, vulnerability assessments, and continuous threat monitoring.

:::image type="content" source="media/architecture/system-architecture.png" alt-text="Diagram of the Defender for IoT OT system architecture." border="false":::

Defender for IoT connects to both cloud and on-premises components, and is built for scalability in large and geographically distributed environments.

Defender for IoT includes the following OT security monitoring components:

- **The Azure portal**, for cloud management and integration to other Microsoft services, such as Microsoft Sentinel.
- **OT network sensors**, to detect OT devices across your network. OT network sensors are deployed on either a virtual machine or a physical appliance, and configured as cloud-connected sensors, or fully on-premises, locally managed sensors.
- **An on-premises management console** for centralized OT site management in local, air-gapped environments.

## What is a Defender for IoT committed device?

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

## OT network sensors

OT network sensors discover and continuously monitor network traffic across your OT devices.

- Network sensors are purpose-built for OT networks and connect to a SPAN port or network TAP. OT network sensors can provide visibility into risks within minutes of connecting to the network.

- Network sensors use OT-aware analytics engines and Layer-6 Deep Packet Inspection (DPI) to detect threats, such as fileless malware, based on anomalous or unauthorized activity.

Data collection, processing, analysis, and alerting takes place directly on the sensor, which can be ideal for locations with low bandwidth or high-latency connectivity. Only the metadata is transferred on for management, either to the Azure portal or an on-premises management console.

For more information, see [Onboard OT sensors to Defender for IoT](onboard-sensors.md).

### Cloud-connected vs. local OT sensors

Cloud-connected sensors are sensors that are connected to Defender for IoT in Azure, and differ from locally managed sensors as follows:

When you have a cloud connected OT network sensor:

- All data that the sensor detects is displayed in the sensor console, but alert information is also delivered to Azure, where it can be analyzed and shared with other Azure services.

- Microsoft threat intelligence packages can be automatically pushed to cloud-connected sensors.

- The sensor name defined during onboarding is the name displayed in the sensor, and is read-only from the sensor console.

In contrast, when working with locally managed sensors:

- View any data for a specific sensor from the sensor console. For a unified view of all information detected by several sensors, use an on-premises management console.

- You must manually upload any threat intelligence packages to locally managed sensors.

- Sensor names can be updated in the sensor console.

For more information, see [Manage OT sensors from the sensor console](how-to-manage-individual-sensors.md) and [Manage OT sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md).

### Defender for IoT analytics engines

Defender for IoT network sensors analyze ingested data using built-in analytics engines, and trigger alerts based on both real-time and pre-recorded traffic.

Analytics engines provide machine learning and profile analytics, risk analysis, a device database and set of insights, threat intelligence, and behavioral analytics.

For example, the **policy violation detection** engine models industry control system (ICS) networks and alerts users of any deviation from baseline behavior. Deviations might include unauthorized use of specific function codes, access to specific objects, or changes to device configuration.

Since many detection algorithms were built for IT, rather than OT networks, the extra baseline for ICS networks helps to shorten the system's learning curve for new detections.

Defender for IoT network sensors include the following analytics engines:

|Name  |Description  |
|---------|---------|
|**Protocol violation detection engine**     |  Identifies the use of packet structures and field values that violate ICS protocol specifications. <br><br>For example, Modbus exceptions or the initiation of an obsolete function code alerts.       |
|**Industrial malware detection engine**     |  Identifies behaviors that indicate the presence of known malware, such as Conficker, Black Energy, Havex, WannaCry, NotPetya, and Triton.       |
|**Anomaly detection engine**     | Detects unusual machine-to-machine (M2M) communications and behaviors. <br><br>This engine models ICS networks and therefore requires a shorter learning period than analytics developed for IT. Anomalies are detected faster, with minimal false positives. <br><br>For example, Excessive SMB sign-in attempts, and PLC Scan Detected alerts.        |
|**Operational incident detection**     |   Detects operational issues such as intermittent connectivity that can indicate early signs of equipment failure. <br><br> For example, the device might be disconnected (unresponsive), or the Siemens S7 stop PLC command was sent alerts.      |


## Management options

Defender for IoT provides hybrid network support using the following management options:

- **The Azure portal**. Use the Azure portal as a single pane of glass to view all data ingested from your devices via cloud-connected network sensors. The Azure portal provides extra value, such as [workbooks](workbooks.md), [connections to Microsoft Sentinel](iot-solution.md), [security recommendations](recommendations.md), and more.

    Also use the Azure portal to obtain new appliances and software updates, onboard and maintain your sensors in Defender for IoT, and update threat intelligence packages. For example:

    :::image type="content" source="media/architecture/portal.png" alt-text="Screenshot of the Defender for I O T default view on the Azure portal."lightbox="media/architecture/portal.png":::

- **The OT sensor console**. View detections for devices connected to a specific OT sensor from the sensor's console. Use the sensor console to view a network map for devices detected by that sensor, a timeline of all events that occur on the sensor, forward sensor information to partner systems, and more. For example:

    :::image type="content" source="media/release-notes/new-interface.png" alt-text="Screenshot that shows the updated interface." lightbox="media/release-notes/new-interface.png":::

- **The on-premises management console**. In air-gapped environments, the on-premises management console provides a centralized view and management options for devices and threats detected by connected OT network sensors. The on-premises management console also lets you organize your network into separate sites and zones to support a [Zero Trust](/security/zero-trust/) mindset, and provides extra maintenance tools and reporting features.

## Next steps

> [!div class="nextstepaction"]
> [Understand OT sensor connection methods](architecture-connections.md)

> [!div class="nextstepaction"]
> [Connect OT sensors to Microsoft Defender for IoT](connect-sensors.md)

> [!div class="nextstepaction"]
> [Frequently asked questions](resources-frequently-asked-questions.md)
