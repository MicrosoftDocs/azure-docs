---
title: Install Update 3 on your StorSimple device | Microsoft Docs
description: Explains how to install StorSimple 8000 Series Update 3 on your StorSimple 8000 series device.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: c6c4634d-4f3a-4bc4-b307-a22bf18664e1
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 02/27/2017
ms.author: alkohli
ms.custom: H1Hack27Feb2017

---
# Install Update 3 on your StorSimple 8000 series device

## Overview

This tutorial explains how to install Update 3 on a StorSimple device running an earlier software version via the Azure classic portal and using the hotfix method. The hotfix method is used when a gateway is configured on a network interface other than DATA 0 of the StorSimple device and you are trying to update from a pre-Update 1 software version.

Update 3 includes device software, LSI driver and firmware, Storport and Spaceport updates. If updating from Update 2 or an earlier version, you will also be required to apply iSCSI, WMI, and in certain cases, disk firmware updates. The device software, WMI, iSCSI, LSI driver, Spaceport, and Storport fixes are non-disruptive updates and can be applied via the Azure classic portal. The disk firmware updates are disruptive updates and can only be applied via the Windows PowerShell interface of the device. 

> [!IMPORTANT]
> * A set of manual and automatic pre-checks are done prior to the install to determine the device health in terms of hardware state and network connectivity. These pre-checks are performed only if you apply the updates from the Azure classic portal.
> * We recommend that you install the software and driver updates via the Azure  classic portal. You should only go to the Windows PowerShell interface of the device (to install updates) if the pre-update gateway check fails in the portal. Depending upon the version you are updating from, the updates may take 1.5-2.5 hours to install. The maintenance mode updates must be installed via the Windows PowerShell interface of the device. As maintenance mode updates are disruptive updates, these will result in a down time for your device.
> * If running the optional StorSimple Snapshot Manager, ensure that you have upgraded your Snapshot Manager version to Update 2 prior to updating the device.
> 
> 

[!INCLUDE [storsimple-preparing-for-update](../../includes/storsimple-preparing-for-updates.md)]

## Install Update 3 via the Azure classic portal
Perform the following steps to update your device to [Update 3](storsimple-update3-release-notes.md).

> [!NOTE]
> If you are applying Update 2 or later (including Update 2.1), Microsoft will be able to pull additional diagnostic information from the device. As a result, when our operations team identifies devices that are having problems, we are better equipped to collect information from the device and diagnose issues. By accepting Update 2 or later, you allow us to provide this proactive support.
> 
> 

[!INCLUDE [storsimple-install-update2-via-portal](../../includes/storsimple-install-update2-via-portal.md)]

Verify that your device is running **StorSimple 8000 Series Update 3 (6.3.9600.17759)**. The **Last updated date** should also be modified. 
   - If you are updating from a version prior to Update 2, you will also see that the Maintenance mode updates are available (this message might continue to be displayed for up to 24 hours after you install the updates).
     Maintenance mode updates are disruptive updates that result in device downtime and can only be applied via the Windows PowerShell interface of your device. In some cases when you are running Update 1.2, your disk firmware might already be up-to-date, in which case you don't need to install any maintenance mode updates.
   - If you are updating from Update 2 or later, your device should now be up-to-date. You can skip the next step.

Download the maintenance mode updates by using the steps listed in [to download hotfixes](#to-download-hotfixes) to search for and download KB3121899, which installs disk firmware updates (the other updates should already be installed by now). Follow the steps listed in [install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes) to install the maintenance mode updates. 

## Install Update 3 as a hotfix
Use this procedure if you fail the gateway check when trying to install the updates through the Azure classic portal. The check fails as you have a gateway assigned to a non-DATA 0 network interface and your device is running a software version prior to Update 1.

The software versions that can be upgraded using the hotfix method are:

* Update 0.1, 0.2, 0.3
* Update 1, 1.1, 1.2
* Update 2, 2.1, 2.2 

> [!IMPORTANT]
> * If your device is running Release (GA) version, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) to assist you with the update.
> 
> 

The hotfix method involves the following three steps:

1. Download the hotfixes from the Microsoft Update Catalog.
2. Install and verify the regular mode hotfixes.
3. Install and verify the maintenance mode hotfix (only when updating from pre-Update 2 software).

#### Download updates for your device
**If your device is running Update 2.1 or 2.2**, you must download and install the following hotfixes in the prescribed order:

| Order | KB | Description | Update type | Install time |
| --- | --- | --- | --- | --- |
| 1. |KB3186843 |Software update &#42; |Regular <br></br>Non-disruptive |~ 45 mins |
| 2. |KB3186859 |LSI driver and firmware |Regular <br></br>Non-disruptive |~ 20 mins |
| 3. |KB3121261 |Storport and Spaceport fix </br> Windows Server 2012 R2 |Regular <br></br>Non-disruptive |~ 20 mins |

&#42;  *Note that the software update consists of two binary files: device software update prefaced with `all-hcsmdssoftwareupdate` and the Cis and Mds agent prefaced with `all-cismdsagentupdatebundle`. The device software update must be installed before the Cis and Mds agent. You must also restart the active controller via the `Restart-HcsController` cmdlet after you apply the Cis and Mds agent update (and before applying the remaining updates).* 

**If your device is running Update 0.1, 0.2, 0.3, 1.0, 1.1, 1.2, or 2.0**, you must download and install the following hotfixes in addition to the software, LSI driver and firmware updates (shown in the preceding table), in the prescribed order:

| Order | KB | Description | Update type | Install time |
| --- | --- | --- | --- | --- |
| 4. |KB3146621 |iSCSI package |Regular <br></br>Non-disruptive |~ 20 mins |
| 5. |KB3103616 |WMI package |Regular <br></br>Non-disruptive |~ 12 mins |

<br></br>

**If your device is running versions 0.2, 0.3, 1.0, 1.1, and 1.2**, you may also need to install disk firmware updates on top of all the updates shown in the preceding tables. You can verify whether you need the disk firmware updates by running the `Get-HcsFirmwareVersion` cmdlet. If you are running these firmware versions: `XMGG`, `XGEG`, `KZ50`, `F6C2`, `VR08`, then you do not need to install these updates.

| Order | KB | Description | Update type | Install time |
| --- | --- | --- | --- | --- |
| 6. |KB3121899 |Disk firmware |Maintenance <br></br>Disruptive |~ 30 mins |

<br></br>

> [!IMPORTANT]
> * This procedure needs to be performed only once to apply Update 3. You can use the Azure classic portal to apply subsequent updates.
> * If updating from Update 2.2, the total install time is close to 1.1 hours.
> * Before using this procedure to apply the update, make sure that both the device controllers are online and all the hardware components are healthy.
> 
> 

Perform the following steps to download and install the hotfixes.

[!INCLUDE [storsimple-install-update3-hotfix](../../includes/storsimple-install-update3-hotfix.md)]

[!INCLUDE [storsimple-install-troubleshooting](../../includes/storsimple-install-troubleshooting.md)]

## Next steps
Learn more about the [Update 3 release](storsimple-update3-release-notes.md).

