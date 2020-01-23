---
title: Frequently asked questions for Cloudyn in Azure | Microsoft Docs
description: This article provides answers to some of the common questions about Cloudyn.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 05/21/2019
ms.topic: troubleshooting
ms.service: cost-management-billing
manager: benshy
ms.custom: seodec18
---

# Frequently asked questions for Cloudyn

This article addresses some common questions about Cloudyn. If you have questions about Cloudyn, you can ask them at [FAQs for Cloudyn](https://social.msdn.microsoft.com/Forums/en-US/231bf072-2c71-4121-8339-ac9d868137b9/faqs-for-cloudyn-cost-management?forum=Cloudyn).

## How can I resolve common indirect enterprise setup problems?

When you first use the Cloudyn portal, you might see the following messages if you are an Enterprise Agreement or Cloud Solution Provider (CSP) user:

- "The specified API key is not a top level enrollment key" displayed in the **Set Up Cloudyn** wizard.
- "Direct Enrollment – No" displayed in the Enterprise Agreement portal.
- "No usage data was found for the last 30 days. Please contact your distributor to make sure markup was enabled for your Azure account" displayed in the Cloudyn portal.

The preceding messages indicate that you purchased an Azure Enterprise Agreement through a reseller or CSP. Your reseller or CSP needs to enable _markup_ for your Azure account so that you can view your data in Cloudyn.

Here's how to fix the problems:

1. Your reseller needs to enable _markup_ for your account. For instructions, see the [Indirect Customer Onboarding Guide](https://ea.azure.com/api/v3Help/v2IndirectCustomerOnboardingGuide).

2. You generate the Azure Enterprise Agreement key for use with Cloudyn. For instructions, see [Adding Your Azure EA](quick-register-ea.md#register-with-cloudyn) or [How to Find Your EA Enrollment ID and API Key](https://youtu.be/u_phLs_udig).

Only an Azure service administrator can enable Cloudyn. Co-administrator permissions are insufficient.

Before you can generate the Azure Enterprise Agreement API key to set up Cloudyn, you must enable the Azure Billing API by following the instructions at:

- [Overview of Reporting APIs for Enterprise customers](../manage/enterprise-api.md)
- [Microsoft Azure enterprise portal Reporting API](https://ea.azure.com/helpdocs/reportingAPI) under **Enabling data access to the API**


You also might need to give department administrators, account owners, and enterprise administrators permissions to _view charges_ with the Billing API.

## Why don’t I see Optimizer recommendations?

Recommendation information is only available for accounts that are activated. You will not see any recommendation information in **Optimizer** report categories for accounts that are *unactivated*, including:

- Optimization Manager
- Sizing Optimization
- Inefficiencies

If you cannot view any Optimizer recommendation data, then most likely, you have accounts that are unactivated. To activate an account, you need to register it with your Azure credentials.

To activate an account:

1.	In the Cloudyn portal, click **Settings** in the upper right and select **Cloud Accounts**.
2.	On the Microsoft Azure Accounts tab, look for accounts that have an **unactivated** subscription.
3.	To the right of an unactivated account, click the **edit** symbol that resembles a pencil.
4.	Your tenant ID and rate ID is automatically detected. Click **Next**.
5.	You’re redirected to the Azure portal. Sign in to the portal and authorize Cloudyn Collector to access your Azure data.
6.	Next, you’re redirected to the Cloudyn Accounts management page and your subscription is updated with **active** Account Status. It shows a green check mark symbol.
7.	If you don’t see a green checkmark symbol for one or more of the subscriptions, it means that you do not have permissions to create a reader app (the CloudynCollector) for the subscription. A user with higher permissions for the subscription needs to repeat steps 3 and 4.  

After you complete the preceding steps, you can view Optimizer recommendations within one to two days. However, it can take up to five days before full optimization data is available.


## How do I enable suspended or locked-out users?

First, let's look at the most common scenario that causes user accounts to get *initiallySuspended*.

> Admin1 might be a Microsoft Cloud Solution Provider or Enterprise Agreement user. Their organization is ready to start using Cloudyn.  He registers through the Azure portal and signs into the Cloudyn portal. As the person who registers the Cloudyn service and signs into the Cloudyn portal, Admin1 becomes the *primary administrator*. Admin1 does not create any user accounts. However, using the Cloudyn portal, they do create Azure accounts and set up an entity hierarchy. Admin1 informs Admin2, a tenant administrator, that they need to register with Cloudyn and sign in to the Cloudyn portal.
>
> Admin2 registers through the Azure portal. However when they try to sign in to the Cloudyn portal, they get an error saying their account is **suspended**. The primary administrator, Admin1, is notified of the account suspension. Admin1 needs to activate Admin2’s account and grant *admin entity access* for the appropriate entities and allows user management access and active the user account.


If you receive an alert with a request to allow access for a user, you need to activate the user account.

To activate the user account:

1. Sign in to Cloudyn by using the Azure administrative user account that you used to set up Cloudyn. Or, sign in with a user account that was granted administrator access.
2. Select the gear symbol in the upper right, and select **User Management**.
3. Find the user, select the pencil symbol, and then edit the user.
4. Under **User status**, change the status from **Suspended** to **Active**.

Cloudyn user accounts connect by using single sign-on from Azure. If a user mistypes their password, they might get locked out of Cloudyn, even though they can still access Azure.

If you change your e-mail address in Cloudyn from the default address in Azure, your account can get locked out. It might show "status initiallySuspended." If your user account is locked out, contact an alternate administrator to reset your account.

We recommend that you create at least two Cloudyn administrator accounts in case one of the accounts gets locked out.

If you can't sign in to the Cloudyn portal, ensure that you're using the correct URL to sign in to Cloudyn. Use [https://azure.cloudyn.com](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/CloudynMainBlade).

Avoid using the Cloudyn direct URL https://app.cloudyn.com.

## How do I activate unactivated accounts with Azure credentials?

As soon as your Azure accounts are discovered by Cloudyn, cost data is immediately provided in cost-based reports. However, for Cloudyn to provide usage and performance data, you need to register your Azure credentials for the accounts. For instructions, see [Add an account or update a subscription](activate-subs-accounts.md#add-an-account-or-update-a-subscription).

To add Azure credentials for an account, in the Cloudyn portal, select the edit symbol to the right of the account name, not the subscription.

Until your Azure credentials are added to Cloudyn, the account appears as _un-activated_.

## How do I add multiple accounts and entities to an existing subscription?

Additional entities are used to add additional Enterprise Agreements to a Cloudyn subscription. For more information, see [Create and manage entities](tutorial-user-access.md#create-and-manage-entities).

For CSPs:

To add additional CSP accounts to an entity, select **MSP Access** instead of **Enterprise** when you create the new entity. If your account is registered as an Enterprise Agreement and you want to add CSP credentials, Cloudyn support personnel might need to modify your account settings. If you're a paid Azure subscriber, you can create a new support request in the Azure portal. Select **Help + support**, and then select **New support request**.

## Currency symbols in Cloudyn reports

You might have multiple Azure accounts using different currencies. However, cost reports in Cloudyn do not show more than one currency type per report.

If you have multiple subscriptions using different currencies, a parent entity and its child entity currencies are displayed in USD **$**. Our suggested best practice is to avoid using different currencies in the same entity hierarchy. In other words, all your subscriptions organized in an entity structure should use the same currency.

Cloudyn automatically detects your Enterprise Agreement subscription currency and presents it properly in reports.  However, Cloudyn only displays USD **$** for CSP and web-direct Azure accounts.

## What are Cloudyn data refresh timelines?

Cloudyn has the following data refresh timelines:

- **Initial**: After you set up, it can take up to 24 hours to view cost data in Cloudyn. It can also take up to 10 days for Cloudyn to collect enough data to display sizing recommendations.
- **Daily**: From the tenth day to the end of each month, Cloudyn should show your data up to date from the previous day after about UTC+3 the next day.
- **Monthly**: From the first day to the tenth day of each month, Cloudyn might show your data only through the end of the previous month.

Cloudyn processes data for the previous day when full data from the previous day is available. The previous day's data is usually available in Cloudyn by about UTC+3 each day. Some data, such as tags, can take an additional 24 hours to process.

Data for the current month isn't available for collection at the beginning of every month. During the period, service providers finalize their billing for the previous month. The previous month's data appears in Cloudyn 5 to 10 days after the start of each month. During this time, you might see only amortized costs from the previous month. You might not see daily billing or usage data. When the data becomes available, Cloudyn processes it retroactively. After processing, all the monthly data is displayed between the fifth day and the tenth day of each month.

If there is a delay sending data from Azure to Cloudyn, data is still recorded in Azure. The data is transferred to Cloudyn when the connection is restored.

## Cost fluctuations in Cloudyn Cost Reports

Cost reports can show cost fluctuations whenever cloud service providers send updated billing files. Fluctuating costs occur when new files are received from a cloud service provider outside of the usual daily or monthly reporting schedule. Cost changes don't result from Cloudyn recalculation.

Throughout the month, all billing files sent by your cloud service provider are an estimation of your daily costs. Sometimes data is updated frequently — occasionally multiple times per day. Updates are more frequent with AWS than Azure. Cost totals should remain stable when the billing calculation for the previous month is complete and the final billing file is received. Usually, by the 10th of the month.

Changes occur when you receive cost adjustments from your cloud service provider. Receiving credits is one example. Changes can occur months after the relevant month was closed. Changes are shown whenever a recalculation is made by your cloud service provider. Cloudyn updates its historical data to make sure that all adjustments are recalculated. It also verifies that the costs are shown accurately in it reports.

## How can a direct CSP configure Cloudyn access for indirect CSP customers or partners?

For instructions, see [Configure indirect CSP access in Cloudyn](quick-register-csp.md#configure-indirect-csp-access-in-cloudyn).

## What causes the Optimizer menu item to appear?

After you add Azure Resource Manager access and data is collected, you should see the **Optimizer** option. To activate Azure Resource Manager access, see [How do I activate unactivated accounts with Azure credentials?](#how-do-i-activate-unactivated-accounts-with-azure-credentials)

## Is Cloudyn agent based?

No. Agents are not used. Azure virtual machine metric data for VMs is gathered from the Microsoft Insights API. If you want to gather metric data from Azure VMs, they need to have diagnostics settings enabled.

## Do Cloudyn reports show more than one AD tenant per report?

Yes. You can [create a corresponding cloud account entity](tutorial-user-access.md#create-and-manage-entities) for each AD tenant that you have. Then you can view all of your Azure AD tenant data and other cloud platform providers including Amazon Web Services and Google Cloud Platform.
