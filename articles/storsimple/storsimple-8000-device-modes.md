---
title: Change StorSimple device mode | Microsoft Docs
description: Describes the StorSimple device modes and explains how to use Windows PowerShell for StorSimple to change the device mode.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/29/2017
ms.author: alkohli

---
# Change the device mode on your StorSimple device

This article provides a brief description of the various modes in which your StorSimple device can operate. Your StorSimple device can function in three modes: normal, maintenance, and recovery.

After reading this article, you will know:

* What the StorSimple device modes are
* How to figure out which mode the StorSimple device is in
* How to change from normal to maintenance mode and *vice versa*

The above management tasks can only be performed via the Windows PowerShell interface of your StorSimple device.

## About StorSimple device modes

Your StorSimple device can operate in normal, maintenance, or recovery mode. Each of these modes is briefly described below.

### Normal mode

This is defined as the normal operational mode for a fully configured StorSimple device. By default, your device should be in normal mode.

### Maintenance mode

Sometimes the StorSimple device may need to be placed into maintenance mode. This mode allows you to perform maintenance on the device and install disruptive updates, such as those related to disk firmware.

You can put the system into maintenance mode only via the Windows PowerShell for StorSimple. All I/O requests are paused in this mode. Services such as non-volatile random access memory (NVRAM) or the clustering service are also stopped. Both the controllers are restarted when you enter or exit this mode. When you exit the maintenance mode, all the services will resume and should be healthy. This may take a few minutes.

> [!NOTE]
> **Maintenance mode is only supported on a properly functioning device. It is not supported on a device in which one or both of the controllers are not functioning.**


### Recovery mode

Recovery mode can be described as "Windows Safe Mode with network support". Recovery mode engages the Microsoft Support team and allows them to perform diagnostics on the system. The primary goal of recovery mode is to retrieve the system logs.

If your system goes into recovery mode, you should contact Microsoft Support for next steps. For more information, go to [Contact Microsoft Support](storsimple-8000-contact-microsoft-support.md).

> [!NOTE]
> **You cannot place the device in recovery mode. If the device is in a bad state, recovery mode tries to get the device into a state in which Microsoft Support personnel can examine it.**

## Determine StorSimple device mode

#### To determine the current device mode

1. Log on to the device serial console by following the steps in [Use PuTTY to connect to the device serial console](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).
2. Look at the banner message in the serial console menu of the device. This message explicitly indicates whether the device is in maintenance or recovery mode. If the message does not contain any specific information pertaining to the system mode, the device is in normal mode.

## Change the StorSimple device mode

You can place the StorSimple device into maintenance mode (from normal mode) to perform maintenance or install maintenance mode updates. Perform the following procedures to enter or exit maintenance mode.

> [!IMPORTANT]
> Before entering maintenance mode, verify that both device controllers are healthy by accessing the **Device settings > Hardware health** for your device in the Azure portal. If one or both the controllers are not healthy, contact Microsoft Support for the next steps. For more information, go to [Contact Microsoft Support](storsimple-8000-contact-microsoft-support.md).
 

#### To enter maintenance mode

1. Log on to the device serial console by following the steps in [Use PuTTY to connect to the device serial console](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).
2. In the serial console menu, choose option 1, **Log in with full access**. When prompted, provide the **device administrator password**. The default password is: `Password1`.
3. At the command prompt, type 
   
    `Enter-HcsMaintenanceMode`
4. You will see a warning message telling you that maintenance mode will disrupt all I/O requests and sever the connection to the Azure portal, and you will be prompted for confirmation. Type **Y** to enter maintenance mode.
5. Both controllers will restart. When the restart is complete, the serial console banner will indicate that the device is in maintenance mode. A sample output is shown below.

```
    ---------------------------------------------------------------
    Microsoft Azure StorSimple Appliance Model 8100
    Name: 8100-SHX0991003G44MT
    Software Version: 6.3.9600.17820
    Copyright (C) 2014 Microsoft Corporation. All rights reserved.
    You are connected to Controller0 - Passive
    ---------------------------------------------------------------

    Controller0>Enter-HcsMaintenanceMode
    Checking device state...

    In maintenance mode, your device will not service IOs and will be disconnected from the Microsoft Azure StorSimple Manager service. Entering maintenance mode will end the current session and reboot both controllers, which takes a few minutes to complete. Are you sure you want to enter maintenance mode?
    [Y] Yes [N] No (Default is "Y"): Y

    <BOTH CONTROLLERS RESTART>

    -----------------------MAINTENANCE MODE------------------------
    Microsoft Azure StorSimple Appliance Model 8100
    Name: 8100-SHX0991003G44MT
    Software Version: 6.3.9600.17820
    Copyright (C) 2014 Microsoft Corporation. All rights reserved.
    You are connected to Controller0 - Passive
    ---------------------------------------------------------------

    Serial Console Menu
    [1] Log in with full access
    [2] Log into peer controller with full access
    [3] Connect with limited access
    [4] Change language
    Please enter your choice>

```

#### To exit maintenance mode

1. Log on to the device serial console. Verify from the banner message that your device is in maintenance mode.
2. At the command prompt, type:
   
    `Exit-HcsMaintenanceMode`
3. A warning message and a confirmation message will appear. Type **Y** to exit maintenance mode.
4. Both controllers will restart. When the restart is complete, the serial console banner indicates that the device is in normal mode. A sample output is shown below.

```
    -----------------------MAINTENANCE MODE------------------------
    Microsoft Azure StorSimple Appliance Model 8100
    Name: 8100-SHX0991003G44MT
    Software Version: 6.3.9600.17820
    Copyright (C) 2014 Microsoft Corporation. All rights reserved.
    You are connected to Controller0
    ---------------------------------------------------------------

    Controller0>Exit-HcsMaintenanceMode
    Checking device state...

    Before exiting maintenance mode, ensure that any updates that are required on both controllers have been applied. Failure to install on each controller could result in data corruption. Exiting maintenance mode will end the current session and reboot both controllers, which takes a few minutes to complete. Are you sure you want to exit maintenance mode?
    [Y] Yes [N] No (Default is "Y"): Y

    <BOTH CONTROLLERS RESTART>

    ---------------------------------------------------------------
    Microsoft Azure StorSimple Appliance Model 8100
    Name: 8100-SHX0991003G44MT
    Software Version: 6.3.9600.17820
    Copyright (C) 2014 Microsoft Corporation. All rights reserved.
    You are connected to Controller0 - Active
    ---------------------------------------------------------------

    Serial Console Menu
    [1] Log in with full access
    [2] Log into peer controller with full access
    [3] Connect with limited access
    [4] Change language
    Please enter your choice>
```

## Next steps

Learn how to [apply normal and maintenance mode updates](storsimple-update-device.md) on your StorSimple device.

