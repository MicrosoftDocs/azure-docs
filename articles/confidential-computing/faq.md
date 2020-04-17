---
title: Azure Confidential Computing FAQ
description: This article provides answers to frequently asked questions about confidential computing.
author: JBCook
ms.topic: troubleshooting
ms.workload: infrastructure
ms.date: 4/17/2020
ms.author: jencook
---
# Frequently asked questions for Azure confidential computing

This article provides answers to some of the most common questions about running [confidential computing workloads on Azure](quickstart.md).

[!INCLUDE [support-disclaimer](../../../../includes/support-disclaimer.md)]

## <a id="vm-faq"></a> Confidential Computing Virtual Machines

1. **How can you start deploying DCsv2 series VMs?**

   You can deploy via an [Azure Resource Manager Template](https://docs.microsoft.com/azure/virtual-machines/windows/template-description), the [Azure Portal](https://portal.azure.com/#create/hub), or in the [Confidential Compute (Virtual Machine)](https://aka.ms/accmarketplace) marketplace solution template. The marketplace solution template will help constrain a customer to the supported scenarios (regions, images, availability, disk encryption). 

1. **Will all OS images work with Azure confidential computing?**

   No. The virtual machines can only be deployed on Generation 2 virtual machines. We have worked with our operating system partner teams to enable Generation 2 support for Ubuntu Server 18.04, Ubuntu Server 16.04 and Windows Server 2016 Datacenter. Read more about Gen 2 VMs on [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/generation-2) and [Windows](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/generation-2)

1. **The DCsv2 Virtual Machines are grayed out in the portal so I cannot select one**

    Based on the information bubble next to the VM, you should try different ways to fix this:
    -	**Unsupported generation**: You need to change the generation of the virtual machine image to “Gen2”.
    -	**NotAvailableForSubscription** : The region is not yet available for your subscription. You need to select an available region.
    -	**Insufficient quota**: You need to [create a support request to increase your quota](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests). Note that free trials do not have quota. 

1. **The DCsv2 Virtual Machines do not show up when I try to search for them in the portal size selector**

   Make sure that you have selected an available region. Also make sure that you select “clear all filters” in the size selector. 

1. **What’s the difference between DCsv2-Series and DC-Series VMs?**

   DC-Series VMs run on older 6-core Intel Processors with SGX. These have less total memory, less EPC (Encrypted Page Cage) or “enclave memory”, and are available in less regions. These VMs are only available in US East and Europe West are available in two sizes: Standard_DC2s and Standard_DC4s. They will not go GA and can only be deployed in [this](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-compute.confidentialcompute?tab=Overview) Marketplace instance

1. **The DCsv2 Virtual Machines do not show up when I try to search for them in the portal size selector**

   No, these virtual machines are only available in select regions. Please check the [products by regions page](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for the latest available regions. 

1. **How do I install the Open Enclave SDK?**
     For instruction on how to install on a machine with the latest generation of Intel Xeon processor with SGX technology whether in Azure or on-premise, follow the instructions on the [Open Enclave SDK GitHub](https://microsoft-my.sharepoint-df.com/personal/jencook_microsoft_com/Documents/aka.ms/oesdkgithub).
