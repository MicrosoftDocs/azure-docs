---
title: Portal prep for StorSimple Virtual Array
description: First tutorial to deploy StorSimple virtual array involves preparing the Azure portal
author: alkohli
ms.assetid: 68a4cfd3-94c9-46cb-805c-46217290ce02
ms.service: storsimple
ms.topic: conceptual
ms.date: 07/25/2019
ms.author: alkohli
ms.custom: H1Hack27Feb2017
---
# Deploy StorSimple Virtual Array - Prepare the Azure portal

![](./media/storsimple-virtual-array-deploy1-portal-prep/getstarted4.png)


## Overview

[!INCLUDE [storsimple-virtual-array-eol-banner](../../includes/storsimple-virtual-array-eol-banner.md)]

This is the first article in the series of deployment tutorials required to completely deploy your virtual array as a file server or an iSCSI server using the Resource Manager model. This article describes the preparation required to create and configure your StorSimple Device Manager service prior to provisioning a virtual array. This article also links out to a deployment configuration checklist and configuration prerequisites.

You need administrator privileges to complete the setup and configuration process. We recommend that you review the deployment configuration checklist before you begin. The portal preparation takes less than 10 minutes.

The information published in this article applies to the deployment of StorSimple Virtual Arrays in the Azure portal and Microsoft Azure Government Cloud.

### Get started
The deployment workflow consists of preparing the portal, provisioning a virtual array in your virtualized environment, and completing the setup. To get started with the StorSimple Virtual Array deployment as a file server or an iSCSI server, you need to refer to the following tabulated resources.

#### Deployment articles

To deploy your StorSimple Virtual Array, refer to the following articles in the prescribed sequence.

| **#** | **In this step** | **You do this …** | **And use these documents.** |
| --- | --- | --- | --- |
| 1. |**Set up the Azure portal** |Create and configure your StorSimple Device Manager service prior to provisioning a StorSimple Virtual Array. |[Prepare the portal](storsimple-virtual-array-deploy1-portal-prep.md) |
| 2. |**Provision the Virtual Array** |For Hyper-V, provision and connect to a StorSimple Virtual Array on a host system running Hyper-V on Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2. <br></br> <br></br> For VMware, provision and connect to a StorSimple Virtual Array on a host system running VMware ESXi 5.0, 5.5, 6.0 or 6.5.<br></br> |[Provision a virtual array in Hyper-V](storsimple-virtual-array-deploy2-provision-hyperv.md) <br></br> <br></br> [Provision a virtual array in VMware](storsimple-virtual-array-deploy2-provision-vmware.md) |
| 3. |**Set up the Virtual Array** |For your file server, perform initial setup, register your StorSimple file server, and complete the device setup. You can then provision SMB shares. <br></br> <br></br> For your iSCSI server, perform initial setup, register your StorSimple iSCSI server, and complete the device setup. You can then provision iSCSI volumes. |[Set up virtual array as file server](storsimple-virtual-array-deploy3-fs-setup.md)<br></br> <br></br>[Set up virtual array as iSCSI server](storsimple-virtual-array-deploy3-iscsi-setup.md) |

You can now begin to set up the Azure portal.

## Configuration checklist

The configuration checklist describes the information that you need to collect before you configure the software on your StorSimple Virtual Array. Preparing this information ahead of time helps streamline the process of deploying the StorSimple device in your environment. Depending upon whether your StorSimple Virtual Array is deployed as a file server or an iSCSI server, you need one of the following checklists.

* Download the [StorSimple Virtual Array File Server Configuration Checklist](https://download.microsoft.com/download/E/E/6/EE690BB0-B442-4B84-8165-4731EE727ACF/MicrosoftAzureStorSimpleVirtualArrayFileServerConfigurationChecklist.pdf).
* Download the [StorSimple Virtual Array iSCSI Server Configuration Checklist](https://download.microsoft.com/download/E/E/6/EE690BB0-B442-4B84-8165-4731EE727ACF/MicrosoftAzureStorSimpleVirtualArrayiSCSIServerConfigurationChecklist.pdf).

## Prerequisites

Here you find the configuration prerequisites for your StorSimple Device Manager service, your StorSimple Virtual Array, and the datacenter network.

### For the StorSimple Device Manager service

Before you begin, make sure that:

* You have your Microsoft account with access credentials.
* You have your Microsoft Azure storage account with access credentials.
* Your Microsoft Azure subscription should be enabled for StorSimple Device Manager service.

### For the StorSimple Virtual Array

Before you deploy a virtual array, make sure that:

* You have access to a host system running Hyper-V on Windows Server 2008 R2 or later or VMware (ESXi 5.0, 5.5, 6.0 or 6.5) that can be used to a provision a device.
* The host system is able to dedicate the following resources to provision your virtual array:
  
  * A minimum of 4 cores.
  * At least 8 GB of RAM. If you plan to configure the virtual array as file server, 8 GB supports 2 million files. You need 16 GB RAM to support 2 - 4 million files.
  * One network interface.
  * A 500 GB virtual disk for system data.

### For the datacenter network

Before you begin, make sure that:

* The network in your datacenter is configured as per the networking requirements for your StorSimple device. For more information, see the [StorSimple Virtual Array System Requirements](storsimple-ova-system-requirements.md).
* Your StorSimple Virtual Array has a dedicated 5 Mbps Internet bandwidth (or more) available at all times. This bandwidth should not be shared with any other applications.

## Step-by-step preparation

Use the following step-by-step instructions to prepare your portal for the StorSimple Device Manager service.

## Step 1: Create a new service

A single instance of the StorSimple Device Manager service can manage multiple StorSimple Virtual Arrays. Perform the following steps to create an instance of the StorSimple Device Manager service. If you have an existing StorSimple Device Manager service to manage your virtual arrays, skip this step and go to [Step 2: Get the service registration key](#step-2-get-the-service-registration-key).

[!INCLUDE [storsimple-virtual-array-create-new-service](../../includes/storsimple-virtual-array-create-new-service.md)]

> [!IMPORTANT]
> If you did not enable the automatic creation of a storage account with your service, you will need to create at least one storage account after you have successfully created a service.
> 
> * If you did not create a storage account automatically, go to [Configure a new storage account for the service](#optional-step-configure-a-new-storage-account-for-the-service) for detailed instructions.
> * If you enabled the automatic creation of a storage account, go to [Step 2: Get the service registration key](#step-2-get-the-service-registration-key).
> 
> 

## Step 2: Get the service registration key

After the StorSimple Device Manager service is up and running, you will need to get the service registration key. This key is used to register and connect your StorSimple device with the service.

Perform the following steps in the [Azure portal](https://portal.azure.com/).

[!INCLUDE [storsimple-virtual-array-get-service-registration-key](../../includes/storsimple-virtual-array-get-service-registration-key.md)]

> [!NOTE]
> The service registration key is used to register all the StorSimple Device Manager devices that need to register with your StorSimple Device Manager service.
> 
> 

## Step 3: Download the virtual array image

After you have the service registration key, you will need to download the appropriate virtual array image to provision a virtual array on your host system. The virtual array images are operating system specific and can be downloaded from the Quick Start page in the Azure portal.

> [!IMPORTANT]
> The software running on the StorSimple Virtual Array may only be used with the StorSimple Device Manager service.
> 
> 

Perform the following steps in the [Azure portal](https://portal.azure.com/).

#### To get the virtual array image

1. Sign into the [Azure portal](https://portal.azure.com/). 
2. In the Azure portal, click **Browse > StorSimple Device Managers**.
3. Select an existing StorSimple Device Manager service. In the **StorSimple Device Manager** blade, click **Quick Start**. 
4. Click the link corresponding to the image that you want to download from the Microsoft Download Center. The image files are approximately 4.8 GB.
   
   * VHDX for Hyper-V on Windows Server 2012 and later
   * VHD for Hyper-V on Windows Server 2008 R2 and later
   * VMDK for VMWare ESXi 5.0, 5.5, 6.0 or 6.5
5. Download and unzip the file to a local drive, making a note of where the unzipped file is located.

## Optional step: Configure a new storage account for the service

This step is optional and should be performed only if you did not enable the automatic creation of a storage account with your service.

If you need to create an Azure storage account in a different region, see [How to create a storage account](../storage/common/storage-account-create.md) for step-by-step instructions.

Perform the following steps in the [Azure portal](https://ms.portal.azure.com/) on the StorSimple Device Manager service page to add an existing Microsoft Azure storage account.

#### To add a storage account credential that has the same Azure subscription as the Device Manager service

1. Navigate to your Device Manager service, select and double-click it. This opens the **Overview** blade.
2. Select **Storage account credentials** within the **Configuration** section.
3. Click **Add**.
4. In the **Add a storage account** blade, do the following:
   
   1. For **Subscription**, select **Current**.
   
   2. Provide the name of your Azure storage account.
   
   3. Select **Enable** to create a secure channel for network communication between your StorSimple device and the cloud. Select **Disable** only if you are operating within a private cloud.
   
   4. Click **Add**. You are notified after the storage account is successfully created.<br></br>
   
      ![Add an existing storage account credential](./media/storsimple-virtual-array-manage-storage-accounts/ova-add-storageacct.png)

## Next step

The next step is to provision a virtual machine for your StorSimple Virtual Array. Depending on your host operating system, see the detailed instructions in:

* [Provision a StorSimple Virtual Array in Hyper-V](storsimple-virtual-array-deploy2-provision-hyperv.md)
* [Provision a StorSimple Virtual Array in VMware](storsimple-virtual-array-deploy2-provision-vmware.md)

