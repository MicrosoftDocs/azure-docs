---
title: Email as service overview in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Email concepts.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Email in Azure Communication Services

Email continues to be a key customer engagement channel globally for businesses, and businesses rely heavily on email communication for seamless business operations.

Azure Communication Services offers an intelligent communication platform to enable businesses to build engaging business-to-consumer (B2C) experiences. Email as Service in Azure Communication Services facilitates high-volume transactional, bulk, and marketing emails on the Azure Communication Services platform. It supports Application-to-Person (A2P) use cases.

Azure Communication Services Email can simplify the integration of email capabilities to your applications using production-ready email SDK options. It also supports SMTP commands. Email enables rich collaboration in communication modalities combining with SMS and other communication channels to build collaborative applications to help reach your customers in their preferred communication channel.

With Azure Communication Services Email, you can speed up your market entry with scalable and reliable email features by using your own SMTP domains. As with other communication channels, Email lets you pay only for what you use.

[!INCLUDE [Survey Request](../../includes/survey-request.md)]

## Key principles of Azure Communication Services Email

- **Easy Onboarding** steps for adding Email capability to your applications.
- **High Volume Sending** support for application-to-person (A2P) use cases.
- **Custom Domain** support to enable emails to send from email domains that are verified by your domain providers.
- **Reliable Delivery** status on emails sent from your application in near real time.
- **Email Analytics** to measure the success of delivery, with richer breakdown of engagement tracking.
- **Opt-Out** handling support to automatically detect and respect opt-outs managed in a suppression list.
- **SDKs** to add rich collaboration capabilities to your applications.
- **Security and compliance** to honor and respect data handling and privacy requirements that Azure promises to customers.

## Key features

- **Azure managed domain**: Customers can send mail from the pre-provisioned domain (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net).
- **Custom domain**: Customers can send mail from their own verified domain(notify.contoso.com).
- **Sender authentication support**: The platform enables support for Sender Policy Framework (SPF) and Domain Keys Identified Mail (DKIM) settings for both Azure managed and custom domains with Authenticated Received Chain (ARC) support that preserves the Email authentication result during transitioning.
- **Email spam protection and fraud detection**: The platform performs email hygiene for all messages and offers comprehensive email protection using Microsoft Defender components by enabling the existing transport rules for detecting malware: URL Blocking and Content Heuristic.
- **Email analytics**: Azure Insights provides email analytics. To meet GDPR requirements, we emit logs at the request level that has a message ID and recipient information for diagnostic and auditing purposes.
- **Engagement Tracking**: The platform supports bounce, blocked, open, and click tracking.

## Next steps

- [What is Email Communication Communication Service](./prepare-email-communication-resource.md)
- [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)
- [Create and manage an Email Communication Services resource in Azure Communication Services](../../quickstarts/email/create-email-communication-resource.md)
- [Connect Email Communication Services with an Azure Communication Services resource](../../quickstarts/email/connect-email-communication-resource.md)

The following topics might be interesting to you:

- Familiarize yourself with the [email client library](../email/sdk-features.md).
- Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
- Learn how to send emails with [Azure managed domains](../../quickstarts/email/add-azure-managed-domains.md)
