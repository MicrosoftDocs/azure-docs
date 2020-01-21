---
title: Review your Azure Enterprise Agreement bill
description: Learn how to read and understand your usage and bill for Azure Enterprise Agreements.
author: banders
manager: dougeby
tags: billing
ms.service: cost-management-billing
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/17/2020
ms.author: banders

---
# Understand your Azure Enterprise Agreement bill

Azure customers with an Enterprise Agreement receive an invoice when they exceed the organization's credit or use services that aren't covered by the credit.

Your organization's credit includes your monetary commitment. The monetary commitment is the amount your organization paid upfront for usage of Azure services. You can add monetary commitment funds to your Enterprise Agreement by contacting your Microsoft account manager or reseller.

This tutorial applies only to Azure customers with an Azure Enterprise Agreement.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Review invoiced charges
> * Review service overage charges
> * Review Marketplace invoice

## Prerequisites

To review and verify the charges on your invoice, you must be an Enterprise Administrator. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](../manage/understand-ea-roles.md). If you don't know who the Enterprise Administrator is for your organization, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Review invoiced charges for most customers

This section doesn't apply to Azure customers in Australia, Japan, or Singapore.

You receive an Azure invoice when any of the following events occur during your billing cycle:

- **Service overage**: Your organization's usage charges exceed your credit balance.
- **Charges billed separately**: The services your organization used aren't covered by the credit. You're invoiced for the following services despite your credit balance:
    - Canonical
    - Citrix XenApp Essentials
    - Citrix XenDesktop
    - Registered User
    - Openlogic
    - Remote Access Rights XenApp Essentials Registered User
    - Ubuntu Advantage
    - Visual Studio Enterprise (Monthly)
    - Visual Studio Enterprise (Annual)
    - Visual Studio Professional (Monthly)
    - Visual Studio Professional (Annual)
- **Marketplace charges**: Azure Marketplace purchases and usage aren't covered by your organization's credit. So, you're invoiced for Marketplace charges despite your credit balance. In the Enterprise Portal, an Enterprise Administrator can enable and disable Marketplace purchases.

Your invoice shows all of your Azure usage, followed by any Marketplace charges. If you have a credit balance, it's applied to Azure usage.

Compare your combined total amount shown in the Enterprise portal in **Reports** > **Usage Summary** with your Azure invoice. The amounts in the **Usage Summary** don't include tax.

Sign in to the [Azure EA portal](https://ea.azure.com). Then, select **Reports**. On the top-right corner of the tab, switch the view from **M** to **C** and match the period on the invoice.  

![Screenshot that shows M + C option in Usage summary.](./media/review-enterprise-agreement-bill/ea-portal-usage-sumary-cm-option.png)

The combined amount of **Total Usage** and **Azure Marketplace** should match the **Total Extended Amount** on your invoice. To get more details about your charges, go to **Download Usage**.  

![Screenshot showing the Download Usage tab](./media/review-enterprise-agreement-bill/ea-portal-download-usage.png)

## Review invoiced charges for other customers

This section only applies to Azure customers in Australia, Japan, or Singapore.

You receive one or more Azure invoices when any of the following events occur:

- **Service overage**: Your organization's usage charges exceed your credit balance.
- **Charges billed separately**: The services your organization used aren't covered by the credit. You're invoiced for the following services:
    - Canonical
    - Citrix XenApp Essentials
    - Citrix XenDesktop
    - Registered User
    - Openlogic
    - Remote Access Rights XenApp Essentials Registered User
    - Ubuntu Advantage
    - Visual Studio Enterprise (Monthly)
    - Visual Studio Enterprise (Annual)
    - Visual Studio Professional (Monthly)
    - Visual Studio Professional (Annual)
- **Marketplace charges**: Azure Marketplace purchases and usage aren't covered by your organization's credit and are billed separately. In the Enterprise Portal, an Enterprise Administrator can enable and disable Marketplace purchases.

When you have charges due for service overages and charges that are billed separately during the billing period, you get one invoice. It includes both types of charges. Marketplaces charges are always invoiced separately.

## Review service overage charges for other customers

This section only applies if you are in Australia, Japan, or Singapore.

Compare your total usage amount in the Enterprise portal in **Reports** > **Usage Summary** with your service overage invoice. The service overage invoice includes usage that exceeds your organization's credit, and/or services that aren't covered by the credit. The amounts on the **Usage Summary** don't include tax.

Sign in to the [Azure EA portal](https://ea.azure.com) then select **Reports**. On the top-right corner of the tab, switch the view from **M** to **C** and match the period on the invoice.  

![Screenshot that shows M + C option in Usage summary.](./media/review-enterprise-agreement-bill/ea-portal-usage-sumary-cm-option.png)

The **Total Usage** amount should match the **Total Extended Amount** on your service overage invoice. To get more information about your charges, go to **Download Usage** > **Advanced Report Download**. The report doesn't include taxes or charges for reservations or marketplace charges.  

![Screenshot that shows Advanced report Download on the Download usage tab.](./media/review-enterprise-agreement-bill/ea-portal-download-usage-advanced.png)

The following table lists the terms and descriptions shown on the invoice and on the **Usage Summary** in the Enterprise portal:

|Invoice term|Usage Summary term|Description|
|---|---|---|
|Total Extended Amount|Total Usage|The total pre-tax usage charge for the specific period before the credit is applied.|
|Commitment Usage|Commitment Usage|The credit applied during that specific period.|
|Total Sale|Total Overage|The total usage charge that exceeds your credit amount. This amount doesn't include tax.|
|Tax Amount|Not applicable|Tax that applies to the total sale amount for the specific period.|
|Total Amount|Not applicable|The amount due for the invoice after the credit is applied and tax is added.|

### Review Marketplace invoice

This section only applies if you are in Australia, Japan, or Singapore.

Compare your Azure Marketplace total on **Reports** > **Usage Summary** in the Enterprise portal with your marketplace invoice. The marketplace invoice is only for Azure Marketplace purchases and usage. The amounts on the **Usage Summary** don't include tax.

Sign in to the [Enterprise portal](https://ea.azure.com) and then select **Reports**. On the top-right corner of the tab, switch the view from **M** to **C** and match the period on the invoice.  

![Screenshot that shows M + C option  on Usage summary.](./media/review-enterprise-agreement-bill/ea-portal-usage-sumary-cm-option.png)  

The **Azure Marketplace** total should match the **Total Sale** on your marketplace invoice. To get more information about your usage-based charges, go to **Download Usage**. Under **Marketplace Charges**, select **Download**. The marketplace price includes a tax as determined by the publisher. Customers won't receive a separate invoice from the publisher to collect tax on the transaction.

![Screenshot that shows download option under Marketplace charges.](./media/review-enterprise-agreement-bill/ea-portal-download-usage-marketplace.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Review invoiced charges
> * Review service overage charges
> * Review Marketplace invoice

Continue to the next article to learn more using the Azure EA portal.

> [!div class="nextstepaction"]
> [Get started with the Azure EA portal](../manage/ea-portal-get-started.md)
