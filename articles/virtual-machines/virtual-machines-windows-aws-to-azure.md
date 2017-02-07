---
title: AWS | Microsoft Docs
description: the Resource Manager deployment model.
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

If you are migrating VHD from an Amazon Web Services (AWS) EC2 instance to Azure, you must first export the VHD to a local directory.


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
- [Upload the VHD to Azure](virtual-machines-windows-upload-image.md)