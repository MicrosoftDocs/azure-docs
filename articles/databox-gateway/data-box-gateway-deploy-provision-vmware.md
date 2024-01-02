---
title: Tutorial to provision Azure Data Box Gateway in VMware | Microsoft Docs
description: Second tutorial to deploy Azure Data Box Gateway involves provisioning a virtual device in VMware.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: gateway
ms.topic: tutorial
ms.date: 12/20/2023
ms.author: shaas
#Customer intent: As an IT admin, I need to understand how to provision a virtual device for Data Box Gateway in VMware so I can use it to transfer data to Azure. 
#Initial doc score: 72 
---
# Tutorial: Provision Azure Data Box Gateway in VMware

## Overview

This tutorial describes how to provision a Data Box Gateway on a host system running VMware ESXi 6.7, 7.0 or 8.0.

You need administrator privileges to provision and connect to a virtual device. The provisioning and initial setup can take around 10 minutes to complete.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Ensure your host meets minimum device requirements
> * Provision a virtual device using VMware
> * Start your virtual device and get its IP address

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The prerequisites to provision a virtual device on a host system running VMware ESXi 6.7, 7.0, or 8.0, are as follows.

### For the Data Box Gateway resource

Before you begin, make sure that:

* You complete the steps in [Prepare the portal for Data Box Gateway](data-box-gateway-deploy-prep.md).
* You download the virtual device image for VMware from the Azure portal as described in [Prepare the portal for Data Box Gateway](data-box-gateway-deploy-prep.md).

  > [!IMPORTANT]
  > The software running on the Data Box Gateway may only be used with the Data Box Gateway resource.

### For the Data Box Gateway virtual device

Before you deploy a virtual device, make sure that:

* You have access to a host system running VMware (ESXi 6.7, 7.0 or 8.0) that can be used to a provision a device.
* The host system is able to dedicate the following resources to provision your virtual device:

  * A minimum of 4 cores.
  * At least 8 GB of RAM. We strongly recommend at least 16 GB of RAM.
  * One network interface.
  * A 250-GB OS disk.
  * A 2-TB virtual disk for system data.

### For the network in datacenter

Before you begin:

- Review the networking requirements to deploy a Data Box Gateway and configure the datacenter network as per the requirements. For more information, see [Data Box Gateway networking requirements](data-box-gateway-system-requirements.md#networking-port-requirements).
- Make sure that the minimum Internet bandwidth is 20 Mbps to allow for optimal working of the device.

## Check the host system

To create a virtual device, you need:

* Access to a host system running VMware ESXi Server 6.7, 7.0 or 8.0. The host system is able to dedicate the following resources to your virtual device:
  * A minimum of 4 virtual processors.
  * At least 8 GB of RAM.
  * One network interface connected to the network capable of routing traffic to Internet.
  * A 250-GB OS disk.
  * A 2-TB virtual disk for data.
* VMware vSphere client on your system to manage the ESXi host.

## Provision a virtual device in hypervisor

Perform the following steps to provision a virtual device in your hypervisor.

1. Copy the virtual device image to a location on your system. You downloaded this virtual image through the Azure portal. Make a note of the image's location for use in a subsequent step.
1. Sign in to the ESXi server via a browser at this URL: `https://<IP address of the ESXi server>`. You need to have administrator privileges to create a virtual machine.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-1-sml.png" alt-text="Screenshot of the sign in page." lightbox="media/data-box-gateway-deploy-provision-vmware/image-1.png":::

1. Upload the VMDK to the ESXi server. In the Navigator pane, select **Storage**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-2-sml.png" alt-text="Screenshot of a page on the ESXi server site that shows the Navigator pane with the Storage option selected." lightbox="media/data-box-gateway-deploy-provision-vmware/image-2.png":::

1. In the right pane, under **Datastores**, select the datastore where you want to upload the VMDK.
    - The datastore can be either VMFS5 or VMFS6. Data Box Gateway has been tested for use on VMware with the VMFS5 and VMFS6 Datastore.
    - The datastore must also have enough free space for the OS and data disks.
1. Right-click and select **Browse Datastore**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-3-sml.png" alt-text="Screenshot of a page on the ESXi server site that shows the user opening the datastore context menu." lightbox="media/data-box-gateway-deploy-provision-vmware/image-3.png":::

1. A **Datastore Browser** window appears.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-4.png" alt-text="Screenshot of a page on the ESXi server site that shows the datastore browser.":::

1. In the tool bar, select **Create directory** icon to create a new folder. Specify the folder name and make a note of it. This folder name is used in a subsequent step to create a virtual machine (recommended best practice). Select **Create directory**.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-5.png" alt-text="Screenshot of the user creating a directory.":::

1. The new folder appears in the left pane of the **Datastore Browser**. Select the **Upload** icon and select **Upload File**.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-6.png" alt-text="Screenshot of a user uploading a file.":::

1. Browse and point to the VMDK files that you downloaded. Select the file to upload.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-7.png" alt-text="Screenshot of a user selecting the file to upload.":::

1. Select **Open**. The upload of the VMDK file to the specified datastore starts. It might take several minutes for the file to upload.
1. After the upload is complete, you see the file in the datastore in the folder you created. 

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-8-sml.png" alt-text="Screenshot showing two VMDK files merged into a single file within the Datastore Browser window."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-8.png":::

1. Return to the vSphere client window. In the Navigator pane, select **Virtual Machines**. In the right pane, select **Create/Register VM**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-9-sml.png" alt-text="Screenshot showing options to create or register a VM." lightbox="media/data-box-gateway-deploy-provision-vmware/image-9.png":::

1. A **New Virtual Machine** appears. Under Select creation type, choose **Create a new virtual machine** and select **Next**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-10-sml.png" alt-text="Screenshot showing options to select a creation type."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-10.png":::

1. On the **Select a name and guest OS** page, specify the **Name** of your virtual machine. This name should match the folder name (recommended best practice) you specified earlier in Step 7. Choose **Guest OS family** as Windows and **Guest OS version** as Microsoft Windows Server 2016 (64-bit). Select **Next**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-11-sml.png" alt-text="Screenshot showing the contents of the Select a Name and guest OS pane."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-11.png":::

1. On the **Select storage** page, select a datastore you want to use to provision your VM. Select **Next**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-12-sml.png" alt-text="Screenshot showing the contents of the Select storage pane." lightbox="media/data-box-gateway-deploy-provision-vmware/image-12.png":::

1. On the **Customize settings** page, set the **CPU** to 4, **Memory** to 8192 MB (or more), **Hard disk 1** as 2 TB (or more). Choose **SCSI hard disk** to add. In this case, it was LSI Logic SAS. **The static IDE disks are not supported.** The **Hard disk 1** is the virtual data disk. The disk can't be shrunk after it's provisioned. Attempting to shrink the disk results in a loss of all local data on the device. **CD/DVD Drive 1** isn't needed and should be removed.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-13-sml.png" alt-text="Screenshot showing the contents of the Customize Settings pane." lightbox="media/data-box-gateway-deploy-provision-vmware/image-13.png":::

    On the same page, select **Add hard disk** and then select **Existing hard disk**. Select the VMDK file in the datastore to add an OS disk.

     :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/customize-settings-add-hard-disk-sml.png" alt-text="Screenshot showing the contents of the Customize Settings region highlighting the Add a new hard disk option."  lightbox="media/data-box-gateway-deploy-provision-vmware/customize-settings-add-hard-disk.png":::

    Scroll toward the bottom until you see the **New hard disk** and expand it to view the settings. Set the **Virtual Device Node** to **IDE controller 0**.

     :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/customize-settings-new-disk-sml.png" alt-text="Screenshot of the Customize Settings region highlighting the options to configure a new hard disk."  lightbox="media/data-box-gateway-deploy-provision-vmware/customize-settings-new-disk.png":::

1. On the **Customize settings** page, select **VM options**. Expand **Boot options**. Ensure that the **Firmware** field's drop-down list value is set to **EFI** for ESXi 7.0 or 8.0.
 Select **Next**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/customize-settings-new-disk-esxi-sml.png" alt-text="Screenshot of the Customize Settings page when the user is running VMware ESXi Server 6.7."  lightbox="media/data-box-gateway-deploy-provision-vmware/customize-settings-new-disk-esxi.png":::

1. On the **Ready to Complete** page, review all the settings associated with the new virtual machine. Verify that CPU is 4, memory is 8192 MB, network interface is 1 and Hard disk 2 has IDE controller 0. Select **Finish**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-16-sml.png" alt-text="Screenshot of the initial Ready to Complete page."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-16.png":::

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-17-sml.png" alt-text="Screenshot of the second Ready to Complete page."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-17.png":::

Your virtual machine is now provisioned. You'll see a notification to the effect and the new virtual machine is added to the list of VMs.

:::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-18-sml.png" alt-text="Screenshot of the New virtual machine added to list of VMs."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-18.png":::

Perform the steps described in the next section to turn on your new VM and retrieve the IP address.

> [!NOTE]
> We recommend that you do not install VMware tools on a virtual device provisioned as previously described. Installation of VMware tools will result in an unsupported configuration.

## Start the virtual device and get the IP

Perform the following steps to start your virtual device and connect to it.

### To start the virtual device

1. In the right pane, select your device from the list of VMs and right-click to bring up the context menu. To Start the virtual device, select **Power**, then **Power on**. You can view the status in the bottom pane of the web client.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-19-sml.png" alt-text="Screenshot illustrating the process of powering on a virtual device."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-19.png":::

1. Again, select your VM. Right-click, select **Console**, and then select **Open in a new window**.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-20-sml.png" alt-text="Screenshot illustrating the process of creating a virtual device session."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-20.png":::

1. The virtual machine console opens up in a new window.

    :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-21-sml.png" alt-text="Screenshot showing a virtual device console." lightbox="media/data-box-gateway-deploy-provision-vmware/image-21.png":::

1. After the device is running, drag the cursor to the tab in the upper middle part of the console window and click. Select **Guest OS > Send keys > Ctrl+Alt+Delete** to unlock the VM.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-22-sml.png" alt-text="Screenshot illustrating the process of unlocking a virtual device."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-22.png":::

1. Provide the password to sign into the machine. The default password is *Password1*.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-23-sml.png" alt-text="Screenshot illustrating the process of entering a virtual device's password." lightbox="media/data-box-gateway-deploy-provision-vmware/image-23.png":::

1. Steps 6-8 only apply when booting up in a non-DHCP environment. If you are in a DHCP environment, then skip these steps and go to step 9. If you booted up your device in non-DHCP environment, you will see a message to the effect: **Use the Set-HcsIPAddress cmdlet to configure the network**.

1. To configure the network, at the command prompt, use the `Get-HcsIpAddress` command to list the network interfaces enabled on your virtual device. If your device has a single network interface enabled, the default name assigned to this interface is `Ethernet`.

1. Use the `Set-HcsIpAddress` cmdlet to configure the network. An example is shown below:

    `Set-HcsIpAddress –Name Ethernet0 –IpAddress 10.161.22.90 –Netmask 255.255.255.0 –Gateway 10.161.22.1`

1. After the initial setup is complete and the device has booted up, you will see the device banner text. Make a note of the IP address and the URL displayed in the banner text to manage the device. You will use this IP address to connect to the web UI of your virtual device and complete the local setup and activation.

   :::image type="content" source="media/data-box-gateway-deploy-provision-vmware/image-24-sml.png" alt-text="Screenshot showing the Banner text and connection URL for virtual device."  lightbox="media/data-box-gateway-deploy-provision-vmware/image-24.png":::

If your device does not meet the minimum configuration requirements, you will see an error in the banner text (shown below). Modify the device configuration so that it has adequate resources to meet the minimum requirements, then restart and connect to the device. Refer to the minimum configuration requirements in the [Check the host system](#check-the-host-system) section.

If you face any other error during the initial configuration using the local web UI, refer to the following workflows:

- [Run diagnostic tests to troubleshoot web UI setup](data-box-gateway-troubleshoot.md#run-diagnostics).
- [Generate log package and view log files](data-box-gateway-troubleshoot.md#collect-support-package).

## Next steps

In this tutorial, you learned about Data Box Gateway topics such as:

> [!div class="checklist"]
> * Ensure host meets minimum device requirements
> * Provision a virtual device in VMware
> * Start the virtual device and get the IP address

Advance to the next tutorial to learn how to connect, set up, and activate your virtual device.

* [Set up and connect to shares on your Data Box Gateway](data-box-gateway-deploy-connect-setup-activate.md)
