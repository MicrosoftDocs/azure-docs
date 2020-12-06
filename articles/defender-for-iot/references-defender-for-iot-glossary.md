---
title: Defender for IoT Glossary
description: This glossary provides a brief description of important CyberX Platform terms and concepts.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/15/2020
ms.topic: article
ms.service: azure
---

# CyberX Glossary

This glossary provides a brief description of important CyberX Platform terms and concepts. Use the *Learn More* links to navigate to related terms in the glossary. This will help you more quickly learn and leverage product tools.

For a glossary explanations regarding industry terminology, such as Industrial Control System (ICS), Human-machine interface (HMI) or known attacks such as BlackEnergy 3 or TRITON go to [https://cyberx-labs.com/glossary/](https://cyberx-labs.com/glossary/).

## A

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Access Group** | Support user access requirements for large organizations by creating Access Group rules.<br /><br />Rules let you control *view* and *configuration* access to the CyberX on-premises management console for specific user roles at relevant business units, regions, specific sites, and zones.<br /><br />For example, allow Security Analysts from an Active Directory group access to West European automotive but prevent access in Africa. | **on-premises management console<br /><br />Business Unit** |
| **Access Tokens** | Generate access tokens to access the CyberX rest API. Access the CyberX API Guide from the [CyberX Help Center](https://cyberx-labs.zendesk.com/hc/en-us). | **API** |
| **Acknowledge Alert Event** | Instruct CyberX to hide the alert once for the detected event. The alert will be triggered again if the event is detected again. | **Alert<br /><br />Learn Alert Event<br /><br />Mute Alert Event** |
| **Alert** | A message triggered by a CyberX engine regarding deviations from authorized network behavior, network anomalies or suspicious network activity and traffic. | **Forwarding Rule<br /><br />Exclusion Rule<br /><br />System Notifications** |
| **Alert Comment** | Comments defined by Security Analysts and Administrators that appear in alert messages. For example, instructions regarding mitigation actions to take, or names of individuals to contact regarding the event.<br /><br />Users reviewing alerts can choose the comment or comments that best reflect the event status or steps taken to investigate the alert. | **Alert** |
| **Anomaly Engine** | A CyberX engine that detects unusual machine-to-machine (M2M) communication and behavior, for example it may detected excessive SMB login attempts. Anomaly alerts are triggered when these events are detected. | **CyberX Engines** |
| **API** | Allows external systems to access data discovered by CyberX and perform actions using the external REST API over SSL connections.<br /><br />Access the CyberX API Guide from the [CyberX Help Center](https://cyberx-labs.zendesk.com). | **Access Tokens** |
| **Asset Map** | A graphical representation of network assets detected by CyberX; the connections between assets and information about each asset. Use the map to:<br /><br />- Retrieve and control critical asset information<br /><br />- Analyze network slices<br /><br />- Export asset details and summaries | **Purdue Layer Group** |
| **Asset Inventory - Sensor** | The Asset Inventory displays an extensive range asset attributes detected by CyberX. Options are available to:<br /><br />- Filter information displayed.<br /><br />- Export this information to a CSV file.<br /><br />- Import Windows Registry details. | **Group Asset Inventory - on-premises management console** |
| **Asset Inventory - on-premises management console** | Asset information from connected Sensors can be viewed from the on-premises management console in the Asset Inventory. This gives on-premises management console users a comprehensive view of all network information. | **Asset Inventory - Sensor<br /><br />Asset Inventory – Data Integrator** |
| **Asset Inventory – Data Integrator** | on-premises management console Asset Inventory data integration capabilities let you enhance the data in the Asset Inventory with information from other enterprise resources. For example, from: CMDBs, DNS, Firewalls, Web APIs and more. | **Asset Inventory - on-premises management console** |
| **Attack Vector Report** | A real-time graphical representation of vulnerability chains of exploitable endpoints.<br /><br />Reports let you evaluate the effect of mitigation activities in the attack sequence to determine, for example, if a system upgrade disrupts the attacker's path by breaking the attack chain, or whether an alternate attack path remains. This prioritize remediation and mitigation activities. | **Risk Assessment Report** |

## B

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Business Unit** | A logical organization of your business according to specific industries.<br /><br />For example, a global company that contains glass factories, plastic factories, can be managed as two different business units. You can control access of CyberX users to specific business units. | **on-premises management console<br /><br />Access Group<br /><br />Site<br /><br />Zone** |
| **Baseline** | Approved network traffic, protocols, commands and assets. CyberX identifies deviations from the network baseline. View approved baseline traffic by generating data mining reports. | **Data Mining<br /><br />Learning Mode** |

## C

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **on-premises management console** | The on-premises management console provides centralized view and management of assets and threats detected by CyberX sensor deployments in your organization. | **CyberX Platform<br /><br />Sensor** |
| **CLI Commands** | Command Line Interface options for CyberX Admin users. CLI commands are available for features that are not accessible from the CyberX Consoles.<br /><br />Access the CyberX CLI Guide from the [CyberX Help Center](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008901740-CyberX-CLI-Reference-Guide) |  |
| **CyberX Engines** | CyberX self-learning analytics engines eliminate the need for updating signatures or defining rules. The engines leverage ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies, malware, operational, protocol violations, and baseline network activity deviations.<br /><br />When an engine detects a deviation, an alert is triggered. Alerts can be viewed and managed from the Alerts screen or from a SIEM. | **Alert** |
| **CyberX Platform** | The CyberX solution installed on CyberX Sensors and the on-premises management console. | **Sensor<br /><br />on-premises management console** |

## D

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Data Mining** | Generate comprehensive and granular reports about your network assets:<br /><br />- **SOC Incident Response:** Reports in real-time to help deal with immediate incident response. For example, or a list of assets that may require patching.<br /><br />- **Forensics:** Reports based on historical data for investigative reports.<br /><br />- **IT Network Integrity:** Reports that help improve overall network security. For example, a report that lists assets with weak authentication credentials.<br /><br />- **Visibility:** Reports that covers all query items to view all baseline parameters of your network.<br /><br />Save Data Mining reports for Read Only users to view. | **Baseline<br /><br />Reports** |

## E

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Enterprise View** | A global map presenting Business Units, Sites and Zones in which CyberX Sensors are installed. View geographical locations of malicious alerts, operational alerts and more. | **Business Unit<br /><br />Site<br /><br />Zone** |
| **Event Tineline** | A timeline of activity detected on your network, including:<br /><br />- Alerts triggered<br /><br />- Network Events (informational)<br /><br />- User operations such as login, user deletion/creation, alert management, (Mute, Learn, Acknowledge)
Available in Sensor Consoles. |  |
| **Exclusion Rule** | Instruct CyberX to ignore alert triggers based on time period, asset address, alert name, or by a specific sensor.<br /><br />For example, if you know that all the OT assets monitored by a specific sensor will be going through a maintenance procedure between 6:30 and 10:15 in the morning, you can set an exclusion rule that states that no alerts should be sent by this sensor in the predefined period | **Alert<br /><br />Mute Alert Event** |

## F

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Forwarding Rule** | Forwarding Rules instruct CyberX to send alert information to third-party vendors or systems.<br /><br />For example, send alert information to a Splunk server or SYSLOG server. | **Alert** |

## G

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Group** | Predefined or custom groups of assets that contain specific attributes, for example assets that carried out programming activity or assets that are located on a specific subnet. Use groups to help you view assets and analyze asset in CyberX.<br /><br />Groups can be viewed in and created from the Asset Map and Asset Inventory. | **Asset Map<br /><br />Asset Inventory** |

## H

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Horizon Open Development Environment** | Secure IoT/ICS devices running proprietary and custom protocols or protocols that deviate from any standard. Use the Horizon Open Development Environment (ODE) SDK, to develop dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by CyberX services to provide complete monitoring, alerting and reporting.<br /><br />Use Horizon to:<br /><br />- **Expand** visibility and control without the need to upgrade CyberX platform versions.<br /><br />- **Secure** proprietary information by developing on-site as an external plugin.<br /><br />- **Localize** text for alerts, events, and protocol parameters
Contact your Customer Success representative for details. | **Protocol Support<br /><br />Localization** |
| **Horizon Custom Alert** | Enhance alert management in your enterprise by triggering custom alerts for any protocol (based on Horizon Framework traffic dissectors).<br /><br />These alerts can be used to communicate information:<br /><br />- About traffic detections based on protocols and underlying protocols in a proprietary Horizon plugin.<br /><br />- About a combination of protocol fields from all protocol layers. | **Protocol Support** |

## I

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Intergtaions** | Expand CyberX capabilities by sharing asset information with third-party systems. Organizations can bridge previously siloed security, NAC, incident management and asset management solutions to accelerate system-wide response and more rapidly mitigate risks. See the **[CyberX Help Center](https://cyberx-labs.zendesk.com/hc/en-us/categories/360000602111-Integrations)** for documentation on CyberX integrations with industry vendors. | **Forwarding Rule** |
| **Internal Subnet** | Subnet configurations defined by CyberX. In some cases, such as environments that use public ranges as internal ranges, you can instruct CyberX to resolve all subnets as internal subnets. Subnets are displayed in the map, and various CyberX reports. | **Subnets** |

## L

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Learn Alert Event** | Instruct CyberX to authorize the traffic detected in an alert event. | **Alert<br /><br />Acknowledge Alert Event<br /><br />Mute Alert Event** |
| **Learning Mode** | The mode used when CyberX learns your network activity. This activity becomes your network **baseline**. CyberX remains in the mode for a predefined period after installation. After this period, new activity detected will trigger CyberX alerts.<br /><br />Activity that deviates from learned acti9v after this period will trigger CyberX alerts. | **Smart IT Learning<br /><br />Baseline** |
| **Localization** | Localize text for alerts, events, and protocol parameters for dissector plugins developed by Horizon. | **Horizon Open Development Environment** |

## M

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Mute Alert Event** | Instruct CyberX to continuously ignore activity with identical assets and comparable traffic. | **Alert<br /><br />Exclusion Rule<br /><br />Acknowledge Alert Event<br /><br />Learn Alert Even** |

## N

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Notifications** | Information about network changes or unresolved asset properties. Options are available to update asset and network information with new data detected. Responding to notifications enriches the asset inventory, map and various reports. Available on Sensor Consoles. | **Alert<br /><br />System Notifications** |

## O

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Operational Alert** | Alerts that deal with operational network issues, for example if an asset is suspected to be disconnected form the network | **Alert<br /><br />Security Alert** |

## P

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Purdue Layer** | Shows the interconnections and interdependencies of main components of a typical ICS on the map |  |
| **Protocol Support** | In addition to embedded protocol support, you can secure IoT/ICS devices running proprietary and custom protocols, or protocols that deviate from any standard using the *Horizon Open Development Environment (ODE) SDK.* | **Horizon Open Development Environment** |

## R

| Term            | Description                        | Learn More                   |
| --------------- | ---------------------------------- | ---------------------------- |
| **Region** | A logical division of a global organization into geographical regions. For example, North America, Western Europe, Eastern Europe.<br /><br />North America may have factories from various business units. | **Access Group<br /><br />Business Unit<br /><br />on-premises management console<br /><br />Site<br /><br />Zone** |
| **Reports** | Reports reflect information generated by Data Mining query results. This includes default Data Mining results which are available in the Reports view. Admin and Security Analysts can also generate custom Data Mining queries and save them as reports. These reports will be available for Read only users a well. | **Data Mining** |
| **Risk Assessment Report** | Risk Assessment reporting lets you generate a security score for each network asset, as well as an overall network security score. The overall score represents the percentage of 100% security. The report provides mitigation recommendations that will help you improve your current security score. |  |

## S

| Term               | Description                        | Learn More                   |
| ------------------ | ---------------------------------- | ---------------------------- |
| **Security Alert** | Alerts that deal with security issues, for example Excessive SMB login attempts, Malware detections | **Alert<br /><br />Operational Alert** |
| **Selective Probing** | CyberX passively inspects IT and OT traffic and detects relevant information on assets, their attributes, behavior and more. In certain cases, some information may not be visible by passively analyzing the network.<br /><br />When this happens, you can use CyberX's safe, granular probing tools to discover important information on previously unreachable assets. |  |
| **Sensor** | The physical or virtual machine on which the CyberX Platform is installed. | **on-premises management console** |
| **Site** | A location that a factory or other entity. The Site should contain a zone or several zones in which a Sensor is installed. | **Zone** |
| **Site Management** | The on-premises management console option that that lets you manage enterprise Sensors. |  |
| **Smart IT Learning** | After the Learning period is complete and the Learning mode is disabled, CyberX may detect an unusually high level of baseline changes that are the result of normal IT activity, for example DNS and HTTP requests. This traffic may trigger unnecessary policy violation alerts and system notifications. To reduce these alerts and notifications you can enable **Smart IT Learning**. | **Learning Mode<br /><br />Baseline** |
| **Subnets** | To enable focus on the OT assets, IT assets are automatically aggregated by subnet in the Asset Map. Each subnet is presented as a single entity on the map, including an interactive collapsing/expanding capability to "drill down" into an IT subnet and back. | **Asset Map** |
| **System Notifications** | Notifications from the on-premises management console regrading:<br /><br />- Sensor connection status<br /><br />-  Remote backup failures | **Notifications<br /><br />Alert** |

## Z

| Term            | Description                                   | Learn More |
| --------------- | --------------------------------------------- | ---------- |
| **Zone** | An area within a Site in which a Sensor/s are installed. | **Site<br /><br />Business Unit<br /><br />Region** |
