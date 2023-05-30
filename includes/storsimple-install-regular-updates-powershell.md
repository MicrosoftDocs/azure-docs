---
author: alkohli
ms.service: storsimple
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install regular updates via Windows PowerShell for StorSimple
1. Open the device serial console and select option 1, **Log in with full access**. Type the password. The default password is *Password1*. 
2. At the command prompt, type:
   
     `Get-HcsUpdateAvailability`
   
    You will be notified if updates are available and whether the updates are disruptive or non-disruptive.
3. At the command prompt, type:
   
     `Start-HcsUpdate`
   
    The update process will start.

> [!IMPORTANT]
> * This command applies only to regular updates. You run this command on only one controller, but both controllers will be updated. 
> * You may notice a controller failover during the update process; however, the failover will not affect system availability or operation.
> 
> 
