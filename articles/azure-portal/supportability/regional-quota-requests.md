---
title: Increase regional vCPU quotas
description: Learn how to request an increase in the vCPU quota limit for a region in the Azure portal.
ms.date: 1/26/2022
ms.topic: how-to
ms.custom: references-regions
---

# Increase regional vCPU quotas

Azure Resource Manager enforces two types of vCPU quotas for virtual machines:

- standard vCPU quotas
- spot vCPU quotas

Standard vCPU quotas apply to pay-as-you-go VMs and reserved VM instances. They are enforced at two tiers, for each subscription, in each region:

- The first tier is the total regional vCPU quota.
- The second tier is the VM-family vCPU quota such as D-series vCPUs.

This article shows how to request regional vCPU quota increases for all VMs in a given region. You can also request increases for [VM-family vCPU quotas](per-vm-quota-requests.md) or [spot vCPU quotas](spot-quota.md).

## Special considerations

When considering your vCPU needs across regions, keep in mind the following:

- Regional vCPU quotas are enforced across all VM series in a given region. As a result, decide how many vCPUs you need in each region in your subscription. If you don't have enough vCPU quota in each region, submit a request to increase the vCPU quota in that region. For example, if you need 30 vCPUs in West Europe and you don't have enough quota, specifically request a quota for 30 vCPUs in West Europe. When you do so, the vCPU quotas in your subscription in other regions aren't increased. Only the vCPU quota limit in West Europe is increased to 30 vCPUs.

- When you request an increase in the vCPU quota for a VM series, Azure increases the regional vCPU quota limit by the same amount.

- When you create a new subscription, the default value for the total number of vCPUs in a region might not be equal to the total default vCPU quota for all individual VM series. This discrepancy can result in a subscription with enough quota for each individual VM series that you want to deploy. However, there might not be enough quota to accommodate the total regional vCPUs for all deployments. In this case, you must submit a request to explicitly increase the quota limit of the regional vCPU quotas.

## Increase a regional vCPU quota

To request a regional vCPU quota from **Usage + quotas**:

1. In the Azure portal, search for and select **Subscriptions**.

1. Select the subscription whose quota you want to increase.

1. In the left pane, select **Usage + quotas**. Use the filters to view your quota by usage.

1. In the main pane, select **Total Regional vCPUs**, then select the pencil icon. The example below shows the regional vCPU quota for the NorthEast US region.

   :::image type="content" source="media/resource-manager-core-quotas-request/regional-quota-total.png" alt-text="Screenshot of the Usage + quotas screen showing Total Regional vCPUs in the Azure portal." lightbox="media/resource-manager-core-quotas-request/regional-quota-total.png":::

1. In **Quota details**, enter your new quota limit, then select **Save and continue**.

   Your request will be reviewed, and you'll be notified whether the request is approved or rejected. This usually happens within a few minutes. If your request is rejected, you'll see a link where you can open a support request so that a support engineer can assist you with the increase.

> [!TIP]
> You can also request multiple increases at the same time. For more information, see [Increase multiple VM-family CPU quotas in one request](per-vm-quota-requests.md#increase-multiple-vm-family-cpu-quotas-in-one-request).

## Increase a regional quota from Help + support

To request a standard vCPU quota increase per VM family from **Help + support**, create a new support request in the Azure portal.

1. For **Issue type**, select **Service and subscription limits (quotas)**.
1. For **Subscription**, select the subscription whose quota you want to increase.
1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   :::image type="content" source="media/resource-manager-core-quotas-request/new-per-vm-quota-request.png" alt-text="Screenshot showing a support request to increase a VM-family vCPU quota in the Azure portal.":::

From there, follow the steps described in [Create a support request](how-to-create-azure-support-request.md#create-a-support-request).

## Next steps

- Review the [list of Azure regions and their locations](https://azure.microsoft.com/regions/).
- Get an overview of [Azure regions for virtual machines](../../virtual-machines/regions.md) and how to to maximize a VM performance, availability, and redundancy in a given region.
