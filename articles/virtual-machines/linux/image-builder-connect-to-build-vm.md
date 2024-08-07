---
title: How to Connect to the Azure Image Builder build VM
description: This article helps you learn how to connect to the live build VM in order to debug problems and errors you might encounter when you're using Azure VM Image Builder.
author: kof-f
ms.author: kofiforson
ms.reviewer: jushiman
ms.date: 7/10/2024
ms.topic: troubleshooting
ms.service: azure-virtual-machines 
ms.subservice: image-builder
---

# How to Connect to the Azure Image Builder Build VM

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

Use this article to learn how to connect to the Azure Image Builder Build VM in order to debug problems and errors you might encounter when you're using Azure VM Image Builder.

## Retain the Build VM
By default, Azure Image Builder (AIB) deletes the Build VM after the customization or validation phase, regardless of success or failure. However, in case of failures, it's essential to retain the VM for debugging purposes. Here are two options:

### Recommended Option: Specify `errorHandling` Property in the Template:
If you anticipate the need for debugging, create your template with the `errorHandling` property set. This ensures that AIB retains the Build VM even if errors occur during the build process. Follow the instructions in the [Properties: errorHandling - Azure Image Builder](./image-builder-json.md#properties-errorhandling) documentation.

### Alternative Option (Not Recommended): Lock the Resource Group:
If you can't modify the template directly, follow these steps:
 - Get the name of the staging resource group (specified in the `stagingResourceGroup` property of the template).
 - Apply a `CanNotDelete` lock to the resource group using [Azure Resource Manager locks](https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources).
 - Once debugging is complete, remove the lock and delete the resources (except storage accounts) from the resource group.

>[!NOTE]
> AIB will attempt to delete resources in the resource group after the build, but the lock will prevent deletion. Eventually, AIB will give up, and the build will complete. Note that even if there were no errors during customization or validation, the AIB build will be reported as "Failed" due to deletion errors.

## Get the credentials to connect to the VM
After retaining the Build VM, follow these steps to get the credentials needed to connect to the VM:
 - Navigate to the Virtual Machine's Health > Reset Password blade.
 - Click on "Reset password" mode.
 - Make a note of the `Username`.
 - Set the `Password` to a desired value and make a note of it. You'll use these credentials in the next step.

## Connect to the VM
Once you have the credentials, you can connect to the VM using one of the options below:

### Option 1 (Recommended): Connect to the VM using Azure Bastion
Azure Bastion provides a secure way to connect to VMs without exposing public IPs. Follow the instructions for connecting to a Windows VM using SSH or RDP in the [Azure Bastion documentation](https://learn.microsoft.com/azure/bastion/). 
>[!NOTE]
> No changes to existing Network Security Groups (NSGs) are needed when connecting to the Azure Image Builder Build VM using Azure Bastion. 

### Option 2 (Recommended, if available): Connect to the VM using Azure Serial Console
Azure Serial Console offers text-based access to VMs running Linux or Windows. Learn more about how to use Azure Serial Console to connect to a VM by reading the [Azure Serial Console documentation](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/windows/serial-console-overview).

### Option 3 (Not Recommended): Use a Public IP Address Resource
The recommended practice is to use Azure Bastion or Azure Serial Console for connecting to VMs. However, if Bastion or Serial Console cannot be used, you can connect to the Build VM by using public IPs. 

Use the following documentation to connect to a VM using public IPs:
 - [Connect to a Linux VM using Public IP](https://learn.microsoft.com/azure/virtual-machines/linux-vm-connect)
 - [Connect to a Windows VM using Public IP](https://learn.microsoft.com/azure/virtual-machines/windows/connect-rdp)

>[!NOTE]
> You may need to associate a public IP address to the build VM first and you can do that by following the instructions in the following documentation: [Associate a public IP address to a virtual machine](https://learn.microsoft.com/azure/virtual-network/public-ip-addresses#associate-an-existing-public-ip-address-to-a-vm). 
> 
> You also should ensure network connectivity from the client device (running WinRM/SSH) to the Build VM over the public network. Check and update your Network Security Groups (NSGs) as needed.

### Option 4 (Not Recommended): Deploying a Jump Box
This option should be your last resort. Only use this option when you cannot use Azure Bastion, Azure Serial Console or a public IP address to connect to the Build VM. 

Follow the steps below to deploy a jump box:
   1. Create or use a separate subnet in the same VNet as the build VM.
   2. Deploy a "Jump Box" VM with a public IP in this subnet.
   3. Connect from your client device to the Jump Box using any of the methods mentioned earlier.
   4. From the Jump Box, connect to the build VM using SSH or WinRM/RDP.

>[!NOTE]
> There must be network line-of-sight from the Client Device to the Jump Box over the public network, and from the Jump Box to the Build VM over the private network. Additionally, it’s essential to verify and update Network Security Groups (NSGs) at each hop in between and ensure that the correct ports are open on all three devices.


