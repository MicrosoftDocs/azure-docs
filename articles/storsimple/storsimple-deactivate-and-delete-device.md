<properties 
   pageTitle="Deactivate and delete a StorSimple device | Microsoft Azure"
   description="Describes how to remove StorSimple device from service by  first deactivating it and then deleting it."
   services="storsimple"
   documentationCenter=""
   authors="SharS"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/01/2015"
   ms.author="v-sharos" />

# Deactivate and delete a StorSimple device

This tutorial explains how to remove a StorSimple device from service by deactivating it and then deleting it.

>[AZURE.NOTE] You must deactivate a device before you can delete it.

## Deactivate a device

You may wish to take a device out of service. In this case, the device will need to be deactivated. Deactivating severs the connection between the device and the corresponding StorSimple Manager service. 

>[AZURE.WARNING] Deactivation is a PERMANENT operation and cannot be undone. A deactivated device cannot be registered with the StorSimple Manager service unless it is first reset by the factory. 

When you deactivate a device, any data that was stored locally on the device will no longer be accessible. Only the data associated with the device that was stored in the cloud can be recovered. Once deactivated, a device needs to be factory reset before it can be reused with an existing or a new service. The factory reset process deletes all the data that was stored locally on your device. Therefore, it is essential that you take a cloud snapshot of all your data before you deactivate a device. This will allow you to recover all the data at a later stage. 

For a StorSimple virtual device, deactivation deletes the virtual machine and the resources created when it was provisioned. After the virtual device is deactivated, it cannot be restored to its previous state. Before you deactivate a StorSimple virtual device, make sure to stop or delete clients and hosts that depend on that virtual device.

### Deactivate and delete data

If you are interested in deleting the device completely and do not want to retain the device data, then do the following:  

1. Prior to deactivating a device, you must delete all the volume containers (and the volumes) associated with the device. You can only delete volume containers after you have deleted the associated backups.

2. Deactivate the device. Go to [Steps to deactivate](#steps-to-deactivate) for instructions.

3. After deactivation, you can delete the device completely. Go to [Delete a device](#delete-a-device) for instructions.

### Deactivate and retain data

If you are interested in deleting the device but want to retain the device data, then do the following:  

1. Deactivate the device. All the volume containers and the snapshots of the device will remain. Go to [Steps to deactivate](#steps-to-deactivate) for instructions.

2. You can now fail over the volume containers and the associated snapshots. For procedures, go to [Failover and disaster recovery for your StorSimple device](storsimple-device-failover-disaster-recovery.md).

3. After deactivation and failover, you can delete the device completely. Go to [Delete a device](#delete-a-device) for instructions.

### Steps to deactivate

Use the following procedure to deactivate a device in preparation for deleting it.

#### To deactivate a device

1. On the StorSimple Manager service **Devices** page, select the device that you wish to deactivate and, at the bottom of the page, click **Deactivate**.

2. A confirmation message will appear. Click **Yes** to continue. The deactivate process will start and take a few minutes to complete.

    On a StorSimple virtual device, deactivation results in the following actions:

      - The StorSimple virtual device is removed.

      - The OSDisk and Data Disks created for the StorSimple virtual device are removed.

      - The Hosted Service and Virtual Network that were created during provisioning are retained. If you are not using these entities, you should delete them manually.

      - Cloud snapshots created by the StorSimple virtual device are retained.

<!--After the device is deactivated, you will need to perform a failover before you can delete it completely. For failover instructions, go to [Failover and disaster recovery for your StorSimple device](storsimple-device-failover-disaster-recovery.md).-->
 
## Delete a device

You can delete only those devices that have been deactivated. Deleting a device removes it from the list of devices connected to the service. The service can then no longer manage the deleted device.

#### To delete a device

1. On the StorSimple Manager service **Devices** page, select a deactivated device that you wish to delete.

2. On the bottom on the page, click **Delete**.

3. You will be prompted for confirmation. Click **Yes** to continue.

It may take a few minutes for the device to be deleted.

## Next steps
To restore the deactivated device to factory defaults, go to [Reset the device to factory default settings](storsimple-manage-device-controller.md#reset-the-device-to-factory-default-settings).

For technical assistance, [contact Microsoft Support](storsimple-contact-microsoft-support.md).