---
title: Microsoft Azure Data Box system requirements| Microsoft Docs
description: Learn about important system requirements for your Azure Data Box and for clients that connect to the Data Box. 
services: databox
author: stevenmatthew

ms.service: azure-databox
ms.topic: conceptual
ms.date: 10/21/2022
ms.author: shaas
---

# Azure Data Box system requirements 

This article describes important system requirements for your Microsoft Azure Data Box and for clients that connect to the Data Box. We recommend you review the information carefully before you deploy your Data Box and then refer to it when you need to during deployment and operation.

The system requirements include:

* **Software requirements** for hosts that connect to Data Box.<br>
They describe supported operating systems, file transfer protocols, storage accounts, storage types, and browsers for the local web UI.
* **Networking requirements** for the Data Box device.<br>
They describe network connections and ports used for optimal Data Box device operation.


## Software requirements

The software requirements include supported operating systems, file transfer protocols, storage accounts, storage types, and browsers for the local web UI.

### Supported operating systems for clients

[!INCLUDE [data-box-supported-os-clients](../../includes/data-box-supported-os-clients.md)]

### Supported file transfer protocols for clients

[!INCLUDE [data-box-supported-file-systems-clients](../../includes/data-box-supported-file-systems-clients.md)]

> [!IMPORTANT]
> Connection to Data Box shares is not supported via REST for export orders.
>
> You can transport your data to Data Box from on-premises Network File System (NFS) clients by using NFSv4. However, when copying data from Data Box to Azure, Data Box supports REST-based transport only. Azure file shares with NFSv4.1 doesn't support REST for data access or transfer.

### Supported storage accounts

> [!Note]
> Classic storage accounts will not be supported starting **August 1, 2023**.

[!INCLUDE [data-box-supported-storage-accounts](../../includes/data-box-supported-storage-accounts.md)]

### Supported storage types

[!INCLUDE [data-box-supported-storage-types](../../includes/data-box-supported-storage-types.md)]

### Supported web browsers

[!INCLUDE [data-box-supported-web-browsers](../../includes/data-box-supported-web-browsers.md)]

## Networking requirements

Your datacenter needs to have high-speed network. We strongly recommend you have at least one 10-GbE connection. If a 10-GbE connection isn't available, you can use a 1-GbE data link to copy data, but the copy speeds are affected.

### Port requirements

The following table lists the ports that need to be opened in your firewall to allow for Server Message Block (SMB) or  Network File System (NFS) traffic. In this table, *In* (*inbound*) refers to the direction from which incoming client requests access to your device. *Out* (or *outbound*) refers to the direction in which your Data Box device sends data externally, beyond the deployment. For example, data might be outbound to the Internet.

[!INCLUDE [data-box-port-requirements](../../includes/data-box-port-requirements.md)]


## Next steps

* [Deploy your Azure Data Box](data-box-deploy-ordered.md)

