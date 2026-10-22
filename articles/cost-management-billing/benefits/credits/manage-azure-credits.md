---
title: Manage an Azure Credit Resource Under a Subscription
description: Learn how to access and view your Azure credit resource, move it across resource groups or subscriptions, and view supported credit transactions.
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 09/16/2026
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about managing a Azure credit so that I can move the credit when necessary.
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---


# Manage an Azure credit resource under a subscription

For eligible credits that you accept under the Microsoft Customer Agreement, Azure creates a credit resource within a [subscription](../../../cost-management-billing/manage/cloud-subscription.md) and resource group. You can use this credit resource to manage the credit. From the credit resource page in the Azure portal, you can manage the credit resource and view its metadata, including status, credit amount, currency, start date, and end date.

> [!NOTE]
> The general resource-management guidance applies to Azure Credit Offers, Azure prepayments, MACC Shortfall and Top Up MC effective on or after August 2025 and for MAICPP Credits (Sponsorship credits) effective on or after August 2026. Credits that you accepted earlier don't appear as resources under a subscription. You can always track balances and other details for all credits in [Track your Azure credit balance for a Microsoft Customer Agreement](../../../cost-management-billing/benefits/credits/mca-check-azure-credits-balance.md).  

## Credit applicability

The offer defines a credit scope. All credits that you obtain through MCA-E and MAICPP apply at the billing profile level. Even though the credit resource is under a single subscription, all transactions under the uber billing group can use these Azure credits. For more information, see [Billing profiles](../../understand/mca-overview.md#billing-profiles) and [Your billing account](../../understand/mca-overview.md#your-billing-account).

## Required access

To view credit resource details and supported transactions, you need Azure role-based access control (Azure RBAC) permission to read the credit resource. An administrator can assign access directly to the resource, or you can inherit access from a parent scope, such as its resource group or subscription. Managing a credit resource requires permissions for the specific action you want to perform; read access alone doesn't allow changes.

Microsoft Customer Agreement billing roles alone don't grant access to the credit resource. Similarly, resource-read access doesn't grant access to a billing profile. See [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

If you need access, ask an administrator to follow [Grant user access to a credit resource](#grant-user-access-to-a-credit-resource). Assigning access requires permission to assign Azure roles at that scope. See [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## View credit resource details

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search box, enter **Credits**, and then select **Credits** under **Services**.
3. Use the **Subscription** and **Resource Group** filters to locate your credit resource.

	:::image type="content" source="media/manage-sponsorship-credit-transactions/credits-list-sanitized.png" alt-text="Screenshot of credit resources in the Credits list with sample resource names, subscription and resource group filters, statuses, amounts, currencies, and dates.":::

4. Review the resource in the list, and then select its name to open it.
5. On the resource menu, select **Overview** to view its details.
6. To view the credit resource URI, expand **Settings** on the resource menu and select **Properties**. The URI is the **Id** value.

The **Credits** list provides the following information:

| Field | Description |
| --- | --- |
| **Name** | Name of the credit resource. Select the name to open the resource. |
| **Subscription** | Subscription that contains the credit resource. |
| **Resource Group** | Resource group that contains the credit resource. |
| **Status** | Credit status (`properties.status`). For supported values and their meanings, see the [CreditStatus API definition](/rest/api/billingbenefits/credits/get?view=rest-billingbenefits-2026-06-01&preserve-view=true#creditstatus). This status is separate from `properties.provisioningState`, which describes resource provisioning. |
| **Amount** | Total credit amount granted at creation, not the remaining balance. |
| **Currency** | Currency associated with the credit amount. |
| **Start Date** | Start date of the credit, which is also its creation date. |
| **End Date** | End date shown for the credit. |

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

## View credit transactions

> [!NOTE]
> Transactions are currently available only for sponsorship credits issued through the Microsoft AI Cloud Partner Program (MAICPP - See [Azure benefits in Partner Center](/partner-center/benefits/mpn-benefits-azure-cloud) for offer and redemption details) on or after August 1, 2026. Support for other credit types is coming soon.

The credit resource's **Transactions** page shows transactions that reduce its credit balance. You can also retrieve a specific transaction through the Azure Billing Benefits REST API.

### View transactions by using the portal or REST API

#### [Azure portal](#tab/portal)

1. Follow the steps in [View credit resource details](#view-credit-resource-details) to open your credit resource.
2. On the resource menu, select **Transactions**.

	:::image type="content" source="media/manage-sponsorship-credit-transactions/sponsorship-transactions-sanitized.png" alt-text="Screenshot of an MAICPP credit's Transactions page with sample transaction names, billing status and service family filters, billing and pricing amounts, and Export to CSV.":::

3. Review the transaction list. Use the **Billing status** and **Service family** filters to narrow the results.
4. Open **Group by none** and select **Group by Transaction month** to organize transactions by month, or **Group by Service family** to organize them by service category. Select **Group by none** to return to the ungrouped list.
5. To download the transaction list, select **Export to CSV**.
6. Select **Add filter** to filter by more attributes. For example, combine **Billing status** and **Service family** to narrow the list. Remove a filter by selecting the **X** next to it.

| Column | Description |
| --- | --- |
| **Name** | Unique transaction identifier within the credit resource. |
| **Transaction month** | Month shown for the transaction, in `YYYY-MM` format. |
| **Charge type** | Type of charge. See [values and applicability](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true#transactionchargetype). |
| **Billing status** | Billing lifecycle status. See [status definitions](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true#transactionbillingstatus). |
| **SKU title** | Product SKU associated with the transaction. |
| **Billing amount** | Transaction amount in billing currency, not the remaining credit balance. |
| **Pricing amount** | Transaction amount in pricing currency, not the remaining credit balance. |

#### [REST API](#tab/rest)

Use [Credit Transactions - Get](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true) to retrieve a specific transaction for a credit resource. This operation uses API version `2026-06-01` and returns one transaction, not the full transaction list or a credit balance.

Authenticate with Microsoft Entra ID and include an OAuth bearer access token for Azure Resource Manager. Use an identity with the [required resource access](#required-access). Don't include a real token in shared examples or logs.

1. Follow [View credit resource details](#view-credit-resource-details) to find the credit resource URI. Use the **Id** value to identify the subscription, resource group, and credit resource name.
2. Call [Credit Transactions - List By Parent](/rest/api/billingbenefits/credit-transactions/list-by-parent?view=rest-billingbenefits-2026-06-01&preserve-view=true) for that credit resource. From the response's `value` array, copy the `name` of the transaction you want to retrieve. Use that full value for `transactionName`, not a truncated portal display value.
3. Send the following request, replacing the path parameters and `<access-token>` with your values:

	```http
	GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.BillingBenefits/credits/{creditName}/transactions/{transactionName}?api-version=2026-06-01
	Authorization: Bearer <access-token>
	```

| Parameter | Value |
| --- | --- |
| `subscriptionId` | UUID of the subscription that contains the credit resource. |
| `resourceGroupName` | Name of the resource group that contains the credit resource. |
| `creditName` | Name of the credit resource, not its full resource ID. |
| `transactionName` | Full name of the transaction under that credit resource. |

A successful request returns `200 OK` and a `CreditTransaction` object. The following fields describe the transaction:

| Response field | Description |
| --- | --- |
| `id` | Fully qualified resource ID of the transaction. |
| `name` | Transaction resource name. |
| `properties.date` | Date and time when the transaction occurred. |
| `properties.chargeType` | Type of charge for the transaction. For supported values, meanings, and benefit applicability, see the [TransactionChargeType API definition](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true#transactionchargetype). |
| `properties.billingStatus` | Billing lifecycle status of the transaction. For supported values and their meanings, see the [TransactionBillingStatus API definition](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true#transactionbillingstatus). |
| `properties.amountInBillingCurrency` | Transaction amount in billing currency, with `amount` and `currencyCode` fields. |
| `properties.amountInPricingCurrency` | Transaction amount in pricing currency, with `amount` and `currencyCode` fields. |
| `properties.productDetails.skuTitle` | SKU title of the product. |
| `properties.productDetails.serviceFamily` | Grouping of services by core function, such as Compute or Databases. |
| `properties.invoiceResourceId` | Fully qualified identifier of the invoice. |

For the full response schema and error response structure, see [Credit Transactions - Get](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true).

---

## Troubleshoot credit resources

If you can't find a credit resource or view its details:

- Check that you're signed in to the directory that contains the resource's subscription.
- Check the **Subscription** and **Resource Group** filters on the **Credits** page.
- Ask your administrator to verify that you have the [required resource access](#required-access).

If you can't view transactions, first check the availability requirements in [View credit transactions](#view-credit-transactions). For supported credits, review the **Billing status** and **Service family** filters on **Transactions**. An empty filtered list doesn't by itself mean that the credit is exhausted.

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Frequently asked questions

- **Does having a credit resource object associated with a subscription affect how the credit behaves?** No, having a credit resource created on a subscription doesn't change how the credit is applied or what the credit is applied to. The credit resource acts as a record of the credit awarded and gives you other metadata, such as the start date, end date, and amount of the credit.

- **Does the resource group's location affect credit application?** No, the resource group stores metadata about the resources and doesn't affect the credit. The credit resource is associated with a billing profile and is automatically applied to applicable charges on the billing profile.

## Related content

- [Track your Azure credit balance for a Microsoft Customer Agreement](../../../cost-management-billing/benefits/credits/mca-check-azure-credits-balance.md)
- [What is a cloud subscription?](../../../cost-management-billing/manage/cloud-subscription.md)
- [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Credit Transactions - Get](/rest/api/billingbenefits/credit-transactions/get?view=rest-billingbenefits-2026-06-01&preserve-view=true)
- [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview)
- [Azure benefits in Partner Center](/partner-center/benefits/mpn-benefits-azure-cloud)

