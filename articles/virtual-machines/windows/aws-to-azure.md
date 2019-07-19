---
title: Move a Windows AWS VMs to Azure | Microsoft Docs
description: Move an Amazon Web Services (AWS) EC2 Windows instance to an Azure virtual machine. 
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 06/01/2018
ms.author: cynthn

---


# Move a Windows VM from Amazon Web Services (AWS) to an Azure virtual machine

If you are evaluating Azure virtual machines for hosting your workloads, you can export an existing Amazon Web Services (AWS) EC2 Windows VM instance then upload the virtual hard disk (VHD) to Azure. Once the VHD is uploaded, you can create a new VM in Azure from the VHD. 

This article covers moving a single VM from AWS to Azure. If you want to move VMs from AWS to Azure at scale, see [Migrate virtual machines in Amazon Web Services (AWS) to Azure with Azure Site Recovery](../../site-recovery/site-recovery-migrate-aws-to-azure.md).

## Prepare the VM 
 
You can upload both generalized and specialized VHDs to Azure. Each type requires that you prepare the VM before exporting from AWS. 

- **Generalized VHD** - a generalized VHD has had all of your personal account information removed using Sysprep. If you intend to use the VHD as an image to create new VMs from, you should: 
 
	* [Prepare a Windows VM](prepare-for-upload-vhd-image.md).  
	* Generalize the virtual machine using Sysprep.  

 
- **Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. If you intend to use the VHD as-is to create a new VM, ensure the following steps are completed.  
	* [Prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md). **Do not** generalize the VM using Sysprep. 
	* Remove any guest virtualization tools and agents that are installed on the VM (i.e. VMware tools). 
	* Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up.  


## Export and download the VHD 

Export the EC2 instance to a VHD in an Amazon S3 bucket. Follow the steps in the Amazon documentation article [Exporting an Instance as a VM Using VM Import/Export](https://docs.aws.amazon.com/vm-import/latest/userguide/vmexport.html) and run the [create-instance-export-task](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-instance-export-task.html) command to export the EC2 instance to a VHD file. 

The exported VHD file is saved in the Amazon S3 bucket you specify. The basic syntax for exporting the VHD is below, just replace the placeholder text in \<brackets> with your information.

```
aws ec2 create-instance-export-task --instance-id <instanceID> --target-environment Microsoft \
  --export-to-s3-task DiskImageFormat=VHD,ContainerFormat=ova,S3Bucket=<bucket>,S3Prefix=<prefix>
```

Once the VHD has been exported, follow the instructions in [How Do I Download an Object from an S3 Bucket?](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/download-objects.html) to download the VHD file from the S3 bucket. 

> [!IMPORTANT]
> AWS charges data transfer fees for downloading the VHD. See [Amazon S3 Pricing](https://aws.amazon.com/s3/pricing/) for more information.


## Next steps

Now you can upload the VHD to Azure and create a new VM. 

- If you ran Sysprep on your source to **generalize** it before exporting, see [Upload a generalized VHD and use it to create a new VMs in Azure](upload-generalized-managed.md)
- If you did not run Sysprep before exporting, the VHD is considered **specialized**, see [Upload a specialized VHD to Azure and create a new VM](create-vm-specialized.md)

 
