---
title: Microsoft Azure Data Box Heavy system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Heavy
services: databox
author: alkohli

ms.service: databox
ms.subservice: heavy
ms.topic: article
ms.date: 07/03/2019
ms.author: alkohli
---
# Azure Data Box Heavy system requirements

This article describes the important system requirements for your Azure Data Box Heavy device and for the clients connecting to the device. We recommend you review the information carefully before you deploy your Data Box Heavy, and then refer back to it as necessary during the deployment and subsequent operation.

The system requirements include:

* **Software requirements for hosts connecting to Data Box Heavy** - describes the supported platforms, browsers for the local web UI, SMB clients, and any additional requirements for hosts that can connect to the Data Box.
* **Networking requirements for the Data Box Heavy** - provides information about the networking requirements for the optimum operation of the Data Box Heavy device.

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

Your datacenter needs to have high-speed network. For fastest copy speeds, two 40-GbE connections can be utilized in parallel (one per node). If you do not have 40-GbE available, we recommend that you have at least two 10-GbE connections (one per node).

### Port requirements

The following table lists the ports that need to be opened in your firewall to allow for SMB or NFS traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Data Box Heavy device sends data externally, beyond the deployment: for example, outbound to the Internet.

[!INCLUDE [data-box-port-requirements](../../includes/data-box-port-requirements.md)]

## Next steps

* [Deploy your Azure Data Box](data-box-deploy-ordered.md)
