---
title: SMS FAQ
titleSuffix: An Azure Communication Services article
description: Get answers to frequently asked questions about SMS.
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 3/22/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---

# SMS FAQ

This article answers commonly asked questions about SMS in Azure Communication Services.

## 10DLC

### What is a 10DLC number?

A 10-digit long code (10DLC) number is a standard 10-digit phone number used for application-to-person (A2P) messaging in the United States. A 10DLC number is designed for businesses to send SMS messages to customers at scale, without the restrictions of traditional long codes.

### Can I use 10DLC numbers in any country?

No. 10DLC is primarily supported in the United States. Availability depends on the subscription billing location and eligibility. For more information about supported countries, see [Phone number management for the United States](../../concepts/numbers/phone-number-management-for-united-states.md).

### I already have a local US number. Can I use it for SMS?

Yes. If you already have a local US number, you can use it for SMS messaging. You need to submit a brand registration and campaign registration before you can enable the SMS capability on it. For more information, see [Apply for 10DLC brand registration and campaign registration](../../quickstarts/sms/apply-for-ten-digit-long-code.md).

### What are the advantages of using 10DLC numbers over short codes?

- **Cost-effectiveness**: 10DLC numbers are more affordable than short codes for A2P messaging.
- **Wide coverage**: 10DLC numbers can be used for messaging across all major US carriers to provide reliable delivery at scale.
- **No need for dedicated short codes**: 10DLC numbers don't require more approvals or significant setup costs, unlike short codes.

### Can 10DLC numbers be used for voice calls?

Yes. 10DLC numbers are local numbers that are voice-enabled. When they're registered, they can be used for SMS. 10DLC registration applies only to SMS enablement and isn't required for calling.

### What kinds of messages can be sent from a 10DLC number?

Business can use 10DLC numbers for a wide range of communications, including:

- Customer service notifications.
- Marketing and promotional messages.
- Alerts and reminders.
- Two-factor authentication codes.

However, 10DLC numbers must adhere to messaging guidelines and can't be used for illegal or spam purposes.

### Are 10DLC numbers subject to throughput limits?

Yes, 10DLC numbers are subject to throughput limits. Throughput limits can vary, depending on the carrier and the volume of sent messages.

These limits are higher than for traditional long codes but are lower than for short codes. The actual throughput might change due to factors such as campaign registration and compliance with carrier guidelines.

### Can I port my existing number to a 10DLC number?

Yes, you can port an existing phone number to a 10DLC number. Follow the instructions in [Port a phone number](../../quickstarts/telephony/port-phone-number.md).

### What happens if I send unsolicited messages from a 10DLC number?

Sending unsolicited messages (also known as spam) can lead to penalties, including the suspension of your 10DLC number or carrier blocking. To avoid these issues, you need to comply with applicable laws, including the Telephone Consumer Protection Act (TCPA) and carrier guidelines.

### Can 10DLC numbers be used for international messaging?

10DLC numbers are designed for use within the United States and don't support international messaging.

### How can I monitor the performance of my 10DLC number?

You can monitor the performance of your 10DLC number (such as delivery rates, message throughput, and errors) by using the [SMS insights dashboard](../analytics/insights/sms-insights.md).

### Can I use 10DLC numbers for high-volume messaging?

10DLC numbers are suitable for high-volume messaging, but they're subject to carrier rate limiting and compliance guidelines. To ensure optimal performance, it's important to work with your provider to manage message volume and adhere to best practices for A2P messaging.

### What is brand registration, and why is it required for 10DLC messaging?

Brand registration is the process of registering your business as a recognized brand with carriers to send SMS messages by using 10DLC. Carriers require brand registration to ensure compliance with messaging regulations and to prevent spam.

### How do I complete brand registration with Azure Communication Services?

To register a brand, you need to provide information such as your business's name, tax ID, address, industry, and other identifying information. You can complete brand registration through the Azure portal, as described in [Apply for 10DLC brand registration and campaign registration](../../quickstarts/sms/apply-for-ten-digit-long-code.md).

### What types of information are required for brand registration?

You need to provide:

- Legal business name
- Business address
- Tax ID or employer identification number (EIN)
- Industry type
- Contact information
- Business website (if applicable)

### Can I update my brand information after registration?

This feature is currently not available. We advise you to [email the Microsoft team for Azure Communication Services telephone number services](mailto:acstns@microsoft.com) for further guidance.

### Is there a fee for brand registration?

Yes, there's a fee. For details on fees, refer to [SMS pricing](../sms-pricing.md).

### What is vetting, and when is it required?

Vetting is a review process to evaluate your brand's trustworthiness and assign it a score, which influences messaging throughput limits. Vetting is required if your brand's use case involves high-volume messaging or falls into certain categories that need more carrier review.

### How is the vetting score determined?

The vetting score is based on the information that you provide during brand registration. It includes factors like industry reputation, message content, and business type. Scores range from 1 to 100. Higher scores result in higher limits for messaging throughput.

### What types of brands are supported?

- **Standard**: For most businesses and organizations that have an EIN. Supports multiple campaigns and higher throughput.
- **Sole Proprietor**: For individuals or small businesses that don't have an EIN. Limited to one campaign and low message volume. Requires alternative identity verification, like a mobile phone bill.

### What types of campaigns are supported?

Currently, Azure Communication Services supports:

- **Standard**: The most common campaign type for general A2P messaging, such as two-factor authentication, alerts, marketing, or customer care.
- **Low Volume**: For limited or test messaging with low daily traffic. Ideal for small businesses or developers.
- **UCaaS (Low Volume)**: A subtype of **Low Volume** for approved unified communications as a service (UCaaS) applications. UCaaS applications use it when each phone number is tied to a human (for example, employee texting).
- **Enhanced**: A higher-throughput campaign type for larger brands or automated communications. Might require vetting.
- **Emergency**: For public safety alerts from government agencies, schools, or utilities. Strictly regulated.
- **Franchise**: For businesses with multiple locations or agents/franchisees that send similar but localized content. Requires disclosure of all subentities.
- **Charity**: For 501(c)(3) nonprofit organizations that send service-related or fundraising messages. Requires proof of tax-exempt status.

Azure Communication Services currently doesn't support the **Political** campaign type.

### Can I update my campaign information?

This feature is currently not available. We advise you to [email the Microsoft team for Azure Communication Services telephone number services](mailto:acstns@microsoft.com) for further guidance.

### Is there a fee for campaign registration?

Yes, there's a fee. For more information, see [SMS pricing](../sms-pricing.md).

## Sending and receiving messages

### How can I receive messages by using Azure Communication Services?

Azure Communication Services customers can use Azure Event Grid to receive incoming messages. For more information about how to set up Event Grid to receive messages, see [Handle SMS events](../../quickstarts/sms/handle-sms-events.md).

### Can I receive messages from any country or region on toll-free numbers?

Toll-free numbers can't send messages to, or receive messages from, countries or regions outside the United States, Canada, and Puerto Rico.

### Can I receive messages from any country or region on short codes?

Short codes are domestic numbers and can't send messages to, or receive messages from, a location outside the country or region where it was registered. For example, a US short code can send messages to, and receive messages from, only US recipients.

### How are messages sent to landline numbers treated?

In the United States, Azure Communication Services doesn't check for landline numbers and attempts to send the messages to carriers for delivery. Customers are charged for messages sent to landline numbers.

### Can I send messages to multiple recipients?

Yes, you can make one request with multiple recipients. For more information about how to send messages to multiple recipients, see [Send an SMS message](../../quickstarts/sms/send.md?pivots=programming-language-csharp).

### I received an HTTP 202 status code from the Send SMS API, but the SMS message didn't reach my phone. What should I do now?

The 202 status code that the service returned means that the message you queued to be sent wasn't delivered. To subscribe to delivery report events and troubleshoot, see [Handle SMS events](../../quickstarts/sms/handle-sms-events.md). After the events are configured, inspect the `deliveryStatus` field of your delivery report to verify delivery success or failure.

### How do I send shortened URLs in messages?

Shortened URLs are a good way to keep messages short and readable. However, US carriers prohibit the use of free, publicly available URL shortener services. The reason is that bad actors can use these URL shorteners to evade detection and get their spam messages passed through text messaging platforms.

When you send messages in the United States, we encourage you to use custom URL shorteners to create URLs with a dedicated domain that belongs to your brand. Many US carriers block SMS traffic if they contain publicly available URL shorteners.

To increase your chances of message delivery, avoid these common URL shorteners:

- bit.ly
- goo.gl
- tinyurl.com
- tiny.cc
- lc.chat
- is.gd
- soo.gd
- s2r.co
- clicky.me
- budurl.com
- bc.vc

## Opt-out handling

### How does Azure Communication Services handle opt-outs for toll-free numbers?

US carriers mandate and enforce the following opt-outs for US toll-free numbers. These opt-outs can't be overridden.

- **STOP**: A text message recipient who wants to opt out can send **STOP** to the toll-free number. The carrier sends the following default response for **STOP**: "NETWORK MSG: You replied with the word STOP, which blocks all texts sent from this number. Text back UNSTOP to receive messages again."
- **START**, **UNSTOP**: A recipient who wants to resubscribe to text messages from a toll-free number can send **START** or **UNSTOP** to the toll-free number. The carrier sends the following default response for **START** or **UNSTOP**: "NETWORK MSG: You have replied UNSTOP and will begin receiving messages again from this number."

Azure Communication Services detects **STOP** messages and blocks all further messages to the recipient. The delivery report indicates a failed delivery with the status message "Sender blocked for given recipient."

The **STOP**, **UNSTOP**, and **START** messages are relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message-sending attempts are made to recipients who opt out of your communications.

### How does Azure Communication Services handle opt-outs for short codes?

Azure Communication Services offers an opt-out management service for short codes. This service allows customers to configure responses to the mandatory keywords **STOP**, **QUIT**, **END**, **REVOKE**, **OPT OUT**, **CANCEL**, **UNSUBSCRIBE**, **START**, and **HELP**.

Before you provision your short code, you're asked for your preference to manage opt-out. If you chose Azure Communication Services to handle it, the opt-out management service automatically uses your responses in the program brief for opt-in, opt-out, and help keywords in response to the **STOP**, **START**, or **HELP** keyword.

### How does Azure Communication Services handle opt-outs for short codes in the United States?

Azure Communication Services offers an opt-out management service for short codes in the United States. This service allows customers to configure responses to the mandatory keywords **STOP**, **QUIT**, **END**, **REVOKE**, **OPT OUT**, **CANCEL**, **UNSUBSCRIBE**, **START**, and **HELP**.

Before you provision your short code, you're asked for your preference to manage opt-out. If you chose Azure Communication Services to handle it, the opt-out management service automatically uses your responses in the program brief for opt-in, opt-out, and help keywords in response to **STOP**, **QUIT**, **END**, **REVOKE**, **OPT OUT**, **CANCEL**, **UNSUBSCRIBE**, **START**, and **HELP** keywords.

For example:

- **STOP**: A text message recipient who wants to opt out can send **STOP** to the short code. Azure Communication Services sends your configured response for **STOP**: "Contoso Alerts: You opted out and will not receive any more messages."
- **START**: A recipient who wants to resubscribe to text messages from a short code can send **START** to the short code. Azure Communication Services sends your configured response for **START**: "Contoso Promo Alerts: 3 msgs/week. Message & Data Rates May Apply. Reply HELP for help. Reply STOP to opt-out."
- **HELP**: A recipient who wants to get help with your service can send **HELP** to the short code. Azure Communication Services sends the response that you configured in the program brief for **HELP**: "Thanks for texting Contoso! Call 1-800-800-8000 for support."

Azure Communication Services detects **STOP**, **QUIT**, **END**, **REVOKE**, **OPT OUT**, **CANCEL**, or **UNSUBSCRIBE** messages and blocks all further messages to the recipient. The delivery report indicates a failed delivery with the status message "Sender blocked for given recipient."

The **STOP**, **QUIT**, **END**, **REVOKE**, **OPT OUT**, **CANCEL**, **UNSUBSCRIBE**, **UNSTOP**, and **START** messages are relayed back to you. We encourage you to monitor and implement these opt-outs to ensure that no further message-sending attempts are made to recipients who opt out of your communications.

### How does Azure Communication Services handle opt-outs for an alphanumeric sender ID?

An alphanumeric sender ID can't receive inbound messages or **STOP** messages. Azure Communication Services doesn't enforce or manage opt-out lists for alphanumeric sender IDs. You must provide customers with instructions to opt out by using other channels, such as call support, an opt-out link in the message, or email support. For more information, see the [messaging policy guidelines](./messaging-policy.md#how-we-handle-opt-out-requests-for-sms).

### How does Azure Communication Services handle opt-outs for short codes in Canada and the United Kingdom?

Azure Communication Services doesn't control or implement opt-out mechanisms for short codes within Canada and the United Kingdom. Recipients of text messages have the option to text **STOP** to unsubscribe or **START** to subscribe to the short code. These requests are relayed as incoming messages to your Event Grid instance. It's your responsibility to act on these messages by resubscribing recipients or ceasing message delivery accordingly.

## Short codes

### What is the eligibility to apply for a short code?

The availability of short codes is restricted to paid Azure subscriptions that have a billing address in the United States. Short codes can't be acquired on trial accounts or via Azure free credits. For more information, see the [article about subscription eligibility](../numbers/sub-eligibility-number-capability.md).

### Can someone text to a toll-free number from a short code?

Azure Communication Services toll-free numbers are enabled to receive messages from short codes. However, short codes aren't typically enabled to send messages to toll-free numbers. If your messages from short codes to Azure Communication Services toll-free numbers are failing, ask your short-code provider if the short code is enabled to send messages to toll-free numbers.

### How should a short code be formatted?

Short codes don't fall under E.164 formatting guidelines. They don't have a country code or a plus sign (+) prefix. In the SMS API request, your short code should be passed as the five-digit or six-digit number that appears on your page for short codes, without any prefix.

### How long does it take to get a short code? What happens after an application for a short-code program brief is submitted?

After you submit the application for a short-code program brief in the Azure portal, the service desk works with the aggregators to get each wireless carrier to approve your application. This process generally takes 8 to 12 weeks. All updates and the status changes for your applications are communicated via the email address that you provided in the application. For more questions about your submitted application, [email the Microsoft team for Azure Communication Services telephone number services](mailto:acstns@microsoft.com).

## Alphanumeric sender ID

> [!IMPORTANT]
> Effective *June 30, 2024*, traffic is blocked from unregistered alphanumeric sender IDs that send messages to UK phone numbers. To prevent the blocking of this traffic, submit a [registration application](https://forms.office.com/r/pK8Jhyhtd4) and wait for it to be approved.

> [!IMPORTANT]
> Effective **July 3, 2025**, unregistered alphanumeric sender IDs sending messages to Ireland phone numbers will have its messages marked as "Spam" for recipients. To prevent this, a [registration application](https://forms.office.com/r/pK8Jhyhtd4) needs to be submitted. If your Sender ID isn't registered by **October 3, 2025**, all traffic from the unregistered Sender IDs will be blocked entirely.


### How should an alphanumeric sender ID be formatted?

An alphanumeric sender ID:

- Must contain at least one letter.
- Can have up to 11 characters. Characters can include:
  - Uppercase letters: A-Z
  - Lowercase letters: a-z
  - Numbers: 0-9
  - Spaces

### Do I need to purchase a phone number to use an alphanumeric sender ID?

Using an alphanumeric sender ID doesn't require you to purchase any phone number. You can enable an alphanumeric sender ID through the Azure portal. For more information, see the [quickstart for enabling an alphanumeric sender ID](../../quickstarts/sms/enable-alphanumeric-sender-id.md).

### Can I send an SMS message immediately after I enable an alphanumeric sender ID?

For best results, we recommend that you wait 10 minutes before you start sending messages.

### Why is a number replacing my alphanumeric sender ID?

Replacement of an alphanumeric sender ID with a number might occur when a certain wireless carrier doesn't support alphanumeric sender IDs. The replacement helps ensure a high delivery rate.

## Toll-free verification

> [!IMPORTANT]
> Effective *January 31, 2024*, only fully verified toll-free numbers can send traffic. All traffic is blocked from unverified toll-free numbers that send messages to US and Canadian phone numbers.

### What is toll-free verification?

The toll-free verification process ensures that your services running on toll-free numbers comply with carrier policies and [industry best practices](./messaging-policy.md). The verification process also provides relevant service information to the downstream carriers, which reduces the likelihood of false-positive filtering and wrongful spam blocks.

This verification is *required* for the best SMS delivery experience.

### What happens if I don't verify my toll-free numbers?

Effective January 31, 2024, the industry's toll-free aggregator mandates toll-free verification and allows only verified numbers to send SMS messages. The limits are as follows:

|Limit type |Verification status|Previous limit| Limit effective January 31, 2024 |
|------------|-------------------|-------------|-------------------------------|
|Daily|Unverified | 500 |Blocked|
|Weekly| Unverified| 1,000| Blocked|
|Monthly| Unverified| 2,000| Blocked|
|Daily| Pending verification| 2,000| Blocked|
|Weekly| Pending verification| 6,000| Blocked|
|Monthly| Pending verification| 10,000| Blocked|
|Daily| Verified | No limit| No limit|
|Weekly| Verified| No limit| No limit|
|Monthly| Verified| No limit| No limit|

The SMS rate limits are still applicable in addition to these limits. For more information, see [Are there any limits on sending messages?](#are-there-any-limits-on-sending-messages) in this article.

> [!IMPORTANT]
> Unverified SMS traffic that exceeds the daily limit or is filtered for spam has a [4010 error code](../troubleshooting-codes.md) returned for both scenarios.

### What happens after I submit the toll-free verification form?

After you submit the form, we coordinate with our downstream peer to get the toll-free messaging aggregator to verify the application. While we review your application, we might reach out to you for more information. Here are the status timeframes:

- From **Application Submitted** to **Pending**: One to five business days.
- From **Pending** to **Verdict** (**Verified**, **Rejected**, or **More info needed**): Four to five weeks.

The whole toll-free verification process takes about *five to six weeks*. These timelines are subject to change, depending on the volume of applications to the toll-free messaging aggregator and the [quality](#what-is-considered-a-high-quality-toll-free-verification-application) of your application. When the toll-free aggregator has a high volume of applications, new applications can take around eight weeks to be approved.

Updates for changes and the status of your applications are communicated via the regulatory information in the Azure portal.

### How do I submit an application for a toll-free verification?

To submit an application for a toll-free verification:

1. In the Azure portal, go to the Azure Communication Services resource that your toll-free number is associated with.

1. Go to the **Phone numbers** pane and select the **Submit Application** link.

1. Complete the form and submit it.

### What is considered a high-quality toll-free verification application?

The better the quality of your application, the greater the likelihood of its approval. Here are pointers for submitting a high-quality application:

- Ensure that listed phone numbers are toll-free numbers.
- Complete all required fields.
- Ensure that your use case isn't in the [list of ineligible use cases](#what-are-the-ineligible-use-cases-for-toll-free-verification).
- Describe your opt-in process.
- Provide a publicly accessible opt-in image URL.
- Follow [CTIA guidelines](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms).

### What are the ineligible use cases for toll-free verification?

| High-risk financial services | Get-rich-quick schemes | Debt forgiveness | Illegal substances/activities | General |
| --- | --- | --- | --- | --- |
| Payday loans | Debt consolidation | Work-from-home programs | Cannabis | Phishing |
| Short-term, high-interest loans | Debt reduction | Risk investment opportunities | Alcohol | Fraud or scams |
| Auto loans | Credit repair programs | Debt collection or consolidation | Tobacco or vape | Deceptive marketing |
| Mortgage loans | Deceptive work-from-home programs | | | Pornography |
| Student loans | Multilevel marketing | | | Sex-related content |
| Gambling | | | | Profanity or hate speech |
| Sweepstakes | | | | Firearms |
| Stock alerts | | | | |
| Cryptocurrency | | | | |

### How is my data being used?

Toll-free verification involves an integration between Microsoft and the toll-free messaging aggregator. The toll-free messaging aggregator is the final reviewer and approver of the verification application. Microsoft must share the application information with the toll-free messaging aggregator so that the aggregator can confirm that the program details meet the CTIA guidelines and standards that carriers set.

By submitting an application for toll-free verification, you agree that Microsoft can share the application details as necessary for provisioning the toll-free number.

## Character and rate limits

### What is the SMS character limit?

The maximum size of a single SMS message is 140 bytes. The character limit for each message that you send depends on the message content and the encoding. Azure Communication Services supports these types of encoding:

- **GSM-7**: For a message that contains text characters only.
- **UCS-2**: For a message that contains Unicode (emoji or international languages).

This table shows the maximum number of characters that you can send per SMS segment to carriers:

| Message | Type | Characters used in the message | Encoding | Maximum characters in a single segment |
| --- | ---| --- | --- | --- |
| Hello world | Text | GSM standard  |GSM-7 | 160|
| 你好 | Unicode | Unicode | UCS-2 | 70 |

### Can I send or receive long messages (more than 2,048 characters)?

Azure Communication Services supports sending and receiving long messages over SMS. However, some wireless carriers or devices might act differently when they receive long messages. To ensure maximum delivery, we recommend that you keep SMS messages to a length of 320 characters and reduce the use of accents.

For US short codes, there's a known limit of four segments when you're sending or receiving a message with non-ASCII characters. Beyond four segments, the message might not be delivered with the right formatting.

### Are there any limits on sending messages?

To ensure that we continue offering the high quality of service that's consistent with our service-level agreements, Azure Communication Services applies rate limits (different for each primitive). Developers who call our APIs beyond the limit receive a 429 HTTP status code in response.

#### Rate limits for SMS

|Operation|Number type |Scope|Timeframe| Limit (request #) | Message units per minute|
|---------|---|--|-------------|-------------------|-------------------------|
|Send message|Toll-free|Per number|60|200|200|
|Send message|Short code |Per number|60|6,000|6,000|
|Send message|Alphanumeric sender ID |Per resource|60|600|600|

If your company has requirements that exceed the rate limits, submit [a request to Azure support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to enable higher throughput.

#### Rate limits for 10DLC

| Carrier | Message class or brand tier | Use case type | Use case | Vetting score requirements | Daily cap (SMS) |
| --- | --- | --- | --- | --- | --- |
| AT&T | A | Standard | Dedicated use case | 75-100 | 4,500 |
| AT&T | B | Standard | Mixed/marketing | 75-100 | 4,500 |
| AT&T | C | Standard | Dedicated use case | 50-74 | 4,500 |
| AT&T | D | Standard | Mixed/marketing | 50-74 | 4,500 |
| AT&T | E | Standard | Dedicated use case | 1-49 | 240 |
| AT&T | F | Standard | Mixed/marketing | 1-49 | 240 |
| AT&T | T | Standard | Low-volume mixed | 75 | 50 |
| T-Mobile | Top | Standard | All | 75-100 | 200,000 |
| T-Mobile | High mid | Standard | All | 50-74 | 40,000 |
| T-Mobile | Low mid | Standard | All | 25-49 | 10,000 |
| T-Mobile | Low | Standard | All | 1-24 | 2,000 |
| T-Mobile | Standard | Standard | Low-volume mixed | Not applicable | 2,000 |

## Carrier fees

### What are the carrier fees for SMS?

US and Canadian carriers charge an added fee for SMS messages sent and/or received from toll-free numbers and short codes. The carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages.

Azure Communication Services charges a standard carrier fee per message segment. Carrier fees are subject to change by mobile carriers. For more information, see [SMS pricing](../sms-pricing.md).

### When will I know about changes to these surcharges?

As with similar Azure services, customers are notified at least 30 days before the implementation of any price changes. These charges are reflected on our SMS pricing page, along with the effective dates.

## Emergency support

### Can a customer use Azure Communication Services for emergency purposes?

Azure Communication Services doesn't support text-to-911 functionality in the United States, but it's possible that you might have an obligation to do so under the rules of the Federal Communications Commission (FCC). You should assess whether the FCC's text-to-911 rules apply to your service or application.

To the extent that these rules affect you, you're responsible for routing 911 text messages to emergency call centers that request them. You're free to determine your own text-to-911 delivery model. One approach that the FCC accepts involves automatically opening the native dialer on the user's mobile device to deliver 911 texts through the underlying mobile carrier.

## Messaging Connect

### How can I send SMS to countries not directly supported by Azure Communication Services?

You can use **Messaging Connect**, a partner-powered solution that enables global SMS delivery through trusted aggregators. It allows you to acquire phone numbers or sender IDs from partner networks and send messages using the same ACS APIs and SDKs you already use—extending your messaging reach while staying fully integrated with Azure.

To learn more, see [Messaging Connect](../sms/messaging-connect.md).

