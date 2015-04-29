<properties
   pageTitle="Install Maintenance mode updates"
   description="Explains how to use Windows PowerShell for StorSimple to install maintenance mode updates."
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
   ms.date="04/21/2015"
   ms.author="v-sharos" />

#### To install Maintenance mode updates via Windows PowerShell for StorSimple

1. If you haven't done so already, access the device serial console and select option 1, **Log in with full access**. 

2. Type the password. The default password is **Password1**.

3. At the command prompt, type:

     `Get-HcsUpdateAvailability` 
    
4. You will be notified if updates are available and whether the updates are disruptive or non-disruptive. To apply disruptive updates, you need to put the device into Maintenance mode. See [Enter Maintenance mode](#enter-maintenance-mode) for instructions.

5. When your device is in Maintenance mode, at the command prompt, type: `Start-HcsUpdate`

6. You will be prompted for confirmation. After you confirm the updates, they will be installed on the controller that you are currently accessing. After the updates are installed, the controller will restart. 

7. When the restart of the first controller is finished, connect to the other controller, and perform steps 1 through 6.

8. After both controllers are updated, exit Maintenance mode. See [Exit Maintenance mode](#exit-maintenance-mode) for instructions.
