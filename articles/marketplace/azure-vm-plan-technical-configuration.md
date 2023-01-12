---
title: Technical configuration for a virtual machine offer on Azure Marketplace
description: Configure the technical configuration for a virtual machine offer plan.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 05/10/2022
---

# Technical configuration for a virtual machine offer

Provide the images and other technical properties associated with this plan.

## Reuse technical configuration

This option lets you use the same technical configuration settings across plans within the same offer and therefore leverage the same set of images. If you enable the _reuse technical configuration_ option, your plan will inherit the same technical configuration settings as the base plan you select.  When you change the base plan, the changes are reflected on the plan reusing the configuration.

Some common reasons for reusing the technical configuration settings from another plan include:

- The same images are available for both *Pay as you go* and *BYOL*.
- Your solution behaves differently based on the plan the user chooses to deploy. For example, the software is the same, but features vary by plan.

> [!NOTE]
> If you would like to use a public plan to create a private plan with a different price, consider creating a private offer instead of reusing the technical configuration. Learn more about [the difference between private plans and private offers](./isv-customer-faq.yml). Learn more about [how to create a private offer](./isv-customer.md).

Leverage [Azure Instance Metadata Service](../virtual-machines/windows/instance-metadata-service.md) (IMDS) to identify which plan your solution is deployed within to validate license or enabling of appropriate features.

If you later decide to publish different changes between your plans, you can detach them. Detach the plan by deselecting this option with your plan that is reusing the technical configuration. Once detached, your plan will carry the same technical configuration settings at the place of your last setting and your plans may diverge in configuration. A plan that has been published independently in the past cannot reuse a technical configuration later.

## Operating system

Select the **Windows** or **Linux** operating system family.

Select the Windows **Release** or Linux **Vendor**.

Enter an **OS friendly name** for the operating system. This name is visible to customers.

## Recommended VM sizes

Select the link to choose up to six recommended virtual machine sizes to display on Azure Marketplace.

## Open ports

Add public ports that will be automatically opened on a deployed virtual machine. You may specify the ports individually or via a range along with the supported protocol – TCP, UDP, or both. Be sure to use a hyphen if specifying a port range (Ex: 80-150).

## Properties

Here is a list of properties that can be selected for your VM. Enable the properties that are applicable to the images in your plan.

- **Supports VM extensions**: Extensions are small applications that provide post-deployment configuration and automation on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script inside of it, a VM extension can be used. Linux VM extension validations require the following to be part of the image:

    - Azure Linux Agent greater 2.2.41
    
    - Python version above 2.6+

    For more information, see [VM Extension](./azure-vm-certification-faq.yml).

- **Supports backup**: Enable this property if your images support Azure VM backup. Learn more about [Azure VM backup](../backup/backup-azure-vms-introduction.md).

- **Supports accelerated networking**: The VM images in this plan support single root I/O virtualization (SR-IOV) to a VM, enabling low latency and high throughput on the network interface. Learn more about [accelerated networking for Linux](../virtual-network/create-vm-accelerated-networking-cli.md). Learn more about [accelerated networking for Windows](../virtual-network/create-vm-accelerated-networking-powershell.md).

- **Is a network virtual appliance**: A network virtual appliance is a product that performs one or more network functions, such as a Load Balancer, VPN Gateway, Firewall or Application Gateway. Learn more about [network virtual appliances](https://go.microsoft.com/fwlink/?linkid=2155373).

- **Supports NVMe** - Enable this property if the images in this plan support NVMe disk interface. The NVMe interface offers higher and consistent IOPS and bandwidth relative to legacy SCSI interface.

- **Supports cloud-init configuration**: Enable this property if the images in this plan support cloud-init post deployment scripts. Learn more about [cloud-init configuration](../virtual-machines/linux/using-cloud-init.md).

- **Supports hibernation** – The images in this plan support hibernation/resume.

- **Remote desktop/SSH not supported**: Enable this property if any of the following conditions are true:

    - Virtual machines deployed with these images don't allow customers to access it using Remote Desktop or SSH. Learn more about [locked VM images](./azure-vm-certification-faq.yml#locked-down-or-ssh-disabled-offer). Images that are published with either SSH disabled (for Linux) or RDP disabled (for Windows) are treated as Locked down VMs. There are special business scenarios to restrict access to users. During validation checks, Locked down VMs might not allow execution of certain certification commands.

    - Image does not support sampleuser while deploying.
    - Image has limited access.
    - Image does not comply with the Certification Test Tool.
    - Image requires setup during initial login which causes automation to not connect to the virtual machine.
    - Image does not support port 22.

- **Requires custom ARM template for deployment**: Enable this property if the images in this plan can only be deployed using a custom ARM template. In general, all the images that are published under a VM offer will follow standard ARM template for deployment. However, there are scenarios that might require customization while deploying VMs (for example, multiple NIC(s) to be configured).
Below are examples (non-exhaustive) that might require custom templates for deploying the VM:

  - VM requires additional network subnets.

  - Additional metadata to be inserted in ARM template.
  
  - Commands that are prerequisite to the execution of ARM template.

## Image types

Generations of a virtual machine defines the virtual hardware it uses. Based on your customer’s needs, you can publish a Generation 1 VM, Generation 2 VM, or both. To learn more about the differences between Generation 1 and Generation 2 capabilities, see [Support for generation 2 VMs on Azure](../virtual-machines/generation-2.md).

When creating a new plan, select an Image type from the drop-down menu. You can choose either X64 Gen 1 or X64 Gen 2. To add another image type to a plan, select **+Add image type**. You will need to provide a SKU ID for each new image type that is added.

> [!NOTE]
> A published generation requires at least one image version to remain available for customers. To remove the entire plan (along with all its generations and images), select **Deprecate plan** on the **Plan Overview** page. Learn more about [deprecating plans](./deprecate-vm.md).
>

## VM images

To add a new image version, click **+Add VM image**. This will open a panel in which you will then need to specify an image version number. From there, you can provide your image(s) via either the Azure Compute Gallery and/or using a shared access signature (SAS) URI.

Keep in mind the following when publishing VM images:

1.	Provide only one new VM image per image type in a given submission.
2.	After an image has been published, you can't edit it, but you can deprecate it. Deprecating a version prevents both new and existing users from deploying a new instance of the deprecated version. Learn more about [deprecating VM images](./deprecate-vm.md).
3.	You can add up to 16 data disks for each VM image provided. Regardless of which operating system you use, add only the minimum number of data disks that the solution requires. During deployment, customers can’t remove disks that are part of an image, but they can always add disks during or after deployment.

> [!NOTE]
> If you provide your images using the SAS URI method and you are adding data disks, you also need to provide them in the form of a SAS URI. Data disks are also VHD shared access signature URIs that are stored in your Azure storage accounts. If you are using a gallery image, the data disks are captured as part of your image in Azure Compute Gallery.

Select **Save draft**, then select **← Plan overview** at the top left to see the plan you just created.

Once your VM image is published, you can delete the image from your Azure storage.

## Reorder plans (optional)

For VM offers with more than one plan, you can change the order that your plans are shown to customers. The first plan listed will become the default plan that customers will see.

1. On the **Plan overview** page, select the **Edit display rank** button.
1. In the menu that appears, use the hamburger icon to drag your plans to the desired order.

## Next steps

- [Learn more about how to reorder plans](azure-vm-plan-reorder-plans.md)
- [Resell through CSPs](azure-vm-resell-csp.md)
