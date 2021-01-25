---
title: Defender for IoT glossary
description: This glossary provides a brief description of important Defender for IoT platform terms and concepts.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/09/2020
ms.topic: article
ms.service: azure
---

# Defender for IoT glossary

This glossary provides a brief description of important terms and concepts for the Azure Defender for IoT platform. Select the **Learn more** links to go to related terms in the glossary. This will help you more quickly learn and use product tools.

## A

| Term | Description | Learn more |
|--|--|--|
| **access group** | Support user access requirements for large organizations by creating access group rules.<br /><br />Rules let you control view and configuration access to the Defender for IoT on-premises management console for specific user roles at relevant business units, regions, sites, and zones.<br /><br />For example, allow security analysts from an Active Directory group to access West European automotive data but prevent access to data in Africa. | **on-premises management console<br /><br />business unit** |
| **access tokens** | Generate access tokens to access the Defender for IoT REST API. | **API** |
| **Acknowledge Alert Event** | Instruct Defender for IoT to hide the alert once for the detected event. The alert will be triggered again if the event is detected again. | **alert<br /><br />Learn Alert Event<br /><br />Mute Alert Event** |
| **alert** | A message that a Defender for IoT engine triggers regarding deviations from authorized network behavior, network anomalies, or suspicious network activity and traffic. | **forwarding rule<br /><br />exclusion rule<br /><br />system notifications** |
| **alert comment** | Comments that security analysts and administrators make in alert messages. For example, an alert comment might give instructions about mitigation actions to take, or names of individuals to contact regarding the event.<br /><br />Users who are reviewing alerts can choose the comment or comments that best reflect the event status, or steps taken to investigate the alert. | **alert** |
| **anomaly engine** | A Defender for IoT engine that detects unusual machine-to-machine (M2M) communication and behavior. For example, the engine might detect excessive SMB sign-in attempts. Anomaly alerts are triggered when these events are detected. | **Defender for IoT engines** |
| **API** | Allows external systems to access data discovered by Defender for IoT and perform actions by using the external REST API over SSL connections. | **access tokens** |
| **attack vector report** | A real-time graphical representation of vulnerability chains of exploitable endpoints.<br /><br />Reports let you evaluate the effect of mitigation activities in the attack sequence to determine. For example, you can evaluate whether a system upgrade disrupts the attacker's path by breaking the attack chain, or whether an alternate attack path remains. This prioritizes remediation and mitigation activities. | **risk assessment report** |

## B

| Term | Description | Learn more |
|--|--|--|
| **business unit** | A logical organization of your business according to specific industries.<br /><br />For example, a global company that contains glass factories and plastic factories can be managed as two different business units. You can control access of Defender for IoT users to specific business units. | **on-premises management console<br /><br />access group<br /><br />site<br /><br />zone** |
| **baseline** | Approved network traffic, protocols, commands, and devices. Defender for IoT identifies deviations from the network baseline. View approved baseline traffic by generating data-mining reports. | **data mining<br /><br />learning mode** |

## C

| Term | Description | Learn more |
|--|--|--|
| **on-premises management console** | The on-premises management console provides a centralized view and management of devices and threats that Defender for IoT sensor deployments detect in your organization. | **Defender for IoT platform<br /><br />sensor** |
| **CLI commands** | Command-line interface (CLI) options for Defender for IoT administrator users. CLI commands are available for features that can't be accessed from the Defender for IoT consoles. | - |


## D

| Term | Description | Learn more |
|--|--|--|
| **data mining** | Generate comprehensive and granular reports about your network devices:<br /><br />- **SOC incident response**: Reports in real time to help deal with immediate incident response. For example, a report can list devices that might need patching.<br /><br />- **forensics**: Reports based on historical data for investigative reports.<br /><br />- **IT network integrity**: Reports that help improve overall network security. For example, a report can list devices with weak authentication credentials.<br /><br />- **visibility**: Reports that cover all query items to view all baseline parameters of your network.<br /><br />Save data-mining reports for read-only users to view. | **baseline<br /><br />reports** |
| **Defender for IoT engines** | The self-learning analytics engines in Defender for IoT eliminate the need for updating signatures or defining rules. The engines use ICS-specific behavioral analytics and data science to continuously analyze OT network traffic for anomalies, malware, operational problems, protocol violations, and deviations from baseline network activity.<br /><br />When an engine detects a deviation, an alert is triggered. Alerts can be viewed and managed from the **Alerts** screen or from a SIEM. | **alert** |
| **Defender for IoT platform** | The Defender for IoT solution installed on Defender for IoT sensors and the on-premises management console. | **sensor<br /><br />on-premises management console** |
| **device map** | A graphical representation of network devices that Defender for IoT detects. It shows the connections between devices and information about each device. Use the map to:<br /><br />- Retrieve and control critical device information.<br /><br />- Analyze network slices.<br /><br />- Export device details and summaries. | **Purdue layer group** |
| **device inventory - sensor** | The device inventory displays an extensive range of device attributes detected by Defender for IoT. Options are available to:<br /><br />- Filter displayed information.<br /><br />- Export this information to a CSV file.<br /><br />- Import Windows registry details. | **group device inventory - on-premises management console** |
| **device inventory - on-premises management console** | Device information from connected sensors can be viewed from the on-premises management console in the device inventory. This gives users of the on-premises management console a comprehensive view of all network information. | **device inventory - sensor<br /><br />device inventory - data integrator** |
| **device inventory - data integrator** | The data integration capabilities of the on-premises management console let you enhance the data in the device inventory with information from other enterprise resources. Example resources are CMDBs, DNS, firewalls, and Web APIs. | **device inventory - on-premises management console** |

## E

| Term | Description | Learn more |
|--|--|--|
| **enterprise view** | A global map that presents business units, sites, and zones where Defender for IoT sensors are installed. View geographical locations of malicious alerts, operational alerts, and more. | **business unit<br /><br />site<br /><br />zone** |
| **event timeline** | A timeline of activity detected on your network, including:<br /><br />- Alerts triggered.<br /><br />- Network events (informational).<br /><br />- User operations such as sign-in, user deletion, and user creation, and alert management operations such as mute, learn, and acknowledge. Available in the sensor consoles. | - |
| **exclusion rule** | Instruct Defender for IoT to ignore alert triggers based on time period, device address, and alert name, or by a specific sensor.<br /><br />For example, if you know that all the OT devices monitored by a specific sensor will go through a maintenance procedure between 6:30 and 10:15 in the morning, you can set an exclusion rule that states that this sensor should send no alerts in the predefined period. | **alert<br /><br />Mute Alert Event** |

## F

| Term | Description | Learn more |
|--|--|--|
| **forwarding rule** | Forwarding rules instruct Defender for IoT to send alert information to partner vendors or systems.<br /><br />For example, send alert information to a Splunk server or a syslog server. | **alert** |

## G

| Term | Description | Learn more |
|--|--|--|
| **group** | Predefined or custom groups of devices that contain specific attributes, such as devices that carried out programming activity or devices that are located on a specific subnet. Use groups to help you view devices and analyze devices in Defender for IoT.<br /><br />Groups can be viewed in and created from the device map and device inventory. | **device map<br /><br />device inventory** |

## H

| Term | Description | Learn more |
|--|--|--|
| **Horizon Open Development Environment** | Secure IoT and ICS devices running proprietary and custom protocols or protocols that deviate from any standard. Use the Horizon Open Development Environment (ODE) SDK to develop dissector plug-ins that decode network traffic based on defined protocols. Defender for IoT services analyze traffic to provide complete monitoring, alerting, and reporting.<br /><br />Use Horizon to:<br /><br />- **Expand** visibility and control without the need to upgrade Defender for IoT platform versions.<br /><br />- **Secure** proprietary information by developing on-site as an external plug-in.<br /><br />- **Localize** text for alerts, events, and protocol parameters.<br /><br />Contact your customer success representative for details. | **protocol support<br /><br />localization** |
| **Horizon custom alert** | Enhance alert management in your enterprise by triggering custom alerts for any protocol (based on Horizon Framework traffic dissectors).<br /><br />These alerts can be used to communicate information:<br /><br />- About traffic detections based on protocols and underlying protocols in a proprietary Horizon plug-in.<br /><br />- About a combination of protocol fields from all protocol layers. | **protocol support** |

## I

| Term | Description | Learn more |
|--|--|--|
| **integrations** | Expand Defender for IoT capabilities by sharing device information with partner systems. Organizations can bridge previously siloed security, NAC, incident management, and device management solutions to accelerate system-wide responses and more rapidly mitigate risks. | **forwarding rule** |
| **internal subnet** | Subnet configurations defined by Defender for IoT. In some cases, such as environments that use public ranges as internal ranges, you can instruct Defender for IoT to resolve all subnets as internal subnets. Subnets are displayed in the map and in various Defender for IoT reports. | **subnets** |

## L

| Term | Description | Learn more |
|--|--|--|
| **Learn Alert Event** | Instruct Defender for IoT to authorize the traffic detected in an alert event. | **alert<br /><br />Acknowledge Alert Event<br /><br />Mute Alert Event** |
| **learning mode** | The mode used when Defender for IoT learns your network activity. This activity becomes your network baseline. Defender for IoT remains in the mode for a predefined period after installation. Activity that deviates from learned activity after this period will trigger Defender for IoT alerts. | **Smart IT Learning<br /><br />baseline** |
| **localization** | Localize text for alerts, events, and protocol parameters for dissector plug-ins developed by Horizon. | **Horizon Open Development Environment** |

## M

| Term | Description | Learn more |
|--|--|--|
| **Mute Alert Event** | Instruct Defender for IoT to continuously ignore activity with identical devices and comparable traffic. | **alert<br /><br />exclusion rule<br /><br />Acknowledge Alert Event<br /><br />Learn Alert Event** |

## N

| Term | Description | Learn more |
|--|--|--|
| **notifications** | Information about network changes or unresolved device properties. Options are available to update device and network information with new data detected. Responding to notifications enriches the device inventory, map, and various reports. Available on sensor consoles. | **alert<br /><br />system notifications** |

## O

| Term | Description | Learn more |
|--|--|--|
| **operational alert** | Alerts that deal with operational network issues, such as a device that's suspected to be disconnected from the network. | **alert<br /><br />security alert** |

## P

| Term | Description | Learn more |
|--|--|--|
| **Purdue layer** | Shows the interconnections and interdependencies of main components of a typical ICS on the map. |  |
| **protocol support** | In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard, by using the Horizon Open Development Environment SDK. | **Horizon Open Development Environment** |

## R

| Term | Description | Learn more |
|--|--|--|
| **region** | A logical division of a global organization into geographical regions. Examples are North America, Western Europe, and Eastern Europe.<br /><br />North America might have factories from various business units. | **access group<br /><br />business unit<br /><br />on-premises management console<br /><br />site<br /><br />zone** |
| **reports** | Reports reflect information generated by data-mining query results. This includes default data-mining results, which are available in the **Reports** view. Admins and security analysts can also generate custom data-mining queries and save them as reports. These reports will also be available for read-only users. | **data mining** |
| **risk assessment report** | Risk assessment reporting lets you generate a security score for each network device, along with an overall network security score. The overall score represents the percentage of 100 percent security. The report provides mitigation recommendations that will help you improve your current security score. | - |

## S

| Term | Description | Learn more |
|--|--|--|
| **security alert** | Alerts that deal with security issues, such as excessive SMB sign-in attempts or malware detections. | **alert<br /><br />operational alert** |
| **selective probing** | Defender for IoT passively inspects IT and OT traffic and detects relevant information on devices, their attributes, their behavior, and more. In certain cases, some information might not be visible in passive network analyses.<br /><br />When this happens, you can use the safe, granular probing tools in Defender for IoT to discover important information on previously unreachable devices. | - |
| **sensor** | The physical or virtual machine on which the Defender for IoT platform is installed. | **on-premises management console** |
| **site** | A location that a factory or other entity. The site should contain a zone or several zones in which a sensor is installed. | **zone** |
| **Site Management** | The on-premises management console option that that lets you manage enterprise sensors. | - |
| **Smart IT Learning** | After the learning period is complete and the learning mode is disabled, Defender for IoT might detect an unusually high level of baseline changes that are the result of normal IT activity, such as DNS and HTTP requests. This traffic might trigger unnecessary policy violation alerts and system notifications. To reduce these alerts and notifications, you can enable Smart IT Learning. | **learning mode<br /><br />baseline** |
| **subnets** | To enable focus on the OT devices, IT devices are automatically aggregated by subnet in the device map. Each subnet is presented as a single entity on the map, including an interactive collapsing or expanding capability to focus in to an IT subnet and back. | **device map** |
| **system notifications** | Notifications from the on-premises management console regrading:<br /><br />- Sensor connection status.<br /><br />-  Remote backup failures. | **notifications<br /><br />alert** |

## Z

| Term | Description | Learn more |
|--|--|--|
| **zone** | An area within a site in which a sensor or sensors are installed. | **site<br /><br />business unit<br /><br />region** |
