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

This article covers information about deploying Azure confidential computing virtual machines (VMs) running Intel processors backed by [Intel Software Guard Extension](https://software.intel.com/sgx) (Intel SGX). 

## Azure confidential computing VM Sizes

Azure confidential computing virtual machines are designed to protect the confidentiality and the integrity of your data and code while it's processed in the cloud 

[DCsv2-Series](../virtual-machines/dcv2-series.md) VMs are the latest and most recent confidential computing size family. These VMs support a larger range of deployment capabilities, have 2x the Enclave Page Cache (EPC) and a larger selection of sizes compared to our DC-Series VMs. The [DC-Series](../virtual-machines/sizes-previous-gen.md#preview-dc-series) VMs are currently in preview and will be deprecated and not included in general availability.

Start deploying a DCsv2-Series VM via the Microsoft commercial marketplace by following the [quickstart tutorial](quick-create-marketplace.md).

### Current available sizes and regions

To get a list of all generally available confidential compute VM sizes in available regions and availability zones, run the following command in the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest):

```azurecli-interactive
az vm list-skus 
    --size dc 
    --query "[?family=='standardDCSv2Family'].{name:name,locations:locationInfo[0].location,AZ_a:locationInfo[0].zones[0],AZ_b:locationInfo[0].zones[1],AZ_c:locationInfo[0].zones[2]}" 
    --all 
    --output table
```

As of May 2020, these SKUs are available in the following regions and availability zones:

```output
Name              Locations      AZ_a
----------------  -------------  ------
Standard_DC8_v2   eastus         2
Standard_DC1s_v2  eastus         2
Standard_DC2s_v2  eastus         2
Standard_DC4s_v2  eastus         2
Standard_DC8_v2   CanadaCentral
Standard_DC1s_v2  CanadaCentral
Standard_DC2s_v2  CanadaCentral
Standard_DC4s_v2  CanadaCentral
Standard_DC8_v2   uksouth        3
Standard_DC1s_v2  uksouth        3
Standard_DC2s_v2  uksouth        3
Standard_DC4s_v2  uksouth        3
Standard_DC8_v2   CentralUSEUAP
Standard_DC1s_v2  CentralUSEUAP
Standard_DC2s_v2  CentralUSEUAP
Standard_DC4s_v2  CentralUSEUAP
```

For a more detailed view of the above sizes, run the following command:

```azurecli-interactive
az vm list-skus 
    --size dc 
    --query "[?family=='standardDCSv2Family']"
```

## Deployment considerations

Follow a quickstart tutorial to deploy a DCsv2-Series virtual machine in less than 10 minutes. 

- **Azure subscription** – To deploy a confidential computing VM instance, consider a pay-as-you-go subscription or other purchase option. If you're using an [Azure free account](https://azure.microsoft.com/free/), you won't have quota for the appropriate amount of Azure compute cores.

- **Pricing and regional availability** - Find the pricing for DCsv2-Series VMs on [Virtual Machine Pricing Page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). Check [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for availability in Azure regions.


- **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the DCsv2-Series. To request a quota increase, [open an online customer support request](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests) at no charge. Note, default limits may vary depending on your subscription category.

  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  
- **Resizing** – Because of their specialized hardware, you can only resize confidential computing instances within the same size family. For example, you can only resize a DCsv2-series VM from one DCsv2-series size to another. Resizing from a non-confidential computing size to a confidential computing size isn't supported.  

- **Image** – To provide Intel Software Guard Extension (Intel SGX) support on confidential compute instances, all deployments need to be run on Generation 2 images. Azure confidential computing supports workloads running on Ubuntu 18.04 Gen 2, Ubuntu 16.04 Gen 2, Windows Server 2019 gen2, and Windows Server 2016 Gen 2. Read about [support for generation 2 VMs on Azure](../virtual-machines/linux/generation-2.md) to learn more about supported and unsupported scenarios. 

- **Storage** – Azure confidential computing virtual machine data disks and our ephemeral OS disks are on NVMe disks. Instances support only Premium SSD and Standard SSD disks, not Ultra SSD, or Standard HDD. Virtual machine size **DC8_v2** doesn't support Premium storage. 

- **Disk encryption** – Confidential compute instances don't support Disk encryption at this time. 

## High availability and disaster recovery considerations

When using virtual machines in Azure, you're responsible for implementing a high availability and disaster recovery solution to avoid any downtime. 

Azure confidential computing doesn't support zone-redundancy via Availability Zones at this time. For the highest availability and redundancy for confidential computing, use [Availability Sets](../virtual-machines/windows/manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy). Because of hardware restrictions, Availability Sets for confidential computing instances can only have a maximum of 10 update domains. 

## Deploying via an Azure Resource Manager Template 

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure subscription. You can use management features, like access control, locks, and tags, to secure and organize your resources after deployment.

To learn about Azure Resource Manager templates, see [Template deployment overview](../azure-resource-manager/templates/overview.md).

To deploy a DCsv2-Series VM in an Azure Resource Manager template, you will utilize the [Virtual Machine resource](../virtual-machines/windows/template-description.md). Ensure you specify the correct properties for **vmSize** and for your **imageReference**.

### VM Size

Specify one of the following sizes in your Azure Resource Manager template in the Virtual Machine resource. This string is put as **vmSize** in **properties**.

```json
  [
        "Standard_DC1s_v2",
        "Standard_DC2s_v2",
        "Standard_DC4s_v2",
        "Standard_DC8_v2"
      ],
```

### Gen2 OS Image

Under **properties**, you will also have to reference an image under **storageProfile**. Use *only one* of the following images for your **imageReference**.

```json
      "2019-datacenter-gensecond": {
        "offer": "WindowsServer",
        "publisher": "MicrosoftWindowsServer",
        "sku": "2019-datacenter-gensecond",
        "version": "latest"
      },
      "2016-datacenter-gensecond": {
        "offer": "WindowsServer",
        "publisher": "MicrosoftWindowsServer",
        "sku": "2016-datacenter-gensecond",
        "version": "latest"
      },
        "18_04-lts-gen2": {
        "offer": "UbuntuServer",
        "publisher": "Canonical",
        "sku": "18_04-lts-gen2",
        "version": "latest"
      },
      "16_04-lts-gen2": {
        "offer": "UbuntuServer",
        "publisher": "Canonical",
        "sku": "16_04-lts-gen2",
        "version": "latest"
      }
```

## Next Steps 

In this article, you learned about the qualifications and configurations needed when creating confidential computing virtual machine. You can now head to the Microsoft Azure Marketplace to deploy a DCsv2-Series VM.

> [!div class="nextstepaction"]
> [Deploy a DCsv2-Series Virtual Machine in the Azure Marketplace](quick-create-marketplace.md)