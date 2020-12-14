---
title: Key advantages
description: Learn about basic Defender for IoT concepts.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/13/2020
ms.topic: article
ms.service: azure
---

# Basic concepts 

- **Rapid non-invasive deployment:** The Defender for IoT sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic via passive (agentless) monitoring. It has zero impact on OT networks since it isn’t placed in the data path and doesn’t actively scan OT device. To deliver instant snapshots of detailed asset information, Defender for IoT sensor supplements passive monitoring with an optional active component that uses safe, vendor-approved commands to query both Windows and controller devices for asset details, as often or as infrequently as desired.

- **Passive monitoring** with deep packet inspection (DPI): Use DPI to dissect traffic from both serial and ethernet control network equipment.

- **Embedded knowledge** of ICS protocols, device, and applications: DPI alone is not enough to identify protocol anomalies and identify device at a granular level. The Defender for IoT sensor addresses some of the largest and most complex environments. In fact, more than 1300 OT networks have been analyzed to date, across all industrial sectors.

- **Analytics and self-learning engines:** Engines identify security issues via continuous monitoring and five different analytics engines that incorporate self-learning to eliminate the need for updating signatures or defining rules. The engines leverage ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies. The five engines are:

   - **Protocol violation detection engine**: Identifies the use of packet structures and field values that violate ICS protocol specifications.

   - **Policy violation detection engine:** Identifies policy violations such as unauthorized use of function codes, access to specific objects, or changes to asset configuration.

   - **Industrial malware detection engine:** Identifies behaviors indicating the presence of known malware such as Conficker, Black Energy, Havex, WannaCry, and NotPetya.

   - **Anomaly detection engine:** Detects unusual machine-to-machine (M2M) communications and behaviors. By modeling ICS networks as deterministic sequences of states and transitions, using a patented technique called Industrial Finite State Modeling (IFSM). The solution requires a shorter learning period than generic mathematical approaches or analytics, which were originally developed for IT rather than OT. It also detects anomalies faster, with minimal false positives.

   - **Operational incident detection:** Operational issues such as intermittent connectivity that can indicate early signs of equipment failure.

- **Network Traffic Analysis (NTA) for risk and vulnerability assessment:** Unique in the industry, Defender for IoT uses proprietary Network Traffic Analysis (NTA) algorithms to passively identify all network and endpoint vulnerabilities such as unauthorized remote access connections, rogue, or undocumented device, weak authentication, vulnerable device (based on unpatched CVEs), unauthorized bridges between subnets and weak firewall rules.

- **Data mining for investigations, forensics, and threat hunting:** The platform provides an intuitive data mining interface for granular searching of historical traffic across all relevant dimensions. For example, time period, IP address, MAC address, ports, in addition to protocol-specific queries based on function codes, protocol services, modules. Full-fidelity PCAPs are also provided for further drill-down analysis.

- **Localization:** Many console features support an extensive range of languages.

- **Integrations:** You can expand Defender for IoT's capabilities by sharing both device and alert information with partner systems. Integrations help enterprises bridge previously siloed security solutions to significantly enhance device visibility and threat intelligence, as well as accelerate the system-wide responses and mitigate risks faster. Integrations reduce complexity and eliminate IT and OT silos by integrating them into your existing SOC workflows and security stack. For example:

    - SIEMs such as IBM QRadar, Splunk, ArcSight, LogRhythm, RSA NetWitness.

    - Security orchestration and ticketing systems such as ServiceNow, IBM Resilient.

    - Secure remote access solutions such as CyberArk Privileged Session Manager (PSM), BeyondTrust.

    - Secure network access control (NAC) systems such as Aruba ClearPass, Forescout CounterACT.

    - Firewalls such as Fortinet and Checkpoint.

:::image type="content" source="media/concept-integrations/sample-integration-screens.png" alt-text="Integration samples for Defender for IoT":::

- **Complete Protocol Support:** In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the Horizon Open Development Environment (ODE) SDK, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting and reporting. Use Horizon to:

    - **Expand** visibility and control without the need to upgrade to new versions.
    - **Secure** proprietary information by developing on-site as an external plugin.

    - **Localize** text for alerts, events, and protocol parameters

In addition, proprietary protocol alerts can be used to communicate information:

- About traffic detections based on protocols and underlying protocols in a proprietary Horizon plugin.

- About a combination of protocol fields from all protocol layers. For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and ethernet destination, or an alert when any access is performed to a specific IP address.

Alerts are triggered when Horizon alert, rule conditions, are met. 

In addition, working with Horizon custom alerts lets you write your own alert titles and messages. Protocol fields and values resolved can also be embedded in the alert message text.

Using custom, conditioned-based alert triggering and messaging helps pinpoint specific network activity and effectively update your security, IT, and operational teams.

**Air-gapped networks**: If you are working in an air-gapped environment, the  Defender for IoT on-premises management console delivers a real-time view of key IoT and OT risk indicators and alerts across all of your facilities. Tightly integrated with your SOC workflows and runbooks, it enables easy prioritization of mitigation activities and cross-site correlation of threats.  

Defender for IoT provides a consolidated view of all your devices, and critical information about them, such as type (PLC, RTU, DCS, etc.), manufacturer, model, and firmware revision level, as well as alert information.  

Defender for IoT enables the effective management of multiple deployments and a comprehensive unified view of the network. Defender for IoT optimizes alert handling and control of the operational network security.

The on-premises management console is a web based administrative platform that lets you monitor and control the activities of global sensor installations. 

In addition to managing the data received from deployed sensors, the on-premises management console seamlessly integrates data from a variety of business resources, such as CMDBs, DNS, Firewalls, Web APIs, and more.

:::image type="content" source="media/concept-air-gapped-networks/site-management-alert-screen.png" alt-text="On-premises management console display":::

It is recommended that you familiarize yourself with the concepts, capabilities, and features available to sensors before working with the on-premises management console.

**High availability:** Increase the resiliency of your Defender for IoT deployment by installing a on-premises management console high availability appliance. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.

This deployment is implemented with a on-premises management console pair that includes a primary and secondary appliance.

## Next step

[Deploy and onboard a sensor](how-to-onboard-sensors.md)
