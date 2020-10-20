---
title: Request an increase in Azure regional vCPU quota limits
description: How to request an increase in the vCPU quota limit for a region in the Azure portal.
author: sowmyavenkat86
ms.author: svenkat
ms.date: 01/27/2020
ms.topic: how-to
ms.service: azure-supportability
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---
# Standard quota: Increase limits by region

Azure Resource Manager supports two types of vCPU quotas for virtual machines:

* *Pay-as-you-go VMs* and *reserved VM instances* are subject to a *standard vCPU quota*.
* *Spot VMs* are subject to a *spot vCPU quota*.

The standard vCPU quota for pay-as-you-go and reserved virtual machine instances is enforced at two tiers for each subscription in each region:

* The first tier is the *total regional vCPUs limit*, across all VM series.
* The second tier is the *per-VM series vCPUs limit*, such as the D-series vCPUs.

Whenever you deploy a new spot VM, the total new and existing vCPU usage for that VM series must not exceed the approved vCPU quota for that particular VM series. Additionally, the total number of new and existing vCPUs that are deployed across all VM series shouldn't exceed the total approved regional vCPU quota for the subscription. If either of these quotas is exceeded, the VM deployment isn't allowed.

You can request an increase in the vCPU quota limit for the VM series by using the Azure portal. An increase in the VM series quota automatically increases the total regional vCPU limit by the same amount.

When you create a new subscription, the default total number of regional vCPUs might not be equal to the total default vCPU quota for all individual VM series. This discrepancy can result in a subscription with enough quota for each individual VM series that you want to deploy. But there might not be enough quota to accommodate the total regional vCPUs for all deployments. In this case, you must submit a request to explicitly increase the limit of the total number of regional vCPUs. The total regional vCPU limit can't exceed the total approved quota across all VM series for the region.

To learn more about standard vCPU quotas, see [Virtual machine vCPU quotas](../../virtual-machines/windows/quotas.md) and [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

To learn more about increasing spot VM vCPU limits, see [Spot quota: Increase limits for all VM series](low-priority-quota.md).

You can request an increase in your vCPU standard quota limit by region in either of two ways.

## Request a quota increase by region from Help + support

To request a vCPU quota increase by region from **Help + support**:

1. From the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![The "Help + support" link](./media/resource-manager-core-quotas-request/help-plus-support.png)

1. In **Help + support**, select **New support request**.

    ![New support request](./media/resource-manager-core-quotas-request/new-support-request.png)

1. For **Issue type**, select **Service and subscription limits (quotas)**.

   ![Select an issue type](./media/resource-manager-core-quotas-request/select-quota-issue-type.png)

1. For **Subscription**, select the subscription whose quota you want to increase.

   ![Select a subscription](./media/resource-manager-core-quotas-request/select-subscription-support-request.png)

1. For the **Quota type**, select **Other Requests**.

   ![Select a quota type](./media/resource-manager-core-quotas-request/regional-quotatype.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. In **Description**, provide the following information:

    1. For **Deployment Model**, specify **Resource Manager**.  
    1. For **Region**, specify your required region, for example, **East US 2**.  
    1. For **New Limit**, specify a new vCPU limit for the region. This value shouldn't exceed the sum of the approved quotas for individual SKU series for this subscription.

    ![Enter details for the quota request](./media/resource-manager-core-quotas-request/regional-details.png)

1. Select **Review + create** to continue creating the support request.

## Request a quota increase by region from Subscriptions

To request a vCPU quota increase by region from **Subscriptions**:

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![Go to Subscriptions in the Azure portal](./media/resource-manager-core-quotas-request/search-for-subscriptions.png)

1. Select the subscription whose quota you want to increase.

   ![Select a subscription to modify](./media/resource-manager-core-quotas-request/select-subscription-change-quota.png)

1. In the left pane, select **Usage + quotas**.

   ![Follow Usage and quotas link](./media/resource-manager-core-quotas-request/select-usage-plus-quotas.png)

1. At the top right, select **Request increase**.

   ![Select to increase quota](./media/resource-manager-core-quotas-request/request-increase-from-subscription.png)

1. From **Quota type**, select **Other Requests**.

   ![Select the quota type](./media/resource-manager-core-quotas-request/regional-quotatype.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. In the **Description** box, provide the following additional information:

    1. For **Deployment Model**, specify **Resource Manager**.  
    1. For **Region**, specify your required region, for example, **East US 2**.  
    1. For **New Limit**, specify a new vCPU limit for the region. This value shouldn't exceed the sum of the approved quotas for individual SKU series for this subscription.

    ![Enter information in details](./media/resource-manager-core-quotas-request/regional-details.png)

1. Select **Review + create** to continue creating the support request.
