<properties
    pageTitle="Create an Azure RemoteApp image based on an Azure VM | Microsoft Azure"
    description="Learn how to create an image for Azure RemoteApp by starting with an Azure virtual machine."
    services="remoteapp"
    documentationCenter=""
    authors="lizap"
    manager="mbaldwin" />

<tags
    ms.service="remoteapp"
    ms.workload="compute"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="05/12/2016" 
    ms.author="elizapo" />



# Create a Azure RemoteApp image based on an Azure virtual machine

You can create Azure RemoteApp images (which hold the apps you share in your collection) from an Azure virtual machine. You could also choose to use a virtual machine image we added to the Azure VM image gallery that meets all the Azure RemoteApp image requirements - you can use that VM image as a starting point for your own VM, if you want. Just look for the "Windows Server Remote Desktop Session Host" image in the library.

There are two steps to create your own image based on an Azure VM - create the image and then upload it from the Azure VM library to Azure RemoteApp.

## Create a custom image based on an Azure VM

Use these steps to create an image based on an Azure VM.

1. Create an Azure virtual machine. You can use the “Windows Server Remote Desktop Session Host” or the "Windows Server Remote Desktop Session Host with Microsoft Office 365 ProPlus" image from the Azure virtual machine image gallery. This image meets all the Azure RemoteApp template image requirements.

	For details, see [Create a VM running Windows](../virtual-machines/virtual-machines-windows-hero-tutorial.md).

2. Connect to the VM and install and configure the apps that you want to share through RemoteApp. Make sure to perform any additional Windows configurations required by your apps.

	For details, see [How to Log on to a Virtual Machine Running Windows Server](../virtual-machines/virtual-machines-windows-classic-connect-logon.md).

3. If you are using one of the Windows Server Remote Desktop Session Host images, there is an included validation script that will ensure your VM meets the RemoteApp pre-reqs. To run script, double-click **ValidateRemoteAppImage** on the desktop. Ensure that all errors reported by the script are fixed before proceeding to the next step.

4. SYSPREP generalize and capture the image. See [How to Capture a Windows Virtual Machine to Use as a Template](../virtual-machines/virtual-machines-windows-classic-capture-image.md) for instructions.



## Import the image into the Azure RemoteApp image library

Use these steps to import the new image into Azure RemoteApp:

1. In the **Template Images** tab:
	- If you have no existing images, click **Upload or Import a Template Image**.
	- If you have at least one image already, click **+** to add a new image.

2. Select **Import an image from your Virtual Machines** library, and then click **Next**.

3. On the next page, select your custom image from the list and confirm that you followed the steps listed when you created your image. Click **Next**.
4. Enter a name for the new RemoteApp image and pick the location, then click the checkmark to start the import process.

> [AZURE.NOTE] You can import images from any Azure location supported by Azure Virtual Machines to any Azure location supported by Azure RemoteApp. Depending on the locations the import can take up to 25 minutes.

Now you are ready to create your new collection, either a [cloud](remoteapp-create-cloud-deployment.md) collection or [hybrid](remoteapp-create-hybrid-deployment.md), depending on your needs.
