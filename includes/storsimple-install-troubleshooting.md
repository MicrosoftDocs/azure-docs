---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

## Troubleshooting update failures
**What if you see a notification that the pre-upgrade checks have failed?**

If a pre-check fails, make sure that you have looked at the detailed notification bar at the bottom of the page. This provides guidance as to which pre-check has failed. The following illustration shows an instance in which such a notification appears. In this case, the controller health check and hardware component health check have failed. Under the **Hardware Status** section, you can see that both **Controller 0** and **Controller 1** components need attention.

  ![Pre-check failure](./media/storsimple-install-troubleshooting/HCS_PreUpdateCheckFailed-include.png)

You will need to make sure that both controllers are healthy and online. You will also need to make sure that all the hardware components in the StorSimple device are shown to be healthy on the Maintenance page. You can then try to install updates. If you are not able to fix the hardware component issues, then you will need to contact Microsoft Support for next steps.

**What if you receive a "Could not install updates" error message, and the recommendation is to refer to the update troubleshooting guide to determine the cause of the failure?**

One likely cause for this could be that you do not have connectivity to the Microsoft Update servers. This is a manual check that needs to be performed. If you lose connectivity to the update server, your update job would fail. You can check the connectivity by running the following cmdlet from the Windows PowerShell interface of your StorSimple device:

 `Test-Connection -Source <Fixed IP of your device controller> -Destination <Any IP or computer name outside of datacenter>`

Run the cmdlet on both controllers.

If you have verified the connectivity exists, and you continue to see this issue, please contact Microsoft Support for next steps.

**What if you see an update failure when updating your device to Update 4 and both the controllers are running Update 4?**

Starting Update 4, if both the controllers are running the same software version and if there is an update failure, the controllers do not go into recovery mode. This situation can arise if the device software hotfix (1st order update) is applied to both the controllers successfully but other hotfixes (2nd order and 3rd order) are yet to be applied. Starting Update 4, the controllers will go into recovery mode only if the two controllers are running different software versions. 

If the user sees an update failure when both controllers are running Update 4, we recommend that they wait a few minutes and then retry updating. If the retry does not succeed, then they should contact Microsoft Support.
