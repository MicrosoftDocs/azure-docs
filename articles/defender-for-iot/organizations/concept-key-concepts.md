---
title: Key advantages
description: Learn about basic Defender for IoT concepts.
ms.date: 11/09/2021
ms.topic: article
---

# Basic concepts

This article describes key advantages of Microsoft Defender for IoT.

## Rapid non-invasive deployment and passive monitoring

Defender for IoT sensors connects to switch SPAN (Mirror) ports, and network TAPs and immediately begin collecting ICS network traffic via passive (agentless) monitoring. Deep packet inspection (DPI) is used to dissect traffic from both serial and Ethernet control network equipment. Defender for IoT has zero impact on OT networks because it isn't placed in the data path and doesn't actively scan OT devices. 

To deliver instant snapshots of detailed Windows device information, Defender for IoT sensor can be configured to supplement passive monitoring with an optional active component. This component uses safe, vendor-approved commands to query Windows devices for device details, as often or as infrequently as you want.

## Embedded knowledge of ICS protocols, devices, and applications

DPI alone is not enough to identify protocol anomalies and identify device at a granular level. The Defender for IoT sensor addresses some of the largest and most complex environments. More than 1,300 OT networks have been analyzed to date, across all industrial sectors.

## Analytics and self-learning engines

Engines identify security issues via continuous monitoring and five analytics engines that incorporate self-learning to eliminate the need for updating signatures or defining rules. The engines use ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies. The five engines are:

- **Protocol violation detection**: Identifies the use of packet structures and field values that violate ICS protocol specifications.

- **Policy violation detection**: Identifies policy violations such as unauthorized use of function codes, access to specific objects, or changes to device configuration.

- **Industrial malware detection**: Identifies behaviors that indicate the presence of known malware such as Conficker, Black Energy, Havex, WannaCry, and NotPetya.

- **Anomaly detection**: Detects unusual machine-to-machine (M2M) communications and behaviors. By modeling ICS networks as deterministic sequences of states and transitions, the engine uses a patented technique called Industrial Finite State Modeling (IFSM). The solution requires a shorter learning period than generic mathematical approaches or analytics, which were originally developed for IT rather than OT. It also detects anomalies faster, with minimal false positives.

- **Operational incident detection**: Identifies operational issues such as intermittent connectivity that can indicate early signs of equipment failure.

## Network Traffic Analysis for risk and vulnerability assessment

Unique in the industry, Defender for IoT uses proprietary Network Traffic Analysis (NTA) algorithms to passively identify all network and endpoint vulnerabilities, such as:

- Unauthorized remote access connections
- Rogue or undocumented devices
- Weak authentication
- Vulnerable devices (based on unpatched CVEs)
- Unauthorized bridges between subnets
- Weak firewall rules

## Data mining for investigations, forensics, and threat hunting

The platform provides an intuitive data-mining interface for granular searching of historical traffic across all relevant dimensions. Examples include time period, IP address, MAC address, and ports. You can also make protocol-specific queries based on function codes, protocol services, and modules. Full-fidelity PCAPs are available for further drill-down analysis.

## Sensor Cloud Management mode

The Sensor Cloud Management mode determines where device, alert, and other information that the sensor detects is displayed.

For **cloud-connected sensors**, information that the sensor detects is displayed in the sensor console. Alert information is delivered through an IoT hub and can be shared with other Azure services, such as Microsoft Sentinel.

For **locally connected sensors**, information that the sensor detects is displayed in the sensor console. Detection information is also shared with the on-premises management console if the sensor is connected to it.

## Air-gapped networks

If you're working in an air-gapped environment, the on-premises management console in Defender for IoT delivers a real-time view of key IoT and OT risk indicators and alerts across all of your facilities. Tightly integrated with your SOC workflows and runbooks, it enables easy prioritization of mitigation activities and cross-site correlation of threats.

Defender for IoT provides a consolidated view of all your devices. It also provides critical information about the devices, such as type (PLC, RTU, DCS, and more), manufacturer, model, and firmware revision level, as well as alert information.

Defender for IoT enables the effective management of multiple deployments and a comprehensive unified view of the network. Defender for IoT optimizes alert handling and control of operational network security.

The on-premises management console is a web-based administrative platform that lets you monitor and control the activities of global sensor installations. In addition to managing the data received from deployed sensors, the on-premises management console seamlessly integrates data from various business resources: CMDBs, DNS, firewalls, Web APIs, and more.

:::image type="content" source="media/concept-air-gapped-networks/site-management-alert-screen.png" alt-text="On-premises management console display.":::

We recommend that you familiarize yourself with the concepts, capabilities, and features available to sensors before working with the on-premises management console.

## Integrations

You can expand the capabilities of Defender for IoT by sharing both device and alert information with partner systems. Integrations help enterprises bridge previously siloed security solutions to significantly enhance device visibility and threat intelligence. Integrations also help enterprises accelerate the system-wide responses and mitigate risks faster. 

Integrations reduce complexity and eliminate IT and OT silos by integrating them into your existing SOC workflows and security stack. For example:

- SIEMs such as IBM QRadar, Splunk, ArcSight, LogRhythm, and RSA NetWitness

- Security orchestration and ticketing systems such as ServiceNow and IBM Resilient

- Secure remote access solutions such as CyberArk Privileged Session Manager (PSM) and BeyondTrust

- Secure network access control (NAC) systems such as Aruba ClearPass and Forescout CounterACT

- Firewalls such as Fortinet and Check Point

## Complete protocol support

In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. By using the Horizon Open Development Environment (ODE) SDK, developers can create dissector plug-ins that decode network traffic based on defined protocols. Services analyzes traffic to provide complete monitoring, alerting, and reporting. Use Horizon to:

- Expand visibility and control without the need to upgrade to new versions.

- Secure proprietary information by developing on-site as an external plug-in.

- Localize text for alerts, events, and protocol parameters.

In addition, you can use proprietary protocol alerts to communicate information:

- About traffic detections based on protocols and underlying protocols in a proprietary Horizon plug-in.

- About a combination of protocol fields from all protocol layers. For example, in an environment running MODBUS, you might want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and Ethernet destination. Or you might want to generate an alert when any access is performed to a specific IP address.

Alerts are triggered when Horizon alert rule conditions are met.

In addition, working with Horizon custom alerts lets you write your own alert titles and messages. Resolved protocol fields and values can be embedded in the alert message text.

Using custom, condition-based alert triggering and messaging helps pinpoint specific network activity and effectively update your security, IT, and operational teams.

For a complete list of supported protocols see, [Supported Protocols](concept-supported-protocols.md#supported-protocols).


### Secure development environment 

The Horizon ODE enables development of custom or proprietary protocols that cannot be shared outside an organization. For example, because of legal regulations or corporate policies.

Develop dissector plugins without: 

- revealing any proprietary information about how your protocols are defined.

- sharing any of your sensitive PCAPs.

- violating compliance regulations.

Contact <ms-horizon-support@microsoft.com> for information about developing protocol plugins.

### Customization and localization  

The SDK supports various customization options, including:

  - Text for function codes. 

  - Full localization text for alerts, events, and protocol parameters.

  :::image type="content" source="media/references-horizon-sdk/localization.png" alt-text="View fully localized alerts.":::

## Horizon architecture

The architectural model includes three product layers.

:::image type="content" source="media/references-horizon-sdk/architecture.png" alt-text="https://lh6.googleusercontent.com/YFePqJv_6jbI_oy3lCQv-hHB1Qly9a3QQ05uMnI8UdTwhOuxpNAedj_55wseYEQQG2lue8egZS-mlnQZPWfFU1dF4wzGQSJIlUqeXEHg9CG4M7ASCZroKgbghv-OaNoxr3AIZtIh":::

### Defender for IoT platform layer

Enables immediate integration and real-time monitoring of custom dissector plugins in the Defender for IoT platform, without the need to upgrade the Defender for IoT platform version.

### Defender for IoT services layer

Each service is designed as a pipeline, decoupled from a specific protocol, enabling more efficient, independent development.

Each service is designed as a pipeline, decoupled from a specific protocol. Services listens for traffic on the pipeline. They interact with the plugin data and the traffic captured by the sensors to index deployed protocols and analyze the traffic payload, and enable a more efficient and independent development.

### Custom dissector layer 

Enables creation of plugins using the Defender for IoT proprietary SDK (including C++ implementation and JSON configuration) to: 

- Define how to identify the protocol

- Define how to map the fields you want to extract from the traffic, and extract them 

- Define how to integrate with the Defender for IoT services

  :::image type="content" source="media/references-horizon-sdk/layers.png" alt-text="The built-in layers.":::

Defender for IoT provides basic dissectors for common protocols. You can build your dissectors on top of these protocols.


## What is an Inventory Device

The Defender for IoT Device inventory displays an extensive range of asset attributes that are detected by sensors monitoring the organizations networks and managed endpoints.

Defender for IoT will identify and classify devices as a single unique network device in the inventory for:

1. Standalone IT/OT/IoT devices (w/ 1 or multiple NICs)
1. Devices composed of multiple backplane components (including all racks/slots/modules)
1. Devices acting as network infrastructure such as Switch/Router (w/ multiple NICs). 

Public internet IP addresses, multicast groups, and broadcast groups are not considered inventory devices.
Devices that have been inactive for more than 60 days are classified as inactive Inventory devices.


## High availability

Increase the resilience of your Defender for IoT deployment by installing a high-availability appliance in the on-premises management console. High-availability deployments ensure that your managed sensors continuously report to an active on-premises management console.

This deployment is implemented with an on-premises management console pair that includes a primary and secondary appliance.

## Localization

Many console features support an extensive range of languages.

## Next step

[Getting started with Defender for IoT](getting-started.md)
