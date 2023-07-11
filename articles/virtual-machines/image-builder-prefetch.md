--- 
title: VM Boot Optimization for Azure Compute Gallery Images with Azure VM Image Builder 
description: Optimize VM Boot and Provisioning time with Azure VM Image Builder 
ms.author: surbhijain 
ms.reviewer: kofiforson 
ms.date: 06/07/2023 
ms.topic: how-to 
ms.service: virtual-machines 
ms.subservice: image-builder
--- 

  

# VM optimization for gallery images with Azure VM Image Builder 

  **Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Virtual Machine Scale Sets 

In this article, you learn how to use Azure VM Image Builder to optimize your ACG (Azure Compute Gallery) Images or Managed Images or VHDs to improve the create time for your VMs. 

## Azure VM Optimization 
Azure VM optimization improves virtual machine creation time by updating the gallery image to optimize the image for a faster boot time. 

## Image types supported 

Optimization for the following images is supported: 

| Features  | Details   |
|---|---|
|OS Type| Linux, Windows |
| Partition | MBR/GPT |
| Hyper-V | Gen1/Gen2 |
| OS State | Generalized |

The following types of images aren't supported: 

* Images with size greater than 2 TB 
* ARM64 images 
* Specialized images


## Optimization in Azure VM Image Builder 

Optimization can be enabled while creating a VM image using the CLI. 

Customers can create an Azure VM Image Builder template using CLI. It contains details regarding source, type of customization, and distribution.

In your template, you will need to enable the additional fields for VM optimization. For more information on how to enable the VM optimization fields for your image builder template, see the [Optimize property](../virtual-machines/linux/image-builder-json.md#properties-optimize).

> [!NOTE]
> To enable VM optimization benefits, you must be using Azure Image Builder API Version `2022-07-01` or later.

  

## FAQs 

  

### Can VM optimization be used without Azure VM Image Builder customization? 

  

Yes, customers can opt for only VM optimization without using Azure VM Image Builder customization feature. Customers can simply enable the optimization flag and keep customization field as empty.  

  

### Can an existing ACG image version be optimized? 

No, this optimization feature won't update an existing SIG image version. However, optimization can be enabled during new version creation for an existing image 

  

## How much time does it take for generating an optimized image? 

 

 The below latencies have been observed at various percentiles: 

| OS | Size | P50 | P95 | Average |
| --- | --- | --- | --- | --- |
| Linux | 30 GB VHD | 20 mins | 21 mins | 20 mins |
| Windows | 127 GB VHD | 34 mins | 35 mins | 33 mins |

  

This is the end to end duration observed. Note, image generation duration varies based on different factors such as, OS Type, VHD size, OS State, etc. 

  

### Is OS image copied out of customer subscription for optimization? 

Yes, the OS VHD is copied from customer subscription to Azure subscription for optimization in the same geographic location. Once optimization is finished or timed out, Azure internally deletes all copied OS VHDs.  

### What are the performance improvements observed for VM boot optimization?

Enabling VM boot optimization feature may not always result in noticeable performance improvement as it depends on several factors like source image already optimized, OS type, customization etc. However, to ensure the best VM boot performance, it's recommended to enable this feature.

  

## Next steps 
Learn more about [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md).
