---
title: Microsoft Azure Data Box system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 09/24/2018
ms.author: alkohli
---
# Azure Data Box system requirements

This article describes the important system requirements for your Microsoft Azure Data Box and for the clients connecting to the Data Box. We recommend that you review the information carefully before you deploy your Data Box, and then refer back to it as necessary during the deployment and subsequent operation.

The system requirements include:

* **Software requirements for hosts connecting to Data Box** - describes the supported platforms, browsers for the local web UI, SMB clients, and any additional requirements for hosts that can connect to the Data Box.
* **Networking requirements for the Data Box** - provides information about the networking requirements for the optimum operation of the Data Box.


## Software requirements

The software requirements include the information on the supported operating systems, supported browsers for the local web UI, and SMB clients.

### Supported operating systems for clients

Here is a list of the supported operating systems for the data copy operation via the clients connected to the Data Box device.

| **Operating system** | **Versions** | 
| --- | --- | 
| Windows Server |2008 R2 SP1 <br> 2012 <br> 2012 R2 <br> 2016 | 
| Windows |7, 8, 10 | 
|Linux    |         |

### Supported file systems for Linux clients

| **Protocols** | **Versions** | 
| --- | --- | 
| SMB |2.X and later |
| NFS | All versions up to and including 4.1|

### Supported storage accounts

Here is a list of the supported storage types for the Data Box device.

| **Storage account** | **Notes** |
| --- | --- |
| Classic | Standard |
| General purpose  |Standard; both V1 and V2 are supported. |
| Blob |Both hot and cool are supported. |


### Supported storage types

Here is a list of the supported storage types for the Data Box device.

| **File format** | **Notes** |
| --- | --- |
| Azure block blob | |
| Azure page blob  | The data should be 512 bytes aligned.|
| Azure Files | |


### Supported web browsers

Here is a list of web browsers supported for the local web UI.

| **Browser** | **Versions** | **Additional requirements/notes** |
| --- | --- | --- |
| Google Chrome |Latest version |Tested with Chrome|
| Microsoft Edge |Latest version | |
| FireFox | Latest version | Tested with FireFox|
| Internet Explorer |Latest version |If you cannot sign in, check if cookies and Javascript are enabled. To enable the UI access, add the device IP to **Privacy Actions** so that the device can access cookies. |


## Networking requirements

Your datacenter needs to have high-speed network. We strongly recommend that you have at least one 10 GbE connection. If a 10 GbE connection is not available, a 1 GbE data link can be used to copy data but the copy speeds are impacted.

## Next step

* [Deploy your Azure Data Box](data-box-deploy-ordered.md)

