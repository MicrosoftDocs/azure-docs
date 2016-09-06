<properties
   pageTitle="Deploy StorSimple Virtual Array 1 - Portal Preparation"
   description="First tutorial to deploy StorSimple virtual array involves preparing the portal"
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/24/2016"
   ms.author="alkohli"/>

# Deploy StorSimple Virtual Array - Prepare the portal

![](./media/storsimple-ova-deploy1-portal-prep/getstarted4.png)

## Overview

This article applies to Microsoft Azure StorSimple Virtual Array (also known as the StorSimple on-premises virtual device or StorSimple virtual device) running March 2016 general availability (GA) release. This is the first article in the series of deployment tutorials required to completely deploy your virtual array as a file server or an iSCSI server. This article describes the preparation required to create and configure your StorSimple Manager service prior to provisioning a virtual array. This article also links out to a deployment configuration checklist as well as configuration prerequisites.

You will need administrator privileges to complete the setup and configuration process. We recommend that you review the deployment configuration checklist before you begin. The portal preparation will take less than 10 minutes.

The information published in this article applies to the deployment of StorSimple Virtual Arrays in Azure classic portal as well as Microsoft Azure Government Cloud.

### Get started

The deployment workflow consists of preparing the portal, provisioning a virtual array in your virtualized environment, and completing the setup. To get started with the StorSimple Virtual Array deployment as a file server or an iSCSI server, you will need to refer to the following tabulated resources (articles and videos).

#### Deployment articles

Refer to the following articles in the prescribed sequence to deploy your StorSimple Virtual Array.

| **#** | **In this step**                          | **You will do this …**                                                         | **Use these documents.**|
|------|-------------------------------------------|--------------------------------------------------------------------------------|------------------------|
|1.   | **Set up the Azure classic portal**       | Create and configure your StorSimple Manager service prior to provisioning a StorSimple virtual device.  |[Prepare the portal](storsimple-ova-deploy1-portal-prep.md)|
|2.   | **Provision the Virtual Array**           | For Hyper-V, provision and connect to a StorSimple virtual device on a host system running Hyper-V on Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2. <br></br> <br></br> For VMware, provision and connect to a StorSimple on-premises virtual device on a host system running VMware ESXi 5.5 and above.<br></br>| [Provision a virtual array in Hyper-V](storsimple-ova-deploy2-provision-hyperv.md) <br></br> <br></br> [Provision a virtual array in VMware](storsimple-ova-deploy2-provision-vmware.md)|
|3.    | **Set up the Virtual Array**              | For your file server, perform initial setup, register your StorSimple file server, and complete the device setup. You can then provision SMB shares. <br></br> <br></br> For your iSCSI server, perform initial setup, register your StorSimple iSCSI server, and complete the device setup. You can then provision iSCSI volumes.| [Set up virtual array as file server](storsimple-ova-deploy3-fs-setup.md)<br></br> <br></br>[Set up virtual array as iSCSI server](storsimple-ova-deploy3-iscsi-setup.md)|

#### Deployment videos

| **To do this step...** |  **Watch this video.**|
|----------------|-------------|
| Step-by-step instructions to get started with the StorSimple Virtual Array. | [Get started with the StorSimple Virtual Array](https://azure.microsoft.com/documentation/videos/get-started-with-the-storsimple-virtual-array/)|
| Step-by-step instructions to provision a StorSimple Virtual Array in Hyper-V.|[Create a StorSimple Virtual Array](https://azure.microsoft.com/documentation/videos/create-a-storsimple-virtual-array/) |
|Step-by-step instructions to configure and register a StorSimple Virtual Array|[Configure a StorSimple Virtual Array](https://azure.microsoft.com/documentation/videos/configure-a-storsimple-virtual-array/)|
|Step-by-step instructions to create shares, back up shares, and restore data on a StorSimple Virtual Array configured as a file server|[Use the StorSimple Virtual Array](https://azure.microsoft.com/documentation/videos/use-the-storsimple-virtual-array/)|
|Step-by-step instructions for failover and disaster recovery of a StorSimple Virtual Array|[StorSimple Virtual Array Disaster Recovery](https://azure.microsoft.com/documentation/videos/storsimple-virtual-array-disaster-recovery/)

You can now begin to set up the Azure classic portal.

## Configuration checklist

The configuration checklist describes the information that you need to collect before you configure the software on your StorSimple device. Preparing this information ahead of time will help streamline the process of deploying the StorSimple device in your environment. Depending upon whether your StorSimple virtual device will be deployed as a file server or an iSCSI server, you will need one of the following checklists.

-   Download the [StorSimple Virtual Array File Server Configuration Checklist](http://download.microsoft.com/download/E/E/6/EE690BB0-B442-4B84-8165-4731EE727ACF/MicrosoftAzureStorSimpleVirtualArrayFileServerConfigurationChecklist.pdf).

-   Download the [StorSimple Virtual Array iSCSI Server Configuration Checklist](http://download.microsoft.com/download/E/E/6/EE690BB0-B442-4B84-8165-4731EE727ACF/MicrosoftAzureStorSimpleVirtualArrayiSCSIServerConfigurationChecklist.pdf).

## Prerequisites

Here you will find the configuration prerequisites for your StorSimple Manager service, your StorSimple virtual device, and the datacenter network.

### For the StorSimple Manager service

Before you begin, make sure that:

-   You have your Microsoft account with access credentials.

-   You have your Microsoft Azure storage account with access credentials.

-   Your Microsoft Azure subscription should be enabled for StorSimple Manager service.

### For the StorSimple virtual device

Before you deploy a virtual device, make sure that:

-   You have access to a host system running Hyper-V on Windows Server 2008 R2 or later or VMware (ESXi 5.5 or later) that can be used to a provision a device.

-   The host system is able to dedicate the following resources to provision your virtual device:

	-   A minimum of 4 cores.

	-   At least 8 GB of RAM.

	-   One network interface.

	-   A 500 GB virtual disk for system data.

### For the datacenter network

Before you begin, make sure that:

-   The network in your datacenter is configured as per the networking requirements for your StorSimple device. For more information, see the [StorSimple Virtual Array System Requirements](storsimple-ova-system-requirements.md).

-   Your StorSimple virtual device has a dedicated 5 Mbps Internet bandwidth (or more) available at all times. This bandwidth should not be shared with any other applications.

## Step-by-step preparation

Use the following step-by-step instructions to prepare your portal for the StorSimple Manager service.

## Step 1: Create a new service

A single instance of the StorSimple Manager service can manage multiple StorSimple 1200 devices. Perform the following steps to create a new instance of the StorSimple Manager service. If you have an existing StorSimple Manager service to manage your 1200 devices, skip this step and go to [Step2: Get the service registration key](#step-2-get-the-service-registration-key).

[AZURE.INCLUDE [storsimple-ova-create-new-service](../../includes/storsimple-ova-create-new-service.md)]

> [AZURE.IMPORTANT]
>
> If you did not enable the automatic creation of a storage account with your service, you will need to create at least one storage account after you have successfully created a service.
>

> - If you did not create a storage account automatically, go to [Configure a new storage account for the service](#optional-step-configure-a-new-storage-account-for-the-service) for detailed instructions.
>

> - If you enabled the automatic creation of a storage account, go to [Step 2: Get the service registration key](#step-2-get-the-service-registration-key).


## Step 2: Get the service registration key


After the StorSimple Manager service is up and running, you will need to get the service registration key. This key is used to register and connect your StorSimple device with the service.

Perform the following steps in the [Azure classic portal](https://manage.windowsazure.com/).


[AZURE.INCLUDE [storsimple-ova-get-service-registration-key](../../includes/storsimple-ova-get-service-registration-key.md)]

> [AZURE.NOTE]
>
> The service registration key is used to register all the StorSimple Manager devices that need to register with your StorSimple Manager service.

## Step 3: Download the virtual device image

After you have the service registration key, you will need to download the appropriate virtual device image to provision a virtual device on your host system. The virtual device images are operating system specific and can be downloaded from the Quick Start page in the Azure classic portal.

> [AZURE.IMPORTANT] The software running on the StorSimple Virtual Array may only be used in conjunction with the Storsimple Manager service.


Perform the following steps in the [Azure classic portal](https://manage.windowsazure.com/).

#### To get the virtual device image

1.  On the **StorSimple Manager service** page, click the service that you created. This will take you to the **Quick Start** page. (You can click the quick start icon ![](./media/storsimple-ova-deploy1-portal-prep/image8.png) to access the **Quick Start** page at any time.)

1.  Click the link corresponding to the image that you want to download from the Microsoft Download Center. The image files are approximately 4.8 GB.

	-   VHDX for Hyper-V on Windows Server 2012 and later

	-   VHD for Hyper-V on Windows Server 2008 R2 and later

	-   VMDK for VMWare ESXi 5.5 and later

2.  Download and unzip the file to a local drive, making a note of where the unzipped file is located.

![video icon](./media/storsimple-ova-deploy1-portal-prep/video_icon.png) **Video available**

Watch the video for step-by-step instructions to get started with the StorSimple Virtual Array.

> [AZURE.VIDEO get-started-with-the-storsimple-virtual-array]



## Optional step: Configure a new storage account for the service

This is an optional step that needs to be performed only if you did not enable the automatic creation of a storage account with your service.

If you need to create an Azure storage account in a different region, see [How to create a storage account](storage-create-storage-account.md#create-a-storage-account) for step-by-step instructions.

Perform the following steps in the [Azure classic portal](https://manage.windowsazure.com/) on the StorSimple Manager service page to add an existing Microsoft Azure storage account.

#### To add a storage account

1.  On the StorSimple Manager service landing page, select your service and double-click it. This will take you to the **Quick Start** page. Select the **Configure** page.

2.  Click **Add/edit storage account**. In the **Add/Edit Storage Account** dialog box, do the following:

	1.  Click **Add new**.

	1.  Provide a name for your storage account.

	1.  Supply the primary **Access Key** for your Microsoft Azure storage account.

	1.  Select **Enable SSL mode** to create a secure channel for network communication between your device and the cloud. Clear the **Enable SSL mode** check box only if you are operating within a private cloud.

	1.  Click the check icon ![](./media/storsimple-ova-deploy1-portal-prep/image7.png). You will be notified after the storage account is successfully created.

		![](./media/storsimple-ova-deploy1-portal-prep/image11.png)

1.  The newly created storage account will be displayed on the **Configure** page under **Storage accounts**. Click **Save** to save the newly created storage account. Click **OK** when prompted for confirmation.


## Next step

The next step is to provision a virtual machine for your StorSimple virtual device. Depending on your host operating system, see the detailed instructions in:

-   [Provision a StorSimple Virtual Array in Hyper-V](storsimple-ova-deploy2-provision-hyperv.md)

-   [Provision a StorSimple Virtual Array in VMware](storsimple-ova-deploy2-provision-vmware.md)
