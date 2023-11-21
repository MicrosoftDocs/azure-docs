---
title: Pay for Azure subscriptions by wire transfer
description: Learn how to pay for Azure subscriptions by wire transfer.
author: bandersmsft
ms.reviewer: lishepar
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 10/17/2023
ms.author: banders
ms.custom: contperf-fy21q2
---

# Pay for your Azure subscription by wire transfer

This article helps you set up your Azure subscription to pay by wire transfer.

This article applies to you if you are:

- A customer with a Microsoft Customer Agreement (MCA)
- A customer who signed up for Azure through the Azure website (for a Microsoft Online Services Program account, also called pay-as-you-go account).

If you signed up for Azure through a Microsoft representative, then your default payment method is already set to *wire transfer*, so these steps aren't needed.

[!INCLUDE [Pay by check](../../../includes/cost-management-pay-check.md)]

When you switch to pay by wire transfer, you must pay your bill within 30 days of the invoice date by wire transfer.

Users with a Microsoft Customer Agreement must always [submit a request to set up pay by wire transfer](#submit-a-request-to-set-up-pay-by-wire-transfer) to Azure support to enable pay by wire transfer.

Customers who have a Microsoft Online Services Program (pay-as-you-go) account can use the Azure portal to [request to pay by wire transfer](#request-to-pay-by-wire-transfer).

> [!IMPORTANT]
> * Pay by wire transfer is only available for customers using Azure on behalf of a company.
> * Pay all outstanding charges before switching to pay by wire transfer.
> * An outstanding invoice is paid by your default payment method. In order to have it paid by wire transfer, you must change your default payment method to wire transfer after you've been approved.
> * Currently, payment by wire transfer isn't supported for Global Azure in China.
> * For Microsoft Online Services Program accounts, if you switch to pay by wire transfer, you can't switch back to paying by credit or debit card.
> * Currently, only customers in the United States can get automatically approved to change their payment method to wire transfer. Support for other regions is being evaluated. 

## Request to pay by wire transfer

> [!NOTE]
> Currently only customers in the United States can get automatically approved to change their payment method to wire transfer. Support for other regions is being evaluated. If you are not in the United States, you must [submit a request to set up pay by wire transfer](#submit-a-request-to-set-up-pay-by-wire-transfer) to change your payment method.

1. Sign in to the Azure portal.
1. Navigate to **Subscriptions** and then select the one that you want to set up wire transfer for.
1. In the left menu, select **Payment methods**.
1. On the Payment methods page, select **Pay by wire transfer**.
1. On the **Pay by wire transfer** page, you see a message stating that you can request to use wire transfer instead of automatic payment using a credit or debit card. Select **Continue** to start the check.
1. Depending on your approval status:
    - If you're automatically approved, the page shows a message stating that you've been approved to pay by wire transfer. Enter your **Company name** and then select **Save**.  
    - If the request couldn't be processed or if you're not approved, you need to follow the steps in the next section [Submit a request to set up pay by wire transfer](#submit-a-request-to-set-up-pay-by-wire-transfer).
1. If you've been approved, on the Payment methods page under **Other payment methods**, to the right of **Wire transfer**, select the ellipsis (**...**) symbol and then select **Make default**.  
    You're all set to pay by wire transfer.

## Submit a request to set up pay by wire transfer

Users in all regions can submit a request to pay by wire transfer through support. Currently, only customers in the United States can get automatically approved to change their payment method to wire transfer.

If you're not automatically approved, you can submit a request to Azure support to approve payment by wire transfer. If your request is approved, you can switch to pay by wire transfer in the Azure portal.

1. Sign in to the Azure portal to submit a support request. Search for and select **Help + support**.  
    :::image type="content" source="./media/pay-by-invoice/search-for-help-and-support.png" alt-text="Screenshot of searching for Help and support." lightbox="./media/pay-by-invoice/search-for-help-and-support.png" :::
1. Select **New support request**.  
    :::image type="content" source="./media/pay-by-invoice/help-and-support.png" alt-text="Screenshot of the New support request link." lightbox="./media/pay-by-invoice/help-and-support.png" :::
1. Select **Billing** as the **Issue type**. The *issue type* is the support request category. Select the subscription for which you want to pay by wire transfer, select a support plan, and then select **Next**.
1. Select **Payment** as the **Problem Type**. The *problem type* is the support request subcategory.
1. Select **Switch to Pay by Invoice** as the **Problem subtype**.
1. Enter the following information in the **Details** box, and then select **Next**.
    - New or existing customer:
    - If existing, current payment method:
    - Order ID (requesting for invoice option):
    - Account Admins Live ID (or Org ID) (should be company domain):
    - Commerce Account ID¹:
    - Company Name (as registered under VAT or Government Website):
    - Company Address (as registered under VAT or Government Website):
    - Company Website:
    - Country/region:
    - TAX ID/ VAT ID:
    - Company Established on (Year):
    - Any prior business with Microsoft:
    - Contact Name:
    - Contact Phone:
    - Contact Email:
    - Justification about why you want the wire transfer payment option instead of a credit card:
    - File upload: Attach legal documentation showing the legal company name and company address. Your information in the Azure portal should match the legal information registered in the legal document. You can provide one of the following examples:
        - A certificate of incorporation signed by the company’s legal representatives.
        - Any government-issued documents having the company name and address. For example, a tax certification.
        - Company registration form signed and issued by the government.
    - For cores increase, provide the following additional information:
        - (Old quota) Existing Cores:
        - (New quota) Requested cores:
        - Specific region & series of Subscription:
    - The **Company name** and **Company address** should match the information that you provided for the Azure account. To view or update the information, see [Change your Azure account profile information](change-azure-account-profile.md).
    - Add your billing contact information in the Azure portal before the credit limit can be approved. The contact details should be related to the company's Accounts Payable or Finance department.
1. Verify your contact information and preferred contact method, and then select **Create**.

¹ If you don't know your Commerce Account ID, it's the GUID ID shown on the Properties page for your billing account. To view it in the Azure portal:

  1. Go to the Azure home page. Search for **Cost Management** and select it (not Cost Management + Billing). It's a green hexagon-shaped symbol. 
  1. You should see the overview page. If you don't see Properties in the left menu, at the top of the page under Scope, select **Go to billing account**. 
  1. In the left menu, select **Properties**. On the properties page, you should see your billing account ID shown as a GUID ID value. It's your Commerce Account ID.

If we need to run a credit check because of the amount of credit that you need, you're sent a credit check application. We might ask you to provide your company’s audited financial statements. If no financial information is provided or if the information isn't strong enough to support the amount of credit limit required, we might ask for a security deposit or a standby letter of credit to approve your credit check request.

## Switch to pay by wire transfer after approval

If you have a Microsoft Online Services Program (pay-as-you-go) account and you've been approved to pay by wire transfer, you can switch your payment method in the Azure portal.

With a Microsoft Customer Agreement, you can switch your billing profile to wire transfer.

### Switch Azure subscription to wire transfer

Use the following steps to switch your Azure subscription to pay by wire transfer. *Once you switch to payment by wire transfer, you can't switch back to a credit card*.

1. Go to the Azure portal to sign in as the Account Administrator. Search for and select **Cost Management + Billing**.  
    :::image type="content" source="./media/pay-by-invoice/search.png" alt-text="Screenshot showing search for Cost Management + Billing in the Azure portal." lightbox="./media/pay-by-invoice/search.png" :::
1. Select the subscription you'd like to switch to pay by wire transfer.
1. Select **Payment methods**.
On the Payment methods page, select **Pay by wire transfer**.  
<!--    :::image type="content" source="./media/pay-by-invoice/payment-methods.png" alt-text="Screenshot showing the Pay by wire transfer option." lightbox="./media/pay-by-invoice/payment-methods.png" :::-->

### Switch billing profile to wire transfer

Use the following steps to switch a billing profile to wire transfer. Only the person who signed up for Azure can change the default payment method of a billing profile.

1. Go to the Azure portal view your billing information. Search for and select **Cost Management + Billing**.
1. In the menu, choose **Billing profiles**.  
    :::image type="content" source="./media/pay-by-invoice/billing-profile.png" alt-text="Screenshot showing Billing profiles menu item." lightbox="./media/pay-by-invoice/billing-profile.png" :::
1. Select a billing profile.
1. In the **Billing profile** menu, select **Payment methods**.  
   :::image type="content" source="./media/pay-by-invoice/billing-profile-payment-methods.png" alt-text="Screenshot showing Payment methods menu item." lightbox="./media/pay-by-invoice/billing-profile-payment-methods.png" :::
1. Under the *Other payment methods* heading, select the ellipsis (...) symbol, and then select **Make default**.  
<!--    :::image type="content" source="./media/pay-by-invoice/customer-led-switch-to-invoice.png" alt-text="Screenshot showing wire transfer ellipsis and Made default option." lightbox="./media/pay-by-invoice/customer-led-switch-to-invoice.png" :::-->

## Wire transfer payment processing time

Payments made by wire transfer have processing times that vary, depending on the type of transfer:

- ACH domestic transfers - Five business days. Two to three days to arrive, plus two days to post.
- Wire transfers (domestic) - Four business days. Two days to arrive, plus two days to post.
- Wire transfers (international) - Seven business days. Five days to arrive, plus two days to post.

When your account is approved for wire transfer payment, the instructions for payment can be found on the invoice.

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Frequently asked questions

*Why have I received a request for a legal document?*

Occasionally Microsoft needs legal documentation if the information you provided is incomplete or not verifiable. Examples might include:

* Name difference between Account name and Company name
* Change in name

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

* If needed, update your billing contact information at the [Azure portal](https://portal.azure.com).
