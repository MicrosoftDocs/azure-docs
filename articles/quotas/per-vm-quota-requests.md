---
title: Increase VM-family vCPU quotas
description: Learn how to request an increase in the vCPU quota limit for a VM family in the Azure portal, which increases the total regional vCPU limit by the same amount.
ms.date: 07/22/2022
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

## Adjustable and non-adjustable quotas

When requesting a quota increase, the steps differ depending on whether the quota is adjustable or non-adjustable.

- **Adjustable quotas**: Quotas for which you can request quota increases fall into this category. Each subscription has a default quota value for each quota. You can request an increase for an adjustable quota from the [Azure Home](https://portal.azure.com/#home) **My quotas** page, providing an amount or usage percentage and submitting it directly. This is the quickest way to increase quotas.
- **Non-adjustable quotas**: These are quotas which have a hard limit, usually determined by the scope of the subscription. To make changes, you must submit a support request, and the Azure support team will help provide solutions.

## Request an increase for adjustable quotas

You can submit a request for a standard vCPU quota increase per VM-family from **My quotas**, quickly accessed from [Azure Home](https://portal.azure.com/#home).

1. To view the **Quotas** page, sign in to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box, then select **Quotas**.

   > [!TIP]
   > After you've accessed **Quotas**, the service will appear at the top of [Azure Home](https://portal.azure.com/#home) in the Azure portal. You can also [add **Quotas** to your **Favorites** list](../azure-portal/azure-portal-add-remove-sort-favorites.md) so that you can quickly go back to it.

1. On the **Overview** page, select **Compute**.
1. On the **My quotas** page, select the quota or quotas you want to increase.

   :::image type="content" source="media/per-vm-quota-requests/select-per-vm-quotas.png" alt-text="Screenshot showing per-VM quota selection in the Azure portal.":::

1. Near the top of the page, select **Request quota increase**, then select the way you'd like to increase the quota(s).

   :::image type="content" source="media/per-vm-quota-requests/request-quota-increase-options.png" alt-text="Screenshot showing the options to request a quota increase in the Azure portal.":::

   > [!TIP]
   > Choosing **Adjust the usage %** allows you to select one usage percentage to apply to all the selected quotas without requiring you to calculate an absolute number (limit) for each quota. This option is recommended when the selected quotas have very high usage.

1. If you selected **Enter a new limit**, in the **Request quota increase** pane, enter a numerical value for your new quota limit(s), then select **Submit**.

   :::image type="content" source="media/per-vm-quota-requests/per-vm-request-quota-increase-new-limit.png" alt-text="Screenshot showing the Enter a new limit option for a per-VM quota increase request.":::

1. If you selected **Adjust the usage %**, in the **Request quota increase** pane, adjust the slider to a new usage percent. Adjusting the percentage automatically calculates the new limit for each quota to be increased. This option is recommended when the selected quotas have very high usage. When you're finished, select **Submit**.

   :::image type="content" source="media/per-vm-quota-requests/per-vm-request-quota-increase-adjust-usage.png" alt-text="Screenshot showing the Adjust the usage % option for a per-VM quota increase request.":::

Your request will be reviewed, and you'll be notified if the request can be fulfilled. This usually happens within a few minutes. If your request is not fulfilled, you'll see a link where you can [open a support request](../azure-portal/supportability/how-to-create-azure-support-request.md) so that a support engineer can assist you with the increase.

> [!NOTE]
> If your request to increase your VM-family quota is approved, Azure will automatically increase the regional vCPU quota for the region where your VM is deployed.

> [!TIP]
> When creating or resizing a virtual machine and selecting your VM size, you may see some options listed under **Insufficient quota - family limit**. If so, you can request a quota increase directly from the VM creation page by selecting the **Request quota** link.

## Request an increase when a quota isn't available

At times you may see a message that a selected quota isn’t available for an increase. To see which quotas are not available, look for the Information icon next to the quota name.

:::image type="content" source="media/per-vm-quota-requests/per-vm-quota-not-available.png" alt-text="Screenshot showing a quota that is not available in the Azure portal.":::

If a quota you want to increase isn't currently available, the quickest solution may be to consider other series or regions. If you want to continue and receive assistance for your specified quota, you can submit a support request for the increase.

1. When following the steps above, if a quota isn't available, select the Information icon next to the quota. Then select **Create a support request**.
1. In the **Quota details** pane, confirm the pre-filled information is correct, then enter the desired new vCPU limit(s).

   :::image type="content" source="media/per-vm-quota-requests/quota-details.png" alt-text="Screenshot of the Quota details pane in the Azure portal.":::

1. Select **Save and continue** to open the **New support request** form. Continue to enter the required information, then select **Next**.
1. Review your request information and select **Previous** to make changes, or **Create** to submit the request.

## Request an increase for non-adjustable quotas

To request an increase for a non-adjustable quota, such as Virtual Machines or Virtual Machine Scale Sets, you must submit a support request so that a support engineer can assist you. 

1. To view the **Quotas** page, sign in to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box, then select **Quotas**.
1. From the **Overview** page, select **Compute**.
1. Find the quota you want to increase, then select the support icon.

   :::image type="content" source="media/per-vm-quota-requests/support-icon.png" alt-text="Screenshot showing the support icon in the Azure portal.":::

1. In the **New support request form**, on the first page, confirm that the pre-filled information is correct.
1. For **Quota type**, select **Other Requests**, then select **Next**.

   :::image type="content" source="media/per-vm-quota-requests/new-per-vm-quota-request.png" alt-text="Screenshot showing a new quota increase support request in the Azure portal.":::

1. On the **Additional details** page, under **Problem details**, enter the information required for your quota increase, including the new limit requested.

   :::image type="content" source="media/per-vm-quota-requests/quota-request-problem-details.png" alt-text="Screenshot showing the Problem details step of a quota increase request in the Azure portal.":::

1. Scroll down and complete the form. When finished, select **Next**.
1. Review your request information and select **Previous** to make changes, or **Create** to submit the request.

For more information, see [Create a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Next steps

- Learn more about [vCPU quotas](../virtual-machines/windows/quotas.md).
- Learn more in [Quotas overview](quotas-overview.md).
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).