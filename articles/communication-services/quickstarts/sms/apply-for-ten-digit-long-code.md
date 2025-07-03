---
title: Apply for 10DLC Brand Registration and Campaign Registration
titleSuffix: An Azure Communication Services article 
description: This article describes how to apply for 10-digit long code (10DLC) brand registration and campaign registration.
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

# Apply for 10DLC brand registration and campaign registration

This article describes how to register a brand and campaign for 10-digit long code (10DLC) messaging in Azure Communication Services. This process ensures compliance with carrier requirements and enables reliable, high-quality message delivery. For more information about how to complete the registration form, see [10DLC registration guidelines](../../concepts/sms/ten-digit-long-code-guidelines.md).

You need to complete brand registration and receive approval first. Approval of brand registration might take two to three business days. Then you can continue with campaign registration, which might take three to five business days.

You need to apply for brand and campaign registrations before you acquire 10DLC numbers for SMS. If you previously acquired a 10DLC number for calling and want to enable it for SMS, you need to first register the brand and campaign and then associate the number.

> [!NOTE]
> 10DLC for SMS is available only in the United States.

## Prerequisites

- [An active Communication Services resource](../create-communication-resource.md).
- An eligible subscription. [Check eligibility](../../concepts/numbers/phone-number-management-for-united-states.md).
- Company information. Gather information about your business, such as your company's legal name, tax ID, and other relevant details.
- Campaign details. Prepare a description of the use case and sample messages that you plan to send through 10DLC.

## Step 1: Complete brand registration

### Start the brand registration wizard

1. In the Azure portal, go to your Azure Communication Services resource.

1. Under **Telephony and SMS**, select **Regulatory Documents**.

1. On the **Regulatory Documents** pane, select **Add** to start the 10DLC brand registration wizard.

   :::image type="content" source="./media/apply-for-brand-registration/regulatory-screen-1.png" alt-text="Screenshot that shows the Regulatory Documents pane." lightbox="./media/apply-for-brand-registration/regulatory-screen-1.png":::

### Enter application details

Begin your brand registration by filling in the details on the **Application Type** tab:

- **Country or region**: Select **United States of America**.
- **Phone number type**: Select **Local** to choose the local phone number for your campaign.
- **Application type**: Select **Brand**.

:::image type="content" source="./media/apply-for-brand-registration/brand-creation-ga-1.png" alt-text="Screenshot that shows the Application Type tab in the brand registration form." lightbox="./media/apply-for-brand-registration/brand-creation-ga-1.png":::

### Enter company details

On the **Company Details** tab, provide details about your company:

- **Company Name**: Enter your registered business name.
- **DBA or Brand Name, if different**: Enter your Doing Business As (DBA) or brand name, if it's different from your registered business name.
- **Website**: Enter a website URL that represents your business.
- **Type of legal form**: Select the legal structure of your company (such as **Private Company**).
- **EIN issuing country/region**: Select the country or region where your employer identification number (EIN) was issued.
- **EIN**: Enter your EIN.
- **Alternate ID (DUNS or GIIN or LEI)**: Specify an alternate ID type, such as Data Universal Numbering System (DUNS), global intermediary identification number (GIIN), or legal entity identifier (LEI).
- **DUNS or GIIN or LEI number**: Enter the applicable ID number based on your alternate ID type.
- **Company address**: Enter the primary address of your business.
- **Address line 2**: Enter more address information, if necessary.
- **City**: Enter the city of the business location.
- **State or province**: Select the state or province of the business location.
- **Zip code or postal code**: Enter the ZIP Code or postal code for the business location.
- **Country/Region**: Select the country where the business is located.
- **Stock symbol**: Enter the stock symbol, if it's publicly listed.
- **Stock exchange**: Select the name of the stock exchange where your business is listed, if applicable.
- **Vertical Type**: Select the business category (such as **Education** or **Finance**).
- **Contact email address**: Enter a contact email address for inquiries related to the brand registration.
- **Contact phone number**: Enter a phone number for inquiries related to the brand registration.

:::image type="content" source="./media/apply-for-brand-registration/brand-registration-2.png" alt-text="Screenshot that shows the Company Details tab in the brand registration form." lightbox="./media/apply-for-brand-registration/brand-registration-2.png":::

### Review and submit

On the **Review** tab, confirm that the information is correct. Then select **Submit**.

:::image type="content" source="./media/apply-for-brand-registration/brand-creation-ga-3.png" alt-text="Screenshot that shows the Review tab in the brand registration form." lightbox="./media/apply-for-brand-registration/brand-creation-ga-3.png":::

> [!IMPORTANT]
> Providing incorrect or incomplete information might result in brand registration failure. Double-check all details before submitting to avoid delays or rejections in the registration process.

## Step 2: Complete campaign registration

After your brand is registered, proceed with the campaign registration.

### Start the campaign registration wizard

1. In the Azure portal, go to your Azure Communication Services resource.

1. Under **Telephony and SMS**, select **Regulatory Documents**.

1. On the **Regulatory Documents** pane, select **Add** to start the campaign registration wizard.

### Enter details about the application type

On the **Application Type** tab, fill in these details:

- **Country or region**: Select **United States of America**.
- **Phone number type**: Select **Local** to choose the local phone number for your campaign.
- **Application Type**: Select **Campaign**.

:::image type="content" source="./media/apply-for-brand-registration/campaign-creation-ga-1.png" alt-text="Screenshot that shows the Application Type tab in the campaign registration form." lightbox="./media/apply-for-brand-registration/campaign-creation-ga-1.png":::

### Enter campaign details

On the **Campaign details** tab, enter these values:

- **Brand**: Enter the brand name associated with this campaign.
- **Name**: Add a customized name for the campaign.
- **Description**: Add a description for the campaign to explain its purpose and target audience.
- **Call-to-action / Message flow**: The call to action clearly and transparently describes how a recipient opts in to receive messages from you. The call to action must be explicit, must ensure that users understand what they're consenting to, and must be collected in a direct and verifiable way. It should be specific to SMS messaging services and not bundled with other services. It shouldn't be hidden within terms and conditions or other agreements.

  The call to action must include the following information:

  - Brand name
  - Types of messages that the consumer can expect to receive
  - Message frequency disclosure (for example, "Msg frequency varies")
  - Message and data rates disclosure (for example, "Msg & data rates may apply")
  - Opt-in information, as described in the following table
  - Help information (for example, "send HELP for help")
  - Opt-out information (for example, "send STOP to unsubscribe")
  - Links to the privacy policy and to terms and conditions

  The following table shows examples of how recipients might opt in:

  | Method               | Description                                                                                   | Requirement                                                                                      | Example |
  |--------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|--------------|
  | Web sign-up          | Users enter their phone number on a website and select a box for agreeing to receive messages.        | Provide a direct link to the submission form or the webpage.                                          | "By submitting this form, you consent to receive [type of text messages] from [Brand Name] at the number provided. Msg & data rates may apply. Msg frequency varies. Unsubscribe by replying STOP or clicking the unsubscribe link. Reply HELP for help. Phone numbers aren't shared with third parties. Privacy Policy [link] & Terms [link]." |
  | Text message keyword | Users opt in by texting a keyword (for example, **START**) to a specific number.                    | Explain how users learn about the keyword, such as a webpage link or a screenshot.                  | "By texting START to [phone number], you consent to receive text messages from [Brand Name]. Msg & data rates may apply. Msg frequency varies. Unsubscribe by replying STOP. Reply HELP for help. Phone numbers won't be shared with third parties. Privacy Policy [link] & Terms [link]." |
  | Verbal             | Users opt in verbally at a physical location or over the phone.                                   | Provide a copy of the script that informs users about the opt-in.                                   | "[Brand name] collects opt-in verbally at their locations or over the phone. Customers provide their number and are informed that 'Message and data rates may apply', 'Message frequency varies', and they can 'text HELP for support or STOP to unsubscribe.' Phone numbers won't be shared with third parties. Privacy Policy [link] & Terms [link]." |

- **Privacy Policy URL**: Provide a link to your brand's privacy policy related to SMS. The URL can be a webpage or an online file that's publicly accessible.

- **Terms and conditions URL**: Provide a link to your brand's terms and conditions related to SMS. The URL can be a webpage or an online file that's publicly accessible.

  The terms and conditions must have an SMS disclosure that includes the types of messages that consumers can expect to receive, texting cadence, message and data rates notices, privacy policy links, help information, and opt-out instructions. The terms and conditions must include at least the following information:

  - Brand name
  - Types of messages the consumer can expect to receive
  - Message frequency disclosure (for example, "Msg frequency varies")
  - Message and data rates disclosure (for example, "Msg & data rates may apply")
  - Support contact information (for example, "send HELP for support," "contact `help@contoso.com` for support")
  - Opt-out information (for example, "Send STOP to unsubscribe")

  :::image type="content" source="./media/apply-for-brand-registration/campaign-creation-ga-2.png" alt-text="Screenshot that shows the tab for campaign details in the campaign registration form." lightbox="./media/apply-for-brand-registration/campaign-creation-ga-2.png":::

#### Template

SMS senders in the United States are required to include a link to reference terms and conditions, a privacy policy, and information about how to get help in the initial message to an SMS recipient.

If your company doesn't have a privacy statement related to SMS messaging, you can use the following Microsoft-provided template and complete it with your company's information. This template includes relevant SMS terms and placeholders where you can insert links to your general terms and conditions, privacy policy, and help information.

> [!NOTE]
> This template is for informational purposes only. It isn't intended as, and should not be substituted for, consultation with appropriate legal counsel and/or your organization's regulatory compliance team. This template is applicable only to approved uses of SMS from Azure Communication Services. Appropriate terms might vary depending on how you use this service and the nature of your business. We recommend that you seek legal counsel to ensure compliance with all applicable regulatory and legal obligations.

```
   TEMPLATE: SMS Terms of use
   
   [COMPANY NAME] TEXT MESSAGING TERMS OF USE
   
   By "Opting In" to or using a "Text Message Service" (as defined below) from [COMPANY NAME], you accept these Terms & Conditions. [IF APPLICABLE: THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED BELOW.]
   
   This agreement is between you and [COMPANY NAME] or one of its affiliates. All references to "[COMPANY NAME]," "we," "our," or "us" refer to [COMPANY NAME], [COMPANY ADDRESS].
   
   DEFINITIONS
   
   "Opting In," "Opt In," and "Opt-In" refer to requesting, joining, agreeing to, enrolling in, signing up for, acknowledging, responding to, or otherwise consenting to receive one or more text messages.
   
   "Text Message Service" includes any arrangement or situation in which we send one or more messages addressed to your mobile phone number, including text messages (such as SMS, MMS, or successor protocols or technologies).
   
   CONSENTING TO TEXT MESSAGING
   
   By consenting to receive text messages from us, you agreed to these Text Messaging Terms and Conditions, as well as our [LINK TO GENERAL T&Cs] and [LINK TO PRIVACY POLICY], incorporated herein by reference.
   
   E-SIGN DISCLOSURE
   
   By agreeing to receive text messages, you also consent to the use of an electronic record to document your agreement. You may withdraw your consent to the use of the electronic record by replying STOP.
   
   [COMPANY NAME] TEXT MESSAGE SERVICE PRIVACY POLICY
   
   We respect your privacy. We only use information you provide through this service to transmit your mobile messages and respond to you. This includes, but isn't limited to, sharing information with platform providers, phone companies, and other vendors who assist us in the           delivery of mobile messages. Mobile information will not be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.       Nonetheless, we reserve the right always to disclose any information as necessary to satisfy any law, regulation or governmental request, to avoid liability, or to protect our rights or property. This Text Message Service Privacy Policy applies to your use of the Text Message       Service and isn't intended to modify our general ["Privacy Policy" OR RELEVANT NAME OF PRIVACY POLICY REFERENCED IN SECTION ABOVE], incorporated by reference above, which may govern the relationship between you and us in other contexts.
   
   COSTS OF TEXT MESSAGES
   
   We do not charge you for the messages you send and receive via this text message service. But message and data rates may apply, so depending on your plan with your wireless or other applicable provider, you may be charged by your carrier or other applicable provider.
   
   FREQUENCY OF TEXT MESSAGES
   
   This Text Messaging Service is for conversational communication between you and [COMPANY NAME]. We may send you an initial message providing details about the service. After that, the number of text messages you receive will vary depending on how you use our services and            whether you take steps to generate more text messages from us (such as by sending a HELP request).
   
   OPTING OUT OF TEXT MESSAGES
   
   If you no longer want to receive text messages, you may reply to any text message with STOP, QUIT, END, REVOKE, OPT OUT, CANCEL, or UNSUBSCRIBE. Opt-out requests are specific to each conversation between you and [COMPANY NAME]. After unsubscribing, we may send you                   confirmation of your opt-out via text message.
   
   CONTACT US
   
   For support, [EMAIL ADDRESS OR PHONE NUMBER AND, IF AVAILABLE, SUPPORT PAGE].
   
   [BINDING ARBITRATION, CLASS ACTION WAIVER, AND SEVERABILITY CLAUSES, IF APPLICABLE]
```

### Enter a use case

On the **Use case** tab, enter the following information:

- **Content Type**: Select the type of content that you intend to send (such as **Marketing** or **Customer Care**).
- **Sub-content Type**: Choose a more specific content category if applicable.
- **Sample messages**: Provide sample messages that align with the campaign's use case. You can add multiple sample messages, if necessary, by selecting **Add sample message**. Sample messages must include the following information:

  - Brand name
  - Opt-out language in at least one sample message
  - An embedded link in at least one sample message if you select **Yes** for **Embedded link** on the **Campaign and content attributes** tab

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-3.png" alt-text="Screenshot that shows the tab for use case in the campaign registration form." lightbox="./media/apply-for-brand-registration/campaign-registration-3.png":::

### Enter campaign and content attributes

On the upper part of the **Campaign and content attributes** tab, fill in the following information:

- **Subscriber opt-in**: Select **Yes** or **No** to indicate if subscriber opt-in is required.
- **Subscriber opt-in message**: If you selected **Yes** for **Subscriber opt-in**, enter the message for subscribers to receive when they opt in to the campaign. This message must include the following information:

  - Brand name
  - Message frequency disclosure (for example, "Msg frequency varies")
  - Message and data rates disclosure (for example, "Msg & data rates may apply")
  - Help information (for example, "send HELP for help")
  - Opt-out information (for example, "send STOP to unsubscribe")

  An example might look like this:

  *Thank you for opting in to receive [type of messages] from [Brand Name]. Msg frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to opt out from receiving messages from this number. Send START to resume a conversation.*
- **Subscriber opt-out**: Select **Yes** or **No** to indicate if subscribers can opt out.
- **Subscriber opt-out message**: If you selected **Yes** for **Subscriber opt-out**, enter the response message for subscribers to receive when they opt out. This message must include the following information:

  - Brand name
  - Confirmation that the recipient will receive no further messages

  An example might look like this:

  *You have successfully opted out of messages from this [Brand Name] number. You'll receive no further messages. Reply START to resume. Msg & data rates may apply.*
- **Subscriber help**: Select **Yes** or **No** to indicate if subscriber help is available.
- **Subscriber help answer**: If you selected **Yes** for **Subscriber help**, provide the message for subscribers who seek assistance. The help message must include the following information:

  - Brand name
  - Support contact information (for example, an email address, phone number, or website)

  An example might look like this:

  *Thank you for contacting [Brand Name] support. Please email us at [email address] for support. Reply STOP to opt-out from receiving messages from this number. Msg & data rates may apply.*

> [!NOTE]
> Make opt-in, opt-out, and help messages clear and compliant. Only the keywords **START**, **HELP**, and **STOP**, **QUIT**, **END**, **REVOKE**, **OPT OUT**, **CANCEL**, and **UNSUBSCRIBE** are monitored and enforced.

:::image type="content" source="./media/apply-for-brand-registration/campaign-creation-4.png" alt-text="Screenshot that shows the attributes in the upper part of the tab for campaign and content attributes in the campaign registration form." lightbox="./media/apply-for-brand-registration/campaign-creation-4.png":::

On the lower part of the **Campaign and content attributes** tab, fill in these attributes:

- **Direct lending or Loan arrangement**: Select **Yes** or **No** to indicate if the campaign involves any lending or loan arrangements.
- **Embedded link**: Select **Yes** or **No** to indicate if embedded links are sent in messages. Public URL shorteners (Bitly and TinyURL) aren't accepted. If you select **Yes**, at least one sample message must include an embedded link.
- **Embedded phone number**: Select **Yes** or **No** to indicate if embedded phone numbers are sent in messages, excluding the help contact. If you select **Yes**, at least one sample message must include an embedded phone number.
- **Age-gated content**: Select **Yes** or **No** to indicate if the content is age-restricted.
- **Terms and conditions**: Affiliate marketing isn't permitted on 10DLC numbers. Select the checkbox to confirm that you won't use the campaign for affiliate marketing.

:::image type="content" source="./media/apply-for-brand-registration/campaign-creation-5.png" alt-text="Screenshot that shows the attributes in the lower part of the tab for campaign and content attributes in the campaign registration form." lightbox="./media/apply-for-brand-registration/campaign-creation-5.png":::

> [!IMPORTANT]
> Providing accurate information in the attributes section helps ensure compliance with regulatory requirements and reduces the risk of rejection.

### Review and submit

Review all information on the **Review** tab, and then select **Submit**.

## Step 3: Check the status of brand and campaign registrations

After you submit your brand and campaign registrations, you can check the status on the **Regulatory Documents** pane. Follow these steps:

1. In the Azure portal, go to your Azure Communication Services resource.

2. Under **Telephony and SMS**, select **Regulatory Documents**.

3. On the **Regulatory Documents** pane, find your brand name. One of these statuses appears:

   - **Pending**: Your brand registration is under review.
   - **Approved**: Your brand registration is approved, and you can proceed with campaign registration.
   - **Rejected**: Your brand registration was rejected. Review the provided reason, make any necessary updates, and resubmit.

4. Find the campaign that you submitted. One of these statuses appears:

   - **Pending**: Your campaign is under review.
   - **Approved**: Your campaign is approved, and you're authorized to start messaging.
   - **Rejected**: Your campaign was rejected. Check the details for the reason, make corrections, and resubmit as needed.

Using the **Regulatory Documents** pane to monitor the status of your brand and campaign registrations keeps you informed. You can quickly address any problems to keep your messaging operations uninterrupted.

:::image type="content" source="./media/apply-for-brand-registration/campaign-registration-status.png" alt-text="Screenshot that shows the status of brand registration and campaign registration." lightbox="./media/apply-for-brand-registration/campaign-registration-status.png":::

## Step 4: Link a phone number to an approved campaign

After your campaign is approved, follow these steps to link a phone number to it:

1. In the Azure portal, go to your Azure Communication Services resource.

2. Under **Telephony and SMS**, select **Phone numbers**.

3. Select the phone number that you want to associate with the approved campaign.

4. Under **Features**, select **Send SMS** or **Send and receive SMS** as needed.

5. In the **Campaign** dropdown list, select the appropriate campaign ID.

6. Select **Save** to apply the settings.

> [!IMPORTANT]
> It might take several hours for the number to be fully associated with the campaign. Check back after some time to confirm that the association is complete.

:::image type="content" source="./media/apply-for-brand-registration/link-number-to-campaign.png" alt-text="Screenshot that shows selections for linking a phone number to a campaign." lightbox="./media/apply-for-brand-registration/link-number-to-campaign.png":::

## Next step

> [!div class="nextstepaction"]
> [Send an SMS message](../../quickstarts/sms/send.md)

## Related content

- Check the [SMS FAQ](../../concepts/sms/sms-faq.md).
- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md).
- Get an SMS-capable [phone number](../../quickstarts/telephony/get-phone-number.md).
- Learn about [SMS number types](../../concepts/sms/sms-number-types.md).
