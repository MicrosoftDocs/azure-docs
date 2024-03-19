---
title: View and download your Azure invoice
description: Learn how to view and download your Azure invoice. You can download your invoice in the Azure portal or have it sent in an email.
keywords: billing invoice,invoice download,azure invoice,azure usage
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 02/14/2024
ms.author: banders
---

# View and download your Microsoft Azure invoice

You can download your invoice in the [Azure portal](https://portal.azure.com/) or have it sent in email. Invoices are sent to the person set to receive invoices for the enrollment.

If you're an Azure customer with an Enterprise Agreement (EA customer), only an EA administrator can download and view your organization's invoice. Direct EA administrators can [Download or view their Azure billing invoice](../manage/direct-ea-azure-usage-charges-invoices.md#download-or-view-your-azure-billing-invoice). Indirect EA administrators can use the information at [Azure Enterprise enrollment invoices](../manage/direct-ea-billing-invoice-documents.md) to download their invoice.

## Where invoices are generated

An invoice is generated based on your billing account type. Invoices are created for Microsoft Online Service Program (MOSP) also called pay-as-you-go, Microsoft Customer Agreement (MCA), and Microsoft Partner Agreement (MPA) billing accounts. Invoices are also generated for Enterprise Agreement (EA) billing accounts.

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](../manage/view-all-accounts.md).

### Invoice status

When you review your invoice status in the Azure portal, each invoice has one of the following status symbols.

|  Status symbol | Description  |
|---|---|
| :::image type="content" border="true" source="./media/download-azure-invoice/due.svg" alt-text="Screenshot showing the Due status symbol."::: | *Due* is displayed when an invoice is generated, but it hasn't been paid yet. |
| :::image type="content" border="true" source="./media/download-azure-invoice/past-due.svg" alt-text="Screenshot showing the Past due status symbol.":::  | *Past due* is displayed when Azure tried to charge your payment method, but the payment was declined. |
| :::image type="content" border="true" source="./media/download-azure-invoice/paid.svg" alt-text="Screenshot showing the Paid status symbol.":::  | *Paid* status is displayed when Azure has successfully charged your payment method. |

When an invoice is created, it appears in the Azure portal with *Due* status. Due status is normal and expected.  

When an invoice hasn't been paid, its status is shown as *Past due*. A past due subscription will get disabled if the invoice isn't paid.

## Invoices for MOSP billing accounts

An MOSP billing account is created when you sign up for Azure through the Azure website. For example, when you sign up for an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/), [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or as a [Visual studio subscriber](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/).

Customers in select regions, who sign up through the Azure website for an [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) can have a billing account for an MCA.

If you're unsure of your billing account type, see [Check your billing account type](../manage/view-all-accounts.md#check-the-type-of-your-account) before following the instructions in this article. 

An MOSP billing account can have the following invoices:

**Azure service charges** - An invoice is generated for each Azure subscription that contains Azure resources used by the subscription. The invoice contains charges for a billing period. The billing period is determined by the day of the month when the subscription is created.

For example, John creates *Azure sub 01* on 5 March and *Azure sub 02* on 10 March. The invoice for *Azure sub 01* will have charges from the fifth day of a month to the fourth day of next month. The invoice for *Azure sub 02* will have charges from the tenth day of a month to the ninth day of next month. The invoices for all Azure subscriptions are normally generated on the day of the month that the account was created but can be up to two days later. In this example, if John created his account on 2 February, the invoices for both *Azure sub 01* and *Azure sub 02* will normally be generated on the second day of each month but could be up to two days later.

**Azure Marketplace, reservations, and spot VMs** - An invoice is generated for reservations, marketplace products, and spot VMs purchased using a subscription. The invoice shows respective charges from the previous month. For example, John purchased a reservation on 1 March and another reservation on 30 March. A single invoice will be generated for both the reservations in April. The invoice for Azure Marketplace, reservations, and spot VMs are always generated around the ninth day of the month.

If you pay for Azure with a credit card and you buy reservation, Azure generates an immediate invoice. However, when billed by an invoice, you're charged for the reservation on your next monthly invoice.

**Azure support plan** - An invoice is generated each month for your support plan subscription. The first invoice is generated on the day of purchase or up to two days later. Later support plan invoices are normally generated on the same day of the month that the account was created but could be generated up to two days later.

## Download your MOSP Azure subscription invoice

An invoice is only generated for a subscription that belongs to a billing account for an MOSP. [Check your access to an MOSP account](../manage/view-all-accounts.md#check-the-type-of-your-account). 

You must have an *account admin* role for a subscription to download its invoice. Users with owner, contributor, or reader roles can download its invoice, if the account admin has given them permission. For more information, see [Allow users to download invoices](../manage/manage-billing-access.md#opt-in).

Azure Government customers can’t request their invoice by email. They can only download it.

1. Select your subscription from the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal.
1. Select **Invoices** from the billing section.  
    :::image type="content" border="true" source="./media/download-azure-invoice/select-subscription-invoice.png" alt-text="Screenshot that shows a user selecting invoices option for a subscription.":::
1. Select the invoice that you want to download and then select **Download invoices**.  
    :::image type="content" border="true" source="./media/download-azure-invoice/downloadinvoice-subscription.png" alt-text="Screenshot that the download option for an M O S P invoice.":::
1. You can also download a daily breakdown of consumed quantities and charges by selecting the download icon and then selecting **Prepare Azure usage file** button under the usage details section. It may take a few minutes to prepare the CSV file.  
    :::image type="content" border="true" source="./media/download-azure-invoice/usage-and-invoice-subscription.png" alt-text="Screenshot that shows the Download invoice and usage page.":::

For more information about your invoice, see [Understand your bill for Microsoft Azure](../understand/review-individual-bill.md). For help identify unusual costs, see [Analyze unexpected charges](analyze-unexpected-charges.md).

## Download your MOSP support plan invoice

A PDF invoice is only generated for a support plan subscription that belongs to an MOSP billing account. [Check your access to an MOSP account](../manage/view-all-accounts.md#check-the-type-of-your-account).

You must have an account admin role on the support plan subscription to download its invoice.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing**.  
    :::image type="content" border="true" source="./media/download-azure-invoice/search-cmb.png" alt-text="Screenshot that shows search in the Azure portal for Cost Management + Billing.":::
1. Select **Invoices** from the left-hand side.
1. Select your support plan subscription.  
    :::image type="content" border="true" source="./media/download-azure-invoice/cmb-invoices.png" lightbox="./media/download-azure-invoice/cmb-invoices-zoomed-in.png" alt-text="Screenshot that shows an MOSP support plan invoice billing profile list.":::
1. Select the invoice that you want to download and then select **Download invoices**.  
    :::image type="content" border="true" source="./media/download-azure-invoice/download-invoice-support-plan.png" alt-text="Screenshot that shows the download option for an M O S P support plan invoice.":::

## Allow others to download your subscription invoice

To download an invoice:

1.  Sign in to the [Azure portal](https://portal.azure.com) as an account admin for the subscription.

2.  Search for **Cost Management + Billing**.

    :::image type="content" border="true" source="./media/download-azure-invoice/search-cmb.png" alt-text="Screenshot that shows search in the Azure portal for Cost Management + Billing.":::

3.  Select **Invoices** from the left-hand side.

4.  Select your Azure subscription and then select **Allow others to download invoice**.

    :::image type="content" border="true" source="./media/download-azure-invoice/cmb-select-access-to-invoice.png" lightbox="./media/download-azure-invoice/cmb-select-access-to-invoice-zoomed-in.png" alt-text="Screenshot showing Allow others to download invoice.":::

5.  Select **On** and then **Save** at the top of the page.  
    :::image type="content" border="true" source="./media/download-azure-invoice/cmb-access-to-invoice.png" alt-text="Screenshot showing the Access to invoice On option.":::
    
> [!NOTE]
> Microsoft doesn’t recommend sharing any of your confidential or personally identifiable information with third parties. This recommendation applies to sharing your Azure bill or invoice with a third party for cost optimizations. For more information, see https://azure.microsoft.com/support/legal/ and https://www.microsoft.com/trust-center.

## Get MOSP subscription invoice in email

You must have an account admin role on a subscription or a support plan to opt in to receive its PDF invoice by email. When you opt-in, you can optionally add additional recipients that will also receive the invoice by email. The following steps apply to subscription and support plan invoices.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. Select a billing scope, if needed.
1. Select **Invoices** on the left side.
1. At the top of the page, select **Receive invoice by email**.  
    :::image type="content" source="./media/download-azure-invoice/select-receive-invoice-by-email.png" alt-text="Screenshot showing navigation to Receive invoice by email." lightbox="./media/download-azure-invoice/select-receive-invoice-by-email.png" :::
1. In the Receive invoice by email window, select the subscription where invoices are created.
1. In the **Status** area, select **Yes** for **Receive email invoices for Azure services**. You can optionally select **Yes** for **Email invoices for Azure marketplace and reservation purchases**.
1. In the **Preferred email** area, enter the email address where invoices will get sent.
1. Optionally, in the **Additional recipients** area, enter one or more email addresses.  
    :::image type="content" source="./media/download-azure-invoice/receive-invoice-by-email-page.png" alt-text="Screenshot showing the Receive invoice by email page." lightbox="./media/download-azure-invoice/receive-invoice-by-email-page.png" :::
1. Select **Save**.

## Invoices for MCA and MPA billing accounts

An MCA billing account is created when your organization works with a Microsoft representative to sign an MCA. Some customers in select regions, who sign up through the Azure website for an [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) may have a billing account for an MCA as well. For more information, see [Get started with your MCA billing account](../understand/mca-overview.md).

An MPA billing account is created for Cloud Solution Provider (CSP) partners to manage their customers in the new commerce experience. Partners need to have at least one customer with an [Azure plan](/partner-center/purchase-azure-plan) to manage their billing account in the Azure portal. For more information, see [Get started with your MPA billing account](../understand/mpa-overview.md).

A monthly invoice is generated at the beginning of the month for each billing profile in your account. The invoice contains respective charges for all Azure subscriptions and other purchases from the previous month. For example, John created *Azure sub 01* on 5 March, *Azure sub 02* on 10 March. He purchased *Azure support 01* subscription on 28 March using *Billing profile 01*. John will get a single invoice in the beginning of April that will contain charges for both Azure subscriptions and the support plan.

##  Download an MCA or MPA billing profile invoice

You must have an owner, contributor, reader, or an invoice manager role on a billing profile to download its invoice in the Azure portal. Users with an owner, contributor, or a reader role on a billing account can download invoices for all the billing profiles in the account.

1.  Sign in to the [Azure portal](https://portal.azure.com).

2.  Search for **Cost Management + Billing**.

    :::image type="content" border="true" source="./media/download-azure-invoice/search-cmb.png" alt-text="Screenshot showing search in the Azure portal for Cost Management + Billing.":::

3. Select **Invoices** from the left-hand side.

    :::image type="content" border="true" source="./media/download-azure-invoice/mca-billingprofile-invoices.png" lightbox="./media/download-azure-invoice/mca-billingprofile-invoices-zoomed-in.png" alt-text="Screenshot showing the invoices page for an M C A billing account.":::

4. In the invoices table, select the invoice that you want to download.

5. Select **Download invoice pdf** at the top of the page.

    :::image type="content" border="true" source="./media/download-azure-invoice/mca-billingprofile-download-invoice.png" lightbox="./media/download-azure-invoice/mca-billingprofile-download-invoice-zoomed-in.png" alt-text="Screenshot that shows downloading an invoice P D F.":::

6. You can also download your daily breakdown of consumed quantities and estimated charges by selecting **Download Azure usage**. It may take a few minutes to prepare the csv file.

## Get your billing profile's invoice in email

You must have an owner or a contributor role on the billing profile or its billing account to update its email invoice preference. Once you have opted-in, all users with an owner, contributor, readers, and invoice manager roles on a billing profile will get its invoice in email.

> [!NOTE]
> The *send by email* and *invoice email preference* invoice functionality isn’t supported for Microsoft Customer Agreements when you work with a Microsoft partner.

1.  Sign in to the [Azure portal](https://portal.azure.com).
1.  Search for **Cost Management + Billing**.  
1.  Select **Invoices** from the left-hand side and then select **Invoice email preference** from the top of the page.  
    :::image type="content" border="true" source="./media/download-azure-invoice/mca-billing-profile-select-email-invoice.png" lightbox="./media/download-azure-invoice/mca-billing-profile-select-email-invoice-zoomed.png" alt-text="Screenshot that shows the Email invoice option for invoices.":::
1.  If you have multiple billing profiles, select a billing profile and then select **Yes**.  
    :::image type="content" border="true" source="./media/download-azure-invoice/mca-billing-profile-email-invoice.png" lightbox="./media/download-azure-invoice/mca-billing-profile-select-email-invoice-zoomed.png" alt-text="Screenshot that shows the opt-in option.":::
1.  Select **Save**.

You give others access to view, download, and pay invoices by assigning them the invoice manager role for an MCA or MPA billing profile. If you've opted in to get your invoice in email, users also get the invoices in email.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing**.  
1. Select **Billing profiles** from the left-hand side. From the billing profiles list, select a billing profile for which you want to assign an invoice manager role.  
   :::image type="content" border="true" source="./media/download-azure-invoice/mca-select-profile-zoomed-in.png" alt-text="Screenshot that shows the billing profile list where you select a billing profile.":::
1. Select **Access Control (IAM)** from the left-hand side and then select **Add** from the top of the page.  
    :::image type="content" border="true" source="./media/download-azure-invoice/mca-select-access-control-zoomed-in.png" alt-text="Screenshot that shows the access control page.":::
1. In the Role drop-down list, select **Invoice Manager**. Enter the email address of the user to give access. Select **Save** to assign the role.  
    :::image type="content" border="true" source="./media/download-azure-invoice/mca-added-invoice-manager.png" lightbox="./media/download-azure-invoice/mca-added-invoice-manager.png" alt-text="Screenshot that shows adding a user as an invoice manager.":::
   

## Share your billing profile's invoice

You may want to share your invoice every month with your accounting team or send them to one of your other email addresses without giving your accounting team or the other email permissions to your billing profile.

1.  Sign in to the [Azure portal](https://portal.azure.com).
1.  Search for **Cost Management + Billing**.  
1.  Select **Invoices** from the left-hand side and then select **Invoice email preference** from the top of the page.  
    :::image type="content" border="true" source="./media/download-azure-invoice/mca-billing-profile-select-email-invoice.png" lightbox="./media/download-azure-invoice/mca-billing-profile-select-email-invoice-zoomed.png" alt-text="Screenshot that shows the Email invoice option for invoices.":::
1.  If you have multiple billing profiles, select a billing profile.
1.  In the additional recipients section, add the email addresses to receive invoices.
    :::image type="content" border="true" source="./media/download-azure-invoice/mca-billing-profile-add-invoice-recipients.png" lightbox="./media/download-azure-invoice/mca-billing-profile-add-invoice-recipients-zoomed.png" alt-text="Screenshot that shows additional recipients for the invoice email.":::
1.  Select **Save**.

## Azure Government support for invoices

Azure Government users use the same agreement types as other Azure users.

Azure Government customers can’t request their invoice by email. They can only download it.

To download your invoice, follow the steps above at [Download your MOSP Azure subscription invoice](#download-your-mosp-azure-subscription-invoice).

##  Why you might not see an invoice

<a name="noinvoice"></a>

There could be several reasons that you don't see an invoice:

- The invoice is not ready yet
    
    - It's less than 30 days from the day you subscribed to Azure. 

    - Azure bills you a few days after the end of your billing period. So, an invoice might not have been generated yet.

- You don't have permission to view invoices. 
    
    - If you have an MCA or MPA billing account, you must have an Owner, Contributor, Reader, or Invoice manager role on a billing profile or an Owner, Contributor, or Reader role on the billing account to view invoices. 
    
    - For other billing accounts, you might not see the invoices if you aren't the Account Administrator.

- Your account doesn't support an invoice.

    - If you have a billing account for Microsoft Online Services Program (MOSP) and you signed up for an Azure Free Account or a subscription with a monthly credit amount, you only get an invoice when you exceed the monthly credit amount.

    - If you have a billing account for a Microsoft Customer Agreement (MCA) or a Microsoft Partner Agreement (MPA), you always receive an invoice.

- You have access to the invoice through one of your other accounts.

    - This situation typically happens when you select a link in the email, asking you to view your invoice in the portal. You select the link and you see an error message - `We can't display your invoices. Please try again`. Verify that you're signed in with the email address that has permissions to view the invoices.

- You have access to the invoice through a different identity. 

    - Some customers have two identities with the same email address - a work account and a Microsoft account. Typically, only one of their identities has permissions to view invoices. If they sign in with the identity that doesn't have permission, they would not see the invoices. Verify that you're using the correct identity to sign in.

- You have signed in to the incorrect Microsoft Entra tenant. 

    - Your billing account is associated with a Microsoft Entra tenant. If you're signed in to an incorrect tenant, you won't see the invoice for subscriptions in your billing account. Verify that you're signed in to the correct Microsoft Entra tenant. If you aren't signed in the correct tenant, use the following to switch the tenant in the Azure portal:

        1. Select your email from the top right of the page.

        2. Select **Switch directory**.

           :::image type="content" border="true" source="./media/download-azure-invoice/select-switch-directory.png" alt-text="Screenshot that shows the Switch directory option in the Azure portal.":::

        3. Select **Switch** for a directory from the **All directories** section.

           :::image type="content" border="true" source="./media/download-azure-invoice/select-directory.png" alt-text="Screenshot that shows selecting a directory in the Azure portal.":::

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about your invoice and charges, see:

- [View and download your Microsoft Azure usage and charges](download-azure-daily-usage.md)
- [Understand your bill for Microsoft Azure](review-individual-bill.md)
- [Understand terms on your Azure invoice](understand-invoice.md)

If you have an MCA, see:

- [Understand the charges on the invoice for your billing profile](review-customer-agreement-bill.md)
- [Understand terms on the invoice for your billing profile](mca-understand-your-invoice.md)
- [Understand the Azure usage and charges file for your billing profile](mca-understand-your-usage.md)
