---
title: Understand and estimate costs for Azure Virtual Desktop
description: Learn about which components are charged for in Azure Virtual Desktop and how to estimate the total cost.
ms.topic: overview
author: dknappettmsft
ms.author: daknappe
ms.date: 01/09/2024
---

# Understand and estimate costs for Azure Virtual Desktop

Azure Virtual Desktop costs come from two sources: underlying Azure resource consumption and licensing. Azure Virtual Desktop costs are charged to the organization that owns the Azure Virtual Desktop deployment, not the end-users accessing the deployment resources. Some licensing charges must be paid in advance. Azure meters track other licenses and the underlying resource consumption charges based on your usage.

The organization who pays for Azure Virtual Desktop is responsible for handling the resource management and costs. If the owner no longer needs resources connected to their Azure Virtual Desktop deployment, they should ensure those resources are properly removed. For more information, see [How to manage Azure resources by using the Azure portal](../azure-resource-manager/management/manage-resources-portal.md).

This article explains consumption and licensing costs, and how to estimate service costs before deploying Azure Virtual Desktop.

## Azure resource consumption costs

Azure resource consumption costs are the sum of all Azure resource usage charges that provide users desktops or apps from Azure Virtual Desktop. These charges come from the session host virtual machines (VMs), plus resources shared by other products across Azure that require running more infrastructure to keep the service available, such as storage accounts, network data egress, and identity management systems.

### Session host costs

Session hosts are based on virtual machines (VMs), so the same Azure Compute charges and billing mechanisms as VMs apply. These charges include the following components:

- Virtual machine instance.
- Storage for managed disks for the operating system and any extra data disks.
- Network bandwidth.

Of the charges for these components, virtual machine instances usually cost the most. To mitigate compute costs and optimize resource demand with availability, you can use [autoscale](autoscale-scenarios.md) to automatically scale session hosts based on demand and time. You can also use [Azure savings plans](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) or [Azure reserved VM instances](../virtual-machines/prepay-reserved-vm-instances.md) to reduce compute costs.

### Identity provider costs

You have a choice of identity provider to use for Azure Virtual Desktop, from Microsoft Entra ID only, or Microsoft Entra ID in conjunction with Active Directory Domain Services (AD DS) or Microsoft Entra Domain Services. The following table shows the components that are charged for each identity provider:

| Identity provider | Components charged |
|--|--|
| Microsoft Entra ID only | [Free tier available, licensed tiers for some features](https://www.microsoft.com/security/business/microsoft-entra-pricing), such as conditional access. |
| Microsoft Entra ID + AD DS | Microsoft Entra ID and domain controller VM costs, including compute, storage, and networking. |
| Microsoft Entra ID + Microsoft Entra Domain Services | Microsoft Entra ID and [Microsoft Entra Domain Services](https://azure.microsoft.com/pricing/details/microsoft-entra-ds/), |

### Accompanying service costs

Depending on which features your use for Azure Virtual Desktop, you have to pay for the associated costs of those features. Some examples might include:

| Feature | Associated costs |
|--|--|
| [Azure Virtual Desktop Insights](insights.md) | Log data in [Azure Monitor](https://azure.microsoft.com/pricing/details/monitor/). For more information, see [Estimate Azure Virtual Desktop Insights costs](insights-costs.md). |
| [App attach](app-attach-overview.md) | Application storage, such as [Azure Files](https://azure.microsoft.com/pricing/details/storage/files/) or [Azure NetApp Files](https://azure.microsoft.com/pricing/details/netapp/). |
| [FSLogix profile container](/fslogix/overview-what-is-fslogix) | User profile storage, such as [Azure Files](https://azure.microsoft.com/pricing/details/storage/files/) or [Azure NetApp Files](https://azure.microsoft.com/pricing/details/netapp/). |
| [Custom image templates](custom-image-templates.md) | Storage and network costs for [managed disks](https://azure.microsoft.com/pricing/details/managed-disks/) and [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/). |

### Licensing costs

In the context of providing virtualized infrastructure with Azure Virtual Desktop, *internal users* (for internal commercial purposes) refers to people who are members of your own organization, such as employees of a business or students of a school, including external vendors or contractors. *External users* (for external commercial purposes) aren't members of your organization, but your customers where you might provide a Software-as-a-Service (SaaS) application using Azure Virtual Desktop.

Licensing Azure Virtual Desktop works differently for internal and external commercial purposes:

- If you're providing Azure Virtual Desktop access to internal commercial purposes, you must purchase an eligible license for each user that accesses Azure Virtual Desktop.

- If you're providing Azure Virtual Desktop access external commercial purposes, per-user access pricing lets you pay for Azure Virtual Desktop access rights on behalf of external users. You must enroll in per-user access pricing to build a compliant deployment for external users. You pay for per-user access pricing through an Azure subscription.

To learn more about the different options, see [License Azure Virtual Desktop](licensing.md).

## Estimate costs before deploying Azure Virtual Desktop

You can use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate consumption and per-user access licensing costs before deploying Azure Virtual Desktop. Here's how to estimate costs:

1. In a web browser, open the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

1. Select the **Compute** tab to show the Azure Pricing Calculator compute options.

1. Select **Azure Virtual Desktop**. The Azure Virtual Desktop calculator module should appear.

1. Enter the values for your deployment into the fields to estimate your monthly Azure bill based on:

   - Your expected compute, storage, and networking usage.
   - Number of users, total hours, and concurrency.
   - Whether you're using per-user access pricing for external commercial purposes. If you're licensing for internal commercial purposes, you have to factor this license into your total cost estimate separately.
   - Whether you're using a savings plan or reserved instances.
   - Level of support.
   - Other components of your deployment, such as those features listed in [Accompanying service costs](#accompanying-service-costs).

> [!NOTE]
> The Azure Pricing Calculator Azure Virtual Desktop module can only estimate consumption costs for session host VMs and the aggregate additional storage of any optional Azure Virtual Desktop features requiring storage that you choose to deploy. Your total cost may also include egress network traffic to Microsoft 365 services, such as OneDrive for Business or Exchange Online. However, you can add estimates for other Azure Virtual Desktop features in separate modules within the same Azure Pricing calculator page to get a more complete or modular cost estimate.

## View costs after deploying Azure Virtual Desktop

Once you deploy Azure Virtual Desktop, you can use [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) to view your billing invoices. Users in your organization like billing admins can use [cost analysis tools](../cost-management-billing/costs/cost-analysis-common-uses.md) and find Azure billing invoices through Microsoft Cost Management to track monthly Azure Virtual Desktop consumption costs under your Azure subscription or subscriptions. You can also [Tag Azure Virtual Desktop resources to manage costs](tag-virtual-desktop-resources.md).

If you're using per-user access pricing, costs appear each billing cycle on the Azure billing invoice for any enrolled subscription, alongside consumption costs and other Azure charges.

If you [Use Azure Virtual Desktop Insights](insights.md), you can gain a detailed understanding of how Azure Virtual Desktop is being used in your organization. You can use this information to help you optimize your Azure Virtual Desktop deployment and reduce costs.

## Next steps

- Learn how to [Licensing Azure Virtual Desktop](licensing.md).
- [Tag Azure Virtual Desktop resources to manage costs](tag-virtual-desktop-resources.md).
- [Use Azure Virtual Desktop Insights](insights.md).
