---
title: Frequently asked questions for Azure Cost Management | Microsoft Docs
description: Provides answers to some of the common questions about Azure Cost Management.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 10/23/2017
ms.topic: article
ms.service: cost-management
manager: carmonm
ms.custom:
---

# Frequently asked questions for Azure Cost Management


This article addresses some common questions about Azure Cost Management (also known as Cloudyn). If you have questions about Cost Management, you can ask them at [FAQs for Azure Cost Management by Cloudyn](https://social.msdn.microsoft.com/Forums/en-US/231bf072-2c71-4121-8339-ac9d868137b9/faqs-for-azure-cost-management-by-cloudyn?forum=Cloudyn).

## How can I resolve common indirect enterprise setup problems?

When you first use the Cloudyn portal, you might see the following messages if you are an Enterprise Agreement or Cloud Solution Provider (CSP) user:

- "The specified API key is not a top level enrollment key" displayed in the **Set Up Azure Cost Management** wizard.
- "Direct Enrollment – No" displayed in the Enterprise Agreement portal.
- "No usage data was found for the last 30 days. Please contact your distributor to make sure markup was enabled for your Azure account" displayed in the Cloudyn portal.

The preceding messages indicate that you purchased an Azure Enterprise Agreement through a reseller or CSP. Your reseller or CSP needs to enable _markup_ for your Azure account so that you can view your data in Cloudyn.

Here's how to fix the problems:

1. Your reseller needs to enable _markup_ for your account. For instructions, see the [Indirect Customer Onboarding Guide](https://ea.azure.com/api/v3Help/v2IndirectCustomerOnboardingGuide).

2. You generate the Azure Enterprise Agreement key for use with Cloudyn. For instructions, see [Adding Your Azure EA](https://support.cloudyn.com/hc/en-us/articles/210429585-Adding-Your-AZURE-EA) or [How to Find Your EA Enrollment ID and API Key](https://youtu.be/u_phLs_udig).

Only an Azure service administrator can enable Cost Management. Co-administrator permissions are insufficient.

Before you can generate the Azure Enterprise Agreement API key to set up Cloudyn, you must enable the Azure Billing API by following the instructions at:

- [Overview of Reporting APIs for Enterprise customers](../billing/billing-enterprise-api.md)
- [Microsoft Azure enterprise portal Reporting API](https://ea.azure.com/helpdocs/reportingAPI) under **Enabling data access to the API**


You also might need to give department administrators, account owners, and enterprise administrators permissions to _view charges_ with the Billing API.

## How do I enable suspended or locked-out users?

If you receive an alert with a request to allow access for a user, you need to activate the user account.

To activate the user account:

1. Sign in to Cloudyn by using the Azure administrative user account that you used to set up Cloudyn. Or, sign in with a user account that was granted administrator access.

2. Select the gear symbol in the upper right, and select **User Management**.

3. Find the user, select the pencil symbol, and then edit the user.

4. Under **User status**, change the status from **Suspended** to **Active**.

Cloudyn user accounts connect by using single sign-on from Azure. If a user mistypes their password, they might get locked out of Cloudyn, even though they can still access Azure.

If you change your e-mail address in Cloudyn from the default address in Azure, your account can get locked out. It might show "status initiallySuspended." If your user account is locked out, contact an alternate administrator to reset your account.

We recommend that you create at least two Cloudyn administrator accounts in case one of the accounts gets locked out.

If you can't sign in to the Cloudyn portal, ensure that you're using the correct Azure Cost Management URL to sign in to Cloudyn. Use one of the following URLs:

- https://azure.cloudyn.com
- https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/CloudynMainBlade

Avoid using the Cloudyn direct URL https://app.cloudyn.com.

## How do I activate unactivated accounts with Azure credentials?

As soon as your Azure accounts are discovered by Cloudyn, cost data is immediately provided in cost-based reports. However, for Cloudyn to provide usage and performance data, you need to register your Azure credentials for the accounts. For instructions, see [Add Azure Resource Manager](https://support.cloudyn.com/hc/en-us/articles/212784085-Adding-Azure-Resource-Manager).

To add Azure credentials for an account, in the Cloudyn portal, select the edit symbol to the right of the account name, not the subscription.

Until your Azure credentials are added to Cloudyn, the account appears as _un-activated_.

## How do I add multiple accounts and entities to an existing subscription?

Additional entities are used to add additional Enterprise Agreements to a Cloudyn subscription. The following links describe how to add additional entities:

- [Adding an Entity](https://support.cloudyn.com/hc/en-us/articles/212016145-Adding-an-Entity) article
- [Defining your hierarchy with Cost Entities](https://support.cloudyn.com/hc/en-us/articles/115005142529-Video-Defining-your-hierarchy-with-Cost-Entities) video

For CSPs:

To add additional CSP accounts to an entity, select **MSP Access** instead of **Enterprise** when you create the new entity. If your account is registered as an Enterprise Agreement and you want to add CSP credentials, Cloudyn support personnel might need to modify your account settings. If you're a paid Azure subscriber, you can create a new support request in the Azure portal. Select **Help + support**, and then select **New support request**.

## How do I change the currency symbol used in Cloudyn?

When all Azure accounts in a single entity use the same currency, the currency that you use is automatically detected. However, the currency symbol is erroneously shown as **$** for any of the following currencies:

- GBP = United Kingdom pound sterling
- EUR = European euro
- INR = Indian rupee
- NOK = Norwegian krone

Although the currency symbol might show **$** for US dollars, the cost values are shown in your correct currency. For example, if all your accounts use euros in the same entity, the _values_ shown in Cloudyn are euros, even though the **$** symbol appears erroneously.

If you're an Azure Enterprise Agreement customer, Cloudyn support personnel can change your currency symbol shown in cost reports from $. You can create a new support request in the Azure portal. Select **Help + support**, and then select **New support request**.

If you're a CSP customer, you can't change your currency symbol. Cloudyn only supports rate cards that use US dollars. Cloudyn is exploring the option to support rate cards in different currencies.

## What are Cloudyn data refresh timelines?

Cloudyn has the following data refresh timelines:

- **Initial**: After you set up, it can take up to 24 hours to view cost data in Cloudyn. It can also take up to 10 days for Cloudyn to collect enough data to display sizing recommendations.
- **Daily**: From the tenth day to the end of each month, Cloudyn should show your data up to date from the previous day after about UTC+3 the next day.
- **Monthly**: From the first day to the tenth day of each month, Cloudyn might show your data only through the end of the previous month.

Cloudyn processes data for the previous day when full data from the previous day is available. The previous day's data is usually available in Cloudyn by about UTC+3 each day. Some data, such as tags, can take an additional 24 hours to process.

Data for the current month isn't available for collection at the beginning of every month. During the period, service providers finalize their billing for the previous month. The previous month's data appears in Cloudyn 5 to 10 days after the start of each month. During this time, you might see only amortized costs from the previous month. You might not see daily billing or usage data. When the data becomes available, Cloudyn processes it retroactively. After processing, all the monthly data is displayed between the fifth day and the tenth day of each month.

If there is a delay sending data from Azure to Cloudyn, data is still recorded in Azure. The data is transferred to Cloudyn when the connection is restored.

## How can a direct CSP configure Cloudyn access for indirect CSP customers or partners?

For instructions, see [Configure indirect CSP access in Cloudyn](quick-register-csp.md#configure-indirect-csp-access-in-cloudyn).
