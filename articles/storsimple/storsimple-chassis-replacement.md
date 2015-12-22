<properties 
   pageTitle="Replace the chassis on a StorSimple device | Microsoft Azure"
   description="Describes how to remove and replace the chassis on your StorSimple primary device or EBOD enclosure."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/31/2015"
   ms.author="alkohli" />

# Replace the chassis on your StorSimple device

## Overview

This tutorial explains how to remove and replace a chassis in a StorSimple device. The StorSimple 8100 model is a single enclosure device (one chassis), whereas the 8600 is a dual enclosure device (two chassis). For an 8600 model, there are potentially two chassis that can fail in the device: the chassis for the primary enclosure or the chassis for the EBOD enclosure.

In either case, the replacement chassis that is shipped by Microsoft will be empty. No Power and Cooling Modules (PCMs), controller modules, solid state disk drives (SSDs), hard disk drives (HDDs), or EBOD modules will be included.

>[AZURE.IMPORTANT] Before removing and replacing the chassis, review the safety information in [StorSimple hardware component replacement](storsimple-hardware-component-replacement.md).

## Remove the chassis

Perform the following steps to remove the chassis on your StorSimple device.

#### To remove a chassis

1. Make sure that the StorSimple device is shut down and disconnected from all power sources.

2. Remove all the network and SAS cables, if applicable.

3. Remove the unit from the rack.

4. Remove each of the drives and note the slots from which they are removed. For more information, see [Remove the disk drive](storsimple-disk-drive-replacement.md#remove-the-disk-drive).

5. On the EBOD enclosure (if this is the chassis that failed), remove the EBOD controller modules. For more information, see [Remove an EBOD controller](storsimple-ebod-controller-replacement.md#remove-an-ebod-controller). 

    On the primary enclosure (if this is the chassis that failed), remove the controllers and note the slots from which they are removed. For more information, see [Remove a controller](storsimple-controller-replacement.md#remove-a-controller).

## Install the chassis

Perform the following steps to install the chassis in a Microsoft Azure StorSimple device.

#### To install a chassis

1. Mount the chassis in the rack. For more information, see [Rack-mount your StorSimple 8100 device](storsimple-8100-hardware-installation.md#rack-mount-your-storsimple-8100-device) or [Rack-mount your StorSimple 8600 device](storsimple-8600-hardware-installation.md#rack-mount-your-storsimple-8600-device).

2. After the chassis is mounted in the rack, install the controller modules in the same positions that they were previously installed in.

3. Install the drives in the same positions and slots that they were previously installed in.

    >[AZURE.NOTE] In general, we recommend that you put the SSDs in the slots first, and then install the HDDs.

2. With the device mounted in the rack and the components installed, connect your device to the appropriate power sources, and turn on the device. For details, see [Cable your StorSimple 8100 device](storsimple-8100-hardware-installation.md#cable-your-storsimple-8100-device) or [Cable your StorSimple 8600 device](storsimple-8600-hardware-installation.md#cable-your-storsimple-8600-device).

## Next steps

Learn more about [StorSimple hardware component replacement](storsimple-hardware-component-replacement.md).

