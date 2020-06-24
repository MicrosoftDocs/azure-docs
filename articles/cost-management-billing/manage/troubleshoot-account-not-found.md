---
title: Troubleshoot can't see your billing account in the Azure portal
description: Resolving can't see your billing account in the Azure portal.
author: amberbhargava
ms.reviewer: banders
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 06/24/2020
ms.author: banders
---

# Troubleshoot can't see your billing account in the Azure portal

A billing account is created when you sign up to use Azure. You use your billing account to manage your invoices, payments, and track costs. You can have access to multiple billing accounts. For example, you might have signed up for Azure for your personal projects. You could also have access through your organization's Enterprise Agreement or Microsoft Customer Agreement. For each of these scenarios, you would have a separate billing account.

You can view your billing accounts in the [Azure Cost Management + Billing](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade)page.

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

If you are unable to see your billing account in the Azure portal, try the following options:

## Sign in to a different Azure Active Directory (AAD) tenant 

Your billing account is associated with a single AAD tenant. You won't see your billing account in the Cost Management + Billing page if you're signed in to an incorrect tenant. Use the following to switch the tenant in the Azure portal and view your billing accounts in another tenant.

  1. Select your email from the top right of the page.

  2. Select **Switch directory**.

      ![Screenshot that shows selecting switch directory in the portal](./media/troubleshoot-account-not-found/select-switch-directory.png)

  3. Select a directory from the **All directories** section.

      ![Screenshot that shows selecting a directory in the portal](./media/troubleshoot-account-not-found/select-directory.png)

## Sign in with a different email address

Some users have multiple email addresses to sign in to the [Azure portal](https://portal.azure.com). Not all email addresses have access to a billing account. If you sign in with an email address that has permissions to manage resources but doesn't have permissions to view a billing account, you wouldn't see the billing account in the [Cost Management + Billing](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade) page in the Azure portal. 

Sign in with an email address that has permission on the billing account to access your billing account in the Azure portal.

## Sign in with a different identity

Some users have two identities with the same email address - a work or school account and a personal account. Typically, only one of their identities has permissions to view a billing account. If you have two identities with your email address and you sign in with the identity that doesn't have permissions, you wouldn't see the billing account in the [Cost Management + Billing](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade) page in the [Azure portal](https://portal.azure.com). Use the following to switch your identity:

  1. Sign in to the [Azure portal](https://portal.azure.com) in an InPrivate/Incognito window.

  1. If your email address has two identities, you'll see an option to select a personal account or a work or school account. Select one of the accounts. 
  
  1. If you can't see the billing account in the Cost Management + Billing page in the Azure portal, repeat steps 1 and 2 and select the other identity.

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-declined-card)
- [Subscription sign-in issues](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-sign-in-issue)
- [No subscriptions found](https://docs.microsoft.com/azure/cost-management-billing/manage/no-subscriptions-found)
- [Enterprise cost view disabled](https://docs.microsoft.com/azure/cost-management-billing/manage/enterprise-mgmt-grp-troubleshoot-cost-view)

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Find out more about Azure Cost Management

- [Azure Cost Management and Billing documentation](https://docs.microsoft.com/azure/cost-management-billing)
