<properties 
   pageTitle="Change device modes on your StorSimple device"
   description="Learn what the various StorSimple device modes are and how to change the device modes."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/30/2015"
   ms.author="alkohli" />

# Change device modes

This article provides a brief description of the various modes in which your StorSimple device can operate. Your StorSimple device can function in three modes: Normal, Maintenance, and Recovery. 

After reading this article, you will know:

- the StorSimple device modes.
- how to figure out which mode the StorSimple device is in.
- how to change from normal to maintenance mode and *vice versa*.


The above management tasks can only be performed via the Windows PowerShell interface of your StorSimple device.

## About StorSimple device modes
Your StorSimple device can operate in Normal, Maintenance, or Recovery mode. Each of these modes is briefly described below.

### Normal mode

This is defined as the normal operational mode for a fully configured StorSimple device. By default, your device should be in normal mode.

### Maintenance mode

Sometimes the StorSimple device may need to be placed into Maintenance mode. This mode allows you to perform maintenance on the device and install disruptive updates, such as those related to disk firmware and USM firmware (can be both regular and disruptive).

You can put the system into Maintenance mode only via the Windows PowerShell for StorSimple. All I/O requests are paused in this mode. Services such as non-volatile random access memory (NVRAM) or the clustering service are also stopped. Both the controllers are rebooted when you enter or exit this mode. When you exit the maintenance mode, all the services will resume and should be healthy. This may take a few minutes.

>[AZURE.NOTE] **Maintenance mode is only supported on a properly functioning device. It is not supported on a device in which one or both of the controllers are not functioning.**

### Recovery mode

Recovery mode can be described as "Windows Safe Mode with network support". Recovery mode engages the Microsoft Support team and allows them to perform diagnostics on the system. The primary goal of Recovery mode is to retrieve the system logs.

If your system goes into Recovery mode, you should contact Microsoft Support for next steps. For more information, go to [Contact Microsoft Support](storsimple-contact-microsoft-support.md).

>[AZURE.NOTE] **You cannot place the device in Recovery mode. If the device is in a bad state, Recovery mode tries to get the device into a state in which Microsoft Support personnel can examine it.**

## Figure out StorSimple device modes

To figure out the device mode, perform the following steps:

1. Log on to the device serial console by following the steps in [Use PuTTY to connect to the device serial console](https://msdn.microsoft.com/library/azure/dn757808.aspx).
2. Look at the banner message in the serial console menu of the device. This message explicitly indicates whether the device is in Maintenance or Recovery mode. If the message does not contain any specific information pertaining to the system mode, the device is in Normal mode.

## Change  your StorSimple from normal to maintenance mode

You can place the StorSimple device into Maintenance mode to perform maintenance or install maintenance mode updates. Perform the following procedures to enter or exit maintenance mode.

> [AZURE.IMPORTANT] Before entering Maintenance mode, verify that both device controllers are healthy by accessing the Hardware Status on the Maintenance page in the Management Portal. If the controller is not healthy, contact Microsoft Support for the next steps. For more information, go to [Contact Microsoft Support](storsimple-contact-microsoft-support.md).

#### To enter Maintenance mode

1. Log on to the device serial console by following the steps in [Use PuTTY to connect to the device serial console](https://msdn.microsoft.com/library/azure/dn757808.aspx).

1. In the serial console menu, choose option 1, **Log in with full access**. When prompted, provide the **device administrator password**. The default password is: `Password1`.

1. At the command prompt, type 

	`Enter-HcsMaintenanceMode`

1. You will see a warning message telling you that Maintenance mode will disrupt all I/O requests and sever the connection to the Management Portal, and you will be prompted for confirmation. Type **Y** to enter Maintenance mode.

1. Both controllers will restart. When the restart is complete, another message will appear indicating that the device is in Maintenance mode.


#### To exit Maintenance mode

1. Log on to the device serial console. Verify from the banner message that your device is in Maintenance mode.

2. At the command prompt, type:

	`Exit-HcsMaintenanceMode`

1. A warning message and a confirmation message will appear. Type **Y** to exit Maintenance mode.

1. Both controllers will restart. When the restart is complete, another message will appear indicating that the device is in Normal mode.


## Next steps

Learn how to [apply normal and maintenance mode updates](storsimple-update-device.md) on your StorSimple device.

