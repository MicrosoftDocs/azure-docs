---
title: Troubleshoot Azure sign-up
description: Resolving an issue when trying to sign-up for a new account in the Microsoft Azure portal account center.
services: billing
author: v-miegge
manager: dcscontentpm
editor: v-jesits
tags: billing
ms.service: cost-management-billing
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/12/2019
ms.author: v-miegge
---

# Troubleshoot Azure sign-up

You may experience an issue when you try to sign-up for a new account in the Microsoft Azure portal or Azure account center. Before you troubleshoot the issue, first verify the following:

- The information that you provided for your Azure account profile (including contact email address, street address, and telephone number) is correct.
- The credit card information is correct.
- You don’t already have a Microsoft account that has the same information.

## Resolutions

To resolve any errors, select the issue that you experience when you try to sign-up for Azure.

### Error: *We cannot proceed with sign-up due to an issue with your account. Please contact billing support.*

To resolve the issue, follow these steps:

1. Log in to [Azure account center](https://account.azure.com/Profile) by using the account administrator credential.

2. Select **Edit details**.

3. Make sure that all address fields are completed and valid.

4. When you sign-up for the Azure subscription, make sure that the billing address for the credit card registration matches your bank records.

If you continue to receive the error message, try to sign-up by using a different browser.

### Progress bar hangs in *Identity verification by card* section.

To complete the identity verification by card, third-party cookies must be allowed for your browser.

![Identity verification by card](./media/troubleshoot-azure-sign-up/identify-verification-by-card.png)

Use the following steps to update your browser's cookie settings.

1. If you're using Chrome, select **Settings** > **Show advanced settings** > **Privacy** > **Content settings**. Clear **Block third-party cookies and site data**.

2. If you're using Microsoft Edge, select **Settings** > **View advanced settings** > **Cookies** > **Don't block cookies**.

3. Refresh the Azure sign-up page, and then check whether the problem is resolved.

4. If the refresh didn't resolve the issue, exit and restart the browser, and then try again.

### Credit card form doesn't support my billing address

Your billing address must be located in the country that you select in the **About you** section. Make sure that you select the correct country.

### No text messages or calls during sign-up account verification

Although the process is typically quick, it may take up to four minutes for a verification code to be delivered. The phone number that you enter for verification isn't stored as a contact number for the account.

Here are some additional tips:

- A Voice-over-IP (VoiP) phone number can't be used for the phone verification process.
- Double-check the phone number that you enter, including the country code that you select in the drop-down menu.
- If your phone doesn't receive text messages (SMS), try the **Call me** option.
- Make sure that your phone can receive calls or SMS messages from a United States-based telephone number.

When you get the text message or telephone call, enter the code that you receive in the text box.

### Credit card declined or not accepted

Virtual or pre-paid credit or debit cards aren't accepted as payment for Azure subscriptions. To see what else may cause your card to be declined, see your debit card or credit card is [declined at Azure sign-up](https://support.microsoft.com/help/4042960).

### Free Trial is not available

Have you used an Azure subscription in the past? The Azure Terms of Use agreement limits free trial activation only for a user that's new to Azure. If you have had any other type of Azure subscription, you can't activate a free trial. Consider signing up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).

### I saw a charge on my Free Trial account

You may see a small verification hold on your credit card account after you sign-up. This is removed within three to five days. If you are worried about managing costs, read more about [preventing unexpected costs](getting-started.md).

### Can't activate Azure benefit plan like MSDN, BizSpark, BizSparkPlus, or MPN

Make sure that you're using the correct sign-in credentials. Then, check the benefit program to make sure that you're eligible.

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

### Error: *You are not eligible for an Azure subscription*

To resolve this issue, double-check whether the following items are true:

- The information that you provided for your Azure account profile (including contact email address, street address, and telephone number) is correct.
- The credit card information is correct.
- You don’t already have a Microsoft account that uses the same information.

### Error: *Your current account type is not supported*

This issue can occur if the account is registered in an [unmanaged Azure AD directory](../../active-directory/users-groups-roles/directory-self-service-signup.md), and it is not in your organization’s Azure AD directory.

To resolve this issue, sign-up the Azure account by using another account, or take over the unmanaged AD directory. For more information, see [Take over an unmanaged directory as administrator in Azure Active Directory](../../active-directory/users-groups-roles/domains-admin-takeover.md).

## Additional help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](troubleshoot-declined-card.md)
- [Subscription sign-in issues](troubleshoot-sign-in-issue.md)
- [No subscriptions found](no-subscriptions-found.md)
- [Enterprise cost view disabled](enterprise-mgmt-grp-troubleshoot-cost-view.md)

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Azure Billing documentation](../../billing/index.md)
