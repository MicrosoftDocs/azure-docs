<properties 
   pageTitle="Deactivate and delete a StorSimple device | Microsoft Azure"
   description="Describes how to remove StorSimple device from service by  first deactivating it and then deleting it."
   services="storsimple"
   documentationCenter=""
   authors="SharS"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/01/2016"
   ms.author="anoobbacker" />

# Deactivate and delete a StorSimple device

## Overview

You may wish to take a StorSimple device out of service (for example, if you are replacing or upgrading your device or if you are no longer using StorSimple). If this is the case, you will need to deactivate the device before you can delete it. Deactivating severs the connection between the device and the corresponding StorSimple Manager service. This tutorial explains how to remove a StorSimple device from service by first deactivating it and then deleting it. 

When you deactivate a device, any data that was stored locally on the device will no longer be accessible. Only the data associated with the device that was stored in the cloud can be recovered.  

>[AZURE.WARNING] Deactivation is a PERMANENT operation and cannot be undone. A deactivated device cannot be registered with the StorSimple Manager service unless it is first reset by the factory. 
>
>The factory reset process deletes all the data that was stored locally on your device. Therefore, it is essential that you take a cloud snapshot of all your data before you deactivate a device. This will allow you to recover all the data at a later stage.

This tutorial explains how to:

- Deactivate a device and delete the data
- Deactivate a device and retain the data

It also explains how deactivation and deletion works on a StorSimple virtual device.

>[AZURE.NOTE] Before you deactivate a StorSimple physical or virtual device, make sure to stop or delete clients and hosts that depend on that device.

## Deactivate and delete data

If you are interested in deleting the device completely and do not want to retain the data on the device, then complete the following steps.

#### To deactivate the device and delete the data  

1. Prior to deactivating a device, you must delete all the volume containers (and the volumes) associated with the device. You can delete volume containers only after you have deleted the associated backups.

2. Deactivate the device as follows:

    1. On the StorSimple Manager service **Devices** page, select the device that you wish to deactivate and, at the bottom of the page, click **Deactivate**.

    2. A confirmation message will appear. Click **Yes** to continue. The deactivate process will start and take a few minutes to complete.

3. After deactivation, you can delete the device completely. Deleting a device removes it from the list of devices connected to the service. The service can then no longer manage the deleted device. Use the following steps to delete the device:

    1. On the StorSimple Manager service **Devices** page, select a deactivated device that you wish to delete.

    2. On the bottom on the page, click **Delete**.

    3. You will be prompted for confirmation. Click **Yes** to continue.

    It may take a few minutes for the device to be deleted.

## Deactivate and retain data

If you are interested in deleting the device but want to retain the data, then complete the following steps.

####To deactivate a device and retain the data 

1. Deactivate the device. All the volume containers and the snapshots of the device will remain.

    1. On the StorSimple Manager service **Devices** page, select the device that you wish to deactivate and, at the bottom of the page, click **Deactivate**.

    2. A confirmation message will appear. Click **Yes** to continue. The deactivate process will start and take a few minutes to complete.

2. You can now fail over the volume containers and the associated snapshots. For procedures, go to [Failover and disaster recovery for your StorSimple device](storsimple-device-failover-disaster-recovery.md).

3. After deactivation and failover, you can delete the device completely. Deleting a device removes it from the list of devices connected to the service. The service can then no longer manage the deleted device. Complete the following steps to delete the device:
 
    1. On the StorSimple Manager service **Devices** page, select a deactivated device that you wish to delete.

    2. On the bottom on the page, click **Delete**.

    3. You will be prompted for confirmation. Click **Yes** to continue.

    It may take a few minutes for the device to be deleted.

## Deactivate and delete a virtual device

For a StorSimple virtual device, deactivation deallocates the virtual machine. You can then delete the virtual machine and the resources created when it was provisioned. After the virtual device is deactivated, it cannot be restored to its previous state. 

Deactivation results in the following actions:

- The StorSimple virtual device is removed.

- The OSDisk and Data Disks created for the StorSimple virtual device are removed.

- The Hosted Service and Virtual Network that were created during provisioning are retained. If you are not using these entities, you should delete them manually.

- Cloud snapshots created by the StorSimple virtual device are retained.

## Next steps
- To restore the deactivated device to factory defaults, go to [Reset the device to factory default settings](storsimple-manage-device-controller.md#reset-the-device-to-factory-default-settings).

- For technical assistance, [contact Microsoft Support](storsimple-contact-microsoft-support.md).

- To learn more about how to use the StorSimple Manager service, go to [Use the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md). 
