---
title: Troubleshoot Azure sign-up issues | Microsoft Docs
description: Describes how to troubleshoot some common Azure sign up issues.
services: ''
documentationcenter: ''
author: JiangChen79
manager: adpick
editor: ''
tags: billing,top-support-issue

ms.assetid: a0907da1-cb2d-41d1-a97f-43841fabe355
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 07/05/2017
ms.author: cjiang
ms.custom: H1Hack27Feb2017
---
# Troubleshoot sign-up issues for Azure
If you can't sign up for Azure, use the tips in this article to troubleshoot common issues. If you have an issue with your credit card during sign-up, see [your debit card or credit card is declined at Azure sign-up](billing-credit-card-fails-during-azure-sign-up.md). If you have an Azure account but can't sign in, see [I can't sign in to manage my Azure subscription](billing-cannot-login-subscription.md).

## Progress bar hangs in "Identity verification by card" section

To complete the identity verification by card, third-party cookies must be allowed for your browser.

![Screenshot of the Identity verification by card section hanging during sign-up](./media/billing-troubleshoot-azure-sign-up-issues/identity-verification-hangs.PNG)

Use the following steps to update your browser's cookie settings.

1. If you're using Chrome, go to **Settings** > **Show advanced settings** > **Privacy** > **Content settings**. Uncheck **Block third-party cookies and site data**.
2. If you're using Edge, go to **Settings** > **View advanced settings** > **Cookies**. Select **Don't block cookies**.
3. Refresh the Azure sign-up page, and check if the problem is resolved.
4. If the refresh didn't solve the issue, quit and restart your browser then try again.

## Credit card form doesn't support my billing address
Your billing address needs to be in the country that you selected in the **About you** section. Make sure you select the correct country.

## No text messages or calls during sign-up account verification
While it is usually much faster, it may take up to four minutes for verification code to be delivered. The phone number you enter for verification isn't stored as a contact number for the account.

Here are some additional tips:
* A VOIP phone number can't be used for the phone verification process.
* Double check the phone number you enter, including the country code you selected in the dropdown menu.
* If your phone doesn't receive text messages (SMS), try the **Call me** option.
* Ensure that your phone can receive calls or SMS messages from a United States based number.

When you get the text message or phone call, enter code that you receive into the text box.

## Credit card declined or not accepted
Virtual or prepaid credit or debit cards aren't accepted as payment for Azure subscriptions. To see what else may cause your card to be declined, see [your debit card or credit card is declined at Azure sign-up](billing-credit-card-fails-during-azure-sign-up.md).

## "Free Trial is not available"
Have you used an Azure subscription in the past? The Azure Terms of Use agreement limits free trial activation only for a user that's new to Azure. If you have had any other type of Azure subscription, you can't activate a free trial. Consider signing up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).

## I saw a charge on my Free Trial account
You may see a small verification hold on your credit card account after you sign up, which is removed within 3 to 5 days. If you are worried about managing costs, read more about [preventing unexpected costs](https://docs.microsoft.com/azure/billing/billing-getting-started).

## Can’t activate Azure benefit plan like MSDN, BizSpark, BizSparkPlus, or MPN
Make sure that you're using the right sign-in credentials. Then check the benefit program to make sure that you're eligible. 

* MSDN
  * Verify your eligibility status in your [MSDN account page](https://msdn.microsoft.com/subscriptions/manage/default.aspx).
  * If you can't verify your status, contact the [MSDN Subscriptions Customer Service Centers](https://msdn.microsoft.com/subscriptions/contactus.aspx)
* BizSpark
  * Sign in to the [BizSpark portal](https://www.microsoft.com/bizspark/default.aspx#start-two) and verify your eligibility status for BizSpark and BizSpark Plus.
  * If you can't verify your status, you can [get help at the BizSpark forums](http://aka.ms/bzforums).
* MPN
  * Sign in to the [MPN portal](https://mspartner.microsoft.com/en/us/Pages/Locale.aspx) and verify your eligibility status. If you have the appropriate [Cloud Platform Competencies](https://mspartner.microsoft.com/en/us/pages/membership/cloud-platform-competency.aspx), you may be eligible for additional benefits.
  * If you can't verify your status, contact [MPN support](https://mspartner.microsoft.com/en/us/Pages/Support/Premium/contact-support.aspx).

## Can’t activate new Azure In Open subscription
To create an Azure In Open subscription, you must have a valid Online Service Activation (OSA) key with at least one Azure In Open token associated to it. If you don't have an OSA key, contact one of Microsoft Partners listed in [Microsoft Pinpoint](http://pinpoint.microsoft.com/).

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
