<properties 
   pageTitle="Install Update 2 on your StorSimple device | Microsoft Azure"
   description="Explains how to install StorSimple 8000 Series Update 2 on your StorSimple 8000 series device."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="01/05/2016"
   ms.author="alkohli" />

# Install Update 2 on your StorSimple device

## Overview

This tutorial explains how to install Update 2 on a StorSimple device running an earlier software version via the Azure classic portal. The tutorial also covers the steps required for the update when a gateway is configured on a network interface other than DATA 0 of the StorSimple device and you are trying to update from a pre-Update 1 software version. 

Update 2 includes device software updates, LSI driver updates, and disk firmware updates. The device software and LSI updates are non-disruptive updates and can be applied via the Azure classic portal. The disk firmware updates are disruptive updates and can only be applied via the Windows PowerShell interface of the device. 

> [AZURE.IMPORTANT]
 
> -  You may not see Update 2 immediately because we do a phased rollout of the updates. Scan for updates in a few days again as this Update will become available soon.
> - A set of manual and automatic pre-checks are done prior to the install to determine the device health in terms of hardware state and network connectivity. These pre-checks are performed only if you apply the updates from the Azure classic portal. 
> - We recommend that you install the software and driver updates via the Azure  classic portal. You should only go to the Windows PowerShell interface of the device (to install updates) if the pre-update gateway check fails in the portal. The updates may take 4-7 hours to install (including the Windows Updates). The maintenance mode updates must be installed via the Windows PowerShell interface of the device. As maintenance mode updates are disruptive updates, these will result in a down time for your device.
> - If running the optional StorSimple Snapshot Manager, ensure that you have upgraded your Snapshot Manager version to Update 2 prior to updating the device.

## Preparing for updates
You will need to perform the following steps before you scan and apply the update:


1. Take a cloud snapshot of the device data.

2. Ensure that your controller fixed IPs are routable and can connect to the Internet. These fixed IPs will be used to service updates to your device. You can test this by running the following cmdlet on each controller from the Windows PowerShell interface of the device:

 	`Test-Connection -Source <Fixed IP of your device controller> -Destination <Any IP or computer name outside of datacenter network> `
 
	**Sample output for Test-Connection when fixed IPs can connect to the Internet**

	    
		Controller0>Test-Connection -Source 10.126.173.91 -Destination bing.com
	    
	    Source	  Destination 	IPV4Address      IPV6Address
	    ----------------- -----------  -----------
	    HCSNODE0  bing.com		204.79.197.200
	    HCSNODE0  bing.com		204.79.197.200
	    HCSNODE0  bing.com		204.79.197.200
	    HCSNODE0  bing.com		204.79.197.200
	
		Controller0>Test-Connection -Source 10.126.173.91 -Destination  204.79.197.200

	    Source	  Destination 	  IPV4Address    IPV6Address
	    ----------------- -----------  -----------
	    HCSNODE0  204.79.197.200  204.79.197.200
	    HCSNODE0  204.79.197.200  204.79.197.200
	    HCSNODE0  204.79.197.200  204.79.197.200
	    HCSNODE0  204.79.197.200  204.79.197.200

After you have successfully completed these manual pre-checks, you can proceed to scan and install the updates.

## Install Update 2 via the Azure classic portal 

This is the recommended procedure to update your device. Perform the following steps.

[AZURE.INCLUDE [storsimple-install-update2-via-portal](../../includes/storsimple-install-update2-via-portal.md)]

## Install Update 2 as a hotfix 

Use this procedure only if you fail the gateway check when trying to install the updates through the Azure classic portal. The check fails as you have a gateway assigned to a non-DATA 0 network interface and your device is running a software version prior to Update 1. 

The software versions that can be upgraded using the hotfix method are Update 0.1, Update 0.2, and Update 0.3, Update 1, Update 1.1, and Update 1.2. The hotfix method involves the following three steps:

- Download the hotfixes from the Microsoft Update Catalog.
- Install and verify the regular mode hotfixes.
- Install and verify the maintenance mode hotfix.

The hotfixes applied through this method are as tabulated below:

| Order  | KB        | Name                    | Package description         | Update type |
|--------|-----------|-------------------------|-----------------------------|-------------|
| 1      | KB3121901 | Software update         | HcsMdsSfotwareUpdate.exe <br></br>  CisMdsAgentUpdateBundle.exe    | Regular     |
| 2      | KB3121900 | LSI driver              | HcsLsiUpdate.exe            										| Regular     |
| 3      | KB3080728 | Storport fix            | Storport-KB3080728-x64.msu  										| Regular     |
| 4      | KB3090322 | Spaceport fix           | Spaceport-KB3090322-x64.msu 										| Regular     |
| 5      | KB3121899 | Disk firmware           | DiskFirmwarePackage.exe     										| Maintenance |


> [AZURE.IMPORTANT] 
> 
> - If your device is running Release (GA) version, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) to assist you with the update.
> - This procedure needs to be performed only once to apply Update 2. You can use the Azure classic portal to apply subsequent updates.
> - Each hotfix installation can take about 20 minutes to complete. Total install time is close to 2 hours. 
> - Before using this procedure to apply the update, make sure that both device controllers are online.

Perform the following steps to apply Update 2 as a hotfix. 

[AZURE.INCLUDE [storsimple-install-update2-hotfix](../../includes/storsimple-install-update2-hotfix.md)]


## Troubleshooting update failures

**What if you see a notification that the pre-upgrade checks have failed?**

If a pre-check fails, make sure that you have looked at the detailed notification bar at the bottom of the page. This provides guidance as to which pre-check has failed. The following illustration shows an instance in which such a notification appears. In this case, the controller health check and hardware component health check have failed. Under the **Hardware Status** section, you can see that both **Controller 0** and **Controller 1** components need attention. 
 
  ![Pre-check failure](./media/storsimple-install-update-2/HCS_PreUpdateCheckFailed-include.png)

You will need to make sure that both controllers are healthy and online. You will also need to make sure that all the hardware components in the StorSimple device are shown to be healthy on the Maintenance page. You can then try to install updates. If you are not able to fix the hardware component issues, then you will need to contact Microsoft Support for next steps.

**What if you receive a "Could not install updates" error message, and the recommendation is to refer to the update troubleshooting guide to determine the cause of the failure?**

One likely cause for this could be that you do not have connectivity to the Microsoft Update servers. This is a manual check that needs to be performed. If you lose connectivity to the update server, your update job would fail. You can check the connectivity by running the following cmdlet from the Windows PowerShell interface of your StorSimple device:

 `Test-Connection -Source <Fixed IP of your device controller> -Destination <Any IP or computer name outside of datacenter>`

Run the cmdlet on both controllers.
 
If you have verified the connectivity exists, and you continue to see this issue, please contact Microsoft Support for next steps.


## Next steps

Learn more about the [Update 2 release](storsimple-update2-release-notes.md).
