---
title: Set up an Golden Image 
description: Walk through the steps to set up a golden image from scratch in Azure.
author: cshea15, emmclare 
ms.topic: how-to
ms.date: 10/12/2021
ms.author: chashea
manager: bterkaly
---

# Create an AVD Golden Image in Azure

## Introduction
This article will walk you through the process of creating a custom image from an Azure VM for use with Azure Virtual Desktop. This image is known as a 'golden image' and will contain the applications and customizations needed for your session hosts.

There are other approaches to customizing your session hosts, such as using device management tools like [Microsoft Endpoint Manager](/mem/intune/fundamentals/azure-virtual-desktop-multi-session.md) or automating your image build using tools like [Azure Image Builder](/azure/virtual-machines/windows/image-builder-virtual-desktop.md) with [Azure DevOps](/azure/devops/pipelines/get-started/key-pipelines-concepts.md). The strategy you decide upon will depend on the complexity and size of your planned Azure Virtual Desktop environment and your current application deployment processes. 

## Create an image from an Azure VM

When creating a new VM for your golden image choose an OS that is [compatible with Azure Virtual Desktop](overview.md).  Windows 10 Multi-Session (with or without M365) or Windows Server are recommended for Pooled hostpools. Windows 10 Enterprise is recommended for Personal hostpools. You can select either Generation 1 or Generation 2 VMs; Gen 2 VMs support features that aren't supported for Gen 1 machines.  [Learn more about Gen 1 vs Gen 2](/azure/virtual-machines/generation-2.md)

### Take your first snapshot
[Create the base VM](/azure/virtual-machines/windows/quick-create-portal.md) for your chosen image.  Once it has completed deploying, take a Snapshot of the disk of your image VM.  Give the snapshot an identifying name, since you will be taking further snapshots during the image build process. Snapshots will allow you to roll back if there are issues at any stage of the image build. 

### Apply customization
Login to the VM and start customizing your VM with applications, updates or anything you need for your image. If the VM needs to be domain-joined during customization, remove it from the domain before running sysprep. If there are a large number of applications to be installed, it is recommended to take periodic snapshots to allow for rollback if a problem occurs. 

Install Windows updates if needed before you take the final snapshot. Any required cleanup operations such as cleaning up Temp files, de-fragmenting disks and removing user profiles should also be done at this stage.

> [!NOTE]
> If you are adding an Anti-Virus application, it could cause issues during Sysprep. You will need to stop these services before initiating Sysprep.

### Take final snapshot
When you are done installing your applications to the image VM, take a final snapshot of the disk. If sysprep or capture fails, you will be able to create a new base VM with your applications already installed from this snapshot. 

### Sysprep
Generalize the VM by running [sysprep](/azure/virtual-machines/generalize#windows.md). 

> [!NOTE]
> Some optional things you can do before running Sysprep:
> - Reboot once
> - Cleanup Temp files - System-Storage
> - Optimize drivers (defrag)
> - Remove any user profiles 
 
## Capturing the VM

Once the sysprep has completed and the VM is shutdown in the portal, click the Capture button on the VM blade. 

When you capture the VM, you have an option to add it to a shared image gallery or capture it as a managed image. 

The [Shared Image Gallery](/azure/virtual-machines/shared-image-galleries.md) adds features to replicate images to other regions, make the images highly available, allows for easy image versioning and able to deploy at scale.  Managed images are standalone images so are suitable for simpler deployments. 

> [!Important]
> Shared Image Gallery is recommended for Production environments because of the enhanced capabilities, such as replication and image versioning. 

When configuring the capture, choose the option to delete the VM, as it will no longer be usable after capture. Do not try and capture it again if there is an issue with the capture, create a new VM from the latest Snapshot and repeat the Sysprep steps. 

When you are ready to capture, click Capture. If you are capturing an image into a SIG, it may take longer to capture as the image is replicated.  

Once the capture process is completed, your image will be available to create your session hosts.  To find the image, go to the HostPool blade, choose Gallery and select all images. Click on My Items, managed images will be under "My Images" and image definitions will show under Shared Items. 

## Best Practices

- Do not capture a VM that has already been deployed in AVD. The VM will not work when you try to redeploy it into a HostPool due to pre-existing configuration. 
- Make sure to take the VM off the domain before sysprep. 
- Delete the base VM once you capture an image from it, as the VM is unusable after capture. There is an option in the Capture blade to delete after capture. 
- Once you capture your image, create a new base VM from the latest snapshot ready for your next image build. This new base VM will need to be brought online periodically to install updates and patches.  
- Do not create a new base VM from an existing custom image. Sysprep has limits on how many times it can be run. 

## Next Steps

Learn how to add [Language Packs](language-packs.md) to your VM image.
