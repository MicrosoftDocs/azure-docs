---
title: Key advantages
description: "Key advantages"
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/09/2020
ms.topic: article
ms.service: azure
---

# Key advantages 

- **Rapid non-invasive deployment:** The Azure Defender for IoT sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic via passive (agentless) monitoring. It has zero impact on OT networks since it isn’t placed in the data path and doesn’t actively scan OT assets. To deliver instant snapshots of detailed asset information, Azure Defender for IoT sensor supplements passive monitoring with an optional Active component that uses safe, vendor-approved commands to query both Windows and controller devices for asset details — as often or as infrequently as desired.

- **Passive monitoring** with deep packet inspection (DPI): Use deep packet inspection to dissect traffic from both serial and Ethernet control network equipment.

- **Embedded knowledge** of ICS protocols, assets, and applications: DPI alone is not enough to identify protocol anomalies and identify assets at a granular level. The Azure Defender for IoT sensor addresses some of the largest and most complex environments. In fact, more than 1300 OT networks have been analyzed to date — across all industrial sectors.

- **Complete Protocol Support:** In addition to embedded protocol support, you can secure IoT/ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the *Horizon Open Development Environment (ODE) SDK*, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting and reporting. Use Horizon to:

   - **Expand** visibility and control without the need to upgrade to new versions.

   - **Secure** proprietary information by developing on-site as an external plugin.

   - **Localize** text for alerts, events, and protocol parameters

- **Proprietary ICS threat intelligence & vulnerability research:** The Section 52 Threat Intelligence team are world-class domain experts that track ICS-specific zero-days, campaigns, and adversaries as well as reverse-engineer malware. This intelligence adds contextual information to enrich our platform analytics and supports our managed services for incident response and breach investigation.

- **Analytics & Self-Learning Engines:** Engines identify security issues via continuous monitoring and five different analytics engines that incorporate self-learning to eliminate the need for updating signatures or defining rules. The engines leverage ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies. The five engines are:

   - **Protocol violation detection engine**: Identifies the use of packet structures and field values that violate ICS protocol specifications

   - **Policy violation detection engine:** Identifies policy violations such as unauthorized use of function codes, access to specific objects, or changes to asset configuration.

   - **Industrial malware detection engine:** Identifies behaviors indicating the presence of known malware such as Conficker, Black Energy, Havex, WannaCry/NotPetya.

   - **Anomaly detection engine:** Detects unusual machine-to-machine (M2M) communications and behaviors. By modeling ICS networks as deterministic sequences of states and transitions — using a patented technique called Industrial Finite State Modeling (IFSM) — the solution requires a shorter learning period than generic mathematical approaches or analytics, which were originally developed for IT rather than OT. It also detects anomalies faster, with minimal false positives.

   - **Operational incident detection:** Operational issues such as intermittent connectivity that can indicate early signs of equipment failure.

- **Network Traffic Analysis (NTA) for risk & vulnerability assessment:** Unique in the industry, Defender for IoT uses proprietary Network Traffic Analysis (NTA) algorithms to passively identify all network and endpoint vulnerabilities such as unauthorized remote access connections, rogue or undocumented assets, weak authentication, vulnerable assets (based on unpatched CVEs), unauthorized bridges between subnets and weak firewall rules.

- **Data mining for investigations, forensics, and threat hunting:** The platform provides an intuitive data mining interface for granular searching of historical traffic across all relevant dimensions (e.g., time period, IP or MAC address, ports, in addition to protocol-specific queries based on function codes, protocol services, modules, etc.). Full-fidelity PCAPs are also provided for further drill-down analysis.

- **Localization:** Many Console features support an extensive range of languages.
