---
title: Set up Azure HPC or AI VMs
description: How to set up an Azure HPC or AI virtual machine with NVIDIA or AMD GPUs using the Azure portal.
author: sherrywangms 
ms.author: sherrywang 
ms.service: virtual-machines
ms.subservice: hpc
ms.topic: how-to
ms.date: 03/10/2023
---

# Set up Azure HPC or AI VMs

This how-to guide explains how to create a basic Azure virtual machine (VM) for HPC and AI with NVIDIA or AMD GPUs. These VM sizes are intended for workloads that require high-performance computing (HPC sizes), or GPU-accelerated computing (AI sizes).

## Choose your VM size

Azure VMs have many different options, called [VM sizes](sizes.md). There are different series of [VM sizes for HPC](sizes-hpc.md) and [VM sizes GPU-optimized computing](sizes-gpu.md). Select the appropriate VM size for the workload you want to use. For help with selecting sizes, see the [VM selector tool](https://azure.microsoft.com/pricing/vm-selector/). 

Not all Azure products are available in all Azure regions. For more information, see the current list of [products available by region](https://azure.microsoft.com/global-infrastructure/services/).

## Create your VM

Before you can deploy a workload, you need to create your VM through the Azure portal.

Depending on your VM's operating system, review either the [Linux VM quickstart](./linux/quick-create-portal.md) or [Windows VM quickstart](./windows/quick-create-portal.md). Then, create your VM with the following settings:

1. For **Subscription**, select the Azure subscription that you want to use for this VM.

1. For **Region**, select a region with capacity available for your VM size.

1. For **Image**, select the image of the VM you chose in the previous section.

    > [!NOTE]
    > For the purpose of example, this guide uses the image **NVIDIA GPU-Optimized Image for AI & HPC – v21.04.1 – Gen 1**. If you're using another image, you might need to install other software, like the NVIDIA driver and Docker, before proceeding.

1. For **Size**, select the HPC or GPU instance type. For more information, see [how to choose your VM size](#choose-your-vm-size).

1. For **SSH public key source**, select **Generate a new key pair**.

1. Wait for key validation to complete.

1. When prompted, select **Download private key and create resource**.

    > [!NOTE]
    > Downloading the key pair is necessary to SSH into your VM for later configuration.

1. For **Key pair name**, enter a name for your key pair.

1. Under the **Networking** tab, make sure **Accelerated Networking** is disabled.

1. Optionally, add a data disk to your VM. For more information, see how to add a data disk [to a Linux VM](./linux/attach-disk-portal.md) or [to a Windows VM](./windows/attach-managed-disk-portal.md).

    > [!NOTE]
    > Adding a data disk helps you store models, data sets, and other necessary components for benchmarking. 

1. Select **Review + create** to create your VM.

## Connect to your VM

Connect to your new VM using SSH, which allows you to perform further configuration. Some connection methods include:

- [Connect over SSH on Linux or macOS](./linux/mac-create-ssh-keys.md#ssh-into-your-vm)
- [Connect over SSH on Windows](./linux/ssh-from-windows.md#connect-to-your-vm)
- [Connect over SSH using Azure Bastion](../bastion/bastion-connect-vm-ssh-linux.md)

## Set up VM

Set up your new VM for HPC or AI workloads. Install the newest NVIDIA or AMD GPU driver, which maps to your VM size.

- [Install NVIDIA GPU drivers on N-series VMs running Linux](./linux/n-series-driver-setup.md)
- [Install NVIDIA GPU drivers on N-series VMs running Windows](./windows/n-series-driver-setup.md)
- [Install AMD GPU drivers on N-series VMs running Windows](./windows/n-series-amd-driver-setup.md)

## Next steps

- [High performance computing VM sizes](sizes-hpc.md)
- [GPU optimized virtual machine sizes](sizes-gpu.md)
