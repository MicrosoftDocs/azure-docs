---
title: View and download your Microsoft Azure invoice
description: Describes how to view and download your Microsoft Azure invoice.
keywords: billing invoice,invoice download,azure invoice,azure usage
author: bandersmsft
manager: jureid
tags: billing
ms.service: cost-management-billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/02/2019
ms.author: banders
---

# View and download your Microsoft Azure invoice

For most subscriptions, you can download your invoice from the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) or have it sent in email. If you're an Azure customer with an Enterprise Agreement (EA customer), you can't download your organization's invoices. Invoices are sent to whoever is set up to receive invoices for the enrollment.

Only certain roles have permission to view invoices. For example, the Account Administrator or Enterprise Administrator. For more information about getting access to billing information, see [Manage access to Azure billing using roles](../manage/manage-billing-access.md).

If you have a Microsoft Customer Agreement (MCA), you must have one of the following roles to get your invoices:

- Billing profile Owner
- Contributor
- Reader
- Invoice manager

If you have a Microsoft Partner Agreement (MPA), you must be the Global Admin or Admin Agent in the partner organization to view and download Azure invoices. [Check your billing account type](#check-your-billing-account-type) to figure out what permissions you need.

<!-- For more information about billing roles for Microsoft Customer Agreements, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks). -->

## <a name="noinvoice"></a> Why you might not get an invoice

There could be several reasons that you don't see an invoice:

- It's less than 30 days from the day you subscribed to Azure.

- Azure bills you at the end of your invoice period. So, an invoice might not have been generated yet. Wait until the end of the billing period.

- You don't have permission to view invoices. If you have an MCA or MPA, you must be the billing profile Owner, Contributor, Reader, or Invoice manager. For other subscriptions, you might not see old invoices if you aren't the Account Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](../manage/manage-billing-access.md).

- If you have a Free Trial or a monthly credit amount with your subscription, you only get an invoice when you exceed the monthly credit amount. If you have a Microsoft Customer Agreement or Microsoft Partner Agreement, you always receive an invoice.

## Download invoices in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.
1. Depending on your access, you might need to select a billing account or billing profile.
1. In the left menu, select **Invoices** under **Billing**.
1. In the invoice grid, find the row of the invoice you want to download.
1. Click the download icon or ellipsis (`...`) at the end of the row.
1. In the download menu, select **Invoice**.

For more information about your invoice, see [Understand your bill for Microsoft Azure](review-individual-bill.md). For help with managing your costs, see [Prevent unexpected costs with Azure billing and cost management](../manage/getting-started.md).

## Get your subscription's invoices in email

You can opt in and configure additional recipients to receive your Azure invoice in an email. This feature may not be available for certain subscriptions such as support offers, Enterprise Agreements, or Azure in Open.

1. Select your subscription on the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Opt in for each subscription you own. Click **Invoices** then **Email my invoice**.

    ![Screenshot that shows the opt-in flow](./media/download-azure-invoice/invoicesdeeplink01.png)

2. Click **Opt in** and accept the terms.

    ![Screenshot that shows the opt-in flow step 2](./media/download-azure-invoice/invoicearticlestep02.png)

3. When you've accepted the agreement, you can configure additional recipients. When a recipient is removed, the email address is no longer stored. If you change your mind, you need to readd them.

    ![Screenshot that shows the opt-in flow step 3](./media/download-azure-invoice/invoicearticlestep03.png)

If you don't get an email after following the steps, make sure your email address is correct in the [communication preferences on your profile](https://account.windowsazure.com/profile).

## Opt out of getting your subscription's invoices in email

To opt out of getting your invoice by email, follow the preceding steps and click **Opt out of emailed invoices**. This option removes any email addresses set to receive invoices in email. You can reconfigure recipients if you opt back in.

 ![Screenshot that shows the opt-out flow](./media/download-azure-invoice/invoicearticlestep04.png)

<!-- Does following section apply to MPA too? -->
## Get your Microsoft Customer Agreement invoices in email

If you have a billing account for Microsoft Customer Agreement, you can opt in to get your invoice in an email. All users with an owner, contributor, reader, or invoice manager role on a billing profile will get its invoice in email. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Cost Management + Billing**.

   ![Screenshot that shows search in portal for subscription](./media/download-azure-invoice/search-cmb.png)

1. Select **Billing profiles** from the left-hand side. From the billing profiles list, select a billing profile to get its invoices in email.

   [![Screenshot that shows billing profile list](./media/download-azure-invoice/mca-select-profile.png)](./media/download-azure-invoice/mca-select-profile-zoomed-in.png#lightbox)

1. Select **Properties** from the left-hand side and then select **Update email invoice preference**.

   [![Screenshot that shows billing profile list](./media/download-azure-invoice/mca-select-update-email-preferences.png)](./media/download-azure-invoice/mca-select-update-email-preferences.png#lightbox)

1. Select **Opt in** and then click **Update**.

   [![Screenshot that shows billing profile list](./media/download-azure-invoice/mca-select-email-opt-in.png)](./media/download-azure-invoice/mca-select-email-opt-in.png#lightbox)

## Opt out of getting your Microsoft Customer Agreement invoices in email

To opt out of getting your invoice by email, follow the preceding steps and click **Opt out**. All users with an owner, contributor, reader, or invoice manager role are opted out of getting the invoice in email. 

## Give others access to your Microsoft Customer Agreement invoices

You can give others access to view, download, and pay invoices by assigning them invoice manager role for a billing profile. If you have opted in for getting your invoice in email, these users also get the invoices in email. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Cost Management + Billing**.

   ![Screenshot that shows search in portal for subscription](./media/download-azure-invoice/search-cmb.png)

1. Select **Billing profiles** from the left-hand side. From the billing profiles list, select a billing profile for which you want to assign an invoice manager role.

   [![Screenshot that shows billing profile list](./media/download-azure-invoice/mca-select-profile.png)](./media/download-azure-invoice/mca-select-profile-zoomed-in.png#lightbox)

1. Select **Access Control (IAM)** from the left-hand side and then select **Add** from the top of the page.

   [![Screenshot that shows access control page](./media/download-azure-invoice/mca-select-access-control.png)](./media/download-azure-invoice/mca-select-access-control-zoomed-in.png#lightbox)

1. In the Role drop-down list, select **Invoice Manager**. Enter the email address of the user to whom you want to give access. Select **Save** to assign the role.

   [![Screenshot that shows adding a user as an invoice manager](./media/download-azure-invoice/mca-added-invoice-manager.png)](./media/download-azure-invoice/mca-added-invoice-manager.png#lightbox)

## Check your billing account type
[!INCLUDE [billing-check-account-type](../../../includes/billing-check-account-type.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about your invoice and charges, see:

- [View and download your Microsoft Azure usage and charges](download-azure-daily-usage.md)
- [Understand your bill for Microsoft Azure](review-individual-bill.md)
- [Understand terms on your Azure invoice](understand-invoice.md)
- [Understand terms on your Microsoft Azure detailed usage](understand-usage.md)
- [View your organization's Azure pricing](../manage/ea-pricing.md)

If you have a Microsoft Customer Agreement, see:

- [Understand the charges on the invoice for your billing profile](review-customer-agreement-bill.md)
- [Understand terms on the invoice for your billing profile](mca-understand-your-invoice.md)
- [Understand the Azure usage and charges file for your billing profile](mca-understand-your-usage.md)
- [View and download tax documents for your billing profile](mca-download-tax-document.md)
- [View your organization's Azure pricing](../manage/ea-pricing.md)
