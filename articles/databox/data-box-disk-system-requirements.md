---
title: Microsoft Azure Data Box Disk system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Disk
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: article
ms.date: 09/06/2018
ms.author: alkohli
---
# Azure Data Box Disk system requirements (Preview)

This article describes the important system requirements for your Microsoft Azure Data Box Disk solution and for the clients connecting to the Data Box Disk. We recommend that you review the information carefully before you deploy your Data Box Disk, and then refer back to it as necessary during the deployment and subsequent operation.

> [!IMPORTANT]
> Data Box Disk is in Preview. Please review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 

The system requirements include the supported platforms for clients connecting to disks, supported storage accounts, and storage types.


## Supported operating systems for clients

Here is a list of the supported operating systems for the disk unlock and data copy operation via the clients connected to the Data Box Disk.

| **Operating system** | **Tested versions** |
| --- | --- |
| Windows Server |2008 R2 SP1 <br> 2012 <br> 2012 R2 <br> 2016 |
| Windows |7, 8, 10 |
|Linux <br> <li> Ubuntu </li><li> Debian </li><li> Red Hat Enterprise Linux (RHEL) </li><li> CentOS| <br>14.04, 16.04, 18.04 <br> 8.11, 9 <br> 7.0 <br> 6.5, 6.9, 7.0, 7.5 |  

## Other required software for Windows clients

For Windows client, following should also be installed.

| **Software**| **Version** |
| --- | --- |
| Windows PowerShell |5.0 |
| .NET Framework |4.5.1 |
| Windows Management Framework |5.0|
| BitLocker| - |

## Other required software for Linux clients

For Linux client, the Data Box Disk toolset installs the following required software:

- dislocker
- OpenSSL

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

