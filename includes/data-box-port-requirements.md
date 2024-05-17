---
author: stevenmatthew
ms.service: databox
ms.subservice: pod   
ms.topic: include
ms.date: 09/06/2020
ms.author: shaas
---

| Port no.|	In or out |	Port scope|	Required| Notes |
|--------|-----|-----|-----------|----------|
| TCP 80 (HTTP)|In|LAN|Yes|This port is used to connect to Data Box Blob storage REST APIs over HTTP. If not connecting to REST APIs, this automatically redirects to local web UI over 8443. |
| TCP 443 (HTTPS)|In|LAN|Yes|This port is used to connect to Data Box Blob storage REST APIs over HTTPS. If not connecting to REST APIs, this automatically redirects to local web UI over 8443. |
| TCP 8443 (HTTPS-Alt)|In|LAN|Yes|This is an alternative port for HTTPS and is used when connecting to local web UI for device management. |
| TCP 445 (SMB)|Out/In|LAN|In some cases<br>See notes|This port is required only if you're connecting via SMB. |
| TCP 2049 (NFS)|Out/In|LAN|In some cases<br>See notes|This port is required only if you're connecting via NFS. |
| TCP 111 (NFS)|Out/In|LAN|In some cases<br>See notes|This port is used for rpcbind/port mapping and required only if you're connecting via NFS.  |

