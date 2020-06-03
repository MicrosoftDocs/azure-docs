---
title: Troubleshoot issues when you sign up for a new account in Azure portal or Azure account center
description: Resolving an issue when trying to sign up for a new account in the Microsoft Azure portal account center.
services: cost-management-billing
author: v-miegge
manager: dcscontentpm
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: v-miegge
---

# Troubleshoot issues when you sign up for a new account in Azure portal or Azure account center

You may experience an issue when you try to sign up for a new account in the Microsoft Azure portal or Azure account center. This short guide will walk you through the sign-up process and discuss some common issues at each step.

> [!NOTE]
> If you already have an existing account and are looking for guidance to troubleshoot sign-in issues, see [Troubleshoot Azure subscription sign-in issues](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-sign-in-issue).

## Before you begin

Before beginning sign-up, verify the following:

- The information for your Azure Account Profile (including contact email address, street address, and telephone number) is correct.
- Your credit card information is correct.
- You don't already have a Microsoft account that has the same information.

## Guided walkthrough of Azure sign-up

The Azure sign-up experience consists of four sections:

- About you
- Identity verification by phone
- Identity verification by card
- Agreement

This walkthrough provides examples of the correct information to sign up for an Azure account. Each section also contains some common issues and how to resolve them.

## About you

![About you](./media/troubleshoot-azure-sign-up/1.png)
 
### Common issues and solutions

#### You see the message “We cannot proceed with sign-up due to an issue with your account. Please contact billing support”

To resolve this error, follow these steps:

1.	Log in to [Azure account center](https://account.azure.com/Profile) by using the account administrator credential.
1.	Select **Edit details**.
1.	Verify that all address fields are completed and valid.
1.	When you sign up for the Azure subscription, verify that the billing address for the credit card registration matches your bank records.

If you continue to receive the message, try to sign up by using a different browser.

How about InPrivate browsing?

#### Free trial is not available

Have you used an Azure subscription in the past? The Azure Terms of Use agreement limits free trial activation only for a user that's new to Azure. If you have had any other type of Azure subscription, you can't activate a free trial. Consider signing up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).

#### You see the message 'You are not eligible for an Azure subscription'

To resolve this issue, double-check whether the following items are true:

- The information that you provided for your Azure account profile (including contact email address, street address, and telephone number) is correct.
- The credit card information is correct.
- You don't already have a Microsoft account that uses the same information.

#### You see the message 'Your current account type is not supported'

This issue can occur if the account is registered in an [unmanaged Azure AD directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-self-service-signup), and it is not in your organization's Azure AD directory.
To resolve this issue, sign up the Azure account by using another account, or take over the unmanaged AD directory. For more information, see [Take over an unmanaged directory as administrator in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/domains-admin-takeover).

## Identity verification by phone

![Identity verification by phone](./media/troubleshoot-azure-sign-up/2.png)
 
When you get the text message or telephone call, enter the code that you receive in the text box.

### Common issues and solutions

#### No verification text message or phone call

Although the sign-up verification process is typically quick, it may take up to four minutes for a verification code to be delivered.

Here are some additional tips:

- You can use any phone number for verification as long as it meets the requirements. The phone number that you enter for verification isn't stored as a contact number for the account.
  - A Voice-over-IP (VoiP) phone number can't be used for the phone verification process.
  - Check that your phone can receive calls or SMS messages from a United States-based telephone number.
- Double-check the phone number that you enter, including the country code that you select in the drop-down menu.
- If your phone doesn't receive text messages (SMS), try the **Call me** option.

## Identity verification by card

![Identity verification by card](./media/troubleshoot-azure-sign-up/3.png)
 
### Common issues and solutions

#### Credit card declined or not accepted

Virtual or pre-paid credit or debit cards aren't accepted as payment for Azure subscriptions. To see what else may cause your card to be declined, see [Troubleshoot a declined card at Azure sign-up](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-declined-card).

#### Credit card form doesn't support my billing address

Your billing address must be in the country that you select in the **About you** section. Verify that you have selected the correct country.

#### Progress bar hangs in identity verification by card section

To complete the identity verification by card, third-party cookies must be allowed for your browser.

Use the following steps to update your browser's cookie settings.

1. Update the cookie settings.
   - If you're using **Chrome**:
     - Select **Settings** > **Show advanced settings** > **Privacy** > **Content settings**. Clear **Block third-party cookies and site data**.

   - If you're using **Microsoft Edge**:
     - Select **Settings** > **View advanced settings** > **Cookies** > **Don't block cookies**.

1. Refresh the Azure sign-up page and check whether the problem is resolved.
1. If the refresh didn't resolve the issue, then exit and restart the browser, and try again.

### I saw a charge on my free trial account

You may see a small, temporary verification hold on your credit card account after you sign up. This hold is removed within three to five days. If you are worried about managing costs, read more about [preventing unexpected costs](https://docs.microsoft.com/azure/cost-management-billing/manage/getting-started).

## Agreement

Complete the Agreement.

## Other issues

### Can't activate Azure benefit plan like MSDN, BizSpark, BizSparkPlus, or MPN

Check that you're using the correct sign-in credentials. Then, check the benefit program and verify that you're eligible.
- MSDN
  - Verify your eligibility status on your [MSDN account page](https://msdn.microsoft.com/subscriptions/manage/default.aspx).
  - If you can't verify your status, contact the [MSDN Subscriptions Customer Service Centers](https://msdn.microsoft.com/library/aa493452.aspx).
- Microsoft for Startups
  - Sign in to the [Microsoft for Startups portal](https://startups.microsoft.com/#start-two) to verify your eligibility status for Microsoft for Startups.
  - If you can't verify your status, you can get help on the [Microsoft for Startups forums](https://www.microsoftpartnercommunity.com/t5/Microsoft-for-Startups/ct-p/Microsoft_Startups).
- MPN
  - Sign in to the [MPN portal](https://mspartner.microsoft.com/Pages/Locale.aspx) to verify your eligibility status. If you have the appropriate [Cloud Platform Competencies](https://mspartner.microsoft.com/pages/membership/cloud-platform-competency.aspx), you may be eligible for additional benefits.
  - If you can't verify your status, contact [MPN Support](https://mspartner.microsoft.com/Pages/Support/Premium/contact-support.aspx).


### Can't activate new Azure In Open subscription

To create an Azure In Open subscription, you must have a valid Online Service Activation (OSA) key that has at least one Azure In Open token associated with it. If you don't have an OSA key, contact one of the Microsoft Partners that are listed in [Microsoft Pinpoint](https://pinpoint.microsoft.com/).

## Additional help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-declined-card)
- [Subscription sign-in issues](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-sign-in-issue)
- [No subscriptions found](https://docs.microsoft.com/azure/cost-management-billing/manage/no-subscriptions-found)
- [Enterprise cost view disabled](https://docs.microsoft.com/azure/cost-management-billing/manage/enterprise-mgmt-grp-troubleshoot-cost-view)

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Find out more about Azure Cost Management

- [Azure Cost Management and Billing documentation](https://docs.microsoft.com/azure/cost-management-billing)
