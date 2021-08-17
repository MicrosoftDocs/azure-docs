---
title: Set up a golden image in Azure
description: Walk through the steps to set up a golden image from scratch in Azure.
author: cshea15
ms.topic: how-to
ms.date: 8/17/2021
ms.author: 
manager: 
---

# Set up a golden image in Azure

## Overview


## Create an image from an Azure VM

When creating a new VM for your golden image choose an OS that is [compatible with Azure Virtual Desktop](https://docs.microsoft.com/en-us/azure/virtual-desktop/overview#requirements).  Windows 10 Multi-Session (m365 optional) or Windows Server are recommended for Pooled hostpools. Windows 10 Enterprise is recommended for Personal hostpools. 

### Take your first snapshot
[Create the VM](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal) from your chosen image.  Once it has completed deploying, create a Snapshot of the disk of your image VM.  Give the snapshot an identifying name, since you will be taking further snapshots during the image build process. Snapshots will allow you to roll back if there are issues at any stage of the image build. 

### Add applications to VM
Login to the VM and start installing the required applications. If the VM needs to be domain-joined during customization, remove it from the domain before sysprep. If there are a large number of applications to be installed, it is recommended to take periodic snapshots to allow for rollback if a problem occurs.  

*NOTE*: Some Anti-Virus will cause issues during Sysprep. You will need to stop these services before initiating Sysprep.

### Take another snapshot
When you are done installing your applications to the image VM, take a final snapshot of the disk. If sysprep or capture fails, you will be able to create a new VM from this snapshot. 

### Sysprep
Generalize the VM by running [sysprep](https://docs.microsoft.com/en-us/azure/virtual-machines/generalize#windows). 

## Capturing the VM

Once the sysprep is completed and the VM is shutdown in the portal, click the Capture button on the VM blade. 

When you capture the VM, you have an option to add it to a shared image gallery or capture it as a managed image. 

The [Shared Image Gallery](https://docs.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries) adds features to replicate images to other regions, make the images highly available and allows for easy image versioning.  Managed images are standalone images so are suitable for simpler deployments. 

When configuring the capture, choose the option to delete the VM, as it is no longer usable after capture. Do not try and capture it again if there is an issue with the capture, create a new VM from the latest Snapshot and repeat the Sysprep steps. 

When you are ready to capture, click Capture. If you are capturing an image into a SIG, it may take longer to capture as the image is replicated.  

Once the capture process is completed, your image will be available to create your session hosts.  To find the image, go to the HostPool blade, choose Gallery and select all images. Click on My Items, your Managed Image will be under "My Images" and your image definition will show under Shared Items. 

## Best Practices

- Do not capture a VM that’s have already been deployed in AVD. The VM will not work when you try to redeploy it into an HostPool due to pre-existing configuration. 
- Make sure to take the VM off of domain before sysprep. 
- Delete the VM once you capture an image, the VM is unusable after capture. There is an option in the Capture blade to delete after capture. 
- Create new Image VM from latest snapshot after Capture, having a Image VM spun up and turned on at times to acquire updates and patches. 
- Do not create a new Image VM from an image . Sysprep has limits on how many times you can sysprep. 
