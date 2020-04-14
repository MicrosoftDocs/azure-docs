---
title: Azure confidential computing solutions on virtual machines
description: Learn about Azure confidential computing solutions on virtual machines.
author: JBCook
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: JenCook
---

# Solutions on Azure virtual machines

This article covers information about deploying Azure Confidential Compute virtual machines running Intel processors back by Intel Software Extension Guard (SGX). 


## Azure Confidential Computing VM Sizes
Azure DCsv2-Series virtual machines (VMs) are designed to protect the confidentially and integrity of your data and code while it's processed in the cloud 

[DCsv2-Series](https://docs.microsoft.com/azure/virtual-machines/dcv2-series) VMs are the latest and most recent confidential computing size family. These VMs support a larger range of deployment capabilities, have 2x the Enclave Page Cache (EPC) and a larger selection of sizes to choose from than DC-Series. These features enhance security, performance, and protection, and use of them is recommended. 

[DC-Series](https://docs.microsoft.com/en-us/azure/virtual-machines/dcv2-series) VMs are backed by 6-core Intel XEON processor with SGX technology. They have smaller EPC and fewer size configurations to choose from. These virtual machines will remain in Preview until deprecation and you can't deploy them through the Azure portal.

### Current available sizes and regions
To get a list of all generally available confidential compute VM sizes in available regions, run the following command in the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest):


```azurecli-interactive
az vm list-skus --size dc --query "[?family=='standardDCSv2Family'].{name:name,locations:locations[0]}" --all --output table
```

As of April 2020, the following SKUs are available:

```bash
Name              Locations
----------------  -------------
Standard_DC8_v2   eastus
Standard_DC1s_v2  eastus
Standard_DC2s_v2  eastus
Standard_DC4s_v2  eastus
Standard_DC8_v2   CanadaCentral
Standard_DC1s_v2  CanadaCentral
Standard_DC2s_v2  CanadaCentral
Standard_DC4s_v2  CanadaCentral
Standard_DC8_v2   uksouth
Standard_DC1s_v2  uksouth
Standard_DC2s_v2  uksouth
Standard_DC4s_v2  uksouth
Standard_DC8_v2   CentralUSEUAP
Standard_DC1s_v2  CentralUSEUAP
Standard_DC2s_v2  CentralUSEUAP
Standard_DC4s_v2  CentralUSEUAP
```

For a more detailed view of the above sizes, run the following command 
```azurecli-interactive
az vm list-skus --size dc --query "[?family=='standardDCSv2Family']"
```

## Deployment considerations
Follow a quickstart tutorial to deploy a DCsv2-Series virtual machine in less than 10 minutes. 

- **Azure subscription** – To deploy a confidential computing VM instance, consider a pay-as-you-go subscription or other purchase option. If you're using an [Azure free account](https://azure.microsoft.com/free/), you won't have quota for the appropriate amount of Azure compute cores.

- **Pricing and regional availability** - Find the pricing for DCsv2-Series VMs on [Virtual Machine Pricing Page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). Check [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for availability in Azure regions.


- **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the DCsv2-Series. To request a quota increase, [open an online customer support request](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests) at no charge. (Default limits may vary depending on your subscription category.)


  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  

- **Resizing** – Because of their specialized hardware, you can only resize confidential computing instances within the same size family. For example, you can only resize a DCsv2-series VM from one DCsv2-series size to another. Resizing from a non-confidential computing size to a confidential computing size isn't supported.  

- **Image** – To provide Intel Software Guard Extension (SGX) support on confidential compute instances, all deployments need to be run on Generation 2 images. Azure Confidential Computing supports workloads running on Ubuntu 18.04 Gen 2, Ubuntu 16.04 Gen 2, and Windows Server 2016 Gen 2. Read about [support for generation 2 VMs on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/generation-2) to learn more about supported and unsupported scenarios. 

- **Storage** – Azure Confidential Computing virtual machine data disks and our ephemeral OS disks are on NVMe disks. Instances support only Premium SSD and Standard SSD disks, not Ultra SSD, or Standard HDD. Virtual machine size **DC8_v2** doesn't support Premium storage. 

- **Disk encryption** – Confidential compute instances don't support Disk encryption at this time. 

## High availability and disaster recovery considerations
When using virtual machines in Azure, you're responsible for implementing a high availability and disaster recovery solution to avoid any downtime. 

Azure Confidential Computing doesn't support zone-redundancy via Availability Zones at this time. For the highest availability and redundancy for confidential computing, use [Availability Sets](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy). Because of hardware restrictions, Availability Sets for confidential computing instances can only have a maximum of 10 update domains. 