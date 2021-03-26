---
title: Messaging Policy
titleSuffix: An Azure Communication Services concept document
description: Learn about SMS messaging policies.
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 03/19/2021
ms.topic: overview
ms.service: azure-communication-services
---

# Azure Communication Services Messaging Policy
Azure Communication Services is transforming the way our customers engage with their clients by building rich, custom communication experiences that leverage the same enterprise-grade services that back Microsoft Teams and Skype. Integrate SMS messaging functionality into your communications solutions to reach your customers anytime and anywhere they need support —you just need to keep in mind a few simple messaging requirements to get started.

We know that messaging requirements can seem daunting to learn, but they are really as easy as remembering “COMS”:
- C - Consent
- O - Opt-Out
- M - Message Content
- S - Spoofing

Simple, right? So, we developed this messaging policy to help you learn about the essential messaging rules that you will need to know to satisfy your regulatory requirements and maintain best practices. That means less time squinting at legal requirements and more time delivering a seamless experience for your customers. 

## Consent 

### What is consent?
Consent is an agreement between you and the message recipient for you to send automated messages to them. You must obtain consent before sending the first message, and you should make clear to the recipient that they are agreeing to receive messages from you. This is known as receiving “prior express consent” from the individual you intend to message.
The messages that you send must be the same type of messages that the recipient agreed to receive and should only be sent to the number that the recipient provided to you. If you intend to send informational messages, such as appointment reminders or alerts, then consent may be either written or oral. If you intend to send promotional messages, such as sales or marketing messages that promote a product or service, then consent must be written.

### How do you obtain consent?
Consent may be obtained in a variety of ways, such as when an individual enters their telephone number into a website, initiates a text message exchange, or sends a sign-up keyword to your phone number. No matter how consent is obtained, you and your customers must ensure that the consent is unambiguous and that the scope of the consent is clear to the recipient.

### Consent Requirements & Best Practices:
- Provide a “Call to Action” Before Obtaining Consent. You and your customers should provide potential message recipients with a “call to action” that invites them to opt-in to your messaging program. The call to action should include: (1) the identity of the message sender, (2) the name or description of your messaging program or product, (3) the number from which they will receive messages, (4) clear opt-in instructions, (5) opt-out instructions, and (6) any other applicable terms and conditions.
- Consent Is Not Transferable or Assignable. Any consent that an individual provides to you cannot be transferred or sold to an unaffiliated third-party. If you collect an individual’s consent for a third-party, then you must clearly identify the third-party to the individual and state that the consent you obtained applies only to communications from the third-party.
- Consent Is Limited in Purpose. An individual who provides their number for a particular purpose consents to receive communications only for that specific purpose and from that specific message sender only. Prior to obtaining consent, you should clearly notify the intended message recipient if you will send recurring messages or messages from an affiliate.
- Keep an Accurate Record of Consent. You should retain records of any consent that an individual provides to you for at least four years. Records of consent may include: timestamps, the medium by which consent was obtained, the specific campaign for which consent was obtained, screen captures, and the session ID or IP address of the consenting individual.
- Maintain Privacy & Security Policies. We recommend that our customers develop straightforward privacy policies that they provide to intended message recipients prior to obtaining consent. We also recommend maintaining proactive security controls to safeguard individuals’ private information.

## Double Opt-In Consent:
Azure Communication Services recommends that you use double opt-in consent for all messaging campaigns. Double opt-in consent is a two-step process in which an individual first provides consent to receive messages of a certain type from you and then you send a follow-up opt-in message to confirm their consent. You should only send additional messages once the message recipient confirms their consent.

The initial confirmation message that you send should include your identity, the option to opt-out of additional messages (such as the use of a “STOP” command), a toll-free number or “HELP” command for additional information, notification that the individual is enrolled in a recurring message program, a brief description of the program, the frequency with which you intend to send recurring messages, and any associated fees. 

### Does Azure Communication Services ever require double opt-in consent?
Yes, while double opt-in consent is always recommended, Azure Communication Services requires that you use double opt-in consent for some types of messaging campaigns due to their frequent use in phishing schemes or their tendency to result in consumer complaints. These campaigns include:
- Auto-warranty messages
- Short-term health insurance plans
- Debt refinancing or interest rate reduction messages if not made by a financial institution
- Lead generation messages
- Sweepstakes, contests, and giveaways
- Work-from-home offers

The campaigns for which double opt-in consent are required are subject to change at the discretion of Azure Communication Services.

### Exceptions to Traditional Consent Rules:
While prior express consent is normally required before sending a message, there are two situations in which consent to message an individual is implied.

- Individual Initiates a Communication. If an individual initiates a communication by sending a message to you, then you may provide relevant information in response to a specific inquiry or request contained in the message. However, the implied consent that the individual provided is limited to the conversation that the individual initiated unless you obtain consent for further communications.
- Exemptions for Specific Services. There are several specific services for which you may have implied consent to initiate a message - the most common of these are: package delivery messages, financial institution messages that concern time-sensitive topics (such as potentially fraudulent transactions or data breaches), and healthcare provider messages that include time-sensitive information and a treatment purpose (such as appointment or exam reminders, lab results, and prescription notifications). None of these messages may include solicitations or advertisements.

## Opt-Out
Message recipients may revoke consent and opt-out of receiving future messages through any reasonable means. You may not designate an exclusive means for message recipients to revoke consent. 

### Opt-Out Requirements & Best Practices:
You should ensure that message recipients can opt-out of future messages at any time, and you must offer multiple opt-out options. After a message recipient opts-out, you should not send additional messages unless the individual provides renewed consent.

One of the most common opt-out mechanisms is to include a “STOP” keyword in the initial message of every new conversation. You should also be equipped to remove individuals that reply with a lowercase “stop” or other common keywords, such as “unsubscribe” or “cancel.”

Other common opt-out mechanisms include providing a designated opt-out e-mail address, the phone number of customer support staff, or a link to unsubscribe on your webpage. After an individual revokes consent, you should remove them from all recurring messaging programs unless they expressly elect to continue receiving messages from a particular program.

### How We Handle Opt-Out Requests:
If an individual requests to opt-out of future messages on an Azure Communication Services toll-free number, then all further traffic from that number will be automatically stopped. However, you must still ensure that you do not send additional messages from new or different numbers. 
## Message Content

### Adult Content:
Message content that includes elements of sex, hate, alcohol, firearms, tobacco, gambling, or sweepstakes and contests may trigger additional requirements or is expressly prohibited in some jurisdictions. If you send a message that includes this content, then it is your duty to abide by all applicable laws of the jurisdictions in which the communications are received. At the request of law enforcement or Azure Communication Services, you must be prepared to provide proof of consent with local laws that regulate adult content.

Even where such content is not unlawful, you should include an age verification mechanism at opt-in to age-gate the intended message recipient from adult content. In the United States, additional legal requirements apply to marketing communications directed at children under the age of 13. 

### Prohibited Content:
Azure Communication Services prohibits certain message content regardless of consent. Prohibited content includes:
- Unlawful content (e.g., gambling-related messages in China)
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
Spoofing is the act of causing a misleading or inaccurate originating number to display on a message recipient’s device. We strongly discourage you and any service provider that you use from sending spoofed messages because spoofing shields the identity of the message sender and prevents message recipients from easily opting out of unwanted communications. We also require that you abide by all applicable spoofing laws.

## Final Thoughts

### Legal Responsibility:
This Messaging Policy does not constitute legal advice, and we reserve the right to modify the policy at any time. Azure Communication Services is not responsible for ensuring that the content, timing, or recipients of our customers’ messages meet all applicable legal requirements. 

Our customers are responsible for all messaging requirements. If you are a platform or software provider that uses Azure Communication Services for messaging purposes, then you should require that your customers also abide by all of the requirements discussed in this Messaging Policy. For further guidance, the CTIA provides helpful [Messaging Principles and Best Practices](https://api.ctia.org/wp-content/uploads/2019/07/190719-CTIA-Messaging-Principles-and-Best-Practices-FINAL.pdf).

### Penalties:
We encourage our customers to develop and implement policies and procedures designed to ensure compliance with all messaging requirements. Violations of messaging requirements may lead to substantial fines that can balloon quickly, so it is in your best interest to learn and abide by all applicable messaging requirements and develop effective mitigation safeguards to contain and eliminate violations before they spread. If you do breach our Messaging Policy or other legal requirements, then we will work with you to ensure future compliance. However, we reserve the right to remove any customer from the Azure Communication Services platform who demonstrates a pattern of noncompliance with our Messaging Policy or legal requirements.
