---
title: Reset Azure Kinect DK
description: Describes how to reset an Azure Kinect DK device to its factory image
author: Teresa-Motiv
ms.author: v-tea
ms.reviewer: jarrettr
ms.prod: kinect-dk
ms.date: 02/05/2020
ms.topic: how-to
keywords: kinect, reset
ms.custom: 
- CI 113492
- CSSTroubleshooting
audience: ITPro
manager: dcscontentpm
ms.localizationpriority: high
---

# Reset Azure Kinect DK to the factory image

You may need to reset your Azure Kinect DK if a firmware update didn't install correctly or you need to get the device back to the factory image.

1. To power off your Azure Kinect DK, remove the USB cable and power cable.
  ![A diagram that shows the location of the screw that covers the reset button.](media/reset-azure-kinect-dk-diagram.png)
1. To find the reset button, remove the screw located in the tripod mount lock.
1. Connect the power cable.
1. While you reconnect the USB cable, use a paperclip to gently press and hold the reset button.
1. When the power indicator light becomes amber—about 3 seconds—release the reset button.
   The power indicator light blinks white and amber while the device resets.
1. Wait for the power indicator light to become solid white.
1. Put the screw back into the tripod mount lock on top of the reset button.
1. Use Azure Kinect Viewer to verify that the firmware was reset. When Azure Kinect Viewer is running, select **Device firmware version info**. You'll see the firmware version that is installed on your Azure Kinect DK.
1. To get the latest firmware for your device, use the Azure Kinect Firmware Tool. For more information about how to check your firmware, see [Check device firmware version](azure-kinect-firmware-tool.md#check-device-firmware-version).

## Related topics

- [About Azure Kinect DK](about-azure-kinect-dk.md)
- [Set up Azure Kinect DK](set-up-azure-kinect-dk.md)
- [Azure Kinect DK hardware specifications: Operating environment](hardware-specification.md#operating-environment)
- [Azure Kinect Firmware Tool](azure-kinect-firmware-tool.md)
- [Azure Kinect Viewer](azure-kinect-viewer.md)
- [Synchronization across multiple Azure Kinect DK devices](multi-camera-sync.md)
