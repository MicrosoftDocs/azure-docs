---
title: Comprehending sender reputation and managed suppression list within Azure Communication Service Email
titleSuffix: An Azure Communication Services concept document
description: Learn about Managing Sender Reputation and Email Complaints to enhance Email Delivery in your B2C Communication.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 07/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Comprehending sender reputation and managed suppression list within Azure Communication Service Email

This article provides the Email delivery best practices and how to use the Azure Communication Services Email Logs that help with your email reputation. This comprehensive guide also offers invaluable insights into optimizing email complaint management, fostering healthier email practices, and enhancing your email delivery success, maximizing the chances of reaching recipients' inboxes effectively.

## Managing sender reputation and email complaints to enhance email delivery in your B2C communication
Azure Communication Service Email offers a powerful platform to enrich your customer communications. However, the platform doesn't guarantee that the emails that are sent through the platform lands in the customer's inbox. To proactively identify and avoid significant delivery problems, several reputation checks should be in place, including but not limited to:

* Ensuring a consistent and healthy percentage of successfully delivered emails over time.
* Analyzing specific details on email delivery failures and bounces.
* Monitoring spam and abuse reports.
* Maintaining a healthy contact list.
* Understanding user engagement and inbox placements.
* Understanding customer complaints and providing an easy opt-out process for unsubscribing.

To enable email logs and monitor your email delivery, follow the steps outlined in [Azure Communication Services email logs Communication Service in Azure Communication Service](../../concepts/analytics/logs/email-logs.md).

## Email bounces: Understanding delivery status and types
Email bounces indicate issues with the successful delivery of an email. During the email delivery process, the SMTP responses provide the following outcomes:

*  Success (2xx): This indicates that the email has been accepted by the email service provider. However, it doesn't guarantee that the email lands in the customer's inbox. In our email delivery status, this is represented as "Delivered."

*  Temporary failure (4xx): In this case, the email can't be accepted at the moment, often referred to as a "soft bounce." It may be caused by various factors such as rate limiting or infrastructure problems.

*  Permanent failure (5xx): Here, the email isn't accepted, which is commonly known as a "hard bounce." This type of bounce occurs when the email address doesn't exist. In our email delivery status, this is explicitly represented as "Bounced". 

According to the RFCs, a hard bounce (permanent failure) specifically refers to cases where the email address is nonexistent. On the other hand, a soft bounce encompasses various types of failures, while a spam bounce typically occurs due to specific policy decisions. Please note that these practices are not always uniform and standardized across different email service providers.

### Hard bounces
A hard bounce occurs when an email can't be delivered because the recipient's address doesn't exist. The list of SMTP codes that can be used to describe hard bounces is as follows:

| Error code | Description | Possible cause | Additional information |
| --- | --- | --- | --- |
| 521 | Server Does Not Accept Mail | The SMTP server is unable to accept the mail. | The SMTP server encountered an issue that prevents it from accepting the incoming mail. |
| 525 | User Account Disabled | The user's email account has been disabled. | The user's email account has been disabled, and they are unable to receive emails. |
| 550 | Mailbox Unavailable | The recipient's mailbox is unavailable to receive emails. | The recipient's mailbox is unavailable, which could be due to various reasons like being full or temporary issues with the mailbox. |
| 553 | Mailbox Name Not Allowed | The recipient's email address or mailbox name is not allowed. | The recipient's email address or mailbox name is not valid or not allowed by the email system's policies. |
| 5.1.1 | Bad Destination Mailbox Address | The destination mailbox address is invalid or doesn't exist. | Check the recipient's email address for typos or formatting errors. Verify that the email address is valid and exists. |
| 5.1.2 | Bad Destination System Address | The destination system address is invalid or doesn't exist. | Check the recipient's email domain or system for typos or errors. Ensure that the domain or system is correctly configured. |
| 5.1.3 | Bad Destination Mailbox Address Syntax | The syntax of the destination mailbox address is incorrect. | Check the recipient's email address for formatting errors or invalid characters. Verify that the address follows the correct syntax. |
| 5.1.4 | Ambiguous Destination Mailbox Address | The destination mailbox address is ambiguous. | The recipient's email address is not unique and matches multiple recipients. Check the email address for accuracy and provide a unique address. |
| 5.1.6 | Destination Mailbox Moved | The destination mailbox has been moved. | The recipient's mailbox has been moved to a different location or server. Check the recipient's new mailbox address for message delivery. |
| 5.1.9 | Non-Compliant Destination System | The destination system doesn't comply with email standards. | The recipient's email system is not configured according to standard protocols. Contact the system administrator to resolve the issue. |
| 5.1.10 | Destination Address Null MX | The destination address has a null MX record. | The recipient's email domain doesn't have a valid Mail Exchange (MX) record. Contact the domain administrator to fix the DNS configuration. |
| 5.2.1 | Destination Mailbox Disabled | The destination mailbox is disabled. | The recipient's mailbox is disabled, preventing message delivery. Contact the recipient to enable their mailbox. |
| 5.2.1 | Mailing List Expansion Problem | The destination mailbox is a mailing list, and expansion failed. | The recipient's mailbox is a mailing list, and there was an issue with expanding the list. Contact the mailing list administrator to resolve the issue. |
| 5.3.2 | Destination System Not Accepting Messages | The destination system is not currently accepting messages. | The recipient's email server is not accepting messages at the moment. Try resending the email at a later time. |
| 5.4.1 | Recipient Address Rejected | The recipient's address is rejected. | The recipient's email server has rejected the message. Check the recipient's email address for accuracy and proper formatting. |
| 5.4.4 | Unable to Route | The message cannot be routed to the destination. | There is an issue with routing the message to the recipient's server. Verify the recipient's email domain and server settings. |
| 5.4.6 | Routing Loop Detected | A routing loop has been detected. | The email server has encountered a routing loop while attempting to deliver the message. Contact the system administrator to resolve the loop. |
| 5.7.13 | User Account Disabled | The recipient's email account has been disabled, and the email server is not accepting messages for that account. | The recipient's email address may have been deactivated or suspended by the mail service provider, rendering it inaccessible for receiving emails. This status usually occurs when the user or organization has chosen to disable the email account or due to administrative actions. |
| 5.4.310 | DNS Domain Does Not Exist | The DNS domain specified in the email address does not exist. | The recipient's email domain does not exist or has DNS configuration issues. Verify the domain's DNS settings. |

Sending emails repeatedly to addresses that don't exist can significantly affect your sending reputation. It's crucial to take action by promptly removing those addresses from your contact list and diligently managing a healthy contact list.

### Soft bounces: Understanding temporary mail delivery failures

A soft bounce occurs when an email can't be delivered temporarily, but the recipient's address is still valid, allowing future attempts at delivery. Please closely monitor soft bounces during email sending, as a high volume of soft bounces (temporary failures) can indicate a potential reputation issue. Email Service Providers may be slowing down your mail delivery.

Here's a list of SMTP codes that can be used to describe soft bounces:

| Error code | Description | Possible cause | Additional information |
| --- | --- | --- | --- |
| 551 | User Not Local, Try Alternate Path | The recipient's email address domain is not local, and the email system should try an alternate path. | The recipient's email domain is not local to the email system. The system should try an alternate path to deliver the email. |
| 552 | Exceeded Storage Allocation | The recipient's email account has exceeded its storage allocation. | The recipient's email account has reached its storage limit. The sender should inform the recipient to free up space to receive new emails. |
| 554 | Transaction Failed | The email transaction failed for an unspecified reason. | The email transaction failed, but the specific reason was not provided. Further investigation is required to determine the cause of the failure. |
| 5.2.2 | Destination Mailbox Full | The destination mailbox is full. | The recipient's mailbox has reached its storage limit. The recipient should clear space to receive new emails. |
| 5.2.3 | Message Length Exceeds Administrative Limit | The message length exceeds the administrative limit of the recipient's email system. | The recipient's email system has a maximum message size limit. Ensure the message size is within the recipient's limits. |
| 5.2.121 | Recipient Per Hour Receive Limit Exceeded | The recipient's email system has exceeded the hourly receive limit from the sender. | The recipient's email system has set a limit on the number of emails it can receive per hour from the sender. Try sending the email later. |
| 5.2.122 | Recipient Per Hour Receive Limit Exceeded | The recipient's email system has exceeded the hourly receive limit. | The recipient's email system has reached its hourly receive limit. Try sending the email later. |
| 5.3.1 | Destination Mail System Full | The destination mail system is full. | The recipient's email system is full and can't accept new emails. |
| 5.3.3 | Feature Not Supported on Destination System | The destination email system does not support the feature required for delivery. | The recipient's email system does not support a specific feature required for successful delivery. |
| 5.3.4 | Message Too Big for Destination System | The message size is too big for the destination email system. | The recipient's email system has a message size limit, and the message size exceeds it. Verify the email size and consider compression or splitting. |
| 5.5.3 | Too Many Recipients | The email has too many recipients, and the recipient email system can't process it. | The recipient's email system may have a limit on the number of recipients per email. Try reducing the number of recipients. |
| 5.6.1 | Media Not Supported | The media format of the email is not supported. | The recipient's email system does not support the media format used in the email. Convert the media format to a compatible one. |
| 5.6.2 | Conversion Required and Prohibited | The recipient's email system cannot convert the email format as required. | The email's format or content requires conversion, but the recipient's system cannot perform the conversion. |
| 5.6.3 | Conversion Required but Not Supported | The recipient's email system cannot convert the email format as required. | The email's format or content requires conversion, but the recipient's system does not support the conversion. |
| 5.6.5 | Conversion Failed | The email conversion process has failed. | The recipient's email system failed to convert the email format or content. Verify the email content and try resending. |
| 5.6.6 | Message Content Not Available | The content of the email is not available. | The recipient's email system cannot access the content of the email. Check the email's content and attachments for corruption or compatibility. |
| 5.6.11 | Invalid Characters | The email contains invalid characters that the recipient's email system cannot process. | Remove any invalid characters from the email content or subject line and resend the email. |
| 5.7.1 | Delivery Not Authorized, Message Refused | The recipient's email system is not authorized to receive the message. | The recipient's email system has refused to accept the message. Contact the system administrator to resolve the issue. |
| 5.7.2 | Mailing List Expansion Prohibited | The recipient's email system does not allow mailing list expansion. | The recipient's email system has prohibited the expansion of mailing lists. Contact the system administrator for further assistance. |
| 5.7.12 | Sender Not Authenticated by Organization | The sender is not authenticated by the recipient's organization. | The recipient's email system requires sender authentication by the organization. Verify the sender's authentication settings. |
| 5.7.15 | Priority Level Too Low | The email's priority level is too low to be accepted by the recipient's email system. | The recipient's email system may have restrictions on accepting low-priority emails. Consider increasing the email's priority level. |
| 5.7.16 | Message Too Big for Specified Priority | The message size exceeds the limit specified for the priority level. | The recipient's email system has a message size limit for the specified priority level. Check the email size and priority settings. |
| 5.7.17 | Mailbox Owner Has Changed | The mailbox owner has changed. | The recipient's mailbox owner has changed, causing message delivery issues. Verify the mailbox ownership and contact the mailbox owner. |
| 5.7.18 | Domain Owner Has Changed | The domain owner has changed. | The recipient's email domain owner has changed, causing message delivery issues. Verify the domain ownership and contact the domain owner. |
| 5.7.19 | Rrvs Test Cannot Be Completed | The RRVs test cannot be completed. | The Recipient Rate Validity System (RRVs) test cannot be completed on the recipient's email system. Contact the system administrator for assistance. |
| 5.7.20 | No Passing Dkim Signature Found | The email has no passing DKIM signature. | The recipient's email system did not find any passing DKIM signatures. Verify the DKIM configuration and signature on the sender's side. |
| 5.7.21 | No Acceptable Dkim Signature Found | The email has no acceptable DKIM signature. | The recipient's email system did not find any acceptable DKIM signatures. Verify the DKIM configuration and signature on the sender's side. |
| 5.7.22 | No Valid Author Matched Dkim Signature Found | The email has no valid author-matched DKIM signature. | The recipient's email system did not find any valid author-matched DKIM signatures. Verify the DKIM configuration and signature on the sender's side. |
| 5.7.23 | SPF Validation Failed | The email failed SPF validation. | The recipient's email system found SPF validation failure. Check the SPF records and sender's email server configuration. |
| 5.7.24 | SPF Validation Error | The email encountered an SPF validation error. | The recipient's email system found an SPF validation error. Verify the SPF records and sender's email server configuration. |
| 5.7.25 | Reverse DNS Validation Failed | The email failed reverse DNS validation. | The recipient's email system encountered a reverse DNS validation failure. Verify the sender's reverse DNS settings. |
| 5.7.26 | Multiple Authentication Checks Failed | Multiple authentication checks for the email have failed. | The recipient's email system failed multiple authentication checks for the email. Review the sender's authentication settings and methods. |
| 5.7.27 | Sender Address Has Null MX | The sender's address has a null MX record. | The sender's email domain doesn't have a valid Mail Exchange (MX) record. Contact the domain administrator to fix the DNS configuration. |
| 5.7.28 | Mail Flood Detected | A mail flood has been detected. | The recipient's email system has detected a mail flood. Check the email traffic and identify the cause of the flood. |
| 5.7.29 | Arc Validation Failure | The email failed ARC (Authenticated Received Chain) validation. | The recipient's email system encountered an ARC validation failure. Verify the ARC signature on the sender's side. |
| 5.7.30 | Require TLS Support Required | The email requires TLS (Transport Layer Security) support. | The recipient's email system requires TLS support for secure email transmission. Make sure the sender supports TLS. |
| 5.7.51 | Tenant Inbound Attribution | The inbound email is attributed to a tenant. | The recipient's email system attributes the inbound email to a specific tenant. Check the email's sender information and tenant attribution. |

## Managed suppression list: Safeguarding sender reputation in Azure Communication Services

Azure Communication Services offers a valuable feature known as *Managed Suppression List*, which plays a vital role in protecting and preserving your sender reputation. This suppression list cache diligently keeps track of email addresses that have experienced a "Hard Bounced" status for all emails sent through the Azure Communication Service Platform. Whenever an email fails to deliver with one of the specified error codes, the email address is added to our internally managed suppression List, which spans across our platform and is maintained globally.
Here's the lifecycle of email addresses that are suppressed:

*  Initial Suppression: When a hard bounce is encountered with an email address for the first time, it is added to the *Managed Suppression List* for 24 hours.

*  Progressive Suppression: If the same invalid recipient email address reappears in any subsequent emails sent to our platform within the initial 24-hour period, it will automatically be suppressed from delivery, and the caching time will be extended to 48 hours. For subsequent occurrences, the cache time will progressively increase to 96 hours, then 7 days, and ultimately reach a maximum duration of 14 days.

*  Auto-Removal Process: Email addresses are automatically removed from our *Managed Suppression List* when no email send requests have been made to the same recipient within the designated lease timeframe. Once the lease period expires, the email address is removed from the list, and if any new emails are sent to the same invalid recipient, another delivery attempt will be initiated, thereby initiating a new cycle.

*  Drop in Delivery: If an email address is under a lease time, any further mails sent to that recipient address will be dropped until the address lease either expires or is removed from the Managed Suppression List. The delivery status for this email request is represented as "Suppressed" in our email logs.

Please note that email addresses can only remain on the *Managed Suppression List* for a maximum of 14 days. This proactive measure ensures that your sender reputation remains intact and shields you from adverse effects caused by repeatedly sending emails to invalid addresses. Nevertheless, you take action on bounced status and regularly clean your contact list to maintain optimal email delivery performance.


## Understanding reputation-related and asynchronous email delivery failures

Some Email Service Providers (ESPs) generate email bounces due to reputation issues. These bounces are often classified as spam and abuse related, resulting from specific reputation or content problems. In such cases, the bounce messages may include URLs that link to webpages providing further explanations for the bounces, helping you understand the reason for the delivery failure and enabling appropriate action.

In addition to the SMTP-level bounces, there are cases where bounces occur after the message has been initially accepted by the receiving server. Initially, the response from the Email Service Provider may suggest successful email delivery, but later, a bounce response is sent. These asynchronous bounces are typically directed to the return path address mentioned in the email payload. Please be aware of these asynchronous bounces and handle them accordingly to maintain optimal email delivery performance.

## Opt out or unsubscribe management: Ensuring transparent sender reputation

Understanding your customers' interest in your email communication and monitoring opt-out or unsubscribe requests when recipients choose not to receive emails from you are crucial aspects of maintaining a positive sender reputation. Whether you have a manual or automated process in place for handling unsubscribes, it's important to provide an "unsubscribe" link in the email payload you send. When recipients decide not to receive further emails, they can simply click on the 'unsubscribe' link and remove their email address from your mailing list.

The functionality of the links and instructions in the email is vital; they must be working correctly and promptly notify the application mailing list to remove the contact from the appropriate list or lists. A proper unsubscribe mechanism should be explicit and transparent from the subscriber's perspective, ensuring they know precisely which messages they're unsubscribing from. Ideally, they should be offered a preferences center that gives them the option to unsubscribe in cases where they're subscribed to multiple lists within your organization. This process prevents accidental unsubscribes and allows users to manage their opt-in and opt-out preferences effectively through the unsubscribe management process.

## Next steps

* [Best practices for implementing DMARC](/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?preserve-view=true&view=o365-worldwide#best-practices-for-implementing-dmarc-in-microsoft-365)
  
* [Troubleshoot your DMARC implementation](/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?preserve-view=true&view=o365-worldwide#troubleshooting-your-dmarc-implementation) 

* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
