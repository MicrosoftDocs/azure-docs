---
title: Understanding total Azure Virtual Desktop deployment costs - Azure
description: How to estimate the total cost of your Azure Virtual Desktop deployment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 02/04/2022
ms.author: helohr
manager: femila
---
# Understanding total Azure Virtual Desktop deployment costs

Azure Virtual Desktop costs come from two sources: underlying Azure resource consumption and licensing. Azure Virtual Desktop costs are charged to the organization that owns the Azure Virtual Desktop deployment, not the end-users accessing the deployment resources. Some licensing charges must be paid in advance. Other licenses and the underlying resource consumption charges are based on meters that track your usage.

In this article, we'll explain consumption and licensing costs, and how to estimate service costs before deploying Azure Virtual Desktop using the Azure Pricing Calculator. This article also includes instructions for how to use Azure Cost Management to view costs after deploying Azure Virtual Desktop.

>[!NOTE]
>The customer who pays for the Azure Virtual Desktop deployment is responsible for handling their deployment's lifetime resource management and costs. If the owner no longer needs resources connected to their Azure Virtual Desktop deployment, they should ensure those resources are properly removed. For more information, see [How to manage Azure resources by using the Azure portal](../../azure-resource-manager/management/manage-resources-portal.md).

## Consumption costs

Consumption costs are the sum of all Azure resource usage charges for users accessing an Azure Virtual Desktop host pool. These charges come from the session host virtual machines (VMs) inside the host pools, including resources shared by other products across Azure and any identity management systems that require running additional infrastructure to keep the service available, such as a domain controller for Active Directory Domain Services (AD DS).

### Session host VM costs

In Azure Virtual Desktop, session host VMs use the following three Azure services:

- Virtual machines (compute)
- Storage for managed disks (including OS storage per VM and any data disks for personal desktops)
- Bandwidth (networking)

These charges can be viewed at the Azure Resource Group level where the host pool-specific resources including session host VMs are assigned. If one or more host pools are also configured to use the paid Log Analytics service to send VM data to the optional Azure Virtual Desktop Insights feature, then the bill will also charge you for the Log Analytics for the corresponding Azure Resource Groups. For more information, see [Estimate Azure Virtual Desktop monitoring costs](../insights-costs.md).

Of the three primary VM session host usage costs that are listed at the beginning of this section, compute usually costs the most. To mitigate compute costs and optimize resource demand with availability, many customers choose to [scale session hosts automatically](../set-up-scaling-script.md).

### Domain controller costs for Active Directories

Domain controller VMs use the following four Azure services at a minimum:

- Virtual machines (compute)
- Storage for managed disks (including OS storage per VM and any data disks for personal desktops)
- Bandwidth (networking)
- Virtual networks

If your Azure Virtual Desktop deployment relies on a domain controller to run its Active Directory, then you should include it in the total Azure Virtual Desktop deployment cost. Domain controllers that are hosted in Azure will also share the three Azure services for session host VMs described in [Session host VM costs](#session-host-vm-costs), because a standard Azure VM must also keep the Active Directory’s identities available.

However, domain controllers have a few key differences from session host VMs:

- Domain controllers will generate an additional virtual network charge because they have to communicate with other services outside the deployment.
- Scaling domain controller availability can cause problems because your deployments need your domain controllers to always be available.

### Shared service costs

Depending on which features your Azure Virtual Desktop deployment uses, you may also have to pay for Azure storage for any combination of the following optional features:

- [MSIX app attach](../what-is-app-attach.md)
- [Custom OS images](../set-up-customize-master-image.md)
- [FSLogix profiles](../fslogix-containers-azure-files.md)

These features use Azure storage options like [Azure Files](../../storage/files/storage-files-introduction.md) and [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md), so that means they can share their storage with other Azure services beyond Azure Virtual Desktop. We recommend creating a separate storage account for the storage you buy for your Azure Virtual Desktop features to make sure you can tell the difference between its costs and the costs for other Azure services you're using.

### User access costs

You pay user access costs each month for each user who connects to apps or desktops in your Azure Virtual Desktop deployment. To learn more about how Azure Virtual Desktop’s per-user access pricing works, see [Understanding licensing and per-user access pricing](licensing.md).

## Predicting costs before deploying Azure Virtual Desktop

Now that you understand the basics, let's start estimating. To do this, we'll need to estimate both the consumption and user access costs.

### Predicting consumption costs

You can use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate Azure Virtual Desktop consumption costs before creating a deployment. Here's how to predict consumption costs:

1. In the pricing calculator, select the **Compute** tab to show the Azure Pricing Calculator compute options.

2. Select **Azure Virtual Desktop**. The Azure Virtual Desktop calculator module should appear.

3. Enter the values for your deployment into the fields to estimate your monthly Azure bill based on your expected compute, storage, and networking usage.

>[!NOTE]
>Currently, the Azure Pricing Calculator Azure Virtual Desktop module can only estimate consumption costs for session host VMs and the aggregate additional storage of any optional Azure Virtual Desktop features requiring storage that you choose to deploy. Your total cost may also include egress network traffic to Microsoft 365 services, such as OneDrive for Business or Exchange Online. However, you can add estimates for other Azure Virtual Desktop features in separate modules within the same Azure Pricing calculator page to get a more complete or modular cost estimate.
>
>You can add extra Azure Pricing Calculator modules to estimate the cost impact of other components of your deployment, including but not limited to:
>
>- Domain controllers
>- Other storage-dependent features, such as custom OS images, MSIX app attach, and Azure Virtual Desktop Insights

### Predicting user access costs

User access costs depend on the number of users that connect to your deployment each month. To learn how to estimate the total user access costs you can expect, see [Estimate per-user app streaming costs for Azure Virtual Desktop](streaming-costs.md).

## Viewing costs after deploying Azure Virtual Desktop

Once you deploy Azure Virtual Desktop, you can use [Azure Cost Management](../../cost-management-billing/cost-management-billing-overview.md) to view your billing invoices. This section will tell you how to look up prices for your current services.

### Viewing bills for consumption costs

With the proper [Azure RBAC](../../role-based-access-control/rbac-and-directory-admin-roles.md) permissions, users in your organization like billing admins can use [cost analysis tools](../../cost-management-billing/costs/cost-analysis-common-uses.md) and find Azure billing invoices through [Azure Cost Management](../../cost-management-billing/cost-management-billing-overview.md) to track monthly Azure Virtual Desktop consumption costs under your Azure subscription or subscriptions.

### Viewing bills for user access costs

User access costs will appear each billing cycle on the Azure billing invoice for any enrolled subscription, alongside consumption costs and other Azure charges.

## Next steps

If you'd like to get a clearer idea of how much specific parts of your deployment will cost, take a look at these articles:

- [Understanding licensing and per-user access pricing](licensing.md)
- [Estimate per-user app streaming costs for Azure Virtual Desktop](streaming-costs.md)
- [Tag Azure Virtual Desktop resources to manage costs](../tag-virtual-desktop-resources.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json)