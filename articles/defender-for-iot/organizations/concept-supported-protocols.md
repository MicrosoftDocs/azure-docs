---
title: Protocols supported by Microsoft Defender for IoT
description: Learn about protocols that Microsoft Defender for IoT supports.
ms.date: 12/04/2023
ms.topic: concept-article
ms.custom: enterprise-iot
---

# Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols

This article lists the protocols that are supported by default in Microsoft Defender for IoT.

## Supported protocols for OT device discovery

OT network sensors can detect the following protocols when identifying assets and devices in your network:

|Brand / Vendor |Protocols  |
|---------|---------|
|**ABB**     |   ABB 800xA DCS (IEC61850 MMS including ABB extension)<br> CNCP<br> RNRP<br> ABB IAC<br> ABB Totalflow   <br> ABB NetConfig   |
|**ASHRAE**     |    BACnet<br> BACnet BACapp<br> BACnet BVLC     |
|**Beckhoff**     |   AMS (ADS)<br> Twincat       |
|**Cisco**     |   CAPWAP Control<br> CAPWAP Data<br> CDP<br>  LWAPP      |
|**DICOM** |  Dicom    |
|**Desoutter Protocol** | Open |
|**DNP. org**     |   DNP3      |
|**Emerson**     |   DeltaV<br> DeltaV - Discovery<br> Emerson OpenBSI/BSAP<br> Ovation DCS ADMD<br>Ovation DCS DPUSTAT<br> Ovation DCS SSRPC      |
|**Emerson Fischer**     |  ROC       |
|**EVRoaming Foundation** | OCPI |
|**FANUC**     |  FANUC FOCUS    |
|**FieldComm Group**| HART-IP  |
|**GE**     | ADL (MarkVIe) <br>Bentley Nevada (System 1 / BN3500)<br>ClassicSDI (MarkVle) <br>  EGD<br>  GSM (GE MarkVI and MarkVIe)<br> InterSite<br> SDI (MarkVle) <br>  SRTP (GE)<br> GE_CMP        |
|**Generic Applications** | Active Directory<br> RDP<br> Teamviewer<br> VNC<br>  |
|**Honeywell**     |    ENAP<br> Experion DCS CDA<br> Experion DCS FDA<br> Honeywell EUCN <br> Honeywell Discovery     |
|**IEC**     |    Codesys V3<br>IEC 60870-5-7 (IEC 62351-3 + IEC 62351-5)<br> IEC 60870-5-104<br> IEC 60870-5-104 ASDU_APCI<br> IEC 60870 ICCP TASE.2<br>  IEC 61850 GOOSE<br> IEC 61850 MMS<br> IEC 61850 SMV (SAMPLED-VALUES)<br> LonTalk (LonWorks)    |
|**IEEE**     |     LLC<br> STP<br> VLAN    |
|**IETF**     |  ARP<br> DHCP<br> DCE RPC<br> DNS<br> FTP (FTP_ADAT<br> FTP_DATA)<br> GSSAPI (RFC2743)<br> HTTP<br> ICMP<br> IPv4<br> LLDP<br> MDNS<br> NBNS<br> NTLM (NTLMSSP Auth Protocol)<br> RPC<br> SMB / Browse / NBDGM<br> SMB / CIFS<br> SNMP<br> SPNEGO (RFC4178)<br> SSH<br> Syslog<br> TCP<br> Telnet<br> TFTP<br> TPKT<br> UDP       |
|**ISO**     |  CLNP (ISO 8473)<br> COTP (ISO 8073)<br> ISO Industrial Protocol<br>  MQTT (IEC 20922)       |
| **Jenesys** |FOX <br>Niagara |
|**Medical**     |ASTM<br> HL7  <br> DICOM  <br>  POCT1     |
|**Mitsubishi**     |   Melsoft / Melsec (Mitsubishi Electric)      |
|**Omron**     |  FINS <br>HTTP      |
|**OPC**     |  AE <br>Common <br> DA <br>HDA <br> UA       |
|**Oracle**     |   TDS<br> TNS      |
|**Rockwell Automation**     |  CSP2<br> ENIP<br> EtherNet/IP CIP (including Rockwell extension)<br> EtherNet/IP CIP FW version 27 and above  <br>Rockwell AADvance Discover <br> Rockwell AADvance SNCP/IXL    |
|**Samsung** | Samsung TV |
|**Schneider Electric**     | Modbus/TCP<br> Modbus TCP–Schneider Unity Extensions<br> OASYS (Schneider Electric Telvant)<br> Schneider TSAA <br> Schneider NetManage       |
|**Schneider Electric / Invensys**     |   Foxboro Evo<br> Foxboro I/A<br> Trident<br> TriGP<br> TriStation      |
|**Schneider Electric / Modicon**     |   Modbus RTU      |
|**Schneider Electric / Wonderware**     |    Wonderware Suitelink     |
| **SEL** | FTP <br> Telnet |
|**Siemens**     | CAMP<br> PCS7<br> PCS7 WinCC – Historian<br> Profinet DCP<br> Profinet I/O<br> Profinet Realtime<br> Siemens PHD<br> Siemens S7<br> Siemens S7 - Firmware and model extraction<br> Siemens S7 – key state<br> Siemens S7-Plus<br> Siemens SICAM<br> Siemens WinCC        |
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

## Next steps

For more information:

- [Create custom alert rules on an OT sensor](how-to-accelerate-alert-incident-response.md#create-custom-alert-rules-on-an-ot-sensor)
- [Forward OT alert information](how-to-forward-alert-information-to-partners.md)
