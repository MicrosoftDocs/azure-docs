---
title: Understanding total Azure Virtual Desktop deployment costs - Azure
description: How to  Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 06/10/2021
ms.author: helohr
manager: femila
---
# Understanding total Azure Virtual Desktop deployment costs

Azure Virtual Desktop costs come from two sources: underlying Azure resource consumption and licensing. Azure Virtual Desktop costs are charged to the organization that owns the Azure Virtual Desktop deployment, not the end-users accessing the deployment resources. Some licensing charges must be paid in advance. Other licenses and the underlying resource consumption charges are based on meters that track your usage.

In this article, we'll explain consumption and licensing costs, and how to estimate service costs before deploying Azure Virtual Desktop. This article also includes instructions for how to view costs after deploying Azure Virtual Desktop using the Azure Monitor feature.

>[!NOTE]
>The customer who pays for the Azure Virtual Desktop deployment is responsible for handling their deployment's lifetime resource management and costs. If the owner no longer needs resources connected to their Azure Virtual Desktop deployment, they should ensure those resources are properly removed. For more information, see [How to manage Azure resources by using the Azure portal](../azure-resource-manager/management/manage-resources-portal.md).

## Consumption costs

Consumption costs are the sum of all Azure resource usage charges for users accessing an Azure Virtual Desktop host pool. These charges come from the session host virtual machines (VMs) inside the host pools, including resources shared by other products across Azure and any identity management systems that require running additional infrastructure to keep the service available, such as a domain controller for an Active Directory.

### Session host VM costs

In Azure Virtual Desktop, session host VMs use the following three Azure services:

- Virtual machines (compute)
- Storage for managed disks (including OS storage per VM and any data disks for personal desktops)
- Bandwidth (networking)

These charges can be viewed at the Azure Resource Group level where the host pool-specific resources including session host VMs are assigned. If one or more host pools are also configured to use the paid Log Analytics service to send VM data to the optional Azure Virtual Desktop Insights feature, then the bill will also charge you for the Log Analytics for the corresponding Azure Resource Groups. You can view [Monitor Windows Virtual Desktop cost pricing estimates](./azure-monitor-costs.md) for more information.

Of these four session host VM usage costs, compute usually charges the most. To mitigate compute costs and optimize resource demand with availability, many customers choose to [scale session hosts automatically](./virtual-desktop/set-up-scaling-script.md).

### Domain controller costs for Active Directories

Domain controller VMs use the following four Azure services at a minimum:

- Virtual machines (compute)
- Storage for managed disks (including OS storage per VM and any data disks for personal desktops)
- Bandwidth (networking)
- Virtual networks

If your Azure Virtual Desktop deployment relies on a domain controller to run its Active Directory, then you should include it in the total Azure Virtual Desktop deployment cost. If this domain controller is also hosted in Azure, then it will also share the three Azure services for session host VMs described in [Session host VM costs](#session-host-vm-costs) because a standard Azure VM also must keep the Active Directory’s identities available.

However, domain controllers have a few key differences from session host VMs:

- Domain controllers will generate an additional virtual network charge because they have to communicate with other services outside the deployment.
- Scaling domain controller availability can cause problems because your deployments need your domain controllers to always be available.

### Shared service costs

<!---stopped here--->

Depending on which features your Azure Virtual Desktop deployment uses, you may also have to pay for Azure storage or any combination of the following optional features:

- MSIX app attach
- Custom OS images
- FSLogix profiles

These features use Azure storage options like Azure Files and Azure NetApp Files, so that means they can share their storage with other Azure services beyond Azure Virtual Desktop. We recommend creating a separate storage account for the storage you buy for your Azure Virtual Desktop features to make sure you can tell the difference between its costs and the costs for other Azure services you're using.

### User access costs

You pay user access costs each month for each user who connects to apps or desktops in your Azure Virtual Desktop deployment. To learn more about how Azure Virtual Desktop’s per-user access pricing works, see [Understanding licensing for app hosting](placeholder.md).

## Predicting costs before deploying Azure Virtual Desktop

Now that you understand the basics, let's start estimating. To do this, we'll need to estimate both the consumption and user access costs.

### Predicting consumption costs

You can use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate Azure Virtual Desktop consumption costs before creating a deployment. Here's how to predict consumption costs:

1. In the pricing calculator, select the **Compute** tab to show the Azure Pricing Calculator compute options.

2. Select **Azure Virtual Desktop**. The Azure Virtual Desktop calculator module should appear.

3. Enter the values for your deployment into the fields to estimate your monthly Azure bill based on your anticipated compute, storage, and networking usage.

>[!NOTE]
>Currently, the Azure Pricing Calculator Azure Virtual Desktop module can only estimate consumption costs for session host VMs and FSLogix profile storage because these costs apply to most customers who deploy multi-session host pools. However, you can add estimates for other Azure Virtual Desktop features in separate modules within the same Azure Pricing calulator page to add them together and get a mroe complete cost estimate.
>
>These are the features you can currently add:
>
>- Domain controllers
>- Other storage-dependent features, such as custom OS images, MSIX app attach, and Azure Monitor

### Predicting user access costs

User access costs depend on the number of users that connect to your deployment each month. To learn how to estimate the total user access costs you can expect, see [How to estimate IP meter costs during promotional period](placeholder.md). <!---Ask for link--->

## Viewing costs after deploying Azure Virtual Desktop

Once you deploy Azure Virtual Desktop, you can use Azure Cost Management to view your billing invoices. This section will tell you how to look up prices for your current services.

### Viewing bills for consumption costs

With the proper [Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md) permissions, users in your organization like billing admins can use [cost analysis tools](../cost-management-billing/costs/cost-analysis-common-uses.md) and find Azure billing invoices through [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) to track monthly Azure Virtual Desktop consumption costs under your Azure subscription or subscriptions.

### Viewing bills for user access costs

<!---Should we include promitional information in user documentation?--->

Azure Virtual Desktop is currently offering a special promotion with no charge to access Azure Virtual Desktop for streaming applications to external users. Enrollment in per-user access pricing is still required to provide access to external users, but there is no charge during the promotional period. To learn more, see [Azure Virtual Desktop pricing](https://aka.ms/Azure Virtual Desktoppricing).

After the promotional period, user access costs will appear each billing cycle on the Azure billing invoice for any enrolled subscription, alongside consumption costs and other Azure charges.
