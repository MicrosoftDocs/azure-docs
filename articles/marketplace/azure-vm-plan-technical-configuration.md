---
title: Technical configuration for a virtual machine offer on Azure Marketplace
description: Configure the technical configuration for a virtual machine offer plan.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 03/16/2022
---

# Technical configuration for a virtual machine offer

Provide the images and other technical properties associated with this plan.

## Reuse technical configuration

This option lets you use the same technical configuration settings across plans within the same offer and therefore leverage the same set of images. If you enable the _reuse technical configuration_ option, your plan will inherit the same technical configuration settings as the base plan you select.  When you change the base plan, the changes are reflected on the plan reusing the configuration.

Some common reasons for reusing the technical configuration settings from another plan include:

- The same images are available for both *Pay as you go* and *BYOL*.
- To reuse the same technical configuration from a public plan for a private plan with a different price. 
- Your solution behaves differently based on the plan the user chooses to deploy. For example, the software is the same, but features vary by plan.

Leverage [Azure Instance Metadata Service](../virtual-machines/windows/instance-metadata-service.md) (IMDS) to identify which plan your solution is deployed within to validate license or enabling of appropriate features.

If you later decide to publish different changes between your plans, you can detach them. Detach the plan reusing the technical configuration by deselecting this option with your plan. Once detached, your plan will carry the same technical configuration settings at the place of your last setting and your plans may diverge in configuration. A plan that has been published independently in the past cannot reuse a technical configuration later.

## Operating system

Select the **Windows** or **Linux** operating system family.

Select the Windows **Release** or Linux **Vendor**.

Enter an **OS friendly name** for the operating system. This name is visible to customers.

## Recommended VM sizes

Select the link to choose up to six recommended virtual machine sizes to display on Azure Marketplace.

## Open ports

Add open public or private ports on a deployed virtual machine.

## Properties

Here is a list of properties that can be selected for your VM.

- **Supports backup**: Enable this property if your images support Azure VM backup. Learn more about [Azure VM backup](../backup/backup-azure-vms-introduction.md).

- **Supports accelerated networking**: Enable this property if the VM images for this plan support single root I/O virtualization (SR-IOV) to a VM, enabling low latency and high throughput on the network interface. Learn more about [accelerated networking](https://go.microsoft.com/fwlink/?linkid=2124513).

- **Supports cloud-init configuration**: Enable this property if the images in this plan support cloud-init post deployment scripts. Learn more about [cloud-init configuration](../virtual-machines/linux/using-cloud-init.md).

- **Supports hotpatch**: Windows Server Azure Editions supports Hot Patch. Learn more about [Hot Patch](../automanage/automanage-hotpatch.md).

- **Supports extensions**: Enable this property if the images in this plan support extensions. Extensions are small applications that provide post-deployment configuration and automation on Azure VMs. Learn more about [Azure virtual machine extensions](./azure-vm-certification-faq.yml#vm-extensions).

- **Is a network virtual appliance**: Enable this property if this product is a Network Virtual Appliance. A network virtual appliance is a product that performs one or more network functions, such as a Load Balancer, VPN Gateway, Firewall or Application Gateway. Learn more about [network virtual appliances](https://go.microsoft.com/fwlink/?linkid=2155373).

- **Remote desktop or SSH disabled**: Enable this property if any of the following conditions are true:
    - Virtual machines deployed with these images don't allow customers to access it using Remote Desktop or SSH. Learn more about [locked VM images](./azure-vm-certification-faq.yml#locked-down-or-ssh-disabled-offer).
    - Image does not support _sampleuser_ while deploying.
    - Image has limited access.
    - Image does not comply with the [Certification Test Tool](azure-vm-image-test.md#use-certification-test-tool-for-azure-certified).
    - Image requires setup during initial login which causes automation to not connect to the virtual machine.
    - Image does not support port 22.

- **Requires custom ARM template for deployment**: Enable this property if the images in this plan can only be deployed using a custom ARM template. To learn more see the [Custom templates section of Troubleshoot virtual machine certification](./azure-vm-certification-faq.yml#custom-templates).

## Generations

Generating a virtual machine defines the virtual hardware it uses. Based on your customer’s needs, you can publish a Generation 1 VM, Generation 2 VM, or both.

1. When creating a new offer, select a **Generation type** and enter the requested details:

    :::image type="content" source="./media/create-vm/azure-vm-generations-image-details-1.png" alt-text="A view of the Generation detail section in Partner Center.":::

2. To add another generation to a plan, select **Add generation**...

    :::image type="content" source="./media/create-vm/azure-vm-generations-add.png" alt-text="A view of the 'Add Generation' link.":::

    ...and enter the requested details:

    :::image type="content" source="./media/create-vm/azure-vm-generations-image-details-3.png" alt-text="A view of the generation details window.":::

<!--    The **Generation ID** you choose will be visible to customers in places such as product URLs and ARM templates (if applicable). Use only lowercase, alphanumeric characters, dashes, or underscores; it cannot be modified once published.
-->
3. To update an existing VM that has a Generation 1 already published, edit details on the **Technical configuration** page.

To learn more about the differences between Generation 1 and Generation 2 capabilities, see [Support for generation 2 VMs on Azure](../virtual-machines/generation-2.md).

> [!NOTE]
> A published generation requires at least one image version to remain available for customers. To remove the entire plan (along with all its generations and images), select **Deprecate plan** on the **Plan Overview** page (see first section in this article).

## VM images

Provide a disk version and the shared access signature (SAS) URI for the virtual machine images. Add up to 16 data disks for each VM image. Provide only one new image version per plan in a specified submission. After an image has been published, you can't edit it, but you can delete it. Deleting a version prevents both new and existing users from deploying a new instance of the deleted version.

These two required fields are shown in the prior image above:

- **Disk version**: The version of the image you are providing.
- **OS VHD link**: The image stored in Azure Compute Gallery (formerly know as Shared Image Gallery). Learn how to capture your image in an [Azure Compute Gallery](azure-vm-create-using-approved-base.md#capture-image).

Data disks (select **Add data disk (maximum 16)**) are also VHD shared access signature URIs that are stored in their Azure storage accounts. Add only one image per submission in a plan.

Regardless of which operating system you use, add only the minimum number of data disks that the solution requires. During deployment, customers can't remove disks that are part of an image, but they can always add disks during or after deployment.

> [!NOTE]
> If you provide your images using SAS and have data disks, you also need to provide them as SAS URI. If you are using a shared image, they are captured as part of your image in Azure Compute Gallery. Once your offer is published to Azure Marketplace, you can delete the image from your Azure storage or Azure Compute Gallery.

Select **Save draft**, then select **← Plan overview** at the top left to see the plan you just created.

Once your VM image has published, you can delete the image from your Azure storage.

## Reorder plans (optional)

For VM offers with more than one plan, you can change the order that your plans are shown to customers. The first plan listed will become the default plan that customers will see.

1. On the **Plan overview** page, select the **Edit display rank** button.
1. In the menu that appears, use the hamburger icon to drag your plans to the desired order.

## Next steps

- [Resell through CSPs](azure-vm-resell-csp.md)
