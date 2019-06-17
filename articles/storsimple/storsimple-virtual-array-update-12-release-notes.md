---
title: Microsoft Azure StorSimple Virtual Array Update 1.2 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 1.2.
services: storsimple
author: alkohli

ms.service: storsimple
ms.topic: article
ms.date: 05/29/2019
ms.author: alkohli
---

# StorSimple Virtual Array Update 1.2 release notes

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated. As critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 1.2 corresponds to the software version **10.0.10311.0**.

> [!IMPORTANT]
> - Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime. For detailed instructions on packages used to apply this update, go to [Download Update 1.2](#download-update-12).
> - Update 1.2 is available to you via the Azure portal only if your device is running Update 1.0 or 1.1.

## What's new in Update 1.2

This update contains the following bug fixes:

- Improved resiliency when processing deleted files.
- Improved handling exceptions in the code startup path leading to reduced failures in backups, restore, cloud-reads, and automated space reclamation.

## Download Update 1.2

To download this update, go to the [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Home.aspx) server, and download the KB4502035 package. This package contains the following packages:

 - **KB4493446** that contains cumulative Windows Updates for 2012 R2 up to April 2019. For more information on what is included in this rollup, go to [April monthly security rollup](https://support.microsoft.com/help/4493446/windows-8-1-update-kb4493446).
 - **KB3011067** which is a Microsoft Update Standalone Package file WindowsTH-KB3011067-x64. This file is used to update the device software.

Download KB4502035 and follow these instructions to [Apply the update via local web UI](storsimple-virtual-array-install-update-11.md#use-the-local-web-ui).

## Issues fixed in Update 1.2

The following table provides a summary of issues fixed in this release.

| No. | Feature | Issue |
| --- | --- | --- |
| 1 |Deletion| In the previous versions of the software, there was an issue when the usage of the device didn't change even when files were deleted. This issue is fixed in this version. Tiering code path was made more resilient when processing deleted files.|
| 2 |Exception handling| In the previous versions of the software, there was an issue following the system reboot that could potentially lead to failures in backups, restore, reading from the cloud, and automated space reclamation. This release contains changes as to how the exceptions were handled in the startup path.|

## Known issues in Update 1.2

No new issues were release-noted in Update 1.2. All the release-noted issues are carried over from previous releases. To see the summary of known issues included from the previous releases, go to [Known issues in Update 1.1](storsimple-virtual-array-update-11-release-notes.md#known-issues-in-update-11).

## Next steps

Download KB4502035 and [Apply the update via local web UI](storsimple-virtual-array-install-update-11.md#use-the-local-web-ui).

## References

Looking for an older release note? Go to:
* [StorSimple Virtual Array Update 1.1 Release Notes](storsimple-virtual-array-update-11-release-notes.md)
* [StorSimple Virtual Array Update 1.0 Release Notes](storsimple-virtual-array-update-1-release-notes.md)
* [StorSimple Virtual Array Update 0.6 Release Notes](storsimple-virtual-array-update-06-release-notes.md)
* [StorSimple Virtual Array Update 0.5 Release Notes](storsimple-virtual-array-update-05-release-notes.md)
* [StorSimple Virtual Array Update 0.4 Release Notes](storsimple-virtual-array-update-04-release-notes.md)
* [StorSimple Virtual Array Update 0.3 Release Notes](storsimple-ova-update-03-release-notes.md)
* [StorSimple Virtual Array Update 0.1 and 0.2 Release Notes](storsimple-ova-update-01-release-notes.md)
* [StorSimple Virtual Array General Availability Release Notes](storsimple-ova-pp-release-notes.md)
