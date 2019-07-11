---
title: Microsoft Azure Data Box system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 07/11/2019
ms.author: alkohli
---
# Azure Data Box system requirements

This article describes the important system requirements for your Microsoft Azure Data Box and for the clients connecting to the Data Box. We recommend you review the information carefully before you deploy your Data Box, and then refer back to it as necessary during the deployment and subsequent operation.

The system requirements include:

* **Software requirements for hosts connecting to Data Box** - describes the supported platforms, browsers for the local web UI, SMB clients, and any additional requirements for hosts that can connect to the Data Box.
* **Networking requirements for the Data Box** - provides information about the networking requirements for the optimum operation of the Data Box.


## Software requirements

The software requirements include the information on the supported operating systems, supported browsers for the local web UI, and SMB clients.

### Supported operating systems for clients

[!INCLUDE [data-box-supported-os-clients](../../includes/data-box-supported-os-clients.md)]

### Supported file systems for Linux clients

[!INCLUDE [data-box-supported-file-systems-clients](../../includes/data-box-supported-file-systems-clients.md)]

### Supported storage accounts

[!INCLUDE [data-box-supported-storage-accounts](../../includes/data-box-supported-storage-accounts.md)]

### Supported storage types

[!INCLUDE [data-box-supported-storage-types](../../includes/data-box-supported-storage-types.md)]

### Supported web browsers

[!INCLUDE [data-box-supported-web-browsers](../../includes/data-box-supported-web-browsers.md)]

## Networking requirements

Your datacenter needs to have high-speed network. We strongly recommend that you have at least one 10-GbE connection. If a 10-GbE connection is not available, a 1-GbE data link can be used to copy data but the copy speeds are impacted.

## Port requirements

The following table lists the ports that need to be opened in your firewall to allow for SMB or NFS traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Data Box device sends data externally, beyond the deployment: for example, outbound to the Internet.

| Port no.|	In or out |	Port scope|	Required|	Notes |   |
|--------|-----|-----|-----------|----------|-----------|
| TCP 80 (HTTP)|In|LAN|Yes|This is the intended port for HTTP traffic.  |
| TCP 8080 (HTTP-Proxy)|In|LAN|Yes|This is an alternative port for HTTP. |
| TCP 443 (HTTPS)|In|LAN|Yes|This is the intended port for HTTPS traffic.  |
| TCP 5020 (HTTPS)|In|LAN|In some cases<br>See notes|This port is required only if connecting to Data Box Blob Storage REST APIs. If not connecting to REST APIs, the port automatically redirects to the local web UI of the device.  |
| TCP 8443 (HTTPS-Alt)|In|LAN|Yes|This is an alternative port for HTTPS and is used when connecting to local web UI for device management. |
| TCP 445 (SMB)|Out/In|LAN|In some cases<br>See notes|This port is required only if you are connecting via SMB. |
| TCP 2049 (NFS)|Out/In|LAN|In some cases<br>See notes|This port is required only if you are connecting via NFS. |
| TCP 111 (NFS)|Out/In|LAN|In some cases<br>See notes|This port is used for rpcbind/port mapping and required only if you are connecting via NFS.  |


## Next steps

* [Deploy your Azure Data Box](data-box-deploy-ordered.md)
