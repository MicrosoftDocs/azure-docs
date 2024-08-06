---
title: Pay your Microsoft Customer Agreement or Microsoft Online Subscription Program bill
description: Learn how to pay your bill in the Azure portal. You must be a billing profile owner, contributor, or invoice manager to pay in the portal.
keywords: billing, past due, balance, pay now,
author: banders
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 08/06/2024
ms.author: banders
---

# Pay your Microsoft Customer Agreement or Microsoft Online Subscription Program bill

This article applies to:

- Customers who have a Microsoft Customer Agreement (MCA).
- Customers who signed up for Azure through the Azure website to create a Microsoft Online Subscription Program account. This type of account is also called a *pay-as-you-go* account.

If you're unsure of your billing account type, see [Check the type of your account](#check-the-type-of-your-account) later in this article.

There are two ways to pay your bill for Azure. You can pay with the default payment method of your billing profile, or you can make a one-time payment with the **Pay now** option.

If you signed up for Azure through a Microsoft representative, your default payment method is always set to wire transfer. Automatic credit card payment isn't an option if you signed up for Azure through a Microsoft representative. Instead, you can [pay with a credit card for individual invoices](#pay-now-in-the-azure-portal).

If you have a Microsoft Online Subscription Program account, your default payment method is credit card. Normally, payments are automatically deducted from your credit card. But you can also make one-time payments manually by credit card.

If you have Azure credits, they automatically apply to your invoice each billing period.

> [!NOTE]
> Regardless of the payment method that you select to complete your payment, you must specify the invoice number in the payment details.

Here's a table that summarizes payment methods for agreement types:

|Agreement type| Credit card | Wire transfer<sup>1</sup> |
| --- | ---- | --- |
| Microsoft Customer Agreement<br>purchased through a Microsoft representative | ✔ (with a $50,000 USD limit) | ✔ |
| Enterprise Agreement | ✘ | ✔ |
| Microsoft Online Subscription Program | ✔ | ✔ (if you're approved to pay by invoice) |

<sup>1</sup> An ACH credit transaction can be made automatically, if your bank supports it.

## Reserve Bank of India

As of October 2021, automatic payments in India might block some credit card transactions, especially transactions that exceed 5,000 INR. Because of this situation, you might need to make payments manually in the Azure portal. This directive doesn't affect the total amount you're charged for your Azure usage.

As of June 2022, the Reserve Bank of India increased the limit of e-mandates on cards for recurring payments from 5,000 to 15,000 INR. Learn more about this directive on the [Reserve Bank of India website](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11668&Mode=0).

As of September 2022, Microsoft and other online merchants no longer store credit card information. To comply with this regulation, Microsoft removed all stored card details from Azure. To avoid service interruption, you need to add and verify your payment method to make a payment in the Azure portal for all invoices. Learn more about this directive on the [Reserve Bank of India website](https://rbidocs.rbi.org.in/rdocs/notification/PDFs/DPSSC09B09841EF3746A0A7DC4783AC90C8F3.PDF).

### UPI and NetBanking payment options

Azure supports two alternate payment options for customers in India:

- Unified Payments Interface (UPI) is a real-time payment method.
- NetBanking gives customers access to banking services through an online platform.

#### How do I make a payment with UPI or NetBanking?

UPI and NetBanking are supported only for one-time transactions.

To make a payment with UPI or NetBanking:

1. Select **Add a new payment method** when you're making a payment.
2. Select **UPI** or **NetBanking**.
3. You're redirected to a payment partner, like BillDesk, where you can choose your payment method.
4. You're redirected to your bank's website, where you can process the payment.
5. Wait until the payment finishes in your UPI or NetBanking app, and then return to the Azure portal and select **Complete**. Don't close your browser until the payment is complete.

After you submit the payment, allow time for the payment to appear in the Azure portal.

#### How am I refunded if I made a payment with UPI or NetBanking?

Refunds are treated as a regular charge. They go to your bank account.

## Partial payments

Partial payment is available for Azure global pay-as-you-go customers in China and in Egypt. If you accrue usage higher than your credit card limit, you can use the following self-serve process to split the invoice amount across multiple credit cards.

A minimum payment has a minimum value that you can pay, which varies by country/region.

> [!NOTE]
> To avoid service interruption, pay the full invoice amount by the due date on the invoice.

To make a partial payment:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for and select **Cost Management + Billing**.
3. On the left menu, under **Billing**, select **Invoices**.
4. If any of your eligible invoices are due or past due, a blue **Pay now** link for the invoice is available. Select the link.
5. In the **Pay now** window, select **Select a payment method** to choose an existing credit card or add a new one.
6. Select **Pay now**.
7. If the payment fails, the partial payment feature appears in the **Pay now** experience. There's a minimum partial payment amount. You must enter an amount greater than the minimum.
8. Select the **Select a payment method** option to choose an existing credit card or add a new one. It's the card that the first partial payment is applied to.
9. Select **Pay now**.
10. Repeat steps 8 to 9 until you fully pay the invoice amount.

## Credit or debit card

If the default payment method for your billing profile is a credit or debit card, it's automatically charged each billing period.

If your automatic credit or debit card charge is declined for any reason, you can make a one-time payment with a credit or debit card in the Azure portal by using **Pay now**.

If you have a Microsoft Online Subscription Program (pay-as-you-go) account and you have a bill due, the **Pay now** banner appears on your subscription property page.

If you want to learn how to change your default payment method to wire transfer, see the [article about how to pay by invoice](../manage/pay-by-invoice.md).

Although you can generally use debit cards to pay your Azure bill, consider these limitations:

- Hong Kong Special Administrative Region and Brazil don't allow the use of debit cards. They support only credit cards.
- India supports debit and credit cards through Visa and Mastercard.
- You can't use virtual and prepaid debit cards to pay your Azure bill.

## Wire transfer

If the default payment method of your billing profile is wire transfer, follow the payment instructions on your invoice PDF file.

Alternatively, if your invoice is under the threshold amount for your currency, you can make a one-time payment in the Azure portal with a credit or debit card by using **Pay now**. If your invoice amount exceeds the threshold, you can't pay your invoice with a credit or debit card. You'll find the threshold amount for your currency in the Azure portal after you select **Pay now**.

> [!NOTE]
> When multiple invoices are remitted in a single wire transfer, you must specify the invoice numbers for all of the invoices.

### Bank details for sending wire transfer payments
<a name="wire-bank-details"></a>

If your default payment method is wire transfer, check your invoice for payment instructions. Find payment instructions for your country/region in the following list:

> [!div class="op_single_selector"]
> - **Choose your country or region**
> - [Afghanistan](/legal/pay/afghanistan)
> - [Albania](/legal/pay/albania)
> - [Algeria](/legal/pay/algeria)
> - [Angola](/legal/pay/angola)
> - [Argentina](/legal/pay/argentina)
> - [Armenia](/legal/pay/armenia)
> - [Australia](/legal/pay/australia)
> - [Austria](/legal/pay/austria)
> - [Azerbaijan](/legal/pay/azerbaijan)
> - [Bahamas](/legal/pay/bahamas)
> - [Bahrain](/legal/pay/bahrain)
> - [Bangladesh](/legal/pay/bangladesh)
> - [Barbados](/legal/pay/barbados)
> - [Belarus](/legal/pay/belarus)
> - [Belgium](/legal/pay/belgium)
> - [Belize](/legal/pay/belize)
> - [Bermuda](/legal/pay/bermuda)
> - [Bolivia](/legal/pay/bolivia)
> - [Bosnia and Herzegovina](/legal/pay/bosnia-and-herzegovina)
> - [Botswana](/legal/pay/botswana)
> - [Brazil](/legal/pay/brazil)
> - [Brunei](/legal/pay/brunei)
> - [Bulgaria](/legal/pay/bulgaria)
> - [Cameroon](/legal/pay/cameroon)
> - [Canada](/legal/pay/canada)
> - [Cabo Verde](/legal/pay/cape-verde)
> - [Cayman Islands](/legal/pay/cayman-islands)
> - [Chile](/legal/pay/chile)
> - [China (PRC)](/legal/pay/china-prc)
> - [Colombia](/legal/pay/colombia)
> - [Costa Rica](/legal/pay/costa-rica)
> - [Côte d'Ivoire](/legal/pay/cote-divoire)
> - [Croatia](/legal/pay/croatia)
> - [Curacao](/legal/pay/curacao)
> - [Cyprus](/legal/pay/cyprus)
> - [Czech Republic](/legal/pay/czech-republic)
> - [Democratic Republic of Congo](/legal/pay/democratic-republic-of-congo)
> - [Denmark](/legal/pay/denmark)
> - [Dominican Republic](/legal/pay/dominican-republic)
> - [Ecuador](/legal/pay/ecuador)
> - [Egypt](/legal/pay/egypt)
> - [El Salvador](/legal/pay/el-salvador)
> - [Estonia](/legal/pay/estonia)
> - [Ethiopia](/legal/pay/ethiopia)
> - [Faroe Islands](/legal/pay/faroe-islands)
> - [Fiji](/legal/pay/fiji)
> - [Finland](/legal/pay/finland)
> - [France](/legal/pay/france)
> - [French Guiana](/legal/pay/french-guiana)
> - [Georgia](/legal/pay/georgia)
> - [Germany](/legal/pay/germany)
> - [Ghana](/legal/pay/ghana)
> - [Greece](/legal/pay/greece)
> - [Grenada](/legal/pay/grenada)
> - [Guadeloupe](/legal/pay/guadeloupe)
> - [Guam](/legal/pay/guam)
> - [Guatemala](/legal/pay/guatemala)
> - [Guyana](/legal/pay/guyana)
> - [Haiti](/legal/pay/haiti)
> - [Honduras](/legal/pay/honduras)
> - [Hong Kong SAR](/legal/pay/hong-kong)
> - [Hungary](/legal/pay/hungary)
> - [Iceland](/legal/pay/iceland)
> - [India](/legal/pay/india)
> - [Indonesia](/legal/pay/indonesia)
> - [Iraq](/legal/pay/iraq)
> - [Ireland](/legal/pay/ireland)
> - [Israel](/legal/pay/israel)
> - [Italy](/legal/pay/italy)
> - [Jamaica](/legal/pay/jamaica)
> - [Japan](/legal/pay/japan)
> - [Jordan](/legal/pay/jordan)
> - [Kazakhstan](/legal/pay/kazakhstan)
> - [Kenya](/legal/pay/kenya)
> - [Korea](/legal/pay/korea)
> - [Kuwait](/legal/pay/kuwait)
> - [Kyrgyzstan](/legal/pay/kyrgyzstan)
> - [Latvia](/legal/pay/latvia)
> - [Lebanon](/legal/pay/lebanon)
> - [Libya](/legal/pay/libya)
> - [Liechtenstein](/legal/pay/liechtenstein)
> - [Lithuania](/legal/pay/lithuania)
> - [Luxembourg](/legal/pay/luxembourg)
> - [Macao Special Administrative Region](/legal/pay/macao)
> - [Malaysia](/legal/pay/malaysia)
> - [Malta](/legal/pay/malta)
> - [Mauritius](/legal/pay/mauritius)
> - [Mexico](/legal/pay/mexico)
> - [Moldova](/legal/pay/moldova)
> - [Monaco](/legal/pay/monaco)
> - [Mongolia](/legal/pay/mongolia)
> - [Montenegro](/legal/pay/montenegro)
> - [Morocco](/legal/pay/morocco)
> - [Namibia](/legal/pay/namibia)
> - [Nepal](/legal/pay/nepal)
> - [Netherlands](/legal/pay/netherlands)
> - [New Zealand](/legal/pay/new-zealand)
> - [Nicaragua](/legal/pay/nicaragua)
> - [Nigeria](/legal/pay/nigeria)
> - [North Macedonia, Republic of](/legal/pay/macedonia)
> - [Norway](/legal/pay/norway)
> - [Oman](/legal/pay/oman)
> - [Pakistan](/legal/pay/pakistan)
> - [Palestinian Authority](/legal/pay/palestinian-authority)
> - [Panama](/legal/pay/panama)
> - [Paraguay](/legal/pay/paraguay)
> - [Peru](/legal/pay/peru)
> - [Philippines](/legal/pay/philippines)
> - [Poland](/legal/pay/poland)
> - [Portugal](/legal/pay/portugal)
> - [Puerto Rico](/legal/pay/puerto-rico)
> - [Qatar](/legal/pay/qatar)
> - [Romania](/legal/pay/romania)
> - [Russia](/legal/pay/russia)
> - [Rwanda](/legal/pay/rwanda)
> - [Saint Kitts and Nevis](/legal/pay/saint-kitts-and-nevis)
> - [Saint Lucia](/legal/pay/saint-lucia)
> - [Saint Vincent and the Grenadines](/legal/pay/saint-vincent-and-the-grenadines)
> - [Saudi Arabia](/legal/pay/saudi-arabia)
> - [Senegal](/legal/pay/senegal)
> - [Serbia](/legal/pay/serbia)
> - [Singapore](/legal/pay/singapore)
> - [Slovakia](/legal/pay/slovakia)
> - [Slovenia](/legal/pay/slovenia)
> - [South Africa](/legal/pay/south-africa)
> - [Spain](/legal/pay/spain)
> - [Sri Lanka](/legal/pay/sri-lanka)
> - [Suriname](/legal/pay/suriname)
> - [Sweden](/legal/pay/sweden)
> - [Switzerland](/legal/pay/switzerland)
> - [Taiwan](/legal/pay/taiwan)
> - [Tajikistan](/legal/pay/tajikistan)
> - [Tanzania](/legal/pay/tanzania)
> - [Thailand](/legal/pay/thailand)
> - [Trinidad and Tobago](/legal/pay/trinidad-and-tobago)
> - [Turkmenistan](/legal/pay/turkmenistan)
> - [Tunisia](/legal/pay/tunisia)
> - [Türkiye](/legal/pay/turkey)
> - [Uganda](/legal/pay/uganda)
> - [Ukraine](/legal/pay/ukraine)
> - [United Arab Emirates](/legal/pay/united-arab-emirates)
> - [United Kingdom](/legal/pay/united-kingdom)
> - [United States](/legal/pay/united-states)
> - [Uruguay](/legal/pay/uruguay)
> - [Uzbekistan](/legal/pay/uzbekistan)
> - [Venezuela](/legal/pay/venezuela)
> - [Vietnam](/legal/pay/vietnam)
> - [Virgin Islands, US](/legal/pay/virgin-islands)
> - [Yemen](/legal/pay/yemen)
> - [Zambia](/legal/pay/zambia)
> - [Zimbabwe](/legal/pay/zimbabwe)

## Pay now in the Azure portal

To pay invoices in the Azure portal, you must have the correct [MCA permissions](../manage/understand-mca-roles.md) or be the account administrator. The account administrator is the user who originally signed up for the MCA account.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Cost Management + Billing**.
1. On the left menu, under **Billing**, select **Invoices**.
1. If any of your eligible invoices are due or past due, a blue **Pay now** link appears for the invoice. Select the link.
1. In the **Pay now** window, select **Select a payment method** to choose an existing credit card or add a new one.
1. Select **Pay now**.

The invoice status shows **paid** within 24 hours.

The **Pay now** option might be unavailable if:

- You have a Microsoft Online Subscription Program account (pay-as-you-go account). You might instead see a **Settle balance** banner. If so, see [Resolve a past-due balance](../manage/resolve-past-due-balance.md#resolve-a-past-due-balance-in-the-azure-portal).
- Your default payment method and invoice amount don't support the **Pay now** option. Check your invoice for payment instructions.

For a complete list of all the counties/regions where the **Pay now** option is available, see [Regional considerations](../manage/resolve-past-due-balance.md#regional-considerations).

## Check the type of your account

[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Related content

- To become eligible to pay by wire transfer, see the [article about how to pay by invoice](../manage/pay-by-invoice.md).
