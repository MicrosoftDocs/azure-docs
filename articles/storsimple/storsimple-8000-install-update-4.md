---
title: Install Update 4 on StorSimple 8000 series device | Microsoft Docs
description: Explains how to install StorSimple 8000 Series Update 4 on your StorSimple 8000 series device.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: how-to
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 08/02/2017
ms.author: alkohli

---
# Install Update 4 on your StorSimple device

## Overview

This tutorial explains how to install Update 4 on a StorSimple device running an earlier software version via the Azure portal and using the hotfix method. The hotfix method is used when a gateway is configured on a network interface other than DATA 0 of the StorSimple device and you are trying to update from a pre-Update 1 software version.

Update 4 includes device software, USM firmware, LSI driver and firmware, Storport and Spaceport, OS security updates, and a host of other OS updates.  The device software, USM firmware, Spaceport, Storport, and other OS updates are non-disruptive updates. The non-disruptive or regular updates can be applied via the Azure portal or via the hotfix method. The disk firmware updates are disruptive updates and can only be applied via the hotfix method using the Windows PowerShell interface of the device.

> [!IMPORTANT]
> * A set of manual and automatic pre-checks are done prior to the install to determine the device health in terms of hardware state and network connectivity. These pre-checks are performed only if you apply the updates from the Azure  portal.
> * We recommend that you install the software and other regular updates via the Azure portal. You should only go to the Windows PowerShell interface of the device (to install updates) if the pre-update gateway check fails in the portal. Depending upon the version you are updating from, the updates may take 4 hours (or greater) to install. The maintenance mode updates must also be installed via the Windows PowerShell interface of the device. As maintenance mode updates are disruptive updates, these will result in a down time for your device.
> * If running the optional StorSimple Snapshot Manager, ensure that you have upgraded your Snapshot Manager version to Update 4 prior to updating the device.


[!INCLUDE [storsimple-preparing-for-update](../../includes/storsimple-preparing-for-updates.md)]

## Install Update 4 via the Azure portal
Perform the following steps to update your device to [Update 4](storsimple-update4-release-notes.md).

> [!NOTE]
> Microsoft pulls additional diagnostic information from the device. As a result, when our operations team identifies devices that are having problems, we are better equipped to collect information from the device and diagnose issues. 

[!INCLUDE [storsimple-8000-install-update4-via-portal](../../includes/storsimple-8000-install-update4-via-portal.md)]

Verify that your device is running **StorSimple 8000 Series Update 4 (6.3.9600.17820)**. The **Last updated date** should also be modified.

* You will now see that the Maintenance mode updates are available (this message might continue to be displayed for up to 24 hours after you install the updates). Maintenance mode updates are disruptive updates that result in device downtime and can only be applied via the Windows PowerShell interface of your device.

* Download the maintenance mode updates by using the steps listed in [to download hotfixes](#to-download-hotfixes) to search for and download KB4011837, which installs disk firmware updates (the other updates should already be installed by now). Follow the steps listed in [install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes) to install the maintenance mode updates.

## Install Update 4 as a hotfix
The recommended method to install Update 4 is via the Azure portal.

Use this procedure if you fail the gateway check when trying to install the updates through the Azure portal. The check fails as you have a gateway assigned to a non-DATA 0 network interface and your device is running a software version prior to Update 1.

The software versions that can be upgraded using the hotfix method are:

* Update 0.1, 0.2, 0.3
* Update 1, 1.1, 1.2
* Update 2, 2.1, 2.2
* Update 3, 3.1


The hotfix method involves the following three steps:

1. Download the hotfixes from the Microsoft Update Catalog.
2. Install and verify the regular mode hotfixes.
3. Install and verify the maintenance mode hotfix.

#### Download updates for your device

You must download and install the following hotfixes in the prescribed order and the suggested folders:

| Order | KB | Description | Update type | Install time |Install in folder|
| --- | --- | --- | --- | --- | --- |
| 1. |KB4011839 |Software update |Regular <br></br>Non-disruptive |~ 25 mins |FirstOrderUpdate|
| 2A. |KB4011841 <br> KB4011842 |LSI driver and firmware updates <br> USM firmware update (version 3.38) |Regular <br></br>Non-disruptive |~ 3 hrs <br> (includes 2A. + 2B. + 2C.)|SecondOrderUpdate|
| 2B. |KB3139398, KB3108381 <br> KB3205400, KB3142030 <br> KB3197873, KB3197873 <br> KB3192392, KB3153704 <br> KB3174644, KB3139914  |OS security updates package <br> Download Windows Server 2012 R2 |Regular <br></br>Non-disruptive |- |SecondOrderUpdate|
| 2C. |KB3210083, KB3103616 <br> KB3146621, KB3121261 <br> KB3123538 |OS updates package <br> Download Windows Server 2012 R2 |Regular <br></br>Non-disruptive |- |SecondOrderUpdate|

You may also need to install disk firmware updates on top of all the updates shown in the preceding tables. You can verify whether you need the disk firmware updates by running the `Get-HcsFirmwareVersion` cmdlet. If you are running these firmware versions: `XMGJ`, `XGEG`, `KZ50`, `F6C2`, `VR08`, `N002`, `0106`, then you do not need to install these updates.

| Order | KB | Description | Update type | Install time | Install in folder|
| --- | --- | --- | --- | --- | --- |
| 3. |KB3121899 |Disk firmware |Maintenance <br></br>Disruptive |~ 30 mins | ThirdOrderUpdate |

<br></br>

> [!IMPORTANT]
> * This procedure needs to be performed only once to apply Update 4. You can use the Azure portal to apply subsequent updates.
> * If updating from Update 3 or 3.1, the total install time is close to 4 hours.
> * Before using this procedure to apply the update, make sure that both the device controllers are online and all the hardware components are healthy.

Perform the following steps to download and install the hotfixes.

[!INCLUDE [storsimple-install-update4-hotfix](../../includes/storsimple-install-update4-hotfix.md)]

[!INCLUDE [storsimple-install-troubleshooting](../../includes/storsimple-install-troubleshooting.md)]

## Next steps
Learn more about the [Update 4 release](storsimple-update4-release-notes.md).

