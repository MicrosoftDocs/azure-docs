---
title: Microsoft Azure StorSimple Virtual Array Update 1.3 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 1.3.
services: storsimple
author: priestlg

ms.service: storsimple
ms.topic: article
ms.date: 03/05/2020
ms.author: v-grpr
---

# StorSimple Virtual Array Update 1.3 release notes

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated. As critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 1.3 corresponds to the software version **10.0.xxxxx.0**.

> [!IMPORTANT]
> - Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime. For detailed instructions on packages used to apply this update, go to [Download Update 1.3](#download-update-13).
> - Update 1.3 is available to you through the Azure portal only if your device is running Update 1.2.

## What's new in Update 1.3

This update contains the following improvements:

- TLS 1.2 enforcement on all clients
- Base OS image update

## Download Update 1.3

To download this update, go to the [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Home.aspx) server, and download the KB4539946 package. This package contains the following packages:

 - **KB4537819** that contains cumulative Windows Updates for 2012 R2 up to March 2020. For more information on what is included in this rollup, go to [February monthly security rollup](https://support.microsoft.com/help/4537819).
 - **KB4539946** which is a Microsoft Update Standalone Package file WindowsTH-KB4539946-x64. This file is used to update the device software.

Download KB4539946 and follow these instructions to [Apply the update via local web UI](storsimple-virtual-array-install-update-11.md#use-the-local-web-ui).

## Known issues in Update 1.3

No new issues were release-noted in Update 1.2. All the release-noted issues are carried over from previous releases. To see the summary of known issues included from the previous releases, go to [Known issues in Update 1.1](storsimple-virtual-array-update-11-release-notes.md#known-issues-in-update-11).

## Next steps

Download KB4539946 and [Apply the update via local web UI](storsimple-virtual-array-install-update-11.md#use-the-local-web-ui).

## References

Looking for an older release note? Go to:
* [StorSimple Virtual Array Update 1.2 Release Notes](storsimple-virtual-array-update-12-release-notes.md)
* [StorSimple Virtual Array Update 1.1 Release Notes](storsimple-virtual-array-update-11-release-notes.md)
* [StorSimple Virtual Array Update 1.0 Release Notes](storsimple-virtual-array-update-1-release-notes.md)
* [StorSimple Virtual Array Update 0.6 Release Notes](storsimple-virtual-array-update-06-release-notes.md)
* [StorSimple Virtual Array Update 0.5 Release Notes](storsimple-virtual-array-update-05-release-notes.md)
* [StorSimple Virtual Array Update 0.4 Release Notes](storsimple-virtual-array-update-04-release-notes.md)
* [StorSimple Virtual Array Update 0.3 Release Notes](storsimple-ova-update-03-release-notes.md)
* [StorSimple Virtual Array Update 0.1 and 0.2 Release Notes](storsimple-ova-update-01-release-notes.md)
* [StorSimple Virtual Array General Availability Release Notes](storsimple-ova-pp-release-notes.md)
