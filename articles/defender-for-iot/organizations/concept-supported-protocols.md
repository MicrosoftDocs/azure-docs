---
title: Protocols supported by Microsoft Defender for IoT
description: Learn about protocols that Microsoft Defender for IoT supports.
ms.date: 01/30/2023
ms.topic: concept-article
ms.custom: enterprise-iot
---

# Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols

This article lists the protocols that are supported by default in Microsoft Defender for IoT. If your organization uses proprietary protocols or other protocols not listed here, use the Defender for IoT Horizon SDK to extend support as needed.

## Supported protocols for OT device discovery

OT network sensors can detect the following protocols when identifying assets and devices in your network:

|Brand / Vendor |Protocols  |
|---------|---------|
|**ABB**     |   ABB 800xA DCS (IEC61850 MMS including ABB extension)<br> CNCP<br> RNRP<br> ABB IAC<br> ABB Totalflow      |
|**Samsung** | Samsung TV |
|**ASHRAE**     |    BACnet<br> BACnet BACapp<br> BACnet BVLC     |
|**Beckhoff**     |   AMS (ADS)<br> Twincat       |
|**Cisco**     |   CAPWAP Control<br> CAPWAP Data<br> CDP<br>  LWAPP      |
|**DNP. org**     |   DNP3      |
|**Emerson**     |   DeltaV<br> DeltaV - Discovery<br> Emerson OpenBSI/BSAP<br> Ovation DCS ADMD<br>Ovation DCS DPUSTAT<br> Ovation DCS SSRPC      |
|**Emerson Fischer**     |  ROC       |
|**Eurocontrol**     |      ASTERIX   |
|**GE**     | Bentley Nevada (System 1 / BN3500)<br>  EGD<br>  GSM (GE MarkVI and MarkVIe)<br>  SRTP (GE)<br> GE_CMP        |
|**Generic Applications** | Active Directory<br> RDP<br> Teamviewer<br> VNC<br>  |
|**Honeywell**     |    ENAP<br> Experion DCS CDA<br> Experion DCS FDA<br> Honeywell EUCN <br> Honeywell Discovery     |
|**IEC**     |    Codesys V3<br>IEC 60870-5-7 (IEC 62351-3 + IEC 62351-5)<br> IEC 60870-5-101 (encapsulated serial)<br> IEC 60870-5-103 (encapsulated serial)<br> IEC 60870-5-104<br> IEC 60870-5-104 ASDU_APCI<br> IEC 60870 ICCP TASE.2<br>  IEC 61850 GOOSE<br> IEC 61850 MMS<br> IEC 61850 SMV (SAMPLED-VALUES)<br> LonTalk (LonWorks)    |
|**IEEE**     |     LLC<br> STP<br> VLAN    |
|**IETF**     |  ARP<br> DHCP<br> DCE RPC<br> DNS<br> FTP (FTP_ADAT<br> FTP_DATA)<br> GSSAPI (RFC2743)<br> HTTP<br> ICMP<br> IPv4<br> IPv6<br> LLDP<br> MDNS<br> NBNS<br> NTLM (NTLMSSP Auth Protocol)<br> RPC<br> SMB / Browse / NBDGM<br> SMB / CIFS<br> SNMP<br> SPNEGO (RFC4178)<br> SSH<br> Syslog<br> TCP<br> Telnet<br> TFTP<br> TPKT<br> UDP       |
|**ISO**     |  CLNP (ISO 8473)<br> COTP (ISO 8073)<br> ISO Industrial Protocol<br>  MQTT (IEC 20922)       |
|**Medical**     |ASTM<br> HL7         |
|**Microsoft**     | Horizon community dissectors<br> Horizon proprietary dissectors (developed by customers)        |
|**Mitsubishi**     |   Melsoft / Melsec (Mitsubishi Electric)      |
|**Omron**     |  FINS       |
|**OPC**     |  UA       |
|**Oracle**     |   TDS<br> TNS      |
|**Rockwell Automation**     |   ENIP<br> EtherNet/IP CIP (including Rockwell extension)<br> EtherNet/IP CIP FW version 27 and above      |
|**Schneider Electric**     | Modbus/TCP<br> Modbus TCP–Schneider Unity Extensions<br> OASYS (Schneider Electric Telvant)<br> Schneider TSAA        |
|**Schneider Electric / Invensys**     |   Foxboro Evo<br> Foxboro I/A<br> Trident<br> TriGP<br> TriStation      |
|**Schneider Electric / Modicon**     |   Modbus RTU      |
|**Schneider Electric / Wonderware**     |    Wonderware Suitelink     |
|**Siemens**     | CAMP<br> PCS7<br> PCS7 WinCC – Historian<br> Profinet DCP<br> Profinet Realtime<br> Siemens PHD<br> Siemens S7<br> Siemens S7-Plus<br> Siemens SICAM<br> Siemens WinCC        |
|**Toshiba**     |Toshiba Computer Link         |
|**Yokogawa**     |   Centum ODEQ (Centum / ProSafe DCS)<br> HIS Equalize<br> FA-M3<br> Vnet/IP      |


[!INCLUDE [active-monitoring-protocols](includes/active-monitoring-protocols.md)]

## Supported protocols for Enterprise IoT device discovery

Enterprise IoT network sensors can detect the following protocols when identifying assets and devices in your network:

|Brand / Vendor |Protocols  |
|---------|---------|
| **ALARIS** | BAXTER |
|**ASHRAE**     |   BACnet BACapp     |
| **Cisco** | CDP |
| **IANA** | SIP |
| **IETF** | BROWSE <br> DHCP <br> DNS <br> HTTP <br> LLDP <br> MDNS <br> SNMP<br> SSDP |
|**Medical**     |DICOM <br>HL7 <br>POCT1        |
| **SWARM** | swarm |

## Don't see your protocol here? 

### Build support for proprietary OT protocols with the Horizon SDK

Asset vendors, partners, or platform owners can use Defender for IoT's Horizon Protocol SDK to secure any OT protocol used in IoT and ICS environments that's not isn't already supported by default.

Horizon helps you to write plugins for OT sensors that enable Deep Packet Inspection (DPI) on the traffic and detect threats in realtime. Customize your plugins localize and customize text for alerts, events, and protocol parameters.

Horizon provides:

- Support for common, proprietary, or custom protocols that deviate from standards
- Extra flexibility and scope for DPI development
- Extra visibility and control over your OT assets without needing to update your Defender for IoT version
- The security of allowing proprietary development without divulging sensitive information

:::image type="content" source="media/concept-supported-protocols/sdk-horizon.png" alt-text="Infographic that describes features provided by the Horizon SDK." border="false":::

### Collaborate with the Horizon community

Join our community to help lead the way towards digital transformation and industry-wide collaboration for protocol support!

The Horizon ICS community shares knowledge between domain experts in critical infrastructures, building management, production lines, transportation systems, and leading industries. For example, our community shares tutorials, discussion forums, instructor-led training, educational white papers, and more.

To join the Horizon community, email us at: [horizon-community@microsoft.com](mailto:horizon-community@microsoft.com)


## Next steps

For more information:

- [Create custom alert rules on an OT sensor](how-to-accelerate-alert-incident-response.md#create-custom-alert-rules-on-an-ot-sensor)
- [Forward OT alert information](how-to-forward-alert-information-to-partners.md)
