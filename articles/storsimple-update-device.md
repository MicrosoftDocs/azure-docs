<properties
   pageTitle="Update your StorSimple device"
   description="Explains how to use the StorSimple update feature to install regular and maintenance mode updates and hotfixes."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="04/27/2015"
   ms.author="v-sharos" />

# Update your StorSimple device

## Overview

The StorSimple updates features allow you to easily keep your StorSimple device up-to-date. Depending on the update type, you can apply updates to the device via the Microsoft Azure Management Portal or via the Windows PowerShell interface. This tutorial describes the update types and how to install each of them.

You can apply two types of device updates: 

- Regular (or Normal mode) updates
- Maintenance mode updates

You can install regular updates via the Management Portal or Windows PowerShell; however, you must use Windows PowerShell to install Maintenance mode updates. 

Each update type is described separately, below.

### Regular updates

Regular updates are non-disruptive updates that can be installed when the device is in Normal mode. These updates are applied through the Microsoft Update website to each device controller. 

> [AZURE.IMPORTANT] A controller failover may occur during the update process. However, this will not affect system availability or operation.

- For details on how to install regular updates via the Management Portal, see [Install regular updates via the Management Portal](#install-regular-updates-via-the-management-portal).

- You can also install regular updates via Windows PowerShell for StorSimple. For details, see [Install regular updates via Windows PowerShell for StorSimple](#install-regular-updates-via-windows-powershell-for-storsimple)

### Maintenance mode updates

Maintenance Mode updates are disruptive updates such as disk firmware upgrades or USM firmware upgrades. These updates require the device to be put into Maintenance mode. For details, see [Enter Maintenance mode](#enter-maintenance-mode). You cannot use the Management Portal to install Maintenance mode updates. Instead, you must use Windows PowerShell for StorSimple. 

For details on how to install Maintenance mode updates, see [Install Maintenance mode updates via Windows PowerShell for StorSimple](#install-maintenance-mode-updates-via-windows-powershell-for-storsimple).

> [AZURE.IMPORTANT] Maintenance mode updates must be applied separately to each controller. 

## Install regular updates via the Management Portal

You can use the Management Portal to apply updates to your StorSimple device.

[AZURE.INCLUDE [storsimple-install-updates-manually](../includes/storsimple-install-updates-manually.md)]

## Install regular updates via Windows PowerShell for StorSimple

Alternatively, you can use Windows PowerShell for StorSimple to apply regular (Normal mode) updates.

[AZURE.INCLUDE [storsimple-install-regular-updates-powershell](../includes/storsimple-install-regular-updates-powershell.md)]

## Install Maintenance mode updates via Windows PowerShell for StorSimple

You use Windows PowerShell for StorSimple to apply Maintenance mode updates to your StorSimple device. All I/O requests are paused in this mode. Services such as non-volatile random access memory (NVRAM) or the clustering service are also stopped. Both controllers are rebooted when you enter or exit this mode. When you exit this mode, all the services will resume and should be healthy. (This may take a few minutes.)

If you need to apply Maintenance mode updates, you will receive an alert through the Management Portal that you have updates that must be installed. This alert will include instructions for using Windows PowerShell for StorSimple to install the updates. After you update your device, use the same procedure to change the device to Regular mode. For step-by-step instructions, see [Exit Maintenance mode](#exit-maintenance-mode).

> [AZURE.IMPORTANT] 
> 
> - Before entering Maintenance mode, verify that both device controllers are healthy by checking the **Hardware Status** on the **Maintenance** page in the Management Portal. If the controller is not healthy, contact Microsoft Support for the next steps. For more information, go to Contact Microsoft Support. 
> - When you are in Maintenance mode, you need to apply the update first on one controller and then on the other controller.

### Connect to the serial console

First, use an application such as PuTTY to access the serial console. The following procedure explains how to use PuTTY to connect to the serial console.

[AZURE.INCLUDE [storsimple-use-putty](../includes/storsimple-use-putty.md)]

### Enter Maintenance mode

After you connect to the console, determine whether there are updates to install, and enter Maintenance mode to install them.

[AZURE.INCLUDE [storsimple-enter-maintenance-mode](../includes/storsimple-enter-maintenance-mode.md)]

### Install your updates

Next, install your updates.

[AZURE.INCLUDE [storsimple-install-maintenance-mode-updates](../includes/storsimple-install-maintenance-mode-updates.md)]

### Exit Maintenance mode

Finally, exit Maintenance mode.

[AZURE.INCLUDE [storsimple-exit-maintenance-mode](../includes/storsimple-exit-maintenance-mode.md)]

## Install hotfixes via Windows PowerShell for StorSimple

Unlike updates for Microsoft Azure StorSimple, hotfixes are installed from a shared folder. As with updates, there are two types of hotfixes: 

- Regular hotfixes 
- Maintenance mode hotfixes  

The following procedures explain how to use Windows PowerShell for StorSimple to install regular and Maintenance mode hotfixes.

[AZURE.INCLUDE [storsimple-install-regular-hotfixes](../includes/storsimple-install-regular-hotfixes.md)]

[AZURE.INCLUDE [storsimple-install-maintenance-mode-hotfixes](../includes/storsimple-install-maintenance-mode-hotfixes.md)]

## What happens to updates if you perform a factory reset of the device?

If a device is reset to factory settings, then all the updates are lost. After the factory-reset device is registered and configured, you will need to manually install updates through the Management Portal and/or Windows PowerShell for StorSimple. For more information about factory resets, see [Reset the device to factory default settings](https://msdn.microsoft.com/library/azure/dn772373.aspx).

## Next steps

Learn more about [Windows PowerShell for StorSimple](https://msdn.microsoft.com/library/azure/dn772425.aspx).
