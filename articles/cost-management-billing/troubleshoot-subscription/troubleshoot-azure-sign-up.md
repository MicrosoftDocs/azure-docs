---
title: Troubleshoot issues when you sign up for a new account in the Azure portal
description: Resolving an issue when trying to sign up for a new account in the Azure portal.
services: cost-management-billing
author: diberry
ms.reviewer: anmckeon
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 11/18/2026
ms.author: jecru
ms.custom:
- build-2025
---

# Troubleshoot issues when you sign up for a new Azure account

This article explains what to expect when you sign up for Microsoft Azure and how to troubleshoot common issues that might prevent you from completing signup. The information requested and the order in which it appears can vary by offer, country or region, and account type.

> [!NOTE]
> If you already have an Azure account and need help signing in, see [Troubleshoot Azure subscription sign-in issues](/azure/cost-management-billing/troubleshoot-subscription/troubleshoot-sign-in-issue).

## Before you begin

Before signing up for Azure, ensure you have:

- The [Microsoft account or work or school account](https://support.microsoft.com/accounts-billing/manage/what-s-the-difference-between-a-microsoft-account-and-a-work-or-school-account) that you intend to use with Azure.

- Valid contact and address information.

- A supported payment method, if required for your offer.

- Company, tax, or registration information, if requested for your account type and country or region.

## Sign up for an Azure account

The following sections describe common signup tasks. You might not see every task or complete them in this order.

> [!NOTE]
> The signup experience can vary by [offer](https://azure.microsoft.com/pricing/offers/), country or region, and account type. Offers can have different benefits, eligibility requirements, and signup processes.

### Enter your account information

Enter the requested contact information. Depending on your offer and account type, the form might include:

- First and last name

- Email address

- Phone number

- Country or region

- Organization name

- Job title

You might also be asked whether you're creating an account for personal or organizational use. Depending on your account type and country or region, you might need to provide more information.

Select the country or region that matches your billing address. This selection is your billing location, not the Azure region where you deploy resources. If your country or region isn't listed, the selected offer isn't available in your location.

Follow the instructions to complete any security verification displayed on the page, and then select **Next**.

If you can't continue:

- Complete all required fields.

- Review any field-level validation messages.

- Confirm that your phone number and country code are correct.

- Make sure you selected the correct country or region.

- Ensure that you completed any required verification.

### Enter your address and review agreements

Enter your primary address. Depending on your country or region, you might need to provide:

- Street address

- City

- State or province

- Postal or ZIP code

- Country or region

The system uses your address to confirm your billing location and for billing, tax, and compliance purposes.

If the system doesn't accept your address:

- Check for spelling mistakes or missing information.

- Review any field-level validation messages.

- Ensure the postal code matches your city and state or province.

- Verify that your address matches the country or region you selected earlier.

Depending on your account type and country or region, you might need to provide more information.

Review the applicable terms and privacy statement before continuing. Depending on your country or region, you might accept the Microsoft Customer Agreement by selecting **Next** or be asked to explicitly acknowledge the terms. You can also manage optional communication preferences, such as receiving Microsoft product updates or information from selected partners.

Ensure your address is accurate and complete, and then select **Next**.

If you can't continue:

- Complete all required fields and acknowledgments.

- Review any field-level validation messages.

- Check that any required company or tax information is complete.

### Enter your payment information

Depending on your offer, you might need to provide a payment method during signup. Available payment methods vary by country or region.

Select one of the available options and enter the required information. If you already have an eligible payment method associated with your billing account, you can select it instead.

Your bank might require extra verification before Azure can accept your payment method. Verification might open in a separate bank verification window. If a separate window opens, complete the bank's instructions and return to the original signup window to continue. During payment verification, you might see a temporary authorization hold on your card. This hold is used to verify your payment method and is typically removed automatically.

Review your information and select **Next**.

If you can't continue:

- Check that you entered the payment information correctly.

- Confirm that the billing address matches the address held by your card issuer and the country or region you selected for signup.

- Make sure the payment method is supported in your country or region.

- Complete any extra verification requested by your bank.

- Review any field-level validation messages.

> [!NOTE]
> Azure Free Trial users aren't charged for Azure services during the trial unless you decide to move to pay-as-you-go pricing. By using pay-as-you-go, you pay only for services that you use above the free monthly amounts. [Learn more](https://azure.microsoft.com/free/).

### Complete your signup

After you submit the requested information and complete any required verification, Azure finishes setting up your account and subscription. You see a confirmation message when setup is complete. Follow the instructions on the screen to get started with Azure.

Some services and benefits might take a few minutes to become available after your subscription is created. If setup doesn't complete or you receive an error, see the troubleshooting guidance in the next section.

## Troubleshoot common signup errors

### You see the message “We cannot proceed with sign-up due to an issue with your account. Please contact billing support”

If you receive this message, verify that your account and billing information are accurate. For personal Microsoft accounts:

1. Sign in to the [Microsoft account center](https://account.microsoft.com/).
1. Select **Your info**.
1. Verify that your account information is complete and accurate.

1. Confirm that the billing address associated with your payment method matches your bank's records.

If the information is correct and you continue to receive the error, follow the instructions to contact billing support.

### Free trial isn't available

The Azure Free Trial is intended for customers who are new to Azure. If you previously had an Azure subscription, you might not be eligible for a Free Trial. Review the eligibility requirements for your selected offer. If you're not eligible, consider signing up for a [pay-as-you-go subscription](https://azure.microsoft.com/pricing/offers/ms-azr-0003p?cid=msft_learn).

### You see the message 'You are not eligible for an Azure subscription'

If you receive this message, verify that:

- Your contact information, including your email address, street address, and phone number, is accurate.

- Your payment information is correct, if required.

- You're using the intended Microsoft account or work or school account.

- You meet the eligibility requirements for your selected offer.

### You see the message 'Your current account type is not supported'

This issue can occur if the account is registered in an [unmanaged Microsoft Entra directory](/entra/identity/users/directory-self-service-signup), and it isn't in your organization's Microsoft Entra directory. To resolve this issue, sign up the Azure account by using another account, or take over the unmanaged AD directory. For more information, see [Take over an unmanaged directory as administrator in Microsoft Entra ID](/entra/identity/users/domains-admin-takeover).

This issue can also occur if you created the account by using the Microsoft 365 Developer Program. Microsoft doesn't allow purchasing other paid services by using your Microsoft 365 Developer Program subscription. For more information, see [Does the subscription also include a subscription to Azure?](/office/developer-program/microsoft-365-developer-program-faq)

### The Next button is disabled or signup doesn't continue

If **Next** is disabled or selecting it doesn't advance signup:

- Check that you completed all required fields and selections.

- Review any validation messages, including those associated with address, company, tax, or payment information.

- Complete any required security verification or acknowledgment.

- If a verification or processing message is displayed, wait for it to finish.

If **Next** is enabled but selecting it displays an error, follow the instructions in the error message. If the page remains unresponsive after you complete the required information, try another supported browser.

### A field is locked or can't be changed

Some information might be populated automatically from your Microsoft account or earlier signup selections. After you progress through certain parts of signup, some fields might become read-only.

To update supported billing details, see [Change contact information for an Azure billing account](/azure/cost-management-billing/manage/change-azure-account-profile).

### Your address, company information, or tax information isn't accepted

If Azure doesn't accept your information, review the fields highlighted on the page:

- Verify that your address and postal code match the selected country or region.

- Check the spelling and formatting of your company information.

- Review the field labels and help text for any required tax or registration identifiers.

- Ensure the information matches your organization's records, where applicable.

Some fields and validation requirements vary by country or region. For example, a tax identifier required in one country might not apply in another.

### Your credit card is declined or not accepted

You can't use virtual or prepaid cards to pay for Azure services. Other common causes include inaccurate card information, unsupported payment methods, or restrictions imposed by your card issuer. Verify that your card information is correct and that your card supports the required transactions. 

For more information, see [Troubleshoot a declined card at Azure sign-up](/azure/cost-management-billing/troubleshoot-billing/troubleshoot-declined-card).

### Credit card form doesn't support my billing address

Your billing address must be in the country or region you selected during signup. Verify that you selected the correct country or region and that your billing address matches the information associated with your payment method.

### Progress bar stops moving in payment information section

If the payment information page stops responding, your browser might be blocking content required to complete verification. Try the following steps:

- Check whether your browser or an extension is blocking cookies, pop-ups, or other content required by the signup or bank verification page.

- Allow the required content for the affected sites, where supported by your browser.

- Return to the signup page and check whether verification finishes.

- If the issue continues, restart your browser or try another supported browser.

If you already completed verification with your bank but Azure still displays an error, avoid repeatedly submitting your payment information. A successful bank verification doesn't necessarily mean Azure signup is complete.

### Your session expired or you're asked to sign in again

If your signup session expires or Azure asks you to sign in again, use the sign-in option displayed on the page. Sign in with the account you intend to use for Azure and complete any additional authentication requested. If you use multiple Microsoft accounts or work or school accounts, ensure you're signing in with the correct one.

### Your account is under review

If Azure displays a message indicating that your account is under review, follow the instructions on the screen. Your account might require extra verification before signup can be completed. If a status link or other follow-up instructions are provided, use them to check your progress. Avoid starting another signup while your account is under review.

### Azure subscription setup doesn't finish

After you submit your information, Azure might need more time to finish creating your subscription. If the page indicates that setup is still in progress:

- Wait for the current operation to finish.

- Follow any status or notification instructions displayed on the page.

- If you can access the Azure portal, check whether your subscription is created.

### Can't activate an Azure benefit

If you're signing up with an Azure benefit, ensure you're using the account associated with that benefit and meet its eligibility requirements. If Azure creates your subscription but your benefits aren't available yet, wait for them to become available. If Azure provides instructions to retry benefit activation or manage your benefits in the Azure portal, follow those instructions.

If your benefit still isn't available or activation fails, contact support for the applicable benefit program.

### I saw a charge on my free trial account

You might see a small, temporary authorization hold on your card after signing up for an Azure Free Trial. This hold verifies your payment method and isn't a charge for Azure services. The hold is typically removed automatically, although the timing can vary by card issuer. If you're concerned about managing costs, read more about [Analyzing unexpected charges](/azure/cost-management-billing/understand/analyze-unexpected-charges).

### Can't activate an Azure benefit plan

If you can't activate an Azure benefit through Visual Studio, Microsoft for Startups, or the Microsoft AI Cloud Partner Program, verify that you're using the correct account and that you meet the eligibility requirements for the benefit.

- Visual Studio
  - Verify your eligibility status on your [Visual Studio account page](https://my.visualstudio.com/Benefits).
  - If you can't verify your status, contact [Visual Studio Subscription Support](https://visualstudio.microsoft.com/subscriptions/support/).
- Microsoft for Startups
  - Sign in to the [Azure portal](https://portal.azure.com/) to verify your eligibility status for Microsoft for Startups.
  - If you can't verify your status, contact [Microsoft for Startups Support](/startups/microsoft-for-startups/mfs-faqs).
- Cloud Partner Program
  - Sign in to the [Cloud Partner Program portal](https://mspartner.microsoft.com/Pages/Locale.aspx) to verify your eligibility status. If you have the appropriate [Cloud Platform Competencies](https://mspartner.microsoft.com/pages/membership/cloud-platform-competency.aspx), you might be eligible for other benefits.
  - If you can't verify your status, contact [Cloud Partner Program Support](https://mspartner.microsoft.com/Pages/Support/Premium/contact-support.aspx).

### Can't activate new Azure In Open subscription

To create an Azure In Open subscription, you must have a valid Online Service Activation (OSA) key that has at least one Azure In Open token associated with it. If you don't have an OSA key, contact one of the Microsoft partners that's listed in [Microsoft Pinpoint](https://pinpoint.microsoft.com/).

## Other help resources

For more guidance, see:

- [Troubleshoot a declined card at Azure sign-up](/azure/cost-management-billing/troubleshoot-billing/troubleshoot-declined-card)

- [Change contact information for an Azure billing account](/azure/cost-management-billing/manage/change-azure-account-profile)

- [No subscriptions found error](/azure/cost-management-billing/troubleshoot-subscription/no-subscriptions-found)

- [Troubleshoot Azure subscription sign-in issues](/azure/cost-management-billing/troubleshoot-subscription/troubleshoot-sign-in-issue)

## Contact us for help

- Get answers in [Azure forums](https://azure.microsoft.com/support/forums/).
- Connect with [@AzureSupport](https://x.com/azuresupport).
- For other support options, visit [Azure Support](https://azure.microsoft.com/support/).

## Next steps

- Read the [Cost Management and Billing documentation](/azure/cost-management-billing/).
