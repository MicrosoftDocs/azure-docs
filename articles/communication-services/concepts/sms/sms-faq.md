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

## Sending and receiving messages
### How can I receive messages using Azure Communication Services?

Azure Communication Services customers can use Azure Event Grid to receive incoming messages. Follow this [quickstart](../../quickstarts/sms/handle-sms-events.md) to set up your event-grid to receive messages.

### Can I receive messages from any country/region on toll-free numbers?

Toll-free numbers are not capable of sending or receiving messages to/from countries/regions outside of US, CA, and PR.

### Can I receive messages from any country/region on short codes?
Short codes are domestic numbers and are not capable of sending or receiving messages to/from outside of the country/region it was registered for. *Example: US short code can only send and receive messages to/from US recipients.*

### How are messages sent to landline numbers treated?

In the United States, Azure Communication Services does not check for landline numbers and attempts to send it to carriers for delivery. Customers are charged for messages sent to landline numbers. 

### Can I send messages to multiple recipients?

Yes, you can make one request with multiple recipients. Follow this [quickstart](../../quickstarts/sms/send.md?pivots=programming-language-csharp) to send messages to multiple recipients.

### I received an HTTP Status 202 from the Send SMS API but the SMS didn't reach my phone, what do I do now?

The 202 returned by the service means that your message has been queued to be sent and not delivered. Use this [quickstart](../../quickstarts/sms/handle-sms-events.md) to subscribe to delivery report events and troubleshoot. Once the events are configured, inspect the "deliveryStatus" field of your delivery report to verify delivery success/failure.

### How to send shortened URLs in messages?
Shortened URLs are a good way to keep messages short and readable. However, US carriers prohibit the use of free publicly available URL shortener services. This is because the ‘free-public’ URL shorteners are used by bad-actors to evade detection and get their SPAM messages passed through text messaging platforms. When sending messages in US, we encourage using custom URL shorteners to create URLs with dedicated domain that belongs to your brand. Many US carriers block SMS traffic if they contain publicly available URL shorteners.

Below is a list with examples of common URL shorteners you should avoid to maximize deliverability:
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
- **STOP** - If a text message recipient wishes to opt out, they can send ‘STOP’ to the toll-free number. The carrier sends the following default response for STOP: *"NETWORK MSG: You replied with the word "stop", which blocks all texts sent from this number. Text back "unstop" to receive messages again."*
- **START/UNSTOP** - If the recipient wishes to resubscribe to text messages from a toll-free number, they can send ‘START’ or ‘UNSTOP’ to the toll-free number. The carrier sends the following default response for START/UNSTOP: *“NETWORK MSG: You have replied “unstop” and will begin receiving messages again from this number.”*
- Azure Communication Services detects STOP messages and blocks all further messages to the recipient. The delivery report will indicate a failed delivery with status message as “Sender blocked for given recipient.”
- The STOP, UNSTOP and START messages will be relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message send attempts are made to recipients who have opted out of your communications.

### How does Azure Communication Services handle opt-outs for short codes?
Azure communication service offers an opt-out management service for short codes that allows customers to configure responses to mandatory keywords STOP/START/HELP. Prior to provisioning your short code, you are asked for your preference to manage opt-outs. If you opt-in to use it, the opt-out management service automatically uses your responses in the program brief for Opt in/ Opt out/ Help keywords in response to STOP/START/HELP keyword. 

*Example:* 
- **STOP** - If a text message recipient wishes to opt out, they can send ‘STOP’ to the short code. Azure Communication Services sends your configured response for STOP: *"Contoso Alerts: You’re opted out and will receive no further messages."*
- **START** - If the recipient wishes to resubscribe to text messages from a short code, they can send ‘START’ to the short code. Azure Communication Service sends your configured response for START: *“Contoso Promo Alerts: 3 msgs/week. Msg&Data Rates May Apply. Reply HELP for help. Reply STOP to opt-out.”*
- **HELP** - If the recipient wishes to get help with your service, they can send 'HELP' to the short code. Azure Communication Service sends the response you configured in the program brief for HELP: *"Thanks for texting Contoso! Call 1-800-800-8000 for support."*

Azure Communication Services detects STOP messages and blocks all further messages to the recipient. The delivery report indicates a failed delivery with status message as “Sender blocked for given recipient.” The STOP, UNSTOP and START messages are relayed back to you. Azure Communication Services encourages you to monitor and implement these opt outs to ensure that no further message send attempts are made to recipients who have opted out of your communications.

### How does Azure Communication Services handle opt outs for alphanumeric sender ID?

Alphanumeric sender ID is not capable of receiving inbound messages or STOP messages. Azure Communication Services does not enforce or manage opt-out lists for alphanumeric sender ID. You must provide customers with instructions to opt out using other channels such as, calling support, providing an opt-out link in the message, or emailing support. See [messaging policy guidelines](./messaging-policy.md#how-we-handle-opt-out-requests-for-sms) for further details.

## Short codes
### What is the eligibility to apply for a short code?
Short Code availability is currently restricted to paid Azure subscriptions that have a billing address in the United States. Short Codes cannot be acquired on trial accounts or using Azure free credits. For more details, check out our [subscription eligibility page](../numbers/sub-eligibility-number-capability.md). 

### Can you text to a toll-free number from a short code?
ACS toll-free numbers are enabled to receive messages from short codes. However, short codes are not typically enabled to send messages to toll-free numbers. If your messages from short codes to ACS toll-free numbers are failing, check with your short code provider if the short code is enabled to send messages to toll-free numbers. 

### How should a short code be formatted?
Short codes do not fall under E.164 formatting guidelines and do not have a country code, or a "+" sign prefix. In the SMS API request, your short code should be passed as the 5-6 digit number you see in your short codes blade without any prefix. 

### How long does it take to get a short code? What happens after a short code program brief application is submitted?
Once you have submitted the short code program brief application in the Azure portal, the service desk works with the aggregators to get your application approved by each wireless carrier. This process generally takes 8-12 weeks. All updates and the status changes for your applications are communicated via the email you provide in the application. For more questions about your submitted application, please email acstnrequest@microsoft.com.

## Alphanumeric sender ID
### How should an alphanumeric sender ID be formatted?
**Formatting guidelines**:
- Must contain at least one letter
- Upto 11 characters
- Characters can include    
    - Upper case letters: A - Z
    - Lower case letters: a - z
    - Numbers: 0-9
    - Spaces
    - Special characters: *+* , *-* ,  _ , &

### Is a number purchase required to use alphanumeric sender ID?
The use of alphanumeric sender ID does not require purchase of any phone number. Alphanumeric sender ID can be enabled through the Azure portal. See [enable alphanumeric sender ID quickstart](../../quickstarts/sms/enable-alphanumeric-sender-id.md) for instructions.

### Can I send SMS immediately after enabling alphanumeric sender ID?
We recommend waiting for 10 minutes before you start sending messages for best results.

### Why is my alphanumeric sender ID getting replaced by a number?
Alphanumeric sender ID replacement with a number may occur when a certain wireless carrier does not support alphanumeric sender ID. This is done to ensure high delivery rate.  

## Toll-Free Verification
### What is toll free verification?
The toll-free verification process ensures that your services running on toll-free numbers (TFNs) comply with carrier policies and [industry best practices](./messaging-policy.md). This also provides relevant service information to the downstream carriers, reduces the likelihood of false positive filtering and wrongful spam blocks.

This verification is **required** for best SMS delivery experience.

### What happens if I don't verify my toll-free numbers?

#### SMS to US phone numbers
Effective **October 1, 2022**, unverified toll-free numbers sending messages to US phone numbers will be subjected to the following: 

- **Stricter filtering** - SMS messages are more likely to get blocked due to strict filtering, preventing messages to be delivered (that is, SMS messages with URLs might be blocked).  
- **SMS volume thresholds**:
Effective April 1, 2023, the industry’s toll-free aggregator is implementing new limits to messaging traffic for restricted and pending toll-free numbers. Messaging that exceeds a limit returns Error Code 795/ 4795: tfn-not-verified.

New limits are as follows:

|Limit type  |Verification Status|Current limit| Limit effective April 1, 2023 |
|------------|-------------------|-------------|-------------------------------|
|Daily limit |Unverified         | 2,000       |500|
|Weekly limit| Unverified| 12,000| 1,000|
|Monthly Limit| Unverified| 25,000| 2,000|
|Daily limit| Pending Verification| No Limit| 2,000|
|Weekly limit| Pending Verification| No Limit| 6,000|
|Monthly Limit| Pending Verification| 500,000| 10,000|
|Daily limit| Verified | No Limit| No Limit|
|Weekly limit| Verified| No Limit| No Limit|
|Monthly Limit| Verified| No Limit| No Limit|


> [!IMPORTANT]
> Unverified SMS traffic that exceeds the daily limit or is filtered for spam will have a [4010 error code](../troubleshooting-info.md#sms-error-codes)  returned for both scenarios.
> 
> The unverified volume daily cap is a daily maximum limit (not a guaranteed daily minimum), so unverified traffic can still experience message filtering even when it’s well below the daily limits.

> [!IMPORTANT]
> In the near future, the verification process will need to be completed before sending any traffic on a toll-free number. The official date will be shared in the coming weeks. In the meantime, please start to prepare for this change in your onboarding processes.

#### SMS to Canadian phone numbers
Effective **October 1, 2022**, unverified toll-free numbers sending messages to Canadian destinations will have its traffic **blocked**. To unblock the traffic, a verification application needs to be submitted and be in [pending or verified status](#what-do-the-different-application-statuses-verified-pending-and-unverified-mean).

### What do the different application statuses (verified, pending and unverified) mean? 
- **Verified:** Verified numbers have gone through the toll-free verification process and have been approved. Their traffic is subjected to limited filters. If traffic does trigger any filters, that specific content is blocked but the number is not automatically blocked.
- **Pending**: Numbers in pending state have an associated toll-free verification form being reviewed by the toll-free messaging aggregator. They can send at a lower throughput than verified numbers, but higher than unverified numbers. Blocking can be applied to individual content or there can be an automatic block of all traffic from the number. These numbers remain in this pending state until a decision has been made on verification status.
- **Unverified:** Unverified numbers have either 1) not submitted a verification application or 2) have had their application denied. These numbers are subject to the highest amount of filtering, and numbers in this state automatically get shut off if any spam or unwanted traffic is detected.

### What happens after I submit the toll-free verification form?
:::image type="content" source="./media/tf-status-blue.png" alt-text="A picture of the toll-free application timeline and the different application statuses." lightbox="./media/tf-status-blue.png":::

After submission of the form, we will coordinate with our downstream peer to get the application verified by the toll-free messaging aggregator. While we are reviewing your application, we may reach out to you for more information.
- From Application Submitted to Pending = **1-5 business days** 
- From Pending to Verdict (Verfied/Rejected/More info needed) = **4-5 weeks**. The toll-free aggregator is currently facing a high volume of applications due to which applications can take around 8 weeks to get approved.

The whole toll-free verification process takes about **5-6 weeks**. These timelines are subject to change depending on the volume of applications to the toll-free messaging aggregator and the [quality](#what-is-considered-a-high-quality-toll-free-verification-application) of your application. The toll-free aggregator is currently facing a high volume of applications due to which applications can take around 8 weeks to get approved.

Updates for changes and the status of your applications will be communicated via the email you provide in the application. For more questions about your submitted application, please email acstns@microsoft.com. 

### How do I submit a toll-free verification?
To submit a toll-free verification application, navigate to Azure Communication Service resource that your toll-free number is associated with in Azure portal and navigate to the Phone numbers blade. Click on the Toll-Free verification application link displayed as "Submit Application" in the infobox at the top of the phone numbers blade. Complete the form.

### What is considered a high quality toll-free verification application? 
The higher the quality of the application the higher chances your application enters [pending state](#what-do-the-different-application-statuses-verified-pending-and-unverified-mean) faster.  

Pointers to ensure you are submitting a high quality application:
- Phone number(s) listed is/are Toll-free number(s)
- All required fields completed
- The use case is not listed on our [Ineligible Use Case](#what-are-the-ineligible-use-cases-for-toll-free-verification) list 
- Opt-in process is documented/detailed
- Opt-in image URL is provided and publicly accessible 
- [CTIA guidelines](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms) are being followed

### What are the ineligible use cases for toll-free verification? 
| High-Risk Financial Services    | Get Rich Quick Schemes            | Debt Forgiveness                 | Illegal Substances/Activites | General                  |
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

### Can I send/receive long messages (>2048 chars)?

Azure Communication Services supports sending and receiving of long messages over SMS. However, some wireless carriers or devices may act differently when receiving long messages. We recommend keeping SMS messages to a length of 320 characters and reducing the use of accents to ensure maximum delivery. 

*Limitation of US short code - There is a known limit of ~4 segments when sending/receiving a message with Non-ASCII characters. Beyond 4 segments, the message may not be delivered with the right formatting.

### Are there any limits on sending messages?

To ensure that we continue offering the high quality of service consistent with our SLAs, Azure Communication Services applies rate limits (different for each primitive). Developers who call our APIs beyond the limit receives a 429 HTTP Status Code Response. 

Rate Limits for SMS:

|Operation|Number Type |Scope|Timeframe (s)| Limit (request #) | Message units per minute|
|---------|---|--|-------------|-------------------|-------------------------|
|Send Message|Toll-Free|Per Number|60|200*|200|
|Send Message|Short Code |Per Number|60|6000*|6000|
|Send Message|Alphanumeric Sender ID |Per resource|60|600*|600|

*If your company has requirements that exceed the rate-limits, submit [a request to Azure Support](../../../azure-portal/supportability/how-to-create-azure-support-request.md) to enable higher throughput.

## Carrier Fees 
### What are the carrier fees for SMS?
US and CA carriers charge an added fee for SMS messages sent and/or received from toll-free numbers and short codes. The carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages. Azure Communication Services charges a standard carrier fee per message segment. Carrier fees are subject to change by mobile carriers. Refer to [SMS pricing](../sms-pricing.md) for more details. 

### When do we come to know of changes to these surcharges?
As with similar Azure services, customers are notified at least 30 days prior to the implementation of any price changes. These charges are reflected on our SMS pricing page along with the effective dates. 

## Emergency support
### Can a customer use Azure Communication Services for emergency purposes?

Azure Communication Services does not support text-to-911 functionality in the United States, but it’s possible that you may have an obligation to do so under the rules of the Federal Communications Commission (FCC).  You should assess whether the FCC’s text-to-911 rules apply to your service or application. To the extent you're covered by these rules, you are responsible for routing 911 text messages to emergency call centers that request them. You're free to determine your own text-to-911 delivery model, but one approach accepted by the FCC involves automatically launching the native dialer on the user’s mobile device to deliver 911 texts through the underlying mobile carrier.
