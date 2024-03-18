---
title: Transfer Azure product billing ownership to a Microsoft Customer Agreement
description: Learn how to transfer billing ownership of Azure subscriptions, reservations, and savings plans.
author: bandersmsft
ms.reviewer: sgautam
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 11/29/2023
ms.author: banders
---

# Transfer Azure product billing ownership to a Microsoft Customer Agreement

This article helps you transfer billing ownership for your Azure products (subscriptions, reservations, and savings plans) to a Microsoft Customer Agreement when:

- You want to move billing responsibilities for a product to a different billing owner.
- You want to transfer your Azure products from one licensing agreement to another. For example, from an Enterprise Agreement or a Microsoft Online Subscription Agreement (MOSA) to a Microsoft Customer Agreement.
- You want to transfer reservation or savings plan ownership.

[Check if you have access to a Microsoft Customer Agreement](#check-for-access).

The transition moves only the billing responsibility for your Azure products – the Azure resources tied to your products don't move, so the transition doesn't interrupt your Azure services.

This process contains the following primary tasks:

1. Request billing ownership
2. Review and approve the transfer request
3. Check transfer request status

There are four options to transfer products:

- Transfer only subscriptions
- Transfer only reservations
- Transfer only savings plans
- Transfer a combination of products

When you send or accept a transfer request, you agree to terms and conditions. For more information, see [Transfer terms and conditions](subscription-transfer.md#transfer-terms-and-conditions).

Before you transfer billing products, read [Supplemental information about transfers](subscription-transfer.md#supplemental-information-about-transfers).

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-transfer-note](../../../includes/cost-management-billing-subscription-b2b-b2c-transfer-note.md)]

## Prerequisites

>[!IMPORTANT]
> - When you have a savings plan purchased under an Enterprise Agreement enrollment that was bought in a non-USD currency, you can't transfer it. Instead you must use it in the original enrollment. However, you change the scope of the savings plan so that is used by other subscriptions. For more information, see [Change the savings plan scope](../savings-plan/manage-savings-plan.md#change-the-savings-plan-scope). You can view your billing currency in the Azure portal on the enrollment properties page. For more information, see [To view enrollment properties](direct-ea-administration.md#to-view-enrollment-properties).
> - When you transfer subscriptions, cost and usage data for your Azure products aren't accessible after the transfer. We recommend that you [download your cost and usage data](../understand/download-azure-daily-usage.md) and invoices before you transfer subscriptions.
> - When there's is a currency change during or after an EA enrollment transfer, reservations paid for monthly are canceled for the source enrollment. Cancellation happens at the time of the next monthly payment for an individual reservation. The cancellation is intentional and only affects monthly, not up front, reservation purchases. For more information, see [Transfer Azure Enterprise enrollment accounts and subscriptions](ea-transfers.md#prerequisites-1).

Before you begin, make sure that the people involved in the product transfer have the required permissions.

> [!NOTE]
> To perform a transfer, the destination account must be a paid account with a valid form of payment. For example, if the destination is an Azure free account, you can upgrade it to a pay-as-you-go Azure plan under a Microsoft Customer Agreement. Then you can make the transfer.

You can also go along with the following video that outlines each step of the process for subscription transfer. However, it doesn't cover reservation or savings plan transfers.

>[!VIDEO https://www.youtube.com/embed/gfiUI2YLsgc]

### Required permission for the transfer requestor

The product transfer requestor must have one of the following permissions:

For a Microsoft Customer Agreement, the person must have an owner or contributor role for the billing account or for the relevant billing profile or invoice section. For more information, see [Billing roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).

### Required permission for the transfer recipient 

The subscription, reservation, or savings plan product owner (transfer request recipient) must have one of the following permissions:

- For a Microsoft Customer Agreement, the person must have an owner or contributor role for the billing account or for the relevant billing profile or invoice section. For more information, see [Billing roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).
- For an Enterprise Agreement subscription, the person must be an account owner or EA administrator.
- For an Enterprise Agreement savings plan or reservation, the person must be an EA administrator
- For a Microsoft Online Subscription Agreement, the person must be an Account Administrator.

## Create the product transfer request

The person creating the transfer request uses the following procedure to create the transfer request. The transfer request essentially asks the owner of the product to allow subscriptions and or reservations associated with a subscription to be transferred.

When the request is created, an email is sent to the target recipient.

The following procedure has you navigate to **Transfer requests** by selecting a **Billing scope** > **Billing account** > **Billing profile** > **Invoice sections** to **Add a new request**. If you navigate to **Add a new request** from selecting a billing profile, select a billing profile, and then select an invoice section.

1. Sign in to the [Azure portal](https://portal.azure.com) as an invoice section owner or contributor for a billing account for Microsoft Customer Agreement. Use the same credentials that you used to accept your Microsoft Customer Agreement.
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/mca-request-billing-ownership/billing-search-cost-management-billing.png" alt-text="Screenshot that shows Azure portal search for Cost Management + Billing." lightbox="./media/mca-request-billing-ownership/billing-search-cost-management-billing.png" :::
1. On the billing scopes page, select **Billing scopes** and then select the billing account, which would be used to pay for Azure usage in your products. Select the billing account labeled **Microsoft Customer Agreement**.  
    :::image type="content" source="./media/mca-request-billing-ownership/billing-scopes.png" alt-text="Screenshot that shows search in portal for Cost Management + Billing." lightbox="./media/mca-request-billing-ownership/billing-scopes.png" :::  
        The Azure portal remembers the last billing scope that you access and displays the scope the next time you come to Cost Management + Billing page. You don't see the billing scopes page if you visited Cost Management + Billing earlier. If so, check that you are in the [right scope](#check-for-access). If not, [switch the scope](view-all-accounts.md#switch-billing-scope-in-the-azure-portal) to select the billing account for a Microsoft Customer Agreement.
1. Select **Billing profiles** from the left-hand side and then select a **Billing profile** from the list. Once you take over the ownership of the products, their usage is billed to this billing profile.  
    :::image type="content" source="./media/mca-request-billing-ownership/billing-profile.png" alt-text="Screenshot that shows selecting billing profiles." lightbox="./media/mca-request-billing-ownership/billing-profile.png" :::  
    *If you don't see Billing profiles, you aren't in the right billing scope.* You need to select a billing account for a Microsoft Customer Agreement and then select Billing profiles. To learn how to change scopes, see [Switch billing scopes in the Azure portal](view-all-accounts.md#switch-billing-scope-in-the-azure-portal).
1. Select **Invoice sections** from the left-hand side and then select an invoice section from the list. Each billing profile contains on invoice section by default. Select the invoice where you want to move your Azure product billing - that's where the Azure product consumption is transferred to.  
    :::image type="content" source="./media/mca-request-billing-ownership/invoice-section.png" alt-text="Screenshot that shows selecting invoice sections." lightbox="./media/mca-request-billing-ownership/invoice-section.png" :::  
1. Select **Transfer requests** from the lower-left side and then select **Add a new request**. Enter the email address of the user you're requesting billing ownership from. The user must have an account administrator role for the old products.  
    :::image type="content" source="./media/mca-request-billing-ownership/transfer-request-add-email.png" alt-text="Screenshot that shows selecting transfer requests." lightbox="./media/mca-request-billing-ownership/transfer-request-add-email.png" :::
1. Select **Send transfer request**.

## Review and approve transfer request

The recipient of the transfer request uses the following procedure to review and approve the transfer request. They can choose to:

- Transfer one or more subscriptions only
- Transfer one or more reservations only
- Transfer one or more savings plans only
- Transfer a combination of products

1. The user gets an email with instructions to review your transfer request. Select **Review the request** to open it in the Azure portal.  
    :::image type="content" source="./media/mca-request-billing-ownership/mca-review-transfer-request-email.png" alt-text="Screenshot that shows review transfer request email." lightbox="./media/mca-request-billing-ownership/mca-review-transfer-request-email.png" :::  
    If the transfer recipient’s user account doesn’t have email enabled, the person that created the request can manually give the target recipient a link to accept the transfer request after the request is created. The person that created the request can navigate to Transfer status page, copy it, and then manually give it to the recipient.  
        :::image type="content" source="./media/mca-request-billing-ownership/transfer-status-pending-link.png" alt-text="Screenshot showing the Transfer status where you can copy the transfer link sent to the recipient." lightbox="./media/mca-request-billing-ownership/transfer-status-pending-link.png" :::
1. In the Azure portal, the user selects the billing account that they want to transfer Azure products from. Then they select eligible subscriptions on the **Subscriptions** tab. If the owner doesn’t want to transfer subscriptions and instead wants to transfer reservations only, make sure that no subscriptions are selected.
    :::image type="content" source="./media/mca-request-billing-ownership/review-transfer-request-subscriptions-select.png" alt-text="Screenshot showing the Subscriptions tab." lightbox="./media/mca-request-billing-ownership/review-transfer-request-subscriptions-select.png" :::  
    *Disabled subscriptions can't be transferred.*
1. If there are reservations available to transfer, select the **Reservations** tab, and then select them. If you don't want to transfer reservations, make sure that no reservations are selected.  
If reservations are transferred, they're applied to the scope that’s set in the request. If you want to change the scope of the reservation after it’s transferred, see [Change the reservation scope](../reservations/manage-reserved-vm-instance.md#change-the-reservation-scope).
    :::image type="content" source="./media/mca-request-billing-ownership/review-transfer-request-reservations-select.png" alt-text="Screenshot showing the Reservations tab." lightbox="./media/mca-request-billing-ownership/review-transfer-request-reservations-select.png" :::
1. If there are savings plans available to transfer, select the **Saving plan** tab, and then select them. If you don't want to transfer savings plans, make sure that no savings plans are selected.  
If savings plans are transferred, they're applied to the scope that’s set in the request. If you want to change the scope of the savings plan after it’s transferred, see [Change the savings plan scope](../savings-plan/manage-savings-plan.md#change-the-savings-plan-scope).
    :::image type="content" source="./media/mca-request-billing-ownership/review-transfer-request-savings-plan-select.png" alt-text="Screenshot showing the Savings plan tab." lightbox="./media/mca-request-billing-ownership/review-transfer-request-savings-plan-select.png" :::

1. Select the **Review request** tab and verify the information about the products to transfer. If there are Warnings or Failed status messages, see the following information. When you're ready to continue, select **Transfer**.   
    :::image type="content" source="./media/mca-request-billing-ownership/review-transfer-request-complete.png" alt-text="Screenshot showing the Review request tab where you review your transfer selections." lightbox="./media/mca-request-billing-ownership/review-transfer-request-complete.png" :::
1. The `Transfer is in progress` message is briefly shown. When the transfer is completed successfully, you see the Transfer details page with the `Transfer completed successfully` message.  
    :::image type="content" source="./media/mca-request-billing-ownership/transfer-completed-successfully.png" alt-text="Screenshot showing the Transfer completed successfully page." lightbox="./media/mca-request-billing-ownership/transfer-completed-successfully.png" :::

On the Review request tab, the following status messages might be displayed.

* **Ready to transfer** - Validation for this Azure product has passed and can be transferred.
* **Warnings** - There's a warning for the selected Azure product. While the product can still be transferred, doing so has some consequence that the user should be aware of in case they want to take mitigating actions. For example, the Azure subscription being transferred is benefitting from a reservation. After transfer, the subscription will no longer receive that benefit. To maximize savings, ensure that the reservation is associated to another subscription that can use its benefits. Instead, the user can also choose to go back to the selection page and unselect this Azure subscription. Select **Check details** for more information.
* **Failed** - The selected Azure product can't be transferred because of an error. The user needs to go back to the selection page and unselect this product to transfer the other selected Azure products.  

## Check the transfer request status

As the user that requested the transfer:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing**.
1. In the billing scopes page, select the billing account where the transfer request was started and then in the left menu, select **Transfer requests**.
1. Select the billing profile and invoice section where the transfer request was started and review the status.  
    :::image type="content" source="./media/mca-request-billing-ownership/transfer-requests-status-completed.png" alt-text="Screenshot that shows the list of transfers with their status." lightbox="./media/mca-request-billing-ownership/transfer-requests-status-completed.png" :::

The Transfer requests page displays the following information:

|Column|Definition|
|---------|---------|
|Request date|The date when the transfer request was sent|
|Recipient|The email address of the user that you sent the request to transfer billing ownership|
|Expiration date|The date when the request expires|
|Status|The status of transfer request|

The transfer request can have one of the following states:

|Status|Definition|
|---------|---------|
|In progress|The user hasn't accepted the transfer request.|
|Processing|The user approved the transfer request. Billing for the products that the user selected is getting transferred to your invoice section.|
|Completed| The billing for products that the user selected is transferred to your invoice section.|
|Finished with errors|The request completed but billing for some products that the user selected couldn't be transferred.|
|Expired|The user didn't accept the request on time and it expired.|
|Canceled|Someone with access to the transfer request canceled the request.|
|Declined|The user declined the transfer request.|

As the user that approved the transfer:

1. Select a transfer request to view details. The transfer details page displays the following information:  
  :::image type="content" source="./media/mca-request-billing-ownership/transfer-status-success-approver-view.png" alt-text="Screenshot that shows the Transfer status page with example status." lightbox="./media/mca-request-billing-ownership/transfer-status-success-approver-view.png" :::

|Column  |Definition|
|---------|---------|
|Transfer ID|The unique ID for your transfer request. If you submit a support request, share the ID with Azure support to speed up your support request. |
|Transfer requested date|The date when the transfer request was sent. |
|Transfer requested by|The email address of the user who sent the transfer request. |
|Transfer request expires date| Only appears while the transfer status is `Pending`. The date when the transfer request expires. |
|Transfer link sent to recipient| Only appears while the transfer status is `Pending`. The URL that was sent to the user to review the transfer request. |
|Transfer completed date|Only appears when the transfer status is `Completed`. The date and time that the transfer was completed. |

## Supported subscription types

You can request billing ownership of products for the following subscription types.

- [Action pack](https://azure.microsoft.com/offers/ms-azr-0025p/)¹
- [Azure Pass Sponsorship](https://azure.microsoft.com/offers/azure-pass/)¹
- [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)
- [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/)
- [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)
- [Microsoft Azure Plan](https://azure.microsoft.com/offers/ms-azr-0017g/)²
- [Microsoft Azure Sponsored Offer](https://azure.microsoft.com/offers/ms-azr-0036p/)¹
- [Microsoft Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/)
    - Subscription, reservation, and savings plan transfers are supported for direct EA customers. A direct enterprise agreement is one that's signed between Microsoft and an enterprise agreement customer.
    - Only subscription transfers are supported for indirect EA customers. Reservation and savings plan transfers aren't supported. An indirect EA agreement is one where a customer signs an agreement with a Microsoft partner.
- [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/)
- [Microsoft Cloud Partner Program](https://azure.microsoft.com/offers/ms-azr-0025p/)¹
- [MSDN Platforms](https://azure.microsoft.com/offers/ms-azr-0062p/)¹
- [Visual Studio Enterprise (Cloud Partner Program) subscribers](https://azure.microsoft.com/offers/ms-azr-0029p/)¹
- [Visual Studio Enterprise subscribers](https://azure.microsoft.com/offers/ms-azr-0063p/)¹
- [Visual Studio Professional](https://azure.microsoft.com/offers/ms-azr-0059p/)¹
- [Visual Studio Test Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0060p/)¹

¹ Any credit available on the subscription won't be available in the new account after the transfer.

² Only supported for products in accounts that are created during sign-up on the Azure website.

## Check for access
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- The billing ownership of the Azure products is transferred to your invoice section. Keep track of the charges for these subscriptions in the [Azure portal](https://portal.azure.com).
- Give others permissions to view and manage billing for transferred products. For more information, see [Invoice section roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).
