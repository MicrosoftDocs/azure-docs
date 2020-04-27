---
title: Azure Confidential Computing FAQ
description: Answers to frequently asked questions about Azure confidential computing.
author: JBCook
ms.topic: troubleshooting
ms.workload: infrastructure
ms.service: virtual-machines
ms.subservice: workloads
ms.date: 4/17/2020
ms.author: jencook
---

# Frequently asked questions for Azure Confidential Computing

This article provides answers to some of the most common questions about running [confidential computing workloads on Azure](overview.md).

If your Azure issue is not addressed in this article, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue in these forums, or post to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). You can also submit an Azure support request. To submit a support request, on the [Azure support page](https://azure.microsoft.com/support/options/), select Get support.

## Confidential Computing Virtual Machines <a id="vm-faq"></a>

1. **How can I deploy DCsv2 series VMs on Azure?**

   Here are some ways you can deploy a DCsv2 VM:
   - Using an [Azure Resource Manager Template](../virtual-machines/windows/template-description.md)
   - From the [Azure portal](https://portal.azure.com/#create/hub)
   - In the [Azure confidential compute (Virtual Machine)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-compute.acc-virtual-machine-v2?tab=overview) marketplace solution template. The marketplace solution template will help constrain a customer to the supported scenarios (regions, images, availability, disk encryption). 

1. **Will all OS images work with Azure confidential computing?**

   No. The virtual machines can only be deployed on Generation 2 virtual machines with Ubuntu Server 18.04, Ubuntu Server 16.04, and Windows Server 2016 Datacenter. Read more about Gen 2 VMs on [Linux](../virtual-machines/linux/generation-2.md) and [Windows](../virtual-machines/windows/generation-2.md)

1. **DCsv2 virtual machines are grayed out in the portal and I can't select one**

   Make sure to toggle the filters as listed below and see if they become available:
    -	**UnsupportedGeneration**: Change the generation of the virtual machine image to “Gen2”.
    -	**NotAvailableForSubscription** : The region isn't yet available for your subscription. Select an available region.
    
1. **I get an ARM deployment failure error "Operation could not be completed as it results in exceeding approved standard DCSV2 Family Cores Quota**

-	**InsufficientQuota**: [Create a support request to increase your quota](../azure-portal/supportability/per-vm-quota-requests.md). Free trial subscriptions don't have quota for confidential computing VMs. 

1. **DCsv2 virtual machines don't show up when I try to search for them in the portal size selector**

   Make sure you've selected an available region. Also make sure you select “clear all filters” in the size selector. 

1. **What’s the difference between DCsv2-Series and DC-Series VMs?**

   DC-Series VMs run on older 6-core Intel Processors with SGX and have less memory, smaller EPC (Enclave Page Cage) memory, and available in less number of regions(US East and Europe West in Standard_DC2s and Standard_DC4s sizes). These VM's are not planned to be made Generally Available and not recommended. If you still like to deploy these VM's please use this Azure Market place template - [Confidential Compute DC-Series VM [Preview]](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-compute.confidentialcompute?tab=Overview) Marketplace instance

1. **Are DCsv2 virtual machines available globally?**

   Not yet, these virtual machines are now available in select regions [in these select regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for the latest available regions. 

1. **How do I install the Open Enclave SDK on the DCsv2 VM's?**
   
   For instructions on how to install the OE SDK on an Azure or on-premise machines, follow the instructions on the [Open Enclave SDK GitHub](https://github.com/openenclave/openenclave).
     
   You can also look into Open Enclave SDK GitHub for OS-specific installation instructions:
     - [Install the OE SDK on Windows](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install_oe_sdk-Windows.md)
     - [Install the OE SDK on Ubuntu 18.04](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install_oe_sdk-Ubuntu_18.04.md)
     - [Install the OE SDK on Ubuntu 16.04](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install_oe_sdk-Ubuntu_16.04.md)
