---
title: Email SMTP as service overview in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Email SMTP support.
author: bashan-git
manager: darmour
services: azure-communication-services
ms.author: bashan
ms.date:  12/01/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Azure Communication Services Email SMTP as Service
[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Email is still a vital channel for global businesses to connect with customers, and it's an essential part of business communications. Many businesses made large investments in on-premises infrastructures to support the strong SMTP email needs of their line-of-business (LOB) applications. However, delivering and securing outgoing emails from these existing LOB applications poses a varied challenge. As outgoing emails become more numerous and important, the difficulties of managing this critical aspect of communication become more obvious. Organizations often face problems such as email deliverability, security risks, and the need for centralized control over outgoing communications.

The Azure Communication Services Email SMTP as a Service offers a strategic solution to simplify the sending of emails, strengthen security features, and unify control over outbound communications. As a bridge between email clients and mail servers, the SMTP Relay Service improves the effectiveness of email delivery. It creates a specialized relay infrastructure that not only increases the chances of successful email delivery but also enhances authentication to secure communication. In addition, this service provides business with a centralized platform that gives the power to manage outgoing emails for all B2C Communications and gain insights into email traffic.

## Key principles of Azure Communication Services Email
Key principles of Azure Communication Services Email Service include:

- **Easy Onboarding** steps for connecting SMTP endpoint with your applications.
- **High Volume Sending** support for B2C Communications.
- **Reliable Delivery** status on emails sent from your application in near real-time.
- **Security and Compliance** to honor and respect data handling and privacy requirements that Azure promises to our customers. 

## Key features
Key features include:

- **Azure Managed Domain** - Customers can send mail from the pre-provisioned domain (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net) 
- **Custom Domain** - 	Customers can send mail from their own verified domain(notify.contoso.com).
- **Sender Authentication Support** - 	Platform Enables support for SPF(Sender Policy Framework) and DKIM(Domain Keys Identified Mail) settings for both Azure managed and Custom Domains with ARC (Authenticated Received Chain) support that preserves the Email authentication result during transitioning.
- **Email Spam Protection and Fraud Detection** - Platform performs email hygiene for all messages and offers comprehensive email protection using Microsoft Defender components by enabling the existing transport rules for detecting malware's, URL Blocking and Content Heuristic. 
- **Email Analytics** -	 Email Analytics through Azure Insights. To meet GDPR requirements we emit logs at the request level that will contain messageId and recipient information for diagnostic and auditing purposes. 
- **Engagement Tracking** - Bounce, Blocked, Open and Click Tracking.

## Next steps

* [Configuring SMTP Authentication with a Azure Communication Service resource](../../quickstarts/email/send-email-smtp/smtp-authentication.md)
  
* [Get started with send email with SMTP](../../quickstarts/email/send-email-smtp/send-email-smtp.md)

The following documents may be interesting to you:

- Familiarize yourself with [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
