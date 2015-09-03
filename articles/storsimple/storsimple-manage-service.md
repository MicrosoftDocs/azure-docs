<properties 
   pageTitle="Deploy the StorSimple Manager service | Microsoft Azure"
   description="Explains how to create and delete the StorSimple Manager service in the Management Portal, and describes how to manage the service registration key."
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
   ms.date="09/02/2015"
   ms.author="v-sharos" />

# Deploy the StorSimple Manager service

## Overview

The StorSimple Manager service runs in Microsoft Azure and connects to multiple StorSimple devices. After you create the service, you can use it to manage the devices from the Microsoft Azure Management Portal running in a browser. This allows you to monitor all the devices that are connected to the StorSimple Manager service from a single, central location, thereby minimizing administrative burden.

The StorSimple Manager landing page lists all the StorSimple Manager services that you can use to manage your StorSimple storage devices. For each StorSimple Manager service, the following information is presented on the StorSimple Manager page:

- **Name** – The name that was assigned to your StorSimple Manager service when it was created. The service name cannot be changed after the service is created.

- **Status** – The status of the service, which can be **Active**, **Creating**, or **Online**.

- **Location** – The geographical location in which the StorSimple device will be deployed.

- **Subscription** – The billing subscription that is associated with your service.

The common tasks that can be performed through the StorSimple Manager page are:

- Create a service
- Delete a service
- Get the service registration key
- Regenerate the service registration key

This tutorial describes how to perform each of these tasks.

## Create a service

Use the **Quick Create** option to create a StorSimple Manager service if you want to deploy your StorSimple device. To create a service, you need to have:

- A subscription with an Enterprise Agreement
- An active Microsoft Azure storage account
- The billing information that is used for access management

You can also choose to generate a default storage account when you create the service.

A single service can manage multiple devices. However, a device cannot span multiple services. A large enterprise can have multiple service instances to work with different subscriptions, organizations, or even deployment locations.

Perform the following steps to create a service.

[AZURE.INCLUDE [storsimple-create-new-service](../../includes/storsimple-create-new-service.md)]

## Delete a service

Before you delete a service, make sure that no connected devices are using it. If the service is in use, deactivate the connected devices. The deactivate operation will sever the connection between the device and the service, but preserve the device data in the cloud. 

[AZURE.IMPORTANT] After a service is deleted, the operation cannot be reversed. Any device that was using the service will need to be factory reset before it can be used with another service. In this scenario, the local data on the device, as well as the configuration, will be lost.

Perform the following steps to delete a service.

### To delete a service

1. On the **StorSimple Manager service** page, select the service that you wish to delete.

1. Click **Delete** at the bottom of the page.

1. Click **Yes** in the confirmation notification. It may take a few minutes for the service to be deleted.

## Get the service registration key

After you have successfully created a service, you will need to register your StorSimple device with the service. To register your first StorSimple device, you will need the service registration key. To register additional devices with an existing StorSimple service, you will need both the registration key and the service data encryption key (which is generated on the first device during registration). For more information about the service data encryption key, see [StorSimple security](storsimple-security.md). You can get the registration key by accessing **Registration Key** on the **Services** page.

Perform the following steps to get the service registration key.

[AZURE.INCLUDE [storsimple-get-service-registration-key](../../includes/storsimple-get-service-registration-key.md)]

Keep the service registration key in a safe location. You will need this key, as well as the service data encryption key, to register additional devices with this service. After obtaining the service registration key, you will need to configure your device through the Windows PowerShell for StorSimple interface.

For details on how to use this registration key, see [Step 3: Configure and register the device through Windows PowerShell for StorSimple](storsimple-deployment-walkthrough.md#step-2-configure-and-register-the-device-through-windows-powershell-for-storsimple).

## Regenerate the service registration key

You will need to regenerate a service registration key if you are required to perform key rotation or if the list of service administrators has changed. When you regenerate the key, the new key is used only for registering subsequent devices. The devices that were already registered are unaffected by this process.

Perform the following steps to regenerate a service registration key.

### To regenerate the service registration key

1. On the **StorSimple Manager service** page, click **Registration Key**.

1. In the **Service Registration Key** dialog box, click **Regenerate**.

1. You will see a confirmation message. Click **OK** to continue with the regeneration.

1. A new service registration key will appear.

1. Copy this key and save it for registering any new devices with this service.

1. Click the check icon ![Check icon](./media/storsimple-manage-service/HCS_CheckIcon.png) to close this dialog box.


## Next steps

[Learn more about the StorSimple deployment process](storsimple-deployment-walkthrough.md).

[Learn more about managing your StorSimple storage account](storsimple-manage-storage-accounts.md).

 