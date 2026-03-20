---
title: Manage an Azure Credit Resource Under a Subscription
description: Learn how to manage your Azure credit resource, including moving it across resource groups or subscriptions.
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 02/09/2026
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about managing a Azure credit so that I can move the credit when necessary.
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---


# Manage an Azure credit resource under a subscription

When you accept Azure credit under a Microsoft Customer Agreement, the credit is assigned to a [subscription](../../../cost-management-billing/manage/cloud-subscription.md) and a resource group. The associated resource holds metadata such as status, credit amount, currency, start date, and end date. You can access this information in the Azure portal.

> [!NOTE]
> This article applies to credits accepted after *August 2025* for Azure Credit Offers, Azure prepayments, End Customer Investment Funds (ECIF), and support. Credits accepted earlier aren't listed as resources under a subscription.

## Move a credit resource

You can move a credit resource to another resource group or subscription, just like other Azure resources. This move only changes metadata and doesn't affect the credit.

The new resource group or subscription must remain within the same billing profile as the original.

Here are the high-level steps to move a credit resource. For more information on moving Azure resources, see [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md).

### Move a credit resource to a new resource group

1. In the [Azure portal](https://portal.azure.com/), enter **credits** in the search box.

2. Under **Services**, select **Credits**.

3. Select the specific credit resource that you want to move.

4. On the **Essentials** tab, select the **move** link next to **Resource Group**.

5. The source resource group is set automatically. Specify the target resource group, and then select **Next**.

6. Wait for the portal to validate resource move readiness.

7. When validation finishes successfully, select **Next**.

8. Select the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select **Move**.

9. After the move is complete, verify that the credit resource is in the new resource group.

### Move a credit resource to a new subscription

1. In the [Azure portal](https://portal.azure.com/), enter **credits** in the search box.

2. Under **Services**, select **Credits**.

3. Select the specific credit resource that you want to move.

4. On the **Essentials** tab, select the **move** link next to **Subscription**.

5. The source subscription and resource group are set automatically. Specify the target subscription and resource group, and then select **Next**.

6. Wait for the portal to validate resource move readiness.

7. When validation finishes successfully, select **Next**.

8. Select the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select **Move**.

9. After the move is complete, verify that the credit resource is in the new subscription and resource group.

When you move a credit, the resource URI associated with it is updated to reflect the change.

## View the credit resource URI

1. In the [Azure portal](https://portal.azure.com/), enter **credits** in the search box.

2. Under **Services**, select **Credits**.

3. Select the credit resource.

4. On the left menu, expand **Settings** and select **Properties**.

5. The credit resource URI is the **Id** value.

## Rename a credit resource

The credit's resource name is a part of its URI and can't be changed. However, you can use [tags](../../../azure-resource-manager/management/tag-resources.md) to help identify the credit resource based on a nomenclature that's relevant to your organization.

## Delete a credit resource

You can delete a credit resource only if its status is **Failed**, **Canceled**, or **Expired**. Deletion of a credit resource is a permanent action and can't be undone.

If you try to delete an active credit resource, an error notifies you that the credit resource can't be deleted in its current **Succeeded** state. Trying to delete a resource group or subscription that contains an active credit resource will fail with a similar error. Be sure to move the active credit resource to another resource group or subscription within the same billing profile before you attempt deletion.

## Cancel a credit

If you have questions about canceling your credit, contact your Microsoft account team.

## Grant user access to a credit resource

By default, the user account that accepted the credit proposal has owner access to the credit resource. You can grant access by adding other users to an Azure role:

1. In the [Azure portal](https://portal.azure.com/), enter **credits** in the search box.

2. Under **Services**, select **Credits**.

3. Select the credit resource.

4. On the left menu, select **Access control (IAM)**.

5. Select **Add** > **Add role assignment**.

6. On the **Role** tab, select the appropriate role.

7. On the **Members** tab, select another user.

8. On the **Review + assign** tab, review the role assignment settings.

9. Select **Review + assign** button to assign the role.

> [!NOTE]
> Currently supported Azure built-in roles are Reader, Contributor, and Owner.

## Frequently asked questions

- **Does having a credit resource object associated with a subscription affect how the credit behaves?** No, having a credit resource created on a subscription doesn't change how the credit is applied or what the credit is applied to. The credit resource acts as a record of the credit awarded and gives you other metadata, such as the start date, end date, and amount of the credit.

- **Does the resource group's location affect credit application?** No, the resource group stores metadata about the resources and doesn't affect the credit. The credit resource is associated with a billing profile and is automatically applied to applicable charges on the billing profile.

## Related content

- [Track your Azure credit balance for a Microsoft Customer Agreement](../../../cost-management-billing/benefits/credits/mca-check-azure-credits-balance.md)
- [What is a cloud subscription?](../../../cost-management-billing/manage/cloud-subscription.md)
- [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)
