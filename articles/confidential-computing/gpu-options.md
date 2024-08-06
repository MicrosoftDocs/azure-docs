---
title: Azure Confidential GPU options
description: Learn about Azure Confidential VMs with confidential GPU.
author: kphande
ms.author: khande
ms.reviewer: ju-shim 
ms.service: azure-virtual-machines
ms.subservice: confidential-computing
ms.custom: confidential-compute
ms.topic: conceptual
ms.date: 07/16/2024
---

# Azure Confidential GPU options

Azure confidential GPUs are based on AMD 4th Gen EPYC processors with SEV-SNP technology and NVIDIA H100 Tensor Core GPUs. In this VM SKU Trusted Execution Environment (TEE) spans confidential VM on the CPU and attached GPU, enabling secure offload of data, models and computation to the GPU.  
 
## Sizes

We offer the following VM sizes:

| Size Family          | TEE | Description                                                                         |
| ------------------ | ------------ | ----------------------------------------------------------------------------------- |
| [**NCCadsH100v5-series**](../virtual-machines/sizes/gpu-accelerated/nccadsh100v5-series.md) | AMD SEV-SNP and NVIDIA H100 Tensor Core GPUs | CVM with Confidential GPU. | 


## Azure CLI

You can use the [Azure CLI](/cli/azure/install-azure-cli) with your confidential GPU VMs.

To see a list of confidential VM sizes, run the following command. Replace `<vm-series>` with the series you want to use. The output shows information about available regions and availability zones.

```azurecli-interactive
vm_series='NCC'
az vm list-skus \
    --size dc \
    --query "[?family=='standard${vm_series}Family'].{name:name,locations:locationInfo[0].location,AZ_a:locationInfo[0].zones[0],AZ_b:locationInfo[0].zones[1],AZ_c:locationInfo[0].zones[2]}" \
    --all \
    --output table
```

For a more detailed list, run the following command instead:

```azurecli-interactive
vm_series='NCC'
az vm list-skus \
    --size dc \
    --query "[?family=='standard${vm_series}Family']" 
```

## Deployment considerations

Consider the following settings and choices before deploying confidential GPU VMs.

### Azure subscription

To deploy a confidential GPU VM instance, consider a [pay-as-you-go subscription](/azure/virtual-machines/linux/azure-hybrid-benefit-linux) or other purchase option. If you're using an [Azure free account](https://azure.microsoft.com/free/), the quota doesn't allow the appropriate number of Azure compute cores.

You might need to increase the cores quota in your Azure subscription from the default value. Default limits vary depending on your subscription category. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the confidential VM sizes. 

To request a quota increase, [open an online customer support request](../azure-portal/supportability/per-vm-quota-requests.md). 

If you have large-scale capacity needs, contact Azure Support. Azure quotas are credit limits, not capacity guarantees. You only incur charges for cores that you use.

### Pricing

For pricing options, see the [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). 

### Regional availability

For availability information, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

### Resizing

Confidential GPU VMs run on specialized hardware and resizing is currently not supported. 

### Guest OS support

OS images for confidential VMs have to meet certain security and compatibility requirements. Qualified images support the secure mounting, attestation, optional [confidential OS disk encryption](confidential-vm-overview.md#confidential-os-disk-encryption), and isolation from underlying cloud infrastructure. These images include:

- Ubuntu 22.04 LTS

For more information about supported and unsupported VM scenarios, see [support for generation 2 VMs on Azure](../virtual-machines/generation-2.md). 

### High availability and disaster recovery

You're responsible for creating high availability and disaster recovery solutions for your confidential GPU VMs. Planning for these scenarios helps minimize and avoid prolonged downtime.

## Next steps 

> [!div class="nextstepaction"]
> [Deploy a confidential GPU VM from the Azure portal](quick-create-confidential-vm-portal.md)

For more information see our [Confidential VM FAQ](confidential-vm-faq.yml).
