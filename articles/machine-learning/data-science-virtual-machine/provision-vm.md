---
title: 'Quickstart: Create a Windows Data Science Virtual Machine'
titleSuffix: Azure Data Science Virtual Machine
description: Learn how to configure and create a Data Science Virtual Machine on Azure for analytics and machine learning.
services: machine-learning
ms.service: data-science-vm
author: s-polly
ms.author: scottpolly
ms.topic: quickstart
ms.reviewer: franksolomon
ms.date: 04/27/2024
ms.custom: mode-other
#Customer intent: As a data scientist, I want to learn how to provision the Windows DSVM so that I can move my existing workflow to the cloud.
---

# Quickstart: Set up the Data Science Virtual Machine for Windows

Get up and running with a Windows Server 2022 Data Science Virtual Machine (DSVM).

## Prerequisite

To create a Windows DSVM, you need an Azure subscription. [Try Azure for free](https://azure.com/free).

Azure free accounts don't support GPU-enabled virtual machine (VM) SKUs.

## Create your DSVM

To create a DSVM instance:

1. Go to the [Azure portal](https://portal.azure.com). You might be prompted to sign in to your Azure account, if you're not already signed in.
1. Find the VM listing by entering **data science virtual machine**. Then select **Data Science Virtual Machine - Windows 2022**.

1. Select **Create**.

1. On the **Create a virtual machine** pane, fill in the **Basics** tab:

      * **Subscription**: If you have more than one subscription, select the one on which the machine will be created and billed. You must have resource creation privileges for this subscription.
      * **Resource group**: Create a new group or use an existing one.
      * **Virtual machine name**: Enter the name of the VM. This name is used in your Azure portal.
      * **Location**: Select the datacenter that's most appropriate. For fastest network access, the datacenter that hosts most of your data or is located closest to your physical location is the best choice. For more information, refer to [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
      * **Image**: Leave the default value.
      * **Size**: This option should autopopulate with an appropriate size for general workloads. For more information, refer to [Windows VM sizes in Azure](../../virtual-machines/sizes.md).
      * **Username**: Enter the administrator username. You use this username to sign in to your VM. It doesn't need to match your Azure username.
      * **Password**: Enter the password you plan to use to sign in to your VM.
1. Select **Review + create**.
1. On the **Review + create** pane:
   * Verify that all the information you entered is correct.
   * Select **Create**.

> [!NOTE]
> * You pay no licensing fees for the software that comes preloaded on the VM. You do pay the compute cost for the server size that you chose in the **Size** step.
> * The provisioning process takes 10 to 20 minutes. You can view the status of your VM in the Azure portal.

## Access the DSVM

After you create and provision the VM, follow the steps described in [Connect to your Azure-based VM](../../marketplace/azure-vm-create-using-approved-base.md). Use the admin account credentials that you configured in the **Basics** section of step 4 of creating a VM.

You can now use the tools that are installed and configured on the VM. You can access many of these tools through **Start** menu tiles and desktop icons.

## Next steps

* Open the **Start** menu to explore the tools on the DSVM.
* Read [What is Azure Machine Learning?](../overview-what-is-azure-machine-learning.md) to learn more about Azure Machine Learning.
* Try out [these tutorial resources](../index.yml).
* Read [Data science with a Windows Data Science Virtual Machine in Azure](./vm-do-ten-things.md).
