---
title: Azure confidential computing solutions on virtual machines
description: Learn about Azure confidential computing solutions on virtual machines.
author: EdCohen
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: EdCohen
---

 <!--- AMD-specific deployment considerations and limitations (regions, SKU Size, etc.) --->


# Solutions on Azure virtual machines

This article covers information about deploying Azure confidential virtual machines (CVMs) running AMD processors backed by [AMD SEV-SNP](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf). 

## Azure confidential VM sizes

Azure confidential machines running AMD processors are now available in preview through our new DCasv5-series and ECasv5-series. They are designed to protect the confidentiality and the integrity of your virtual machine's data and code while it's deployed and running in the cloud.

More precisely, there are four families for you to choose from:
- **DCasv5-series**: confidential VM with remote storage only (no local temp disk)
- **DCadsv5-series**: confidential VM with a local temp disk
- **ECasv5-series**: memory-optimized confidential VM with remote storage only (no local temp disk)
- **ECadsv5-series**: memory-optimized confidential VM with a local temp disk

*Note: Memory-optimized confidential VMs offer double the ratio of memory per vCPU count.*

Start deploying a DCasv5-series VM through Azure Portal by referring to our [Quickstart tutorial](quick-create-portal-cvm.md).

### Current available sizes and regions

To get a list of confidential VM sizes in available regions and availability zones, run the following command in the [Azure CLI](/cli/azure/install-azure-cli-windows) (you can replace DCASv5 with ECASv5 / DCADSv5 / ECADSv5)::

```azurecli-interactive
az vm list-skus `
    --size dc `
    --query "[?family=='standardDCASv5Family'].{name:name,locations:locationInfo[0].location,AZ_a:locationInfo[0].zones[0],AZ_b:locationInfo[0].zones[1],AZ_c:locationInfo[0].zones[2]}" `
    --all `
    --output table
```

For a more detailed view of the above sizes, run the following command (you can replace DCASv5 with ECASv5 / DCADSv5 / ECADSv5):

```azurecli-interactive
az vm list-skus `
    --size dc `
    --query "[?family=='standardDCASv5Family']" 
```

## Deployment considerations

Follow a quickstart tutorial to deploy a confidential virtual machine in less than 10 minutes. 

- **Azure subscription** – To deploy a confidential computing VM instance, consider a pay-as-you-go subscription or other purchase option. If you're using an [Azure free account](https://azure.microsoft.com/free/), you won't have quota for the appropriate amount of Azure compute cores.

- **Pricing and regional availability** - Find the pricing for DCasv5-series and ECasv5-series VMs on [Virtual Machine Pricing Page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). Check [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for availability in Azure regions.


- **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including Casv5-series and ECasv5-series. To request a quota increase, [open an online customer support request](../azure-portal/supportability/per-vm-quota-requests.md) at no charge. Note, default limits may vary depending on your subscription category.

  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  
- **Resizing** – Because of their specialized hardware, you can only resize confidential computing instances within the same size family. For example, you can only resize a DCasv5-series VM from one DCasv5-series size to another. Resizing from a non-confidential computing size to a confidential computing size, or vice versa, isn't supported.  

- **Disk encryption** – Confidential virtual machines support a special full-disk pre-encryption scheme. This provides enhanced disk protection and integrity compared to other Azure disk encryption schemes. If you choose to enable this then prior to first boot your OS disk will be encrypted by a dedicated cloud encryption service. Note that this may lengthen the initial VM creation process by up to a few minutes. Disk encryption keys can be managed by the platform (Platform Managed Keys) or by the customer (Customer Managed Keys). Note that the same key is also used to encrypt a small VM Guest State (VMGS) disk which captures critical confidential VM state settings, such as the virtual TPM and UEFI configuration Pre-encryption of this disk will take place in all cases.

- **Image** – 
Confidential VM operating system images have to meet certain security and compatibility requirements. This ensures that VMs are securely mounted, attested, and isolated from the underlying cloud infrastructure. Qualified images  also support the enhanced full-disk encryption scheme described previously. The list of supported images currently includes Ubuntu 20.04 Gen 2, Windows Server 2019 Gen 2, and Windows Server 2022 Gen 2. Read about [support for generation 2 VMs on Azure](../virtual-machines/generation-2.md) to learn more about supported and unsupported scenarios. 

## High availability and disaster recovery considerations

When using virtual machines in Azure, you're responsible for implementing a high availability and disaster recovery solution to avoid any downtime. 

## Deployment with Azure Resource Manager (ARM) Template

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure subscription. You can use management features, like access control, locks, and tags, to secure and organize your resources after deployment.

To learn about ARM templates, see [Template deployment overview](../azure-resource-manager/templates/overview.md).

To deploy a DCsv2-Series VM in an ARM template, you will utilize the [Virtual Machine resource](../virtual-machines/windows/template-description.md). Ensure you specify the correct properties for **vmSize** and for your **imageReference**.

### VM size

Specify one of the following sizes in your ARM template in the Virtual Machine resource. This string is put as **vmSize** in **properties**.

```json
  [
        "Standard_DC1s_v2",
        "Standard_DC2s_v2",
        "Standard_DC4s_v2",
        "Standard_DC8_v2"
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
      "20_04-lts-gen2": {
        "offer": "UbuntuServer",
        "publisher": "Canonical",
        "sku": "20_04-lts-gen2",
        "version": "latest"
      }
```

## Next steps 

In this article, you learned about the qualifications and configurations needed when creating Confidential virtual machines running AMD processors. 
You can now deploy a DCasv5-series VM through Azure Portal. 

> [!div class="nextstepaction"]
> [Deploy a DCasv5-series virtual machine through Azure Portal](quick-create-portal-cvm.md)