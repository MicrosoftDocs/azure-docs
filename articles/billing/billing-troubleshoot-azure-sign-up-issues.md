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
ms.date: 03/01/2017
ms.author: cjiang
ms.custom: H1Hack27Feb2017
---
# Troubleshoot sign-up issues for Azure
If you can't sign up for Azure, there are several things you can check to troubleshoot the issue.

## Progress bar hangs in "Identity verification by card" section

During Azure sign-up, there's a section called "Identity verification by card." If the progress bar hangs:

![Screenshot of the Identity verification by card section hanging during sign-up](./media/billing-troubleshoot-azure-sign-up-issues/identity-verification-hangs.PNG)

This issue occurs when third-party cookies are blocked for your browser.

### Suggestion

1. Allow third-party cookies in your browser settings.
  * In Edge, go to Settings -> View advanced settings -> Cookies, select "Don't block cookies."
  * In Chrome, go to Settings -> Show advanced settings -> Privacy -> Content settings, uncheck "Block third-party cookies and site data."
2. Refresh the Azure sign-up page, and check if the problem is resolved.
3. If the refresh didn't solve the issue, quit and restart your browser then try again.

## No text messages or calls during sign-up account verification
* It may take up to four minutes for your text code to be delivered.
* Verify that your phone number can receive SMS.
* Double check the phone number you entered, including the country code selection in the dropdown menu.
* Be sure your phone can receive text messages (SMS) if you use "Send text message," or phone calls if you choose the "Call me" alternative.
* When you receive the text message, insert the code in the text box, and click the verification button to proceed.

### Suggestions
* If you do not receive text messages (SMS) in your phone, use the "call me" alternate verification method.
* Use another phone number if the phone verification step fails using both SMS and "Call me" methods.
* A VOIP phone number cannot be used for the phone verification process.

## Credit card declined or not accepted
Make sure that the payment method you are using at sign-up is a supported payment method. You can also learn more about why [your debit card or credit card is declined at Azure sign-up](billing-credit-card-fails-during-azure-sign-up.md).

## "Free Trial is not available"
Have you used an Azure subscription in the past? The Azure Terms of Use agreement limits free trial activation only for a user that's new to Azure. If you have had any other type of Azure subscription, you can't activate a free trial.

### Suggestion
* Consider signing up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).

## Can’t activate Azure benefit plan like MSDN, BizSpark, BizSparkPlus, or MPN
Make sure you are using the right log-in credentials and verify through your benefit program channel if you are eligible for the chosen plan:

* MSDN
  * Verify your eligibility status in your [MSDN account page](https://msdn.microsoft.com/subscriptions/manage/default.aspx).
  * If you cannot verify your status, contact the [MSDN Subscriptions Customer Service Centers](https://msdn.microsoft.com/subscriptions/contactus.aspx)
* MPN
  * Sign in to the [MPN portal](https://mspartner.microsoft.com/en/us/Pages/Locale.aspx) and verify your eligibility status. If you have the appropriate [Cloud Platform Competencies](https://mspartner.microsoft.com/en/us/pages/membership/cloud-platform-competency.aspx), you may be eligible for additional benefits.
  * If you cannot verify your status, contact [MPN support](https://mspartner.microsoft.com/en/us/Pages/Support/Premium/contact-support.aspx).
* BizSpark
  * Sign in to the [BizSpark portal](https://www.microsoft.com/bizspark/default.aspx#start-two) and verify your eligibility status for BizSpark and BizSpark Plus.
  * If you cannot verify your status, you can [contact the BizSpark Team](mailto:bizspark@microsoft.com?subject=BizSpark%20Support&body=Thank%20you%20for%20contacting%20BizSpark.%20Please%20provide%20as%20much%20of%20the%20following%20information%20as%20possible,%20as%20it%20will%20help%20expedite%20our%20response%20to%20you.%0aContact%20name:%0aStartup%20name:%0aMicrosoft%20Account/Live%20ID:%0aSpecific%20description%20of%20issue%20experienced%20or%20question:%0a%0aThank%20you,%0a%0aThe%20BizSpark%20Team)

## Can’t activate new Azure In Open subscription
You must have a valid OSA key with at least one Azure In Open token associated to it to create a new Azure In Open subscription.

### Suggestion
If you do not have an OSA key, contact one of Microsoft Partners listed in [Microsoft Pinpoint](http://pinpoint.microsoft.com/).

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
