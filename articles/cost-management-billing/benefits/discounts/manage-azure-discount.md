---
title: Manage a Discount Resource Under a Subscription
description: Learn how to manage your discount resource, including moving it across resource groups or subscriptions.
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 02/20/2026
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about managing a discount so that I can move the discount when necessary.
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---

# Manage a discount resource under a subscription

When you accept a discount as part of a Microsoft Customer Agreement, the discount is allotted to a subscription and resource group. The resulting discount resource contains descriptive metadata that includes the discount status, discount type, product family, discount percentage, start date, and end date.

Although the discount resource stores relevant metadata, it doesn't affect eligibility. Discounts are applicable to a billing account and apply automatically to eligible charges on any subscription within the billing account.

> [!NOTE]
> This article applies to certain Azure and Microsoft 365 discounts accepted after *August 2025*. Discounts accepted earlier aren't listed as resources under a subscription.

## View discount resources

You can use the **Discounts** view to manage all discounts in one place. It shows which discounts are currently active, their applicability start and end dates, and whether they apply to consumption or purchases.

1. In the [Azure portal](https://portal.azure.com/), enter **discounts** in the search box.

2. Under **Services**, select **Discounts**.

### View additional discount metadata

You can get detailed information about an available discount by viewing the JSON representation of the discount resource. You can then examine all relevant fields, such as discount values, eligibility criteria, validity periods, and other attributes connected to the discount.

1. In the [Azure portal](https://portal.azure.com/), enter **discounts** in the search box.

2. Under **Services**, select **Discounts**.

3. Select the discount resource.

4. On the **Overview** pane, on the **Essentials** tab, select **JSON View**.

### View the discount resource URI

1. In the [Azure portal](https://portal.azure.com/), enter **discounts** in the search box.

2. Under **Services**, select **Discounts**.

3. Select the discount resource.

4. On the left menu, expand **Settings** and select **Properties**.

5. The discount resource URI is the **Id** value.

## Move a discount across resource groups or subscriptions

You can move a discount resource between resource groups or subscriptions within the same billing account without affecting the discount, because only the metadata is updated.

Here are the high-level steps to move a discount resource. For more information on moving Azure resources, see [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md).

### Move a discount resource to a new resource group

1. In the [Azure portal](https://portal.azure.com/), enter **discounts** in the search box.

2. Under **Services**, select **Discounts**.

3. Select the discount resource that you want to move.

4. On the **Essentials** tab, select the **move** link next to **Resource group**.

5. The source resource group is set automatically. Specify the target resource group, and then select **Next**.

6. Wait for the portal to validate resource move readiness.

7. When validation finishes successfully, select **Next**.

8. Select the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select **Move**.

9. After the move is complete, verify that the discount resource is in the new resource group.

### Move a discount resource to a new subscription

1. In the [Azure portal](https://portal.azure.com/), enter **discounts** in the search box.

2. Under **Services**, select **Discounts**.

3. Select the discount resource that you want to move.

4. On the **Essentials** tab, select the **move** link next to **Subscription**.

5. The source subscription and resource group are set automatically. Specify the target subscription and resource group, and then select **Next**.

6. Wait for the portal to validate resource move readiness.

7. When validation finishes successfully, select **Next**.

8. Select the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select **Move**.

9. After the move is complete, verify that the discount resource is in the new subscription and resource group.

When you move a discount, the resource URI associated with it is updated to reflect the change.

## Grant user access to a discount resource

The user who accepted the discount proposal automatically gets owner access to the discount resource. To add other users, assign them an Azure role:

1. In the [Azure portal](https://portal.azure.com/), enter **discounts** in the search box.

2. Under **Services**, select **Discounts**.

3. Select the discount resource.

4. On the left menu, select **Access control (IAM)**.

5. Select **Add** > **Add role assignment**.

6. On the **Role** tab, select the appropriate role.

7. On the **Members** tab, add other users.

8. On the **Review + assign** tab, review the role assignment settings.

9. Select the **Review + assign** button to assign the role.

> [!NOTE]
> Currently supported Azure built-in roles are Reader, Contributor, and Owner.

## Rename a discount resource

The discount's resource name is a part of its URI and can't be changed. However, you can use [tags](../../../azure-resource-manager/management/tag-resources.md) to help identify the credit resource based on a nomenclature that's relevant to your organization.

## Cancel a discount

If you have questions about canceling your discount, contact your Microsoft account team.

## Delete a discount resource

You can delete a discount resource only if its status is **Failed**, **Canceled**, or **Expired**. Deletion is permanent and can't be reversed.

If you try to delete a discount resource that has an **Active** status, an error notifies you that deletion isn't allowed. Deleting a resource group or subscription that has an active discount resource will also fail. Be sure to move the active discount resource to another group or subscription within the same billing account before you attempt deletion.

## Frequently asked questions

- **How do I verify that a discount is applied?** For Azure-based discounts, you can verify that the discount is appropriately applied by following the instructions in [Calculate discount in the usage file](../../understand/download-azure-daily-usage.md#calculate-discount-in-the-usage-file).

- **Does attaching a discount resource to a subscription alter its behavior?** Creating a discount resource object on a subscription doesn't affect how or to what the discount applies. It simply records the discount and provides metadata like start date, end date, and discount percentage.

- **Does the resource group's location affect discount application?** The resource group maintains metadata for the resources and doesn't influence discount eligibility. Discounts are linked to a billing account and are automatically applied to qualifying charges for any subscription within that billing account.

- **Are discounts with a status of Expired or Canceled automatically deleted?** No, discounts marked as **Expired** or **Canceled** aren't deleted automatically. You must remove them manually. These records are kept intentionally for analysis of past cost or pricing changes.  

## Related content

- [Calculate discount in the usage file](../../understand/download-azure-daily-usage.md#calculate-discount-in-the-usage-file)
- [Microsoft.BillingBenefits discounts - Bicep, ARM template, and Terraform AzAPI reference](https://aka.ms/DiscountReference)
- [Understand Cost Management data](../../../cost-management-billing/costs/understand-cost-mgt-data.md)
- [View and download your organization's Azure pricing](../../../cost-management-billing/manage/ea-pricing.md)
- [Terms in your Microsoft Customer Agreement price sheet](../../../cost-management-billing/manage/mca-understand-pricesheet.md)
- [What is a cloud subscription?](../../../cost-management-billing/manage/cloud-subscription.md)
- [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)
