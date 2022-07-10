---
title: System architecture for OT monitoring - Microsoft Defender for IoT
description: Learn about the Microsoft Defender for IoT system architecture and data flow.
ms.topic: overview
ms.date: 03/24/2022
---

# System architecture for OT system monitoring

The Microsoft Defender for IoT system is built to provide broad coverage and visibility from diverse data sources.

The following image shows how data can stream into Defender for IoT from network sensors, Microsoft Defender for Endpoint, and partner sources to provide a unified view of IoT/OT security. Defender for IoT in the Azure portal provides asset inventories, vulnerability assessments, and continuous threat monitoring.

:::image type="content" source="media/architecture/system-architecture.png" alt-text="Diagram of the Defender for IoT system architecture." border="false":::

Defender for IoT connects to both cloud and on-premises components, and is built for scalability in large and geographically distributed environments.

Defender for IoT systems include the following components:

- The Azure portal, for cloud management and integration to other Microsoft services, such as Microsoft Sentinel.
- Network sensors, deployed on either a virtual machine or a physical appliance. You can configure your OT sensors as cloud-connected sensors, or fully on-premises sensors.
- An on-premises management console for cloud-connected or local, air-gapped site management.
- An embedded security agent (optional).

## Network sensors

Defender for IoT network sensors discover and continuously monitor network traffic on IoT and OT devices.

- The sensors are purpose-built for IoT and OT networks. They connect to a SPAN port or network TAP and can provide visibility into IoT and OT risks within minutes of connecting to the network.

- The sensors use IoT and OT-aware analytics engines and Layer-6 Deep Packet Inspection (DPI) to detect IoT and OT threats, such as fileless malware, based on anomalous or unauthorized activity.

Data collection, processing, analysis, and alerting takes place directly on the sensor. Running processes directly on the sensor can be ideal for locations with low bandwidth or high-latency connectivity because only the metadata is transferred on for management, either to the Azure portal or an on-premises management console.

### Cloud-connected vs. local sensors

Cloud-connected sensors are sensors that are connected to Defender for IoT in Azure, and differ from locally managed sensors as follows:

When you have a cloud connected sensor:

- All data that the sensor detects is displayed in the sensor console, but alert information is also delivered to Azure, where it can be analyzed and shared with other Azure services.

- Microsoft threat intelligence packages can also be automatically pushed to cloud-connected sensors.

- The sensor name defined during onboarding is the name displayed in the sensor, and is read-only from the sensor console.

In contrast, when working with locally managed sensors:

- View any data for a specific sensor from the sensor console. For a unified view of all information detected by several sensors, use an on-premises management console. For more information, see [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md).

- You must manually upload any threat intelligence packages.

- Sensor names can be updated in the sensor console.

### What is a Defender for IoT committed device?

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

## Analytics engines

Defender for IoT sensors apply analytics engines on ingested data, triggering alerts based on both real-time and pre-recorded traffic.

Analytics engines provide machine learning and profile analytics, risk analysis, a device database and set of insights, threat intelligence, and behavioral analytics.

For example, for OT networks, the **policy violation detection** engine alerts users of any deviation from baseline behavior, such as unauthorized use of specific function codes, access to specific objects, or changes to device configuration. The policy violation engine models industry control system (ICS) networks as deterministic sequences of states and transitions - using a patented technique called Industrial Finite State Modeling (IFSM). The policy violation detection engine creates a baseline for industrial control system (ICS) networks. Since many detection algorithms were built for IT, rather than OT, networks, an extra baseline for ICS networks helps to shorten the systems learning curve for new detections.

Specifically for OT networks, OT network sensors also provide the following analytics engines:

- **Protocol violation detection engine**: Identifies the use of packet structures and field values that violate ICS protocol specifications, for example: Modbus exception, and initiation of an obsolete function code alerts.

- **Industrial malware detection engine**: Identifies behaviors that indicate the presence of known malware, such as Conficker, Black Energy, Havex, WannaCry, NotPetya, and Triton.

- **Anomaly detection engine**: Detects unusual machine-to-machine (M2M) communications and behaviors. By modeling ICS networks as deterministic sequences of states and transitions, the platform requires a shorter learning period than generic mathematical approaches or analytics originally developed for IT rather than OT. It also detects anomalies faster, with minimal false positives. Anomaly detection engine alerts include Excessive SMB sign-in attempts, and PLC Scan Detected alerts.

- **Operational incident detection**: Detects operational issues such as intermittent connectivity that can indicate early signs of equipment failure. For example, the device might be disconnected (unresponsive), and Siemens S7 stop PLC command was sent alerts.

## Management options

Defender for IoT provides hybrid network support using the following management options:

- **The Azure portal**. Use the Azure portal as a single pane of glass to view all data ingested from your devices via network sensors. The Azure portal provides extra value, such as [workbooks](workbooks.md), [connections to Microsoft Sentinel](../../sentinel/iot-solution.md?bc=%2fazure%2fdefender-for-iot%2fbreadcrumb%2ftoc.json&tabs=use-out-of-the-box-analytics-rules-recommended&toc=%2fazure%2fdefender-for-iot%2forganizations%2ftoc.json), and more.

    Also use the Azure portal to obtain new appliances and software updates, onboard and maintain your sensors in Defender for IoT, and update threat intelligence packages.

    :::image type="content" source="media/architecture/portal.png" alt-text="Screenshot of the Defender for I O T default view on the Azure portal."lightbox="media/architecture/portal.png":::

- **The sensor console**. You can also view detections for devices connected to a specific sensor from the sensor's console. Use the sensor console to view a network map, an extensive range of reports, forward information to partner systems, and more.

    :::image type="content" source="media/release-notes/new-interface.png" alt-text="Screenshot that shows the updated interface." lightbox="media/release-notes/new-interface.png":::

- **The on-premises management console**. In air-gapped environments, you can get a central view of data from all of your sensors from an on-premises management console. The on-premises management console also provides extra maintenance tools and reporting features.

## Next steps

For OT environments, understand the supported methods for connecting network sensors to Defender for IoT.

For more information, see:

- [Frequently asked questions](resources-frequently-asked-questions.md)
- [Sensor connection methods](architecture-connections.md)
- [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md)
