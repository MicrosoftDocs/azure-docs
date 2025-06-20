---
title: Apply for 10 digit long code (10DLC) brand registration and campaign registration
titleSuffix: An Azure Communication Services article 
description: This article describes how to apply for 10 digit long code (10DLC) brand registration and campaign registration.
author: prakulka
manager: darmour
services: azure-communication-services

ms.author: prakulka
ms.date: 11/21/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: mode-other
---

# Apply for 10 digit long code (10DLC) brand registration and campaign registration

This article describes how to register a brand and campaign for 10DLC (10-Digit Long Code) messaging in Azure Communication Services. This process ensures compliance with carrier requirements and enables reliable, high-quality message delivery. For more information about how to complete the registration form, see [10DLC guidelines](../../concepts/sms/ten-digit-long-code-guidelines.md).

## Prerequisites

- [An active Communication Services resource.](../create-communication-resource.md).
- An eligible subscription: Check eligibility [here](../../concepts/numbers/phone-number-management-for-united-states.md).
- Company information: Information about your business, such as your company's legal name, tax ID, and other relevant details.
- Campaign details: A description of the use case and sample messages you plan to send through 10DLC.

## Schedule constraints

You need to complete brand registration and receive approval first. Then you can continue with campaign registration.

1. Brand registration may take 2 to 3 business days to receive approval.
2. Campaign registration may take 3 to 5 business days to receive approval.

## 10DLC registration

Navigate to the **Regulatory Documents** blade in your Azure Communication Services resource and select **Add** to start the 10DLC brand registration wizard.

:::image type="content" source="./media/apply-for-brand-registration/regulatory-screen-1.png" alt-text="Screenshot showing Regulatory Documents blade." lightbox="./media/apply-for-brand-registration/regulatory-screen-1.png":::

## STEP 1: Brand registration

You first need to choose country/region and phone number type you would like to get verified. You need to apply for brand and campaign registration before acquiring 10DLC numbers for SMS. If you previously acquired a 10DLC number for calling and want to enable it for SMS, then you need to first register the brand and campaign and then associate the number.

:::image type="content" source="./media/apply-for-brand-registration/brand-registration-1.png" alt-text="Screenshot showing brand registration form." lightbox="./media/apply-for-brand-registration/brand-registration-1.png":::

### Company details

In the brand registration form, provide details about your company:
   - **Company Name**: Your official registered business name.
   - **DBA or Brand Name**: Doing Business As (DBA) or brand name, if different.
   - **Website**: A website URL representing your business.
   - **Type of Legal Form**: Select the legal structure of your company (such as Private Company).
   - **EIN**: Employer Identification Number.
   - **EIN Issuing Country**: Country where your EIN was issued.
   - **Alternate ID**: Specify an alternate ID type (such as DUNS, GIIN, or LEI).
   - **DUNS or GIIN or LEI Number**: Enter the applicable ID number based on your alternate ID type.
   - **Company Address**: Primary address of your business.
   - **Address Line 2**: More address information, if needed.
   - **City**: City of the business location.
   - **State or Province**: State or province of the business location.
   - **Zip Code or Postal Code**: ZIP or postal code for the business location.
   - **Country**: Country where the business is located.
   - **Stock Symbol**: Stock symbol, if publicly listed.
   - **Stock Exchange**: Name of the stock exchange where your business is listed, if applicable.
   - **Vertical Type**: Business category (such as Education or Finance).
   - **Contact Email Address**: Contact email for inquiries related to the brand registration.
   - **Contact Phone Number**: Phone number for inquiries related to the brand registration.

:::image type="content" source="./media/apply-for-brand-registration/brand-registration-2.png" alt-text="Screenshot showing brand registration form 2." lightbox="./media/apply-for-brand-registration/brand-registration-2.png":::

### Review and submit

Submit the form for registration. Brand registration may take 2 to 3 days to complete.

:::image type="content" source="./media/apply-for-brand-registration/brand-registration-3.png" alt-text="Screenshot showing brand registration form 3." lightbox="./media/apply-for-brand-registration/brand-registration-3.png":::

> [!Important]
> Providing incorrect or incomplete information may result in brand registration failure. Double-check all details before submitting to avoid delays or rejections in the registration process.

## STEP 2: Campaign registration

After your brand is registered, proceed with the campaign registration:

Select **Add** and begin by filling in the **Application Type** details:
   - **Country or Region**: Select the country or region where you plan to run your campaign.
   - **Phone Number Type**: Choose the type of phone number for your campaign (such as Local).
   - **Application Type**: Select the campaign application type.

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-1.png" alt-text="Screenshot showing campaign registration form 1." lightbox="./media/apply-for-brand-registration/campaign-registration-1.png":::

Click **Next** to proceed to the **Campaign details** section.

### Campaign details

   - **Brand**: Select the brand associated with this campaign.
   - **Description**: Add a description for the campaign, explaining its purpose and target audience.
   - **Call-to-Action / Message Flow**: Describe how end users are expected to engage with this campaign (such as opt-in process, expected interaction).

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-2.png" alt-text="Screenshot showing campaign registration form 2." lightbox="./media/apply-for-brand-registration/campaign-registration-2.png":::

Click **Next** to proceed to the **Use Case** section

### Use cases

   - **Content Type**: Select the type of content you intend to send (such as Marketing or Customer Care).
   - **Sub-content Type**: Choose a more specific content category if applicable.
   - **Sample Message**: Provide a sample message that aligns with the campaign's use case. You can add multiple sample messages if needed by clicking **Add Sample Message**.

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-3.png" alt-text="Screenshot showing campaign registration form 3." lightbox="./media/apply-for-brand-registration/campaign-registration-3.png":::

After completing the **Use Case** tab, proceed to the **Campaign and Content Attributes** tab:

### Campaign and content attributes

Fill in the campaign and content attributes as follows:
   - **Subscriber Opt-in**: Select **Yes** or **No** to indicate if subscriber opt-in is required.
   - **Subscriber Opt-in Message**: If **Yes** is selected, enter the message for subscribers to receive when opting into the campaign.
   - **Subscriber Opt-out**: Select **Yes** or **No** to indicate if subscribers can opt out.
   - **Subscriber Opt-out Answer**: If **Yes** is selected, enter the response message for subscribers to receive when opting out.
   - **Subscriber Help**: Select **Yes** or **No** to indicate if subscriber help is available.
   - **Subscriber Help Answer**: If **Yes** is selected, provide the message for subscribers seeking assistance.

#### More attributes

   - **Direct Lending or Loan Arrangement**: Indicate if the campaign involves any lending or loan arrangements.
   - **Embedded Link**: Select **Yes** or **No** to specify if the campaign includes an embedded link.
   - **Embedded Phone Number**: Select **Yes** or **No** to specify if a phone number is embedded within the campaign content.
   - **Age-gated Content**: Select **Yes** or **No** to indicate if the content is age-restricted.

### SMS Campaign Terms and conditions

When registering a campaign, you must provide a link to your brand's Terms & Conditions related to SMS. The Terms & Conditions URL can be a webpage or an online file that is publicly accessible.

If your company doesn't have a privacy statement related to SMS messaging, you can use a Microsoft-provided template, completed with your company's information. For the template, see SMS privacy statement and terms and conditions template.

The Terms and Conditions must have an SMS disclosure that includes the types of messages consumers can expect to receive, texting cadence, message and data rate notices, privacy policy links, HELP information, and opt-out instructions.

The Terms & Conditions must include the following information:

- Brand name

- Types of messages the consumer can expect to receive

- Message frequency disclosure (for example, "Msg frequency varies")

- Message and data rates disclosure (for example, "Msg & data rates may apply")

- Support contact information (for example, "send HELP for support," "contact help@contoso.com for support")

- Opt-out information (for example, "Send STOP to unsubscribe")

Affiliate marketing isn't permitted on 10DLC numbers. Check the box to confirm that the campaign will not be used for Affiliate Marketing.

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-4.png" alt-text="Screenshot showing campaign registration form 4." lightbox="./media/apply-for-brand-registration/campaign-registration-4.png":::

Once all fields are completed, click **Next** to proceed to the **Review** tab.

> [!Important]
> Providing accurate information in the attributes section ensures compliance with regulatory requirements and reduces the risk of rejection.

#### TEMPLATE: Privacy policy with terms and conditions for SMS

How to use this template: SMS providers in the US require that the initial message to an SMS recipient must include a link to reference the following assets from your company:

- Terms and conditions
- Privacy policy
- Information about how to get help

Senders are also required to provide the recipient with certain terms specific to the use of an SMS service.

To simplify these requirements, many senders find it useful to have a single webpage that includes all relevant terms, information, and required links in one place—that way, only one link needs to be included in the initial message to the recipient.

This SMS Terms of Use Template includes relevant SMS terms and placeholders where you can insert links to your general terms and conditions, privacy policy, and help information.

> [!Important]
> DISCLAIMER: This template is for informational purposes only and isn't intended as, and should not be substituted for, consultation with appropriate legal counsel and/or your organization's regulatory compliance team. This template is applicable only to approved uses of SMS from Azure Communication Services. Appropriate terms may vary depending on how you use this service and the nature of your business, and we recommend seeking legal counsel to ensure compliance with all applicable regulatory and legal obligations.

##### SMS Terms of use

[COMPANY NAME] TEXT MESSAGING TERMS OF USE

By "Opting In" to or using a “Text Message Service” (as defined below) from [COMPANY NAME], you accept these Terms & Conditions. [IF APPLICABLE: THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED BELOW.]

This agreement is between you and [COMPANY NAME] or one of its affiliates. All references to "[COMPANY NAME]," "we," "our," or "us" refer to [COMPANY NAME], [COMPANY ADDRESS].

DEFINITIONS

"Opting In," "Opt In," and "Opt-In" refer to requesting, joining, agreeing to, enrolling in, signing up for, acknowledging, responding to, or otherwise consenting to receive one or more text messages.

"Text Message Service" includes any arrangement or situation in which we send one or more messages addressed to your mobile phone number, including text messages (such as SMS, MMS, or successor protocols or technologies).

CONSENTING TO TEXT MESSAGING

By consenting to receive text messages from us, you agreed to these Text Messaging Terms and Conditions, as well as our [LINK TO GENERAL T&Cs] and [LINK TO PRIVACY POLICY], incorporated herein by reference.

E-SIGN DISCLOSURE

By agreeing to receive text messages, you also consent to the use of an electronic record to document your agreement. You may withdraw your consent to the use of the electronic record by replying STOP.

[COMPANY NAME] TEXT MESSAGE SERVICE PRIVACY POLICY

We respect your privacy. We only use information you provide through this service to transmit your mobile messages and respond to you. This includes, but isn't limited to, sharing information with platform providers, phone companies, and other vendors who assist us in the delivery of mobile messages. Mobile information will not be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties. Nonetheless, we reserve the right always to disclose any information as necessary to satisfy any law, regulation or governmental request, to avoid liability, or to protect our rights or property. This Text Message Service Privacy Policy applies to your use of the Text Message Service and isn't intended to modify our general [“Privacy Policy” OR RELEVANT NAME OF PRIVACY POLICY REFERENCED IN SECTION ABOVE], incorporated by reference above, which may govern the relationship between you and us in other contexts.

COSTS OF TEXT MESSAGES

We do not charge you for the messages you send and receive via this text message service. But message and data rates may apply, so depending on your plan with your wireless or other applicable provider, you may be charged by your carrier or other applicable provider.

FREQUENCY OF TEXT MESSAGES

This Text Messaging Service is for conversational person-to-person communication between you and our employees. We may send you an initial message providing details about the service. After that, the number of text messages you receive will vary depending on how you use our services and whether you take steps to generate more text messages from us (such as by sending a HELP request).

OPTING OUT OF TEXT MESSAGES

If you no longer want to receive text messages, you may reply to any text message with STOP, QUIT, END, REVOKE, OPT OUT, CANCEL, or UNSUBSCRIBE. As a person-to-person communication service, opt-out requests are specific to each conversation between you and one of our employees and their associated phone number. After unsubscribing, we may send you confirmation of your opt-out via text message.

CONTACT US

For support, [EMAIL ADDRESS OR PHONE NUMBER AND, IF AVAILABLE, SUPPORT PAGE].

[BINDING ARBITRATION, CLASS ACTION WAIVER, AND SEVERABILITY CLAUSES, IF APPLICABLE]

### Review and submit

Review all information on the **Review** tab and submit your campaign registration. Campaign registration may take 3 to 5 business days.

## STEP 3: Check the status of brand and campaign registration

After submitting your brand and campaign registration, you can check the status in the **Regulatory Documents** blade. Follow these steps:

1. **Open the Regulatory Documents Blade**:
   - Go to the **Azure Communication Services** portal.
   - In the left navigation pane, select **Regulatory Documents**.

2. **View Brand Status**:
   - Under the **Brand Registration** section, locate your brand name.
   - The status displays as one of these:
     - **Pending**: Your brand registration is under review.
     - **Approved**: Your brand registration is approved, and you may proceed with campaign registration.
     - **Rejected**: Your brand registration was rejected. Review the reason provided, make any necessary updates, and resubmit.

3. **View Campaign Status**:
   - In the **Campaign Registration** section of the Regulatory Documents blade, find the campaign you submitted.
   - Campaign status options include:
     - **Pending**: Your campaign is under review.
     - **Approved**: Your campaign is approved, and you're authorized to start messaging.
     - **Rejected**: Your campaign was rejected. Check the details for the reason, make corrections, and resubmit as needed.

Using the **Regulatory Documents** blade to monitor the status of your brand and campaign registration enables you to stay informed and quickly address any issues to keep your messaging operations uninterrupted.

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-status.png" alt-text="Screenshot showing campaign registration status." lightbox="./media/apply-for-brand-registration/campaign-registration-status.png":::

## STEP 4: Linking a phone number to an approved campaign

Once your campaign is approved, follow these steps to link a phone number to it:

1. **Access the Phone Numbers Blade**:
   - Go to the **Azure Communication Services** portal.
   - Select **Phone Numbers** from the left navigation pane.

2. **Select the Phone Number**:
   - Choose the phone number you want to associate with the approved campaign by clicking on it.

3. **Set SMS Capability and Campaign**:
   - Under **Features**, select **Send SMS** or **Send and receive SMS** as needed.
   - In the **Campaign** section, select the appropriate campaign ID from the dropdown list.

4. **Save Changes**:
   - Click **Save** to apply the settings.

> [!Important]
> It may take several hours for the number to be fully associated with the campaign. Please check back after some time to confirm that the association is complete.

:::image type="content" source="./media/apply-for-brand-registration/link-number-to-campaign.png" alt-text="Screenshot showing number to campaign linking." lightbox="./media/apply-for-brand-registration/link-number-to-campaign.png":::

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending SMS](../../quickstarts/sms/send.md)

## Related articles

- Check SMS FAQ for questions regarding [SMS](../../concepts/sms/sms-faq.md).
- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md).
- Get an SMS capable [phone number](../../quickstarts/telephony/get-phone-number.md).
- Learn about [SMS number types](../../concepts/sms/sms-number-types.md).
