---
title: Error when creating a VM as an Azure Enterprise user
description: Provides several solutions to an issue in which you can't create a VM as an Enterprise Agreement (EA) user in portal.
ms.topic: troubleshooting
ms.date: 04/15/2024
ms.author: banders
author: bandersmsft
ms.reviewer: jarrettr
ms.service: cost-management-billing
ms.subservice: billing
---
# Error when creating a VM as an Azure Enterprise user: Contact your reseller for accurate pricing

This article provides several solutions to an issue in which you can't create a VM as an Azure Enterprise Agreement (EA) user in portal.

_Original product version:_ Billing
_Original KB number:_ 4091792

## Symptoms

When you create a VM as an EA user in the [Azure portal](https://portal.azure.com/), you receive the following message:

`Retail prices displayed here. Contact your reseller for accurate pricing.`

:::image type="content" source="./media/cannot-create-vm/price-error.png" alt-text="Screenshot of the price error message.":::

## Cause

This issue occurs in one of the following scenarios:

- You're a direct EA user, and **AO view charges** or **DA view charges**  is disabled.
- You're an indirect EA user who has **release markup** enabled and **AO view charges** or **DA view charges** disabled.
- You're an indirect EA user who has **release markup** not enabled.
- You use an EA dev/test subscription under an account that isn't marked as dev/test in the Azure portal.

## Resolution

Follow these steps to resolve the issue based on your scenario.

### Scenario 1

When you're a direct or indirect EA user who has **release markup** enabled and **AO view charges** or **DA view charges** disabled, you can use the following workaround:

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left navigation menu, select **Policies**.
1. Enable **Department Admins can view charges** and **Account Owners view charges**.

### Scenario 2

When you're an indirect EA user who has **release markup** disabled, you can contact the reseller for accurate pricing.

### Scenario 3

When you use an EA dev/test subscription under an account that isn't marked as dev/test in the Azure portal, you can use the following workaround:

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. Find the account that has the issue and in the right side of the window, select the ellipsis symbol (**...**) and then select **Edit**.
1. In the Edit account window, select **Dev/Test** and then select **Save**.

## Next steps

For other assistance, follow these links:

* [How to manage an Azure support request](../../azure-portal/supportability/how-to-manage-azure-support-request.md)
* [Azure support ticket REST API](/rest/api/support)
* Engage with us on [Twitter](https://twitter.com/azuresupport)
* Get help from your peers in the [Microsoft question and answer](/answers/products/azure)
* Learn more in [Azure Support FAQ](https://azure.microsoft.com/support/faq)
