
<properties
    pageTitle="Azure RemoteApp image requirements | Microsoft Azure"
    description="Learn about the requirements for creating images to be used with Azure RemoteApp"
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
    ms.date="08/15/2016"
    ms.author="elizapo" />



# Requirements for Azure RemoteApp images

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

Azure RemoteApp uses a Windows Server 2012 R2 image to host all the programs that you want to share with your users. To create a custom image, you can start with an existing image or [create a new one](remoteapp-create-custom-image.md).

> [AZURE.TIP] Did you know that your Azure RemoteApp subscription gives you access to a Windows Server 2012 R2 image in the Azure VM gallery that you can use to create your own template image? [Check it out](remoteapp-image-on-azurevm.md).  


The requirements for the image that can be uploaded for use with Azure RemoteApp are:


- Custom applications don’t store data locally on the image. These images are stateless and should only contain applications.
- The image does not contain data that can be lost.
- The image size should be a multiple of MBs. If you try to upload an image that is not an exact multiple, the upload will fail.
- The image size must be 127 GB or smaller.
- It must be on a VHD file (VHDX files are not currently supported).
- The VHD must not be a generation 2 virtual machine.
- The VHD can be either fixed-size or dynamically expanding. A dynamically expanding VHD is recommended because it takes less time to upload to Azure than a fixed-size VHD file.
- The disk must be initialized using the Master Boot Record (MBR) partitioning style. The GUID partition table (GPT) partition style is not supported.
- The VHD must contain a single installation of Windows Server 2012 R2. It can contain multiple volumes, but only one that contains an installation of Windows.
- The Remote Desktop Session Host (RDSH) role and the Desktop Experience feature must be installed.
- The Remote Desktop Connection Broker role must *not* be installed.
- The Encrypting File System (EFS) must be disabled.
- The image must be SYSPREPed using the parameters **/oobe /generalize /shutdown** (DO NOT use the **/mode:vm** parameter).
- Uploading your VHD from a snapshot chain is not supported.

See [Create an Azure RemoteApp image](remoteapp-imageoptions.md) for more information about creating images for Azure RemoteApp.
