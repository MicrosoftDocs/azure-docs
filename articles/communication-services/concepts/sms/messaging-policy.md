---
title: Messaging Policy
titleSuffix: An Azure Communication Services concept document
description: Learn about SMS messaging policies.
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---
# Azure Communication Services Messaging Policy

Azure Communication Services is transforming the way our customers engage with their clients by building rich, custom communication experiences that take advantage of the same enterprise-grade services that back Microsoft Teams, Skype, and Exchange. You can easily integrate SMS and email messaging functionality into your communications solutions to reach your customers anytime and anywhere they need support. You just need to keep in mind a few messaging requirements and industry standards to get started.

We know that messaging requirements can seem daunting to learn, but they're as easy as remembering “COMS”:

- C - Consent
- O - Opt-Out
- M - Message Content
- S - Spoofing

We developed this messaging policy to help you satisfy regulatory requirements and align with recommended best practices. 

[!INCLUDE [Notice](../../includes/messaging-policy-include.md)]

## Consent 

### What is consent?

Consent is an agreement between you and the message recipient that allows you to send application to person (A2P) messages to them. You must obtain consent before sending the first message, and you should make clear to the recipient that they're agreeing to receive messages from you. This procedure is known as receiving "prior express consent" from the individual you intend to message.

The messages that you send must be the same type of messages that the recipient agreed to receive and should only be sent to the number or email address that the recipient provided to you. If you intend to send informational messages, such as appointment reminders or alerts, then consent can be either written or oral. If you intend to send promotional messages, such as sales or marketing messages that promote a product or service, then consent must be written.

### How do you obtain consent?

Consent can be obtained in a variety of ways, such as:

- When a user enters their telephone number or email address into a website, 
- When a user initiates a text message exchange, or
- When a user sends a sign-up keyword to your phone number. 
 
Regardless of how consent is obtained, you and your customers must ensure that the consent is unambiguous. The scope of the consent should clear to the recipient.

### Consent requirements:

- Provide a “Call to Action” before obtaining consent. You and your customers should provide potential message recipients with a “call to action” that invites them to opt in to your messaging program. The call to action should include, at a minimum: (1) the identity of the message sender, (2) clear opt-in instructions, (3) opt-out instructions, and (4) any associated messaging fees.
- Consent isn't transferable or assignable. Any consent that an individual provides to you cannot be transferred or sold to an unaffiliated third party. If you collect an individual’s consent for a third party, then you must clearly identify the third party to the individual. You must also state that the consent you obtained applies only to communications from the third party.
- Consent is limited in purpose. An individual who provides their number or an email address for a particular purpose consents to receive communications only for that specific purpose and from that specific message sender. Before obtaining consent, you should clearly notify the intended message recipient if you'll send recurring messages or messages from an affiliate.

### Consent best practices:

In addition to the messaging requirements discussed above, you may want to implement several common best practices, including: 

- Detailed “Call to Action” information. To ensure that you obtain appropriate consent, provide
  - The name or description of your messaging program or product
  - The number(s) or email address(es) from which recipients will receive messages, and 
  - Any applicable terms and conditions before an individual opts-in to receiving messages from you.
- Accurate records of consent. You should retain records of any consent that an individual provides to you for at least four years. Records of consent can include:
  - Timestamps
  - The medium by which consent was obtained
  - The specific campaign for which consent was obtained
  - Screen captures
  - The session ID or IP address of the consenting individual.
- Privacy and security policies. Developers are encouraged to provide straightforward privacy policies that message recipients can review before their consent is obtained. We also recommend maintaining proactive security controls to safeguard individuals’ private information.

## Double opt-In consent:

Azure Communication Services recommends that you use double opt-in consent for all messaging campaigns. Double opt-in consent is a two-step process where an individual first provides consent to receive certain types of messages from you. You then send a follow-up opt-in message to confirm their consent. You should send more messages only once the message recipient confirms their consent.

The initial confirmation message that you send should include your identity, the option to opt-out of future messages (such as the use of a “STOP” command), a toll-free number or “HELP” command for additional information, notification that the individual is enrolled in a recurring message program, a brief description of the program, the frequency with which you intend to send recurring messages, and any associated fees. 

### Does Azure Communication Services ever require double opt-in consent?
Yes, while double opt-in consent is always recommended, Azure Communication Services requires that you use double opt-in consent for some types of messaging campaigns due to their frequent use in phishing schemes or their tendency to result in consumer complaints. These campaigns include:
- Auto-warranty messages
- Short-term health insurance plans
- Debt refinancing or interest rate reduction messages if not made by a financial institution
- Lead generation messages
- Sweepstakes, contests, and giveaways
- Work-from-home offers

The campaigns for which double opt-in consent is required are subject to change at the discretion of Azure Communication Services.

### Exceptions to traditional consent rules:
While prior express consent is normally required before sending a message, there are two situations in which consent to message an individual is implied.

- Recipient initiates a communication. If an individual initiates a communication by sending a message to you, then you may provide relevant information in response to a specific inquiry or request contained in the message. However, the implied consent that the individual provided is limited to the conversation that the individual initiated unless you obtain consent for further communications.
- Exemptions for specific services. There are several specific services for which you may have implied consent to initiate a message. The most common of these are: 
- Package delivery messages
- Financial institution messages that concern time-sensitive topics (such as potentially fraudulent transactions or data breaches)
- Healthcare provider messages that include time-sensitive information and a treatment purpose (such as appointment or exam reminders, lab results, and prescription notifications). 
 
None of these messages may include solicitations or advertisements.

## Opt-out

Message recipients may revoke consent and opt-out of receiving future messages through any reasonable means. You may not designate an exclusive means for message recipients to revoke consent. 

### Opt-out requirements:

Ensure that message recipients can opt-out of future messages at any time. You must also offer multiple opt-out options. After a message recipient opts-out, you should not send additional messages unless the individual provides renewed consent.

One of the most common opt-out mechanisms in SMS applications is to include a “STOP” keyword in the initial message of every new conversation. Be prepared to remove customers that reply with a lowercase “stop” or other common keywords, such as “unsubscribe” or “cancel.”  

For email, it is to embed a link to unsubscribe in every email sent to the customer. If the customer selects the unsubscribe link, you should be prepared to remove that customer email address(es) from your communication list.

After an individual revokes consent, you should remove them from all recurring messaging campaigns unless they expressly elect to continue receiving messages from a particular program.

### Opt-out best practices:

In addition to keywords, other common opt-out mechanisms include providing customers with a designated opt-out e-mail address, the phone number of customer support staff, or a link to unsubscribe embedded in an email message you sent or available on your webpage. 

### How we handle opt-out requests for SMS

If an individual requests to opt-out of future messages on an Azure Communication Services toll-free number or short code, then all further traffic from that number will be automatically stopped. However, you must still ensure that you do not send additional messages for that messaging campaign from new or different numbers. If you have separately obtained express consent for a different messaging campaign, then you must ask the customer to respond with a START message to resubscribe or may continue to send messages from a different number for that campaign. For alphanumeric sender ID, you are required to provide alternative mechanisms like email/call support or opt-out link for the customer to opt out. Check out our FAQ section to learn more on [Opt-out handling](./sms-faq.md#opt-out-handling).

### How we handle opt-out requests for email

If an individual requests to opt out of future messages on Azure Communication Services using the unsubscribe UI page to process the unsubscribe requests, you will have to add the requested recipient's email address to the suppression list that will be used to filter recipients during the send-mail process. 

## Message content

### Adult content:

Message content that includes elements of sex, hate, alcohol, firearms, tobacco, gambling, or sweepstakes and contests can trigger additional requirements. This content is expressly prohibited in some jurisdictions. If you send a message that includes this content, then it is your duty to abide by all applicable laws of the jurisdictions in which the communications are received. At the request of law enforcement or Azure Communication Services, you must be prepared to provide proof of consent with local laws that regulate adult content.

Even where such content is not unlawful, you should include an age verification mechanism at opt in to age-gate the intended message recipient from adult content. In the United States, additional legal requirements apply to marketing communications directed at children under the age of 13. 

### Prohibited practices:

Both you and your customers are prohibited from using Azure Communication Services to evade reasonable opt-out requests. Additionally, you and your customers may not evade any measures implemented by Azure Communication Services or a communications service provider to ensure your compliance with messaging requirements and industry standards.

Azure Communication Services also prohibits certain message content regardless of consent. Prohibited content includes:
- Content that promotes unlawful activities (for example, tax evasion or animal cruelty in the United States)
- Hate speech, defamatory speech, harassment, or other speech determined to be patently offensive
- Pornographic content
- Obscene or vulgar content
- Intimidation and threats
- Content that intends to defraud, deceive, cause harm, or wrongfully obtain anything of value 
- Content that incites harm, discrimination, or violence
- Content that spreads malware
- Content that intends to evade age-gating requirements

We reserve the right to modify the list of prohibited message content at any time.

## Spoofing

Spoofing is the act of causing a misleading or inaccurate originating number or email address to display on a message recipient’s device. We strongly discourage you and any service provider that you use from sending spoofed messages. Spoofing shields the identity of the message sender and prevents message recipients from easily opting out of unwanted communications. We also require that you abide by all applicable spoofing laws.

## Final thoughts

### Legal Responsibility:

This Messaging Policy does not constitute legal advice, and we reserve the right to modify the policy at any time. Azure Communication Services is not responsible for ensuring that the content, timing, or recipients of our customers’ messages meet all applicable legal requirements. 

Our customers are responsible for all messaging requirements. If you are a platform or software provider that uses Azure Communication Services for messaging purposes, then you should require that your customers also abide by all of the requirements discussed in this Messaging Policy. For further guidance, the CTIA's [Messaging Principles and Best Practices](https://api.ctia.org/wp-content/uploads/2019/07/190719-CTIA-Messaging-Principles-and-Best-Practices-FINAL.pdf) provides a helpful overview of the relevant industry standards.

### Penalties:

We encourage our customers to develop and implement policies and procedures designed to ensure compliance with all messaging requirements. Violations of messaging requirements may lead to substantial fines that can balloon quickly. It's in your best interest to learn and abide by all applicable messaging requirements and develop effective mitigation safeguards to contain and eliminate violations before they spread. If you do breach our Messaging Policy or other legal requirements, then we'll work with you to ensure future compliance. However, we reserve the right to remove any customer from the Azure Communication Services platform who demonstrates a pattern of noncompliance with our Messaging Policy or legal requirements.
