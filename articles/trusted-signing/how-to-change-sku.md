---
title: Change the account SKU
description: Learn how to change your SKU or pricing tier for a Trusted Signing account.
author: TacoTechSharma
ms.author: mesharm
ms.service: trusted-signing
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 05/30/2024
---


# Change a Trusted Signing account SKU (pricing tier)

Trusted Signing gives you a choice between two pricing tiers: Basic and Premium. Both tiers are tailored to offer the service at an optimal cost and to be suitable for any signing scenario.

For more information, see [Trusted Signing pricing](https://azure.microsoft.com/pricing/details/trusted-signing/).

## SKU (pricing tier) overview

The following table describes key account details for the Basic SKU and the Premium SKU:

|        Account detail       | Basic  | Premium     |
| :------------------- | :------------------- |:---------------|
| Price (monthly)              | **$9.99 per account**              | **$99.99 per account**  |
| Quota (signatures per month)             | 5,000              | 100,000  |
| Price after quota is reached             | $0.005 per signature               | $0.005 per signature   |
| Certificate profiles             | 1 of each available type               | 10 of each available type  |
| Public Trust signing             | Yes               | Yes  |
| Private Trust signing             | Yes               | Yes  |

> [!NOTE]
> The pricing tier is also called the *account SKU*.

## Change the SKU

You can change the SKU for a Trusted Signing account at any time by upgrading to Premium or by downgrading to Basic. You can change the SKU by using either the Azure portal or the Azure CLI.

Considerations:

- SKU updates are effective beginning in the next billing cycle.
- SKU limitations for an updated SKU are enforced after the update is successful.
- After you change the SKU, you must manually refresh the account overview to see the updated SKU under **SKU (Pricing tier)**. (We are actively working to resolve this known limitation.)
- To upgrade to Premium:

  - No limitations are applied when you upgrade from the Basic SKU to the Premium SKU.
- To downgrade to Basic:

  - The Basic SKU allows only one certificate profile of each type. For example, if you have two certificate profiles of the Public Trust type, you must delete any single profile to be eligible to downgrade. The same limitation applies for other certificate profile types.
  - In the Azure portal, on the **Certificate Profiles** pane, make sure that you select **Status: All** to view all certificate profiles. Viewing all certificate profiles can help you delete all relevant certificate profiles to meet the criteria to downgrade.

    :::image type="content" source="media/trusted-signing-certificate-profile-deletion-changesku.png" alt-text="Screenshot that shows selecting all certificate profile statuses to view all certificate profiles." lightbox="media/trusted-signing-certificate-profile-deletion-changesku.png":::

# [Azure portal](#tab/sku-portal)

To change the SKU (pricing tier) by using the Azure portal:

1. In the Azure portal, go to your Trusting Signing account.
1. On the account **Overview** pane, find the current value for **SKU (Pricing tier)**.
1. Select the link for the current SKU. Your current SKU selection is highlighted in the **Choose pricing tier** pane.
1. Select the SKU to update to (for example, downgrade to Basic or upgrade to Premium), and then select **Update**.

# [Azure CLI](#tab/sku-cli)

To change the SKU by using the Azure CLI, run this command:

```azurecli
az trustedsigning update -n MyAccount -g MyResourceGroup --sku Premium
```

---

## Cost management and billing

View details about cost management and billing for your Trusted Signing resource by viewing your Azure subscription.

### Cost management

To view and estimate the cost of your Trusted Signing resource usage:

1. In the Azure portal, search for **Subscriptions**.
1. Select the subscription you used to create your Trusted Signing resource.
1. On the left menu, select **Cost Management**. Learn more about [cost management](../cost-management-billing/costs/overview-cost-management.md).
1. Under **Trusted Signing**, verify that you can see the costs that are associated with your Trusted Signing account.  

### Billing

To view invoices for your Trusted Signing account:

1. In the Azure portal, search for **Subscriptions**.
1. Select the subscription you used to create your Trusted Signing resource.
1. On the left menu, select **Billing**. Learn more about [billing](../cost-management-billing/cost-management-billing-overview.md).
