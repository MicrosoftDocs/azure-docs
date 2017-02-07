---
title: Migrate AWS VMs to Azure | Microsoft Docs
description: Migrate an Amazon Web Services (AWS) EC2 instance to Azure in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/05/2016
ms.author: cynthn

---

# Migrate from Amazon Web Services (AWS) to Azure

If you are migrating VHD from an Amazon Web Services (AWS) EC2 instance to Azure, you must generalize the VM and then export the generalized VHD to a local directory.

> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
>
>

## Generalize the Windows VM using Sysprep

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles)

> [!IMPORTANT]
> If you are running Sysprep before uploading your VHD to Azure for the first time, make sure you have [prepared your VM](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) before running Sysprep. 
> 
> 

1. Sign in to the Windows virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
   
    ![Start Sysprep](./media/virtual-machines-windows-upload-image/sysprepgeneral.png)
6. When Sysprep completes, it shuts down the virtual machine. Do not restart the VM.



## Export the VHD from an EC2 instance

1.	If you are using Amazon Web Services (AWS), export the EC2 instance to a VHD in an Amazon S3 bucket. Follow the steps described in the Amazon documentation for Exporting Amazon EC2 Instances to install the Amazon EC2 command-line interface (CLI) tool and run the create-instance-export-task command to export the EC2 instance to a VHD file. Be sure to use VHD for the DISK_IMAGE_FORMAT variable when running the create-instance-export-task command. The exported VHD file is saved in the Amazon S3 bucket you designate during that process.

    ```
	aws ec2 create-instance-export-task --instance-id ID --target-environment TARGET_ENVIRONMENT '
	--export-to-s3-task DiskImageFormat=DISK_IMAGE_FORMAT,ContainerFormat=ova,S3Bucket=BUCKET,S3Prefix=PREFIX
	```

2.	Download the VHD file from the S3 bucket. Select the VHD file, then select **Actions** > **Download**.

## Copy a VHD from other non-Azure cloud
If you are migrating VHD from non-Azure Cloud Storage to Azure, you must first export the VHD to a local directory. Copy the complete source path of the local directory where VHD is stored.


 
## Next steps
- [Upload the VHD to Azure and create a VM using Managed Disks](xxx.md)