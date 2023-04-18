---
title: Increase regional vCPU quotas
description: Learn how to request an increase in the vCPU quota limit for a region in the Azure portal.
ms.date: 07/22/2022
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

- When you create a new subscription, the default value for the total number of vCPUs in a region might not be equal to the total default vCPU quota for all individual VM series. This can result in a subscription without enough quota for each individual VM series that you want to deploy. However, there might not be enough quota to accommodate the total regional vCPUs for all deployments. In this case, you must submit a request to explicitly increase the quota limit of the regional vCPU quotas.

## Request an increase for regional vCPU quotas

1. To view the **Quotas** page, sign in to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box, then select **Quotas**.

   > [!TIP]
   > After you've accessed **Quotas**, the service will appear at the top of [Azure Home](https://portal.azure.com/#home) in the Azure portal. You can also [add **Quotas** to your **Favorites** list](../azure-portal/azure-portal-add-remove-sort-favorites.md) so that you can quickly go back to it.

1. On the **Overview** page, select **Compute**.
1. On the **My quotas** page, select **Region** and then unselect **All**.
1. In the **Region** list, select the regions you want to include for the quota increase request.
1. Filter for any other requirements, such as **Usage**, as needed.
1. Select the quota(s) that you want to increase.

   :::image type="content" source="media/regional-quota-requests/select-regional-quotas.png" alt-text="Screenshot showing regional quota selection in the Azure portal":::

1. Near the top of the page, select **Request quota increase**, then select the way you'd like to increase the quota(s).

   :::image type="content" source="media/regional-quota-requests/request-quota-increase-options.png" alt-text="Screenshot showing the options to request a quota increase in the Azure portal.":::

   > [!TIP]
   > Choosing **Adjust the usage %** allows you to select one usage percentage to apply to all the selected quotas without requiring you to calculate an absolute number (limit) for each quota. This option is recommended when the selected quotas have very high usage.

1. If you selected **Enter a new limit**, in the **Request quota increase** pane, enter a numerical value for your new quota limit(s), then select **Submit**.

   :::image type="content" source="media/regional-quota-requests/regional-request-quota-increase-new-limit.png" alt-text="Screenshot showing the Enter a new limit option for a regional quota increase request.":::

1. If you selected **Adjust the usage %**, in the **Request quota increase** pane, adjust the slider to a new usage percent. Adjusting the percentage automatically calculates the new limit for each quota to be increased. This option is recommended when the selected quotas have very high usage. When you're finished, select **Submit**.

   :::image type="content" source="media/regional-quota-requests/regional-request-quota-increase-adjust-usage.png" alt-text="Screenshot showing the Adjust the usage % option for a regional quota increase request.":::

Your request will be reviewed, and you'll be notified if the request can be fulfilled. This usually happens within a few minutes. If your request is not fulfilled, you'll see a link where you can [open a support request](../azure-portal/supportability/how-to-create-azure-support-request.md) so that a support engineer can assist you with the increase.

## Next steps

- Learn more about [vCPU quotas](../virtual-machines/windows/quotas.md).
- Learn more in [Quotas overview](quotas-overview.md).
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- Review the [list of Azure regions and their locations](https://azure.microsoft.com/regions/).
