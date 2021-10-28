---
title: Azure confidential computing solutions on virtual machines
description: Learn about Azure confidential computing solutions on virtual machines.
author: JBCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: JenCook
---

# Solutions on Azure for Intel SGX

This article covers information about deploying Intel SGX VMs.

### Current available sizes and regions

To get a list of Intel SGX VM sizes in available regions and availability zones, run the following command in the [Azure CLI](/cli/azure/install-azure-cli-windows):

```azurecli-interactive
az vm list-skus `
    --size Standard_DC `
    --all `
    --output table
```

### Dedicated host requirements

Deploying a **Standard_DC8_v2**, **Standard_DC48s_v3**, **Standard_DC48ds_v3** virtual machine will occupy the full host and will not be shared with other tenants or subscriptions. This VM SKU family provides the isolation you may need in order to meet compliance and security regulatory requirements that are normally met by having a dedicated host service. When you choose these sizes, the physical host server will allocate all of the available hardware resources including EPC memory only to your virtual machine. This deployment is not the same as the [Azure Dedicated Host](../virtual-machines/dedicated-hosts.md) service that is provided by other Azure VM Families.


## Deployment considerations

Follow a quickstart tutorial to deploy a DCsv2-Series virtual machine in less than 10 minutes. 

- **Azure subscription** – To deploy a confidential computing VM instance, consider a pay-as-you-go subscription or other purchase option. If you're using an [Azure free account](https://azure.microsoft.com/free/), you won't have quota for the appropriate amount of Azure compute cores.

- **Pricing and regional availability** - Find the pricing for DCsv2, DCsv3 and DCdsv3 VMs on [Virtual Machine Pricing Page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). Check [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for availability in Azure regions.

- **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the DCsv2-Series. To request a quota increase, [open an online customer support request](../azure-portal/supportability/per-vm-quota-requests.md) at no charge. Note, default limits may vary depending on your subscription category.

  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  
- **Resizing** – Because of their specialized hardware, you can only resize these instances within the same size family. For example, you can only resize a DCsv2-series VM from one DCsv2-series size to another. 

- **Image** – To provide Intel Software Guard Extension (Intel SGX) support on confidential compute instances, all deployments need to be run on Generation 2 images. Azure confidential computing supports workloads running on Ubuntu 20.04 Gen 2, Ubuntu 18.04 Gen 2 and Windows Server 2019 Gen 2. Read about [support for Generation 2 VMs on Azure](../virtual-machines/generation-2.md) to learn more about supported and unsupported scenarios. 

- **Storage** – DCsv2-series supports Standard SSD and Premium SSD, with the exception of DC8_v2. DCsv3 and DCdsv3-series supports Standard SSD, Premium SSD and Ultra Disk.

- **Disk encryption** – Confidential compute instances don't support Disk encryption at this time. 

## High availability and disaster recovery considerations

When using virtual machines in Azure, you're responsible for implementing a high availability and disaster recovery solution to avoid any downtime. 

Azure confidential computing doesn't support zone-redundancy via Availability Zones at this time. For the highest availability and redundancy for confidential computing, use [Availability Sets](../virtual-machines/availability-set-overview.md). Because of hardware restrictions, Availability Sets for confidential computing instances can only have a maximum of 10 update domains. 

## Deployment with Azure Resource Manager (ARM) Template

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure subscription. You can use management features, like access control, locks, and tags, to secure and organize your resources after deployment.

To learn about ARM templates, see [Template deployment overview](../azure-resource-manager/templates/overview.md).

To deploy using ARM templates, utilize the [Virtual Machine resource](../virtual-machines/windows/template-description.md). Ensure you specify the correct properties for **vmSize** and for your **imageReference**.

### VM size

Specify one of the following sizes in your ARM template in the Virtual Machine resource. This string is put as **vmSize** in **properties**.

```json
  [
        "Standard_DC1s_v2",
        "Standard_DC2s_v2",
        "Standard_DC4s_v2",
        "Standard_DC8_v2",
        "Standard_DC1s_v3",
        "Standard_DC2s_v3",
        "Standard_DC4s_v3",
        "Standard_DC8s_v3",
        "Standard_DC16s_v3",
        "Standard_DC24s_v3",
        "Standard_DC32s_v3",
        "Standard_DC48s_v3",
        "Standard_DC1ds_v3",
        "Standard_DC2ds_v3",
        "Standard_DC4ds_v3",
        "Standard_DC8ds_v3",
        "Standard_DC16ds_v3",
        "Standard_DC24ds_v3",
        "Standard_DC32ds_v3",
        "Standard_DC48ds_v3",
      ],
```

### Gen2 OS image

Under **properties**, you will also have to reference an image under **storageProfile**. Use *only one* of the following images for your **imageReference**.

```json
      "2019-datacenter-gensecond": {
        "offer": "WindowsServer",
        "publisher": "MicrosoftWindowsServer",
        "sku": "2019-datacenter-gensecond",
        "version": "latest"
      },
        "18_04-lts-gen2": {
        "offer": "UbuntuServer",
        "publisher": "Canonical",
        "sku": "18_04-lts-gen2",
        "version": "latest"
      },
      "20_04-lts-gen2": {
        "offer": "UbuntuServer",
        "publisher": "Canonical",
        "sku": "20_04-lts-gen2",
        "version": "latest"
      }
```

## Next steps 

In this article, you learned about the qualifications and configurations needed when creating an Intel SGX VM.

> [!div class="nextstepaction"]
> [Create an Intel SGX VM using Azure Marketplace](quick-create-marketplace.md)
