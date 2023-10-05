---
title: 'Quickstart: Create a Windows Data Science Virtual Machine'
titleSuffix: Azure Data Science Virtual Machine
description: Configure and create a Data Science Virtual Machine on Azure for analytics and machine learning.
services: machine-learning
ms.service: data-science-vm
author: s-polly
ms.author: scottpolly
ms.topic: quickstart
ms.date: 12/31/2019
ms.custom: mode-other
#Customer intent: As a data scientist, I want to learn how to provision the Windows DSVM so that I can move my existing workflow to the cloud.
---

# Quickstart: Set up the Data Science Virtual Machine for Windows

Get up and running with a Windows Server 2019 Data Science Virtual Machine.

## Prerequisite

To create a Windows Data Science Virtual Machine, you must have an Azure subscription. [Try Azure for free](https://azure.com/free).
Please note Azure free accounts do not support GPU enabled virtual machine SKUs.

## Create your DSVM

To create a DSVM instance:

1. Go to the [Azure portal](https://portal.azure.com) You might be prompted to sign in to your Azure account if you're not already signed in.
1. Find the virtual machine listing by typing in "data science virtual machine" and selecting "Data Science Virtual Machine - Windows 2019."

1. Select the **Create** button at the bottom.

1. You should be redirected to the "Create a virtual machine" blade.

1. Fill in the **Basics** tab:
      * **Subscription**: If you have more than one subscription, select the one on which the machine will be created and billed. You must have resource creation privileges for this subscription.
      * **Resource group**: Create a new group or use an existing one.
      * **Virtual machine name**: Enter the name of the virtual machine. This is how it will appear in your Azure portal.
      * **Location**: Select the datacenter that's most appropriate. For fastest network access, it's the datacenter that has most of your data or is closest to your physical location. Learn more about [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/).
      * **Image**: Leave the default value.
      * **Size**: This should auto-populate with a size that is appropriate for general workloads. Read more about [Windows VM sizes in Azure](../../virtual-machines/sizes.md).
      * **Username**: Enter the administrator username. This is the username you will use to log into your virtual machine, and need not be the same as your Azure username.
      * **Password**: Enter the password you will use to log into your virtual machine.    
1. Select **Review + create**.
1. **Review+create**
   * Verify that all the information you entered is correct. 
   * Select **Create**.


> [!NOTE]
> * You do not pay licensing fees for the software that comes pre-loaded on the virtual machine. You do pay the compute cost for the server size that you chose in the **Size** step.
> * Provisioning takes 10 to 20 minutes. You can view the status of your VM on the Azure portal.

## Access the DSVM

After the VM is created and provisioned, follow the steps listed to [connect to your Azure-based virtual machine](../../marketplace/azure-vm-create-using-approved-base.md). Use the admin account credentials that you configured in the **Basics** step of creating a virtual machine. 

You're ready to start using the tools that are installed and configured on the VM. Many of the tools can be accessed through **Start** menu tiles and desktop icons.

<a name="tools"></a>


## Next steps

* Explore the tools on the DSVM by opening the **Start** menu.
* Learn about the Azure Machine Learning by reading [What is Azure Machine Learning?](../overview-what-is-azure-machine-learning.md) and trying out [tutorials](../index.yml).
* Read the article [Data Science with a Windows Data Science Virtual Machine in Azure](./vm-do-ten-things.md)
