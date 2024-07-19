---
title: Improve sender reputation in Azure Communication Services email
titleSuffix: An Azure Communication Services concept article
description: Learn about managing sender reputation and email complaints to enhance email delivery in your business-to-consumer communication.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 07/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Improve sender reputation in Azure Communication Services email

This article describes best practices for email delivery in business-to-consumer (B2C) communication and how to use Azure Communication Services email logs to help with your email reputation. This comprehensive guide offers insights into optimizing email complaint management, fostering healthier email practices, and maximizing the success of your email delivery.

## Managing sender reputation and email complaints to enhance email delivery

Azure Communication Services offers email capabilities that can enrich your customer communications. However, there's no guarantee that the emails you send through the platform land in the customer's inbox. To proactively identify and avoid delivery problems, you should perform reputation checks such as:

* Ensuring a consistent and healthy percentage of successfully delivered emails over time.
* Analyzing specific details on email delivery failures and bounces.
* Monitoring spam and abuse reports.
* Maintaining a healthy contact list.
* Understanding user engagement and inbox placements.
* Understanding customer complaints and providing an easy process for opting out or unsubscribing.

To enable email logs and monitor your email delivery, follow the steps in [Azure Communication Services email logs](../../concepts/analytics/logs/email-logs.md).

## Email bounces: Delivery statuses and types

Email bounces indicate problems with the successful delivery of an email. During the email delivery process, the SMTP responses provide the following outcomes:

* **Success (2xx)**: The email service provider accepted the email. However, this outcome doesn't guarantee that the email lands in the customer's inbox. A status of **Delivered** indicates delivery of the email.

* **Temporary failure (4xx)**: The email service provider can't accept the email at the moment. But the recipient's address is still valid, allowing future attempts at delivery. This outcome is often called a *soft bounce*. The cause can be various factors such as rate limiting or infrastructure problems.

* **Permanent failure (5xx)**: The email service provider rejected the email. This outcome is commonly called a *hard bounce*. This type of bounce occurs when the email address doesn't exist. An email delivery status of **Bounced** indicates this outcome.

According to the RFC definitions:

* A hard bounce (permanent failure) specifically refers to cases where the email address is nonexistent.
* A soft bounce encompasses various types of failures.
* A spam bounce typically occurs because of specific policy decisions.

These practices are not always uniform and standardized across email service providers.

### Hard bounces

The following SMTP codes can describe hard bounces:

| Error code | Description | Explanation |
| --- | --- | --- |
| 521 | Server Does Not Accept Mail | The SMTP server encountered problem that prevents it from accepting the incoming mail. |
| 525 | User Account Disabled | The user's email account was disabled and can't receive emails. |
| 550 | Mailbox Unavailable | The recipient's mailbox is unavailable to receive emails. The mailbox might be full or might have a temporary problem. |
| 553 | Mailbox Name Not Allowed | The recipient's email address or mailbox name is not valid, or the email system's policies don't allow it. |
| 5.1.1 | Bad Destination Mailbox Address | The destination mailbox address is invalid or doesn't exist. Check the address for typos or formatting errors. |
| 5.1.2 | Bad Destination System Address | The destination system address is invalid or doesn't exist. Check the recipient's email domain or system for typos or errors. Ensure that the domain or system is correctly configured. |
| 5.1.3 | Bad Destination Mailbox Address Syntax | The syntax of the destination mailbox address is incorrect. Check the recipient's email address for formatting errors or invalid characters. Verify that the address follows the correct syntax. |
| 5.1.4 | Ambiguous Destination Mailbox Address | The recipient's email address is not unique and matches multiple recipients. Check the email address for accuracy and provide a unique address. |
| 5.1.6 | Destination Mailbox Moved | The recipient's mailbox was moved to a different location or server. Check the recipient's new mailbox address for message delivery. |
| 5.1.9 | Non-Compliant Destination System | The recipient's email system is not configured according to standard protocols. Contact the system administrator to resolve the problem. |
| 5.1.10 | Destination Address Null MX | The recipient's email domain doesn't have a valid Mail Exchange (MX) record. Contact the domain administrator to fix the Domain Name System (DNS) configuration. |
| 5.2.1 | Destination Mailbox Disabled | The recipient's mailbox is disabled, which is preventing message delivery. Contact the recipient to enable the mailbox. |
| 5.2.1 | Mailing List Expansion Problem | The destination mailbox is a mailing list, and expansion failed. Contact the mailing list administrator to resolve the problem. |
| 5.3.2 | Destination System Not Accepting Messages | The recipient's email server isn't currently accepting messages. Try resending the email at a later time. |
| 5.4.1 | Recipient Address Rejected | The recipient's email server rejected the message. Check the recipient's email address for accuracy and proper formatting. |
| 5.4.4 | Unable to Route | The message can't be routed to the recipient's server. Verify the recipient's email domain and server settings. |
| 5.4.6 | Routing Loop Detected | The email server encountered a routing loop while attempting to deliver the message. Contact the system administrator to resolve the loop. |
| 5.7.13 | User Account Disabled | The recipient's email account was disabled, and the email server is not accepting messages for that account. The mail service provider might have deactivated or suspended the recipient's email address, rendering the address inaccessible for receiving emails. Or, the user or the organization chose to disable the email account. |
| 5.4.310 | DNS Domain Does Not Exist | The recipient's email domain doesn't exist or has an incorrect DNS configuration. Verify the domain's DNS settings. |

Sending emails repeatedly to addresses that don't exist can significantly affect your sender reputation. It's crucial to take action by promptly removing those addresses from your contact list and diligently managing a healthy contact list.

### Error codes for soft bounces

Closely monitor soft bounces (temporary failures) when you send email. A high volume of soft bounces can indicate a potential reputation issue. Email service providers might be slowing down your mail delivery.

The following SMTP codes can describe soft bounces:

| Error code | Description | Explanation |
| --- | --- | --- |
| 551 | User Not Local, Try Alternate Path | The recipient's email domain is not local to the email system. The system should try an alternate path to deliver the email. |
| 552 | Exceeded Storage Allocation | The recipient's email account reached its storage limit. Ask the recipient to free up space to receive new emails. |
| 554 | Transaction Failed | The email transaction failed for an unspecified reason. Investigate to determine the cause of the failure. |
| 5.2.2 | Destination Mailbox Full | The recipient's mailbox reached its storage limit. The recipient should clear space to receive new emails. |
| 5.2.3 | Message Length Exceeds Administrative Limit | The length of the message exceeds the limit in the recipient's email system. Reduce the length of the message to below the limit. |
| 5.2.121 | Recipient Per Hour Receive Limit Exceeded | The recipient's email system exceeds the limit on the number of emails that it can receive per hour. Try sending the email later. |
| 5.2.122 | Recipient Per Hour Receive Limit Exceeded | The recipient's email system reached its hourly receive limit. Try sending the email later. |
| 5.3.1 | Destination Mail System Full | The recipient's email system is full and can't accept new emails. |
| 5.3.3 | Feature Not Supported on Destination System | The recipient's email system doesn't support a specific feature that's required for successful delivery. |
| 5.3.4 | Message Too Big for Destination System | The message size exceeds the limit in the recipient's email system. Check the email size and consider compression or splitting. |
| 5.5.3 | Too Many Recipients | The email has too many recipients, and a recipient's email system can't process it. The recipient's email system might have a limit on the number of recipients per email. Try reducing the number of recipients. |
| 5.6.1 | Media Not Supported | The recipient's email system doesn't support the media format of the email. Convert the media format to a compatible one. |
| 5.6.2 | Conversion Required and Prohibited | The email's format or content requires conversion, but the recipient's email system can't perform the conversion. |
| 5.6.3 | Conversion Required but Not Supported | The email's format or content requires conversion, but the recipient's email system doesn't support the conversion. |
| 5.6.5 | Conversion Failed | The recipient's email system failed to convert the email format or content. Check the email content and try resending. |
| 5.6.6 | Message Content Not Available | The recipient's email system can't access the content of the email. Check the email's content and attachments for corruption or compatibility. |
| 5.6.11 | Invalid Characters | The email contains invalid characters that the recipient's email system can't process. Remove any invalid characters from the content or subject line and resend the email. |
| 5.7.1 | Delivery Not Authorized, Message Refused | The recipient's email system refused to accept the message because it's not authorized to receive the message. Contact the system administrator to resolve the problem. |
| 5.7.2 | Mailing List Expansion Prohibited | The recipient's email system doesn't allow the expansion of mailing lists. Contact the system administrator for assistance. |
| 5.7.12 | Sender Not Authenticated by Organization | The recipient's organization requires sender authentication. Verify the authentication settings. |
| 5.7.15 | Priority Level Too Low | The email's priority level is too low for the recipient's email system to accept it. The recipient's email system might have restrictions on accepting low-priority emails. Consider increasing the email's priority level. |
| 5.7.16 | Message Too Big for Specified Priority | The message size exceeds the limit that the recipient's email system specifies for the priority level. Check the email size and priority settings. |
| 5.7.17 | Mailbox Owner Has Changed | The recipient's mailbox owner changed, causing message delivery problems. Verify the mailbox ownership and contact the mailbox owner. |
| 5.7.18 | Domain Owner Has Changed | The recipient's email domain owner changed, causing message delivery problems. Verify the domain ownership and contact the domain owner. |
| 5.7.19 | Rrvs Test Cannot Be Completed | The Recipient Rate Validity System (RRVS) test can't be completed on the recipient's email system. Contact the system administrator for assistance. |
| 5.7.20 | No Passing Dkim Signature Found | The recipient's email system didn't find any passing Domain Keys Identified Mail (DKIM) signatures for the email. Verify the DKIM configuration and signature on your side. |
| 5.7.21 | No Acceptable Dkim Signature Found | The recipient's email system didn't find any acceptable DKIM signatures for the email. Verify the DKIM configuration and signature on your side. |
| 5.7.22 | No Valid Author Matched Dkim Signature Found | The recipient's email system didn't find any valid author-matched DKIM signatures for the email. Verify the DKIM configuration and signature on your side. |
| 5.7.23 | SPF Validation Failed | The email failed Sender Policy Framework (SPF) validation on the recipient's email system. Check the SPF records and your email server configuration. |
| 5.7.24 | SPF Validation Error | The recipient's email system found an SPF validation error. Verify the SPF records and your email server configuration. |
| 5.7.25 | Reverse DNS Validation Failed | The email failed reverse DNS validation on the recipient's email system. Verify your reverse DNS settings. |
| 5.7.26 | Multiple Authentication Checks Failed | The email failed multiple authentication checks on the recipient's email system. Review your authentication settings and methods. |
| 5.7.27 | Sender Address Has Null MX | Your email domain doesn't have a valid MX record. Contact the domain administrator to fix the DNS configuration. |
| 5.7.28 | Mail Flood Detected | The recipient's email system detected a mail flood. Check the email traffic and identify the cause of the flood. |
| 5.7.29 | Arc Validation Failure | The email failed Authenticated Received Chain (ARC) validation on the recipient's email system. Verify the ARC signature on your side. |
| 5.7.30 | Require TLS Support Required | The recipient's email system requires Transport Layer Security (TLS) support for secure email transmission. Make sure that your system supports TLS. |
| 5.7.51 | Tenant Inbound Attribution | The recipient's email system attributes the inbound email to a specific tenant. Check the email's sender information and tenant attribution. |

## Managed suppression list

Azure Communication Services offers a feature called a *managed suppression list*, which can play a vital role in protecting and preserving your sender reputation.

The suppression list cache keeps track of email addresses that experienced a hard bounce for all emails sent through Azure Communication Services. Whenever an email delivery fails with one of the specified error codes, the email address is added to the internally managed suppression list, which spans the Azure platform and is maintained globally.

Here's the lifecycle of email addresses that are suppressed:

1. **Initial suppression**: When Azure Communication Services encounters a hard bounce with an email address for the first time, it adds the address to the managed suppression list for 24 hours.

1. **Progressive suppression**: If the same invalid recipient email address reappears in any subsequent emails sent to the platform within the initial 24-hour period, it's automatically suppressed from delivery, and the caching time is extended to 48 hours. For subsequent occurrences, the cache time progressively increases to 96 hours, then 7 days, and ultimately reaches a maximum duration of 14 days.

1. **Automatic removal process**: Email addresses are automatically removed from the managed suppression list when no email send requests are made to the same recipient within the designated lease time frame. After the lease period expires, the email address is removed from the list. If any new emails are sent to the same invalid recipient, Azure Communication Services starts a new cycle by making another delivery attempt.

1. **Drop in delivery**: If an email address is under a lease time, any further mails sent to that recipient address are dropped until the address lease either expires or is removed from the managed suppression list. The delivery status for this email request is **Suppressed** in the email logs.

Email addresses can remain on the managed suppression list for a maximum of 14 days. This proactive measure helps protect your sender reputation and shields you from the adverse effects of repeatedly sending emails to invalid addresses. Nevertheless, you should take action on bounced statuses and regularly clean your contact list to maintain optimal email delivery performance.

## Reputation-related and asynchronous email delivery failures

Some email service providers generate email bounces from reputation issues. These bounces are often classified as spam and abuse related, because of specific reputation or content issues. The bounce messages might include URLs to webpages that provide further explanations for the bounces, to help you understand the reason for the delivery failure and enable appropriate action.

In addition to the SMTP-level bounces, bounces might occur after the receiving server accepts a message. Initially, the response from the email service provider might suggest successful email delivery. But later, the provider sends a bounce response.

These asynchronous bounces are typically directed to the return path address mentioned in the email payload. Be aware of these asynchronous bounces and handle them accordingly to maintain optimal email delivery performance.

## Opt-out or unsubscribe management

Understanding your customers' interest in your email communication and monitoring opt-out or unsubscribe requests are crucial aspects of maintaining a positive sender reputation. Whether you have a manual or automated process in place for handling unsubscribe requests, it's important to provide an **Unsubscribe** link in the email payload that you send. When recipients decide not to receive further emails, they can select the **Unsubscribe** link and remove their email address from your mailing list.

The functionality of the links and instructions in the email is vital. They must be working correctly and promptly notify the application mailing list to remove the contact from the appropriate list.

An unsubscribe mechanism should be explicit and transparent from the subscriber's perspective. It should ensure that users know precisely which messages they're unsubscribing from.

When users are subscribed to multiple lists in your organization, it's ideal to offer users a preferences center that gives them the option to unsubscribe from more than one list. This process prevents accidental unsubscribes and enables users to manage their opt-in and opt-out preferences effectively through the unsubscribe management process.

## Next steps

* [Best practices for implementing DMARC](/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?preserve-view=true&view=o365-worldwide#best-practices-for-implementing-dmarc-in-microsoft-365)
* [Troubleshoot your DMARC implementation](/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?preserve-view=true&view=o365-worldwide#troubleshooting-your-dmarc-implementation)
* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)
* [Create and manage an email communication resource in Azure Communication Services](../../quickstarts/email/create-email-communication-resource.md)
* [Connect a verified email domain in Azure Communication Services](../../quickstarts/email/connect-email-communication-resource.md)

The following topics might be interesting to you:

* Familiarize yourself with the [email client library](../email/sdk-features.md).
* Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
* Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
