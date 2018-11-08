---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 11/06/2018
ms.author: alkohli
---

| Port no.|	In or out |	Port scope|	Required|	Notes |   |
|--------|-----|-----|-----------|----------|-----------|
| TCP 80 (HTTP)|Out|WAN	|No|Outbound port is used for internet access to retrieve updates. <br>The outbound web proxy is user configurable. |
| TCP 443 (HTTPS)|Out|WAN|Yes|Outbound port is used for accessing data in the cloud.<br>The outbound web proxy is user configurable.|   
| UDP 53 (DNS)|Out|WAN|In some cases<br>See notes|This port is required only if you're using an internet-based DNS server.<br>We recommend using a local DNS server. |
| UDP 123 (NTP)|Out|WAN|In some cases<br>See notes|This port is required only if you're using an internet-based NTP server.  |
| UDP 67 (DHCP)|Out|WAN|In some cases<br>See notes|This port is required only if you're using a DHCP server.  |
| TCP 80 (HTTP)|In|LAN|Yes|This port is the inbound port for local UI on the device for local management. <br>Accessing the local UI over HTTP will automatically redirect to HTTPS.  |
| TCP 443 (HTTPS)|In|LAN|Yes|This port is the inbound port for local UI on the device for local management. |