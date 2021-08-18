---
title: Create a golden image in Azure
description: Walk through the steps to set up a golden image from scratch in Azure.
author: cshea15, emmclare 
ms.topic: how-to
ms.date: 8/17/2021
ms.author: 
manager: 
---

# Create a Golden Image in Azure

## Introduction
This article will walk you through the process of creating a custom image from an Azure VM for use with Azure Virtual Desktop. This image is known as a 'golden image' and will contain the applications and customizations needed for your session hosts.

There are other approaches to customizing your session hosts, such as using device management tools like [Microsoft Endpoint Manager](https://docs.microsoft.com/en-us/mem/intune/fundamentals/azure-virtual-desktop-multi-session) or automating your image build using tools like [Azure Image Builder](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/image-builder-virtual-desktop) with [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops). The strategy you decide upon will depend on the complexity and size of your planned Azure Virtual Desktop environment and your current application deployment processes.

## Create an image from an Azure VM

When creating a new VM for your golden image choose an OS that is [compatible with Azure Virtual Desktop](https://docs.microsoft.com/en-us/azure/virtual-desktop/overview#requirements).  Windows 10 Multi-Session (m365 optional) or Windows Server are recommended for Pooled hostpools. Windows 10 Enterprise is recommended for Personal hostpools. 

### Take your first snapshot
[Create the VM](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal) for your chosen image.  Once it has completed deploying, create a Snapshot of the disk of your image VM.  Give the snapshot an identifying name, since you will be taking further snapshots during the image build process. Snapshots will allow you to roll back if there are issues at any stage of the image build. 

### Add applications to VM
Login to the VM and start installing the required applications. If the VM needs to be domain-joined during customization, remove it from the domain before sysprep. If there are a large number of applications to be installed, it is recommended to take periodic snapshots to allow for rollback if a problem occurs.  

> [!NOTE] If you are adding an Anti-Virus application, it could cause issues during Sysprep. You will need to stop these services before initiating Sysprep.

### Take final snapshot
When you are done installing your applications to the image VM, take a final snapshot of the disk. If sysprep or capture fails, you will be able to create a new VM with your applications already installed from this snapshot. 

### Sysprep
Generalize the VM by running [sysprep](https://docs.microsoft.com/en-us/azure/virtual-machines/generalize#windows). 

## Capturing the VM

Once the sysprep is completed and the VM is shutdown in the portal, click the Capture button on the VM blade. 

When you capture the VM, you have an option to add it to a shared image gallery or capture it as a managed image. 

The [Shared Image Gallery](https://docs.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries) adds features to replicate images to other regions, make the images highly available, allows for easy image versioning and able to deploy at scale.  Managed images are standalone images so are suitable for simpler deployments. 

> [!NOTE] Shared Image Gallery would be ideal for Production environments because of the flexibility. Ideally Managed Images could be used for POC or smaller Production deployments.

When configuring the capture, choose the option to delete the VM, as it is no longer usable after capture. Do not try and capture it again if there is an issue with the capture, create a new VM from the latest Snapshot and repeat the Sysprep steps. 

When you are ready to capture, click Capture. If you are capturing an image into a SIG, it may take longer to capture as the image is replicated.  

Once the capture process is completed, your image will be available to create your session hosts.  To find the image, go to the HostPool blade, choose Gallery and select all images. Click on My Items, your Managed Image will be under "My Images" and your image definition will show under Shared Items. 

## Best Practices

- Do not capture a VM that’s have already been deployed in AVD. The VM will not work when you try to redeploy it into an HostPool due to pre-existing configuration. 
- Make sure to take the VM off of domain before sysprep. 
- Delete the VM once you capture an image, the VM is unusable after capture. There is an option in the Capture blade to delete after capture. 
- Once you capture your image, create new Image VM from the latest snapshot. The new image VM will need to be turned on once in awhile to grab updates and patches.  
- Do not create a new Image VM from an image. Sysprep has limits on how many times you can sysprep. 
