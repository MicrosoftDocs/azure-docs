---
title: Key advantages
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/09/2020
ms.topic: article
ms.service: azure
---

# Key advantages 

- **Rapid non-invasive deployment:** The Defender for IoT sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic via passive (agentless) monitoring. It has zero impact on OT networks since it isn’t placed in the data path and doesn’t actively scan OT device. To deliver instant snapshots of detailed asset information, Defender for IoT sensor supplements passive monitoring with an optional active component that uses safe, vendor-approved commands to query both Windows and controller devices for asset details, as often or as infrequently as desired.

- **Passive monitoring** with deep packet inspection (DPI): Use DPI to dissect traffic from both serial and ethernet control network equipment.

- **Embedded knowledge** of ICS protocols, device, and applications: DPI alone is not enough to identify protocol anomalies and identify device at a granular level. The Defender for IoT sensor addresses some of the largest and most complex environments. In fact, more than 1300 OT networks have been analyzed to date, across all industrial sectors.

- **Complete protocol support:** In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the *Horizon Open Development Environment (ODE) SDK*, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting and reporting. Use Horizon to:

   - **Expand** visibility and control without the need to upgrade to new versions.

   - **Secure** proprietary information by developing on-site as an external plugin.

   - **Localize** text for alerts, events, and protocol parameters.

- **Analytics and self-learning engines:** Engines identify security issues via continuous monitoring and five different analytics engines that incorporate self-learning to eliminate the need for updating signatures or defining rules. The engines leverage ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies. The five engines are:

   - **Protocol violation detection engine**: Identifies the use of packet structures and field values that violate ICS protocol specifications.

   - **Policy violation detection engine:** Identifies policy violations such as unauthorized use of function codes, access to specific objects, or changes to asset configuration.

   - **Industrial malware detection engine:** Identifies behaviors indicating the presence of known malware such as Conficker, Black Energy, Havex, WannaCry, and NotPetya.

   - **Anomaly detection engine:** Detects unusual machine-to-machine (M2M) communications and behaviors. By modeling ICS networks as deterministic sequences of states and transitions, using a patented technique called Industrial Finite State Modeling (IFSM). The solution requires a shorter learning period than generic mathematical approaches or analytics, which were originally developed for IT rather than OT. It also detects anomalies faster, with minimal false positives.

   - **Operational incident detection:** Operational issues such as intermittent connectivity that can indicate early signs of equipment failure.

- **Network Traffic Analysis (NTA) for risk and vulnerability assessment:** Unique in the industry, Defender for IoT uses proprietary Network Traffic Analysis (NTA) algorithms to passively identify all network and endpoint vulnerabilities such as unauthorized remote access connections, rogue, or undocumented device, weak authentication, vulnerable device (based on unpatched CVEs), unauthorized bridges between subnets and weak firewall rules.

- **Data mining for investigations, forensics, and threat hunting:** The platform provides an intuitive data mining interface for granular searching of historical traffic across all relevant dimensions. For example, time period, IP address, MAC address, ports, in addition to protocol-specific queries based on function codes, protocol services, modules. Full-fidelity PCAPs are also provided for further drill-down analysis.

- **Localization:** Many console features support an extensive range of languages.
