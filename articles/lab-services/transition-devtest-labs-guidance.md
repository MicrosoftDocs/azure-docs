---
title: Transition from Azure Lab Services to Azure DevTest Labs
description: Learn how to transition from Azure Lab Services to Azure DevTest Labs.
ms.topic: how-to
ms.date: 08/26/2024

# customer intent: As an Azure Lab Services customer, I want to understand the Azure Lab Services retirement schedule and what Microsoft and partners services I can transition to.
---

# Azure Lab Services to Azure DevTest Labs Transition Guide

When you transition away from Azure Lab Services, DevTest Labs (DTL) is a first party option that can be considered. This document outlines when to and not to consider transitioning to use DevTest Labs. An outline of steps to follow is also included.

## Scenario guidance

### What are the target scenarios for DevTest Labs?

DevTest Labs is targeted at enterprise customers. The primary scenario for which DevTest Labs is designed is the test box scenario, where a professional developer needs temporary access to a virtual machine (VM) that has a prereleased version of the software they need to test. A secondary scenario is professional developer training, when a developer needs temporary access to a VM for internal training.

### When should a customer consider using DevTest Labs?

- Customer needs access to Linux VMs - DevTest Labs is the only first party service that provides access to Linux. Cloud PC, Azure Virtual Desktop, Microsoft Dev Box don't provide access to native Linux VMs.
- Customer needs to use an image with nested virtualization - DevTest Labs works well with images that use nested virtualization because it provides a dedicated VM for each student. Nested virtualization isn't well-suited for multi-user session VMs because there's no concept of isolation between user sessions.
- Technical Computer Programming classes - DevTest Labs resources are available using the Azure portal. Only students comfortable with the Azure portal should use DTL. DTL APIs can be used if you want to create a custom portal to access DTL VMs outside of the Azure portal.

### When should a customer not use DevTest Labs?

- Customer requires extensive cost controls, including user quota and limits on the number of VMs a user can have. DevTest Labs doesn't have any ability to restrict access to a VM based on a quota granted per student.
- Customer requires complex start and stop schedules. DevTest Labs is designed for enterprise developers; it supports daily start and stop schedules.
- Customer requires flexible sign-in methods. DevTest Labs requires that the user exists in the Microsoft Entra ID tenant for the subscription in which the lab is hosted. Azure role-based access control (RBAC) permissions are used to control who has access to labs and VMs.

## Frequently Asked Questions

**What is the cost model?**
There are no costs for using the DevTest Labs service; it's free to use. Customers are charged for resources used by the DevTest Labs service. This cost includes, but isn't limited to, the cost of storage, networking, and running time for any VMs in a lab.

**Does DevTest Labs provide cost reporting?**
DevTest Labs is integrated into [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management) for cost budgeting and analysis. To track per-lab costs, [allow tag inheritance and add tags to lab resources](/azure/devtest-labs/devtest-lab-configure-cost-management).

**Does DevTest Labs provide quota management?**
DevTest Labs is integrated into [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management). Cost Management can [monitor costs for virtual machines](/azure/virtual-machines/cost-optimization-monitor-costs) and [automatically execute actions based on a budget](/azure/cost-management-billing/manage/cost-management-budget-scenario). There's no management of VM usage quota within the DevTest Labs service.

**Does DevTest Labs support nested virtualization?**
Yes. Check the [VM series](/azure/virtual-machines/sizes/overview) documentation to verify nested virtualization is included in the list of supported features.

**Does DevTest Labs support custom images?**
Yes. We recommend [connecting your DevTest Labs to a Shared Image Gallery](/azure/devtest-labs/configure-shared-image-gallery). The Shared Image Gallery can be the same one that is connected to your Azure Lab Services lab account or lab plan.

We recommend using a Shared Image Gallery over the DTL [custom images feature](/azure/devtest-labs/devtest-lab-create-custom-image-from-vm-using-portal)  and [formulas](/azure/devtest-labs/devtest-lab-manage-formulas) features. Shared Image Galleries are compatible with several other Azure services and can be used in multiple labs.

**Does DevTest Labs support schedules?**
DevTest Labs supports an optional daily start and/or stop schedule.

**Does DevTest Labs support web access?**
Yes, if the VM is created in a Bastion-enabled virtual network. See [Enable browser connection to DevTest Labs VMs with Azure Bastion](/azure/devtest-labs/enable-browser-connection-lab-virtual-machines) for details.  

## Transition steps

1. **Verify [compute quota limits](/azure/quotas/view-quotas)** - DevTest Labs uses quota assigned to Compute when creating VMs. Increase [compute quota](/azure/quotas/regional-quota-requests), if needed.
1. **Configure Lab settings**
   1. **Images**
      1. [Restrict Marketplace images](/azure/devtest-labs/devtest-lab-enable-licensed-images) students can use. You can prevent students from using Marketplace images in totality.
      1. Enable custom images as applicable by [connecting your DevTest Labs to a Shared Image Gallery](/azure/devtest-labs/configure-shared-image-gallery). The gallery can be the same gallery you used with Azure Lab Services.
      1. DTL also supports creating VMs from [uploaded VHD](/azure/devtest-labs/devtest-lab-upload-vhd-using-storage-explorer) files.
   1. **SKU selection** - Consider enabling VM sizes equivalent to Azure Labs SKUs. See [Azure Lab Services VM Sizes](/azure/lab-services/administrator-guide#default-vm-sizes) for mappings to make sure to choose sizes that supported the [*shared ip* configuration option](/azure/devtest-labs/devtest-lab-shared-ip).
   1. **VM Limitations** - Set [max number of VMs per user to 1](/azure/devtest-labs/devtest-lab-set-lab-policy#set-virtual-machines-per-user).
   1. **Shutdown policies**
      1. Set [autoshutdown time](/azure/devtest-labs/devtest-lab-set-lab-policy#set-auto-shutdown) to ensure VMs are automatically turned off every day.
      1. Set [autoshutdown policy](/azure/devtest-labs/devtest-lab-set-lab-policy#set-auto-shutdown-policy) to 'User has no control over the schedule set by lab administrator.' If students are in multiple time zones, choose 'User sets a schedule and can't opt out' instead.
   1. [Turn off autostart](/azure/devtest-labs/devtest-lab-set-lab-policy#set-autostart) for the lab.
   1. **Virtual Network**. If your lab needs access to a license server, [add a virtual network in Azure DevTest Labs](/azure/devtest-labs/devtest-lab-configure-vnet).
   1. **Web browser access** - Optionally, enable [browser connection to DevTest Labs VMs with Azure Bastion](/azure/devtest-labs/enable-browser-connection-lab-virtual-machines).
1. **Create lab** - [Quickstart: Create a lab in the Azure portal - Azure DevTest Labs](/azure/devtest-labs/devtest-lab-create-lab).
1. **Cost Tracking** - Use custom tags for cost tracking in Microsoft Cost Management as it allows more nuanced cost analysis of underlying resources. [Allow tag inheritance and add tags to lab resource](/azure/devtest-labs/devtest-lab-configure-cost-management).
1. **Claimable VMs** - Optionally, precreate claimable VMs to ensure VMs are created with expected settings. Students can use the 'claim any' command to assign a precreated claimable VM to themselves.
   1. Using advanced settings, multiple identical VMs can be created at once.
   1. Using advanced settings, set the expiration date for [claimable VMs](/azure/devtest-labs/devtest-lab-use-claim-capabilities). VMs will automatically be deleted after their expiration date and avoid unnecessary storage charges.
1. **Add Users** - [Add lab owners, contributors, and users in Azure DevTest Labs](/azure/devtest-labs/devtest-lab-add-devtest-user).
1. **Configure Dashboard** - Optionally, [create a dashboard in the Azure portal](/azure/azure-portal/azure-portal-dashboards) to allow students to find their labs more easily.

> [!Important]
> If using a Linux VM that only supports access using SSH, follow detailed instructions at [Connect to a Linux VM in your lab (Azure DevTest Labs)](/azure/devtest-labs/connect-linux-virtual-machine).

## Related content

- [Azure Lab Services Retirement Guide](/azure/lab-services/retirement-guide)
