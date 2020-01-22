---
title: Request an increase in Azure regional vCPU quota limits | Microsoft Docs
description: Regional quota increase requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/07/2019
ms.topic: article
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

To learn more about standard vCPU quotas, see [Virtual machine vCPU quotas](../../virtual-machines/windows/quotas.md) and [Azure subscription and service limits](https://aka.ms/quotalimits).

To learn more about increasing spot VM vCPU limits, see [Spot quota: Increase limits for all VM series](low-priority-quota.md).

You can request an increase in your vCPU standard quota limit by region in either of two ways, as described in the next sections.

## Request a quota increase by region from Help + support

To request a vCPU quota increase by region from **Help + support**:

1. From the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![The "Help + support" link](./media/resource-manager-core-quotas-request/helpsupport.png)

1. In **Help + support**, select **New support request**.

    ![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

1. For **Issue type**, select **Service and subscription limits (quotas)**.

   ![The "Issue type" drop-down list](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

1. For **Subscription**, select the subscription whose quota you want to increase.

   ![The "Subscription" drop-down list](./media/resource-manager-core-quotas-request/select-subscription-sr.png)

1. For **Quota type** drop-down list, select **Other Requests**.

   ![The "Quota type" drop-down list](./media/resource-manager-core-quotas-request/regional-quotatype.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. In **Description**, provide the following information:

    1. For **Deployment Model**, specify **Resource Manager**.  
    1. For **Region**, specify your required region, for example, **East US 2**.  
    1. For **New Limit**, specify a new vCPU limit for the region. This value shouldn't exceed the sum of the approved quotas for individual SKU series for this subscription.

    ![The "Problem Details" pane](./media/resource-manager-core-quotas-request/regional-details.png)

1. Select **Review + create** to continue creating the support request.

## Request a quota increase by region from Subscriptions

To request a vCPU quota increase by region from **Subscriptions**:

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![The "Subscriptions" link](./media/resource-manager-core-quotas-request/subscriptions.png)

1. Select the subscription for the quota you want to increase.

   ![The "Subscriptions" pane](./media/resource-manager-core-quotas-request/select-subscription.png)

1. In the left pane, select **Usage + quotas**.

   ![The "Usage + quotas" link](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

1. At the top right, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

1. From **Quota type**, select **Other Requests**.

   ![The "Quota type" drop-down list](./media/resource-manager-core-quotas-request/regional-quotatype.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. In the **Description** box, provide the following additional information:

    1. For **Deployment Model**, specify **Resource Manager**.  
    1. For **Region**, specify your required region, for example, **East US 2**.  
    1. For **New Limit**, specify a new vCPU limit for the region. This value shouldn't exceed the sum of the approved quotas for individual SKU series for this subscription.

    ![The "Problem Details" pane](./media/resource-manager-core-quotas-request/regional-details.png)

1. Select **Review + create** to continue creating the support request.
