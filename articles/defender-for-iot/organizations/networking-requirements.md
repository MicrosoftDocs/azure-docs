---
title: Networking requirements - Microsoft Defender for IoT
description: Learn about Microsoft Defender for IoT's networking requirements, from network sensors, and deployment workstations.
ms.date: 01/15/2023
ms.topic: reference
---

# Networking requirements

This article lists the interfaces that must be accessible on Microsoft Defender for IoT network sensors, and deployment workstations in order for services to function as expected.

Make sure that your organization's security policy allows access for the interfaces listed in the tables below.

## User access to the sensor

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| SSH | TCP | In/Out | 22 | CLI | To access the CLI | Client | Sensor  |
| HTTPS | TCP | In/Out | 443 | To access the sensor | Access to Web console | Client | Sensor  |

## Sensor access to Azure portal

| Protocol | Transport | In/Out | Port | Purpose | Source | Destination |
|--|--|--|--|--|--|--|
| HTTPS | TCP | Out | 443 | Access to Azure | Sensor |OT network sensors connect to Azure to provide alert and device data and sensor health messages, access threat intelligence packages, and more. Connected Azure services include IoT Hub, Blob Storage, Event Hubs, and the Microsoft Download Center.<br><br>Download the list from the **Sites and sensors** page in the Azure portal. Select an OT sensor with software versions 22.x or higher, or a site with one or more supported sensor versions. Then, select **More options > Download endpoint details**. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).|

## Sensor access to the OT sensor

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| NTP | UDP | In/Out | 123 | Time Sync | Connects the NTP to the OT sensor | Sensor | OT sensor |
| TLS/SSL | TCP | In/Out | 443 | Give the sensor access to the OT sensor | The connection between the sensor, and the OT sensor | Sensor | OT sensor |

## Other firewall rules for external services (optional)

Open these ports to allow extra services for Defender for IoT.

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| SMTP | TCP | Out | 25 | Email | Used to open the customer's mail server, in order to send emails for alerts, and events | Sensor and OT sensor | Email server |
| DNS | TCP/UDP | In/Out | 53 | DNS | The DNS server port | OT sensor and Sensor | DNS server |
| HTTP | TCP | Out | 80 | The CRL download for certificate validation when uploading  certificates. | Access to the CRL server | Sensor and OT sensor | CRL server |
| [WMI](how-to-configure-windows-endpoint-monitoring.md) | TCP/UDP | Out | 135, 1025-65535 | Monitoring | Windows Endpoint Monitoring | Sensor | Relevant network element |
| [SNMP](how-to-set-up-snmp-mib-monitoring.md) | UDP | Out | 161 | Monitoring | Monitors the sensor's health | OT sensor and Sensor | SNMP server |
| LDAP | TCP | In/Out | 389 | Active Directory | Allows Active Directory management of users that have access, to sign in to the system | OT sensor and Sensor | LDAP server |
| Proxy | TCP/UDP | In/Out | 443 | Proxy | To connect the sensor to a proxy server | OT sensor and Sensor | Proxy server |
| Syslog | UDP | Out | 514 | LEEF | The logs that are sent from the OT sensor to Syslog server | OT sensor and Sensor | Syslog server |
| LDAPS | TCP | In/Out | 636 | Active Directory | Allows Active Directory management of users that have access, to sign in to the system | OT sensor and Sensor | LDAPS server |
| Tunneling | TCP | In | 9000 </br></br> In addition to port 443 </br></br> Allows access from the sensor, or end user, to the OT sensor </br></br> Port 22 from the sensor to the OT sensor | Monitoring | Tunneling | Endpoint, Sensor | OT sensor |

## Next steps

For more information, see [Plan and prepare for deploying a Defender for IoT site](best-practices/plan-prepare-deploy.md).
