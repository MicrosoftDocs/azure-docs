---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---
### Install maintenance mode updates via Windows PowerShell for StorSimple

When you apply maintenance mode updates to StorSimple device, all I/O requests are paused. Services such as non-volatile random access memory (NVRAM) or the clustering service are stopped. Both controllers reboot when you enter or exit this mode. When you exit this mode, all the services resume and are healthy. (This may take a few minutes.)

> [!IMPORTANT]
> * Before entering maintenance mode, verify that both device controllers are healthy in the Azure portal. If the controller is not healthy, [Contact Microsoft Support](../articles/storsimple/storsimple-8000-contact-microsoft-support.md) for the next steps.
> * When you are in maintenance mode, you need to first update one controller and then the other controller.

1. Use PuTTY to connect to the serial console. Follow the detailed instructions in [Use PuTTy to connect to the serial console](../articles/storsimple/storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console). At the command prompt, press **Enter**. Select Option 1, **Log in with full access**.

2. To place the controller in maintenance mode, type:
    
    `Enter-HcsMaintenanceMode`

    Both the controllers restart into maintenance mode.

3. Install your maintenance mode updates. Type:

    `Start-HcsUpdate`

    You are prompted for confirmation. After you confirm the updates, they are installed on the controller that you are currently accessing. After the updates are installed, the controller restarts.

4. Monitor the status of updates. Sign in to the peer controller as the current controller is updating and is not able to process any other commands. Type:

    `Get-HcsUpdateStatus`

    If the `RunInProgress` is `True`, the update is still in progress. If `RunInProgress` is `False`, it indicates that the update has completed.

5. After the disk firmware updates are successfully applied and the updated controller has restarted, verify the disk firmware version. On the updated controller, type:

    `Get-HcsFirmwareVersion`
   
    The expected disk firmware versions are:
    `XMGJ, XGEG, KZ50, F6C2, VR08, N003, 0107`

6. Exit the maintenance mode. Type the following command for each device controller:

    `Exit-HcsMaintenanceMode`

    The controllers restart when you exit maintenance mode.

7. Return to the Azure portal. The portal may not show that you installed the maintenance mode updates for 24 hours.