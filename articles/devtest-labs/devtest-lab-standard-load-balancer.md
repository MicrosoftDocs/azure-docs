---
title: Enhancements to Support Retirement of Basic Load Balancers and Basic SKU Public IP addresses in Azure
description: Learn how retirement of Basic Load Balancer and Basic SKU Public IP address in Azure will impact VMs provisioned in Azure DevTest Labs.
ms.topic: how-to
ms.author: anishtrakru
author: RoseHJM
ms.date: 03/20/2025
ms.custom: UpdateFrequency2
---

# Standard Load Balancer and Standard SKU Public IP address in Azure DevTest Labs

Azure DevTest Labs has made enhancements designed to accommodate two upcoming retirements in Azure:

   |Retirement|Date|Details|
   |---|---|---|
   |**Azure Basic Load Balancer**|**September 30, 2025**|The Azure Basic Load Balancer will be retired. You can continue using your existing Basic Load Balancers until this date, but **you will not be able to deploy new ones after 31 March 2025**. For more information, please refer to the [official announcement](https://azure.microsoft.com/updates?id=azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer).|
   |**Basic SKU Public IP Addresses**|**September 30, 2025**|Basic SKU Public IP Addresses will be retired in Azure. You can continue using your existing Basic SKU public IP addresses until this date, but **you will not be able to create new ones after 31 March 2025**. For more information, please refer to the [official announcement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).|

> [!IMPORTANT]
> The **enhancements in Azure DevTest Labs to support Azure's retirement of Basic Load Balancer and Basic SKU Public IP address** are currently in preview. For more information about the preview status, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The document defines legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

These retirements **will not impact VMs with Private IPs**. However, they will impact VMs with Public or Shared IPs in the following ways:

## Impact on VMs with Public IPs:
- **Current Setup**: When you create a Public IP VM, a Basic SKU Public IP address resource with dynamic IP allocation is created.
- **New Setup**: A Standard SKU Public IP address resource with static IP allocation will be created when you create a Public IP VM. Each VM with a Public IP will be assigned its own public IP address, allowing direct access via RDP or SSH. **You need to create and configure a Network Security Group (NSG) to allow inbound traffic** such as RDP or SSH connection. To learn more about how to create and configure NSGs, please check [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-portal).
- **How to View the SKU**:
    - Go to the Azure compute view of the VM under Network settings.
    - Click on the link of the Public IP resource.
    - In the resource overview page, you can see the SKU type as Standard.

## Impact on VMs with Shared IPs:
- **Current Setup**: All VMs created with Shared IPs are placed in the same resource group, which has one assigned Basic SKU public IP address. DevTest Labs automatically creates a Basic load balancer to manage traffic for these VMs. When a VM with a shared IP is added to a subnet, it is automatically added to the load balancer and assigned a TCP port number on the public IP address, forwarding to the SSH port on the VM.
- **New Setup**: A Standard SKU load balancer will be created and used instead of a Basic Load Balancer. **You need to create and configure a Network Security Group (NSG) to allow inbound traffic** such as RDP or SSH connection. To learn more about how to create and configure NSGs, please check [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-portal).
- How to View the SKU:
    - Go to the Azure compute view of the VM under Load Balancing.
    - Click on the link of the load balancer resource.
    - In the resource overview page, you can see the SKU type as Standard.

**These changes in Azure DevTest Labs are being rolled out to different regions in phases. We expect to complete the rollout by March 31, 2025.**