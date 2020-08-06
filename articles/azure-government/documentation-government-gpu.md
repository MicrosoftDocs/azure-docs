---
title: GPUs on Azure Government | Microsoft Docs
description: This article provides information on how to get started with GPUs on Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/31/2017
ms.custom: references_regions
---

# GPUs on Azure Government
This page will help you get started using GPUs on Azure Government. 
## Prerequisites
To get started with GPUs and Data Science VMs on Azure Government, you must have an active Azure Government subscription.
If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/overview/clouds/government/) before you begin.

## Variations
NC-Virtual Machines powered by NVIDIA Tesla® K80 GPUs are available in the following regions:
- US Gov Arizona
- US Gov Texas

If you want to start deploying GPUs, navigate to the Marketplace.

**Windows offerings**:
The following are supported in Azure Government:
- Windows Server 2016
- Windows Server 2012 R2

    Once the VM has been created, connect to the VM and install the [NVIDIA Tesla drivers](../virtual-machines/windows/n-series-driver-setup.md). 

**Linux offerings**:
The following are supported in Azure Government:
- Ubuntu 16.04 LTS
- Red Hat Enterprise Linux 7.3
- CentOS-based 7.3

    Once the VM has been created, connect to the VM and install the [NVIDIA Tesla drivers](../virtual-machines/linux/n-series-driver-setup.md).

## Data Science VMs
For those new to Azure we recommend using the Data Science Virtual Machines which support Ubuntu and Windows Server 2016 DSVM solutions. 

>[!Note]
>A DSVM has many VM sizes, but you will need to select “HDD” and an NC* size.
>
> 

The Data Science Virtual Machine(DSVM) has many popular data science and deep learning tools already installed and configured. A list of tools available is located [here](../machine-learning/data-science-virtual-machine/overview.md).

### Create a Data Science VM
In order to create the Data Science VMs navigate to the [Azure Government Portal](https://portal.azure.us) and click "New" to access the Azure Government Marketplace.

- [Provision a Windows Data Science VM](../machine-learning/data-science-virtual-machine/provision-vm.md)
- [Provision a Linux Data Science VM](../machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro.md)

### Using a Data Science VM
- [Ten things you can do on the Windows Data Science VM](../machine-learning/data-science-virtual-machine/vm-do-ten-things.md)
- [Ten things you can do on the Linux Data Science VM](../machine-learning/data-science-virtual-machine/linux-dsvm-walkthrough.md)

## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/).
