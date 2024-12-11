---
title: SMS FAQ
titleSuffix: An Azure Communication Services concept document
description: SMS FAQ
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
This article answers commonly asked questions about the SMS service. 

## 10DLC (10 Digit Long Code)
### What is brand registration, and why is it required for 10DLC messaging?

Brand registration is the process of registering your business as a recognized brand with carriers to send SMS messages using 10DLC (10-digit long codes). Carriers require brand registration to ensure compliance with messaging regulations and to prevent spam.

### How do I complete brand registration with ACS?

To register a brand, you’ll need to provide information such as your business’s name, tax ID, address, industry, and other identifying information. This can be done through the ACS portal by following [this quickstart](../../quickstarts/sms/apply-for-ten-digit-long-code.md).

### What types of information are required for brand registration?

You’ll need to provide:
- Legal business name
- Business address
- Tax ID or Employer Identification Number (EIN)
- Industry type
- Contact information
- Business website (if applicable)

### Can I update my brand information after registration?

This feature is currently not available.

### Is there a fee for brand registration?

Yes, there is a fee. Refer to the [pricing page](../sms-pricing.md) for details on fees.

### What is vetting, and when is it required?

Vetting is a review process to evaluate your brand’s trustworthiness and assign it a score, which influences messaging throughput limits. It is required if your brand’s use case involves high-volume messaging or falls into certain categories needing additional carrier review.

### How is the vetting score determined?

The vetting score is based on the information provided during brand registration and includes factors like industry reputation, message content, and business type. Scores range from 1-100, with higher scores resulting in higher messaging throughput limits.

### What type of campaigns are supported?

Currently, ACS supports **Standard campaigns** only. These campaigns are used for general business messaging, such as customer service notifications, account updates, and other informational messages that do not fall under special categories (e.g., political or emergency services).

### Can I update my campaign information?

This feature is currently not available.

### Is there a fee for campaign registration?

Yes, there is a fee. Refer to the [pricing page](../sms-pricing.md) for details on fees.

## General 10DLC FAQs

### Can I use 10DLC numbers in any country?

No, 10DLC is primarily supported in the United States. Availability depends on the subscription billing location and eligibility. Check the [ACS eligibility documentation](../../concepts/numbers/phone-number-management-for-united-states.md) for more details on supported countries.

### What is a 10DLC number?
A 10DLC (10-Digit Long Code) number is a standard 10-digit phone number used for Application-to-Person (A2P) messaging in the United States. It is designed for businesses to send SMS messages to customers at scale, without the restrictions of traditional long codes.

### I already have a local U.S. number. Can I use it for SMS?
Yes, if you already have a local U.S. number, you can use it for SMS messaging. You will need to submit a brand registration and campaign registration prior to enabling the SMS capability on it. Follow this [quickstart to apply.](../../quickstarts/sms/apply-for-ten-digit-long-code.md) 

### What are the advantages of using 10DLC numbers over short codes?
- **Cost-effective**: 10DLC numbers are more affordable than short codes for A2P messaging.
- **Wide coverage**: 10DLC numbers can be used for messaging across all major U.S. carriers, providing reliable delivery at scale.
- **No need for dedicated short codes**: 10DLCs do not require additional approvals or significant setup costs, unlike short codes.

### Can 10DLC numbers be used for voice calls?
Yes, 10DLC numbers are nothing but local numbers that are voice-enabled. When registered, they can be used for SMS. 10DLC registration only applies to SMS enablement and is not required for calling.

### What kind of messages can be sent from a 10DLC number?
10DLC numbers can be used for a wide range of business communications, including:
- Customer service notifications
- Marketing and promotional messages
- Alerts and reminders
- Two-factor authentication (2FA) codes

However, 10DLC numbers must adhere to messaging guidelines and cannot be used for illegal or spam purposes.

### Are 10DLC numbers subject to throughput limits?
Yes, 10DLC numbers are subject to throughput limits, which can vary depending on the carrier and the volume of messages sent. These limits are generally higher than those for traditional long codes but are lower than those for short codes. The actual throughput may be impacted by factors such as campaign registration and compliance with carrier guidelines.

### Can I port my existing number to a 10DLC number?
Yes, it is possible to port an existing phone number to a 10DLC. Please follow instructions to port [here](../../quickstarts/telephony/port-phone-number.md).

### What happens if I send unsolicited messages from a 10DLC number?
Sending unsolicited messages, also known as spam, can lead to penalties, including the suspension of your 10DLC number or carrier blocking. It is essential to comply with applicable laws, including the Telephone Consumer Protection Act (TCPA) and carrier guidelines to avoid these issues.

### Can 10DLC numbers be used for international messaging?
 10DLC numbers are designed for use within the United States and do not support international messaging.
 
### How can I monitor the performance of my 10DLC number?
Monitoring the performance of your 10DLC number, such as delivery rates, message throughput, and errors, can typically be done through [SMS insights dashboard](../analytics/insights/sms-insights.md).

### Can I use 10DLC numbers for high-volume messaging?
Yes, 10DLC numbers are suitable for high-volume messaging, but they are subject to carrier rate limiting and compliance guidelines. To ensure optimal performance, it's important to work with your provider to manage message volume and adhere to best practices for A2P messaging.

## Sending and receiving messages
### How can I receive messages using Azure Communication Services?

Azure Communication Services customers can use Azure Event Grid to receive incoming messages. Follow this [quickstart](../../quickstarts/sms/handle-sms-events.md) to set up your event-grid to receive messages.

### Can I receive messages from any country or region on toll-free numbers?

Toll-free numbers aren't capable of sending or receiving messages to or from countries or regions outside of the United States (US), Canada (CA), and Puerto Rico (PR).

### Can I receive messages from any country or region on short codes?
Short codes are domestic numbers and aren't capable of sending or receiving messages to/from outside of the country or region it was registered for. *For example: US short code can only send and receive messages to and from US recipients.*

### How are messages sent to landline numbers treated?

In the United States, Azure Communication Services doesn't check for landline numbers and attempts to send it to carriers for delivery. Customers are charged for messages sent to landline numbers. 

### Can I send messages to multiple recipients?

Yes, you can make one request with multiple recipients. Follow this [quickstart](../../quickstarts/sms/send.md?pivots=programming-language-csharp) to send messages to multiple recipients.

### I received an HTTP Status 202 from the Send SMS API but the SMS didn't reach my phone. What do I do now?

The 202 returned by the service means that the message you queued to be sent wasn't delivered. Use this [Quickstart: Handle SMS events](../../quickstarts/sms/handle-sms-events.md) to subscribe to delivery report events and troubleshoot. Once the events are configured, inspect the `deliveryStatus` field of your delivery report to verify delivery success or failure.

### How to send shortened URLs in messages?
Shortened URLs are a good way to keep messages short and readable. However, US carriers prohibit the use of free publicly available URL shortener services. This is because the ‘free-public’ URL shorteners are used by bad-actors to evade detection and get their SPAM messages passed through text messaging platforms. When sending messages in the US, we encourage using custom URL shorteners to create URLs with dedicated domain that belongs to your brand. Many US carriers block SMS traffic if they contain publicly available URL shorteners.

To increase the chances of your messages being delivered, the following list shows examples of common URL shorteners you should avoid:

- bit.ly
- goo.gl
- tinyurl.com
- Tiny.cc
- lc.chat
- is.gd
- soo.gd
- s2r.co
- Clicky.me
- budurl.com
- bc.vc

## Opt-out handling

### How does Azure Communication Services handle opt-outs for toll-free numbers?

Opt-outs for US toll-free numbers are mandated and enforced by US carriers and cannot be overridden.

- **STOP** - If a text message recipient wishes to opt out, they can send `STOP` to the toll-free number. The carrier sends the following default response for STOP: *"NETWORK MSG: You replied with the word STOP, which blocks all texts sent from this number. Text back UNSTOP to receive messages again."*
- **START/UNSTOP** - If the recipient wishes to resubscribe to text messages from a toll-free number, they can send `START` or `UNSTOP` to the toll-free number. The carrier sends the following default response for START/UNSTOP: *“NETWORK MSG: You have replied UNSTOP and will begin receiving messages again from this number.”*
- Azure Communication Services detects `STOP` messages and blocks all further messages to the recipient. The delivery report indicates a failed delivery with status message as “Sender blocked for given recipient.”
- The `STOP`, `UNSTOP`, and `START` messages are relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message send attempts are made to recipients who opt out of your communications.

### How does Azure Communication Services handle opt-outs for short codes?

Azure communication service offers an opt-out management service for short codes that allows customers to configure responses to mandatory keywords STOP/START/HELP. Before provisioning your short code, you're asked for your preference to manage opt-outs. If you opt-in, the opt-out management service automatically uses your responses in the program brief for Opt in/ Opt out/ Help keywords in response to STOP/START/HELP keyword.

### How does Azure Communication Services handle opt-outs for short codes in United States?

Azure communication service offers an opt-out management service for short codes in US that allows customers to configure responses to mandatory keywords STOP/START/HELP. Before you provision your short code, you're asked for your preference to manage opt-outs. If you opt in, the opt-out management service automatically uses your responses in the program brief for Opt in/ Opt out/ Help keywords in response to STOP/START/HELP keyword. 

*Example:* 
- **STOP** - If a text message recipient wishes to opt out, they can send `STOP` to the short code. Azure Communication Services sends your configured response for STOP: *"Contoso Alerts: You opted out and will not receive any more messages."*
- **START** - If the recipient wishes to resubscribe to text messages from a short code, they can send `START` to the short code. Azure Communication Service sends your configured response for START: *“Contoso Promo Alerts: 3 msgs/week. Message & Data Rates May Apply. Reply HELP for help. Reply STOP to opt-out.”*
- **HELP** - If the recipient wishes to get help with your service, they can send `HELP` to the short code. Azure Communication Service sends the response you configured in the program brief for HELP: *"Thanks for texting Contoso! Call 1-800-800-8000 for support."*

Azure Communication Services detects `STOP` messages and blocks all further messages to the recipient. The delivery report indicates a failed delivery with status message as “Sender blocked for given recipient.” The `STOP`, `UNSTOP`, and `START` messages are relayed back to you. We encourage you to monitor and implement these *opt-outs* to ensure that no further message send attempts are made to recipients who opt out of your communications.

### How does Azure Communication Services handle opt outs for alphanumeric sender ID?

Alphanumeric sender ID cannot receive inbound messages or `STOP` messages. Azure Communication Services does not enforce or manage opt-out lists for alphanumeric sender ID. You must provide customers with instructions to opt out using other channels such as, calling support, providing an opt-out link in the message, or emailing support. For more information, see [messaging policy guidelines](./messaging-policy.md#how-we-handle-opt-out-requests-for-sms).

### How does Azure Communication Services handle opt outs for short codes in Canada and United Kingdom?

Azure Communication Services doesn't control or implement opt-out mechanisms for short codes within Canada and the United Kingdom. Recipients of text messages have the option to text ‘STOP’ to unsubscribe or ‘START’ to subscribe to the short code. These requests are relayed as incoming messages to your event grid. It is your responsibility to act on these messages by resubscribing recipients or ceasing message delivery accordingly.

## Short codes

### What is the eligibility to apply for a short code?

Short Code availability is restricted to paid Azure subscriptions that have a billing address in the United States. Short Codes can't be acquired on trial accounts or using Azure free credits. For more information, see the [subscription eligibility page](../numbers/sub-eligibility-number-capability.md). 

### Can you text to a toll-free number from a short code?

Azure Communication Services toll-free numbers are enabled to receive messages from short codes. However, short codes aren't typically enabled to send messages to toll-free numbers. If your messages from short codes to Azure Communication Services toll-free numbers are failing, check with your short code provider if the short code is enabled to send messages to toll-free numbers. 

### How should a short code be formatted?

Short codes don't fall under E.164 formatting guidelines and do not have a country code, or a plus sign (**+**) prefix. In the SMS API request, your short code should be passed as the five (5) to six (6) digit number you see in your short codes page without any prefix. 

### How long does it take to get a short code? What happens after a short code program brief application is submitted?

Once you submit the short code program brief application in the Azure portal, the service desk works with the aggregators to get your application approved by each wireless carrier. This process generally takes eight (8) to twelve (12) weeks. All updates and the status changes for your applications are communicated via the email you provide in the application. For more questions about your submitted application, email [acstnrequest@microsoft.com](mailto:acstnrequest@microsoft.com).

## Alphanumeric sender ID

> [!IMPORTANT]
> Effective **June 30, 2024**, unregistered alphanumeric sender IDs sending messages to UK phone numbers will have its traffic blocked. To prevent this from happening, a [registration application](https://forms.office.com/r/pK8Jhyhtd4) needs to be submitted and be in approved status.

### How should an alphanumeric sender ID be formatted?

**Formatting guidelines**:
- Must contain at least one letter
- Upto 11 characters
- Characters can include:    
    - Upper case letters: A - Z
    - Lower case letters: a - z
    - Numbers: 0 - 9
    - Spaces

### Is a number purchase required to use alphanumeric sender ID?

Using an alphanumeric sender ID doesn't require you to purchase any phone number. You can enable alphanumeric sender ID through the Azure portal. See [enable alphanumeric sender ID quickstart](../../quickstarts/sms/enable-alphanumeric-sender-id.md) for instructions.


### Can I send SMS immediately after enabling alphanumeric sender ID?

We recommend waiting for 10 minutes before you start sending messages for best results.

### Why is my alphanumeric sender ID getting replaced by a number?

Alphanumeric sender ID replacement with a number may occur when a certain wireless carrier doesn't support alphanumeric sender ID. This is done to ensure high delivery rate.  

## Toll-Free Verification

> [!IMPORTANT]
> Effective **January 31, 2024**, only fully verified toll-free numbers will be able to send traffic. Unverified toll-free numbers sending messages to US and CA phone numbers will have its traffic **blocked**. 

### What is toll free verification?

The toll-free verification process ensures that your services running on toll-free numbers (TFNs) comply with carrier policies and [industry best practices](./messaging-policy.md). This also provides relevant service information to the downstream carriers, reduces the likelihood of false positive filtering and wrongful spam blocks.

This verification is **required** for best SMS delivery experience.

### What happens if I don't verify my toll-free numbers?

#### SMS to US phone numbers

Effective January 31, 2024, the industry’s toll-free aggregator is mandating toll-free verification and will only allow verified numbers to send SMS messages.

New limits are as follows:

|Limit type  |Verification Status|Current limit| Limit effective January 31, 2024 |
|------------|-------------------|-------------|-------------------------------|
|Daily limit |Unverified         | 500       |Blocked|
|Weekly limit| Unverified| 1,000| Blocked|
|Monthly Limit| Unverified| 2,000| Blocked|
|Daily limit| Pending Verification| 2,000| Blocked|
|Weekly limit| Pending Verification| 6,000| Blocked|
|Monthly Limit| Pending Verification| 10,000| Blocked|
|Daily limit| Verified | No Limit| No Limit|
|Weekly limit| Verified| No Limit| No Limit|
|Monthly Limit| Verified| No Limit| No Limit|

The SMS rate limits are still applicable in addition to these limits. Please reference [rate limits](#are-there-any-limits-on-sending-messages).

> [!IMPORTANT]
> Unverified SMS traffic that exceeds the daily limit or is filtered for spam has a [4010 error code](../troubleshooting-codes.md) returned for both scenarios.

### What happens after I submit the toll-free verification form?

After submission of the form, we coordinate with our downstream peer to get the application verified by the toll-free messaging aggregator. While we're reviewing your application, we may reach out to you for more information.
- From Application Submitted to Pending = **1-5 business days** 
- From Pending to Verdict (Verified/Rejected/More info needed) = **4-5 weeks**. The toll-free aggregator is currently facing a high volume of applications, so new applications can take around eight weeks to be approved.

The whole toll-free verification process takes about **5-6 weeks**. These timelines are subject to change depending on the volume of applications to the toll-free messaging aggregator and the [quality](#what-is-considered-a-high-quality-toll-free-verification-application) of your application. The toll-free aggregator is currently facing a high volume of applications due to which applications can take around eight weeks to get approved.

Updates for changes and the status of your applications are communicated via the regulatory blade in Azure portal.

### How do I submit a toll-free verification?

To submit a toll-free verification application, navigate to Azure Communication Service resource that your toll-free number is associated with in Azure portal. Navigate to the Phone numbers blade. Select the Toll-Free verification application link displayed as **Submit Application** in the infobox at the top of the phone numbers blade. Complete the form and submit it.

### What is considered a high quality toll-free verification application?

The better the quality of your application, the greater the likelihood of it being approved.  

Pointers to ensure you're submitting a high quality application:
- Phone numbers listed are Toll-free numbers
- Complete all required fields
- Your use case isn't listed on our [Ineligible Use Case](#what-are-the-ineligible-use-cases-for-toll-free-verification) list 
- Your opt-in process is documented/detailed
- Your opt-in image URL is provided and publicly accessible 
- You follow [CTIA guidelines](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms)

### What are the ineligible use cases for toll-free verification?

| High-Risk Financial Services    | Get Rich Quick Schemes            | Debt Forgiveness                 | Illegal Substances/Activities | General                  |
|---------------------------------|-----------------------------------|----------------------------------|------------------------------|--------------------------|
| Payday loans                    | Debt consolidation                | Work from home programs          | Cannabis                     | Phishing                 |
| Short-term, high-interest loans | Debt reduction                    | Risk investment opportunities    | Alcohol                      | Fraud or scams           |
| Auto loans                      | Credit repair programs            | Debt collection or consolidation | Tobacco or vape              | Deceptive marketing      |
| Mortgage loans                  | Deceptive work from home programs |                                  |                              | Pornography              |
| Student loans                   | Multi-level marketing             |                                  |                              | Sex-related content      |
| Gambling                        |                                   |                                  |                              | Profanity or hate speech |
| Sweepstakes                     |                                   |                                  |                              | Firearms                 |
| Stock alerts                    |                                   |                                  |                              |                          |
| Cryptocurrency                  |                                   |                                  |                              |                          |

### How is my data being used?

Toll-free verification (TFV) involves an integration between Microsoft and the Toll-Free messaging aggregator. The toll-free messaging aggregator is the final reviewer and approver of the TFV application. Microsoft must share the TFV application information with the toll-free messaging aggregator for them to confirm that the program details meet the CTIA guidelines and standards set by carriers. By submitting a TFV form, you agree that Microsoft may share the TFV application details as necessary for provisioning the toll-free number.
 
## Character and rate limits

### What is the SMS character limit?

 The size of a single SMS message is 140 bytes. The character limit per single message being sent depends on the message content and encoding used. Azure Communication Services supports both GSM-7 and UCS-2 encoding. 

- **GSM-7** - A message containing text characters only is encoded using GSM-7
- **UCS-2** - A message containing unicode (emojis, international languages) is encoded using UCS-2

This table shows the maximum number of characters that can be sent per SMS segment to carriers:

|Message|Type|Characters used in the message|Encoding|Maximum characters in a single segment|
|-------|----|---------------|--------|--------------------------------------|
|Hello world|Text|GSM Standard|GSM-7|160|
|你好|Unicode|Unicode|UCS-2|70|

### Can I send/receive long messages (>2,048 chars)?

Azure Communication Services supports sending and receiving of long messages over SMS. However, some wireless carriers or devices may act differently when receiving long messages. We recommend keeping SMS messages to a length of 320 characters and reducing the use of accents to ensure maximum delivery. 

*Limitation of US short code - There is a known limit of ~four (4) segments when sending or receiving a message with Non-ASCII characters. Beyond four segments, the message may not be delivered with the right formatting.

### Are there any limits on sending messages?

To ensure that we continue offering the high quality of service consistent with our SLAs, Azure Communication Services applies rate limits (different for each primitive). Developers who call our APIs beyond the limit receive a 429 HTTP Status Code Response. 

#### Rate Limits for SMS

|Operation|Number Type |Scope|Timeframe (s)| Limit (request #) | Message units per minute|
|---------|---|--|-------------|-------------------|-------------------------|
|Send Message|Toll-Free|Per Number|60|200*|200|
|Send Message|Short Code |Per Number|60|6000*|6000|
|Send Message|Alphanumeric Sender ID |Per resource|60|600*|600|

*If your company has requirements that exceed the rate-limits, submit [a request to Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to enable higher throughput.

#### Rate limits for 10DLC
| **Carrier** | **Message Class / Brand Tier** | **Use Case Type** | **Use Case**       | **Vetting Score Requirements** | **Daily Cap (SMS)** |
|-------------|--------------------------------|--------------------|--------------------|-------------------------------|----------------------|
| AT&T        | A                              | Standard          | Dedicated Use Case | 75-100                        | 4,500                | 
| AT&T        | B                              | Standard          | Mixed / Marketing  | 75-100                        | 4,500                | 
| AT&T        | C                              | Standard          | Dedicated Use Case | 50-74                         | 4,500                | 
| AT&T        | D                              | Standard          | Mixed / Marketing  | 50-74                         | 4,500                | 
| AT&T        | E                              | Standard          | Dedicated Use Case | 1-49                          | 240                  | 
| AT&T        | F                              | Standard          | Mixed / Marketing  | 1-49                          | 240                  | 
| AT&T        | T                              | Standard          | Low Volume Mixed   | 75                            | 50                   |       
| T-Mobile    | Top                            | Standard          | All                | 75-100                        | 200,000              |                      
| T-Mobile    | High Mid                       | Standard          | All                | 50-74                         | 40,000               |                     
| T-Mobile    | Low Mid                        | Standard          | All                | 25-49                         | 10,000               |                      
| T-Mobile    | Low                            | Standard          | All                | 1-24                          | 2,000                |                      
| T-Mobile    | Standard                       | Standard          | Low Volume Mixed   |                               | 2,000                |                     

## Carrier Fees 
### What are the carrier fees for SMS?
US and CA carriers charge an added fee for SMS messages sent and/or received from toll-free numbers and short codes. The carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages. Azure Communication Services charges a standard carrier fee per message segment. Carrier fees are subject to change by mobile carriers. For more information, see [SMS pricing](../sms-pricing.md). 

### When do we come to know of changes to these surcharges?
As with similar Azure services, customers are notified at least 30 days before the implementation of any price changes. These charges are reflected on our SMS pricing page along with the effective dates. 

## Emergency support
### Can a customer use Azure Communication Services for emergency purposes?

Azure Communication Services does not support text-to-911 functionality in the United States, but it’s possible that you may have an obligation to do so under the rules of the Federal Communications Commission (FCC). You should assess whether the FCC’s text-to-911 rules apply to your service or application. To the extent you're covered by these rules, you are responsible for routing 911 text messages to emergency call centers that request them. You're free to determine your own text-to-911 delivery model, but one approach accepted by the FCC involves automatically launching the native dialer on the user’s mobile device to deliver 911 texts through the underlying mobile carrier.
