---
title: Create an Azure virtual machine offer on Azure Marketplace using your own image
description: Learn how to publish a virtual machine offer to Azure Marketplace using your own image.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: mingshen-ms 
ms.author: mingshen
ms.date: 10/19/2020
---

# Create a virtual machine using your own image

This article describes how to create and deploy a user-provided virtual machine (VM) image. You can do this by providing operating system and data disk VHD images from an Azure-deployed virtual hard disk (VHD).

To use an approved base image, follow the instructions in [Create a VM image from an approved base](azure-vm-create-using-approved-base.md).

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

## Size the VHDs

[!INCLUDE [Discussion of VHD sizing](includes/vhd-size.md)]

## Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

## Perform additional security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

## Perform custom configuration and scheduled tasks

[!INCLUDE [Discussion of custom configuration and scheduled tasks](includes/custom-config.md)]

## Upload the vhd to Azure

Configure and prepare the VM to be uploaded as described in [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) or [Create and Upload a Linux VHD](../virtual-machines/linux/create-upload-generic.md).

## Next steps

- If you encountered difficulty creating your new Azure-based VHD, see [Common issues during VHD creation](azure-vm-common-issues-during-vhd-creation.md).
- [Configure VM offer properties](azure-vm-create-properties.md)
