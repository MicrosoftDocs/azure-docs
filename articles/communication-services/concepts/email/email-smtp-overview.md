---
title: Email SMTP support in Azure Communication Services
titleSuffix: An Azure Communication Services concept article
description: Learn about how email SMTP support in Azure Communication Services offers a strategic solution for the sending of emails.
author: bashan-git
manager: darmour
services: azure-communication-services
ms.author: bashan
ms.date:  12/01/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Email SMTP support in Azure Communication Services

Email is still a vital channel for global businesses to connect with customers. It's an essential part of business communications.

Many businesses made large investments in on-premises infrastructures to support the strong SMTP email needs of their line-of-business (LOB) applications. Delivering and securing outgoing emails from these existing LOB applications can be challenging. As outgoing emails become more numerous and important, the difficulties of managing this critical aspect of communication become more obvious. Organizations often face problems such as email deliverability, security risks, and the need for centralized control over outgoing communications.

Email SMTP support in Azure Communication Services offers a strategic solution to simplify the sending of emails, strengthen security features, and unify control over outbound communications. As a bridge between email clients and mail servers, SMTP support improves the effectiveness of email delivery. It creates a specialized relay infrastructure that not only increases the chances of successful email delivery but also enhances authentication to help secure communication. In addition, this capability provides business with a centralized platform to manage outgoing emails for all business-to-consumer (B2C) communications and gain insights into email traffic.

## Key principles

- **Easy onboarding** steps for connecting SMTP endpoints with your applications.
- **High-volume sending** support for B2C communications.
- **Reliable delivery** status on emails sent from your application in near real time.
- **Security and compliance** to honor and respect data-handling and privacy requirements that Azure promises to customers.

## Key features

- **Azure-managed domain**: Customers can send mail from the pre-provisioned domain (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net`).
- **Custom domain**: Customers can send mail from their own verified domain (`notify.contoso.com`).
- **Sender authentication support**: The platform enables support for Sender Policy Framework (SPF) and Domain Keys Identified Mail (DKIM) settings for both Azure-managed and custom domains. Authenticated Received Chain (ARC) support preserves the email authentication result during transitioning.
- **Email spam protection and fraud detection**: The platform performs email hygiene for all messages. It offers comprehensive email protection through Microsoft Defender components by enabling the existing transport rules for detecting malware: URL Blocking and Content Heuristic.
- **Email analytics**: The **Insights** dashboard provides email analytics. The service emits logs at the request level. Each log has a message ID and recipient information for diagnostic and auditing purposes.
- **Engagement tracking**: The platform supports bounce, blocked, open, and click tracking.

## Next steps

- [Configure SMTP authentication with an Azure Communication Services resource](../../quickstarts/email/send-email-smtp/smtp-authentication.md)  
- [Send email by using SMTP](../../quickstarts/email/send-email-smtp/send-email-smtp.md)

The following documents might be interesting to you:

- Familiarize yourself with [email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md).
- Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
- Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
