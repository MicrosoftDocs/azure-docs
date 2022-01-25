---
title: Increase spot vCPU quotas
description: Learn how to request increases for spot vCPU quotas in the Azure portal.
ms.date: 11/15/2021
ms.topic: how-to
---

# Increase spot vCPU quotas

Azure Resource Manager enforces two types of vCPU quotas for virtual machines:

- standard vCPU quotas
- spot vCPU quotas

Standard vCPU quotas apply to pay-as-you-go VMs and reserved VM instances. They are enforced at two tiers, for each subscription, in each region:

- The first tier is the total regional vCPU quota.
- The second tier is the VM-family vCPU quota such as D-series vCPUs.

Spot vCPU quotas apply to [spot virtual machines (VMs)](../../virtual-machines/spot-vms.md) across all VM families (SKUs).

This article shows you how to request quota increases for spot vCPUs. You can also request increases for [VM-family vCPU quotas](per-vm-quota-requests.md) or [vCPU quotas by region](regional-quota-requests.md).

## Special considerations

When considering your spot vCPU needs, keep in mind the following:

- When you deploy a new spot VM, the total new and existing vCPU usage for all spot VM instances must not exceed the approved spot vCPU quota limit. If the spot quota is exceeded, the spot VM can't be deployed.

- At any point in time when Azure needs the capacity back, the Azure infrastructure will evict spot VMs.

## Increase a spot vCPU quota

To request a quota increase for a spot vCPU quota:

1. In the Azure portal, search for and select **Subscriptions**.
1. Select the subscription whose quota you want to increase.
1. In the left pane, select **Usage + quotas**.
1. In the main pane, search for spot and select **Total Regional Spot vCPUs** for the region you want to increase.
1. In **Quota details**, enter your new quota limit.

   The example below requests a new quota limit of 103 for the Spot vCPUs across all VM-family vCPUs in the West US region.

   :::image type="content" source="media/resource-manager-core-quotas-request/spot-quota.png" alt-text="Screenshot of a spot vCPU quota increase request in the Azure portal." lightbox="media/resource-manager-core-quotas-request/spot-quota.png":::

1. Select **Save and continue**.

Your request will be reviewed, and you'll be notified whether the request is approved or rejected. This usually happens within a few minutes. If your request is rejected, you'll see a link where you can open a support request so that a support engineer can assist you with the increase.

## Increase a spot quota from Help + support

To request a spot vCPU quota increase from **Help + support**, create a new support request in the Azure portal.

1. For **Issue type**, select **Service and subscription limits (quotas)**.
1. For **Subscription**, select the subscription whose quota you want to increase.
1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   :::image type="content" source="media/resource-manager-core-quotas-request/new-per-vm-quota-request.png" alt-text="Screenshot showing a support request to increase a VM-family vCPU quota in the Azure portal.":::

From there, follow the steps as described above to complete your spot quota increase request.

## Next steps

- Learn more about [Azure spot virtual machines](../../virtual-machines/spot-vms.md).
- Learn about [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).