---
title: Operating system backup and restore of SAP HANA on Azure (Large Instances) type II SKUs| Microsoft Docs
description: Perform Operatign system backup and restore for SAP HANA on Azure (Large Instances) Type II SKUs
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: timlt
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/08/2017
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# OS backup and restore for Type II SKUs

This document describes the steps to perform an operating system backup and restore for the **Type II  SKUs** of the HANA Large Instances. 

>[!NOTE]
>You need to install the ReaR software for the OS backup scripts to work. You can download the ReaR software from http://relax-and-recover.org/download/  

After the provisioning is complete by the Microsoft Service Management team, by default, the server is configured with two backups schedule to back up the full operating system. You can check the schedule of the backup job by using the following command.
```
crontab –l
```
You can change the backup schedule any time using the following command. How
```
crontab -e
```
You can restore an individual files from the backup. To restore, use the following command. After the restore, the file is recovered in the current working directory.
```
tar  -xvf  <backup file>  <file to restore> 
```
The following command shows the restore of a file /etc/fstabfrom the backup file backup.tar.gz
```
tar  -xvf  /osbackups/hostname/backup.tar.gz  etc/fstab 
```
>[!NOTE] You need to copy the file to desired location after it is restored from the backup.
