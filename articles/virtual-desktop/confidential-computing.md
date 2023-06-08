---
title: Set up Azure Confidential Computing virtual machines - Azure
description: How to set up virtual machines that use the confidential computing feature.
author: Heidilohr
ms.topic: how-to
ms.date: 06/30/2023
ms.author: helohr
manager: femila
---
# Set up Azure Confidential Computing for Azure Virtual Desktop

Azure Confidential Computing lets you secure and encrypt information on virtual machines (VMs) wile they're in use by your end-users. Deploying confidential VMs with Azure Virtual Desktop gives users access to Microsoft 365 and other applications on session hosts that use hardware-based isolation, which hardens isolation from other virtual machines, the hypervisor, and the host OS. A dedicated secure processor inside the Advanced Micro Devices processor generates and safeguards memory encryption keys that can't be read from software. For more information about how Confidential Computing works, see the [Azure Confidential Computing overview](../confidential-computing/overview.md).

There are three parts to setting up and enabling an Azure Confidential Computing VM:

- Creating the VM
- Enabling OS disk encryption
- Enabling Trusted Launch as default

This article will show you how to do each part. While enabling OS disk encryption and Trusted Launch are technically optional, we recommend you configure them in order to maximize the security of your Confidential Computing VM.

## Prerequisites

Confidential Computing virtual machines (VMs) are only supported by the following versions of Windows:

- Windows 11 
- Windows Server 2019
- Windows Server 2022 

## Create an Azure Confidential Computing VM

To create a confidential computing VM from an image:

1. Select **Create a host pool**.

1. Go to **Virtual machines**. 

1. Under **Add Azure virtual machines**, select **Yes**.

1. For **Security type**, select **Confidential virtual machines**.

1. For **Images**, select **See all images**.

1. For **Security type**, select **Confidential**.

1. Select a supported OS image from the list that appears.

## Enable OS disk encryption

Confidential disk encryption is an extra layer of encryption that binds disk encryption keys to the VM's rusted Platform Module (TPM). This encryption makes the disk content accessible only to the VM. Integrity monitoring allows cryptographic attestation and verification of VM boot integrity and sends you alerts when the VM didn't start up properly. For more information about integrity monitoring, see [Microsoft Defender for Cloud Integration](../virtual-machines/trusted-launch.md#microsoft-defender-for-cloud-integration).

To enable OS disk encryption on your VMs:

1. Follow the directions in [Create an Azure Confidential Computing VM](#create-an-azure-confidential-computing-vm) until you reach step 6.

1. Under **Security type**, look for a check box labeled **Integrity Monitoring**.

1. Select the check box to enable OS disk encryption.

1. Proceed with the VM creation process as normal.

## Enable Trusted launch as default

Trusted launch protects against advanced and persistent attack techniques. This feature also allows for secure deployment of VMs with verified boot loaders, OS kernels, and drivers. Trusted launch also protects keys, certificates, and secrets in VMs. Learn more about Trusted launch at [Azure Virtual Desktop support for trusted launch](security-guide.md#azure-virtual-desktop-support-for-trusted-launch) and [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).

When you select **Add Azure virtual machines** during the VM setup process, the Security type automatically changes to **Trusted virtual machines**. This ensures that your VM meets the mandatory requirements for Windows 11. For more information about these requirements, see [Virtual machine support](/windows/whats-new/windows-11-requirements#virtual-machine-support).

## Next steps

For more information about ways you can boost security in Azure Virtual Desktop, check out our [Security best practices](security-guide.md).

If you'd like to learn how to create a regular VM, see the tutorial at [Tutorial: Create and connect to a Windows 11 desktop with Azure Virtual Desktop](tutorial-create-connect-personal-desktop.md).