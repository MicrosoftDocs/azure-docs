---
title: Install Update 5 StorSimple 8000 series device classic portal | Microsoft Docs
description: Explains how to install StorSimple 8000 Series Update 5 on your StorSimple 8000 series device in the classic portal.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 08/25/2017
ms.author: alkohli

---
# Install Update 5 on your StorSimple device

## Overview

This tutorial explains how to install Update 5 on a StorSimple device running an earlier software version via the Azure classic portal and using the hotfix method. The hotfix method is used when a gateway is configured on a network interface other than DATA 0 of the StorSimple device and you are trying to update from a pre-Update 1 software version.

Update 5 includes device software, Storport and Spaceport, OS security updates and OS updates, and disk firmware updates.  The device software, Spaceport, Storport, security, and other OS updates are non-disruptive updates. The non-disruptive or regular updates can be applied via the Azure classic portal or via the hotfix method. The disk firmware updates are disruptive updates and are applied when the device is in maintenance mode via the hotfix method using the Windows PowerShell interface of the device.

> [!IMPORTANT]
> * A set of manual and automatic pre-checks are done prior to the install to determine the device health in terms of hardware state and network connectivity. These pre-checks are performed only if you apply the updates from the Azure  portal.
> * We recommend that you install the software and other regular updates via the Azure classic portal. You should only go to the Windows PowerShell interface of the device (to install updates) if the pre-update gateway check fails in the portal. Depending upon the version you are updating from, the updates may take 4 hours (or greater) to install. The maintenance mode updates must be installed via the Windows PowerShell interface of the device. As maintenance mode updates are disruptive updates, these result in a down time for your device.
> * If running the optional StorSimple Snapshot Manager, ensure that you have upgraded your Snapshot Manager version to Update 5 prior to updating the device.


[!INCLUDE [storsimple-preparing-for-update](../../includes/storsimple-preparing-for-updates.md)]

## Install Update 5 via the Azure classic portal
Perform the following steps to update your device to [Update 5](storsimple-update5-release-notes.md).

> [!NOTE]
> Microsoft pulls additional diagnostic information from the device. As a result, when our operations team identifies devices that are having problems, we are better equipped to collect information from the device and diagnose issues.

[!INCLUDE [storsimple-install-update2-via-portal](../../includes/storsimple-install-update2-via-portal.md)]

Verify that your device is running **StorSimple 8000 Series Update 5 (6.3.9600.17845)**. The **Last updated date** should be modified.

* You will now see that the Maintenance mode updates are available (this message might continue to be displayed for up to 24 hours after you install the updates). Maintenance mode updates are disruptive updates that result in device downtime and can only be applied via the Windows PowerShell interface of your device.

* Download the maintenance mode updates by using the steps listed in [to download hotfixes](#to-download-hotfixes) to search for and download KB4011837, which installs disk firmware updates (the other updates should already be installed by now). Follow the steps listed in [install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes) to install the maintenance mode updates.

## Install Update 5 as a hotfix


The software versions that can be upgraded using the hotfix method are:

* Update 0.1, 0.2, 0.3
* Update 1, 1.1, 1.2
* Update 2, 2.1, 2.2
* Update 3, 3.1
* Update 4

> [!NOTE]
> The recommended method to install Update 5 is via the Azure classic portal. Use this procedure if you fail the gateway check when trying to install the updates through the Azure classic portal. The check fails when you have a gateway assigned to a non-DATA 0 network interface and your device is running a software version earlier than Update 1.

The hotfix method involves the following three steps:

1. Download the hotfixes from the Microsoft Update Catalog.
2. Install and verify the regular mode hotfixes.
3. Install and verify the maintenance mode hotfix.

#### Download updates for your device

You must download and install the following hotfixes in the prescribed order and the suggested folders:

| Order | KB | Description | Update type | Install time |Install in folder|
| --- | --- | --- | --- | --- | --- |
| 1. |KB4037264 |Software update<br> Download both _HcsSfotwareUpdate.exe_ and _CisMSDAgent.exe_ |Regular <br></br>Non-disruptive |~ 25 mins |FirstOrderUpdate|

If updating from a device running Update 4, you only need to install the OS cumulative updates as second order updates.

| Order | KB | Description | Update type | Install time |Install in folder|
| --- | --- | --- | --- | --- | --- |
| 2A. |KB4025336 |OS cumulative updates package <br> Download Windows Server 2012 R2 version |Regular <br></br>Non-disruptive |- |SecondOrderUpdate|

If installing from a device running Update 3 or earlier, install the following in addition to the cumulative updates.

| Order | KB | Description | Update type | Install time |Install in folder|
| --- | --- | --- | --- | --- | --- |
| 2B. |KB4011841 <br> KB4011842 |LSI driver and firmware updates <br> USM firmware update (version 3.38) |Regular <br></br>Non-disruptive |~ 3 hrs <br> (includes 2A. + 2B. + 2C.)|SecondOrderUpdate|
| 2C. |KB3139398 <br> KB3142030 <br> KB3108381 <br> KB3153704 <br> KB3174644 <br> KB3139914   |OS security updates package <br> Download Windows Server 2012 R2 version |Regular <br></br>Non-disruptive |- |SecondOrderUpdate|
| 2D. |KB3146621 <br> KB3103616 <br> KB3121261 <br> KB3123538 |OS updates package <br> Download Windows Server 2012 R2 version |Regular <br></br>Non-disruptive |- |SecondOrderUpdate|


You may also need to install disk firmware updates on top of all the updates shown in the preceding tables. You can verify whether you need the disk firmware updates by running the `Get-HcsFirmwareVersion` cmdlet. If you are running these firmware versions: `XMGJ`, `XGEG`, `KZ50`, `F6C2`, `VR08`, `N003`, `0107`, then you do not need to install these updates.

| Order | KB | Description | Update type | Install time | Install in folder|
| --- | --- | --- | --- | --- | --- |
| 3. |KB4037263 |Disk firmware |Maintenance <br></br>Disruptive |~ 30 mins | ThirdOrderUpdate |

<br></br>

> [!IMPORTANT]
> * If updating from Update 4, the total install time is close to 4 hours.
> * Before using this procedure to apply the update, make sure that both the device controllers are online and all the hardware components are healthy.

Perform the following steps to download and install the hotfixes.

[!INCLUDE [storsimple-install-update5-hotfix](../../includes/storsimple-install-update5-hotfix.md)]

[!INCLUDE [storsimple-install-troubleshooting](../../includes/storsimple-install-troubleshooting.md)]

## Next steps
Learn more about the [Update 5 release](storsimple-update5-release-notes.md).

