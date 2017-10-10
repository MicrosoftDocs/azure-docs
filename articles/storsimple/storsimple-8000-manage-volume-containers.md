---
title: Manage your StorSimple volume containers on the StorSimple 8000 series device| Microsoft Docs
description: Explains how you can use the StorSimple Device Manager service volume containers page to add, modify, or delete a volume container.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid:
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 07/19/2017
ms.author: alkohli

---
# Use the StorSimple Device Manager service to manage StorSimple volume containers

## Overview
This tutorial explains how to use the StorSimple Device Manager service to create and manage StorSimple volume containers.

A volume container in a Microsoft Azure StorSimple device contains one or more volumes that share storage account, encryption, and bandwidth consumption settings. A device can have multiple volume containers for all its volumes. 

A volume container has the following attributes:

* **Volumes** – The tiered or locally pinned StorSimple volumes that are contained within the volume container. 
* **Encryption** – An encryption key that can be defined for each volume container. This key is used for encrypting the data that is sent from your StorSimple device to the cloud. A military-grade AES-256 bit key is used with the user-entered key. To secure your data, we recommend that you always enable cloud storage encryption.
* **Storage account** – The Azure storage account that is used to store the data. All the volumes residing in a volume container share this storage account. You can choose a storage account from an existing list, or create a new account when you create the volume container and then specify the access credentials for that account.
* **Cloud bandwidth** – The bandwidth consumed by the device when the data from the device is being sent to the cloud. You can enforce a bandwidth control by specifying a value between 1 Mbps and 1,000 Mbps when you create this container. If you want the device to consume all available bandwidth, set this field to **Unlimited**. You can also create and apply a bandwidth template to allocate bandwidth based on schedule.

The following procedures explain how to use the StorSimple **Volume containers** blade to complete the following common operations:

* Add a volume container
* Modify a volume container
* Delete a volume container

## Add a volume container
Perform the following steps to add a volume container.

[!INCLUDE [storsimple-8000-add-volume-container](../../includes/storsimple-8000-create-volume-container.md)]

## Modify a volume container
Perform the following steps to modify a volume container.

[!INCLUDE [storsimple-8000-modify-volume-container](../../includes/storsimple-8000-modify-volume-container.md)]

## Delete a volume container
A volume container has volumes within it. It can be deleted only if all the volumes contained in it are first deleted. Perform the following steps to delete a volume container.

[!INCLUDE [storsimple-8000-delete-volume-container](../../includes/storsimple-8000-delete-volume-container.md)]

## Next steps
* Learn more about [managing StorSimple volumes](storsimple-8000-manage-volumes-u2.md). 
* Learn more about [using the StorSimple Device Manager service to administer your StorSimple device](storsimple-8000-manager-service-administration.md).

