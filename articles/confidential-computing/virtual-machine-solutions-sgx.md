---
title: Deploy Intel SGX virtual machines
description: Learn about using Intel SGX virtual machines (VMs) in Azure confidential computing.
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 9/12/2023
ms.author: mamccrea
ms.custom: ignite-fall-2021, devx-track-arm-template
---

# Solutions on Azure for Intel SGX

You can deploy Intel Software Guard Extension (Intel SGX) virtual machines (VM) for use in Azure confidential computing. 

### Current available sizes and regions

To get a list of Intel SGX VM sizes, use the [Azure Command-Line Interface (Azure CLI)](/cli/azure/what-is-azure-cli). [Install the Azure CLI](/cli/azure/install-azure-cli) if you haven't already done so. Then, run the following command to list the Intel SGX sizes with region and availability zone information.

```azurecli-interactive
az vm list-skus `
    --size Standard_DC `
    --all `
    --output table
```

### Dedicated host requirements

Deploying a **Standard_DC8_v2**, **Standard_DC48s_v3**, or **Standard_DC48ds_v3** series VM occupies the full host. Other tenants or subscriptions don't share the host. This family of VM SKUs provides the isolation you might need to meet compliance and security regulatory requirements. Normally, you might need a dedicated host service to meet these requirements. 

For these VM sizes, the physical host server allocates all available hardware resources, including EPC memory, to your virtual machine only. This deployment isn't the same as the [Azure Dedicated Host](../virtual-machines/dedicated-hosts.md) service in other VM families.

## Deployment considerations

Consider the following factors when you plan your Intel SGX VM deployment on Azure.

### Azure subscription

To deploy a confidential computing VM instance, consider a pay-as-you-go subscription or other purchase option. [Azure free accounts](https://azure.microsoft.com/free/) don't have a high enough quota for the necessary number of Azure compute cores.

### Pricing and regional availability

Find the pricing for **DCsv2**, **DCsv3**, and **DCdsv3** VMs on the [Azure VMs pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). Check the table of [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for availability in different Azure regions.

### Cores quota

You might need to increase the cores quota in your Azure subscription from the default value. Your [subscription might also limit the number of cores](#azure-subscription) that you can deploy in certain VM size families, including **DCsv2-Series**. You can [request a quota increase](../azure-portal/supportability/per-vm-quota-requests.md) at no charge. Default limits might be different based on your subscription category.

If you have large-scale capacity needs, contact Azure Support. Azure quotas are credit limits, not capacity guarantees. Whatever your quota, you're only charged for cores that you use.
  
### Resizing 

Because of their specialized hardware, you can only resize Intel SGX VM instances within the same size family. For example, you can only resize a **DCsv2-series** VM from one **DCsv2-series** size to another. 

### Image

To provide Intel SGX support on confidential compute instances, all deployments must run on Generation 2 images. Azure confidential computing supports workloads running on **Ubuntu 20.04 Gen 2**, **Windows Server 2019 Gen 2** and **Ubuntu 22.04 Gen 2**. For more information about supported and unsupported scenarios, see [support for Generation 2 VMs on Azure](../virtual-machines/generation-2.md).

### Storage

**DCsv2-series** VMs support Standard SSD and Premium SSD, except for **DC8_v2**.

**DCsv3** and **DCdsv3-series** VMs support Standard SSD, Premium SSD, and Ultra Disk.

## High availability and disaster recovery considerations

When you use Azure VMs, you're responsible for creating a high availability (HA) and disaster recovery solution to avoid any downtime. 

Azure confidential computing doesn't support zone-redundancy through Azure availability zones at this time. For the highest availability and redundancy for confidential computing, use [Availability Sets](../virtual-machines/availability-set-overview.md). Because of hardware restrictions, Availability Sets for confidential computing instances can only have a maximum of 10 update domains. 

## Deployment with Azure Resource Manager (ARM) Template

Azure Resource Manager is the deployment and management service for Azure. You can use the service's management layer to create, update, and delete resources in your Azure subscription. There are management features such as access control, locks, and tags. Use these features to secure and organize your resources after deployment.

To learn about Azure Resource Manager templates (ARM templates), see the [Templates overview](../azure-resource-manager/templates/overview.md).

To deploy using ARM templates, see [Virtual machines in an Azure Resource Manager template](../virtual-machines/windows/template-description.md). Make sure to specify the correct properties for **vmSize** and your **imageReference**.

### VM sizes

Specify one of the following sizes in your ARM template in the VM resource. This string is **vmSize** in **properties**.

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

Under **properties**, you also have to specify an image under **storageProfile**. Use *only one* of the following images for your **imageReference**.

```json
  "2019-datacenter-gensecond": {
    "offer": "WindowsServer",
    "publisher": "MicrosoftWindowsServer",
    "sku": "2019-datacenter-gensecond",
    "version": "latest"
  },
  "20_04-lts-gen2": {
    "offer": "0001-com-ubuntu-server-focal",
    "publisher": "Canonical",
    "sku": "20_04-lts-gen2",
    "version": "latest"
  }
  "22_04-lts-gen2": {
    "offer": "0001-com-ubuntu-server-jammy",
    "publisher": "Canonical",
    "sku": "22_04-lts-gen2",
    "version": "latest"
  },
```

## Next step

> [!div class="nextstepaction"]
> [Create an Intel SGX VM using Azure Marketplace](quick-create-marketplace.md)
