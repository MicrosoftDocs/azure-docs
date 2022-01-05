---
title: Protocols supported by Azure Defender for IoT
description: Learn about all of the protocols that are supported by Azure Defender for IoT.
ms.date: 09/09/2021
ms.topic: article
---

# Support for IoT, OT, ICS, and SCADA protocols

Azure Defender for IoT provides an open and interoperable Operation Technology (OT) cybersecurity platform. Defender for IoT is deployed in many different locations, and reduces IoT, IT, and ICS risk with deployments in demanding, and complex OT environments across all industry verticals, and geographies.

## Supported protocols

Azure Defender for IoT supports a broad range of protocols across a diverse enterprise, and includes industrial automation equipment across all industrial sectors, enterprise networks, and building management system (BMS) environments. For custom or proprietary protocols, Microsoft offers an SDK that makes it easy to develop, test, and deploy custom protocol dissectors as plug-ins. The SDK does all this without divulging proprietary information, such as how the protocols are designed, or by sharing PCAPs that may contain sensitive information. The complete list of supported protocols is listed in the table below.

| Supported Protocols | | | |
|--|--|--|--|
| AMS (Beckhoff) | GOOSE (IoT/OT) | PCCC (Rockwell) | VLAN (Generic) |
| ARP (Generic) | Honeywell Experion (Honeywell) | PCS7 (Siemens) | Wonderware Suitelink (Schneider Electric/Wonderware) |
| HL7 (Generic) | Profinet DCP (Siemens/Generic) | Yokogawa HIS Equalize (Yokogawa) |
| ASTM (Generic) | ICMP (Generic) | Profinet Realtime (Siemens/Generic) | |
| BACnet (IoT/OT) | IEC 60870 (IEC104/101) (IoT/OT) | RPC (Generic) | |
| BeckhoffTwincat (Beckhoff) | IPv4 (Generic) | Yokogawa VNet/IP (Yokogawa) | |
| Bently Nevada (Baker Hughes) | IPv6 (Generic) | Schneider ElectricTelvent (OASyS) (Schneider Electric) | |
| CAMP (Siemens) | ISO Industrial Protocol (IoT/OT) | Schneider Electric/ Invensys /TriStation / Foxboro I/A / Foxboro EVO | |
| CAPWAP (Generic) | LLC (Generic) | Siemens PHD (Siemens) | |
| CDP (Cisco) | LLDP (Generic) | Siemens S7 (Siemens) | |
| CITECTSCADA ODBC SERVICE (Citect) | Lontalk (IoT/OT) | Siemens S7-Plus (Siemens) | |
| Codesys V3 (Generic) | Mitsubishi Melsec/Melsoft (Mitsubishi) | Siemens SICAM (Siemens) |
| MMS (including ABB extension) (ABB / Generic) | Siemens WinCC (Siemens) |
| DNP3 (IoT/OT) | Modbus over CIP (Rockwell) | SMB / Browse / NBDGM (Generic) | |
| DNS (Generic) | Modbus RTU (IoT/OT) | SMV (SAMPLED-VALUES) (IoT/OT) |
| Emerson DeltaV (Emerson) | Modbus Schneider Electric extensions / Unity (Schneider Electric) | SSH (Generic) | |
| Emerson OpenBSI/BSAP (Emerson) | Modbus TCP (IoT/OT) | STP (Generic) | |
| Emerson Ovation (Emerson) | MQTT (IoT/OT) | Syslog (Generic) | |
| Emerson/Fisher ROC (Emerson) | NBNS (Generic) | TCP (Generic) | |
| EtherNet/IP CIP (including Rockwell extension) (Rockwell) | netbios (Generic) | TDS (Oracle) | |
| Euromap 63 (IoT/OT) | NTLM (Generic) | TNS (Oracle) | |
| GE EGD (GE) | Omron FINS (Omron) | Toshiba Computer Link (Toshiba) | |
| GE-SRTP (GE) | UDP (Generic) | |

Horizon community protocol dissectors and proprietary protocol dissectors developed by customers are also supported. See [Horizon proprietary protocol dissector](references-horizon-sdk.md) for details.

## Quickly add support for proprietary restricted protocols

The Industrial Internet of Things (IIoT) unlocks new levels of productivity. These in turn help organizations improve security, increase output, and maximize revenue. Digitalization is driving deployment of billions of IoT devices, and increases the connectivity between IT, and OT networks. This increase in connectivity increases the attack surface, and allows for a greater risk of dangerous cyberattacks on industrial control systems.

The Horizon Protocol SDK allows quick support for 100% of the protocols used in IoT, and ICS environments. Custom, or proprietary protocols can be limited so that they are not able to be shared outside your organization. Either due to regulations, or corporate policies. The Horizon SDK allows you to write plug-ins that enable Deep Packet Inspection (DPI) on the traffic, and detect threats in real time. The Horizon SDK makes extra customizations possible as well. For example, the Horizon SDK enables asset vendors, partners, or platform owners to localize and customize the text for alerts, events, and protocol parameters.

[![The Horizon SDK allows quick support for 100% of the protocols used in IoT, and ICS environments.](media/concept-supported-protocols/sdk-horizon.png)](media/concept-supported-protocols/sdk-horizon-expanded.png#lightbox)

## Collaborate with the Horizon community

Be part of a community that is leading the way toward digital transformation and industry-wide collaboration for protocol support. The Horizon ICS community allows knowledge sharing for domain experts in critical infrastructures, building management, production lines, transportation systems, and other industrial leaders.

The community provides tutorials, discussion forums, instructor-led training, educational white papers, webinars, and more.

We invite you to join our community here: <horizon-community@microsoft.com>

## Next steps

Learn more about the [Horizon proprietary protocol dissector](references-horizon-sdk.md).
Check out our [Horizon API](references-horizon-api.md).
