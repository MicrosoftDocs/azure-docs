---
title: Agentless solution architecture
description: Learn about Azure Defender for IoT agentless architecture and information flow.
ms.topic: overview
ms.date: 1/25/2021
ms.author: shhazam
---

# Azure Defender for IoT architecture

This article describes the functional system architecture of the Defender for IoT agentless solution. Azure Defender for IoT offers two sets of capabilities to fit your environment's needs, agentless solution for organizations, and agent-based solution for device builders.

## Agentless solution for organizations
### Defender for IoT components

Defender for IoT connects both to the Azure cloud and to on-premises components. The solution is designed for scalability in large and geographically distributed environments with multiple remote locations. This solution enables a multi-layered distributed architecture by country, region, business unit, or zone. 

Azure Defender for IoT includes the following components: 

**Cloud connected deployments**

- Azure Defender for IoT sensor VM or appliance
- Azure portal for cloud management and integration to Azure Sentinel
- On-premises management console for local-site management
- An embedded security agent (optional)

**Air-gapped (Offline) deployments**

- Azure Defender for IoT sensor VM or appliance
- On-premises management console for local site management

:::image type="content" source="./media/architecture/defender-iot-security-architecture-v3.png" alt-text="The architecture for Defender for IoT.":::

### Azure Defender for IoT sensors

The Defender for IoT sensors discover, and continuously monitor network devices. Sensors collect ICS network traffic using passive (agentless) monitoring on IoT and OT devices. 
 
Purpose-built for IoT and OT networks, the agentless technology delivers deep visibility into IoT and OT risk within minutes of being connected to the network. It has zero performance impact on the network and network devices due to its non-invasive, Network Traffic Analysis (NTA) approach. 
 
Applying patented, IoT and OT-aware behavioral analytics and Layer-7 Deep Packet Inspection (DPI), it allows you to analyze beyond traditional signature-based solutions to immediately detect advanced IoT and OT threats (such as fileless malware) based on anomalous or unauthorized activity. 
  
Defender for IoT sensors connects to a SPAN port or network TAP and immediately begins performing DPI on IoT and OT network traffic. 
 
Data collection, processing, analysis, and alerting takes place directly on the sensor. This process makes it ideally suited for locations with low bandwidth or high latency connectivity, because only metadata is transferred to the management console.

The sensor includes five analytics detection engines. The engines trigger alerts based on analysis of both real-time and pre-recorded traffic. The following engines are available: 

#### Protocol violation detection engine
The protocol violation detection engine identifies the use of packet structures and field values that violate ICS protocol specifications, for example: Modbus exception, and Initiation of an obsolete function code alerts.

#### Policy violation detection engine
Using machine learning, the policy violation detection engine alerts users of any deviation from baseline behavior, such as unauthorized use of specific function codes, access to specific objects, or changes to device configuration. For example: DeltaV software version changed, and Unauthorized PLC programming alerts. Specifically, the policy violation engine models the ICS networks as deterministic sequences of states and transitions—using a patented technique called Industrial Finite State Modeling (IFSM). The policy violation detection engine establishes a baseline of the ICS networks, so that the platform requires a shorter learning period to build a baseline of the network than generic mathematical approaches or analytics, which were originally developed for IT rather than OT networks.

#### Industrial malware detection engine
The industrial malware detection engine identifies behaviors that indicate the presence of known malware, such as Conficker, Black Energy, Havex, WannaCry, NotPetya, and Triton. 

#### Anomaly detection engine
The anomaly detection engine detects unusual machine-to-machine (M2M) communications and behaviors. By modeling ICS networks as deterministic sequences of states and transitions, the platform requires a shorter learning period than generic mathematical approaches or analytics originally developed for IT rather than OT. It also detects anomalies faster, with minimal false positives. Anomaly detection engine alerts include Excessive SMB sign in attempts, and PLC Scan Detected alerts.

#### Operational incident detection
The operational incident detection detects operational issues such as intermittent connectivity that can indicate early signs of equipment failure. For example, the device is thought to be disconnected (unresponsive), and Siemens S7 stop PLC command was sent alerts.

### Management consoles
Managing Azure Defender for IoT across hybrid environments is accomplished via two management portals: 
- Sensor console
- The on-premises management console
- The Azure portal

### Sensor console
Sensor detections are displayed in the sensor console, where they can be viewed, investigated, and analyzed in a network map, device inventory, and in an extensive range of reports, for example risk assessment reports, data mining queries and attack vectors. You can also use the console to view and handle threats detected by sensor engines, forward information to partner systems, manage users, and more.

:::image type="content" source="./media/architecture/sensor-console-v2.png" alt-text="Defender for IoT sensor console":::

### On-premises management console
The on-premises management console enables security operations center (SOC) operators to manage and analyze alerts aggregated from multiple sensors into one single dashboard and provides an overall view of the health of the OT networks.

This architecture provides a comprehensive unified view of the network at a SOC level, optimized alert handling, and the control of operational network security, ensuring that decision-making and risk management remain flawless.

In addition to multi-tenancy, monitoring, data analysis, and centralized sensor remote control, the management console provides extra system maintenance tools (such as alert exclusion) and fully customized reporting features for each of the remote appliances. This architecture supports both local management at a site level, zone level, and global management within the SOC.

The management console can be deployed for high-availability configuration, which provides a backup console that periodically receives backups of all configuration files required for recovery. If the primary console fails, the local site management appliances will automatically fail over to synchronize with the backup console to maintain availability without interruption.

Tightly integrated with your SOC workflows and run books, it enables easy prioritization of mitigation activities and cross-site correlation of threats.

- Holistic - reduce complexity with a single unified platform for device management, risk and vulnerability management, and threat monitoring with incident response.

- Aggregation and correlation – display, aggregate, and analyze data and alerts collected from all sites.

- Control all sensors – configure and monitor all sensors from a single location.

   :::image type="content" source="media/updates/alerts-and-site-management-v2.png" alt-text="Manage all of your alerts and information.":::

### Azure portal

The Defender for IoT portal in Azure is used to help you:

- Purchase solution appliances

- Install and update software

- Onboard sensors to Azure

- Update Threat Intelligence packages

## See also

[Defender for IoT FAQ](resources-frequently-asked-questions.md)

[System prerequisites](quickstart-system-prerequisites.md)
