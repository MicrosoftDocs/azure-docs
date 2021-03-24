---
title: Microsoft Azure Data Box system requirements| Microsoft Docs
description: Learn about important system requirements for your Azure Data Box and for clients that connect to the Data Box.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 03/24/2021
ms.author: alkohli
---
# Azure Data Box system requirements

This article describes important system requirements for your Microsoft Azure Data Box and for clients that connect to the Data Box. We recommend you review the information carefully before you deploy your Data Box and then refer to it when you need to during deployment and operation.

The system requirements include:

* **Software requirements:** For hosts that connect to the Data Box, describes supported operating systems, file transfer protocols, storage accounts, storage types, and browsers for the local web UI.
* **Networking requirements:** For the Data Box, describes requirements for network connections and ports for best operation of the Data Box.


## Software requirements

The software requirements include supported operating systems, file transfer protocols, storage accounts, storage types, and browsers for the local web UI.

### Supported operating systems for clients

[!INCLUDE [data-box-supported-os-clients](../../includes/data-box-supported-os-clients.md)]


### Supported file transfer protocols for clients

[!INCLUDE [data-box-supported-file-systems-clients](../../includes/data-box-supported-file-systems-clients.md)]

> [!IMPORTANT] 
> * Connection to Data Box shares is not supported via REST for export orders.
> * For NFS shares, copying data into Data Box from an Advanced Interactive Executive (AIX) host using the IBM Database 2 (DB2) Export tool is not supported.

### Supported storage accounts

[!INCLUDE [data-box-supported-storage-accounts](../../includes/data-box-supported-storage-accounts.md)]

### Supported storage types

[!INCLUDE [data-box-supported-storage-types](../../includes/data-box-supported-storage-types.md)]

### Supported web browsers

[!INCLUDE [data-box-supported-web-browsers](../../includes/data-box-supported-web-browsers.md)]

## Networking requirements

Your datacenter needs to have high-speed network. We strongly recommend you have at least one 10-GbE connection. If a 10-GbE connection isn't available, you can use a 1-GbE data link to copy data, but the copy speeds are affected.

### Port requirements

The following table lists the ports that need to be opened in your firewall to allow for SMB or NFS traffic. In this table, *In* (*inbound*) refers to the direction from which incoming client requests access to your device. *Out* (or *outbound*) refers to the direction in which your Data Box device sends data externally, beyond the deployment. For example, data might be outbound to the Internet.

[!INCLUDE [data-box-port-requirements](../../includes/data-box-port-requirements.md)]


## Next steps

* [Deploy your Azure Data Box](data-box-deploy-ordered.md)
