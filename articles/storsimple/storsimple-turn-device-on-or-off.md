---
title: Turn your StorSimple 8000 series device on or off | Microsoft Docs
description: Explains how to turn on a new StorSimple device, turn on a device that was shut down or lost power, and turn off a running device.
services: storsimple
documentationcenter: ''
author: alkohli
manager: jeconnoc
editor: ''

ms.assetid: 8e9c6e6c-965c-4a81-81bd-e1c523a14c82
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 01/09/2018
ms.author: alkohli
ms.custom: H1Hack27Feb2017

---
# Turn on or turn off your StorSimple 8000 series device

## Overview
Shutting down a Microsoft Azure StorSimple device is not required as a part of normal system operation. However, you may need to turn on a new device or a device that had to be shut down. Generally, a shutdown is required in cases in which you must replace failed hardware, physically move a unit, or take a device out of service. This tutorial describes the required procedure for turning on and shutting down your StorSimple device in different scenarios.

## Turn on a new device
The steps for turning on a StorSimple device for the first time differ depending on whether the device is an 8100 or an 8600 model. The 8100 has a single primary enclosure, whereas the 8600 is a dual-enclosure device with a primary enclosure and an EBOD enclosure. The detailed steps for both models are covered in the following sections.

* [New device with primary enclosure only](#new-device-with-primary-enclosure-only)
* [New device with EBOD enclosure](#new-device-with-ebod-enclosure)

### New device with primary enclosure only
The StorSimple 8100 model is a single enclosure device. Your device includes redundant Power and Cooling Modules (PCMs). Both PCMs must be installed and connected to different power sources to ensure high availability.

Perform the following steps to cable your device for power.

[!INCLUDE [storsimple-cable-8100-for-power](../../includes/storsimple-cable-8100-for-power.md)]

> [!NOTE]
> For complete device setup and cabling instructions, go to [Install your StorSimple 8100 device](storsimple-8100-hardware-installation.md). Make sure that you follow the instructions exactly.
> 
> 

### New device with EBOD enclosure
The StorSimple 8600 model has both a primary enclosure and an EBOD enclosure. This requires the units to be cabled together for Serial Attached SCSI (SAS) connectivity and power.

When setting up this device for the first time, perform the steps for SAS cabling first and then complete the steps for power cabling.

[!INCLUDE [storsimple-sas-cable-8600](../../includes/storsimple-sas-cable-8600.md)]

[!INCLUDE [storsimple-cable-8600-for-power](../../includes/storsimple-cable-8600-for-power.md)]

> [!NOTE]
> For complete device setup and cabling instructions, go to [Install your StorSimple 8600 device](storsimple-8600-hardware-installation.md). Make sure that you follow the instructions exactly.

## Turn on a device after shutdown
The steps for turning on a StorSimple device after it has been shut down are different depending on whether the device is an 8100 or an 8600 model. The 8100 has a single primary enclosure, whereas the 8600 is a dual-enclosure device with a primary enclosure and an EBOD enclosure.

* [Device with primary enclosure only](#device-with-primary-enclosure-only)
* [Device with EBOD enclosure](#device-with-ebod-enclosure)

### Device with primary enclosure only
After a shutdown, use the following procedure to turn on a StorSimple device with a primary enclosure and no EBOD enclosure.

#### To turn on a device with a primary enclosure only
1. Make sure that the power switches on both Power and Cooling Modules (PCMs) are in the OFF position. If the switches are not in the OFF position, then flip them to the OFF position and wait for the lights to go off.
2. Turn on the device by flipping the power switches on both PCMs to the ON position. The device should turn on.
3. Check the following to verify that the device is fully on:
   
   1. The OK LEDs on both PCM modules are green.
   2. The status LEDs on both controllers are solid green.
   3. The blue LED on one of the controllers is blinking, which indicates that the controller is active.
      
      If any of these conditions are not met, then your device is not healthy. Please [contact Microsoft Support](storsimple-8000-contact-microsoft-support.md).

### Device with EBOD enclosure
After a shutdown, use the following procedure to turn on a StorSimple device with a primary enclosure and an EBOD enclosure. Perform each step in sequence exactly as described. Failure to do so could result in data loss.

#### To turn on a device with a primary and an EBOD enclosure
1. Make sure that the EBOD enclosure is connected to the primary enclosure. For more information, see [Install your StorSimple 8600 device](storsimple-8600-hardware-installation.md).
2. Make sure that the Power and Cooling Modules (PCMs) on both the EBOD and primary enclosures are in the OFF position. If the switches are not in the OFF position, then flip them to the OFF position and wait for the lights to go off.
3. Turn on the EBOD enclosure first by flipping the power switches on both PCMs to the ON position. The PCM LEDs should be green. A green EBOD controller LED on this unit indicates that the EBOD enclosure is on.
4. Turn on the primary enclosure by flipping the power switches on both PCMs to the ON position. The entire system should now be on.
5. Verify that the SAS LEDs are green, which ensures that the connection between the EBOD enclosure and the primary enclosure is good.

## Turn on a device after a power loss
A power outage or interruption can shut down a StorSimple device. The power outage can happen on one of the power supplies or both power supplies. The recovery steps are different depending on whether the device is an 8100 or an 8600 model. The 8100 has a single primary enclosure, whereas the 8600 is a dual-enclosure device with a primary enclosure and an EBOD enclosure. This section describes the recovery procedure for each scenario.

* [Device with primary enclosure only](#8100)
* [Device with EBOD enclosure](#8600)

### Device with primary enclosure only <a name="8100">
The system can continue its normal operation if there is power loss to one of its power supplies. However, to ensure high availability of the device, restore power to the power supply as soon as possible.

If there is a power outage or power interruption on both power supplies, the system will shut down in an orderly and controlled manner. When the power is restored, the system will automatically turn on.

### Device with EBOD enclosure <a name="8600">
#### Power loss on one power supply
The system can continue its normal operation if there is power loss to one of its power supplies on the primary enclosure or the EBOD enclosure. However, to ensure high availability of the device, please restore power to the power supply as soon as possible.

#### Power loss on both power supplies on primary and EBOD enclosures
If there is a power outage or power interruption on both power supplies, the EBOD enclosure will shut down immediately and the primary enclosure will shut down in an orderly and controlled manner. When power is restored, the appliance will start automatically.

If the power is switched off manually, then take the following steps to restore power to the system.

1. Turn on the EBOD enclosure.
2. After the EBOD enclosure is on, turn on the primary enclosure.

### Power loss on both power supplies on EBOD enclosure
When you set up your cables, you must ensure that the EBOD is never connected alone to a separate PDU. If the EBOD and primary enclosure fail at the same time, the system will recover.

If only the EBOD enclosure fails on both power supplies, the system will not automatically recover. Take the following steps to turn on the system and restore it to a healthy state:

1. If the primary enclosure is turned on, switch off both Power and Cooling Modules (PCMs).
2. Wait for a few minutes for the system to shut down.
3. Turn on the EBOD enclosure.
4. After the EBOD enclosure is on, turn on the primary enclosure.

## Turn on a device after the primary and EBOD enclosure connection is lost
If the connection is lost between the standby controller and the corresponding EBOD controller, the device continues to work. If the connection between the system active controller and the corresponding EBOD controller is lost, failover should occur and the device should continue to work as normal.

When both Serial Attached SCSI (SAS) cables are removed or the connection between the EBOD enclosure and the primary enclosure is severed, the device will stop working. At this point, perform the following steps.

### To turn on the device after connection is lost
1. Access the back of the device.
2. If the SAS cable connection between the EBOD enclosure and the primary enclosure is broken, all SAS lane LEDs on the EBOD enclosure will be off.
3. Shut down both Power and Cooling Modules (PCMs) on the EBOD enclosure and the primary enclosure.
4. Wait until all the lights on the back of both the enclosures turn off.
5. Reinsert the SAS cables, and ensure that there is a good connection between the EBOD enclosure and the primary enclosure.
6. Turn on the EBOD enclosure first by flipping both PCM switches to the ON position.
7. Ensure that the EBOD enclosure is on by checking that the green LED is ON.
8. Turn on the primary enclosure.
9. Ensure that the primary enclosure is on by checking that the controller green LED is ON.
10. Verify that the EBOD enclosure connection with the primary enclosure is good by checking that the SAS lane LEDs (four per EBOD controller) are all ON.

> [!IMPORTANT]
> If the SAS cables are defective or the connection between the EBOD enclosure and the primary enclosure is not good, when you turn on the system, it will go into recovery mode. Please [contact Microsoft Support](storsimple-8000-contact-microsoft-support.md) if this happens.


## Turn off a running device
A running StorSimple device may need to be shut down if it is being moved, taken out of service, or has a malfunctioning component that needs to be replaced. The steps are different depending on whether the StorSimple device is an 8100 or an 8600 model. The 8100 has a single primary enclosure, whereas the 8600 is a dual-enclosure device with a primary enclosure and an EBOD enclosure. This section details the steps to shut down a running device.

* [Device with primary enclosure](#8100a)
* [Device with EBOD enclosure](#8600a)

### Device with primary enclosure <a name="8100a">
To shut down the device in an orderly and controlled manner, you can do it through the Azure portal or via the Windows PowerShell for StorSimple. 

> [!IMPORTANT]
> Do not shut down a running device by using the power button on the back of the device.
> 
> Before shutting down the device, make sure that all the device components are healthy. In the Azure portal, navigate to **Devices** > **Monitor** > **Hardware health**, and verify that status of all the components is green. This is true only for a healthy system. If the system is being shut down to replace a malfunctioning component, you will see a failed (red) or degraded (yellow) status for the respective component in the **Hardware Status**.
> 
> 

After you access the Windows PowerShell for StorSimple or the Azure portal, follow the steps in [shut down a StorSimple device](storsimple-8000-manage-device-controller.md#shut-down-a-storsimple-device). 

### Device with EBOD enclosure <a name="8600a">
> [!IMPORTANT]
> Before shutting down the primary enclosure and the EBOD enclosure, ensure that all the device components are healthy. In the Azure portal, navigate to **Devices** > **Monitor** > **Hardware health**, and verify that all the components are healthy.


#### To shut down a running device with EBOD enclosure
1. Follow all the steps listed in [shut down a StorSimple device](storsimple-8000-manage-device-controller.md#shut-down-a-storsimple-device) for the primary enclosure.
2. After the primary enclosure is shut down, shut down the EBOD by flipping off both Power and Cooling Module (PCM) switches.
3. To verify that the EBOD has shut down, check that all lights on the back of the EBOD enclosure are off.

> [!NOTE]
> The SAS cables that are used to connect the EBOD enclosure to the primary enclosure should not be removed until after the system is shut down.

## Next steps
[Contact Microsoft Support](storsimple-8000-contact-microsoft-support.md) if you encounter problems when turning on or shutting down a StorSimple device.

