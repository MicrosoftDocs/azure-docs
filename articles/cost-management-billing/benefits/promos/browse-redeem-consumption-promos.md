---
title: Discover and redeem Azure Promotions & Special Offers
description: Learn how to discover, view, and redeem Azure promotions and special offers for your Microsoft Customer Agreement billing account.
author: shrutis06
ms.reviewer: shrshett
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 09/25/2026
ms.author: shrshett
ms.custom: sfi-image-nochange
---

# Discover and redeem Azure promotions and special offers

Azure promotions and special offers are time-bound discount offers available on eligible Azure Pay-As-You-Go (PAYG) consumption services. When your organization is eligible for a promotion, you can discover it in the Azure portal, review the discount details and applicable products, and redeem it to receive a discounted price on eligible consumption for the duration of the promotional price window.

Promotions are available to direct Microsoft Customer Agreement (MCA) customers and partners acting on behalf of their customers.


## Prerequisites

- **To view promotions:** You must have the Owner, Contributor, or Reader role either on an eligible billing account (MCA only) or on a subscription under an eligible billing account or the procurement contributor role.
- **To redeem promotions:** You must have the Owner or Contributor role on the billing account or a subscription under the billing account or the procurement contributor role. The Reader role can view available promotions but can't redeem them.

> [!NOTE]
> Partners acting on behalf of their customers can also discover and redeem promotions through the Azure portal or [Partner Center](https://partner.microsoft.com/dashboard/home).


## Discover available promotions

### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Cost Management + Billing**.  
    :::image type="content" source="../../manage/media/promos/cost-management-billing-search.png" alt-text="Screenshot showing search in portal for Cost Management + Billing." lightbox="../../manage/media/promos/cost-management-billing-search.png" :::
3. In the billing scopes page, select the billing account for which you want to view promotions.
4. Select **Benefits** from the left-hand navigation menu.
5. The **Azure Promotions & Special Offers** section displays promotions you're currently eligible to redeem.
    :::image type="content" source="../../manage/media/promos/promo-list.png" alt-text="Screenshot showing the Azure Promotions & Special Offers page with available promotions." lightbox="../../manage/media/promos/promo-list.png" :::

    Each promotion card displays the following information:
    
    | Detail | Description |
    |---|---|
    | Promotion name | The name of the promotional offer |
    | Discount percentage | The percentage discount applied on pay-as-you-go consumption pricing |
    | Applicable products | The Azure services and products eligible for the discounted pricing |
    | Valid until | The last date the promotion can be redeemed |

---

## Redeem a promotion

1. On the **Azure Promotions & Special Offers** page, locate the promotion you want to redeem and select **Redeem**.
2. The **Redeem promotion** pane opens on the right side of the page. Review the promotion details:
    :::image type="content" source="../../manage/media/promos/promo-redeem.png" alt-text="Screenshot showing the Redeem promotion pane with promotion details and subscription selection." lightbox="../../manage/media/promos/promo-redeem.png" :::

    The redemption pane displays:
    
    | Detail | Description |
    |---|---|
    | Discount percentage | The percentage discount applied on pay-as-you-go consumption pricing |
    | Applicable products | The Azure services covered by the promotion |
    | Expiration date | The date the promotion expires |
    | Promotion duration | The length of time the promotional price is applied from the day you redeem the promotion |

3. Under **Subscription Details**, select the **Subscription** where you want to create the promotion resource.
    > [!NOTE]
    > The discount applies to eligible resources linked to the billing profile associated with that subscription.

4. Select a **Resource group** for the promotion resource.
5. Review the **Terms and Conditions**, and then select the checkbox to confirm you agree.
6. Select **Redeem promotion** to complete the redemption.

---

## Manage your promotional discounts

After you redeem a promotion, you can view and manage the resulting discount alongside your other Azure discounts. For details on viewing redeemed discounts, checking their status, and managing them, see [Manage Azure discounts](../discounts/manage-azure-discount.md).

---

## Understand promotional pricing and charges

After you redeem a promotion, the promotional price applies to eligible usage during the promotional price window. Your invoice reflects the resulting charges. Key points about promotional pricing:

- **Promotion coverage:** The promotional price applies to eligible services from its effective date and time until the promotion expires. You can view the effective date and time on the corresponding discount resource created when you redeem the promotion. You can also verify that the promotional price was applied by reviewing your [Cost usage-details](../../automate/automation-ingest-usage-details-overview.md).
- **Post-promotion pricing:** After the promotional price window ends, your invoice reverts to the standard pre-promotion pricing for the applicable services.
- **Invoice charges:** Your invoice reflects charges calculated using the promotional price for eligible consumption during the promotion period.

---

## Promotion eligibility

Promotions might have eligibility conditions based on:

- **Region:** Some promotions apply only to specific Azure regions.
- **Usage patterns:** Some promotions are available based on your usage history of specific Azure services. For example, promotions might be available based on how much you used an eligible Azure service during a specific period. 

If you don't see any promotions on the Benefits page, there might be no promotions currently available for your billing account based on the applicable eligibility criteria.

---

## Key terms

| Term | Definition |
|------|------------|
| Promotion redemption window | The time period during which you can discover and redeem a promotion. |
| Promotional price window | The time period during which the discounted price is applied to your invoice. |
| PAYG | Pay-As-You-Go consumption pricing. |
| Applicable products | The specific Azure services eligible for the promotional discount. |

---

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Manage your Azure discounts](../discounts/manage-azure-discount.md)
- [View and download your Azure invoice](../../understand/download-azure-invoice.md)
- [Use Cost Analysis to check your usage](../../costs/quick-acm-cost-analysis.md)
