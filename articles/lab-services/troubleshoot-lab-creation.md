---
title: Troubleshoot lab creation
titleSuffix: Azure Lab Services
description: Learn how to resolve common issues with creating a lab in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: troubleshooting
ms.date: 01/19/2023
---

# Troubleshoot lab creation in Azure Lab Services

In this article, you learn how to resolve common issues with creating a lab in Azure Lab Services. The options that are available to a lab creator for creating a lab on a lab plan depend on the lab plan configuration settings. For example, in the lab plan you can specify which virtual machine images or sizes are available.

## Prerequisites

- To change settings for the lab plan, your Azure account needs the Owner or Contributor [RBAC](../role-based-access-control/overview.md) role on the lab plan. Learn more about the [Azure Lab Services built-in roles](./administrator-guide.md#rbac-roles).

## Virtual machine image is not available

On the lab plan, you can configure the list of available VM images for creating a lab:

1. Select VM images from the Azure Marketplace
1. Select custom VM images from an Azure compute gallery

Verify the following potential causes for a VM image not to be available.

### Virtual machine image is not enabled

In the lab plan configuration, you can enable or disable specific VM images for both Marketplace images and Azure Compute Gallery images. To enable images, see [how to specify Azure Marketplace images](specify-marketplace-images.md) or [how to enable image in an Azure compute gallery](./how-to-attach-detach-shared-image-gallery.md#enable-and-disable-images).

### Azure compute gallery is not connected to the lab plan

To use custom VM images, you have to connect an Azure compute gallery to your lab plan. [Verify if the compute gallery is attached to the lab plan](./how-to-attach-detach-shared-image-gallery.md), or [save a custom image to your compute gallery](./approaches-for-custom-image-creation.md).

### Virtual machine image is not in the same location as the lab plan

To use a custom VM image from a compute gallery, the image has to be replicated in the same location as the lab plan. You can configure replication in the compute gallery. Learn more about how to [store and share images in an Azure compute gallery](/azure/virtual-machines/shared-image-galleries).

### Virtual machine image size is too large or uses multiple disks

Azure Lab Services doesn't support VM image sizes that are larger than 127 GB, or images with multiple disks.

## Virtual machine size is not available

On the lab plan, you can configure which VM sizes are available for creating a lab. In addition, your Azure subscription has a quota for the number of CPU or GPU cores that are available.

Verify the following potential causes for a VM size not to be available.

### VM size is restricted on the lab plan

On the lab plan, you can set a policy to restrict which VM SKU sizes are available for creating labs. For example, you can prevent labs to use GPU-powered virtual machines. Learn how you can [configure VM size restrictions for creating labs](./how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy.md).

### Quota limit is reached

Your Azure subscription has limits (quota) on the number of cores you use. The quota is based on specific VM size and Azure region. To learn more about [capacity limits in Azure Lab Services](./capacity-limits.md).

If you've reached the limit of VM cores of a specific VM size, or if the quota is granted for a different region than the region of the lab plan, the VM size isn't available for creating labs.

[Determine your current VM core usage and the quota](./how-to-determine-your-quota-usage.md) for your Azure subscription.

Learn how you can [request a VM core limit increase](capacity-limits.md#request-a-limit-increase).

>[!TIP]
> You can also run a script to query for lab quotas across all your regions. For more information, see the [PowerShell Quota script](https://aka.ms/azlabs/scripts/quota-powershell).

## Azure region or location is not available

When you create a lab, you need to select an Azure region where the lab will be hosted. On the lab plan, you can configure which Azure regions are available for creating labs.

Verify the following potential causes for an Azure region not to be available.

### Azure region is not enabled on the lab plan

On the lab plan, you can enable one or multiple regions for creating labs. Learn how you can [configure Azure regions for creating labs](./create-and-configure-labs-admin.md).

### Lab plan and lab are in a different region than the virtual network

When your lab plan uses advanced networking, the lab plan and all labs must be in the same region as the virtual network. For more information, see [Use Azure Lab Services advanced networking](how-to-connect-vnet-injection.md).

## Advanced troubleshooting

[!INCLUDE [contact Azure support](includes/lab-services-contact-azure-support.md)]

## Next steps

For more information about setting up and managing labs, see:

- [Manage lab plans](how-to-manage-lab-plans.md)  
- [Lab setup guide](setup-guide.md)
