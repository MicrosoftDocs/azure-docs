<properties
   pageTitle="Install Update 2.1 on your StorSimple device | Microsoft Azure"
   description="Explains how to install StorSimple 8000 Series Update 2.1 on your StorSimple 8000 series device."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="05/11/2016"
   ms.author="alkohli" />

# Install Update 2.1 on your StorSimple device

## Overview

This tutorial explains how to install Update 2.1 on a StorSimple device running an earlier software version via the Azure classic portal. The tutorial also covers the steps required for the update when a gateway is configured on a network interface other than DATA 0 of the StorSimple device and you are trying to update from a pre-Update 1 software version.

Update 2.1 includes device software updates and  LSI driver updates. The device software and LSI updates are non-disruptive updates and can be applied via the Azure classic portal. 

> [AZURE.IMPORTANT]

> -  You may not see Update 2.1 immediately because we do a phased rollout of the updates. Scan for updates in a few days again as this Update will become available soon.
> - A set of manual and automatic pre-checks are done prior to the install to determine the device health in terms of hardware state and network connectivity. These pre-checks are performed only if you apply the updates from the Azure classic portal.
> - We recommend that you install the software and driver updates via the Azure  classic portal. You should only go to the Windows PowerShell interface of the device (to install updates) if the pre-update gateway check fails in the portal. The updates may take X-X hours to install.
> - If running the optional StorSimple Snapshot Manager, ensure that you have upgraded your Snapshot Manager version to Update 2.1 prior to updating the device.

[AZURE.INCLUDE [storsimple-preparing-for-update](../../includes/storsimple-preparing-for-updates.md)]

## Install Update 2.1 via the Azure classic portal

Perform the following steps to update your device to [Update 2.1](storsimple-update2-release-notes.md).


> [AZURE.NOTE]
Update 2.1 enables Microsoft to pull additional diagnostic information from the device. As a result, when our operations team identifies devices that are having problems, we are better equipped to collect information from the device and diagnose issues. By accepting Update 2.1, you allow us to provide this proactive support.

[AZURE.INCLUDE [storsimple-install-update2-via-portal](../../includes/storsimple-install-update2-via-portal.md)]

12. Verify that your device is running **StorSimple 8000 Series Update 2.1 (6.3.9600.17698)**. The **Last updated date** should also be modified. 

  

## Install Update 2.1 as a hotfix

Use this procedure if you fail the gateway check when trying to install the updates through the Azure classic portal. The check fails as you have a gateway assigned to a non-DATA 0 network interface and your device is running a software version prior to Update 1.

The software versions that can be upgraded using the hotfix method are Update 0.1, Update 0.2, and Update 0.3, Update 1, Update 1.1, and Update 1.2. The hotfix method involves the following three steps:

- Download the hotfixes from the Microsoft Update Catalog.
- Install and verify the regular mode hotfixes.

To install Update 2.1 as a hotfix, you must download and install the following hotfixes:

| Order  | KB        | Description                    | Update type  |
|--------|-----------|-------------------------|------------- |
| 1      | KB3121901 | Software update         |  Regular     |
| 2      | KB3121900 | LSI driver              |  Regular     |
| 3      | KB3121261 | Storport and Spaceport fix </br> Windows Server 2012 R2 |  Regular     |
| 4      | KB3103616 | WMI package |  Regular     |
| 5      | KB3146621 | iSCSI package | Regular |


> [AZURE.IMPORTANT]
>
> - If your device is running Release (GA) version, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) to assist you with the update.
> - This procedure needs to be performed only once to apply Update 2.1. You can use the Azure classic portal to apply subsequent updates.
> - Each hotfix installation can take about 20 minutes to complete. Total install time is close to 2 hours.
> - Before using this procedure to apply the update, make sure that both device controllers are online and all the hardware components are healthy.

Perform the following steps to apply this update as a hotfix.

[AZURE.INCLUDE [storsimple-install-update2-hotfix](../../includes/storsimple-install-update2-hotfix.md)]


## Next steps

Learn more about the [Update 2.1 release](storsimple-update21-release-notes.md).
