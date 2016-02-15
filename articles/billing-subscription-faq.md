<properties
	pageTitle="Azure Billing and Subscription FAQ | Microsoft Azure"
	description="Provide answers to the common Azure Billing and Subscription questions"
	services=""
	documentationCenter=""
	authors="genlin"
	manager="msmbaldwin"
	editor="n/a"
	tags="billing"/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/14/2016"
	ms.author="genli"/>

#  Azure Billing and Subscription FAQ

This article answers some of the most common questions about Azure Billing and Subscription.

**Billing**

- [What payment options do I have in purchasing Azure?](#What-payment-options-do-I-have-in-purchasing-Azure?)

- How can I request the invoice method of payment?

- How do I check the status of a payment made by credit card?

- How do I get a copy of my invoice?

- How do I remove a credit card that I no longer use as an Azure payment method?

- How can I update or change my credit card information?

- How do we know in advance about service downtime for planned maintenance?

- What is the Azure SLA agreement for uptime and connectivity?

- What are the Azure SLA Credits?

- How will Azure Service Level Agreements work with current on-premises Microsoft licensing agreements?

**Subscriptions**

- How do I migrate data and services for my Azure subscription to a new subscription?

- How do I manage Administrator accounts in the new Azure portal?

- How do I transfer ownership of my subscriptions?

- I have server licenses. Can I transfer them to Azure and run them on Virtual Machines?

- Where can I find the Benefits & Pricing information for Azure Services?

- How do I change my pricing plan?

- Can notifications be sent to a different email address other than the Account Owner email address associated with my account?

- How can I edit my payment information for my Azure subscriptions?

- Why I can't edit or add details to my subscription?

- Who can purchase Azure services?

- Can I try Azure for free, without any risk of being charged?

- If I turn off the Spending Limit can I turn it back on?

- Can I adjust the amount of the Spending Limit?

- In which countries and regions is Microsoft Azure commercially available, and what currencies can be used to purchase Azure?

- Do we restrict resale of Azure based service into countries under embargo?

- Are Azure and SQL Database available through Microsoft Services Provider License Agreement (SPLA)?

## Billing

### What payment options do I have in purchasing Azure?

You can purchase Azure using a credit or debit card or choose to be invoiced.

**NOTE:**

- Once you opt for the invoice option, you can't move to the credit card option. To sign up for invoicing, see [Azure Invoicing](https://azure.microsoft.com/pricing/invoicing/).
- Please note that we do not accept prepaid and virtual credit cards.
- You are solely responsible for any credit card interest or other credit card charges that may result.

**How can I request the invoice method of payment?**

Follow the steps in [Azure Invoicing](https://azure.microsoft.com//pricing/invoicing/) to submit a request to pay by invoice. Once your request has been approved, you will be provided instructions on how to set up your subscription for the invoice payment method.

**How do I check the status of a payment made by credit card?**

You must submit a support ticket to request assistance. To create a support ticket to check the status of a payment made by credit card see [How to Create a Support Ticket for Azure Billing and Subscription Issues](billing-how-to-create-billing-support-ticket.md).

**How do I get a copy of my invoice?**

As the Azure Account Administrator, you can view the current bill at the Azure Account Center and download statements for the previous six billing periods as well. For more detail, see [How to download your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md).

**How do I remove a credit card that I no longer use as an Azure payment method?**

You must submit a support ticket to request assistance. To create a support ticket to remove a credit card, see the article [How to Create a Support Ticket for Azure Billing and Subscription Issues](billing-how-to-create-billing-support-ticket.md).

**How can I update or change my credit card information?**

For instructions about how to use a different credit card as a payment method, or how to add a new credit card see [How to change the credit card used to pay for an Azure subscription](billing-how-to-change-credit-card.md).

**How do we know in advance about service downtime for planned maintenance?**

Our Service Level Agreement for availability applies to customer applications which use a minimum of two role instances.  There is no SLA for single instances. Please refer to your [SLA page](https://azure.microsoft.com/support/legal/sla/) for complete details.

**Planned maintenance (Classic Portal)**: For both single- and multi-instance configurations, Azure sends email communications in advance to alert you of upcoming planned maintenance (one week in advance for single-instance and 48 hours in advance for multi-instance). The email will be sent to the Account Administrator, Service Administrator and Co-administrator email accounts provided in the subscription.

**NOTE:** For more information specific to Virtual Machines see the article [Planned maintenance for Azure virtual machines](./virtual-machines/virtual-machines-planned-maintenance.md).

**Unplanned maintenance:** In the event of an unplanned service disruption on the Azure Platform, status updates will be made on our [service dashboard](http://status.azure.com/)  and customers will also receive notice in the [Azure classic portal](https://manage.windowsazure.com/).

**What is the Azure SLA agreement for uptime and connectivity?**

Azure has separate SLA’s for all services that are generally available and not in preview. The Service Level Agreement (SLA) describes Microsoft’s commitments for uptime and connectivity. Please refer to your [SLA page](https://azure.microsoft.com/support/legal/sla/) for the latest details.

**What are the Azure SLA Credits?**

Azure SLA Credits are calculated on a per subscription basis as a percentage of the bill for that service in the billing month the SLA was missed. The service credits are applied to the subsequent month’s bill. Generally, we provide 10% credit if we fall below the first threshold (99.95% or 99.9%, depending on the service) and 25% if we fall beneath the subsequent threshold (99%). Please refer to your [SLA page](https://azure.microsoft.com/support/legal/sla/) for complete details.

**How will Azure Service Level Agreements work with current on-premises Microsoft licensing agreements?**

Azure Service Level Agreements are independent of our on-premises Microsoft licensing agreements. Our SLAs for Azure provide you a monthly uptime guarantee for those services you consume in the cloud, with SLA credits against what we have billed you in the event we fail to meet the guarantee.

## Subscriptions

**How do I migrate data and services for my Azure subscription to a new subscription?**

Please contact [Azure support](https://azure.microsoft.com/support/options/) for more information. To create a support ticket to migrate data and services for an Azure subscription to a new subscription see the article [How to Create a Support Ticket for Azure Billing and Subscription Issues](billing-how-to-create-billing-support-ticket.md).

**How do I manage Administrator accounts in the new Azure portal?**

Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can segregate duties within your DevOps team and grant only the amount of access to users that they need to perform their jobs. For more information, see [Azure Role-Based Access Control](.\active-directory\Azure Role-Based Access Control.md).

**How do I transfer ownership of my subscriptions?**

You can now do this easily in the Microsoft Azure Account Center- for Pay-As-You-Go, MSDN, Action Pack, or BizSpark subscriptions. We’ve added the ability to transfer your subscription to another user. In other words, you can now change the account admin on any Pay-As-You-Go, MSDN, Action Pack, or BizSpark subscription that you own. Note that the recipient’s user account must be in the same country and that you cannot transfer subscriptions that are associated with a marketplace purchase.
For details, see the article [How to transfer an Azure subscription](billing-subscription-transfer.md).

**I have server licenses. Can I transfer them to Azure and run them on Virtual Machines?**

Yes, through license mobility if you have SA you can "bring-your-own-license" for all Virtual Machines supported server products except for Windows Server.

**Where can I find the Benefits & Pricing information for Azure Services?**

For information on the benefits of Azure services, see [Microsoft Azure Offer Details](https://azure.microsoft.com/support/legal/offer-details/). For pricing information, see the [Azure pricing page](https://azure.microsoft.com/pricing/).

**How do I change my pricing plan?**

You can switch your Pay-As-You-Go subscription to the [12-Month Prepay Offer](https://azure.microsoft.com/offers/ms-azr-0026p/). With this offer, you prepay for Azure services for a 12-month term and receive a 5% discount on Azure services. In the [Azure Account Center](https://account.windowsazure.com/Subscriptions), go to your subscription and click on Switch Offer. This is currently the only offer that can be switched via the Account Center. Alternatively, you can contact [Azure support](https://azure.microsoft.com/support/options/) to switch to a different offer.

**Can notifications be sent to a different email address other than the Account Owner email address associated with my account?**

Yes. If you would like to specify a different email address to receive notifications, please follow these directions:

1.	Go to the [Profile tab](https://account.windowsazure.com/Profile) in the Azure Accounts Portal.
2.	Click **Edit Details** to update your email address to receive notifications.

**How can I edit my payment information for my Azure Subscription/s?**

To view and edit the Azure account information, you must sign in to the Azure Account Center as the account administrator. Below are instructions in managing the payment method for Azure subscription/s.**

1.	Go to the [Azure Account Center](https://account.windowsazure.com/Subscriptions).
2.	On the subscriptions page, click the subscription for which you want to update the payment method.
3.	On the **subscription** summary page, click Change payment method. The **Change Payment Method** tool appears in a separate window.

**NOTE**: You can also access the Account Center from the Microsoft Azure classic portal. To do so, click your account name, and then click View my bill.
4.	On the **Choose payment method** page, click the drop-down list, select the payment method you want update, and then click **Edit**.
5.	On the details page, verify that you have selected the correct credit card type and card number.
6.	Make necessary changes to the card details, and then click **Next**.

For more information, see the article [How to change the credit card used to pay for an Azure subscription](billing-how-to-change-credit-card.md).

**NOTE**: Currently, the Change Payment Method tool does not allow you to remove an existing credit card as a payment method. For information about how to remove a credit card, see the FAQ "How do I remove a credit card that I no longer use as an Azure payment method?" in this article.

**Why I can't edit or add details to my subscription?**

To view and edit the Azure account information, you must sign in to the Azure Account Center as the account administrator.  If you are the AA and still cannot edit the subscription, please submit a support ticket to request assistance. To create a support ticket, see the article [How to Create a Support Ticket for Azure Billing and Subscription Issues](billing-how-to-create-billing-support-ticket.md).

**Who can purchase Azure services?**

Azure is intended for use by businesses to build cloud scale applications and services. However, anyone may purchase Azure services.

**Can I try Azure for free, without any risk of being charged?**

Yes. With our [Spending Limit feature](https://azure.microsoft.com/pricing/spending-limits/), customers who sign up for a Free Trial, MSDN, MPN or BizSpark offer can utilize Azure without any fear of getting charged as long as they keep the Spending Limit feature turned on.
For information on signing up for Azure, see the article [How to sign up for, purchase, upgrade or activate an Azure subscription](billing-buy-sign-up-azure-subscription.md).

**If I turn off the Spending Limit can I turn it back on?**

For those on our member benefit offers (e.g., MSDN), you do have the ability to have the Spending Limit feature re-enabled at the beginning of your next billing cycle. The Spending Limit cannot be re-enabled for the current billing period once turned off.
For more information, see [Change the Azure Spending Limit](https://msdn.microsoft.com/library/azure/dn465781.aspx).

**Can I adjust the amount of the Spending Limit?**

For the initial release of this feature, the Spending Limit is set at $0 and cannot be adjusted. It is designed to enable customers on our Free Trial, MSDN, MPN or BizSpark offers to utilize Azure with complete assurance of not being billed.
For more information, see Azure Spending Limit(https://azure.microsoft.com/pricing/spending-limits/).

**In which countries and regions is Microsoft Azure commercially available, and what currencies can be used to purchase Azure?**

Azure is available for purchase in more than 140 countries around the world, and we support billing in many currencies. Click [here](billing-countries-and-currencies.md) to see a list of countries and currencies.

**Do we restrict resale of Azure based service into countries under embargo?**

Yes.

**Are Azure and SQL Database available through Microsoft Services Provider License Agreement (SPLA)?**

There are currently no plans to offer Azure or SQL Database through SPLA.
