---
title: StorSimple 8000 Series Update 5.1 release notes
description: Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 5.1.
author: alkohli
ms.assetid: 
ms.service: storsimple
ms.topic: conceptual
ms.date: 04/14/2021
ms.author: alkohli

---
# StorSimple 8000 Series Update 5.1 release notes

## Overview

The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 5.1. They also contain a list of the StorSimple software updates included in this release.

Update 5.1 can be applied to any StorSimple device running Update 5. If you're are using a version lower than 5, apply Update 5 first, and then apply Update 5.1. The device version associated with Update 5.1 is 6.3.9600.17885.

Review the information contained in the release notes before you deploy the update in your StorSimple solution.

> [!IMPORTANT]
>
> * Update 5.1 is a mandatory update and must be installed immediately to ensure the operation of the device. Update 5.0 is a minimally supported version.
> * Update 5.1 has security updates that take about 30 minutes to install. For more information, see how to [Apply Update 5.1](storsimple-8000-install-update-51.md).

## What's new in Update 5.1

The following key improvements and bug fixes have been made in Update 5.1:

* **TLS 1.2** - This StorSimple update will enforce TLS 1.2 on all clients. TLS 1.2 is a mandatory update for all StorSimple 8000 series devices.

   If you see the following warning, you must update the software on the device before proceeding:

   One or more StorSimple devices are running an older software version. The latest available update for TLS 1.2 is a mandatory update and should be installed immediately on these devices. TLS 1.2 is used for all Azure portal communication and without this update, the device won’t be able to communicate with the StorSimple service.

## Known issues in Update 5.1 from previous releases

There are no new known issues in Update 5.1. For a list of issues carried over to Update 5.1 from previous releases, go to [Update 3 release notes](storsimple-update3-release-notes.md#known-issues-in-update-3).

## StorSimple Cloud Appliance updates in Update 5.1

This update cannot be applied to the StorSimple Cloud Appliance (also known as the virtual device). You will need to create new cloud appliances using the Update 5.1 image. For information on how to create a StorSimple Cloud Appliance, go to [Deploy and manage a StorSimple Cloud Appliance](storsimple-8000-cloud-appliance-u2.md).

## Next step

Learn how to [install Update 5.1](storsimple-8000-install-update-51.md) on your StorSimple device.
