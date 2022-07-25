---
title: Increase spot vCPU family quotas
description: Learn how to request increases for spot vCPU quotas in the Azure portal.
ms.date: 07/22/2022
ms.topic: how-to
---

# Increase spot vCPU family quotas

Azure Resource Manager enforces two types of vCPU quotas for virtual machines:

- standard vCPU quotas
- spot vCPU quotas

Standard vCPU quotas apply to pay-as-you-go VMs and reserved VM instances. They are enforced at two tiers, for each subscription, in each region:

- The first tier is the total regional vCPU quota.
- The second tier is the VM-family vCPU quota such as D-series vCPUs.

Spot vCPU quotas apply to [spot virtual machines (VMs)](../virtual-machines/spot-vms.md) across all VM families (SKUs).

This article shows you how to request quota increases for spot vCPUs. You can also request increases for [VM-family vCPU quotas](per-vm-quota-requests.md) or [vCPU quotas by region](regional-quota-requests.md).

## Special considerations

When considering your spot vCPU needs, keep in mind the following:

- When you deploy a new spot VM, the total new and existing vCPU usage for all spot VM instances must not exceed the approved spot vCPU quota limit. If the spot quota is exceeded, the spot VM can't be deployed.

- At any point in time when Azure needs the capacity back, the Azure infrastructure will evict spot VMs.

## Request an increase for spot vCPU quotas

1. To view the **Quotas** page, sign in to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box, then select **Quotas**.

   > [!TIP]
   > After you've accessed **Quotas**, the service will appear at the top of [Azure Home](https://portal.azure.com/#home) in the Azure portal. You can also [add **Quotas** to your **Favorites** list](../azure-portal/azure-portal-add-remove-sort-favorites.md) so that you can quickly go back to it.

1. On the **Overview** page, select **Compute**.
1. On the **My quotas** page, enter "spot" in the **Search** box.
1. Filter for any other requirements, such as **Usage**, as needed.
1. Find the quota or quotas you want to increase, and select them.

   :::image type="content" source="media/spot-quota/select-spot-quotas.png" alt-text="Screenshot showing spot quota selection in the Azure portal":::

1. Near the top of the page, select **Request quota increase**, then select the way you'd like to increase the quota(s).

   :::image type="content" source="media/spot-quota/request-quota-increase-options.png" alt-text="Screenshot showing the options to request a quota increase in the Azure portal.":::

   > [!TIP]
   > Choosing **Adjust the usage %** allows you to select one usage percentage to apply to all the selected quotas without requiring you to calculate an absolute number (limit) for each quota. This option is recommended when the selected quotas have very high usage.

1. If you selected **Enter a new limit**, in the **Request quota increase** pane, enter a numerical value for your new quota limit(s), then select **Submit**.

   :::image type="content" source="media/spot-quota/spot-request-quota-increase-new-limit.png" alt-text="Screenshot showing the Enter a new limit option for a regional quota increase request.":::

1. If you selected **Adjust the usage %**, in the **Request quota increase** pane, adjust the slider to a new usage percent. Adjusting the percentage automatically calculates the new limit for each quota to be increased. This option is recommended when the selected quotas have very high usage. When you're finished, select **Submit**.

   :::image type="content" source="media/spot-quota/spot-request-quota-increase-adjust-usage.png" alt-text="Screenshot showing the Adjust the usage % option for a regional quota increase request.":::

Your request will be reviewed, and you'll be notified if the request can be fulfilled. This usually happens within a few minutes. If your request is not fulfilled, you'll see a link where you can [open a support request](../azure-portal/supportability/how-to-create-azure-support-request.md) so that a support engineer can assist you with the increase.

## Next steps

- Learn more about [Azure virtual machines](../virtual-machines/spot-vms.md).
- Learn more in [Quotas overview](quotas-overview.md).
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).