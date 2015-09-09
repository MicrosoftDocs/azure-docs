<properties
   pageTitle="Install maintenance mode hotfixes"
   description="Explains how to use the Windows PowerShell for StorSimple to install maintenance mode hotfixes."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/19/2015"
   ms.author="v-sharos" />

#### To install Maintenance mode hotfixes via Windows PowerShell for StorSimple

> [AZURE.IMPORTANT] In Maintenance mode, you need to apply the hotfix first on one controller and then on the other controller.

1. Place the device into Maintenance mode. See [Step 2: Enter Maintenance mode](storsimple-update-device.md#step2) for instructions on how to enter Maintenance mode.

2. To apply the hotfix, type:

     `Start-HcsHotfix` 

3. When prompted, supply the path to the network shared folder that contains the hotfix files.

4. You will be prompted for confirmation. Type **Y** to proceed with the hotfix installation.

5. After you have applied the hotfix on one controller, log on to the other controller. Apply the hotfix as you did for the previous controller.

6. After the hotfixes are applied, exit Maintenance mode. See [Step 4: Exit Maintenance mode](storsimple-update-device.md#step4) for instructions.
