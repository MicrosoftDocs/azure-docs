---
title: Best practices for sender authentication support
titleSuffix: An Azure Communication Services article
description: This article desribes the best practices for Sender Authentication Support.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Best practices for sender authentication support

This article provides the Email Sending best practices on DNS records and how to use the sender authentication methods that help prevent attackers from sending messages that look like they come from your domain.

## Email authentication and DNS setup

Sending an email requires several steps which include verifying the sender of the email actually owns the domain, checking the domain reputation, virus scanning, filtering for spam, phishing attempts, malware, and so on. Configuring proper email authentication is a foundational principle for establishing trust in email and protecting your domain’s reputation. If an email passes authentication checks, the receiving domain can apply policy to that email in keeping with the reputation already established for the identities associated with those authentication checks. The recipient can be assured that those identities are valid. 

### MX (Mail Exchange) record

MX (Mail Exchange) record is used to route email to the correct server. It specifies the mail server responsible for accepting email messages on behalf of your domain. DNS needs to be updated with the latest information of MX records of your email domain otherwise it results in some delivery failures.

### SPF (Sender Policy Framework)

SPF  [RFC 7208](https://tools.ietf.org/html/rfc7208)  is a mechanism that allows domain owners to publish and maintain, via a standard DNS TXT record, a list of systems authorized to send email on their behalf. This record is used to specify which mail servers are authorized to send email on behalf of your domain. It helps to prevent email spoofing and increase email deliverability.

### DKIM (Domain Keys Identified Mail)

DKIM [RFC 6376](https://tools.ietf.org/html/rfc6376) allows an organization to claim responsibility for transmitting a message in a way that the recipient can validate. This record is also used to authenticate the domain the email is sent from, and helps to prevent email spoofing and increase email deliverability.

### DMARC (Domain-based Message Authentication, Reporting, and Conformance)

DMARC [RFC 7489](https://tools.ietf.org/html/rfc7489) is a scalable mechanism by which a mail-originating organization can express domain-level policies and preferences for message validation, disposition, and reporting. Mail-receiving organizations can use RFC 7489 to improve mail handling. You can also use RFC 7489 to specify how email receivers should handle messages that fail SPF and DKIM checks. This improves email deliverability and helps to prevent email spoofing.

### ARC (Authenticated Received Chain)

The ARC protocol [RFC 8617](https://tools.ietf.org/html/rfc8617)  provides an authenticated chain of custody for a message, allowing each entity that handles the message to identify what entities handled it previously and the message’s authentication assessment at each hop. ARC isn't yet an internet standard, but adoption is increasing. 

### How Email authentication works

Email authentication verifies that email messages from a sender (for example, notification@contoso.com) are legitimate and come from expected sources for that email domain (for example, contoso.com).

An email message may contain multiple originator or sender addresses. These addresses are used for different purposes. For example, consider these addresses:

* Mail From address identifies the sender and specifies where to send return notices if any problems occur with the delivery of the message, such as nondelivery notices. Return notices appear in the envelope portion of an email message and don't display by your email application. This is sometimes called the 5321.MailFrom address or the reverse-path address.

* From address is the address displayed as the From address by your mail application. This address identifies the author of the email. That is, the mailbox of the person or system responsible for writing the message. This is sometimes called the 5322.From address.

* Sender Policy Framework (SPF) helps validate outbound email sent from your mail from domain (is coming from who it says it is).

* DomainKeys Identified Mail (DKIM) helps to ensure that destination email systems trust messages sent outbound from your mail from domain.

* Domain-based Message Authentication, Reporting, and Conformance(DMARC) works with Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) to authenticate mail senders. This approach ensures that destination email systems trust messages sent from your domain.

### Implementing DMARC

Implementing DMARC with SPF and DKIM provides rich protection against spoofing and phishing email. SPF uses a DNS TXT record to provide a list of authorized sending IP addresses for a given domain. Normally, SPF checks are only performed against the 5321.MailFrom address. This means that the 5322.From address isn't authenticated when you use SPF by itself. This allows for a scenario where a user can receive a message, which passes an SPF check but has a spoofed 5322.From sender address.

Like the DNS records for SPF, the record for DMARC is a DNS text (TXT) record that helps prevent spoofing and phishing. You publish DMARC TXT records in DNS. DMARC TXT records validate the origin of email messages by verifying the IP address of an email's author against the alleged owner of the sending domain. The DMARC TXT record identifies authorized outbound email servers. Destination email systems can then verify that messages they receive originate from authorized outbound email servers. This forces a mismatch between the 5321.MailFrom and the 5322.From addresses in all email sent from your domain and DMARC fails for that email. To avoid this, you need to set up DKIM for your domain. 

A DMARC policy record enables a domain to announce that their email uses authentication. The policy record provides an email address to gather feedback about the use of their domain. The policy record also specifies a requested policy for the handling of messages that don't pass authentication checks. We recommend that:
- Policy statements domains publishing DMARC records be “p=reject” where possible, “p=quarantine” otherwise. 
- Treat the policy statement of “p=none”, “sp=none”, and pct<100 as transitional states, with the goal of removing them as quickly as possible. 
- Any published DMARC policy record should include, at a minimum, a `rua` tag that points to a mailbox for receiving DMARC aggregate reports and should send no replies back when receiving reports due to privacy concerns.

## Next steps

* [Best practices for implementing DMARC](/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?preserve-view=true&view=o365-worldwide#best-practices-for-implementing-dmarc-in-microsoft-365)
  
* [Troubleshoot your DMARC implementation](/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?preserve-view=true&view=o365-worldwide#troubleshooting-your-dmarc-implementation) 

* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

 ## Related articles

- Familiarize yourself with the [Email client library](../email/sdk-features.md).
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md).
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md).
