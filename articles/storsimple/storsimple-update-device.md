---
title: Update your StorSimple device | Microsoft Docs
description: Explains how to use the StorSimple update feature to install regular and maintenance mode updates and hotfixes.
services: storsimple
documentationcenter: NA
author: twooley
manager: carmonm
editor: ''

ms.assetid: 786059f5-2a38-4105-941d-0860ce4ac515
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 01/23/2018
ms.author: twooley

---
# Update your StorSimple 8000 Series device
> [!NOTE]
> The classic portal for StorSimple is deprecated. Your StorSimple Device Managers will automatically move to the new Azure portal as per the deprecation schedule. You will receive an email and a portal notification for this move. This document will also be retired soon. For any questions regarding the move, see [FAQ: Move to Azure portal](storsimple-8000-move-azure-portal-faq.md).

## Overview
The StorSimple updates features allow you to easily keep your StorSimple device up-to-date. Depending on the update type, you can apply updates to the device via the Azure classic portal or via the Windows PowerShell interface. This tutorial describes the update types and how to install each of them.

You can apply two types of device updates: 

* Regular (or Normal mode) updates
* Maintenance mode updates

You can install regular updates via the Azure classic portal or Windows PowerShell; however, you must use Windows PowerShell to install Maintenance mode updates. 

Each update type is described separately, below.

### Regular updates
Regular updates are non-disruptive updates that can be installed when the device is in Normal mode. These updates are applied through the Microsoft Update website to each device controller. 

> [!IMPORTANT]
> A controller failover may occur during the update process. However, this will not affect system availability or operation.
> 
> 

* For details on how to install regular updates via the Azure classic portal, see [Install regular updates via the Azure classic portal](#install-regular-updates-via-the-azure-classic-portal).
* You can also install regular updates via Windows PowerShell for StorSimple. For details, see [Install regular updates via Windows PowerShell for StorSimple](#install-regular-updates-via-windows-powershell-for-storsimple).

### Maintenance mode updates
Maintenance Mode updates are disruptive updates such as disk firmware upgrades. These updates require the device to be put into Maintenance mode. For details, see [Step 2: Enter Maintenance mode](#step2). You cannot use the Azure classic portal to install Maintenance mode updates. Instead, you must use Windows PowerShell for StorSimple. 

For details on how to install Maintenance mode updates, see [Install Maintenance mode updates via Windows PowerShell for StorSimple](#install-maintenance-mode-updates-via-windows-powershell-for-storsimple).

> [!IMPORTANT]
> Maintenance mode updates must be applied separately to each controller. 
> 
> 

## Install regular updates via the Azure classic portal
You can use the Azure classic portal to apply updates to your StorSimple device.

[!INCLUDE [storsimple-install-updates-manually](../../includes/storsimple-install-updates-manually.md)]

## Install regular updates via Windows PowerShell for StorSimple
Alternatively, you can use Windows PowerShell for StorSimple to apply regular (Normal mode) updates.

> [!IMPORTANT]
> Although you can install regular updates using Windows PowerShell for StorSimple, we strongly recommend that you install regular updates through the Azure classic portal. Beginning with Update 1, pre-checks will be performed prior to installing updates from the portal. These pre-checks will preempt failures and ensure a smoother experience. 
> 
> 

[!INCLUDE [storsimple-install-regular-updates-powershell](../../includes/storsimple-install-regular-updates-powershell.md)]

## Install Maintenance mode updates via Windows PowerShell for StorSimple
You use Windows PowerShell for StorSimple to apply Maintenance mode updates to your StorSimple device. All I/O requests are paused in this mode. Services such as non-volatile random access memory (NVRAM) or the clustering service are also stopped. Both controllers are rebooted when you enter or exit this mode. When you exit this mode, all the services will resume and should be healthy. (This may take a few minutes.)

If you need to apply Maintenance mode updates, you will receive an alert through the Azure classic portal that you have updates that must be installed. This alert will include instructions for using Windows PowerShell for StorSimple to install the updates. After you update your device, use the same procedure to change the device to Regular mode. For step-by-step instructions, see [Step 4: Exit Maintenance mode](#step4).

> [!IMPORTANT]
> * Before entering Maintenance mode, verify that both device controllers are healthy by checking the **Hardware Status** on the **Maintenance** page in the Azure classic portal. If the controller is not healthy, contact Microsoft Support for the next steps. For more information, go to Contact Microsoft Support. 
> * When you are in Maintenance mode, you need to apply the update first on one controller and then on the other controller.
> 
> 

### Step 1: Connect to the serial console <a name="step1"></a>
First, use an application such as PuTTY to access the serial console. The following procedure explains how to use PuTTY to connect to the serial console.

[!INCLUDE [storsimple-use-putty](../../includes/storsimple-use-putty.md)]

### Step 2: Enter Maintenance mode <a name="step2"></a>
After you connect to the console, determine whether there are updates to install, and enter Maintenance mode to install them.

[!INCLUDE [storsimple-enter-maintenance-mode](../../includes/storsimple-enter-maintenance-mode.md)]

### Step 3: Install your updates <a name="step3"></a>
Next, install your updates.

[!INCLUDE [storsimple-install-maintenance-mode-updates](../../includes/storsimple-install-maintenance-mode-updates.md)]

### Step 4: Exit Maintenance mode <a name="step4"></a>
Finally, exit Maintenance mode.

[!INCLUDE [storsimple-exit-maintenance-mode](../../includes/storsimple-exit-maintenance-mode.md)]

## Install hotfixes via Windows PowerShell for StorSimple
Unlike updates for Microsoft Azure StorSimple, hotfixes are installed from a shared folder. As with updates, there are two types of hotfixes: 

* Regular hotfixes 
* Maintenance mode hotfixes  

The following procedures explain how to use Windows PowerShell for StorSimple to install regular and Maintenance mode hotfixes.

[!INCLUDE [storsimple-install-regular-hotfixes](../../includes/storsimple-install-regular-hotfixes.md)]

[!INCLUDE [storsimple-install-maintenance-mode-hotfixes](../../includes/storsimple-install-maintenance-mode-hotfixes.md)]

## What happens to updates if you perform a factory reset of the device?
If a device is reset to factory settings, then all the updates are lost. After the factory-reset device is registered and configured, you will need to manually install updates through the Azure classic portal and/or Windows PowerShell for StorSimple. For more information about factory reset, see [Reset the device to factory default settings](storsimple-8000-manage-device-controller.md#reset-the-device-to-factory-default-settings).

## Next steps
* Learn more about [using Windows PowerShell for StorSimple to administer your StorSimple device](storsimple-windows-powershell-administration.md).
* Learn more about [using the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).

