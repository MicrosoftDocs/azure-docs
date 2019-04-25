---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install regular hotfixes via Windows PowerShell for StorSimple
1. Connect to the device serial console. For more information, see [Step 1: Connect to the serial console](../articles/storsimple/storsimple-update-device.md#step1).
2. In the serial console menu, select option 1, **Log in with full access**. Type the password. The default password is **Password1**.
3. At the command prompt, type:
   
    ```
    Start-HcsHotfix
    ```
   
    > [!IMPORTANT]
    >
    > This command applies only to regular hotfixes. You run this command on only one controller, but both controllers will be updated.
    > You may notice a controller failover during the update process; however, the failover will not affect system availability or operation.

4. When prompted, supply the path to the network shared folder that contains the hotfix files.
5. You will be prompted for confirmation. Type **Y** to proceed with the hotfix installation.

