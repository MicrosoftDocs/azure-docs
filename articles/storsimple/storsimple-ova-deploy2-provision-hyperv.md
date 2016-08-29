<properties
   pageTitle="Deploy StorSimple Virtual Array - Provision in Hyper-V"
   description="This second tutorial in StorSimple Virtual Array deployment involves provisioning a virtual device in Hyper-V."
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
   ms.date="07/14/2016"
   ms.author="alkohli"/>

# Deploy StorSimple Virtual Array - Provision a Virtual Array in Hyper-V

![](./media/storsimple-ova-deploy2-provision-hyperv/hyperv4.png)

## Overview

This provisioning tutorial applies to Microsoft Azure StorSimple Virtual Arrays (also known as StorSimple on-premises virtual devices or StorSimple virtual devices) running March 2016 general availability (GA) release. This tutorial describes how to provision a StorSimple Virtual Array on a host system running Hyper-V on Windows Server 2012 R2, Windows Server 2012 or Windows Server 2008 R2. This article applies to the deployment of StorSimple Virtual Arrays in Azure classic portal as well as Microsoft Azure Government Cloud.

You will need administrator privileges to provision and configure a virtual device. The provisioning and initial setup can take around 10 minutes to complete.


## Provisioning prerequisites

Here you will find the prerequisites to provision a virtual device on a host system running Hyper-V on Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2.

### For the StorSimple Manager service

Before you begin, make sure that:

-   You have completed all the steps in [Prepare the portal for StorSimple Virtual Array](storsimple-ova-deploy1-portal-prep.md).

-   You have downloaded the virtual device image for Hyper-V from the Azure portal. For more information, see [Step 3: Download the virtual device image](storsimple-ova-deploy1-portal-prep.md#step-3-download-the-virtual-device-image).

	> [AZURE.IMPORTANT] The software running on the StorSimple Virtual Array may only be used in conjunction with the Storsimple Manager service.

### For the StorSimple virtual device

Before you deploy a virtual device, make sure that:

-   You have access to a host system running Hyper-V on Windows Server 2008 R2 or later that can be used to a provision a device.

-   The host system is able to dedicate the following resources to provision your virtual device:

	-   A minimum of 4 cores.

	-   At least 8 GB of RAM.

	-   One network interface.

	-   A 500 GB virtual disk for system data.

### For the network in the datacenter

Before you begin, review the networking requirements to deploy a StorSimple virtual device and configure the datacenter network appropriately. For more information, see [StorSimple Virtual Array networking requirements](storsimple-ova-system-requirements.md#networking-requirements).

## Step-by-step provisioning

To provision and connect to a virtual device, you will need to perform the following steps:

1.  Ensure that the host system has sufficient resources to meet the minimum virtual device requirements.

2.  Provision a virtual device in your hypervisor.

3.  Start the virtual device and get the IP address.

Each of these steps is explained in the following sections.

## Step 1: Ensure that the host system meets minimum virtual device requirements

To create a virtual device, you will need:

-   The Hyper-V role installed on Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 SP1.

-   Microsoft Hyper-V Manager on a Microsoft Windows client connected to the host.

You must make sure that the underlying hardware (host system) on which you are creating the virtual device is able to dedicate the following resources to your virtual device:

- A minimum of 4 cores.
- At least 8 GB of RAM.
- One network interface.
- A 500 GB virtual disk for system data.

## Step 2: Provision a virtual device in hypervisor

Perform the following steps to provision a device in your hypervisor.

#### To provision a virtual device

1.  On your Windows Server host, copy the virtual device image to a local drive. This is the image (VHD or VHDX) that you downloaded through the Azure portal. Make a note of the location where you copied the image as you will be using this later in the procedure.

2.  Open **Server Manager**. In the top right corner, click **Tools** and select **Hyper-V Manager**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image1.png)

	If you are running Windows Server 2008 R2, open the Hyper-V Manager. In Server Manager, click **Roles > Hyper-V > Hyper-V Manager**.

1.  In **Hyper-V Manager**, in the scope pane, right-click your system node to open the context menu, and then click **New** > **Virtual Machine**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image2.png)

1.  On the **Before you begin** page of the New Virtual Machine Wizard, click **Next**.

1.  On the **Specify name and location** page, provide a **Name** for your virtual device. Click **Next**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image4.png)

1.  On the **Specify generation** page, choose the device image type and then click **Next**. This page doesn't appear if you're using Windows Server 2008 R2.

    * Choose **Generation 2** if you downloaded a .vhdx image for Windows Server 2012 or later.
    * Choose **Generation 1** if you downloaded a .vhd image for Windows Server 2008 R2 or later.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image5.png)

1.  On the **Assign memory** page, specify a **Startup memory** of at least **8192 MB**, don't enable dynamic memory, and then click **Next**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image6.png)

1.  On the **Configure networking** page, specify the virtual switch that is connected to the Internet and then click **Next**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image7.png)

1.  On the **Connect virtual hard disk** page, choose **Use an existing virtual hard disk**, specify the location of the virtual device image (.vhdx or .vhd), and then click **Next**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image8m.png)

1.  Review the **Summary** and then click **Finish** to create the virtual machine. But don't jump ahead yet - you still need to add some CPU cores and a second drive. 

	![](./media/storsimple-ova-deploy2-provision-hyperv/image9.png)

1.  To meet the minimum requirements, you will need 4 cores. To add virtual processors, with your host system selected in the **Hyper-V Manager** window, in the right-pane under the list of **Virtual Machines**, locate the virtual machine you just created. Select and right-click the machine name and select **Settings**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image10.png)

1.  On the **Settings** page, in the left-pane, click **Processor**. In the right-pane, set **number of virtual processors** to 4 (or more). Click **Apply**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image11.png)

1.  To meet the minimum requirements, you also need to add a 500 GB virtual data disk. In the **Settings** page:

    1.  In the left pane, select **SCSI Controller**.
    2.  In the right pane, select **Hard Drive,** and click **Add**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image12.png)

1.  On the **Hard drive** page, select the **Virtual hard disk** option and click **New**. This will start the **New Virtual Hard Disk Wizard**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image13.png)

1.  On the **Before you begin** page of the New Virtual Hard Disk Wizard, click **Next**.

1.  On the **Choose Disk Format page**, accept the default option of **VHDX** format. Click **Next**. You won't see this screen if you're running Windows Server 2012 R2 or Windows Server 2008 R2.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image15.png)

1.  On the **Choose Disk Type page**, set virtual hard disk type as **Dynamically expanding** (recommended). If you choose **Fixed size** disk, it will also work but you may need to wait a long time. We recommend that you do not use the **Differencing** option. Click **Next**. Note that **Dynamically expanding** is the default in Windows Server 2012 R2 and Windows Server 2012. In Windows Server 2008 R2, the default is **Fixed size**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image16.png)

1.  On the **Specify Name and Location** page, provide a **name** as well as **location** (you can browse to one) for the data disk. Click **Next**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image17.png)

1.  On the **Configure Disk** page, select the option **Create a new blank virtual hard disk** and specify the size as **500 GB** (or more). Click **Next**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image18.png)

1.  On the **Summary** page, review the details of your virtual data disk and if satisfied, click **Finish** to create the disk. The wizard will close and a virtual hard disk will be added to your machine.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image19.png)

2.  You will return to the **Settings** page. Click **OK** to close the **Settings** page and return to Hyper-V Manager window.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image20.png)

## Step 3: Start the virtual device and get the IP

Perform the following steps to start your virtual device and connect to it.

#### To start the virtual device

1.  Start the virtual device.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image21.png)

1.  After the device is running, select the device, right click, and select **Connect**.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image22.png)

1.  You may have to wait 5-10 minutes for the device to be ready. A status message is displayed on the console to indicate the progress. After the device is ready, go to **Action**. Press `Ctrl + Alt + Delete` to log into the virtual device. The default user is *StorSimpleAdmin* and the default password is *Password1*.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image23.png)

1.  For security reasons, the device administrator password expires at the first log on. You will be prompted to change the password.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image24.png)

	Enter a password that contains at least 8 characters. The password must satisfy at least 3 out of the following 4 requirements: uppercase, lowercase, numeric, and special characters. Reenter the password to confirm it. You will be notified that the password has changed.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image25.png)

1.  After the password is successfully changed, the virtual device may restart. Wait for the device to start.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image26.png)

 	The Windows PowerShell console of the device will be displayed along with a progress bar.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image27.png)

1.  Steps 6-8 only apply when booting up in a non DHCP environment. If you are in a DHCP environment, then skip these steps and go to step 9. If you booted up your device in non DHCP environment, you will see the following screen.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image28m.png)

 	You will now need to configure the network.

1.  Use the `Get-HcsIpAddress` command to list the network interfaces enabled on your virtual device. If your device has a single network interface enabled, the default name assigned to this interface is `Ethernet`.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image29m.png)

1.  Use the `Set-HcsIpAddress` cmdlet to configure the network. An example is shown below:

 	`Set-HcsIpAddress –Name Ethernet –IpAddress 10.161.22.90 –Netmask 255.255.255.0 –Gateway 10.161.22.1`

 	![](./media/storsimple-ova-deploy2-provision-hyperv/image30.png)

1.  After the initial setup is complete and the device has booted up, you will see the device banner text. Make a note of the IP address and the URL displayed in the banner text to manage the device. You will use this IP address to connect to the web UI of your virtual device and complete the local setup and registration.

	![](./media/storsimple-ova-deploy2-provision-hyperv/image31m.png)



1. (Optional) Perform this step only if you are deploying your device in the Government Cloud. You will now enable the United States Federal Information Processing Standard (FIPS) mode on your device. The FIPS 140 standard defines cryptographic algorithms approved for use by US Federal government computer systems for the protection of sensitive data.
	1. To enable the FIPS mode, run the following cmdlet:

		`Enter-HcsFIPSMode`

	2. Reboot your device after you have enabled the FIPS mode so that the cryptographic validations take effect.

		> [AZURE.NOTE] You can either enable or disable FIPS mode on your device. Alternating the device between FIPS and non-FIPS mode is not supported.

If your device does not meet the minimum configuration requirements, you will see an error in the banner text (shown below). You will need to modify the device configuration so that it has adequate resources to meet the minimum requirements. You can then restart and connect to the device. Refer to the minimum configuration requirements in [Step 1: Ensure that the host system meets minimum virtual device requirements](#step-1-ensure-that-the-host-system-meets-minimum-virtual-device-requirements).

![](./media/storsimple-ova-deploy2-provision-hyperv/image32.png)

If you face any other error during the initial configuration using the local web UI, refer to the following workflows in [Manage your StorSimple Virtual Array using the local web UI](storsimple-ova-web-ui-admin.md).

-   Run diagnostic tests to [troubleshoot web UI setup](storsimple-ova-web-ui-admin.md#troubleshoot-web-ui-setup-errors).

-   [Generate log package and view log files](storsimple-ova-web-ui-admin.md#generate-a-log-package).

![video icon](./media/storsimple-ova-deploy2-provision-hyperv/video_icon.png)  **Video available**

Watch the video to see how you can provision a StorSimple Virtual Array in Hyper-V.

> [AZURE.VIDEO create-a-storsimple-virtual-array]

## Next steps

-   [Set up your StorSimple Virtual Array as a file server](storsimple-ova-deploy3-fs-setup.md)

-   [Set up your StorSimple Virtual Array as an iSCSI server](storsimple-ova-deploy3-iscsi-setup.md)
