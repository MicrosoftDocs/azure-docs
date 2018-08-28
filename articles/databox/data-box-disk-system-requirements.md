---
title: Microsoft Azure Data Box Disk system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Disk
services: databox
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/28/2018
ms.author: alkohli
---
# Azure Data Box Disk system requirements (Preview)

This article describes the important system requirements for your Microsoft Azure Data Box Disk solution and for the clients connecting to the Data Box Disk. We recommend that you review the information carefully before you deploy your Data Box Disk, and then refer back to it as necessary during the deployment and subsequent operation.

> [!IMPORTANT]
> Data Box Disk is in Preview. Please review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 

The system requirements include the supported platforms for clients connecting to disks, supported storage accounts, and storage types.


## Supported operating systems for clients

Here is a list of the supported operating systems for the disk unlock and data copy operation via the clients connected to the Data Box Disk.

| **Operating system/platform** | **Versions** |
| --- | --- |
| Windows Server |2008 R2 SP1 <br> 2012 <br> 2012 R2 <br> 2016 |
| Windows |7, 8, 10 |
| Windows PowerShell |4.0 |
| .NET Framework |4.5.1 |
| Windows Management Framework |4.0|

> [!NOTE] 
> BitLocker needs to be enabled on the clients that run the disk unlock tool and are used to copy the data.


## Supported storage accounts

Here is a list of the supported storage types for the Data Box Disk.

| **Storage account** | **Notes** |
| --- | --- |
| Classic | Standard |
| General Purpose  |Standard; both V1 and V2 are supported. Both hot and cool tiers are supported. |


## Supported storage types

Here is a list of the supported storage types for the Data Box Disk.

| **File format** | **Notes** |
| --- | --- |
| Azure block blob | |
| Azure page blob  | |


## Next step

* [Deploy your Azure Data Box Disk](data-box-disk-deploy-ordered.md)

