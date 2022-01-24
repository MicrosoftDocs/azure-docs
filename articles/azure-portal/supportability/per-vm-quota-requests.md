---
title: Increase VM-family vCPU quotas
description: Learn how to request an increase in the vCPU quota limit for a VM family in the Azure portal, which increases the total regional vCPU limit by the same amount.
ms.date: 11/15/2021
ms.topic: how-to
---

# Increase VM-family vCPU quotas

Azure Resource Manager enforces two types of vCPU quotas for virtual machines:

- standard vCPU quotas
- spot vCPU quotas

Standard vCPU quotas apply to pay-as-you-go VMs and reserved VM instances. They are enforced at two tiers, for each subscription, in each region:

- The first tier is the total regional vCPU quota.
- The second tier is the VM-family vCPU quota such as D-series vCPUs.

This article shows how to request increases for VM-family vCPU quotas. You can also request increases for [vCPU quotas by region](regional-quota-requests.md) or [spot vCPU quotas](spot-quota.md).

## Increase a VM-family vCPU quota

To request a standard vCPU quota increase per VM-family from **Usage + quotas**:

1. In the Azure portal, search for and select **Subscriptions**.
1. Select the subscription whose quota you want to increase.
1. In the left pane, select **Usage + quotas**.
1. In the main pane, find the VM-family vCPU quota you want to increase, then select the pencil icon. The example below shows Standard DSv3 Family vCPUs deployed in the East US region. The **Usage** column displays the current quota usage and the current quota limit.
1. In **Quota details**, enter your new quota limit, then select **Save and continue**.

   :::image type="content" source="media/resource-manager-core-quotas-request/quota-increase-example.png" alt-text="Screenshot of the Usage + quotas pane." lightbox="media/resource-manager-core-quotas-request/quota-increase-example.png":::

Your request will be reviewed, and you'll be notified whether the request is approved or rejected. This usually happens within a few minutes. If your request is rejected, you'll see a link where you can open a support request so that a support engineer can assist you with the increase.

> [!NOTE]
> If your request to increase your VM-family quota is approved, Azure will automatically increase the regional vCPU quota for the region where your VM is deployed.

> [!TIP]
> When creating or resizing a virtual machine and selecting your VM size, you may see some options listed under **Insufficient quota - family limit**. If so, you can request a quota increase directly from the VM creation page by selecting the **Request quota** link.

## Increase a VM-family vCPU quota from Help + support

To request a standard vCPU quota increase per VM family from **Help + support**, create a new support request in the Azure portal.

1. For **Issue type**, select **Service and subscription limits (quotas)**.
1. For **Subscription**, select the subscription whose quota you want to increase.
1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   :::image type="content" source="media/resource-manager-core-quotas-request/new-per-vm-quota-request.png" alt-text="Screenshot showing a support request to increase a VM-family vCPU quota in the Azure portal.":::

From there, follow the steps as described above to complete your quota increase request.

## Increase multiple VM-family CPU quotas in one request

You can also request multiple increases at the same time (bulk request). Doing a bulk request quota increase may take longer than requesting to increase a single quota.

To request multiple increases together, first go to the **Usage + quotas** page as described above. Then do the following:

1. Select **Request Increase** near the top of the screen.
1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.
1. Select **Next** to go to the **Additional details** screen, then select **Enter details**.
1. In the **Quota details** screen:

   :::image type="content" source="media/resource-manager-core-quotas-request/quota-details-standard-set-vcpu-limit.png" alt-text="Screenshot showing the Quota details screen and selections.":::

   1. For **Deployment model**, ensure **Resource Manager** is selected.
   1. For **Locations**, select all regions in which you want to increase quotas.
   1. For each region you selected, select one or more VM series from the **Quotas** drop-down list.
   1. For each **VM Series** you selected, enter the new vCPU limit that you want for this subscription.
   1. When you're finished, select **Save and continue**.
1. Enter or confirm your contact details, then select **Next**.
1. Finally, ensure that everything looks correct on the **Review + create** page, then select **Create** to submit your request.

## Next steps

- Learn more about [vCPU quotas](../../virtual-machines/windows/quotas.md).
- Learn about [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).