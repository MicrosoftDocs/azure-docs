---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install Maintenance mode hotfixes via Windows PowerShell for StorSimple
> [!IMPORTANT]
> In Maintenance mode, you need to apply the hotfix first on one controller and then on the other controller.
> 
> 

1. Place the device into Maintenance mode. See [Step 2: Enter Maintenance mode](../articles/storsimple/storsimple-update-device.md#step2) for instructions on how to enter Maintenance mode.
2. To apply the hotfix, type:
   
     `Start-HcsHotfix` 
3. When prompted, supply the path to the network shared folder that contains the hotfix files.
4. You will be prompted for confirmation. Type **Y** to proceed with the hotfix installation.
5. After you have applied the hotfix on one controller, sign in to the other controller. Apply the hotfix as you did for the previous controller.
6. After the hotfixes are applied, exit Maintenance mode. See [Step 4: Exit Maintenance mode](../articles/storsimple/storsimple-update-device.md#step4) for instructions.

