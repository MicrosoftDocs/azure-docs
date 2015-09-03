<properties 
   pageTitle="Install Update 1 on your StorSimple device | Microsoft Azure"
   description="Explains how to install StorSimple 8000 Series Update 1 on your device."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="adinah"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/31/2015"
   ms.author="alkohli" />

# Install Update 1 on your StorSimple device

## Overview

This tutorial explains how to install Update 1 on a StorSimple device that is running a software version prior to Update 1. Your device could be running the generally available (GA) release, Update 0.1, Update 0.2, or Update 0.3 software.  

During this installation, if your device is running a version prior to Update 1, then checks are performed on your device. These checks determine the device health in terms of hardware state and network connectivity.

You will be prompted to perform a manual pre-check to ensure that:

- The controller fixed IPs are routable and can connect to the Internet. These IPs are used to service updates to your StorSimple device. You can test this by running the following cmdlet on each controller:

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
	    
	    


- Before updating the device, we recommend that you take a cloud snapshot of the device data. 

After you have verified and acknowledged the manual checks (above), a set of automatic pre-update checks will be performed. These include:

- **Controller health checks** to verify that both the device controllers are healthy and online.

- **Hardware component health checks** to verify that all the hardware components on your StorSimple device are healthy.

- **DATA 0 checks** to verify that DATA 0 is enabled on your device. If this interface is not enabled, you will need to enable it and then retry.

- **DATA 2 and DATA 3 checks** to verify that DATA 2 and DATA 3 network interfaces are not enabled. If these interfaces are enabled, then you will need to disable them and then try to update your device. This check is performed only if you are updating from a device running GA software. Devices running versions 0.1, 0.2, or 0.3 will not need this check.

- **Gateway check** on any device running a version prior to Update 1. This check is performed only on devices that have a gateway configured for a network interface other than DATA 0.
 
Update 1 will only be applied if all the pre-update checks are successfully completed. After you have applied Update 1 on your StorSimple device, future updates will not have the Data 2 and Data 3 checks and the Gateway check. The other pre-checks will occur.

## Use the Management Portal to install Update 1

We recommend that you use the Azure Management Portal to update a device that is running the GA version. Perform the following steps to update your device.

[AZURE.INCLUDE [storsimple-install-update-via-portal](../../includes/storsimple-install-update-via-portal.md)]


## Troubleshooting update failures

**What if you see a notification that the pre-upgrade checks have failed?**

If a pre-check fails, make sure that you have looked at the detailed notification bar at the bottom of the page. This provides guidance as to which pre-check has failed. The following illustration shows an instance in which such a notification appears. In this case, the controller health check and hardware component health check have failed. Under the **Hardware Status** section, you can see that both Controller 0 and Controller 1 components need attention. 
 
  ![Pre-check failure](./media/storsimple-install-update-1/HCS_PreUpdateCheckFailed-include.png)

You will need to make sure that both controllers are healthy and online. You will also need to make sure that all the hardware components in the StorSimple device are shown to be healthy on the Maintenance page. You can then try to install updates. If you are not able to fix the hardware component issues, then you will need to contact Microsoft Support for next steps.

**What if you receive a "Could not install updates" error message, and the recommendation is to refer to the update troubleshooting guide to determine the cause of the failure?**

One likely cause for this could be that you do not have connectivity to the Microsoft Update servers. This is a manual check that needs to be performed. If you lose connectivity to the update server, your update job would fail. You can check the connectivity by running the following cmdlet from the Windows PowerShell interface of your StorSimple device:

 `Test-Connection -Source <Fixed IP of your device controller> -Destination <Any IP or computer name outside of datacenter>`

Run the cmdlet on both controllers.
 
If you have verified the connectivity exists, and you continue to see this issue, please contact Microsoft Support for next steps.

## Next steps

Learn more about [Microsoft Azure StorSimple](storsimple-overview.md) 
