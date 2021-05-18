---
title: Replace chassis on StorSimple 8000 series device | Microsoft Docs
description: Describes how to remove and replace the chassis for your StorSimple primary enclosure or EBOD enclosure.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: troubleshooting
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 06/05/2017
ms.author: alkohli

---
# Replace the chassis on your StorSimple device
## Overview
This tutorial explains how to remove and replace a chassis in a StorSimple 8000 series device. The StorSimple 8100 model is a single enclosure device (one chassis), whereas the 8600 is a dual enclosure device (two chassis). For an 8600 model, there are potentially two chassis that could fail in the device: the chassis for the primary enclosure or the chassis for the EBOD enclosure.

In either case, the replacement chassis that is shipped by Microsoft is empty. No Power and Cooling Modules (PCMs), controller modules, solid state disk drives (SSDs), hard disk drives (HDDs), or EBOD modules will be included.

> [!IMPORTANT]
> Before removing and replacing the chassis, review the safety information in [StorSimple hardware component replacement](storsimple-8000-hardware-component-replacement.md).


## Remove the chassis
Perform the following steps to remove the chassis on your StorSimple device.

#### To remove a chassis
1. Make sure that the StorSimple device is shut down and disconnected from all the power sources.
2. Remove all the network and SAS cables, if applicable.
3. Remove the unit from the rack.
4. Remove each of the drives and note the slots from which they are removed. For more information, see [Remove the disk drive](storsimple-8000-disk-drive-replacement.md#remove-the-disk-drive).
5. On the EBOD enclosure (if this is the chassis that failed), remove the EBOD controller modules. For more information, see [Remove an EBOD controller](storsimple-8000-ebod-controller-replacement.md#remove-an-ebod-controller).
   
    On the primary enclosure (if this is the chassis that failed), remove the controllers and note the slots from which they are removed. For more information, see [Remove a controller](storsimple-8000-controller-replacement.md#remove-a-controller).

## Install the chassis
Perform the following steps to install the chassis on your StorSimple device.

#### To install a chassis
1. Mount the chassis in the rack. For more information, see [Rack-mount your StorSimple 8100 device](storsimple-8100-hardware-installation.md#rack-mount-your-storsimple-8100-device) or [Rack-mount your StorSimple 8600 device](storsimple-8600-hardware-installation.md#rack-mount-your-storsimple-8600-device).
2. After the chassis is mounted in the rack, install the controller modules in the same positions that they were previously installed in.
3. Install the drives in the same positions and slots that they were previously installed in.
   
   > [!NOTE]
   > We recommend that you install the SSDs in the slots first, and then install the HDDs.
  
4. With the device mounted in the rack and the components installed, connect your device to the appropriate power sources, and turn on the device. For details, see [Cable your StorSimple 8100 device](storsimple-8100-hardware-installation.md#cable-your-storsimple-8100-device) or [Cable your StorSimple 8600 device](storsimple-8600-hardware-installation.md#cable-your-storsimple-8600-device).

## Next steps
Learn more about [StorSimple hardware component replacement](storsimple-8000-hardware-component-replacement.md).

