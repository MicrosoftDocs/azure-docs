---
title: 
description: 
author: 
ms.topic: 
ms.date: 
ms.author: 
manager: 
---

# Set up a golden image in Azure

## Overview


## Create a VM

When creating a new VM for your golden image you need to choose the OS that is compatible for Azure Virtual Desktop.  Windows 10 Multi-Session(m365 optional) and Windows Server for Pooled hostpools and Windows 10 Enterprise for Personal hostpools. 

Once the VM is created, create a Snapshot of the disk of your image VM and give it a name so you know which snapshot it is since you will be taking more snapshots in the future. By taking a snapshot of your disk, you will be able to rebuild your VM incase of issues while adding your applications to the image. 

Start adding your applications to the image. If you join your Image to the domain, make sure you remove it from the domain before you sysprep at the end. If you have a lot of applications that you are adding to this image, its not a bad idea to take more snapshots as you add some applications.  

*NOTE*: Some Ant-Virus will not sysprep correctly. You will need to stop 

When you are done adding applications take another snapshot of the disk. If your sysprep or capture fails, you will be able to create a new VM from the latest snapshot you have taken. 

Go to Sysprep the machine, Generalize, Out-of-Box, Shutdown

## Capturing the VM

Once the sysprep is completed and the VM is shutdown in the portal, click the Capture but on the VM blade. 

When you capture the VM, you have an option to capture it and adding it to a shared image gallery or capture it as a managed image. 

Shared Image Gallery is useful if you need to replicate the image to other regions. If you just need that image in one region, than just having it as a Managed Image will work. 

Choose the option to delete the VM, the VM is no longer usable once you capture. Do not try and capture it again if there is an issue with the capture, create a new VM from the latest Snapshot and then sysprep and capture again. 

When you are ready to capture, click Capture. If you are capturing an image into a SIG, that will take some time to finish. 

Once the capture process is completed, go to the HostPool blade, choose Gallery and select My Items or Shared Items and choose your image. 

## Best Practices

- Do not capture a VM that’s are already deployed in AVD. The VM will have the registration key and the AVD agent on the machine and will not work when you try to redeploy it into an HostPool. 
- Make sure to take the VM off of domain before sysprep. 
- Delete the VM once you capture an image, the VM is no good once it is captured. There is an option in the Capture blade. 
- Create new Image VM from latest snapshot after Capture, having a Image VM spun up and turned on at times to acquire updates and patches. 
- Do not create a new Image VM from a current image. Sysprep has limits on how many times you can sysprep. 

