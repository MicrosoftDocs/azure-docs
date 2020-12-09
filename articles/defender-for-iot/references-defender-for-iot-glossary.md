---
title: Defender for IoT Glossary
description: This glossary provides a brief description of important Defender for IoT Platform terms and concepts.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/09/2020
ms.topic: article
ms.service: azure
---

# Defender for IoT glossary

This glossary provides a brief description of important Defender for IoT Platform terms and concepts. Select the **Learn more** links to navigate to related terms in the glossary. This will help you more quickly learn and leverage product tools.

For a glossary explanations regarding industry terminology, such as Industrial Control System (ICS), Human-machine interface (HMI) or known attacks such as BlackEnergy 3 or TRITON.

## A

| Term | Description | Learn more |
|--|--|--|
| **Access Group** | Support user access requirements for large organizations by creating Access Group rules.<br /><br />Rules let you control View and Configuration access to the Defender for IoT on-premises management console for specific user roles at relevant business units, regions, specific sites, and zones.<br /><br />For example, allow Security Analysts from an Active Directory group access to West European automotive but prevent access in Africa. | **on-premises management console<br /><br />Business Unit** |
| **Access Tokens** | Generate access tokens to access the Defender for IoT rest API. | **API** |
| **Acknowledge Alert Event** | Instruct Defender for IoT to hide the alert once for the detected event. The alert will be triggered again if the event is detected again. | **Alert<br /><br />Learn Alert Event<br /><br />Mute Alert Event** |
| **Alert** | A message triggered by a Defender for IoT engine regarding deviations from authorized network behavior, network anomalies, or suspicious network activity, and traffic. | **Forwarding Rule<br /><br />Exclusion Rule<br /><br />System Notifications** |
| **Alert Comment** | Comments defined by Security Analysts and Administrators that appear in alert messages. For example, instructions regarding mitigation actions to take, or names of individuals to contact regarding the event.<br /><br />Users reviewing alerts can choose the comment, or comments that best reflect the event status, or steps taken to investigate the alert. | **Alert** |
| **Anomaly Engine** | A Defender for IoT engine that detects unusual machine-to-machine (M2M) communication and behavior, for example it may detected excessive SMB sign in attempts. Anomaly alerts are triggered when these events are detected. | **Defender for IoT Engines** |
| **API** | Allows external systems to access data discovered by Defender for IoT and perform actions using the external REST API over SSL connections. | **Access Tokens** |
| **Device Map** | A graphical representation of network devices detected by Defender for IoT; the connections between devices and information about each device. Use the map to:<br /><br />- Retrieve and control critical device information.<br /><br />- Analyze network slices.<br /><br />- Export device details, and summaries. | **Purdue Layer Group** |
| **Device Inventory - Sensor** | The Device Inventory displays an extensive range device attributes detected by Defender for IoT. Options are available to:<br /><br />- Filter information displayed.<br /><br />- Export this information to a CSV file.<br /><br />- Import Windows Registry details. | **Group Device Inventory - on-premises management console** |
| **Device Inventory - on-premises management console** | Device information from connected sensors can be viewed from the on-premises management console in the Device Inventory. This gives on-premises management console users a comprehensive view of all network information. | **Device Inventory - Sensor<br /><br />Device Inventory – Data Integrator** |
| **Device Inventory – Data Integrator** | The on-premises management console Device Inventory data integration capabilities let you enhance the data in the Device Inventory with information from other enterprise resources. For example, from: CMDBs, DNS, Firewalls, Web APIs. | **Device Inventory - on-premises management console** |
| **Attack Vector Report** | A real-time graphical representation of vulnerability chains of exploitable endpoints.<br /><br />Reports let you evaluate the effect of mitigation activities in the attack sequence to determine. For example, if a system upgrade disrupts the attacker's path by breaking the attack chain, or whether an alternate attack path remains. This prioritize remediation and mitigation activities. | **Risk Assessment Report** |

## B

| Term | Description | Learn more |
|--|--|--|
| **Business Unit** | A logical organization of your business according to specific industries.<br /><br />For example, a global company that contains glass factories, plastic factories, can be managed as two different business units. You can control access of Defender for IoT users to specific business units. | **on-premises management console<br /><br />Access Group<br /><br />Site<br /><br />Zone** |
| **Baseline** | Approved network traffic, protocols, commands and devices. Defender for IoT identifies deviations from the network baseline. View approved baseline traffic by generating data mining reports. | **Data Mining<br /><br />Learning Mode** |

## C

| Term | Description | Learn more |
|--|--|--|
| **on-premises management console** | The on-premises management console provides centralized view and management of devices and threats detected by Defender for IoT sensor deployments in your organization. | **Defender for IoT Platform<br /><br />Sensor** |
| **CLI Commands** | Command Line Interface  (CLI) options for Defender for IoT administrator users. CLI commands are available for features that are not accessible from the Defender for IoT consoles. | - |
| **Defender for IoT Engines** | Defender for IoT's self-learning analytics engines eliminate the need for updating signatures or defining rules. The engines leverage ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies, malware, operational, protocol violations, and baseline network activity deviations.<br /><br />When an engine detects a deviation, an alert is triggered. Alerts can be viewed and managed from the Alerts screen or from a SIEM. | **Alert** |
| **Defender for IoT Platform** | The Defender for IoT solution installed on Defender for IoT sensors and the on-premises management console. | **Sensor<br /><br />on-premises management console** |

## D

| Term | Description | Learn more |
|--|--|--|
| **Data Mining** | Generate comprehensive and granular reports about your network devices:<br /><br />- **SOC Incident Response:** Reports in real-time to help deal with immediate incident response. For example, a list of devices that may require patching.<br /><br />- **Forensics:** Reports based on historical data for investigative reports.<br /><br />- **IT Network Integrity:** Reports that help improve overall network security. For example, a report that lists devices with weak authentication credentials.<br /><br />- **Visibility:** Reports that covers all query items to view all baseline parameters of your network.<br /><br />Save Data Mining reports for Read Only users to view. | **Baseline<br /><br />Reports** |

## E

| Term | Description | Learn more |
|--|--|--|
| **Enterprise View** | A global map presenting Business Units, Sites and Zones in which Defender for IoT sensors are installed. View geographical locations of malicious alerts, operational alerts and more. | **Business Unit<br /><br />Site<br /><br />Zone** |
| **Event Tim eline** | A timeline of activity detected on your network, including:<br /><br />- Alerts triggered<br /><br />- Network Events (informational)<br /><br />- User operations such as sign in, user deletion, user creation, and alert management such as Mute, Learn, and Acknowledge. Available in the sensor consoles. | - |
| **Exclusion Rule** | Instruct Defender for IoT to ignore alert triggers based on time period, device address, alert name, or by a specific sensor.<br /><br />For example, if you know that all the OT devices monitored by a specific sensor will be going through a maintenance procedure between 6:30 and 10:15 in the morning, you can set an exclusion rule that states that no alerts should be sent by this sensor in the predefined period | **Alert<br /><br />Mute Alert Event** |

## F

| Term | Description | Learn more |
|--|--|--|
| **Forwarding Rule** | Forwarding Rules instruct Defender for IoT to send alert information to partner vendors or systems.<br /><br />For example, send alert information to a Splunk server or SYSLOG server. | **Alert** |

## G

| Term | Description | Learn more |
|--|--|--|
| **Group** | Predefined or custom groups of devices that contain specific attributes, for example devices that carried out programming activity or devices that are located on a specific subnet. Use groups to help you view devices and analyze device in Defender for IoT.<br /><br />Groups can be viewed in and created from the Device Map and Device Inventory. | **Device Map<br /><br />Device Inventory** |

## H

| Term | Description | Learn more |
|--|--|--|
| **Horizon Open Development Environment** | Secure IoT and ICS devices running proprietary and custom protocols or protocols that deviate from any standard. Use the Horizon Open Development Environment (ODE) SDK, to develop dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by Defender for IoT services to provide complete monitoring, alerting and reporting.<br /><br />Use Horizon to:<br /><br />- **Expand** visibility and control without the need to upgrade Defender for IoT platform versions.<br /><br />- **Secure** proprietary information by developing on-site as an external plugin.<br /><br />- **Localize** text for alerts, events, and protocol parameters. |
| Contact your customer success representative for details. | **Protocol Support<br /><br />Localization** |
| **Horizon Custom Alert** | Enhance alert management in your enterprise by triggering custom alerts for any protocol (based on Horizon Framework traffic dissectors).<br /><br />These alerts can be used to communicate information:<br /><br />- About traffic detections based on protocols and underlying protocols in a proprietary Horizon plugin.<br /><br />- About a combination of protocol fields from all protocol layers. | **Protocol Support** |

## I

| Term | Description | Learn more |
|--|--|--|
| **Intergtaions** | Expand Defender for IoT capabilities by sharing device information with partner systems. Organizations can bridge previously siloed security, NAC, incident management, and device management solutions to accelerate system-wide response and more rapidly mitigate risks. | **Forwarding Rule** |
| **Internal Subnet** | Subnet configurations defined by Defender for IoT. In some cases, such as environments that use public ranges as internal ranges, you can instruct Defender for IoT to resolve all subnets as internal subnets. Subnets are displayed in the map, and various Defender for IoT reports. | **Subnets** |

## L

| Term | Description | Learn more |
|--|--|--|
| **Learn Alert Event** | Instruct Defender for IoT to authorize the traffic detected in an alert event. | **Alert<br /><br />Acknowledge Alert Event<br /><br />Mute Alert Event** |
| **Learning Mode** | The mode used when Defender for IoT learns your network activity. This activity becomes your network **baseline**. Defender for IoT remains in the mode for a predefined period after installation. After this period, new activity detected will trigger Defender for IoT alerts.<br /><br />Activity that deviates from learned active after this period will trigger Defender for IoT alerts. | **Smart IT Learning<br /><br />Baseline** |
| **Localization** | Localize text for alerts, events, and protocol parameters for dissector plugins developed by Horizon. | **Horizon Open Development Environment** |

## M

| Term | Description | Learn more |
|--|--|--|
| **Mute Alert Event** | Instruct Defender for IoT to continuously ignore activity with identical devices and comparable traffic. | **Alert<br /><br />Exclusion Rule<br /><br />Acknowledge Alert Event<br /><br />Learn Alert Even** |

## N

| Term | Description | Learn more |
|--|--|--|
| **Notifications** | Information about network changes or unresolved device properties. Options are available to update device and network information with new data detected. Responding to notifications enriches the device inventory, map and various reports. Available on sensor consoles. | **Alert<br /><br />System Notifications** |

## O

| Term | Description | Learn more |
|--|--|--|
| **Operational Alert** | Alerts that deal with operational network issues, for example if an device is suspected to be disconnected form the network | **Alert<br /><br />Security Alert** |

## P

| Term | Description | Learn more |
|--|--|--|
| **Purdue Layer** | Shows the interconnections and interdependencies of main components of a typical ICS on the map |  |
| **Protocol Support** | In addition to embedded protocol support, you can secure IoT, and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard using the Horizon Open Development Environment (ODE) SDK. | **Horizon Open Development Environment** |

## R

| Term | Description | Learn more |
|--|--|--|
| **Region** | A logical division of a global organization into geographical regions. For example, North America, Western Europe, and Eastern Europe.<br /><br />North America may have factories from various business units. | **Access Group<br /><br />Business Unit<br /><br />on-premises management console<br /><br />Site<br /><br />Zone** |
| **Reports** | Reports reflect information generated by Data Mining query results. This includes default Data Mining results which are available in the Reports view. Admin and Security Analysts can also generate custom Data Mining queries and save them as reports. These reports will be available for Read only users a well. | **Data Mining** |
| **Risk Assessment Report** | Risk Assessment reporting lets you generate a security score for each network device, as well as an overall network security score. The overall score represents the percentage of 100% security. The report provides mitigation recommendations that will help you improve your current security score. | - |

## S

| Term | Description | Learn more |
|--|--|--|
| **Security Alert** | Alerts that deal with security issues, for example excessive SMB sign in attempts or malware detections. | **Alert<br /><br />Operational Alert** |
| **Selective Probing** | Defender for IoT passively inspects IT and OT traffic and detects relevant information on devices, their attributes, behavior and more. In certain cases, some information may not be visible by passively analyzing the network.<br /><br />When this happens, you can use Defender for IoT's safe, granular probing tools to discover important information on previously unreachable devices. | - |
| **Sensor** | The physical or virtual machine on which the Defender for IoT Platform is installed. | **on-premises management console** |
| **Site** | A location that a factory or other entity. The Site should contain a zone or several zones in which a sensor is installed. | **Zone** |
| **Site Management** | The on-premises management console option that that lets you manage enterprise sensors. | - |
| **Smart IT Learning** | After the Learning period is complete and the Learning mode is disabled, Defender for IoT may detect an unusually high level of baseline changes that are the result of normal IT activity, for example DNS and HTTP requests. This traffic may trigger unnecessary policy violation alerts and system notifications. To reduce these alerts and notifications you can enable **Smart IT Learning**. | **Learning Mode<br /><br />Baseline** |
| **Subnets** | To enable focus on the OT devices, IT devices are automatically aggregated by subnet in the Device Map. Each subnet is presented as a single entity on the map, including an interactive collapsing, or expanding capability to focus in to an IT subnet and back. | **Device Map** |
| **System Notifications** | Notifications from the on-premises management console regrading:<br /><br />- Sensor connection status.<br /><br />-  Remote backup failures. | **Notifications<br /><br />Alert** |

## Z

| Term | Description | Learn more |
|--|--|--|
| **Zone** | An area within a site in which a sensor(s) are installed. | **Site<br /><br />Business Unit<br /><br />Region** |
