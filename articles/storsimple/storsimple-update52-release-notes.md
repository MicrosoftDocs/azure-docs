---
title: StorSimple 8000 Series Update 5.2 release notes
description: Describes new features, issues, and workarounds for StorSimple 8000 Series Update 5.2.
author: alkohli
ms.assetid: 
ms.service: storsimple
ms.topic: conceptual
ms.date: 09/26/2022
ms.author: alkohli
---

# StorSimple 8000 Series Update 5.2 release notes

[!INCLUDE [storsimple-8000-eol-banner](../../includes/storsimple-8000-eol-banner-2.md)]

## Overview

The following release notes describe new features and identify critical open issues for StorSimple 8000 Series Update 5.2. They also contain a list of the StorSimple software updates included in this release.

The release notes are continuously updated. As critical issues are discovered, they're added to the update. Before you deploy StorSimple 8000 Series, carefully review the information contained in these release notes.

Update 5.2 corresponds to software version 6.3.9600.17886.

> [!IMPORTANT]
>
> * Update 5.2 is a mandatory security update. It must be installed immediately to ensure the operation of the device. Microsoft implements a phased rollout, so your new release might not detect all available updates. To ensure a complete update to 5.2, wait a few days and then scan for updates again.
> * If you're not notified about Update 5.2 via a banner in the Azure portal UI, contact Microsoft Support.

## What's new in Update 5.2

* **Automatic remediation for failed backups caused by a device controller left active for long periods.** When a device controller is continuously active for a long period (more than a year), scheduled and manually triggered backups may fail. No alert or other notification is raised in the Azure portal. The only way to recover is to initiate a controller failover. Update 5.2 detects this condition and remediates it by initiating a controller failover. An alert informs the customer.

* **Reliability issue fixed in backup code path** without which a backup could be corrupted in a rare scenario.

* **Issue with Local Only volume conversion fixed.** In earlier releases, Local Only volume conversion might get stuck if the system restarts at a specific window of the conversion.

* **SHA 256 hashing algorithm is supported for the remote management certificate.** Remote management certificates are used while connecting to the PowerShell interface of the appliance, or during a Support session using remote PowerShell over Single Sockets Layer (SSL). Earlier releases use an SHA 128 hashing algorithm, which is considered weak. Update 5.2 uses SHA 256, which is considered more secure.

## Install Update 5.2

Use the following steps to install Update 5.2:

1. [Connect to Windows PowerShell on the StorSimple 8000 series device](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console), or connect directly to the appliance via serial cable.

1. Use [Start-HcsUpdate](/powershell/module/hcs/start-hcsupdate?view=winserver2012r2-ps&preserve-view=true) to update the device. For detailed steps, see [Install regular updates via Windows PowerShell](storsimple-update-device.md#to-install-regular-updates-via-windows-powershell-for-storsimple). This update is non-disruptive.

1. If ```Start-HcsUpdate``` doesn't work because of firewall issues, contact Microsoft Support. 

## Verify the updates

To verify Update 5.2, check for these software versions after installation:

* FriendlySoftwareVersion: StorSimple 8000 Series Update 5.2
* HcsSoftwareVersion: 6.3.9600.17886
* CisAgentVersion: 1.0.9777.0
* MdsAgentVersion: 35.2.2.0
* Lsisas2Version: 2.0.78.00

## Next steps

Install StorSimple 8000 Series Update 5.2. Steps to install Update 5.2 are largely the same as for installation of Update 5.1. For more information, see detailed steps in [Installing via the hotfix method](storsimple-8000-install-update-51.md). 
