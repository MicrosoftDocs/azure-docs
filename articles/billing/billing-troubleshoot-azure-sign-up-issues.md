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
ms.date: 03/21/2017
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

## No text messages or calls during sign-up account verification
If you selected **Send text message**, it may take up to four minutes for your text code to be delivered to your phone. Obviously, for identity verification, enter a phone number that can receive SMS messages or, for the **Call me** option, that the phone can receive calls. The phone number you enter is only used for identity verification and isn't stored as a contact number for the account.

Here are some tips:
* A VOIP phone number can't be used for the phone verification process.
* Double check the phone number you enter, including the country code you selected in the dropdown menu.
* If your phone doesn't receive text messages (SMS), use the **Call me** option.
* If the phone verification step fails when you try both **Send text message** and **Call me** options, use another phone number.

When you get the text message or phone call, enter code that you received in the text box.

## Credit card declined or not accepted
Virtual or prepaid credit or debit cards aren't accepted as payment for Azure subscriptions. To see what else may cause your card to be declined, see [your debit card or credit card is declined at Azure sign-up](billing-credit-card-fails-during-azure-sign-up.md).

## "Free Trial is not available"
Have you used an Azure subscription in the past? The Azure Terms of Use agreement limits free trial activation only for a user that's new to Azure. If you have had any other type of Azure subscription, you can't activate a free trial. Consider signing up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).

## Can’t activate Azure benefit plan like MSDN, BizSpark, BizSparkPlus, or MPN
Make sure that you're using the right sign-in credentials. Then check the benefit program to make sure that you're eligible. 

* MSDN
  * Verify your eligibility status in your [MSDN account page](https://msdn.microsoft.com/subscriptions/manage/default.aspx).
  * If you can't verify your status, contact the [MSDN Subscriptions Customer Service Centers](https://msdn.microsoft.com/subscriptions/contactus.aspx)
* BizSpark
  * Sign in to the [BizSpark portal](https://www.microsoft.com/bizspark/default.aspx#start-two) and verify your eligibility status for BizSpark and BizSpark Plus.
  * If you can't verify your status, you can [contact the BizSpark Team](mailto:bizspark@microsoft.com?subject=BizSpark%20Support&body=Thank%20you%20for%20contacting%20BizSpark.%20Please%20provide%20as%20much%20of%20the%20following%20information%20as%20possible,%20as%20it%20will%20help%20expedite%20our%20response%20to%20you.%0aContact%20name:%0aStartup%20name:%0aMicrosoft%20Account/Live%20ID:%0aSpecific%20description%20of%20issue%20experienced%20or%20question:%0a%0aThank%20you,%0a%0aThe%20BizSpark%20Team)
* MPN
  * Sign in to the [MPN portal](https://mspartner.microsoft.com/en/us/Pages/Locale.aspx) and verify your eligibility status. If you have the appropriate [Cloud Platform Competencies](https://mspartner.microsoft.com/en/us/pages/membership/cloud-platform-competency.aspx), you may be eligible for additional benefits.
  * If you can't verify your status, contact [MPN support](https://mspartner.microsoft.com/en/us/Pages/Support/Premium/contact-support.aspx).

## Can’t activate new Azure In Open subscription
To create an Azure In Open subscription, you must have a valid Online Service Activation (OSA) key with at least one Azure In Open token associated to it. If you don't have an OSA key, contact one of Microsoft Partners listed in [Microsoft Pinpoint](http://pinpoint.microsoft.com/).

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
