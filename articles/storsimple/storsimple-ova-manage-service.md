<properties 
   pageTitle="Deploy the StorSimple Manager service for StorSimple virtual array| Microsoft Azure"
   description="Explains how to create and delete the StorSimple Manager service in the Azure classic portal, and describes how to manage the service registration key."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/19/2016"
   ms.author="alkohli" />

# Deploy the StorSimple Manager service for StorSimple Virtual Array

## Overview

The StorSimple Manager service runs in Microsoft Azure and connects to multiple StorSimple devices. After you create the service, you can use it to manage the devices from the Microsoft Azure classic portal running in a browser. This allows you to monitor all the devices that are connected to the StorSimple Manager service from a single, central location, thereby minimizing administrative burden.

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

This tutorial describes how to perform each of these tasks. The information contained in this article is applicable only to StorSimple Virtual Arrays. For more information on StorSimple 8000 series, go to [deploy a StorSimple Manager service](storsimple-manage-service.md).

## Create a service

Use the **Quick Create** option to create a StorSimple Manager service if you want to deploy your StorSimple device. To create a service, you need to have:

- A subscription with an Enterprise Agreement
- An active Microsoft Azure storage account
- The billing information that is used for access management

You can also choose to generate a default storage account when you create the service.

A single service can manage multiple devices. However, a device cannot span multiple services. A large enterprise can have multiple service instances to work with different subscriptions, organizations, or even deployment locations.  

> [AZURE.NOTE] You need separate instances of StorSimple Manager service to manage StorSimple 8000 series devices and StorSimple Virtual Arrays.

Perform the following steps to create a service.

[AZURE.INCLUDE [storsimple-ova-create-new-service](../../includes/storsimple-ova-create-new-service.md)]

## Delete a service

Before you delete a service, make sure that no connected devices are using it. If the service is in use, deactivate the connected devices. The deactivate operation will sever the connection between the device and the service, but preserve the device data in the cloud. 

> [AZURE.IMPORTANT] After a service is deleted, the operation cannot be reversed. 

Perform the following steps to delete a service.

### To delete a service

1. On the **StorSimple Manager service** page, select the service that you wish to delete.

1. Click **Delete** at the bottom of the page.

1. Click **Yes** in the confirmation notification. It may take a few minutes for the service to be deleted.

## Get the service registration key

After you have successfully created a service, you will need to register your StorSimple device with the service. To register your first StorSimple device, you will need the service registration key. To register additional devices with an existing StorSimple service, you will need both the registration key and the service data encryption key (which is generated on the first device during registration). For more information about the service data encryption key, see [Get the service data encryption key from the local web UI](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key). 

Perform the following steps to get the service registration key.

[AZURE.INCLUDE [storsimple-ova-get-service-registration-key](../../includes/storsimple-ova-get-service-registration-key.md)]

Keep the service registration key in a safe location. You will need this key, as well as the service data encryption key, to register additional devices with this service. After obtaining the service registration key, you will need to configure your device through the Windows PowerShell for StorSimple interface.

## Regenerate the service registration key

You will need to regenerate a service registration key if you are required to perform key rotation or if the list of service administrators has changed. When you regenerate the key, the new key is used only for registering subsequent devices. The devices that were already registered are unaffected by this process.

Perform the following steps to regenerate a service registration key.

### To regenerate the service registration key

1. On the **StorSimple Manager service** page, click **Registration Key**.

1. In the **Service Registration Key** dialog box, click **Regenerate**.

1. You will see a confirmation message. Click **OK** to continue with the regeneration.

1. A new service registration key will appear.

1. Copy this key and save it for registering any new devices with this service.

1. Click the check icon ![Check icon](./media/storsimple-ova-manage-service/image7.png) to close this dialog box.


## Next steps

- Learn how to [get started](storsimple-ova-deploy1-portal-prep.md) with a StorSimple virtual array.
	
- Learn how to [administer your StorSimple device](storsimple-ova-web-ui-admin.md).

 
