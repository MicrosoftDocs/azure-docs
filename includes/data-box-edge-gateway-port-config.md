---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 043/26/2021
ms.author: alkohli
---

| Port no.|	In or out |	Port scope|	Required|	Notes |
|--------|-----|-----|-----------|----------|
| TCP 80 (HTTP)|Out|WAN	|No|Outbound port is used for internet access to retrieve updates. <br>The outbound web proxy is user configurable. |
| TCP 443 (HTTPS)|Out|WAN|Yes|Outbound port is used for accessing data in the cloud.<br>The outbound web proxy is user configurable.|
| UDP 123 (NTP)|Out|WAN|In some cases<br>See notes|This port is required only if you're using an internet-based NTP server.  |   
| UDP 53 (DNS)|Out|WAN|In some cases<br>See notes|This port is required only if you're using an internet-based DNS server.<br>We recommend using a local DNS server. |
| TCP 5985 (WinRM)|Out/In|LAN|In some cases<br>See notes|This port is required to connect to the device via remote PowerShell over HTTP.  |
| TCP 5986 (WinRM)|Out/In|LAN|In some cases<br>See notes|This port is required to connect to the device via remote PowerShell over HTTPS.  |
| UDP 67 (DHCP)|Out|LAN|In some cases<br>See notes|This port is required only if you're using a local DHCP server.  |
| TCP 80 (HTTP)|Out/In|LAN|Yes|This port is the inbound port for local UI on the device for local management. <br>Accessing the local UI over HTTP will automatically redirect to HTTPS.  |
| TCP 443 (HTTPS)|Out/In|LAN|Yes|This port is the inbound port for local UI on the device for local management. |
| TCP 445 (SMB)|In|LAN|In some cases<br>See notes|This port is required only if you are connecting via SMB. |
| TCP 2049 (NFS)|In|LAN|In some cases<br>See notes|This port is required only if you are connecting via NFS. |
