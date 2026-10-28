---
title: Azure Confidential VM options
description: Compare Azure confidential VM options across AMD and Intel trusted execution technologies.
author: iamwilliew
ms.author: wwilliams
ms.reviewer: mattmcinnes
ms.service: azure-confidential-computing
ms.custom: devx-track-azurecli
ms.topic: concept-article
ms.date: 06/30/2026
# Customer intent: "As a cloud administrator, I want to evaluate confidential VM options on AMD and Intel processors, so that I can select the most suitable environment for my workloads with optimal security and performance."
---

# Azure Confidential VM options

Azure offers Trusted Execution Environment (TEE) options from both AMD and Intel. These TEEs let you deploy confidential VMs for many workloads without code changes.

AMD-based confidential VMs use [AMD SEV-SNP](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf), introduced with 3rd Gen AMD EPYC processors. Intel-based confidential VMs use [Intel TDX](https://cdrdv2-public.intel.com/690419/TDX-Whitepaper-February2022.pdf), introduced with 5th Gen Intel Xeon processors. The implementations differ, but both provide strong protection from the cloud infrastructure stack.

## Sizes

The following VM sizes are available:

| Size Family          | TEE | Description                                                                         |
| ------------------ | ------------ | ----------------------------------------------------------------------------------- |
| **DCasv5-series** | AMD SEV-SNP | General purpose CVM with remote storage. No local temporary disk.                  |
| **DCadsv5-series** | AMD SEV-SNP | General purpose CVM with local temporary disk.                                        |
| **ECasv5-series** | AMD SEV-SNP | Memory-optimized CVM with remote storage. No local temporary disk. |
| **ECadsv5-series** | AMD SEV-SNP | Memory-optimized CVM with local temporary disk.                      |
| **DCasv6-series** | AMD SEV-SNP | General purpose CVM with remote storage. No local temporary disk.                  |
| **DCadsv6-series** | AMD SEV-SNP | General purpose CVM with local temporary disk.                                        |
| **ECasv6-series** | AMD SEV-SNP | Memory-optimized CVM with remote storage. No local temporary disk. |
| **ECadsv6-series** | AMD SEV-SNP | Memory-optimized CVM with local temporary disk.                      |
| **DCesv6-series** | Intel TDX | General purpose CVM with remote storage. No local temporary disk.                  |
| **DCedsv6-series** | Intel TDX | General purpose CVM with local temporary disk.                                        |
| **ECesv6-series** | Intel TDX | Memory-optimized CVM with remote storage. No local temporary disk. |
| **ECedsv6-series** | Intel TDX | Memory-optimized CVM with local temporary disk. |
| **NCCadsH100v5-series** | AMD SEV-SNP and NVIDIA H100 Tensor Core GPUs | CVM with Confidential GPU. | 

> [!NOTE]
> Memory-optimized confidential VMs offer double the ratio of memory per vCPU count.

## CVM naming differences by technology

Azure CVM names follow a consistent pattern, but the family letters differ between AMD SEV-SNP and Intel TDX offerings.

- **AMD SEV-SNP families** use `a` in the family name, such as `DCasv5` and `ECadsv6`.
- **Intel TDX families** use `e` in the family name, such as `DCesv6` and `ECedsv6`.
- A `d` in the family name (for example, `DCadsv6` or `DCedsv6`) indicates local temporary disk variants.
- `D` families are general-purpose and `E` families are memory-optimized.

The following examples show the naming pattern in this article:

| Pattern | Example | Technology |
| --- | --- | --- |
| `DCa*` / `ECa*` | `DCasv6`, `ECadsv5` | AMD SEV-SNP |
| `DCe*` / `ECe*` | `DCesv6`, `ECedsv6` | Intel TDX |

## Azure CLI commands

You can use the [Azure CLI](/cli/azure/install-azure-cli) with your confidential VMs.

To see a list of confidential VM sizes, run the following command. Replace `<vm-series>` with the series you want to use. The output shows information about available regions and availability zones.

```azurecli-interactive
vm_series='DCASv5'
az vm list-skus \
    --size dc \
    --query "[?family=='standard${vm_series}Family'].{name:name,locations:locationInfo[0].location,AZ_a:locationInfo[0].zones[0],AZ_b:locationInfo[0].zones[1],AZ_c:locationInfo[0].zones[2]}" \
    --all \
    --output table
```

For a more detailed list, run the following command instead:

```azurecli-interactive
vm_series='DCASv5'
az vm list-skus \
    --size dc \
    --query "[?family=='standard${vm_series}Family']" 
```

## Deployment considerations

Consider the following settings and choices before deploying confidential VMs.

### Azure subscription

To deploy a confidential VM instance, consider a [pay-as-you-go subscription](/azure/virtual-machines/linux/azure-hybrid-benefit-linux) or other purchase option. If you're using an [Azure free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn), the quota doesn't allow the appropriate number of Azure compute cores.

You might need to increase the cores quota in your Azure subscription from the default value. Default limits vary depending on your subscription category. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the confidential VM sizes. 

To request a quota increase, [open an online customer support request](/azure/azure-portal/supportability/per-vm-quota-requests). 

If you have large-scale capacity needs, contact Azure Support. Azure quotas are credit limits, not capacity guarantees. You only incur charges for cores that you use.

### Pricing

For pricing options, see the [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). 

### Regional availability

For availability information, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

### Resizing

Confidential VMs run on specialized hardware, so you can only [resize confidential VM instances](confidential-vm-faq.yml#can-i-convert-a-dcasv5-ecasv5-cvm-into-a-dcesv5-ecesv5-cvm-or-a-dcesv5-ecesv5-cvm-into-a-dcasv5-ecasv5-cvm-) to other confidential sizes in the same region. For example, if you have a DCasv5-series VM, you can resize to another DCasv5-series instance or a DCesv6-series instance. 

You can't resize a non-confidential VM to a confidential VM.

### High availability and disaster recovery

You're responsible for creating high availability and disaster recovery solutions for your confidential VMs. Planning for these scenarios helps minimize and avoid prolonged downtime.

### Deployment with ARM templates

Azure Resource Manager is the deployment and management service for Azure. You can:

- Secure and organize your resources after deployment with the management features, like access control, locks, and tags. 
- Create, update, and delete resources in your Azure subscription using the management layer.
- Use [Azure Resource Manager templates (ARM templates)](../azure-resource-manager/templates/overview.md) to deploy confidential VMs on AMD processors.

Make sure to specify the following properties for your VM in the parameters section (`parameters`): 

- VM size (`vmSize`). Choose from the different [confidential VM families and sizes](#sizes).
- OS image name (`osImageName`). Choose from the qualified OS images. 
- Disk encryption type (`securityType`). Choose from VMGS-only encryption (`VMGuestStateOnly`) or full OS disk pre-encryption (`DiskWithVMGuestState`), which might result in longer provisioning times.

## Next steps 

> [!div class="nextstepaction"]
> [Deploy a confidential VM from the Azure portal](quick-create-confidential-vm-portal.md)

Start with [Azure confidential computing code samples on GitHub](https://aka.ms/accsamples).

For more information see our [Confidential VM FAQ](confidential-vm-faq.yml).
