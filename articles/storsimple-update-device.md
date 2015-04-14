<properties
   pageTitle="Update your StorSimple device"
   description="Explains how to use the StorSimple update feature to install maintenance mode updates."
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
   ms.date="04/14/2015"
   ms.author="v-sharos" />

# Update your StorSimple device

## Overview

The StorSimple updates feature allows you to easily keep your StorSimple device up to date. Depending on the update type, you can apply updates to the device via the Microsoft Azure Management Portal or via the Windows PowerShell interface. This tutorial describes the update types and how to install each of them.

You can apply two types of device updates: 

- Regular (or Normal mode) updates
- Maintenance mode updates

You can install regular updates via the Managment Portal or Windows PowerShell; however, you must use Windows PowerShell to install Maintenance mode updates. 

Each update type is described separately, below.

### Regular updates

Regular updates are non-disruptive updates that can be installed when the device is in Normal mode. These updates are applied through the Microsoft Update website to each device controller. 

> [AZURE.IMPORTANT] A controller failover may occur during the update process. However, this will not affect system availability or operation.

- For details on how to install regular updates via the Management Portal, see [Install regular updates via the Management Portal](#install-regular-updates-via-the-management-portal).

- You can also install regular updates via Windows PowerShell for StorSimple. For details, go to [Regular updates](https://msdn.microsoft.com/library/azure/dn757751.aspx#BKMK_Regular)

### Maintenance mode updates

Maintenance Mode updates are disruptive updates such as disk firmware upgrades or USM firmware upgrades. These updates require the device to be put into Maintenance mode. For details, see [Change device modes](https://msdn.microsoft.com/library/azure/dn757730.aspx). You cannot use the Management Portal to install Maintenance mode updates. Instead, you must use Windows PowerShell for StorSimple. 

> [AZURE.IMPORTANT] Maintenance mode updates must be applied separately to each controller. 

For details on how to install Maintenance mode updates, see [Install Maintenance mode updates and hotfixes](#install-maintenance-mode-updates-and-hotfixes).

## Install regular updates via the Management Portal

You can use the Management Portal to apply updates manually or you can use the portal to configure automatic updates.

### To install updates manually

1. On the **Devices** page, select the device on which you want to install updates.

2. Navigate to **Devices** > **Maintenance** and scroll down to **Software Updates**.

3. To check for updates, click **Check Updates** at the bottom of the page.

4. You will see a message if software updates are available. Click **Install Updates** to begin updating the device.

    You will be notified when the update is successfully installed.

### To configure automatic updating

1. On the **Devices** page, select the device on which you want to install updates.

2. Navigate to **Devices** > **Maintenance** and scroll down to **Software Updates**.

3. Set **Automatic Updates** to **Yes**. This option automatically scans for updates at 3:00 AM device time, and installs any updates at 4:00 AM every day.

## Install Maintenance mode updates and hotfixes

You use Windows PowerShell for StorSimple to apply Maintenance mode updates to your StorSimple device. 

If you need to apply updates, you will receive an alert through the Management Portal that you have updates that must be installed. This alert will include instructions for using Windows PowerShell for StorSimple to install the updates.

Before you begin, use Windows PowerShell for StorSimple to change the device to Maintenance mode. For more information, go to [Change device modes](https://msdn.microsoft.com/library/azure/dn757730.aspx). After you update your device, use the same procedure to change the device to Regular mode.

> [AZURE.IMPORTANT] In Maintenance mode, you need to apply the update first on one controller and then on the other controller.

For more information on applying Maintenance mode updates, go to [Maintenance mode updates](https://msdn.microsoft.com/library/azure/dn757751.aspx#BKMK_Maintenance)

## What happens to updates if you perform a factory reset of the device?

If a device is reset to factory settings, then all the updates are lost. After the factory-reset device is registered and configured, you will need to manually install updates through the Management Portal and/or Windows PowerShell for StorSimple. For more information about factory resets, see [Reset the device to factory default settings](https://msdn.microsoft.com/library/azure/dn772373.aspx).

## Next steps

Learn more about [installing updates and hotfixes via Windows PowerShell](https://msdn.microsoft.com/library/azure/dn757751.aspx) for StorSimple.
