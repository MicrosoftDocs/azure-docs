---
title: StorSimple 8000 Series Update 5.2 release notes
description: Describes new features, issues, and workarounds for StorSimple 8000 Series Update 5.2.
author: alkohli
ms.assetid: 
ms.service: storsimple
ms.topic: conceptual
ms.date: 09/13/2022
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
> * Update 5.1 is a minimally supported version. Any device on version 5.0 or lower won’t see any available updates. If you're not notified about Update 5.2 via a banner in the Azure portal UI, you can't update via the Azure portal. In this case, you must [apply Update 5.1 via hotfix](storsimple-8000-install-update-51.md). Once you are on Update 5.1, you'll see the banner in the Azure portal to apply Update 5.2.

## What's new in Update 5.2

* **TLS 1.2 is a mandatory update for all StorSimple 8000 series devices.** This StorSimple update will enforce TLS 1.2 on all clients.

    If you see the following warning, you must update the software on your device before applying Update 5.2:

    "One or more StorSimple devices are running an older software version. The latest available update for TLS 1.2 is a mandatory update and should be installed immediately on these devices. TLS 1.2 is used for all Azure portal communication and without this update, the device won’t be able to communicate with the StorSimple service."

* **Automatic remediation for failed backups caused by a device controller left active for long periods.** When a device controller is continuously active for a long period (more than a year), scheduled and manually triggered backups may fail. No alert or other notification is raised in the Azure portal. The only way to recover is to initiate a controller failover. Update 5.2 detects this condition and remediates it by initiating a controller failover. An alert informs the customer.

* **Reliability issue fixed in backup code path** without which a backup could be corrupted in a rare scenario.

* **Issue with Local Only volume conversion fixed.** In earlier releases, Local only volume conversion might get stuck if the system restarts at a specific window of the conversion.

* **SHA 256 hashing algorithm is supported for the remote management certificate.** Remote management certificates are used while connecting to the PowerShell interface of the appliance, or during a Support session using remote PowerShell over Single Sockets Layer (SSL). Earlier releases use an SHA 128 hashing algorithm, which is considered weak. Update 5.2 uses SHA 256, which is considered more secure.

## Download Update 5.2

You must download and install the following hotfixes to the specified folders in the prescribed order. Update 5.2 takes 40-60 minutes to install.

| Order | KB       | Description | Update type | Install time |Install in folder|
|-------|----------|------------ |-------------|--------------|----- |
|1     |KB4645959|Software update 5.2 for StorSimple 8000 Series |Regular <br></br>Non-disruptive |~ 25 mins |FirstOrderUpdate|
|2     |KB4645960|OS Cumulative update 5.2 for StorSimple 8000 Series|Regular <br></br>Non-disruptive |~ 40 mins|SecondOrderUpdate|

## Download hotfixes

To download the hotfixes, follow the steps to [download software updates from the Microsoft Update Catalog](/azure/storsimple/storsimple-8000-install-update-5.md#to-download-hotfixes) and search for KB articles listed in the table above.

## Verify the updates

To verify Update 5.2, check for these software versions after installation:

* FriendlySoftwareVersion: StorSimple 8000 Series Update 5.2
* HcsSoftwareVersion: 6.3.9600.17886
* CisAgentVersion: 1.0.9777.0
* MdsAgentVersion: 35.2.2.0
* Lsisas2Version: 2.0.78.00

## Next steps

Install StorSimple 8000 Series Update 5.2.
