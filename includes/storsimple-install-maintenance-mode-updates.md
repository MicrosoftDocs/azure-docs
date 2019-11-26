---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install Maintenance mode updates via Windows PowerShell for StorSimple
1. If you haven't done so already, access the device serial console and select option 1, **Log in with full access**. 
2. Type the password. The default password is **Password1**.
3. At the command prompt, type:
   
     `Get-HcsUpdateAvailability` 
4. You will be notified if updates are available and whether the updates are disruptive or non-disruptive. To apply disruptive updates, you need to put the device into Maintenance mode. See [Step 2: Enter Maintenance mode](../articles/storsimple/storsimple-update-device.md#step2) for instructions.
5. When your device is in Maintenance mode, at the command prompt, type: `Start-HcsUpdate`
6. You will be prompted for confirmation. After you confirm the updates, they will be installed on the controller that you are currently accessing. After the updates are installed, the controller will restart. 
7. Monitor the status of updates. Type:
   
    `Get-HcsUpdateStatus`
   
    If the `RunInProgress` is `True`, the update is still in progress. If `RunInProgress` is `False`, it indicates that the update has completed.  
8. When the update is installed on the current controller and it has restarted, connect to the other controller and perform steps 1 through 6.
9. After both controllers are updated, exit Maintenance mode. See [Step 4: Exit Maintenance mode](../articles/storsimple/storsimple-update-device.md#step4) for instructions.

