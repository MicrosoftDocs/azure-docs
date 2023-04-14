---
title: System architecture for OT/IoT monitoring - Microsoft Defender for IoT
description: Learn about the Microsoft Defender for IoT system architecture and data flow.
ms.topic: conceptual
ms.date: 01/18/2023
---

# Microsoft Defender for IoT components

The Microsoft Defender for IoT system is built to provide broad coverage and visibility from diverse data sources.

The following image shows how data can stream into Defender for IoT from network sensors and third-party sources to provide a unified view of IoT/OT security. Defender for IoT in the Azure portal provides asset inventories, vulnerability assessments, and continuous threat monitoring.

:::image type="content" source="media/architecture/system-architecture.png" alt-text="Diagram of the Defender for IoT OT system architecture." border="false":::

Defender for IoT connects to both cloud and on-premises components, and is built for scalability in large and geographically distributed environments.

Defender for IoT includes the following OT security monitoring components:

- **The Azure portal**, for cloud management and integration to other Microsoft services, such as Microsoft Sentinel.

- **Operational technology (OT) or Enterprise IoT network sensors**, to detect devices across your network. Defender for IoT network sensors are deployed on either a virtual machine or a physical appliance. OT sensors can be configured as cloud-connected sensors, or fully on-premises, locally managed sensors.

- **An on-premises management console** for centralized OT sensor management and monitoring for local, air-gapped environments.

## OT and Enterprise IoT network sensors

Defender for IoT network sensors discover and continuously monitor network traffic across your network devices.

- Network sensors are purpose-built for OT/IoT networks and connect to a SPAN port or network TAP. Defender for IoT network sensors can provide visibility into risks within minutes of connecting to the network.

- Network sensors use OT/IoT-aware analytics engines and Layer-6 Deep Packet Inspection (DPI) to detect threats, such as fileless malware, based on anomalous or unauthorized activity.

Data collection, processing, analysis, and alerting takes place directly on the sensor, which can be ideal for locations with low bandwidth or high-latency connectivity. Only telemetry and insights are transferred on for management, either to the Azure portal or an on-premises management console.

For more information, see [Defender for IoT OT deployment path](ot-deploy/ot-deploy-path.md).

### Cloud-connected vs. local OT sensors

Cloud-connected sensors are sensors that are connected to Defender for IoT in Azure, and differ from locally managed sensors as follows:

**When you have a cloud connected OT network sensor**:

- All data that the sensor detects is displayed in the sensor console, but alert information is also delivered to Azure, where it can be analyzed and shared with other Azure services.

- Microsoft threat intelligence packages can be automatically pushed to cloud-connected sensors.

- The sensor name defined during onboarding is the name displayed in the sensor, and is read-only from the sensor console.

**In contrast, when working with locally managed sensors**:

- View any data for a specific sensor from the sensor console. For a unified view of all information detected by several sensors, use an on-premises management console.

- You must manually upload any threat intelligence packages to locally managed sensors.

- Sensor names can be updated in the sensor console.

For more information, see [Manage OT sensors from the sensor console](how-to-manage-individual-sensors.md) and [Manage OT sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md).

### Defender for IoT analytics engines

Defender for IoT network sensors analyze ingested data using built-in analytics engines, and trigger alerts based on both real-time and pre-recorded traffic.

Analytics engines provide machine learning and profile analytics, risk analysis, a device database and set of insights, threat intelligence, and behavioral analytics.

For example, the **policy violation detection** engine models industry control system (ICS) networks and alerts users of any deviation from baseline behavior. Deviations might include unauthorized use of specific function codes, access to specific objects, or changes to device configuration.

Since many detection algorithms were built for IT, rather than OT networks, the extra baseline for ICS networks helps to shorten the system's learning curve for new detections.

Defender for IoT network sensors include the following main analytics engines:

|Name  |Description  | Examples |
|---------|---------|---------|
|**Protocol violation detection engine**     |  Identifies the use of packet structures and field values that violate ICS protocol specifications. <br><br>Protocol violations occur when the packet structure or field values don't comply with the protocol specification.| An *"Illegal MODBUS Operation (Function Code Zero)"* alert indicates that a primary device sent a request with function code 0 to a secondary device. This action isn't allowed according to the protocol specification, and the secondary device might not handle the input correctly     |
| **Policy Violation** | A policy violation occurs with a deviation from baseline behavior defined in learned or configured settings. | An *"Unauthorized HTTP User Agent"* alert indicates that an application that wasn't learned or approved by policy is used as an HTTP client on a device. This might be a new web browser or application on that device.|
|**Industrial malware detection engine**     |  Identifies behaviors that indicate the presence of malicious network activity via known malware, such as Conficker, Black Energy, Havex, WannaCry, NotPetya, and Triton. | A *"Suspicion of Malicious Activity (Stuxnet)"* alert indicates that the sensor detected suspicious network activity known to be related to the Stuxnet malware. This malware is an advanced persistent threat aimed at industrial control and SCADA networks.     |
|**Anomaly detection engine**     | Detects unusual machine-to-machine (M2M) communications and behaviors. <br><br>This engine models ICS networks and therefore requires a shorter learning period than analytics developed for IT. Anomalies are detected faster, with minimal false positives. | A *"Periodic Behavior in Communication Channel"* alert reflects periodic and cyclic behavior of data transmission, which is common in industrial networks.   <br>Other examples include excessive SMB sign-in attempts, and PLC scan detected alerts.    |
|**Operational incident detection**     |   Detects operational issues such as intermittent connectivity that can indicate early signs of equipment failure.  | A *"Device is Suspected to be Disconnected (Unresponsive)"* alert is triggered when a device isn't responding to any kind of request for a predefined period. This alert might indicate a device shutdown, disconnection, or malfunction.  <br>Another example might be if the Siemens S7 stop PLC command was sent alerts.   |

## Management options

Defender for IoT provides hybrid network support using the following management options:

- **The Azure portal**. Use the Azure portal as a single pane of glass to view all data ingested from your devices via cloud-connected network sensors. The Azure portal provides extra value, such as [workbooks](workbooks.md), [connections to Microsoft Sentinel](iot-solution.md), [security recommendations](recommendations.md), and more.

    Also use the Azure portal to obtain new appliances and software updates, onboard and maintain your sensors in Defender for IoT, and update threat intelligence packages. For example:

    :::image type="content" source="media/architecture/portal.png" alt-text="Screenshot of the Defender for I O T default view on the Azure portal."lightbox="media/architecture/portal.png":::

- **The OT sensor console**. View detections for devices connected to a specific OT sensor from the sensor's console. Use the sensor console to view a network map for devices detected by that sensor, a timeline of all events that occur on the sensor, forward sensor information to partner systems, and more. For example:

    :::image type="content" source="media/release-notes/new-interface.png" alt-text="Screenshot that shows the updated interface." lightbox="media/release-notes/new-interface.png":::

- **The on-premises management console**. In air-gapped environments, you can get a central view of data from all of your sensors from an on-premises management console, using extra maintenance tools and reporting features.

    The software version on your on-premises management console must be equal to that of your most up-to-date sensor version. Each on-premises management console version is backwards compatible to older, supported sensor versions, but cannot connect to newer sensor versions.

    For more information, see [Air-gapped OT sensor management deployment path](ot-deploy/air-gapped-deploy.md).

## What is a Defender for IoT committed device?

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

## Next steps

> [!div class="step-by-step"]
> [Understand your network architecture »](architecture.md)
